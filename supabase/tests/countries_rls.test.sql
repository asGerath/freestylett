begin;

create extension if not exists pgtap with schema extensions;
select plan(8);

select has_table('public', 'countries', 'countries table exists');
select ok(
  (select relrowsecurity from pg_class where oid = 'public.countries'::regclass),
  'RLS is enabled on countries'
);

set local role anon;
select results_eq(
  $$select count(*)::bigint from public.countries$$,
  $$values (6::bigint)$$,
  'anon can read the six active countries'
);
select throws_ok(
  $$insert into public.countries (name, slug, iso_code) values ('Test', 'test', 'TT')$$,
  '42501',
  null,
  'anon cannot insert countries'
);

reset role;
insert into auth.users (id, email, encrypted_password)
values (
  '20000000-0000-0000-0000-000000000001',
  'admin@example.test',
  'not-a-real-password'
);
insert into public.user_roles (user_id, role)
values ('20000000-0000-0000-0000-000000000001', 'admin');

set local role authenticated;
set local request.jwt.claims = '{"sub":"20000000-0000-0000-0000-000000000001","role":"authenticated"}';
select ok(private.is_admin(), 'admin role is resolved from auth.uid()');
select lives_ok(
  $$insert into public.countries (name, slug, iso_code, is_active) values ('Test', 'test', 'TT', false)$$,
  'admin can insert a country'
);
select lives_ok(
  $$update public.countries set name = 'Test Country' where iso_code = 'TT'$$,
  'admin can update a country'
);
select lives_ok(
  $$delete from public.countries where iso_code = 'TT'$$,
  'admin can delete a country'
);

select * from finish();
rollback;
