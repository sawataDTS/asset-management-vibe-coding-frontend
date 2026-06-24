export const REQUEST_TYPES = ["hardware", "software", "replacement", "return", "other"] as const

export type RequestType = (typeof REQUEST_TYPES)[number]

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  hardware: "New hardware",
  software: "New software",
  replacement: "Replacement",
  return: "Return equipment",
  other: "Other",
}

export const REQUEST_PRIORITIES = ["normal", "urgent"] as const

export type RequestPriority = (typeof REQUEST_PRIORITIES)[number]

export const REQUEST_PRIORITY_LABELS: Record<RequestPriority, string> = {
  normal: "Normal",
  urgent: "Urgent",
}

export const RECONCILIATION_ISSUE_TYPES = [
  "not-received",
  "wrong-device",
  "damaged",
  "lost",
  "other",
] as const

export type ReconciliationIssueType = (typeof RECONCILIATION_ISSUE_TYPES)[number]

export const RECONCILIATION_ISSUE_LABELS: Record<ReconciliationIssueType, string> = {
  "not-received": "Not received",
  "wrong-device": "Wrong device",
  damaged: "Damaged",
  lost: "Lost",
  other: "Other",
}

export const RETURN_REASONS = [
  "Leaving company",
  "Role change — no longer needed",
  "Upgrading to new device",
  "Damaged / defective",
  "Other",
] as const
