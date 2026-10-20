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

  -- =========================================================
-- Categoría editorial de demostración
-- =========================================================

insert into public.post_categories (
  id,
  name,
  slug,
  description
)
values (
  '90000000-0000-0000-0000-000000000001',
  'Actualidad Demo',
  'actualidad-demo',
  'Categoría ficticia utilizada exclusivamente para desarrollo local.'
)
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description;


-- =========================================================
-- Artículo de demostración
-- =========================================================

insert into public.posts (
  id,
  category_id,
  title,
  slug,
  excerpt,
  content_markdown,
  editorial_status,
  published_at,
  seo_title,
  seo_description
)
values (
  'a0000000-0000-0000-0000-000000000001',
  '90000000-0000-0000-0000-000000000001',
  'El circuito demo inicia una nueva temporada',
  'circuito-demo-nueva-temporada',
  'Artículo ficticio para validar el listado, detalle y SEO del blog.',
  'Este es un artículo ficticio creado exclusivamente para probar el módulo editorial de FreeStyle Total durante el desarrollo local.',
  'published',
  '2026-01-06 12:00:00+00',
  'El circuito demo inicia una nueva temporada',
  'Artículo ficticio para validar la integración del blog con Supabase.'
)
on conflict (id) do update
set
  category_id = excluded.category_id,
  title = excluded.title,
  slug = excluded.slug,
  excerpt = excluded.excerpt,
  content_markdown = excluded.content_markdown,
  editorial_status = excluded.editorial_status,
  published_at = excluded.published_at,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;


  -- =========================================================
-- Participantes de temporada para rankings de demostración
-- =========================================================

insert into public.league_season_participants (
  id,
  season_id,
  freestyler_id,
  seed,
  is_active
)
values
  (
    'b1000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    '60000000-0000-0000-0000-000000000001',
    1,
    true
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000001',
    '60000000-0000-0000-0000-000000000002',
    2,
    true
  )
on conflict (id) do update
set
  season_id = excluded.season_id,
  freestyler_id = excluded.freestyler_id,
  seed = excluded.seed,
  is_active = excluded.is_active;


-- =========================================================
-- Snapshot publicado de ranking de demostración
-- =========================================================

update public.ranking_snapshots
set is_current = false
where season_id = '40000000-0000-0000-0000-000000000001'
  and id <> 'b2000000-0000-0000-0000-000000000001';

insert into public.ranking_snapshots (
  id,
  season_id,
  name,
  captured_at,
  source_url,
  is_current,
  editorial_status,
  published_at
)
values (
  'b2000000-0000-0000-0000-000000000001',
  '40000000-0000-0000-0000-000000000001',
  'Clasificación Demo — Jornada 1',
  '2026-11-16 12:00:00+00',
  'https://example.com/freestyle-total-demo-ranking',
  true,
  'published',
  '2026-11-16 12:00:00+00'
)
on conflict (id) do update
set
  season_id = excluded.season_id,
  name = excluded.name,
  captured_at = excluded.captured_at,
  source_url = excluded.source_url,
  is_current = excluded.is_current,
  editorial_status = excluded.editorial_status,
  published_at = excluded.published_at;


-- =========================================================
-- Posiciones ficticias del ranking
-- =========================================================

insert into public.ranking_entries (
  id,
  snapshot_id,
  participant_id,
  ranking_group,
  position,
  matches_played,
  battle_wins,
  battle_wins_after_replica,
  battle_losses_after_replica,
  battle_losses,
  points,
  score_total,
  penalty_points
)
values
  (
    'b3000000-0000-0000-0000-000000000001',
    'b2000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'general',
    1,
    1,
    1,
    0,
    0,
    0,
    3,
    275.50,
    0
  ),
  (
    'b3000000-0000-0000-0000-000000000002',
    'b2000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000002',
    'general',
    2,
    1,
    0,
    0,
    0,
    1,
    0,
    248.25,
    0
  )
