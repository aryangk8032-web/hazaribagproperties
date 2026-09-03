import { createClient } from 'npm:@supabase/supabase-js@2';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] || character));

Deno.serve(async (request) => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const authorization = request.headers.get('Authorization');
  if (!authorization) return json({ error: 'Authentication required' }, 401);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !anonKey || !serviceKey) return json({ error: 'Supabase function configuration is incomplete' }, 500);

  const callerClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: { user }, error: userError } = await callerClient.auth.getUser();
  if (userError || !user) return json({ error: 'Invalid session' }, 401);

  const { leadId } = await request.json().catch(() => ({}));
  if (typeof leadId !== 'string') return json({ error: 'A lead ID is required' }, 400);

  const adminClient = createClient(supabaseUrl, serviceKey);
  const { data: lead, error: leadError } = await adminClient.from('leads').select('id, requester_id, property_id, contact_data, created_at').eq('id', leadId).single();
  if (leadError || !lead) return json({ error: 'Lead not found' }, 404);
  if (lead.requester_id !== user.id) return json({ error: 'You cannot notify for this lead' }, 403);

  const resendKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('RESEND_FROM_EMAIL');
  const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL');
  if (!resendKey || !from || !adminEmail) return json({ error: 'Email delivery is not configured yet' }, 503);

  const details = lead.contact_data as Record<string, string | undefined>;
  const { data: property } = await adminClient.from('properties').select('public_data').eq('id', lead.property_id).single();
  const listing = (property?.public_data ?? {}) as Record<string, string | number | undefined>;
  const customerEmail = details.buyerEmail || details.userEmail;
  const propertyTitle = String(listing.title || details.propertyTitle || 'Property inquiry');
  const leadType = String(details.leadType || details.inquiryType || 'inquiry').replace(/_/g, ' ');
  const buyerName = details.buyerName || details.userName || 'Buyer';
  const buyerPhone = details.buyerPhone || details.userPhone || 'Not provided';

  const send = async (to: string, subject: string, html: string) => {
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to: [to], subject, html }) });
    if (!response.ok) throw new Error(`Resend returned ${response.status}`);
  };

  const adminHtml = `<h2>New ${escapeHtml(leadType)} received</h2><p><strong>Property:</strong> ${escapeHtml(propertyTitle)}</p><p><strong>Buyer:</strong> ${escapeHtml(buyerName)}<br/><strong>Phone:</strong> ${escapeHtml(buyerPhone)}<br/><strong>Email:</strong> ${escapeHtml(customerEmail || 'Not provided')}</p><p><strong>Message:</strong> ${escapeHtml(details.message || 'No message')}</p>`;
  const jobs = [send(adminEmail, `New lead: ${propertyTitle}`, adminHtml)];
  if (customerEmail) jobs.push(send(customerEmail, `We received your inquiry for ${propertyTitle}`, `<h2>Thank you, ${escapeHtml(buyerName)}</h2><p>We received your ${escapeHtml(leadType)} for <strong>${escapeHtml(propertyTitle)}</strong>. The Hazaribagh Properties team will contact you shortly.</p>`));
  await Promise.all(jobs);
  return json({ ok: true, customerConfirmationSent: Boolean(customerEmail) });
});
