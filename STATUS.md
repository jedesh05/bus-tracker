# Release status — Chennai Bus v1.0.0

**Not production-ready; deployment is incomplete.** This file deliberately distinguishes implemented behavior, verified evidence, unavailable source data, and unfinished requirements.

## Provisioned and retrieved

- Supabase project `dcgoamckiiqvkllxeggw`, Chennai Bus, Mumbai, AI web start up organization. Migrations 001–005 applied; publication validation includes the null-handling correction in the tracked migration 004.
- 685 official route identifiers; 9,529 contiguous, ordered fare-stage entries. Raw route-page retrieval completed with zero failures. Every record keeps its exact identifier, source link, retrieval date, source publication date, directions and explicit completeness.
- 685 database drafts; **zero published route records**. A verified permanent owner must review/publicize records through the MFA admin workflow.
- 333 timetable review candidates; 8,711 published time entries. No operating days/holiday validity inferred. These candidates remain separate files and have not been applied to database routes.
- Four officially sourced attractions, with locally downloaded licensed photographs, attribution and historical-photo notes.

## Implemented

- Exactly three main passenger navigation destinations; responsive search/table/pagination, natural sorting, English/Tamil aliases, suggestions, recent searches, availability/service filters, route details and source dates.
- Fare stages remain distinct from individual stops. Per-direction data structures support variants and sourced schedules/geometry; no return journey is manufactured.
- Direct-first, stop-order-sensitive, shared-stop-ID transfer connections from complete stop coverage. UI explicitly refuses to confirm connections from stage-only data.
- On-demand maps draw only supplied verified direction geometry/markers, selected-stop highlighting, source attribution, fit controls and absent-geometry handling. No generic driving routes, simulated vehicles, live feeds or live predictions.
- Route/stop/place/journey favourites, account sync, optional private Home/Work labels, preferences, route comparison, sharing, print and QR code controls.
- Registration/login/logout, verification/reset request and recovery UI, profile editing, personal-data export, recent-auth account deletion, TOTP MFA. Actual email-link delivery remains unverified.
- Feedback reference/status/response, duplicate protection, global/per-account database rate limits, private screenshot uploads with file restrictions, and offline text drafts with safe retries.
- Separate public/admin runtime modes; public admin endpoint returns 404; backend roles and AAL2 independently gate operations. Admin drafts, JSON/CSV validation/import/export, content checksum jobs/progress, preview, publication, archive/restore, revision history/rollback and scheduled content.
- PWA manifest/icons, public-shell/static-asset caching, route downloads with size/date/removal controls, and low-data/reduced-motion/theme/contrast/text-size settings.
- Setup/migration/admin/deployment and backup/restoration instructions in README.md; no persistent application uploads on Vercel's filesystem.

## Check evidence

| Area | Current evidence | Remaining verification |
|---|---|---|
| Unit/data tests | 12 tests passed across route correctness and CSV/input tests | Additional real-data service-day and geometry cases require verified input |
| TypeScript and lint | Passed before final packaging; generated output directories excluded from source lint | Re-run commands for subsequent changes |
| Public build | Production build passed | Vercel runtime not exercised |
| Admin build | Separate `.next-admin` production build passed | Final deployed adapter and callback URLs |
| Dependency audit | Zero reported vulnerabilities, including development tree after scoped minimatch override | Monitor future advisories |
| Database workflow/RLS | Transaction regression passed with rolled-back fixtures: MFA, owner/editor-like route operations, passenger/support denial, publication/archive/restore/rollback, private profiles/feedback, duplicate retries and responses | Permanent owner's browser workflow |
| Real provider integration | 22 checks passed: real password sessions, TOTP enrollment/challenge/AAL2 role, draft isolation, private storage, feedback/response tracking and logout | Registration email verification, reset email links, real owner onboarding, deletion/export browser tests |
| Browser | Tamil alias search, official ordered route details, missing geometry message, download record and persistence after page reload verified | Small-phone layout (390 px) checked without page overflow; settings persistence verified. Cold tab start with local server stopped showed the offline shell and downloaded route 101. A queued test draft recovered to exactly one PostgreSQL row after reconnect/reload. Deployed runtime still unverified |
| Deployment | No deployment created; Vercel team access returns HTTP 403 | Both Preview URLs, deployed E2E, both Production URLs, smoke tests and rollback rehearsal |
| Backup/restore | Procedure documented | Full isolated restore drill not executed |

