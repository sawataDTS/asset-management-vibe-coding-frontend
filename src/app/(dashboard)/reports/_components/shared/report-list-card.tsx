"use client"

import * as React from "react"
import { FileText, type LucideIcon } from "lucide-react"
import { toast } from "sonner"

import {
  REPORT_PAGE_SIZE,
  ReportCardHeader,
  ReportCardPaginationFooter,
  ReportCardShell,
  reportListRowClassName,
} from "./report-card-shell"
import { ReportStatusBadge } from "./report-status-badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import type { ReportRow } from "@/lib/reports/types"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

type ReportListCardProps = {
  title: string
  description: string
  generatedOn: string
  rows: ReportRow[]
  icon?: LucideIcon
  emptyMessage?: string
  onRowAction?: (row: ReportRow) => void
  pageSize?: number
  showPagination?: boolean
}

function ReportRowTrailing({ row, onRowAction }: { row: ReportRow; onRowAction?: (row: ReportRow) => void }) {
  if (row.actionLabel) {
    return (
      <Button
        variant="outline"
        size="sm"
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
    return <span className={cn("shrink-0 tabular-nums", typeScale.body.emphasis)}>{row.trailingText}</span>
  }

  if (row.badge) {
    return <ReportStatusBadge badge={row.badge} badgeVariant={row.badgeVariant} />
  }

  return null
}

function ReportListCard({
  title,
  description,
  generatedOn,
  rows,
  icon: HeaderIcon = FileText,
  emptyMessage,
  onRowAction,
  pageSize = REPORT_PAGE_SIZE,
  showPagination = true,
}: ReportListCardProps) {
  const [currentPage, setCurrentPage] = React.useState(0)

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const pageIndex = Math.min(currentPage, Math.max(0, totalPages - 1))

  const pageRows = React.useMemo(() => {
    if (!showPagination) return rows
    const offset = pageIndex * pageSize
    return rows.slice(offset, offset + pageSize)
  }, [rows, pageIndex, pageSize, showPagination])

  const rangeStart = rows.length === 0 ? 0 : pageIndex * pageSize + 1
  const rangeEnd = Math.min((pageIndex + 1) * pageSize, rows.length)
  const hasFooter = showPagination && rows.length > 0

  return (
    <ReportCardShell>
      <ReportCardHeader
        title={title}
        description={`${description} · generated ${generatedOn}`}
        rowCount={rows.length}
        icon={HeaderIcon}
      />

      {pageRows.length === 0 ? (
        <Empty className="border-0 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HeaderIcon />
            </EmptyMedia>
            <EmptyTitle>{emptyMessage ?? "No rows match this report."}</EmptyTitle>
            {!emptyMessage ? (
              <EmptyDescription>
                Try adjusting your filters or switch to another report view.
              </EmptyDescription>
            ) : null}
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="divide-y divide-border">
          {pageRows.map((row) => (
            <li key={row.id} className={reportListRowClassName}>
              <div className="min-w-0">
                <p className={typeScale.body.emphasis}>{row.title}</p>
                <p className={cn("mt-1", typeScale.caption.meta)}>{row.subtitle}</p>
              </div>
              <ReportRowTrailing row={row} onRowAction={onRowAction} />
            </li>
          ))}
        </ul>
      )}

      {hasFooter ? (
        <ReportCardPaginationFooter
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          totalRows={rows.length}
          pageIndex={pageIndex}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage((page) => Math.max(0, Math.min(page, totalPages - 1) - 1))}
          onNext={() =>
            setCurrentPage((page) => Math.min(totalPages - 1, Math.min(page, totalPages - 1) + 1))
          }
        />
      ) : null}
    </ReportCardShell>
  )
}

export { ReportListCard }
