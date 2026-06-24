import type { Metadata } from "next"

import { ReportsPage } from "./_components/reports-page"

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Drill into hardware, software, and mailbox reports, or use Prompt to ask about assets, licenses, or mailbox storage in plain language.",
}

export default function Page() {
  return <ReportsPage />
}
