begin;

create extension if not exists pgtap with schema extensions;

select plan(15);

select has_table(
  'public',
  'organizations',
  'organizations table exists'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.organizations'::regclass
  ),
  'RLS is enabled on organizations'
);

select throws_ok(
  $$
    insert into public.organizations (
      name,
      slug
    )
    values (
      'Invalid Slug Organization',
      'Invalid Slug'
    )
  $$,
  '23514',
  null,
  'organization slug must be URL-safe'
);

select throws_ok(
  $$
    insert into public.organizations (
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
  'published organization requires published_at'
);

insert into public.organizations (
  name,
  slug,
  description,
  editorial_status,
  published_at
)
values (
  'Published Organization',
  'published-organization',
  'Public organization used by the RLS tests.',
  'published',
  now()
);

insert into public.organizations (
  name,
  slug,
  description,
  editorial_status
)
values (
  'Draft Organization',
  'draft-organization',
  'Private draft used by the RLS tests.',
  'draft'
);

set local role anon;

select results_eq(
  $$
    select count(*)::bigint
    from public.organizations
  $$,
  $$values (1::bigint)$$,
  'anon can only read published organizations'
);

select throws_ok(
  $$
    insert into public.organizations (
      name,
      slug
    )
    values (
      'Anonymous Organization',
      'anonymous-organization'
    )
  $$,
  '42501',
  null,
  'anon cannot insert organizations'
);

reset role;

insert into auth.users (
  id,
  email,
  encrypted_password
)
values
  (
    '40000000-0000-0000-0000-000000000001',
    'user@example.test',
    'not-a-real-password'
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'editor@example.test',
    'not-a-real-password'
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    'admin@example.test',
    'not-a-real-password'
  );

insert into public.user_roles (
  user_id,
  role
)
values
  (
    '40000000-0000-0000-0000-000000000002',
    'editor'
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    'admin'
  );

set local role authenticated;

set local request.jwt.claims =
  '{"sub":"40000000-0000-0000-0000-000000000001","role":"authenticated"}';

select results_eq(
  $$
    select count(*)::bigint
    from public.organizations
  $$,
  $$values (1::bigint)$$,
  'regular user can only read published organizations'
);

select throws_ok(
  $$
    insert into public.organizations (
      name,
      slug
    )
    values (
      'Regular User Organization',
      'regular-user-organization'
    )
  $$,
  '42501',
  null,
  'regular user cannot insert organizations'
);

set local request.jwt.claims =
  '{"sub":"40000000-0000-0000-0000-000000000002","role":"authenticated"}';

select ok(
  private.is_editor(),
  'editor role is resolved from auth.uid()'
);

select results_eq(
  $$
    select count(*)::bigint
    from public.organizations
  $$,
  $$values (2::bigint)$$,
  'editor can read published organizations and drafts'
);

select lives_ok(
  $$
    insert into public.organizations (
      name,
      slug,
      description,
      editorial_status,
      created_by,
      updated_by
    )
    values (
      'Editor Organization',
      'editor-organization',
      'Organization created by an editor.',
      'draft',
      auth.uid(),
      auth.uid()
    )
  $$,
  'editor can insert organizations'
);

select lives_ok(
  $$
    update public.organizations
    set
      editorial_status = 'published',
      published_at = now(),
      updated_by = auth.uid()
    where slug = 'editor-organization'
  $$,
  'editor can publish organizations'
);

select is_empty(
  $$
    delete from public.organizations
    where slug = 'editor-organization'
    returning slug
  $$,
  'editor cannot delete organizations'
);

set local request.jwt.claims =
  '{"sub":"40000000-0000-0000-0000-000000000003","role":"authenticated"}';

select ok(
  private.is_admin(),
  'admin role is resolved from auth.uid()'
);

select results_eq(
  $$
    delete from public.organizations
    where slug = 'editor-organization'
    returning slug
  $$,
  $$values ('editor-organization'::text)$$,
  'admin can delete organizations'
);

select * from finish();

rollback;