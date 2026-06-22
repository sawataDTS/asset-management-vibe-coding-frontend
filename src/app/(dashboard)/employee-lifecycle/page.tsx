import type { Metadata } from "next"
import { Repeat } from "lucide-react"

import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Employee Lifecycle — AssetOps",
  description: "Coordinate onboarding and offboarding asset hand-offs.",
}

export default function EmployeeLifecyclePage() {
  return (
    <PageHeader
      icon={Repeat}
      title="Employee Lifecycle"
      description="Coordinate onboarding and offboarding asset hand-offs."
    >
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No lifecycle events scheduled.
        </CardContent>
      </Card>
    </PageHeader>
  )
}
