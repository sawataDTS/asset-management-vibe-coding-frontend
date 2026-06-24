import type { Metadata } from "next"

import { OverviewPage } from "./_components/overview-page"

export const metadata: Metadata = {
  title: "Overview",
  description:
    "Live KPIs synthesized from utilization, ingestion cadence, renewal pressure, and vendor-led seat concentration.",
}

export default function OverviewRoute() {
  return <OverviewPage />
}
