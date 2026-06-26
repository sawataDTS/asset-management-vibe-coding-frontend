# Design System

This document is the source of truth for UI in this workspace. Read it before
generating any UI. See [`AGENTS.md`](./AGENTS.md) for the enforced rules.

The stack is **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4**
with shadcn-style primitives in `src/components/ui/*`. All styling is driven by
**semantic design tokens** so the app can re-theme at runtime.

---

## 1. Theme token architecture

Colors are **never** hardcoded. They are defined as CSS variables and consumed
through Tailwind utilities generated from `@theme inline` in
`src/app/globals.css`.

### How it works

1. Each workspace theme sets a small set of **source tokens** on a
   `[data-theme="…"]` selector (the attribute lives on `<html>` and is managed by
   `next-themes` via `src/components/providers/ThemeProvider.tsx`).
2. A single theme-agnostic `:root` block **bridges** those source tokens to the
   full shadcn token contract (`--card`, `--muted`, `--accent`, `--sidebar`, …).
3. `@theme inline` exposes the tokens as utilities (`bg-surface`,
   `bg-sidebar-active`, `text-foreground`, `border-border`, …).

Because components only read tokens, switching `data-theme` instantly re-themes
the entire app with no re-mount.

### Source tokens (define these per theme)

| Token                  | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `--background`         | App canvas / outermost background        |
| `--surface`            | Recessed panels, muted areas, inputs     |
| `--surface-elevated`   | Cards, popovers, raised surfaces         |
| `--border`             | All borders, dividers, input outlines    |
| `--text-primary`       | Primary text (bridges to `--foreground`) |
| `--text-secondary`     | Secondary / muted text                   |
| `--primary`            | Brand / accent / active color            |
| `--primary-foreground` | Text/icon on top of `--primary`          |
| `--sidebar-bg`         | Sidebar background                       |
| `--sidebar-active`     | Active nav item background               |
| `--sidebar-hover`      | Hovered nav item background              |
| `--gradient-brand`     | Brand gradient (logo, swatches)          |

### Utilities you should use

`bg-background`, `bg-surface`, `bg-surface-elevated`, `bg-card`, `bg-popover`,
`bg-muted`, `bg-accent`, `bg-primary`, `bg-sidebar`, `bg-sidebar-active`,
`bg-sidebar-hover`, `bg-gradient-brand`, `text-foreground`,
`text-muted-foreground`, `text-primary`, `border-border`, `border-sidebar-border`,
`border-navbar-border`, `ring-ring`, `shadow-xs|sm|md|lg|xl`, `rounded-md|lg|xl`,
`font-sans|display|heading|mono`.

For **raised outer edges** (cards, table shells, tab pills), prefer the shared
helpers in [`src/lib/surface.ts`](src/lib/surface.ts) — see §9.

### Typography faces

| Utility        | Token            | Use for                                         |
| -------------- | ---------------- | ----------------------------------------------- |
| `font-sans`    | `--font-sans`    | Body copy, labels, controls — the default face. |
| `font-display` | `--font-display` | Brand wordmark + page/navbar titles (premium).  |
| `font-mono`    | `--font-mono`    | Code, IDs, tabular/technical values.            |

`font-display` is a modern SaaS display face (Plus Jakarta Sans) wired through
`next/font` to `--font-display`. It is reserved for high-level identity and
title hierarchy (the sidebar brand wordmark, the navbar page title, and the
`PageHeader` page title) so those read as more premium than the surrounding
`font-sans` UI. Navbar titles use `leading-snug` (not `leading-none`) so
descenders on letters like g and y are never clipped in the fixed `h-16` bar.

### Typography hierarchy (5-level scale)

All text falls into one of five levels. Do not invent ad-hoc sizes or weights per
page — import the matching tier from `src/lib/typography.ts` (`typeScale`) or use
the component that already encodes it (`PageHeader`, `SectionHeading`, `CardTitle`,
`CardContainer`, `MetricCard`, `ChartCard`, `DataTable`, `ReportListCard`).

**Weight conventions:** `font-bold` on display page title + brand only;
`font-semibold` on structural headings (L2–L3) and caption overlines (L5);
`font-medium` on body emphasis (active nav, names, labels); `font-normal` on
default body copy.

