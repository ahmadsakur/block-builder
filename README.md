# block-builder

Personal app in a pnpm + Turborepo monorepo: a Next.js frontend (`apps/web`) and a Hono API (`apps/api`) with real auth and roles. Data services other than auth still run on mock data.

## Getting started

```bash
gh repo clone ahmadsakur/block-builder
cd block-builder
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env       # set DATABASE_URL, BETTER_AUTH_SECRET, ROOT_PASSWORD
podman compose up -d                          # Mailpit: SMTP :1025, inbox http://localhost:8025
pnpm --filter @block-builder/api db:migrate
pnpm --filter @block-builder/api db:seed      # creates the root user from ROOT_EMAIL / ROOT_PASSWORD
pnpm dev                                      # web :3000, api :3001
```

Comments in each `.env.example` say how to fill it. Sign in as root to land on `/back-office`; register a new account (verify it from Mailpit) to land on `/dashboard`.

To prove the built images run: `podman compose --profile app up --build` (own Postgres, migrates and seeds on start), then `podman compose --profile app down -v --rmi all`.

## Stack

pnpm workspaces + Turborepo. API: Hono on Node, better-auth (email + password, verification, reset, admin roles), Drizzle + Postgres, nodemailer SMTP, local or S3 file storage. Web: Next 16 (App Router, `src/`), React 19, Tailwind 4, shadcn 4 on Base UI, `@dashboardblocks` registry TanStack Query + Table, nuqs, React Hook Form + zod, Biome, Vitest, lefthook. pnpm only.

## What is in the box

- Auth on better-auth: sign-up with email verification, sign-in, forgot and reset password by email, profile with photo upload.
- Two roles: one `root` (seeded from env) on `/back-office`, self-registered `user`s on `/dashboard`, same shell with per-role menus.
- Dashboard shell: sidebar, header, ⌘K menu, notifications, dark mode.
- Home dashboard and a customers list (server-side table, filters, URL state, create/edit/delete).
- Skeletons, empty and error states, 404 and error boundary.
- Design tokens in `src/app/globals.css`.

## Commands

| Command | Does |
|---|---|
| `pnpm dev` | Web on http://localhost:3000, API on http://localhost:3001 |
| `pnpm check` | Lint + typecheck + tests. Must pass before work is done. |
| `pnpm lint:fix` | Biome auto-fix |
| `pnpm test` | Vitest in watch mode |
| `pnpm build` | Production build |

## Working with agents

`AGENTS.md` (loaded through `CLAUDE.md`) holds the project rules. Folder layout, naming and data flow are in `.agents/domain-structure.md`. Optional layers (an auth library, payments) are recipes in `.agents/addons/`.

## History

Started from a personal Next.js starter with one branch per backend; this repo kept the Supabase variant on `main` until the move to a monorepo with its own backend. The original create-next-app scaffold is tagged `scaffold`.
