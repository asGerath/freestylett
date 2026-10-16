begin;

create extension if not exists pgtap with schema extensions;

select plan(20);

select has_table(
  'public',
  'freestylers',
  'freestylers table exists'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.freestylers'::regclass
  ),
  'RLS is enabled on freestylers'
);

select throws_ok(
  $$
    insert into public.freestylers (
      stage_name,
      slug
    )
    values (
      'Invalid Slug Freestyler',
      'Invalid Slug'
    )
  $$,
  '23514',
  null,
  'freestyler slug must be URL-safe'
);

select throws_ok(
  $$
    insert into public.freestylers (
      stage_name,
      slug
    )
    values (
      '   ',
      'blank-stage-name'
    )
  $$,
  '23514',
  null,
  'freestyler stage name cannot be blank'
);

select throws_ok(
  $$
    insert into public.freestylers (
      stage_name,
      slug,
      birth_date
    )
    values (
      'Future Freestyler',
      'future-freestyler',
      current_date + 1
    )
  $$,
  '23514',
  null,
  'freestyler birth date cannot be in the future'
);

select throws_ok(
  $$
    insert into public.freestylers (
      stage_name,
      slug,
      photo_path
    )
    values (
      'Absolute Photo Freestyler',
      'absolute-photo-freestyler',
      'https://example.com/photo.webp'
    )
  $$,
  '23514',
  null,
  'freestyler photo must use a relative storage path'
);

select throws_ok(
  $$
    insert into public.freestylers (
      stage_name,
      slug,
      instagram_url
    )
    values (
      'Invalid Social Freestyler',
      'invalid-social-freestyler',
      'instagram.com/example'
    )
  $$,
  '23514',
  null,
  'freestyler social URL must use http or https'
);

select throws_ok(
  $$
    insert into public.freestylers (
      stage_name,
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
  'published freestyler requires published_at'
);

insert into public.freestylers (
  id,
  country_id,
  stage_name,
  slug,
  real_name,
  aka,
  bio,
  city,
  photo_path,
  birth_date,
  instagram_url,
  youtube_url,
  editorial_status,
  published_at
)
values (
  '80000000-0000-0000-0000-000000000001',
  (
    select id
    from public.countries
    where slug = 'mexico'
  ),
  'Published Freestyler',
  'published-freestyler',
  'Published Test User',
  'The Published',
  'Public profile used by the RLS tests.',
  'Ciudad de México',
  'freestylers/80000000-0000-0000-0000-000000000001/profile.webp',
  '1995-01-01',
  'https://instagram.com/published-freestyler',
  'https://youtube.com/@published-freestyler',
  'published',
  now()
);

insert into public.freestylers (
  id,
  stage_name,
  slug,
  bio,
  editorial_status
)
values (
  '80000000-0000-0000-0000-000000000002',
  'Draft Freestyler',
  'draft-freestyler',
  'Private draft profile used by the RLS tests.',
  'draft'
);

select throws_ok(
  $$
    delete from public.countries
    where slug = 'mexico'
  $$,
  '23503',
  null,
  'country with related freestylers cannot be deleted'
);

set local role anon;

select results_eq(
  $$
    select count(*)::bigint
    from public.freestylers
  $$,
  $$values (1::bigint)$$,
  'anon can only read published freestylers'
);

select throws_ok(
  $$
    insert into public.freestylers (
      stage_name,
      slug
    )
    values (
      'Anonymous Freestyler',
      'anonymous-freestyler'
    )
  $$,
  '42501',
  null,
  'anon cannot insert freestylers'
);

reset role;

insert into auth.users (
  id,
  email,
  encrypted_password
)
values
  (
    '82000000-0000-0000-0000-000000000001',
    'user@example.test',
    'not-a-real-password'
  ),
  (
    '82000000-0000-0000-0000-000000000002',
    'editor@example.test',
    'not-a-real-password'
  ),
  (
    '82000000-0000-0000-0000-000000000003',
    'admin@example.test',
    'not-a-real-password'
  );

insert into public.user_roles (
  user_id,
  role
)
values
  (
    '82000000-0000-0000-0000-000000000002',
    'editor'
  ),
  (
    '82000000-0000-0000-0000-000000000003',
    'admin'
  );

set local role authenticated;

set local request.jwt.claims =
  '{"sub":"82000000-0000-0000-0000-000000000001","role":"authenticated"}';

select results_eq(
  $$
    select count(*)::bigint
    from public.freestylers
  $$,
  $$values (1::bigint)$$,
  'regular user can only read published freestylers'
);

select throws_ok(
  $$
    insert into public.freestylers (
      stage_name,
      slug
    )
    values (
      'Regular User Freestyler',
      'regular-user-freestyler'
    )
  $$,
  '42501',
  null,
  'regular user cannot insert freestylers'
);

set local request.jwt.claims =
  '{"sub":"82000000-0000-0000-0000-000000000002","role":"authenticated"}';

select ok(
  private.is_editor(),
  'editor role is resolved from auth.uid()'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.freestylers
  $$,
  $$values (2::bigint)$$,
  'editor can read published freestylers and drafts'
);

select lives_ok(
  $$
    insert into public.freestylers (
      id,
      country_id,
      stage_name,
      slug,
      bio,
      editorial_status,
      created_by,
      updated_by
    )
    values (
      '80000000-0000-0000-0000-000000000003',
      (
        select id
        from public.countries
        where slug = 'argentina'
      ),
      'Editor Freestyler',
      'editor-freestyler',
      'Profile created by an editor.',
      'draft',
      auth.uid(),
      auth.uid()
    )
  $$,
  'editor can insert freestylers'
);

select lives_ok(
  $$
    update public.freestylers
    set
      editorial_status = 'published',
      published_at = now(),
      updated_by = auth.uid()
    where id = '80000000-0000-0000-0000-000000000003'
  $$,
  'editor can publish freestylers'
);

select is_empty(
  $$
    delete from public.freestylers
    where id = '80000000-0000-0000-0000-000000000003'
    returning id
  $$,
  'editor cannot delete freestylers'
);

set local request.jwt.claims =
  '{"sub":"82000000-0000-0000-0000-000000000003","role":"authenticated"}';

select ok(
  private.is_admin(),
  'admin role is resolved from auth.uid()'
);

select results_eq(
  $$
    delete from public.freestylers
    where id = '80000000-0000-0000-0000-000000000003'
    returning id
  $$,
  $$
    values (
      '80000000-0000-0000-0000-000000000003'::uuid
    )
  $$,
  'admin can delete freestylers'
);

select * from finish();

rollback;