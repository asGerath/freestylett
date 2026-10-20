-- =========================================================
-- Battle participant format limits
-- =========================================================

-- Every battle represents a confrontation between two sides.
alter table public.battle_participants
  add constraint battle_participants_side_supported
  check (side_number <= 2);

-- =========================================================
-- Validate participant slots against the battle format
-- =========================================================

create or replace function private.validate_battle_participant_format()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_format public.battle_format;
  maximum_slot integer;
begin
  select battles.battle_format
  into selected_format
  from public.battles
  where battles.id = new.battle_id;

  -- The foreign key handles nonexistent battles.
  if not found then
    return new;
  end if;

  maximum_slot :=
    case selected_format
      when 'one_vs_one' then 1
      when 'two_vs_two' then 2
      when 'three_vs_three' then 3
      else null
    end;

  if maximum_slot is not null
    and new.slot_number > maximum_slot
  then
    raise exception
      'Battle participant slot exceeds the selected battle format'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all
on function private.validate_battle_participant_format()
from public;

grant execute
on function private.validate_battle_participant_format()
to postgres, service_role;

create trigger battle_participants_validate_format
before insert or update of
  battle_id,
  side_number,
  slot_number
on public.battle_participants
for each row
execute function private.validate_battle_participant_format();

-- =========================================================
-- Prevent incompatible battle format changes
-- =========================================================

create or replace function private.validate_battle_format_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  maximum_slot integer;
begin
  maximum_slot :=
    case new.battle_format
      when 'one_vs_one' then 1
      when 'two_vs_two' then 2
      when 'three_vs_three' then 3
      else null
    end;

  if maximum_slot is not null
    and exists (
      select 1
      from public.battle_participants
      where battle_participants.battle_id = new.id
        and battle_participants.slot_number >
          maximum_slot
    )
  then
    raise exception
      'Existing participants exceed the selected battle format'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all
on function private.validate_battle_format_change()
from public;

grant execute
on function private.validate_battle_format_change()
to postgres, service_role;

create trigger battles_validate_format_change
before update of battle_format
on public.battles
for each row
when (
  old.battle_format is distinct from
  new.battle_format
)
execute function private.validate_battle_format_change();