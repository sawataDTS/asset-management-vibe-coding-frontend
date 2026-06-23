"use client"

import * as React from "react"
import { useMemo } from "react"
import { type ColDef, type ICellRendererParams } from "ag-grid-community"
import { Inbox, Mail, Pencil, Phone, Trash2, Truck } from "lucide-react"

import { DataTable, dataTableActionsHeaderClass } from "@/components/custom/DataTable"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { type Supplier } from "@/lib/suppliers/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

function SupplierCell({ data }: ICellRendererParams<Supplier>) {
  if (!data) return null
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary ring-1 ring-border/60">
        <Truck className="size-4" />
      </span>
      <div className="min-w-0">
        <span className={cn("block truncate", typeScale.body.emphasis)}>{data.name}</span>
        <span className={cn("block truncate", typeScale.caption.meta)}>
          {data.category || "—"}
        </span>
      </div>
    </div>
  )
}

function ContactCell({ data }: ICellRendererParams<Supplier>) {
  if (!data) return null
  const hasContact = data.contactName || data.contactEmail || data.contactPhone
  if (!hasContact) return <span className={typeScale.body.muted}>—</span>

  return (
    <div className="flex min-w-0 flex-col gap-1 py-1">
      {data.contactName ? (
        <span className={cn("truncate", typeScale.body.emphasis)}>{data.contactName}</span>
      ) : null}
      {data.contactEmail ? (
        <span className={cn("inline-flex min-w-0 items-center gap-1.5 truncate", typeScale.caption.meta)}>
          <Mail className="size-3.5 shrink-0" />
          {data.contactEmail}
        </span>
      ) : null}
      {data.contactPhone ? (
        <span className={cn("inline-flex min-w-0 items-center gap-1.5 truncate", typeScale.caption.meta)}>
          <Phone className="size-3.5 shrink-0" />
          {data.contactPhone}
        </span>
      ) : null}
    </div>
  )
}

function ProvidesCell({ data }: ICellRendererParams<Supplier>) {
  if (!data) return null
  const parts: string[] = []
  if (data.hardwareCount > 0) parts.push(`${data.hardwareCount} Hardware`)
  if (data.softwareCount > 0) parts.push(`${data.softwareCount} Software`)
  if (!data.hasVendorCert) parts.push("No vendor cert")

  if (parts.length === 0) {
    return <span className={typeScale.body.muted}>—</span>
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", typeScale.body.muted)}>
      {parts.map((part) => (
        <span key={part}>{part}</span>
      ))}
    </div>
  )
}

type ActionsCellProps = ICellRendererParams<Supplier> & {
  onEdit: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
}

function ActionsCell({ data, onEdit, onDelete }: ActionsCellProps) {
  if (!data) return null
  return (
    <div className="flex w-full items-center justify-end gap-1">
      <Button variant="ghost" size="icon-sm" aria-label="Edit supplier" onClick={() => onEdit(data)}>
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Remove supplier"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onDelete(data)}
      >
        <Trash2 />
      </Button>
    </div>
  )
}

function createActionsRenderer(handlers: Omit<ActionsCellProps, keyof ICellRendererParams>) {
  return (params: ICellRendererParams<Supplier>) => <ActionsCell {...params} {...handlers} />
}

export interface SuppliersTableProps {
  rows: Supplier[]
  onEdit: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
}

function SuppliersTable({ rows, onEdit, onDelete }: SuppliersTableProps) {
  const columnDefs = useMemo<ColDef<Supplier>[]>(
    () => [
      {
        headerName: "Supplier",
        field: "name",
        flex: 1.6,
        minWidth: 180,
        cellRenderer: SupplierCell,
      },
      {
        headerName: "Contact",
        colId: "contact",
        flex: 1.8,
        minWidth: 180,
        sortable: false,
        cellRenderer: ContactCell,
      },
      {
        headerName: "Provides",
        colId: "provides",
        flex: 2,
        minWidth: 220,
        sortable: false,
        cellRenderer: ProvidesCell,
      },
      {
        headerName: "Actions",
        colId: "actions",
        flex: 0.8,
        minWidth: 90,
        sortable: false,
        headerClass: dataTableActionsHeaderClass,
        cellRenderer: createActionsRenderer({ onEdit, onDelete }),
      },
    ],
    [onEdit, onDelete]
  )

  return (
    <DataTable<Supplier>
      rowData={rows}
      columnDefs={columnDefs}
      pageSize={10}
      emptyState={
        <Empty className="border-0 bg-transparent py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>No suppliers found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search, or add a vendor to your directory.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    />
  )
}

export { SuppliersTable }
