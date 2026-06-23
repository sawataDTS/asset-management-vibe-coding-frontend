import * as React from "react"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { typeScale } from "@/lib/typography"
import { pageShellPadding } from "@/components/layout/layout-spacing"

/**
 * Page wrapper used at the root of every workspace page. It renders the page
 * title / description / actions row and then wraps the page content as
 * `children`, owning the page padding and the vertical rhythm between blocks.
 *
 * Because `PageHeader` owns spacing, pages should NOT add their own outer
 * padding or `gap`/`space-y` wrappers — just pass the sections as children.
 */
export interface PageHeaderProps extends React.ComponentProps<"div"> {
  title: string
  description?: string
  /** Small label rendered above the title (e.g. a welcome line or breadcrumb). */
  eyebrow?: React.ReactNode
  icon?: LucideIcon
  actions?: React.ReactNode
  /** Class names applied to the title/actions row (not the outer wrapper). */
  headerClassName?: string
}

function PageHeader({
  title,
  description,
  eyebrow,
  icon: Icon,
  actions,
  className,
  headerClassName,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div data-slot="page-header" className={cn("w-full space-y-6", pageShellPadding, className)} {...props}>
      <div
        className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", headerClassName)}
      >
        <div className="flex items-start gap-3">
          {Icon ? (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary ring-1 ring-border/60">
              <Icon className="size-5" />
            </span>
          ) : null}
          <div className="flex flex-col">
            {eyebrow ? <span className={typeScale.body.muted}>{eyebrow}</span> : null}
            <h1 className={cn(typeScale.display.page, eyebrow && "mt-1")}>{title}</h1>
            {description ? (
              <p className={cn("mt-1.5 max-w-3xl", typeScale.body.muted)}>{description}</p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  )
}

export { PageHeader }
