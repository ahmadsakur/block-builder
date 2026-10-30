# Backend: apps/api

Read this before touching `apps/api`, auth, the database schema, or a web `service/` that
calls the API. Paths below are relative to `apps/api/`.

## Shape

- `src/index.ts` serves `src/app.ts` with `@hono/node-server` on `PORT` (3001).
- `src/app.ts`: one Hono app under `/api`. Middleware: logger, secure headers, CSRF
  (form posts must come from the `BETTER_AUTH_URL` origin). `onError` passes Hono's
  `HTTPException` through and turns anything else into a 500 JSON body.
- Routes: `/api/health` (pings the database), `/api/auth/*` (better-auth),
  `/api/avatars` (profile photo, see Storage).
- Guard endpoints with `requireAuth()` (any signed-in user) or `requireAuth("root")` from
  `src/modules/auth/auth.middleware.ts`; it puts `user` and `session` on the context.
- Env: `src/env.ts` (`@t3-oss/env-core`), documented in `.env.example`. Scripts load
  `.env` with `--env-file-if-exists`; `drizzle.config.ts` loads it itself.

## Folder structure

Code is grouped by domain, like the web app. Each domain is a folder in `src/modules/`,
named like its web domain (`customers` on the web ↔ `modules/customers` here).

```
src/
  index.ts                  starts the server
  app.ts                    global middleware, mounts each module's routes
  env.ts
  modules/<domain>/
    <domain>.routes.ts      Hono sub-app: validate input, call the service, respond
    <domain>.service.ts     business rules and db/storage calls; no Hono imports
    <domain>.logic.ts       pure helpers (+ <domain>.logic.test.ts)
    <domain>.table.ts       Drizzle table(s)
    <domain>.middleware.ts  middleware other modules use (auth only, so far)
  db/
    client.ts               Drizzle client
    schema.ts               re-exports every module's tables; drizzle-kit reads it
  lib/                      infrastructure with no domain: mailer, storage
  scripts/                  one-off commands (seed)
drizzle/                    generated SQL migrations
```

Rules:

- Create only the files a domain needs. No repository layer: Drizzle is one. Add a
  `<domain>.repo.ts` only when queries are reused or get complicated.
- No separate controllers. Hono loses path-param and validator types in handlers defined
  away from their route, so handlers live inline in `<domain>.routes.ts` (Hono's
  best-practices guide says the same).
- A module may import another module's `service` (and `auth` / `auth.middleware`), never
  its `routes` or tables directly, and files never import in a cycle. A backend rule must
  live in one place: a duplicated permission check drifts into a security hole. (The web
  is the opposite: areas clone screens instead of sharing.)
- Contracts the web also uses (schemas, roles, limits) go in `packages/shared`; types only
  the module uses stay in the module.
- New domain: add `<domain>.table.ts`, export it from `db/schema.ts`, run `db:generate`
  and `db:migrate`, write `<domain>.routes.ts` + `<domain>.service.ts`, mount the routes in
  `app.ts`, then rewrite the matching web `service/` body to call it.

## Why the web proxies /api

The browser only ever talks to `:3000`. Next rewrites `/api/*` to `API_URL`, so cookies
are first-party, no CORS is needed, and `BETTER_AUTH_URL` is the web origin (emails and
redirects point there). Rewrites are baked in at `next build`, so a web image is built for
one `API_URL`.

## Auth (better-auth)

- Config in `src/modules/auth/auth.ts`: email + password with required email verification, password
  reset, change email, delete user, and the `admin` plugin for roles.
- Roles come from `@block-builder/shared/auth` (`ROLES = ["root", "user"]`). Sign-up
  gets `user` (`defaultRole`); `root` is the admin role and gets the admin plugin's
  permissions (list, ban, set role, impersonate). Roles live in `user.role`.
- Root is a single user from env. `pnpm db:seed` reads `ROOT_EMAIL`, `ROOT_PASSWORD`,
  `ROOT_NAME`: it creates the user (verified, role `root`) if missing, refuses when that
  email already belongs to a regular user (someone could have registered it first), and
  demotes any other `root` to `user`. It also runs `storage.init()`. Idempotent; the API
  container runs it on every start.
- Email: `src/lib/mailer.ts` (nodemailer over SMTP). `sendEmail` doesn't wait for the
  send (better-auth's timing-attack advice) and logs failures. Dev uses Mailpit
  (`podman compose up -d`, inbox http://localhost:8025). Production: point `SMTP_*` at
  any provider.
- Flows that send mail: verification on sign-up and on sign-in while unverified (the
  link signs the user in and lands on `/dashboard`), and password reset (lands on
  `/reset-password?token=…`, or `?error=INVALID_TOKEN`).
- Schema: `src/modules/auth/auth.schema.ts` is generated. After changing plugins or user fields:
  `pnpm auth:generate`, then `pnpm db:generate --name <change>`, then `pnpm db:migrate`.
  Never hand-edit the generated file.

## Database (Drizzle + Postgres)

- `src/db/client.ts` creates the client; `src/db/schema.ts` re-exports every module's
  tables (`modules/<domain>/<domain>.table.ts`, plus the generated auth schema).
- Migrations are SQL in `drizzle/`, generated by drizzle-kit and committed. Biome
  ignores the folder.
- Dev database: any Postgres in `DATABASE_URL` (the owner's runs on :5433).

## Storage

- `src/lib/storage/` is an adapter: `Storage` (`init`, `put`, `get`, `delete`) with a
  `local` driver (files under `STORAGE_DIR`, the default) and an `s3` driver (any
  S3-compatible service, `S3_*` env; RustFS via `podman compose --profile s3 up -d`).
  Pick one with `STORAGE_DRIVER`. The local driver rejects keys that leave its folder.
- Avatars (`src/modules/avatars/`: routes, a service over storage, key helpers in logic):
  `PUT /api/avatars` (multipart `file`, PNG/JPEG/WebP, max 1 MB) stores
  `avatars/<userId>/<uuid>.<ext>`, sets `user.image` to `/api/avatars/<userId>/<file>`
  and deletes the previous file. `DELETE /api/avatars` clears it.
  `GET /api/avatars/:userId/:file` streams the file with an immutable cache header, since
  each upload gets a new name. Deleting the account deletes the file (`beforeDelete`).
- Allowed types and the 1 MB limit come from `@block-builder/shared/avatar`, so the web
  picker and the API agree. The web resizes to a 256 px WebP before upload (`squareImage`).

## Containers

`compose.yaml` services: `mailpit` (always), `postgres`, `api`, `web` (profile `app`),
`storage` (RustFS, profile `s3`). The API image runs with `tsx` and migrates + seeds on
start; the web image is Next `output: "standalone"`. They exist to prove the stack
builds and starts, not for daily dev.
