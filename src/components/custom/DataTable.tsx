"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { AgGridReact } from "ag-grid-react"
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type GridReadyEvent,
  type RowClassParams,
} from "ag-grid-community"
import ReactPaginate from "react-paginate"
import { ChevronLeft, Inbox } from "lucide-react"

import { cn } from "@/lib/utils"
import { typeScale } from "@/lib/typography"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { CustomSelect } from "./CustomSelect"

ModuleRegistry.registerModules([AllCommunityModule])

export const dataTableActionsHeaderClass = cn(typeScale.caption.tableHeader, "data-table-actions-header")

/**
 * A single, theme-aware grid theme derived from our design tokens. Because every
 * value is a CSS custom property, the table re-themes instantly with the rest of
 * the app when `data-theme` changes — no remount, no hardcoded colors.
 */
const dataTableTheme = themeQuartz.withParams({
  accentColor: "var(--color-primary)",
  backgroundColor: "var(--color-card)",
  foregroundColor: "var(--color-card-foreground)",
  borderColor: "var(--color-border)",
  chromeBackgroundColor: "var(--color-card)",
  headerBackgroundColor: "var(--color-muted)",
  headerTextColor: "var(--color-muted-foreground)",
  oddRowBackgroundColor: "transparent",
  rowHoverColor: "var(--color-muted)",
  selectedRowBackgroundColor: "color-mix(in oklch, var(--color-primary) 10%, var(--color-card))",
  rangeSelectionBorderColor: "var(--color-primary)",
  wrapperBorder: { width: 1, color: "var(--color-border)" },
  wrapperBorderRadius: "var(--radius-lg)",
  borderRadius: "var(--radius-md)",
  fontFamily: "inherit",
  fontSize: "0.875rem",
  headerFontSize: "0.75rem",
  headerFontWeight: 500,
  cellHorizontalPadding: "0.875rem",
  headerColumnResizeHandleColor: "var(--color-border)",
  rowBorder: { width: 1, color: "var(--color-border)" },
  columnBorder: false,
  headerColumnBorder: false,
})

interface DataTableProps<T> {
  rowData: T[]
  columnDefs: ColDef<T>[]
  pageSize?: number
  onRowClick?: (rowData: T) => void
  showPagination?: boolean
  showPerPage?: boolean
  showJumpToPage?: boolean
  resizable?: boolean
  loading?: boolean
  /** When set, the grid uses a fixed height with an internal scroll + sticky header. */
  height?: number | string
  /** Custom node rendered when there are no rows (and not loading). */
  emptyState?: React.ReactNode
  /** Convenience message for the default empty state. */
  emptyMessage?: string
  getRowClass?: (row: RowClassParams<T>) => string
  className?: string
}

