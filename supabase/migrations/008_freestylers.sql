create table public.freestylers (
  id uuid primary key default gen_random_uuid(),

  country_id uuid
    references public.countries(id)
    on delete restrict,

  stage_name text not null,
  slug text not null unique,

  real_name text,
  aka text,
  bio text,
  city text,

  photo_path text,
  birth_date date,

  instagram_url text,
  youtube_url text,
  tiktok_url text,
  twitch_url text,
  x_url text,

  editorial_status public.editorial_status not null default 'draft',
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,

  constraint freestylers_stage_name_not_blank
    check (length(trim(stage_name)) > 0),

  constraint freestylers_slug_valid
    check (private.is_valid_slug(slug)),

  constraint freestylers_real_name_not_blank
    check (
      real_name is null
      or length(trim(real_name)) > 0
    ),

  constraint freestylers_aka_not_blank
    check (
      aka is null
      or length(trim(aka)) > 0
    ),

  constraint freestylers_bio_not_blank
    check (
      bio is null
      or length(trim(bio)) > 0
    ),

  constraint freestylers_city_not_blank
    check (
      city is null
      or length(trim(city)) > 0
    ),

  constraint freestylers_photo_relative_path
    check (
      photo_path is null
      or photo_path !~ '^(https?:)?//'
    ),

  constraint freestylers_birth_date_not_future
    check (
      birth_date is null
      or birth_date <= current_date
    ),

  constraint freestylers_instagram_url_valid
    check (
      instagram_url is null
      or instagram_url ~ '^https?://'
    ),

  constraint freestylers_youtube_url_valid
    check (
      youtube_url is null
      or youtube_url ~ '^https?://'
    ),

  constraint freestylers_tiktok_url_valid
    check (
      tiktok_url is null
      or tiktok_url ~ '^https?://'
    ),

  constraint freestylers_twitch_url_valid
    check (
      twitch_url is null
      or twitch_url ~ '^https?://'
    ),

  constraint freestylers_x_url_valid
    check (
      x_url is null
      or x_url ~ '^https?://'
    ),

  constraint freestylers_published_at_required
    check (
      editorial_status <> 'published'
      or published_at is not null
    )
);

create index freestylers_country_idx
  on public.freestylers (country_id);

create index freestylers_publication_idx
  on public.freestylers (published_at desc)
  where editorial_status = 'published';

create trigger freestylers_set_updated_at
before update on public.freestylers
for each row
execute function private.set_updated_at();

alter table public.freestylers enable row level security;

revoke all on table public.freestylers from anon, authenticated;

grant select
on table public.freestylers
to anon, authenticated;

grant insert, update, delete
on table public.freestylers
to authenticated;

create policy "Public can read published freestylers"
on public.freestylers
for select
to anon, authenticated
using (
  editorial_status = 'published'
);

create policy "Editors can read all freestylers"
on public.freestylers
for select
to authenticated
using (
  private.is_editor()
);

create policy "Editors can insert freestylers"
on public.freestylers
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update freestylers"
on public.freestylers
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Admins can delete freestylers"
on public.freestylers
for delete
to authenticated
using (
  private.is_admin()
);