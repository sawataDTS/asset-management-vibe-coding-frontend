"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3Icon,
  Building2Icon,
  FileTextIcon,
  HardDriveIcon,
  HomeIcon,
  InboxIcon,
  Layers3Icon,
  LogOutIcon,
  PackageIcon,
  SettingsIcon,
  UsersIcon,
  WorkflowIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const nav = [
  { label: "Overview", href: "/dashboard", icon: HomeIcon },
  { label: "Intake", href: "/dashboard/intake", icon: InboxIcon },
  { label: "Hardware", href: "/dashboard/hardware", icon: HardDriveIcon },
  { label: "Software", href: "/dashboard/software", icon: Layers3Icon },
  { label: "Suppliers", href: "/dashboard/suppliers", icon: Building2Icon },
  { label: "Employees", href: "/dashboard/employees", icon: UsersIcon },
  {
    label: "Employee Lifecycle",
    href: "/dashboard/employee-lifecycle",
    icon: WorkflowIcon,
  },
  { label: "Requests", href: "/dashboard/requests", icon: FileTextIcon },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3Icon },
  { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
] as const

const navItemClass = cn(
  "!h-9 !min-h-9 !gap-3 !overflow-visible !rounded-lg !px-3 text-sm leading-5 font-medium tracking-sidebar-nav transition-colors",
  "text-sidebar-foreground/90",
  "hover:!bg-sidebar-hover hover:!text-foreground",
  "data-[active=true]:!bg-sidebar-active data-[active=true]:!text-primary",
  "data-[active=true]:hover:!bg-sidebar-active data-[active=true]:hover:!text-primary",
  "[&_svg]:!size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
  "hover:[&_svg]:text-foreground",
  "data-[active=true]:[&_svg]:!text-primary",
  "[&_span]:min-w-0 [&_span]:truncate"
)

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = () => {
    router.push("/")
  }

  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="p-3">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
            <PackageIcon className="size-4" strokeWidth={1.75} />
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-1 truncate font-display text-sm leading-5 font-semibold tracking-sidebar-nav text-foreground">
            <span>DTskill</span>
            <span className="text-primary">Services</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="flex-1 space-y-1 p-3">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-1 h-auto px-0 py-1.5 text-xs font-medium tracking-sidebar-section text-muted-foreground uppercase">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {nav.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname?.startsWith(item.href)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={navItemClass}
                    >
                      <Link href={item.href}>
                        <item.icon strokeWidth={1.75} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-0 border-t border-sidebar-border p-3">
        <div className="rounded-xl border border-border px-4 py-3.5">
          <p className="text-sm leading-snug font-semibold tracking-sidebar-nav text-foreground">
            Mahesh Raja
          </p>
          <p className="mt-1 text-xs leading-snug tracking-sidebar-nav text-muted-foreground">
            mahesh@dtskill.com
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className={cn(
            "mt-1 flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm leading-5 font-medium tracking-sidebar-nav text-foreground transition-colors",
            "hover:bg-sidebar-hover"
          )}
        >
          <LogOutIcon
            className="size-4 shrink-0 text-muted-foreground"
            strokeWidth={1.75}
          />
          Sign out
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
