# Phase 1 Fixture Manifest

**Purpose:** Define the smallest trustworthy acceptance set for bid-form extraction, workbook fidelity, takeoff import, and reconciliation without committing client credentials or proprietary project documents.

## Data handling rules

- Never place account credentials, session cookies, API keys, or personal contact data in a fixture.
- Use synthetic or redistribution-approved documents for committed automated tests.
- Keep real bid documents, Joe's workbook, expected answer keys, and generated reports in the gitignored `scripts/real-job/pdfs/`, `scripts/real-job/expected/`, and `scripts/real-job/reports/` paths unless written permission permits committing a sanitized copy.
- Record a fixture ID and checksum in a private test log when a proprietary source must remain outside Git. Do not record the original filename if it discloses a private project.
- A real document is for manual acceptance only until its expected values have been independently checked by a human.

## Existing fixtures and harnesses

| Asset                           | Repository location                 | Current use                                                                  | Status                                                                                           |
| ------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Synthetic bid form              | `e2e/fixtures/sample-bid-form.pdf`  | Browser upload/extraction flow                                               | Committed; inspect/expand expected assertions before relying on it for fidelity.                 |
| Full browser flow               | `e2e/full-flow.spec.ts`             | Project, document, processing, estimate, reconciliation flow                 | Present; requires a configured Supabase database, storage, auth, and a running worker.           |
| Cross-organization flow         | `e2e/security-cross-org.spec.ts`    | Tenant isolation                                                             | Present; mutates and cleans external test data.                                                  |
| Real-job upload/compare harness | `scripts/real-job/`                 | Runs the production storage/queue/worker path and compares expected bid rows | Present; external credentials and a worker are required. Real inputs and results are gitignored. |
| Takeoff validation probe        | `scripts/takeoff-validation/`       | Standalone plan extraction feasibility                                       | Present; not the application path and not a Phase 1 pass/fail gate.                              |
| Joe workbook                    | Local attachment/manual source only | Manual import/reconciliation acceptance and product reference                | Available outside the repository; do not commit without permission and sanitization review.      |

## Required acceptance set

| ID          | Sample                                                                                                     | Required assertions                                                                                                | Commit policy                                   |
| ----------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| BF-ITEM-01  | Itemized bid form with wrapped descriptions, thousands separators, notes, and an alternate                 | Exact row count/content; source page; workbook page layout; print comparison                                       | Synthetic or public fixture preferred.          |
| BF-SLS-01   | Single LS bid                                                                                              | One preserved official LS scope; variance shown as `N/A`; trade cost roll-up equals final LS price                 | Synthetic fixture.                              |
| BF-MLS-01   | Multiple LS bid                                                                                            | Every LS scope preserved; trade detail maps to the correct scope; no invented measured variance                    | Synthetic fixture.                              |
| BF-MIX-01   | Mixed measured and LS bid                                                                                  | Measured rows reconcile; LS rows use cost build-up; totals include both                                            | Synthetic fixture.                              |
| BF-SCAN-01  | Scanned, rotated, or low-quality bid form                                                                  | System either produces reviewed output or an explicit unsupported/low-confidence exception; never silent data loss | Public/synthetic scan.                          |
| BF-LONG-01  | Multipage schedule with repeated headers and page breaks                                                   | No dropped or duplicated rows; print titles and page count match approved expectation                              | Synthetic or public fixture.                    |
| XL-MAN-01   | Contractor takeoff with reordered/aliased columns and unmatched rows                                       | Explicit mapping; exact item-number priority; ambiguous rows require human action                                  | Synthetic workbook.                             |
| XL-JOE-01   | Sanitized or locally held Joe workbook                                                                     | `Take Off` quantities map to official rows and reproduce the HMA acceptance result                                 | Manual/private unless permission is documented. |
| RC-EDGE-01  | Zero official quantity, missing manual value, duplicates, incompatible units, and positive/negative deltas | No divide-by-zero; correct statuses; no silent ambiguous match                                                     | Synthetic table/workbook.                       |
| WB-PRINT-01 | Approved PDF-to-Excel demo form                                                                            | Content completeness, page count, print areas, orientation, margins, breaks, repeated headers, and no clipping     | Pair with each approved demo form.              |

## Joe workbook acceptance expectation

The workbook is a behavioral reference: the official bid-form quantity is compared with the contractor's takeoff quantity. For the known HMA row:

| Field                   |         Expected |
| ----------------------- | ---------------: |
| Unit                    |              TON |
| Official quantity       |            5,520 |
| Manual quantity         |            4,419 |
| Selected final quantity |            4,419 |
| Delta                   |           -1,101 |
| Exact variance          | -19.9456521739…% |
| Displayed variance      |          -19.95% |

Formula:

```text
delta = 4,419 - 5,520 = -1,101 TON
variance = (-1,101 / 5,520) * 100 = -19.9456521739…%
```

Read-only inspection of the supplied workbook confirms this layout:

- `Union!C23` contains the official quantity `5,520` and `Take Off!C23` contains the contractor quantity `4,419`.
- Both rows are the HMA item and use `TON`.
- The workbook does not calculate quantity delta directly on the `Union` row. `Union!E23` links to the takeoff cost (`654,012`), `Union!I23` calculates official cost (`816,960`), and `Union!F23` calculates cost delta (`-162,948`).
- `Union!G23` calculates `(takeoff cost - official cost) / official cost`, yielding `-19.945652...%`. It equals the quantity variance only because both costs use the same `$148/TON` rate.

Constimator must make that distinction explicit: quantity delta is `-1,101 TON`; quantity cost exposure at `$148/TON` is `-$162,948`. A matching displayed percentage alone is insufficient if the wrong rows were paired or the two sides use different rates. The row must retain its mapping source, selected-quantity source, unit compatibility, and rate used for cost exposure.

## Fixture review record

For every manually approved fixture, record the following outside the proprietary document when necessary:

- Fixture ID and SHA-256 checksum.
- Bid type and page count.
- Reviewer and review date.
- Independently verified expected row count and totals.
- Known unusual layout/data features.
- Excel/OS version and paper/print settings used for layout review.
- Content comparison result and page-by-page visual comparison result.
- Any approved exception, its reason, and its owner.

## Exit condition

The fixture set is ready for Phase 1 implementation when every required ID has an approved source, a human-verified expectation, and an identified automated or manual test path. Proprietary files may remain local; their absence from Git must not remove their expected outcomes from this manifest.
