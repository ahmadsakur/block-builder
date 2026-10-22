# bp-boilerplate

Personal Next.js starter for client projects. The frontend is ready (UI, tokens, conventions, mock data); pick a backend at project start and go straight to features.

Fork-and-forget: a project made from this template owns its code. There is no upgrade path back.

## Branches

Each branch is a complete app. Pick one per project.

| Branch | Backend | Setup after copy |
|---|---|---|
| `main` | None. Every service returns mock data. | Nothing. |
| `payload` | Payload CMS inside the Next app, SQLite by default, `/admin` for admins. | Set `PAYLOAD_SECRET`. Dev accounts are seeded on first boot. |
| `supabase` | Supabase Auth, Postgres and Storage. | Create a Supabase project, fill the keys, link and push migrations. |
| `vanilla` | A separate HTTP API; Next is frontend only. | Set `API_URL`. Services stay on mocks until the API exists. |

Backend details live on each branch in `.agents/backend-<branch>.md`.

## Start a project

```bash
pnpm dlx degit <owner>/bp-boilerplate#payload my-client-app
cd my-client-app
git init
pnpm install
cp .env.example .env.local
pnpm dev
```

Swap `#payload` for the branch you want; no `#` gives `main`. The repo is private, so add `--mode=git` (clones over SSH with your GitHub key).

Then:

1. Fill `.env.local` (comments in `.env.example` say how).
2. Follow "Day 1" in `.agents/backend-<branch>.md` if the branch has one.
3. Delete `goals.md`. It describes the template, not your project.
4. Rename `name` in `package.json`.

## Stack

Next 16 (App Router, `src/`), React 19, Tailwind 4, shadcn 4 on Base UI, `@dashboardblocks` registry, TanStack Query + Table, nuqs, React Hook Form + zod, Biome, Vitest, lefthook. pnpm only.

## What is in the box

- Auth screens: sign-in, sign-up, forgot and reset password, profile.
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

## Working with agents

`AGENTS.md` (loaded through `CLAUDE.md`) holds the project rules. Folder layout, naming and data flow are in `.agents/domain-structure.md`. Optional layers (an auth library, payments) are recipes in `.agents/addons/`.

## Maintaining the template

Shared frontend work lands on `main`, then `main` is merged into each backend branch. Backend work stays on its branch. The original create-next-app scaffold is tagged `scaffold`.
