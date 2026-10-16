begin;

select plan(36);

-- =========================================================
-- Estructura y RLS
-- =========================================================

select has_table(
  'public',
  'post_categories',
  'La tabla public.post_categories debe existir'
);

select has_table(
  'public',
  'posts',
  'La tabla public.posts debe existir'
);

select ok(
  (
    select relrowsecurity
    from pg_catalog.pg_class
    where oid = 'public.post_categories'::regclass
  ),
  'post_categories debe tener RLS habilitado'
);

select ok(
  (
    select relrowsecurity
    from pg_catalog.pg_class
    where oid = 'public.posts'::regclass
  ),
  'posts debe tener RLS habilitado'
);

-- =========================================================
-- Usuarios de prueba
-- =========================================================

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
values
(
  '93000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'posts-user@example.test',
  '',
  now(),
  now(),
  now()
),
(
  '93000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'posts-editor@example.test',
  '',
  now(),
  now(),
  now()
),
(
  '93000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'posts-admin@example.test',
  '',
  now(),
  now(),
  now()
);

insert into public.user_roles (user_id, role)
values
  ('93000000-0000-0000-0000-000000000002', 'editor'),
  ('93000000-0000-0000-0000-000000000003', 'admin');

-- =========================================================
-- Datos base
-- =========================================================

insert into public.post_categories (
  id,
  name,
  slug,
  description
)
values
(
  'aa000000-0000-0000-0000-000000000001',
  'Noticias de prueba',
  'posts-test-news',
  'Categoría para noticias de prueba.'
),
(
  'aa000000-0000-0000-0000-000000000002',
  'Análisis de prueba',
  'posts-test-analysis',
  'Categoría para análisis de prueba.'
);

insert into public.posts (
  id,
  category_id,
  author_id,
  title,
  slug,
  excerpt,
  content_markdown,
  editorial_status,
  published_at
)
values
(
  'bb000000-0000-0000-0000-000000000001',
  'aa000000-0000-0000-0000-000000000001',
  '93000000-0000-0000-0000-000000000001',
  'Artículo publicado de prueba',
  'posts-test-published',
  'Resumen del artículo publicado.',
  '# Artículo publicado',
  'published',
  now()
),
(
  'bb000000-0000-0000-0000-000000000002',
  'aa000000-0000-0000-0000-000000000002',
  '93000000-0000-0000-0000-000000000002',
  'Artículo borrador de prueba',
  'posts-test-draft',
  'Resumen del artículo borrador.',
  '',
  'draft',
  null
);

-- =========================================================
-- Validaciones de categorías
-- =========================================================

select throws_ok(
  $$
    insert into public.post_categories (
      name,
      slug
    )
    values (
      '   ',
      'categoria-sin-nombre'
    )
  $$,
  '23514',
  null,
  'El nombre de una categoría no puede estar vacío'
);

select throws_ok(
  $$
    insert into public.post_categories (
      name,
      slug
    )
    values (
      'Categoría inválida',
      'Categoria Invalida'
    )
  $$,
  '23514',
  null,
  'El slug de una categoría debe ser válido'
);

select throws_ok(
  $$
    insert into public.post_categories (
      name,
      slug,
      description
    )
    values (
      'Categoría sin descripción',
      'categoria-descripcion-vacia',
      '   '
    )
  $$,
  '23514',
  null,
  'La descripción de una categoría no puede estar vacía'
);

-- =========================================================
-- Validaciones de posts
-- =========================================================

select throws_ok(
  $$
    insert into public.posts (
      title,
      slug,
      excerpt
    )
    values (
      '   ',
      'post-sin-titulo',
      'Resumen válido.'
    )
  $$,
  '23514',
  null,
  'El título de un post no puede estar vacío'
);

select throws_ok(
  $$
    insert into public.posts (
      title,
      slug,
      excerpt
    )
    values (
      'Post con slug inválido',
      'Post Invalido',
      'Resumen válido.'
    )
  $$,
  '23514',
  null,
  'El slug de un post debe ser válido'
);

