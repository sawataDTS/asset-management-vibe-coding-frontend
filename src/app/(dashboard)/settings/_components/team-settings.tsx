"use client"

import { SettingsPanel } from "./settings-panel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DEFAULT_TEAM } from "@/lib/settings-data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function TeamSettings() {
  const members = DEFAULT_TEAM
  const memberLabel = members.length === 1 ? "1 member" : `${members.length} members`

  return (
    <SettingsPanel title="Team & roles" actions={<span className={typeScale.body.muted}>{memberLabel}</span>}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead className="text-right">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarImage src="" alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className={cn("truncate", typeScale.body.emphasis)}>{member.name}</span>
                    <span className={cn("truncate", typeScale.caption.meta)}>{member.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="info">{member.role}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className={typeScale.body.muted}>
        To invite teammates, share your sign-up page — new accounts join your workspace automatically when
        registered with an existing tenant.
      </p>
    </SettingsPanel>
  )
}

export { TeamSettings }
