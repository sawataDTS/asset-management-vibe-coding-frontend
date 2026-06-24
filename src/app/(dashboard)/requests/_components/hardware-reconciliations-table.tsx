"use client"

import * as React from "react"
import { useMemo } from "react"
import { Check, Eye, Flag, Inbox, X } from "lucide-react"

import {
  DataTable,
  dataTableActionsCellClass,
  dataTableActionsHeaderClass,
  type DataTableColumn,
} from "@/components/custom/DataTable"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { RECONCILIATION_ISSUE_LABELS } from "@/lib/requests/constants"
import type { HardwareReconciliation } from "@/lib/requests/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"
import { ReconciliationStatusBadge } from "@/app/(dashboard)/requests/_components/request-status-badge"

function AssetCell({ row }: { row: HardwareReconciliation }) {
  return (
    <div className="min-w-0">
      <span className={cn("block truncate", typeScale.body.emphasis)}>{row.assetName}</span>
      <span className={cn("block truncate font-mono tabular-nums", typeScale.caption.meta)}>
        {row.assetTag}
      </span>
    </div>
  )
}

function ActionsCell({
  row,
  canManage,
  onView,
  onReconcile,
  onDismiss,
}: {
  row: HardwareReconciliation
  canManage: boolean
  onView: (item: HardwareReconciliation) => void
  onReconcile: (item: HardwareReconciliation) => void
  onDismiss: (item: HardwareReconciliation) => void
}) {
  const isPending = row.status === "pending"

  return (
    <div className="flex w-full items-center justify-end gap-1">
      <Button variant="ghost" size="icon-sm" aria-label="View reconciliation" onClick={() => onView(row)}>
        <Eye />
      </Button>
      {canManage && isPending ? (
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Mark reconciled"
            className="text-success hover:bg-success/10 hover:text-success"
            onClick={() => onReconcile(row)}
          >
            <Check />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Dismiss reconciliation"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDismiss(row)}
          >
            <X />
          </Button>
        </>
      ) : null}
    </div>
  )
}

export interface HardwareReconciliationsTableProps {
  rows: HardwareReconciliation[]
  showEmployeeColumn: boolean
  canManage: boolean
  onView: (item: HardwareReconciliation) => void
  onReconcile: (item: HardwareReconciliation) => void
  onDismiss: (item: HardwareReconciliation) => void
}

function HardwareReconciliationsTable({
  rows,
  showEmployeeColumn,
  canManage,
  onView,
  onReconcile,
  onDismiss,
}: HardwareReconciliationsTableProps) {
  const columns = useMemo<DataTableColumn<HardwareReconciliation>[]>(() => {
    const base: DataTableColumn<HardwareReconciliation>[] = [
      {
        id: "asset",
        header: "Asset",
        sortValue: (row) => row.assetName,
        cell: (row) => <AssetCell row={row} />,
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
        id: "issue",
        header: "Issue",
        sortValue: (row) => row.issueType,
        cell: (row) => (
          <span className={typeScale.body.muted}>{RECONCILIATION_ISSUE_LABELS[row.issueType]}</span>
        ),
      },
      {
        id: "flagged",
        header: "Flagged",
        sortValue: (row) => row.flaggedAt,
        cell: (row) => <span className={typeScale.body.muted}>{row.flaggedAt}</span>,
      },
      {
        id: "status",
        header: "Status",
        sortValue: (row) => row.status,
        cell: (row) => <ReconciliationStatusBadge status={row.status} />,
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
            onReconcile={onReconcile}
            onDismiss={onDismiss}
          />
        ),
      }
    )

    return base
  }, [showEmployeeColumn, canManage, onView, onReconcile, onDismiss])

  return (
    <DataTable<HardwareReconciliation>
      rowData={rows}
      columns={columns}
      pageSize={10}
      emptyState={
        <Empty className="border-0 bg-transparent py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Flag />
            </EmptyMedia>
            <EmptyTitle>No reconciliations match this view</EmptyTitle>
            <EmptyDescription>Try adjusting your filters or flag a hardware issue.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    />
  )
}

export { HardwareReconciliationsTable }
