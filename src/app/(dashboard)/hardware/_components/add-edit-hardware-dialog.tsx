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

import {
  dialogFormClassName,
  dialogHeaderClassName,
  dialogScrollBodyClassName,
  dialogShellClassNameWide,
} from "@/lib/dialog-layout"
import {
  ASSET_STATUSES,
  Condition,
  HARDWARE_CATEGORIES,
  HARDWARE_SUPPLIERS,
  type HardwareAsset,
} from "@/lib/hardware/data"

import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

interface IProps {
  open: any
  activeModal: any
  onOpenChange: any
  handleCloseModal: any
  selectedAsset: any
}

export default function AddEditHardwareDialog({
  open,
  activeModal,
  onOpenChange,
  handleCloseModal,
  selectedAsset,
}: IProps) {
  const [formName, setFormName] = useState("")
  const [formTag, setFormTag] = useState("")
  const [formCategory, setFormCategory] = useState<string>(HARDWARE_CATEGORIES[0])
  const [formSupplier, setFormSupplier] = useState<string>("")
  const [formLocation, setFormLocation] = useState("")
  const [formStatus, setFormStatus] = useState("")
  const [formWarranty, setFormWarranty] = useState("")
  const [formSerial, setFormSerial] = useState("")
  const [formCondition, setFormCondition] = useState("")
  const [formBrand, setFormBrand] = useState("")
  const [formModel, setFormModel] = useState("")
  const [formBuilding, setFormBuilding] = useState("")
  const [formFloor, setFormFloor] = useState("")
  const [formCubic, setFormCubic] = useState("")
  const [formPurchaseCost, setFormPurchaseCost] = useState("")
  const [formPurchaseDate, setFormPurchaseDate] = useState("")
  const [formNotes, setFormNotes] = useState("")

  useEffect(() => {
    if (selectedAsset && activeModal === "edit") {
      setFormName(selectedAsset.name)
      setFormTag(selectedAsset.tag)
      setFormCategory(selectedAsset.category)
      setFormSupplier(selectedAsset.supplier)
      setFormLocation(selectedAsset.location || "")
      setFormWarranty(selectedAsset.warranty === "Expired" ? "" : selectedAsset.warranty)
      setFormSerial(selectedAsset.serial || "")
      setFormStatus(selectedAsset.status)
      setFormCondition(selectedAsset.condition)
      setFormBrand(selectedAsset.brand || "")
      setFormModel(selectedAsset.model || "")
      setFormBuilding(selectedAsset.building || "")
      setFormFloor(selectedAsset.floor || "")
      setFormCubic(selectedAsset.cubic || "")
      setFormPurchaseDate(selectedAsset.purchase_date || "")
      setFormPurchaseCost(selectedAsset.purchase_cost || "")
      setFormNotes(selectedAsset.notes || "")
    } else if (activeModal === "add") {
      setFormName("")
      setFormTag("")
      setFormCategory(HARDWARE_CATEGORIES[0])
      setFormSupplier("")
      setFormLocation("")
      setFormWarranty("")
      setFormSerial("")
      setFormStatus("In Stock")
      setFormCondition("Good")
      setFormBrand("")
      setFormModel("")
      setFormBuilding("")
      setFormFloor("")
      setFormCubic("")
      setFormPurchaseDate("")
      setFormPurchaseCost("")
      setFormNotes("")
    }
  }, [selectedAsset, activeModal])

  function handleSaveAsset(e: React.FormEvent) {
    e.preventDefault()
    if (!formName || !formTag) {
      toast.error("Asset name and tag are required.")
      return
    }

    const todayStr = new Date().toISOString().split("T")[0]

    if (activeModal === "add") {
      const newAsset: HardwareAsset = {
        id: Math.random().toString(36).slice(2, 11),
        name: formName,
        tag: formTag,
        category: formCategory,
        status: "In Stock",
        assignee: "",
        supplier: formSupplier,
        location: formLocation,
        warranty: formWarranty,
        serial: formSerial,
        history: [
          {
            date: todayStr,
            action: "Asset Registered",
            user: "John Doe",
            notes: `Initial registration. Supplier: ${formSupplier}`,
          },
        ],
      }
      // api call
      toast.success(`Registered new asset ${formTag} successfully!`)
    } else if (activeModal === "edit" && selectedAsset) {
      // api call
      toast.success(`Updated asset details for ${formTag}.`)
    }

    handleCloseModal()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogShellClassNameWide}>
        <DialogHeader className={dialogHeaderClassName}>
          <DialogTitle>{activeModal === "add" ? "New Hardware Asset" : "Edit Asset"}</DialogTitle>
          <DialogDescription>
            {activeModal === "add"
              ? "Choose a supplier and add a new device to your inventory."
              : "Update supplier and device details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSaveAsset} className={dialogFormClassName}>
          <DialogBody className={cn(dialogScrollBodyClassName, settingsControlClassName)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="asset-name">Supplier *</FieldLabel>
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
                <FieldLabel htmlFor="asset-name">Name *</FieldLabel>
                <Input
                  id="asset-name"
                  placeholder='MacBook Pro 14"'
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="asset-tag">Asset Tag *</FieldLabel>
                  <Input
                    id="asset-tag"
                    placeholder="e.g. LAP-0012"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="asset-serial">Serial number *</FieldLabel>
                  <Input
                    id="asset-serial"
                    value={formSerial}
                    onChange={(e) => setFormSerial(e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="asset-category">Category *</FieldLabel>
                  <CustomSelect
                    id="asset-category"
                    value={formCategory}
                    onChange={(value) => setFormCategory(typeof value === "string" ? value : formCategory)}
                    options={toSelectOptions(HARDWARE_CATEGORIES)}
                    showClear={false}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="asset-supplier">Status *</FieldLabel>
                  <CustomSelect
                    id="asset-supplier"
                    value={formStatus}
                    onChange={(value) => setFormStatus(typeof value === "string" ? value : formStatus)}
                    options={toSelectOptions(ASSET_STATUSES)}
                    showClear={false}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="asset-category">Condition *</FieldLabel>
                  <CustomSelect
                    id="asset-category"
                    value={formCondition}
                    onChange={(value) => setFormCondition(typeof value === "string" ? value : formCondition)}
                    options={toSelectOptions(Condition)}
                    showClear={false}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="asset-supplier">Brand</FieldLabel>
                  <Input id="asset-serial" value={formBrand} onChange={(e) => setFormBrand(e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="asset-category">Model</FieldLabel>
                  <Input
                    id="asset-location"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="asset-location">Location</FieldLabel>
                  <Input
                    id="asset-location"
                    placeholder="HQ - Bangalore"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="asset-category">Building #</FieldLabel>
                  <Input
                    id="asset-location"
                    placeholder="e.g. 2"
                    value={formBuilding}
                    onChange={(e) => setFormBuilding(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="asset-location">Floor</FieldLabel>
                  <Input
                    id="asset-location"
                    placeholder="e.g. 3"
                    value={formFloor}
                    onChange={(e) => setFormFloor(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="asset-location">Cubic #</FieldLabel>
                  <Input
                    id="asset-location"
                    placeholder="e.g. A-12"
                    value={formCubic}
                    onChange={(e) => setFormCubic(e.target.value)}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="asset-location">Purchase Date *</FieldLabel>
                  <DatePicker
                    id="asset-warranty"
                    value={formPurchaseDate}
                    onChange={setFormPurchaseDate}
                    placeholder="Select date"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="asset-warranty">Purchase Cost (USD)</FieldLabel>
                  <Input
                    id="asset-location"
                    value={formPurchaseCost}
                    onChange={(e) => setFormPurchaseCost(e.target.value)}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="asset-warranty">Warranty Expiry *</FieldLabel>
                  <DatePicker
                    id="asset-warranty"
                    value={formWarranty}
                    onChange={setFormWarranty}
                    placeholder="Select date"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-1">
                <Field>
                  <FieldLabel htmlFor="asset-warranty">Notes</FieldLabel>
                  <Textarea
                    id="asset-location"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                  />
                </Field>
              </div>
            </FieldGroup>
          </DialogBody>
          <CardActions>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">{activeModal === "add" ? "Create Asset" : "Save Changes"}</Button>
          </CardActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
