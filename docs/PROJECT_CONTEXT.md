# FreeStyle Total (FT) — Project Context

> Documento maestro de contexto para ChatGPT Work, Codex y sesiones nuevas de desarrollo.
> Última consolidación: septiembre de 2026.

---

## 1. Qué es FreeStyle Total

**FreeStyle Total (FT)** es un proyecto personal orientado a convertirse en un **hub / portal del freestyle hispano**.

El objetivo es reunir en una sola plataforma información que normalmente está dispersa entre redes sociales, canales de YouTube, cuentas de ligas, organizadores, medios y comunidades.

FT debe permitir descubrir y consultar:

- Eventos y competencias.
- Ligas y temporadas.
- Freestylers.
- Rankings y tablas.
- Batallas.
- Blogs, resúmenes, análisis y noticias.
- Creadores de contenido e influencers relacionados con freestyle.
- Contenido organizado por país.
- Más adelante: favoritos, comunidad, predicciones, votaciones, highlights y otras funciones interactivas.

FT no debe plantearse únicamente como un blog. La visión es construir progresivamente un **ecosistema de información y comunidad alrededor del freestyle**.

---

## 2. Alcance geográfico inicial

Los países establecidos para la primera etapa son:

1. México.
2. Argentina.
3. España.
4. Colombia.
5. Perú.
6. Chile

La arquitectura debe permitir agregar nuevos países sin reestructurar el proyecto.

---

## 3. Público objetivo

FT está pensado principalmente para:

- Seguidores del freestyle.
- Personas que quieren saber cuándo y dónde será un evento.
- Usuarios que siguen una liga, MC o país específico.
- Usuarios que quieren consultar resultados y rankings.
- Personas que buscan batallas o contenido sin depender de múltiples redes sociales.
- Nuevos seguidores que necesitan contexto sobre ligas, freestylers y competencias.
- Creadores y comunidades interesadas en centralizar información del ecosistema.

---

## 4. Propuesta de valor

El problema que FT busca resolver es la **fragmentación de información**.

Actualmente, para seguir freestyle, un usuario suele tener que revisar:

- Instagram.
- YouTube.
- TikTok.
- X / Twitter.
- Facebook.
- Cuentas individuales de ligas.
- Cuentas de organizadores.
- Canales de creadores.
- Sitios o medios independientes.

FT debe convertir esta información dispersa en una experiencia estructurada.

Ejemplo:

```text
Usuario
  ↓
FreeStyle Total
  ├── Próximos eventos
  ├── Ligas
  ├── Rankings
  ├── Freestylers
  ├── Batallas
  ├── Noticias / blogs
  └── Creadores
```

La plataforma debe priorizar **descubrimiento, organización y contexto**.

---

# 5. MVP

El MVP debe ser suficientemente útil aun antes de incorporar comunidad avanzada.

## 5.1 Home

La Home debe funcionar como entrada al ecosistema.

Debe incluir previews o bloques resumidos de las principales áreas, evitando convertir la página en un listado infinito.

Se han planteado previews como:

- Eventos próximos.
- Freestylers destacados.
- Ligas.
- Blog / noticias.
- Rankings o actividad destacada cuando el módulo esté listo.

La estrategia utilizada hasta ahora consiste en mostrar pocos elementos y dirigir al usuario a la sección completa.

Ejemplo:

```ts
events.slice(0, 3)
```

---

## 5.2 Eventos

Debe existir una sección completa de eventos.

Rutas:

```text
/eventos
/eventos/[slug]
```

Los eventos deben poder evolucionar hacia filtros por:

- País.
- Plaza / ciudad.
- Marca u organización.
- Liga.
- Fecha.
- Tipo de evento.

Cada evento debería poder contener eventualmente:

- Nombre.
- Slug.
- Imagen / poster.
- Fecha.
- Hora.
- País.
- Ciudad / venue.
- Liga u organización.
- Participantes.
- Estado.
- Links oficiales.
- Resultados.
- Batallas asociadas.

---

## 5.3 Ligas

Rutas:

