import type { Metadata } from "next"

import { SoftwarePage } from "./_components/software-page"

export const metadata: Metadata = {
  title: "Software — AssetOps",
  description: "Track seat allocation, renewal dates, and subscription spend across vendors.",
}

export default function SoftwareRoute() {
  return <SoftwarePage />
}
