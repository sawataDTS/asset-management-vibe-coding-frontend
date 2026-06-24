import * as React from "react"

import { cn } from "@/lib/utils"
import { typeScale } from "@/lib/typography"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card"

/**
 * Reusable container for an analytics / insight panel: a tokenized header
 * (title, description, optional action) plus an optional eyebrow + meta row that
 * sits directly above the chart body. Composes the base `Card` primitive.
 */
export interface ChartCardProps extends Omit<React.ComponentProps<typeof Card>, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  /** Small uppercase label rendered above the chart (e.g. "ROLLING WINDOW"). */
  eyebrow?: React.ReactNode
  /** Secondary label paired with the eyebrow (e.g. "Eight months trailing"). */
  meta?: React.ReactNode
  contentClassName?: string
  children: React.ReactNode
}

function ChartCard({
  title,
  description,
  action,
  eyebrow,
  meta,
  contentClassName,
  children,
  className,
  ...props
}: ChartCardProps) {
  return (
    <Card className={cn("gap-4", className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>

      <CardContent className={cn("flex flex-col gap-4", contentClassName)}>
        {eyebrow || meta ? (
          <div className="flex flex-col gap-0.5">
            {eyebrow ? <span className={typeScale.caption.overline}>{eyebrow}</span> : null}
            {meta ? <span className={typeScale.body.emphasis}>{meta}</span> : null}
          </div>
        ) : null}
        {children}
      </CardContent>
    </Card>
  )
}

export { ChartCard }
