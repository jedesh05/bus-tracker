# Chennai Bus v1.0.0

A Next.js / TypeScript passenger application and separate admin application, with shared Supabase PostgreSQL, Auth (including TOTP MFA), private storage, and database-enforced permissions. Deploy the two applications only on Vercel.

## Current delivery status

This is a working local implementation and provisioned database, **not a completed production deployment**. No Vercel deployment has been created: the connected Vercel account returns HTTP 403 for team `team_JRvJd9LlyeiJb5RvOJNYvxrC`. The team owner must approve the connection's team-access link.

Supabase project: `dcgoamckiiqvkllxeggw`, **Chennai Bus**, Mumbai region, organization **AI web start up**. All 685 retrieved routes are stored as **unpublished drafts**. No permanent owner account has been assigned. Synthetic integration accounts and their feedback were deleted after testing.

The local reference preview can display the retrieved snapshot for review. Vercel ignores that preview flag and serves only database-published routes. Archiving all published routes will not repopulate the application from unpublished data.

See `STATUS.md` for remaining requirements and the test matrix. Do not promote to production until the release gates pass.

## Local setup

1. Install Node.js 22 or 24 LTS and run `npm ci`.
2. Copy `.env.example` to `.env.local` and configure the Supabase URL and publishable key. The legacy environment-variable name `NEXT_PUBLIC_SUPABASE_ANON_KEY` accepts the new publishable key. Neither value is a service-role secret.
3. `APP_MODE=public` serves the passenger application. Set `LOCAL_REFERENCE_PREVIEW=true` only to inspect the unpublished official snapshot locally.
4. Run `npm run dev`; use the URL printed by Next.js.
5. For admin development, set `APP_MODE=admin` and run `npm run dev -- --port 3001` in a separate terminal. Admin output uses `.next-admin`, public output `.next`.
6. On a managed workstation with a trusted corporate certificate authority, Node may need `NODE_OPTIONS=--use-system-ca`. Do not disable certificate verification. This is not needed on ordinary Vercel runtimes.

Only three main passenger navigation destinations exist: Routes & Search, Tourist Locations, Our Page. Account, settings, comparisons, route details, feedback, downloads, and source coverage use dialogs.

## Database migrations

SQL is in `supabase/migrations/` and is compatible with Supabase PostgreSQL. Apply files in numeric order to a new project with a trusted migration role. The hosted project already has these migrations applied through the connected Supabase migration tool, including the null-validation correction reflected in migration 004.

For a direct PostgreSQL workflow, set `DATABASE_URL` securely in the shell environment and run `npm run db:migrate`. It tracks filenames in `public.app_migrations`, executes one transaction per migration, and never prints credentials. On this already-provisioned project, use `npm run db:migrate -- --baseline` **once after confirming that every included migration is already applied**, then use the normal command for future additions. Never baseline an empty database.

No deployed endpoint needs a database-owner password or service-role key. Public and signed-in operations use the publishable key and the current user's JWT; PostgreSQL row and column privileges enforce access. Public `routes` reads cannot select the draft column. Security-definer functions pin an empty search path, check authorization, and have explicit grants. MFA roles are checked from verified Supabase JWT claims.

## Auth and first owner

1. In Supabase Auth, configure Site URL and exact allowed callback URLs for local, Preview and Production passenger/admin origins. Configure authenticated email delivery/SMTP and a password policy of at least 12 characters before public registration.
2. Register a real owner through the application and verify the email. The account interface supports sign-in, sign-out, email verification, password-reset emails and recovery, profile edits, synced favourites/settings, personal-data export, and account deletion.
3. Enroll an authenticator in My account and verify a TOTP code.
4. A trusted database administrator assigns the first membership with the real verified account UUID:

```sql
insert into public.admin_members(user_id,role)
values ('REPLACE_WITH_VERIFIED_OWNER_USER_UUID','owner');
```

