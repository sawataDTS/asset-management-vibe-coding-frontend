"use client"

import { Search } from "lucide-react"

import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { CardContainer } from "@/components/ui/card-container"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
  DEFAULT_SOFTWARE_REPORT_FILTERS,
  SOFTWARE_COST_OPTIONS,
  SOFTWARE_STATUS_OPTIONS,
  SOFTWARE_UTILISATION_OPTIONS,
  getSoftwareCategoryOptions,
  getSoftwareVendorOptions,
  type ReportLicense,
  type SoftwareReportFilters,
} from "@/lib/reports/software"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const filtersCardContentClassName = settingsControlClassName
/** Search keeps ~25% width on xl; five selects share the rest in one row. */
const filtersGridClassName =
  "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,5fr)_repeat(5,minmax(0,3fr))]"

type SoftwareReportFiltersPanelProps = {
  filters: SoftwareReportFilters
  onChange: (filters: SoftwareReportFilters) => void
  licenses: ReportLicense[]
}

function SoftwareReportFiltersPanel({ filters, onChange, licenses }: SoftwareReportFiltersPanelProps) {
  const vendorOptions = getSoftwareVendorOptions(licenses)
  const categoryOptions = getSoftwareCategoryOptions()

  function update<K extends keyof SoftwareReportFilters>(key: K, value: SoftwareReportFilters[K]) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <CardContainer formControls contentClassName={cn("flex flex-col gap-4", filtersCardContentClassName)}>
      <p className={typeScale.caption.overline}>Filters</p>

      <div className={filtersGridClassName}>
        <InputGroup className="md:col-span-2 xl:col-span-1">
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search..."
            value={filters.search}
            onChange={(event) => update("search", event.target.value)}
          />
        </InputGroup>

        <CustomSelect
          value={filters.status}
          onChange={(value) =>
            update("status", typeof value === "string" ? value : DEFAULT_SOFTWARE_REPORT_FILTERS.status)
          }
          options={toSelectOptions(SOFTWARE_STATUS_OPTIONS)}
          showClear={false}
        />

        <CustomSelect
          value={filters.vendor}
          onChange={(value) =>
            update("vendor", typeof value === "string" ? value : DEFAULT_SOFTWARE_REPORT_FILTERS.vendor)
          }
          options={toSelectOptions(vendorOptions)}
          showClear={false}
        />

        <CustomSelect
          value={filters.category}
          onChange={(value) =>
            update("category", typeof value === "string" ? value : DEFAULT_SOFTWARE_REPORT_FILTERS.category)
          }
          options={toSelectOptions(categoryOptions)}
          showClear={false}
        />

        <CustomSelect
          value={filters.utilisation}
          onChange={(value) =>
            update(
              "utilisation",
              typeof value === "string" ? value : DEFAULT_SOFTWARE_REPORT_FILTERS.utilisation
            )
          }
          options={toSelectOptions(SOFTWARE_UTILISATION_OPTIONS)}
          showClear={false}
        />

        <CustomSelect
          value={filters.cost}
          onChange={(value) =>
            update("cost", typeof value === "string" ? value : DEFAULT_SOFTWARE_REPORT_FILTERS.cost)
          }
          options={toSelectOptions(SOFTWARE_COST_OPTIONS)}
          showClear={false}
        />
      </div>
    </CardContainer>
  )
}

export { SoftwareReportFiltersPanel }
