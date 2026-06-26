"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { typeScale } from "@/lib/typography"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { NAV_SECTIONS, type NavItem } from "@/components/layout/nav-config"

/* -------------------------------------------------------------------------- */
/*                                 Container                                   */
/* -------------------------------------------------------------------------- */

function Sidebar({ className, children, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "relative z-20 flex h-full w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xs",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

function SidebarBrand({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-brand"
      className={cn("flex h-16 shrink-0 items-center px-4", className)}
      {...props}
    >
      <Link
        href="/overview"
        aria-label="Asset360Hub — go to overview"
        className="group/brand flex min-w-0 items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span className={cn(typeScale.display.brand, "py-0.5 whitespace-nowrap")}>
          Asset<span className="text-primary">360Hub</span>
        </span>
      </Link>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Section                                    */
/* -------------------------------------------------------------------------- */

function SidebarSection({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { label?: string }) {
  return (
    <div data-slot="sidebar-section" className={cn("flex flex-col", className)} {...props}>
      {label ? <p className={cn("mb-1 px-3 py-1.5", typeScale.caption.overline)}>{label}</p> : null}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Item                                      */
/* -------------------------------------------------------------------------- */

function SidebarItem({
  href,
  icon: Icon,
  label,
  badge,
  active,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: string
  icon: LucideIcon
  label: string
  badge?: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      data-slot="sidebar-item"
      data-active={active ? "true" : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group/sidebar-item flex h-9 items-center gap-3 rounded-lg border border-transparent px-3 text-sm leading-5 font-normal text-muted-foreground transition-colors outline-none",
        "hover:bg-sidebar-hover hover:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        "data-[active=true]:border-sidebar-border data-[active=true]:bg-sidebar-active data-[active=true]:font-medium data-[active=true]:text-primary data-[active=true]:shadow-xs",
        className
      )}
      {...props}
    >
      <Icon strokeWidth={1.75} className="size-4 shrink-0 text-inherit transition-colors" />
      <span className="min-w-0 truncate">{label}</span>
      {badge ? (
        <Badge variant="secondary" className="ml-auto h-4.5 px-1.5 text-[0.625rem]">
          {badge}
        </Badge>
      ) : null}
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Footer                                     */
/* -------------------------------------------------------------------------- */

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("mt-auto flex flex-col gap-0 border-t border-sidebar-border p-3", className)}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Profile                                    */
/* -------------------------------------------------------------------------- */

export interface SidebarUser {
  name: string
  email: string
  avatarUrl?: string
  /** Tenant / workspace the user belongs to. Surfaced in the profile menu. */
  organization?: string
}

function SidebarProfile({
  user,
  onSignOut,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  user: SidebarUser
  onSignOut?: () => void
}) {
  return (
    <div data-slot="sidebar-profile" className={cn("flex flex-col gap-0", className)} {...props}>
      <div className="rounded-xl border border-sidebar-border px-4 py-3.5 shadow-xs">
        <p className={cn("truncate leading-snug", typeScale.body.emphasis)}>{user.name}</p>
        <p className={cn("mt-1 truncate leading-snug", typeScale.caption.meta)}>{user.email}</p>
      </div>

      <button
        type="button"
        onClick={() => onSignOut?.()}
        className={cn(
          "mt-1 flex h-9 w-full items-center gap-3 rounded-lg px-3 leading-5 transition-colors outline-none",
          typeScale.body.emphasis,
          "hover:bg-sidebar-hover focus-visible:ring-2 focus-visible:ring-ring/50"
        )}
      >
        <LogOut strokeWidth={1.75} className="size-4 shrink-0 text-muted-foreground" />
        Sign out
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                          Pre-composed workspace nav                        */
/* -------------------------------------------------------------------------- */

function SidebarNav({
  onNavigate,
  className,
  ...props
}: React.ComponentProps<"nav"> & { onNavigate?: () => void }) {
  const pathname = usePathname()
  const isActive = (item: NavItem) =>
    item.href === "/overview" ? pathname === "/overview" : pathname.startsWith(item.href)

  return (
    <nav
      data-slot="sidebar-nav"
      className={cn("flex flex-1 flex-col gap-1 space-y-1 overflow-y-auto p-3", className)}
      {...props}
    >
      {NAV_SECTIONS.map((section) => (
        <SidebarSection key={section.label} label={section.label} className="p-0">
          {section.items.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              active={isActive(item)}
              onClick={onNavigate}
            />
          ))}
        </SidebarSection>
      ))}
    </nav>
  )
}

export {
  Sidebar,
  SidebarBrand,
  SidebarSection,
  SidebarItem,
  SidebarFooter,
  SidebarProfile,
  SidebarNav,
  Separator as SidebarSeparator,
}
