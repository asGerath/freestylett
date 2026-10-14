-- =========================================================
-- Rankings, season participants and historical standings
-- =========================================================

-- =========================================================
-- Season participants
-- =========================================================

create table public.league_season_participants (
  id uuid primary key default gen_random_uuid(),

  season_id uuid not null
    references public.league_seasons(id)
    on delete cascade,

  freestyler_id uuid not null
    references public.freestylers(id)
    on delete restrict,

  seed integer,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,

  constraint league_season_participants_seed_positive
    check (
      seed is null
      or seed > 0
    ),

  constraint league_season_participants_unique
    unique (season_id, freestyler_id)
);

create index league_season_participants_season_idx
  on public.league_season_participants (season_id);

create index league_season_participants_freestyler_idx
  on public.league_season_participants (freestyler_id);

create index league_season_participants_active_idx
  on public.league_season_participants (season_id, seed)
  where is_active = true;

create trigger league_season_participants_set_updated_at
before update on public.league_season_participants
for each row
execute function private.set_updated_at();

-- =========================================================
-- Ranking snapshots
-- =========================================================

create table public.ranking_snapshots (
  id uuid primary key default gen_random_uuid(),

  season_id uuid not null
    references public.league_seasons(id)
    on delete cascade,

  event_id uuid
    references public.events(id)
    on delete set null,

  name text not null,
  captured_at timestamptz not null,
  source_url text not null,

  is_current boolean not null default false,

  editorial_status public.editorial_status not null default 'draft',
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,

  constraint ranking_snapshots_name_not_blank
    check (length(trim(name)) > 0),

  constraint ranking_snapshots_source_url_valid
    check (source_url ~ '^https?://'),

  constraint ranking_snapshots_published_at_required
    check (
      editorial_status <> 'published'
      or published_at is not null
    ),

  constraint ranking_snapshots_current_must_be_published
    check (
      is_current = false
      or editorial_status = 'published'
    )
);

create index ranking_snapshots_season_idx
  on public.ranking_snapshots (season_id, captured_at desc);

create index ranking_snapshots_event_idx
  on public.ranking_snapshots (event_id)
  where event_id is not null;

create index ranking_snapshots_publication_idx
  on public.ranking_snapshots (published_at desc)
  where editorial_status = 'published';

create unique index ranking_snapshots_one_current_per_season_idx
  on public.ranking_snapshots (season_id)
  where is_current = true;

create trigger ranking_snapshots_set_updated_at
before update on public.ranking_snapshots
for each row
execute function private.set_updated_at();

-- =========================================================
-- Ranking entries
-- =========================================================

create table public.ranking_entries (
  id uuid primary key default gen_random_uuid(),

  snapshot_id uuid not null
    references public.ranking_snapshots(id)
    on delete cascade,

  participant_id uuid not null
    references public.league_season_participants(id)
    on delete restrict,

  ranking_group text not null default 'general',
  position integer not null,

  matches_played integer not null default 0,
  battle_wins integer not null default 0,
  battle_wins_after_replica integer not null default 0,
  battle_losses_after_replica integer not null default 0,
  battle_losses integer not null default 0,

  points numeric(8, 2) not null default 0,
  score_total numeric(10, 2) not null default 0,
  penalty_points numeric(8, 2) not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,

  constraint ranking_entries_group_valid
    check (private.is_valid_slug(ranking_group)),

  constraint ranking_entries_position_positive
    check (position > 0),

  constraint ranking_entries_matches_nonnegative
    check (matches_played >= 0),

  constraint ranking_entries_wins_nonnegative
    check (battle_wins >= 0),

  constraint ranking_entries_replica_wins_nonnegative
    check (battle_wins_after_replica >= 0),

  constraint ranking_entries_replica_losses_nonnegative
    check (battle_losses_after_replica >= 0),

  constraint ranking_entries_losses_nonnegative
    check (battle_losses >= 0),

  constraint ranking_entries_points_nonnegative
    check (points >= 0),

  constraint ranking_entries_score_nonnegative
    check (score_total >= 0),

  constraint ranking_entries_penalties_nonnegative
    check (penalty_points >= 0),

  constraint ranking_entries_participant_unique
    unique (snapshot_id, participant_id),

  constraint ranking_entries_position_unique
    unique (snapshot_id, ranking_group, position)
);

create index ranking_entries_snapshot_order_idx
  on public.ranking_entries (
    snapshot_id,
    ranking_group,
    position
  );

