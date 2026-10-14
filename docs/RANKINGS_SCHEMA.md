# FreeStyle Total — Rankings Schema

Status: implemented and validated  
Last updated: October 2026

## Purpose

Define the relational model required to:

- Associate freestylers with league seasons.
- Store the current standings.
- Preserve standings after every league round.
- Support different ranking groups.
- Record official sources and verification dates.
- Prevent duplicate participants and positions.

## Implementation status

Implemented in `supabase/migrations/013_rankings.sql`.

Validation includes:

- 30 pgTAP tests covering schema constraints and RLS behavior.
- Anonymous, regular authenticated, editor, and administrator access.
- Cross-season participant protection through a database trigger.
- Generated TypeScript definitions in `src/types/database.types.ts`.
- Successful lint, production build, and whitespace validation.

The database foundation and public application integration are complete.

Implemented application behavior:

- Repository and service boundaries under `src/features/rankings`.
- Public `/rankings` route with metadata, empty, loading, and error states.
- Accessible responsive table for current published snapshots.
- Rankings navigation and sitemap entry.
- Current ranking embedded in league detail pages.
- Fictional development seed for repeatable local validation.
- RLS tests isolated from existing development data.

Administrative creation, editing, publishing, and historical snapshot management
remain separate application-layer work.

## Tables

### `league_season_participants`

Represents a freestyler registered in a league season.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `season_id` | `uuid` | Required, references `league_seasons` |
| `freestyler_id` | `uuid` | Required, references `freestylers` |
| `seed` | `integer` | Optional, positive |
| `is_active` | `boolean` | Default `true` |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Default `now()` |
| `created_by` | `uuid` | Optional audit user |
| `updated_by` | `uuid` | Optional audit user |

A freestyler can appear only once in the same season.

### `ranking_snapshots`

Represents a published or draft classification captured at a specific moment.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `season_id` | `uuid` | Required |
| `event_id` | `uuid` | Optional related jornada |
| `name` | `text` | Required |
| `captured_at` | `timestamptz` | Required |
| `source_url` | `text` | Required official source |
| `is_current` | `boolean` | Default `false` |
| `editorial_status` | `editorial_status` | Default `draft` |
| `published_at` | `timestamptz` | Required when published |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Default `now()` |
| `created_by` | `uuid` | Optional audit user |
| `updated_by` | `uuid` | Optional audit user |

Only one snapshot can be marked as current per season.

### `ranking_entries`

Represents one participant’s position inside a snapshot.

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | Primary key |
| `snapshot_id` | `uuid` | Required |
| `participant_id` | `uuid` | Required |
| `ranking_group` | `text` | Default `general` |
| `position` | `integer` | Required, positive |
| `matches_played` | `integer` | Default `0` |
| `battle_wins` | `integer` | Default `0` |
| `battle_wins_after_replica` | `integer` | Default `0` |
| `battle_losses_after_replica` | `integer` | Default `0` |
| `battle_losses` | `integer` | Default `0` |
| `points` | `numeric(8,2)` | Default `0` |
| `score_total` | `numeric(10,2)` | Default `0` |
| `penalty_points` | `numeric(8,2)` | Default `0` |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Default `now()` |

A participant can appear only once per snapshot. A position can appear only
once inside the same snapshot and ranking group.

## Publication rules

- Anonymous users can read only published snapshots and their entries.
- Editors can create, update and archive rankings.
- Administrators retain hard-delete permissions.
- A published snapshot requires `published_at`.
- Draft standings must never appear on public pages.
- Entries cannot reference participants from a different season.

## Snapshot workflow

1. Register the season participants.
2. Create a draft snapshot.
3. Add and validate every ranking entry.
4. Store the official source URL.
5. Mark the previous snapshot as not current.
6. Publish the new snapshot as current.
7. Preserve previous snapshots as historical records.

## FMS field mapping

| Official field | Database column |
|---|---|
| MC | `matches_played` |
| BG | `battle_wins` |
| BGR | `battle_wins_after_replica` |
| BPR | `battle_losses_after_replica` |
| BP | `battle_losses` |
| PTS | `points` |
| PTB | `score_total` |