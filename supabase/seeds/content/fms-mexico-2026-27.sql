-- =========================================================
-- Contenido real verificado: FMS México 2026/27
-- Fuente principal:
-- https://urbanroosters.news/chuty-estara-en-fms-mexico-con-un-line-up-historico-que-debutara-en-ecatepec-tierra-de-azuky/
--
-- Estado editorial inicial: draft
-- No publicar hasta completar perfiles, imágenes y revisión editorial.
-- =========================================================

begin;

-- =========================================================
-- Organización
-- =========================================================

insert into public.organizations (
  country_id,
  name,
  slug,
  description,
  website_url,
  editorial_status
)
values (
  (
    select id
    from public.countries
    where iso_code = 'ES'
  ),
  'Urban Roosters',
  'urban-roosters',
  'Organización responsable de Freestyle Master Series y de diferentes competiciones internacionales de freestyle.',
  'https://www.urbanroosters.com/',
  'draft'
)
on conflict (slug) do update
set
  country_id = excluded.country_id,
  name = excluded.name,
  description = excluded.description,
  website_url = excluded.website_url;

-- =========================================================
-- Liga
-- =========================================================

insert into public.leagues (
  organization_id,
  name,
  slug,
  short_name,
  description,
  website_url,
  youtube_url,
  editorial_status
)
values (
  (
    select id
    from public.organizations
    where slug = 'urban-roosters'
  ),
  'FMS México',
  'fms-mexico',
  'FMS México',
  'Edición mexicana de Freestyle Master Series, competición profesional organizada por Urban Roosters.',
  'https://fms.tv/',
  'https://www.youtube.com/@fms_mexico',
  'draft'
)
on conflict (slug) do update
set
  organization_id = excluded.organization_id,
  name = excluded.name,
  short_name = excluded.short_name,
  description = excluded.description,
  website_url = excluded.website_url,
  youtube_url = excluded.youtube_url;

-- =========================================================
-- País principal de la liga
-- =========================================================

insert into public.league_countries (
  league_id,
  country_id,
  is_primary
)
values (
  (
    select id
    from public.leagues
    where slug = 'fms-mexico'
  ),
  (
    select id
    from public.countries
    where iso_code = 'MX'
  ),
  true
)
on conflict (league_id, country_id) do update
set is_primary = excluded.is_primary;

-- =========================================================
-- Temporada 7
-- =========================================================

insert into public.league_seasons (
  league_id,
  name,
  slug,
  year,
  starts_on,
  ends_on,
  editorial_status
)
values (
  (
    select id
    from public.leagues
    where slug = 'fms-mexico'
  ),
  'FMS México 2026/27',
  'fms-mexico-2026-27',
  2026,
  '2026-10-24',
  null,
  'draft'
)
on conflict (league_id, slug) do update
set
  name = excluded.name,
  year = excluded.year,
  starts_on = excluded.starts_on,
  ends_on = excluded.ends_on;

-- =========================================================
-- Roster oficial
-- Se crean como borradores hasta completar cada perfil.
-- =========================================================

insert into public.freestylers (
  country_id,
  stage_name,
  slug,
  editorial_status
)
values
  (
    (select id from public.countries where iso_code = 'ES'),
    'Chuty',
    'chuty',
    'draft'
  ),
  (
    (select id from public.countries where iso_code = 'MX'),
    'Jony Beltrán',
    'jony-beltran',
    'draft'
  ),
  (
    (select id from public.countries where iso_code = 'MX'),
    'Azuky',
    'azuky',
    'draft'
  ),
  (
    (select id from public.countries where iso_code = 'AR'),
    'Kodigo',
    'kodigo',
    'draft'
  ),
  (
    (select id from public.countries where iso_code = 'ES'),
    'Skone',
    'skone',
    'draft'
  ),
  (
    (select id from public.countries where iso_code = 'MX'),
    'Nota Roja',
    'nota-roja',
    'draft'
  ),
  (
    (select id from public.countries where iso_code = 'MX'),
    'Lobo Estepario',
    'lobo-estepario',
    'draft'
  ),
  (
    (select id from public.countries where iso_code = 'MX'),
    'Rapder',
    'rapder',
    'draft'
  ),
  (
    (select id from public.countries where iso_code = 'MX'),
    'Xhavez',
    'xhavez',
    'draft'
  ),
  (
    (select id from public.countries where iso_code = 'ES'),
    'Dalia Castella',
    'dalia-castella',
    'draft'
  )
on conflict (slug) do update
set
  country_id = excluded.country_id,
  stage_name = excluded.stage_name;

commit;