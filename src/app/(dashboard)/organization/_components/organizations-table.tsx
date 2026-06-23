"use client"

import * as React from "react"
import { useMemo } from "react"
import { format, isValid, parseISO } from "date-fns"
import {
  Building2,
  Globe,
  Inbox,
  Mail,
  Pencil,
  Phone,
  Power,
  PowerOff,
  Sparkles,
  Trash2,
} from "lucide-react"

import { DataTable, dataTableActionsCellClass, dataTableActionsHeaderClass, type DataTableColumn } from "@/components/custom/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  formatOrganizationStatus,
  type Organization,
  type OrganizationStatus,
} from "@/lib/organization/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const statusBadgeVariant: Record<
  OrganizationStatus,
  "success" | "warning" | "destructive" | "secondary"
> = {
  active: "success",
  pending: "warning",
  suspended: "destructive",
  inactive: "secondary",
}

function formatActivatedAt(value: string) {
  if (!value) return "—"
  const parsed = parseISO(value)
  return isValid(parsed) ? format(parsed, "dd MMM yyyy") : value
}

function OrganizationCell({ row }: { row: Organization }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary ring-1 ring-border/60">
        <Building2 className="size-4" />
      </span>
      <div className="min-w-0">
        <span className={cn("block truncate", typeScale.body.emphasis)}>{row.name}</span>
        <span className={cn("block truncate font-mono", typeScale.caption.meta)}>{row.slug}</span>
      </div>
    </div>
  )
}

function StatusCell({ row }: { row: Organization }) {
  return (
    <Badge variant={statusBadgeVariant[row.status]}>{formatOrganizationStatus(row.status)}</Badge>
  )
}

function RegionCell({ row }: { row: Organization }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className={typeScale.body.default}>{row.timezone}</span>
      <span className={typeScale.caption.meta}>{row.defaultCurrency}</span>
    </div>
  )
}

function ContactCell({ row }: { row: Organization }) {
  const hasContact = row.billingEmail || row.companyPhone || row.website
  if (!hasContact) return <span className={typeScale.body.muted}>—</span>

  return (
    <div className="flex min-w-0 flex-col gap-1">
      {row.billingEmail ? (
        <span className={cn("inline-flex min-w-0 items-center gap-1.5 truncate", typeScale.caption.meta)}>
          <Mail className="size-3.5 shrink-0" />
          {row.billingEmail}
        </span>
      ) : null}
      {row.companyPhone ? (
        <span className={cn("inline-flex min-w-0 items-center gap-1.5 truncate", typeScale.caption.meta)}>
          <Phone className="size-3.5 shrink-0" />
          {row.companyPhone}
        </span>
      ) : null}
      {row.website ? (
        <span className={cn("inline-flex min-w-0 items-center gap-1.5 truncate", typeScale.caption.meta)}>
          <Globe className="size-3.5 shrink-0" />
          {row.website.replace(/^https?:\/\//, "")}
        </span>
      ) : null}
    </div>
  )
}

function ActionsCell({
  row,
  onEdit,
  onDelete,
  onOnboard,
  onToggleActive,
}: {
  row: Organization
  onEdit: (organization: Organization) => void
  onDelete: (organization: Organization) => void
  onOnboard: (organization: Organization) => void
  onToggleActive: (organization: Organization) => void
}) {
  const canOnboard = row.status === "pending"
  const canToggleActive = row.status === "active" || row.status === "inactive"

  return (
    <div className="flex w-full items-center justify-end gap-1">
      {canOnboard ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Onboard organization"
          onClick={() => onOnboard(row)}
        >
          <Sparkles />
        </Button>
      ) : null}
      {canToggleActive ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={row.status === "active" ? "Deactivate organization" : "Activate organization"}
          onClick={() => onToggleActive(row)}
        >
          {row.status === "active" ? <PowerOff /> : <Power />}
        </Button>
      ) : null}
      <Button variant="ghost" size="icon-sm" aria-label="Edit organization" onClick={() => onEdit(row)}>
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete organization"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onDelete(row)}
      >
        <Trash2 />
      </Button>
    </div>
  )
}

export interface OrganizationsTableProps {
  rows: Organization[]
  onEdit: (organization: Organization) => void
  onDelete: (organization: Organization) => void
  onOnboard: (organization: Organization) => void
  onToggleActive: (organization: Organization) => void
}

function OrganizationsTable({
  rows,
  onEdit,
  onDelete,
  onOnboard,
  onToggleActive,
}: OrganizationsTableProps) {
  const columns = useMemo<DataTableColumn<Organization>[]>(
    () => [
      {
        id: "name",
        header: "Organization",
        sortValue: (row) => row.name,
        cell: (row) => <OrganizationCell row={row} />,
      },
      {
        id: "industry",
        header: "Industry",
        sortValue: (row) => row.industry,
        cell: (row) => <span className={typeScale.body.default}>{row.industry || "—"}</span>,
      },
      {
        id: "size",
        header: "Size",
        sortValue: (row) => row.size,
        cell: (row) => <span className={typeScale.body.default}>{row.size}</span>,
      },
      {
        id: "status",
        header: "Status",
        sortValue: (row) => row.status,
        cell: (row) => <StatusCell row={row} />,
      },
      {
        id: "activatedAt",
        header: "Activated",
        sortValue: (row) => row.activatedAt,
        cell: (row) => (
          <span className={typeScale.body.default}>{formatActivatedAt(row.activatedAt)}</span>
        ),
      },
      {
        id: "region",
        header: "Region",
        sortable: false,
        cell: (row) => <RegionCell row={row} />,
      },
      {
        id: "contact",
        header: "Contact",
        sortable: false,
        cell: (row) => <ContactCell row={row} />,
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
            onEdit={onEdit}
            onDelete={onDelete}
            onOnboard={onOnboard}
            onToggleActive={onToggleActive}
          />
        ),
      },
    ],
    [onEdit, onDelete, onOnboard, onToggleActive]
  )

  return (
    <DataTable<Organization>
      rowData={rows}
      columns={columns}
      pageSize={10}
      emptyState={
        <Empty className="border-0 bg-transparent py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>No organizations found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search or filters, or onboard a new organization.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    />
  )
}

export { OrganizationsTable }
