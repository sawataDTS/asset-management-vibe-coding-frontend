import type { Metadata } from "next"

import { EmployeeLifecyclePage } from "./_components/employee-lifecycle-page"

export const metadata: Metadata = {
  title: "Employee Lifecycle — AssetOps",
  description: "Configure department templates, onboard employees, generate labels, and track lifecycle history.",
}

export default function EmployeeLifecycleRoute() {
  return <EmployeeLifecyclePage />
}
