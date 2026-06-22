"use client"

import * as React from "react"
import { Building2, KeyRound, Palette, Settings, User, Users } from "lucide-react"

import { PageHeader } from "@/components/layout/PageHeader"
import { AppearanceSettings } from "./appearance-settings"
import { OrganizationSettings } from "./organization-settings"
import { ProfileSettings } from "./profile-settings"
import { RolesSettings } from "./roles-settings"
import { TeamSettings } from "./team-settings"
import { TabNav, type TabNavItem } from "@/components/ui/tab-nav"
import { Tabs, TabsContent } from "@/components/ui/tabs"

const SETTINGS_TABS: TabNavItem[] = [
  { value: "profile", label: "Profile", icon: User },
  { value: "organization", label: "Organization", icon: Building2 },
  { value: "team", label: "Team", icon: Users },
  { value: "roles", label: "Roles", icon: KeyRound },
  { value: "appearance", label: "Appearance", icon: Palette },
]

const SETTINGS_PANELS = {
  profile: ProfileSettings,
  organization: OrganizationSettings,
  team: TeamSettings,
  roles: RolesSettings,
  appearance: AppearanceSettings,
} as const

const TAB_VALUES = new Set(SETTINGS_TABS.map((tab) => tab.value))

function hashToTab(hash: string): string {
  const value = hash.replace(/^#/, "")
  if (value === "theme") return "appearance"
  if (TAB_VALUES.has(value)) return value
  return "profile"
}

function tabToHash(tab: string): string {
  return tab === "appearance" ? "#theme" : `#${tab}`
}

function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("profile")

  React.useEffect(() => {
    setActiveTab(hashToTab(window.location.hash))

    function onHashChange() {
      setActiveTab(hashToTab(window.location.hash))
    }

    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  function handleTabChange(value: string) {
    setActiveTab(value)
    const nextHash = tabToHash(value)
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash)
    }
  }

  return (
    <PageHeader
      className="w-full max-w-4xl"
      eyebrow="Workspace configuration"
      title="Settings"
      description="Manage your profile, organization, team access, and workspace appearance."
    >
      <Tabs value={activeTab} onValueChange={handleTabChange} className="gap-4">
        <TabNav items={SETTINGS_TABS} />

        {SETTINGS_TABS.map((tab) => {
          const Panel = SETTINGS_PANELS[tab.value as keyof typeof SETTINGS_PANELS]
          return (
            <TabsContent key={tab.value} value={tab.value}>
              <Panel />
            </TabsContent>
          )
        })}
      </Tabs>
    </PageHeader>
  )
}

export { SettingsPage }
