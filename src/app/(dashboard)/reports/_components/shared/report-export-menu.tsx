"use client"

import { toast } from "sonner"
import { Download, FileText, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  downloadReportCsv,
  openPrintableReport,
  printReportPreview,
} from "@/lib/reports/export"
import { typeScale } from "@/lib/typography"
import { useReportsExport } from "./reports-export-context"

const exportItemClassName = "gap-2.5 px-2 py-2"

function ReportExportMenu() {
  const { snapshot } = useReportsExport()
  const rowCount = snapshot?.rowCount ?? 0
  const hasRows = rowCount > 0

  function handleCsvExport() {
    if (!snapshot || !hasRows) {
      toast.error("No filtered rows to export.")
      return
    }

    downloadReportCsv(snapshot)
    toast.success("CSV download started")
  }

  function handlePdfExport() {
    if (!snapshot || !hasRows) {
      toast.error("No filtered rows to export.")
      return
    }

    const opened = openPrintableReport(snapshot)
    if (!opened) {
      toast.error("Allow pop-ups to download this report as PDF.")
      return
    }

    toast.success("Choose Save as PDF in the print dialog")
  }

  function handlePrintPreview() {
    if (!snapshot || !hasRows) {
      toast.error("No filtered rows to print.")
      return
    }

    const opened = openPrintableReport(snapshot)
    if (!opened) {
      printReportPreview()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" data-report-export-hide>
          <Download />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="w-64 p-0">
        <div className="flex flex-col gap-0.5 px-3 py-2.5">
          <p className={typeScale.body.emphasis}>Export report</p>
          <p className={typeScale.caption.meta}>
            {snapshot?.reportTitle ?? "No report loaded"}
            {hasRows
              ? ` · ${rowCount} ${rowCount === 1 ? "row" : "rows"}`
              : " · No rows to export"}
          </p>
        </div>

        <DropdownMenuSeparator className="mx-0 my-0" />

        <div className="p-1">
          <DropdownMenuItem
            className={exportItemClassName}
            onSelect={handleCsvExport}
            disabled={!hasRows}
          >
            <FileText className="size-4 text-muted-foreground" strokeWidth={1.75} />
            <span className="font-medium">Download as CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={exportItemClassName}
            onSelect={handlePdfExport}
            disabled={!hasRows}
          >
            <Download className="size-4 text-muted-foreground" strokeWidth={1.75} />
            <span className="font-medium">Download as PDF</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="mx-0 my-0" />

        <div className="p-1">
          <DropdownMenuItem
            className={exportItemClassName}
            onSelect={handlePrintPreview}
            disabled={!hasRows}
          >
            <Printer className="size-4 text-muted-foreground" strokeWidth={1.75} />
            <span className="font-medium">Print preview</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ReportExportMenu }
