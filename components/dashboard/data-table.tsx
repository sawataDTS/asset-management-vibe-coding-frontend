"use client"

import * as React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type ColumnDef<T> = {
  key: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  className?: string
}

export function DataTable<T>({
  columns,
  rows,
  className,
}: {
  columns: ColumnDef<T>[]
  rows: T[]
  className?: string
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl ring-1 ring-border/60", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            {columns.map((col) => (
              <TableHead key={col.key} className={cn("px-4", col.className)}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx} className="hover:bg-muted/40">
              {columns.map((col) => (
                <TableCell key={col.key} className={cn("px-4 py-3", col.className)}>
                  {col.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

