import type {
  ClaimedJob,
  DocumentForProcessing,
  ExtractedPlanCallout,
  ExtractedTakeoffItem,
  PlanTakeoffResult,
} from "./types.js"

export type ProcessingStage =
  | "loading document"
  | "validating document storage"
  | "checking AI limits"
  | "downloading document"
  | "extracting bid form"
  | "extracting subcontractor quote"
  | "extracting plan holders"
  | "extracting specifications"
  | "extracting plan quantities"
  | "recording AI usage"
  | "persisting extraction result"
  | "recording completion analytics"

/**
 * Validate the storage path immediately before the service-role download.
 * The first path segment must be the job's organization and no segment may
 * rely on URL normalization. The thrown message carries safe job/document
 * identifiers but never exposes the full private storage path.
 */
export function assertDocumentStoragePath(
  job: ClaimedJob,
  storagePath: string
): void {
  const pathSegments = storagePath.split("/")
  if (pathSegments[0] !== job.org_id) {
    throw new Error(
      `Document ${job.document_id}'s storage path doesn't match org ${job.org_id}; refusing the service-role download.`
    )
  }
  if (
    pathSegments.some(
      (segment) => segment === "" || segment === "." || segment === ".."
    )
  ) {
    throw new Error(
      `Document ${job.document_id}'s storage path contains an empty or relative segment; refusing the service-role download.`
    )
  }
}

/** Build and validate the persisted plan coverage contract in one place. */
export function createPlanTakeoffResult(input: {
  items: ExtractedTakeoffItem[]
  callouts: ExtractedPlanCallout[]
  pageCount: number
  pagesRead: number
}): PlanTakeoffResult {
  if (!Number.isInteger(input.pageCount) || input.pageCount < 0) {
    throw new Error(
      `Plan extraction returned an invalid page count: ${input.pageCount}.`
    )
  }
  if (
    !Number.isInteger(input.pagesRead) ||
    input.pagesRead < 0 ||
    input.pagesRead > input.pageCount
  ) {
    throw new Error(
      `Plan extraction returned invalid page coverage: read ${input.pagesRead} of ${input.pageCount} pages.`
    )
  }

  return { kind: "plan_takeoff", ...input }
}

export function formatProcessingFailure(input: {
  job: ClaimedJob
  document?: DocumentForProcessing
  stage: ProcessingStage
  error: unknown
}): string {
  const reason =
    input.error instanceof Error ? input.error.message : String(input.error)
  const documentContext = input.document
    ? `document "${input.document.file_name}" (${input.document.type}, ${input.job.document_id})`
    : `document ${input.job.document_id}`

  return `Failed while ${input.stage} for ${documentContext}: ${reason}`
}

export function assertNever(value: never): never {
  throw new Error(
    `Unsupported document type reached worker dispatch: ${String(value)}.`
  )
}
