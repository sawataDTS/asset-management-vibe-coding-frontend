"use client"

import { useRef, useState } from "react"
import { ChevronDownIcon, ChevronRightIcon, DownloadIcon, UploadIcon } from "lucide-react"
import { toast } from "sonner"
import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { Button } from "@/components/ui/button"
import { CardContainer } from "@/components/ui/card-container"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { csvColumnOrders, csvSpreadsheetTypes } from "@/lib/intake/constants"
import { typeScale } from "@/lib/typography"
import { surfaceOutlineClassName } from "@/lib/surface"
import { cn } from "@/lib/utils"

export default function CsvIntakeForm() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [spreadsheetType, setSpreadsheetType] =
    useState<(typeof csvSpreadsheetTypes)[number]>("Hardware Inventory")
  const [columnsOpen, setColumnsOpen] = useState(false)

  const csvRules: Record<(typeof csvSpreadsheetTypes)[number], string> = {
    "Hardware Inventory":
      "One row = one hardware asset. supplier_name must match an existing supplier. status: in_stock, assigned, repair, or retired. condition: new, good, fair, poor. Dates: YYYY-MM-DD.",
    "Software License":
      "One row = one software subscription or license pool. billing_period: monthly, annually, or one-time. seats is required for pooled subscriptions.",
    Employees:
      "One row = one employee directory record. employee_id must be unique. status: active, on_leave, or terminated. Shipping address fields are required for hardware fulfillment.",
  }

  return (
    <CardContainer
      variant="form"
      formControls
      title="CSV Format"
      description="Bulk import hardware, software, or employee records. Download a template, upload a filled CSV, then review and import approved rows."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:grid-rows-[auto_auto_auto] sm:gap-x-5 sm:gap-y-2">
        <Field className="flex flex-col gap-2 sm:contents">
          <FieldLabel htmlFor="csv-type" className="sm:col-start-1 sm:row-start-1">
            Spreadsheet type
          </FieldLabel>
          <CustomSelect
            id="csv-type"
            className="sm:col-start-1 sm:row-start-2"
            value={spreadsheetType}
            onChange={(value) =>
              setSpreadsheetType(
                (typeof value === "string" ? value : spreadsheetType) as (typeof csvSpreadsheetTypes)[number]
              )
            }
            options={toSelectOptions(csvSpreadsheetTypes)}
            showClear={false}
          />
          <FieldDescription className={cn(typeScale.caption.meta, "sm:col-start-1 sm:row-start-3")}>
            Pick what this CSV adds: hardware assets, software licenses, or employee directory records.
          </FieldDescription>
        </Field>
        <Field className="flex flex-col gap-2 sm:contents">
          <FieldLabel htmlFor="csv-format" className="sm:col-start-2 sm:row-start-1">
            Import format
          </FieldLabel>
          <CustomSelect
            id="csv-format"
            className="sm:col-start-2 sm:row-start-2"
            value="asset360hub"
            onChange={() => undefined}
            options={[{ label: "Asset360Hub CSV template", value: "asset360hub" }]}
            showClear={false}
          />
          <FieldDescription className={cn(typeScale.caption.meta, "sm:col-start-2 sm:row-start-3")}>
            Download our template, fill in Excel or Sheets, save as CSV, then upload.
          </FieldDescription>
        </Field>
      </div>

      <div
        className={cn(
          "flex flex-col gap-4 rounded-xl bg-muted/20 p-(--card-spacing) [--card-spacing:--spacing(4)]",
          surfaceOutlineClassName
        )}
      >
        <p className={typeScale.body.muted}>{csvRules[spreadsheetType]}</p>

        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              toast.success(`Uploaded ${file.name} — ${spreadsheetType} import queued for review.`)
            }
          }}
        />

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => toast.success(`Downloading ${spreadsheetType} template…`)}
          >
            <DownloadIcon className="size-4" />
            Download template
          </Button>
          <Button type="button" onClick={() => fileRef.current?.click()}>
            <UploadIcon className="size-4" />
            Upload filled CSV
          </Button>
        </div>

        <Collapsible open={columnsOpen} onOpenChange={setColumnsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-fit text-muted-foreground">
              {columnsOpen ? <ChevronDownIcon className="size-4" /> : <ChevronRightIcon className="size-4" />}
              Column order
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="mt-2 rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs leading-relaxed text-muted-foreground">
              {csvColumnOrders[spreadsheetType]}
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </CardContainer>
  )
}
