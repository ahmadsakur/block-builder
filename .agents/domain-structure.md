# Domain-Driven Folder Structure

Read this before creating a new page, a new domain of work (a feature area such as
`billing`, `crm`, `projects`), or before pulling anything in from a component registry.
It defines where code lives, how the layers depend on each other, and how registry
components become feature code. `feature/back-office/home` is the reference
implementation. Mirror it.

All paths are under `src/`.

## The top-level buckets

| Folder        | Owns                                   | Rule |
| ------------- | -------------------------------------- | ---- |
| `app/`        | Routing only                           | Pages, layouts, `metadata`, route guards (`notFound`, `redirect`), SEO files, `globals.css`. Pages stay thin: they import a container from `feature/` and attach metadata. No feature UI or logic inline. |
| `feature/`    | Domain code                            | Everything specific to one feature: its UI, types, data, logic, state. One folder per domain, nested to mirror the route tree. |
| `components/` | Shared, domain-agnostic building blocks | `_ui/` (shadcn primitives), `dashboardblocks/` (dashboardblocks base parts), `_common/` (our shared composites: `shell/` with sidebar, header, ⌘K and user menu; data table, form fields, skeletons, error pages, theme toggle, providers). Must not depend on `feature/`. |

Other shared roots: `lib/` (generic utilities: `cn`, and `lib/auth/` for the session every
area reads), `hooks/` (shared hooks), `env.ts` (typed env, see AGENTS.md).

## Where code goes

Put code at the lowest owner that covers every user of it:

| Used by | Lives in |
| --- | --- |
| One domain | that domain |
| Sibling sub-domains (`auth/sign-in`, `auth/sign-up`) | the parent's `_shared/` |
| A whole area (its nav data, header widgets) | the area's `_shared/` (`feature/back-office/_shared/`) |
| Every area, domain-agnostic (shell, table kit, session) | `components/_common/`, `lib/`, `hooks/` |
| Web and API (schemas, roles, avatar limits) | `packages/shared` |

Domains never share code with each other. When two areas need the same screen (profile,
notifications), each area owns its own copy and the copies may drift.

## Mapping routes to domains

`feature/` mirrors the URL structure under `app/`. Route segment and domain folder share
the same name and nesting.

```
app/(landing)/page.tsx            ->  feature/landing/
app/(auth)/sign-in/page.tsx       ->  feature/auth/sign-in/
app/back-office/home/page.tsx     ->  feature/back-office/home/
app/back-office/profile/page.tsx  ->  feature/back-office/profile/
app/dashboard/profile/page.tsx    ->  feature/dashboard/profile/
```

`app/` and `feature/` hold four roots only: `auth`, `landing`, `back-office` (root role)
and `dashboard` (user role). Route groups (`(auth)`, `(landing)`) keep the URL clean.

A `page.tsx` renders a container and nothing else of substance:

```tsx
import type { Metadata } from "next";
import HomeContainer from "@/feature/back-office/home/ui/home.container";

export const metadata: Metadata = { title: "Home" };

export default function DashboardHomePage() {
  return <HomeContainer />;
}
```

## Inside a domain

A domain folder is split by functionality. Create only the layers the domain needs.

