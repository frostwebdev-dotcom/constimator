# Phase 1 Baseline Audit

**Audit date:** 2026-09-18 UTC  
**Branch:** `main`  
**Commit:** `2723894 fixed`  
**Remote:** `origin` → `https://github.com/frostwebdev-dotcom/constimator.git`  
**Starting worktree:** Clean and aligned with `origin/main`

No product behavior was changed during this audit.

## Repository instructions and layout

The root `AGENTS.md` applies to the repository. Its active constraint is that the bundled Next.js 16 documentation must be consulted before framework-level code changes because the project depends on Next.js 16 behavior.

| Area                         | Locations                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| Next.js application          | `app/`, `components/`, `lib/`, `public/`, `proxy.ts`, `instrumentation*.ts`               |
| Standalone extraction worker | `worker/src/`, `worker/package.json`, `worker/README.md`                                  |
| Database/schema              | `lib/db/schema.ts`, `lib/db/index.ts`, `db/migrations/`, `drizzle.config.ts`, `supabase/` |
| Automated tests              | `lib/**/*.test.ts`, `app/**/*.test.ts`, `worker/src/**/*.test.ts`, `e2e/`                 |
| Test/validation harnesses    | `scripts/real-job/`, `scripts/takeoff-validation/`, `scripts/load-test/`                  |
| Documentation                | `docs/`, root `README.md`, `worker/README.md`                                             |

## Runtime and package management

| Component         | Runtime/framework                                                             | Package manager and lockfile                                                                  |
| ----------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Main app          | Next.js 16.2.6, React 19.2.4, TypeScript 5                                    | pnpm workspace; `pnpm-lock.yaml`. A root `package-lock.json` also exists and is a drift risk. |
| Worker            | Node.js 22 or newer, TypeScript, direct PostgreSQL/Supabase/Anthropic clients | npm; `worker/package-lock.json`                                                               |
| Audit environment | Node 24.19.0, pnpm 11.19.0, npm 11.9.0                                        | Dependencies were already installed; no install was required.                                 |

## Architecture map

### Authentication and tenant selection

- `lib/supabase/server.ts` and middleware/proxy integration provide server-side Supabase authentication.
- `lib/auth/` resolves organization membership and roles; write and administrative operations use role guards.
- `lib/current-project.ts` resolves the selected project from request state.
- `lib/db/index.ts` exposes scoped database access so organization/project filters are consistently applied.
- Supabase row-level-security policies provide a second tenant boundary. The worker uses service credentials and therefore performs its own organization/path checks.

### Storage and document intake

- `lib/document-upload.ts` and document server actions validate document type, size, project ownership, and storage paths.
- Documents are stored in the private `project-documents` Supabase bucket under an organization/project-prefixed path.
- A document row is persisted and a `takeoff_job` is queued. Job results are stored as typed JSON in the database.

### Background processing

- The standalone worker polls PostgreSQL and claims queued jobs.
- Before paid extraction, it verifies storage-path organization ownership and applies rate/spend controls.
- Bid forms are sent through the bid-form transcription path.
- Specifications, subcontractor quotes, and plan-holder lists use separate extractors and result kinds.
- Plan documents are rasterized and capped at the first 20 pages; plan quantities and printed plan callouts are extracted in parallel.

### PDF and spreadsheet handling

- Browser/server PDF text and viewing use `pdfjs-dist` 6.2.108.
- The worker uses `pdfjs-dist` 5.6.205 plus `pdf-to-img` 6.2.0 for plan rasterization.
- Bid-form PDF transcription is model-assisted; there is no dedicated OCR engine in the dependency set.
- Spreadsheet reading, imports, and workbook generation use SheetJS `xlsx` 0.18.5.
- Application-generated PDF reports use `jspdf` 4.2.1 and `jspdf-autotable`.

### Estimate, official items, and reconciliation

- `bid` rows hold official item number, description, unit, official quantity, specification section, and extraction confidence.
- `estimate` and `estimate_line` hold the contractor estimate, selected quantity, unit price, labor/material/equipment/subcontractor cost components, markup, total, and source.
- `lib/bid-form-import.ts` and reconciliation actions convert reviewed extraction results into official bid rows.
- `lib/estimate-import.ts` imports contractor spreadsheets. Matching prioritizes exact item number, then a unique description; unmatched rows remain reviewable.
- `lib/reconciliation-data.ts`, `lib/reconciliation-diff.ts`, and `lib/reconciliation-view.ts` compute and present official-versus-estimate status, quantity difference, percentage difference, unit mismatch, and LS handling.
- `plan_callout` rows retain sheet-level printed quantities separately from AI-measured takeoff items.

## Current end-to-end flow

1. An authenticated organization member selects a project and uploads a classified document.
2. The application validates tenant/project ownership, writes the private storage object and document row, and queues a job.
3. The worker claims the job, revalidates organization/path safety and usage limits, downloads the document, and dispatches by document type.
4. Extraction output is persisted in `takeoff_job.result`, with provenance/confidence fields where the extractor supplies them.
5. The application exposes the result for human review. Bid-form results become official bid items only through the import/review action; AI plan items require confirmation before estimate use.
6. A contractor workbook can be parsed into estimate-line candidates and explicitly mapped to official items.
7. Estimate lines are persisted and the reconciliation layer compares contractor quantities with official quantities.
8. The UI displays status and variance and carries selected quantities into estimate totals.