```text
/ligas
/ligas/[slug]
```

Una liga puede contener:

- Nombre.
- Logo.
- País.
- Descripción.
- Temporadas.
- Calendario.
- Ranking.
- Tabla.
- Participantes.
- Eventos asociados.
- Batallas.
- Redes oficiales.

La arquitectura debe considerar que una misma liga puede tener múltiples temporadas.

---

## 5.4 Freestylers

Rutas:

```text
/freestylers
/freestylers/[slug]
```

Cada ficha debe poder crecer para mostrar:

- Nombre artístico.
- Nombre real, cuando sea público y relevante.
- País.
- Imagen.
- Bio.
- Ligas.
- Participaciones.
- Estadísticas.
- Ranking.
- Batallas.
- Logros.
- Redes oficiales.

---

## 5.5 Blog / noticias

Rutas vigentes:

```text
/blog
/blog/[slug]
```

El contenido editorial debe cubrir:

- Noticias.
- Resúmenes.
- Crónicas.
- Resultados.
- Análisis.
- Explicaciones.
- Contenido independiente.

FT no debe depender solamente de noticias. El blog es una parte del producto, no el producto completo.

---

## 5.6 Rankings

Los rankings forman parte del alcance del proyecto.

Se han contemplado:

- Ranking global.
- Ranking por país.
- Ranking por liga.
- Ranking por temporada.

La implementación completa quedó pendiente en la última etapa conocida.

---

## 5.7 Batallas

Se planeó una sección para organizar batallas y contenido audiovisual.

Posible ruta:

```text
/batallas
/batallas/[slug]
```

Las batallas deberían poder:

- Relacionarse con un evento.
- Relacionarse con una liga.
- Relacionarse con freestylers.
- Ordenarse o filtrarse.
- Utilizar YouTube como fuente de video mediante API o embeds.

No duplicar video si puede consumirse legalmente desde la fuente oficial.

---

## 5.8 Creadores

También forma parte del producto una sección de creadores / influencers relacionados con freestyle.

Posible ruta:

```text
/creadores
/creadores/[slug]
```

Debe poder filtrarse y vincular contenido relevante.

---

## 5.9 Login y dashboard

Se planteó login y dashboard de usuario.

Rutas posibles:

```text
/login
/dashboard
```

Funciones iniciales planteadas:

- Favoritos.
- Eventos guardados.
- Preferencias.
- Seguimiento de contenido.

Estas funciones pueden implementarse después del núcleo informativo si afectan el ritmo del MVP.

---

# 6. Fuera del MVP inicial

No priorizar en la primera versión:

- Ecommerce.
- Fantasy.
- Sistema complejo de votaciones.
- Predicciones.
- Comunidad avanzada.
- Foros.
- Gamificación compleja.

Estas ideas forman parte de la visión futura, pero no deben bloquear la publicación del producto base.

El ecommerce se contempló como producto separado, potencialmente en un subdominio como:

```text
shop.dominio.com
```

---

# 7. Ideas futuras

Una vez establecida la base, FT puede evolucionar con:

- Perfiles de usuario.
- Favoritos.
- Seguimiento de ligas y freestylers.
- Comentarios.
- Comunidad.
- Predicciones.
- Votaciones.
- Highlights.
- Rankings interactivos.
- Estadísticas.
- Notificaciones.
- Agenda personalizada.
- Entrenador de freestyle.
- Palabras aleatorias.
- Temas.
- Temporizador para entrenamiento.
- Contenido de video.
- Integraciones con YouTube.
- Panel editorial más avanzado.
- Aplicación móvil si el producto lo justifica.

Estas ideas no deben mezclarse prematuramente con el MVP.

---

# 8. Stack actual

La última versión técnica conocida del proyecto usa:

```text
Next.js 16.2.4
React 19.2.4
TypeScript
Tailwind CSS 4
```

Arquitectura basada en App Router.

El proyecto está pensado para evolucionar hacia:

```text
Frontend
  Next.js + React + TypeScript + Tailwind

Backend / Data
  Supabase

Database
  PostgreSQL

Auth
  Supabase Auth

Storage
  Supabase Storage

Security
  Row Level Security (RLS)

Deploy
  Vercel
```

