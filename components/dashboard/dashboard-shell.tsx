"use client"

import * as React from "react"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function DashboardShell({
  title,
  actions,
  children,
  className,
}: {
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <SidebarProvider
      defaultOpen
      style={{
        // Fixed 260px sidebar width
        ["--sidebar-width" as string]: "260px",
      }}
      className="min-h-svh bg-background"
    >
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden bg-background">
        <header className="z-30 shrink-0 border-b border-border bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
          <div className="flex h-14 w-full items-center justify-between gap-4 px-3 sm:px-4">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium tracking-tight text-foreground">
                {title}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <Avatar size="sm">
                <AvatarFallback>MR</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <main
            className={cn(
              "w-full px-3 py-5 sm:px-4 sm:py-6",
              className
            )}
          >
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
