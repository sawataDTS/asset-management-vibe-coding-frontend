import * as React from "react"

import { cn } from "@/lib/utils"

export function FilterToolbar({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 border-b border-border bg-muted/20 p-4",
        className
      )}
    >
      {children}
    </div>
  )
}
