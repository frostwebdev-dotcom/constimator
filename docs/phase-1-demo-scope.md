# Phase 1 Demo Scope

**Status:** Scope lock for the Phase 1 demo  
**Locked:** 2026-09-18  
**Product principle:** The contractor owns the takeoff and the final bid quantity. Constimator transcribes, organizes, compares, and calculates; it does not silently replace estimator judgment.

## Outcome

The demo must prove one coherent workflow:

1. Convert an official PDF bid form into editable bid items and a print-ready Excel workbook.
2. Import or enter the contractor's own takeoff quantities.
3. Compare those quantities with the official bid quantities.
4. Let the estimator build costs by trade and explicitly choose the quantity used for pricing.
5. Preserve a human-verifiable path back to the source document and imported data.

The core value is the variance view exemplified by Joe's workbook: official quantity versus contractor quantity, with delta and percentage variance made immediately visible.

## Included

### Official bid form

- Upload a PDF bid form.
- Extract item number, description, unit, official quantity, specification section when present, confidence, and source page.
- Require human review before extracted items become official bid items.
- Support itemized, single lump-sum, multiple lump-sum, and mixed forms.
- Export a native Excel workbook that retains all bid-form content and is visually faithful enough for the agreed print acceptance test.
- Preserve page breaks, repeated headers, column order, labels, notes, and blank bidder-entry areas required by the form.

### Contractor takeoff and reconciliation

- Import the contractor's own Excel takeoff without assuming one rigid column order.
- Provide an explicit mapping/review step; do not silently guess ambiguous item matches.
- Match by exact item number first, then a unique normalized description. Ambiguous or unmatched rows remain visible for manual mapping.
- Show official quantity, manual quantity, selected final quantity, delta, percentage variance, unit compatibility, and match status.
- Use clear red/green/neutral visual states without relying on color alone.
- Preserve the source of every selected quantity and every manual override.

### Trade cost build-up

- Provide trade-oriented detail areas below or alongside the official bid form.
- Allow labor, material, equipment, subcontractor, other direct cost, and markup inputs.
- Allow organization-defined default values, with project-level overrides.
- Roll detail costs into the corresponding bid item and the bid total.
- For lump-sum forms, allow the estimator to construct the lump sum from trade detail even when the agency provides no meaningful quantity breakdown.

### AI suggestions

- Existing plan-reading output may appear as a separate, advisory quantity suggestion where the current supported pipeline can produce it.
- AI suggestions must include provenance and confidence where available.
- AI suggestions never become the selected final quantity merely because they exist.
- Every AI-derived item must be confirmed or explicitly selected by a human before it can affect pricing.
- The demo is not a promise of comprehensive or autonomous plan takeoff.

## Excluded from Phase 1

- Autonomous or production-grade AI takeoff across arbitrary plans and trades.
- Automatic pricing from AI output.
- Supplier recommendation from specifications.
- Specialty-item supplier discovery.
- Automatic or one-click RFQ email generation and sending.
- Quote follow-up automation or inbox monitoring.
- Cost-data marketplace integrations.
- A guarantee that every unseen PDF converts with zero review. Phase 1 instead requires deterministic validation and a visible exception path.

Supplier, specification, and RFQ automation is explicitly **Phase 2**.

## Supported bid types

| Bid type    | Definition                                                     | Phase 1 behavior                                                                                                    |
| ----------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Itemized    | The owner supplies measurable bid rows with quantity and unit. | Extract each official row; reconcile compatible contractor quantities row by row.                                   |
| Single LS   | The form contains one lump-sum price for the entire job.       | Preserve the single official row; create trade detail for cost build-up; do not invent a numeric quantity variance. |
| Multiple LS | The form contains several lump-sum scopes.                     | Preserve each official LS row; map trade detail to the appropriate LS scope; do not compare unlike quantities.      |
| Mixed       | The form combines measurable items and one or more LS items.   | Reconcile measurable rows normally and handle each LS row through cost build-up.                                    |

`LS` means lump sum. An LS value of `1` is a pricing convention, not evidence that a measured takeoff quantity exists.

## Quantity terminology and selection

| Quantity                | Meaning                                                                           | Can be edited?                                                        | Can affect price?                                                                        |
| ----------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Official quantity       | The quantity printed by the owner on the bid form. It is the comparison baseline. | Only through an explicit, audited correction after source review.     | It may be selected explicitly, but is not automatically the contractor's final quantity. |
| Manual quantity         | The contractor's imported or directly entered takeoff quantity.                   | Yes.                                                                  | Yes; it is the default selected final quantity when valid and matched.                   |
| AI suggestion           | An advisory quantity derived from plans by the existing limited extraction path.  | Not in place; the estimator accepts, rejects, or copies/overrides it. | Only after explicit human selection or confirmation.                                     |
| Selected final quantity | The single quantity the estimator deliberately chooses for cost extension.        | Yes, with source and override history.                                | Yes. This is the quantity used for pricing.                                              |

### Precedence rules

