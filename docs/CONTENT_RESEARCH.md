# FreeStyle Total — Investigación y carga de contenido

Este documento define el proceso para investigar, verificar, registrar y
publicar información real dentro de FreeStyle Total.

Su objetivo es evitar:

- Publicar información falsa o desactualizada.
- Mezclar datos de demostración con información real.
- Perder la referencia de una fuente.
- Copiar contenido protegido sin autorización.
- Presentar rumores como información confirmada.
- Introducir datos sin una revisión editorial.

---

## 1. Principios generales

Todo contenido real debe cumplir estas reglas:

1. Tener al menos una fuente identificable.
2. Priorizar fuentes oficiales.
3. Registrar la fecha de verificación.
4. Diferenciar hechos, declaraciones y opinión editorial.
5. No inventar resultados, fechas, participantes o biografías.
6. No copiar textos completos de otras publicaciones.
7. No utilizar imágenes sin revisar su procedencia.
8. Mantener separados los datos demo y los datos reales.
9. Corregir o archivar información que deje de ser vigente.
10. Publicar únicamente información que pueda defenderse editorialmente.

---

## 2. Jerarquía de fuentes

### Nivel A — Fuente oficial

Fuentes preferidas:

- Sitio oficial de una liga u organización.
- Cuenta oficial verificada.
- Comunicado oficial.
- Canal oficial de YouTube.
- Publicación oficial de un evento.
- Perfil oficial del freestyler o creador.
- Plataforma oficial de venta de entradas.
- Reglamento o tabla oficial.

La información puede considerarse verificable cuando la fuente identifica
claramente a la organización, liga, evento o participante.

### Nivel B — Fuente especializada

Fuentes secundarias aceptables:

- Medio reconocido de freestyle.
- Entrevista directa.
- Cobertura periodística identificable.
- Base de datos especializada con referencias.
- Transmisión oficial donde el dato pueda comprobarse.

Cuando sea posible, debe confirmarse con una fuente oficial.

### Nivel C — Fuente comunitaria

Fuentes que requieren confirmación adicional:

- Publicaciones de fans.
- Wikis editables.
- Hilos comunitarios.
- Capturas sin enlace original.
- Videos resubidos.
- Comentarios en redes sociales.

No deben utilizarse como única fuente para publicar fechas, resultados,
participantes, rankings o datos personales.

### Fuentes no aceptadas

- Rumores sin confirmar.
- Capturas manipuladas o sin origen.
- Contenido generado automáticamente sin referencias.
- Publicaciones anónimas.
- Resultados recordados de memoria.
- Imágenes obtenidas arbitrariamente desde Google.
- Contenido copiado de otro medio sin atribución.

---

## 3. Estados de investigación

Cada registro investigado debe tener uno de estos estados:

| Estado | Significado |
|---|---|
| `pending` | Detectado, pero todavía no investigado |
| `in_review` | La información está siendo contrastada |
| `verified` | La información tiene una fuente válida |
| `rejected` | La información no pudo confirmarse |
| `stale` | Fue válida, pero necesita actualizarse |
| `published` | Ya fue revisada y publicada en FT |

Un registro no debe publicarse mientras esté en estado `pending`,
`in_review`, `rejected` o `stale`.

---

## 4. Datos mínimos de trazabilidad

Toda investigación debe registrar:

| Campo | Descripción |
|---|---|
| `entity_type` | Liga, evento, freestyler, batalla, creador o artículo |
| `entity_name` | Nombre identificable del registro |
| `country` | País relacionado |
| `source_name` | Nombre de la fuente |
| `source_url` | URL directa de la evidencia |
| `source_level` | Nivel A, B o C |
| `research_status` | Estado de investigación |
| `verified_at` | Fecha de la última verificación |
| `verified_by` | Persona responsable |
| `notes` | Conflictos, contexto o información pendiente |

Cuando existan varias fuentes, deben conservarse todas las URLs relevantes.

---

## 5. Requisitos por módulo

### Países

- Nombre oficial.
- Slug.
- Código ISO.
- Estado activo.
- Orden de visualización.

### Organizaciones y ligas

- Nombre oficial.
- Nombre corto.
- País o países.
- Descripción original.
- Sitio y redes oficiales.
- Logo autorizado o proveniente de una fuente oficial.
- Estado actual de actividad.
- Fuente y fecha de verificación.

### Temporadas

- Liga.
- Nombre oficial.
- Año.
- Fecha de inicio y finalización.
- Estado.
- Reglamento o publicación oficial.

