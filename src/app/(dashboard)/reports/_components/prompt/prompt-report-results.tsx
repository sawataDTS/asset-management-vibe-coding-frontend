"use client"

import * as React from "react"
import { ChevronDown, FileText, Sparkles } from "lucide-react"

import {
  REPORT_PAGE_SIZE,
  ReportCardHeader,
  ReportCardPaginationFooter,
  ReportCardShell,
} from "../shared/report-card-shell"
import { REPORT_TAB_ICONS } from "../shared/report-tab-icons"
import { ReportStatusBadge } from "../shared/report-status-badge"
import { MetricCard } from "@/components/ui/metric-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { PromptReportColumn, PromptReportResult } from "@/lib/reports/prompt"
import { accentIconTileClassName } from "@/lib/surface"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const tableHeadClassName = cn(
  "h-auto bg-muted/50 px-3.5 py-2.5 align-middle whitespace-nowrap",
  typeScale.caption.tableHeader
)
const tableCellClassName = "px-3.5 py-3 align-middle whitespace-normal"

function formatStatusLabel(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}

function isStatusColumn(column: PromptReportColumn) {
  return /status/i.test(column.key) || /status/i.test(column.header)
}

function PromptReportCell({ column, value }: { column: PromptReportColumn; value: string | undefined }) {
  if (!value) return "—"

  if (isStatusColumn(column)) {
    return <ReportStatusBadge badge={formatStatusLabel(value)} />
  }

  return value
}

type PromptReportResultsProps = {
  result: PromptReportResult
  generatedOn: string
}

function PromptReportResults({ result, generatedOn }: PromptReportResultsProps) {
  const [currentPage, setCurrentPage] = React.useState(0)
  const [sqlOpen, setSqlOpen] = React.useState(false)

  const totalPages = Math.max(1, Math.ceil(result.rows.length / REPORT_PAGE_SIZE))
  const pageIndex = Math.min(currentPage, Math.max(0, totalPages - 1))
  const startIndex = pageIndex * REPORT_PAGE_SIZE
  const pageRows = result.rows.slice(startIndex, startIndex + REPORT_PAGE_SIZE)
  const rangeStart = result.rows.length === 0 ? 0 : startIndex + 1
  const rangeEnd = Math.min(startIndex + REPORT_PAGE_SIZE, result.rows.length)
  const hasFooter = result.rows.length > 0

  const kpiColumns =
    result.kpis.length >= 3
      ? "sm:grid-cols-2 xl:grid-cols-3"
      : result.kpis.length === 1
        ? "max-w-xs"
        : "sm:grid-cols-2"

  return (
    <div className="flex flex-col gap-6">
      <Card className="gap-0 border border-primary/25 bg-linear-to-b from-primary/8 via-accent/30 to-card py-0 ring-1 ring-primary/15">
        <CardContent className="flex items-start gap-3 p-(--card-spacing)">
          <span className={accentIconTileClassName}>
            <Sparkles className="size-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <h3 className={typeScale.title}>Executive summary</h3>
            <p className={cn("mt-1.5 leading-relaxed", typeScale.body.muted)}>{result.summary}</p>
          </div>
        </CardContent>
      </Card>

      <Collapsible open={sqlOpen} onOpenChange={setSqlOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="h-auto px-0 text-muted-foreground hover:text-foreground">
            View generated SQL
            <ChevronDown className={cn("transition-transform", sqlOpen && "rotate-180")} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-foreground">
            {result.sql}
          </pre>
        </CollapsibleContent>
      </Collapsible>

      <div className={cn("grid grid-cols-1 gap-4", kpiColumns)}>
        {result.kpis.map((kpi) => (
          <MetricCard key={kpi.label} label={kpi.label} value={kpi.value} />
        ))}
      </div>

      <ReportCardShell>
        <ReportCardHeader
          title={result.title}
          description={`${result.description} · generated ${generatedOn}`}
          rowCount={result.rows.length}
          icon={REPORT_TAB_ICONS.prompt}
        />

        {pageRows.length === 0 ? (
          <Empty className="border-0 py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>No rows returned for this prompt.</EmptyTitle>
              <EmptyDescription>
                Try a different question or connect the required data source.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  {result.columns.map((column) => (
                    <TableHead key={column.key} className={tableHeadClassName}>
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((row, rowIndex) => (
                  <TableRow key={`${startIndex + rowIndex}`} className="border-border">
                    {result.columns.map((column) => (
                      <TableCell key={column.key} className={tableCellClassName}>
                        <PromptReportCell column={column} value={row[column.key]} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {hasFooter ? (
          <ReportCardPaginationFooter
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            totalRows={result.rows.length}
            pageIndex={pageIndex}
            totalPages={totalPages}
            onPrevious={() => setCurrentPage((page) => Math.max(0, Math.min(page, totalPages - 1) - 1))}
            onNext={() =>
              setCurrentPage((page) => Math.min(totalPages - 1, Math.min(page, totalPages - 1) + 1))
            }
          />
        ) : null}
      </ReportCardShell>
    </div>
  )
}

export { PromptReportResults }
