-- Allow drafts to be registered before an official source is available.

alter table public.battles
  alter column source_url drop not null;

alter table public.battles
  drop constraint battles_source_url_valid;

alter table public.battles
  add constraint battles_source_url_valid
  check (
    source_url is null
    or source_url ~ '^https?://'
  );
