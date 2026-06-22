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
  extends Omit<React.ComponentProps<typeof TabsList>, "children">,
    VariantProps<typeof tabsListVariants> {
  items: TabNavItem[]
  /** Allow triggers to grow and fill the available width. Defaults to false. */
  fill?: boolean
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
  className,
  ...props
}: TabNavProps) {
  return (
    <TabsList
      variant={variant}
      size={size}
      className={cn(fill && "w-full", className)}
      {...props}
    >
      {items.map((item) => (
        <TabsTrigger
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className="gap-1.5 px-3"
        >
          {item.icon ? <item.icon /> : null}
          {item.label}
          {item.badge != null ? (
            <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium tabular-nums text-muted-foreground group-data-[variant=default]/tabs-list:bg-background in-data-active:bg-accent in-data-active:text-primary">
              {item.badge}
            </span>
          ) : null}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}

export { TabNav }
