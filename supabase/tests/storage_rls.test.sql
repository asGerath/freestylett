begin;

select plan(34);

-- =========================================================
-- Configuración del bucket y RLS
-- =========================================================

select is(
  (
    select count(*)
    from storage.buckets
    where id = 'public-media'
  ),
  1::bigint,
  'El bucket public-media debe existir'
);

select is(
  (
    select public
    from storage.buckets
    where id = 'public-media'
  ),
  true,
  'public-media debe ser un bucket público'
);

select is(
  (
    select file_size_limit
    from storage.buckets
    where id = 'public-media'
  ),
  5242880::bigint,
  'public-media debe limitar archivos a 5 MB'
);

select is(
  (
    select allowed_mime_types
    from storage.buckets
    where id = 'public-media'
  ),
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif'
  ]::text[],
  'public-media debe permitir únicamente los formatos aprobados'
);

select ok(
  (
    select relrowsecurity
    from pg_catalog.pg_class
    where oid = 'storage.objects'::regclass
  ),
  'storage.objects debe tener RLS habilitado'
);

-- =========================================================
-- Usuarios de prueba
-- =========================================================

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
values
(
  '94000000-0000-4000-8000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'storage-user@example.test',
  '',
  now(),
  now(),
  now()
),
(
  '94000000-0000-4000-8000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'storage-other-user@example.test',
  '',
  now(),
  now(),
  now()
),
(
  '94000000-0000-4000-8000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'storage-editor@example.test',
  '',
  now(),
  now(),
  now()
);

insert into public.user_roles (user_id, role)
values (
  '94000000-0000-4000-8000-000000000003',
  'editor'
);

-- =========================================================
-- Entidades para validar carpetas editoriales
-- =========================================================

insert into public.organizations (
  id,
  name,
  slug,
  editorial_status
)
values (
  'a2000000-0000-4000-8000-000000000001',
  'Organización de Storage',
  'storage-test-organization',
  'draft'
);

insert into public.leagues (
  id,
  organization_id,
  name,
  slug,
  description,
  editorial_status
)
values (
  'a2000000-0000-4000-8000-000000000002',
  'a2000000-0000-4000-8000-000000000001',
  'Liga de Storage',
  'storage-test-league',
  'Liga para probar rutas de Storage.',
  'draft'
);

insert into public.events (
  id,
  organization_id,
  country_id,
  title,
  slug,
  event_type,
  starts_at,
  time_zone,
  city,
  editorial_status
)
values (
  'a2000000-0000-4000-8000-000000000003',
  'a2000000-0000-4000-8000-000000000001',
  (select id from public.countries where slug = 'mexico'),
  'Evento de Storage',
  'storage-test-event',
  'exhibition',
  '2026-11-20 18:00:00-06',
  'America/Mexico_City',
  'Ciudad de México',
  'draft'
);

insert into public.freestylers (
  id,
  country_id,
  stage_name,
  slug,
  editorial_status
)
values (
  'a2000000-0000-4000-8000-000000000004',
  (select id from public.countries where slug = 'mexico'),
  'Freestyler de Storage',
  'storage-test-freestyler',
  'draft'
);

insert into public.posts (
  id,
  title,
  slug,
  excerpt,
  editorial_status
)
values (
  'a2000000-0000-4000-8000-000000000005',
  'Post de Storage',
  'storage-test-post',
  'Post para probar rutas de Storage.',
  'draft'
);

-- =========================================================
-- Validación de rutas
-- =========================================================

select ok(
  private.is_valid_editorial_media_path(
    'organizations/a2000000-0000-4000-8000-000000000001/logo.webp'
  ),
  'Debe aceptar una ruta de organización existente'
);

select ok(
  private.is_valid_editorial_media_path(
    'leagues/a2000000-0000-4000-8000-000000000002/logo.webp'
  ),
  'Debe aceptar una ruta de liga existente'
);

select ok(
  private.is_valid_editorial_media_path(
    'events/a2000000-0000-4000-8000-000000000003/poster.webp'
  ),
  'Debe aceptar una ruta de evento existente'
);

select ok(
  private.is_valid_editorial_media_path(
    'freestylers/a2000000-0000-4000-8000-000000000004/profile.webp'
  ),
  'Debe aceptar una ruta de freestyler existente'
);

select ok(
  private.is_valid_editorial_media_path(
    'posts/a2000000-0000-4000-8000-000000000005/cover.webp'
  ),
  'Debe aceptar una ruta de post existente'
);

select isnt(
  private.is_valid_editorial_media_path(
    'other/a2000000-0000-4000-8000-000000000001/file.webp'
  ),
  true,
  'Debe rechazar una carpeta raíz no permitida'
);

select isnt(
  private.is_valid_editorial_media_path(
    'events/no-es-uuid/poster.webp'
  ),
  true,
  'Debe rechazar una carpeta sin UUID válido'
);

select isnt(
  private.is_valid_editorial_media_path(
    'events/a2000000-0000-4000-8000-999999999999/poster.webp'
  ),
  true,
  'Debe rechazar una entidad inexistente'
);

-- =========================================================
-- Usuario anónimo
-- =========================================================

set local role anon;

select is(
  (select count(*) from storage.objects),
  0::bigint,
  'El usuario anónimo no puede enumerar storage.objects'
);

select throws_ok(
  $$
    insert into storage.objects (
      bucket_id,
      name
    )
    values (
      'public-media',
      'profiles/94000000-0000-4000-8000-000000000001/avatar.webp'
    )
  $$,
  '42501',
  null,
  'El usuario anónimo no puede subir archivos'
);

reset role;

-- =========================================================
-- Usuario autenticado normal
-- =========================================================

set local role authenticated;

