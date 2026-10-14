begin;

create extension if not exists pgtap with schema extensions;

select plan(30);

select has_table(
  'public',
  'league_season_participants',
  'league_season_participants table exists'
);

select has_table(
  'public',
  'ranking_snapshots',
  'ranking_snapshots table exists'
);

select has_table(
  'public',
  'ranking_entries',
  'ranking_entries table exists'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.league_season_participants'::regclass
  ),
  'RLS is enabled on league_season_participants'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.ranking_snapshots'::regclass
  ),
  'RLS is enabled on ranking_snapshots'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.ranking_entries'::regclass
  ),
  'RLS is enabled on ranking_entries'
);

insert into public.organizations (
  id,
  name,
  slug,
  description,
  editorial_status,
  published_at
)
values (
  'a1000000-0000-0000-0000-000000000001',
  'Rankings Test Organization',
  'rankings-test-organization',
  'Organization used by ranking tests.',
  'published',
  now()
);

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
  'a2000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'Rankings Test League',
  'rankings-test-league',
  'RTL',
  'League used by ranking tests.',
  'published',
  now()
);

insert into public.league_seasons (
  id,
  league_id,
  name,
  slug,
  year,
  starts_on,
  editorial_status,
  published_at
)
values
  (
    'a3000000-0000-0000-0000-000000000001',
    'a2000000-0000-0000-0000-000000000001',
    'Rankings Test Season One',
    'rankings-test-season-one',
    2026,
    '2026-01-01',
    'published',
    now()
  ),
  (
    'a3000000-0000-0000-0000-000000000002',
    'a2000000-0000-0000-0000-000000000001',
    'Rankings Test Season Two',
    'rankings-test-season-two',
    2027,
    '2027-01-01',
    'published',
    now()
  );

insert into public.freestylers (
  id,
  stage_name,
  slug,
  editorial_status,
  published_at
)
values
  (
    'a4000000-0000-0000-0000-000000000001',
    'Ranking MC One',
    'ranking-mc-one',
    'published',
    now()
  ),
  (
    'a4000000-0000-0000-0000-000000000002',
    'Ranking MC Two',
    'ranking-mc-two',
    'published',
    now()
  ),
  (
    'a4000000-0000-0000-0000-000000000003',
    'Ranking MC Three',
    'ranking-mc-three',
    'published',
    now()
  );

insert into public.league_season_participants (
  id,
  season_id,
  freestyler_id,
  seed
)
values
  (
    'a5000000-0000-0000-0000-000000000001',
    'a3000000-0000-0000-0000-000000000001',
    'a4000000-0000-0000-0000-000000000001',
    1
  ),
  (
    'a5000000-0000-0000-0000-000000000002',
    'a3000000-0000-0000-0000-000000000001',
    'a4000000-0000-0000-0000-000000000002',
    2
  ),
  (
    'a5000000-0000-0000-0000-000000000003',
    'a3000000-0000-0000-0000-000000000002',
    'a4000000-0000-0000-0000-000000000003',
    1
  );

select throws_ok(
  $$
    insert into public.league_season_participants (
      season_id,
      freestyler_id,
      seed
    )
    values (
      'a3000000-0000-0000-0000-000000000001',
      'a4000000-0000-0000-0000-000000000003',
      0
    )
  $$,
  '23514',
  null,
  'participant seed must be positive'
);

select throws_ok(
  $$
    insert into public.league_season_participants (
      season_id,
      freestyler_id
    )
    values (
      'a3000000-0000-0000-0000-000000000001',
      'a4000000-0000-0000-0000-000000000001'
    )
  $$,
  '23505',
  null,
  'freestyler cannot be duplicated in a season'
);

select throws_ok(
  $$
    insert into public.ranking_snapshots (
      season_id,
      name,
      captured_at,
      source_url,
      editorial_status
    )
    values (
      'a3000000-0000-0000-0000-000000000001',
      'Published Without Date',
      now(),
      'https://example.com/ranking',
      'published'
    )
  $$,
  '23514',
  null,
  'published ranking requires published_at'
);