Synthetic provider accounts and linked feedback were removed. Their credentials were never used for a real person. The private test image was removed through Storage before identity cleanup. Transaction regression fixtures roll back. No test route is published.

## Unavailable verified data / integrations

Individual bus-stop coverage, coordinates, separate return paths, exact bus geometry, service types, operating days, holiday exceptions, attraction-to-stop links, walking distances, authorized live feed, live arrival notifications and reliable time-confirmed journey planning are unavailable. The UI never substitutes invented values. Timetable candidates are a source-review aid, not confirmation of today's operation.

## Unfinished requirements

- Complete Tamil translation of every interface/help/error string; current implementation translates principal navigation/search headings and supports a bounded set of Tamil search aliases. Admin can add Tamil names and aliases in route JSON. A Tamil content review is still required.
- Nearby-stop geolocation and location/notification preference flows beyond the explicit unavailable-data state; no location is requested without a usable verified coordinate dataset.
- Full timetable/service-day transfer feasibility, walking preferences, timed departure reminders and real live arrivals. These remain gated on supporting data/integration.
- A structured stop/schedule/geometry editing UI with drag reorder; current validated JSON editor supports those fields but is not a specialized graphical editor.
- Search-gap/aggregate usage analytics dashboard. No individual travel histories are collected.
- Administrative role-assignment UI, automated backup scheduling and a verified full restoration drill; initial membership is assigned through trusted SQL.
- Comprehensive deployed E2E/mobile/accessibility/failure tests, email delivery verification and Production promotion. Local checks must not be treated as these deployment gates.

## Vercel URLs

| Application | Preview | Production |
|---|---|---|
| Passenger | Not deployed | Not deployed |
| Admin | Not deployed | Not deployed |

Vercel-only hosting is preserved. No alternative hosting has been used. Approval of the Vercel team-access link is required before deployment operations can proceed. The owner must also configure SMTP/auth URLs, create a verified permanent owner account, and review drafts before releasing real passenger data.

## Security review notes

The anonymous `submit_feedback` security-definer function is intentionally public and rate-limited. `admin_role` is callable to evaluate row policies but returns a role only for the current verified AAL2 member. Mutation/list/delete functions revoke anonymous execution and enforce identity/role checks internally. Signed-in callers can invoke the constrained functions, which does not grant unrestricted table access. Review [Supabase function exposure guidance](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable) when changing these boundaries. The internal rate-limit table deliberately has RLS with no direct client policy.


## Final local browser/API evidence — 16 November 2026

- Production public and admin builds passed after the final origin-check correction.
- Type checking, source lint, and 12 tests in three files passed.
- Cold tab start with the local server stopped rendered the cached shell and Offline banner. Downloaded route 101 retained all 19 source-linked fare stages.
- Disposable offline feedback reference `fb142665-f062-4521-97f4-32b07ae1d458` recovered automatically after server restoration and reload. PostgreSQL contained exactly one row; the queue cleared. The test row was then deleted.
- Public `/api/admin`: HTTP 404. Cross-origin `/api/feedback`: HTTP 403. A regression test covers Next.js's normalized local URL versus actual HTTP Host.
- Small-phone layout (390 px) had no horizontal page overflow. Three-page mobile navigation, attraction photography/credits and low-data/reduced-motion persistence were checked.
- These are local checks, not substitutes for required Preview/Production verification.


Imported map-stop labels are HTML-escaped before Leaflet renders a tooltip; a regression test covers an injected image/event-handler name. Supabase JavaScript is pinned to the tested exact version with a committed lockfile. Newly available Supabase guidance was reviewed on 16 November 2026; full production session-revocation and deployment security verification remain part of the release gates.
