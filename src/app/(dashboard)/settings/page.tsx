import type { Metadata } from "next"

import { SettingsPage } from "./_components/settings-page"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your profile, organization, team access, and workspace appearance.",
}

export default function SettingsRoute() {
  return <SettingsPage />
}
