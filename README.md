# FreeStyle Total

Portal en español para consultar eventos, ligas, freestylers, rankings,
batallas, contenido editorial y creadores del ecosistema freestyle.

## Requisitos

Para ejecutar la aplicación en contenedor solo necesitas:

- Docker Desktop con Docker Compose.
- Supabase local iniciado para las funciones que consultan datos.

La imagen fija Node.js `22.20.0`; no necesitas cambiar la versión de Node
instalada en Windows para trabajar con la aplicación.

## Variables de entorno

Si todavía no tienes `.env.local`, créalo desde `.env.example`:

```powershell
Copy-Item .env.example .env.local
```

Obtén la llave pública del entorno local con:

```powershell
npx supabase status
```

Asigna el valor mostrado como publishable/anon key a
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en `.env.local`.

`NEXT_PUBLIC_SUPABASE_URL` permanece como
`http://127.0.0.1:54321` porque el navegador accede a Supabase desde Windows.
Docker Compose configura automáticamente `SUPABASE_INTERNAL_URL` para que las
consultas del servidor de Next.js lleguen al mismo Supabase mediante
`host.docker.internal`.

## Desarrollo con Docker

Primero inicia Supabase local con el flujo habitual:

```powershell
npx supabase start
```

Después construye e inicia la aplicación:

```powershell
docker compose up --build
```

Abre [http://localhost:3000](http://localhost:3000). Los cambios del código
fuente se reflejan mediante hot reload.

Para ejecutar el contenedor en segundo plano:

```powershell
docker compose up --build -d
```

Para ver sus logs:

```powershell
docker compose logs -f web
```

Para detener la aplicación sin borrar sus volúmenes:

```powershell
docker compose down
```

Si cambia `package.json` o `package-lock.json`, reconstruye las dependencias:

```powershell
docker compose build --no-cache web
docker compose up
```

Para eliminar también los volúmenes aislados de dependencias y caché:

```powershell
docker compose down --volumes
```

## Validaciones dentro del contenedor

Con el servicio iniciado:

```powershell
docker compose exec web npm run lint
docker compose exec web npm run build
```

También puedes ejecutar una validación aislada sin dejar el servicio activo:

```powershell
docker compose run --rm web npm run lint
docker compose run --rm web npm run build
```

## Desarrollo sin Docker

El flujo directo continúa disponible cuando se necesite:

```powershell
npm ci
npm run dev
```

En ese caso, no definas `SUPABASE_INTERNAL_URL`; el servidor usará
`NEXT_PUBLIC_SUPABASE_URL`.
