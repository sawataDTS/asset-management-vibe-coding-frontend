"use client"

import { KeyRound } from "lucide-react"

import { SettingsPanel } from "./settings-panel"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

function RolesSettings() {
  return (
    <SettingsPanel title="Roles & permissions">
      <Empty className="border border-dashed bg-surface/50">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <KeyRound />
          </EmptyMedia>
          <EmptyTitle>Role management coming soon</EmptyTitle>
          <EmptyDescription>
            Define custom roles and permission sets for your workspace. Share your reference UI when ready and
            we will wire this section to match.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </SettingsPanel>
  )
}

export { RolesSettings }
