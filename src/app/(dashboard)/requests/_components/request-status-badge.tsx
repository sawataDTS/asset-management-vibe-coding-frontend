import * as React from "react"

import { Badge } from "@/components/ui/badge"
import type { ReconciliationStatus, RequestStatus } from "@/lib/requests/data"
import type { RequestPriority } from "@/lib/requests/constants"
import { REQUEST_PRIORITY_LABELS } from "@/lib/requests/constants"

const REQUEST_STATUS_VARIANT: Record<RequestStatus, React.ComponentProps<typeof Badge>["variant"]> = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
  closed: "secondary",
}

const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  closed: "Closed",
}

const RECONCILIATION_STATUS_VARIANT: Record<
  ReconciliationStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  pending: "warning",
  reconciled: "success",
  dismissed: "secondary",
}

const RECONCILIATION_STATUS_LABELS: Record<ReconciliationStatus, string> = {
  pending: "Pending",
  reconciled: "Reconciled",
  dismissed: "Dismissed",
}

function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return <Badge variant={REQUEST_STATUS_VARIANT[status]}>{REQUEST_STATUS_LABELS[status]}</Badge>
}

function ReconciliationStatusBadge({ status }: { status: ReconciliationStatus }) {
  return <Badge variant={RECONCILIATION_STATUS_VARIANT[status]}>{RECONCILIATION_STATUS_LABELS[status]}</Badge>
}

function RequestPriorityBadge({ priority }: { priority: RequestPriority }) {
  return (
    <Badge variant={priority === "urgent" ? "destructive" : "outline"}>
      {REQUEST_PRIORITY_LABELS[priority]}
    </Badge>
  )
}

export { ReconciliationStatusBadge, RequestPriorityBadge, RequestStatusBadge }
