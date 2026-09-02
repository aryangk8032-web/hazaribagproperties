-- Hazaribagh Properties: marketplace data with no public access to contact data.
create table if not exists public.properties (
  id text primary key,
  owner_id uuid references auth.users(id) on delete set null,
  listing_status text not null default 'under_review',
  featured boolean not null default false,
  public_data jsonb not null,
  private_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_live_featured_created_idx
  on public.properties (featured desc, created_at desc)
  where listing_status = 'live';

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  property_id text references public.properties(id) on delete set null,
  requester_id uuid references auth.users(id) on delete set null,
  contact_data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists leads_property_created_idx on public.leads (property_id, created_at desc);

create table if not exists public.saved_properties (
  user_id uuid references auth.users(id) on delete cascade not null,
  property_id text references public.properties(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

alter table public.properties enable row level security;
alter table public.leads enable row level security;
alter table public.saved_properties enable row level security;

-- The browser reads this view, never the base table. In particular, private_data
-- (phone numbers, documents, and other seller-only information) is not exposed.
create or replace view public.published_properties
with (security_invoker = true)
as
  select id, public_data, featured, created_at
  from public.properties
  where listing_status = 'live';

revoke all on public.properties from anon, authenticated;
grant select (id, listing_status, featured, public_data, created_at) on public.properties to anon, authenticated;
grant select on public.published_properties to anon, authenticated;
grant insert, update on public.properties to authenticated;

revoke all on public.leads from anon, authenticated;
grant insert on public.leads to anon, authenticated;

revoke all on public.saved_properties from anon, authenticated;
grant select, insert, delete on public.saved_properties to authenticated;

create policy "authenticated users can create their own listings"
  on public.properties for insert to authenticated
  with check (owner_id = (select auth.uid()) and listing_status = 'under_review');

create policy "published properties are publicly readable"
  on public.properties for select to anon, authenticated
  using (listing_status = 'live' or owner_id = (select auth.uid()));

create policy "owners can update their own listings"
  on public.properties for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()) and listing_status = 'under_review');

-- Leads accept an inquiry but are never readable from a public browser client.
create policy "anyone can submit a lead"
  on public.leads for insert to anon, authenticated
  with check (true);

create policy "users can manage their saved properties"
  on public.saved_properties for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
before update on public.properties
for each row execute function public.set_updated_at();