1. An explicit estimator override wins and records its prior value, new value, source, user, and timestamp.
2. Otherwise, a valid matched manual quantity is selected by default.
3. Otherwise, no contractor quantity is selected automatically.
4. The official quantity remains the reconciliation baseline and may be chosen explicitly by the estimator.
5. An AI suggestion is never selected only because manual data is absent; it requires explicit confirmation.
6. A quantity with an incompatible unit cannot replace another quantity until the estimator resolves or documents the conversion.
7. LS rows use cost build-up and explicit selection; they do not receive a fabricated measured variance.

## Calculations

For a measurable item with compatible units:

```text
delta quantity = selected final quantity - official quantity
variance percent = (delta quantity / official quantity) * 100
extended cost = selected final quantity * selected unit cost
quantity cost exposure = delta quantity * selected unit cost
```

- A negative delta means the contractor quantity is below the official quantity.
- A positive delta means the contractor quantity is above the official quantity.
- If the official quantity is zero, blank, nonnumeric, or LS-only, variance percent is `N/A`; division by zero is never attempted.
- Currency rounding occurs at the displayed monetary precision; raw quantities retain their supported precision.

Known acceptance example from Joe's workbook:

```text
official = 5,520 TON
manual/selected final = 4,419 TON
delta = 4,419 - 5,520 = -1,101 TON
variance = -1,101 / 5,520 * 100 = -19.945652...% (displayed as -19.95%)
```

## Workflows

### Itemized or mixed bid

1. Estimator uploads the official PDF and classifies it as a bid form.
2. The worker transcribes official rows and records confidence and source page.
3. Estimator reviews exceptions and confirms the official items.
4. The system creates the bid-form workbook and renders it for comparison with the source PDF.
5. Estimator imports the contractor takeoff workbook.
6. The system maps exact rows, exposes ambiguous rows, and requires confirmation.
7. The reconciliation view computes delta and variance for compatible measurable rows.
8. Estimator enters cost components, chooses final quantities, and reviews totals.

### Single or multiple LS bid

1. Preserve every official LS scope and the printable form layout.
2. Create or select trade detail areas for each scope.
3. Enter or import labor, material, equipment, subcontractor, other cost, and markups.
4. Optionally display confirmed AI suggestions separately where the supported plan pipeline has evidence.
5. Estimator approves the detail roll-up and the final LS price.

## Excel fidelity contract

“Mirrors the PDF exactly” is treated as a measurable acceptance target, not an unsupported claim about arbitrary PDFs.

For every approved demo fixture:

- No source text, rows, notes, alternates, signature labels, or bidder-entry fields are omitted.
- Row order, column order, merged headings, pagination, print area, page orientation, paper size, margins, repeated print titles, and manual page breaks match the approved source representation.
- Formulas and editable cells remain functional in Microsoft Excel.
- Printing or exporting the workbook at 100% scale produces the same page count and no clipped or overflowed content.
- A visual comparison is reviewed page by page. Material differences block acceptance and are shown to the user rather than hidden.
- Extraction confidence alone is never used as proof of layout fidelity.

Pixel identity is not required unless the client supplies a signed-off tolerance and target Excel/OS/print-driver combination. The acceptance artifact is the rendered/printed workbook, not the editable grid alone.

## Phase 1 acceptance criteria

- All four bid types have at least one approved fixture and documented expected outcome.
- Official rows cannot enter the estimate without human confirmation.
- Manual Excel import handles Joe's takeoff structure through explicit mapping and produces the known HMA result.
- Unmatched, ambiguous, duplicated, and unit-mismatched rows are visible and never silently paired.
- Selected final quantity follows the precedence rules and records provenance.
- Variance formulas handle positive, negative, zero, missing, and LS cases.
- Trade cost build-up rolls up reproducibly to bid items and totals.
- Approved PDF-to-Excel fixtures pass content and print-layout comparison.
- Organization and project isolation remain enforced in application and worker paths.
- Main application and worker checks required by the repository pass before demo release.

## Locked defaults and open decisions

These defaults apply until the client explicitly changes them:

| Topic             | Locked default                                                           | Decision still needed                                                           |
| ----------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Variance coloring | Negative green, positive red, zero neutral; always show sign and number. | Confirm whether risk direction should instead be trade- or context-specific.    |
| Match tolerance   | Exact quantity for fixture acceptance; UI may display rounded values.    | Confirm any operational tolerance by unit.                                      |
| Unit matching     | Normalize safe aliases only; block incompatible units.                   | Approve the unit alias/conversion table.                                        |
| AI in demo        | Advisory, limited to the existing pipeline, human-confirmed.             | Confirm which approved plan set, trade, and accuracy threshold define the demo. |
| Excel target      | Current desktop Microsoft Excel at 100% print scale.                     | Record target Excel version, paper sizes, and permitted visual tolerance.       |
| Default costs     | Organization defaults copied into project context and overridable.       | Define effective dates and who may publish organization defaults.               |

Any request that changes these rules requires a recorded scope decision before implementation.
