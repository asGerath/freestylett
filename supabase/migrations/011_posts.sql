-- =========================================================
-- Categorías editoriales
-- =========================================================

create table public.post_categories (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null unique,
  description text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  created_by uuid
    references auth.users(id)
    on delete set null,

  updated_by uuid
    references auth.users(id)
    on delete set null,

  constraint post_categories_name_not_blank
    check (length(trim(name)) > 0),

  constraint post_categories_slug_valid
    check (private.is_valid_slug(slug)),

  constraint post_categories_description_not_blank
    check (
      description is null
      or length(trim(description)) > 0
    )
);

create trigger post_categories_set_updated_at
before update on public.post_categories
for each row
execute function private.set_updated_at();


-- =========================================================
-- Artículos editoriales
-- =========================================================

create table public.posts (
  id uuid primary key default gen_random_uuid(),

  category_id uuid
    references public.post_categories(id)
    on delete restrict,

  author_id uuid
    references public.profiles(id)
    on delete set null,

  title text not null,
  slug text not null unique,

  excerpt text not null,
  content_markdown text not null default '',

  cover_path text,

  editorial_status public.editorial_status not null default 'draft',
  published_at timestamptz,

  seo_title text,
  seo_description text,

  source_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  created_by uuid
    references auth.users(id)
    on delete set null,

  updated_by uuid
    references auth.users(id)
    on delete set null,

  constraint posts_title_not_blank
    check (length(trim(title)) > 0),

  constraint posts_slug_valid
    check (private.is_valid_slug(slug)),

  constraint posts_excerpt_not_blank
    check (length(trim(excerpt)) > 0),

  constraint posts_published_content_required
    check (
      editorial_status <> 'published'
      or length(trim(content_markdown)) > 0
    ),

  constraint posts_cover_relative_path
    check (
      cover_path is null
      or cover_path !~ '^(https?:)?//'
    ),

  constraint posts_seo_title_not_blank
    check (
      seo_title is null
      or length(trim(seo_title)) > 0
    ),

  constraint posts_seo_description_not_blank
    check (
      seo_description is null
      or length(trim(seo_description)) > 0
    ),

  constraint posts_source_url_valid
    check (
      source_url is null
      or source_url ~ '^https?://'
    ),

  constraint posts_published_at_required
    check (
      editorial_status <> 'published'
      or published_at is not null
    )
);

create index posts_category_idx
  on public.posts (category_id);

create index posts_author_idx
  on public.posts (author_id);

create index posts_publication_idx
  on public.posts (published_at desc)
  where editorial_status = 'published';

create trigger posts_set_updated_at
before update on public.posts
for each row
execute function private.set_updated_at();


-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.post_categories enable row level security;
alter table public.posts enable row level security;

revoke all
on table public.post_categories
from anon, authenticated;

revoke all
on table public.posts
from anon, authenticated;

grant select
on table public.post_categories
to anon, authenticated;

grant select
on table public.posts
to anon, authenticated;

grant insert, update, delete
on table public.post_categories
to authenticated;

grant insert, update, delete
on table public.posts
to authenticated;


-- =========================================================
-- Políticas de categorías
-- =========================================================

create policy "Public can read post categories"
on public.post_categories
for select
to anon, authenticated
using (
  true
);

create policy "Editors can insert post categories"
on public.post_categories
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update post categories"
on public.post_categories
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Admins can delete post categories"
on public.post_categories
for delete
to authenticated
using (
  private.is_admin()
);


-- =========================================================
-- Políticas de artículos
-- =========================================================

create policy "Public can read published posts"
on public.posts
for select
to anon, authenticated
using (
  editorial_status = 'published'
);

create policy "Editors can read all posts"
on public.posts
for select
to authenticated
using (
  private.is_editor()
);

create policy "Editors can insert posts"
on public.posts
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update posts"
on public.posts
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Admins can delete posts"
on public.posts
for delete
to authenticated
using (
  private.is_admin()
);