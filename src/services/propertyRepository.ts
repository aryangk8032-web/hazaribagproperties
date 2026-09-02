import type { Lead, Property } from '../types/property';
import { supabase } from '../lib/supabase';

type PropertyRow = {
  id: string;
  public_data: Property;
};

const toPublicProperty = (property: Property): Property => {
  const { ownerPhone, ownerEmail, contactPhone, contactWhatsapp, privateDocuments, ...publicData } = property;
  return publicData;
};

export const fetchPublishedProperties = async (): Promise<Property[] | null> => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('published_properties')
    .select('id, public_data')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as PropertyRow[]).map((row) => ({ ...row.public_data, id: row.id }));
};

export const createLead = async (lead: Lead): Promise<void> => {
  if (!supabase) return;

  const { error } = await supabase.from('leads').insert({
    property_id: lead.propertyId,
    contact_data: lead,
  });

  if (error) throw error;
};

export const createProperty = async (property: Property): Promise<void> => {
  if (!supabase) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Please sign in before submitting a property listing.');
  }

  const { error } = await supabase.from('properties').insert({
    id: property.id,
    owner_id: user.id,
    listing_status: property.listingStatus,
    featured: property.featured,
    public_data: toPublicProperty(property),
    private_data: {
      ownerPhone: property.ownerPhone,
      ownerEmail: property.ownerEmail,
      contactPhone: property.contactPhone,
      contactWhatsapp: property.contactWhatsapp,
      privateDocuments: property.privateDocuments,
    },
  });

  if (error) throw error;
};
