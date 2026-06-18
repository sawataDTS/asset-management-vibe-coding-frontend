"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3Icon,
  Building2Icon,
  FileTextIcon,
  HardDriveIcon,
  HomeIcon,
  InboxIcon,
  Layers3Icon,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      className="border-r border-sidebar-border bg-[#F8FAFC]"
    >
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-2 px-2">
          <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <PackageIcon className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight">
              DTskill Services
            </div>
            <div className="truncate text-xs text-muted-foreground">
              Enterprise workspace
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[11px] font-semibold tracking-wider text-muted-foreground">
            WORKSPACE
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
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
                      className={cn(
                        "rounded-xl px-2.5 py-2 text-[13px] text-sidebar-foreground transition-colors",
                        "hover:!bg-primary/5 hover:!text-foreground",
                        "data-[active=true]:!bg-primary/10 data-[active=true]:!text-primary data-[active=true]:!font-medium",
                        "data-[active=true]:hover:!bg-primary/10 data-[active=true]:hover:!text-primary",
                        "[&_svg]:text-muted-foreground",
                        "hover:[&_svg]:text-foreground",
                        "data-[active=true]:[&_svg]:!text-primary"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon />
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

      <SidebarFooter className="px-3 pb-3">
        <div className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-xs font-medium">Mahesh Raja</div>
              <div className="truncate text-[11px] text-muted-foreground">
                Admin · IT Ops
              </div>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground">MR</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
