"use client"

import * as React from "react"
import { useMemo } from "react"
import { Check, Eye, Inbox, X } from "lucide-react"

import {
  DataTable,
  dataTableActionsCellClass,
  dataTableActionsHeaderClass,
  type DataTableColumn,
} from "@/components/custom/DataTable"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { REQUEST_TYPE_LABELS } from "@/lib/requests/constants"
import type { EmployeeRequest } from "@/lib/requests/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"
import {
  RequestPriorityBadge,
  RequestStatusBadge,
} from "@/app/(dashboard)/requests/_components/request-status-badge"

function RequestCell({ row }: { row: EmployeeRequest }) {
  return (
    <div className="min-w-0">
      <span className={cn("block truncate", typeScale.body.emphasis)}>{row.title}</span>
      <span className={cn("block truncate", typeScale.caption.meta)}>{REQUEST_TYPE_LABELS[row.type]}</span>
    </div>
  )
}

function ActionsCell({
  row,
  canManage,
  onView,
  onApprove,
  onReject,
}: {
  row: EmployeeRequest
  canManage: boolean
  onView: (request: EmployeeRequest) => void
  onApprove: (request: EmployeeRequest) => void
  onReject: (request: EmployeeRequest) => void
}) {
  const isPending = row.status === "pending"

  return (
    <div className="flex w-full items-center justify-end gap-1">
      <Button variant="ghost" size="icon-sm" aria-label="View request" onClick={() => onView(row)}>
        <Eye />
      </Button>
      {canManage && isPending ? (
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Approve request"
            className="text-success hover:bg-success/10 hover:text-success"
            onClick={() => onApprove(row)}
          >
            <Check />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Reject request"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onReject(row)}
          >
            <X />
          </Button>
        </>
      ) : null}
    </div>
  )
}

export interface EmployeeRequestsTableProps {
  rows: EmployeeRequest[]
  showEmployeeColumn: boolean
  canManage: boolean
  onView: (request: EmployeeRequest) => void
  onApprove: (request: EmployeeRequest) => void
  onReject: (request: EmployeeRequest) => void
}

function EmployeeRequestsTable({
  rows,
  showEmployeeColumn,
  canManage,
  onView,
  onApprove,
  onReject,
}: EmployeeRequestsTableProps) {
  const columns = useMemo<DataTableColumn<EmployeeRequest>[]>(() => {
    const base: DataTableColumn<EmployeeRequest>[] = [
      {
        id: "request",
        header: "Request",
        sortValue: (row) => row.title,
        cell: (row) => <RequestCell row={row} />,
      },
    ]

    if (showEmployeeColumn) {
      base.push({
        id: "employee",
        header: "Employee",
        sortValue: (row) => row.employeeName,
        cell: (row) => (
          <div className="min-w-0">
            <span className={cn("block truncate", typeScale.body.emphasis)}>{row.employeeName}</span>
            <span className={cn("block truncate", typeScale.caption.meta)}>{row.employeeEmail}</span>
          </div>
        ),
      })
    }

    base.push(
      {
        id: "priority",
        header: "Priority",
        sortValue: (row) => row.priority,
        cell: (row) => <RequestPriorityBadge priority={row.priority} />,
      },
      {
        id: "submitted",
        header: "Submitted",
        sortValue: (row) => row.submittedAt,
        cell: (row) => <span className={typeScale.body.muted}>{row.submittedAt}</span>,
      },
      {
        id: "status",
        header: "Status",
        sortValue: (row) => row.status,
        cell: (row) => <RequestStatusBadge status={row.status} />,
      },
      {
        id: "actions",
        header: "Actions",
        sortable: false,
        align: "right",
        headerClassName: dataTableActionsHeaderClass,
        cellClassName: dataTableActionsCellClass,
        cell: (row) => (
          <ActionsCell
            row={row}
            canManage={canManage}
            onView={onView}
            onApprove={onApprove}
            onReject={onReject}
          />
        ),
      }
    )

    return base
  }, [showEmployeeColumn, canManage, onView, onApprove, onReject])

  return (
    <DataTable<EmployeeRequest>
      rowData={rows}
      columns={columns}
      pageSize={10}
      emptyState={
        <Empty className="border-0 bg-transparent py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>No requests here</EmptyTitle>
            <EmptyDescription>Try adjusting your filters or submit a new request.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    />
  )
}

export { EmployeeRequestsTable }
