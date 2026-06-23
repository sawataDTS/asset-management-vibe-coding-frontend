"use client"

import { useMemo, useState } from "react"
import { Clock, ShieldCheck, Truck } from "lucide-react"

import { CertificationsReportFiltersPanel } from "./certifications-report-filters"
import { ReportListCard } from "../shared/report-list-card"
import { useRegisterReportExport } from "../shared/reports-export-context"
import { MetricCard } from "@/components/ui/metric-card"
import { SubTabNav, type SubTabNavItem } from "@/components/ui/sub-tab-nav"
import { reportRowsToExportSnapshot } from "@/lib/reports/export"
import {
  DEFAULT_CERTIFICATION_FILTERS,
  getCertificationReportData,
  initialCertifications,
  type CertificationReportKind,
  type CertificationReportFilters,
} from "@/lib/reports/certifications"

const CERTIFICATION_SUB_TABS: SubTabNavItem[] = [
  { value: "certification-status", label: "Certification Status", icon: ShieldCheck },
  { value: "expiring-soon", label: "Expiring Soon", icon: Clock },
  { value: "vendor-attestations", label: "Vendor Attestations", icon: Truck },
]

function CertificationsReportTab() {
  const [activeReport, setActiveReport] = useState<CertificationReportKind>("certification-status")
  const [filters, setFilters] = useState<CertificationReportFilters>(DEFAULT_CERTIFICATION_FILTERS)
  const sourceRecords = useMemo(() => initialCertifications, [])

  const reportData = useMemo(
    () => getCertificationReportData(activeReport, filters, sourceRecords),
    [activeReport, filters, sourceRecords]
  )

  const exportSnapshot = useMemo(
    () => ({
      ...reportRowsToExportSnapshot(reportData.config.title, reportData.rows),
      kpis: reportData.kpis,
    }),
    [reportData]
  )
  useRegisterReportExport(exportSnapshot)

  return (
    <div className="flex flex-col gap-6">
      <SubTabNav
        items={CERTIFICATION_SUB_TABS}
        value={activeReport}
        onValueChange={(next) => setActiveReport(next as CertificationReportKind)}
      />

      <CertificationsReportFiltersPanel filters={filters} onChange={setFilters} />

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
        emptyMessage={reportData.config.emptyMessage}
      />
      </div>
    </div>
  )
}

export { CertificationsReportTab }
