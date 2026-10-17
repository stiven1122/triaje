# Triaje de correos · Frontend

Dashboard React para revisar los correos clasificados por n8n.
Arquitectura: `Gmail → n8n → Supabase → Webhooks n8n → Frontend`.
El frontend **no** se conecta a Supabase: todo pasa por los webhooks de n8n.

## Stack
React 18 · TypeScript · Vite · Tailwind CSS 3 · React Router 6 · TanStack Query 5 · Axios · Lucide

## Instalación
```bash
npm install
cp .env.example .env     # completa los valores
npm run dev
npm run build            # build de producción (dist/)
```

## Variables de entorno
| Variable | Descripción |
|---|---|
| `VITE_N8N_API_URL` | URL base de los webhooks, sin `/` final (ej. `https://tu-n8n.com/webhook`) |
| `VITE_N8N_API_KEY` | API key que valida n8n |
| `VITE_N8N_API_KEY_HEADER` | (opcional) header de la key. Por defecto `x-api-key` |

> ⚠️ Toda variable `VITE_*` queda **visible en el bundle del navegador**. La API key sirve para
> evitar accesos casuales, no es un secreto real. Usa una key de solo este proyecto, rótala si se
> filtra y, si necesitas más seguridad, migra a JWT con login.

## Contrato con n8n
Las rutas se construyen como `VITE_N8N_API_URL + ruta`:

| Método | Ruta | Notas |
|---|---|---|
| GET | `/correos?categoria=&prioridad=&leido=&q=&page=` | `leido` se envía como `true`/`false`; los filtros vacíos se envían vacíos |
| GET | `/estadisticas` | conteos por categoría y prioridad |
| PATCH | `/correos/:id` | `:id` = `message_id` (URL-encoded). Body: `{ "leido": true }` o `{ "categoria": "urgente" }` (también acepta `prioridad`) |

Cada webhook debe usar **path** `correos`, `estadisticas` y `correos/:id` (en n8n, el path con parámetro
se define como `correos/:id` en el nodo Webhook), responder con **Respond to Webhook** e incluir
cabeceras CORS (`Access-Control-Allow-Origin`, `-Headers: Content-Type, x-api-key`, `-Methods`).
Recuerda: la URL de producción solo responde con el flujo **activado**.

### Formato de respuesta aceptado
Toda la interpretación está en `src/services/adapters.ts`. Hoy acepta:

- **Lista**: un array de correos, o `{ data | items | correos: [...], total, page, pageSize, totalPages }`.
  Si n8n devuelve solo un array, la paginación mostrará 1 página; para paginar, devuelve `total`.
- **Estadísticas**: `{ total, por_categoria | porCategoria | categorias, por_prioridad | porPrioridad | prioridades }`,
  cada uno como objeto `{ urgente: 5 }` o array `[{ categoria: "urgente", total: 5 }]`.
- **Correo**: `message_id, remitente, asunto, resumen, fecha, categoria, prioridad, leido`.

Si tus respuestas reales difieren, ajusta **solo** ese archivo.

## Estructura
```
src/
├── components/  Badge, StatCard, CorreoCard, CorreoList, FiltersBar, Pagination, QueryState, ConfigBanner
├── pages/       DashboardPage, CorreosPage, NotFoundPage
├── services/    http.ts (axios + API key + errores), adapters.ts, correosService.ts
├── hooks/       useCorreos (queries/mutación), useFilters (filtros en la URL)
├── layouts/     DashboardLayout (sidebar, header, drawer móvil)
├── router/  types/  utils/
```

Decisiones: los filtros viven en la URL (compartibles); la búsqueda tiene debounce de 400 ms;
tras marcar leído o reclasificar se invalidan listado y estadísticas.

## Categorías
`src/utils/constants.ts` define las categorías del filtro y del selector de reclasificación
(`urgente, académico, administrativo, promociones, otros`). Cámbialas por las que use tu flujo.

## Despliegue
- **Vercel**: importa el repo, framework Vite; agrega las variables de entorno. `vercel.json` ya redirige las rutas al SPA.
- **Netlify**: build `npm run build`, publish `dist`; `public/_redirects` ya incluido.
- Añade el dominio desplegado a los orígenes permitidos de CORS en n8n.

## Decisión del coordinador (aceptar / rechazar)
Las solicitudes de proyecto o salida técnica llegan con `estado = pendiente`. Desde la app:
- **Aceptar y enviar formulario** → `POST /decision {message_id, decision:"aceptar"}`; n8n envía el formulario al solicitante.
- **Rechazar…** → `POST /decision {message_id, decision:"rechazar", motivo}` (motivo obligatorio, mín. 10 caracteres); n8n envía el correo de rechazo.

El destinatario **nunca** lo envía el navegador: n8n lo lee de Supabase. Respuestas: `200 {ok, estado}`, `400` (datos inválidos),
`409` (ya decidida o inexistente), `502` (falló el envío; la decisión se revierte). El campo `estado` es una ampliación
del modelo mínimo, justificada por el ciclo de decisión del coordinador.

## Modo demostración
`VITE_USE_MOCK=true npm run dev` (o en `.env`) muestra la interfaz con 12 correos de ejemplo, sin n8n.
Sirve para probar filtros, paginación, marcar leído y aceptar/rechazar. No lo actives en producción.

## Desplegar en Vercel
1. Sube el proyecto a GitHub (el `.gitignore` excluye `.env`).
2. En vercel.com → *Add New → Project* → importa el repositorio. Preset **Vite** (build `npm run build`, salida `dist`).
   Si el proyecto está en una subcarpeta, indícala en *Root Directory*.
3. En *Environment Variables* agrega `VITE_N8N_API_URL`, `VITE_N8N_API_KEY` y `VITE_N8N_API_KEY_HEADER`. No agregues `VITE_USE_MOCK`.
4. *Deploy*. Si cambias variables después, haz *Redeploy* (se incorporan al compilar).
5. En n8n, cambia *Allowed Origins* de los Webhook a tu URL de Vercel (sin `/` final).
Antes de subir, ejecuta `npm run typecheck` para detectar errores de tipos.
