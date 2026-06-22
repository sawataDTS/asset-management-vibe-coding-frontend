import type { Metadata } from "next"
import { BarChart3, Download } from "lucide-react"

import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Reports — AssetOps",
  description: "Generate and export analytics across hardware, software, and spend.",
}

export default function ReportsPage() {
  return (
    <PageHeader
      icon={BarChart3}
      title="Reports"
      description="Generate and export analytics across hardware, software, and spend."
      actions={
        <Button variant="outline">
          <Download />
          Export
        </Button>
      }
    >
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No reports generated yet.
        </CardContent>
      </Card>
    </PageHeader>
  )
}
