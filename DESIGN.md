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
`text-muted-foreground`, `text-primary`, `border-border`, `ring-ring`,
`shadow-xs|sm|md|lg|xl`, `rounded-md|lg|xl`, `font-sans|display|heading|mono`.

### Typography faces

| Utility        | Token            | Use for                                         |
| -------------- | ---------------- | ----------------------------------------------- |
| `font-sans`    | `--font-sans`    | Body copy, labels, controls — the default face. |
| `font-display` | `--font-display` | Brand wordmark + page/navbar titles (premium).  |
| `font-mono`    | `--font-mono`    | Code, IDs, tabular/technical values.            |

`font-display` is a distinctive geometric face (Space Grotesk) wired through
`next/font` to `--font-display`. It is reserved for high-level identity and
title hierarchy (the sidebar brand wordmark, the navbar page title, and the
`PageHeader` page title) so those read as more premium than the surrounding
`font-sans` UI. It is theme-agnostic — only the face changes, never the color
(titles use `text-foreground`).

### Typography hierarchy (5-level scale)

All text falls into one of five levels. Do not invent ad-hoc sizes or weights per
page — import the matching tier from `src/lib/typography.ts` (`typeScale`) or use
the component that already encodes it (`PageHeader`, `SectionHeading`, `CardTitle`,
`MetricCard`, `ChartCard`, `DataTable`, `SettingsPanel`).

**Weight conventions:** `font-bold` on display page title + brand only;
`font-semibold` on structural headings (L2–L3) and caption overlines (L5);
`font-medium` on body emphasis (active nav, names, labels); `font-normal` on
default body copy.

| Level | Name    | Classes (via `typeScale`) | Used by |
| ----- | ------- | ------------------------- | ------- |
| L1    | Display | `display.page` / `.brand` / `.nav` | `PageHeader` h1, `SidebarBrand`, `Navbar` title |
| L2    | Heading | `heading`                 | `SectionHeading` h2, `SettingsPanel` title |
| L3    | Title   | `title` / `titleMetric`   | `CardTitle`, `ChartCard` title; `MetricCard` KPI value |
| L4    | Body    | `body.default` / `.muted` / `.emphasis` | Descriptions, nav items, table cells, form labels |
| L5    | Caption | `caption.overline` / `.meta` / `.tableHeader` | Section labels, KPI labels, eyebrows, emails, table headers |

Face rules: `font-display` is title-only (page, navbar, brand); structural titles
use `font-heading`; everything else is `font-sans`. All secondary copy is
`text-muted-foreground`; never hardcode a grey. Longform copy gets
`leading-relaxed`. Numbers/IDs get `tabular-nums`.

### Available themes

