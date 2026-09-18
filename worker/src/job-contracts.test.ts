import { describe, expect, expectTypeOf, it } from "vitest"

import {
  assertDocumentStoragePath,
  createPlanTakeoffResult,
  formatProcessingFailure,
} from "./job-contracts.js"
import type {
  ClaimedJob,
  DocumentForProcessing,
  PlanTakeoffResult,
} from "./types.js"

const job: ClaimedJob = {
  id: "job-1",
  org_id: "org-1",
  document_id: "document-1",
}

const document: DocumentForProcessing = {
  storage_bucket: "project-documents",
  storage_path: "org-1/project-1/document.pdf",
  file_name: "document.pdf",
  type: "plans",
  mime_type: null,
  project_id: "project-1",
}

describe("worker job contracts", () => {
  it("accepts an organization-scoped storage path", () => {
    expect(() =>
      assertDocumentStoragePath(job, document.storage_path)
    ).not.toThrow()
  })

  it.each([
    ["another-org/project-1/document.pdf", "doesn't match org org-1"],
    ["org-1//document.pdf", "empty or relative segment"],
    ["org-1/../another-org/document.pdf", "empty or relative segment"],
    ["org-1/./document.pdf", "empty or relative segment"],
  ])(
    "rejects unsafe storage path %s with actionable context",
    (storagePath, reason) => {
      expect(() => assertDocumentStoragePath(job, storagePath)).toThrow(
        expect.objectContaining({ message: expect.stringContaining(reason) })
      )
    }
  )

  it("persists plan page coverage in the plan-takeoff result variant", () => {
    const result = createPlanTakeoffResult({
      items: [],
      callouts: [],
      pageCount: 180,
      pagesRead: 20,
    })

    expectTypeOf(result).toEqualTypeOf<PlanTakeoffResult>()
    expect(result).toEqual({
      kind: "plan_takeoff",
      items: [],
      callouts: [],
      pageCount: 180,
      pagesRead: 20,
    })
  })

  it.each([
    [{ pageCount: -1, pagesRead: 0 }, "invalid page count"],
    [{ pageCount: 10.5, pagesRead: 10 }, "invalid page count"],
    [{ pageCount: 10, pagesRead: -1 }, "invalid page coverage"],
    [{ pageCount: 10, pagesRead: 11 }, "read 11 of 10 pages"],
  ])("rejects impossible plan coverage %#", (coverage, reason) => {
    expect(() =>
      createPlanTakeoffResult({ items: [], callouts: [], ...coverage })
    ).toThrow(
      expect.objectContaining({ message: expect.stringContaining(reason) })
    )
  })

  it("adds the processing stage and safe document identity to failures", () => {
    expect(
      formatProcessingFailure({
        job,
        document,
        stage: "extracting plan quantities",
        error: new Error("model request timed out"),
      })
    ).toBe(
      'Failed while extracting plan quantities for document "document.pdf" (plans, document-1): model request timed out'
    )
  })
})
