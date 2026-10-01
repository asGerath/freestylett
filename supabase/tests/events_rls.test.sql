begin;

select plan(23);

-- =========================================================
-- Estructura y funciones auxiliares
-- =========================================================

select has_table(
  'public',
  'events',
  'La tabla public.events debe existir'
);

select ok(
  (
    select relrowsecurity
    from pg_catalog.pg_class
    where oid = 'public.events'::regclass
  ),
  'events debe tener RLS habilitado'
);

select ok(
  private.is_valid_time_zone('America/Mexico_City'),
  'America/Mexico_City debe ser una zona horaria válida'
);

-- =========================================================
-- Validaciones de integridad
-- =========================================================

select throws_ok(
  $$
    insert into public.events (
      country_id,
      title,
      slug,
      event_type,
      starts_at,
      time_zone,
      city
    )
    values (
      (select id from public.countries where slug = 'mexico'),
      'Evento con zona inválida',
      'evento-zona-invalida',
      'exhibition',
      '2026-11-01 18:00:00-06',
      'Zona/Inexistente',
      'Ciudad de México'
    )
  $$,
  '23514',
  null,
  'Debe rechazar una zona horaria inexistente'
);

select throws_ok(
  $$
    insert into public.events (
      country_id,
      title,
      slug,
      event_type,
      starts_at,
      ends_at,
      time_zone,
      city
    )
    values (
      (select id from public.countries where slug = 'mexico'),
      'Evento con fecha invertida',
      'evento-fecha-invertida',
      'exhibition',
      '2026-11-01 20:00:00-06',
      '2026-11-01 18:00:00-06',
      'America/Mexico_City',
      'Ciudad de México'
    )
  $$,
  '23514',
  null,
  'Debe rechazar ends_at anterior a starts_at'
);

select throws_ok(
  $$
    insert into public.events (
      country_id,
      title,
      slug,
      event_type,
      starts_at,
      ends_at,
      time_zone,
      city
    )
    values (
      (select id from public.countries where slug = 'mexico'),
      'Evento sin duración',
      'evento-sin-duracion',
      'exhibition',
      '2026-11-01 18:00:00-06',
      '2026-11-01 18:00:00-06',
      'America/Mexico_City',
      'Ciudad de México'
    )
  $$,
  '23514',
  null,
  'Debe rechazar ends_at igual a starts_at'
);

select throws_ok(
  $$
    insert into public.events (
      country_id,
      title,
      slug,
      event_type,
      starts_at,
      time_zone,
      city,
      poster_path
    )
    values (
      (select id from public.countries where slug = 'mexico'),
      'Evento con poster absoluto',
      'evento-poster-absoluto',
      'exhibition',
      '2026-11-01 18:00:00-06',
      'America/Mexico_City',
      'Ciudad de México',
      'https://example.com/poster.jpg'
    )
  $$,
  '23514',
  null,
  'poster_path debe ser una ruta relativa'
);

select throws_ok(
  $$
    insert into public.events (
      country_id,
      title,
      slug,
      event_type,
      starts_at,
      time_zone,
      city,
      official_url
    )
    values (
      (select id from public.countries where slug = 'mexico'),
      'Evento con URL inválida',
      'evento-url-invalida',
      'exhibition',
      '2026-11-01 18:00:00-06',
      'America/Mexico_City',
      'Ciudad de México',
      'sitio-sin-protocolo.com'
    )
  $$,
  '23514',
  null,
  'official_url debe utilizar HTTP o HTTPS'
);

select throws_ok(
  $$
    insert into public.events (
      country_id,
      title,
      slug,
      event_type,
      editorial_status,
      starts_at,
      time_zone,
      city
    )
    values (
      (select id from public.countries where slug = 'mexico'),
      'Evento publicado sin fecha',
      'evento-publicado-sin-fecha',
      'exhibition',
      'published',
      '2026-11-01 18:00:00-06',
      'America/Mexico_City',
      'Ciudad de México'
    )
  $$,
  '23514',
  null,
  'Un evento publicado debe tener published_at'
);

-- =========================================================
-- Datos para comprobar relaciones
-- =========================================================

insert into public.venues (
  id,
  country_id,
  name,
  slug,
  city
)
values
(
  '90000000-0000-0000-0000-000000000001',
  (select id from public.countries where slug = 'mexico'),
  'Venue de prueba México',
  'events-test-venue-mx',
  'Ciudad de México'
),
(
  '90000000-0000-0000-0000-000000000002',
  (select id from public.countries where slug = 'espana'),
  'Venue de prueba España',
  'events-test-venue-es',
  'Madrid'
);


select throws_ok(
  $$
    insert into public.events (
      country_id,
      venue_id,
      title,
      slug,
      event_type,
      starts_at,
      time_zone,
      city
    )
    values (
      (select id from public.countries where slug = 'mexico'),
      '90000000-0000-0000-0000-000000000002',
      'Evento con venue de otro país',
      'evento-venue-otro-pais',
      'exhibition',
      '2026-11-01 18:00:00-06',
      'America/Mexico_City',
      'Ciudad de México'
    )
  $$,
  '23514',
  null,
  'El país del evento debe coincidir con el país del venue'
);

insert into public.events (
  id,
  country_id,
  venue_id,
  title,
  slug,
  description,
  event_type,
  event_status,
  editorial_status,
  starts_at,
  ends_at,
  time_zone,
  city,
  poster_path,
  official_url,
  ticket_url,
  published_at
)
values (
  '91000000-0000-0000-0000-000000000001',
  (select id from public.countries where slug = 'mexico'),
  '90000000-0000-0000-0000-000000000001',
  'Evento publicado',
  'evento-publicado',
  'Evento visible públicamente',
  'league_round',
  'scheduled',
  'published',
  '2026-11-01 18:00:00-06',
  '2026-11-01 20:00:00-06',
  'America/Mexico_City',
  'Ciudad de México',
  'events/evento-publicado/poster.jpg',
  'https://example.com/evento',
  'https://example.com/evento/boletos',
  now()
);

