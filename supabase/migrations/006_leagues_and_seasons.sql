create table public.leagues (
  id uuid primary key default gen_random_uuid(),

  organization_id uuid
    references public.organizations(id)
    on delete restrict,

  name text not null,
  slug text not null unique,
  short_name text,
  description text not null,
  logo_path text,

  website_url text,
  instagram_url text,
  youtube_url text,

  editorial_status public.editorial_status not null default 'draft',
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,

  constraint leagues_name_not_blank
    check (length(trim(name)) > 0),

  constraint leagues_slug_valid
    check (private.is_valid_slug(slug)),

  constraint leagues_short_name_not_blank
    check (
      short_name is null
      or length(trim(short_name)) > 0
    ),

  constraint leagues_description_not_blank
    check (length(trim(description)) > 0),

  constraint leagues_logo_relative_path
    check (
      logo_path is null
      or logo_path !~ '^(https?:)?//'
    ),

  constraint leagues_website_url_valid
    check (
      website_url is null
      or website_url ~ '^https?://'
    ),

  constraint leagues_instagram_url_valid
    check (
      instagram_url is null
      or instagram_url ~ '^https?://'
    ),

  constraint leagues_youtube_url_valid
    check (
      youtube_url is null
      or youtube_url ~ '^https?://'
    ),

  constraint leagues_published_at_required
    check (
      editorial_status <> 'published'
      or published_at is not null
    )
);

create index leagues_organization_idx
  on public.leagues (organization_id);

create index leagues_publication_idx
  on public.leagues (published_at desc)
  where editorial_status = 'published';

create trigger leagues_set_updated_at
before update on public.leagues
for each row
execute function private.set_updated_at();


create table public.league_countries (
  league_id uuid not null
    references public.leagues(id)
    on delete cascade,

  country_id uuid not null
    references public.countries(id)
    on delete restrict,

  is_primary boolean not null default false,
  created_at timestamptz not null default now(),

  primary key (league_id, country_id)
);

create unique index league_countries_one_primary_idx
  on public.league_countries (league_id)
  where is_primary = true;

create index league_countries_country_idx
  on public.league_countries (country_id);


create table public.league_seasons (
  id uuid primary key default gen_random_uuid(),

  league_id uuid not null
    references public.leagues(id)
    on delete restrict,

  name text not null,
  slug text not null,
  year smallint,

  starts_on date,
  ends_on date,

  editorial_status public.editorial_status not null default 'draft',
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,

  constraint league_seasons_name_not_blank
    check (length(trim(name)) > 0),

  constraint league_seasons_slug_valid
    check (private.is_valid_slug(slug)),

  constraint league_seasons_dates_valid
    check (
      ends_on is null
      or starts_on is null
      or ends_on >= starts_on
    ),

  constraint league_seasons_published_at_required
    check (
      editorial_status <> 'published'
      or published_at is not null
    ),

  constraint league_seasons_league_slug_unique
    unique (league_id, slug)
);

create index league_seasons_league_idx
  on public.league_seasons (league_id);

create index league_seasons_publication_idx
  on public.league_seasons (published_at desc)
  where editorial_status = 'published';

create trigger league_seasons_set_updated_at
before update on public.league_seasons
for each row
execute function private.set_updated_at();


alter table public.leagues enable row level security;
alter table public.league_countries enable row level security;
alter table public.league_seasons enable row level security;

revoke all on table public.leagues from anon, authenticated;
revoke all on table public.league_countries from anon, authenticated;
revoke all on table public.league_seasons from anon, authenticated;

grant select
on table public.leagues
to anon, authenticated;

grant select
on table public.league_countries
to anon, authenticated;

grant select
on table public.league_seasons
to anon, authenticated;

grant insert, update, delete
on table public.leagues
to authenticated;

grant insert, update, delete
on table public.league_countries
to authenticated;

grant insert, update, delete
on table public.league_seasons
to authenticated;


create policy "Public can read published leagues"
on public.leagues
for select
to anon, authenticated
using (
  editorial_status = 'published'
);

create policy "Editors can read all leagues"
on public.leagues
for select
to authenticated
using (
  private.is_editor()
);

create policy "Editors can insert leagues"
on public.leagues
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update leagues"
on public.leagues
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Admins can delete leagues"
on public.leagues
for delete
to authenticated
using (
  private.is_admin()
);


create policy "Public can read countries of published leagues"
on public.league_countries
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.leagues
    where leagues.id = league_countries.league_id
      and leagues.editorial_status = 'published'
  )
);

create policy "Editors can read all league countries"
on public.league_countries
for select
to authenticated
using (
  private.is_editor()
);

create policy "Editors can insert league countries"
on public.league_countries
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update league countries"
on public.league_countries
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Editors can delete league countries"
on public.league_countries
for delete
to authenticated
using (
  private.is_editor()
);


create policy "Public can read published league seasons"
on public.league_seasons
for select
to anon, authenticated
using (
  editorial_status = 'published'
  and exists (
    select 1
    from public.leagues
    where leagues.id = league_seasons.league_id
      and leagues.editorial_status = 'published'
  )
);

create policy "Editors can read all league seasons"
on public.league_seasons
for select
to authenticated
using (
  private.is_editor()
);

create policy "Editors can insert league seasons"
on public.league_seasons
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update league seasons"
on public.league_seasons
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Admins can delete league seasons"
on public.league_seasons
for delete
to authenticated
using (
  private.is_admin()
);