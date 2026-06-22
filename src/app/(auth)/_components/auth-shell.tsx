import * as React from "react"

import { SidebarBrand } from "@/components/layout/Sidebar"
import { cn } from "@/lib/utils"

function AuthBrand({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <SidebarBrand className="h-auto justify-center px-0" />
      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        Smart IT. Total Control.
      </p>
    </div>
  )
}

function AuthPageShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative z-10 flex w-full max-w-md flex-col items-center gap-8", className)}>
      <AuthBrand />
      {children}
    </div>
  )
}

/** Card title + description used on auth pages (login, forgot password, …). */
function AuthCardHeader({
  title,
  description,
  className,
}: {
  title: string
  description: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">{title}</h1>
      <div className="text-sm leading-relaxed text-muted-foreground">{description}</div>
    </div>
  )
}

export { AuthBrand, AuthPageShell, AuthCardHeader }