5. Sign into the separate admin origin, verify MFA there, and choose Check access after MFA. Membership alone never bypasses MFA.

Roles: owner/editor may manage route drafts, publication, history, imports, content. Owner/support may read and respond to feedback. Ordinary signed-in users see only their own profiles and feedback. Public visitors can search published routes and submit rate-limited text feedback. Account deletion requires a recent password sign-in; admin accounts must transfer/remove their membership first. Private attachments must be removed before identity deletion.

SMTP and callback delivery have **not** been end-to-end verified. A confirmed synthetic test user does not substitute for email verification and password-reset testing.

## Verified route retrieval and review

`npm run data:retrieve` reads identifiers from the public official route-wise form, then retrieves each listed route with a 650 ms delay. Existing successful records are skipped so interrupted retrieval resumes. Every response must have matching route identity and contiguous stages. The tool never fabricates route 1 or fills gaps in numbering.

- `data/routes.json`: 685 route references, 9,529 ordered fare-stage entries.
- `data/coverage.json`: exact retrieved counts and missing fields.
- `data/raw/`: local evidence pages, excluded from Git/archive. Source links and retrieval dates remain in every exported route.
- Source: https://mtcbus.tn.gov.in/Home/routewiseinfo . The source says **stages**, not individual stops. Its publication date is 7 August 2026; retrieval was 15 November 2026.
- Route 1 was not a selectable route in the current directory: the option with value `1` is the `--Route--` placeholder. The reference snapshot therefore starts at the first actually retrieved identifier in natural order, 1C. Historical PDFs were not silently mixed into this snapshot.

`node scripts/retrieve-timetables.mjs` separately queries the official public timing form endpoint for each published stage direction's exact route/origin/destination. Destination labels and 24-hour time formats are checked. Results are **review candidates**, in `data/timetable-candidates.json`, with separate coverage in `data/timetable-coverage.json`. Operating days and holiday validity remain unknown. These candidates have not been imported into the database or published and must not be used to claim a bus is operating now.

Admin → Imports → upload JSON or CSV → inspect validation errors and preview → import drafts → Routes → compare the saved draft with the published JSON → review source, endpoint/direction and stage order → tick review acknowledgement → Publish. Archive/Restore and Audit history/Rollback create increasing revisions. Publication locks the record and checks the expected revision to reject stale edits.

CSV preserves nested ordered directions and source dates using `directionsJSON` and `aliasesJSON` fields. Use Export CSV for its exact header format. JSON is the canonical interchange format. Editing route JSON supports Tamil names and aliases, direction variants, complete/partial stop coverage, schedules, and sourced LineString geometry. Missing stops/geometry remain explicitly flagged.

## Maps, connectivity and live information

The optional Leaflet map loads on demand. It draws only the selected direction's sourced geometry; without geometry it uses verified coordinate markers, and without either it shows a clear unavailable state. It does not request generic driving routes or draw stop-to-stop approximations. OpenStreetMap attribution is included; map tiles are not downloaded for offline use.

Connections are derived only from complete individual-stop lists, respect sequence and direction, prefer direct services, and use the same verified stop ID for a transfer. They are labelled possible connections rather than confirmed timed journeys. No walking distances, holiday operation, live buses or live-arrival predictions are invented. Exact operating-day/timetable matching and walking preferences remain release limitations.

## Offline and privacy

The service worker caches the public shell and same-origin static assets, never account/admin/API responses or external map tiles. Selected route JSON, source dates, favourites, recent searches and settings are retained locally. Download size and removal controls are available. Offline text-feedback drafts retain an idempotency UUID and retry after reconnection; signed-in drafts wait for the same account before retrying. Image files are not preserved in offline drafts.

Signed-in screenshots support PNG/JPEG/WebP, 5 MB maximum, client signature checks and storage bucket restrictions. Objects are stored privately under the user UUID. Admin viewing uses a 60-second signed URL. Duplicate feedback descriptions/contact/reference within ten minutes return the existing reference; retries with the same UUID cannot create another submission. Database rate limits apply even to callers bypassing the website.

