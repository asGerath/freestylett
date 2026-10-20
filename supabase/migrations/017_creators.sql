-- =========================================================
-- Creators
-- =========================================================

create table public.creators (
  id uuid primary key default gen_random_uuid(),

  country_id uuid
    references public.countries(id)
    on delete restrict,

  name text not null,
  slug text not null unique,
  creator_type text not null default 'person',
  handle text,
  description text,
  city text,
  image_path text,
  specialties text[] not null default '{}',
  is_featured boolean not null default false,

  website_url text,
  youtube_url text,
  instagram_url text,
  tiktok_url text,
  twitch_url text,
  x_url text,
  source_url text,

  editorial_status public.editorial_status not null default 'draft',
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,

  constraint creators_name_not_blank
    check (length(trim(name)) > 0),

  constraint creators_slug_valid
    check (private.is_valid_slug(slug)),

  constraint creators_type_valid
    check (creator_type in ('person', 'channel', 'media')),

  constraint creators_handle_not_blank
    check (handle is null or length(trim(handle)) > 0),

  constraint creators_description_not_blank
    check (description is null or length(trim(description)) > 0),

  constraint creators_city_not_blank
    check (city is null or length(trim(city)) > 0),

  constraint creators_image_relative_path
    check (image_path is null or image_path !~ '^(https?:)?//'),

  constraint creators_website_url_valid
    check (website_url is null or website_url ~ '^https?://'),

  constraint creators_youtube_url_valid
    check (youtube_url is null or youtube_url ~ '^https?://'),

  constraint creators_instagram_url_valid
    check (instagram_url is null or instagram_url ~ '^https?://'),

  constraint creators_tiktok_url_valid
    check (tiktok_url is null or tiktok_url ~ '^https?://'),

  constraint creators_twitch_url_valid
    check (twitch_url is null or twitch_url ~ '^https?://'),

  constraint creators_x_url_valid
    check (x_url is null or x_url ~ '^https?://'),

  constraint creators_source_url_valid
    check (source_url is null or source_url ~ '^https?://'),

  constraint creators_published_at_required
    check (
      editorial_status <> 'published'
      or published_at is not null
    )
);

create index creators_country_idx
  on public.creators (country_id);

create index creators_type_idx
  on public.creators (creator_type);

create index creators_publication_idx
  on public.creators (is_featured desc, published_at desc)
  where editorial_status = 'published';

create trigger creators_set_updated_at
before update on public.creators
for each row
execute function private.set_updated_at();

alter table public.creators enable row level security;

revoke all on table public.creators from anon, authenticated;

grant select on table public.creators to anon, authenticated;
grant insert, update, delete on table public.creators to authenticated;

create policy "Public can read published creators"
on public.creators
for select
to anon, authenticated
using (editorial_status = 'published');

create policy "Editors can read all creators"
on public.creators
for select
to authenticated
using (private.is_editor());

create policy "Editors can insert creators"
on public.creators
for insert
to authenticated
with check (private.is_editor());

create policy "Editors can update creators"
on public.creators
for update
to authenticated
using (private.is_editor())
with check (private.is_editor());

create policy "Admins can delete creators"
on public.creators
for delete
to authenticated
using (private.is_admin());

-- Include creator images in the protected editorial media paths.
create or replace function private.is_valid_editorial_media_path(
  object_name text
)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  folders text[];
  entity_id uuid;
begin
  folders := storage.foldername(object_name);

  if coalesce(array_length(folders, 1), 0) < 2 then
    return false;
  end if;

  if folders[2] !~* (
    '^[0-9a-f]{8}-'
    '[0-9a-f]{4}-'
    '[1-5][0-9a-f]{3}-'
    '[89ab][0-9a-f]{3}-'
    '[0-9a-f]{12}$'
  ) then
    return false;
  end if;

  entity_id := folders[2]::uuid;

  case folders[1]
    when 'organizations' then
      return exists (
        select 1 from public.organizations
        where organizations.id = entity_id
      );
    when 'leagues' then
      return exists (
        select 1 from public.leagues
        where leagues.id = entity_id
      );
    when 'events' then
      return exists (
        select 1 from public.events
        where events.id = entity_id
      );
    when 'freestylers' then
      return exists (
        select 1 from public.freestylers
        where freestylers.id = entity_id
      );
    when 'posts' then
      return exists (
        select 1 from public.posts
        where posts.id = entity_id
      );
    when 'creators' then
      return exists (
        select 1 from public.creators
        where creators.id = entity_id
      );
    else
      return false;
  end case;
end;
$$;

revoke all
on function private.is_valid_editorial_media_path(text)
from public;

grant execute
on function private.is_valid_editorial_media_path(text)
to authenticated, service_role;
