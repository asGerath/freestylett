begin;

select plan(31);

-- =========================================================
-- Estructura y RLS
-- =========================================================

select has_table(
  'public',
  'event_leagues',
  'La tabla public.event_leagues debe existir'
);

select has_table(
  'public',
  'event_participants',
  'La tabla public.event_participants debe existir'
);

select ok(
  (
    select relrowsecurity
    from pg_catalog.pg_class
    where oid = 'public.event_leagues'::regclass
  ),
  'event_leagues debe tener RLS habilitado'
);

select ok(
  (
    select relrowsecurity
    from pg_catalog.pg_class
    where oid = 'public.event_participants'::regclass
  ),
  'event_participants debe tener RLS habilitado'
);

-- =========================================================
-- Datos base
-- =========================================================

insert into public.leagues (
  id,
  name,
  slug,
  description,
  editorial_status,
  published_at
)
values
(
  'a1000000-0000-0000-0000-000000000001',
  'Liga publicada de prueba',
  'relations-test-league-published',
  'Liga publicada para probar relaciones.',
  'published',
  now()
),
(
  'a1000000-0000-0000-0000-000000000002',
  'Liga borrador de prueba',
  'relations-test-league-draft',
  'Liga borrador para probar relaciones.',
  'draft',
  null
),
(
  'a1000000-0000-0000-0000-000000000003',
  'Liga secundaria publicada',
  'relations-test-league-secondary',
  'Liga secundaria para probar múltiples relaciones.',
  'published',
  now()
);

insert into public.league_seasons (
  id,
  league_id,
  name,
  slug,
  year,
  editorial_status,
  published_at
)
values
(
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'Temporada publicada 2026',
  'temporada-publicada-2026',
  2026,
  'published',
  now()
),
(
  'b1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000002',
  'Temporada borrador 2026',
  'temporada-borrador-2026',
  2026,
  'draft',
  null
),
(
  'b1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000003',
  'Temporada secundaria 2026',
  'temporada-secundaria-2026',
  2026,
  'published',
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
  city,
  published_at
)
values
(
  'c1000000-0000-0000-0000-000000000001',
  (select id from public.countries where slug = 'mexico'),
  'Evento publicado de relaciones',
  'relations-test-event-published',
  'league_round',
  'scheduled',
  'published',
  '2026-11-10 18:00:00-06',
  '2026-11-10 20:00:00-06',
  'America/Mexico_City',
  'Ciudad de México',
  now()
),
(
  'c1000000-0000-0000-0000-000000000002',
  (select id from public.countries where slug = 'mexico'),
  'Evento borrador de relaciones',
  'relations-test-event-draft',
  'qualifier',
  'scheduled',
  'draft',
  '2026-11-11 18:00:00-06',
  '2026-11-11 20:00:00-06',
  'America/Mexico_City',
  'Ciudad de México',
  null
);

insert into public.freestylers (
  id,
  country_id,
  stage_name,
  slug,
  editorial_status,
  published_at
)
values
(
  'd1000000-0000-0000-0000-000000000001',
  (select id from public.countries where slug = 'mexico'),
  'Freestyler publicado de relaciones',
  'relations-test-freestyler-published',
  'published',
  now()
),
(
  'd1000000-0000-0000-0000-000000000002',
  (select id from public.countries where slug = 'mexico'),
  'Freestyler borrador de relaciones',
  'relations-test-freestyler-draft',
  'draft',
  null
);

-- =========================================================
-- Validaciones de liga y temporada
-- =========================================================

select throws_ok(
  $$
    insert into public.event_leagues (
      event_id,
      league_id,
      season_id
    )
    values (
      'c1000000-0000-0000-0000-000000000001',
      'a1000000-0000-0000-0000-000000000001',
      'b1000000-0000-0000-0000-000000000002'
    )
  $$,
  '23514',
  null,
  'La temporada debe pertenecer a la liga seleccionada'
);

select throws_ok(
  $$
    insert into public.event_leagues (
      event_id,
      league_id,
      season_id
    )
    values (
      'c1000000-0000-0000-0000-000000000001',
      'a1000000-0000-0000-0000-000000000003',
      'ffffffff-ffff-ffff-ffff-ffffffffffff'
    )
  $$,
  '23503',
  null,
  'Debe rechazar una temporada inexistente'
);

