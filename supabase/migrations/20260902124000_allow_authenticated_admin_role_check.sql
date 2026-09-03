-- RLS policies use this helper to determine whether the current user is an
-- administrator. Authenticated users need explicit access to evaluate it;
-- the private schema is not exposed through the public REST API.
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;
