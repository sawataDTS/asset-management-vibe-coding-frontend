"use client"

import { toast } from "sonner"
import { Download, FileText, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  downloadReportCsv,
  openPrintableReport,
  getExportMenuLabel,
  printReportPreview,
} from "@/lib/reports/export"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"
import { useReportsExport } from "./reports-export-context"

function ReportExportMenu() {
  const { snapshot } = useReportsExport()
  const hasRows = (snapshot?.rowCount ?? 0) > 0

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
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className={cn(typeScale.caption.overline, "font-semibold normal-case")}>
          {getExportMenuLabel(snapshot).toUpperCase()}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleCsvExport} disabled={!hasRows}>
          <FileText />
          Download as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handlePdfExport} disabled={!hasRows}>
          <Download />
          Download as PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handlePrintPreview} disabled={!hasRows}>
          <Printer />
          Print preview
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ReportExportMenu }
