-- Importación idempotente: FMS Colombia 2026/27.
-- Fuentes y decisiones: docs/research/FMS_COLOMBIA_2026_27.md
-- Ejecutar después de las migraciones 001-018.
-- La transacción se revierte completa si falla cualquier validación final.

begin;

-- =========================================================
-- Países adicionales requeridos por el roster internacional
-- =========================================================

insert into public.countries (
  id,
  name,
  slug,
  iso_code,
  flag_emoji,
  display_order
)
values
  (
    '10000000-0000-0000-0000-000000000007',
    'República Dominicana',
    'republica-dominicana',
    'DO',
    '🇩🇴',
    70
  ),
  (
    '10000000-0000-0000-0000-000000000008',
    'Cuba',
    'cuba',
    'CU',
    '🇨🇺',
    80
  )
on conflict (iso_code) do update
set
  name = excluded.name,
  slug = excluded.slug,
  flag_emoji = excluded.flag_emoji,
  display_order = excluded.display_order,
  is_active = true;

-- =========================================================
-- Organización, liga y temporada
-- =========================================================

insert into public.organizations (
  id,
  country_id,
  name,
  slug,
  description,
  website_url,
  editorial_status,
  published_at
)
select
  'c0100000-0000-0000-0000-000000000001',
  countries.id,
  'Urban Roosters',
  'urban-roosters',
  'Organización internacional responsable del circuito Freestyle Master Series.',
  'https://www.urbanroosters.com/',
  'published',
  '2026-10-21 12:00:00+00'
from public.countries
where countries.slug = 'espana'
on conflict (slug) do update
set
  country_id = excluded.country_id,
  name = excluded.name,
  description = excluded.description,
  website_url = excluded.website_url,
  editorial_status = excluded.editorial_status,
  published_at = coalesce(public.organizations.published_at, excluded.published_at),
  updated_at = now();

insert into public.leagues (
  id,
  organization_id,
  name,
  slug,
  short_name,
  description,
  website_url,
  instagram_url,
  editorial_status,
  published_at
)
select
  'c0200000-0000-0000-0000-000000000001',
  organizations.id,
  'FMS Colombia',
  'fms-colombia',
  'FMS Colombia',
  'Liga profesional de freestyle organizada por Urban Roosters en Colombia. Reúne competidores nacionales e internacionales en una temporada de jornadas puntuables.',
  'https://fms.tv/',
  'https://www.instagram.com/fmscolombia/',
  'published',
  '2026-10-21 12:00:00+00'
from public.organizations
where organizations.slug = 'urban-roosters'
on conflict (slug) do update
set
  organization_id = excluded.organization_id,
  name = excluded.name,
  short_name = excluded.short_name,
  description = excluded.description,
  website_url = excluded.website_url,
  instagram_url = excluded.instagram_url,
  editorial_status = excluded.editorial_status,
  published_at = coalesce(public.leagues.published_at, excluded.published_at),
  updated_at = now();

insert into public.league_countries (
  league_id,
  country_id,
  is_primary
)
select
  leagues.id,
  countries.id,
  true
from public.leagues
join public.countries on countries.slug = 'colombia'
where leagues.slug = 'fms-colombia'
on conflict (league_id, country_id) do update
set is_primary = excluded.is_primary;

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
select
  'c0300000-0000-0000-0000-000000000001',
  leagues.id,
  'FMS Colombia 2026/27',
  '2026-27',
  2026,
  '2026-10-11',
  null,
  'published',
  '2026-10-21 12:00:00+00'
from public.leagues
where leagues.slug = 'fms-colombia'
on conflict (league_id, slug) do update
set
  name = excluded.name,
  year = excluded.year,
  starts_on = excluded.starts_on,
  ends_on = excluded.ends_on,
  editorial_status = excluded.editorial_status,
  published_at = coalesce(public.league_seasons.published_at, excluded.published_at),
  updated_at = now();

-- =========================================================
-- Venues
-- =========================================================

insert into public.venues (
  id,
  country_id,
  name,
  slug,
  city,
  region,
  address
)
select
  venue_data.id::uuid,
  countries.id,
  venue_data.name,
  venue_data.slug,
  venue_data.city,
  venue_data.region,
  venue_data.address