Light (default + 6): `purple-workspace` (default), `arctic-light`, `ocean-cyan`,
`emerald-workspace`, `slate-enterprise`, `rose-quartz`, `amber-executive`.
Dark (3): `midnight-dark`, `graphite-dark`, `neon-cyber`. Metadata (incl. each
theme's `mode`) lives in `src/lib/themes.ts`.

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
| `SidebarBrand`   | Prominent product wordmark + mark      |
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
- **Surface:** `bg-sidebar`, right border `border-sidebar-border`.
- **Structure:** brand (`h-16`) → scrollable nav → footer (settings + profile).
- **Brand (`SidebarBrand`):** a single, prominent SaaS-style lockup — a
  `bg-gradient-brand` mark (`size-9`, `rounded-xl`) plus the product wordmark in
  `font-display text-2xl font-bold tracking-tight text-foreground`. The wordmark
  is the primary visual element; the brand color comes from the gradient mark
  (never hardcoded on the text). Brand height (`h-16`) matches the navbar so the
  divider lines align across the two columns. Do not re-introduce a split /
  two-tone text treatment.
- **Sections:** `typeScale.caption.overline` label (`text-xs font-semibold
  tracking-wide uppercase text-muted-foreground`).
- **Item — default:** `font-normal text-muted-foreground`, icon muted, `h-9`,
  `rounded-lg`, `gap-3`. No background pill.
- **Item — hover:** `bg-sidebar-hover`, `text-foreground` (same `font-normal` —
  no weight or size change), icon promoted to `text-foreground`.
  `transition-colors`.
- **Item — active:** `bg-sidebar-active`, `font-medium text-foreground`, icon
  `text-foreground`. Slight weight emphasis on active only — not on hover. No
  border, shadow, or `text-primary`. Active is resolved from `usePathname()`.
- **Badges:** use the `Badge` primitive (`variant="secondary"`) for tags like
  `Beta`.
- **Mobile:** below `md`, the sidebar is hidden and opens in a `Sheet`
  (left side) triggered from the navbar.

---

## 4. Navbar specifications

- **Height:** `h-16`. Sticky (`sticky top-0 z-30`).
- **Background:** `bg-navbar/90` with `backdrop-blur-md` (degrades to
  `supports-backdrop-filter:bg-navbar/70`). Adapts per theme, dark mode included.
- **Border:** `border-b border-navbar-border`.
- **Title:** the dominant element — `typeScale.display.nav` (`font-display text-lg
  sm:text-xl font-semibold tracking-tight text-foreground`), derived from the nav
  config via `getPageTitle`. Uses the same display face as the brand for a
  consistent, premium hierarchy.
- **Content:** title (left), actions + account avatar (right). On mobile it also
  renders the sidebar menu trigger.
- **Account avatar:** opens the `UserMenu` profile dropdown (see §11).
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
  <Card>…</Card>
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

- The page uses the **default browser (body) scroll**. The shell uses `min-h-svh`
  (no `overflow-hidden`); the sidebar (`sticky top-0 h-svh`) and navbar
  (`sticky top-0`) are pinned while the body scrolls.
- The sidebar nav has its own internal `overflow-y-auto` for long nav lists.
- Do not add page-level `min-h-screen`/`h-screen` wrappers — the shell owns
  height. Pages render plain content.

---

## 7. Responsive rules

- **Breakpoints:** Tailwind defaults. `md` (768px) is the desktop/mobile divide
  for the shell.
- `< md`: sidebar collapses into a `Sheet`; navbar shows the menu trigger.
- `>= md`: persistent sidebar; menu trigger hidden.
- Content max width: `1400px`, centered (via `ContentWrapper`). Page padding
  (`p-4 sm:p-6 lg:p-8`) and inter-block spacing (`space-y-6`) are owned by
  `PageHeader`.
- Grids should be mobile-first: e.g. `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`.

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

## 9. Card padding

`Card` owns its internal padding via the `--card-spacing` token (default
`--spacing(5)` ≈ 20px; `size="sm"` ≈ 16px). Header / content / footer all read
this token, so spacing stays uniform. Do not add ad-hoc `p-*` overrides to align
cards — adjust `size` or compose with the token instead.

### Card actions (primary pattern)

Use `CardActions` for every form / panel / dialog footer that lives on a
card surface. Actions belong **on the card**, not on `DialogFooter` (muted
strip) or floating outside the card.

- `CardActions` is a sibling of `CardContent` inside `Card` (`gap-0 py-0` on
  the card shell).
- Divider: `border-t border-border` only — **no** `bg-muted/50` footer band
  (that is reserved for read-only `CardFooter` chrome).
- Layout: `flex justify-end gap-2` with `p-(--card-spacing)`.
- Long card bodies scroll in `CardContent`; actions stay pinned below the
  scroll region via `CardActions`.

```tsx
<Card className="gap-0 py-0">
  <CardContent className="max-h-[min(52vh,22rem)] overflow-y-auto p-(--card-spacing)">
    …fields or lists…
  </CardContent>
  <CardActions>
    <Button variant="outline">Cancel</Button>
    <Button type="submit">Save</Button>
  </CardActions>
</Card>
```

**Dialogs:** use a single **`bg-card` dialog shell** — do not nest an inset
`Card` with margins inside `DialogContent` (`bg-popover`). Structure:

```tsx
<DialogContent className="flex max-h-[calc(100vh-2.5rem)] flex-col gap-0 overflow-hidden bg-card p-0 text-card-foreground [--dialog-chrome:10rem] sm:max-w-md">
  <DialogHeader className="shrink-0 border-b border-border px-4 py-4 pr-12">…</DialogHeader>
  <DialogBody className="min-h-0 overflow-y-auto max-h-[calc(100vh-2.5rem-var(--dialog-chrome))] px-4 py-4">
    …fields or lists…
  </DialogBody>
  <CardActions>…</CardActions>
</DialogContent>
```

Use **`max-h-[calc(100vh-2.5rem-var(--dialog-chrome))] overflow-y-auto`** on `DialogBody` so height
follows content until the shell cap; then the body scrolls. Do **not** set a fixed `h-[…]` on the shell —
only `max-h-[calc(100vh-2.5rem)]`.
`max-h` alone is not reliable inside flex dialogs. `CardActions` must include
`bg-card` (built into the primitive) so the action row matches the card surface.
Overlay: `bg-background/90` + `backdrop-blur-lg`.

**Do not** use `DialogFooter` for form submit rows when the content is already
card-based. `CardFooter` is for muted summary chrome only, not primary actions.

---

## 10. Reusable component rules

- Prefer primitives in `src/components/ui/*`; never duplicate them.
- Global layout (`Sidebar`, `Navbar`, `DashboardLayout`) is shared — extend, do
  not fork per page.
- Keep Server Components the default; add `"use client"` only where interactivity
  (state, effects, browser APIs, context) is required. Layout/sidebar/navbar are
  client because they use `usePathname`/state; pages stay server when possible.
- New shared building blocks belong in `src/components/layout` (shell-level) or
  `src/components/ui` (primitives) — not inline in pages.

---

## 11. Profile menu specifications

The navbar avatar opens `UserMenu` — the canonical account experience. It is
built on the shared `DropdownMenu` primitive, so it inherits open/close
animation, click-outside + `Escape` dismissal, roving keyboard focus, and theme
awareness with no extra work. Never hand-roll popover/outside-click logic.

Structure (token-driven, `w-72`):

- **Header:** organization name (`text-xs uppercase text-muted-foreground`) +
  a `Sign out` action (`text-primary`).
- **Identity:** `lg` avatar, full name (`text-sm font-semibold`), and email
  (`text-xs text-muted-foreground`).
- **Footer:** shortcut rows — `Settings` (`/settings`) and `Theme preferences`
  (`/settings#theme`).

Pass `user` (`{ name, email, avatarUrl?, organization? }`) and `onSignOut` down
from `DashboardLayout`. To add a shortcut, add another row in the footer group;
do not create a parallel menu.
