# Day 2 Stabilization

**Date:** 2026-09-18 UTC

**Scope:** Build, test, type-contract, observability, and CI stabilization only. No Phase 1 product functionality was added.

## Reproduced failures

The Day 1 worker failures reproduced before changes:

| Command                          | Reproduced failure                                                                                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cd worker && npm run typecheck` | `TS7006` at `src/process-job.ts:91`: storage-path callback parameter inferred as `any`. `TS2353` at `src/process-job.ts:271`: `pageCount` absent from `TakeoffResult`. |
| `cd worker && npm run build`     | The same two TypeScript errors.                                                                                                                                        |

## Repairs

- Typed the worker's claimed-job payload and selected document projection from their actual non-null/nullable database columns.
- Replaced the weak all-optional worker result object with a strict discriminated union for plan takeoff, bid form, subcontractor quote, plan holders, and specifications.
- Made dispatch exhaustive across the current database document-type enum. A future worker type addition can no longer silently enter the plan-takeoff fallback.
- Added validated plan page coverage to the `plan_takeoff` result contract.
- Preserved nullable `mime_type` and its documented PDF fallback for legacy subcontractor-quote rows.
- Added processing-stage, document-type, document-ID, and filename context to unexpected worker failures while keeping the original error and stack for logging.
- Moved storage-path validation into a typed, tested contract function. Service-role downloads still reject organization mismatches, empty segments, `.` segments, and `..` segments.
- Added the required Next.js 16 router transition hook for Sentry instead of suppressing its production-build warning.

## Regression coverage

`worker/src/job-contracts.test.ts` covers:

- Valid organization-scoped storage paths.
- Cross-organization paths.
- Empty and relative path segments.
- Persisted `pageCount` and `pagesRead` fields and the `plan_takeoff` discriminant.
- Negative, fractional, and impossible page coverage.
- Actionable failure context.

The worker suite now contains 26 tests across 3 files, up from 15 tests across 2 files.

## CI contract

Pull requests and pushes to `main` now verify:

- Root dependency installation with `pnpm install --frozen-lockfile`.
- Main application lint, TypeScript, Vitest, and production build.
- Worker dependency installation with `npm ci` from `worker/package-lock.json`.
- Worker TypeScript, Vitest, and production build.
- Drizzle migration journal/snapshot consistency through `pnpm db:check` without connecting to or mutating a database.

The repository retains separate scripts because that is its existing convention and lets CI report lint, typecheck, test, build, worker, and database failures independently.

## Final local verification

| Command                          | Result                                                                     |
| -------------------------------- | -------------------------------------------------------------------------- |
| `pnpm lint`                      | Passed.                                                                    |
| `pnpm typecheck`                 | Passed.                                                                    |
| `pnpm test`                      | Passed: 17 files, 229 tests.                                               |
| `pnpm build`                     | Passed: 37 application routes; the Sentry router-hook warning is resolved. |
| `pnpm db:check`                  | Passed: Drizzle reported the migration history is consistent.              |
| `cd worker && npm run typecheck` | Passed.                                                                    |
| `cd worker && npm test`          | Passed: 3 files, 26 tests.                                                 |
| `cd worker && npm run build`     | Passed.                                                                    |
| `git diff --check`               | Passed.                                                                    |

Main typecheck and `next build` must not run concurrently in the same working directory: both read or generate `.next/types`. A deliberate parallel verification attempt reproduced a transient missing `.next/types/routes.js`; the same commands pass sequentially, which is how the independent CI jobs execute them in isolated runners.

## Environment-dependent exception

Browser E2E was not run. `e2e/global-setup.ts` requires a real Supabase URL, service-role key, database connection, storage, authentication, and a running extraction worker; it creates and deletes external test users and organization data. This checkout has no `.env.local`. Running the suite with invented placeholders would not exercise the flow and could misrepresent it as passing. CI therefore limits this stabilization gate to deterministic checks that are safe on an isolated runner. The real-document harness remains a separate credentialed/manual acceptance gate described in `scripts/real-job/README.md`.