from (
  values
    (
      'c0400000-0000-0000-0000-000000000001',
      'Teatro Jorge Eliécer Gaitán',
      'teatro-jorge-eliecer-gaitan',
      'Bogotá',
      'Bogotá D.C.',
      'Carrera 7 #22-47, Bogotá'
    ),
    (
      'c0400000-0000-0000-0000-000000000002',
      'Teatro Calima',
      'teatro-calima',
      'Cali',
      'Valle del Cauca',
      null
    )
) as venue_data(id, name, slug, city, region, address)
join public.countries on countries.slug = 'colombia'
on conflict (country_id, slug) do update
set
  name = excluded.name,
  city = excluded.city,
  region = excluded.region,
  address = excluded.address,
  updated_at = now();

-- =========================================================
-- Freestylers: solo identidad y país confirmados
-- =========================================================

insert into public.freestylers (
  id,
  country_id,
  stage_name,
  slug,
  editorial_status,
  published_at
)
select
  roster.id::uuid,
  countries.id,
  roster.stage_name,
  roster.slug,
  'published',
  '2026-10-21 12:00:00+00'
from (
  values
    ('c1000000-0000-0000-0000-000000000001', 'Aczino', 'aczino', 'mexico'),
    ('c1000000-0000-0000-0000-000000000002', 'Valles-T', 'valles-t', 'colombia'),
    ('c1000000-0000-0000-0000-000000000003', 'Éxodo Lirical', 'exodo-lirical', 'republica-dominicana'),
    ('c1000000-0000-0000-0000-000000000004', 'Reverse', 'reverse', 'cuba'),
    ('c1000000-0000-0000-0000-000000000005', 'Fat N', 'fat-n', 'colombia'),
    ('c1000000-0000-0000-0000-000000000006', 'Pandora', 'pandora', 'colombia'),
    ('c1000000-0000-0000-0000-000000000007', 'Filósofo', 'filosofo', 'colombia'),
    ('c1000000-0000-0000-0000-000000000008', 'Dima', 'dima', 'colombia'),
    ('c1000000-0000-0000-0000-000000000009', 'Puppy', 'puppy', 'colombia'),
    ('c1000000-0000-0000-0000-00000000000a', 'Visionario', 'visionario', 'colombia'),
    ('c1000000-0000-0000-0000-00000000000b', 'Urko', 'urko', 'colombia'),
    ('c1000000-0000-0000-0000-00000000000c', 'Vilardy', 'vilardy', 'colombia')
) as roster(id, stage_name, slug, country_slug)
join public.countries on countries.slug = roster.country_slug
on conflict (slug) do update
set
  country_id = excluded.country_id,
  stage_name = excluded.stage_name,
  editorial_status = excluded.editorial_status,
  published_at = coalesce(public.freestylers.published_at, excluded.published_at),
  updated_at = now();

insert into public.league_season_participants (
  id,
  season_id,
  freestyler_id,
  seed,
  is_active
)
select
  roster.id::uuid,
  league_seasons.id,
  freestylers.id,
  null,
  roster.is_active
from (
  values
    ('c2000000-0000-0000-0000-000000000001', 'aczino', true),
    ('c2000000-0000-0000-0000-000000000002', 'valles-t', true),
    ('c2000000-0000-0000-0000-000000000003', 'exodo-lirical', true),
    ('c2000000-0000-0000-0000-000000000004', 'reverse', true),
    ('c2000000-0000-0000-0000-000000000005', 'fat-n', true),
    ('c2000000-0000-0000-0000-000000000006', 'pandora', true),
    ('c2000000-0000-0000-0000-000000000007', 'filosofo', true),
    ('c2000000-0000-0000-0000-000000000008', 'dima', true),
    ('c2000000-0000-0000-0000-000000000009', 'puppy', true),
    ('c2000000-0000-0000-0000-00000000000a', 'visionario', true),
    ('c2000000-0000-0000-0000-00000000000b', 'urko', false),
    ('c2000000-0000-0000-0000-00000000000c', 'vilardy', false)
) as roster(id, freestyler_slug, is_active)
join public.league_seasons
  on league_seasons.slug = '2026-27'
