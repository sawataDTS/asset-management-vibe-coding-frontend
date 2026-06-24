"use client"

import { Search } from "lucide-react"

import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { CardContainer } from "@/components/ui/card-container"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { type CertificationReportFilters } from "@/lib/reports/certifications"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const filtersCardContentClassName = settingsControlClassName

type CertificationsReportFiltersPanelProps = {
  filters: CertificationReportFilters
  onChange: (filters: CertificationReportFilters) => void
}

function CertificationsReportFiltersPanel({ filters, onChange }: CertificationsReportFiltersPanelProps) {
  return (
    <CardContainer formControls contentClassName={cn("flex flex-col gap-4", filtersCardContentClassName)}>
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
    </CardContainer>
  )
}

export { CertificationsReportFiltersPanel }
