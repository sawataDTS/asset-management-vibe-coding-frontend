"use client"

import * as React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { Button } from "@/components/ui/button"
import { CardContainer } from "@/components/ui/card-container"
import { DatePicker } from "@/components/ui/date-picker"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { hardwareCategories, suppliers } from "@/lib/intake/constants"
import { typeScale } from "@/lib/typography"

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className={typeScale.caption.overline}>{title}</h3>
      {children}
    </div>
  )
}

export default function HardwareIntakeForm() {
  const today = new Date().toISOString().split("T")[0]
  const [supplier, setSupplier] = useState("")
  const [receivedOn, setReceivedOn] = useState(today)
  const [poNumber, setPoNumber] = useState("")
  const [reference, setReference] = useState("")
  const [itemName, setItemName] = useState("")
  const [category, setCategory] = useState("Laptop")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [quantity, setQuantity] = useState("10")
  const [unitCost, setUnitCost] = useState("")
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
    <CardContainer
      variant="form"
      formControls
      title="Hardware Inventory"
      description={
        <>
          Add and manage company hardware assets. Bulk-create units from a delivery; they land as{" "}
          <span className={typeScale.body.emphasis}>In Stock</span> and can be assigned later.
        </>
      }
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
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="hw-supplier">Supplier</FieldLabel>
            <CustomSelect
              id="hw-supplier"
              placeholder="Select supplier"
              value={supplier}
              onChange={(value) => setSupplier(typeof value === "string" ? value : "")}
              options={toSelectOptions(suppliers)}
              searchable
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
            <Input
              id="hw-po"
              value={poNumber}
              placeholder="PO-2026-014"
              onChange={(e) => setPoNumber(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="hw-ref">Reference / invoice</FieldLabel>
            <Input
              id="hw-ref"
              value={reference}
              placeholder="INV-9912"
              onChange={(e) => setReference(e.target.value)}
            />
          </Field>
        </div>

        <FormSection title="Item">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="hw-item">Item name</FieldLabel>
              <Input
                id="hw-item"
                value={itemName}
                placeholder='MacBook Pro 14\"'
                onChange={(e) => setItemName(e.target.value)}
              />
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
              <Input
                id="hw-brand"
                value={brand}
                placeholder="Apple"
                onChange={(e) => setBrand(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="hw-model">Model</FieldLabel>
              <Input
                id="hw-model"
                value={model}
                placeholder="M4 Pro 14-inch"
                onChange={(e) => setModel(e.target.value)}
              />
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
                placeholder="2499.00"
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
          <FieldContent>
            <Input
              id="hw-prefix"
              value={tagPrefix}
              onChange={(e) => setTagPrefix(e.target.value.toUpperCase())}
              className="max-w-xs font-mono uppercase"
            />
            <FieldDescription className={typeScale.caption.meta}>
              Tags auto-generated as PREFIX-0001, continuing from your last sequence. Serial numbers can be
              added per unit later.
            </FieldDescription>
          </FieldContent>
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
      </div>
    </CardContainer>
  )
}