Para video:

```text
YouTube API
YouTube embeds
```

Strapi fue considerado como CMS, pero **no es la opción principal del MVP**.

La decisión más reciente fue:

- Supabase para backend/datos.
- Panel admin propio para V1.
- Evaluar Strapi después, si la operación editorial realmente lo necesita.

---

# 9. Arquitectura del frontend

La estructura conceptual utilizada es:

```text
src/
├── app/
│   ├── page.tsx
│   ├── eventos/
│   ├── freestylers/
│   ├── ligas/
│   ├── blog/
│   └── ...
│
├── components/
│   ├── ui/
│   └── layout/
│
├── features/
│   ├── events/
│   ├── freestylers/
│   ├── leagues/
│   └── blog/
│
├── lib/
├── services/
├── hooks/
├── constants/
└── types/
```

No todos los directorios tienen que existir si todavía no hacen falta.

La regla es:

> Crear abstracciones cuando resuelvan un problema real, no únicamente para que el árbol de carpetas parezca una arquitectura empresarial.

---

# 10. Organización por feature

Cada dominio debe intentar mantener juntos sus componentes, datos y lógica.

Ejemplo:

```text
features/
└── events/
    ├── components/
    │   ├── EventCard.tsx
    │   └── EventsPreview.tsx
    ├── data/
    │   └── events.mock.ts
    ├── types/
    │   └── event.ts
    └── utils/
```

El objetivo es evitar un `/components` global lleno de componentes específicos de negocio.

Los componentes completamente reutilizables pertenecen a:

```text
components/ui
```

Los componentes estructurales pertenecen a:

```text
components/layout
```

---

# 11. Rutas conocidas

Actualmente se han trabajado o definido las siguientes rutas:

```text
/
├── eventos
│   └── [slug]
├── freestylers
│   └── [slug]
├── ligas
│   └── [slug]
└── blog
    └── [slug]
```

También forman parte del roadmap:

```text
/batallas
/batallas/[slug]

/creadores
/creadores/[slug]

/login
/dashboard

/admin
```

---

# 12. Componentes existentes o previamente trabajados

Componentes base mencionados durante el desarrollo:

```text
Container
Navbar
Footer
SectionHeader
Badge
Card
EventCard
EventsPreview
FreestylerCard
FreestylersPreview
LeagueCard
LeaguesPreview
BlogCard
BlogPreview
```

No asumir que todos siguen exactamente iguales en el repositorio.

Antes de crear uno nuevo:

1. Buscar si ya existe.
2. Revisar si uno actual puede extenderse.
3. Evitar duplicar componentes con diferencias mínimas.

---

# 13. Estado conocido de la Home

La Home evolucionó hacia previews de contenido.

En el estado más reciente conocido podía consumir:

```text
EventsPreview
FreestylersPreview
LeaguesPreview
BlogPreview
```

La lógica general es:

```text
Home
  ↓
preview de cada dominio
  ↓
CTA / enlace
  ↓
página completa
```

No mostrar todos los registros directamente en Home.

---

# 14. Mocks

El proyecto comenzó con datos mock para construir primero la UX y arquitectura.

Existen o existieron mocks para:

- Eventos.
- Freestylers.
- Ligas.
- Blog.

Regla:

> No eliminar los mocks hasta que la integración de datos real esté estable.

La transición debe poder hacerse mediante una capa clara de datos o servicios, evitando acoplar componentes directamente al proveedor.

Ejemplo deseado:

```text
UI
 ↓
feature / service
 ↓
data source
     ├── mock
     └── Supabase
```

---

# 15. Backend planeado

La propuesta de datos para Supabase contempla, como mínimo, entidades equivalentes a:

```text
countries
regions
venues
brands

leagues
league_seasons

freestylers

events
event_participants

rankings
ranking_positions

battles

blogs

creators
```

No considerar este esquema como migración definitiva. Debe validarse contra el repositorio antes de implementarlo.

