import * as React from "react"

import { Badge } from "@/components/ui/badge"
import type { EmploymentStatus } from "@/lib/employees/data"

const STATUS_VARIANT: Record<EmploymentStatus, React.ComponentProps<typeof Badge>["variant"]> = {
  Active: "success",
  "On Leave": "warning",
  Terminated: "secondary",
}

function EmploymentStatusBadge({ status }: { status: EmploymentStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
}

export { EmploymentStatusBadge }