export function DataTable<T extends object>({
  rowData,
  columnDefs,
  pageSize = 10,
  onRowClick,
  showPagination = true,
  showPerPage = true,
  showJumpToPage = true,
  resizable = false,
  loading,
  height,
  emptyState,
  emptyMessage = "No records to display.",
  getRowClass,
  className,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSizeCount, setPageSizeCount] = useState(pageSize)
  const [goToPage, setGoToPage] = useState("")
  const gridRef = useRef<AgGridReact<T>>(null)

  const totalPages = Math.ceil(rowData.length / Number(pageSizeCount))
  const isEmpty = !loading && rowData.length === 0
  const hasFixedHeight = height !== undefined

  const currentData = useMemo(() => {
    if (!showPagination) return rowData
    const size = Number(pageSizeCount)
    const offset = currentPage * size
    return rowData.slice(offset, offset + size)
  }, [rowData, currentPage, pageSizeCount, showPagination])

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)
  }

  const onGridReady = (params: GridReadyEvent<T>) => {
    params.api.sizeColumnsToFit()
  }

  function handleGoToPageSubmit() {
    const page = Number(goToPage) - 1
    if (!Number.isNaN(page) && page >= 0 && page < totalPages) {
      setCurrentPage(page)
      setGoToPage("")
    }
  }

  const handlePageSizeChange = (newSize: string | number | undefined) => {
    if (newSize === undefined || newSize === null) return
    const numericSize = typeof newSize === "string" ? parseInt(newSize, 10) : newSize
    setPageSizeCount(Number(numericSize))
    setCurrentPage(0)
  }

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(0)
    }
  }, [rowData.length, totalPages, currentPage])

  const gridKey = useMemo(
    () => `grid-${columnDefs.length}-${rowData.length}`,
    [columnDefs.length, rowData.length]
  )

  if (isEmpty) {
    return (
      <div className={cn("flex w-full flex-col", className)}>
        {emptyState ?? (
          <Empty className="rounded-xl border border-dashed border-border bg-card py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Inbox />
              </EmptyMedia>
              <EmptyTitle>Nothing here yet</EmptyTitle>
              <EmptyDescription>{emptyMessage}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    )
  }

  return (
    <div className={cn("data-table-root flex w-full flex-col gap-4", className)}>
      <div className="relative w-full" style={hasFixedHeight ? { height } : undefined}>
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-card/60 backdrop-blur-[1px]">
            <Spinner className="size-5 text-primary" />
          </div>
        )}
        <AgGridReact<T>
          key={gridKey}
          ref={gridRef}
          theme={dataTableTheme}
          onGridReady={onGridReady}
          rowData={currentData}
          columnDefs={columnDefs}
          loading={loading}
          rowHeight={56}
          headerHeight={40}
          suppressPaginationPanel
          suppressMovableColumns
          suppressCellFocus
          domLayout={hasFixedHeight ? "normal" : "autoHeight"}
          getRowClass={getRowClass}
          onRowClicked={(e) => onRowClick?.(e.data as T)}
          animateRows={false}
          suppressRowTransform
          defaultColDef={{
            sortable: true,
            resizable,
            unSortIcon: true,
            suppressHeaderMenuButton: true,
            headerClass: typeScale.caption.tableHeader,
            cellStyle: {
              display: "flex",
              alignItems: "center",
              lineHeight: "1.25rem",
            },
          }}
        />
      </div>

      {showPagination && rowData.length > 0 && (
        <div
          className={cn(
            "flex w-full flex-wrap items-center gap-3",
            typeScale.caption.meta,
            showPerPage || showJumpToPage ? "justify-between" : "justify-center"
          )}
        >
          {showPerPage && (
            <div className="flex items-center gap-2">
              <CustomSelect
                options={[5, 10, 20, 30, 50, 100].map((num) => ({
                  label: String(num),
                  value: String(num),
                }))}
                placeholder="Rows"
                className="w-auto min-w-16 px-3 pr-2.5"
                value={String(pageSizeCount)}
                showClear={false}
                onChange={(val) => handlePageSizeChange(typeof val === "string" ? val : undefined)}
              />
              <span className={typeScale.body.default}>Items per page</span>
            </div>
          )}

          <ReactPaginate
            previousLabel={<ChevronLeft className="size-4" />}
            nextLabel={<ChevronLeft className="size-4 rotate-180" />}
            pageCount={totalPages}
            onPageChange={handlePageChange}
            forcePage={currentPage}
            containerClassName="flex items-center gap-1.5"
            pageLinkClassName="flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-lg border border-border px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            activeLinkClassName="!border-transparent !bg-primary !text-primary-foreground"
            breakLabel="…"
            breakClassName="px-1 text-muted-foreground"
            previousLinkClassName="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-40"
            nextLinkClassName="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-40"
            renderOnZeroPageCount={null}
          />

          {showJumpToPage && (
            <div className="flex items-center gap-2">
              <span className={typeScale.body.default}>Go to page</span>
              <Input
                className="h-8 max-w-12 p-1 text-center"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={4}
                value={goToPage}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^\d{0,4}$/.test(value)) {
                    setGoToPage(value)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleGoToPageSubmit()
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
