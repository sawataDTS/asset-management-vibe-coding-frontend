"use client"

import { useMemo } from "react"
import { Inbox, Mail, Pencil, Phone, Trash2, Truck } from "lucide-react"

import {
  DataTable,
  dataTableActionsCellClass,
  dataTableActionsHeaderClass,
  type DataTableColumn,
} from "@/components/custom/DataTable"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { type Supplier } from "@/lib/suppliers/data"
import { TABLE_EMPTY_CELL } from "@/lib/table-empty"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

function SupplierCell({ row }: { row: Supplier }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary ring-1 ring-border/60">
        <Truck className="size-4" />
      </span>
      <div className="min-w-0">
        <span className={cn("block truncate", typeScale.body.emphasis)}>{row.name}</span>
        <span className={cn("block truncate", typeScale.caption.meta)}>
          {row.category || TABLE_EMPTY_CELL}
        </span>
      </div>
    </div>
  )
}

function ContactCell({ row }: { row: Supplier }) {
  const hasContact = row.contactName || row.contactEmail || row.contactPhone
  if (!hasContact) return <span className={typeScale.body.muted}>{TABLE_EMPTY_CELL}</span>

  return (
    <div className="flex min-w-0 flex-col gap-1">
      {row.contactName ? (
        <span className={cn("truncate", typeScale.body.emphasis)}>{row.contactName}</span>
      ) : null}
      {row.contactEmail ? (
        <span className={cn("inline-flex min-w-0 items-center gap-1.5 truncate", typeScale.caption.meta)}>
          <Mail className="size-3.5 shrink-0" />
          {row.contactEmail}
        </span>
      ) : null}
      {row.contactPhone ? (
        <span className={cn("inline-flex min-w-0 items-center gap-1.5 truncate", typeScale.caption.meta)}>
          <Phone className="size-3.5 shrink-0" />
          {row.contactPhone}
        </span>
      ) : null}
    </div>
  )
}

function ProvidesCell({ row }: { row: Supplier }) {
  const parts: string[] = []
  if (row.hardwareCount > 0) parts.push(`${row.hardwareCount} Hardware`)
  if (row.softwareCount > 0) parts.push(`${row.softwareCount} Software`)
  if (!row.hasVendorCert) parts.push("No vendor cert")

  if (parts.length === 0) {
    return <span className={typeScale.body.muted}>{TABLE_EMPTY_CELL}</span>
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", typeScale.body.muted)}>
      {parts.map((part) => (
        <span key={part}>{part}</span>
      ))}
    </div>
  )
}

function ActionsCell({
  row,
  onEdit,
  onDelete,
}: {
  row: Supplier
  onEdit: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
}) {
  return (
    <div className="flex w-full items-center justify-end gap-1">
      <Button variant="ghost" size="icon-sm" aria-label="Edit supplier" onClick={() => onEdit(row)}>
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Remove supplier"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onDelete(row)}
      >
        <Trash2 />
      </Button>
    </div>
  )
}

export interface SuppliersTableProps {
  rows: Supplier[]
  onEdit: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
}

function SuppliersTable({ rows, onEdit, onDelete }: SuppliersTableProps) {
  const columns = useMemo<DataTableColumn<Supplier>[]>(
    () => [
      {
        id: "name",
        header: "Supplier",
        sortValue: (row) => row.name,
        cell: (row) => <SupplierCell row={row} />,
      },
      {
        id: "contact",
        header: "Contact",
        sortable: false,
        cell: (row) => <ContactCell row={row} />,
      },
      {
        id: "provides",
        header: "Provides",
        sortable: false,
        cell: (row) => <ProvidesCell row={row} />,
      },
      {
        id: "actions",
        header: "Actions",
        sortable: false,
        align: "right",
        headerClassName: dataTableActionsHeaderClass,
        cellClassName: dataTableActionsCellClass,
        cell: (row) => <ActionsCell row={row} onEdit={onEdit} onDelete={onDelete} />,
      },
    ],
    [onEdit, onDelete]
  )

  return (
    <DataTable<Supplier>
      rowData={rows}
      columns={columns}
      pageSize={10}
      emptyState={
        <Empty className="border-0 bg-transparent py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>No suppliers found</EmptyTitle>
            <EmptyDescription>Try adjusting your search, or add a vendor to your directory.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    />
  )
}

export { SuppliersTable }
