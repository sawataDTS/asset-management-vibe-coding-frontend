"use client"

import * as React from "react"
import { useMemo } from "react"
import { type ColDef, type ICellRendererParams } from "ag-grid-community"
import { Ban, CircleCheck, Inbox, RotateCcw } from "lucide-react"

import { DataTable } from "@/components/custom/DataTable"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { formatHistoryWhen, type LifecycleHistoryEntry } from "@/lib/employee-lifecycle/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const lifecycleCardClassName = "gap-0 py-0"
const lifecycleCardContentClassName = cn("p-(--card-spacing)", settingsControlClassName)

function ResultCell({ data }: ICellRendererParams<LifecycleHistoryEntry>) {
  if (!data) return null
  return (
    <div className={cn("flex items-center gap-3", typeScale.body.muted)}>
      <span className="inline-flex items-center gap-1 text-success">
        <CircleCheck className="size-3.5" />
        {data.successCount}
      </span>
      <span className="inline-flex items-center gap-1">
        <Ban className="size-3.5" />
        {data.skippedCount}
      </span>
      <span className="inline-flex items-center gap-1">
        <RotateCcw className="size-3.5" />
        {data.pendingCount}
      </span>
    </div>
  )
}

export interface HistoryTabProps {
  entries: LifecycleHistoryEntry[]
}

function HistoryTab({ entries }: HistoryTabProps) {
  const columnDefs = useMemo<ColDef<LifecycleHistoryEntry>[]>(
    () => [
      {
        headerName: "When",
        colId: "when",
        flex: 1.6,
        minWidth: 180,
        valueGetter: ({ data }) => (data ? formatHistoryWhen(data.when) : ""),
        cellClass: typeScale.body.muted,
      },
      {
        headerName: "Employee",
        field: "employeeName",
        flex: 1.2,
        minWidth: 140,
        cellClass: typeScale.body.emphasis,
      },
      {
        headerName: "Mode",
        field: "mode",
        flex: 1,
        minWidth: 100,
        cellClass: typeScale.body.muted,
      },
      {
        headerName: "Result",
        colId: "result",
        flex: 1,
        minWidth: 100,
        sortable: false,
        cellRenderer: ResultCell,
      },
    ],
    []
  )

  return (
    <Card className={lifecycleCardClassName}>
      <CardContent className={lifecycleCardContentClassName}>
        <DataTable<LifecycleHistoryEntry>
          rowData={entries}
          columnDefs={columnDefs}
          showPerPage={false}
          showJumpToPage={false}
          emptyState={
            <Empty className="border-0 bg-transparent py-12">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Inbox />
                </EmptyMedia>
                <EmptyTitle>No lifecycle history</EmptyTitle>
                <EmptyDescription>Onboarding and offboarding runs will appear here.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          }
        />
      </CardContent>
    </Card>
  )
}

export { HistoryTab }