No precise home address is required, and no location is collected automatically. No individual travel-history analytics are collected. See STATUS.md for the remaining location/analytics features.

## Deployment exclusively to Vercel

1. Finish the local release gates in STATUS.md. `npm run typecheck`, `npm run lint`, `npm test`, public `npm run build`, and admin `APP_MODE=admin npm run build` must pass.
2. After Vercel team access is granted, create two Next.js projects from this source, e.g. `chennai-bus-public` and `chennai-bus-admin`. Deploy the same source to separate Vercel origins.
3. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` for both Preview and Production on both projects. Set `APP_MODE=public` or `admin` respectively. Do not put `DATABASE_URL` or a service-role key in the browser. Keep migrations outside runtime builds.
4. Build outputs: public `.next`, admin `.next-admin`; Next.js adapter must be checked for the configured custom distDir. Set Node.js 24 LTS and Functions near the Mumbai database.
5. Create Preview deployments only after required local tests pass. Add their exact auth callback URLs, then verify browser → API → PostgreSQL and storage flows using disposable data.
6. Test the public origin against `/api/admin` (must return 404) and direct Supabase admin RPCs with a passenger/anonymous token (must deny).
7. Verify mobile/keyboard layouts, authenticated redirects, offline restart, uploads, provider failures, and email verification/reset links on both deployed origins.
8. Stage a Production build, test that exact staged deployment, then promote it. Do not release an untested rebuild. Record public/admin Preview and Production URLs in STATUS.md.
9. Run production smoke tests and retain the previous deployment and schema-compatible route revisions for rollback.

No Sites hosting, Cloudflare Workers deployment, or other hosting platform is used.

## Backups and restoration

Use Supabase-managed PostgreSQL backups/PITR only if the selected project plan actually includes them; no plan entitlement is assumed. Otherwise schedule encrypted `pg_dump` backups from an operator-controlled environment using a least-privileged backup connection. Back up schema, application tables, the required Auth configuration/identities through the provider-supported method, and private Storage objects separately. Database backups alone do not contain the bytes of uploaded screenshots. Store backups in controlled managed storage, not a Vercel function's local disk.

Record migration versions, application version, dump timestamp, object inventory/checksums, and the corresponding Vercel deployment IDs. Never commit dumps containing personal information or auth secrets. The admin route JSON/CSV export is useful for route restoration but is not a full personal-data backup.

Restore first into a new isolated Supabase project: provision Auth/Storage, restore roles/schema through the supported provider workflow, apply missing migrations, restore application records, copy private objects with the same paths, restore bucket/privacy policies, configure callbacks/SMTP, and rerun the regression/provider tests. Verify route revisions and sample feedback links without exposing private objects. Only then update the two Vercel projects to the restored backend and run smoke tests. Keep the old backend available for rollback until reconciliation is complete. A full backup/restore drill has not been executed in this session.

## Test commands

- `npm test`: route sorting, Tamil aliases, direction/transfer order, no stage-as-stop routing, imported data validation, feedback input, CSV round-trip and malformed CSV.
- `tests/database-regression.sql`: disposable transaction with `ROLLBACK`; checks MFA, roles, publication, archive/restore/rollback, invalid publication, private data, retry idempotency and response tracking.
- `scripts/test-provider.mjs`: real provider login, TOTP MFA, profile/storage isolation and feedback checks using explicitly disposable fixtures. Never run against real accounts. Fixture setup and cleanup require a trusted database operator; synthetic users must be deleted afterward. Email-link delivery is excluded.
- `npm audit`: dependency audit. Current lockfile reports zero vulnerabilities after a scoped development dependency override, verified with lint/type checks/tests.

Tourism data and licensed image metadata are in `data/attractions.json` and `data/photo-credits.json`. Historical photo dates are displayed rather than presented as current conditions.
