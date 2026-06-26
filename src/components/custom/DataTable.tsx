"use client"

import { useMemo, useRef, useState, type CSSProperties } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, Inbox } from "lucide-react"

import { cn } from "@/lib/utils"
import { surfaceOutlineClassName } from "@/lib/surface"
import { typeScale } from "@/lib/typography"
import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type SortDirection = "asc" | "desc"

export type DataTableColumn<T> = {
  id: string
  header: React.ReactNode
  headerClassName?: string
  cellClassName?: string
  /** Initial width in pixels for fixed-size columns. */
  width?: number
  /** AG Grid-like grow weight. Ignored once the column has an explicit/resized width. */
  flex?: number
  minWidth?: number
  maxWidth?: number
  /** Show a drag handle on the trailing edge to resize the column. */
  resizable?: boolean
  /** Disable sorting for this column. Columns with `sortValue` are sortable by default. */
  sortable?: boolean
  sortValue?: (row: T) => string | number | null | undefined
  cell: (row: T) => React.ReactNode
  align?: "left" | "right" | "center"
}

export const dataTableActionsHeaderClass = "text-right"
export const dataTableActionsCellClass = "text-right"

const tableHeadClassName = cn(
  "group h-auto bg-muted/50 px-3.5 py-2.5 align-middle whitespace-nowrap",
  typeScale.caption.tableHeader
)

const flexTableHeadCellClassName = cn(
  "group box-border h-auto bg-muted/50 px-3.5 py-2.5 align-middle whitespace-nowrap",
  typeScale.caption.tableHeader
)

const tableCellClassName = "px-3.5 py-3 align-top whitespace-normal"

const flexTableBodyCellClassName = cn("box-border min-w-0 px-3.5 py-3 align-top whitespace-normal")

interface DataTableProps<T> {
  rowData: T[]
  columns: DataTableColumn<T>[]
  pageSize?: number
  onRowClick?: (row: T) => void
  showPagination?: boolean
  /** Set to false to disable sorting for the entire table. */
  enableSorting?: boolean
  loading?: boolean
  emptyState?: React.ReactNode
  emptyMessage?: string
  getRowClassName?: (row: T) => string | undefined
  className?: string
}

function isColumnSortable<T>(column: DataTableColumn<T>, enableSorting: boolean) {
  if (!enableSorting) return false
  if (column.sortable === false) return false
  if (column.sortable === true) return true
  // Sortable by default when a sortValue getter exists or the column id maps to row data.
  return column.sortValue !== undefined
}

function getColumnSortValue<T>(column: DataTableColumn<T>, row: T) {
  if (column.sortValue) return column.sortValue(row)

  const record = row as Record<string, unknown>
  const value = record[column.id]
  return typeof value === "string" || typeof value === "number" ? value : null
}

function getRowKey<T extends object>(row: T, index: number) {
  const record = row as Record<string, unknown>
  if (typeof record.id === "string" || typeof record.id === "number") {
    return String(record.id)
  }
  return String(index)
}
function compareSortValues(
  a: string | number | null | undefined,
  b: string | number | null | undefined,
  direction: SortDirection
) {
  const factor = direction === "asc" ? 1 : -1

  if (a == null && b == null) return 0
  if (a == null) return 1 * factor
  if (b == null) return -1 * factor

  if (typeof a === "number" && typeof b === "number") {
    return (a - b) * factor
  }

  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" }) * factor
}

function SortIndicator({ active, direction }: { active: boolean; direction: SortDirection | null }) {
  if (active && direction === "asc") {
    return <ArrowUp className="size-3.5 shrink-0 text-primary" aria-hidden />
  }

  if (active && direction === "desc") {
    return <ArrowDown className="size-3.5 shrink-0 text-primary" aria-hidden />
  }

  return (
    <ArrowUpDown
      className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
      aria-hidden
    />
  )
}

