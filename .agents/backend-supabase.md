# Backend mode: supabase

Read this before touching any `service/`, the database schema, or auth on the `supabase`
branch. Supabase is the whole backend: Auth, Postgres, and later Storage. The browser talks
to Supabase directly through `@supabase/ssr`. There's no `/api` rewrite and no route handlers.

The template is built **without** a Supabase project. Code is verified with typecheck,
tests and build. A real project is one checklist away (Day 1 below).

## Rule: the repo is the source of truth, never the dashboard

Every setting that the Supabase dashboard can change lives in git and is pushed with the CLI:

| What | Where | Ship with |
|---|---|---|
| Auth settings (site URL, redirect URLs, password rules, email confirmation, SMTP, rate limits) | `supabase/config.toml` | `pnpm db:config` |
| Schema, RLS policies, functions, grants | `supabase/migrations/*.sql` | `pnpm db:push` |
| Dev data | `supabase/seed.sql` (create when needed) | `supabase db push --include-seed` |
| TypeScript types | `src/lib/supabase/database.types.ts` | `pnpm db:types` (generated, never hand-edit after the first run) |

- Use the dashboard to **look** (logs, users, table data), never to edit.
- If something was changed in the dashboard by mistake, pull it back into git:
  `supabase db pull` for schema, `supabase config pull` for config.
- The CLI is a pinned dev dependency (`pnpm exec supabase …`). Check commands with
  `--help`, since the CLI changes between versions.
- The Supabase agent skills (`supabase`, `supabase-postgres-best-practices`) hold the
  security checklist. Load them before writing SQL or auth code.

## What exists

- **Env**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, both
  required.
  - `dev` and `build` fail without them.
  - `pnpm typecheck` skips env validation (`SKIP_ENV_VALIDATION=1` via pnpm's
    `shellEmulator`), and vitest gets dummy values from `vitest.config.mts`.
  - Never put the secret or `service_role` key in a `NEXT_PUBLIC_` var.
- **Clients**: `src/lib/supabase/client.ts` (browser, used by services) and `server.ts`
  (Server Components, route handlers, server actions). Both are typed with `Database`.
- **Proxy**: `src/proxy.ts` refreshes the session with `getClaims()` on every matched
  request and handles redirects:
  - signed out on `/dashboard/*` → `/sign-in`
  - signed in on `/sign-in`, `/sign-up` or `/forgot-password` → `/dashboard`
  It always returns the response that carries the refreshed cookies. Never trust
  `getSession()` on the server.
- **Auth service** (`feature/auth/_shared/service/auth.service.ts`) on Supabase Auth,
  same signatures as base:
  - `getSession` → `getUser()`, `null` when signed out
  - `signIn` → `signInWithPassword`
  - `signUp` → `signUp` with `name` in `user_metadata`. If email confirmation is on,
    Supabase returns no session and the form shows "Check your email to confirm…".
  - `requestPasswordReset` → `resetPasswordForEmail`, `redirectTo` =
    `NEXT_PUBLIC_APP_URL/reset-password`
  - `resetPassword({ token })`:
    - `token` is the PKCE `code`. A `next.config.ts` redirect copies `?code=` into
      `?token=`, so the base reset page works unchanged.
    - The service calls `exchangeCodeForSession` → `updateUser({ password })` → local
      sign-out.
    - The link only works in the browser that requested it (PKCE verifier cookie).
  - `updateProfile` → `updateUser({ data: { name }, email? })`. A new email waits for
    confirmation (`double_confirm_changes`), so the returned email stays the old one
    until then.
  - `changePassword` → re-sign-in with the current password (Supabase doesn't check
    it), then `updateUser({ password })`.
  - `deleteAccount` → `rpc("delete_own_account")`, then local sign-out.
  - Errors: Supabase error codes map to our copy in `_shared/logic/auth.logic.ts`, and
    everything else uses Supabase's message. Each function still throws
    `Error(message)`.
  - `user_metadata` (name, avatar) is user-editable. Use it for display only, never in
    RLS or authorization. Use `app_metadata` for roles.
