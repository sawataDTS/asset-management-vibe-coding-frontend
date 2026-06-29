import type { Metadata } from "next"

import { EarlyAccessForm } from "../_components/early-access-form"

export const metadata: Metadata = {
  title: "Request Early Access",
  description: "Request early access to Asset360Hub. New companies are onboarded by our team.",
}

export default function EarlyAccessPage() {
  return <EarlyAccessForm />
}