insert into public.event_leagues (
  event_id,
  league_id,
  season_id,
  is_primary
)
values
(
  'c1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  true
),
(
  'c1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000002',
  true
);

insert into public.event_participants (
  id,
  event_id,
  freestyler_id,
  display_name,
  role,
  seed,
  display_order
)
values
(
  'e1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'd1000000-0000-0000-0000-000000000001',
  'Freestyler publicado',
  'competitor',
  1,
  0
),
(
  'e1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000002',
  'd1000000-0000-0000-0000-000000000002',
  'Freestyler borrador',
  'judge',
  null,
  0
);

select throws_ok(
  $$
    insert into public.event_leagues (
      event_id,
      league_id,
      season_id,
      is_primary
    )
    values (
      'c1000000-0000-0000-0000-000000000001',
      'a1000000-0000-0000-0000-000000000003',
      'b1000000-0000-0000-0000-000000000003',
      true
    )
  $$,
  '23505',
  null,
  'Un evento solamente puede tener una liga principal'
);

select throws_ok(
  $$
    insert into public.event_leagues (
      event_id,
      league_id,
      is_primary
    )
    values (
      'c1000000-0000-0000-0000-000000000001',
      'a1000000-0000-0000-0000-000000000001',
      false
    )
  $$,
  '23505',
  null,
  'No debe repetirse la misma liga dentro de un evento'
);

-- =========================================================
-- Validaciones de participantes
-- =========================================================

select throws_ok(
  $$
    insert into public.event_participants (
      event_id,
      display_name,
      role
    )
    values (
      'c1000000-0000-0000-0000-000000000001',
      '   ',
      'guest'
    )
  $$,
  '23514',
  null,
  'El nombre mostrado del participante no puede estar vacío'
);

select throws_ok(
  $$
    insert into public.event_participants (
      event_id,
      display_name,
      role,
      seed
    )
    values (
      'c1000000-0000-0000-0000-000000000001',
      'Participante con seed inválido',
      'competitor',
      0
    )
  $$,
  '23514',
  null,
  'El seed debe ser mayor que cero'
);

select throws_ok(
  $$
    insert into public.event_participants (
      event_id,
      display_name,
      role,
      display_order
    )
    values (
      'c1000000-0000-0000-0000-000000000001',
      'Participante con orden inválido',
      'guest',
      -1
    )
  $$,
  '23514',
  null,
  'El orden de presentación no puede ser negativo'
);

select throws_ok(
  $$
    insert into public.event_participants (
      event_id,
      display_name,
      role,
      team_name
    )
    values (
      'c1000000-0000-0000-0000-000000000001',
      'Participante con equipo vacío',
      'competitor',
      '   '
    )
  $$,
  '23514',
  null,
  'El nombre del equipo no puede estar vacío'
);

select throws_ok(
  $$
    delete from public.leagues
    where id = 'a1000000-0000-0000-0000-000000000001'
  $$,
  '23503',
  null,
  'No debe eliminarse una liga relacionada con un evento'
);

select throws_ok(
  $$
    delete from public.freestylers
    where id = 'd1000000-0000-0000-0000-000000000001'
  $$,
  '23503',
  null,
  'No debe eliminarse un freestyler relacionado con un evento'
);

-- =========================================================
-- Usuario anónimo
-- =========================================================

set local role anon;

select is(
  (select count(*) from public.event_leagues),
  1::bigint,
  'El usuario anónimo solo puede ver ligas de eventos publicados'
);

select is(
  (select count(*) from public.event_participants),
  1::bigint,
  'El usuario anónimo solo puede ver participantes de eventos publicados'
);

select throws_ok(
  $$
    insert into public.event_leagues (
      event_id,
      league_id,
      season_id
    )
    values (
      'c1000000-0000-0000-0000-000000000001',
      'a1000000-0000-0000-0000-000000000003',
      'b1000000-0000-0000-0000-000000000003'
    )
  $$,
  '42501',
  null,
  'El usuario anónimo no puede relacionar eventos y ligas'
);

select throws_ok(
  $$
    insert into public.event_participants (
      event_id,
      display_name,
      role
    )
    values (
      'c1000000-0000-0000-0000-000000000001',
      'Participante anónimo',
      'guest'
    )
  $$,
  '42501',
  null,
  'El usuario anónimo no puede crear participantes'
);

reset role;