Relaciones importantes:

```text
Country
 ├── Events
 ├── Leagues
 ├── Freestylers
 └── Creators

League
 ├── Seasons
 ├── Events
 ├── Rankings
 └── Battles

Event
 ├── Participants
 ├── Battles
 └── Results

Freestyler
 ├── Events
 ├── Battles
 ├── Rankings
 └── Leagues
```

---

# 16. Panel de administración

Se decidió priorizar un **admin propio** para V1 antes que incorporar un CMS pesado.

Ruta prevista:

```text
/admin
```

Funciones futuras del panel:

- CRUD de eventos.
- CRUD de ligas.
- CRUD de freestylers.
- CRUD de artículos.
- Gestión de rankings.
- Gestión de batallas.
- Gestión de creadores.
- Gestión de países, venues y marcas.
- Subida de imágenes.

Debe protegerse mediante autenticación y roles.

---

# 17. Branding

## Nombre

**FreeStyle Total**

Abreviación aceptada:

```text
FT
```

---

## 17.1 Concepto visual

La identidad visual debe sentirse:

- Competitiva.
- Urbana.
- Actual.
- Relacionada con batallas y escenarios.
- Cercana a una liga / competición.
- Fuerte visualmente.
- Oscura, pero no genérica.

Debe evitar verse como:

- Sitio corporativo tradicional.
- Blog genérico.
- Plantilla de esports sin identidad.
- Diseño excesivamente cargado de grafiti ilegible.

---

## 17.2 Logo

La versión principal seleccionada fue la variante:

**Dark**

Concepto:

```text
puño + micrófono
```

Estética:

- Fuerte.
- Compacta.
- Inspirada en competición / esports.
- Funciona sobre fondo oscuro.

Se trabajaron o contemplaron:

- Logo principal.
- Isotipo.
- Versión horizontal.
- Versión vertical.
- PNG con fondo transparente.

---

# 18. Paleta vigente

La dirección visual más reciente consolidó:

```css
--black: #111111;
--white: #F5F5F5;
--cyan-blue: #22C7F2;
--yellow: #F2C230;
```

En exploraciones anteriores también aparecieron tonos como:

```css
#050505
#0B0B0D
#1F1F23
#A3A3A3
#00AEEF
#00D9FF
#22D3D? /* explorar únicamente si aparece aún en el repo */
```

La identidad definitiva conserva el azul cyan del logo original como color
principal:

```text
#22C7F2
```

El amarillo `#F2C230` se mantiene como color secundario y de acento. No debe
reemplazar al azul en el logo principal.

Por lo tanto:

> No reemplazar la paleta actual por versiones antiguas sin revisar primero el código y los assets actuales.

Assets vigentes:

```text
public/images/brand/logo-primary.webp
public/images/brand/logo-horizontal.webp
public/images/brand/logo-mark.webp
```

---

# 19. Tipografía

Durante branding se planteó:

```text
Bebas Neue → headings
Inter       → body / UI
Oswald      → subtítulos opcionales
```

Antes de modificar tipografía global, revisar qué está cargado actualmente en el repositorio.

No añadir fuentes simplemente porque aparezcan en este documento si el producto ya consolidó otra solución.

---

# 20. Principios UX

FT debe ser fácil de explorar incluso para usuarios que no conozcan la estructura competitiva del freestyle.

Priorizar:

- Jerarquía visual clara.
- Cards legibles.
- Información rápida.
- Navegación por país.
- Fechas visibles.
- CTA claros.
- Diseño responsive.
- Acceso rápido a eventos.
- Contexto suficiente en fichas de ligas y freestylers.
- URLs legibles mediante slugs.

Evitar:

- Home saturada.
- Cards con demasiada información.
- Textos enormes innecesarios.
- Filtros prematuros que no aporten valor.
- Modales para información que puede vivir en una página.
- Duplicación de navegación.

---

# 21. Principios de desarrollo

## 21.1 Mantener arquitectura simple

No introducir:

- Redux.
- Zustand.
- React Query.
- GraphQL.
- Microservicios.
- CMS adicional.

