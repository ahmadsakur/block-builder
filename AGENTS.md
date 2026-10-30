# Project agent rules

Before creating a page, a new domain (feature area), or pulling anything from a component
registry, read [`.agents/domain-structure.md`](.agents/domain-structure.md). It defines the
domain-driven folder structure, layers, naming, dependency rules, and how registry blocks
become feature code.

## Layout

Monorepo: pnpm workspaces + Turborepo.

- `apps/api/` (`@block-builder/api`): Hono on Node, better-auth, Drizzle on Postgres, SMTP mail, file storage. Read [`.agents/backend-api.md`](.agents/backend-api.md) before touching it, auth, the schema or any `service/` that calls it.
- `apps/web/`: the Next.js app (`@block-builder/web`). Its Next.js rules are in `apps/web/AGENTS.md`; read them before writing app code. App paths in these docs (`src/…`, `.env.example`, `components.json`) are relative to `apps/web/`.
- `packages/shared/` (`@block-builder/shared`): framework-free contracts every app needs: zod schemas, wire types, roles (`ROLES`, `toRole`), pure helpers. One subpath export per module (`@block-builder/shared/auth`, `/list-query`); the web feature `types/` file re-exports it. Move a type or schema here once a second app needs it. React, Next, nuqs and browser-only code stay in `apps/web`.
- `packages/tsconfig/` (`@block-builder/tsconfig`): `base.json` for packages and services, `nextjs.json` for Next apps.
- UI components stay in `apps/web` while it is the only frontend.
- Root: Biome, lefthook, Turborepo, `compose.yaml`, CI and agent docs.

Run commands from the root. App-only tools (`shadcn`, `next`, `vitest`) run inside the app: `pnpm --filter @block-builder/web exec <tool> …`. Add app dependencies with `pnpm --filter @block-builder/web add <pkg>`, root tooling with `pnpm add -Dw <pkg>`.

## Commands

pnpm only. Root scripts run each workspace's script through Turborepo.

