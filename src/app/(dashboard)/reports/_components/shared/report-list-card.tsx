"use client"

import * as React from "react"
import { FileText } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { ReportRow } from "@/lib/reports/types"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 20

const reportCardClassName = "gap-0 py-0 overflow-hidden"

type ReportListCardProps = {
  title: string
  description: string
  generatedOn: string
  rows: ReportRow[]
  emptyMessage?: string
  onRowAction?: (row: ReportRow) => void
}

function ReportRowTrailing({
  row,
  onRowAction,
}: {
  row: ReportRow
  onRowAction?: (row: ReportRow) => void
}) {
  if (row.actionLabel) {
    return (
      <Button
        variant="outline"
        className="shrink-0"
        onClick={() => {
          onRowAction?.(row)
          if (!onRowAction) {
            toast.success(`${row.actionLabel} queued for ${row.title}`)
          }
        }}
      >
        {row.actionLabel}
      </Button>
    )
  }

  if (row.trailingText) {
    return (
      <span className={cn("shrink-0 tabular-nums", typeScale.body.emphasis)}>{row.trailingText}</span>
    )
  }

  if (row.badge) {
    return (
      <Badge variant={row.badgeVariant ?? "secondary"} className="shrink-0">
        {row.badge}
      </Badge>
    )
  }

  return null
}

function ReportListCard({
  title,
  description,
  generatedOn,
  rows,
  emptyMessage,
  onRowAction,
}: ReportListCardProps) {
  const [page, setPage] = React.useState(1)
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))

  React.useEffect(() => {
    setPage(1)
  }, [rows])

  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const pageRows = rows.slice(startIndex, startIndex + PAGE_SIZE)
  const rangeStart = rows.length ? startIndex + 1 : 0
  const rangeEnd = Math.min(startIndex + PAGE_SIZE, rows.length)

  return (
    <Card className={reportCardClassName}>
      <CardContent className="flex flex-col gap-0 p-0">
        <div className="flex flex-col gap-3 border-b border-border p-(--card-spacing) sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary ring-1 ring-border/60">
              <FileText className="size-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <h3 className={typeScale.title}>{title}</h3>
              <p className={cn("mt-1", typeScale.caption.meta)}>
                {description} · generated {generatedOn}
              </p>
            </div>
          </div>
          <span className={cn("shrink-0", typeScale.caption.meta)}>
            {rows.length} {rows.length === 1 ? "row" : "rows"}
          </span>
        </div>

        {pageRows.length === 0 ? (
          <Empty className="border-0 py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{emptyMessage ?? "No rows match this report."}</EmptyTitle>
              {!emptyMessage ? (
                <EmptyDescription>Try adjusting your filters or switch to another report view.</EmptyDescription>
              ) : null}
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="divide-y divide-border">
            {pageRows.map((row) => (
              <li key={row.id} className="flex items-start justify-between gap-4 px-(--card-spacing) py-4">
                <div className="min-w-0">
                  <p className={typeScale.body.emphasis}>{row.title}</p>
                  <p className={cn("mt-1", typeScale.caption.meta)}>{row.subtitle}</p>
                </div>
                <ReportRowTrailing row={row} onRowAction={onRowAction} />
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-3 border-t border-border px-(--card-spacing) py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className={typeScale.caption.meta}>
            Showing {rangeStart}–{rangeEnd} of {rows.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={safePage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <span className={cn("min-w-12 text-center tabular-nums", typeScale.body.emphasis)}>
              {safePage}/{totalPages}
            </span>
            <Button
              variant="outline"
              disabled={safePage >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { ReportListCard }