join public.leagues
  on leagues.id = league_seasons.league_id
  and leagues.slug = 'fms-colombia'
join public.freestylers
  on freestylers.slug = roster.freestyler_slug
on conflict (season_id, freestyler_id) do update
set
  seed = excluded.seed,
  is_active = excluded.is_active,
  updated_at = now();

-- =========================================================
-- Eventos
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
  time_zone,
  city,
  venue_name,
  official_url,
  source_url,
  verified_at,
  published_at
)
select
  event_data.id::uuid,
  organizations.id,
  countries.id,
  venues.id,
  event_data.title,
  event_data.slug,
  event_data.description,
  'league_round',
  event_data.event_status::public.event_status,
  'published',
  event_data.starts_at::timestamptz,
  'America/Bogota',
  event_data.city,
  venues.name,
  event_data.official_url,
  event_data.source_url,
  '2026-10-21 12:00:00+00',
  '2026-10-21 12:00:00+00'
from (
  values
    (
      'c3000000-0000-0000-0000-000000000001',
      'FMS Colombia 2026/27 — Jornada 1',
      'fms-colombia-2026-27-jornada-1-bogota',
      'Primera jornada de la quinta temporada de FMS Colombia, disputada en Bogotá con once batallas.',
      'finished',
      '2026-10-11 17:30:00-05',
      'Bogotá',
      'teatro-jorge-eliecer-gaitan',
      'https://fms.tv/',
      'https://urbanroosters.news/arranco-la-5-a-temporada-de-fms-colombia-con-una-jornada-apasionante-y-un-nuevo-formato/'
    ),
    (
      'c3000000-0000-0000-0000-000000000002',
      'FMS Colombia 2026/27 — Jornada 2',
      'fms-colombia-2026-27-jornada-2-cali',
      'Segunda jornada programada de FMS Colombia 2026/27. Los enfrentamientos todavía no han sido publicados oficialmente.',
      'scheduled',
      '2026-11-14 18:00:00-05',
      'Cali',
      'teatro-calima',
      'https://fms.tv/calendario/',
      'https://fms.tv/calendario/'
    )
) as event_data(
  id,
  title,
  slug,
  description,
  event_status,
  starts_at,
  city,
  venue_slug,
  official_url,
  source_url
)
join public.organizations on organizations.slug = 'urban-roosters'
join public.countries on countries.slug = 'colombia'
join public.venues
  on venues.slug = event_data.venue_slug
  and venues.country_id = countries.id
on conflict (slug) do update
set
  organization_id = excluded.organization_id,
  country_id = excluded.country_id,
  venue_id = excluded.venue_id,
  title = excluded.title,
  description = excluded.description,
  event_type = excluded.event_type,
  event_status = excluded.event_status,
  editorial_status = excluded.editorial_status,
  starts_at = excluded.starts_at,
  time_zone = excluded.time_zone,
  city = excluded.city,
  venue_name = excluded.venue_name,
  official_url = excluded.official_url,
  source_url = excluded.source_url,
  verified_at = excluded.verified_at,
  published_at = coalesce(public.events.published_at, excluded.published_at),
  updated_at = now();

insert into public.event_leagues (
  event_id,
  league_id,
  season_id,
  is_primary
)
select
  events.id,
  leagues.id,
  league_seasons.id,
  true
from public.events
join public.leagues on leagues.slug = 'fms-colombia'
join public.league_seasons
  on league_seasons.league_id = leagues.id
  and league_seasons.slug = '2026-27'
where events.slug in (
  'fms-colombia-2026-27-jornada-1-bogota',
  'fms-colombia-2026-27-jornada-2-cali'
)
on conflict (event_id, league_id) do update
set
  season_id = excluded.season_id,
  is_primary = excluded.is_primary;

