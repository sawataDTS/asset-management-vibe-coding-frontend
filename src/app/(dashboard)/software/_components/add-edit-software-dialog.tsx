"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { CardActions } from "@/components/ui/card"

import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  dialogFormClassName,
  dialogHeaderClassName,
  dialogScrollBodyClassName,
  dialogShellClassNameWide,
} from "@/lib/dialog-layout"
import {
  BILLING_PERIOD,
  LICENSE_STATUSES,
  SOFTWARE_CATEGORIES,
  type SoftwareLicense,
} from "@/lib/software/data"

import { cn } from "@/lib/utils"
import { HARDWARE_SUPPLIERS } from "@/lib/hardware/data"

interface IProps {
  open: any
  activeModal: any
  onOpenChange: any
  handleCloseModal: any
  selectedLicense: any
}

export default function AddEditSoftwareDialog({
  open,
  onOpenChange,
  activeModal,
  handleCloseModal,
  selectedLicense,
}: IProps) {
  const [formName, setFormName] = useState("")
  const [formCategory, setFormCategory] = useState<string>(SOFTWARE_CATEGORIES[0])
  const [formSupplier, setFormSupplier] = useState("")
  const [formTotalSeats, setFormTotalSeats] = useState(10)
  const [formCost, setFormCost] = useState("")
  const [formRenewalDate, setFormRenewalDate] = useState("")
  const [formKey, setFormKey] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formStatus, setFormStatus] = useState("")
  const [formBillingPeriod, setFormBillingPeriod] = useState("")
  const [formStartDate, setFormStartDate] = useState("")
  const [formWebsite, setFormWebsite] = useState("")
  function handleSaveLicense(e: React.FormEvent) {
    e.preventDefault()
    if (!formName || !formSupplier) {
      toast.error("Name and supplier are required fields.")
      return
    }

    const todayStr = new Date().toISOString().split("T")[0]

    if (activeModal === "add") {
      const newLic: SoftwareLicense = {
        id: Math.random().toString(36).slice(2, 11),
        name: formName,
        category: formCategory,
        supplier: formSupplier,
        totalSeats: formTotalSeats,
        assignedSeats: 0,
        renewalDate: formRenewalDate,
        cost: formCost || "$0/mo",
        key: formKey,
        status: "Active",
        assignees: [],
        description: formDescription,
        history: [
          {
            date: todayStr,
            action: "License Subscription Registered",
            user: "John Doe",
            notes: `Initial seat size: ${formTotalSeats}.`,
          },
        ],
      }
      // api call
      toast.success(`Registered subscription for ${formName}.`)
    } else if (activeModal === "edit" && selectedLicense) {
      // api call
      toast.success(`Updated subscription details for ${selectedLicense.name}.`)
    }

    handleCloseModal()
  }
  console.log(selectedLicense, "selected")

  useEffect(() => {
    if (selectedLicense && activeModal === "edit") {
      setFormName(selectedLicense.name)
      setFormCategory(selectedLicense.category)
      setFormSupplier(selectedLicense.supplier)
      setFormTotalSeats(selectedLicense.totalSeats)
      setFormCost(selectedLicense.cost)
      setFormRenewalDate(selectedLicense.renewalDate)
      setFormKey(selectedLicense.key)
      setFormDescription(selectedLicense.description ?? "")
      setFormStatus(selectedLicense.status)
      setFormBillingPeriod(selectedLicense.billing_period)
      setFormStartDate(selectedLicense.startDate)
      setFormWebsite(selectedLicense.website)
    } else if (activeModal === "add") {
      setFormName("")
      setFormCategory(SOFTWARE_CATEGORIES[0])
      setFormSupplier("")
      setFormTotalSeats(1)
      setFormCost("")
      setFormRenewalDate("")
      setFormKey("")
      setFormDescription("")
      setFormStatus("Active")
      setFormBillingPeriod("Annually")
      setFormWebsite("")
    }
  }, [selectedLicense, activeModal])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogShellClassNameWide}>
        <DialogHeader className={dialogHeaderClassName}>
          <DialogTitle>{activeModal === "add" ? "Add Software" : "Edit Software"}</DialogTitle>
          <DialogDescription>
            Supplier, app name, seats, and dates. Renewal is optional for one-time or perpetual licenses.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSaveLicense} className={dialogFormClassName}>
          <DialogBody className={cn(dialogScrollBodyClassName, settingsControlClassName)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="license-name">Supplier *</FieldLabel>
                <CustomSelect
                  id="asset-supplier"
                  value={formSupplier}
                  placeholder="Select a supplier"
                  onChange={(value) => setFormSupplier(typeof value === "string" ? value : formSupplier)}
                  options={toSelectOptions(HARDWARE_SUPPLIERS)}
                  showClear={false}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="license-name">Software Name *</FieldLabel>
                <Input
                  id="license-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="license-supplier">Vendor</FieldLabel>
                  <Input
                    id="license-supplier"
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="license-category">Category</FieldLabel>
                  <CustomSelect
                    id="license-category"
                    value={formCategory}
                    onChange={(value) => setFormCategory(typeof value === "string" ? value : formCategory)}
                    options={toSelectOptions(SOFTWARE_CATEGORIES)}
                    showClear={false}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="license-name">Website</FieldLabel>
                <Input
                  id="license-name"
                  placeholder="https://"
                  value={formWebsite}
                  onChange={(e) => setFormWebsite(e.target.value)}
                  required
                />
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="license-seats">Total seats *</FieldLabel>
                  <Input
                    id="license-seats"
                    type="number"
                    min={1}
                    value={formTotalSeats}
                    onChange={(e) => setFormTotalSeats(parseInt(e.target.value, 10) || 0)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="license-cost">Cost (USD, per billing period)</FieldLabel>
                  <Input
                    id="license-cost"
                    placeholder="Optional"
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="license-seats">Billing Period</FieldLabel>
                  <CustomSelect
                    id="license-status"
                    value={formBillingPeriod}
                    onChange={(value) => setFormBillingPeriod(typeof value === "string" ? value : formStatus)}
                    options={toSelectOptions(BILLING_PERIOD)}
                    showClear={false}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="license-cost">Status</FieldLabel>
                  <CustomSelect
                    id="license-status"
                    value={formStatus}
                    onChange={(value) => setFormStatus(typeof value === "string" ? value : formStatus)}
                    options={toSelectOptions(LICENSE_STATUSES)}
                    showClear={false}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="license-renewal">Start Date *</FieldLabel>
                  <DatePicker
                    id="license-start"
                    value={formStartDate}
                    onChange={setFormStartDate}
                    placeholder="Select date"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="license-renewal">Renewal Date (optional)</FieldLabel>
                  <DatePicker
                    id="license-renewal"
                    value={formRenewalDate}
                    onChange={setFormRenewalDate}
                    placeholder="Select date"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="license-key">License key</FieldLabel>
                <Input id="license-key" value={formKey} onChange={(e) => setFormKey(e.target.value)} />
              </Field>

              <Field>
                <FieldLabel htmlFor="license-desc">Notes</FieldLabel>
                <Textarea
                  id="license-desc"
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </Field>
            </FieldGroup>
          </DialogBody>
          <CardActions>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">{activeModal === "add" ? "Add Software" : "Save Changes"}</Button>
          </CardActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
