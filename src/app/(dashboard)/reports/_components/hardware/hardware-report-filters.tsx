"use client"

import { Search } from "lucide-react"

import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Card, CardContent } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
  DEFAULT_REPORT_FILTERS,
  HARDWARE_CATEGORY_FILTER_OPTIONS,
  REPORT_CONDITION_OPTIONS,
  REPORT_COST_OPTIONS,
  REPORT_STATUS_OPTIONS,
  REPORT_TIME_OPTIONS,
  type ReportFilters,
} from "@/lib/reports/hardware"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const filtersCardClassName = "gap-0 py-0"
const filtersCardContentClassName = cn("p-(--card-spacing)", settingsControlClassName)
/** Search keeps ~25% width on xl; five selects share the rest in one row. */
const filtersGridClassName =
  "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,5fr)_repeat(5,minmax(0,3fr))]"

type HardwareReportFiltersPanelProps = {
  filters: ReportFilters
  onChange: (filters: ReportFilters) => void
}

function HardwareReportFiltersPanel({ filters, onChange }: HardwareReportFiltersPanelProps) {
  function update<K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <Card className={filtersCardClassName}>
      <CardContent className={cn("flex flex-col gap-4", filtersCardContentClassName)}>
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
            onChange={(value) => update("status", typeof value === "string" ? value : DEFAULT_REPORT_FILTERS.status)}
            options={toSelectOptions(REPORT_STATUS_OPTIONS)}
            showClear={false}
          />

          <CustomSelect
            value={filters.category}
            onChange={(value) =>
              update("category", typeof value === "string" ? value : DEFAULT_REPORT_FILTERS.category)
            }
            options={toSelectOptions(HARDWARE_CATEGORY_FILTER_OPTIONS)}
            showClear={false}
          />

          <CustomSelect
            value={filters.condition}
            onChange={(value) =>
              update("condition", typeof value === "string" ? value : DEFAULT_REPORT_FILTERS.condition)
            }
            options={toSelectOptions(REPORT_CONDITION_OPTIONS)}
            showClear={false}
          />

          <CustomSelect
            value={filters.cost}
            onChange={(value) => update("cost", typeof value === "string" ? value : DEFAULT_REPORT_FILTERS.cost)}
            options={toSelectOptions(REPORT_COST_OPTIONS)}
            showClear={false}
          />

          <CustomSelect
            value={filters.timeRange}
            onChange={(value) =>
              update("timeRange", typeof value === "string" ? value : DEFAULT_REPORT_FILTERS.timeRange)
            }
            options={toSelectOptions(REPORT_TIME_OPTIONS)}
            showClear={false}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export { HardwareReportFiltersPanel }
