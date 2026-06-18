# AssetOps UI Design System

**Read this before building or modifying any dashboard page.**

The **Overview page** (`app/dashboard/page.tsx`) is the canonical reference for layout, typography, spacing, and component usage. All new pages and refactors must match its visual language.

Hardware and Software pages were built by other tools and **do not** follow this system. Do not copy their KPI cards, headings, or badge patterns.

---

## 1. Design principles

| Principle                   | What it means                                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Calm enterprise**         | Light surfaces, soft borders, restrained color. No heavy shadows or loud gradients.                              |
| **Composable sections**     | Each screen is stacked `<section>` blocks with consistent vertical rhythm.                                       |
| **Shared components first** | Use `components/dashboard/*` before inventing one-off markup.                                                    |
| **Semantic tokens**         | Prefer `text-muted-foreground`, `border-border`, `bg-muted/40` over raw hex (except the hero tint below).        |
| **Information hierarchy**   | Page title lives in `DashboardShell`. Section titles use `SectionHeader`. Card titles are `text-sm font-medium`. |

---

## 2. Design tokens

Defined in `app/globals.css`. Use Tailwind semantic classes — do not hardcode colors unless listed here.

### Colors

| Token                | Light value | Usage                      |
| -------------------- | ----------- | -------------------------- |
| `--background`       | `#F8FAFC`   | App background             |
| `--foreground`       | `#0F172A`   | Primary text               |
| `--muted-foreground` | `#64748B`   | Secondary text, labels     |
| `--primary`          | `#4F46E5`   | Primary actions, charts    |
| `--border`           | `#E2E8F0`   | Borders, rings             |
| Hero panel tint      | `#F0F9FF`   | Overview hero section only |

### Icon accent colors (KPI / metric cards)

Rotate through these — one per card in a row:

```
text-blue-600    text-violet-600    text-emerald-600    text-amber-600
```

Icon containers: `rounded-xl bg-muted/60 ring-1 ring-border/60` (via `KpiCard`) or `rounded-xl bg-background/80 ring-1 ring-border/60` (via `MetricCard` inside hero).

### Typography

| Element                     | Classes                                                      |
| --------------------------- | ------------------------------------------------------------ |
| Hero headline               | `text-4xl font-semibold tracking-tight sm:text-5xl`          |
| Section title               | `text-base font-medium tracking-tight` (via `SectionHeader`) |
| Card / chart title          | `text-sm font-medium tracking-tight`                         |
| Body / description          | `text-sm leading-relaxed text-muted-foreground`              |
| KPI value                   | `text-2xl font-semibold tracking-tight`                      |
| Table primary cell          | `font-medium text-foreground` (no custom `text-[13.5px]`)    |
| Monospace data (IDs, dates) | `font-mono text-sm tabular-nums`                             |
| Sidebar nav link            | `text-sm`, `min-h-10`, `px-4 py-2.5`, `gap-3`, `rounded-lg`  |
| Sidebar user name / role    | `text-sm` — name `font-medium`, role `text-muted-foreground` |
| Sidebar group label         | `text-xs font-medium uppercase tracking-wider text-muted-foreground/80` |

**Do not use:** `font-bold` for KPI values, `uppercase tracking-wider` for labels, or arbitrary pixel font sizes like `text-[11.5px]`.

### Spacing & layout

| Pattern             | Classes                                                                               |
| ------------------- | ------------------------------------------------------------------------------------- |
| Section gap (major) | `mt-10` between top-level sections; `mt-6` between related subsections                |
| Grid gap            | `gap-3` or `gap-4`                                                                    |
| Card padding        | `p-5` or `p-6` on `DashboardCard`                                                     |
| Hero padding        | `p-6 sm:p-8`                                                                          |
| Border radius       | `rounded-xl` for cards; `rounded-2xl` for hero panels and nested callouts             |
| Card shadow         | `shadow-[0_1px_0_rgba(15,23,42,0.04)]` on hero only; `DashboardCard` handles the rest |

### Sidebar

- Background: `#F8FAFC` (`bg-[#F8FAFC]` in `app-sidebar.tsx`)
- Nav links: `text-sm`, `min-h-10`, `px-4 py-2.5`, `gap-3`, `rounded-lg`
- Hover / active: neutral `bg-secondary` — not primary tint; active uses `font-medium` + `text-foreground`
- Section label: `text-xs uppercase tracking-wider text-muted-foreground/80`
- Icons: thin stroke (`strokeWidth={1.75}`), `size-4`, muted until hover/active
- User footer: `text-sm` for name and role
- Do not change sidebar structure when building feature pages

---

## 3. Component catalog

Import from `@/components/dashboard/*` unless noted.

### Shell

```tsx
<DashboardShell title="Page Title">
  {/* page content */}
</DashboardShell>
```

- `title` appears in the top header bar — keep it short (e.g. `"Overview"`, `"Hardware"`, `"Intake"`).
- Do not duplicate the shell title as an `<h1>` inside the page body.

### `DashboardCard`

Base surface for all cards. Always wrap content in this — never use raw `Card` or custom bordered `div`s.

