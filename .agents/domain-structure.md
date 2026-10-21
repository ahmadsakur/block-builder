# Domain-Driven Folder Structure

Read this before creating a new page, a new domain of work (a feature area such as
`billing`, `crm`, `projects`), or before pulling anything in from a component registry.
It defines where code lives, how the layers depend on each other, and how registry
components become feature code. `feature/dashboard/home` is the reference
implementation. Mirror it.

All paths are under `src/`.

## The top-level buckets

| Folder        | Owns                                   | Rule |
| ------------- | -------------------------------------- | ---- |
| `app/`        | Routing only                           | Pages, layouts, `metadata`, route guards (`notFound`, `redirect`), SEO files, `globals.css`. Pages stay thin: they import a container from `feature/` and attach metadata. No feature UI or logic inline. |
| `feature/`    | Domain code                            | Everything specific to one feature: its UI, types, data, logic, state. One folder per domain, nested to mirror the route tree. |
| `components/` | Shared, domain-agnostic building blocks | `_ui/` (shadcn primitives), `dashboardblocks/` (dashboardblocks base parts), `_common/` (our shared composites: dashboard shell, sidebar, header, theme toggle, providers). Must not depend on `feature/`. |

Other shared roots: `lib/` (generic utilities: `cn`), `hooks/` (shared hooks), `env.ts`
(typed env, see AGENTS.md).

## Mapping routes to domains

`feature/` mirrors the URL structure under `app/`. Route segment and domain folder share
the same name and nesting.

```
app/page.tsx                    ->  feature/landing/
app/tokens/page.tsx             ->  feature/tokens/
app/dashboard/home/page.tsx     ->  feature/dashboard/home/
app/dashboard/billing/page.tsx  ->  feature/dashboard/billing/
```

A `page.tsx` renders a container and nothing else of substance:

```tsx
import type { Metadata } from "next";
import HomeContainer from "@/feature/dashboard/home/ui/home.container";

export const metadata: Metadata = { title: "Home" };

export default function DashboardHomePage() {
  return <HomeContainer />;
}
```

## Inside a domain

A domain folder is split by functionality. Create only the layers the domain needs.

```
feature/dashboard/<domain>/
  ui/
    <domain>.container.tsx        entry component the route renders; owns page state
    components/<part>/*.tsx       feature components, grouped by UI part
  types/
    <name>.types.ts               type definitions + domain constants (enums, options)
  data/
    <name>.data.ts                seed/static/mock data for this domain
  logic/
    <name>.logic.ts               pure functions: derivations, summaries, formatting
    <name>.logic.test.ts          tests for that logic, next to it
  store/
    <name>.store.ts               client state shared across this domain's components
  _shared/
    ui/ logic/ types/             code shared by sibling sub-domains of this domain only
```

Nest `ui/components/<part>/` by the sections of the screen (`header/`, `stats/`,
`revenue/`, `products/`, `table/`, `toolbar/`, `detail/`). A small feature can keep its
components flat in `ui/components/`. A sub-domain (like `billing/invoices`,
`billing/quotes`) gets its own folder with the same internal grammar; code shared
between siblings goes in the parent's `_shared/`.

Data fetching layers (`query/`, `_server/`) are defined per backend branch, not here.

## Registry components (shadcn, dashboardblocks)

`components/_ui/` and `components/dashboardblocks/` are **vendored registry code**:
Biome formats them but doesn't lint them, and we prefer composing them over editing them.
The look comes from tokens in `app/globals.css`, not from edits here.

**Numbered blocks are recipes, never imports.** dashboardblocks ships examples named
`kpi-01`, `data-table-02`, `dashboard-01`, … Pages and features never import a numbered
block. To use one:

1. Preview it: `pnpm exec shadcn add @dashboardblocks/<block> --view` (or `--dry-run`).
2. Install it, so its base parts land in `components/dashboardblocks/` and `components/_ui/`.
3. Port the numbered file into `feature/<domain>/ui/components/<part>/<name>.tsx` with a
   domain name (`revenue-chart.tsx`, not `chart-panel-01.tsx`). Drop its `exampleProps`.
   Move its seed data to `data/`, its derivations and sentences to `logic/`, its shapes
   to `types/`.
4. Delete the numbered file (and its folder) from `components/dashboardblocks/`.

Base parts stay shared: `block-state`, `kpi`, `chart`, `chart-panel`, `stat-group`,
`table`, `breakdown`, `funnel`, `forecast`, `inventory`, `dashboard-header`, `app-shell`, ….

Always `--dry-run` before `shadcn add`. A block re-installs the `_ui` components it
depends on, and `--overwrite` would replace any we customized.

## Naming

- Folders and component files: `kebab-case` (`revenue-chart.tsx`, `low-stock-list.tsx`).
- Containers: `<name>.container.tsx` with a default export named `<Name>Container`.
- Feature and `_common` components: default export, named after the file
  (`revenue-chart.tsx` → `RevenueChart`). Vendored `_ui`/`dashboardblocks` keep their
  named exports.
- Layer files use the dot suffix matching their folder: `*.types.ts`, `*.data.ts`,
  `*.logic.ts`, `*.store.ts`.
- Constants: `SCREAMING_SNAKE_CASE` (`DEFAULT_QUERY`, `NAV_SECTIONS`).
- No comments in source files. Explain rules in these docs instead.

## Imports

- Domain code from outside the domain: `@/feature/dashboard/<domain>/...`.
- Shared code: `@/components/...`, `@/lib/...`, `@/hooks/...`.
- Within a domain, relative imports between its own files (`../../../logic/home.logic`).
- Types from `types/*.types.ts`, values from `data/*.data.ts`; don't mix them in one module.

## Dependency rules (direction matters)

```
app/  ->  feature/  ->  components/, lib/, hooks/
```

- `app/` may import from `feature/` and shared roots.
- `feature/` may import from `components/`, `lib/`, `hooks/`, and its own domain.
- A domain doesn't import from a sibling domain. If two need the same thing, promote it
  to a shared root (`components/_common`, `lib/`) or a parent `_shared/`.
- **`components/`, `lib/` and `hooks/` never import from `feature/`.** A shared component
  that needs domain data receives it as props.

## Checklist for a new page or domain

1. Create `feature/<route path>/` with the layers it needs (start with `ui/`).
2. Add `ui/<name>.container.tsx`.
3. Add the route under `app/`: a thin `page.tsx` that renders the container.
4. Add the page to the sidebar nav data (`components/_common/sidebar/sidebar-nav.tsx`) if it
   belongs in the dashboard.
5. Types in `types/`, data in `data/`, pure functions in `logic/` (with tests), state in
   `store/`. Nothing domain-specific in shared roots.
6. Verify the dependency direction: nothing shared imports your domain.
7. Run `pnpm check` and `pnpm build`.
