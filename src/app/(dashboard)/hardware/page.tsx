import type { Metadata } from "next"

import { HardwarePage } from "./_components/hardware-page"

export const metadata: Metadata = {
  title: "Hardware",
  description: "Track laptops, monitors, peripherals, and their assignment status across your organization.",
}

export default function HardwareRoute() {
  return <HardwarePage />
}
