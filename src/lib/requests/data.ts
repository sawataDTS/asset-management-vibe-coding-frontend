export type RequestStatus = "pending" | "approved" | "rejected" | "closed"

export type EmployeeRequest = {
  id: string
  title: string
  employeeName: string
  status: RequestStatus
  submittedAt: string
}

export type ReconciliationStatus = "pending" | "reconciled" | "dismissed"

export type HardwareReconciliation = {
  id: string
  assetName: string
  assetTag: string
  employeeName: string
  status: ReconciliationStatus
  flaggedAt: string
}

/** Empty until requests can be submitted from the team portal. */
export const initialEmployeeRequests: EmployeeRequest[] = []

/** Empty until employees flag hardware for IT review. */
export const initialHardwareReconciliations: HardwareReconciliation[] = []
