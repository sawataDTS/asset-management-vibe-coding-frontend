"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { type ColDef, type ICellRendererParams } from "ag-grid-community"
import { Inbox } from "lucide-react"
import { toast } from "sonner"

import {
  DataTable,
  dataTableActionsCellClass,
  dataTableActionsHeaderClass,
} from "@/components/custom/DataTable"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { Card, CardActions, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { dialogHeaderClassName, dialogShellClassNameCompact } from "@/lib/dialog-layout"
import { type PendingOnboardingEmployee } from "@/lib/employee-lifecycle/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const lifecycleCardClassName = "gap-0 py-0"
const lifecycleCardContentClassName = cn("p-(--card-spacing)", settingsControlClassName)

type OnboardingTableProps = {
  rows: PendingOnboardingEmployee[]
  selectedIds: Set<string>
  onToggle: (id: string, checked: boolean) => void
}

function SelectCell({
  data,
  selectedIds,
  onToggle,
}: ICellRendererParams<PendingOnboardingEmployee> & OnboardingTableProps) {
  if (!data) return null
  return (
    <Checkbox
      checked={selectedIds.has(data.id)}
      onCheckedChange={(checked) => onToggle(data.id, checked === true)}
      aria-label={`Select ${data.name}`}
    />
  )
}

function EmployeeCell({ data }: ICellRendererParams<PendingOnboardingEmployee>) {
  if (!data) return null
  return (
    <div className="flex min-w-0 flex-col gap-0.5 py-0.5">
      <span className={cn("truncate", typeScale.body.emphasis)}>{data.name}</span>
      <span className={cn("truncate", typeScale.caption.meta)}>{data.email}</span>
      <span className={cn("truncate", typeScale.caption.meta)}>{data.status}</span>
    </div>
  )
}

function StockCell({ data }: ICellRendererParams<PendingOnboardingEmployee>) {
  if (!data) return null
  if (data.stock.length === 0) return <span className={typeScale.body.muted}>—</span>

  return (
    <div className="flex min-w-0 flex-col gap-2 py-0.5">
      {data.stock.map((item) => (
        <div key={item.label} className="space-y-0.5">
          <p className={typeScale.body.default}>{item.label}</p>
          <p
            className={cn(
              typeScale.caption.meta,
              item.status === "in_stock" ? "text-success" : "text-destructive"
            )}
          >
            {item.status === "in_stock" ? "In Stock" : "Out of stock"}
          </p>
          <p className={typeScale.caption.meta}>
            ({item.assigned}/{item.total} assigned)
          </p>
        </div>
      ))}
    </div>
  )
}

function AssignableCell({ data }: ICellRendererParams<PendingOnboardingEmployee>) {
  if (!data) return null
  return (
    <span className={cn(typeScale.body.tabularEmphasis, "tabular-nums")}>{data.assignableNow}</span>
  )
}

function createSelectRenderer(props: OnboardingTableProps) {
  return (params: ICellRendererParams<PendingOnboardingEmployee>) => (
    <SelectCell {...params} {...props} />
  )
}

function OnboardingTable({ rows, selectedIds, onToggle }: OnboardingTableProps) {
  const tableProps = { rows, selectedIds, onToggle }

  const columnDefs = useMemo<ColDef<PendingOnboardingEmployee>[]>(
    () => [
      {
        headerName: "",
        colId: "select",
        width: 48,
        maxWidth: 48,
        sortable: false,
        resizable: false,
        cellRenderer: createSelectRenderer(tableProps),
      },
      {
        headerName: "Employee",
        colId: "employee",
        flex: 1.6,
        minWidth: 180,
        sortable: false,
        autoHeight: true,
        wrapText: true,
        cellRenderer: EmployeeCell,
      },
      {
        headerName: "Department",
        field: "department",
        flex: 1,
        minWidth: 100,
        cellClass: typeScale.body.muted,
      },
      {
        headerName: "Template",
        field: "templateName",
        flex: 1,
        minWidth: 100,
        cellClass: typeScale.body.muted,
      },
      {
        headerName: "Stock",
        colId: "stock",
        flex: 1.8,
        minWidth: 180,
        sortable: false,
        autoHeight: true,
        wrapText: true,
        cellRenderer: StockCell,
      },
      {
        headerName: "Assignable now",
        colId: "assignable",
        flex: 1,
        minWidth: 110,
        sortable: false,
        headerClass: dataTableActionsHeaderClass,
        cellClass: cn(dataTableActionsCellClass, "justify-end text-right"),
        autoHeight: true,
        cellRenderer: AssignableCell,
      },
    ],
    [selectedIds, onToggle]
  )

  return (
    <DataTable<PendingOnboardingEmployee>
      rowData={rows}
      columnDefs={columnDefs}
      autoRowHeight
      showPerPage={false}
      showJumpToPage={false}
      emptyState={
        <Empty className="border-0 bg-transparent py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>No pending onboarding</EmptyTitle>
            <EmptyDescription>All employees are fully provisioned against their templates.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    />
  )
}

export interface OnboardingTabProps {
  employees: PendingOnboardingEmployee[]
}

function OnboardingTab({ employees }: OnboardingTabProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [confirmOpen, setConfirmOpen] = useState(false)

  const selectedCount = selectedIds.size

  function handleToggle(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function handleSelectWithStock() {
    const withStock = employees.filter((emp) => emp.assignableNow > 0).map((emp) => emp.id)
    setSelectedIds(new Set(withStock))
  }

  function handleClear() {
    setSelectedIds(new Set())
  }

  function handleAssignConfirm() {
    toast.success(`Assigned available kit to ${selectedCount} employee(s).`)
    setConfirmOpen(false)
    setSelectedIds(new Set())
  }

  return (
    <>
      <Card className={lifecycleCardClassName}>
        <CardContent className={cn("flex flex-col gap-4", lifecycleCardContentClassName)}>
          <SectionHeading
            title="Pending vs department template"
            description="Compare each employee against their department template. Stock counts reflect the tenant pool; assignable now is how many lines can still be fulfilled from current inventory."
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" onClick={handleSelectWithStock}>
                  Select with stock
                </Button>
                <Button type="button" variant="outline" onClick={handleClear}>
                  Clear
                </Button>
                <Button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={() => setConfirmOpen(true)}
                >
                  Assign available ({selectedCount})
                </Button>
              </div>
            }
          />

          <OnboardingTable rows={employees} selectedIds={selectedIds} onToggle={handleToggle} />
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className={dialogShellClassNameCompact}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>Assign available to {selectedCount} employee(s)?</DialogTitle>
            <DialogDescription>
              Runs onboarding for each selected employee in order (stock updates between runs), using each
              person&apos;s department template. In-stock hardware and free license seats are applied until the
              pool runs out; remaining gaps stay as shortfalls or skipped optional lines.
            </DialogDescription>
          </DialogHeader>

          <CardActions>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleAssignConfirm}>
              Confirm
            </Button>
          </CardActions>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { OnboardingTab }
