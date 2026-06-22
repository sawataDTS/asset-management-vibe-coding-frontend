"use client"

import * as React from "react"
import { useMemo } from "react"
import { format, isValid, parseISO } from "date-fns"
import { type ColDef, type ICellRendererParams } from "ag-grid-community"
import { Cpu, Inbox, Key, Pencil, Trash2 } from "lucide-react"

import { DataTable, dataTableActionsHeaderClass } from "@/components/custom/DataTable"
import { EmploymentStatusBadge } from "./employment-status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { formatEmployeeLocation, type Employee } from "@/lib/employees/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function formatStartDate(value: string) {
  if (!value) return "—"
  const parsed = parseISO(value)
  return isValid(parsed) ? format(parsed, "dd MMM yyyy") : value
}

type EmployeeCellProps = ICellRendererParams<Employee> & {
  onOpenDetail: (employee: Employee) => void
}

function EmployeeCell({ data, onOpenDetail }: EmployeeCellProps) {
  if (!data) return null
  return (
    <button
      type="button"
      onClick={() => onOpenDetail(data)}
      className="flex min-w-0 items-center gap-3 text-left"
    >
      <Avatar size="sm">
        <AvatarFallback className="bg-accent text-xs text-primary">{getInitials(data.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <span className={cn("block truncate", typeScale.body.emphasis)}>{data.name}</span>
        <span className={cn("block truncate", typeScale.caption.meta)}>{data.email}</span>
      </div>
    </button>
  )
}

function StatusCell({ data }: ICellRendererParams<Employee>) {
  if (!data) return null
  return <EmploymentStatusBadge status={data.status} />
}

function AssignedCell({ data }: ICellRendererParams<Employee>) {
  if (!data) return null
  return (
    <div className={cn("flex items-center gap-3", typeScale.body.muted)}>
      <span className="inline-flex items-center gap-1">
        <Cpu className="size-3.5" />
        {data.hardwareAssignments.length}
      </span>
      <span className="inline-flex items-center gap-1">
        <Key className="size-3.5" />
        {data.softwareAssignments.length}
      </span>
    </div>
  )
}

function WorkspaceCell({ data }: ICellRendererParams<Employee>) {
  if (!data) return null
  return <span className={typeScale.body.muted}>{data.workspaceEnabled ? data.workspaceRole : "—"}</span>
}

type ActionsCellProps = ICellRendererParams<Employee> & {
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}

function ActionsCell({ data, onEdit, onDelete }: ActionsCellProps) {
  if (!data) return null
  return (
    <div className="flex w-full items-center justify-end gap-1">
      <Button variant="ghost" size="icon-sm" aria-label="Edit employee" onClick={() => onEdit(data)}>
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete employee"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onDelete(data)}
      >
        <Trash2 />
      </Button>
    </div>
  )
}

function createEmployeeRenderer(onOpenDetail: (employee: Employee) => void) {
  return (params: ICellRendererParams<Employee>) => <EmployeeCell {...params} onOpenDetail={onOpenDetail} />
}

function createActionsRenderer(handlers: Omit<ActionsCellProps, keyof ICellRendererParams>) {
  return (params: ICellRendererParams<Employee>) => <ActionsCell {...params} {...handlers} />
}

export interface EmployeesTableProps {
  rows: Employee[]
  onOpenDetail: (employee: Employee) => void
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}

function EmployeesTable({ rows, onOpenDetail, onEdit, onDelete }: EmployeesTableProps) {
  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      {
        headerName: "Employee",
        field: "name",
        flex: 2,
        minWidth: 200,
        cellRenderer: createEmployeeRenderer(onOpenDetail),
      },
      {
        headerName: "Employee ID",
        field: "employeeId",
        flex: 1,
        minWidth: 110,
        cellClass: cn(typeScale.body.muted, "font-mono tabular-nums"),
      },
      {
        headerName: "Department",
        field: "department",
        flex: 1,
        minWidth: 100,
        valueFormatter: ({ value }) => (value ? String(value) : "—"),
        cellClass: typeScale.body.muted,
      },
      {
        headerName: "Location",
        colId: "location",
        flex: 1.4,
        minWidth: 140,
        valueGetter: ({ data }) => (data ? formatEmployeeLocation(data) : ""),
        cellClass: cn(typeScale.body.muted, "truncate"),
      },
      {
        headerName: "Assigned",
        colId: "assigned",
        flex: 0.9,
        minWidth: 90,
        sortable: false,
        cellRenderer: AssignedCell,
      },
      {
        headerName: "Workspace",
        colId: "workspace",
        flex: 1,
        minWidth: 100,
        cellRenderer: WorkspaceCell,
      },
      {
        headerName: "Status",
        field: "status",
        flex: 1,
        minWidth: 110,
        cellRenderer: StatusCell,
      },
      {
        headerName: "Actions",
        colId: "actions",
        flex: 0.9,
        minWidth: 90,
        sortable: false,
        headerClass: dataTableActionsHeaderClass,
        cellRenderer: createActionsRenderer({ onEdit, onDelete }),
      },
    ],
    [onOpenDetail, onEdit, onDelete]
  )

  return (
    <DataTable<Employee>
      rowData={rows}
      columnDefs={columnDefs}
      pageSize={10}
      emptyState={
        <Empty className="border-0 bg-transparent py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>No employees found</EmptyTitle>
            <EmptyDescription>Try adjusting your search or filters, or add a new employee.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    />
  )
}

export { EmployeesTable, formatStartDate, getInitials }
