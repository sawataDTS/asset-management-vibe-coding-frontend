"use client"

import * as React from "react"
import { useMemo } from "react"
import { format, parseISO, isValid } from "date-fns"
import { type ColDef, type ICellRendererParams } from "ag-grid-community"
import { History, Inbox, Pencil, Trash2, Users } from "lucide-react"

import { DataTable, dataTableActionsHeaderClass } from "@/components/custom/DataTable"
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

function SoftwarePlanCell({ data }: ICellRendererParams<SoftwareLicense>) {
  if (!data) return null
  return (
    <div className="flex min-w-0 flex-col justify-center gap-0.5">
      <span className={typeScale.body.emphasis}>{data.name}</span>
      <span className={cn("truncate", typeScale.caption.meta)}>{data.supplier}</span>
    </div>
  )
}

function SeatsCell({ data }: ICellRendererParams<SoftwareLicense>) {
  if (!data) return null
  return <SeatUtilization assigned={data.assignedSeats} total={data.totalSeats} />
}

function StatusCell({ data }: ICellRendererParams<SoftwareLicense>) {
  if (!data) return null
  return <LicenseStatusBadge status={data.status} />
}

function CostCell({ value }: ICellRendererParams<SoftwareLicense, string>) {
  return <span className={cn(typeScale.body.tabularEmphasis, "font-mono")}>{value ?? "—"}</span>
}

function RenewalCell({ value }: ICellRendererParams<SoftwareLicense, string>) {
  return (
    <span className={cn(typeScale.body.muted, "font-mono tabular-nums")}>
      {formatRenewalDate(value ?? "")}
    </span>
  )
}

type ActionsCellProps = ICellRendererParams<SoftwareLicense> & {
  onHistory: (license: SoftwareLicense) => void
  onSeats: (license: SoftwareLicense) => void
  onEdit: (license: SoftwareLicense) => void
  onDelete: (license: SoftwareLicense) => void
}

function ActionsCell({ data, onHistory, onSeats, onEdit, onDelete }: ActionsCellProps) {
  if (!data) return null
  return (
    <div className="flex w-full items-center justify-end gap-1">
      <Button variant="ghost" size="icon-sm" aria-label="View history" onClick={() => onHistory(data)}>
        <History />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Manage seats" onClick={() => onSeats(data)}>
        <Users />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Edit plan" onClick={() => onEdit(data)}>
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete subscription"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onDelete(data)}
      >
        <Trash2 />
      </Button>
    </div>
  )
}

function createActionsRenderer(handlers: Omit<ActionsCellProps, keyof ICellRendererParams>) {
  return (params: ICellRendererParams<SoftwareLicense>) => <ActionsCell {...params} {...handlers} />
}

export interface SoftwareLicensesTableProps {
  rows: SoftwareLicense[]
  onHistory: (license: SoftwareLicense) => void
  onSeats: (license: SoftwareLicense) => void
  onEdit: (license: SoftwareLicense) => void
  onDelete: (license: SoftwareLicense) => void
}

function SoftwareLicensesTable({ rows, onHistory, onSeats, onEdit, onDelete }: SoftwareLicensesTableProps) {
  const columnDefs = useMemo<ColDef<SoftwareLicense>[]>(
    () => [
      {
        headerName: "Software Plan",
        field: "name",
        flex: 2.2,
        minWidth: 240,
        cellRenderer: SoftwarePlanCell,
      },
      {
        headerName: "Seat Allocation",
        colId: "seats",
        flex: 2,
        minWidth: 200,
        cellRenderer: SeatsCell,
        sortable: false,
      },
      {
        headerName: "Status",
        field: "status",
        flex: 1,
        minWidth: 130,
        cellRenderer: StatusCell,
      },
      {
        headerName: "Cost",
        field: "cost",
        flex: 1,
        minWidth: 110,
        cellRenderer: CostCell,
      },
      {
        headerName: "Renewal",
        field: "renewalDate",
        flex: 1,
        minWidth: 120,
        cellRenderer: RenewalCell,
      },
      {
        headerName: "Actions",
        colId: "actions",
        flex: 1.2,
        minWidth: 160,
        sortable: false,
        headerClass: dataTableActionsHeaderClass,
        cellRenderer: createActionsRenderer({ onHistory, onSeats, onEdit, onDelete }),
      },
    ],
    [onHistory, onSeats, onEdit, onDelete]
  )

  return (
    <DataTable<SoftwareLicense>
      rowData={rows}
      columnDefs={columnDefs}
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
