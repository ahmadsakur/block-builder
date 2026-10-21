<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

pnpm only.

- `pnpm dev`: dev server.
- `pnpm lint` / `pnpm lint:fix`: Biome lint + format check / auto-fix.
- `pnpm typecheck`: route types + `tsc`.
- `pnpm test` (watch) / `pnpm test:run` (once). Tests live next to code as `*.test.ts(x)`.
- `pnpm check`: lint + typecheck + tests. Must pass before work is done.

## Automation

- Claude Code hooks (`.claude/settings.json`): each edited file is Biome-fixed; on stop, lint + typecheck + tests for changed files run when the tree changed.
- Git hooks (`lefthook.yml`): pre-commit Biome-fixes staged files; pre-push runs typecheck + tests.

## Env

Declare every env var in `src/env.ts` and `.env.example`. Read through `env` from `@/env`, never `process.env` (Biome enforces this in `src/`).

## UI and tokens

- shadcn on Base UI primitives (`base-vega` style). Add components with `pnpm exec shadcn add <name>`, then `pnpm lint:fix`.
- Dashboard blocks come from the `@dashboardblocks` registry (`pnpm exec shadcn add @dashboardblocks/<name>`, docs: https://www.dashboardblocks.com/llms.txt). They build on our `ui/` components and tokens.
- Registry code is vendored: `src/components/ui/`, `src/components/dashboardblocks/`, `src/lib/dashboardblocks/` are formatted but not linted. Prefer composing over editing them.
- Tokens are shadcn CSS variables in `src/app/globals.css`: `:root` (light), `.dark` (dark), mapped to Tailwind in `@theme inline`. Change the look there only; never hardcode colors. Preview everything at `/tokens` (dev only).
- Dark mode: `next-themes`, class strategy, defaults to system. Client providers (theme, tooltip, dashboardblocks `LinkProvider`) live in `src/app/providers.tsx`.
- Dashboard frame: `src/app/dashboard/layout.tsx` renders `DashboardShell` (sidebar + header + content) from `src/components/dashboard-shell/`. Nav items are data in `shell-nav.tsx`.
- A link that looks like a button is `<Link className={buttonVariants()}>`, not `<Button render={<Link />}>` (that gives the link `role="button"`).
