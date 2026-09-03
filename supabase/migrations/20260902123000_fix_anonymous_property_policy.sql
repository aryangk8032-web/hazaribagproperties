drop policy if exists "permitted properties are readable" on public.properties;
create policy "public can read live listings"
  on public.properties for select to anon
  using (listing_status = 'live');
create policy "signed in users can read permitted listings"
  on public.properties for select to authenticated
  using (
    listing_status = 'live'
    or owner_id = (select auth.uid())
    or (select private.is_admin())
  );
