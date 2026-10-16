create table public.organizations (
  id uuid primary key default gen_random_uuid(),

  country_id uuid references public.countries(id) on delete restrict,

  name text not null,
  slug text not null unique,
  description text,
  logo_path text,

  website_url text,
  instagram_url text,
  youtube_url text,

  editorial_status public.editorial_status not null default 'draft',
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,

  constraint organizations_name_not_blank
    check (length(trim(name)) > 0),

  constraint organizations_slug_valid
    check (private.is_valid_slug(slug)),

  constraint organizations_description_not_blank
    check (
      description is null
      or length(trim(description)) > 0
    ),

  constraint organizations_logo_relative_path
    check (
      logo_path is null
      or logo_path !~ '^(https?:)?//'
    ),

  constraint organizations_website_url_valid
    check (
      website_url is null
      or website_url ~ '^https?://'
    ),

  constraint organizations_instagram_url_valid
    check (
      instagram_url is null
      or instagram_url ~ '^https?://'
    ),

  constraint organizations_youtube_url_valid
    check (
      youtube_url is null
      or youtube_url ~ '^https?://'
    ),

  constraint organizations_published_at_required
    check (
      editorial_status <> 'published'
      or published_at is not null
    )
);

create index organizations_country_idx
  on public.organizations (country_id);

create index organizations_publication_idx
  on public.organizations (published_at desc)
  where editorial_status = 'published';

create trigger organizations_set_updated_at
before update on public.organizations
for each row
execute function private.set_updated_at();

alter table public.organizations enable row level security;

revoke all on table public.organizations from anon, authenticated;

grant select
on table public.organizations
to anon, authenticated;

grant insert, update, delete
on table public.organizations
to authenticated;

create policy "Public can read published organizations"
on public.organizations
for select
to anon, authenticated
using (
  editorial_status = 'published'
);

create policy "Editors can read all organizations"
on public.organizations
for select
to authenticated
using (
  private.is_editor()
);

create policy "Editors can insert organizations"
on public.organizations
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update organizations"
on public.organizations
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Admins can delete organizations"
on public.organizations
for delete
to authenticated
using (
  private.is_admin()
);