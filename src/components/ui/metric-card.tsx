import * as React from "react"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { typeScale } from "@/lib/typography"
import { Card } from "@/components/ui/card"

/**
 * Reusable KPI / stat card used across dashboards. Fully token-driven so it
 * re-themes automatically. Composes the base `Card` primitive — do not fork it.
 *
 * - `iconVariant="inline"` renders the icon next to the eyebrow label.
 * - `iconVariant="badge"` renders the icon in a tokenized badge, top-right.
 * - `action` overrides the icon badge in the top-right slot (e.g. a trend pill).
 * - `children` is a free-form slot for progress bars, mini-lists, nested stats.
 */
export interface MetricCardProps extends React.ComponentProps<typeof Card> {
  label: string
  value?: React.ReactNode
  icon?: LucideIcon
  iconVariant?: "inline" | "badge"
  description?: React.ReactNode
  action?: React.ReactNode
  footer?: React.ReactNode
  valueClassName?: string
  children?: React.ReactNode
}

function MetricCard({
  label,
  value,
  icon: Icon,
  iconVariant = "inline",
  description,
  action,
  footer,
  valueClassName,
  children,
  className,
  size = "sm",
  ...props
}: MetricCardProps) {
  const showBadge = Icon && iconVariant === "badge"
  const rightSlot =
    action ??
    (showBadge ? (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/80 text-primary ring-1 ring-border/60">
        <Icon className="size-4" strokeWidth={1.75} />
      </span>
    ) : null)

  return (
    <Card size={size} className={cn("flex h-full flex-col gap-2", className)} {...props}>
      <div className="flex items-center justify-between gap-2 px-(--card-spacing) pt-(--card-spacing)">
        <p className={cn("flex min-w-0 items-center gap-1.5", typeScale.caption.overline)}>
          {Icon && iconVariant === "inline" ? (
            <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          ) : null}
          <span className="truncate">{label}</span>
        </p>
        {rightSlot}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-2 px-(--card-spacing)",
          footer ? undefined : "pb-(--card-spacing)"
        )}
      >
        {value !== undefined ? (
          <span
            className={cn(typeScale.titleMetric, valueClassName)}
          >
            {value}
          </span>
        ) : null}
        {description ? <div className={cn("leading-snug", typeScale.caption.meta)}>{description}</div> : null}
        {children}
      </div>

      {footer ? (
        <div className={cn("mt-auto border-t border-border/60 px-(--card-spacing) pt-2.5 pb-(--card-spacing) leading-relaxed", typeScale.caption.meta)}>
          {footer}
        </div>
      ) : null}
    </Card>
  )
}

export { MetricCard }