create index ranking_entries_participant_idx
  on public.ranking_entries (participant_id);

create trigger ranking_entries_set_updated_at
before update on public.ranking_entries
for each row
execute function private.set_updated_at();

-- =========================================================
-- Cross-table season validation
-- =========================================================

create or replace function private.validate_ranking_entry_season()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  snapshot_season_id uuid;
  participant_season_id uuid;
begin
  select season_id
  into snapshot_season_id
  from public.ranking_snapshots
  where id = new.snapshot_id;

  select season_id
  into participant_season_id
  from public.league_season_participants
  where id = new.participant_id;

  if snapshot_season_id is null then
    raise exception
      'Ranking snapshot % does not exist.',
      new.snapshot_id;
  end if;

  if participant_season_id is null then
    raise exception
      'Season participant % does not exist.',
      new.participant_id;
  end if;

  if snapshot_season_id <> participant_season_id then
    raise exception
      'Ranking entry snapshot and participant must belong to the same season.';
  end if;

  return new;
end;
$$;

create trigger ranking_entries_validate_season
before insert or update of snapshot_id, participant_id
on public.ranking_entries
for each row
execute function private.validate_ranking_entry_season();

-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.league_season_participants enable row level security;
alter table public.ranking_snapshots enable row level security;
alter table public.ranking_entries enable row level security;

revoke all
on table public.league_season_participants
from anon, authenticated;

revoke all
on table public.ranking_snapshots
from anon, authenticated;

revoke all
on table public.ranking_entries
from anon, authenticated;

grant select
on table public.league_season_participants
to anon, authenticated;

grant select
on table public.ranking_snapshots
to anon, authenticated;

grant select
on table public.ranking_entries
to anon, authenticated;

grant insert, update, delete
on table public.league_season_participants
to authenticated;

grant insert, update, delete
on table public.ranking_snapshots
to authenticated;

grant insert, update, delete
on table public.ranking_entries
to authenticated;

-- =========================================================
-- Season participant policies
-- =========================================================

create policy "Public can read participants of published seasons"
on public.league_season_participants
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.league_seasons
    join public.leagues
      on leagues.id = league_seasons.league_id
    join public.freestylers
      on freestylers.id =
        league_season_participants.freestyler_id
    where league_seasons.id =
      league_season_participants.season_id
      and league_seasons.editorial_status = 'published'
      and leagues.editorial_status = 'published'
      and freestylers.editorial_status = 'published'
  )
);

create policy "Editors can read all season participants"
on public.league_season_participants
for select
to authenticated
using (
  private.is_editor()
);

create policy "Editors can insert season participants"
on public.league_season_participants
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update season participants"
on public.league_season_participants
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Admins can delete season participants"
on public.league_season_participants
for delete
to authenticated
using (
  private.is_admin()
);

-- =========================================================
-- Ranking snapshot policies
-- =========================================================

create policy "Public can read published ranking snapshots"
on public.ranking_snapshots
for select
to anon, authenticated
using (
  editorial_status = 'published'
  and exists (
    select 1
    from public.league_seasons
    join public.leagues
      on leagues.id = league_seasons.league_id
    where league_seasons.id = ranking_snapshots.season_id
      and league_seasons.editorial_status = 'published'
      and leagues.editorial_status = 'published'
  )
);

create policy "Editors can read all ranking snapshots"
on public.ranking_snapshots
for select
to authenticated
using (
  private.is_editor()
);

create policy "Editors can insert ranking snapshots"
on public.ranking_snapshots
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update ranking snapshots"
on public.ranking_snapshots
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Admins can delete ranking snapshots"
on public.ranking_snapshots
for delete
to authenticated
using (
  private.is_admin()
);

-- =========================================================
-- Ranking entry policies
-- =========================================================

create policy "Public can read entries of published rankings"
on public.ranking_entries
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.ranking_snapshots
    where ranking_snapshots.id = ranking_entries.snapshot_id
      and ranking_snapshots.editorial_status = 'published'
  )
);

create policy "Editors can read all ranking entries"
on public.ranking_entries
for select
to authenticated
using (
  private.is_editor()
);

create policy "Editors can insert ranking entries"
on public.ranking_entries
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update ranking entries"
on public.ranking_entries
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Admins can delete ranking entries"
on public.ranking_entries
for delete
to authenticated
using (
  private.is_admin()
);