select throws_ok(
  $$
    insert into public.ranking_snapshots (
      season_id,
      name,
      captured_at,
      source_url,
      is_current
    )
    values (
      'a3000000-0000-0000-0000-000000000001',
      'Draft Current Ranking',
      now(),
      'https://example.com/ranking',
      true
    )
  $$,
  '23514',
  null,
  'current ranking must be published'
);

select throws_ok(
  $$
    insert into public.ranking_snapshots (
      season_id,
      name,
      captured_at,
      source_url
    )
    values (
      'a3000000-0000-0000-0000-000000000001',
      'Invalid Source Ranking',
      now(),
      'invalid-url'
    )
  $$,
  '23514',
  null,
  'ranking source must be a valid HTTP URL'
);

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
  'a6000000-0000-0000-0000-000000000001',
  'a3000000-0000-0000-0000-000000000001',
  'Current Published Ranking',
  now(),
  'https://example.com/ranking/current',
  true,
  'published',
  now()
);

select throws_ok(
  $$
    insert into public.ranking_snapshots (
      season_id,
      name,
      captured_at,
      source_url,
      is_current,
      editorial_status,
      published_at
    )
    values (
      'a3000000-0000-0000-0000-000000000001',
      'Duplicate Current Ranking',
      now(),
      'https://example.com/ranking/duplicate',
      true,
      'published',
      now()
    )
  $$,
  '23505',
  null,
  'season cannot have two current rankings'
);

select throws_ok(
  $$
    insert into public.ranking_entries (
      snapshot_id,
      participant_id,
      position
    )
    values (
      'a6000000-0000-0000-0000-000000000001',
      'a5000000-0000-0000-0000-000000000001',
      0
    )
  $$,
  '23514',
  null,
  'ranking position must be positive'
);

select lives_ok(
  $$
    insert into public.ranking_entries (
      id,
      snapshot_id,
      participant_id,
      position,
      matches_played,
      battle_wins,
      points,
      score_total
    )
    values (
      'a7000000-0000-0000-0000-000000000001',
      'a6000000-0000-0000-0000-000000000001',
      'a5000000-0000-0000-0000-000000000001',
      1,
      1,
      1,
      3,
      250.50
    )
  $$,
  'valid ranking entry can be created'
);

select throws_ok(
  $$
    insert into public.ranking_entries (
      snapshot_id,
      participant_id,
      position
    )
    values (
      'a6000000-0000-0000-0000-000000000001',
      'a5000000-0000-0000-0000-000000000003',
      2
    )
  $$,
  'P0001',
  'Ranking entry snapshot and participant must belong to the same season.',
  'ranking participant must belong to the snapshot season'
);

-- =========================================================
-- Draft data for RLS validation
-- =========================================================

insert into public.ranking_snapshots (
  id,
  season_id,
  name,
  captured_at,
  source_url,
  editorial_status
)
values (
  'a6000000-0000-0000-0000-000000000002',
  'a3000000-0000-0000-0000-000000000001',
  'Draft Ranking',
  now(),
  'https://example.com/ranking/draft',
  'draft'
);

insert into public.ranking_entries (
  id,
  snapshot_id,
  participant_id,
  position
)
values (
  'a7000000-0000-0000-0000-000000000002',
  'a6000000-0000-0000-0000-000000000002',
  'a5000000-0000-0000-0000-000000000002',
  1
);

-- =========================================================
-- Authentication fixtures
-- =========================================================

insert into auth.users (
  id,
  email,
  encrypted_password
)
values
  (
    'a8000000-0000-0000-0000-000000000001',
    'ranking-user@example.test',
    'not-a-real-password'
  ),
  (
    'a8000000-0000-0000-0000-000000000002',
    'ranking-editor@example.test',
    'not-a-real-password'
  ),
  (
    'a8000000-0000-0000-0000-000000000003',
    'ranking-admin@example.test',
    'not-a-real-password'
  );

