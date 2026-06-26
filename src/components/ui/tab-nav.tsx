"use client"

import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { TabsList, TabsTrigger, tabsListVariants } from "@/components/ui/tabs"

export interface TabNavItem {
  value: string
  label: React.ReactNode
  icon?: LucideIcon
  /** Optional trailing count / badge (e.g. a number or status pill). */
  badge?: React.ReactNode
  disabled?: boolean
}

export interface TabNavProps
  extends Omit<React.ComponentProps<typeof TabsList>, "children">, VariantProps<typeof tabsListVariants> {
  items: TabNavItem[]
  /** Allow triggers to grow and fill the available width. Defaults to false. */
  fill?: boolean
  /** Extra classes applied to each tab trigger. */
  triggerClassName?: string
}

/**
 * Reusable, data-driven tab navigation built on the `Tabs` primitive. Use it
 * for every page-level / section-level tab switcher so the app stays visually
 * consistent. Must be rendered inside a `<Tabs>` root; pair with `<TabsContent>`
 * for the panels.
 *
 * - `variant="default"` → segmented pill control (e.g. Overview asset health).
 * - `variant="line"` → underlined tabs (e.g. Settings sections).
 */
function TabNav({
  items,
  variant = "default",
  size = "lg",
  fill = false,
  triggerClassName,
  className,
  ...props
}: TabNavProps) {
  return (
    <div className="w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden pb-0.5">
      <TabsList
        variant={variant}
        size={size}
        className={cn(fill ? "w-full" : "min-w-max", className)}
        {...props}
      >
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn("gap-1.5 px-3", fill ? "flex-1" : "flex-none shrink-0", triggerClassName)}
          >
            {item.icon ? <item.icon /> : null}
            {item.label}
            {item.badge != null ? (
              <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground tabular-nums group-data-[variant=default]/tabs-list:bg-card in-data-active:bg-accent in-data-active:text-primary">
                {item.badge}
              </span>
            ) : null}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  )
}

export { TabNav }
