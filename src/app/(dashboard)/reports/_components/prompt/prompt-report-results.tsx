"use client"

import * as React from "react"
import { ChevronDown, FileText, Sparkles } from "lucide-react"

import { MetricCard } from "@/components/ui/metric-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { PromptReportResult } from "@/lib/reports/prompt"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 20

type PromptReportResultsProps = {
  result: PromptReportResult
  generatedOn: string
}

function PromptReportResults({ result, generatedOn }: PromptReportResultsProps) {
  const [page, setPage] = React.useState(1)
  const [sqlOpen, setSqlOpen] = React.useState(false)
  const totalPages = Math.max(1, Math.ceil(result.rows.length / PAGE_SIZE))

  React.useEffect(() => {
    setPage(1)
  }, [result])

  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const pageRows = result.rows.slice(startIndex, startIndex + PAGE_SIZE)
  const rangeStart = result.rows.length ? startIndex + 1 : 0
  const rangeEnd = Math.min(startIndex + PAGE_SIZE, result.rows.length)

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
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/80 text-primary ring-1 ring-primary/20">
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

      <Card className="gap-0 overflow-hidden py-0">
        <CardContent className="flex flex-col gap-0 p-0">
          <div className="flex flex-col gap-3 border-b border-border p-(--card-spacing) sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary ring-1 ring-border/60">
                <FileText className="size-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <h3 className={typeScale.title}>{result.title}</h3>
                <p className={cn("mt-1", typeScale.caption.meta)}>
                  {result.description} · generated {generatedOn}
                </p>
              </div>
            </div>
            <span className={cn("shrink-0", typeScale.caption.meta)}>
              {result.rows.length} {result.rows.length === 1 ? "row" : "rows"}
            </span>
          </div>

          {pageRows.length === 0 ? (
            <Empty className="border-0 py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText />
                </EmptyMedia>
                <EmptyTitle>No rows returned for this prompt.</EmptyTitle>
                <EmptyDescription>Try a different question or connect the required data source.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {result.columns.map((column) => (
                      <th
                        key={column.key}
                        className={cn("px-(--card-spacing) py-3", typeScale.caption.tableHeader)}
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row, rowIndex) => (
                    <tr key={`${startIndex + rowIndex}`} className="border-b border-border last:border-0">
                      {result.columns.map((column) => (
                        <td key={column.key} className={cn("px-(--card-spacing) py-3", typeScale.body.default)}>
                          {row[column.key] ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-border px-(--card-spacing) py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className={typeScale.caption.meta}>
              Showing {rangeStart}–{rangeEnd} of {result.rows.length}
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
    </div>
  )
}

export { PromptReportResults }
