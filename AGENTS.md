# Project agent rules

Before creating a page, a new domain (feature area), or pulling anything from a component
registry, read [`.agents/domain-structure.md`](.agents/domain-structure.md). It defines the
domain-driven folder structure, layers, naming, dependency rules, and how registry blocks
become feature code.

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

Declare every env var in `src/env.ts` and `.env.example`. Read through `env` from `@/env`, never `process.env` (Biome enforces this in `src/`). Validation runs when `next.config.ts` loads, so `dev`/`build` fail fast. Client and shared vars must also be listed by full name in `experimental__runtimeEnv` so Next can inline them. `SKIP_ENV_VALIDATION=1` skips validation (e.g. Docker image builds).

## Data

TanStack Query is the data layer and nuqs holds URL state. Every feature reads data through `ui/ -> query/ -> service/`; base services return mock data with a delay. Providers (QueryClient, nuqs adapter) live in `src/components/_common/providers.tsx`. Details: `.agents/domain-structure.md` (Data flow).

## Code style

- No comments in source files. Put rules and reasons in these docs.
- Folder layout, naming and import rules: `.agents/domain-structure.md`.

## UI and tokens

- shadcn on Base UI primitives (`base-vega` style), installed into `src/components/_ui/`. Add components with `pnpm exec shadcn add <name> --dry-run` first, then for real, then `pnpm lint:fix`.
- Dashboard blocks come from the `@dashboardblocks` registry (docs: https://www.dashboardblocks.com/llms.txt). Base parts live in `src/components/dashboardblocks/`; numbered blocks (`kpi-01`, …) are recipes ported into `feature/`, never imported (see `.agents/domain-structure.md`).
- Registry code is vendored: `src/components/_ui/`, `src/components/dashboardblocks/`, `src/lib/dashboardblocks/` are formatted but not linted. Prefer composing over editing them.
- Tokens are shadcn CSS variables in `src/app/globals.css`: `:root` (light), `.dark` (dark), mapped to Tailwind in `@theme inline`. Default theme matches dashboardblocks: shadcn neutral + blue chart scale. Blocks read chart colors from `--chart-2` (strongest) to `--chart-1` (lightest). Change the look there only; never hardcode colors. Preview everything at `/tokens` (dev only).
- Dark mode: `next-themes`, class strategy, defaults to system. Client providers (theme, tooltip, dashboardblocks `LinkProvider`) live in `src/components/_common/providers.tsx`.
- Dashboard frame: `src/app/dashboard/layout.tsx` renders `DashboardShell` from `src/components/_common/` (sidebar + header + content). Nav items are data in `_common/sidebar/sidebar-nav.tsx`.
- A link that looks like a button is `<Link className={buttonVariants()}>`, not `<Button render={<Link />}>` (that gives the link `role="button"`).