function getHeaderLabelMinWidth<T>(column: DataTableColumn<T>): number {
  if (typeof column.header !== "string") return 0

  const sortable = column.sortable !== false && column.sortValue !== undefined
  const chrome = 28 + (sortable ? 22 : 0) + (column.resizable ? 14 : 0)

  return Math.ceil(column.header.length * 8 + chrome)
}

function getColumnMinWidth<T>(column: DataTableColumn<T>): number {
  return Math.max(column.minWidth ?? 0, getHeaderLabelMinWidth(column))
}

function getColumnLayoutStyle<T>(
  column: DataTableColumn<T>,
  resolvedWidth: number | undefined
): CSSProperties {
  const minWidth = getColumnMinWidth(column)
  const maxWidthStyle = column.maxWidth != null ? { maxWidth: column.maxWidth } : {}

  if (resolvedWidth != null) {
    return {
      flex: `0 0 ${Math.max(resolvedWidth, minWidth)}px`,
      width: Math.max(resolvedWidth, minWidth),
      minWidth,
      ...maxWidthStyle,
    }
  }

  if (column.width != null && column.flex == null) {
    const width = Math.max(column.width, minWidth)

    return {
      flex: `0 0 ${width}px`,
      width,
      minWidth,
      ...maxWidthStyle,
    }
  }

  if (column.flex != null) {
    return {
      flex: `${column.flex} 1 0%`,
      minWidth,
      ...maxWidthStyle,
    }
  }

  return {
    flex: "1 1 0%",
    minWidth,
    ...maxWidthStyle,
  }
}

function usesFlexColumnLayout<T>(columns: DataTableColumn<T>[]) {
  return columns.some(
    (column) => column.flex != null || column.width != null || column.resizable || column.minWidth != null
  )
}

