"use client"

import { useMemo } from "react"

import { SettingsPanel } from "./settings-panel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge, type badgeVariants } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DEFAULT_TEAM, type TeamMember } from "@/lib/settings-data"
import { surfaceDividerTopClassName, surfaceOutlineClassName } from "@/lib/surface"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function roleBadgeVariant(role: string): NonNullable<VariantProps<typeof badgeVariants>["variant"]> {
  switch (role) {
    case "Admin":
      return "default"
    case "Manager":
      return "info"
    case "HR":
      return "secondary"
    case "Employee":
      return "outline"
    default:
      return "secondary"
  }
}

function TeamMemberCell({ member }: { member: TeamMember }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar size="sm">
        <AvatarImage src="" alt={member.name} />
        <AvatarFallback className="bg-accent text-primary">{getInitials(member.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <span className={cn("block truncate", typeScale.body.emphasis)}>{member.name}</span>
        <span className={cn("block truncate", typeScale.caption.meta)}>{member.email}</span>
      </div>
    </div>
  )
}

function TeamRoleBadge({ role }: { role: string }) {
  return (
    <Badge variant={roleBadgeVariant(role)} className="min-w-21 justify-center px-2.5">
      {role}
    </Badge>
  )
}

function TeamSettings() {
  const members = DEFAULT_TEAM
  const memberLabel = useMemo(
    () => (members.length === 1 ? "1 member" : `${members.length} members`),
    [members.length]
  )

  return (
    <SettingsPanel
      title="Team & roles"
      actions={
        <Badge variant="secondary" className="h-6 px-2.5 font-normal">
          {memberLabel}
        </Badge>
      }
    >
      <div className={cn("overflow-hidden rounded-xl", surfaceOutlineClassName)}>
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
              <TableHead className="h-10 px-3.5">Member</TableHead>
              <TableHead className="h-10 px-3.5 text-right">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="last:border-0">
                <TableCell className="px-3.5 py-3">
                  <TeamMemberCell member={member} />
                </TableCell>
                <TableCell className="px-3.5 py-3 text-right">
                  <TeamRoleBadge role={member.role} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className={cn(surfaceDividerTopClassName, "pt-5", typeScale.body.muted)}>
        To invite teammates, share your sign-up page — new accounts join your workspace automatically when
        registered with an existing tenant.
      </p>
    </SettingsPanel>
  )
}

export { TeamSettings }