select throws_ok(
  $$
    insert into public.posts (
      title,
      slug,
      excerpt
    )
    values (
      'Post sin resumen',
      'post-sin-resumen',
      '   '
    )
  $$,
  '23514',
  null,
  'El resumen de un post no puede estar vacío'
);

select throws_ok(
  $$
    insert into public.posts (
      title,
      slug,
      excerpt,
      content_markdown,
      editorial_status,
      published_at
    )
    values (
      'Post publicado sin contenido',
      'post-publicado-sin-contenido',
      'Resumen válido.',
      '',
      'published',
      now()
    )
  $$,
  '23514',
  null,
  'Un post publicado debe tener contenido Markdown'
);

select throws_ok(
  $$
    insert into public.posts (
      title,
      slug,
      excerpt,
      content_markdown,
      editorial_status
    )
    values (
      'Post publicado sin fecha',
      'post-publicado-sin-fecha',
      'Resumen válido.',
      '# Contenido válido',
      'published'
    )
  $$,
  '23514',
  null,
  'Un post publicado debe tener published_at'
);

select throws_ok(
  $$
    insert into public.posts (
      title,
      slug,
      excerpt,
      cover_path
    )
    values (
      'Post con portada absoluta',
      'post-portada-absoluta',
      'Resumen válido.',
      'https://example.com/cover.jpg'
    )
  $$,
  '23514',
  null,
  'La portada debe utilizar una ruta relativa'
);

select throws_ok(
  $$
    insert into public.posts (
      title,
      slug,
      excerpt,
      seo_title
    )
    values (
      'Post con SEO title vacío',
      'post-seo-title-vacio',
      'Resumen válido.',
      '   '
    )
  $$,
  '23514',
  null,
  'seo_title no puede estar vacío cuando está definido'
);

select throws_ok(
  $$
    insert into public.posts (
      title,
      slug,
      excerpt,
      seo_description
    )
    values (
      'Post con SEO description vacío',
      'post-seo-description-vacio',
      'Resumen válido.',
      '   '
    )
  $$,
  '23514',
  null,
  'seo_description no puede estar vacío cuando está definido'
);

select throws_ok(
  $$
    insert into public.posts (
      title,
      slug,
      excerpt,
      source_url
    )
    values (
      'Post con fuente inválida',
      'post-fuente-invalida',
      'Resumen válido.',
      'fuente-sin-protocolo.com'
    )
  $$,
  '23514',
  null,
  'source_url debe utilizar HTTP o HTTPS'
);

select throws_ok(
  $$
    delete from public.post_categories
    where id = 'aa000000-0000-0000-0000-000000000001'
  $$,
  '23503',
  null,
  'No debe eliminarse una categoría utilizada por un post'
);

-- =========================================================
-- Usuario anónimo
-- =========================================================

set local role anon;

select is(
  (select count(*) from public.post_categories),
  2::bigint,
  'El usuario anónimo puede consultar las categorías'
);

select is(
  (select count(*) from public.posts),
  1::bigint,
  'El usuario anónimo solo puede consultar posts publicados'
);

select throws_ok(
  $$
    insert into public.post_categories (
      name,
      slug
    )
    values (
      'Categoría anónima',
      'categoria-anonima'
    )
  $$,
  '42501',
  null,
  'El usuario anónimo no puede crear categorías'
);

select throws_ok(
  $$
    insert into public.posts (
      title,
      slug,
      excerpt
    )
    values (
      'Post anónimo',
      'post-anonimo',
      'Resumen del post anónimo.'
    )
  $$,
  '42501',
  null,
  'El usuario anónimo no puede crear posts'
);

reset role;

-- =========================================================
-- Usuario autenticado sin rol editorial
-- =========================================================

set local role authenticated;

select set_config(
  'request.jwt.claim.sub',
  '93000000-0000-0000-0000-000000000001',
  true
);

select is(
  (select count(*) from public.post_categories),
  2::bigint,
  'Un usuario normal puede consultar las categorías'
);

