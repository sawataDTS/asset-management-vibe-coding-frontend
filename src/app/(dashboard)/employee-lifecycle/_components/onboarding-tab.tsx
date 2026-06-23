"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Inbox } from "lucide-react"
import { toast } from "sonner"

import {
  DataTable,
  dataTableActionsCellClass,
  dataTableActionsHeaderClass,
  type DataTableColumn,
} from "@/components/custom/DataTable"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { type PendingOnboardingEmployee, type StockItemStatus } from "@/lib/employee-lifecycle/data"
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
  row,
  selectedIds,
  onToggle,
}: {
  row: PendingOnboardingEmployee
  selectedIds: Set<string>
  onToggle: (id: string, checked: boolean) => void
}) {
  return (
    <Checkbox
      checked={selectedIds.has(row.id)}
      onCheckedChange={(checked) => onToggle(row.id, checked === true)}
      aria-label={`Select ${row.name}`}
    />
  )
}

function EmployeeCell({ row }: { row: PendingOnboardingEmployee }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className={cn("truncate", typeScale.body.emphasis)}>{row.name}</span>
      <span className={cn("truncate", typeScale.caption.meta)}>{row.email}</span>
      <span className={cn("truncate", typeScale.caption.meta)}>{row.status}</span>
    </div>
  )
}

const STOCK_STATUS_VARIANT: Record<
  StockItemStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  in_stock: "success",
  out_of_stock: "destructive",
}

function StockCell({ row }: { row: PendingOnboardingEmployee }) {
  if (row.stock.length === 0) return <span className={typeScale.body.muted}>—</span>

  return (
    <div className="flex min-w-0 flex-col gap-2">
      {row.stock.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col gap-1">
          <p className={typeScale.body.emphasis}>{item.label}</p>
          <Badge variant={STOCK_STATUS_VARIANT[item.status]} className="w-fit">
            {item.status === "in_stock" ? "In Stock" : "Out of stock"}
          </Badge>
          <p className={typeScale.caption.meta}>
            ({item.assigned}/{item.total} assigned)
          </p>
        </div>
      ))}
    </div>
  )
}

function OnboardingTable({ rows, selectedIds, onToggle }: OnboardingTableProps) {
  const columns = useMemo<DataTableColumn<PendingOnboardingEmployee>[]>(
    () => [
      {
        id: "select",
        header: "",
        sortable: false,
        cellClassName: "w-12",
        cell: (row) => <SelectCell row={row} selectedIds={selectedIds} onToggle={onToggle} />,
      },
      {
        id: "employee",
        header: "Employee",
        sortable: false,
        cell: (row) => <EmployeeCell row={row} />,
      },
      {
        id: "department",
        header: "Department",
        sortable: false,
        cellClassName: typeScale.body.muted,
        cell: (row) => row.department,
      },
      {
        id: "templateName",
        header: "Template",
        sortable: false,
        cellClassName: typeScale.body.muted,
        cell: (row) => row.templateName,
      },
      {
        id: "stock",
        header: "Stock",
        sortable: false,
        cell: (row) => <StockCell row={row} />,
      },
      {
        id: "assignable",
        header: "Assignable now",
        sortable: false,
        align: "right",
        headerClassName: dataTableActionsHeaderClass,
        cellClassName: cn(dataTableActionsCellClass, typeScale.body.tabularEmphasis, "tabular-nums"),
        cell: (row) => row.assignableNow,
      },
    ],
    [selectedIds, onToggle]
  )

  return (
    <DataTable<PendingOnboardingEmployee>
      rowData={rows}
      columns={columns}
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
