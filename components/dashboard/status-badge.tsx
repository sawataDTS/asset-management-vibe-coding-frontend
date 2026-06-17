import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type AssetStatus = "In Stock" | "Assigned" | "Repair" | "Retired"

const styles: Record<AssetStatus, string> = {
  "In Stock": "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400",
  Assigned: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400",
  Repair: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400",
  Retired: "bg-slate-500/10 text-slate-700 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400",
}

export function StatusBadge({
  status,
  className,
}: {
  status: AssetStatus
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

