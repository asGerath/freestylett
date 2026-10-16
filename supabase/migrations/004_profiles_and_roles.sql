create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_not_blank check (length(trim(display_name)) > 0),
  constraint profiles_avatar_relative_path check (
    avatar_path is null or avatar_path !~ '^(https?:)?//'
  )
);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create index user_roles_role_idx on public.user_roles (role);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create or replace function private.has_role(requested_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = requested_role
  );
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.has_role('admin'::public.app_role);
$$;

create or replace function private.is_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    private.has_role('admin'::public.app_role)
    or private.has_role('editor'::public.app_role);
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      split_part(coalesce(new.email, 'usuario'), '@', 1)
    )
  );
  return new;
end;
$$;

revoke all on function private.has_role(public.app_role) from public;
revoke all on function private.is_admin() from public;
revoke all on function private.is_editor() from public;
revoke all on function private.handle_new_user() from public;
grant execute on function private.has_role(public.app_role) to authenticated, service_role;
grant execute on function private.is_admin() to authenticated, service_role;
grant execute on function private.is_editor() to authenticated, service_role;
grant execute on function private.handle_new_user() to postgres, service_role;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.user_roles from anon, authenticated;
grant select on table public.profiles to anon, authenticated;
grant update on table public.profiles to authenticated;
grant select on table public.user_roles to authenticated;
grant insert, update, delete on table public.user_roles to authenticated;

create policy "Public can read profiles"
on public.profiles
for select
to anon, authenticated
using (true);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id or private.is_admin())
with check ((select auth.uid()) = id or private.is_admin());

create policy "Users can read their roles"
on public.user_roles
for select
to authenticated
using ((select auth.uid()) = user_id or private.is_admin());

create policy "Admins can insert roles"
on public.user_roles
for insert
to authenticated
with check (private.is_admin());

create policy "Admins can update roles"
on public.user_roles
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "Admins can delete roles"
on public.user_roles
for delete
to authenticated
using (private.is_admin());

grant insert, update, delete on table public.countries to authenticated;

create policy "Admins can insert countries"
on public.countries
for insert
to authenticated
with check (private.is_admin());

create policy "Admins can read inactive countries"
on public.countries
for select
to authenticated
using (private.is_admin());

create policy "Admins can update countries"
on public.countries
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "Admins can delete countries"
on public.countries
for delete
to authenticated
using (private.is_admin());
