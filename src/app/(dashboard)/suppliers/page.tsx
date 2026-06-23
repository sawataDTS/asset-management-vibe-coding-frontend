import type { Metadata } from "next"

import { SuppliersPage } from "./_components/suppliers-page"

export const metadata: Metadata = {
  title: "Suppliers — AssetOps",
  description: "Manage vendors providing your hardware and software.",
}

export default function SuppliersRoute() {
  return <SuppliersPage />
}
