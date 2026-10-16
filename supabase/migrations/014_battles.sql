-- =========================================================
-- Battles and battle participants
-- =========================================================

create type public.battle_stage as enum (
  'group_stage',
  'play_in',
  'round_of_32',
  'round_of_16',
  'quarterfinal',
  'semifinal',
  'third_place',
  'final',
  'regular_round',
  'exhibition',
  'other'
);

create type public.battle_format as enum (
  'one_vs_one',
  'two_vs_two',
  'three_vs_three',
  'crew',
  'other'
);

create type public.battle_decision_type as enum (
  'direct',
  'replica',
  'jury',
  'technical',
  'walkover',
  'draw'
);

-- =========================================================
-- Battles
-- =========================================================

create table public.battles (
  id uuid primary key default gen_random_uuid(),

  event_id uuid not null
    references public.events(id)
    on delete cascade,

  season_id uuid
    references public.league_seasons(id)
    on delete restrict,

  title text not null,
  slug text not null,
  battle_order integer not null,

  stage public.battle_stage not null,
  battle_format public.battle_format not null,
  battle_status public.event_status not null default 'scheduled',

  winner_side integer,
  decision_type public.battle_decision_type,

  video_url text,
  source_url text not null,

  editorial_status public.editorial_status not null default 'draft',
  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  created_by uuid
    references auth.users(id)
    on delete set null,

  updated_by uuid
    references auth.users(id)
    on delete set null,

  constraint battles_title_not_blank
    check (length(trim(title)) > 0),

  constraint battles_slug_valid
    check (private.is_valid_slug(slug)),

  constraint battles_order_positive
    check (battle_order > 0),

  constraint battles_winner_side_positive
    check (
      winner_side is null
      or winner_side > 0
    ),

  constraint battles_video_url_valid
    check (
      video_url is null
      or video_url ~ '^https?://'
    ),

  constraint battles_source_url_valid
    check (source_url ~ '^https?://'),

  constraint battles_published_at_required
    check (
      editorial_status <> 'published'
      or published_at is not null
    ),

  constraint battles_result_only_when_finished
    check (
      battle_status = 'finished'
      or (
        winner_side is null
        and decision_type is null
      )
    ),

  constraint battles_finished_result_required
    check (
      battle_status <> 'finished'
      or decision_type is not null
    ),

  constraint battles_draw_has_no_winner
    check (
      decision_type <> 'draw'
      or winner_side is null
    ),

  constraint battles_non_draw_has_winner
    check (
      battle_status <> 'finished'
      or decision_type = 'draw'
      or winner_side is not null
    ),

  constraint battles_slug_unique
    unique (slug),

  constraint battles_event_order_unique
    unique (event_id, battle_order)
);

create index battles_event_order_idx
  on public.battles (
    event_id,
    battle_order
  );

create index battles_season_idx
  on public.battles (season_id)
  where season_id is not null;

create index battles_status_idx
  on public.battles (
    battle_status,
    event_id
  );

create index battles_publication_idx
  on public.battles (published_at desc)
  where editorial_status = 'published';

create trigger battles_set_updated_at
before update on public.battles
for each row
execute function private.set_updated_at();

-- =========================================================
-- Battle and season validation
-- =========================================================

create or replace function private.validate_battle_season()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.season_id is null then
    return new;
  end if;

  if not exists (
    select 1
    from public.event_leagues
    where event_leagues.event_id = new.event_id
      and event_leagues.season_id = new.season_id
  ) then
    raise exception
      'Battle season must be associated with the selected event'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all
on function private.validate_battle_season()
from public;

grant execute
on function private.validate_battle_season()
to postgres, service_role;

create trigger battles_validate_season
before insert or update of event_id, season_id
on public.battles
for each row
execute function private.validate_battle_season();

-- =========================================================
-- Battle participants
-- =========================================================

create table public.battle_participants (
  id uuid primary key default gen_random_uuid(),

  battle_id uuid not null
    references public.battles(id)
    on delete cascade,

  freestyler_id uuid not null
    references public.freestylers(id)
    on delete restrict,

  side_number integer not null,
  slot_number integer not null,

  score numeric(10, 2),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  created_by uuid
    references auth.users(id)
    on delete set null,

  updated_by uuid
    references auth.users(id)
    on delete set null,

  constraint battle_participants_side_positive
    check (side_number > 0),

  constraint battle_participants_slot_positive
    check (slot_number > 0),

  constraint battle_participants_score_nonnegative
    check (
      score is null
      or score >= 0
    ),

  constraint battle_participants_freestyler_unique
    unique (battle_id, freestyler_id),

  constraint battle_participants_side_slot_unique
    unique (
      battle_id,
      side_number,
      slot_number
    )
);

