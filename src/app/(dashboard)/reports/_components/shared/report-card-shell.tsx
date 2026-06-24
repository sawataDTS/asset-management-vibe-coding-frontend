"use client"

import * as React from "react"
import { ChevronLeft, FileText, type LucideIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { accentIconTileClassName } from "@/lib/surface"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

export const REPORT_PAGE_SIZE = 10

export const reportShellClassName = "gap-0 overflow-hidden py-0"
export const reportHeaderClassName =
  "flex flex-col gap-3 border-b border-border px-(--card-spacing) py-5 sm:flex-row sm:items-center sm:justify-between"
export const reportFooterClassName =
  "flex flex-wrap items-center justify-between gap-3 border-t border-border px-(--card-spacing) py-3"
export const reportListRowClassName = "flex items-center justify-between gap-4 px-(--card-spacing) py-3"

type ReportCardShellProps = {
  children: React.ReactNode
  className?: string
}

function ReportCardShell({ children, className }: ReportCardShellProps) {
  return (
    <Card className={cn(reportShellClassName, className)}>
      <div className="flex flex-col">{children}</div>
    </Card>
  )
}

type ReportCardHeaderProps = {
  title: string
  description: string
  rowCount: number
  icon?: LucideIcon
}

function ReportCardHeader({ title, description, rowCount, icon: Icon = FileText }: ReportCardHeaderProps) {
  return (
    <div className={reportHeaderClassName}>
      <div className="flex min-w-0 items-center gap-3">
        <span className={accentIconTileClassName}>
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h3 className={typeScale.title}>{title}</h3>
          <p className={cn("mt-1", typeScale.caption.meta)}>{description}</p>
        </div>
      </div>
      <span className={cn("shrink-0", typeScale.caption.meta)}>
        {rowCount} {rowCount === 1 ? "row" : "rows"}
      </span>
    </div>
  )
}

type ReportCardPaginationFooterProps = {
  rangeStart: number
  rangeEnd: number
  totalRows: number
  pageIndex: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
}

function ReportCardPaginationFooter({
  rangeStart,
  rangeEnd,
  totalRows,
  pageIndex,
  totalPages,
  onPrevious,
  onNext,
}: ReportCardPaginationFooterProps) {
  return (
    <div className={reportFooterClassName}>
      <span className={typeScale.caption.meta}>
        Showing {rangeStart}–{rangeEnd} of {totalRows}
      </span>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Previous page"
          disabled={pageIndex === 0}
          onClick={onPrevious}
          className={cn(
            "inline-flex items-center gap-0.5 text-sm transition-colors disabled:cursor-not-allowed",
            typeScale.body.muted,
            "hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground"
          )}
        >
          <ChevronLeft className="size-4" />
          Previous
        </button>

        <span
          className={cn(
            "inline-flex min-w-14 items-center justify-center rounded-md border border-border bg-card px-3 py-1 tabular-nums",
            typeScale.body.default
          )}
        >
          {pageIndex + 1} / {totalPages}
        </span>

        <button
          type="button"
          aria-label="Next page"
          disabled={pageIndex >= totalPages - 1}
          onClick={onNext}
          className={cn(
            "inline-flex items-center gap-0.5 text-sm transition-colors disabled:cursor-not-allowed",
            pageIndex >= totalPages - 1 ? typeScale.body.muted : typeScale.body.emphasis,
            "hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground"
          )}
        >
          Next
          <ChevronLeft className="size-4 rotate-180" />
        </button>
      </div>
    </div>
  )
}

export { ReportCardShell, ReportCardHeader, ReportCardPaginationFooter }
