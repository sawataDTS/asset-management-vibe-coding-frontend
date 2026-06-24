"use client"

import * as React from "react"
import { useMemo } from "react"
import { format, parseISO, isValid } from "date-fns"
import { History, Inbox, Pencil, Trash2, Users } from "lucide-react"

import {
  DataTable,
  dataTableActionsCellClass,
  dataTableActionsHeaderClass,
  type DataTableColumn,
} from "@/components/custom/DataTable"
import { LicenseStatusBadge } from "./license-status-badge"
import { SeatUtilization } from "./seat-utilization"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import type { SoftwareLicense } from "@/lib/software/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

function formatRenewalDate(value: string) {
  if (!value || value === "—") return "—"
  const parsed = parseISO(value)
  return isValid(parsed) ? format(parsed, "dd MMM yyyy") : value
}

function SoftwarePlanCell({ row }: { row: SoftwareLicense }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className={typeScale.body.emphasis}>{row.name}</span>
      <span className={cn("truncate", typeScale.caption.meta)}>{row.supplier}</span>
    </div>
  )
}

function ActionsCell({
  row,
  onHistory,
  onSeats,
  onEdit,
  onDelete,
}: {
  row: SoftwareLicense
  onHistory: (license: SoftwareLicense) => void
  onSeats: (license: SoftwareLicense) => void
  onEdit: (license: SoftwareLicense) => void
  onDelete: (license: SoftwareLicense) => void
}) {
  return (
    <div className="flex w-full items-center justify-end gap-1">
      <Button variant="ghost" size="icon-sm" aria-label="View history" onClick={() => onHistory(row)}>
        <History />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Manage seats" onClick={() => onSeats(row)}>
        <Users />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Edit plan" onClick={() => onEdit(row)}>
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete subscription"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onDelete(row)}
      >
        <Trash2 />
      </Button>
    </div>
  )
}

export interface SoftwareLicensesTableProps {
  rows: SoftwareLicense[]
  onHistory: (license: SoftwareLicense) => void
  onSeats: (license: SoftwareLicense) => void
  onEdit: (license: SoftwareLicense) => void
  onDelete: (license: SoftwareLicense) => void
}

function SoftwareLicensesTable({ rows, onHistory, onSeats, onEdit, onDelete }: SoftwareLicensesTableProps) {
  const columns = useMemo<DataTableColumn<SoftwareLicense>[]>(
    () => [
      {
        id: "name",
        header: "Software Plan",
        sortValue: (row) => row.name,
        cell: (row) => <SoftwarePlanCell row={row} />,
      },
      {
        id: "seats",
        header: "Seat Allocation",
        sortable: false,
        cell: (row) => <SeatUtilization assigned={row.assignedSeats} total={row.totalSeats} />,
      },
      {
        id: "status",
        header: "Status",
        sortValue: (row) => row.status,
        cell: (row) => <LicenseStatusBadge status={row.status} />,
      },
      {
        id: "cost",
        header: "Cost",
        sortValue: (row) => row.cost,
        cellClassName: cn(typeScale.body.tabularEmphasis, "font-mono"),
        cell: (row) => row.cost ?? "—",
      },
      {
        id: "renewalDate",
        header: "Renewal",
        sortValue: (row) => row.renewalDate,
        cellClassName: cn(typeScale.body.muted, "font-mono tabular-nums"),
        cell: (row) => formatRenewalDate(row.renewalDate),
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
            onHistory={onHistory}
            onSeats={onSeats}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [onHistory, onSeats, onEdit, onDelete]
  )

  return (
    <DataTable<SoftwareLicense>
      rowData={rows}
      columns={columns}
      pageSize={10}
      emptyState={
        <Empty className="border-0 bg-transparent py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>No software subscriptions found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search query or filters to find license subscriptions.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    />
  )
}

export { SoftwareLicensesTable }
