import * as React from "react"

import { Badge } from "@/components/ui/badge"
import type { LicenseStatus } from "@/lib/software/data"

const STATUS_VARIANT: Record<LicenseStatus, React.ComponentProps<typeof Badge>["variant"]> = {
  Active: "success",
  "Expiring Soon": "warning",
  Expired: "destructive",
}

function LicenseStatusBadge({ status }: { status: LicenseStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
}

export { LicenseStatusBadge }
