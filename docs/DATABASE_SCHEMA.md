# FreeStyle Total — Database Schema

Status: approved design for the Supabase V1 foundation  
Last updated: September 2026

## 1. Purpose

This document defines the database contract for the first Supabase-backed
version of FreeStyle Total. It is the source of truth for the initial SQL
migrations, generated database types, repositories, Row Level Security (RLS),
Storage paths, and editorial workflows.

The schema must support the current informational MVP without prematurely
building rankings, battles, favorites, or community features. Those modules
are considered in the relationships, but their tables will be introduced only
when their product rules are defined.

## 2. Approved product decisions

The following decisions are closed for V1:

1. Editors can create, edit, publish, and archive content.
2. An event can belong to multiple leagues, although most events will have one
   primary league.
3. Editorial articles use Markdown as their canonical body format.
4. Content is archived instead of being physically deleted during normal
   editorial operations.
5. Published content can be read directly from the browser. Public reads are
   protected by RLS and designed to support server rendering, static
   generation, metadata, sitemaps, and search engine indexing.

Administrators retain exclusive control over user roles, destructive
maintenance operations, and exceptional hard deletes.

## 3. Design principles

### 3.1 Relational data first

Countries, leagues, seasons, events, participants, venues, and authors are
stored as related records. JSON must not replace relations that need filtering,
referential integrity, or reuse.

JSONB is reserved for genuinely flexible metadata whose structure does not
drive core application behavior.

### 3.2 UUID primary keys

Every application entity uses a UUID:

```sql
id uuid primary key default gen_random_uuid()
```

UUIDs avoid exposing sequential record counts and work well with distributed
imports, Supabase, and future administration tools.

### 3.3 Stable public slugs

Every public entity has a lowercase, URL-safe slug with a unique constraint.
Slugs are treated as public identifiers and should not change casually after a
page has been indexed.

If slug changes become necessary, a future `slug_redirects` table should
preserve old URLs and issue permanent redirects.

### 3.4 Time and time zones

Database timestamps use `timestamptz`. Events additionally store an IANA time
zone such as `America/Mexico_City` so the original local schedule can always be
displayed correctly.

```sql
starts_at timestamptz not null,
ends_at timestamptz,
time_zone text not null
```

### 3.5 Archiving instead of deleting

Content uses an editorial status rather than normal hard deletion:

```text
draft -> published -> archived
```

Archived content is hidden from anonymous visitors but remains available to
editors and administrators. Hard deletion is reserved for invalid test data,
legal requirements, or administrative maintenance.

### 3.6 Auditable records

Editable content includes:

```sql
created_at timestamptz not null default now(),
updated_at timestamptz not null default now(),
created_by uuid references auth.users(id),
updated_by uuid references auth.users(id)
```

An `updated_at` trigger will keep modification timestamps consistent.

## 4. Status values

V1 uses Postgres enums for fields with a small, product-approved set of values.
Every enum change must be delivered through a migration.

### `editorial_status`

```text
draft
published
archived
```

### `event_status`

```text
scheduled
live
finished
cancelled
postponed
```

### `event_type`

```text
league_round
qualifier
regional
national_final
international_final
tournament
exhibition
other
```

### `participant_role`

```text
competitor
host
judge
dj
guest
caster
```

### `app_role`

```text
admin
editor
viewer
```

## 5. Core V1 tables

### 5.1 `countries`

Canonical country catalog. “International” is not a country; international
entities relate to multiple countries or have no single-country restriction.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `name` | `text` | Required |
| `slug` | `text` | Required, unique |
| `iso_code` | `char(2)` | Required, unique, uppercase |
| `flag_emoji` | `text` | Optional |
| `is_active` | `boolean` | Default `true` |
| `display_order` | `integer` | Default `0` |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Default `now()` |

Initial catalog: Mexico, Argentina, Spain, Colombia, Peru, and Chile.

### 5.2 `organizations`

Brands, promoters, and organizers such as Urban Roosters, Red Bull, God Level,
or BDM.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `country_id` | `uuid` | Optional FK to `countries` |
| `name` | `text` | Required |
| `slug` | `text` | Required, unique |
| `description` | `text` | Optional |
| `logo_path` | `text` | Optional Storage path |
| `website_url` | `text` | Optional |
| `instagram_url` | `text` | Optional |
| `youtube_url` | `text` | Optional |
| `editorial_status` | enum | Default `draft` |
| audit columns | | Required for editorial changes |

