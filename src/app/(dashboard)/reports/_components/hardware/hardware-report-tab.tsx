"use client"

import { useMemo, useState } from "react"
import {
  Archive,
  Calendar,
  ClipboardList,
  Clock,
  ClipboardCheck,
  TrendingDown,
  Wrench,
} from "lucide-react"

import { HardwareReportFiltersPanel } from "./hardware-report-filters"
import { ReportListCard } from "../shared/report-list-card"
import { useRegisterReportExport } from "../shared/reports-export-context"
import { MetricCard } from "@/components/ui/metric-card"
import { SubTabNav, type SubTabNavItem } from "@/components/ui/sub-tab-nav"
import { reportRowsToExportSnapshot } from "@/lib/reports/export"
import {
  DEFAULT_REPORT_FILTERS,
  enrichHardwareAssets,
  getHardwareReportData,
  type HardwareReportKind,
  type ReportFilters,
} from "@/lib/reports/hardware"
import { cn } from "@/lib/utils"

const HARDWARE_SUB_TABS: SubTabNavItem[] = [
  { value: "full-inventory", label: "Full Inventory", icon: ClipboardList },
  { value: "retired-assets", label: "Retired Assets", icon: Archive },
  { value: "overdue-assets", label: "Overdue Assets", icon: Clock },
  { value: "checkout-audit", label: "Checkout Audit", icon: ClipboardCheck },
  { value: "eol-warranty", label: "EOL - Warranty", icon: Calendar },
  { value: "depreciation", label: "Depreciation", icon: TrendingDown },
  { value: "service-repair", label: "Service - Repair", icon: Wrench },
]

function HardwareReportTab() {
  const [activeReport, setActiveReport] = useState<HardwareReportKind>("full-inventory")
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_REPORT_FILTERS)
  const sourceAssets = useMemo(() => enrichHardwareAssets(), [])

  const reportData = useMemo(
    () => getHardwareReportData(activeReport, filters, sourceAssets),
    [activeReport, filters, sourceAssets]
  )

  const exportSnapshot = useMemo(
    () => ({
      ...reportRowsToExportSnapshot(reportData.config.title, reportData.rows),
      kpis: reportData.kpis,
    }),
    [reportData]
  )
  useRegisterReportExport(exportSnapshot)

  const kpiColumns =
    reportData.kpis.length >= 5
      ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      : "sm:grid-cols-2 xl:grid-cols-4"

  return (
    <div className="flex flex-col gap-6">
      <SubTabNav
        items={HARDWARE_SUB_TABS}
        value={activeReport}
        onValueChange={(next) => setActiveReport(next as HardwareReportKind)}
      />

      <HardwareReportFiltersPanel filters={filters} onChange={setFilters} />

      <div className={cn("flex flex-col gap-6", "print:block")} data-report-printable>
        <div className={cn("grid grid-cols-1 gap-4", kpiColumns)}>
        {reportData.kpis.map((kpi) => (
          <MetricCard key={kpi.label} label={kpi.label} value={kpi.value} />
        ))}
      </div>

      <ReportListCard
        title={reportData.config.title}
        description={reportData.config.description}
        generatedOn={reportData.generatedOn}
        rows={reportData.rows}
      />
      </div>
    </div>
  )
}

export { HardwareReportTab }