```tsx
<DashboardCard className="p-6">
  {/* content */}
</DashboardCard>
```

### `SectionHeader`

Section title + optional description + optional actions (buttons).

```tsx
<SectionHeader
  title="Asset Health"
  description="Operational posture across inventory readiness."
  actions={<Button variant="outline">Manage Assets</Button>}
/>
```

### `KpiCard` — use for module/list page KPI rows

```tsx
<KpiCard
  icon={BoxesIcon}
  iconColor="text-blue-600"
  label="Total Assets"
  value="1,460"
  helper="Across all tracked endpoints."
  trend={{ direction: "up", value: "+6.1%", label: "8-month trailing" }}
/>
```

Grid: `grid gap-4 sm:grid-cols-2 lg:grid-cols-4` (or 5 if needed).

### `MetricCard` — use inside hero panels only

```tsx
<MetricCard
  icon={BadgeCheckIcon}
  iconColor="text-blue-600"
  title="Record Density"
  value="92%"
  description="Coverage across devices, owners, and lifecycle events."
  progress={92}
/>
```

### `ChartCard` + Recharts

```tsx
<ChartCard title="Asset Growth" description="Last 8 months">
  <ChartContainer className="h-[240px] w-full" config={{ total: { label: "Total", color: "var(--chart-1)" } }}>
    {/* Recharts chart */}
  </ChartContainer>
</ChartCard>
```

- Chart height: `h-[240px]` or `h-[220px]`
- Use `ChartTooltip` + `ChartTooltipContent`
- Axis: `tickLine={false} axisLine={false}`
- Bar radius: `[8, 8, 8, 8]` or `[10, 10, 10, 10]`

### `DataTable`

```tsx
const columns: ColumnDef<RowType>[] = [
  {
    key: "asset",
    header: "Asset",
    cell: (row) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">{row.asset}</div>
      </div>
    ),
    className: "w-[36%]",
  },
  // ...
]

<DataTable columns={columns} rows={data} />
```

- Primary column: `font-medium text-foreground`, optional muted sub-line
- Status column: use `StatusBadge` (hardware) or extend `StatusBadge` pattern (software)
- Actions column: right-aligned ghost icon buttons (`size-8 rounded-lg`)

### `StatusBadge`

For hardware asset statuses only:

```tsx
<StatusBadge status="Assigned" />
// "In Stock" | "Assigned" | "Repair" | "Retired"
```

For software statuses (`Active`, `Expiring Soon`, `Expired`), add a sibling component or extend `StatusBadge` — do **not** inline custom `Badge` color maps in page files.

### Buttons

| Use case               | Variant                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| Primary CTA            | `<Button>` default                                                      |
| Secondary              | `<Button variant="outline">` — hero CTAs may add `bg-white/70`          |
| Table row actions      | `<Button variant="ghost" size="icon-sm" className="size-8 rounded-lg">` |
| Destructive row action | add `text-destructive hover:bg-destructive/10`                          |

**Do not:** `animate-pulse` on icons, oversized icons in CTAs.

### Forms & dialogs

Use shadcn `Dialog`, `Input`, `Label`, `NativeSelect` from `@/components/ui/*`.

```tsx
<DialogContent className="sm:max-w-md rounded-xl p-5">
  <DialogHeader>
    <DialogTitle>Register Asset</DialogTitle>
    <DialogDescription>Brief helper text.</DialogDescription>
  </DialogHeader>
  <form className="space-y-4 py-2">
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">Field Name</Label>
      <Input className="rounded-lg" />
    </div>
  </form>
</DialogContent>
```

Labels: `text-xs font-medium text-muted-foreground` (not `font-semibold`).

### Toasts

```tsx
import { Toaster, toast } from "sonner"

// In page JSX:
<Toaster position="top-right" closeButton richColors />
```

---

## 4. Page patterns

### Pattern A — Overview / analytics (reference: `app/dashboard/page.tsx`)

```
DashboardShell
├── Hero section (rounded-2xl, bg-[#F0F9FF], welcome + headline + CTAs)
│   └── MetricCard grid (4 columns)
├── Section: title via SectionHeader
│   └── DashboardCard
│       ├── optional Tabs
│       ├── KpiCard grid
│       └── nested callout (rounded-2xl border bg-muted/40)
├── Chart sections (lg:grid-cols-2, gap-3)
└── Table + sidebar panel (lg:grid-cols-[1fr_320px])
```

### Pattern B — Module list page (Hardware, Software, Employees, etc.)

**List pages must not reuse the Overview hero panel.** They should be simpler and more \"table-first\", like your reference screenshots.

```
DashboardShell (title + optional header actions)
├── PageHeader (eyebrow + H1 + description + meta line)
└── DashboardCard (overflow-hidden)
    ├── FilterToolbar (search + selects)
    └── DataTable (or empty state)
```

Example skeleton:

