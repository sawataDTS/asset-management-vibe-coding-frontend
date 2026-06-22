import * as React from "react"

import { cn } from "@/lib/utils"
import { typeScale } from "@/lib/typography"

/**
 * Uniform heading for an in-page section (a group of cards). Sits one level
 * below `PageHeader` in the typographic hierarchy: a `font-heading` title plus
 * an optional muted description and right-aligned actions. Use this instead of
 * ad-hoc labels so every section reads consistently across the app.
 */
export interface SectionHeadingProps extends React.ComponentProps<"div"> {
  title: string
  description?: string
  actions?: React.ReactNode
}

function SectionHeading({ title, description, actions, className, ...props }: SectionHeadingProps) {
  return (
    <div
      data-slot="section-heading"
      className={cn("flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4", className)}
      {...props}
    >
      <div className="flex flex-col gap-1.5">
        <h2 className={cn("leading-tight", typeScale.heading)}>{title}</h2>
        {description ? <p className={cn("max-w-2xl", typeScale.body.muted)}>{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export { SectionHeading }
