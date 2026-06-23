"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"

import { SuppliersTable } from "./suppliers-table"
import { PageHeader } from "@/components/layout/PageHeader"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { Card, CardActions, CardContent } from "@/components/ui/card"
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
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import {
  dialogFormClassName,
  dialogHeaderClassName,
  dialogScrollBodyClassName,
  dialogShellClassName,
  dialogShellClassNameCompact,
} from "@/lib/dialog-layout"
import { initialSuppliers, type Supplier } from "@/lib/suppliers/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

type ActiveModal = "add" | "edit" | "delete" | null

const suppliersCardClassName = "gap-0 py-0"
const suppliersCardContentClassName = cn("p-(--card-spacing)", settingsControlClassName)

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  const [formName, setFormName] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formWebsite, setFormWebsite] = useState("")
  const [formContactName, setFormContactName] = useState("")
  const [formContactEmail, setFormContactEmail] = useState("")
  const [formContactPhone, setFormContactPhone] = useState("")
  const [formAddress, setFormAddress] = useState("")
  const [formNotes, setFormNotes] = useState("")

  const filteredSuppliers = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return suppliers.filter((supplier) => {
      return (
        supplier.name.toLowerCase().includes(q) ||
        supplier.category.toLowerCase().includes(q) ||
        supplier.contactName.toLowerCase().includes(q) ||
        supplier.contactEmail.toLowerCase().includes(q) ||
        supplier.contactPhone.toLowerCase().includes(q) ||
        supplier.website.toLowerCase().includes(q)
      )
    })
  }, [suppliers, searchQuery])

  useEffect(() => {
    if (selectedSupplier && activeModal === "edit") {
      setFormName(selectedSupplier.name)
      setFormCategory(selectedSupplier.category)
      setFormWebsite(selectedSupplier.website)
      setFormContactName(selectedSupplier.contactName)
      setFormContactEmail(selectedSupplier.contactEmail)
      setFormContactPhone(selectedSupplier.contactPhone)
      setFormAddress(selectedSupplier.address)
      setFormNotes(selectedSupplier.notes)
    } else if (activeModal === "add") {
      setFormName("")
      setFormCategory("")
      setFormWebsite("")
      setFormContactName("")
      setFormContactEmail("")
      setFormContactPhone("")
      setFormAddress("")
      setFormNotes("")
    }
  }, [selectedSupplier, activeModal])

  function handleOpenModal(modal: ActiveModal, supplier: Supplier | null = null) {
    setSelectedSupplier(supplier)
    setActiveModal(modal)
  }

  function handleCloseModal() {
    setActiveModal(null)
    setSelectedSupplier(null)
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) handleCloseModal()
  }

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

    if (activeModal === "add") {
      const newSupplier: Supplier = {
        id: `sup-${Date.now()}`,
        ...payload,
        hardwareCount: 0,
        softwareCount: 0,
        hasVendorCert: false,
      }
      setSuppliers((prev) => [...prev, newSupplier])
      toast.success(`Added supplier ${newSupplier.name}.`)
    } else if (activeModal === "edit" && selectedSupplier) {
      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier.id === selectedSupplier.id ? { ...supplier, ...payload } : supplier
        )
      )
      toast.success(`Updated supplier ${payload.name}.`)
    }

    handleCloseModal()
  }

  function handleDeleteConfirm() {
    if (!selectedSupplier) return
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== selectedSupplier.id))
    toast.success(`Removed supplier ${selectedSupplier.name}.`)
    handleCloseModal()
  }

  return (
    <>
      <PageHeader
        eyebrow="Vendor directory"
        // icon={Truck}
        title="Suppliers"
        description="Vendors providing your hardware and software."
        actions={
          <Button onClick={() => handleOpenModal("add")}>
            <Plus />
            Add supplier
          </Button>
        }
      >
        <Card className={suppliersCardClassName}>
          <CardContent className={cn("flex flex-col gap-4", suppliersCardContentClassName)}>
            <InputGroup className="min-w-[240px] max-w-xl">
              <InputGroupAddon>
                <Search className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <SuppliersTable
              rows={filteredSuppliers}
              onEdit={(supplier) => handleOpenModal("edit", supplier)}
              onDelete={(supplier) => handleOpenModal("delete", supplier)}
            />
          </CardContent>
        </Card>
      </PageHeader>

      <Dialog open={activeModal === "add" || activeModal === "edit"} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={dialogShellClassName}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>{activeModal === "add" ? "Add supplier" : "Edit supplier"}</DialogTitle>
            <DialogDescription>Vendor details and contact info.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveSupplier} className={dialogFormClassName}>
            <DialogBody className={cn(dialogScrollBodyClassName, settingsControlClassName)}>
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
            </DialogBody>
            <CardActions>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                {activeModal === "add" ? "Add supplier" : "Save changes"}
              </Button>
            </CardActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "delete"} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={dialogShellClassNameCompact}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>Remove supplier?</DialogTitle>
            <DialogDescription>
              <span className={typeScale.body.emphasis}>&ldquo;{selectedSupplier?.name}&rdquo;</span>{" "}
              will be unlinked from any hardware or software it supplies.
            </DialogDescription>
          </DialogHeader>

          {selectedSupplier ? (
            <CardActions>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>
                Remove
              </Button>
            </CardActions>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

export { SuppliersPage }