## Conflicting or obsolete takeoff concepts

No routes were deleted during the audit.

- The repository historically defined Phase 1 as official document extraction, manual estimating, and reconciliation—not autonomous plan takeoff.
- A later recorded decision states that a limited AI plan-takeoff path has shipped, protected by explicit confirmation and a visible 20-page cap.
- The worker still treats unrecognized document types as plan-takeoff work. This broad fallback can conflict with the newly locked product contract and should become an explicit document-type dispatch.
- Plan-derived measured items, printed plan callouts, official bid rows, and contractor manual takeoff are distinct concepts in code but are not yet represented as a single explicit quantity-selection model.
- Phase 1 should retain the existing limited AI result as advisory only. Expanding it into general AI takeoff is outside the locked scope.

## Baseline verification

The root `format` script writes files, so the audit used the equivalent non-mutating Prettier check instead of modifying the worktree.

| Component                 | Command                                       | Result                                                                                                                                          | Classification                                          |
| ------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Main app formatting       | `pnpm exec prettier --check "**/*.{ts,tsx}"`  | **Failed:** 211 files reported formatting drift.                                                                                                | Pre-existing repository drift; no files were rewritten. |
| Main app lint             | `pnpm lint`                                   | Passed.                                                                                                                                         | Baseline pass.                                          |
| Main app TypeScript       | `pnpm typecheck`                              | Passed.                                                                                                                                         | Baseline pass.                                          |
| Main app unit/integration | `pnpm test`                                   | Passed: 17 files, 229 tests.                                                                                                                    | Baseline pass.                                          |
| Main app production build | `pnpm build`                                  | Passed: Next.js compiled and generated 37 pages.                                                                                                | Baseline pass with warning.                             |
| Worker formatting         | Covered by the repository-wide Prettier check | Worker files were included in the non-mutating root check; the repository-wide result failed.                                                   | No separate worker formatting script exists.            |
| Worker lint               | Covered by `pnpm lint` (`eslint .`)           | Passed as part of the root lint run.                                                                                                            | No separate worker lint script exists.                  |
| Worker TypeScript         | `cd worker && npm run typecheck`              | **Failed:** two TypeScript errors.                                                                                                              | Pre-existing source failures.                           |
| Worker unit tests         | `cd worker && npm test`                       | Passed: 2 files, 15 tests.                                                                                                                      | Baseline pass.                                          |
| Worker production build   | `cd worker && npm run build`                  | **Failed:** the same two TypeScript errors.                                                                                                     | Pre-existing source failures.                           |
| Browser E2E               | Not run                                       | `.env.local` is absent. The suite creates/deletes real Supabase auth/database/storage data and requires a worker and external model processing. | Environment-dependent; unsafe to fake as a local pass.  |
| Real-document harness     | Not run                                       | Requires database, Supabase service credentials, private fixture input, and a running worker.                                                   | Environment/fixture-dependent.                          |

### Exact failures and warnings

| Command                | Category                         | Affected location                                      | Likely root cause                                                                                                                                                                                |
| ---------------------- | -------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Worker typecheck/build | `TS7006` implicit `any`          | `worker/src/process-job.ts:91`                         | The database-returned document shape is insufficiently typed, so the split path segment callback parameter is inferred as `any`.                                                                 |
| Worker typecheck/build | `TS2353` unknown object property | `worker/src/process-job.ts:271`                        | `process-job.ts` persists `pageCount` and `pagesRead`, but the hand-maintained worker `TakeoffResult` type does not declare them. Runtime behavior and the declared JSON contract drifted apart. |
| Main formatting check  | Prettier drift                   | 211 TypeScript/TSX files across application and worker | Repository-wide style is not at the formatter's current canonical output. This is too broad for an unrelated Day 1 rewrite.                                                                      |
| Main production build  | Sentry integration warning       | `instrumentation-client.ts`                            | Sentry expects `onRouterTransitionStart` to export `Sentry.captureRouterTransitionStart` for Next.js navigation instrumentation. The warning does not fail the build.                            |

## Dependency and capability map

