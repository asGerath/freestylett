begin;

create extension if not exists pgtap with schema extensions;

select plan(38);

-- =========================================================
-- Schema
-- =========================================================

select has_table(
  'public',
  'battles',
  'battles table exists'
);

select has_table(
  'public',
  'battle_participants',
  'battle_participants table exists'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.battles'::regclass
  ),
  'RLS is enabled on battles'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.battle_participants'::regclass
  ),
  'RLS is enabled on battle_participants'
);

-- =========================================================
-- Base fixtures
-- =========================================================

insert into public.countries (
  id,
  name,
  slug,
  iso_code,
  display_order
)
values (
  'b0000000-0000-0000-0000-000000000001',
  'Battles Test Country',
  'battles-test-country',
  'BT',
  999
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
  'b1000000-0000-0000-0000-000000000001',
  'Battles Test Organization',
  'battles-test-organization',
  'Organization used by battle tests.',
  'published',
  now()
);

insert into public.leagues (
  id,
  organization_id,
  name,
  slug,
  description,
  editorial_status,
  published_at
)
values (
  'b2000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'Battles Test League',
  'battles-test-league',
  'League used by battle tests.',
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
    'b3000000-0000-0000-0000-000000000001',
    'b2000000-0000-0000-0000-000000000001',
    'Battles Test Season One',
    'battles-test-season-one',
    2026,
    'published',
    now()
  ),
  (
    'b3000000-0000-0000-0000-000000000002',
    'b2000000-0000-0000-0000-000000000001',
    'Battles Test Season Two',
    'battles-test-season-two',
    2027,
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
    'b4000000-0000-0000-0000-000000000001',
    'Battle MC One',
    'battle-mc-one',
    'published',
    now()
  ),
  (
    'b4000000-0000-0000-0000-000000000002',
    'Battle MC Two',
    'battle-mc-two',
    'published',
    now()
  ),
  (
    'b4000000-0000-0000-0000-000000000003',
    'Battle MC Other Season',
    'battle-mc-other-season',
    'published',
    now()
  ),
  (
    'b4000000-0000-0000-0000-000000000004',
    'Battle MC Outside Event',
    'battle-mc-outside-event',
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
    'b5000000-0000-0000-0000-000000000001',
    'b3000000-0000-0000-0000-000000000001',
    'b4000000-0000-0000-0000-000000000001',
    1
  ),
  (
    'b5000000-0000-0000-0000-000000000002',
    'b3000000-0000-0000-0000-000000000001',
    'b4000000-0000-0000-0000-000000000002',
    2
  ),
  (
    'b5000000-0000-0000-0000-000000000003',
    'b3000000-0000-0000-0000-000000000002',
    'b4000000-0000-0000-0000-000000000003',
    1
  );

insert into public.events (
  id,
  organization_id,
  country_id,
  title,
  slug,
  description,
  event_type,
  event_status,
  editorial_status,
  starts_at,
  time_zone,
  city,
  source_url,
  published_at
)
values (
  'b6000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'Battles Test Event',
  'battles-test-event',
  'Event used by battle tests.',
  'league_round',
  'finished',
  'published',
  '2026-10-16 18:00:00+00',
  'America/Mexico_City',
  'Ciudad de México',
  'https://example.com/events/battles-test-event',
  now()
);

insert into public.event_leagues (
  event_id,
  league_id,
  season_id,
  is_primary
)
values (
  'b6000000-0000-0000-0000-000000000001',
  'b2000000-0000-0000-0000-000000000001',
  'b3000000-0000-0000-0000-000000000001',
  true
);

insert into public.event_participants (
  id,
  event_id,
  freestyler_id,
  display_name,
  role,
  display_order
)
values
  (
    'b6100000-0000-0000-0000-000000000001',
    'b6000000-0000-0000-0000-000000000001',
    'b4000000-0000-0000-0000-000000000001',
    'Battle MC One',
    'competitor',
    1
  ),
  (
    'b6100000-0000-0000-0000-000000000002',
    'b6000000-0000-0000-0000-000000000001',
    'b4000000-0000-0000-0000-000000000002',
    'Battle MC Two',
    'competitor',
    2
  ),
  (
    'b6100000-0000-0000-0000-000000000003',
    'b6000000-0000-0000-0000-000000000001',
    'b4000000-0000-0000-0000-000000000003',
    'Battle MC Other Season',
    'competitor',
    3
  );

