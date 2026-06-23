"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { typeScale } from "@/lib/typography"
import { shellPaddingX } from "@/components/layout/layout-spacing"
import { UserMenu } from "@/components/layout/UserMenu"
import type { SidebarUser } from "@/components/layout/Sidebar"

/**
 * Sticky top navigation bar. Stays pinned (with a backdrop blur over the navbar
 * token, so it adapts per theme including dark mode) while the content area
 * scrolls. The page title is the dominant element; the account avatar opens the
 * profile menu (`UserMenu`).
 */
function Navbar({
  title,
  user,
  leading,
  actions,
  onSignOut,
  className,
  ...props
}: React.ComponentProps<"header"> & {
  title: string
  user: SidebarUser
  leading?: React.ReactNode
  actions?: React.ReactNode
  onSignOut?: () => void
}) {
  return (
    <header
      data-slot="navbar"
      className={cn(
        "sticky top-0 z-30 shrink-0 border-b border-navbar-border bg-navbar/90 shadow-xs backdrop-blur-md supports-backdrop-filter:bg-navbar/70",
        className
      )}
      {...props}
    >
      <div className={cn("flex h-16 w-full items-center justify-between gap-4", shellPaddingX)}>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {leading ? <div className="flex shrink-0 items-center md:hidden">{leading}</div> : null}
          <p className={cn("truncate py-0.5", typeScale.display.nav)}>{title}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {actions}
          <UserMenu user={user} onSignOut={onSignOut} />
        </div>
      </div>
    </header>
  )
}

export { Navbar }
export default Navbar