- **Migration** `supabase/migrations/*_delete_own_account.sql`:
  - `private.delete_own_account()` is `security definer`, lives in a non-exposed schema,
    checks `auth.uid()` and deletes only the caller.
  - `public.delete_own_account()` is a `security invoker` wrapper that the API exposes.
  - Execute is granted to `authenticated` only (revoked from `public` and `anon`).
- **Config** (`supabase/config.toml`): `site_url` is `http://localhost:3000`, the reset
  URL is allow-listed, minimum password length is 8 (matches our zod schema), and email
  confirmation is off.
- **Storage**: `avatars` bucket and profile photo upload. See "Storage" below.
- **Data services are still mock** (customers, notifications, home).
- **Theme**: primary, ring, sidebar-primary and the chart scale use Supabase green
  tokens in `globals.css`.

## Storage: profile photo (reference pattern)

The profile page uploads a photo. Copy this pattern for any per-user file.

- **Bucket and access rules live in a migration** (`*_avatars_bucket.sql`), not
  `config.toml`.
  - `insert into storage.buckets … on conflict do update` sets `avatars`: public, 1 MB
    limit, `image/webp|png|jpeg`.
  - Policies on `storage.objects` let `authenticated` users select, insert, update and
    delete only objects whose first folder is their `auth.uid()`.
  - Public read goes through the public URL, so no policy is needed for it. The select
    policy is still required for `list()` and `remove()`.
  - (`[storage.buckets]` in `config.toml` only seeds buckets with `supabase seed buckets`.
    A migration keeps the bucket and its rules together and ships with `db push`.)
- **Client-side processing**: `squareImage()` in `lib/image.ts` center-crops to a square
  and re-encodes to 256 px WebP (~20 KB) before upload. That needs no paid image
  transformations, and the 1 MB bucket limit becomes a backstop. Validation (PNG, JPEG or
  WebP, ≤ 5 MB before processing) is in `profile.logic.ts`.
- **Paths**: `<uid>/<random uuid>.webp`, a new name per upload, so the URL changes and
  browser/CDN caches never show a stale photo. `cacheControl` is one year.
- **Orphans**, in `auth.service.ts`:
  - upload succeeds but saving `avatar_url` fails → the new file is removed right away
  - after a successful change → `sweepAvatars` lists `<uid>/` and removes everything
    except the new file (the previous photo, plus leftovers from any interrupted
    attempt)
  - Remove photo → `avatar_url = null`, then sweep the whole folder
  - Delete account → sweep first. If that fails, the account is **not** deleted, so files
    are never orphaned without an owner. Deleting rows from `storage.objects` with SQL
    leaves the files in storage, so it must go through the Storage API.
- **UX** (`avatar-picker.tsx`, passed into `ProfileForm` as its `avatar` slot):
  - the avatar in Personal info is the control: hover or focus shows a pencil, click
    opens the file picker
  - while uploading, a local preview shows under a spinner
  - a small × in the corner removes the photo (only when one exists)
  - validation and server errors show as `toast.error`, success as `toast.success`
  - the session cache updates, so the sidebar user menu changes too
- **Check from the CLI**:
  `pnpm exec supabase storage ls ss:///avatars/<uid>/ --linked --experimental`

## Day 1 of a real project (the "one step")

From a clean clone of `main`:

```bash
pnpm exec supabase login                       # needs a real terminal (not Claude's `!`): browser flow
pnpm exec supabase orgs list
pnpm exec supabase projects create <name> --org-id <org> --region <region> --db-password <generated>
pnpm db:link --project-ref <ref>
pnpm exec supabase projects api-keys --project-ref <ref>   # take the "publishable" key only
cp .env.example .env.local                     # fill NEXT_PUBLIC_SUPABASE_*, NEXT_PUBLIC_APP_URL, SUPABASE_DB_PASSWORD
pnpm db:push                                   # apply migrations (reads SUPABASE_DB_PASSWORD)
pnpm exec supabase config diff                 # must show only intended changes
pnpm db:config                                 # apply config.toml (auth settings)
pnpm exec supabase config diff                 # expect "clean"
pnpm exec supabase db advisors --linked        # security/perf advisors
pnpm db:types                                  # regenerate database.types.ts
pnpm dev
```

