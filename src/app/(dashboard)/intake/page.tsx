import type { Metadata } from "next"

import { IntakePage } from "./_components/intake-page"

export const metadata: Metadata = {
  title: "Intake — AssetOps",
  description: "Manage hardware inventory and software licenses in one place.",
}

export default function IntakeRoute() {
  return <IntakePage />
}
