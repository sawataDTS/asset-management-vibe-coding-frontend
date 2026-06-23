"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardActions, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { typeScale } from "@/lib/typography"

/** Shared control sizing for settings forms — input and select use global h-9. */
export const settingsControlClassName = "[&_[data-slot=select-trigger]]:w-full"

/** CardContent padding when a sibling `CardActions` row follows (no bottom inset on content). */
export const settingsCardContentWithActionsClassName = cn(
  "px-(--card-spacing) pt-(--card-spacing) pb-0",
  settingsControlClassName
)

export interface SettingsPanelProps {
  title: string
  description?: string
  actions?: React.ReactNode
  saveLabel?: string
  onSave?: () => void
  saving?: boolean
  children: React.ReactNode
  className?: string
  id?: string
  /** Wider panel for grids (e.g. appearance theme picker). Defaults to form width. */
  wide?: boolean
}

function SettingsPanel({
  title,
  description,
  actions,
  saveLabel = "Save changes",
  onSave,
  saving = false,
  children,
  className,
  id,
  wide = false,
}: SettingsPanelProps) {
  return (
    <Card
      id={id}
      className={cn(
        "scroll-mt-24 w-full gap-0 py-0",
        wide ? "max-w-6xl" : "max-w-4xl",
        className
      )}
    >
      <CardContent
        className={cn(
          "flex flex-col gap-5",
          onSave ? settingsCardContentWithActionsClassName : cn("p-(--card-spacing)", settingsControlClassName)
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className={typeScale.heading}>{title}</h2>
            {description ? (
              <p className={cn("mt-1.5", typeScale.body.muted)}>{description}</p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>

        {children}
      </CardContent>

      {onSave ? (
        <CardActions>
          <Button onClick={onSave} disabled={saving}>
            {saveLabel}
          </Button>
        </CardActions>
      ) : null}
    </Card>
  )
}

export { SettingsPanel }