| Level | Name    | Classes (via `typeScale`)                     | Used by                                                          |
| ----- | ------- | --------------------------------------------- | ---------------------------------------------------------------- |
| L1    | Display | `display.page` / `.brand` / `.nav`            | `PageHeader` h1, `SidebarBrand`, `Navbar` title                  |
| L2    | Heading | `heading`                                     | `SectionHeading` h2; `SettingsPanel` title (via `CardContainer`) |
| L3    | Title   | `title` / `titleMetric`                       | `CardTitle`, `ChartCard` title; `MetricCard` KPI value           |
| L4    | Body    | `body.default` / `.muted` / `.emphasis`       | Descriptions, nav items, table cells, form labels                |
| L5    | Caption | `caption.overline` / `.meta` / `.tableHeader` | Section labels, KPI labels, eyebrows, emails, table headers      |

Face rules: `font-display` is title-only (page, navbar, brand); structural titles
use `font-heading`; everything else is `font-sans`. All secondary copy is
`text-muted-foreground`; never hardcode a grey. Longform copy gets
`leading-relaxed`. Numbers/IDs get `tabular-nums`.

### Available themes

The default theme is **`carbon-enterprise`**. All workspace themes (20 light, 5
dark) are defined in `src/lib/themes.ts` as `WORKSPACE_THEMES`, with helpers
`LIGHT_THEMES`, `DARK_THEMES`, and `DEFAULT_THEME`. Do not hardcode a partial
theme list in pages or components; read from that module when you need theme
metadata.

Beyond the surface/text/primary/sidebar source tokens, the `:root` bridge also
exposes status tokens (`--success`, `--warning`, `--info`, `--danger`/
`--destructive`), navbar tokens (`--navbar`, `--navbar-border`), and a
primary-derived `--chart-1..5` ramp — all consumable as utilities
(`bg-success`, `text-warning`, `bg-navbar`, …). Dark themes override the status
palette for contrast.

### Adding a theme

1. Add a `[data-theme="my-theme"] { … }` block with the source tokens in
   `src/app/globals.css`.
2. Add an entry to `WORKSPACE_THEMES` in `src/lib/themes.ts`.

No component changes are required.

---

## 2. Layout system

The application shell is composed of three regions:

```
DashboardLayout
├── Sidebar      (sticky, left, full viewport height)
├── Navbar       (sticky, top of the content column)
└── main         (page content; scrolls with the page)
    └── ContentWrapper (centers + max-width)
        └── PageHeader (owns page padding + spacing; wraps the page)
            ├── header row (title / description / actions)
            └── page content (children)
```

- `src/components/layout/DashboardLayout.tsx` — the shell. Applied once via the
  route-group layout `src/app/(dashboard)/layout.tsx`, so every dashboard page
  inherits it automatically.
- The outer container is `min-h-svh` (no `overflow-hidden`), so the page uses the
  default browser (body) scroll. The sidebar is `sticky top-0 h-svh` and the
  navbar is `sticky top-0`, so both stay pinned while the body scrolls.

### Reusable layout components

| Component        | Responsibility                         |
| ---------------- | -------------------------------------- |
| `Sidebar`        | Fixed sidebar container                |
| `SidebarBrand`   | Prominent product wordmark (text only) |
| `SidebarSection` | Labeled group of nav items             |
| `SidebarItem`    | A single nav link (active/hover/badge) |
| `SidebarFooter`  | Bottom region (settings, profile)      |
| `SidebarProfile` | User profile + sign-out menu           |
| `SidebarNav`     | Pre-composed nav from `nav-config`     |
| `Navbar`         | Sticky top bar (title + account menu)  |
| `UserMenu`       | Avatar-triggered profile dropdown      |
| `ContentWrapper` | Centers content + caps max width       |
| `PageHeader`     | Page wrapper: title/actions + content  |
| `SectionHeading` | Uniform in-page section title + desc   |
| `ThemeSwitcher`  | Runtime theme picker                   |

Navigation is data-driven from `src/components/layout/nav-config.ts`.

---

## 3. Sidebar specifications