a menos que exista una necesidad concreta en el proyecto.

No adoptar herramientas únicamente porque estén de moda.

---

## 21.2 Server Components por defecto

En Next.js:

- Usar Server Components cuando sea posible.
- Añadir `"use client"` solo cuando sea necesario.
- Mantener interacción cliente localizada.

Ejemplos que justifican Client Components:

- Filtros interactivos.
- Formularios.
- Modales.
- Carruseles.
- Estado local.
- APIs del navegador.

---

## 21.3 TypeScript

Evitar:

```ts
any
```

Crear tipos claros para entidades importantes:

```ts
Event
Freestyler
League
BlogPost
Battle
Ranking
Creator
Country
```

---

## 21.4 Componentización

No crear un componente nuevo para cada bloque de HTML.

Crear componentes cuando exista:

- Reutilización.
- Responsabilidad clara.
- Complejidad que justifique separación.
- Necesidad de encapsular lógica.

---

## 21.5 Naming

Preferir inglés para código:

```text
EventCard
LeagueCard
FreestylerCard
BlogPreview
```

La interfaz visible al usuario puede estar en español.

---

## 21.6 Estilos

Seguir Tailwind CSS como solución principal.

Evitar introducir simultáneamente:

- Styled Components.
- CSS Modules.
- Sass.

salvo que el repositorio actual ya tenga una razón concreta para ello.

---

# 22. SEO

FT depende fuertemente de descubrimiento de contenido.

Cada entidad pública debería poder tener:

- `title`.
- `description`.
- Open Graph.
- URL canónica.
- Imagen.
- Metadata específica.

Next.js Metadata API debe aprovecharse cuando sea posible.

Ejemplo conceptual:

```ts
generateMetadata()
```

Las rutas `[slug]` deben ser indexables cuando el contenido sea público.

---

# 23. Imágenes

Las imágenes pueden provenir inicialmente de mocks o assets locales.

En producción:

- Preferir fuentes oficiales.
- Registrar atribución si corresponde.
- Optimizar con `next/image`.
- Mantener aspect ratios consistentes.
- No usar imágenes arbitrarias de Google como contenido permanente.

Para Supabase:

```text
Supabase Storage
```

es la solución inicialmente considerada.

---

# 24. Integración con YouTube

YouTube será importante para batallas y contenido audiovisual.

Priorizar:

- Embeds oficiales.
- YouTube API cuando se necesiten metadatos.
- IDs del video en base de datos en lugar de duplicar el archivo.

Modelo conceptual:

```ts
type Battle = {
  id: string
  slug: string
  title: string
  youtubeVideoId?: string
  eventId?: string
  leagueId?: string
  participantIds: string[]
}
```

---

# 25. Deploy

Proveedor previsto:

**Vercel**

El proyecto debe mantenerse compatible con el flujo estándar de deploy de Next.js.

Variables sensibles deben estar en:

```text
.env.local
```

y en las variables de entorno del proveedor.

Nunca commitear:

- Service keys.
- Secrets.
- Tokens.
- Contraseñas.

---

# 26. Convenciones de Git

Trabajar en cambios pequeños y entendibles.

Ejemplos de commits:

```text
feat(events): add events listing page
feat(events): add event detail route
feat(leagues): add league preview
fix(navbar): improve mobile navigation
refactor(events): move event data to feature module
```

Evitar commits gigantes que mezclen:

- Diseño.
- Refactor.
- Datos.
- Features no relacionadas.

---

# 27. Cómo debe trabajar una IA sobre este repositorio

Antes de implementar cualquier cambio:

1. Inspeccionar el repositorio.
2. Revisar `package.json`.
3. Revisar estructura de `src`.
4. Identificar componentes existentes.
5. Revisar estilos/tokens actuales.
6. Revisar mocks y tipos.
7. Revisar rutas existentes.
8. No asumir que este documento sustituye al código actual.

La regla principal es:

> El repositorio actual es la fuente de verdad técnica. Este documento es la fuente de verdad de producto e intención.

---

## 27.1 No sobrescribir decisiones sin motivo

