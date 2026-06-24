import type { Metadata } from "next"

import { RequestsPage } from "./_components/requests-page"

export const metadata: Metadata = {
  title: "Requests",
  description: "Review employee requests and hardware reconciliations from your team.",
}

export default function RequestsRoute() {
  return <RequestsPage />
}
