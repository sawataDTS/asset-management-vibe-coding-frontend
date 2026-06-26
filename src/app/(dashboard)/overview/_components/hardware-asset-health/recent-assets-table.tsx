"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { DataTable, type DataTableColumn } from "@/components/custom/DataTable"
import { typeScale } from "@/lib/typography"
import { TABLE_EMPTY_CELL } from "@/lib/table-empty"
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

const columns: DataTableColumn<RecentAsset>[] = [
  {
    id: "name",
    header: "Asset",
    sortValue: (row) => row.name,
    cell: (row) => (
      <div className="flex w-full flex-col gap-0.5">
        <span className={typeScale.body.emphasis}>{row.name}</span>
        <span className={cn(typeScale.caption.meta, "font-mono tabular-nums")}>{row.tag}</span>
      </div>
    ),
  },
  {
    id: "assignee",
    header: "Assignee",
    sortValue: (row) => row.assignee ?? "",
    cell: (row) =>
      row.assignee ? (
        <span className="text-foreground">{row.assignee}</span>
      ) : (
        <span className="text-muted-foreground">{TABLE_EMPTY_CELL}</span>
      ),
  },
  {
    id: "status",
    header: "Status",
    sortValue: (row) => row.status,
    cell: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>,
  },
  {
    id: "warranty",
    header: "Warranty",
    sortValue: (row) => row.warranty,
    cell: (row) => <span className="text-foreground">{row.warranty}</span>,
  },
]

export function RecentAssetsTable() {
  const previewRows = recentAssets.slice(0, 6)

  return (
    <DataTable<RecentAsset>
      rowData={previewRows}
      columns={columns}
      showPagination={false}
      emptyMessage="No assets have been onboarded yet."
    />
  )
}
