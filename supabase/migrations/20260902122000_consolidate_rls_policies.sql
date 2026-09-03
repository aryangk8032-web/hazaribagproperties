drop policy if exists "users can read their own profile" on public.profiles;
drop policy if exists "admins can read profiles" on public.profiles;
create policy "users and admins can read profiles"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));

drop policy if exists "published properties are publicly readable" on public.properties;
drop policy if exists "owners can read their listings" on public.properties;
drop policy if exists "admins can read all listings" on public.properties;
create policy "permitted properties are readable"
  on public.properties for select to anon, authenticated
  using (
    listing_status = 'live'
    or owner_id = (select auth.uid())
    or (select private.is_admin())
  );

drop policy if exists "owners can update their own listings" on public.properties;
drop policy if exists "admins can manage listings" on public.properties;
create policy "owners and admins can update listings"
  on public.properties for update to authenticated
  using (owner_id = (select auth.uid()) or (select private.is_admin()))
  with check (
    (select private.is_admin())
    or (owner_id = (select auth.uid()) and listing_status in ('under_review', 'changes_requested'))
  );

drop policy if exists "buyers can read their own leads" on public.leads;
drop policy if exists "sellers can read leads for their listings" on public.leads;
drop policy if exists "admins can read all leads" on public.leads;
create policy "permitted users can read leads"
  on public.leads for select to authenticated
  using (
    requester_id = (select auth.uid())
    or (select private.is_admin())
    or exists (select 1 from public.properties where properties.id = leads.property_id and properties.owner_id = (select auth.uid()))
  );

drop policy if exists "sellers can update leads for their listings" on public.leads;
drop policy if exists "admins can update all leads" on public.leads;
create policy "sellers and admins can update leads"
  on public.leads for update to authenticated
  using (
    (select private.is_admin())
    or exists (select 1 from public.properties where properties.id = leads.property_id and properties.owner_id = (select auth.uid()))
  )
  with check (
    (select private.is_admin())
    or exists (select 1 from public.properties where properties.id = leads.property_id and properties.owner_id = (select auth.uid()))
  );