function ColumnResizeHandle({
  label,
  onResizeStart,
  active,
}: {
  label: string
  onResizeStart: (event: React.MouseEvent) => void
  active?: boolean
}) {
  return (
    <span
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize ${label} column`}
      onMouseDown={onResizeStart}
      className={cn(
        "group/resize absolute inset-y-0 right-0 z-10 w-2 cursor-col-resize touch-none select-none",
        "before:absolute before:inset-y-2 before:right-0 before:w-0.5 before:rounded-full before:content-['']",
        active
          ? "before:bg-primary"
          : "before:bg-muted-foreground/45 before:transition-colors hover:before:bg-muted-foreground/70"
      )}
    />
  )
}

export function DataTable<T extends object>({
  rowData,
  columns,
  pageSize = 20,
  onRowClick,
  showPagination = true,
  enableSorting = true,
  loading,
  emptyState,
  emptyMessage = "No records to display.",
  getRowClassName,
  className,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(0)
  const [sortColumnId, setSortColumnId] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      columns.filter((column) => column.width != null).map((column) => [column.id, column.width as number])
    )
  )
  const [resizingColumnId, setResizingColumnId] = useState<string | null>(null)
  const headerRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const useFlexLayout = useMemo(() => usesFlexColumnLayout(columns), [columns])

  function getResolvedColumnWidth(column: DataTableColumn<T>) {
    return columnWidths[column.id] ?? column.width
  }

  function startColumnResize(column: DataTableColumn<T>, event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    const startX = event.clientX
    const headerEl = headerRefs.current[column.id]
    const startWidth =
      getResolvedColumnWidth(column) ?? headerEl?.getBoundingClientRect().width ?? column.width ?? 120
    const minWidth = getColumnMinWidth(column)

    const onMouseMove = (moveEvent: MouseEvent) => {
      let nextWidth = startWidth + moveEvent.clientX - startX
      nextWidth = Math.max(minWidth, nextWidth)
      if (column.maxWidth != null) {
        nextWidth = Math.min(column.maxWidth, nextWidth)
      }
      setColumnWidths((previous) => ({ ...previous, [column.id]: nextWidth }))
    }

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      document.body.style.removeProperty("cursor")
      document.body.style.removeProperty("user-select")
      setResizingColumnId(null)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
    setResizingColumnId(column.id)
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }

  function renderHeaderCell(column: DataTableColumn<T>) {
    const isSorted = sortColumnId === column.id
    const isSortable = isColumnSortable(column, enableSorting)
    const resizeLabel = typeof column.header === "string" ? column.header : column.id

    if (isSortable) {
      return (
        <button
          type="button"
          onClick={() => handleSort(column)}
          aria-label={`Sort by ${resizeLabel}`}
          className={cn(
            "group inline-flex w-full items-center gap-1.5",
            column.align === "right" && "justify-end",
            column.align === "center" && "justify-center",
            column.resizable && "pr-2"
          )}
        >
          <span>{column.header}</span>
          <SortIndicator active={isSorted} direction={isSorted ? sortDirection : null} />
        </button>
      )
    }

    return (
      <span
        className={cn(
          "inline-flex w-full items-center",
          column.align === "right" && "justify-end",
          column.align === "center" && "justify-center",
          column.resizable && "pr-2"
        )}
      >
        {column.header}
      </span>
    )
  }

  const totalPages = Math.max(1, Math.ceil(rowData.length / pageSize))
  const pageIndex = Math.min(currentPage, Math.max(0, totalPages - 1))
  const isEmpty = !loading && rowData.length === 0
  const hasFooter = showPagination && rowData.length > 0

  const sortedRows = useMemo(() => {
    if (!sortColumnId) return rowData

    const column = columns.find((item) => item.id === sortColumnId)
    if (!column || !isColumnSortable(column, enableSorting)) return rowData

    return [...rowData].sort((left, right) =>
      compareSortValues(getColumnSortValue(column, left), getColumnSortValue(column, right), sortDirection)
    )
  }, [rowData, columns, sortColumnId, sortDirection, enableSorting])

  const pageRows = useMemo(() => {
    if (!showPagination) return sortedRows
    const offset = pageIndex * pageSize
    return sortedRows.slice(offset, offset + pageSize)
  }, [sortedRows, pageIndex, pageSize, showPagination])

  const rangeStart = rowData.length === 0 ? 0 : pageIndex * pageSize + 1
  const rangeEnd = Math.min((pageIndex + 1) * pageSize, rowData.length)

  function handleSort(column: DataTableColumn<T>) {
    if (!isColumnSortable(column, enableSorting)) return

    if (sortColumnId !== column.id) {
      setSortColumnId(column.id)
      setSortDirection("asc")
      setCurrentPage(0)
      return
    }

    setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"))
    setCurrentPage(0)
  }

  if (isEmpty) {
    return (
      <div className={cn("flex w-full flex-col", className)}>
        {emptyState ?? (
          <Empty className={cn(surfaceOutlineClassName, "rounded-xl border-dashed bg-card py-12")}>
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
    <div className={cn("data-table-root w-full min-w-0", className)}>
      <div className={cn("relative overflow-hidden rounded-xl bg-card", surfaceOutlineClassName)}>
        {loading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60 backdrop-blur-[1px]">
            <Spinner className="size-5 text-primary" />
          </div>
        ) : null}

        {useFlexLayout ? (
          <div
            data-slot="table-container"
            className="custom-scrollbar relative w-full min-w-0 overflow-x-auto overflow-y-hidden"
          >
            <div role="table" className="w-max min-w-full text-sm">
              <div role="rowgroup">
                <div
                  role="row"
                  className="flex w-max min-w-full border-b border-border hover:bg-muted/50"
                >
                  {columns.map((column, columnIndex) => {
                    const isSorted = sortColumnId === column.id
                    const resolvedWidth = getResolvedColumnWidth(column)
                    const layoutStyle = getColumnLayoutStyle(column, resolvedWidth)
                    const resizeLabel = typeof column.header === "string" ? column.header : column.id
                    const isResizing = resizingColumnId === column.id
                    const isFirstColumn = columnIndex === 0
                    const isLastColumn = columnIndex === columns.length - 1

                    return (
                      <div
                        key={column.id}
                        ref={(element) => {
                          headerRefs.current[column.id] = element
                        }}
                        role="columnheader"
                        aria-sort={
                          isSorted ? (sortDirection === "asc" ? "ascending" : "descending") : undefined
                        }
                        style={layoutStyle}
                        className={cn(
                          flexTableHeadCellClassName,
                          column.resizable && "relative",
                          column.align === "right" && "text-right",
                          column.align === "center" && "text-center",
                          isFirstColumn && "rounded-tl-xl",
                          isLastColumn && "rounded-tr-xl",
                          column.headerClassName
                        )}
                      >
                        {renderHeaderCell(column)}
                        {column.resizable ? (
                          <ColumnResizeHandle
                            label={resizeLabel}
                            active={isResizing}
                            onResizeStart={(event) => startColumnResize(column, event)}
                          />
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div role="rowgroup">
                {pageRows.map((row, index) => (
                  <div
                    key={getRowKey(row, index)}
                    role="row"
                    className={cn(
                      "flex w-max min-w-full border-b border-border bg-card transition-colors hover:bg-muted/50",
                      onRowClick && "cursor-pointer",
                      getRowClassName?.(row)
                    )}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((column) => {
                      const resolvedWidth = getResolvedColumnWidth(column)
                      const layoutStyle = getColumnLayoutStyle(column, resolvedWidth)

                      return (
                        <div
                          key={column.id}
                          role="cell"
                          style={layoutStyle}
                          className={cn(
                            flexTableBodyCellClassName,
                            column.align === "right" && "text-right",
                            column.align === "center" && "text-center",
                            column.cellClassName
                          )}
                        >
                          {column.cell(row)}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                {columns.map((column) => {
                  const isSorted = sortColumnId === column.id
                  const isSortable = isColumnSortable(column, enableSorting)
                  const resizeLabel = typeof column.header === "string" ? column.header : column.id

                  return (
                    <TableHead
                      key={column.id}
                      aria-sort={
                        isSorted ? (sortDirection === "asc" ? "ascending" : "descending") : undefined
                      }
                      className={cn(
                        tableHeadClassName,
                        column.align === "right" && "text-right",
                        column.align === "center" && "text-center",
                        column.headerClassName
                      )}
                    >
                      {isSortable ? (
                        <button
                          type="button"
                          onClick={() => handleSort(column)}
                          aria-label={`Sort by ${resizeLabel}`}
                          className={cn(
                            "group inline-flex w-full items-center gap-1.5",
                            column.align === "right" && "justify-end",
                            column.align === "center" && "justify-center"
                          )}
                        >
                          <span>{column.header}</span>
                          <SortIndicator active={isSorted} direction={isSorted ? sortDirection : null} />
                        </button>
                      ) : (
                        <span
                          className={cn(
                            "inline-flex w-full items-center",
                            column.align === "right" && "justify-end",
                            column.align === "center" && "justify-center"
                          )}
                        >
                          {column.header}
                        </span>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageRows.map((row, index) => (
                <TableRow
                  key={getRowKey(row, index)}
                  className={cn(onRowClick && "cursor-pointer", getRowClassName?.(row))}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn(
                        tableCellClassName,
                        column.align === "right" && "text-right",
                        column.align === "center" && "text-center",
                        column.cellClassName
                      )}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {hasFooter ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/30 px-4 py-3">
            <span className={typeScale.caption.meta}>
              Showing {rangeStart}–{rangeEnd} of {rowData.length}
            </span>

            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Previous page"
                disabled={pageIndex === 0}
                onClick={() => setCurrentPage((page) => Math.max(0, Math.min(page, totalPages - 1) - 1))}
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
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages - 1, Math.min(page, totalPages - 1) + 1))
                }
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
        ) : null}
      </div>
    </div>
  )
}
