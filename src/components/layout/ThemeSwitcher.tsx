"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Check, Moon, Sun } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  DEFAULT_THEME,
  LIGHT_THEMES,
  DARK_THEMES,
  type WorkspaceTheme,
  type WorkspaceThemeId,
} from "@/lib/themes"

/**
 * Professional theme picker. Each card previews a theme using that theme's own
 * tokens (scoped via `data-theme`), so the swatches always reflect the real
 * palette. Selecting a card swaps the active workspace theme at runtime — the
 * whole app re-themes instantly with no re-mount required. Persistence is
 * disabled for now (see ThemeProvider).
 */
function ThemePreview() {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background p-2">
      <span className="size-6 rounded-md bg-gradient-brand shadow-sm" />
      <div className="flex flex-1 flex-col gap-1">
        <span className="h-1.5 w-3/4 rounded-full bg-primary" />
        <span className="h-1.5 w-1/2 rounded-full bg-muted-foreground/40" />
      </div>
      <span className="size-3 rounded-full bg-success" />
      <span className="size-3 rounded-full bg-warning" />
      <span className="size-3 rounded-full bg-destructive" />
    </div>
  )
}

function ThemeCard({
  theme,
  selected,
  onSelect,
}: {
  theme: WorkspaceTheme
  selected: boolean
  onSelect: (id: WorkspaceThemeId) => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(theme.id)}
      data-theme={theme.id}
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border bg-surface-elevated p-3 text-left text-foreground transition-all outline-none",
        "hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/50",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"
      )}
    >
      <ThemePreview />

      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold text-foreground">{theme.name}</span>
          <span className="line-clamp-1 text-xs text-muted-foreground">{theme.description}</span>
        </div>
        {selected ? (
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Check className="size-3" />
          </span>
        ) : null}
      </div>
    </button>
  )
}

function ThemeGroup({
  label,
  icon: Icon,
  themes,
  active,
  onSelect,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  themes: WorkspaceTheme[]
  active: WorkspaceThemeId
  onSelect: (id: WorkspaceThemeId) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <Icon className="size-3.5" />
        {label}
        <span className="font-normal normal-case">({themes.length})</span>
      </div>
      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        role="radiogroup"
        aria-label={`${label} themes`}
      >
        {themes.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} selected={active === theme.id} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const active = (mounted ? theme : DEFAULT_THEME) as WorkspaceThemeId

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <ThemeGroup label="Light" icon={Sun} themes={LIGHT_THEMES} active={active} onSelect={setTheme} />
      <ThemeGroup label="Dark" icon={Moon} themes={DARK_THEMES} active={active} onSelect={setTheme} />
    </div>
  )
}
