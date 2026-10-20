# FreeStyle Total — Módulo de Creadores

Estado: implementado en la rama `feature/creators-module`  
Última actualización: octubre de 2026

## Propósito

Creadores representa personas, canales y medios que producen contenido sobre freestyle. No sustituye a Freestylers: un freestyler compite; un creador documenta, analiza, entrevista o difunde la escena.

## Modelo

La tabla `public.creators` contiene:

- identidad pública: nombre, slug, tipo y handle;
- perfil: descripción, país, ciudad, imagen y especialidades;
- enlaces oficiales: web, YouTube, Instagram, TikTok, Twitch y X;
- procedencia editorial: fuente de verificación opcional;
- publicación: destacado, estado editorial y fecha de publicación;
- auditoría: creador, editor y timestamps.

Tipos admitidos: `person`, `channel` y `media`. Los estados siguen `draft → published → archived`.

## Seguridad

- Público y usuarios normales: solo registros publicados.
- Editores: lectura, creación y actualización de todos los estados.
- Administradores: lo anterior y eliminación física excepcional.
- La operación habitual de retiro es archivado lógico.
- Las imágenes usan `public-media/creators/{creator_id}/...`.

La cobertura pgTAP del módulo contiene 21 pruebas sobre restricciones, RLS, roles y validación de rutas de Storage.

## Rutas

| Ruta | Uso |
|---|---|
| `/creadores` | Listado público con filtros por tipo y país |
| `/creadores/[slug]` | Perfil público y enlaces oficiales |
| `/admin/creadores` | Listado editorial |
| `/admin/creadores/nuevo` | Alta |
| `/admin/creadores/[id]/editar` | Edición y restauración |

El listado y los detalles públicos incluyen metadata, canonical, Open Graph, Twitter cards, loading, error, empty y not-found. Las rutas publicadas se agregan al sitemap.

## Flujo editorial

1. Crear el perfil como borrador.
2. Registrar únicamente datos públicos y verificables.
3. Añadir enlaces oficiales y, cuando exista, una fuente de verificación.
4. Revisar imagen y especialidades.
5. Cambiar a publicado.
6. Archivar cuando el perfil deba salir del sitio sin perder historial.

## Datos de desarrollo

El seed incluye `Freestyle Media Demo`, un registro ficticio y claramente identificado. No debe considerarse información real ni migrarse a producción.

## Validación antes del PR

```powershell
npx supabase migration up
npx supabase test db supabase/tests/creators_rls.test.sql
npm run lint
npm run build
git diff --check develop...HEAD
```

Revisión manual mínima:

1. Abrir `/creadores`, filtrar por tipo y país.
2. Abrir el perfil demo.
3. Crear un borrador desde `/admin/creadores/nuevo`.
4. Editarlo, publicarlo, comprobarlo públicamente y archivarlo.
5. Confirmar que un usuario sin rol editorial no entra al panel.
