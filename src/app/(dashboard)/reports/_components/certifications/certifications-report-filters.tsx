"use client"

import { Search } from "lucide-react"

import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Card, CardContent } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { type CertificationReportFilters } from "@/lib/reports/certifications"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const filtersCardClassName = "gap-0 py-0"
const filtersCardContentClassName = cn("p-(--card-spacing)", settingsControlClassName)

type CertificationsReportFiltersPanelProps = {
  filters: CertificationReportFilters
  onChange: (filters: CertificationReportFilters) => void
}

function CertificationsReportFiltersPanel({
  filters,
  onChange,
}: CertificationsReportFiltersPanelProps) {
  return (
    <Card className={filtersCardClassName}>
      <CardContent className={cn("flex flex-col gap-4", filtersCardContentClassName)}>
        <p className={typeScale.caption.overline}>Filters</p>

        <InputGroup className="max-w-md">
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search..."
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
          />
        </InputGroup>
      </CardContent>
    </Card>
  )
}

export { CertificationsReportFiltersPanel }
