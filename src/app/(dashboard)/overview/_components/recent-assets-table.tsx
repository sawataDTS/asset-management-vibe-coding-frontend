"use client"

import * as React from "react"
import { type ColDef, type ICellRendererParams } from "ag-grid-community"

import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/custom/DataTable"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

export interface RecentAsset {
  name: string
  tag: string
  assignee: string | null
  status: "In Stock" | "Assigned" | "In Repair"
  warranty: string
}

const STATUS_VARIANT: Record<RecentAsset["status"], React.ComponentProps<typeof Badge>["variant"]> = {
  "In Stock": "success",
  Assigned: "info",
  "In Repair": "warning",
}

const recentAssets: RecentAsset[] = [
  { name: 'MacBook Pro 14"', tag: "LAP-0049", assignee: null, status: "In Stock", warranty: "Jun 2027" },
  { name: 'MacBook Pro 14"', tag: "LAP-0051", assignee: null, status: "In Stock", warranty: "Jun 2027" },
  { name: 'MacBook Pro 14"', tag: "LAP-0047", assignee: null, status: "In Stock", warranty: "Jun 2027" },
  { name: 'MacBook Pro 14"', tag: "LAP-0048", assignee: null, status: "In Stock", warranty: "Jun 2027" },
  { name: 'MacBook Pro 14"', tag: "LAP-0050", assignee: null, status: "In Stock", warranty: "Jun 2027" },
  { name: "Lenovo 2", tag: "LAP-0040", assignee: null, status: "In Stock", warranty: "Jul 2026" },
  {
    name: "Dell Latitude 7440",
    tag: "LAP-0039",
    assignee: "John Doe",
    status: "Assigned",
    warranty: "Mar 2027",
  },
  {
    name: "Dell Latitude 7440",
    tag: "LAP-0038",
    assignee: "Priya Nair",
    status: "Assigned",
    warranty: "Mar 2027",
  },
  { name: "ThinkPad X1 Carbon", tag: "LAP-0035", assignee: null, status: "In Repair", warranty: "Sep 2026" },
  { name: 'iMac 24"', tag: "DSK-0012", assignee: null, status: "In Stock", warranty: "Nov 2026" },
  { name: "HP EliteBook 840", tag: "LAP-0031", assignee: null, status: "In Stock", warranty: "Feb 2027" },
  { name: "Surface Laptop 5", tag: "LAP-0028", assignee: null, status: "In Stock", warranty: "Aug 2026" },
]

function AssetCell({ data }: ICellRendererParams<RecentAsset>) {
  if (!data) return null
  return (
    <div className="flex w-full flex-col justify-center gap-0.5">
      <span className={typeScale.body.emphasis}>{data.name}</span>
      <span className={cn(typeScale.caption.meta, "font-mono tabular-nums")}>{data.tag}</span>
    </div>
  )
}

function AssigneeCell({ value }: ICellRendererParams<RecentAsset>) {
  return (
    <div className="flex w-full items-center">
      {value ? (
        <span className="text-foreground">{value}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      )}
    </div>
  )
}

function StatusCell({ value }: ICellRendererParams<RecentAsset, RecentAsset["status"]>) {
  if (!value) return null
  return (
    <div className="flex w-full items-center">
      <Badge variant={STATUS_VARIANT[value]}>{value}</Badge>
    </div>
  )
}

function WarrantyCell({ value }: ICellRendererParams<RecentAsset, string>) {
  return <div className="flex w-full items-center text-foreground">{value}</div>
}

const columnDefs: ColDef<RecentAsset>[] = [
  { headerName: "Asset", field: "name", flex: 2, minWidth: 180, cellRenderer: AssetCell },
  { headerName: "Assignee", field: "assignee", flex: 2, minWidth: 120, cellRenderer: AssigneeCell },
  { headerName: "Status", field: "status", flex: 1, minWidth: 120, cellRenderer: StatusCell },
  {
    headerName: "Warranty",
    field: "warranty",
    flex: 1,
    minWidth: 110,
    cellRenderer: WarrantyCell,
  },
]

export function RecentAssetsTable() {
  const previewRows = recentAssets.slice(0, 6)

  return (
    <DataTable<RecentAsset>
      rowData={previewRows}
      columnDefs={columnDefs}
      showPagination={false}
      showPerPage={false}
      showJumpToPage={false}
      emptyMessage="No assets have been onboarded yet."
    />
  )
}
