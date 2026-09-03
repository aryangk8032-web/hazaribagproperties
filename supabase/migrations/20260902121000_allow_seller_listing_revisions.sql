drop policy if exists "owners can update their own listings" on public.properties;
create policy "owners can update their own listings"
  on public.properties for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (
    owner_id = (select auth.uid())
    and listing_status in ('under_review', 'changes_requested')
  );
