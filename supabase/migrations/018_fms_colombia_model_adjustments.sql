-- FMS Colombia model adjustments approved during editorial review.
-- 1. Persist official MVP counts in ranking snapshots.
-- 2. Preserve historical play-in participants after they become inactive.

alter table public.ranking_entries
  add column mvp_count integer not null default 0;

alter table public.ranking_entries
  add constraint ranking_entries_mvp_count_nonnegative
  check (mvp_count >= 0);

create or replace function private.validate_battle_participant()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_event_id uuid;
  selected_season_id uuid;
  selected_battle_stage public.battle_stage;
begin
  select
    battles.event_id,
    battles.season_id,
    battles.stage
  into
    selected_event_id,
    selected_season_id,
    selected_battle_stage
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
        and (
          league_season_participants.is_active = true
          or selected_battle_stage = 'play_in'
        )
    )
  then
    raise exception
      'Battle participant must be active in the selected league season unless the battle is a play-in'
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