-- =========================================================
-- Battle constraints
-- =========================================================

select throws_ok(
  $$
    insert into public.battles (
      event_id,
      title,
      slug,
      battle_order,
      stage,
      battle_format,
      source_url,
      editorial_status
    )
    values (
      'b6000000-0000-0000-0000-000000000001',
      'Published Without Date',
      'published-without-date',
      10,
      'regular_round',
      'one_vs_one',
      'https://example.com/battles/published-without-date',
      'published'
    )
  $$,
  '23514',
  null,
  'published battle requires published_at'
);

select throws_ok(
  $$
    insert into public.battles (
      event_id,
      title,
      slug,
      battle_order,
      stage,
      battle_format,
      source_url
    )
    values (
      'b6000000-0000-0000-0000-000000000001',
      'Invalid Order',
      'invalid-order',
      0,
      'regular_round',
      'one_vs_one',
      'https://example.com/battles/invalid-order'
    )
  $$,
  '23514',
  null,
  'battle order must be positive'
);

select throws_ok(
  $$
    insert into public.battles (
      event_id,
      title,
      slug,
      battle_order,
      stage,
      battle_format,
      source_url
    )
    values (
      'b6000000-0000-0000-0000-000000000001',
      'Invalid Source',
      'invalid-source',
      10,
      'regular_round',
      'one_vs_one',
      'invalid-url'
    )
  $$,
  '23514',
  null,
  'battle source must be a valid HTTP URL'
);

select throws_ok(
  $$
    insert into public.battles (
      event_id,
      title,
      slug,
      battle_order,
      stage,
      battle_format,
      battle_status,
      winner_side,
      decision_type,
      source_url
    )
    values (
      'b6000000-0000-0000-0000-000000000001',
      'Scheduled With Result',
      'scheduled-with-result',
      10,
      'regular_round',
      'one_vs_one',
      'scheduled',
      1,
      'direct',
      'https://example.com/battles/scheduled-with-result'
    )
  $$,
  '23514',
  null,
  'unfinished battle cannot contain a result'
);

select throws_ok(
  $$
    insert into public.battles (
      event_id,
      title,
      slug,
      battle_order,
      stage,
      battle_format,
      battle_status,
      source_url
    )
    values (
      'b6000000-0000-0000-0000-000000000001',
      'Finished Without Decision',
      'finished-without-decision',
      10,
      'regular_round',
      'one_vs_one',
      'finished',
      'https://example.com/battles/finished-without-decision'
    )
  $$,
  '23514',
  null,
  'finished battle requires a decision'
);

select throws_ok(
  $$
    insert into public.battles (
      event_id,
      title,
      slug,
      battle_order,
      stage,
      battle_format,
      battle_status,
      winner_side,
      decision_type,
      source_url
    )
    values (
      'b6000000-0000-0000-0000-000000000001',
      'Invalid Draw',
      'invalid-draw',
      10,
      'regular_round',
      'one_vs_one',
      'finished',
      1,
      'draw',
      'https://example.com/battles/invalid-draw'
    )
  $$,
  '23514',
  null,
  'draw cannot have a winner side'
);

select throws_ok(
  $$
    insert into public.battles (
      event_id,
      title,
      slug,
      battle_order,
      stage,
      battle_format,
      battle_status,
      decision_type,
      source_url
    )
    values (
      'b6000000-0000-0000-0000-000000000001',
      'Direct Without Winner',
      'direct-without-winner',
      10,
      'regular_round',
      'one_vs_one',
      'finished',
      'direct',
      'https://example.com/battles/direct-without-winner'
    )
  $$,
  '23514',
  null,
  'non-draw finished battle requires a winner'
);

select throws_ok(
  $$
    insert into public.battles (
      event_id,
      season_id,
      title,
      slug,
      battle_order,
      stage,
      battle_format,
      source_url
    )
    values (
      'b6000000-0000-0000-0000-000000000001',
      'b3000000-0000-0000-0000-000000000002',
      'Wrong Season Battle',
      'wrong-season-battle',
      10,
      'regular_round',
      'one_vs_one',
      'https://example.com/battles/wrong-season'
    )
  $$,
  '23514',
  'Battle season must be associated with the selected event',
  'battle season must belong to the event'
);

