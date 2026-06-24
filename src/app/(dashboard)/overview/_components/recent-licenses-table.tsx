"use client"

import * as React from "react"

import { LicenseStatusBadge } from "@/app/(dashboard)/software/_components/license-status-badge"
import { DataTable, type DataTableColumn } from "@/components/custom/DataTable"
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
  {
    name: "Microsoft 365 E3",
    vendor: "Microsoft",
    seatsUsed: 1,
    seatsTotal: 5,
    status: "Active",
    expires: "Dec 2026",
  },
  {
    name: "Slack Business+",
    vendor: "Slack",
    seatsUsed: 0,
    seatsTotal: 10,
    status: "Expiring Soon",
    expires: "Aug 2026",
  },
  { name: "Zoom Pro", vendor: "Zoom", seatsUsed: 2, seatsTotal: 5, status: "Active", expires: "Jan 2027" },
]

const columns: DataTableColumn<RecentLicense>[] = [
  {
    id: "name",
    header: "License",
    sortValue: (row) => row.name,
    cell: (row) => (
      <div className="flex w-full flex-col gap-0.5">
        <span className={typeScale.body.emphasis}>{row.name}</span>
        <span className={typeScale.caption.meta}>{row.vendor}</span>
      </div>
    ),
  },
  {
    id: "seatsUsed",
    header: "Seats",
    sortValue: (row) => row.seatsUsed,
    cell: (row) => (
      <div className="tabular-nums">
        <span className="text-foreground">{row.seatsUsed}</span>
        <span className="text-muted-foreground">/{row.seatsTotal}</span>
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    sortValue: (row) => row.status,
    cell: (row) => <LicenseStatusBadge status={row.status} />,
  },
  {
    id: "expires",
    header: "Expires",
    sortValue: (row) => row.expires ?? "",
    cell: (row) =>
      row.expires ? (
        <span className="text-foreground tabular-nums">{row.expires}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
]

export function RecentLicensesTable() {
  const previewRows = recentLicenses.slice(0, 3)

  return (
    <DataTable<RecentLicense>
      rowData={previewRows}
      columns={columns}
      showPagination={false}
      emptyMessage="No licenses have been onboarded yet."
    />
  )
}
