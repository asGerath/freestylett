-- =========================================================
-- Bucket público
-- =========================================================

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'public-media',
  'public-media',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif'
  ]::text[]
)
on conflict (id)
do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


-- =========================================================
-- Validación de rutas editoriales
-- =========================================================

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
        select 1
        from public.organizations
        where organizations.id = entity_id
      );

    when 'leagues' then
      return exists (
        select 1
        from public.leagues
        where leagues.id = entity_id
      );

    when 'events' then
      return exists (
        select 1
        from public.events
        where events.id = entity_id
      );

    when 'freestylers' then
      return exists (
        select 1
        from public.freestylers
        where freestylers.id = entity_id
      );

    when 'posts' then
      return exists (
        select 1
        from public.posts
        where posts.id = entity_id
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


-- =========================================================
-- Lectura autenticada para operaciones y upserts
-- =========================================================

create policy "Editors can select editorial media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'public-media'
  and private.is_editor()
  and private.is_valid_editorial_media_path(name)
);

create policy "Users can select their profile media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'public-media'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = (select auth.uid()::text)
);


-- =========================================================
-- Escritura de medios editoriales
-- =========================================================

create policy "Editors can insert editorial media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'public-media'
  and private.is_editor()
  and private.is_valid_editorial_media_path(name)
);

create policy "Editors can update editorial media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'public-media'
  and private.is_editor()
  and private.is_valid_editorial_media_path(name)
)
with check (
  bucket_id = 'public-media'
  and private.is_editor()
  and private.is_valid_editorial_media_path(name)
);

create policy "Editors can delete editorial media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'public-media'
  and private.is_editor()
  and private.is_valid_editorial_media_path(name)
);


-- =========================================================
-- Escritura de avatares personales
-- =========================================================

create policy "Users can insert their profile media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'public-media'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = (select auth.uid()::text)
);

create policy "Users can update their profile media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'public-media'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = (select auth.uid()::text)
)
with check (
  bucket_id = 'public-media'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = (select auth.uid()::text)
);

create policy "Users can delete their profile media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'public-media'
  and (storage.foldername(name))[1] = 'profiles'
  and (storage.foldername(name))[2] = (select auth.uid()::text)
);