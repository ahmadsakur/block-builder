# block-builder

Personal Next.js app on Supabase. The frontend is ready (UI, tokens, conventions), auth and profile photos run on Supabase, and data services stay on mock data until the app has its own tables.

## Backend

Supabase is the whole backend: Auth, Postgres and Storage. All Supabase configuration lives in git (`supabase/config.toml`, `supabase/migrations/`). Details and the setup checklist: `.agents/backend-supabase.md`.

## Getting started

```bash
gh repo clone ahmadsakur/block-builder
cd block-builder
pnpm install
cp .env.example .env.local
pnpm dev
```

Then:

1. Fill `.env.local` (comments in `.env.example` say how).
2. Link a Supabase project and push migrations and config: follow "Day 1" in `.agents/backend-supabase.md`.

## Stack

Next 16 (App Router, `src/`), React 19, Tailwind 4, shadcn 4 on Base UI, `@dashboardblocks` registry, Supabase (`@supabase/ssr`), TanStack Query + Table, nuqs, React Hook Form + zod, Biome, Vitest, lefthook. pnpm only.

## What is in the box

- Auth screens on Supabase Auth: sign-in, sign-up, forgot and reset password, profile with photo upload.
- Dashboard shell: sidebar, header, ⌘K menu, notifications, dark mode.
- Home dashboard and a customers list (server-side table, filters, URL state, create/edit/delete).
- Skeletons, empty and error states, 404 and error boundary.
- Design tokens in `src/app/globals.css`, previewed at `/tokens` (dev only).

## Commands

| Command | Does |
|---|---|
| `pnpm dev` | Dev server on http://localhost:3000 |
| `pnpm check` | Lint + typecheck + tests. Must pass before work is done. |
| `pnpm lint:fix` | Biome auto-fix |
| `pnpm test` | Vitest in watch mode |
| `pnpm build` | Production build |
| `pnpm db:push` / `pnpm db:config` | Apply migrations / `config.toml` to the linked Supabase project |
| `pnpm db:types` | Regenerate `src/lib/supabase/database.types.ts` |

## Working with agents

`AGENTS.md` (loaded through `CLAUDE.md`) holds the project rules. Folder layout, naming and data flow are in `.agents/domain-structure.md`. Optional layers (an auth library, payments) are recipes in `.agents/addons/`.

## History

Started from a personal Next.js starter with one branch per backend; this repo keeps the Supabase variant on `main`. The original create-next-app scaffold is tagged `scaffold`.