insert into public.user_roles (
  user_id,
  role
)
values
  (
    'a8000000-0000-0000-0000-000000000002',
    'editor'
  ),
  (
    'a8000000-0000-0000-0000-000000000003',
    'admin'
  );

-- =========================================================
-- Anonymous access
-- =========================================================

set local role anon;

select results_eq(
  $$
    select count(*)::bigint
    from public.league_season_participants
  $$,
  $$values (3::bigint)$$,
  'anon can read participants of published seasons'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.ranking_snapshots
  $$,
  $$values (1::bigint)$$,
  'anon can only read published ranking snapshots'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.ranking_entries
  $$,
  $$values (1::bigint)$$,
  'anon can only read entries from published rankings'
);

select throws_ok(
  $$
    insert into public.league_season_participants (
      season_id,
      freestyler_id
    )
    values (
      'a3000000-0000-0000-0000-000000000002',
      'a4000000-0000-0000-0000-000000000001'
    )
  $$,
  '42501',
  null,
  'anon cannot create season participants'
);

reset role;

-- =========================================================
-- Regular authenticated user
-- =========================================================

set local role authenticated;

set local request.jwt.claims =
  '{"sub":"a8000000-0000-0000-0000-000000000001","role":"authenticated"}';

select results_eq(
  $$
    select count(*)::bigint
    from public.league_season_participants
  $$,
  $$values (3::bigint)$$,
  'regular user can only read public season participants'
);

select throws_ok(
  $$
    insert into public.ranking_snapshots (
      season_id,
      name,
      captured_at,
      source_url
    )
    values (
      'a3000000-0000-0000-0000-000000000001',
      'Unauthorized Ranking',
      now(),
      'https://example.com/unauthorized'
    )
  $$,
  '42501',
  null,
  'regular user cannot create ranking snapshots'
);

-- =========================================================
-- Editor access
-- =========================================================

set local request.jwt.claims =
  '{"sub":"a8000000-0000-0000-0000-000000000002","role":"authenticated"}';

select ok(
  private.is_editor(),
  'editor role is resolved from auth.uid()'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.league_season_participants
  $$,
  $$values (3::bigint)$$,
  'editor can read all season participants'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.ranking_snapshots
  $$,
  $$values (2::bigint)$$,
  'editor can read published and draft snapshots'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.ranking_entries
  $$,
  $$values (2::bigint)$$,
  'editor can read entries from published and draft rankings'
);

select lives_ok(
  $$
    update public.ranking_snapshots
    set name = 'Updated Draft Ranking'
    where id = 'a6000000-0000-0000-0000-000000000002'
  $$,
  'editor can update ranking snapshots'
);

select is_empty(
  $$
    delete from public.ranking_snapshots
    where id = 'a6000000-0000-0000-0000-000000000002'
    returning id
  $$,
  'editor cannot hard-delete ranking snapshots'
);

-- =========================================================
-- Administrator access
-- =========================================================

set local request.jwt.claims =
  '{"sub":"a8000000-0000-0000-0000-000000000003","role":"authenticated"}';

select ok(
  private.is_admin(),
  'admin role is resolved from auth.uid()'
);

select results_eq(
  $$
    delete from public.ranking_snapshots
    where id = 'a6000000-0000-0000-0000-000000000002'
    returning id
  $$,
  $$
    values (
      'a6000000-0000-0000-0000-000000000002'::uuid
    )
  $$,
  'admin can delete ranking snapshots'
);

select results_eq(
  $$
    delete from public.league_season_participants
    where id = 'a5000000-0000-0000-0000-000000000002'
    returning id
  $$,
  $$
    values (
      'a5000000-0000-0000-0000-000000000002'::uuid
    )
  $$,
  'admin can delete season participants without ranking entries'
);


select * from finish();

rollback;