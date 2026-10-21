# bp-boilerplate — Goals & Context

Handoff doc for agents picking up this project. Read fully before acting.

## Why this exists

The owner does freelance work for many different clients. Every project burns early time on wiring the same things. This repo is a personal Next.js boilerplate: pick the backend at project start, have the frontend (UI, conventions) ready, and go straight to features.

- Next.js is always the frontend. The backend varies per client.
- Personal tool, not a public product. Opinionated is fine.
- **Fork-and-forget**: a project made from this template owns its code. No upgrade path back to the template.
- Backend is decided once, early. Switching backends mid-project is **not** a goal.

## Repo model

The repo root is the Next.js app. Variants are **branches**, not folders:

| Branch | Purpose |
|---|---|
| `master` | Untouched create-next-app scaffold (commit `e76efbe`). Leave alone. |
| `base` | Shared frontend: UI, tokens, conventions, mock data. **Current work happens here.** |
| `supabase` | Branched from `base` later. Supabase is the whole backend (auth, Postgres) and uses its own storage. |
| `payload` | Branched from `base` later. Payload CMS lives inside the Next app, db chosen per project, S3 storage. |
| `vanilla` | Branched from `base` later. Separate, backend-agnostic API; Next is frontend only and talks to it over HTTP through an adapter. S3 storage. |

No `feat/*` branches. Base work goes straight onto `base`. Later changes to base get merged into each backend branch.

How projects get created from the template (CLI, flags like `--supabase`, giget, etc.) is **undecided and deferred**. Build the template first.

## Settled decisions

- **Backends vs add-ons (2026-10-21):** a backend is the foundation. Each project picks exactly one, so backends are **branches**. An add-on is an optional layer that can be combined with others (better-auth, payments, i18n, uploads), so add-ons are **recipes**, never branches: agent docs in `.agents/addons/<name>.md`, applied after cloning. No shadcn-registry packaging for now. Each recipe lists which backends it fits, and a recipe that fits one backend only lives on that backend's branch.
- **Base stack:** Next 16 (App Router, TS, `src/` dir), Tailwind v4, shadcn, design tokens, Biome (lint + format, no ESLint/Prettier), pnpm only, React Hook Form + zod, Vitest.
- **Design tokens:** the shadcn + Tailwind CSS-variable format in `globals.css` *is* the standard. No designer-token import tooling: designers deliver in our format. Tokens hold the look together; character comes from tokens, not from mixing component libraries.
- **Components:** shadcn 4 on **Base UI** primitives, `vega` style, default theme matched to dashboardblocks (neutral + blue charts, Geist).
- **Registries:** `@dashboardblocks` for dashboard blocks (shadcn-native, shares our tokens). Other registries (e.g. `@stealth`) only as cherry-picked parts with tokens bridged to ours, never as the component base.
- **Cache Components:** kept on (dynamic by default, `"use cache"` to opt in).
- **Base UI:** auth screens + dashboard essentials (sidebar/app shell, datatable, settings, etc.), all working on **mock data** before any backend exists.
- **Folders:** domain-driven, ported from the owner's back-office project: thin `app/` routes, `feature/<route>/{ui,types,data,logic,store}`, shared `components/{_ui,_common,dashboardblocks}`. Rules in `.agents/domain-structure.md`. Registry numbered blocks are ported into `feature/` and never imported directly. No comments in source. The owner adds further instruction docs as needed (data fetching, etc.).
- **Conventions per mode:** base holds frontend rules. Each backend branch adds its own backend rules docs and agent instructions.
- **Backend adapter:** thin. The UI must not depend on a specific backend. Settled shape: `ui/ -> query/ (TanStack Query + nuqs) -> service/` per feature; base `service/` files return mock data, each backend branch rewrites only the service bodies. Anything server-side is designed in that branch from the owner's recipe, never in base. Auth contract (template default): `Session { user: AuthUser }`, `AuthUser { id, email, name, avatarUrl? }`, service functions `getSession`, `signIn`, `signUp`, `requestPasswordReset`, `resetPassword({ token, password })`, `signOut`. List contract (template default): service takes `ListQuery { page (1-based), pageSize, sort: { id, desc }[], search }` + domain filters, returns `ListResult<T> { rows, total, facets? }`. Owner decision (2026-10-21): these defaults stand; if a client project needs a different shape (OAuth, roles, cursor paging, no facets), that is adjusted in the project, not in the template. Still deferred: storage API.

## Current state (2026-10-21)

