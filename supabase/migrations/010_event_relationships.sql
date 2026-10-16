-- =========================================================
-- Validación de temporada y liga
-- =========================================================

create or replace function private.validate_event_league_season()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  season_league_id uuid;
begin
  if new.season_id is null then
    return new;
  end if;

  select league_seasons.league_id
  into season_league_id
  from public.league_seasons
  where league_seasons.id = new.season_id;

  -- La llave foránea se encargará de rechazar temporadas inexistentes.
  if not found then
    return new;
  end if;

  if season_league_id <> new.league_id then
    raise exception
      'Event league season must belong to the selected league'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all
on function private.validate_event_league_season()
from public;

grant execute
on function private.validate_event_league_season()
to postgres, service_role;


-- =========================================================
-- Relación entre eventos, ligas y temporadas
-- =========================================================

create table public.event_leagues (
  event_id uuid not null
    references public.events(id)
    on delete cascade,

  league_id uuid not null
    references public.leagues(id)
    on delete restrict,

  season_id uuid
    references public.league_seasons(id)
    on delete restrict,

  is_primary boolean not null default false,

  created_at timestamptz not null default now(),

  created_by uuid
    references auth.users(id)
    on delete set null,

  primary key (event_id, league_id)
);

create unique index event_leagues_one_primary_idx
  on public.event_leagues (event_id)
  where is_primary = true;

create index event_leagues_league_idx
  on public.event_leagues (league_id);

create index event_leagues_season_idx
  on public.event_leagues (season_id);

create trigger event_leagues_validate_season
before insert or update of league_id, season_id
on public.event_leagues
for each row
execute function private.validate_event_league_season();


-- =========================================================
-- Participantes de eventos
-- =========================================================

create table public.event_participants (
  id uuid primary key default gen_random_uuid(),

  event_id uuid not null
    references public.events(id)
    on delete cascade,

  freestyler_id uuid
    references public.freestylers(id)
    on delete restrict,

  display_name text not null,
  role public.participant_role not null,

  seed integer,
  display_order integer not null default 0,
  team_name text,

  created_at timestamptz not null default now(),

  created_by uuid
    references auth.users(id)
    on delete set null,

  constraint event_participants_display_name_not_blank
    check (length(trim(display_name)) > 0),

  constraint event_participants_seed_positive
    check (
      seed is null
      or seed > 0
    ),

  constraint event_participants_display_order_valid
    check (display_order >= 0),

  constraint event_participants_team_name_not_blank
    check (
      team_name is null
      or length(trim(team_name)) > 0
    )
);

create index event_participants_event_idx
  on public.event_participants (event_id);

create index event_participants_freestyler_idx
  on public.event_participants (freestyler_id);


-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.event_leagues enable row level security;
alter table public.event_participants enable row level security;

revoke all
on table public.event_leagues
from anon, authenticated;

revoke all
on table public.event_participants
from anon, authenticated;

grant select
on table public.event_leagues
to anon, authenticated;

grant select
on table public.event_participants
to anon, authenticated;

grant insert, update, delete
on table public.event_leagues
to authenticated;

grant insert, update, delete
on table public.event_participants
to authenticated;


-- =========================================================
-- Políticas de event_leagues
-- =========================================================

create policy "Public can read leagues of published events"
on public.event_leagues
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.events
    where events.id = event_leagues.event_id
      and events.editorial_status = 'published'
  )
  and exists (
    select 1
    from public.leagues
    where leagues.id = event_leagues.league_id
      and leagues.editorial_status = 'published'
  )
  and (
    event_leagues.season_id is null
    or exists (
      select 1
      from public.league_seasons
      where league_seasons.id = event_leagues.season_id
        and league_seasons.editorial_status = 'published'
    )
  )
);

create policy "Editors can read all event leagues"
on public.event_leagues
for select
to authenticated
using (
  private.is_editor()
);

create policy "Editors can insert event leagues"
on public.event_leagues
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update event leagues"
on public.event_leagues
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Editors can delete event leagues"
on public.event_leagues
for delete
to authenticated
using (
  private.is_editor()
);


-- =========================================================
-- Políticas de event_participants
-- =========================================================

create policy "Public can read participants of published events"
on public.event_participants
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.events
    where events.id = event_participants.event_id
      and events.editorial_status = 'published'
  )
);

create policy "Editors can read all event participants"
on public.event_participants
for select
to authenticated
using (
  private.is_editor()
);

create policy "Editors can insert event participants"
on public.event_participants
for insert
to authenticated
with check (
  private.is_editor()
);

create policy "Editors can update event participants"
on public.event_participants
for update
to authenticated
using (
  private.is_editor()
)
with check (
  private.is_editor()
);

create policy "Editors can delete event participants"
on public.event_participants
for delete
to authenticated
using (
  private.is_editor()
);