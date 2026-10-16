create table public.venues (
  id uuid primary key default gen_random_uuid(),

  country_id uuid not null
    references public.countries(id)
    on delete restrict,

  name text not null,
  slug text not null,
  city text not null,
  region text,
  address text,

  latitude numeric(9, 6),
  longitude numeric(9, 6),

  website_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,

  constraint venues_name_not_blank
    check (length(trim(name)) > 0),

  constraint venues_slug_valid
    check (private.is_valid_slug(slug)),

  constraint venues_city_not_blank
    check (length(trim(city)) > 0),

  constraint venues_region_not_blank
    check (
      region is null
      or length(trim(region)) > 0
    ),

  constraint venues_address_not_blank
    check (
      address is null
      or length(trim(address)) > 0
    ),

  constraint venues_latitude_valid
    check (
      latitude is null
      or latitude between -90 and 90
    ),

  constraint venues_longitude_valid
    check (
      longitude is null
      or longitude between -180 and 180
    ),

  constraint venues_coordinates_complete
    check (
      (
        latitude is null
        and longitude is null
      )
      or (
        latitude is not null
        and longitude is not null
      )
    ),

  constraint venues_website_url_valid
    check (
      website_url is null
      or website_url ~ '^https?://'
    ),

  constraint venues_country_slug_unique
    unique (country_id, slug)
);

create index venues_country_city_idx
  on public.venues (country_id, city);

create trigger venues_set_updated_at
before update on public.venues
for each row
execute function private.set_updated_at();

alter table public.venues enable row level security;

revoke all on table public.venues from anon, authenticated;

grant select
on table public.venues
to anon, authenticated;

grant insert, update, delete
on table public.venues
to authenticated;

create policy "Public can read venues"
on public.venues
for select
to anon, authenticated
using (
  true
);

create policy "Editors can insert venues"
on public.venues
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update venues"
on public.venues
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Admins can delete venues"
on public.venues
for delete
to authenticated
using (
  private.is_admin()
);