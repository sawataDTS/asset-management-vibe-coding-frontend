"use client"

import * as React from "react"

import type { ReportExportSnapshot } from "@/lib/reports/export"

type ReportsExportContextValue = {
  snapshot: ReportExportSnapshot | null
  setSnapshot: (snapshot: ReportExportSnapshot | null) => void
}

const ReportsExportContext = React.createContext<ReportsExportContextValue | null>(null)

function ReportsExportProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = React.useState<ReportExportSnapshot | null>(null)

  const value = React.useMemo(
    () => ({
      snapshot,
      setSnapshot,
    }),
    [snapshot]
  )

  return <ReportsExportContext.Provider value={value}>{children}</ReportsExportContext.Provider>
}

function useReportsExport() {
  const context = React.useContext(ReportsExportContext)
  if (!context) {
    throw new Error("useReportsExport must be used within ReportsExportProvider")
  }
  return context
}

function useRegisterReportExport(snapshot: ReportExportSnapshot | null) {
  const { setSnapshot } = useReportsExport()

  React.useEffect(() => {
    setSnapshot(snapshot)
    return () => setSnapshot(null)
  }, [snapshot, setSnapshot])
}

export { ReportsExportProvider, useRegisterReportExport, useReportsExport }