-- Jornada 1 incluye roster definitivo y aspirantes de Vida o Muerte.
insert into public.event_participants (
  id,
  event_id,
  freestyler_id,
  display_name,
  role,
  seed,
  display_order
)
select
  participant_data.id::uuid,
  events.id,
  freestylers.id,
  freestylers.stage_name,
  'competitor',
  null,
  participant_data.display_order
from (
  values
    ('c4000000-0000-0000-0000-000000000001', 'aczino', 1),
    ('c4000000-0000-0000-0000-000000000002', 'valles-t', 2),
    ('c4000000-0000-0000-0000-000000000003', 'exodo-lirical', 3),
    ('c4000000-0000-0000-0000-000000000004', 'reverse', 4),
    ('c4000000-0000-0000-0000-000000000005', 'fat-n', 5),
    ('c4000000-0000-0000-0000-000000000006', 'pandora', 6),
    ('c4000000-0000-0000-0000-000000000007', 'filosofo', 7),
    ('c4000000-0000-0000-0000-000000000008', 'dima', 8),
    ('c4000000-0000-0000-0000-000000000009', 'puppy', 9),
    ('c4000000-0000-0000-0000-00000000000a', 'visionario', 10),
    ('c4000000-0000-0000-0000-00000000000b', 'urko', 11),
    ('c4000000-0000-0000-0000-00000000000c', 'vilardy', 12)
) as participant_data(id, freestyler_slug, display_order)
join public.events
  on events.slug = 'fms-colombia-2026-27-jornada-1-bogota'
join public.freestylers
  on freestylers.slug = participant_data.freestyler_slug
on conflict (id) do update
set
  event_id = excluded.event_id,
  freestyler_id = excluded.freestyler_id,
  display_name = excluded.display_name,
  role = excluded.role,
  seed = excluded.seed,
  display_order = excluded.display_order;

-- =========================================================
-- Jornada 1: batallas y resultados oficiales
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
  winner_side,
  decision_type,
  source_url,
  editorial_status,
  published_at
)
select
  battle_data.id::uuid,
  events.id,
  league_seasons.id,
  battle_data.title,
  battle_data.slug,
  battle_data.battle_order,
  battle_data.stage::public.battle_stage,
  'one_vs_one',
  'finished',
  battle_data.winner_side,
  'direct',
  'https://urbanroosters.news/asi-fueron-las-votaciones-de-fms-colombia-jornada-1-temporada-5-2026-27/',
  'published',
  '2026-10-21 12:00:00+00'
from (
  values
    ('c5000000-0000-0000-0000-000000000001', 'Urko vs Visionario', 'fms-colombia-2026-27-j1-urko-vs-visionario', 1, 'play_in', 2),
    ('c5000000-0000-0000-0000-000000000002', 'Puppy vs Vilardy', 'fms-colombia-2026-27-j1-puppy-vs-vilardy', 2, 'play_in', 1),
    ('c5000000-0000-0000-0000-000000000003', 'Reverse vs Pandora', 'fms-colombia-2026-27-j1-reverse-vs-pandora', 3, 'regular_round', 1),
    ('c5000000-0000-0000-0000-000000000004', 'Aczino vs Dima', 'fms-colombia-2026-27-j1-aczino-vs-dima', 4, 'regular_round', 1),
    ('c5000000-0000-0000-0000-000000000005', 'Éxodo Lirical vs Fat N', 'fms-colombia-2026-27-j1-exodo-lirical-vs-fat-n', 5, 'regular_round', 1),
    ('c5000000-0000-0000-0000-000000000006', 'Puppy vs Reverse', 'fms-colombia-2026-27-j1-puppy-vs-reverse', 6, 'regular_round', 1),
    ('c5000000-0000-0000-0000-000000000007', 'Filósofo vs Pandora', 'fms-colombia-2026-27-j1-filosofo-vs-pandora', 7, 'regular_round', 1),
    ('c5000000-0000-0000-0000-000000000008', 'Visionario vs Valles-T', 'fms-colombia-2026-27-j1-visionario-vs-valles-t', 8, 'regular_round', 2),
    ('c5000000-0000-0000-0000-000000000009', 'Dima vs Fat N', 'fms-colombia-2026-27-j1-dima-vs-fat-n', 9, 'regular_round', 1),
    ('c5000000-0000-0000-0000-00000000000a', 'Aczino vs Filósofo', 'fms-colombia-2026-27-j1-aczino-vs-filosofo', 10, 'regular_round', 1),
    ('c5000000-0000-0000-0000-00000000000b', 'Valles-T vs Éxodo Lirical', 'fms-colombia-2026-27-j1-valles-t-vs-exodo-lirical', 11, 'regular_round', 1)
) as battle_data(id, title, slug, battle_order, stage, winner_side)
join public.events
  on events.slug = 'fms-colombia-2026-27-jornada-1-bogota'
