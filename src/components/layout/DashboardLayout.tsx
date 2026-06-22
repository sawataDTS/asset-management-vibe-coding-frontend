"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarBrand,
  SidebarNav,
  SidebarSeparator,
  type SidebarUser,
} from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"
import { ContentWrapper } from "@/components/layout/ContentWrapper"
import { getPageTitle } from "@/components/layout/nav-config"

const DEFAULT_USER: SidebarUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  organization: "DTskill Services Private Limited",
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <SidebarBrand />
      <SidebarSeparator />
      <SidebarNav onNavigate={onNavigate} />
      {/* <SidebarFooter>
        <SidebarProfile user={user} onSignOut={onSignOut} />
      </SidebarFooter> */}
    </>
  )
}

/**
 * Application shell: a sticky sidebar and a sticky navbar over the default
 * browser (body) scroll. Every dashboard page renders inside this layout.
 */
export function DashboardLayout({
  children,
  user = DEFAULT_USER,
  onSignOut,
  className,
}: {
  children: React.ReactNode
  user?: SidebarUser
  onSignOut?: () => void
  className?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const title = getPageTitle(pathname)

  const handleSignOut = onSignOut ?? (() => router.push("/login"))

  return (
    <div className={cn("flex min-h-svh w-full bg-background", className)}>
      {/* Desktop sidebar */}
      <Sidebar className="sticky top-0 hidden h-svh self-start md:flex">
        <SidebarBody />
      </Sidebar>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen} modal={false}>
        <SheetContent side="left" className="w-60 gap-0 bg-sidebar p-0 text-sidebar-foreground">
          <SheetTitle className="sr-only">Workspace navigation</SheetTitle>
          <Sidebar className="h-full w-full border-r-0">
            <SidebarBody onNavigate={() => setMobileOpen(false)} />
          </Sidebar>
        </SheetContent>

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar
            title={title}
            user={user}
            onSignOut={handleSignOut}
            leading={
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Open navigation">
                  <Menu />
                </Button>
              </SheetTrigger>
            }
          />
          <main className="flex flex-1 flex-col">
            <ContentWrapper>{children}</ContentWrapper>
          </main>
        </div>
      </Sheet>
    </div>
  )
}

export default DashboardLayout
