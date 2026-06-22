"use client"

import * as React from "react"
import Link from "next/link"
import { LogOut, Palette, Settings, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { SidebarUser } from "@/components/layout/Sidebar"

/** Derive up-to-two uppercase initials from a full name. */
function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function UserMenuShortcut({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: LucideIcon
  label: string
}) {
  return (
    <DropdownMenuItem asChild className="gap-2.5 px-2 py-2">
      <Link href={href}>
        <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
        <span className="font-medium">{label}</span>
      </Link>
    </DropdownMenuItem>
  )
}

/**
 * Profile menu anchored to the navbar avatar. Built on the shared `DropdownMenu`
 * primitive, so it inherits smooth open/close animation, click-outside + Escape
 * dismissal, roving keyboard focus, and full theme awareness for free. Purely
 * token-driven — no hardcoded colors or spacing.
 */
export function UserMenu({
  user,
  onSignOut,
  className,
}: {
  user: SidebarUser
  onSignOut?: () => void
  className?: string
}) {
  const initials = getInitials(user.name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className={cn(
            "flex shrink-0 items-center rounded-full outline-none transition-shadow",
            "focus-visible:ring-2 focus-visible:ring-ring/50 aria-expanded:ring-2 aria-expanded:ring-ring/40",
            className
          )}
        >
          <Avatar className="border border-primary/20">
            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : null}
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-72 p-0">
        {/* Header — organization + sign out */}
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span className="min-w-0 truncate text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {user.organization ?? "Workspace"}
          </span>
          <DropdownMenuItem
            onSelect={() => onSignOut?.()}
            className="h-auto w-auto shrink-0 gap-1.5 px-2 py-1 text-xs font-semibold whitespace-nowrap text-primary"
          >
            <LogOut className="size-3.5" strokeWidth={2} />
            Sign out
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="mx-0 my-0" />

        {/* User identity */}
        <div className="flex items-center gap-3 px-3 py-3">
          <Avatar size="lg" className="border border-primary/20">
            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : null}
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="truncate text-sm leading-snug font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-xs leading-snug text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="mx-0 my-0" />

        {/* Footer — shortcuts */}
        <div className="p-1">
          <UserMenuShortcut href="/settings" icon={Settings} label="Settings" />
          <UserMenuShortcut href="/settings#theme" icon={Palette} label="Theme preferences" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
