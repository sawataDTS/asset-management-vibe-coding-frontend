"use client"

import * as React from "react"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
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
        ["--sidebar-width" as string]: "240px",
      }}
      className="min-h-svh bg-background"
    >
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden bg-background">
        <header className="z-30 shrink-0 border-b border-border bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
          <div className="flex h-14 w-full items-center justify-between gap-4 px-3 sm:px-4">
            <div className="font-display flex min-w-0 flex-wrap items-baseline gap-1 truncate text-sm font-semibold tracking-sidebar-nav text-foreground">
              {title}
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
                  MR
                </span>
              </span>
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
