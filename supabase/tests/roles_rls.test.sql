begin;

create extension if not exists pgtap with schema extensions;
select plan(8);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'user_roles', 'user_roles table exists');
select ok(
  (select relrowsecurity from pg_class where oid = 'public.profiles'::regclass),
  'RLS is enabled on profiles'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.user_roles'::regclass),
  'RLS is enabled on user_roles'
);

insert into auth.users (id, email, encrypted_password)
values
  ('30000000-0000-0000-0000-000000000001', 'editor@example.test', 'not-a-real-password'),
  ('30000000-0000-0000-0000-000000000002', 'viewer@example.test', 'not-a-real-password');
insert into public.user_roles (user_id, role)
values ('30000000-0000-0000-0000-000000000001', 'editor');

set local role authenticated;
set local request.jwt.claims = '{"sub":"30000000-0000-0000-0000-000000000001","role":"authenticated"}';
select ok(private.is_editor(), 'editor role is resolved from auth.uid()');
select results_eq(
  $$select role::text from public.user_roles where user_id = auth.uid()$$,
  $$values ('editor'::text)$$,
  'editor can read their own role'
);
select throws_ok(
  $$insert into public.user_roles (user_id, role) values ('30000000-0000-0000-0000-000000000001', 'admin')$$,
  '42501',
  null,
  'editor cannot promote themselves'
);
select lives_ok(
  $$update public.profiles set display_name = 'Editor FT' where id = auth.uid()$$,
  'user can update their own profile'
);

select * from finish();
rollback;