join public.leagues
  on leagues.slug = 'fms-colombia'
join public.league_seasons
  on league_seasons.league_id = leagues.id
  and league_seasons.slug = '2026-27'
on conflict (slug) do update
set
  event_id = excluded.event_id,
  season_id = excluded.season_id,
  title = excluded.title,
  battle_order = excluded.battle_order,
  stage = excluded.stage,
  battle_format = excluded.battle_format,
  battle_status = excluded.battle_status,
  winner_side = excluded.winner_side,
  decision_type = excluded.decision_type,
  source_url = excluded.source_url,
  editorial_status = excluded.editorial_status,
  published_at = coalesce(public.battles.published_at, excluded.published_at),
  updated_at = now();

insert into public.battle_participants (
  id,
  battle_id,
  freestyler_id,
  side_number,
  slot_number,
  score
)
select
  result_data.id::uuid,
  battles.id,
  freestylers.id,
  result_data.side_number,
  1,
  result_data.score
from (
  values
    ('c6000000-0000-0000-0000-000000000001', 'fms-colombia-2026-27-j1-urko-vs-visionario', 'urko', 1, 143.00),
    ('c6000000-0000-0000-0000-000000000002', 'fms-colombia-2026-27-j1-urko-vs-visionario', 'visionario', 2, 139.00),
    ('c6000000-0000-0000-0000-000000000003', 'fms-colombia-2026-27-j1-puppy-vs-vilardy', 'puppy', 1, 160.00),
    ('c6000000-0000-0000-0000-000000000004', 'fms-colombia-2026-27-j1-puppy-vs-vilardy', 'vilardy', 2, 130.00),
    ('c6000000-0000-0000-0000-000000000005', 'fms-colombia-2026-27-j1-reverse-vs-pandora', 'reverse', 1, 137.00),
    ('c6000000-0000-0000-0000-000000000006', 'fms-colombia-2026-27-j1-reverse-vs-pandora', 'pandora', 2, 134.00),
    ('c6000000-0000-0000-0000-000000000007', 'fms-colombia-2026-27-j1-aczino-vs-dima', 'aczino', 1, 160.00),
    ('c6000000-0000-0000-0000-000000000008', 'fms-colombia-2026-27-j1-aczino-vs-dima', 'dima', 2, 136.00),
    ('c6000000-0000-0000-0000-000000000009', 'fms-colombia-2026-27-j1-exodo-lirical-vs-fat-n', 'exodo-lirical', 1, 148.00),
    ('c6000000-0000-0000-0000-00000000000a', 'fms-colombia-2026-27-j1-exodo-lirical-vs-fat-n', 'fat-n', 2, 142.00),
    ('c6000000-0000-0000-0000-00000000000b', 'fms-colombia-2026-27-j1-puppy-vs-reverse', 'puppy', 1, 157.00),
    ('c6000000-0000-0000-0000-00000000000c', 'fms-colombia-2026-27-j1-puppy-vs-reverse', 'reverse', 2, 153.00),
    ('c6000000-0000-0000-0000-00000000000d', 'fms-colombia-2026-27-j1-filosofo-vs-pandora', 'filosofo', 1, 151.00),
    ('c6000000-0000-0000-0000-00000000000e', 'fms-colombia-2026-27-j1-filosofo-vs-pandora', 'pandora', 2, 143.00),
    ('c6000000-0000-0000-0000-00000000000f', 'fms-colombia-2026-27-j1-visionario-vs-valles-t', 'visionario', 1, 134.00),
    ('c6000000-0000-0000-0000-000000000010', 'fms-colombia-2026-27-j1-visionario-vs-valles-t', 'valles-t', 2, 157.00),
    ('c6000000-0000-0000-0000-000000000011', 'fms-colombia-2026-27-j1-dima-vs-fat-n', 'dima', 1, 144.00),
    ('c6000000-0000-0000-0000-000000000012', 'fms-colombia-2026-27-j1-dima-vs-fat-n', 'fat-n', 2, 128.00),
    ('c6000000-0000-0000-0000-000000000013', 'fms-colombia-2026-27-j1-aczino-vs-filosofo', 'aczino', 1, 165.00),
    ('c6000000-0000-0000-0000-000000000014', 'fms-colombia-2026-27-j1-aczino-vs-filosofo', 'filosofo', 2, 136.00),
    ('c6000000-0000-0000-0000-000000000015', 'fms-colombia-2026-27-j1-valles-t-vs-exodo-lirical', 'valles-t', 1, 163.00),
    ('c6000000-0000-0000-0000-000000000016', 'fms-colombia-2026-27-j1-valles-t-vs-exodo-lirical', 'exodo-lirical', 2, 144.00)
) as result_data(id, battle_slug, freestyler_slug, side_number, score)
join public.battles on battles.slug = result_data.battle_slug
join public.freestylers on freestylers.slug = result_data.freestyler_slug
on conflict (id) do update
set
  battle_id = excluded.battle_id,
  freestyler_id = excluded.freestyler_id,
  side_number = excluded.side_number,
  slot_number = excluded.slot_number,
  score = excluded.score,
  updated_at = now();

