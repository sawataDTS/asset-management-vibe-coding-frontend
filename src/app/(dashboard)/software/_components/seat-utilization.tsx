"use client"

import { Progress } from "@/components/ui/progress"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

function SeatUtilization({
  assigned,
  total,
  className,
}: {
  assigned: number
  total: number
  className?: string
}) {
  const pct = total > 0 ? Math.min(100, Math.round((assigned / total) * 100)) : 0

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className={typeScale.caption.meta}>
          {assigned} / {total} seats
        </span>
        <span className={cn(typeScale.caption.meta, "tabular-nums")}>{pct}%</span>
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  )
}

export { SeatUtilization }
