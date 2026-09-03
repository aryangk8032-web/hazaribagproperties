import type { Lead, Property } from '../types/property';
import { supabase } from '../lib/supabase';

type PropertyRow = { id: string; owner_id?: string; listing_status: Property['listingStatus']; featured: boolean; public_data: Property; created_at: string; updated_at?: string };
type LeadRow = { id: string; contact_data: Lead; status: Lead['status']; created_at: string };

const toPublicProperty = (property: Property): Property => {
  const { ownerPhone, ownerEmail, contactPhone, contactWhatsapp, privateDocuments, ...publicData } = property;
  return publicData;
};

const fromPropertyRow = (row: PropertyRow): Property => ({ ...row.public_data, id: row.id, sellerId: row.owner_id, listingStatus: row.listing_status, featured: row.featured, createdAt: row.created_at, updatedAt: row.updated_at });
const fromLeadRow = (row: LeadRow): Lead => ({ ...row.contact_data, id: row.id, status: row.status, createdAt: row.created_at });

export const fetchPublishedProperties = async (): Promise<Property[] | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('published_properties').select('id, public_data, featured, created_at').order('featured', { ascending: false }).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({ ...(row.public_data as Property), id: row.id as string, featured: Boolean(row.featured), listingStatus: 'live', createdAt: row.created_at as string }));
};

export const fetchAccessibleProperties = async (): Promise<Property[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('properties').select('id, owner_id, listing_status, featured, public_data, created_at, updated_at').order('updated_at', { ascending: false });
  if (error) throw error;
  return (data as PropertyRow[] ?? []).map(fromPropertyRow);
};

export const fetchAccessibleLeads = async (): Promise<Lead[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('leads').select('id, contact_data, status, created_at').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as LeadRow[] ?? []).map(fromLeadRow);
};

export const fetchSavedPropertyIds = async (): Promise<string[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('saved_properties').select('property_id');
  if (error) throw error;
  return (data ?? []).map((row) => row.property_id);
};

export const toggleSavedProperty = async (propertyId: string, currentlySaved: boolean): Promise<void> => {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in to save properties.');
  const request = currentlySaved ? supabase.from('saved_properties').delete().eq('user_id', user.id).eq('property_id', propertyId) : supabase.from('saved_properties').insert({ user_id: user.id, property_id: propertyId });
  const { error } = await request;
  if (error) throw error;
};

export const createLead = async (lead: Lead): Promise<{ notificationSent: boolean }> => {
  if (!supabase) return { notificationSent: false };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in before sending an inquiry.');
  const { data, error } = await supabase.from('leads').insert({ property_id: lead.propertyId, requester_id: user.id, contact_data: lead }).select('id').single();
  if (error) throw error;
  const { error: notificationError } = await supabase.functions.invoke('notify-lead', { body: { leadId: data.id } });
  if (notificationError) console.warn('Lead was saved, but email notification was not sent.', notificationError);
  return { notificationSent: !notificationError };
};

export const createProperty = async (property: Property): Promise<void> => {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in before submitting a property listing.');
  const { error } = await supabase.from('properties').insert({
    id: property.id, owner_id: user.id, listing_status: property.listingStatus, featured: property.featured,
    public_data: toPublicProperty(property),
    private_data: { ownerPhone: property.ownerPhone, ownerEmail: property.ownerEmail, contactPhone: property.contactPhone, contactWhatsapp: property.contactWhatsapp, privateDocuments: property.privateDocuments },
  });
  if (error) throw error;
};

export const persistPropertyUpdate = async (property: Property): Promise<void> => {
  if (!supabase) return;
  const { error } = await supabase.from('properties').update({ listing_status: property.listingStatus, featured: property.featured, public_data: toPublicProperty(property) }).eq('id', property.id);
  if (error) throw error;
};

export const persistLeadStatus = async (id: string, status: Lead['status']): Promise<void> => {
  if (!supabase) return;
  const { error } = await supabase.from('leads').update({ status }).eq('id', id);
  if (error) throw error;
};
