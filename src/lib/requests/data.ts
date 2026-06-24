import type { ReconciliationIssueType, RequestPriority, RequestType } from "@/lib/requests/constants"

export type RequestStatus = "pending" | "approved" | "rejected" | "closed"

export type EmployeeRequest = {
  id: string
  type: RequestType
  title: string
  employeeName: string
  employeeEmail: string
  status: RequestStatus
  priority: RequestPriority
  submittedAt: string
  description: string
  category?: string
  itemName?: string
  quantity?: number
  seats?: number
  neededBy?: string
  assetId?: string
  assetTag?: string
  returnReason?: string
  replacementReason?: string
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
}

export type ReconciliationStatus = "pending" | "reconciled" | "dismissed"

export type HardwareReconciliation = {
  id: string
  assetId: string
  assetName: string
  assetTag: string
  employeeName: string
  employeeEmail: string
  issueType: ReconciliationIssueType
  notes: string
  status: ReconciliationStatus
  flaggedAt: string
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
}

export const initialEmployeeRequests: EmployeeRequest[] = [
  {
    id: "req-001",
    type: "hardware",
    title: 'MacBook Pro 14" for design work',
    employeeName: "John Doe",
    employeeEmail: "john.doe@example.com",
    status: "pending",
    priority: "urgent",
    submittedAt: "2026-06-20",
    description: "Need a higher-spec laptop for Figma and video editing workloads.",
    category: "Laptop",
    itemName: 'MacBook Pro 14"',
    quantity: 1,
    neededBy: "2026-07-01",
  },
  {
    id: "req-002",
    type: "software",
    title: "Figma Professional — 2 seats",
    employeeName: "Priya Sharma",
    employeeEmail: "priya.sharma@example.com",
    status: "approved",
    priority: "normal",
    submittedAt: "2026-06-15",
    description: "Design team needs pooled Figma seats for the Q3 campaign.",
    category: "Design",
    itemName: "Figma Professional",
    seats: 2,
    neededBy: "2026-06-25",
    reviewedBy: "Sarah Chen",
    reviewedAt: "2026-06-16",
    reviewNotes: "Approved — assign from existing Adobe budget line.",
  },
  {
    id: "req-003",
    type: "replacement",
    title: "Replace LAP-0014 — swollen battery",
    employeeName: "David Kim",
    employeeEmail: "david.kim@example.com",
    status: "rejected",
    priority: "urgent",
    submittedAt: "2026-06-10",
    description: "Battery is swollen and device shuts down randomly.",
    assetId: "4",
    assetTag: "LAP-0014",
    replacementReason: "Battery replacement/swollen",
    reviewedBy: "Sarah Chen",
    reviewedAt: "2026-06-11",
    reviewNotes: "Please submit via repair workflow first — replacement only if repair is not viable.",
  },
  {
    id: "req-004",
    type: "return",
    title: "Return MON-0020 — role change",
    employeeName: "Michael Rivera",
    employeeEmail: "michael.rivera@example.com",
    status: "closed",
    priority: "normal",
    submittedAt: "2026-06-05",
    description: "Moving to a laptop-only setup; external monitor no longer needed.",
    assetId: "8",
    assetTag: "MON-0020",
    returnReason: "Role change — no longer needed",
    reviewedBy: "Sarah Chen",
    reviewedAt: "2026-06-06",
    reviewNotes: "Monitor received and returned to stock.",
  },
  {
    id: "req-005",
    type: "other",
    title: "VPN access for contractor onboarding",
    employeeName: "Emily Watson",
    employeeEmail: "emily.watson@example.com",
    status: "pending",
    priority: "normal",
    submittedAt: "2026-06-22",
    description: "Two contractors starting next week need VPN credentials and MFA setup.",
  },
  {
    id: "req-006",
    type: "hardware",
    title: "Ergonomic keyboard and mouse",
    employeeName: "John Doe",
    employeeEmail: "john.doe@example.com",
    status: "approved",
    priority: "normal",
    submittedAt: "2026-06-01",
    description: "Requesting ergonomic peripherals for home office setup.",
    category: "Accessory",
    itemName: "Logitech MX Keys + MX Master",
    quantity: 1,
    reviewedBy: "Sarah Chen",
    reviewedAt: "2026-06-02",
  },
]

export const initialHardwareReconciliations: HardwareReconciliation[] = [
  {
    id: "rec-001",
    assetId: "3",
    assetName: "Dell Latitude 5540",
    assetTag: "LAP-0015",
    employeeName: "David Kim",
    employeeEmail: "david.kim@example.com",
    issueType: "wrong-device",
    notes: "Received a Lenovo instead of the Dell listed in my assignment.",
    status: "pending",
    flaggedAt: "2026-06-21",
  },
  {
    id: "rec-002",
    assetId: "5",
    assetName: "HP EliteDisplay",
    assetTag: "MON-0018",
    employeeName: "Priya Sharma",
    employeeEmail: "priya.sharma@example.com",
    issueType: "not-received",
    notes: "Monitor was shipped two weeks ago but never arrived at my desk.",
    status: "reconciled",
    flaggedAt: "2026-06-08",
    reviewedBy: "Sarah Chen",
    reviewedAt: "2026-06-10",
  },
  {
    id: "rec-003",
    assetId: "6",
    assetName: "iPhone 15 Pro",
    assetTag: "PHN-0003",
    employeeName: "John Doe",
    employeeEmail: "john.doe@example.com",
    issueType: "other",
    notes: "Asset tag on device does not match portal record.",
    status: "dismissed",
    flaggedAt: "2026-06-03",
    reviewedBy: "Sarah Chen",
    reviewedAt: "2026-06-04",
    reviewNotes: "Tag was updated in inventory — no action needed.",
  },
]