insert into public.events (
  id,
  country_id,
  title,
  slug,
  event_type,
  event_status,
  editorial_status,
  starts_at,
  ends_at,
  time_zone,
  city
)
values (
  '91000000-0000-0000-0000-000000000002',
  (select id from public.countries where slug = 'espana'),
  'Evento borrador',
  'evento-borrador',
  'qualifier',
  'scheduled',
  'draft',
  '2026-12-01 18:00:00+01',
  '2026-12-01 20:00:00+01',
  'Europe/Madrid',
  'Madrid'
);

select throws_ok(
  $$
    delete from public.venues
    where id = '90000000-0000-0000-0000-000000000001'
  $$,
  '23503',
  null,
  'No debe eliminarse un venue utilizado por un evento'
);

-- =========================================================
-- Usuario anónimo
-- =========================================================

set local role anon;

select is(
  (select count(*) from public.events),
  1::bigint,
  'El usuario anónimo solo puede consultar eventos publicados'
);

select throws_ok(
  $$
    insert into public.events (
      country_id,
      title,
      slug,
      event_type,
      starts_at,
      time_zone,
      city
    )
    values (
      (select id from public.countries where slug = 'mexico'),
      'Evento anónimo',
      'evento-anonimo',
      'exhibition',
      '2026-11-02 18:00:00-06',
      'America/Mexico_City',
      'Ciudad de México'
    )
  $$,
  '42501',
  null,
  'El usuario anónimo no puede crear eventos'
);

reset role;

-- =========================================================
-- Usuarios autenticados y roles internos
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
  '92000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'events-user@example.test',
  '',
  now(),
  now(),
  now()
),
(
  '92000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'events-editor@example.test',
  '',
  now(),
  now(),
  now()
),
(
  '92000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'events-admin@example.test',
  '',
  now(),
  now(),
  now()
);

insert into public.user_roles (user_id, role)
values
  ('92000000-0000-0000-0000-000000000002', 'editor'),
  ('92000000-0000-0000-0000-000000000003', 'admin');

-- =========================================================
-- Usuario autenticado sin rol editorial
-- =========================================================

set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '92000000-0000-0000-0000-000000000001',
  true
);

select is(
  (select count(*) from public.events),
  1::bigint,
  'Un usuario autenticado normal solo puede ver eventos publicados'
);

select throws_ok(
  $$
    insert into public.events (
      country_id,
      title,
      slug,
      event_type,
      starts_at,
      time_zone,
      city
    )
    values (
      (select id from public.countries where slug = 'mexico'),
      'Evento de usuario',
      'evento-de-usuario',
      'exhibition',
      '2026-11-02 18:00:00-06',
      'America/Mexico_City',
      'Ciudad de México'
    )
  $$,
  '42501',
  null,
  'Un usuario autenticado sin rol editorial no puede crear eventos'
);

reset role;

-- =========================================================
-- Editor
-- =========================================================

set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '92000000-0000-0000-0000-000000000002',
  true
);

select ok(
  private.is_editor(),
  'El usuario de prueba debe ser editor'
);

select is(
  (select count(*) from public.events),
  2::bigint,
  'El editor puede consultar eventos publicados y borradores'
);

select lives_ok(
  $$
    insert into public.events (
      id,
      country_id,
      title,
      slug,
      event_type,
      event_status,
      editorial_status,
      starts_at,
      ends_at,
      time_zone,
      city,
      created_by,
      updated_by
    )
    values (
      '91000000-0000-0000-0000-000000000003',
      (select id from public.countries where slug = 'mexico'),
      'Evento creado por editor',
      'evento-creado-por-editor',
      'exhibition',
      'scheduled',
      'draft',
      '2026-11-02 18:00:00-06',
      '2026-11-02 20:00:00-06',
      'America/Mexico_City',
      'Monterrey',
      auth.uid(),
      auth.uid()
    )
  $$,
  'El editor puede crear eventos'
);

select lives_ok(
  $$
    update public.events
    set
      editorial_status = 'published',
      published_at = now(),
      venue_id = '90000000-0000-0000-0000-000000000001',
      updated_by = auth.uid()
    where id = '91000000-0000-0000-0000-000000000003'
  $$,
  'El editor puede publicar y actualizar eventos'
);

select throws_ok(
  $$
    update public.events
    set venue_id = '90000000-0000-0000-0000-000000000002'
    where id = '91000000-0000-0000-0000-000000000003'
  $$,
  '23514',
  null,
  'El editor tampoco puede asignar un venue de otro país'
);

select is_empty(
  $$
    delete from public.events
    where id = '91000000-0000-0000-0000-000000000003'
    returning id
  $$,
  'El editor no puede eliminar eventos'
);

reset role;

-- =========================================================
-- Administrador
-- =========================================================

set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '92000000-0000-0000-0000-000000000003',
  true
);

select ok(
  private.is_admin(),
  'El usuario de prueba debe ser administrador'
);

select results_eq(
  $$
    delete from public.events
    where id = '91000000-0000-0000-0000-000000000003'
    returning id
  $$,
  $$
    values (
      '91000000-0000-0000-0000-000000000003'::uuid
    )
  $$,
  'El administrador puede eliminar eventos'
);

select * from finish();

rollback;