"use client"

import * as React from "react"
import { useMemo } from "react"
import { format, isValid, parseISO } from "date-fns"
import { type ColDef, type ICellRendererParams } from "ag-grid-community"
import { Activity, History, Inbox, Pencil, Trash2, User } from "lucide-react"

import { DataTable, dataTableActionsHeaderClass } from "@/components/custom/DataTable"
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

function AssetCell({ data }: ICellRendererParams<HardwareAsset>) {
  if (!data) return null
  return (
    <div className="flex min-w-0 flex-col justify-center gap-0.5">
      <span className={typeScale.body.emphasis}>{data.name}</span>
      <span className={cn(typeScale.caption.meta, "font-mono tabular-nums")}>{data.tag}</span>
    </div>
  )
}

function StatusCell({ data }: ICellRendererParams<HardwareAsset>) {
  if (!data) return null
  return <AssetStatusBadge status={data.status} />
}

function AssigneeCell({ value }: ICellRendererParams<HardwareAsset, string>) {
  return <span className={value ? typeScale.body.default : typeScale.body.muted}>{value || "—"}</span>
}

function LocationCell({ value }: ICellRendererParams<HardwareAsset, string>) {
  return <span className={typeScale.body.muted}>{value && value !== "—" ? value : "—"}</span>
}

function WarrantyCell({ value }: ICellRendererParams<HardwareAsset, string>) {
  return (
    <span className={cn(typeScale.body.muted, "font-mono tabular-nums")}>{formatWarranty(value ?? "")}</span>
  )
}

type ActionsCellProps = ICellRendererParams<HardwareAsset> & {
  onHistory: (asset: HardwareAsset) => void
  onAssign: (asset: HardwareAsset) => void
  onRepair: (asset: HardwareAsset) => void
  onEdit: (asset: HardwareAsset) => void
  onDelete: (asset: HardwareAsset) => void
}

function ActionsCell({ data, onHistory, onAssign, onRepair, onEdit, onDelete }: ActionsCellProps) {
  if (!data) return null
  return (
    <div className="flex w-full items-center justify-end gap-1">
      <Button variant="ghost" size="icon-sm" aria-label="View history" onClick={() => onHistory(data)}>
        <History />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={data.status === "Assigned" ? "Return asset" : "Assign asset"}
        onClick={() => onAssign(data)}
      >
        <User />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={data.status === "Repair" ? "Resolve repair" : "Send to repair"}
        onClick={() => onRepair(data)}
      >
        <Activity />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Edit asset" onClick={() => onEdit(data)}>
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete asset"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onDelete(data)}
      >
        <Trash2 />
      </Button>
    </div>
  )
}

function createActionsRenderer(handlers: Omit<ActionsCellProps, keyof ICellRendererParams>) {
  return (params: ICellRendererParams<HardwareAsset>) => <ActionsCell {...params} {...handlers} />
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
  const columnDefs = useMemo<ColDef<HardwareAsset>[]>(
    () => [
      {
        headerName: "Asset",
        field: "name",
        flex: 1.8,
        minWidth: 180,
        cellRenderer: AssetCell,
      },
      {
        headerName: "Category",
        field: "category",
        flex: 1,
        minWidth: 100,
        cellClass: typeScale.body.muted,
      },
      {
        headerName: "Status",
        field: "status",
        flex: 1,
        minWidth: 120,
        cellRenderer: StatusCell,
      },
      {
        headerName: "Assignee",
        field: "assignee",
        flex: 1.1,
        minWidth: 110,
        cellRenderer: AssigneeCell,
      },
      {
        headerName: "Supplier",
        field: "supplier",
        flex: 1,
        minWidth: 100,
        cellClass: typeScale.body.muted,
      },
      {
        headerName: "Location",
        field: "location",
        flex: 1.2,
        minWidth: 120,
        cellRenderer: LocationCell,
      },
      {
        headerName: "Warranty",
        field: "warranty",
        flex: 1,
        minWidth: 110,
        cellRenderer: WarrantyCell,
      },
      {
        headerName: "Actions",
        colId: "actions",
        flex: 1.4,
        minWidth: 180,
        sortable: false,
        headerClass: dataTableActionsHeaderClass,
        cellRenderer: createActionsRenderer({
          onHistory,
          onAssign,
          onRepair,
          onEdit,
          onDelete,
        }),
      },
    ],
    [onHistory, onAssign, onRepair, onEdit, onDelete]
  )

  return (
    <DataTable<HardwareAsset>
      rowData={rows}
      columnDefs={columnDefs}
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