- **Width:** `w-60` (15rem). Fixed; full viewport height.
- **Surface:** `bg-sidebar`, right border `border-sidebar-border`, plus `shadow-xs` for soft depth alongside the divider.
- **Structure:** brand (`h-16`) → scrollable nav → footer (settings + profile).
- **Brand (`SidebarBrand`):** a single, prominent text wordmark — no icon mark.
  Use `typeScale.display.brand` (`font-display text-2xl font-extrabold
  tracking-tight`): **Asset** in `text-foreground`, **360Hub** in
  `text-primary` (theme brand hue). Brand height
  (`h-16`) matches the navbar so the divider lines align across the two columns.
  Render the wordmark once in the sidebar only; do not duplicate the brand
  elsewhere.
- **Sections:** `typeScale.caption.overline` label (`text-xs font-semibold
tracking-wide uppercase text-muted-foreground`).
- **Item — default:** `font-normal text-muted-foreground`, icon muted, `h-9`,
  `rounded-lg`, `gap-3`. No background pill.
- **Item — hover:** `bg-sidebar-hover`, `text-foreground` (same `font-normal` —
  no weight or size change), icon promoted to `text-foreground`.
  `transition-colors`.
- **Item — active:** `bg-sidebar-active`, `font-medium text-primary`, icon
  `text-primary`, `border-sidebar-border`, optional `shadow-xs`. Active is
  resolved from `usePathname()`.
- **Badges:** use the `Badge` primitive (`variant="secondary"`) for tags like
  `Beta`.
- **Mobile:** below `md`, the sidebar is hidden and opens in a `Sheet`
  (left side) triggered from the navbar.

---

## 4. Navbar specifications

- **Height:** `h-16`. Sticky (`sticky top-0 z-30`).
- **Background:** `bg-navbar/90` with `backdrop-blur-md` (degrades to
  `supports-backdrop-filter:bg-navbar/70`). Adapts per theme, dark mode included.
- **Border:** `border-b border-navbar-border`, plus `shadow-xs` for soft depth below the bar.
- **Title:** the dominant element — `typeScale.display.nav` (`font-display text-lg
sm:text-xl font-semibold tracking-tight text-foreground`), derived from the nav
  config via `getPageTitle`. Uses the same display face as the brand for a
  consistent, premium hierarchy.
- **Content:** title (left), actions + account avatar (right). On mobile it also
  renders the sidebar menu trigger.
- **Account avatar:** opens the `UserMenu` profile dropdown.
- Stays fixed while the content area scrolls.

---

## 5. Page header specifications

`PageHeader` is the **page wrapper** — it renders the title row _and_ wraps the
page content as `children`. It owns the page padding (`p-4 sm:p-6 lg:p-8`) and
the vertical rhythm between blocks (`space-y-6`). Pages must NOT add their own
outer padding or `gap`/`space-y`/`flex flex-col` wrappers — just pass sections as
children.

```tsx
<PageHeader
  icon={Inbox}
  eyebrow="Welcome back, John Doe"
  title="Intake"
  description="Manage hardware inventory and software licenses in one place."
  actions={<Button>New Intake</Button>}
>
  <CardContainer>…</CardContainer>
  <section>…</section>
</PageHeader>
```

| Prop              | Type               | Notes                                |
| ----------------- | ------------------ | ------------------------------------ |
| `title`           | `string`           | Required.                            |
| `description`     | `string?`          | Secondary copy.                      |
| `eyebrow`         | `React.ReactNode?` | Small label above the title.         |
| `icon`            | `LucideIcon?`      | Rendered in a tokenized badge.       |
| `actions`         | `React.ReactNode?` | Right-aligned buttons.               |
| `children`        | `React.ReactNode?` | Page content, spaced by `space-y-6`. |
| `headerClassName` | `string?`          | Overrides the title/actions row.     |

The title row collapses from a row to a stacked column below `sm`.

**Buttons use the default `size` everywhere.** Do not pass `size="sm"` to page
header actions, toolbar actions, or in-card actions — the default button size is
the workspace standard so controls stay visually consistent across pages. Reserve
the smaller sizes for genuinely dense, specialized UIs only.

### Section headings (`SectionHeading`)

Within a page, group related cards under a `SectionHeading` — never a bare label.
It encodes the section tier of the typography hierarchy (a `font-heading`
`text-lg` `h2` + a muted description + optional right-aligned `actions`) so every
section reads identically across the app. Every section that contains more than
one card should have a title **and** a one-line description.

```tsx
<SectionHeading
  title="Asset Health"
  description="Real-time posture across hardware, software, and mailbox domains."
  actions={<Button>Manage Assets</Button>}
/>
```

