-- =========================================================
-- Datos ficticios exclusivos para desarrollo local
-- No deben utilizarse como información real o histórica
-- =========================================================

-- =========================================================
-- Organización de demostración
-- =========================================================
insert into public.organizations (
  id,
  country_id,
  name,
  slug,
  description,
  editorial_status,
  published_at
)
values (
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'FreeStyle Total Demo',
  'freestyle-total-demo',
  'Organización ficticia utilizada para el desarrollo local de FreeStyle Total.',
  'published',
  '2026-01-01 12:00:00+00'
)
on conflict (id) do update
set
  country_id = excluded.country_id,
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  editorial_status = excluded.editorial_status,
  published_at = excluded.published_at;


-- =========================================================
-- Liga de demostración
-- =========================================================

insert into public.leagues (
  id,
  organization_id,
  name,
  slug,
  short_name,
  description,
  editorial_status,
  published_at
)
values (
  '30000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  'Liga Demo Nacional',
  'liga-demo-nacional',
  'LDN',
  'Liga ficticia para validar listados, filtros y relaciones de eventos.',
  'published',
  '2026-01-02 12:00:00+00'
)
on conflict (id) do update
set
  organization_id = excluded.organization_id,
  name = excluded.name,
  slug = excluded.slug,
  short_name = excluded.short_name,
  description = excluded.description,
  editorial_status = excluded.editorial_status,
  published_at = excluded.published_at;


-- =========================================================
-- País principal de la liga
-- =========================================================

insert into public.league_countries (
  league_id,
  country_id,
  is_primary
)
values (
  '30000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  true
)
on conflict (league_id, country_id) do update
set
  is_primary = excluded.is_primary;


-- =========================================================
-- Temporada de demostración
-- =========================================================

insert into public.league_seasons (
  id,
  league_id,
  name,
  slug,
  year,
  starts_on,
  ends_on,
  editorial_status,
  published_at
)
values (
  '40000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000001',
  'Temporada Demo 2026',
  'temporada-demo-2026',
  2026,
  '2026-01-01',
  '2026-12-31',
  'published',
  '2026-01-03 12:00:00+00'
)
on conflict (id) do update
set
  league_id = excluded.league_id,
  name = excluded.name,
  slug = excluded.slug,
  year = excluded.year,
  starts_on = excluded.starts_on,
  ends_on = excluded.ends_on,
  editorial_status = excluded.editorial_status,
  published_at = excluded.published_at;


-- =========================================================
-- Venue de demostración
-- =========================================================

insert into public.venues (
  id,
  country_id,
  name,
  slug,
  city,
  region,
  address,
  latitude,
  longitude
)
values (
  '50000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'Foro Demo CDMX',
  'foro-demo-cdmx',
  'Ciudad de México',
  'Ciudad de México',
  'Dirección ficticia para desarrollo local',
  19.432608,
  -99.133209
)
on conflict (id) do update
set
  country_id = excluded.country_id,
  name = excluded.name,
  slug = excluded.slug,
  city = excluded.city,
  region = excluded.region,
  address = excluded.address,
  latitude = excluded.latitude,
  longitude = excluded.longitude;


-- =========================================================
-- Freestylers ficticios
-- =========================================================

insert into public.freestylers (
  id,
  country_id,
  stage_name,
  slug,
  bio,
  city,
  editorial_status,
  published_at
)
values
  (
    '60000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'MC Demo Norte',
    'mc-demo-norte',
    'Perfil ficticio utilizado exclusivamente para desarrollo local.',
    'Monterrey',
    'published',
    '2026-01-04 12:00:00+00'
  ),
  (
    '60000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'MC Demo Sur',
    'mc-demo-sur',
    'Perfil ficticio utilizado exclusivamente para desarrollo local.',
    'Ciudad de México',
    'published',
    '2026-01-04 12:00:00+00'
  )
on conflict (id) do update
set
  country_id = excluded.country_id,
  stage_name = excluded.stage_name,
  slug = excluded.slug,
  bio = excluded.bio,
  city = excluded.city,
  editorial_status = excluded.editorial_status,
  published_at = excluded.published_at;


-- =========================================================
-- Eventos de demostración
-- =========================================================

insert into public.events (
  id,
  organization_id,
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
  venue_name,
  published_at
)
values
  (
    '70000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000001',
    'Jornada Demo CDMX 2026',
    'jornada-demo-cdmx-2026',
    'Evento ficticio publicado para probar listados, detalles y filtros.',
    'league_round',
    'scheduled',
    'published',
    '2026-11-15 18:00:00-06',
    '2026-11-15 22:00:00-06',
    'America/Mexico_City',
    'Ciudad de México',
    'Foro Demo CDMX',
    '2026-01-05 12:00:00+00'
  ),
  (
    '70000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    null,
    'Exhibición Demo Guadalajara 2026',
    'exhibicion-demo-guadalajara-2026',
    'Evento ficticio en borrador para comprobar las restricciones RLS.',
    'exhibition',
    'scheduled',
    'draft',
    '2026-12-06 17:00:00-06',
    '2026-12-06 20:00:00-06',
    'America/Mexico_City',
    'Guadalajara',
    'Venue pendiente de confirmar',
    null
  )
on conflict (id) do update
set
  organization_id = excluded.organization_id,
  country_id = excluded.country_id,
  venue_id = excluded.venue_id,
  title = excluded.title,
  slug = excluded.slug,
  description = excluded.description,
  event_type = excluded.event_type,
  event_status = excluded.event_status,
  editorial_status = excluded.editorial_status,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  time_zone = excluded.time_zone,
  city = excluded.city,
  venue_name = excluded.venue_name,
  published_at = excluded.published_at;


-- =========================================================
-- Relación entre evento, liga y temporada
-- =========================================================

insert into public.event_leagues (
  event_id,
  league_id,
  season_id,
  is_primary
)
values (
  '70000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000001',
  '40000000-0000-0000-0000-000000000001',
  true
)
on conflict (event_id, league_id) do update
set
  season_id = excluded.season_id,
  is_primary = excluded.is_primary;


-- =========================================================
-- Participantes del evento publicado
-- =========================================================

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
    '80000000-0000-0000-0000-000000000001',
    '70000000-0000-0000-0000-000000000001',
    '60000000-0000-0000-0000-000000000001',
    'MC Demo Norte',
    'competitor',
    1,
    10
  ),
  (
    '80000000-0000-0000-0000-000000000002',
    '70000000-0000-0000-0000-000000000001',
    '60000000-0000-0000-0000-000000000002',
    'MC Demo Sur',
    'competitor',
    2,
    20
  ),
  (
    '80000000-0000-0000-0000-000000000003',
    '70000000-0000-0000-0000-000000000001',
    null,
    'Host Demo',
    'host',
    null,
    30
  )
on conflict (id) do update
set
  event_id = excluded.event_id,
  freestyler_id = excluded.freestyler_id,
  display_name = excluded.display_name,
  role = excluded.role,
  seed = excluded.seed,
  display_order = excluded.display_order;
  