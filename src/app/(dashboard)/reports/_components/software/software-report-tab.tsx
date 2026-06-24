"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { ClipboardList, DollarSign, KeyRound, RefreshCw, ShieldCheck, Users, PackageOpen } from "lucide-react"

import { SoftwareReportFiltersPanel } from "./software-report-filters"
import { ReportListCard } from "../shared/report-list-card"
import { REPORT_TAB_ICONS } from "../shared/report-tab-icons"
import { useRegisterReportExport } from "../shared/reports-export-context"
import { MetricCard } from "@/components/ui/metric-card"
import { SubTabNav, type SubTabNavItem } from "@/components/ui/sub-tab-nav"
import { reportRowsToExportSnapshot } from "@/lib/reports/export"
import {
  DEFAULT_SOFTWARE_REPORT_FILTERS,
  enrichSoftwareLicenses,
  getSoftwareReportData,
  type SoftwareReportFilters,
  type SoftwareReportKind,
} from "@/lib/reports/software"
import type { ReportRow } from "@/lib/reports/types"

const SOFTWARE_SUB_TABS: SubTabNavItem[] = [
  { value: "license-inventory", label: "License Inventory", icon: ClipboardList },
  { value: "renewals-eol", label: "Renewals - EOL", icon: RefreshCw },
  { value: "spend-analysis", label: "Spend Analysis", icon: DollarSign },
  { value: "seat-utilisation", label: "Seat Utilisation", icon: Users },
  { value: "unused-licenses", label: "Unused Licenses", icon: PackageOpen },
  { value: "license-compliance", label: "License Compliance", icon: ShieldCheck },
  { value: "license-keys", label: "License Keys", icon: KeyRound },
]

function SoftwareReportTab() {
  const [activeReport, setActiveReport] = useState<SoftwareReportKind>("license-inventory")
  const [filters, setFilters] = useState<SoftwareReportFilters>(DEFAULT_SOFTWARE_REPORT_FILTERS)
  const sourceLicenses = useMemo(() => enrichSoftwareLicenses(), [])

  const reportData = useMemo(
    () => getSoftwareReportData(activeReport, filters, sourceLicenses),
    [activeReport, filters, sourceLicenses]
  )

  const exportSnapshot = useMemo(
    () => ({
      ...reportRowsToExportSnapshot(reportData.config.title, reportData.rows),
      kpis: reportData.kpis,
    }),
    [reportData]
  )
  useRegisterReportExport(exportSnapshot)

  function handleRenewAction(row: ReportRow) {
    toast.success(`Renewal queued for ${row.title}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <SubTabNav
        items={SOFTWARE_SUB_TABS}
        value={activeReport}
        onValueChange={(next) => setActiveReport(next as SoftwareReportKind)}
      />

      <SoftwareReportFiltersPanel filters={filters} onChange={setFilters} licenses={sourceLicenses} />

      <div className="flex flex-col gap-6" data-report-printable>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {reportData.kpis.map((kpi) => (
            <MetricCard key={kpi.label} label={kpi.label} value={kpi.value} />
          ))}
        </div>

        <ReportListCard
          title={reportData.config.title}
          description={reportData.config.description}
          generatedOn={reportData.generatedOn}
          rows={reportData.rows}
          icon={REPORT_TAB_ICONS.software}
          emptyMessage={reportData.config.emptyMessage}
          onRowAction={activeReport === "renewals-eol" ? handleRenewAction : undefined}
        />
      </div>
    </div>
  )
}

export { SoftwareReportTab }
