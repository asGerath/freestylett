create or replace function private.is_valid_time_zone(value text)
returns boolean
language sql
stable
strict
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from pg_catalog.pg_timezone_names
    where name = value
  );
$$;

create or replace function private.validate_event_venue_country()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  venue_country_id uuid;
begin
  if new.venue_id is null then
    return new;
  end if;

  select venues.country_id
  into venue_country_id
  from public.venues
  where venues.id = new.venue_id;

  if not found then
    return new;
  end if;

  if venue_country_id <> new.country_id then
    raise exception
      'Event country must match venue country'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all
on function private.is_valid_time_zone(text)
from public;

revoke all
on function private.validate_event_venue_country()
from public;

grant execute
on function private.is_valid_time_zone(text)
to authenticated, service_role;

grant execute
on function private.validate_event_venue_country()
to postgres, service_role;


create table public.events (
  id uuid primary key default gen_random_uuid(),

  organization_id uuid
    references public.organizations(id)
    on delete restrict,

  country_id uuid not null
    references public.countries(id)
    on delete restrict,

  venue_id uuid
    references public.venues(id)
    on delete restrict,

  title text not null,
  slug text not null unique,
  description text,

  event_type public.event_type not null,
  event_status public.event_status not null default 'scheduled',
  editorial_status public.editorial_status not null default 'draft',

  starts_at timestamptz not null,
  ends_at timestamptz,
  time_zone text not null,

  city text not null,
  venue_name text,

  poster_path text,

  official_url text,
  ticket_url text,
  stream_url text,
  source_url text,

  verified_at timestamptz,
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,

  constraint events_title_not_blank
    check (length(trim(title)) > 0),

  constraint events_slug_valid
    check (private.is_valid_slug(slug)),

  constraint events_description_not_blank
    check (
      description is null
      or length(trim(description)) > 0
    ),

  constraint events_dates_valid
    check (
      ends_at is null
      or ends_at > starts_at
    ),

  constraint events_time_zone_valid
    check (private.is_valid_time_zone(time_zone)),

  constraint events_city_not_blank
    check (length(trim(city)) > 0),

  constraint events_venue_name_not_blank
    check (
      venue_name is null
      or length(trim(venue_name)) > 0
    ),

  constraint events_poster_relative_path
    check (
      poster_path is null
      or poster_path !~ '^(https?:)?//'
    ),

  constraint events_official_url_valid
    check (
      official_url is null
      or official_url ~ '^https?://'
    ),

  constraint events_ticket_url_valid
    check (
      ticket_url is null
      or ticket_url ~ '^https?://'
    ),

  constraint events_stream_url_valid
    check (
      stream_url is null
      or stream_url ~ '^https?://'
    ),

  constraint events_source_url_valid
    check (
      source_url is null
      or source_url ~ '^https?://'
    ),

  constraint events_published_at_required
    check (
      editorial_status <> 'published'
      or published_at is not null
    )
);

create index events_country_idx
  on public.events (country_id);

create index events_organization_idx
  on public.events (organization_id);

create index events_venue_idx
  on public.events (venue_id);

create index events_starts_at_idx
  on public.events (starts_at);

create index events_status_schedule_idx
  on public.events (event_status, starts_at);

create index events_publication_idx
  on public.events (published_at desc)
  where editorial_status = 'published';

create trigger events_set_updated_at
before update on public.events
for each row
execute function private.set_updated_at();

create trigger events_validate_venue_country
before insert or update of country_id, venue_id
on public.events
for each row
execute function private.validate_event_venue_country();

alter table public.events enable row level security;

revoke all on table public.events from anon, authenticated;

grant select
on table public.events
to anon, authenticated;

grant insert, update, delete
on table public.events
to authenticated;

create policy "Public can read published events"
on public.events
for select
to anon, authenticated
using (
  editorial_status = 'published'
);

create policy "Editors can read all events"
on public.events
for select
to authenticated
using (
  private.is_editor()
);

create policy "Editors can insert events"
on public.events
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update events"
on public.events
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Admins can delete events"
on public.events
for delete
to authenticated
using (
  private.is_admin()
);