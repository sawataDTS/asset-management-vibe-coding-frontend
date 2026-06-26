"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ModalContainer } from "@/components/ui/modal-container"
import { Textarea } from "@/components/ui/textarea"
import { type Supplier } from "@/lib/suppliers/data"

export interface AddEditSupplierDialogProps {
  open: boolean
  mode: "add" | "edit"
  onOpenChange: (open: boolean) => void
  selectedSupplier: Supplier | null
  onClose: () => void
}

function AddEditSupplierDialog({
  open,
  mode,
  onOpenChange,
  selectedSupplier,
  onClose,
}: AddEditSupplierDialogProps) {
  const [formName, setFormName] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formWebsite, setFormWebsite] = useState("")
  const [formContactName, setFormContactName] = useState("")
  const [formContactEmail, setFormContactEmail] = useState("")
  const [formContactPhone, setFormContactPhone] = useState("")
  const [formAddress, setFormAddress] = useState("")
  const [formNotes, setFormNotes] = useState("")

  useEffect(() => {
    if (selectedSupplier && mode === "edit") {
      setFormName(selectedSupplier.name)
      setFormCategory(selectedSupplier.category)
      setFormWebsite(selectedSupplier.website)
      setFormContactName(selectedSupplier.contactName)
      setFormContactEmail(selectedSupplier.contactEmail)
      setFormContactPhone(selectedSupplier.contactPhone)
      setFormAddress(selectedSupplier.address)
      setFormNotes(selectedSupplier.notes)
    } else if (mode === "add") {
      setFormName("")
      setFormCategory("")
      setFormWebsite("")
      setFormContactName("")
      setFormContactEmail("")
      setFormContactPhone("")
      setFormAddress("")
      setFormNotes("")
    }
  }, [selectedSupplier, mode])

  function handleSaveSupplier(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim()) {
      toast.error("Supplier name is required.")
      return
    }

    const payload = {
      name: formName.trim(),
      category: formCategory.trim(),
      website: formWebsite.trim(),
      contactName: formContactName.trim(),
      contactEmail: formContactEmail.trim(),
      contactPhone: formContactPhone.trim(),
      address: formAddress.trim(),
      notes: formNotes.trim(),
    }

    if (mode === "add") {
      const newSupplier: Supplier = {
        id: `sup-${Date.now()}`,
        ...payload,
        hardwareCount: 0,
        softwareCount: 0,
        hasVendorCert: false,
      }
      // call api here
      void newSupplier
      toast.success(`Added supplier ${newSupplier.name}.`)
    } else if (mode === "edit" && selectedSupplier) {
      // call api here
      void payload
      toast.success(`Updated supplier ${payload.name}.`)
    }

    onClose()
  }

  return (
    <ModalContainer
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "add" ? "Add supplier" : "Edit supplier"}
      description="Vendor details and contact info."
      formControls
      onSubmit={handleSaveSupplier}
      footer={
        <>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">{mode === "add" ? "Add supplier" : "Save changes"}</Button>
        </>
      }
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="supplier-name">Name *</FieldLabel>
          <Input
            id="supplier-name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="supplier-category">Category</FieldLabel>
            <Input
              id="supplier-category"
              placeholder="Reseller, OEM..."
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="supplier-website">Website</FieldLabel>
            <Input
              id="supplier-website"
              placeholder="https://"
              value={formWebsite}
              onChange={(e) => setFormWebsite(e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="supplier-contact-name">Contact Name</FieldLabel>
            <Input
              id="supplier-contact-name"
              value={formContactName}
              onChange={(e) => setFormContactName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="supplier-contact-email">Contact Email</FieldLabel>
            <Input
              id="supplier-contact-email"
              type="email"
              value={formContactEmail}
              onChange={(e) => setFormContactEmail(e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="supplier-contact-phone">Contact Phone</FieldLabel>
            <Input
              id="supplier-contact-phone"
              value={formContactPhone}
              onChange={(e) => setFormContactPhone(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="supplier-address">Address</FieldLabel>
            <Input
              id="supplier-address"
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="supplier-notes">Notes</FieldLabel>
          <Textarea
            id="supplier-notes"
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
            rows={3}
          />
        </Field>
      </FieldGroup>
    </ModalContainer>
  )
}

export { AddEditSupplierDialog }
export default AddEditSupplierDialog