-- =========================================================
-- Valid battles
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
  source_url,
  editorial_status,
  published_at
)
values
  (
    'b7000000-0000-0000-0000-000000000001',
    'b6000000-0000-0000-0000-000000000001',
    'b3000000-0000-0000-0000-000000000001',
    'Published Test Battle',
    'published-test-battle',
    1,
    'regular_round',
    'one_vs_one',
    'https://example.com/battles/published',
    'published',
    now()
  ),
  (
    'b7000000-0000-0000-0000-000000000002',
    'b6000000-0000-0000-0000-000000000001',
    'b3000000-0000-0000-0000-000000000001',
    'Draft Test Battle',
    'draft-test-battle',
    2,
    'regular_round',
    'one_vs_one',
    'https://example.com/battles/draft',
    'draft',
    null
  );

--------------------------------------------------------
-- Battles used to validate participant limits by format
--------------------------------------------------------

insert into public.battles (
  id,
  event_id,
  season_id,
  title,
  slug,
  battle_order,
  stage,
  battle_format,
  source_url
)
values
  (
    'b7000000-0000-0000-0000-000000000010',
    'b6000000-0000-0000-0000-000000000001',
    'b3000000-0000-0000-0000-000000000001',
    'One Versus One Limit Test',
    'one-versus-one-limit-test',
    10,
    'regular_round',
    'one_vs_one',
    'https://example.com/battles/one-versus-one-limit'
  ),
  (
    'b7000000-0000-0000-0000-000000000011',
    'b6000000-0000-0000-0000-000000000001',
    'b3000000-0000-0000-0000-000000000001',
    'Two Versus Two Limit Test',
    'two-versus-two-limit-test',
    11,
    'regular_round',
    'two_vs_two',
    'https://example.com/battles/two-versus-two-limit'
  ),
  (
    'b7000000-0000-0000-0000-000000000012',
    'b6000000-0000-0000-0000-000000000001',
    'b3000000-0000-0000-0000-000000000001',
    'Three Versus Three Limit Test',
    'three-versus-three-limit-test',
    12,
    'regular_round',
    'three_vs_three',
    'https://example.com/battles/three-versus-three-limit'
  );

-- =========================================================
-- Participant constraints
-- =========================================================

select throws_ok(
  $$
    insert into public.battle_participants (
      battle_id,
      freestyler_id,
      side_number,
      slot_number
    )
    values (
      'b7000000-0000-0000-0000-000000000010',
      'b4000000-0000-0000-0000-000000000001',
      3,
      1
    )
  $$,
  '23514',
  null,
  'battle participant side cannot exceed two'
);

select throws_ok(
  $$
    insert into public.battle_participants (
      battle_id,
      freestyler_id,
      side_number,
      slot_number
    )
    values (
      'b7000000-0000-0000-0000-000000000010',
      'b4000000-0000-0000-0000-000000000001',
      1,
      2
    )
  $$,
  '23514',
  null,
  'one versus one only accepts slot one'
);

select throws_ok(
  $$
    insert into public.battle_participants (
      battle_id,
      freestyler_id,
      side_number,
      slot_number
    )
    values (
      'b7000000-0000-0000-0000-000000000011',
      'b4000000-0000-0000-0000-000000000001',
      1,
      3
    )
  $$,
  '23514',
  null,
  'two versus two only accepts slots one and two'
);

select throws_ok(
  $$
    insert into public.battle_participants (
      battle_id,
      freestyler_id,
      side_number,
      slot_number
    )
    values (
      'b7000000-0000-0000-0000-000000000012',
      'b4000000-0000-0000-0000-000000000001',
      1,
      4
    )
  $$,
  '23514',
  null,
  'three versus three only accepts slots one through three'
);

insert into public.battle_participants (
  battle_id,
  freestyler_id,
  side_number,
  slot_number
)
values (
  'b7000000-0000-0000-0000-000000000011',
  'b4000000-0000-0000-0000-000000000001',
  1,
  2
);

