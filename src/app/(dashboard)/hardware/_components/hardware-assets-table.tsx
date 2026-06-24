"use client"

import * as React from "react"
import { useMemo } from "react"
import { format, isValid, parseISO } from "date-fns"
import { Activity, History, Inbox, Pencil, Trash2, User } from "lucide-react"

import {
  DataTable,
  dataTableActionsCellClass,
  dataTableActionsHeaderClass,
  type DataTableColumn,
} from "@/components/custom/DataTable"
import { AssetStatusBadge } from "./asset-status-badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import type { HardwareAsset } from "@/lib/hardware/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

function formatWarranty(value: string) {
  if (!value || value === "—" || value === "Expired") return value
  const parsed = parseISO(value)
  return isValid(parsed) ? format(parsed, "dd MMM yyyy") : value
}

function AssetCell({ row }: { row: HardwareAsset }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className={typeScale.body.emphasis}>{row.name}</span>
      <span className={cn(typeScale.caption.meta, "font-mono tabular-nums")}>{row.tag}</span>
    </div>
  )
}

function ActionsCell({
  row,
  onHistory,
  onAssign,
  onRepair,
  onEdit,
  onDelete,
}: {
  row: HardwareAsset
  onHistory: (asset: HardwareAsset) => void
  onAssign: (asset: HardwareAsset) => void
  onRepair: (asset: HardwareAsset) => void
  onEdit: (asset: HardwareAsset) => void
  onDelete: (asset: HardwareAsset) => void
}) {
  return (
    <div className="flex w-full items-center justify-end gap-1">
      <Button variant="ghost" size="icon-sm" aria-label="View history" onClick={() => onHistory(row)}>
        <History />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={row.status === "Assigned" ? "Return asset" : "Assign asset"}
        onClick={() => onAssign(row)}
      >
        <User />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={row.status === "Repair" ? "Resolve repair" : "Send to repair"}
        onClick={() => onRepair(row)}
      >
        <Activity />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Edit asset" onClick={() => onEdit(row)}>
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete asset"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onDelete(row)}
      >
        <Trash2 />
      </Button>
    </div>
  )
}

export interface HardwareAssetsTableProps {
  rows: HardwareAsset[]
  onHistory: (asset: HardwareAsset) => void
  onAssign: (asset: HardwareAsset) => void
  onRepair: (asset: HardwareAsset) => void
  onEdit: (asset: HardwareAsset) => void
  onDelete: (asset: HardwareAsset) => void
}

function HardwareAssetsTable({
  rows,
  onHistory,
  onAssign,
  onRepair,
  onEdit,
  onDelete,
}: HardwareAssetsTableProps) {
  const columns = useMemo<DataTableColumn<HardwareAsset>[]>(
    () => [
      {
        id: "name",
        header: "Asset",
        sortValue: (row) => row.name,
        cell: (row) => <AssetCell row={row} />,
      },
      {
        id: "category",
        header: "Category",
        sortValue: (row) => row.category,
        cellClassName: typeScale.body.muted,
        cell: (row) => row.category,
      },
      {
        id: "status",
        header: "Status",
        sortValue: (row) => row.status,
        cell: (row) => <AssetStatusBadge status={row.status} />,
      },
      {
        id: "assignee",
        header: "Assignee",
        sortValue: (row) => row.assignee,
        cell: (row) => (
          <span className={row.assignee ? typeScale.body.default : typeScale.body.muted}>
            {row.assignee || "—"}
          </span>
        ),
      },
      {
        id: "supplier",
        header: "Supplier",
        sortValue: (row) => row.supplier,
        cellClassName: typeScale.body.muted,
        cell: (row) => row.supplier,
      },
      {
        id: "location",
        header: "Location",
        sortValue: (row) => row.location,
        cellClassName: typeScale.body.muted,
        cell: (row) => (row.location && row.location !== "—" ? row.location : "—"),
      },
      {
        id: "warranty",
        header: "Warranty",
        sortValue: (row) => row.warranty,
        cellClassName: cn(typeScale.body.muted, "font-mono tabular-nums"),
        cell: (row) => formatWarranty(row.warranty),
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
            onAssign={onAssign}
            onRepair={onRepair}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [onHistory, onAssign, onRepair, onEdit, onDelete]
  )

  return (
    <DataTable<HardwareAsset>
      rowData={rows}
      columns={columns}
      pageSize={10}
      emptyState={
        <Empty className="border-0 bg-transparent py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>No hardware assets found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search query or filters to find inventory items.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    />
  )
}

export { HardwareAssetsTable }