Lessons from the first run (2026-10-21, smoke project `bp-boilerplate-smoke`):

- **Always `config diff` before `config push`.** `config push` sends the whole file, so
  any local default that differs from the hosted one gets changed.
  - `config.toml` here is already aligned with hosted defaults: MFA TOTP on, pooler
    15/200, email `max_frequency` 1m, OTP length 8, storage analytics/vector off
    (paid-plan features).
  - Re-check after CLI upgrades, since `supabase init` defaults change.
- **Push auth config before the first sign-up.** Hosted projects start with email
  confirmation on. If it's still on, sign-up shows "Check your email…".
  - An account that signed up while confirmation was on can sign in once it's turned off.
- **The default email sender only delivers to members of the project's organization**
  and is rate-limited. Test the reset and confirm emails with your own Supabase account
  email.
- **Advisors**: the only warning on a fresh project is "Leaked password protection
  disabled". That's a paid-plan feature; turn it on in production (see below).

Before `db:config` on a deployed project, set `site_url` and `additional_redirect_urls` in
`config.toml` to the production URL (keep localhost entries for dev), and set
`NEXT_PUBLIC_APP_URL` to match.

Then smoke-test:
- sign up, sign out, sign in, and a wrong password shows the error
- forgot password: the email link works in the same browser and the new password signs in
- profile name save
- password change, with a wrong current password showing the error
- delete account
- `/dashboard` while signed out redirects to `/sign-in`

## Production checklist (decide per project)

- [ ] **Email confirmation**: turn on `[auth.email] enable_confirmations` for real users.
      The sign-up form then shows the confirm-email message.
- [ ] **SMTP**: the default email sender is rate-limited and, on the free tier, can't use
      custom templates. Configure `[auth.email.smtp]` in `config.toml` with
      `env(SMTP_PASS)`-style secrets.
- [ ] **Password rules**: `password_requirements` and `secure_password_change`. On a paid
      plan, enable leaked password protection (HaveIBeenPwned check), so the advisors
      come back clean.
- [ ] **OAuth providers**: `[auth.external.<provider>]` with `env()` secrets. Map
      `avatar_url` from provider metadata (already read by `toAuthUser`).

## Switching a data service to a table

Use `customers` as the example. `ui/` and `query/` stay untouched.

1. **Migration**: `pnpm db:new create_customers`, then write the SQL:
   - the table, with a `user_id`/`org_id` owner column and indexes on filter and sort
     columns
   - `alter table … enable row level security;`
   - policies per operation: `to authenticated` plus an ownership check in `using`, and
     `with check` on insert and update. An UPDATE also needs a SELECT policy.
   - **explicit grants**: since 2026, new tables are **not** exposed to the Data API
     automatically. `grant select, insert, update, delete on public.customers to authenticated;`
   - Run the security checklist from the `supabase` skill.
2. `pnpm db:push`, then `pnpm db:types`.
3. Rewrite the service body, keeping the signature. Map `ListQuery`:
   ```ts
   let q = supabase.from("customers").select("*", { count: "exact" });
   if (query.search) q = q.ilike("company", `%${query.search}%`);
   if (query.status.length) q = q.in("status", query.status);
   for (const { id, desc } of query.sort) q = q.order(id, { ascending: !desc });
   const from = (query.page - 1) * query.pageSize;
   const { data, count, error } = await q.range(from, from + query.pageSize - 1);
   ```
   Map `snake_case` columns to the domain type in `logic/`.
4. **Facets**: per-filter counts, each counted without its own filter. Use one count query
   per facet value, or a `security invoker` SQL function that returns them all. Drop
   `facets` if the project doesn't need counts.
5. Delete the mock `data/`, `delay()` and in-memory query logic, and switch the container
   tests to `vi.mock` of the service. See `profile.container.test.tsx`.

## Deferred

- Realtime (for example, live notifications).
- Server-side data fetching in Server Components with `lib/supabase/server.ts`.
