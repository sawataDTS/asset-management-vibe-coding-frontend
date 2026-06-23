"use client"

import * as React from "react"
import { useRef, useState } from "react"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  AppWindow,
  DownloadIcon,
  FileSpreadsheet,
  HardDrive,
  InfoIcon,
  Sparkles,
  UploadIcon,
} from "lucide-react"
import { toast } from "sonner"

import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { PageHeader } from "@/components/layout/PageHeader"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardActions, CardContent } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { TabNav, type TabNavItem } from "@/components/ui/tab-nav"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  billingPeriods,
  csvColumnOrders,
  csvSpreadsheetTypes,
  hardwareCategories,
  intakeModes,
  softwareCategories,
  suppliers,
} from "@/lib/intake/constants"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const INTAKE_TABS: TabNavItem[] = [
  { value: "hardware", label: "Hardware Inventory", icon: HardDrive },
  { value: "software", label: "Software License", icon: AppWindow },
  { value: "invoice", label: "By Invoice", icon: Sparkles },
  { value: "csv", label: "CSV Format", icon: FileSpreadsheet },
]

/** Card shell used on intake panels — matches SettingsPanel / auth forms (DESIGN.md §9–§10). */
const intakeCardClassName = "gap-0 py-0"
const intakeCardContentClassName = cn("p-(--card-spacing)", settingsControlClassName)

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className={typeScale.caption.overline}>{title}</h3>
      {children}
    </div>
  )
}

function IntakeIntroCard({ title, description }: { title: string; description: React.ReactNode }) {
  return (
    <Card className={intakeCardClassName}>
      <CardContent className={cn("space-y-1", intakeCardContentClassName)}>
        <h2 className={typeScale.title}>{title}</h2>
        <p className={typeScale.body.muted}>{description}</p>
      </CardContent>
    </Card>
  )
}

function IntakeFormCard({
  title,
  description,
  onSubmit,
  footer,
  children,
}: {
  title: string
  description: string
  onSubmit: (e: React.FormEvent) => void
  footer: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card className={intakeCardClassName}>
      <form onSubmit={onSubmit} className="flex flex-col">
        <CardContent className={cn("flex flex-col gap-6", intakeCardContentClassName)}>
          <div className="space-y-1">
            <h2 className={typeScale.heading}>{title}</h2>
            <p className={typeScale.body.muted}>{description}</p>
          </div>
          <div className="space-y-6">{children}</div>
        </CardContent>
        <CardActions>{footer}</CardActions>
      </form>
    </Card>
  )
}

