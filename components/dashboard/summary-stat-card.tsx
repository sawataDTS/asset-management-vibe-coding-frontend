import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { cn } from "@/lib/utils"

export function SummaryStatCard({
  label,
  value,
  helper,
  icon: Icon,
  iconClassName,
  className,
}: {
  label: string
  value: React.ReactNode
  helper: string
  icon: LucideIcon
  iconClassName?: string
  className?: string
}) {
  return (
    <DashboardCard className={cn("p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {helper}
          </p>
        </div>
        <div
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg",
            iconClassName
          )}
        >
          <Icon className="size-4" />
        </div>
      </div>
    </DashboardCard>
  )
}
