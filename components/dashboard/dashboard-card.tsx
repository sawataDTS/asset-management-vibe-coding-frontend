import * as React from "react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function DashboardCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "rounded-xl ring-1 ring-border/60 shadow-[0_1px_0_rgba(15,23,42,0.04)]",
        className
      )}
      {...props}
    />
  )
}

