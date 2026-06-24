import type { Metadata } from "next"

import { OrganizationPage } from "./_components/organization-page"

export const metadata: Metadata = {
  title: "Organizations",
  description: "Onboard, activate, and manage every workspace on the platform.",
}

export default function Page() {
  return <OrganizationPage />
}