select throws_ok(
  $$
    update public.battles
    set battle_format = 'one_vs_one'
    where id = 'b7000000-0000-0000-0000-000000000011'
  $$,
  '23514',
  null,
  'battle format cannot be reduced when participant slots exceed its limit'
);

select throws_ok(
  $$
    insert into public.battle_participants (
      battle_id,
      freestyler_id,
      side_number,
      slot_number
    )
    values (
      'b7000000-0000-0000-0000-000000000001',
      'b4000000-0000-0000-0000-000000000004',
      1,
      1
    )
  $$,
  '23514',
  'Battle participant must be registered as an event competitor',
  'participant must belong to the event'
);

select throws_ok(
  $$
    insert into public.battle_participants (
      battle_id,
      freestyler_id,
      side_number,
      slot_number
    )
    values (
      'b7000000-0000-0000-0000-000000000001',
      'b4000000-0000-0000-0000-000000000003',
      1,
      1
    )
  $$,
  '23514',
  'Battle participant must be active in the selected league season',
  'participant must belong to the battle season'
);

select lives_ok(
  $$
    insert into public.battle_participants (
      id,
      battle_id,
      freestyler_id,
      side_number,
      slot_number,
      score
    )
    values (
      'b8000000-0000-0000-0000-000000000001',
      'b7000000-0000-0000-0000-000000000001',
      'b4000000-0000-0000-0000-000000000001',
      1,
      1,
      275.50
    )
  $$,
  'valid first battle participant can be created'
);

select lives_ok(
  $$
    insert into public.battle_participants (
      id,
      battle_id,
      freestyler_id,
      side_number,
      slot_number,
      score
    )
    values (
      'b8000000-0000-0000-0000-000000000002',
      'b7000000-0000-0000-0000-000000000001',
      'b4000000-0000-0000-0000-000000000002',
      2,
      1,
      260.25
    )
  $$,
  'valid second battle participant can be created'
);

select throws_ok(
  $$
    insert into public.battle_participants (
      battle_id,
      freestyler_id,
      side_number,
      slot_number
    )
    values (
      'b7000000-0000-0000-0000-000000000011',
      'b4000000-0000-0000-0000-000000000001',
      2,
      1
    )
  $$,
  '23505',
  null,
  'freestyler cannot be duplicated in one battle'
);

select throws_ok(
  $$
    insert into public.battle_participants (
      battle_id,
      freestyler_id,
      side_number,
      slot_number
    )
    values (
      'b7000000-0000-0000-0000-000000000001',
      'b4000000-0000-0000-0000-000000000002',
      1,
      1
    )
  $$,
  '23505',
  null,
  'battle side slot cannot be duplicated'
);

select throws_ok(
  $$
    update public.battle_participants
    set score = -1
    where id = 'b8000000-0000-0000-0000-000000000001'
  $$,
  '23514',
  null,
  'battle score cannot be negative'
);

select throws_ok(
  $$
    update public.battles
    set
      battle_status = 'finished',
      decision_type = 'direct',
      winner_side = 3
    where id = 'b7000000-0000-0000-0000-000000000001'
  $$,
  '23514',
  'Battle winner side must contain at least one participant',
  'winner side must contain a participant'
);

select lives_ok(
  $$
    update public.battles
    set
      battle_status = 'finished',
      decision_type = 'direct',
      winner_side = 1
    where id = 'b7000000-0000-0000-0000-000000000001'
  $$,
  'valid battle result can be registered'
);

insert into public.battle_participants (
  id,
  battle_id,
  freestyler_id,
  side_number,
  slot_number
)
values (
  'b8000000-0000-0000-0000-000000000003',
  'b7000000-0000-0000-0000-000000000002',
  'b4000000-0000-0000-0000-000000000001',
  1,
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
    'b9000000-0000-0000-0000-000000000001',
    'battle-user@example.test',
    'not-a-real-password'
  ),
  (
    'b9000000-0000-0000-0000-000000000002',
    'battle-editor@example.test',
    'not-a-real-password'
  ),
  (
    'b9000000-0000-0000-0000-000000000003',
    'battle-admin@example.test',
    'not-a-real-password'
  );

