create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.is_valid_slug(value text)
returns boolean
language sql
immutable
strict
set search_path = ''
as $$
  select value ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$';
$$;

revoke all on function private.set_updated_at() from public;
revoke all on function private.is_valid_slug(text) from public;
grant execute on function private.set_updated_at() to postgres, service_role;
grant execute on function private.is_valid_slug(text) to authenticated, service_role;
