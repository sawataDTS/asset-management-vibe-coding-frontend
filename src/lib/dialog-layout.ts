import { surfaceDividerBottomClassName } from "@/lib/surface"

/** Viewport inset — small gap top and bottom at max height. */
export const dialogMaxHeightClassName = "max-h-[calc(100vh-2.5rem)]"

/**
 * Scrollable dialog shell — grows with content, capped at nearly full viewport.
 * Set `--dialog-chrome` on the shell (header + actions estimate) for body scroll math.
 */
export const dialogShellClassName = cnDialogShell("sm:max-w-md")

export const dialogShellClassNameWide = cnDialogShell("sm:max-w-2xl")

/** Extra-wide panels — dense review tables or multi-column forms. */
export const dialogShellClassNameXl = cnDialogShell("sm:max-w-4xl")

/** Auto-height shell for short confirmations (delete, etc.). */
export const dialogShellClassNameCompact = cnDialogShell("sm:max-w-md")

/** Title strip — border separates header from scrollable body; keep title-only here. */
export const dialogHeaderClassName = `shrink-0 ${surfaceDividerBottomClassName} px-4 py-4 pr-12`

/** Drop bottom inset on scroll body when `CardActions` follows. */
export const dialogBodyBeforeActionsClassName = "pb-0"

/**
 * Scrolls when content exceeds available space. Height follows content up to the cap.
 * `--dialog-chrome` is set on the shell (≈ header + CardActions).
 */
export const dialogScrollBodyClassName =
  "custom-scrollbar min-h-0 overflow-y-auto max-h-[calc(100vh-2.5rem-var(--dialog-chrome))]"

/** Dialog body for form modals — scroll cap + optional full-width controls. */
export const dialogFormBodyClassName = dialogScrollBodyClassName

/** Form wrapper inside a dialog shell. */
export const dialogFormClassName = "flex min-h-0 w-full flex-col"

function cnDialogShell(widthClass: string) {
  return [
    "flex flex-col gap-0 overflow-hidden bg-card p-0 text-card-foreground",
    dialogMaxHeightClassName,
    "[--dialog-chrome:10rem]",
    "[--card-spacing:--spacing(5)]",
    widthClass,
  ].join(" ")
}
