begin;

create extension if not exists pgtap with schema extensions;

select plan(20);

select has_table(
  'public',
  'venues',
  'venues table exists'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.venues'::regclass
  ),
  'RLS is enabled on venues'
);

select throws_ok(
  $$
    insert into public.venues (
      country_id,
      name,
      slug,
      city
    )
    values (
      (
        select id
        from public.countries
        where slug = 'mexico'
      ),
      'Invalid Slug Venue',
      'Invalid Slug',
      'Ciudad de México'
    )
  $$,
  '23514',
  null,
  'venue slug must be URL-safe'
);

select throws_ok(
  $$
    insert into public.venues (
      country_id,
      name,
      slug,
      city,
      latitude,
      longitude
    )
    values (
      (
        select id
        from public.countries
        where slug = 'mexico'
      ),
      'Invalid Latitude Venue',
      'invalid-latitude-venue',
      'Ciudad de México',
      91,
      -99
    )
  $$,
  '23514',
  null,
  'venue latitude must be between -90 and 90'
);

select throws_ok(
  $$
    insert into public.venues (
      country_id,
      name,
      slug,
      city,
      latitude,
      longitude
    )
    values (
      (
        select id
        from public.countries
        where slug = 'mexico'
      ),
      'Invalid Longitude Venue',
      'invalid-longitude-venue',
      'Ciudad de México',
      19,
      -181
    )
  $$,
  '23514',
  null,
  'venue longitude must be between -180 and 180'
);

select throws_ok(
  $$
    insert into public.venues (
      country_id,
      name,
      slug,
      city,
      latitude
    )
    values (
      (
        select id
        from public.countries
        where slug = 'mexico'
      ),
      'Incomplete Coordinates Venue',
      'incomplete-coordinates-venue',
      'Ciudad de México',
      19.432608
    )
  $$,
  '23514',
  null,
  'venue coordinates must include latitude and longitude'
);

select throws_ok(
  $$
    insert into public.venues (
      country_id,
      name,
      slug,
      city,
      website_url
    )
    values (
      (
        select id
        from public.countries
        where slug = 'mexico'
      ),
      'Invalid Website Venue',
      'invalid-website-venue',
      'Ciudad de México',
      'invalid-url'
    )
  $$,
  '23514',
  null,
  'venue website must use http or https'
);

insert into public.venues (
  id,
  country_id,
  name,
  slug,
  city,
  region,
  address,
  latitude,
  longitude,
  website_url
)
values (
  '70000000-0000-0000-0000-000000000001',
  (
    select id
    from public.countries
    where slug = 'mexico'
  ),
  'Test Arena Mexico',
  'test-arena',
  'Ciudad de México',
  'Ciudad de México',
  'Avenida de prueba 100',
  19.432608,
  -99.133209,
  'https://example.com/mexico'
);

select lives_ok(
  $$
    insert into public.venues (
      id,
      country_id,
      name,
      slug,
      city
    )
    values (
      '70000000-0000-0000-0000-000000000002',
      (
        select id
        from public.countries
        where slug = 'espana'
      ),
      'Test Arena Spain',
      'test-arena',
      'Madrid'
    )
  $$,
  'same venue slug can exist in a different country'
);

select throws_ok(
  $$
    insert into public.venues (
      country_id,
      name,
      slug,
      city
    )
    values (
      (
        select id
        from public.countries
        where slug = 'mexico'
      ),
      'Duplicate Test Arena',
      'test-arena',
      'Monterrey'
    )
  $$,
  '23505',
  null,
  'venue slug must be unique inside its country'
);

select throws_ok(
  $$
    delete from public.countries
    where slug = 'mexico'
  $$,
  '23503',
  null,
  'country with related venues cannot be deleted'
);

set local role anon;

select results_eq(
  $$
    select count(*)::bigint
    from public.venues
  $$,
  $$values (2::bigint)$$,
  'anon can read venues'
);

select throws_ok(
  $$
    insert into public.venues (
      country_id,
      name,
      slug,
      city
    )
    values (
      (
        select id
        from public.countries
        where slug = 'mexico'
      ),
      'Anonymous Venue',
      'anonymous-venue',
      'Ciudad de México'
    )
  $$,
  '42501',
  null,
  'anon cannot insert venues'
);

reset role;

insert into auth.users (
  id,
  email,
  encrypted_password
)
values
  (
    '72000000-0000-0000-0000-000000000001',
    'user@example.test',
    'not-a-real-password'
  ),
  (
    '72000000-0000-0000-0000-000000000002',
    'editor@example.test',
    'not-a-real-password'
  ),
  (
    '72000000-0000-0000-0000-000000000003',
    'admin@example.test',
    'not-a-real-password'
  );

insert into public.user_roles (
  user_id,
  role
)
values
  (
    '72000000-0000-0000-0000-000000000002',
    'editor'
  ),
  (
    '72000000-0000-0000-0000-000000000003',
    'admin'
  );

set local role authenticated;

set local request.jwt.claims =
  '{"sub":"72000000-0000-0000-0000-000000000001","role":"authenticated"}';

select results_eq(
  $$
    select count(*)::bigint
    from public.venues
  $$,
  $$values (2::bigint)$$,
  'regular user can read venues'
);

select throws_ok(
  $$
    insert into public.venues (
      country_id,
      name,
      slug,
      city
    )
    values (
      (
        select id
        from public.countries
        where slug = 'mexico'
      ),
      'Regular User Venue',
      'regular-user-venue',
      'Ciudad de México'
    )
  $$,
  '42501',
  null,
  'regular user cannot insert venues'
);

set local request.jwt.claims =
  '{"sub":"72000000-0000-0000-0000-000000000002","role":"authenticated"}';

select ok(
  private.is_editor(),
  'editor role is resolved from auth.uid()'
);

select lives_ok(
  $$
    insert into public.venues (
      id,
      country_id,
      name,
      slug,
      city,
      created_by,
      updated_by
    )
    values (
      '70000000-0000-0000-0000-000000000003',
      (
        select id
        from public.countries
        where slug = 'mexico'
      ),
      'Editor Venue',
      'editor-venue',
      'Guadalajara',
      auth.uid(),
      auth.uid()
    )
  $$,
  'editor can insert venues'
);

select lives_ok(
  $$
    update public.venues
    set
      city = 'Zapopan',
      updated_by = auth.uid()
    where id = '70000000-0000-0000-0000-000000000003'
  $$,
  'editor can update venues'
);

select is_empty(
  $$
    delete from public.venues
    where id = '70000000-0000-0000-0000-000000000003'
    returning id
  $$,
  'editor cannot delete venues'
);

set local request.jwt.claims =
  '{"sub":"72000000-0000-0000-0000-000000000003","role":"authenticated"}';

select ok(
  private.is_admin(),
  'admin role is resolved from auth.uid()'
);

select results_eq(
  $$
    delete from public.venues
    where id = '70000000-0000-0000-0000-000000000003'
    returning id
  $$,
  $$
    values (
      '70000000-0000-0000-0000-000000000003'::uuid
    )
  $$,
  'admin can delete venues'
);

select * from finish();

rollback;