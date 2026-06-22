import * as React from "react"

import { Badge } from "@/components/ui/badge"
import type { AssetStatus } from "@/lib/hardware/data"

const STATUS_VARIANT: Record<AssetStatus, React.ComponentProps<typeof Badge>["variant"]> = {
  "In Stock": "success",
  Assigned: "info",
  Repair: "warning",
  Retired: "secondary",
}

function AssetStatusBadge({ status }: { status: AssetStatus }) {
  const label = status === "Repair" ? "In Repair" : status
  return <Badge variant={STATUS_VARIANT[status]}>{label}</Badge>
}

export { AssetStatusBadge }
