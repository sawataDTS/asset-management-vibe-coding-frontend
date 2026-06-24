"use client"

import * as React from "react"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { typeScale } from "@/lib/typography"

export interface SubTabNavItem {
  value: string
  label: React.ReactNode
  icon?: LucideIcon
  disabled?: boolean
}

export interface SubTabNavProps extends React.ComponentProps<"div"> {
  items: SubTabNavItem[]
  value: string
  onValueChange: (value: string) => void
  /** Hide this row when printing/exporting report output. Defaults to true. */
  hideOnExport?: boolean
}

/**
 * Compact secondary tab strip for nested views beneath a page-level `TabNav`.
 * Uses smaller elevated pills (not the muted segmented track) so child tabs read
 * clearly below primary navigation.
 */
function SubTabNav({
  items,
  value,
  onValueChange,
  hideOnExport = true,
  className,
  ...props
}: SubTabNavProps) {
  return (
    <div
      className={cn("overflow-x-auto pb-0.5", hideOnExport && "data-report-export-hide", className)}
      {...props}
    >
      <div role="tablist" aria-label="Report views" className="inline-flex min-w-max flex-wrap gap-1.5">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = value === item.value

          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={item.disabled}
              onClick={() => onValueChange(item.value)}
              className={cn(
                "inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-2.5 font-medium whitespace-nowrap transition-colors",
                typeScale.caption.meta,
                "text-xs leading-none",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-sidebar-border bg-card text-muted-foreground shadow-xs hover:bg-muted/40 hover:text-foreground",
                item.disabled && "pointer-events-none opacity-50"
              )}
            >
              {Icon ? <Icon className="size-3.5 shrink-0" strokeWidth={1.75} /> : null}
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { SubTabNav }
