// Mirrors lib/cost-engine/types.ts's ExtractedTakeoffItem in the main app.
// Kept as an independent copy rather than a cross-package import — this
// worker is intentionally isolated with its own package.json/node_modules
// (see worker/README.md for why). Keep the two in sync by hand if either
// changes.
export type ExtractedTakeoffItem = {
  trade: string
  description: string
  quantity: number
  unit: string
  confidence?: number
  sourceSheets?: string
  notes?: string
}

// One line item transcribed off an official bid form / schedule of items
// (step 40). Deliberately NOT the same shape as ExtractedTakeoffItem: a
// takeoff item is a measured quantity the AI derived from drawings, a bid
// item is a number already printed on the form. They differ in what the
// fields mean and in where the result goes — see extract-bid-form.ts.
export type ExtractedBidItem = {
  itemNumber: string
  description: string
  unit: string
  quantity: number
  specSection?: string
  confidence?: number
  sourcePage?: number
  notes?: string
}

// One condition read off a subcontractor's quote (step 41). Mirrors
// lib/cost-engine/types.ts's ExtractedQuoteCondition in the main app — same
// hand-sync rule as the two types above.
//
// rawText is the verbatim sentence the condition came from, and it is
// required: the review UI highlights it in the original document so a human
// can confirm the condition at a glance, and a condition nobody can confirm
// cheaply is one nobody confirms at all.
export type ExtractedQuoteCondition = {
  category: string
  rawText: string
  normalizedValue?: string
  sourcePage?: number
  boundingBox?: [number, number, number, number]
  confidence?: number
  flagReason?: string
}

// One row read off an agency's plan holders list. Mirrors
// lib/cost-engine/types.ts's ExtractedPlanHolder in the main app — same
// hand-sync rule as the types above.
//
// rawText is required for the same reason it is on ExtractedQuoteCondition:
// the review screen shows the verbatim roster line beside the parsed fields.
// Plan holder rosters run company, contact, address, phone and licence
// together in one cell more often than not, so the parse is the part most
// likely to be wrong and the source line is what makes checking it cheap.
//
// companyName is the only required parsed field. A roster row that doesn't
// name a company isn't a plan holder, and every other field is genuinely
// absent on real lists often enough that requiring any of them would push
// the extractor into inventing them.
export type ExtractedPlanHolder = {
  rawText: string
  companyName: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  licenseNumber?: string
  confidence?: number
  sourcePage?: number
  notes?: string
}

// One participation requirement read off a project's specifications — the
// share of the contract that has to go to firms holding a given
// certification. Mirrors lib/cost-engine/types.ts's
// ExtractedParticipationGoal in the main app — same hand-sync rule as the
// types above.
//
// rawText is required for the same reason it is on ExtractedQuoteCondition:
// the summary shows the verbatim clause beside the parsed percentage, and a
// number a bidder can't check against the specs cheaply is a number they
// won't bid against.
//
// goalPercent is optional, and that is the important part of this shape. A
// spec that imposes a requirement without setting a percentage is common —
// race-neutral goals, good-faith-effort-only clauses, an explicit "no goal
// has been established" — and requiring the field here would push the
// extractor into supplying the number the agency usually uses. See
// worker/src/extract-participation-goals.ts.
export type ExtractedParticipationGoal = {
  rawText: string
  program: string
  goalPercent?: number
  appliesTo?: string
  confidence?: number
  sourcePage?: number
  notes?: string
}

// A web address printed in the specifications alongside a participation
// requirement — where the directory of certified firms is searched, where the
// required forms or bid documents are obtained. Mirrors
// lib/cost-engine/types.ts's ExtractedSpecLink — same hand-sync rule.
//
// `label` is what the document says the address is for, in the document's own
// words, so the UI never has to assert what kind of link it is.
export type ExtractedSpecLink = {
  url: string
  label: string
  sourcePage?: number
}

// One quantity printed on a plan sheet — a drainage or sign schedule row, a
// summary-of-quantities table row, a general note, a profile callout.
// Mirrors lib/cost-engine/types.ts's ExtractedPlanCallout — same hand-sync
// rule as the types above.
//
// Deliberately NOT an ExtractedTakeoffItem: a takeoff item is a quantity
// the AI *measured* off the drawings, one number for the whole set; a
// callout is a number the agency *printed* on one specific sheet. Only the
// second can be traced back to a sheet for an RFI. See
// extract-plan-callouts.ts for why the two run as separate calls.
//
// sourceText is required and verbatim, for the same reason rawText is on
// ExtractedQuoteCondition: the matrix shows it beside the parsed quantity.
export type ExtractedPlanCallout = {
  sheetNumber: string
  sheetTitle?: string
  pageNumber: number
  description: string
  quantity: number
  unit: string
  sourceText: string
  sourceKind: string
  bidItemNumber?: string
  confidence?: number
  notes?: string
}

// The database enum lives in the Next.js package, which this standalone
// worker intentionally does not import. Keep this closed union synchronized
// with db/schema.ts's documentTypeEnum. The exhaustive switch in
// process-job.ts then makes a newly added document type a compile failure
// instead of silently routing it through plan takeoff.
export type DocumentType =
  | "plans"
  | "specifications"
  | "bid_form"
  | "addendum"
  | "sub_quote"
  | "plan_holders"
  | "other"

// Exact payload returned by worker/src/poll.ts's claim query. All three
// columns are NOT NULL in db/schema.ts.
export type ClaimedJob = {
  id: string
  org_id: string
  document_id: string
}

// Exact projection loaded by process-job.ts. mime_type is the only nullable
// selected column; every other field is NOT NULL in db/schema.ts.
export type DocumentForProcessing = {
  storage_bucket: string
  storage_path: string
  file_name: string
  type: DocumentType
  mime_type: string | null
  project_id: string
}

// Shapes written into takeoff_job.result by the current worker. This is a
// strict discriminated union: each kind owns its required payload, so output
// from one extractor cannot be accidentally persisted as another kind.
// The app-side database type remains backward-compatible with older rows
// whose kind or newer fields may be absent; new worker writes are stricter.
export type PlanTakeoffResult = {
  kind: "plan_takeoff"
  items: ExtractedTakeoffItem[]
  callouts: ExtractedPlanCallout[]
  pageCount: number
  pagesRead: number
}

export type BidFormResult = {
  kind: "bid_form"
  bidItems: ExtractedBidItem[]
}

export type SubQuoteResult = {
  kind: "sub_quote"
  conditions: ExtractedQuoteCondition[]
  quoteTotalAmount?: number
  documentNotes?: string
}

export type PlanHoldersResult = {
  kind: "plan_holders"
  planHolders: ExtractedPlanHolder[]
  /** Printed on the roster when it prints one, ISO yyyy-mm-dd. */
  planHoldersIssuedOn?: string
  documentNotes?: string
}

export type SpecificationsResult = {
  kind: "specifications"
  participationGoals: ExtractedParticipationGoal[]
  specLinks: ExtractedSpecLink[]
  documentNotes?: string
}

export type TakeoffResult =
  | PlanTakeoffResult
  | BidFormResult
  | SubQuoteResult
  | PlanHoldersResult
  | SpecificationsResult
