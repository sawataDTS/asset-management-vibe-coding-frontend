import type { Metadata } from "next"
import { Truck, Plus } from "lucide-react"

import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Suppliers — AssetOps",
  description: "Manage vendors, contracts, and procurement relationships.",
}

export default function SuppliersPage() {
  return (
    <PageHeader
      icon={Truck}
      title="Suppliers"
      description="Manage vendors, contracts, and procurement relationships."
      actions={
        <Button>
          <Plus />
          Add Supplier
        </Button>
      }
    >
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No suppliers added yet.
        </CardContent>
      </Card>
    </PageHeader>
  )
}
