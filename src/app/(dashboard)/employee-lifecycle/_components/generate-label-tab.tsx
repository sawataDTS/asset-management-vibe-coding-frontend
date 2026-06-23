"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { type ColDef, type ICellRendererParams } from "ag-grid-community"
import { Box, Inbox, Search } from "lucide-react"
import { toast } from "sonner"

import {
  DataTable,
  dataTableActionsCellClass,
  dataTableActionsHeaderClass,
} from "@/components/custom/DataTable"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { type LabelEmployee } from "@/lib/employee-lifecycle/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const lifecycleCardClassName = "gap-0 py-0"
const lifecycleCardContentClassName = cn("p-(--card-spacing)", settingsControlClassName)

type LabelTableProps = {
  rows: LabelEmployee[]
  selectedIds: Set<string>
  onToggle: (id: string, checked: boolean) => void
  onGenerate: (employee: LabelEmployee) => void
}

function SelectCell({
  data,
  selectedIds,
  onToggle,
}: ICellRendererParams<LabelEmployee> & Pick<LabelTableProps, "selectedIds" | "onToggle">) {
  if (!data) return null
  return (
    <Checkbox
      checked={selectedIds.has(data.id)}
      onCheckedChange={(checked) => onToggle(data.id, checked === true)}
      aria-label={`Select ${data.name}`}
    />
  )
}

function EmployeeCell({ data }: ICellRendererParams<LabelEmployee>) {
  if (!data) return null
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className={cn("truncate", typeScale.body.emphasis)}>{data.name}</span>
      <span className={cn("truncate", typeScale.caption.meta)}>{data.email}</span>
    </div>
  )
}

function AddressCell({ data }: ICellRendererParams<LabelEmployee>) {
  if (!data) return null
  return (
    <span className={cn(typeScale.body.emphasis, data.addressReady ? "text-success" : "text-muted-foreground")}>
      {data.addressReady ? "Ready" : "Incomplete"}
    </span>
  )
}

function ActionCell({
  data,
  onGenerate,
}: ICellRendererParams<LabelEmployee> & Pick<LabelTableProps, "onGenerate">) {
  if (!data) return null
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={!data.addressReady || data.hardwareCount === 0}
      onClick={() => onGenerate(data)}
    >
      Generate
    </Button>
  )
}

function createSelectRenderer(props: Pick<LabelTableProps, "selectedIds" | "onToggle">) {
  return (params: ICellRendererParams<LabelEmployee>) => <SelectCell {...params} {...props} />
}

function createActionRenderer(props: Pick<LabelTableProps, "onGenerate">) {
  return (params: ICellRendererParams<LabelEmployee>) => <ActionCell {...params} {...props} />
}

function LabelTable({ rows, selectedIds, onToggle, onGenerate }: LabelTableProps) {
  const columnDefs = useMemo<ColDef<LabelEmployee>[]>(
    () => [
      {
        headerName: "",
        colId: "select",
        width: 48,
        maxWidth: 48,
        sortable: false,
        resizable: false,
        cellRenderer: createSelectRenderer({ selectedIds, onToggle }),
      },
      {
        headerName: "Employee",
        colId: "employee",
        flex: 1.8,
        minWidth: 180,
        sortable: false,
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
        headerName: "Hardware",
        colId: "hardware",
        flex: 1,
        minWidth: 100,
        valueGetter: ({ data }) => (data ? `${data.hardwareCount} item(s)` : ""),
        cellClass: typeScale.body.muted,
      },
      {
        headerName: "Address",
        colId: "address",
        flex: 0.9,
        minWidth: 90,
        sortable: false,
        cellRenderer: AddressCell,
      },
      {
        headerName: "Action",
        colId: "action",
        flex: 1,
        minWidth: 110,
        sortable: false,
        headerClass: dataTableActionsHeaderClass,
        cellClass: dataTableActionsCellClass,
        cellRenderer: createActionRenderer({ onGenerate }),
      },
    ],
    [selectedIds, onToggle, onGenerate]
  )

  return (
    <DataTable<LabelEmployee>
      rowData={rows}
      columnDefs={columnDefs}
      showPerPage={false}
      showJumpToPage={false}
      emptyState={
        <Empty className="border-0 bg-transparent py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>No employees ready for labels</EmptyTitle>
            <EmptyDescription>Assign hardware first, then generate shipping labels here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    />
  )
}

export interface GenerateLabelTabProps {
  employees: LabelEmployee[]
}

function GenerateLabelTab({ employees }: GenerateLabelTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [generating, setGenerating] = useState(false)

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
    )
  }, [employees, searchQuery])

  function handleToggle(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function handleGenerateOne(employee: LabelEmployee) {
    toast.success(`Generated label for ${employee.name}.`)
  }

  function handleRefresh() {
    toast.info("Refreshed label queue.")
  }

  function handleBulkGenerate() {
    if (selectedIds.size === 0) return
    setGenerating(true)
    window.setTimeout(() => {
      setGenerating(false)
      toast.success(`Generated labels for ${selectedIds.size} employee(s).`)
      setSelectedIds(new Set())
    }, 900)
  }

  return (
    <Card className={lifecycleCardClassName}>
      <CardContent className={cn("flex flex-col gap-4", lifecycleCardContentClassName)}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary ring-1 ring-border/60">
              <Box className="size-4" />
            </span>
            <h2 className={typeScale.title}>Generate Label</h2>
          </div>
          <p className={typeScale.body.muted}>
            After kit assignment, generate hardware labels for one employee or in bulk using Company shipping
            defaults (carrier: FedEx).
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <InputGroup className="min-w-[240px] flex-1">
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search by employee, email, department, code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={handleRefresh}>
              Refresh
            </Button>
            <Button
              type="button"
              disabled={selectedIds.size === 0 || generating}
              onClick={handleBulkGenerate}
            >
              {generating ? "Generating…" : "Generate Label"}
            </Button>
          </div>
        </div>

        <LabelTable
          rows={filteredEmployees}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          onGenerate={handleGenerateOne}
        />
      </CardContent>
    </Card>
  )
}

export { GenerateLabelTab }
