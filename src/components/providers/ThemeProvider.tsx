"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

import { DEFAULT_THEME, WORKSPACE_THEME_IDS } from "@/lib/themes"

/**
 * Global workspace theme provider.
 *
 * Themes are applied via the `data-theme` attribute on <html>. Each theme only
 * swaps CSS variables, so every component that consumes design tokens adapts at
 * runtime with no re-mount required.
 *
 * localStorage persistence is disabled for now — uncomment `storageKey` below
 * when ready to remember the user's theme across reloads.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={DEFAULT_THEME}
      enableSystem={false}
      themes={WORKSPACE_THEME_IDS}
      // storageKey="asset360-workspace-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