```tsx
export default function ModulePage() {
  return (
    <DashboardShell
      title="Hardware Inventory"
      actions={
        <Button onClick={openAdd}>
          <PlusIcon className="size-4" />
          Add Asset
        </Button>
      }
    >
      <Toaster position="top-right" closeButton richColors />

      <PageHeader
        eyebrow="Inventory"
        title="Hardware Inventory"
        description="Track laptops, monitors, peripherals, and their assignment status across your organization."
        meta={`${total} assets total · ${assigned} assigned · ${inStock} in stock`}
      />

      <DashboardCard className="mt-6 overflow-hidden">
        <FilterToolbar>
          {/* search + filters */}
        </FilterToolbar>

        <div className="p-4">
          <DataTable columns={columns} rows={rows} className="ring-0" />
        </div>
      </DashboardCard>

      {/* dialogs */}
    </DashboardShell>
  )
}
```

### Pattern C — Empty / placeholder page

```tsx
<DashboardShell title="Intake">
  <section className="space-y-5">
    <SectionHeader
      title="Intake Workspace"
      description="Record newly procured hardware and software inventory."
    />
    <DashboardCard className="p-6">
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 p-12 text-center">
        <InboxIcon className="mb-2 size-8 text-muted-foreground/60" />
        <div className="text-sm font-medium text-foreground">No intake records yet</div>
        <div className="mt-1 max-w-sm text-sm text-muted-foreground">
          Upload an invoice or import a CSV to register new assets.
        </div>
        <Button className="mt-4">Start Intake</Button>
      </div>
    </DashboardCard>
  </section>
</DashboardShell>
```

---

## 5. Anti-patterns (do NOT do this)

These appear in `hardware/page.tsx` and `software/page.tsx` from other AI tools. **Refactor away from these when touching those files.**

| Anti-pattern                                                       | Correct approach                                       |
| ------------------------------------------------------------------ | ------------------------------------------------------ |
| Custom KPI cards with `flex items-center gap-3` and `font-bold`    | Use `KpiCard`                                          |
| Labels like `text-[11.5px] uppercase tracking-wider`               | `KpiCard` `label` prop (sentence case)                 |
| Duplicate `<h1>` page title inside card while shell also has title | `SectionHeader` only; shell handles header bar         |
| Inline `Badge` style maps for statuses in page files               | `StatusBadge` or shared status component               |
| `text-[13.5px]`, `h-4.5`, `h-8.5` arbitrary sizes                  | Standard `text-sm`, `text-xs`, default component sizes |
| Custom progress bars in table cells                                | Extract a `SeatUtilization` component if needed        |
| `PlusIcon` with `animate-pulse`                                    | Static icon, no animation                              |
| Nested cards with inconsistent `rounded-lg` vs `rounded-xl`        | `DashboardCard` + `rounded-xl` everywhere              |

---

## 6. Copy & tone

- Professional, concise, operations-focused
- Descriptions explain _why the section matters_, not feature marketing
- Example: _"Operational posture across inventory readiness, repairs, and warranty pressure."_
- Counts: `"{n} asset{n !== 1 && 's'} listed"` in muted `text-sm`
- Empty states: state the problem + suggest one action

---

## 7. File & import conventions

```tsx
"use client"  // only when hooks, events, or charts are needed

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { SectionHeader } from "@/components/dashboard/section-header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
```

- Page files: `app/dashboard/<module>/page.tsx`
- Reusable dashboard UI: `components/dashboard/`
- Generic primitives: `components/ui/` (shadcn)
- Do not add new global CSS unless updating tokens in `globals.css`

---

## 8. Checklist for agents

Before finishing any dashboard UI work, verify:

- [ ] Uses `DashboardShell` with appropriate `title`
- [ ] KPIs use `KpiCard` (or `MetricCard` in hero only)
- [ ] Sections use `SectionHeader` — no orphan `<h1>` titles
- [ ] Cards use `DashboardCard`
- [ ] Tables use `DataTable` + `StatusBadge` where applicable
- [ ] Colors use semantic tokens or the approved icon accent palette
- [ ] Spacing matches Overview (`mt-6` / `mt-10`, `gap-3` / `gap-4`, `p-5` / `p-6`)
- [ ] No arbitrary font sizes or `font-bold` on metrics
- [ ] Visually comparable to `app/dashboard/page.tsx`

---

## 9. Reference files

| File                                   | Role                        |
| -------------------------------------- | --------------------------- |
| `app/dashboard/page.tsx`               | **Canonical UI reference**  |
| `components/dashboard/*`               | Shared dashboard components |
| `app/globals.css`                      | Design tokens               |
| `components/dashboard/app-sidebar.tsx` | Navigation structure        |
| `app/dashboard/hardware/page.tsx`      | Aligned with design system  |
| `app/dashboard/software/page.tsx`      | Aligned with design system  |

## 10. Component Reuse Rules

Before creating any component:

1. Search `components/ui`
2. Search `components/dashboard`
3. Reuse existing component if one exists
4. Extend existing component before creating a new one

Never create:

- Custom Button
- Custom Input
- Custom Select
- Custom Dialog
- Custom Drawer
- Custom Table
- Custom Badge
- Custom Tabs
- Custom Tooltip
- Custom Popover

Use existing shadcn/ui components.

If a component does not exist:

- Generate it through shadcn CLI
- Place inside `components/ui`
- Follow existing component patterns

Creating duplicate components is prohibited.
