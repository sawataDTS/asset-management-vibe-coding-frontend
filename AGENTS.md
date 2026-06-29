# Engineering Rules

Read [`DESIGN.md`](./DESIGN.md) before generating any UI. The following rules are mandatory and non-negotiable.

1. **Use `components/ui` first.** Always reach for an existing primitive in `src/components/ui/*` before building anything custom.
2. **Never re-create existing primitives.** Do not create a custom button / input / select / card / dialog (etc.) if an equivalent already exists in `src/components/ui`. Compose, don't duplicate.
3. **Never hardcode colors.** No hex values, no Tailwind palette colors (`blue-500`, `slate-900`, ...), no inline `rgb()/hsl()`. Colors come from semantic tokens only.
4. **Never hardcode spacing, radius, shadows, or typography.** Use the Tailwind scale and design tokens (`--radius`, `--shadow-*`, `--spacing`, `font-*`).
5. **Always use design tokens / theme variables.** Style via semantic utilities (`bg-surface`, `bg-sidebar-active`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, ...) so components re-theme automatically.
6. **Always use the reusable `PageHeader`** (`@/components/layout/PageHeader`) for page titles, descriptions, icons, and header actions.
7. **`Sidebar` and `Navbar` are global layout components.** Do not fork or re-implement them per page; extend the shared components.
8. **All pages live under `app/(dashboard)` and inherit `DashboardLayout`.** Do not wrap individual pages in their own shell.
9. **Theme-switcher compatibility is mandatory.** Every component must support all workspace themes at runtime. Never reference a specific theme's colors; only reference tokens. Test that a component looks correct after switching themes.
10. **Follow `DESIGN.md` before generating UI.** Layout, sidebar, navbar, header, token, scroll, card selection (§10), and responsive specifications are defined there.
11. **Never use em dashes (—).** Do not use `—` (U+2014) in user-facing copy, labels, descriptions, placeholders, or comments. Prefer commas, periods, colons, or parentheses to preserve flow. In tables, never use em dashes for empty or missing values; use a plain hyphen (`-`) via `TABLE_EMPTY_CELL` from `@/lib/table-empty` (or `tableCellOrEmpty()` for optional strings).
12. **Never implement frontend CRUD logic unless the prompt explicitly asks for API integration.** Real persistence will come from backend APIs later. Do not waste tokens building client-side create / update / delete flows that will be thrown away.
13. **Always use Zod with React Hook Form for form validation.** All forms must use Zod schemas with React Hook Form for validation. Use `@hookform/resolvers/zod` to integrate Zod with React Hook Form. Define schemas with clear error messages, and display errors using `FieldError` from `@/components/ui/field`. Never use manual validation functions or inline validation logic.

---

## UI-only work (no frontend CRUD)

**Follow the prompt.** If the user asks for UI, layout, a page shell, a modal, or a table, build **presentation only**. Do not add data-mutation logic unless they explicitly request API wiring or server actions.

### Do not build

- `useState` copies of entity lists that you mutate on add / edit / delete (e.g. `setEmployees`, `setSuppliers`, `prev.map`, `prev.filter`, `[newItem, ...prev]`)
- Fake persistence: toasts like "Added employee ..." or "Removed supplier ..." after local state changes
- In-memory assignment / linking logic that simulates backend relationships
- Search or filter state is fine **only for UI demo** when reading from static mock data; do not combine it with write paths

### Do build

- Page layout: `PageHeader`, `CardContainer`, tables, filters (display-only)
- Separate modal / sheet components using **`ModalContainer`**, with form fields and basic required-field validation
- Read-only rows from existing mock modules (`src/lib/*/data.ts`) passed as props
- Modal open / close state and which row is selected (UI state only)
- Submit / delete handlers that are **stubs**: close the dialog and leave a `// TODO: call API` comment, or call an `onSubmit` prop the page defines as a no-op stub until APIs exist

### When API work is requested

Only then add fetch / mutate logic (server actions, route handlers, React Query, etc.) and wire forms to real endpoints. Do not pre-emptively scaffold CRUD "for later."

```tsx
// UI-only submit (correct until APIs are wired)
function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  if (!formName.trim()) {
    toast.error("Name is required.")
    return
  }
  // TODO: POST /api/suppliers
  onOpenChange(false)
}
```

```tsx
// Wrong: do not generate this for UI-only tasks
setSuppliers((prev) => [...prev, newSupplier])
toast.success(`Added supplier ${newSupplier.name}.`)
```

---

## Modal performance

On pages with **multiple** modals (or modals that will fetch on mount), render each dialog only when its `open` flag is true (and required props exist for review flows). Do not mount all dialogs up front. Use `next/dynamic` only for unusually heavy modal bundles. See **`DESIGN.md` §10** (`ModalContainer` - lazy mount).

```tsx
{addRequestOpen && (
  <AddRequestDialog
    open={addRequestOpen}
    onOpenChange={setAddRequestOpen}
  />
)}

{reviewOpen && selectedItem && (
  <ReviewDialog
    open={reviewOpen}
    onOpenChange={setReviewOpen}
    item={selectedItem}
  />
)}
```

---

## Page component organization

Keep dashboard pages thin. Split UI into focused files under `app/(dashboard)/<route>/_components/` so each file has one clear job.

| File                           | Responsibility                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------- |
| `page.tsx`                     | Server entry — import and render the page client component only                  |
| `<route>-page.tsx`             | Page shell: `PageHeader`, filters, table/list, modal open state (UI only)        |
| `<route>-table.tsx` (or list)  | Presentational table/list — receives rows + action callbacks via props           |
| `<action>-<entity>-dialog.tsx` | One modal per file — form fields + validation; submit is a stub until APIs exist |
| `<entity>-detail-sheet.tsx`    | Side panels / sheets when the page needs them                                    |

**Rules:**

1. **One modal per file.** Never inline `Dialog` / `ModalContainer` JSX in the page file. Name files by action + entity, e.g. `add-edit-employee-dialog.tsx`, `delete-supplier-dialog.tsx`.
2. **Always use `ModalContainer`.** Do not hand-roll `Dialog` + `DialogHeader` + `DialogBody` + `CardActions`. Pass `title`, `description`, `footer`, optional `onSubmit`, and `formControls` / `size` as needed. See **`DESIGN.md` §10**.
3. **Props over coupling.** Dialogs receive `open`, `onOpenChange`, entity data, and callbacks (`onSave`, `onConfirm`, `onClose`). The page wires **UI state only** (which modal is open, selected row). Do not mutate mock lists in the page or dialog unless API integration was explicitly requested.
4. **Lazy-mount modals.** Conditionally render each dialog when its modal flag is active and required entity props exist: `{activeModal === "delete" && selectedItem && <DeleteDialog ... />}`.
5. **Typed props.** Export a named props interface from each dialog (no `any`). Reference: `suppliers/_components/` and `employees/_components/` for **file layout, modal patterns, and `ModalContainer` usage only**. Those pages may still contain legacy in-memory list mutation; do not copy CRUD state from them when building new UI-only pages.

```tsx
// suppliers-page.tsx (pattern)
type ActiveModal = "add" | "edit" | "delete" | null

{(activeModal === "add" || activeModal === "edit") && (
  <AddEditSupplierDialog
    open
    mode={activeModal}
    onOpenChange={handleDialogOpenChange}
    selectedSupplier={selectedSupplier}
    onClose={handleCloseModal}
  />
)}
```

---