---

## 6. Scroll behavior rules

- Use default browser (body) scrolling.
- Shell uses min-h-svh.
- Sidebar remains sticky (top-0 h-svh).
- Navbar remains sticky (top-0).
- Do not add page-level h-screen or min-h-screen wrappers.
- Pages should not manage their own scrolling.

### Custom scrollbars

Use the shared custom-scrollbar utility for internal scrollable regions.

---

## 7. Responsive rules

- Use a mobile-first approach.
- `md` (768px) is the primary mobile/desktop breakpoint.
- Below `md`, the sidebar collapses into a `Sheet`.
- At `md` and above, use the persistent sidebar layout.
- Prefer responsive grids such as:
  - `grid-cols-1 sm:grid-cols-2`
  - `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`

---

## 8. Tab navigation (`TabNav`)

`src/components/ui/tab-nav.tsx` is the **canonical, data-driven tab switcher**.
Use it for every page-level / section-level set of tabs (Overview asset health,
Settings sections, …) so tabs look identical across the app. Never hand-roll a
segmented control or re-style `TabsList`/`TabsTrigger` per page.

- Render it inside a `<Tabs>` root and pair it with `<TabsContent>` panels.
- Items are declarative: `{ value, label, icon?, badge?, disabled? }`.
- `variant="default"` → segmented pill control (the standard). `variant="line"`
  → underlined tabs (use for many sibling sections, e.g. Settings).
- `size="lg"` (default) gives the comfortable page-level height; pass
  `size="default"` for compact inline tabs.

**Elevation (must match §9):** the default variant uses a recessed `bg-muted`
track; the **active pill** lifts with `bg-card`, `border-sidebar-border`, and
`shadow-xs` — same outer edge as cards. `SubTabNav` (report sub-views) uses
standalone pills with the same border token on inactive items. Never swap in
`border-border`, `ring-1`, or heavier shadows on tab shells.

```tsx
<Tabs defaultValue="hardware">
  <TabNav
    items={[
      { value: "hardware", label: "Hardware", icon: HardDrive, badge: "51" },
      { value: "software", label: "Software", icon: AppWindow, badge: "71" },
    ]}
  />
  <TabsContent value="hardware">…</TabsContent>
  <TabsContent value="software">…</TabsContent>
</Tabs>
```

---

## 9. Borders, shadows & surface elevation

Use consistent surface styling across the application.

### Surface layers

| Layer             | Border                                           | Shadow      | Examples                     |
| ----------------- | ------------------------------------------------ | ----------- | ---------------------------- |
| Shell chrome      | `border-sidebar-border` / `border-navbar-border` | `shadow-xs` | Sidebar, Navbar              |
| Raised content    | `border-sidebar-border`                          | `shadow-xs` | Cards, Tables, Active Tabs   |
| Floating overlays | `border-sidebar-border`                          | `shadow-sm` | Dialogs, Popovers, Dropdowns |

### Border rules

| Utility                 | Use                                                  |
| ----------------------- | ---------------------------------------------------- |
| `border-sidebar-border` | Outer edge of cards, tables, tabs, dialogs, popovers |
| `border-navbar-border`  | Navbar bottom border                                 |
| `border-border`         | Internal dividers only                               |

Do not use `border-border` for card or panel outer edges.

### Shadow rules

| Utility      | Use                                  |
| ------------ | ------------------------------------ |
| `shadow-xs`  | Cards, tables, tabs, sidebar, navbar |
| `shadow-sm`  | Dialogs, popovers, dropdowns         |
| `shadow-md+` | Avoid unless specifically required   |

### Shared helpers

```ts
shellBorderClassName
surfaceOutlineClassName
surfaceOverlayClassName
```

### Standard patterns

```tsx
<Card>
  ...
</Card>
```

```tsx
<div className={cn("rounded-xl bg-card", surfaceOutlineClassName)}>
  ...
</div>
```

### Rules

- Use `surfaceOutlineClassName` for custom raised panels.
- Use `surfaceOverlayClassName` for dialogs and overlays.
- Use `border-border` only for internal dividers.
- Match active tab elevation with card elevation.
- Do not use `ring-*` as a card border.
- Do not use heavy shadows on dashboard surfaces.

---

