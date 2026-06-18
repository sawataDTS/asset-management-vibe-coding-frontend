import * as React from "react"

import { cn } from "@/lib/utils"

export function SeatUtilization({
  assigned,
  total,
  className,
}: {
  assigned: number
  total: number
  className?: string
}) {
  const ratio = total > 0 ? (assigned / total) * 100 : 0
  const isFull = ratio >= 100
  const isWarning = ratio >= 80

  return (
    <div className={cn("w-full max-w-[200px] space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">
          {assigned} / {total} seats
        </span>
        <span className="text-muted-foreground">{Math.round(ratio)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            isFull ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-primary"
          )}
          style={{ width: `${Math.min(ratio, 100)}%` }}
        />
      </div>
    </div>
  )
}