### 5.3 `leagues`

A competition identity independent of a specific season or country.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `organization_id` | `uuid` | Optional FK to `organizations` |
| `name` | `text` | Required |
| `slug` | `text` | Required, unique |
| `short_name` | `text` | Optional |
| `description` | `text` | Required |
| `logo_path` | `text` | Optional Storage path |
| social URLs | `text` | Optional |
| `editorial_status` | enum | Default `draft` |
| `published_at` | `timestamptz` | Required when published |
| audit columns | | |

### 5.4 `league_countries`

Many-to-many relation between leagues and countries.

| Column | Type | Rules |
|---|---|---|
| `league_id` | `uuid` | FK to `leagues` |
| `country_id` | `uuid` | FK to `countries` |
| `is_primary` | `boolean` | Default `false` |

Primary key: `(league_id, country_id)`.

### 5.5 `league_seasons`

Represents a league edition or season, allowing rankings and events to remain
historically scoped.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `league_id` | `uuid` | Required FK to `leagues` |
| `name` | `text` | Required |
| `slug` | `text` | Required |
| `year` | `smallint` | Optional |
| `starts_on` | `date` | Optional |
| `ends_on` | `date` | Optional |
| `editorial_status` | enum | Default `draft` |
| audit columns | | |

Unique constraint: `(league_id, slug)`.

### 5.6 `venues`

Reusable physical places. Events can still use provisional location text when
a venue is unknown.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `country_id` | `uuid` | Required FK to `countries` |
| `name` | `text` | Required |
| `slug` | `text` | Required |
| `city` | `text` | Required |
| `region` | `text` | Optional |
| `address` | `text` | Optional |
| `latitude` | `numeric(9,6)` | Optional |
| `longitude` | `numeric(9,6)` | Optional |
| `website_url` | `text` | Optional |
| timestamps | | |

Unique constraint: `(country_id, slug)`.

### 5.7 `freestylers`

Canonical public profiles. Statistics, rankings, and event appearances remain
separate relations rather than mutable columns on the profile.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `country_id` | `uuid` | Optional FK to `countries` |
| `stage_name` | `text` | Required |
| `slug` | `text` | Required, unique |
| `real_name` | `text` | Optional and only when publicly appropriate |
| `aka` | `text` | Optional |
| `bio` | `text` | Optional |
| `city` | `text` | Optional |
| `photo_path` | `text` | Optional Storage path |
| `birth_date` | `date` | Optional |
| social URLs | `text` | Optional |
| `editorial_status` | enum | Default `draft` |
| `published_at` | `timestamptz` | Required when published |
| audit columns | | |

### 5.8 `events`

Core event data. League membership is intentionally not stored here because an
event may belong to several leagues.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `organization_id` | `uuid` | Optional FK to `organizations` |
| `country_id` | `uuid` | Required FK to `countries` |
| `venue_id` | `uuid` | Optional FK to `venues` |
| `title` | `text` | Required |
| `slug` | `text` | Required, unique |
| `description` | `text` | Optional |
| `event_type` | enum | Required |
| `event_status` | enum | Default `scheduled` |
| `editorial_status` | enum | Default `draft` |
| `starts_at` | `timestamptz` | Required |
| `ends_at` | `timestamptz` | Optional; must be after `starts_at` |
| `time_zone` | `text` | Required IANA identifier |
| `city` | `text` | Required |
| `venue_name` | `text` | Optional provisional snapshot |
| `poster_path` | `text` | Optional Storage path |
| `official_url` | `text` | Optional |
| `ticket_url` | `text` | Optional |
| `stream_url` | `text` | Optional |
| `source_url` | `text` | Optional provenance |
| `verified_at` | `timestamptz` | Optional |
| `published_at` | `timestamptz` | Required when published |
| audit columns | | |

### 5.9 `event_leagues`

Many-to-many relationship approved for events that participate in more than
one circuit. Most events will have exactly one row marked as primary.

| Column | Type | Rules |
|---|---|---|
| `event_id` | `uuid` | FK to `events`, cascade on delete |
| `league_id` | `uuid` | FK to `leagues` |
| `season_id` | `uuid` | Optional FK to `league_seasons` |
| `is_primary` | `boolean` | Default `false` |
| `created_at` | `timestamptz` | Default `now()` |

