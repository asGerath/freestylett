begin;

create extension if not exists pgtap with schema extensions;

select plan(30);

select has_table(
  'public',
  'leagues',
  'leagues table exists'
);

select has_table(
  'public',
  'league_countries',
  'league_countries table exists'
);

select has_table(
  'public',
  'league_seasons',
  'league_seasons table exists'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.leagues'::regclass
  ),
  'RLS is enabled on leagues'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.league_countries'::regclass
  ),
  'RLS is enabled on league_countries'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.league_seasons'::regclass
  ),
  'RLS is enabled on league_seasons'
);

select throws_ok(
  $$
    insert into public.leagues (
      name,
      slug,
      description
    )
    values (
      'Invalid League',
      'Invalid League',
      'League with an invalid slug.'
    )
  $$,
  '23514',
  null,
  'league slug must be URL-safe'
);

select throws_ok(
  $$
    insert into public.leagues (
      name,
      slug,
      description,
      editorial_status
    )
    values (
      'Published Without Date',
      'published-without-date',
      'Published league without a publication date.',
      'published'
    )
  $$,
  '23514',
  null,
  'published league requires published_at'
);

insert into public.leagues (
  id,
  name,
  slug,
  short_name,
  description,
  editorial_status,
  published_at
)
values (
  '60000000-0000-0000-0000-000000000001',
  'Published League',
  'published-league',
  'PL',
  'Public league used by the RLS tests.',
  'published',
  now()
);

insert into public.leagues (
  id,
  name,
  slug,
  short_name,
  description,
  editorial_status
)
values (
  '60000000-0000-0000-0000-000000000002',
  'Draft League',
  'draft-league',
  'DL',
  'Private league used by the RLS tests.',
  'draft'
);

insert into public.league_countries (
  league_id,
  country_id,
  is_primary
)
values
  (
    '60000000-0000-0000-0000-000000000001',
    (
      select id
      from public.countries
      where slug = 'mexico'
    ),
    true
  ),
  (
    '60000000-0000-0000-0000-000000000002',
    (
      select id
      from public.countries
      where slug = 'espana'
    ),
    true
  );

select throws_ok(
  $$
    insert into public.league_countries (
      league_id,
      country_id,
      is_primary
    )
    values (
      '60000000-0000-0000-0000-000000000001',
      (
        select id
        from public.countries
        where slug = 'espana'
      ),
      true
    )
  $$,
  '23505',
  null,
  'league cannot have more than one primary country'
);

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
values
  (
    '61000000-0000-0000-0000-000000000001',
    '60000000-0000-0000-0000-000000000001',
    'Published Season',
    'published-season',
    2026,
    '2026-01-01',
    '2026-12-31',
    'published',
    now()
  ),
  (
    '61000000-0000-0000-0000-000000000002',
    '60000000-0000-0000-0000-000000000001',
    'Draft Season',
    'draft-season',
    2027,
    '2027-01-01',
    '2027-12-31',
    'draft',
    null
  ),
  (
    '61000000-0000-0000-0000-000000000003',
    '60000000-0000-0000-0000-000000000002',
    'Published Season With Draft League',
    'published-season-draft-league',
    2026,
    '2026-01-01',
    '2026-12-31',
    'published',
    now()
  );

select throws_ok(
  $$
    insert into public.league_seasons (
      league_id,
      name,
      slug,
      starts_on,
      ends_on
    )
    values (
      '60000000-0000-0000-0000-000000000001',
      'Invalid Dates Season',
      'invalid-dates-season',
      '2026-12-31',
      '2026-01-01'
    )
  $$,
  '23514',
  null,
  'season end date cannot be before its start date'
);

select throws_ok(
  $$
    insert into public.league_seasons (
      league_id,
      name,
      slug,
      editorial_status
    )
    values (
      '60000000-0000-0000-0000-000000000001',
      'Published Season Without Date',
      'published-season-without-date',
      'published'
    )
  $$,
  '23514',
  null,
  'published season requires published_at'
);

set local role anon;

select results_eq(
  $$
    select count(*)::bigint
    from public.leagues
  $$,
  $$values (1::bigint)$$,
  'anon can only read published leagues'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.league_countries
  $$,
  $$values (1::bigint)$$,
  'anon can only read countries of published leagues'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.league_seasons
  $$,
  $$values (1::bigint)$$,
  'anon can only read published seasons of published leagues'
);

select throws_ok(
  $$
    insert into public.leagues (
      name,
      slug,
      description
    )
    values (
      'Anonymous League',
      'anonymous-league',
      'League created by an anonymous visitor.'
    )
  $$,
  '42501',
  null,
  'anon cannot insert leagues'
);