- Scaffolded with: `pnpm create next-app@latest bp-boilerplate --ts --tailwind --biome --app --src-dir --import-alias "@/*" --use-pnpm --agents-md --no-agent-feedback --yes`
- Installed: Next 16.4.2, React 19.3.0, Tailwind 4.3.3 (via `@tailwindcss/turbopack`, no PostCSS config), TypeScript 5.9.3. Since updated: Biome 2.5.15; added shadcn 4 (Base UI, vega), dashboardblocks, TanStack Query + Table, nuqs, React Hook Form + zod, Vitest 5, lefthook, sonner.
- `--yes` applied the owner's saved create-next-app prefs, so `next.config.ts` has `reactCompiler: true`, `cacheComponents: true`, `partialPrefetching: true`.
- Base plan steps 1–8 done on `base` (see `git log`). Git is local only; no remote until the owner asks.
- `AGENTS.md` was generated by Next. Its block tells agents to read `node_modules/next/dist/docs/` before writing Next code, because this Next version differs from training data. Follow it.

## Plan for `base`

Each step = one commit on `base`. Stop after each step, walk the owner through what you did, and wait for approval before the next. **Base plan complete. Next: backend branches, one at a time, each starting from the owner's recipe.**

1. ✅ Tooling: update Biome, add Vitest, zod env validation at startup, `CLAUDE.md` pointing to `AGENTS.md`, git + Claude Code hooks.
2. ✅ shadcn init + design tokens (light/dark) + `/tokens` preview.
2b. ✅ Dashboard shell (`/dashboard` layout: sidebar + header + content) and `/dashboard/home` with the dashboardblocks Store dashboard; tokens matched to dashboardblocks.
3. ✅ Folder layout + frontend conventions docs (`.agents/domain-structure.md`; home dashboard containerized as the reference domain).
4. ✅ Mock data layer: TanStack Query + nuqs, `query/` + `service/` per feature, home dashboard wired through it.
5. ✅ App shell: sidebar, topbar, ⌘K command menu, notifications (feature via header slot, optimistic mark-as-read), 404 + error boundary pages.
6. ✅ Auth screens: sign-in, sign-up, forgot/reset password on `AuthLayout`, RHF + zod form pattern, user menu with sign-out. Status colors moved to tokens (`success`/`warning`/`info`/`destructive`) with a lint check against raw colors.
7. ✅ Datatable + one example feature: server-side `useServerDataTable` + `lib/list-query.ts` contract, `/dashboard/customers` (search, facet filters, sort, pagination, CSV export of selected rows, all URL state). Also: raw-color rule moved to a Biome plugin (editor + every edit), `--overlay` token.
8. ✅ Form pattern on a real flow: customers get row actions (Edit/Delete), "New customer", one `customer-form.tsx` for create + edit in a sheet, delete confirmation, toasts; `SelectField` + number fields. A separate settings page was dropped in favor of this.

Then the backend branches, one at a time. Each starts with the owner giving their detailed recipe for that backend.

## Backend branches

- `vanilla`: HTTP adapter (`/api` fallback rewrite to `API_URL`, `lib/api.ts`). See that branch.
- ✅ `supabase` (2026-10-21): built without a project (typecheck, tests, build only). It has:
  - the `@supabase/ssr` clients and `proxy.ts` session refresh and redirects
  - the auth service on Supabase Auth, with a PKCE reset link adapted to the `?token=` page
  - the `supabase/` folder: `config.toml` plus a `delete_own_account` migration
  - `db:*` scripts and Supabase-green tokens
  Data services stay mock. Next step: smoke-test the day-1 checklist in `.agents/backend-supabase.md` on a throwaway project. The repo is the source of truth, never the dashboard.
- `payload`: not started.

## Deferred — do not decide alone

The owner explicitly deferred these. Don't implement them or ask about them all at once; raise each only when the step that needs it comes up:

- How projects are created from the template (CLI vs other).
- Adapter contract details still open: storage API. (Auth/session and list shapes are settled template defaults; error shape is a thrown `Error` with a user-facing message.)
- Where the adapter runs (server-only vs client); decided per backend.
- i18n (an opt-in flag was suggested, not agreed).
- CI to stop the template from going stale.
- Each backend's recipe (db, storage, auth, setup steps).

## Working rules with the owner

- **Never** put Claude (or any AI) as author or co-author in commits, and never mention it in commit messages. No `Co-Authored-By` lines. Commits use the owner's git identity.
- Stay high-level. Don't front-load implementation detail or long question lists. When the owner says "later", drop that topic until they bring it back.
- Make one step, explain it briefly, wait. Short, direct communication.
- Don't push or add remotes unless asked.
