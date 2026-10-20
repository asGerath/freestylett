begin;

create extension if not exists pgtap with schema extensions;

select plan(21);

select has_table('public', 'creators', 'creators table exists');

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.creators'::regclass
  ),
  'RLS is enabled on creators'
);

insert into public.countries (
  id,
  name,
  slug,
  iso_code,
  display_order
)
values (
  'd0000000-0000-0000-0000-000000000001',
  'Creators Test Country',
  'creators-test-country',
  'CT',
  999
);

select throws_ok(
  $$
    insert into public.creators (name, slug)
    values ('Invalid Slug', 'Invalid Slug')
  $$,
  '23514',
  null,
  'creator slug must be valid'
);

select throws_ok(
  $$
    insert into public.creators (name, slug, creator_type)
    values ('Invalid Type', 'invalid-type', 'unknown')
  $$,
  '23514',
  null,
  'creator type must be supported'
);

select throws_ok(
  $$
    insert into public.creators (name, slug, website_url)
    values ('Invalid URL', 'invalid-url', 'invalid-url')
  $$,
  '23514',
  null,
  'creator URLs must use HTTP or HTTPS'
);

select throws_ok(
  $$
    insert into public.creators (
      name,
      slug,
      editorial_status
    )
    values (
      'Published Without Date',
      'published-without-date',
      'published'
    )
  $$,
  '23514',
  null,
  'published creator requires published_at'
);

select lives_ok(
  $$
    insert into public.creators (
      id,
      country_id,
      name,
      slug,
      creator_type,
      description,
      specialties,
      editorial_status,
      published_at
    )
    values (
      'd1000000-0000-4000-8000-000000000001',
      'd0000000-0000-0000-0000-000000000001',
      'Published Creator',
      'published-creator',
      'person',
      'Published creator used by tests.',
      array['entrevistas', 'análisis'],
      'published',
      now()
    )
  $$,
  'valid published creator can be created'
);

select lives_ok(
  $$
    insert into public.creators (
      id,
      name,
      slug,
      creator_type,
      editorial_status
    )
    values (
      'd1000000-0000-0000-0000-000000000002',
      'Draft Channel',
      'draft-channel',
      'channel',
      'draft'
    )
  $$,
  'valid draft creator can be created'
);

select ok(
  private.is_valid_editorial_media_path(
    'creators/d1000000-0000-4000-8000-000000000001/profile.webp'
  ),
  'creator media path is valid'
);

select ok(
  not private.is_valid_editorial_media_path(
    'creators/d1000000-0000-4000-8000-000000000099/profile.webp'
  ),
  'unknown creator media path is invalid'
);

insert into auth.users (id, email, encrypted_password)
values
  (
    'd9000000-0000-0000-0000-000000000001',
    'creator-user@example.test',
    'not-a-real-password'
  ),
  (
    'd9000000-0000-0000-0000-000000000002',
    'creator-editor@example.test',
    'not-a-real-password'
  ),
  (
    'd9000000-0000-0000-0000-000000000003',
    'creator-admin@example.test',
    'not-a-real-password'
  );

insert into public.user_roles (user_id, role)
values
  ('d9000000-0000-0000-0000-000000000002', 'editor'),
  ('d9000000-0000-0000-0000-000000000003', 'admin');

set local role anon;

select results_eq(
  $$select count(*)::bigint from public.creators$$,
  $$values (1::bigint)$$,
  'anon can only read published creators'
);

select throws_ok(
  $$
    insert into public.creators (name, slug)
    values ('Anonymous Creator', 'anonymous-creator')
  $$,
  '42501',
  null,
  'anon cannot create creators'
);

reset role;
set local role authenticated;
set local request.jwt.claims =
  '{"sub":"d9000000-0000-0000-0000-000000000001","role":"authenticated"}';

select results_eq(
  $$select count(*)::bigint from public.creators$$,
  $$values (1::bigint)$$,
  'regular user can only read published creators'
);

select throws_ok(
  $$
    insert into public.creators (name, slug)
    values ('Regular Creator', 'regular-creator')
  $$,
  '42501',
  null,
  'regular user cannot create creators'
);

set local request.jwt.claims =
  '{"sub":"d9000000-0000-0000-0000-000000000002","role":"authenticated"}';

select ok(private.is_editor(), 'editor role is resolved');

select results_eq(
  $$select count(*)::bigint from public.creators$$,
  $$values (2::bigint)$$,
  'editor can read published and draft creators'
);

select lives_ok(
  $$
    insert into public.creators (
      name,
      slug,
      creator_type,
      editorial_status,
      created_by,
      updated_by
    )
    values (
      'Editor Creator',
      'editor-creator',
      'media',
      'draft',
      auth.uid(),
      auth.uid()
    )
  $$,
  'editor can create creators'
);

select lives_ok(
  $$
    update public.creators
    set description = 'Updated by editor'
    where id = 'd1000000-0000-0000-0000-000000000002'
  $$,
  'editor can update creators'
);

select is_empty(
  $$
    delete from public.creators
    where id = 'd1000000-0000-0000-0000-000000000002'
    returning id
  $$,
  'editor cannot hard-delete creators'
);

set local request.jwt.claims =
  '{"sub":"d9000000-0000-0000-0000-000000000003","role":"authenticated"}';

select ok(private.is_admin(), 'admin role is resolved');

select results_eq(
  $$
    delete from public.creators
    where id = 'd1000000-0000-0000-0000-000000000002'
    returning id
  $$,
  $$values ('d1000000-0000-0000-0000-000000000002'::uuid)$$,
  'admin can hard-delete creators'
);

select * from finish();

rollback;
