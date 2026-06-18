"use client"

import * as React from "react"
import { useRef, useState } from "react"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CpuIcon,
  DownloadIcon,
  FileSpreadsheetIcon,
  HardDriveIcon,
  InfoIcon,
  KeyIcon,
  PackageIcon,
  SparklesIcon,
  UploadIcon,
} from "lucide-react"
import { Toaster, toast } from "sonner"

import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import {
  billingPeriods,
  csvColumnOrders,
  csvSpreadsheetTypes,
  hardwareCategories,
  intakeModes,
  softwareCategories,
  suppliers,
} from "@/components/dashboard/intake/constants"
import { PageHeader } from "@/components/dashboard/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

function FormField({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string
  htmlFor?: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

function FormSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground">{title}</h3>
      {children}
    </div>
  )
}

function IntakeIntroCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: React.ReactNode
}) {
  return (
    <DashboardCard className="p-5">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 space-y-1">
          <h2 className="text-sm font-medium tracking-tight text-foreground">{title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </DashboardCard>
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
    toast.success(
      `Received ${quantity} × ${itemName} as In Stock (${tagPrefix}-#### sequence).`
    )
  }

  return (
    <DashboardCard className="p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-base font-medium tracking-tight">Receive shipment</h2>
        <p className="text-sm text-muted-foreground">
          Bulk-create assets for a delivery. All units land as In Stock and can be assigned later.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Supplier" htmlFor="hw-supplier">
            <NativeSelect
              id="hw-supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full"
            >
              <NativeSelectOption value="">Select supplier</NativeSelectOption>
              {suppliers.map((s) => (
                <NativeSelectOption key={s} value={s}>
                  {s}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FormField>
          <FormField label="Received on" htmlFor="hw-received">
            <Input
              id="hw-received"
              type="date"
              value={receivedOn}
              onChange={(e) => setReceivedOn(e.target.value)}
            />
          </FormField>
          <FormField label="PO number" htmlFor="hw-po">
            <Input id="hw-po" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
          </FormField>
          <FormField label="Reference / invoice" htmlFor="hw-ref">
            <Input id="hw-ref" value={reference} onChange={(e) => setReference(e.target.value)} />
          </FormField>
        </div>

        <FormSection title="ITEM">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Item name" htmlFor="hw-item">
              <Input id="hw-item" value={itemName} onChange={(e) => setItemName(e.target.value)} />
            </FormField>
            <FormField label="Category" htmlFor="hw-category">
              <NativeSelect
                id="hw-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full"
              >
                {hardwareCategories.map((c) => (
                  <NativeSelectOption key={c} value={c}>
                    {c}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FormField>
            <FormField label="Brand" htmlFor="hw-brand">
              <Input id="hw-brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </FormField>
            <FormField label="Model" htmlFor="hw-model">
              <Input id="hw-model" value={model} onChange={(e) => setModel(e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="QUANTITY & COSTS">
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Quantity" htmlFor="hw-qty">
              <Input
                id="hw-qty"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </FormField>
            <FormField label="Unit cost (USD)" htmlFor="hw-cost">
              <Input
                id="hw-cost"
                type="number"
                step="0.01"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
              />
            </FormField>
            <FormField label="Warranty expiry" htmlFor="hw-warranty">
              <Input
                id="hw-warranty"
                type="date"
                value={warrantyExpiry}
                onChange={(e) => setWarrantyExpiry(e.target.value)}
              />
            </FormField>
          </div>
        </FormSection>

        <FormField
          label="Asset tag prefix"
          htmlFor="hw-prefix"
          hint="Tags auto-generated as PREFIX-0001, continuing from your last sequence. Serial numbers can be added per unit later."
        >
          <Input
            id="hw-prefix"
            value={tagPrefix}
            onChange={(e) => setTagPrefix(e.target.value.toUpperCase())}
            className="max-w-xs font-mono uppercase"
          />
        </FormField>

        <FormField label="Notes" htmlFor="hw-notes">
          <Textarea
            id="hw-notes"
            rows={3}
            placeholder="Anything to remember about this batch..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </FormField>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={() => toast.info("Form cleared.")}>
            Reset
          </Button>
          <Button type="submit">Receive shipment</Button>
        </div>
      </form>
    </DashboardCard>
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
    <DashboardCard className="p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-base font-medium tracking-tight">Record software purchase</h2>
        <p className="text-sm text-muted-foreground">
          Track a software buy from a supplier. Choose pooled seats for a single SaaS subscription,
          or individual keys to create one license per unit.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormField label="Supplier" htmlFor="sw-supplier">
            <NativeSelect
              id="sw-supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full"
            >
              <NativeSelectOption value="">Select supplier</NativeSelectOption>
              {suppliers.map((s) => (
                <NativeSelectOption key={s} value={s}>
                  {s}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FormField>
          <FormField label="Purchased on" htmlFor="sw-purchased">
            <Input
              id="sw-purchased"
              type="date"
              value={purchasedOn}
              onChange={(e) => setPurchasedOn(e.target.value)}
            />
          </FormField>
          <FormField label="PO number" htmlFor="sw-po">
            <Input id="sw-po" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
          </FormField>
          <FormField label="Reference / invoice" htmlFor="sw-ref">
            <Input id="sw-ref" value={reference} onChange={(e) => setReference(e.target.value)} />
          </FormField>
        </div>

        <FormSection title="SOFTWARE">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Name" htmlFor="sw-name">
              <Input id="sw-name" value={name} onChange={(e) => setName(e.target.value)} />
            </FormField>
            <FormField label="Vendor" htmlFor="sw-vendor">
              <Input id="sw-vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} />
            </FormField>
            <FormField label="Category" htmlFor="sw-category">
              <NativeSelect
                id="sw-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full"
              >
                {softwareCategories.map((c) => (
                  <NativeSelectOption key={c} value={c}>
                    {c}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FormField>
            <FormField label="Intake mode" htmlFor="sw-mode">
              <NativeSelect
                id="sw-mode"
                value={intakeMode}
                onChange={(e) =>
                  setIntakeMode(e.target.value as (typeof intakeModes)[number])
                }
                className="w-full"
              >
                {intakeModes.map((m) => (
                  <NativeSelectOption key={m} value={m}>
                    {m}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="QUANTITY, COST & DATES">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <FormField label="Seats" htmlFor="sw-seats">
              <Input
                id="sw-seats"
                type="number"
                min={1}
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
              />
            </FormField>
            <FormField label="Unit cost (USD)" htmlFor="sw-cost">
              <Input
                id="sw-cost"
                type="number"
                step="0.01"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
              />
            </FormField>
            <FormField label="Billing period" htmlFor="sw-billing">
              <NativeSelect
                id="sw-billing"
                value={billingPeriod}
                onChange={(e) =>
                  setBillingPeriod(e.target.value as (typeof billingPeriods)[number])
                }
                className="w-full"
              >
                {billingPeriods.map((p) => (
                  <NativeSelectOption key={p} value={p}>
                    {p}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FormField>
            <FormField label="Start date" htmlFor="sw-start">
              <Input
                id="sw-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormField>
            <FormField label="Renewal date (optional)" htmlFor="sw-renewal">
              <Input
                id="sw-renewal"
                type="date"
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
              />
            </FormField>
          </div>
        </FormSection>

        <FormField label="Notes" htmlFor="sw-notes">
          <Textarea
            id="sw-notes"
            rows={3}
            placeholder="Anything to remember about this purchase..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </FormField>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={() => toast.info("Form cleared.")}>
            Reset
          </Button>
          <Button type="submit">Record purchase</Button>
        </div>
      </form>
    </DashboardCard>
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
    <DashboardCard className="p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-base font-medium tracking-tight">Add by invoice</h2>
        <p className="text-sm text-muted-foreground">
          Upload an invoice (image or PDF). AI extracts supplier, hardware, and software line items.
          Review, edit, then proceed to create assets and licenses.
        </p>
      </div>

      <ul className="mb-6 list-inside list-disc space-y-1 text-sm text-muted-foreground">
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
        <div className="mb-3 grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
          <UploadIcon className="size-5" />
        </div>
        <p className="text-sm font-medium text-foreground">
          {fileName ? fileName : "Drop an invoice here, or"}
        </p>
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
        <p className="mt-2 text-xs text-muted-foreground">JPG, PNG, or PDF · up to ~12 MB</p>
      </div>

      <Alert className="mt-4 border-border bg-muted/30">
        <InfoIcon />
        <AlertTitle>How parsing works</AlertTitle>
        <AlertDescription>
          AI parses the invoice into editable line items. Nothing is created until you confirm on the
          review step. The parser will not invent items not present on the invoice.
        </AlertDescription>
      </Alert>

      {fileName ? (
        <div className="mt-4 flex justify-end">
          <Button onClick={() => toast.success("Opening review step with extracted line items…")}>
            Review extracted items
          </Button>
        </div>
      ) : null}
    </DashboardCard>
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
    <DashboardCard className="p-6">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Download a template that matches your intake type (hardware, software, or employees), upload
        a filled CSV, then review and import approved rows.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FormField
          label="Spreadsheet type"
          htmlFor="csv-type"
          hint="Pick what this CSV adds: hardware assets, software licenses, or employee directory records."
        >
          <NativeSelect
            id="csv-type"
            value={spreadsheetType}
            onChange={(e) =>
              setSpreadsheetType(e.target.value as (typeof csvSpreadsheetTypes)[number])
            }
            className="w-full"
          >
            {csvSpreadsheetTypes.map((t) => (
              <NativeSelectOption key={t} value={t}>
                {t}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <FormField
          label="Import format"
          htmlFor="csv-format"
          hint="Download our template, fill in Excel or Sheets, save as CSV, then upload."
        >
          <NativeSelect id="csv-format" defaultValue="assetops" className="w-full">
            <NativeSelectOption value="assetops">AssetOps CSV template</NativeSelectOption>
          </NativeSelect>
        </FormField>
      </div>

      <DashboardCard className="mt-6 border border-border bg-muted/20 p-5 shadow-none ring-0">
        <p className="text-sm leading-relaxed text-muted-foreground">{csvRules[spreadsheetType]}</p>

        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) toast.success(`Uploaded ${file.name} — ${spreadsheetType} import queued for review.`)
          }}
        />

        <div className="mt-4 flex flex-wrap gap-2">
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

        <Collapsible open={columnsOpen} onOpenChange={setColumnsOpen} className="mt-4">
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
      </DashboardCard>
    </DashboardCard>
  )
}

export default function IntakePage() {
  return (
    <DashboardShell title="Intake">
      <Toaster position="top-right" closeButton richColors />

      <div className="flex items-start gap-3">
        <div className="mt-1 grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
          <PackageIcon className="size-4" />
        </div>
        <PageHeader
          className="flex-1"
          title="Intake"
          description="Manage hardware inventory and software licenses in one place."
        />
      </div>

      <Tabs defaultValue="hardware" className="mt-8">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1 sm:w-fit">
          <TabsTrigger value="hardware" className="gap-1.5 px-3 py-2">
            <HardDriveIcon className="size-4" />
            Hardware Inventory
          </TabsTrigger>
          <TabsTrigger value="software" className="gap-1.5 px-3 py-2">
            <KeyIcon className="size-4" />
            Software License
          </TabsTrigger>
          <TabsTrigger value="invoice" className="gap-1.5 px-3 py-2">
            <SparklesIcon className="size-4" />
            By Invoice
          </TabsTrigger>
          <TabsTrigger value="csv" className="gap-1.5 px-3 py-2">
            <FileSpreadsheetIcon className="size-4" />
            CSV Format
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hardware" className="mt-6 space-y-4">
          <IntakeIntroCard
            icon={CpuIcon}
            title="Hardware Inventory"
            description={
              <>
                Add and manage company hardware assets. Units land as{" "}
                <span className="font-medium text-foreground">In Stock</span> and can be assigned
                later.
              </>
            }
          />
          <HardwareIntakeForm />
        </TabsContent>

        <TabsContent value="software" className="mt-6 space-y-4">
          <IntakeIntroCard
            icon={KeyIcon}
            title="Software License"
            description="Record SaaS subscriptions and license purchases from suppliers. Supports pooled seats or individual keys."
          />
          <SoftwareIntakeForm />
        </TabsContent>

        <TabsContent value="invoice" className="mt-6 space-y-4">
          <IntakeIntroCard
            icon={SparklesIcon}
            title="Add by Invoice"
            description="Upload an invoice and let AI extract hardware, software, and supplier details for review."
          />
          <InvoiceIntakeForm />
        </TabsContent>

        <TabsContent value="csv" className="mt-6 space-y-4">
          <IntakeIntroCard
            icon={FileSpreadsheetIcon}
            title="CSV Format"
            description="Bulk import hardware, software, or employee records using a structured spreadsheet template."
          />
          <CsvIntakeForm />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
