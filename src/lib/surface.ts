/** Shell-aligned border color — same token as sidebar/navbar dividers (`--sidebar-border` → `--border`). */
export const shellBorderClassName = "border-sidebar-border"

/** Minimal raised surface: shell border + soft shadow (matches sidebar/navbar chrome). */
export const surfaceOutlineClassName = `border ${shellBorderClassName} shadow-xs`

/** Modals / overlays — same border, slightly stronger lift. */
export const surfaceOverlayClassName = `border ${shellBorderClassName} shadow-sm`
