"use client"

import * as React from "react"
import { useMemo } from "react"
import { Ban, CircleCheck, Inbox, RotateCcw } from "lucide-react"

import { DataTable, type DataTableColumn } from "@/components/custom/DataTable"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Badge } from "@/components/ui/badge"
import { CardContainer } from "@/components/ui/card-container"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { formatHistoryWhen, type LifecycleHistoryEntry } from "@/lib/employee-lifecycle/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const lifecycleCardContentClassName = settingsControlClassName

const MODE_VARIANT: Record<LifecycleHistoryEntry["mode"], React.ComponentProps<typeof Badge>["variant"]> = {
  onboard: "success",
  offboard: "info",
}

const MODE_LABEL: Record<LifecycleHistoryEntry["mode"], string> = {
  onboard: "Onboard",
  offboard: "Offboard",
}

function ModeCell({ row }: { row: LifecycleHistoryEntry }) {
  return (
    <Badge variant={MODE_VARIANT[row.mode]} className="w-fit">
      {MODE_LABEL[row.mode]}
    </Badge>
  )
}

function ResultCell({ row }: { row: LifecycleHistoryEntry }) {
  return (
    <div className={cn("flex items-center gap-3", typeScale.body.muted)}>
      <span className="inline-flex items-center gap-1 text-success">
        <CircleCheck className="size-3.5" />
        {row.successCount}
      </span>
      <span className="inline-flex items-center gap-1">
        <Ban className="size-3.5" />
        {row.skippedCount}
      </span>
      <span className="inline-flex items-center gap-1">
        <RotateCcw className="size-3.5" />
        {row.pendingCount}
      </span>
    </div>
  )
}

export interface HistoryTabProps {
  entries: LifecycleHistoryEntry[]
}

function HistoryTab({ entries }: HistoryTabProps) {
  const columns = useMemo<DataTableColumn<LifecycleHistoryEntry>[]>(
    () => [
      {
        id: "when",
        header: "When",
        sortValue: (row) => formatHistoryWhen(row.when),
        cellClassName: typeScale.body.muted,
        cell: (row) => formatHistoryWhen(row.when),
      },
      {
        id: "employeeName",
        header: "Employee",
        sortValue: (row) => row.employeeName,
        cellClassName: typeScale.body.emphasis,
        cell: (row) => row.employeeName,
      },
      {
        id: "mode",
        header: "Mode",
        sortValue: (row) => row.mode,
        cell: (row) => <ModeCell row={row} />,
      },
      {
        id: "result",
        header: "Result",
        sortable: false,
        cell: (row) => <ResultCell row={row} />,
      },
    ],
    []
  )

  return (
    <CardContainer contentClassName={lifecycleCardContentClassName}>
      <DataTable<LifecycleHistoryEntry>
        rowData={entries}
        columns={columns}
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
    </CardContainer>
  )
}

export { HistoryTab }