-- =========================================================
-- Ranking oficial después de Jornada 1
-- =========================================================

-- Solo este snapshot queda vigente para la temporada.
update public.ranking_snapshots
set
  is_current = false,
  updated_at = now()
where season_id = (
  select league_seasons.id
  from public.league_seasons
  join public.leagues on leagues.id = league_seasons.league_id
  where leagues.slug = 'fms-colombia'
    and league_seasons.slug = '2026-27'
)
and id <> 'c7000000-0000-0000-0000-000000000001';

insert into public.ranking_snapshots (
  id,
  season_id,
  event_id,
  name,
  captured_at,
  source_url,
  is_current,
  editorial_status,
  published_at
)
select
  'c7000000-0000-0000-0000-000000000001',
  league_seasons.id,
  events.id,
  'FMS Colombia 2026/27 — Después de Jornada 1',
  '2026-10-12 12:00:00-05',
  'https://fms.tv/clasificacion/colombia/',
  true,
  'published',
  '2026-10-21 12:00:00+00'
from public.league_seasons
join public.leagues
  on leagues.id = league_seasons.league_id
  and leagues.slug = 'fms-colombia'
join public.events
  on events.slug = 'fms-colombia-2026-27-jornada-1-bogota'
where league_seasons.slug = '2026-27'
on conflict (id) do update
set
  season_id = excluded.season_id,
  event_id = excluded.event_id,
  name = excluded.name,
  captured_at = excluded.captured_at,
  source_url = excluded.source_url,
  is_current = excluded.is_current,
  editorial_status = excluded.editorial_status,
  published_at = coalesce(public.ranking_snapshots.published_at, excluded.published_at),
  updated_at = now();

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
  penalty_points,
  mvp_count
)
select
  ranking_data.id::uuid,
  ranking_snapshots.id,
  league_season_participants.id,
  'general',
  ranking_data.position,
  2,
  ranking_data.battle_wins,
  0,
  0,
  ranking_data.battle_losses,
  ranking_data.points,
  ranking_data.score_total,
  0,
  ranking_data.mvp_count
