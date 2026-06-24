<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Engineering Rules

Read [`DESIGN.md`](./DESIGN.md) before generating any UI. The following rules are
mandatory and non-negotiable.

1. **Use `components/ui` first.** Always reach for an existing primitive in
   `src/components/ui/*` before building anything custom.
2. **Never re-create existing primitives.** Do not create a custom
   button / input / select / card / dialog (etc.) if an equivalent already
   exists in `src/components/ui`. Compose, don't duplicate.
3. **Never hardcode colors.** No hex values, no Tailwind palette colors
   (`blue-500`, `slate-900`, …), no inline `rgb()/hsl()`. Colors come from
   semantic tokens only.
4. **Never hardcode spacing, radius, shadows, or typography.** Use the Tailwind
   scale and design tokens (`--radius`, `--shadow-*`, `--spacing`, `font-*`).
5. **Always use design tokens / theme variables.** Style via semantic utilities
   (`bg-surface`, `bg-sidebar-active`, `text-foreground`, `text-muted-foreground`,
   `border-border`, `bg-primary`, …) so components re-theme automatically.
6. **Always use the reusable `PageHeader`** (`@/components/layout/PageHeader`) for
   page titles, descriptions, icons, and header actions.
7. **`Sidebar` and `Navbar` are global layout components.** Do not fork or
   re-implement them per page; extend the shared components.
8. **All pages live under `app/(dashboard)` and inherit `DashboardLayout`.** Do
   not wrap individual pages in their own shell.
9. **Theme-switcher compatibility is mandatory.** Every component must support all
   workspace themes at runtime. Never reference a specific theme's colors; only
   reference tokens. Test that a component looks correct after switching themes.
10. **Follow `DESIGN.md` before generating UI.** Layout, sidebar, navbar, header,
    token, scroll, card selection (§10), and responsive specifications are defined there.

## Card & panel primitives

See **`DESIGN.md` §10** for the full decision guide. In short:

- **`CardContainer`** — default panel (title + body + optional action/footer). Use
  `variant="form"` for forms with a save row.
- **`MetricCard`** — KPI stats only.
- **`ChartCard`** — chart panels only.
- **`DataTable`** — tabular data with columns.
- **`ReportListCard`** — report row lists (hardware / software / certifications reports).
- **`ModalContainer`** — standard dashboard modal (title, body, `CardActions` footer). See **`DESIGN.md` §10**.
- Do **not** hand-roll `Card` + `CardTitle` + `CardContent` on new pages.

## Modal performance

On pages with **multiple** modals (or modals that will fetch on mount), render each
dialog only when its `open` flag is true (and required props exist for review
flows). Do not mount all dialogs up front. Use `next/dynamic` only for unusually
heavy modal bundles. See **`DESIGN.md` §10** (`ModalContainer` → lazy mount).

## Branding & navigation standards

These keep the shell visually consistent across every page. Full specs live in
`DESIGN.md` (§3 Sidebar, §4 Navbar, §9 Borders & elevation, §12 Profile menu).

1. **One brand wordmark.** The product name renders once, in `SidebarBrand`, as a
   prominent text wordmark (`font-display`, large + bold): **Asset** +
   **360Hub** (`text-primary`). No gradient mark beside the wordmark; do not
   duplicate the brand elsewhere.
2. **`font-display` is reserved for identity + titles.** Use `font-display` only
   for the brand wordmark and navbar/page titles so they read as premium against
   the `font-sans` body. Do not apply it to body copy, labels, or controls.
3. **Brand hue on the wordmark suffix.** The **360Hub** segment uses `text-primary`
   so the active theme tint shows on the lockup. Navbar and page titles stay
   `text-foreground`.
4. **Navbar is sticky + blurred + token-driven.** Keep `h-16`, `sticky top-0`,
   `bg-navbar/90` + `backdrop-blur-md`, and `border-navbar-border`. The page
   title (from `getPageTitle`) is the dominant left element.
5. **Account avatar opens `UserMenu`.** The avatar in the navbar is the single
   entry point to the profile dropdown. Extend `UserMenu` (add a footer
   shortcut); never fork it or hand-roll popover/outside-click/escape logic —
   compose the shared `DropdownMenu` primitive.
6. **Account data flows from `DashboardLayout`.** Pass `user`
   (`{ name, email, avatarUrl?, organization? }`) and `onSignOut` through the
   layout. Do not read user/org data ad hoc inside pages.

## Theme tokens — quick reference

Source tokens (defined per theme in `src/app/globals.css`):
`--background`, `--surface`, `--surface-elevated`, `--border`,
`--text-primary`, `--text-secondary`, `--primary`, `--primary-foreground`,
`--sidebar-bg`, `--sidebar-active`, `--sidebar-hover`, `--gradient-brand`.

These bridge to the shadcn token contract (`--card`, `--muted`, `--foreground`,
`--accent`, `--sidebar`, …), so every `ui/*` component adapts with no extra work.
Add a new workspace theme by adding a `[data-theme="..."]` block in `globals.css`
and an entry in `src/lib/themes.ts`.
