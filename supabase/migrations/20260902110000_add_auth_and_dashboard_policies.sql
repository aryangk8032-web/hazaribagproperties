create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'buyer' check (role in ('buyer', 'seller', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function private.is_admin() from public;
revoke all on function private.handle_new_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure private.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone, updated_at) on public.profiles to authenticated;

create policy "users can read their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "admins can read profiles"
  on public.profiles for select to authenticated
  using ((select private.is_admin()));

create policy "users can edit their own profile details"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "owners can read their listings" on public.properties;
create policy "owners can read their listings"
  on public.properties for select to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists "admins can read all listings" on public.properties;
create policy "admins can read all listings"
  on public.properties for select to authenticated
  using ((select private.is_admin()));

drop policy if exists "admins can manage listings" on public.properties;
create policy "admins can manage listings"
  on public.properties for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

drop policy if exists "anyone can submit a lead" on public.leads;
alter table public.leads add column if not exists status text not null default 'new';
alter table public.leads add column if not exists updated_at timestamptz not null default now();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

revoke all on public.leads from anon, authenticated;
grant insert (property_id, requester_id, contact_data) on public.leads to authenticated;
grant select on public.leads to authenticated;
grant update (status, updated_at) on public.leads to authenticated;

create policy "buyers can submit their own lead"
  on public.leads for insert to authenticated
  with check (requester_id = (select auth.uid()));

create policy "buyers can read their own leads"
  on public.leads for select to authenticated
  using (requester_id = (select auth.uid()));

create policy "sellers can read leads for their listings"
  on public.leads for select to authenticated
  using (exists (
    select 1 from public.properties
    where properties.id = leads.property_id
      and properties.owner_id = (select auth.uid())
  ));

create policy "admins can read all leads"
  on public.leads for select to authenticated
  using ((select private.is_admin()));

create policy "sellers can update leads for their listings"
  on public.leads for update to authenticated
  using (exists (
    select 1 from public.properties
    where properties.id = leads.property_id
      and properties.owner_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.properties
    where properties.id = leads.property_id
      and properties.owner_id = (select auth.uid())
  ));

create policy "admins can update all leads"
  on public.leads for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create index if not exists leads_requester_id_idx on public.leads (requester_id);