from (
  values
    ('c8000000-0000-0000-0000-000000000001', 'aczino', 1, 2, 0, 6.00, 325.00, 1),
    ('c8000000-0000-0000-0000-000000000002', 'valles-t', 2, 2, 0, 6.00, 320.00, 0),
    ('c8000000-0000-0000-0000-000000000003', 'puppy', 3, 2, 0, 6.00, 317.00, 0),
    ('c8000000-0000-0000-0000-000000000004', 'exodo-lirical', 4, 1, 1, 3.00, 292.00, 0),
    ('c8000000-0000-0000-0000-000000000005', 'reverse', 5, 1, 1, 3.00, 290.00, 0),
    ('c8000000-0000-0000-0000-000000000006', 'filosofo', 6, 1, 1, 3.00, 287.00, 0),
    ('c8000000-0000-0000-0000-000000000007', 'dima', 7, 1, 1, 3.00, 280.00, 0),
    ('c8000000-0000-0000-0000-000000000008', 'visionario', 8, 1, 1, 3.00, 273.00, 0),
    ('c8000000-0000-0000-0000-000000000009', 'pandora', 9, 0, 2, 0.00, 277.00, 0),
    ('c8000000-0000-0000-0000-00000000000a', 'fat-n', 10, 0, 2, 0.00, 270.00, 0)
) as ranking_data(
  id,
  freestyler_slug,
  position,
  battle_wins,
  battle_losses,
  points,
  score_total,
  mvp_count
)
join public.ranking_snapshots
  on ranking_snapshots.id = 'c7000000-0000-0000-0000-000000000001'
join public.freestylers
  on freestylers.slug = ranking_data.freestyler_slug
join public.league_season_participants
  on league_season_participants.freestyler_id = freestylers.id
  and league_season_participants.season_id = ranking_snapshots.season_id
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
  penalty_points = excluded.penalty_points,
  mvp_count = excluded.mvp_count,
  updated_at = now();

-- =========================================================
-- Verificación: aborta y revierte si la carga queda incompleta
-- =========================================================

do $verify$
declare
  season_participant_count integer;
  active_participant_count integer;
  journey_one_battle_count integer;
  journey_one_battle_participant_count integer;
  ranking_entry_count integer;
  journey_two_battle_count integer;
begin
  select count(*), count(*) filter (where league_season_participants.is_active)
  into season_participant_count, active_participant_count
  from public.league_season_participants
  join public.league_seasons
    on league_seasons.id = league_season_participants.season_id
  join public.leagues on leagues.id = league_seasons.league_id
  where leagues.slug = 'fms-colombia'
    and league_seasons.slug = '2026-27';

  select count(*)
  into journey_one_battle_count
  from public.battles
  join public.events on events.id = battles.event_id
  where events.slug = 'fms-colombia-2026-27-jornada-1-bogota';

  select count(*)
  into journey_one_battle_participant_count
  from public.battle_participants
  join public.battles on battles.id = battle_participants.battle_id
  join public.events on events.id = battles.event_id
  where events.slug = 'fms-colombia-2026-27-jornada-1-bogota';

  select count(*)
  into ranking_entry_count
  from public.ranking_entries
  where snapshot_id = 'c7000000-0000-0000-0000-000000000001';

  select count(*)
  into journey_two_battle_count
  from public.battles
  join public.events on events.id = battles.event_id
  where events.slug = 'fms-colombia-2026-27-jornada-2-cali';

  if season_participant_count <> 12 then
    raise exception
      'FMS Colombia import expected 12 season participants, found %',
      season_participant_count;
  end if;

  if active_participant_count <> 10 then
    raise exception
      'FMS Colombia import expected 10 active participants, found %',
      active_participant_count;
  end if;

  if journey_one_battle_count <> 11 then
    raise exception
      'FMS Colombia import expected 11 Jornada 1 battles, found %',
      journey_one_battle_count;
  end if;

  if journey_one_battle_participant_count <> 22 then
    raise exception
      'FMS Colombia import expected 22 battle participants, found %',
      journey_one_battle_participant_count;
  end if;

  if ranking_entry_count <> 10 then
    raise exception
      'FMS Colombia import expected 10 ranking entries, found %',
      ranking_entry_count;
  end if;

  if journey_two_battle_count <> 0 then
    raise exception
      'FMS Colombia Jornada 2 must remain without battles until official matchups are published';
  end if;
end;
$verify$;

commit;