Primary key: `(event_id, league_id)`. A partial unique index enforces at most
one `is_primary = true` row per event. A trigger or deferred validation must
also ensure that `season_id` belongs to the selected `league_id`.

### 5.10 `event_participants`

Participants, hosts, judges, DJs, guests, and casters associated with an event.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `event_id` | `uuid` | Required FK to `events`, cascade on delete |
| `freestyler_id` | `uuid` | Optional FK to `freestylers` |
| `display_name` | `text` | Required historical display value |
| `role` | enum | Required |
| `seed` | `integer` | Optional |
| `display_order` | `integer` | Default `0` |
| `team_name` | `text` | Optional |
| `created_at` | `timestamptz` | Default `now()` |

`freestyler_id` remains optional because not every host, judge, DJ, or guest
needs a full FT profile. `display_name` is retained even when a profile exists
to preserve historical event presentation.

### 5.11 `post_categories`

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `name` | `text` | Required |
| `slug` | `text` | Required, unique |
| `description` | `text` | Optional |
| timestamps | | |

Initial categories: news, recap, analysis, opinion, interview, and guide.

### 5.12 `posts`

Editorial content. Markdown is the canonical body format for V1.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `category_id` | `uuid` | Optional FK to `post_categories` |
| `author_id` | `uuid` | Optional FK to `profiles` |
| `title` | `text` | Required |
| `slug` | `text` | Required, unique |
| `excerpt` | `text` | Required |
| `content_markdown` | `text` | Required |
| `cover_path` | `text` | Optional Storage path |
| `editorial_status` | enum | Default `draft` |
| `published_at` | `timestamptz` | Required when published |
| `seo_title` | `text` | Optional override |
| `seo_description` | `text` | Optional override |
| `source_url` | `text` | Optional provenance |
| audit columns | | |

Markdown is rendered through a controlled server-side pipeline. Raw HTML is
disabled by default and external links must be sanitized.

### 5.13 `profiles`

Application profile linked one-to-one with `auth.users`. Email and credentials
remain exclusively in Supabase Auth.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | PK and FK to `auth.users(id)` |
| `display_name` | `text` | Required |
| `avatar_path` | `text` | Optional |
| timestamps | | |

### 5.14 `user_roles`

| Column | Type | Rules |
|---|---|---|
| `user_id` | `uuid` | FK to `auth.users(id)` |
| `role` | `app_role` | Required |
| `created_at` | `timestamptz` | Default `now()` |

Primary key: `(user_id, role)`. Users cannot grant or modify their own roles.

## 6. SEO contract

Public browser access does not by itself guarantee SEO. The application must
query published rows from Server Components and generate indexable HTML.

Every public entity must expose:

- stable slug;
- public title and description;
- image path when applicable;
- `published_at` and `updated_at`;
- canonical URL generated by the application;
- entity-specific Open Graph metadata;
- only `published` rows in sitemap generation.

`seo_title` and `seo_description` are explicit overrides. When they are null,
the application derives metadata from canonical entity fields.

Draft and archived content must:

- be unavailable to anonymous database queries;
- return `404` or a protected admin preview route;
- never appear in sitemaps;
- never receive a public canonical URL.

Recommended query indexes:

```sql
create index events_public_schedule_idx
  on events (starts_at)
  where editorial_status = 'published';

create index posts_publication_idx
  on posts (published_at desc)
  where editorial_status = 'published';
```

The application still needs `metadataBase`, `generateMetadata`, `sitemap.ts`,
`robots.ts`, and canonical URL handling after the public domain is selected.

## 7. RLS and access model

RLS is enabled on every table exposed through the Supabase API. Grants and RLS
policies are versioned in migrations and tested together.

### Anonymous visitor

- Read published public entities and public catalogs.
- Cannot read drafts or archives.
- Cannot insert, update, archive, or delete.

### Authenticated viewer

- Same public reads as an anonymous visitor.
- Future private profile/favorite access will be scoped to `auth.uid()`.

### Editor

- Read drafts, published content, and archives.
- Create and update editorial entities.
- Publish and archive content.
- Upload and replace public media.
- Cannot manage roles or perform normal hard deletes.

### Administrator

- All editor capabilities.
- Manage roles and operational catalogs.
- Perform exceptional hard deletes and maintenance.

Role checks must be implemented in database functions or policy expressions
against `user_roles`. UI visibility is not authorization.