create index battle_participants_battle_order_idx
  on public.battle_participants (
    battle_id,
    side_number,
    slot_number
  );

create index battle_participants_freestyler_idx
  on public.battle_participants (freestyler_id);

create trigger battle_participants_set_updated_at
before update on public.battle_participants
for each row
execute function private.set_updated_at();

-- =========================================================
-- Battle participant validation
-- =========================================================

create or replace function private.validate_battle_participant()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_event_id uuid;
  selected_season_id uuid;
begin
  select
    battles.event_id,
    battles.season_id
  into
    selected_event_id,
    selected_season_id
  from public.battles
  where battles.id = new.battle_id;

  -- The foreign key rejects a nonexistent battle.
  if not found then
    return new;
  end if;

  if not exists (
    select 1
    from public.event_participants
    where event_participants.event_id = selected_event_id
      and event_participants.freestyler_id = new.freestyler_id
      and event_participants.role = 'competitor'
  ) then
    raise exception
      'Battle participant must be registered as an event competitor'
      using errcode = '23514';
  end if;

  if selected_season_id is not null
    and not exists (
      select 1
      from public.league_season_participants
      where league_season_participants.season_id =
        selected_season_id
        and league_season_participants.freestyler_id =
          new.freestyler_id
        and league_season_participants.is_active = true
    )
  then
    raise exception
      'Battle participant must be active in the selected league season'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all
on function private.validate_battle_participant()
from public;

grant execute
on function private.validate_battle_participant()
to postgres, service_role;

create trigger battle_participants_validate_relationships
before insert or update of battle_id, freestyler_id
on public.battle_participants
for each row
execute function private.validate_battle_participant();

-- =========================================================
-- Winner validation
-- =========================================================

create or replace function private.validate_battle_winner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.winner_side is null then
    return new;
  end if;

  if not exists (
    select 1
    from public.battle_participants
    where battle_participants.battle_id = new.id
      and battle_participants.side_number = new.winner_side
  ) then
    raise exception
      'Battle winner side must contain at least one participant'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all
on function private.validate_battle_winner()
from public;

grant execute
on function private.validate_battle_winner()
to postgres, service_role;

create trigger battles_validate_winner
before update of winner_side
on public.battles
for each row
execute function private.validate_battle_winner();

-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.battles enable row level security;
alter table public.battle_participants enable row level security;

revoke all
on table public.battles
from anon, authenticated;

revoke all
on table public.battle_participants
from anon, authenticated;

grant select
on table public.battles
to anon, authenticated;

grant select
on table public.battle_participants
to anon, authenticated;

grant insert, update, delete
on table public.battles
to authenticated;

grant insert, update, delete
on table public.battle_participants
to authenticated;

-- =========================================================
-- Battle policies
-- =========================================================

create policy "Public can read published battles"
on public.battles
for select
to anon, authenticated
using (
  editorial_status = 'published'
  and exists (
    select 1
    from public.events
    where events.id = battles.event_id
      and events.editorial_status = 'published'
  )
  and (
    battles.season_id is null
    or exists (
      select 1
      from public.league_seasons
      join public.leagues
        on leagues.id = league_seasons.league_id
      where league_seasons.id = battles.season_id
        and league_seasons.editorial_status = 'published'
        and leagues.editorial_status = 'published'
    )
  )
);

create policy "Editors can read all battles"
on public.battles
for select
to authenticated
using (
  private.is_editor()
);

create policy "Editors can insert battles"
on public.battles
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update battles"
on public.battles
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Admins can delete battles"
on public.battles
for delete
to authenticated
using (
  private.is_admin()
);

-- =========================================================
-- Battle participant policies
-- =========================================================

create policy "Public can read participants of published battles"
on public.battle_participants
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.battles
    join public.events
      on events.id = battles.event_id
    join public.freestylers
      on freestylers.id =
        battle_participants.freestyler_id
    where battles.id = battle_participants.battle_id
      and battles.editorial_status = 'published'
      and events.editorial_status = 'published'
      and freestylers.editorial_status = 'published'
  )
);

create policy "Editors can read all battle participants"
on public.battle_participants
for select
to authenticated
using (
  private.is_editor()
);

create policy "Editors can insert battle participants"
on public.battle_participants
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update battle participants"
on public.battle_participants
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Editors can delete battle participants"
on public.battle_participants
for delete
to authenticated
using (
  private.is_editor()
);