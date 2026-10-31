# Plans and permissions: API contract (v1)

Status: built and tested in phase 0. The backend is the source of truth; the web builds
against it directly (no mocks). Types and schemas come from `@block-builder/shared/*`,
paths from `API` in `@block-builder/shared/api`. Call endpoints with `api()` /
`apiBlob()` from `apps/web/src/lib/api.ts`.

## Model

- Roles: `root` (back office) and `user` (dashboard). Root ignores plans.
- Plans: `free`, `pro` (`PLAN_IDS`). A user's plan is `session.user.plan`.
- Permission catalog (code, `FEATURES` in `/entitlements`):

| Feature | Key | Kind | Meaning |
|---|---|---|---|
| Projects | `projects.max` | limit | how many projects a user can keep |
| Projects | `projects.export` | flag | download projects as CSV |
| Analytics | `analytics.view` | flag | open the analytics page |

- A value is `{ enabled: boolean, limit: number | null }`. Flags read `enabled`. Limits:
  `enabled: false` means 0, `limit: null` means unlimited. Helpers: `isAllowed`,
  `limitOf`, `hasRoom`.
- Defaults (seed): Free = 3 projects, no export, no analytics. Pro = 25 projects, export,
  analytics. Root can change any value.

## Errors

Every error body is `ApiErrorBody`: `{ message, code?, permission? }`. Show `message` as
is. `code` is `FEATURE_LOCKED` or `LIMIT_REACHED` on a 403 caused by the plan, with the
`permission` key; use it to offer an upgrade (`upgradeHref(permission)` from
`@/lib/auth/routes`). `api()` throws `ApiError`; `isAccessError(error)` tells plan
errors apart.

## Root scope: `/api/v1/root/*` (role `root` only)

| Method | Path (`API.root.*`) | Request | Response |
|---|---|---|---|
| GET | `users` | query: `userListSearchParams(UserListQuery)` | `ListResult<ManagedUser>` with `facets.plan` |
| PATCH | `userPlan(id)` | `UserPlanInput` (`userPlanSchema`) | `ManagedUser` |
| GET | `plans` | | `PlanSummary[]` (with `userCount`) |
| PATCH | `plan(id)` | `PlanUpdateInput` (`planUpdateSchema`) | `Plan` |
| GET | `permissions` | | `PermissionMatrix` (`plans`, one `values` row per plan × key) |
| PUT | `permission(planId, key)` | `PermissionValue` (`permissionValueSchema`) | `PlanPermission` |

Users lists only role `user`. Sort fields: `USER_SORT_FIELDS`. Search matches name or
email.

## User scope: `/api/v1/user/*` (role `user` only)

| Method | Path (`API.user.*`) | Request | Response | Plan check |
|---|---|---|---|---|
| GET | `entitlements` | | `MyEntitlements` (`plan`, `entitlements`, `usage`) | |
| GET | `plans` | | `PlanWithEntitlements[]` (for the upgrade page) | |
| GET | `projects` | | `Project[]`, newest first | |
| POST | `projects` | `ProjectInput` (`projectInputSchema`) | `Project` (201) | `LIMIT_REACHED` past `projects.max` |
| DELETE | `project(id)` | | 204 | |
| GET | `projectsExport` | | `text/csv` (use `apiBlob`) | `FEATURE_LOCKED` without `projects.export` |
| GET | `analytics` | | `AnalyticsSummary` (14 days, dummy) | `FEATURE_LOCKED` without `analytics.view` |

`usage["projects.max"]` is the user's current project count.

## Web wiring already in place

- `session.user.plan` (`useSessionQuery()`), typed `PlanId`.
- `src/proxy.ts` + `GATED_PAGES` in `src/lib/auth/routes.ts`: a `user` opening
  `/dashboard/analytics` without `analytics.view` is redirected to
  `/dashboard/upgrade?permission=analytics.view`. Add a gated page by adding it there.
- Sidebar items take a `badge` (ReactNode) in the area nav data; a lock badge can be a
  client component from the area's `_shared/`.

## Demo users (dev, `SEED_DEMO_USERS=true`)

| Email | Password | Plan |
|---|---|---|
| root email from `ROOT_EMAIL` | `ROOT_PASSWORD` | root |
| `free@demo.local` | `demo-password` | free, 2 projects |
| `pro@demo.local` | `demo-password` | pro, 4 projects |
