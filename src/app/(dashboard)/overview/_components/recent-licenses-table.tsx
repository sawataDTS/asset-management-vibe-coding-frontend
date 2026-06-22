"use client"

import * as React from "react"
import { type ColDef, type ICellRendererParams } from "ag-grid-community"

import { LicenseStatusBadge } from "@/app/(dashboard)/software/_components/license-status-badge"
import { DataTable } from "@/components/custom/DataTable"
import { typeScale } from "@/lib/typography"
import type { LicenseStatus } from "@/lib/software/data"

export interface RecentLicense {
  name: string
  vendor: string
  seatsUsed: number
  seatsTotal: number
  status: LicenseStatus
  expires: string | null
}

const recentLicenses: RecentLicense[] = [
  { name: "META Whatsapp #4", vendor: "META", seatsUsed: 0, seatsTotal: 1, status: "Active", expires: null },
  { name: "META Whatsapp #6", vendor: "META", seatsUsed: 0, seatsTotal: 1, status: "Active", expires: null },
  { name: "META Whatsapp #2", vendor: "META", seatsUsed: 0, seatsTotal: 1, status: "Active", expires: null },
  { name: "Microsoft 365 E3", vendor: "Microsoft", seatsUsed: 1, seatsTotal: 5, status: "Active", expires: "Dec 2026" },
  { name: "Slack Business+", vendor: "Slack", seatsUsed: 0, seatsTotal: 10, status: "Expiring Soon", expires: "Aug 2026" },
  { name: "Zoom Pro", vendor: "Zoom", seatsUsed: 2, seatsTotal: 5, status: "Active", expires: "Jan 2027" },
]

function LicenseCell({ data }: ICellRendererParams<RecentLicense>) {
  if (!data) return null
  return (
    <div className="flex w-full flex-col justify-center gap-0.5">
      <span className={typeScale.body.emphasis}>{data.name}</span>
      <span className={typeScale.caption.meta}>{data.vendor}</span>
    </div>
  )
}

function SeatsCell({ data }: ICellRendererParams<RecentLicense>) {
  if (!data) return null
  return (
    <div className="flex w-full items-center tabular-nums">
      <span className="text-foreground">{data.seatsUsed}</span>
      <span className="text-muted-foreground">/{data.seatsTotal}</span>
    </div>
  )
}

function StatusCell({ data }: ICellRendererParams<RecentLicense>) {
  if (!data) return null
  return (
    <div className="flex w-full items-center">
      <LicenseStatusBadge status={data.status} />
    </div>
  )
}

function ExpiresCell({ value }: ICellRendererParams<RecentLicense, string | null>) {
  return (
    <div className="flex w-full items-center">
      {value ? (
        <span className="text-foreground tabular-nums">{value}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      )}
    </div>
  )
}

const columnDefs: ColDef<RecentLicense>[] = [
  { headerName: "License", field: "name", flex: 2, minWidth: 180, cellRenderer: LicenseCell },
  { headerName: "Seats", field: "seatsUsed", flex: 1, minWidth: 80, cellRenderer: SeatsCell },
  { headerName: "Status", field: "status", flex: 1, minWidth: 120, cellRenderer: StatusCell },
  { headerName: "Expires", field: "expires", flex: 1, minWidth: 100, cellRenderer: ExpiresCell },
]

export function RecentLicensesTable() {
  const previewRows = recentLicenses.slice(0, 3)

  return (
    <DataTable<RecentLicense>
      rowData={previewRows}
      columnDefs={columnDefs}
      showPagination={false}
      showPerPage={false}
      showJumpToPage={false}
      emptyMessage="No licenses have been onboarded yet."
    />
  )
}
