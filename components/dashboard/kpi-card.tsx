import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react"

import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { cn } from "@/lib/utils"

export function KpiCard({
  icon: Icon,
  iconColor = "text-primary",
  label,
  value,
  helper,
  trend,
  className,
}: {
  icon: LucideIcon
  iconColor?: string
  label: string
  value: string
  helper: string
  trend?: { direction: "up" | "down"; value: string; label: string }
  className?: string
}) {
  return (
    <DashboardCard className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid size-10 place-items-center rounded-xl bg-muted/60 ring-1 ring-border/60",
              iconColor.replace("text-", "bg-") + "/10"
            )}
          >
            <Icon className={cn("size-4", iconColor)} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium tracking-wide text-muted-foreground">
              {label}
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </div>
          </div>
        </div>
        {trend ? (
          <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background px-2 py-1 text-xs text-muted-foreground">
            {trend.direction === "up" ? (
              <ArrowUpRightIcon className="size-3 text-emerald-600" />
            ) : (
              <ArrowDownRightIcon className="size-3 text-amber-600" />
            )}
            <span className="font-medium text-foreground/80">{trend.value}</span>
          </div>
        ) : null}
      </div>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {helper}
        {trend ? (
          <span className="ml-2 text-xs text-muted-foreground/80">
            · {trend.label}
          </span>
        ) : null}
      </div>
    </DashboardCard>
  )
}

