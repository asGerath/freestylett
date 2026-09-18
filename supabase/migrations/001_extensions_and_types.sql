create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

create type public.editorial_status as enum (
  'draft',
  'published',
  'archived'
);

create type public.event_status as enum (
  'scheduled',
  'live',
  'finished',
  'cancelled',
  'postponed'
);

create type public.event_type as enum (
  'league_round',
  'qualifier',
  'regional',
  'national_final',
  'international_final',
  'tournament',
  'exhibition',
  'other'
);

create type public.participant_role as enum (
  'competitor',
  'host',
  'judge',
  'dj',
  'guest',
  'caster'
);

create type public.app_role as enum (
  'admin',
  'editor',
  'viewer'
);
