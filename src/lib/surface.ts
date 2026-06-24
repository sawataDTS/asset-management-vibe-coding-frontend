/** Shell-aligned border color — same token as sidebar/navbar dividers (`--sidebar-border` → `--border`). */
export const shellBorderClassName = "border-sidebar-border"

/** Internal divider color — rows, header strips, section splits inside a surface (DESIGN.md §9). */
export const surfaceDividerClassName = "border-border"

/** Horizontal internal divider — top edge. */
export const surfaceDividerTopClassName = "border-t border-border"

/** Horizontal internal divider — bottom edge (e.g. dialog header strip). */
export const surfaceDividerBottomClassName = "border-b border-border"

/** Minimal raised surface: shell border + soft shadow (matches sidebar/navbar chrome). */
export const surfaceOutlineClassName = `border ${shellBorderClassName} shadow-xs`

/** Modals / overlays — same border, slightly stronger lift. */
export const surfaceOverlayClassName = `border ${shellBorderClassName} shadow-sm`