function HardwareIntakeForm() {
  const today = new Date().toISOString().split("T")[0]
  const [supplier, setSupplier] = useState("")
  const [receivedOn, setReceivedOn] = useState(today)
  const [poNumber, setPoNumber] = useState("PO-2026-014")
  const [reference, setReference] = useState("INV-9912")
  const [itemName, setItemName] = useState('MacBook Pro 14"')
  const [category, setCategory] = useState("Laptop")
  const [brand, setBrand] = useState("Apple")
  const [model, setModel] = useState("M4 Pro 14-inch")
  const [quantity, setQuantity] = useState("10")
  const [unitCost, setUnitCost] = useState("2499.00")
  const [warrantyExpiry, setWarrantyExpiry] = useState("")
  const [tagPrefix, setTagPrefix] = useState("LAP")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!supplier) {
      toast.error("Select a supplier before receiving the shipment.")
      return
    }
    toast.success(`Received ${quantity} × ${itemName} as In Stock (${tagPrefix}-#### sequence).`)
  }

  return (
    <IntakeFormCard
      title="Receive shipment"
      description="Bulk-create assets for a delivery. All units land as In Stock and can be assigned later."
      onSubmit={handleSubmit}
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => toast.info("Form cleared.")}>
            Reset
          </Button>
          <Button type="submit">Receive shipment</Button>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="hw-supplier">Supplier</FieldLabel>
          <CustomSelect
            id="hw-supplier"
            placeholder="Select supplier"
            value={supplier}
            onChange={(value) => setSupplier(typeof value === "string" ? value : "")}
            options={toSelectOptions(suppliers)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="hw-received">Received on</FieldLabel>
          <DatePicker
            id="hw-received"
            value={receivedOn}
            onChange={setReceivedOn}
            placeholder="Select date"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="hw-po">PO number</FieldLabel>
          <Input id="hw-po" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="hw-ref">Reference / invoice</FieldLabel>
          <Input id="hw-ref" value={reference} onChange={(e) => setReference(e.target.value)} />
        </Field>
      </div>

      <FormSection title="Item">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="hw-item">Item name</FieldLabel>
            <Input id="hw-item" value={itemName} onChange={(e) => setItemName(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="hw-category">Category</FieldLabel>
            <CustomSelect
              id="hw-category"
              value={category}
              onChange={(value) => setCategory(typeof value === "string" ? value : category)}
              options={toSelectOptions(hardwareCategories)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="hw-brand">Brand</FieldLabel>
            <Input id="hw-brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="hw-model">Model</FieldLabel>
            <Input id="hw-model" value={model} onChange={(e) => setModel(e.target.value)} />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Quantity & costs">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="hw-qty">Quantity</FieldLabel>
            <Input
              id="hw-qty"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="hw-cost">Unit cost (USD)</FieldLabel>
            <Input
              id="hw-cost"
              type="number"
              step="0.01"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="hw-warranty">Warranty expiry</FieldLabel>
            <DatePicker
              id="hw-warranty"
              value={warrantyExpiry}
              onChange={setWarrantyExpiry}
              placeholder="Select date"
              allowClear
            />
          </Field>
        </div>
      </FormSection>

      <Field>
        <FieldLabel htmlFor="hw-prefix">Asset tag prefix</FieldLabel>
        <Input
          id="hw-prefix"
          value={tagPrefix}
          onChange={(e) => setTagPrefix(e.target.value.toUpperCase())}
          className="max-w-xs font-mono uppercase"
        />
        <FieldDescription>
          Tags auto-generated as PREFIX-0001, continuing from your last sequence. Serial numbers can be added
          per unit later.
        </FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="hw-notes">Notes</FieldLabel>
        <Textarea
          id="hw-notes"
          rows={3}
          placeholder="Anything to remember about this batch..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>
    </IntakeFormCard>
  )
}

function SoftwareIntakeForm() {
  const today = new Date().toISOString().split("T")[0]
  const [supplier, setSupplier] = useState("")
  const [purchasedOn, setPurchasedOn] = useState(today)
  const [poNumber, setPoNumber] = useState("PO-2026-014")
  const [reference, setReference] = useState("INV-9912")
  const [name, setName] = useState("Microsoft 365 Business")
  const [vendor, setVendor] = useState("Microsoft")
  const [category, setCategory] = useState("Productivity")
  const [intakeMode, setIntakeMode] = useState<(typeof intakeModes)[number]>(intakeModes[0])
  const [seats, setSeats] = useState("50")
  const [unitCost, setUnitCost] = useState("12.50")
  const [billingPeriod, setBillingPeriod] = useState<(typeof billingPeriods)[number]>("Annually")
  const [startDate, setStartDate] = useState(today)
  const [renewalDate, setRenewalDate] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!supplier) {
      toast.error("Select a supplier before recording the purchase.")
      return
    }
    toast.success(`Recorded ${name} with ${seats} seats.`)
  }

  return (
    <IntakeFormCard
      title="Record software purchase"
      description="Track a software buy from a supplier. Choose pooled seats for a single SaaS subscription, or individual keys to create one license per unit."
      onSubmit={handleSubmit}
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => toast.info("Form cleared.")}>
            Reset
          </Button>
          <Button type="submit">Record purchase</Button>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field>
          <FieldLabel htmlFor="sw-supplier">Supplier</FieldLabel>
          <CustomSelect
            id="sw-supplier"
            placeholder="Select supplier"
            value={supplier}
            onChange={(value) => setSupplier(typeof value === "string" ? value : "")}
            options={toSelectOptions(suppliers)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="sw-purchased">Purchased on</FieldLabel>
          <DatePicker
            id="sw-purchased"
            value={purchasedOn}
            onChange={setPurchasedOn}
            placeholder="Select date"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="sw-po">PO number</FieldLabel>
          <Input id="sw-po" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="sw-ref">Reference / invoice</FieldLabel>
          <Input id="sw-ref" value={reference} onChange={(e) => setReference(e.target.value)} />
        </Field>
      </div>

      <FormSection title="Software">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="sw-name">Name</FieldLabel>
            <Input id="sw-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="sw-vendor">Vendor</FieldLabel>
            <Input id="sw-vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="sw-category">Category</FieldLabel>
            <CustomSelect
              id="sw-category"
              value={category}
              onChange={(value) => setCategory(typeof value === "string" ? value : category)}
              options={toSelectOptions(softwareCategories)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="sw-mode">Intake mode</FieldLabel>
            <CustomSelect
              id="sw-mode"
              value={intakeMode}
              onChange={(value) =>
                setIntakeMode(
                  (typeof value === "string" ? value : intakeMode) as (typeof intakeModes)[number]
                )
              }
              options={toSelectOptions(intakeModes)}
              showClear={false}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Quantity, cost & dates">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <Field>
            <FieldLabel htmlFor="sw-seats">Seats</FieldLabel>
            <Input
              id="sw-seats"
              type="number"
              min={1}
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="sw-cost">Unit cost (USD)</FieldLabel>
            <Input
              id="sw-cost"
              type="number"
              step="0.01"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="sw-billing">Billing period</FieldLabel>
            <CustomSelect
              id="sw-billing"
              value={billingPeriod}
              onChange={(value) =>
                setBillingPeriod(
                  (typeof value === "string" ? value : billingPeriod) as (typeof billingPeriods)[number]
                )
              }
              options={toSelectOptions(billingPeriods)}
              showClear={false}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="sw-start">Start date</FieldLabel>
            <DatePicker id="sw-start" value={startDate} onChange={setStartDate} placeholder="Select date" />
          </Field>
          <Field>
            <FieldLabel htmlFor="sw-renewal">Renewal date (optional)</FieldLabel>
            <DatePicker
              id="sw-renewal"
              value={renewalDate}
              onChange={setRenewalDate}
              placeholder="Select date"
              allowClear
            />
          </Field>
        </div>
      </FormSection>

      <Field>
        <FieldLabel htmlFor="sw-notes">Notes</FieldLabel>
        <Textarea
          id="sw-notes"
          rows={3}
          placeholder="Anything to remember about this purchase..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>
    </IntakeFormCard>
  )
}

function InvoiceIntakeForm() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = (file: File | null) => {
    if (!file) return
    const allowed = ["image/jpeg", "image/png", "application/pdf"]
    if (!allowed.includes(file.type)) {
      toast.error("Upload a JPG, PNG, or PDF file.")
      return
    }
    if (file.size > 12 * 1024 * 1024) {
      toast.error("File must be under 12 MB.")
      return
    }
    setFileName(file.name)
    toast.success(`Uploaded ${file.name} — ready for AI review.`)
  }

  return (
    <Card className={intakeCardClassName}>
      <CardContent className={cn("flex flex-col gap-6", intakeCardContentClassName)}>
        <div className="space-y-1">
          <h2 className={typeScale.heading}>Add by invoice</h2>
          <p className={typeScale.body.muted}>
            Upload an invoice (image or PDF). AI extracts supplier, hardware, and software line items. Review,
            edit, then proceed to create assets and licenses.
          </p>
        </div>

        <ul className={cn("list-inside list-disc space-y-1", typeScale.body.muted)}>
          <li>Hardware lines become asset items.</li>
          <li>Software lines become software licenses.</li>
          <li>Suppliers are matched by name.</li>
          <li>Supported files: JPG, PNG, or PDF.</li>
        </ul>

        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />

        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileRef.current?.click()
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFile(e.dataTransfer.files?.[0] ?? null)
          }}
          onClick={() => fileRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/20 hover:border-primary/40 hover:bg-primary/5"
          )}
        >
          <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-accent text-primary">
            <UploadIcon className="size-5" />
          </span>
          <p className={typeScale.body.emphasis}>{fileName ? fileName : "Drop an invoice here, or"}</p>
          {!fileName ? (
            <Button
              type="button"
              className="mt-3"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                fileRef.current?.click()
              }}
            >
              Choose file
            </Button>
          ) : null}
          <p className={cn("mt-2", typeScale.caption.meta)}>JPG, PNG, or PDF · up to ~12 MB</p>
        </div>

        <Alert>
          <InfoIcon />
          <AlertTitle>How parsing works</AlertTitle>
          <AlertDescription>
            AI parses the invoice into editable line items. Nothing is created until you confirm on the review
            step. The parser will not invent items not present on the invoice.
          </AlertDescription>
        </Alert>
      </CardContent>

      {fileName ? (
        <CardActions>
          <Button onClick={() => toast.success("Opening review step with extracted line items…")}>
            Review extracted items
          </Button>
        </CardActions>
      ) : null}
    </Card>
  )
}

