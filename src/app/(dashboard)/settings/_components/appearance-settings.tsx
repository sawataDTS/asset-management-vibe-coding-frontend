"use client"

import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher"
import { SettingsPanel } from "./settings-panel"

function AppearanceSettings() {
  return (
    <SettingsPanel
      id="theme"
      wide
      title="Appearance"
      description="Pick a palette for the workspace. Your selection is saved to this browser and applied instantly across the entire app."
    >
      <ThemeSwitcher />
    </SettingsPanel>
  )
}

export { AppearanceSettings }
