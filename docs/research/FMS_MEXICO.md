# Expediente de investigación: FMS México

## Estado

- Estado del perfil de liga: `verified`
- Estado de la temporada: `verified`
- Estado del roster: `verified`
- Estado de la clasificación: `pending`
- Última revisión: 2026-10-14
- Aprobado para carga técnica: parcialmente
- Aprobado para publicación: parcialmente

## Identidad

- Nombre: FMS México
- Nombre completo: Freestyle Master Series México
- Slug propuesto: `fms-mexico`
- País: México
- Organización: Urban Roosters
- Tipo de entidad: liga
- Sitio oficial: https://fms.tv/
- Sitio de la organización: https://www.urbanroosters.com/

## Temporada vigente

- Nombre editorial: FMS México 2026/27
- Número de temporada: 7
- Estado: próxima
- Número de participantes: 10
- Fecha de inicio confirmada: 2026-10-24
- Hora de inicio confirmada: 18:00
- Zona horaria propuesta: America/Mexico_City
- Primera sede: Centro Cívico Ecatepec
- Ciudad: Ecatepec de Morelos
- Estado: Estado de México
- País: México

## Roster confirmado

| Participante | Slug | País | Estado |
|---|---|---|---|
| Chuty | `chuty` | España | verified |
| Jony Beltrán | `jony-beltran` | México | verified |
| Azuky | `azuky` | México | verified |
| Kodigo | `kodigo` | Argentina | verified |
| Skone | `skone` | España | verified |
| Nota Roja | `nota-roja` | México | verified |
| Lobo Estepario | `lobo-estepario` | México | verified |
| Rapder | `rapder` | México | verified |
| Xhavez | `xhavez` | México | verified |
| Dalia Castella | `dalia-castella` | España | verified |

El detalle de evidencia por participante se conserva en:

`docs/research/FMS_MEXICO_PARTICIPANTS.csv`

## Información confirmada

- FMS México forma parte de las ligas operadas por Urban Roosters.
- La edición vigente corresponde a la temporada 2026/27.
- Es la séptima temporada de FMS México.
- El roster oficial está compuesto por diez participantes.
- La primera jornada será el 24 de octubre de 2026.
- La primera jornada comenzará a las 18:00.
- La sede anunciada es el Centro Cívico Ecatepec.

## Información pendiente de verificar

- Batallas programadas para la primera jornada.
- Formato exacto de competencia de la temporada.
- Sistema vigente de puntos y desempates.
- Calendario completo de jornadas.
- Sedes posteriores a la jornada inaugural.
- Clasificación oficial una vez iniciada la temporada.
- Perfiles completos y redes oficiales de cada participante.
- Derechos de uso del logotipo y fotografías.

## Fuentes

| Fuente | URL | Nivel | Uso | Estado |
|---|---|---:|---|---|
| FMS | https://fms.tv/ | A | Temporada y noticias oficiales | aceptada |
| Urban Roosters | https://www.urbanroosters.com/ | A | Organización responsable | aceptada |
| Anuncio del lineup | https://urbanroosters.news/chuty-estara-en-fms-mexico-con-un-line-up-historico-que-debutara-en-ecatepec-tierra-de-azuky/ | A | Temporada, roster y jornada inaugural | aceptada |
| Clasificaciones FMS | https://www.urbanroosters.com/fms/ranking | A | Rankings históricos | aceptada con restricción |
| FMS México YouTube | https://www.youtube.com/@fms_mexico | A | Videos y anuncios oficiales | aceptada |

## Restricciones detectadas

La clasificación pública consultada contiene principalmente temporadas
históricas. La temporada 2026/27 todavía no cuenta con resultados porque su
primera jornada está programada para el 24 de octubre de 2026.

No deben inventarse posiciones iniciales ni utilizarse resultados de temporadas
anteriores como clasificación vigente.

## Modelado previsto

### `organizations`

Crear o reutilizar el registro de Urban Roosters.

### `leagues`

Crear o actualizar FMS México como liga asociada a Urban Roosters.

### `league_countries`

Relacionar FMS México con México.

### `league_seasons`

Crear la temporada:

- Nombre: FMS México 2026/27
- Número: 7
- Inicio: 2026-10-24
- Estado inicial: `upcoming`

### `freestylers`

Reutilizar los perfiles existentes y crear únicamente aquellos que todavía no
existan, conservando sus nombres artísticos y países confirmados.

### Participantes de temporada

Relacionar los diez freestylers confirmados con la temporada 7.

### Eventos

Preparar la primera jornada como evento próximo, pero no publicarla hasta
confirmar dirección completa, horario final y enlace oficial de entradas.

### Rankings

No cargar registros hasta que existan resultados oficiales de la primera
jornada.

## Decisión editorial

El perfil de FMS México, la temporada 2026/27 y su roster están autorizados para
la siguiente fase de preparación técnica.

La primera jornada permanece parcialmente aprobada porque faltan dirección
completa, batallas programadas y enlace oficial de entradas.

La clasificación permanece en estado `pending`.

## Próxima revisión

1. Confirmar las batallas de la jornada inaugural.
2. Confirmar dirección y enlace oficial de entradas.
3. Revisar si los diez freestylers ya existen en la base de datos.
4. Preparar un archivo de importación sin duplicados.
5. Revisar la clasificación después del 24 de octubre de 2026.

## Validación técnica local

Validación realizada: 2026-10-14.

El archivo `supabase/seeds/content/fms-mexico-2026-27.sql` fue ejecutado
dos veces consecutivas sobre Supabase local con `ON_ERROR_STOP=1`.

Resultados después de la segunda ejecución:

| Entidad | Registros esperados | Registros obtenidos |
|---|---:|---:|
| Urban Roosters | 1 | 1 |
| FMS México | 1 | 1 |
| FMS México 2026/27 | 1 | 1 |
| Freestylers del roster | 10 | 10 |

Conclusión:

- El seed es idempotente.
- No genera organizaciones duplicadas.
- No genera ligas o temporadas duplicadas.
- No genera freestylers duplicados.
- Todos los registros permanecen en estado `draft`.
- Los datos demo se mantienen separados del contenido real.