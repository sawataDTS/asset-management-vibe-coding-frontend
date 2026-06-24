"use client"

import * as React from "react"

import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { CardActions } from "@/components/ui/card"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  dialogFormClassName,
  dialogFormBodyClassName,
  dialogHeaderClassName,
  dialogShellClassName,
  dialogShellClassNameWide,
  dialogShellClassNameXl,
} from "@/lib/dialog-layout"
import { cn } from "@/lib/utils"

/** Preset modal widths — applied at `sm` and up. Override with `contentClassName` if needed. */
export type ModalContainerSize = "default" | "wide" | "xl"

const MODAL_SHELL_BY_SIZE: Record<ModalContainerSize, string> = {
  default: dialogShellClassName,
  wide: dialogShellClassNameWide,
  xl: dialogShellClassNameXl,
}

export interface ModalContainerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  /** Bottom action row — Cancel / Submit / Approve buttons (`CardActions`). */
  footer?: React.ReactNode
  /** Wraps body + footer in a `<form>` when provided. */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  /** Applies shared full-width control sizing (settings / intake forms). */
  formControls?: boolean
  /**
   * Modal width preset: `default` (`max-w-md`), `wide` (`max-w-2xl`), `xl` (`max-w-4xl`).
   * For a custom width, pass `contentClassName="sm:max-w-3xl"` (or any `max-w-*` utility).
   */
  size?: ModalContainerSize
  bodyClassName?: string
  footerClassName?: string
  /** Merged onto `DialogContent` — use for custom `sm:max-w-*` when presets are not enough. */
  contentClassName?: string
  children?: React.ReactNode
}

/**
 * Standard dashboard modal — same shell as Suppliers / Software dialogs:
 * `DialogHeader` + scrollable `DialogBody` + `CardActions` on a single `bg-card`
 * surface. See DESIGN.md §10.
 */
function ModalContainer({
  open,
  onOpenChange,
  title,
  description,
  footer,
  onSubmit,
  formControls = false,
  size = "default",
  bodyClassName,
  footerClassName,
  contentClassName,
  children,
}: ModalContainerProps) {
  const hasFooter = footer != null
  const shellClass = MODAL_SHELL_BY_SIZE[size]

  const body = (
    <>
      <DialogBody
        className={cn(dialogFormBodyClassName, formControls && settingsControlClassName, bodyClassName)}
      >
        {children}
      </DialogBody>
      {hasFooter ? <CardActions className={footerClassName}>{footer}</CardActions> : null}
    </>
  )

  const bodyShell = onSubmit ? (
    <form onSubmit={onSubmit} className={dialogFormClassName}>
      {body}
    </form>
  ) : (
    <div className={dialogFormClassName}>{body}</div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(shellClass, contentClassName)}>
        <DialogHeader className={dialogHeaderClassName}>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {bodyShell}
      </DialogContent>
    </Dialog>
  )
}

export { ModalContainer, MODAL_SHELL_BY_SIZE }
