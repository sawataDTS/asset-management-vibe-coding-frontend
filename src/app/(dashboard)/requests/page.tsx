import type { Metadata } from "next"
import { FileText, Plus } from "lucide-react"

import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Requests — AssetOps",
  description: "Review and action asset and access requests from your team.",
}

export default function RequestsPage() {
  return (
    <PageHeader
      icon={FileText}
      title="Requests"
      description="Review and action asset and access requests from your team."
      actions={
        <Button>
          <Plus />
          New Request
        </Button>
      }
    >
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No open requests.
        </CardContent>
      </Card>
    </PageHeader>
  )
}
