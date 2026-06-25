import * as React from "react"
import { type LucideIcon } from "lucide-react"

import { accentIconTileClassName } from "@/lib/surface"
import { cn } from "@/lib/utils"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import {
  Card,
  CardAction,
  CardActions,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * Standard dashboard panel: tokenized header (title, description, optional top-right
 * action) plus body content and optional footer actions row.
 *
 * - **`display`** (default): `CardHeader` + `CardContent` with the card's default
 *   `gap-(--card-spacing)` — tables, lists, read-only panels.
 * - **`form`**: `gap-0 py-0` shell; header/content spacing uses slot padding (not
 *   card gap) per DESIGN.md §10 — pair with `footer` for `CardActions`.
 * See DESIGN.md §10 for the full card selection guide (`CardContainer`, `MetricCard`,
 * `ChartCard`, `ReportListCard`, `DataTable`).
 */
export interface CardContainerProps extends Omit<React.ComponentProps<typeof Card>, "title"> {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Optional leading icon tile in the header (top-aligned with title). */
  icon?: LucideIcon
  /** Top-right header slot — buttons, links, menus, etc. */
  action?: React.ReactNode
  /** Bottom action row rendered in `CardActions`. */
  footer?: React.ReactNode
  /** Wraps body + footer in a `<form>` when provided. */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  formClassName?: string
  /** Applies shared full-width control sizing (settings / intake forms). */
  formControls?: boolean
  variant?: "display" | "form"
  headerClassName?: string
  descriptionClassName?: string
  contentClassName?: string
  footerClassName?: string
  children?: React.ReactNode
}

function CardContainer({
  title,
  description,
  icon: Icon,
  action,
  footer,
  onSubmit,
  formClassName,
  formControls = false,
  variant = "display",
  headerClassName,
  descriptionClassName,
  contentClassName,
  footerClassName,
  children,
  className,
  ...props
}: CardContainerProps) {
  const isFormShell = variant === "form"
  const hasFooter = footer != null
  const hasBody = children != null
  const showHeader = title != null || description != null || action != null || Icon != null
  /** Header-only panels — no empty CardContent (avoids phantom bottom inset). */
  const headerOnly = showHeader && !hasBody && !hasFooter

  const body = (
    <>
      {hasBody ? (
        <CardContent
          className={cn(
            isFormShell && "flex flex-col gap-6",
            isFormShell && formControls && settingsControlClassName,
            !isFormShell && formControls && settingsControlClassName,
            // Footer follows — keep bottom inset on content (focus rings) instead of pb-0 + actions pt.
            hasFooter && "pb-(--card-spacing)!",
            contentClassName
          )}
        >
          {children}
        </CardContent>
      ) : null}
      {hasFooter ? (
        <CardActions className={cn("p-0 px-(--card-spacing) pb-(--card-spacing)", footerClassName)}>
          {footer}
        </CardActions>
      ) : null}
    </>
  )

  return (
    <Card className={cn(isFormShell && "gap-0 py-0", className)} {...props}>
      {showHeader ? (
        <CardHeader
          className={cn((headerOnly || (isFormShell && hasBody)) && "pb-(--card-spacing)", headerClassName)}
        >
          {Icon ? (
            <div className="flex min-w-0 items-start gap-3">
              <span className={accentIconTileClassName}>
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                {title ? <CardTitle>{title}</CardTitle> : null}
                {description ? (
                  <CardDescription className={cn("mt-1", descriptionClassName)}>
                    {description}
                  </CardDescription>
                ) : null}
              </div>
            </div>
          ) : (
            <>
              {title ? <CardTitle>{title}</CardTitle> : null}
              {description ? (
                <CardDescription className={descriptionClassName}>{description}</CardDescription>
              ) : null}
            </>
          )}
          {action ? <CardAction>{action}</CardAction> : null}
        </CardHeader>
      ) : null}
      {onSubmit ? (
        <form onSubmit={onSubmit} className={cn("flex flex-col", formClassName)}>
          {body}
        </form>
      ) : (
        body
      )}
    </Card>
  )
}

export { CardContainer }
