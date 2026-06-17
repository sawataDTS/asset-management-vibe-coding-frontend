import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function MetricCard({
  icon: Icon,
  iconColor = "text-primary",
  title,
  value,
  description,
  progress,
  className,
}: {
  icon: LucideIcon
  iconColor?: string
  title: string
  value: string
  description: string
  progress: number
  className?: string
}) {
  return (
    <DashboardCard className={cn("p-5", className)}>
      <div className="flex items-start gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-background/80 ring-1 ring-border/60">
          <Icon className={cn("size-4", iconColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold tracking-wide text-muted-foreground">
            {title}
          </div>
          <div className="mt-1 flex items-end justify-between gap-3">
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            <div className="w-20">
              <Progress value={progress} className="h-1" />
            </div>
          </div>
          <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}