select is(
  (select count(*) from public.posts),
  1::bigint,
  'Un usuario normal solo puede consultar posts publicados'
);

select throws_ok(
  $$
    insert into public.post_categories (
      name,
      slug
    )
    values (
      'Categoría de usuario',
      'categoria-de-usuario'
    )
  $$,
  '42501',
  null,
  'Un usuario normal no puede crear categorías'
);

select throws_ok(
  $$
    insert into public.posts (
      title,
      slug,
      excerpt
    )
    values (
      'Post de usuario',
      'post-de-usuario',
      'Resumen del post de usuario.'
    )
  $$,
  '42501',
  null,
  'Un usuario normal no puede crear posts'
);

reset role;

-- =========================================================
-- Editor
-- =========================================================

set local role authenticated;

select set_config(
  'request.jwt.claim.sub',
  '93000000-0000-0000-0000-000000000002',
  true
);

select ok(
  private.is_editor(),
  'El usuario de prueba debe ser editor'
);

select is(
  (select count(*) from public.posts),
  2::bigint,
  'El editor puede consultar posts publicados y borradores'
);

select lives_ok(
  $$
    insert into public.post_categories (
      id,
      name,
      slug,
      description,
      created_by,
      updated_by
    )
    values (
      'aa000000-0000-0000-0000-000000000003',
      'Entrevistas de prueba',
      'posts-test-interviews',
      'Categoría creada por un editor.',
      auth.uid(),
      auth.uid()
    )
  $$,
  'El editor puede crear categorías'
);

select lives_ok(
  $$
    update public.post_categories
    set
      description = 'Categoría actualizada por un editor.',
      updated_by = auth.uid()
    where id = 'aa000000-0000-0000-0000-000000000003'
  $$,
  'El editor puede actualizar categorías'
);

select is_empty(
  $$
    delete from public.post_categories
    where id = 'aa000000-0000-0000-0000-000000000003'
    returning id
  $$,
  'El editor no puede eliminar categorías'
);

select lives_ok(
  $$
    insert into public.posts (
      id,
      category_id,
      author_id,
      title,
      slug,
      excerpt,
      content_markdown,
      editorial_status,
      created_by,
      updated_by
    )
    values (
      'bb000000-0000-0000-0000-000000000003',
      'aa000000-0000-0000-0000-000000000003',
      auth.uid(),
      'Entrevista creada por editor',
      'posts-test-editor-interview',
      'Resumen de la entrevista creada por el editor.',
      '',
      'draft',
      auth.uid(),
      auth.uid()
    )
  $$,
  'El editor puede crear posts en borrador'
);

select lives_ok(
  $$
    update public.posts
    set
      content_markdown = '# Entrevista publicada',
      editorial_status = 'published',
      published_at = now(),
      updated_by = auth.uid()
    where id = 'bb000000-0000-0000-0000-000000000003'
  $$,
  'El editor puede completar y publicar posts'
);

select is_empty(
  $$
    delete from public.posts
    where id = 'bb000000-0000-0000-0000-000000000003'
    returning id
  $$,
  'El editor no puede eliminar posts'
);

reset role;

-- =========================================================
-- Administrador
-- =========================================================

set local role authenticated;

select set_config(
  'request.jwt.claim.sub',
  '93000000-0000-0000-0000-000000000003',
  true
);

select ok(
  private.is_admin(),
  'El usuario de prueba debe ser administrador'
);

select results_eq(
  $$
    delete from public.posts
    where id = 'bb000000-0000-0000-0000-000000000003'
    returning id
  $$,
  $$
    values (
      'bb000000-0000-0000-0000-000000000003'::uuid
    )
  $$,
  'El administrador puede eliminar posts'
);

select results_eq(
  $$
    delete from public.post_categories
    where id = 'aa000000-0000-0000-0000-000000000003'
    returning id
  $$,
  $$
    values (
      'aa000000-0000-0000-0000-000000000003'::uuid
    )
  $$,
  'El administrador puede eliminar categorías sin referencias'
);

select * from finish();

rollback;