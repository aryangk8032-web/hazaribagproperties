create index if not exists properties_owner_id_idx on public.properties (owner_id);
create index if not exists leads_requester_id_idx on public.leads (requester_id);
create index if not exists saved_properties_property_id_idx on public.saved_properties (property_id);
