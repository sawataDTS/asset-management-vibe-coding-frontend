"use client"

import * as React from "react"
import { useMemo } from "react"
import { format, isValid, parseISO } from "date-fns"
import { AppWindow, HardDrive, Inbox, PanelRightOpen, Pencil, Trash2 } from "lucide-react"

import { DataTable, dataTableActionsCellClass, dataTableActionsHeaderClass, type DataTableColumn } from "@/components/custom/DataTable"
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

function EmployeeCell({ row }: { row: Employee }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar size="sm">
        <AvatarFallback className="bg-accent text-primary">{getInitials(row.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <span className={cn("block truncate", typeScale.body.emphasis)}>{row.name}</span>
        <span className={cn("block truncate", typeScale.caption.meta)}>{row.email}</span>
      </div>
    </div>
  )
}

function AssignedCell({ row }: { row: Employee }) {
  return (
    <div className={cn("flex items-center gap-3", typeScale.body.muted)}>
      <span className="inline-flex items-center gap-1">
        <HardDrive className="size-3.5 shrink-0" />
        {row.hardwareAssignments.length}
      </span>
      <span className="inline-flex items-center gap-1">
        <AppWindow className="size-3.5 shrink-0" />
        {row.softwareAssignments.length}
      </span>
    </div>
  )
}

function ActionsCell({
  row,
  onOpenDetail,
  onEdit,
  onDelete,
}: {
  row: Employee
  onOpenDetail: (employee: Employee) => void
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}) {
  return (
    <div className="flex w-full items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="View employee details"
        onClick={() => onOpenDetail(row)}
      >
        <PanelRightOpen />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Edit employee" onClick={() => onEdit(row)}>
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete employee"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onDelete(row)}
      >
        <Trash2 />
      </Button>
    </div>
  )
}

export interface EmployeesTableProps {
  rows: Employee[]
  onOpenDetail: (employee: Employee) => void
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}

function EmployeesTable({ rows, onOpenDetail, onEdit, onDelete }: EmployeesTableProps) {
  const columns = useMemo<DataTableColumn<Employee>[]>(
    () => [
      {
        id: "name",
        header: "Employee",
        flex: 2.5,
        minWidth: 240,
        sortValue: (row) => row.name,
        cell: (row) => <EmployeeCell row={row} />,
      },
      {
        id: "employeeId",
        header: "Employee ID",
        flex: 1,
        minWidth: 132,
        sortValue: (row) => row.employeeId,
        cellClassName: cn(typeScale.body.muted, "font-mono tabular-nums"),
        cell: (row) => row.employeeId,
      },
      {
        id: "department",
        header: "Department",
        flex: 1,
        minWidth: 128,
        sortValue: (row) => row.department,
        cellClassName: typeScale.body.muted,
        cell: (row) => row.department || "—",
      },
      {
        id: "location",
        header: "Location",
        width: 112,
        minWidth: 96,
        resizable: true,
        sortValue: (row) => formatEmployeeLocation(row),
        cellClassName: cn(typeScale.body.muted, "truncate"),
        cell: (row) => <span className="block truncate">{formatEmployeeLocation(row)}</span>,
      },
      {
        id: "assigned",
        header: "Assigned",
        flex: 0.9,
        minWidth: 104,
        sortable: false,
        cell: (row) => <AssignedCell row={row} />,
      },
      {
        id: "workspace",
        header: "Workspace",
        flex: 0.65,
        minWidth: 120,
        sortValue: (row) => (row.workspaceEnabled ? row.workspaceRole : ""),
        cellClassName: cn(typeScale.body.muted, "truncate"),
        cell: (row) => (
          <span className="block truncate">{row.workspaceEnabled ? row.workspaceRole : "—"}</span>
        ),
      },
      {
        id: "status",
        header: "Status",
        flex: 0.75,
        minWidth: 100,
        sortValue: (row) => row.status,
        cell: (row) => <EmploymentStatusBadge status={row.status} />,
      },
      {
        id: "actions",
        header: "Actions",
        width: 132,
        minWidth: 132,
        sortable: false,
        align: "right",
        headerClassName: dataTableActionsHeaderClass,
        cellClassName: dataTableActionsCellClass,
        cell: (row) => (
          <ActionsCell row={row} onOpenDetail={onOpenDetail} onEdit={onEdit} onDelete={onDelete} />
        ),
      },
    ],
    [onOpenDetail, onEdit, onDelete]
  )

  return (
    <DataTable<Employee>
      rowData={rows}
      columns={columns}
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