| Capability             | Current implementation              | Gap or risk                                                                                                         | Phase 1 position                                                                                              |
| ---------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| PDF text/viewing       | `pdfjs-dist` in main app            | App and worker use different major versions.                                                                        | Keep for now; add a compatibility fixture before upgrading.                                                   |
| Plan rasterization     | `pdf-to-img`, worker PDF.js         | Hard 20-page read cap; image conversion is not document-layout reconstruction.                                      | Retain the visible cap for advisory AI; not a fidelity engine.                                                |
| OCR                    | Model-assisted PDF/image extraction | No deterministic OCR engine or OCR-coordinate contract.                                                             | Low-confidence/scanned forms need an explicit exception path and fixture.                                     |
| Excel read/write       | SheetJS `xlsx` 0.18.5               | Good for cell data; insufficient evidence of arbitrary PDF-to-Excel print fidelity and advanced style preservation. | Reuse for import; run a proof before choosing a layout-generation dependency.                                 |
| PDF report generation  | `jspdf`, `jspdf-autotable`          | Does not solve editable Excel layout reproduction.                                                                  | Retain for existing reports.                                                                                  |
| Visual comparison      | None identified                     | No workbook renderer, page-image diff, mask/tolerance rules, or approval record.                                    | Required capability for approved demo fixtures.                                                               |
| Excel rendering        | None identified                     | No headless Microsoft Excel/LibreOffice render step; print behavior can vary by engine and fonts.                   | Define the target desktop Excel environment; optionally add LibreOffice as a diagnostic, not the sole oracle. |
| Background jobs        | PostgreSQL polling worker           | Hand-copied result types have already drifted; catch-all dispatch is broad.                                         | Fix type contract and add dispatch/result-contract tests before feature work.                                 |
| Authentication/storage | Supabase SSR, RLS, private bucket   | Worker service role bypasses RLS and depends on application checks.                                                 | Preserve defense-in-depth tests.                                                                              |
| Email                  | Resend/application email modules    | Supplier/RFQ workflows would add consent, recipient, deliverability, and audit concerns.                            | Phase 2 only.                                                                                                 |

Existing dependencies should be preferred for parsing and current exports. A new workbook/layout or rendering dependency is justified only after a representative proof demonstrates that the current SheetJS path cannot satisfy the agreed print-fidelity fixtures.

## Data-model gaps against the locked scope

- Joe's workbook has two sheets (`Union` and `Take Off`). Its HMA row links takeoff cost into the official-form view and computes cost variance. That percentage equals the quantity variance only because both sides use the same unit rate. The product must store quantity variance and cost exposure separately.
- Official bid quantity is currently non-null, which needs an explicit LS/blank-quantity representation rather than treating every LS row as measured `1`.
- There is no first-class bid-type field for itemized, single LS, multiple LS, or mixed.
- Official, manual, AI suggestion, and selected final quantity are distributed across existing entities rather than modeled as explicit sources with precedence and audit history.
- Flat estimate-line cost buckets do not represent multiple trade detail rows, default-value provenance, or versioned overrides.
- There is no persisted PDF-to-Excel layout validation result or page-by-page visual approval record.
- Import match decisions and manual quantity overrides need durable audit metadata for a trustworthy demo.

These are implementation findings, not authorization to migrate the database during the baseline day.

## Risk register

| Risk                                                   | Severity | Evidence                                                                 | Mitigation before demo                                                                                                  |
| ------------------------------------------------------ | -------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| “100% accurate” conversion is interpreted as universal | Critical | No layout reconstruction or visual-diff engine exists.                   | Contract accuracy per approved fixture; block on missing content/material layout differences; expose review exceptions. |
| Worker cannot build                                    | High     | Two repeatable TypeScript failures.                                      | Fix and test the shared result contract before feature development.                                                     |
| Quantity concepts are conflated                        | High     | Data is spread across bid, estimate, takeoff result, and callout shapes. | Add an explicit selected-quantity model and provenance rules.                                                           |
| LS semantics create false variance                     | High     | Numeric official quantity is required today.                             | Introduce bid type/quantity applicability; show `N/A` for non-measured LS rows.                                         |
| Silent spreadsheet mis-match                           | High     | Real workbooks vary and description matching is limited.                 | Reviewable mappings, ambiguity states, units, and import audit tests.                                                   |
| Proprietary fixture leakage                            | High     | Real-job documents and Joe's workbook may contain client/project data.   | Keep gitignored/local unless sanitized and permissioned; commit expectations, not private files.                        |
| Cross-tenant access from worker                        | High     | Service credentials bypass RLS.                                          | Retain path validation and add result/import isolation tests.                                                           |
| AI overconfidence/truncation                           | High     | Plan path reads at most 20 pages.                                        | Keep advisory status, source/page coverage, confirmation gate, and explicit truncation warning.                         |
| Format cleanup hides functional changes                | Medium   | 211 files fail the current formatting check.                             | Decide on a dedicated formatting-only change or narrow the enforced baseline; do not mix it with feature work.          |
| PDF engine drift                                       | Medium   | Main and worker PDF.js majors differ.                                    | Pin intentionally and cover representative PDFs before unifying versions.                                               |

## Day 2 handoff

1. Repair the two worker TypeScript contract failures and add coverage for page metadata and path-segment validation.
2. Make document-type dispatch explicit so unsupported types fail visibly instead of entering plan takeoff.
3. Convert the quantity definitions in `phase-1-demo-scope.md` into a proposed schema/API migration, including LS semantics and audit provenance.
4. Build synthetic fixtures for all four bid types and the reconciliation edge cases in `phase-1-fixture-manifest.md`.
5. Prototype one approved bid form through the Excel print-fidelity loop before committing to a new layout dependency.
6. Decide separately whether to normalize all existing formatting and resolve the Sentry warning; neither should be mixed into feature commits.

The next engineer can begin with these documents and the recorded commands without rediscovering the repository flow or mistaking environment-blocked checks for passing tests.