Antes de modificar:

- Branding.
- Arquitectura.
- Rutas.
- Naming.
- Diseño.
- Dependencias.

explicar o identificar la razón técnica.

No hacer refactors masivos si el ticket no los necesita.

---

## 27.2 Trabajar incrementalmente

Preferencia:

```text
analizar
→ proponer cambio pequeño
→ implementar
→ validar
→ continuar
```

No reconstruir la aplicación completa para agregar una feature.

---

## 27.3 Reutilizar primero

Antes de crear:

```text
NewCard.tsx
NewContainer.tsx
NewButton.tsx
```

buscar equivalentes existentes.

Evitar variantes como:

```text
CardNew
CardFinal
CardV2
CardFixed
```

La humanidad ya ha sufrido suficiente.

---

## 27.4 Preservar responsive

Todo cambio visual debe comprobar:

- Mobile.
- Tablet.
- Desktop.

No asumir que existe diseño móvil de Figma.

Cuando no exista referencia, adaptar la UI con criterios consistentes con el desktop.

---

## 27.5 No inventar datos reales

Mientras se usan mocks:

- Usar datos claramente de demostración cuando sea necesario.
- No inventar resultados históricos presentándolos como hechos reales.
- Cuando se conecten fuentes reales, registrar fuente y fecha cuando aplique.

---

# 28. Estado conocido del proyecto

Último contexto consolidado: septiembre de 2026, después de la auditoría y la
integración del paquete de marca azul.

### Ya definido

- Nombre FreeStyle Total.
- Branding principal.
- Logo Dark.
- Stack.
- Arquitectura modular.
- App Router.
- Rutas principales.
- Sistema de previews en Home.
- Datos mock.
- Eventos.
- Freestylers.
- Ligas.
- Blog.
- Azul cyan como color principal de marca.
- Amarillo como color secundario.
- Assets de marca optimizados en WebP.

### Implementado o parcialmente implementado en alguna etapa

- Home.
- `/eventos`.
- `/eventos/[slug]`.
- `/freestylers`.
- `/freestylers/[slug]`.
- `/ligas`.
- `/ligas/[slug]`.
- `/blog`.
- `/blog/[slug]`.
- `EventsPreview`.
- `FreestylersPreview`.
- `LeaguesPreview`.
- `BlogPreview`.
- Cards y componentes UI base.
- Logo horizontal integrado en la navegación.
- Isotipo configurado para iconos y favicon.
- Logo principal configurado para Open Graph.
- `AGENTS.md` con instrucciones persistentes del repositorio.

### Pendiente / siguiente etapa

- Completar navegación móvil y footer.
- Consolidar la Home como portada del producto.
- Añadir metadata específica por entidad pública.
- Completar rankings.
- Batallas.
- Creadores.
- Integración con Supabase.
- Diseño del esquema definitivo.
- Admin.
- Auth.
- Dashboard.
- Favoritos.
- Datos reales.
- Integración con YouTube.
- SEO completo.
- Deployment productivo.

---

# 29. Orden sugerido para retomar el proyecto

Al abrir el repositorio después de una pausa:

## Paso 1 — Auditoría

Revisar:

```text
package.json
src/app
src/components
src/features
src/lib
src/types
public
```

Determinar qué partes de este documento siguen reflejadas en código.

---

## Paso 2 — Ejecutar proyecto

Validar:

```bash
npm install
npm run dev
```

o el package manager definido actualmente.

Registrar:

- Errores.
- Warnings.
- Dependencias obsoletas.
- Rutas rotas.

No actualizar paquetes automáticamente antes de comprobar el estado.

---

## Paso 3 — Inventario funcional

Crear una tabla interna:

| Módulo | UI | Datos | Detail | Responsive | Estado |
|---|---|---|---|---|---|
| Home | ? | ? | N/A | ? | ? |
| Eventos | ? | ? | ? | ? | ? |
| Ligas | ? | ? | ? | ? | ? |
| Freestylers | ? | ? | ? | ? | ? |
| Blog | ? | ? | ? | ? | ? |
| Rankings | ? | ? | ? | ? | ? |
| Batallas | ? | ? | ? | ? | ? |

