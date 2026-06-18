# AssetOps Development Rules

Read DESIGN.md before making any UI changes.

## Design Authority

DESIGN.md is the single source of truth.

Do not create styles that conflict with DESIGN.md.

When DESIGN.md and user instructions conflict:

1. User instruction
2. DESIGN.md
3. Existing code

Follow this order.

---

## Component Reuse Policy

Before creating any component:

Search:

- components/ui
- components/dashboard

Reuse existing components whenever possible.

Do not create duplicate implementations.

Examples:

❌ CustomButton.tsx

✅ components/ui/button.tsx

❌ CustomSelect.tsx

✅ components/ui/select.tsx

❌ CustomModal.tsx

✅ components/ui/dialog.tsx

---

## Shadcn Rules

Always prefer shadcn/ui components.

Required component priority:

1. Existing project component
2. Existing shadcn component
3. Generate missing shadcn component
4. Create custom component only if absolutely necessary

Never create custom implementations for:

- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Dialog
- Drawer
- Sheet
- Popover
- Tooltip
- Badge
- Tabs
- Table
- Pagination
- DropdownMenu

---

## Dashboard Components

Always prefer:

- DashboardShell
- DashboardCard
- SectionHeader
- KpiCard
- MetricCard
- ChartCard
- DataTable
- StatusBadge

Do not recreate these components.

---

## Styling Rules

Use:

- TailwindCSS
- shadcn/ui
- Design tokens

Do not use:

- Inline styles
- Hardcoded hex colors
- Arbitrary font sizes
- Arbitrary spacing values

Examples:

❌ text-[13px]

❌ text-[15px]

❌ p-[18px]

Use design system tokens instead.

---

## New Page Rules

Every dashboard page must:

1. Use DashboardShell
2. Use SectionHeader
3. Use DashboardCard
4. Use shared DataTable
5. Use shared StatusBadge

Never build a page from scratch using raw divs.

---

## File Structure

Reusable dashboard components:

components/dashboard/

Reusable primitives:

components/ui/

Hooks:

hooks/

Utilities:

lib/

Dashboard routes:

app/dashboard/

Do not create alternative folders.

---

## Before Completing Any Task

Verify:

- No duplicate components created
- Existing components reused
- DESIGN.md followed
- shadcn/ui used where applicable
- No custom Selects or Dialogs created
- No design-system violations introduced

If a rule must be broken, explain why in the response.

## Screenshot Usage Rule

Screenshots (including Asset360) are reference material only.

Use screenshots for:

- Layout
- Workflow
- Content hierarchy
- Business logic
- Module organization

Never copy:

- Colors
- Typography
- Card styling
- Shadows
- Spacing values
- Component appearance
- Gradients or badge/pill styling

All UI must follow DESIGN.md and the AssetOps design language (Linear / Ramp / Stripe / Vercel aesthetic).
