insert into public.countries (
  id,
  name,
  slug,
  iso_code,
  flag_emoji,
  display_order
)
values
  ('10000000-0000-0000-0000-000000000001', 'México', 'mexico', 'MX', '🇲🇽', 10),
  ('10000000-0000-0000-0000-000000000002', 'Argentina', 'argentina', 'AR', '🇦🇷', 20),
  ('10000000-0000-0000-0000-000000000003', 'España', 'espana', 'ES', '🇪🇸', 30),
  ('10000000-0000-0000-0000-000000000004', 'Colombia', 'colombia', 'CO', '🇨🇴', 40),
  ('10000000-0000-0000-0000-000000000005', 'Perú', 'peru', 'PE', '🇵🇪', 50),
  ('10000000-0000-0000-0000-000000000006', 'Chile', 'chile', 'CL', '🇨🇱', 60)
on conflict (iso_code) do update
set
  name = excluded.name,
  slug = excluded.slug,
  flag_emoji = excluded.flag_emoji,
  display_order = excluded.display_order,
  is_active = true;