function CsvIntakeForm() {
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
    <Card className={intakeCardClassName}>
      <CardContent className={cn("flex flex-col gap-6", intakeCardContentClassName)}>
        <p className={typeScale.body.muted}>
          Download a template that matches your intake type (hardware, software, or employees), upload a
          filled CSV, then review and import approved rows.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="csv-type">Spreadsheet type</FieldLabel>
            <CustomSelect
              id="csv-type"
              value={spreadsheetType}
              onChange={(value) =>
                setSpreadsheetType(
                  (typeof value === "string"
                    ? value
                    : spreadsheetType) as (typeof csvSpreadsheetTypes)[number]
                )
              }
              options={toSelectOptions(csvSpreadsheetTypes)}
              showClear={false}
            />
            <FieldDescription>
              Pick what this CSV adds: hardware assets, software licenses, or employee directory records.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="csv-format">Import format</FieldLabel>
            <CustomSelect
              id="csv-format"
              value="assetops"
              onChange={() => undefined}
              options={[{ label: "AssetOps CSV template", value: "assetops" }]}
              showClear={false}
            />
            <FieldDescription>
              Download our template, fill in Excel or Sheets, save as CSV, then upload.
            </FieldDescription>
          </Field>
        </div>

        <Card size="sm" className={cn(intakeCardClassName, "bg-muted/20 ring-border/60")}>
          <CardContent className={cn("space-y-4", intakeCardContentClassName)}>
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
                <Button variant="ghost" size="sm" className="h-8 gap-1 px-0 text-muted-foreground">
                  {columnsOpen ? (
                    <ChevronDownIcon className="size-4" />
                  ) : (
                    <ChevronRightIcon className="size-4" />
                  )}
                  Column order
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="mt-2 rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs leading-relaxed text-muted-foreground">
                  {csvColumnOrders[spreadsheetType]}
                </p>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

function IntakePage() {
  return (
    <>
      <PageHeader
        // icon={Inbox}
        title="Intake"
        description="Manage hardware inventory and software licenses in one place."
      >
        <Tabs defaultValue="hardware" className="gap-4">
          <TabNav items={INTAKE_TABS} />

          <TabsContent value="hardware" className="space-y-4">
            <IntakeIntroCard
              title="Hardware Inventory"
              description={
                <>
                  Add and manage company hardware assets. Units land as{" "}
                  <span className={typeScale.body.emphasis}>In Stock</span> and can be assigned later.
                </>
              }
            />
            <HardwareIntakeForm />
          </TabsContent>

          <TabsContent value="software" className="space-y-4">
            <IntakeIntroCard
              title="Software License"
              description="Record SaaS subscriptions and license purchases from suppliers. Supports pooled seats or individual keys."
            />
            <SoftwareIntakeForm />
          </TabsContent>

          <TabsContent value="invoice" className="space-y-4">
            <IntakeIntroCard
              title="Add by Invoice"
              description="Upload an invoice and let AI extract hardware, software, and supplier details for review."
            />
            <InvoiceIntakeForm />
          </TabsContent>

          <TabsContent value="csv" className="space-y-4">
            <IntakeIntroCard
              title="CSV Format"
              description="Bulk import hardware, software, or employee records using a structured spreadsheet template."
            />
            <CsvIntakeForm />
          </TabsContent>
        </Tabs>
      </PageHeader>
    </>
  )
}

export { IntakePage }