insert into public.user_roles (
  user_id,
  role
)
values
  (
    'b9000000-0000-0000-0000-000000000002',
    'editor'
  ),
  (
    'b9000000-0000-0000-0000-000000000003',
    'admin'
  );

-- =========================================================
-- Anonymous access
-- =========================================================

set local role anon;

select results_eq(
  $$
    select count(*)::bigint
    from public.battles
    where id in (
      'b7000000-0000-0000-0000-000000000001'::uuid,
      'b7000000-0000-0000-0000-000000000002'::uuid
    )
  $$,
  $$values (1::bigint)$$,
  'anon can only read published battles'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.battle_participants
    where id in (
      'b8000000-0000-0000-0000-000000000001'::uuid,
      'b8000000-0000-0000-0000-000000000002'::uuid,
      'b8000000-0000-0000-0000-000000000003'::uuid
    )
  $$,
  $$values (2::bigint)$$,
  'anon can only read participants from published battles'
);

select throws_ok(
  $$
    insert into public.battles (
      event_id,
      title,
      slug,
      battle_order,
      stage,
      battle_format,
      source_url
    )
    values (
      'b6000000-0000-0000-0000-000000000001',
      'Anonymous Battle',
      'anonymous-battle',
      20,
      'exhibition',
      'one_vs_one',
      'https://example.com/battles/anonymous'
    )
  $$,
  '42501',
  null,
  'anon cannot create battles'
);

reset role;

-- =========================================================
-- Regular authenticated user
-- =========================================================

set local role authenticated;

set local request.jwt.claims =
  '{"sub":"b9000000-0000-0000-0000-000000000001","role":"authenticated"}';

select results_eq(
  $$
    select count(*)::bigint
    from public.battles
    where id in (
      'b7000000-0000-0000-0000-000000000001'::uuid,
      'b7000000-0000-0000-0000-000000000002'::uuid
    )
  $$,
  $$values (1::bigint)$$,
  'regular user can only read published battles'
);

select throws_ok(
  $$
    insert into public.battles (
      event_id,
      title,
      slug,
      battle_order,
      stage,
      battle_format,
      source_url
    )
    values (
      'b6000000-0000-0000-0000-000000000001',
      'Unauthorized Battle',
      'unauthorized-battle',
      20,
      'exhibition',
      'one_vs_one',
      'https://example.com/battles/unauthorized'
    )
  $$,
  '42501',
  null,
  'regular user cannot create battles'
);

-- =========================================================
-- Editor access
-- =========================================================

set local request.jwt.claims =
  '{"sub":"b9000000-0000-0000-0000-000000000002","role":"authenticated"}';

select ok(
  private.is_editor(),
  'editor role is resolved from auth.uid()'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.battles
    where id in (
      'b7000000-0000-0000-0000-000000000001'::uuid,
      'b7000000-0000-0000-0000-000000000002'::uuid
    )
  $$,
  $$values (2::bigint)$$,
  'editor can read published and draft battles'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.battle_participants
    where id in (
      'b8000000-0000-0000-0000-000000000001'::uuid,
      'b8000000-0000-0000-0000-000000000002'::uuid,
      'b8000000-0000-0000-0000-000000000003'::uuid
    )
  $$,
  $$values (3::bigint)$$,
  'editor can read participants from all battles'
);

select lives_ok(
  $$
    update public.battles
    set title = 'Updated Draft Battle'
    where id = 'b7000000-0000-0000-0000-000000000002'
  $$,
  'editor can update battles'
);

select is_empty(
  $$
    delete from public.battles
    where id = 'b7000000-0000-0000-0000-000000000002'
    returning id
  $$,
  'editor cannot hard-delete battles'
);

-- =========================================================
-- Administrator access
-- =========================================================

set local request.jwt.claims =
  '{"sub":"b9000000-0000-0000-0000-000000000003","role":"authenticated"}';

select ok(
  private.is_admin(),
  'admin role is resolved from auth.uid()'
);

select results_eq(
  $$
    delete from public.battles
    where id = 'b7000000-0000-0000-0000-000000000002'
    returning id
  $$,
  $$
    values (
      'b7000000-0000-0000-0000-000000000002'::uuid
    )
  $$,
  'admin can delete battles'
);

select * from finish();

rollback;