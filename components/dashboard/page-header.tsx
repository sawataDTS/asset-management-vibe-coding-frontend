import * as React from "react"

import { cn } from "@/lib/utils"

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  className,
}: {
  eyebrow?: string
  title: string
  description?: React.ReactNode
  meta?: React.ReactNode
  className?: string
}) {
  return (
    <header className={cn("space-y-1", className)}>
      {eyebrow ? (
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {description ? (
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {meta ? (
        <p className="text-sm text-muted-foreground">{meta}</p>
      ) : null}
    </header>
  )
}