The `service_role` key bypasses RLS and is restricted to secure server-side or
deployment operations. It must never be prefixed with `NEXT_PUBLIC_` or sent to
the browser.

## 8. Storage model

V1 uses a public bucket named `public-media`. Database columns store object
paths rather than full URLs.

```text
organizations/{organizationId}/logo.webp
leagues/{leagueId}/logo.webp
events/{eventId}/poster.webp
freestylers/{freestylerId}/profile.webp
posts/{postId}/cover.webp
profiles/{userId}/avatar.webp
```

Public visitors can read these objects. Only editors and administrators can
upload, replace, or remove editorial media. Profile avatar policies, when user
accounts are implemented, will be scoped to the authenticated user's folder.

Image validation must limit MIME types and file size before upload. The
application should generate optimized WebP assets and meaningful alt text must
live in entity data or a future media metadata table when one image can have
several editorial contexts.

## 9. Referential actions

Default foreign-key behavior is restrictive. Cascading delete is limited to
pure relationship or dependent tables:

- `event_leagues` cascades when its event is hard-deleted;
- `event_participants` cascades when its event is hard-deleted;
- joining rows such as `league_countries` cascade with their parent;
- deleting a country, league, freestyler, venue, organization, or user with
  referenced published content is restricted.

Normal editorial removal uses `archived`, so referential actions are safety
nets rather than the standard workflow.

## 10. Required indexes

In addition to primary keys and unique constraints:

```text
leagues.organization_id
league_countries.country_id
league_seasons.league_id
venues.country_id
freestylers.country_id
events.country_id
events.organization_id
events.venue_id
events.starts_at
events(event_status, starts_at)
event_leagues.league_id
event_leagues.season_id
event_participants.event_id
event_participants.freestyler_id
posts.category_id
posts.author_id
posts.published_at
user_roles.role
```

Index additions must follow actual query plans. Full-text search can be added
later for posts, events, leagues, and freestylers without changing the core
relationships.

## 11. Validation rules

Migrations must enforce at least:

- lowercase URL-safe slugs;
- uppercase two-letter ISO country codes;
- `ends_at > starts_at` when an event has an end;
- `published_at is not null` for published editorial entities;
- at most one primary league per event;
- an `event_leagues.season_id` belongs to the same `league_id`;
- Storage paths are relative object paths, not full URLs;
- `content_markdown` is not empty for a published post;
- authors cannot assign themselves administrative roles.

## 12. Migration plan

The schema will be implemented incrementally:

```text
001_extensions_and_types.sql
002_shared_functions.sql
003_countries.sql
004_profiles_and_roles.sql
005_organizations.sql
006_leagues_and_seasons.sql
007_venues.sql
008_freestylers.sql
009_events.sql
010_event_relationships.sql
011_posts.sql
012_storage.sql
013_rls.sql
014_seed_catalogs.sql
015_rls_tests.sql
```

Each migration should be small enough to review and reproduce in local,
preview, and production environments. Dashboard-only manual changes are not a
source of truth.

## 13. TypeScript and repository boundary

Supabase database types are generated after migrations and committed as:

```text
src/types/database.types.ts
```

Generated row types are database transport types, not presentation types.
Feature repositories map snake_case rows and joined relations to domain models:

```text
Supabase row
    -> repository mapper
    -> Event / League / Freestyler / BlogPost
    -> UI
```

Components must not contain Supabase queries. The existing event repository
boundary is the reference pattern for the remaining features.

## 14. Deferred modules

The following tables are intentionally deferred until their product rules are
approved:

- `rankings` and `ranking_entries`;
- `battles` and `battle_participants`;
- creators and creator content;
- favorites and followed entities;
- comments, predictions, votes, and notifications;
- slug redirect history;
- structured media metadata;
- full-text search vectors.

Deferring these modules prevents speculative columns and migrations while the
core informational product is being validated.

## 15. Implementation acceptance criteria

The database foundation is complete when:

- every migration applies from an empty local database;
- generated TypeScript types match the migration state;
- anon can read only published content;
- editors can create, publish, update, and archive;
- admins can manage roles;
- no client can use the service-role key;
- Storage write policies reject non-editor users;
- RLS tests cover allow and deny cases for every exposed table;
- event queries support country, league, status, and date filters;
- published entity queries support metadata and sitemap generation;
- the current mock repository can be replaced without changing UI components.