-- =========================================================
-- Usuarios autenticados
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
  'f1000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'relations-user@example.test',
  '',
  now(),
  now(),
  now()
),
(
  'f1000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'relations-editor@example.test',
  '',
  now(),
  now(),
  now()
);

insert into public.user_roles (user_id, role)
values (
  'f1000000-0000-0000-0000-000000000002',
  'editor'
);

-- =========================================================
-- Usuario autenticado sin rol editorial
-- =========================================================

set local role authenticated;

select set_config(
  'request.jwt.claim.sub',
  'f1000000-0000-0000-0000-000000000001',
  true
);

select is(
  (select count(*) from public.event_leagues),
  1::bigint,
  'Un usuario autenticado normal solo ve relaciones públicas'
);

select is(
  (select count(*) from public.event_participants),
  1::bigint,
  'Un usuario autenticado normal solo ve participantes públicos'
);

select throws_ok(
  $$
    insert into public.event_leagues (
      event_id,
      league_id,
      season_id
    )
    values (
      'c1000000-0000-0000-0000-000000000001',
      'a1000000-0000-0000-0000-000000000003',
      'b1000000-0000-0000-0000-000000000003'
    )
  $$,
  '42501',
  null,
  'Un usuario normal no puede relacionar eventos y ligas'
);

select throws_ok(
  $$
    insert into public.event_participants (
      event_id,
      display_name,
      role
    )
    values (
      'c1000000-0000-0000-0000-000000000001',
      'Participante de usuario normal',
      'guest'
    )
  $$,
  '42501',
  null,
  'Un usuario normal no puede crear participantes'
);

reset role;

-- =========================================================
-- Editor
-- =========================================================

set local role authenticated;

select set_config(
  'request.jwt.claim.sub',
  'f1000000-0000-0000-0000-000000000002',
  true
);

select ok(
  private.is_editor(),
  'El usuario de prueba debe ser editor'
);

select is(
  (select count(*) from public.event_leagues),
  2::bigint,
  'El editor puede ver relaciones públicas y borradores'
);

select is(
  (select count(*) from public.event_participants),
  2::bigint,
  'El editor puede ver todos los participantes'
);

select lives_ok(
  $$
    insert into public.event_leagues (
      event_id,
      league_id,
      season_id,
      is_primary,
      created_by
    )
    values (
      'c1000000-0000-0000-0000-000000000002',
      'a1000000-0000-0000-0000-000000000003',
      'b1000000-0000-0000-0000-000000000003',
      false,
      auth.uid()
    )
  $$,
  'El editor puede relacionar un evento con otra liga'
);

select lives_ok(
  $$
    update public.event_leagues
    set season_id = null
    where event_id = 'c1000000-0000-0000-0000-000000000002'
      and league_id = 'a1000000-0000-0000-0000-000000000003'
  $$,
  'El editor puede actualizar relaciones entre eventos y ligas'
);

select results_eq(
  $$
    delete from public.event_leagues
    where event_id = 'c1000000-0000-0000-0000-000000000002'
      and league_id = 'a1000000-0000-0000-0000-000000000003'
    returning event_id, league_id
  $$,
  $$
    values (
      'c1000000-0000-0000-0000-000000000002'::uuid,
      'a1000000-0000-0000-0000-000000000003'::uuid
    )
  $$,
  'El editor puede eliminar relaciones entre eventos y ligas'
);

select lives_ok(
  $$
    insert into public.event_participants (
      id,
      event_id,
      freestyler_id,
      display_name,
      role,
      display_order,
      created_by
    )
    values (
      'e1000000-0000-0000-0000-000000000003',
      'c1000000-0000-0000-0000-000000000002',
      'd1000000-0000-0000-0000-000000000001',
      'Participante creado por editor',
      'guest',
      5,
      auth.uid()
    )
  $$,
  'El editor puede crear participantes'
);

select lives_ok(
  $$
    update public.event_participants
    set
      role = 'host',
      team_name = 'Equipo de prueba'
    where id = 'e1000000-0000-0000-0000-000000000003'
  $$,
  'El editor puede actualizar participantes'
);

select results_eq(
  $$
    delete from public.event_participants
    where id = 'e1000000-0000-0000-0000-000000000003'
    returning id
  $$,
  $$
    values (
      'e1000000-0000-0000-0000-000000000003'::uuid
    )
  $$,
  'El editor puede eliminar participantes'
);

reset role;

select * from finish();

rollback;