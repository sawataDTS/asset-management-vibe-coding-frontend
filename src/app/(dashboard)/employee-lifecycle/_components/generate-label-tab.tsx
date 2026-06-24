"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Inbox, Search } from "lucide-react"
import { toast } from "sonner"

import {
  DataTable,
  dataTableActionsCellClass,
  dataTableActionsHeaderClass,
  type DataTableColumn,
} from "@/components/custom/DataTable"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CardContainer } from "@/components/ui/card-container"
import { Checkbox } from "@/components/ui/checkbox"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { type LabelEmployee } from "@/lib/employee-lifecycle/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const lifecycleCardContentClassName = settingsControlClassName

type LabelTableProps = {
  rows: LabelEmployee[]
  selectedIds: Set<string>
  onToggle: (id: string, checked: boolean) => void
  onGenerate: (employee: LabelEmployee) => void
}

function SelectCell({
  row,
  selectedIds,
  onToggle,
}: {
  row: LabelEmployee
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

function EmployeeCell({ row }: { row: LabelEmployee }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className={cn("truncate", typeScale.body.emphasis)}>{row.name}</span>
      <span className={cn("truncate", typeScale.caption.meta)}>{row.email}</span>
    </div>
  )
}

function AddressCell({ row }: { row: LabelEmployee }) {
  return (
    <Badge variant={row.addressReady ? "success" : "warning"} className="w-fit">
      {row.addressReady ? "Ready" : "Incomplete"}
    </Badge>
  )
}

function LabelTable({ rows, selectedIds, onToggle, onGenerate }: LabelTableProps) {
  const columns = useMemo<DataTableColumn<LabelEmployee>[]>(
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
        id: "hardware",
        header: "Hardware",
        sortable: false,
        cellClassName: typeScale.body.muted,
        cell: (row) => `${row.hardwareCount} item(s)`,
      },
      {
        id: "address",
        header: "Address",
        sortable: false,
        cell: (row) => <AddressCell row={row} />,
      },
      {
        id: "action",
        header: "Action",
        sortable: false,
        align: "right",
        headerClassName: dataTableActionsHeaderClass,
        cellClassName: dataTableActionsCellClass,
        cell: (row) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!row.addressReady || row.hardwareCount === 0}
            onClick={() => onGenerate(row)}
          >
            Generate
          </Button>
        ),
      },
    ],
    [selectedIds, onToggle, onGenerate]
  )

  return (
    <DataTable<LabelEmployee>
      rowData={rows}
      columns={columns}
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
    <CardContainer
      variant="form"
      title="Generate Label"
      description="After kit assignment, generate hardware labels for one employee or in bulk using Company shipping defaults (carrier: FedEx)."
      formControls
      contentClassName={cn("flex flex-col gap-4", lifecycleCardContentClassName)}
    >
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
          <Button type="button" disabled={selectedIds.size === 0 || generating} onClick={handleBulkGenerate}>
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
    </CardContainer>
  )
}

export { GenerateLabelTab }