```
feature/<area>/<domain>/
  ui/
    <domain>.container.tsx        entry component the route renders; wires query hooks to components
    components/<part>/*.tsx       dumb feature components: data in via props, events out
  query/
    <domain>.query.ts             TanStack Query hooks + keys, and the page's URL filters (nuqs)
  service/
    <domain>.service.ts           async functions the query hooks call; mock bodies in base
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

## Data flow

```
ui/  ->  query/  ->  service/
```

- **ui/** never fetches. Components get data and `status` via props; the container
  calls the query hooks.
- **query/** owns how the page asks for data: query keys, `useQuery`/`useMutation`
  hooks, `keepPreviousData` for filter changes, invalidation. Page filters that belong
  in the URL (date range, search, pagination) are nuqs parsers here, and they feed the
  query keys. A page whose container reads nuqs params is wrapped in `<Suspense>` in its
  `page.tsx`.
- **service/** is plain async functions with typed inputs and outputs from `types/`.
  In base they return `data/` + `logic/` results after `delay()` from `@/lib/delay`.
  A backend branch rewrites only these function bodies (a fetcher, a Supabase call,
  Payload, …); `ui/` and `query/` stay untouched. Server-side code, if a backend needs
  any, is defined in that branch.

Map query state to block status with `isPending` → `"loading"` and `isError` →
`"error"`, and dim on refetch with `BlockBusy busy={query.isPlaceholderData}`. See
`feature/back-office/home/ui/home.container.tsx` and its test for the full pattern.

## Registry components (shadcn, dashboardblocks)

`components/_ui/` and `components/dashboardblocks/` are **vendored registry code**:
Biome formats them and runs only our raw-color rule on them (built-in lint rules are off),
and we prefer composing them over editing them. The look comes from tokens in
`app/globals.css`, not from edits here.

The one deliberate edit: registry code hardcodes some colors (dashboardblocks status
colors in emerald, red, orange and sky; shadcn overlays in `bg-black/10`). We map them to
our tokens: `text-success`, `text-destructive`, `text-warning`, `text-info`, their
`bg-*/10` soft backgrounds, `var(--color-success)` etc. for fills, and `bg-overlay/10` for
scrims. The Biome plugin `lint/no-raw-colors.grit` flags any raw color, so newly installed
blocks fail `pnpm lint` until they're mapped.

**Numbered blocks are recipes, never imports.** dashboardblocks ships examples named
`kpi-01`, `data-table-02`, `dashboard-01`, … Pages and features never import a numbered
block. To use one:

1. Preview it: `pnpm exec shadcn add @dashboardblocks/<block> --dry-run` (or `--view`).
2. From a clean git tree, install it with `-y --overwrite` (without `--overwrite` the CLI
   stops on an interactive prompt). Then `git diff` the existing files it touched and
   `git restore` the ones we customized (the token-mapped files above, any edited `_ui`
   component). New files stay. Run `pnpm lint:fix` and map any raw colors it reports.
3. Port the numbered file into `feature/<domain>/ui/components/<part>/<name>.tsx` with a
   domain name (`revenue-chart.tsx`, not `chart-panel-01.tsx`). Drop its `exampleProps`.
   Move its seed data to `data/`, its derivations and sentences to `logic/`, its shapes
   to `types/`.
4. Delete the numbered file (and its folder) from `components/dashboardblocks/`.

Base parts stay shared: `block-state`, `kpi`, `chart`, `chart-panel`, `stat-group`,
`table`, `breakdown`, `funnel`, `forecast`, `inventory`, `dashboard-header`, `app-shell`, ….

Always `--dry-run` before `shadcn add`. A block re-installs the `_ui` components and base
parts it depends on, so step 2's restore is what protects our customizations.

## Lists and tables

Every list page pages, sorts, searches and filters **in the service**, not in the browser,
so it works the same on any backend.

Exception: a short list root curates by hand (plans) loads whole and searches and pages
in the browser with `useDataTable` (`globalFilter`, `pageSize` 10). Reference:
`feature/back-office/plans/list/`.

- Contract (`lib/list-query.ts`): the service takes a `ListQuery` (`page`, 1-based;
  `pageSize`; `sort: { id, desc }[]`; `search`) plus the domain's filters, and returns a
  `ListResult<T>`: `{ rows, total, facets? }`. `facets` are per-filter counts for the
  facet menus, each counted without its own filter.
- URL state: `listQueryParsers()` gives the nuqs parsers (`?page=2&size=20&sort=mrr.desc&q=…`);
  add one `parseAsArrayOf(parseAsStringLiteral(...))` per filter. Debounce the search
  before it reaches the query (`hooks/use-debounced-value.ts`).
- Table: `components/_common/data-table/use-server-data-table.ts` binds that state to
  dashboardblocks' `useDataTable` in server mode; render rows with `DataTableContent` and
  `DataTablePagination`. Give the block state only `loading`/`error`. Pass `empty` to
  `DataTableContent`: an `EmptyState` with a create action when the list has no records
  at all (`total === 0`, nothing filtered), otherwise a no-match `EmptyState` whose Clear
  resets every filter key, the search and the page. On `error`, swap the table for an error
  `EmptyState` with Try again (`refetch()`) and hide the pagination.
- Toolbar, always in this order: `ColumnMenu` on the left; on the right
  `<FilterMenu>…` then `DataTableReset` then `TableSearch`. All three live in
  `components/_common/data-table/`. `TableSearch` is the input with the search icon inside.
  `FilterMenu` is the split trigger (`Status | All ⌄`): label, divider, current value, and
  an active state when something is picked; multi-select by default with facet counts and a
  Clear item, `multiple={false}` for single-choice radios. Search and filters read and write
  the URL state directly; only `ColumnMenu` and row selection go through the table.
- Do not use dashboardblocks' `DataTableSearch`, `DataTableFacetFilter` or
  `DataTableViewOptions` in pages; ours replace them.
- Any component that reads TanStack table state while rendering (selection, visibility)
  starts with `"use no memo"`: the table object keeps its identity, so React Compiler would
  otherwise memoize stale UI.
- Row actions: a last display column (`id: "actions"`) renders a `…` menu with the row's
  actions. Columns stay module-level constants; cells that need callbacks or data from the
  page (row menu, labels from another query) read a small context the table provides
  (`ui/components/table/user-table-context.ts`).
- Reference: `feature/back-office/users/` (columns in `ui/components/table/`; the service
  passes the query to the API with `userListSearchParams`).

## Forms

React Hook Form + zod + shadcn `Field`. The zod schema lives in `types/` and its inferred
type is the form's input type. Fields come from `components/_common/form/`: `TextField`
(text, email, password, number) and `SelectField`, each label + control + description +
error wired through `Controller`. A form component is dumb: it validates and calls
`onSubmit(values)`; its container runs the mutation and passes `pending` and `error` back
down. Server errors render as a form-level `FieldError`. See `feature/auth/sign-in/`.

### Create and edit: one `<feature>-form.tsx`

- One form for both: `customer-form.tsx` takes `customer?: Customer`. No record means
  create (empty defaults), a record means edit (defaults from the record). Never pass a
  separate `mode` prop.
- Copy lives in one function next to the form (`customerFormCopy(customer?)`): wrapper
  title and description, CTA and pending label for both modes.
- Remount per target: render it as `<CustomerForm key={customer?.id ?? "new"} />`. React
  Hook Form only reads `defaultValues` on mount.
- Track `{ open, customer }`, not just the record. Closing sets `open: false` and keeps the
  record, so the wrapper's exit animation doesn't flash create-mode labels. Call the
  mutation's `reset()` when opening, so an old error doesn't show.
- The container chooses: `id ? updateX(id, input) : createX(input)` in one `useSaveX`
  mutation; the service keeps separate `createX` and `updateX`, since backends differ.
- Wrapper by size: up to ~4 short fields → `Dialog`; more, or anything that may grow →
  `Sheet` from the right (keeps the list visible).
- Delete always confirms in an `AlertDialog` that names the record and says it can't be
  undone. The confirm button is a plain destructive `Button` that waits for the mutation
  (`AlertDialogAction` would close immediately).
- Feedback: `toast.success(...)` from `sonner` after a save or delete; errors stay inline.
- Reference: `feature/back-office/users/ui/components/form/` (edit-only form in a
  dialog) and `feature/back-office/plans/_shared/ui/form/` (create and edit), with
  container tests that mock the service.

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

- Domain code from outside the domain: `@/feature/<area>/<domain>/...`.
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
  that needs domain data receives it as props. When the shell needs a whole feature
  widget, the route layout passes it in as a slot: `app/back-office/layout.tsx` fills
  `DashboardShell`'s `nav` (menu data) and `headerActions` (notifications bell), both from
  `feature/back-office/_shared/`.

## Checklist for a new page or domain

1. Create `feature/<route path>/` with the layers it needs (start with `ui/`).
2. Add `ui/<name>.container.tsx`. If the page shows data, add `service/` (mock) and
   `query/` and wire them through the container.
3. Add the route under `app/`: a thin `page.tsx` that renders the container.
4. Add the page to the area nav data (`feature/<area>/_shared/data/<area>-nav.data.tsx`) if it
   belongs in the dashboard.
5. Types in `types/`, data in `data/`, pure functions in `logic/` (with tests), state in
   `store/`. Nothing domain-specific in shared roots.
6. Verify the dependency direction: nothing shared imports your domain.
7. Run `pnpm check` and `pnpm build`.
