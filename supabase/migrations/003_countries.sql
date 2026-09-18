create table public.countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  iso_code char(2) not null unique,
  flag_emoji text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  constraint countries_name_not_blank check (length(trim(name)) > 0),
  constraint countries_slug_valid check (private.is_valid_slug(slug)),
  constraint countries_iso_code_uppercase check (iso_code = upper(iso_code)),
  constraint countries_display_order_nonnegative check (display_order >= 0)
);

create index countries_active_order_idx
  on public.countries (display_order, name)
  where is_active = true;

create trigger countries_set_updated_at
before update on public.countries
for each row execute function private.set_updated_at();

alter table public.countries enable row level security;

revoke all on table public.countries from anon, authenticated;
grant select on table public.countries to anon, authenticated;

create policy "Public can read active countries"
on public.countries
for select
to anon, authenticated
using (is_active = true);