## 10. Cards & panels

Use the appropriate primitive instead of creating custom card layouts.

### Component selection

| Need                   | Component                      | Import path |
| ---------------------- | ------------------------------ | ----------- |
| KPI / metric           | `MetricCard`                   | `@/components/ui/metric-card` |
| Chart                  | `ChartCard`                    | `@/components/ui/chart-card` |
| Standard panel         | `CardContainer`                | `@/components/ui/card-container` |
| Form panel             | `CardContainer variant="form"` | `@/components/ui/card-container` |
| Dialog / modal         | `ModalContainer`               | `@/components/ui/modal-container` |
| Data table             | `DataTable`                    | `@/components/custom/DataTable` |
| Report list            | `ReportListCard`               | `@/app/(dashboard)/reports/_components/shared/report-list-card` (reports only) |
| Decorated hero section | Raw `Card`                     | `@/components/ui/card` |

### Rules

- Use `CardContainer` for most dashboard panels.
- Use `ModalContainer` for dialogs.
- Use `MetricCard` for KPI tiles only.
- Use `ChartCard` for chart visualizations.
- Use `DataTable` for sortable tabular data.
- Use `ReportListCard` for report result lists.
- Do not hand-roll `CardHeader`, `CardContent`, and `CardTitle` for new pages.
- Do not replace specialized components with generic cards.

### CardContainer

Standard dashboard wrapper.

Common use cases:

- Lists
- Forms
- Settings panels
- Filter sections
- Read-only content panels

Common props:

```tsx
<CardContainer
  title=""
  description=""
  action={}
>
  ...
</CardContainer>
```

### ModalContainer

Use for all dashboard dialogs.

Features:

- Title
- Description
- Scrollable body
- Footer actions
- Form support

### Dialog mounting

Render dialogs only when needed.

```tsx
{addRequestOpen &&
  <AddRequestDialog
    open={addRequestOpen}
    onOpenChange={setAddRequestOpen}
  />
}

{reviewOpen && selectedItem &&
  <ReviewDialog
    open={reviewOpen}
    onOpenChange={setReviewOpen}
    item={selectedItem}
  />
}
```

### Tabs as filters

For view filters such as Pending / All:

- Use `TabNav`
- Use `badge` for counts
- Do not create custom segmented controls

### Card actions

- Use `CardActions` for footer actions.
- Use default button size.
- Keep actions aligned right.
- Do not use `DialogFooter` for primary form actions.

### Raw Card exceptions

Allowed only for:

- Executive dashboard hero sections
- Decorated summary panels
- Authentication layouts
- Existing specialized report components

---

## 11. Reusable component rules

- Prefer primitives in `src/components/ui/*`; never duplicate them. Shared
  non-ui building blocks live in `src/components/custom/*` (e.g. `DataTable`,
  `CustomSelect`).
- **Cards:** follow §10 — `CardContainer` for panels, `ModalContainer` for dialogs,
  `MetricCard` / `ChartCard` for ui primitives; `DataTable` and `ReportListCard`
  for their specialized shapes (see §10 import paths); do not fork
  `Card` + `CardTitle` + `CardContent` per page.
- Do not use `PageLayout` (`src/components/layout/PageLayout.tsx`); it is a
  legacy stub. Use `PageHeader` for all dashboard pages.
- Global layout (`Sidebar`, `Navbar`, `DashboardLayout`) is shared — extend, do
  not fork per page.
- Keep Server Components the default; add `"use client"` only where interactivity
  (state, effects, browser APIs, context) is required. Layout/sidebar/navbar are
  client because they use `usePathname`/state; pages stay server when possible.
- New shared building blocks belong in `src/components/layout` (shell-level) or
  `src/components/ui` (primitives) — not inline in pages.

### `CustomSelect` (dropdown + searchable list)

Use **`CustomSelect`** (`src/components/custom/CustomSelect.tsx`) for every
form select — intake, settings, organization, lifecycle templates, etc. Do not
fork a one-off popover + list per page.

| Prop           | Purpose                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| `searchable`   | Shows filter input above options (`CommandInput`)                        |
| `formControls` | (via parent) full-width trigger — pair with `CardContainer formControls` |
| `isMultiple`   | Multi-select with count label                                            |
| `showClear`    | Clear affordance on trigger (default `true`)                             |

---