select set_config(
  'request.jwt.claim.sub',
  '94000000-0000-4000-8000-000000000001',
  true
);

select lives_ok(
  $$
    insert into storage.objects (
      bucket_id,
      name
    )
    values (
      'public-media',
      'profiles/94000000-0000-4000-8000-000000000001/avatar.webp'
    )
  $$,
  'El usuario puede subir archivos a su carpeta de perfil'
);

select is(
  (
    select count(*)
    from storage.objects
    where name = (
      'profiles/'
      '94000000-0000-4000-8000-000000000001/'
      'avatar.webp'
    )
  ),
  1::bigint,
  'El usuario puede consultar su propio archivo'
);

select throws_ok(
  $$
    insert into storage.objects (
      bucket_id,
      name
    )
    values (
      'public-media',
      'profiles/94000000-0000-4000-8000-000000000002/avatar.webp'
    )
  $$,
  '42501',
  null,
  'El usuario no puede subir archivos a la carpeta de otro usuario'
);

select throws_ok(
  $$
    insert into storage.objects (
      bucket_id,
      name
    )
    values (
      'public-media',
      'events/a2000000-0000-4000-8000-000000000003/poster.webp'
    )
  $$,
  '42501',
  null,
  'Un usuario normal no puede subir medios editoriales'
);

select lives_ok(
  $$
    update storage.objects
    set name = (
      'profiles/'
      '94000000-0000-4000-8000-000000000001/'
      'avatar-updated.webp'
    )
    where bucket_id = 'public-media'
      and name = (
        'profiles/'
        '94000000-0000-4000-8000-000000000001/'
        'avatar.webp'
      )
  $$,
  'El usuario puede actualizar archivos dentro de su carpeta'
);

select throws_ok(
  $$
    update storage.objects
    set name = (
      'profiles/'
      '94000000-0000-4000-8000-000000000002/'
      'avatar.webp'
    )
    where bucket_id = 'public-media'
      and name = (
        'profiles/'
        '94000000-0000-4000-8000-000000000001/'
        'avatar-updated.webp'
      )
  $$,
  '42501',
  null,
  'El usuario no puede mover un archivo a la carpeta de otro usuario'
);


select results_eq(
  $$
    select count(*)::bigint
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and cmd = 'DELETE'
      and policyname ilike '%profile%'
  $$,
  $$ values (1::bigint) $$,
  'Existe una política DELETE para los archivos del perfil'
);


reset role;

-- =========================================================
-- Editor
-- =========================================================

set local role authenticated;

select set_config(
  'request.jwt.claim.sub',
  '94000000-0000-4000-8000-000000000003',
  true
);

select ok(
  private.is_editor(),
  'El usuario de prueba debe ser editor'
);

select lives_ok(
  $$
    insert into storage.objects (bucket_id, name)
    values (
      'public-media',
      'organizations/a2000000-0000-4000-8000-000000000001/logo.webp'
    )
  $$,
  'El editor puede subir medios de organizaciones'
);

select lives_ok(
  $$
    insert into storage.objects (bucket_id, name)
    values (
      'public-media',
      'leagues/a2000000-0000-4000-8000-000000000002/logo.webp'
    )
  $$,
  'El editor puede subir medios de ligas'
);

select lives_ok(
  $$
    insert into storage.objects (bucket_id, name)
    values (
      'public-media',
      'events/a2000000-0000-4000-8000-000000000003/poster.webp'
    )
  $$,
  'El editor puede subir medios de eventos'
);

select lives_ok(
  $$
    insert into storage.objects (bucket_id, name)
    values (
      'public-media',
      'freestylers/a2000000-0000-4000-8000-000000000004/profile.webp'
    )
  $$,
  'El editor puede subir medios de freestylers'
);

select lives_ok(
  $$
    insert into storage.objects (bucket_id, name)
    values (
      'public-media',
      'posts/a2000000-0000-4000-8000-000000000005/cover.webp'
    )
  $$,
  'El editor puede subir medios de posts'
);

select is(
  (select count(*) from storage.objects),
  5::bigint,
  'El editor puede consultar todos los medios editoriales válidos'
);

select lives_ok(
  $$
    update storage.objects
    set name = (
      'events/'
      'a2000000-0000-4000-8000-000000000003/'
      'poster-updated.webp'
    )
    where bucket_id = 'public-media'
      and name = (
        'events/'
        'a2000000-0000-4000-8000-000000000003/'
        'poster.webp'
      )
  $$,
  'El editor puede actualizar medios editoriales'
);

select throws_ok(
  $$
    insert into storage.objects (
      bucket_id,
      name
    )
    values (
      'public-media',
      'events/a2000000-0000-4000-8000-999999999999/poster.webp'
    )
  $$,
  '42501',
  null,
  'El editor no puede subir medios para una entidad inexistente'
);

select throws_ok(
  $$
    insert into storage.objects (
      bucket_id,
      name
    )
    values (
      'public-media',
      'profiles/94000000-0000-4000-8000-000000000001/avatar.webp'
    )
  $$,
  '42501',
  null,
  'El editor no puede modificar la carpeta personal de otro usuario'
);

select results_eq(
  $$
    select count(*)::bigint
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and cmd = 'DELETE'
  $$,
  $$ values (2::bigint) $$,
  'Existen políticas DELETE para perfiles y medios editoriales'
);

select results_eq(
  $$
    select count(*)::bigint
    from storage.objects
    where bucket_id = 'public-media'
      and (
        name like 'organizations/%'
        or name like 'leagues/%'
        or name like 'events/%'
        or name like 'freestylers/%'
        or name like 'posts/%'
      )
  $$,
  $$ values (5::bigint) $$,
  'Los medios editoriales permanecen hasta eliminarse mediante Storage API'
);

reset role;

select * from finish();

rollback;