- `pnpm dev`: web (:3000) and API (:3001) dev servers. Needs Postgres (`DATABASE_URL`) and Mailpit (`podman compose up -d`, inbox at http://localhost:8025).
- `pnpm --filter @block-builder/api db:migrate` / `db:seed` / `db:generate` / `auth:generate`: apply migrations, create the root user, write a migration, regenerate the better-auth schema.
- `pnpm lint` / `pnpm lint:fix`: Biome lint + format check / auto-fix.
- `pnpm typecheck`: route types + `tsc`.
- `pnpm test` (watch) / `pnpm test:run` (once). Tests live next to code as `*.test.ts(x)`.
- `pnpm check`: lint + typecheck + tests. Must pass before work is done.

## Automation

- Claude Code hooks (`.claude/settings.json`): each edited file is Biome-fixed; on stop, lint + typecheck + tests for changed files run when the tree changed.
- Git hooks (`lefthook.yml`): pre-commit Biome-fixes staged files; pre-push runs typecheck + tests.
- CI (`.github/workflows/ci.yml`): `pnpm check` on push and pull request.
- Containers (`compose.yaml`, Podman or Docker): only to prove the built apps run. `podman compose --profile app up --build` builds both images and runs them with their own Postgres; daily dev stays on `pnpm dev`. Profile `s3` adds RustFS for the S3 storage driver.

## Env

Declare every app env var in that app's `src/env.ts` and `.env.example` (`apps/web/`, `apps/api/`); each app loads env files from its own folder. Read through `env` (`@/env` in web, `./env` in api), never `process.env` (Biome enforces this in both `src/`). Validation runs when `next.config.ts` loads, so `dev`/`build` fail fast. Client and shared vars must also be listed by full name in `experimental__runtimeEnv` so Next can inline them. `SKIP_ENV_VALIDATION=1` skips validation (e.g. Docker image builds).

## Data

TanStack Query is the data layer and nuqs holds URL state. Every feature reads data through `ui/ -> query/ -> service/`; base services return mock data with a delay. Providers (QueryClient, nuqs adapter) live in `src/components/_common/providers.tsx`. Details: `.agents/domain-structure.md` (Data flow).

Backend: `apps/api`. Next rewrites `/api/*` to it (`API_URL`), so the browser sees one origin and auth cookies stay first-party. The auth service is real (better-auth client in `src/lib/auth/client.ts`); the other services still return mock data with a delay until the API has their tables. Replacing a mock means rewriting only its `service/` body.

Add-ons: optional layers that sit on top of a backend (an auth library, payments, …) are recipes in `.agents/addons/<name>.md`, never branches. Apply one only when asked ("apply the <name> add-on"): read the whole recipe, then follow it step by step.

## Code style

- No comments in source files. Put rules and reasons in these docs.
- Folder layout, naming and import rules: `.agents/domain-structure.md`.

## UI and tokens

- shadcn on Base UI primitives (`base-vega` style), installed into `src/components/_ui/`. Installing anything from a registry follows the dry-run → install → restore workflow in `.agents/domain-structure.md` (Registry components), so our customizations survive.
- Dashboard blocks come from the `@dashboardblocks` registry (docs: https://www.dashboardblocks.com/llms.txt). Base parts live in `src/components/dashboardblocks/`; numbered blocks (`kpi-01`, …) are recipes ported into `feature/`, never imported (see `.agents/domain-structure.md`).
- Registry code is vendored: `src/components/_ui/`, `src/components/dashboardblocks/`, `src/lib/dashboardblocks/` are formatted but not linted. Prefer composing over editing them.
- Tokens are shadcn CSS variables in `src/app/globals.css`: `:root` (light), `.dark` (dark), mapped to Tailwind in `@theme inline`. Theme: shadcn neutral with green for `primary`, `ring`, `sidebar-primary` and the chart scale. Blocks read chart colors from `--chart-2` (strongest) to `--chart-1` (lightest). Status colors are tokens too: `destructive`, `success`, `warning`, `info`, plus `overlay` for scrims (use `text-success`, `bg-warning/10`, `bg-overlay/50`, `var(--color-info)`). Change the look there only; never hardcode colors. The Biome plugin `lint/no-raw-colors.grit` rejects raw colors in JS/TS strings and class names (palette classes like `text-red-500`, `text-white`/`bg-black`, `[#hex]`, `rgb()`/`hsl()`/`oklch()`, `var(--color-red-500)`), including in vendored folders. It reports in the editor, on every Claude edit, on commit and in `pnpm lint`.
- Forms: React Hook Form + zod + shadcn `Field`, fields from `_common/form/` (`TextField`, `SelectField`). Create and edit share one `<feature>-form.tsx` that takes the record or nothing; sheet or dialog by size; deletes confirm in an `AlertDialog`; toasts via `sonner`. Pattern and rules: `.agents/domain-structure.md` (Forms).
- Tables: TanStack Table v9 through dashboardblocks `data-table`, server-side paging/sort/search/filters with state in the URL. Build list pages with `_common/data-table/use-server-data-table.ts` and the `lib/list-query.ts` contract; toolbar = `ColumnMenu` left, `FilterMenu`… + reset + `TableSearch` right (all in `_common/data-table/`); reference `feature/back-office/customers/`. Pattern: `.agents/domain-structure.md` (Lists and tables).
- Auth: screens under `app/(auth)/` (sign-in, sign-up, forgot-password, reset-password) built on dashboardblocks `AuthLayout`, with their service in `feature/auth/_shared/`. App-wide auth lives in `src/lib/auth/`: `client.ts` (better-auth client, `unwrap`, `apiRequest`), `session.ts` + `session-query.ts` (session, `useSessionQuery`, `useSetSession`, `useSignOut`), `errors.ts` (better-auth codes → our copy), `routes.ts` (`homeFor`, `proxyRedirect`). Schemas and roles come from `@block-builder/shared/auth`. Sign-up ends on "Check your email"; the link verifies and signs in. Sign-in sends each role home (`homeFor`). Each area owns its profile page (`feature/back-office/profile/`, `feature/dashboard/profile/`), opened from the user menu above Sign out.
- Roles and areas: `root` (one user, from the seed) owns `/back-office/*`; `user` (every sign-up) owns `/dashboard/*`. Both areas render the same `DashboardShell`, each with its own `nav` (`AreaNav`: breadcrumb root, menu sections, account links) from `feature/<area>/_shared/data/<area>-nav.data.tsx`. A page both roles need is cloned into each area's domain (as profile is); areas never import each other. `src/proxy.ts` asks the API for the session and applies `proxyRedirect`: signed out → `/sign-in`, wrong area → own home, signed in on sign-in/sign-up → own home. The proxy only routes; the API must still check roles (`requireAuth("root")`) on every endpoint that needs one.
- Dark mode: `next-themes`, class strategy, defaults to system. Client providers (theme, tooltip, dashboardblocks `LinkProvider`) live in `src/components/_common/providers.tsx`.
- Dashboard frame: `src/app/back-office/layout.tsx` and `src/app/dashboard/layout.tsx` render `DashboardShell` from `src/components/_common/shell/` (sidebar, header, ⌘K menu, user menu with sign-out). The layout passes the area's `nav`; sidebar, breadcrumbs, ⌘K pages and user-menu links all read it. Area widgets come in through the `headerActions` slot (notifications bell from the area's `_shared/`).
- Loading and empty states: every dashboard route has a `loading.tsx` (and, when its page needs `<Suspense>` for nuqs, a matching `fallback`) rendering the page's skeleton (`ui/components/<domain>-skeleton.tsx`), shaped like the real layout from `_common/skeletons/` (`PageHeaderSkeleton`, `PanelSkeleton`, `TableSkeleton`, `FormSectionSkeleton`) on the shadcn `Skeleton`. Empty, no-match and failed loads use `_common/empty-state.tsx` (shadcn `Empty` + icon, `tone="error"` with a Try again that calls `refetch()`). Placeholder lists key with `placeholderKeys()` from `lib/`, since Biome bans index keys.
- Error pages live in `_common/error-pages/`: `app/not-found.tsx` (404) and `app/back-office/error.tsx` / `app/dashboard/error.tsx` (error boundaries, keep the shell). In Next 16 an error boundary receives `{ error: unknown, retry }`; call `retry()` to re-fetch, and narrow `error` before reading it.
- A link that looks like a button is `<Link className={buttonVariants()}>`, not `<Button render={<Link />}>` (that gives the link `role="button"`).