on conflict (id) do update
set
  snapshot_id = excluded.snapshot_id,
  participant_id = excluded.participant_id,
  ranking_group = excluded.ranking_group,
  position = excluded.position,
  matches_played = excluded.matches_played,
  battle_wins = excluded.battle_wins,
  battle_wins_after_replica = excluded.battle_wins_after_replica,
  battle_losses_after_replica = excluded.battle_losses_after_replica,
  battle_losses = excluded.battle_losses,
  points = excluded.points,
  score_total = excluded.score_total,
  penalty_points = excluded.penalty_points;

  -- =========================================================
-- Batallas ficticias de desarrollo
-- =========================================================

insert into public.battles (
  id,
  event_id,
  season_id,
  title,
  slug,
  battle_order,
  stage,
  battle_format,
  battle_status,
  video_url,
  source_url,
  editorial_status,
  published_at
)
values
  (
    'c1000000-0000-0000-0000-000000000001',
    '70000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    'MC Demo Norte vs MC Demo Sur',
    'mc-demo-norte-vs-mc-demo-sur',
    1,
    'regular_round',
    'one_vs_one',
    'scheduled',
    'https://www.youtube.com/watch?v=demo-battle',
    'https://example.com/freestyle-total-demo-battle',
    'published',
    '2026-11-15 23:00:00+00'
  ),
  (
    'c1000000-0000-0000-0000-000000000002',
    '70000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    'Batalla Demo Pendiente',
    'batalla-demo-pendiente',
    2,
    'regular_round',
    'one_vs_one',
    'scheduled',
    null,
    'https://example.com/freestyle-total-demo-battle-draft',
    'draft',
    null
  )
on conflict (id) do update
set
  event_id = excluded.event_id,
  season_id = excluded.season_id,
  title = excluded.title,
  slug = excluded.slug,
  battle_order = excluded.battle_order,
  stage = excluded.stage,
  battle_format = excluded.battle_format,
  video_url = excluded.video_url,
  source_url = excluded.source_url,
  editorial_status = excluded.editorial_status,
  published_at = excluded.published_at;


-- =========================================================
-- Participantes de la batalla publicada
-- =========================================================

insert into public.battle_participants (
  id,
  battle_id,
  freestyler_id,
  side_number,
  slot_number,
  score
)
values
  (
    'c2000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    '60000000-0000-0000-0000-000000000001',
    1,
    1,
    275.50
  ),
  (
    'c2000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    '60000000-0000-0000-0000-000000000002',
    2,
    1,
    248.25
  )
on conflict (id) do update
set
  battle_id = excluded.battle_id,
  freestyler_id = excluded.freestyler_id,
  side_number = excluded.side_number,
  slot_number = excluded.slot_number,
  score = excluded.score;


-- =========================================================
-- Resultado de la batalla publicada
-- =========================================================

update public.battles
set
  battle_status = 'finished',
  decision_type = 'direct',
  winner_side = 1
where id = 'c1000000-0000-0000-0000-000000000001';


-- =========================================================
-- Creador ficticio para desarrollo
-- =========================================================

insert into public.creators (
  id,
  country_id,
  name,
  slug,
  creator_type,
  handle,
  description,
  city,
  specialties,
  is_featured,
  website_url,
  youtube_url,
  source_url,
  editorial_status,
  published_at
)
values (
  'd3000000-0000-0000-0000-000000000001',
  (
    select id
    from public.countries
    where slug = 'mexico'
    limit 1
  ),
  'Freestyle Media Demo',
  'freestyle-media-demo',
  'media',
  '@freestylemediademo',
  'Perfil completamente ficticio para validar el módulo de creadores en desarrollo local.',
  'Ciudad de México',
  array['entrevistas', 'análisis', 'noticias'],
  true,
  'https://example.com/freestyle-media-demo',
  'https://www.youtube.com/@freestyle-media-demo',
  'https://example.com/freestyle-media-demo/source',
  'published',
  now()
)
on conflict (id) do update
set
  country_id = excluded.country_id,
  name = excluded.name,
  slug = excluded.slug,
  creator_type = excluded.creator_type,
  handle = excluded.handle,
  description = excluded.description,
  city = excluded.city,
  specialties = excluded.specialties,
  is_featured = excluded.is_featured,
  website_url = excluded.website_url,
  youtube_url = excluded.youtube_url,
  source_url = excluded.source_url,
  editorial_status = excluded.editorial_status,
  published_at = excluded.published_at;
