# Importaciones controladas

Estos archivos cargan información real investigada y aprobada. No forman parte
de las migraciones estructurales ni del seed de demostración.

## FMS Colombia 2026/27

Requisitos:

1. Supabase local iniciado.
2. Migraciones 001-018 aplicadas.
3. Archivo de importación actualizado.

### PowerShell y Windows

Copia primero el archivo directamente al contenedor para preservar exactamente
su codificación UTF-8. No uses `Get-Content | docker exec`: dependiendo de la
versión y configuración de PowerShell, la tubería puede convertir caracteres
como `É`, `ó` o los emojis de banderas antes de que PostgreSQL los reciba.

```powershell
docker cp "supabase/imports/001_fms_colombia_2026_27.sql" "supabase_db_freestylett:/tmp/001_fms_colombia_2026_27.sql"
docker exec -i supabase_db_freestylett psql -U postgres -d postgres -v ON_ERROR_STOP=1 -f /tmp/001_fms_colombia_2026_27.sql
docker exec supabase_db_freestylett rm /tmp/001_fms_colombia_2026_27.sql
```

El resultado correcto termina con:

```text
COMMIT
```

El archivo puede ejecutarse de nuevo. Utiliza IDs estables y conflictos
controlados para actualizar los mismos registros sin duplicarlos. Volver a
ejecutarlo con el procedimiento anterior también repara textos que hayan sido
importados previamente con una codificación incorrecta.

## Verificación rápida

```powershell
docker exec -i supabase_db_freestylett psql -U postgres -d postgres -c "
select
  (select count(*) from public.battles b join public.events e on e.id = b.event_id where e.slug = 'fms-colombia-2026-27-jornada-1-bogota') as j1_battles,
  (select count(*) from public.ranking_entries where snapshot_id = 'c7000000-0000-0000-0000-000000000001') as ranking_entries,
  (select count(*) from public.battles b join public.events e on e.id = b.event_id where e.slug = 'fms-colombia-2026-27-jornada-2-cali') as j2_battles;
"
```

Valores esperados:

| Campo | Valor |
|---|---:|
| `j1_battles` | 11 |
| `ranking_entries` | 10 |
| `j2_battles` | 0 |

Jornada 2 permanece sin batallas hasta que FMS publique oficialmente sus
cruces.