### Freestylers

- Nombre artístico.
- Nombre real solamente cuando sea público.
- País.
- Ciudad solamente cuando sea pública.
- Biografía redactada originalmente.
- Fotografía con procedencia identificada.
- Redes oficiales.
- Participaciones y logros verificables.
- Fuente y fecha de verificación.

No registrar información privada, sensible o especulativa.

### Eventos

- Nombre oficial.
- Organización.
- Liga o temporada relacionada.
- Fecha y hora.
- Zona horaria.
- País y ciudad.
- Venue.
- Tipo y estado del evento.
- Participantes confirmados.
- Enlaces oficiales o de entradas.
- Poster con procedencia identificada.
- Fecha de última verificación.

Los eventos futuros deben revisarse periódicamente para detectar
cancelaciones, cambios de sede o modificaciones de horario.

### Artículos

- Título original.
- Extracto original.
- Contenido redactado por FT.
- Categoría.
- Autor.
- Fuentes consultadas.
- Imagen con procedencia válida.
- Campos SEO.
- Fecha de publicación.

Las fuentes pueden resumirse o citarse brevemente, pero no debe copiarse el
contenido completo de otra publicación.

### Rankings

- Nombre del ranking.
- Alcance: global, país, liga o temporada.
- Metodología.
- Periodo evaluado.
- Fuente oficial o fórmula propia documentada.
- Posiciones.
- Puntos.
- Fecha de actualización.

Un ranking propio de FT debe explicar públicamente su metodología.

### Batallas

- Evento relacionado.
- Liga o temporada.
- Participantes.
- Ganador, si existe.
- Resultado o fase.
- Fecha.
- ID o URL oficial de YouTube.
- Fuente del resultado.

Se deben priorizar videos publicados por canales oficiales.

### Creadores

- Nombre público.
- País.
- Descripción original.
- Plataformas oficiales.
- Tipo de contenido.
- Imagen con procedencia válida.
- Fuente y fecha de verificación.

---

## 6. Imágenes y material protegido

Antes de guardar una imagen se debe conocer:

- Fuente original.
- Propietario o cuenta que la publicó.
- Finalidad de uso.
- Si puede utilizarse en FT.
- Si requiere atribución.

Prioridades:

1. Material propio.
2. Material proporcionado oficialmente.
3. Assets con permiso explícito.
4. Contenido con licencia compatible.
5. Placeholder cuando no exista una opción segura.

No deben almacenarse imágenes descargadas arbitrariamente de buscadores.

---

## 7. Separación de datos

Los datos deben mantenerse separados de esta forma:

- `supabase/seed.sql`: catálogos estructurales.
- `supabase/seeds/development.sql`: información ficticia para desarrollo.
- Panel administrativo: carga editorial continua.
- Importaciones controladas: carga inicial de información real.
- Documentos de investigación: fuentes, validación y seguimiento.

Los datos reales no deben reemplazar los registros ficticios de desarrollo.

---

## 8. Flujo editorial

El flujo obligatorio es:

1. Detectar una entidad o actualización.
2. Registrar la investigación.
3. Consultar fuentes oficiales.
4. Contrastar información conflictiva.
5. Marcar el registro como verificado.
6. Redactar contenido original.
7. Cargarlo mediante el panel o importación.
8. Revisar la vista previa.
9. Publicar.
10. Programar una revisión cuando el dato pueda cambiar.

---

## 9. Dataset mínimo de lanzamiento

Objetivo inicial:

- 6 países base.
- Entre 1 y 3 ligas verificadas por país cuando exista información.
- Entre 30 y 50 freestylers verificados en total.
- Eventos futuros confirmados.
- Entre 5 y 10 artículos originales.
- Entre 20 y 30 batallas con videos oficiales.
- Entre 10 y 20 creadores verificados.
- Rankings únicamente con metodología o fuente documentada.

Estas cantidades son una guía y no justifican publicar información de baja
calidad para alcanzar una cifra.

---

## 10. Definition of Done del contenido

Un registro real está terminado cuando:

- Tiene fuente.
- La URL funciona.
- La información fue contrastada.
- Tiene fecha de verificación.
- No contiene datos demo.
- El texto es original.
- Las imágenes tienen procedencia válida.
- Sus relaciones en la base son correctas.
- Se revisó en móvil y escritorio.
- La metadata es coherente.
- Está publicado solamente si la información es verificable.