reset role;

insert into auth.users (
  id,
  email,
  encrypted_password
)
values
  (
    '62000000-0000-0000-0000-000000000001',
    'user@example.test',
    'not-a-real-password'
  ),
  (
    '62000000-0000-0000-0000-000000000002',
    'editor@example.test',
    'not-a-real-password'
  ),
  (
    '62000000-0000-0000-0000-000000000003',
    'admin@example.test',
    'not-a-real-password'
  );

insert into public.user_roles (
  user_id,
  role
)
values
  (
    '62000000-0000-0000-0000-000000000002',
    'editor'
  ),
  (
    '62000000-0000-0000-0000-000000000003',
    'admin'
  );

set local role authenticated;

set local request.jwt.claims =
  '{"sub":"62000000-0000-0000-0000-000000000001","role":"authenticated"}';

select results_eq(
  $$
    select count(*)::bigint
    from public.leagues
  $$,
  $$values (1::bigint)$$,
  'regular user can only read published leagues'
);

select throws_ok(
  $$
    insert into public.leagues (
      name,
      slug,
      description
    )
    values (
      'Regular User League',
      'regular-user-league',
      'League created by a regular user.'
    )
  $$,
  '42501',
  null,
  'regular user cannot insert leagues'
);

set local request.jwt.claims =
  '{"sub":"62000000-0000-0000-0000-000000000002","role":"authenticated"}';

select ok(
  private.is_editor(),
  'editor role is resolved from auth.uid()'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.leagues
  $$,
  $$values (2::bigint)$$,
  'editor can read published leagues and drafts'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.league_countries
  $$,
  $$values (2::bigint)$$,
  'editor can read all league country relations'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.league_seasons
  $$,
  $$values (3::bigint)$$,
  'editor can read all league seasons'
);

select lives_ok(
  $$
    insert into public.leagues (
      id,
      name,
      slug,
      short_name,
      description,
      created_by,
      updated_by
    )
    values (
      '60000000-0000-0000-0000-000000000003',
      'Editor League',
      'editor-league',
      'EL',
      'League created by an editor.',
      auth.uid(),
      auth.uid()
    )
  $$,
  'editor can insert leagues'
);

select lives_ok(
  $$
    insert into public.league_countries (
      league_id,
      country_id,
      is_primary
    )
    values (
      '60000000-0000-0000-0000-000000000003',
      (
        select id
        from public.countries
        where slug = 'mexico'
      ),
      true
    )
  $$,
  'editor can add countries to a league'
);

select lives_ok(
  $$
    insert into public.league_seasons (
      id,
      league_id,
      name,
      slug,
      year,
      editorial_status,
      created_by,
      updated_by
    )
    values (
      '61000000-0000-0000-0000-000000000004',
      '60000000-0000-0000-0000-000000000003',
      'Editor Season',
      'editor-season',
      2026,
      'draft',
      auth.uid(),
      auth.uid()
    )
  $$,
  'editor can insert league seasons'
);

select lives_ok(
  $$
    update public.leagues
    set
      editorial_status = 'published',
      published_at = now(),
      updated_by = auth.uid()
    where id = '60000000-0000-0000-0000-000000000003'
  $$,
  'editor can publish leagues'
);

select results_eq(
  $$
    delete from public.league_countries
    where league_id = '60000000-0000-0000-0000-000000000003'
    returning league_id
  $$,
  $$
    values (
      '60000000-0000-0000-0000-000000000003'::uuid
    )
  $$,
  'editor can delete league country relations'
);

select is_empty(
  $$
    delete from public.leagues
    where id = '60000000-0000-0000-0000-000000000003'
    returning id
  $$,
  'editor cannot delete leagues'
);

set local request.jwt.claims =
  '{"sub":"62000000-0000-0000-0000-000000000003","role":"authenticated"}';

select ok(
  private.is_admin(),
  'admin role is resolved from auth.uid()'
);

select results_eq(
  $$
    delete from public.league_seasons
    where id = '61000000-0000-0000-0000-000000000004'
    returning id
  $$,
  $$
    values (
      '61000000-0000-0000-0000-000000000004'::uuid
    )
  $$,
  'admin can delete league seasons'
);

select results_eq(
  $$
    delete from public.leagues
    where id = '60000000-0000-0000-0000-000000000003'
    returning id
  $$,
  $$
    values (
      '60000000-0000-0000-0000-000000000003'::uuid
    )
  $$,
  'admin can delete leagues'
);

select * from finish();

rollback;