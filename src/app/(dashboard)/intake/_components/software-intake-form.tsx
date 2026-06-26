"use client"

import * as React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { Button } from "@/components/ui/button"
import { CardContainer } from "@/components/ui/card-container"
import { DatePicker } from "@/components/ui/date-picker"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { billingPeriods, intakeModes, softwareCategories, suppliers } from "@/lib/intake/constants"
import { typeScale } from "@/lib/typography"

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className={typeScale.caption.overline}>{title}</h3>
      {children}
    </div>
  )
}

export default function SoftwareIntakeForm() {
  const today = new Date().toISOString().split("T")[0]
  const [supplier, setSupplier] = useState("")
  const [purchasedOn, setPurchasedOn] = useState(today)
  const [poNumber, setPoNumber] = useState("")
  const [reference, setReference] = useState("")
  const [name, setName] = useState("")
  const [vendor, setVendor] = useState("")
  const [category, setCategory] = useState("")
  const [intakeMode, setIntakeMode] = useState<(typeof intakeModes)[number]>(intakeModes[0])
  const [seats, setSeats] = useState("50")
  const [unitCost, setUnitCost] = useState("")
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
    <CardContainer
      variant="form"
      formControls
      title="Software License"
      description="Record SaaS subscriptions and license purchases from suppliers. Supports pooled seats or individual keys."
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
      <div className="space-y-6">
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
            <Input
              id="sw-po"
              value={poNumber}
              placeholder="PO-2026-014"
              onChange={(e) => setPoNumber(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="sw-ref">Reference / invoice</FieldLabel>
            <Input
              id="sw-ref"
              value={reference}
              placeholder="INV-9912"
              onChange={(e) => setReference(e.target.value)}
            />
          </Field>
        </div>

        <FormSection title="Software">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="sw-name">Name</FieldLabel>
              <Input
                id="sw-name"
                value={name}
                placeholder="Microsoft 365 Business"
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="sw-vendor">Vendor</FieldLabel>
              <Input
                id="sw-vendor"
                value={vendor}
                placeholder="Microsoft"
                onChange={(e) => setVendor(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="sw-category">Category</FieldLabel>
              <CustomSelect
                id="sw-category"
                value={category}
                placeholder="Productivity"
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
                placeholder="12.50"
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
      </div>
    </CardContainer>
  )
}
