import type { Metadata } from "next"

import { EmployeesPage } from "./_components/employees-page"

export const metadata: Metadata = {
  title: "Employees — AssetOps",
  description: "Manage employee records, shipping addresses, workspace access, and asset assignments.",
}

export default function EmployeesRoute() {
  return <EmployeesPage />
}
