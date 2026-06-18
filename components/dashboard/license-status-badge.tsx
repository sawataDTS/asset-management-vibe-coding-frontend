import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type LicenseStatus = "Active" | "Expiring Soon" | "Expired"

const styles: Record<LicenseStatus, string> = {
  Active:
    "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400",
  "Expiring Soon":
    "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400",
  Expired:
    "bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-500/20 dark:text-red-400",
}

export function LicenseStatusBadge({
  status,
  className,
}: {
  status: LicenseStatus
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 rounded-full border px-2 text-xs font-medium",
        styles[status],
        className
      )}
    >
      {status}
    </Badge>
  )
}