Actualizar esta evaluación a partir del código real.

---

## Paso 4 — Cerrar frontend del MVP

Antes de backend:

- Asegurar navegación.
- Completar páginas clave.
- Revisar responsive.
- Unificar cards.
- Validar empty states.
- Añadir loading states donde corresponda.

---

## Paso 5 — Capa de datos

Crear una frontera clara entre UI y datos.

Evitar consultas Supabase repartidas arbitrariamente por componentes.

Ejemplo:

```text
features/events/services/
features/leagues/services/
```

o una solución equivalente compatible con el repo real.

---

## Paso 6 — Supabase

Implementar progresivamente:

1. Countries.
2. Leagues.
3. Freestylers.
4. Events.
5. Blog.
6. Rankings.
7. Battles.

Migrar mocks módulo por módulo.

---

## Paso 7 — Admin

Construir el panel una vez que el esquema de datos básico sea estable.

---

# 30. Definition of Done general

Una feature no está terminada únicamente porque "se ve".

Debe cumplir, cuando aplique:

- Funciona.
- No rompe otras rutas.
- Responsive.
- TypeScript sin errores relevantes.
- Sin datos hardcodeados innecesarios.
- Reutiliza componentes existentes.
- Loading state.
- Empty state.
- Error state cuando existe fetch.
- Metadata si es página pública.
- Accesibilidad básica.
- Links funcionan.
- Imágenes optimizadas.
- Código legible.
- Sin secrets.

---

# 31. Prioridad actual del producto

Cuando existan dudas sobre qué construir primero, usar esta jerarquía:

```text
1. Información útil
2. Navegación
3. Eventos
4. Ligas
5. Freestylers
6. Blog
7. Rankings
8. Batallas
9. Creadores
10. Cuenta de usuario
11. Comunidad
12. Funciones experimentales
```

No sacrificar el núcleo informativo por features sociales prematuras.

---

# 32. Regla para futuras sesiones de ChatGPT Work / Codex

Al comenzar una sesión nueva, usar una instrucción similar:

> Estás trabajando en FreeStyle Total (FT). Lee `PROJECT_CONTEXT.md` antes de proponer o modificar código. Después inspecciona el repositorio para determinar el estado técnico actual. Conserva las decisiones de producto y branding del documento, pero trata el código actual como fuente de verdad para versiones, estructura y componentes. No hagas refactors masivos sin necesidad. Reutiliza componentes existentes, trabaja por features y realiza cambios incrementales.

---

# 33. Objetivo inmediato al retomar FT

La auditoría inicial ya fue completada. El objetivo inmediato es cerrar la
estructura visual global del MVP.

El objetivo es:

```text
navbar responsive y footer
      ↓
rediseñar la Home
      ↓
consolidar módulos existentes
      ↓
crear frontera de datos
      ↓
migrar progresivamente a Supabase
```

El trabajo visual debe continuar en `develop` y validarse antes de integrarse a
`main`.

---

# 34. Resumen ejecutivo para IA

Si solo se dispone de unos segundos de contexto:

> FreeStyle Total es un portal/hub del freestyle hispano enfocado inicialmente en México, Argentina, España, Colombia, Perú y Chile. Centraliza eventos, ligas, freestylers, rankings, batallas, noticias/blog y creadores. Usa Next.js, React, TypeScript y Tailwind; la arquitectura es modular por features y actualmente consume mocks. Se planea Supabase (PostgreSQL/Auth/Storage/RLS), Vercel y YouTube API/embeds. El branding principal es oscuro, competitivo y urbano, con logo de puño + micrófono, azul cyan #22C7F2 como color principal y amarillo #F2C230 como acento secundario. Ya están implementados Home, eventos, ligas, freestylers y blog con previews y rutas por slug, además de los assets de marca en WebP. La prioridad actual es cerrar la estructura visual global y la Home, consolidar los módulos existentes y después migrar progresivamente los mocks hacia Supabase.
