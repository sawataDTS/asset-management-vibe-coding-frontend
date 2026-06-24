"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { CardContainer } from "@/components/ui/card-container"
import { cn } from "@/lib/utils"

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
    <CardContainer
      id={id}
      variant="form"
      title={title}
      description={description}
      action={actions}
      formControls
      contentClassName="flex flex-col gap-5"
      footer={
        onSave ? (
          <Button onClick={onSave} disabled={saving}>
            {saveLabel}
          </Button>
        ) : undefined
      }
      className={cn("w-full scroll-mt-24", wide ? "max-w-6xl" : "max-w-4xl", className)}
    >
      {children}
    </CardContainer>
  )
}

export { SettingsPanel }
