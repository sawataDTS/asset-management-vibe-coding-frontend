"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, Archive, HardDrive, Package, Plus, Search, UserCheck, Wrench } from "lucide-react"
import { toast } from "sonner"

import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { HardwareAssetsTable } from "./hardware-assets-table"
import { PageHeader } from "@/components/layout/PageHeader"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardActions, CardContent } from "@/components/ui/card"
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
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { MetricCard } from "@/components/ui/metric-card"
import { Toaster } from "@/components/ui/sonner"
import {
  dialogFormClassName,
  dialogHeaderClassName,
  dialogScrollBodyClassName,
  dialogShellClassName,
  dialogShellClassNameCompact,
} from "@/lib/dialog-layout"
import {
  ASSET_STATUSES,
  HARDWARE_CATEGORIES,
  HARDWARE_EMPLOYEES,
  HARDWARE_SUPPLIERS,
  initialHardwareAssets,
  REPAIR_REASONS,
  type AssetStatus,
  type HardwareAsset,
} from "@/lib/hardware/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

type ActiveModal = "add" | "edit" | "assign" | "repair" | "history" | "delete" | null

const hardwareCardClassName = "gap-0 py-0"
const hardwareCardContentClassName = cn("p-(--card-spacing)", settingsControlClassName)

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function HardwarePage() {
  const [assets, setAssets] = useState<HardwareAsset[]>(initialHardwareAssets)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [selectedAsset, setSelectedAsset] = useState<HardwareAsset | null>(null)

  const [formName, setFormName] = useState("")
  const [formTag, setFormTag] = useState("")
  const [formCategory, setFormCategory] = useState<string>(HARDWARE_CATEGORIES[0])
  const [formSupplier, setFormSupplier] = useState<string>(HARDWARE_SUPPLIERS[0])
  const [formLocation, setFormLocation] = useState("")
  const [formWarranty, setFormWarranty] = useState("")
  const [formSerial, setFormSerial] = useState("")

  const [selectedAssignee, setSelectedAssignee] = useState<string>(HARDWARE_EMPLOYEES[0])
  const [repairNotes, setRepairNotes] = useState("")
  const [repairReason, setRepairReason] = useState<string>(REPAIR_REASONS[0])

  useEffect(() => {
    if (selectedAsset) {
      if (activeModal === "edit") {
        setFormName(selectedAsset.name)
        setFormTag(selectedAsset.tag)
        setFormCategory(selectedAsset.category)
        setFormSupplier(selectedAsset.supplier)
        setFormLocation(selectedAsset.location === "—" ? "" : selectedAsset.location)
        setFormWarranty(selectedAsset.warranty === "Expired" ? "" : selectedAsset.warranty)
        setFormSerial(selectedAsset.serial === "—" ? "" : selectedAsset.serial)
      } else if (activeModal === "assign") {
        setSelectedAssignee(selectedAsset.assignee || HARDWARE_EMPLOYEES[0])
      } else if (activeModal === "repair") {
        setRepairNotes("")
        setRepairReason(REPAIR_REASONS[0])
      }
    } else if (activeModal === "add") {
      setFormName("")
      setFormTag(`LAP-${Math.floor(1000 + Math.random() * 9000)}`)
      setFormCategory(HARDWARE_CATEGORIES[0])
      setFormSupplier(HARDWARE_SUPPLIERS[0])
      setFormLocation("")
      setFormWarranty(new Date().toISOString().split("T")[0])
      setFormSerial("")
    }
  }, [selectedAsset, activeModal])

  const kpis = useMemo(() => {
    const total = assets.length
    const assigned = assets.filter((a) => a.status === "Assigned").length
    const inStock = assets.filter((a) => a.status === "In Stock").length
    const inRepair = assets.filter((a) => a.status === "Repair").length
    const retired = assets.filter((a) => a.status === "Retired").length
    return { total, assigned, inStock, inRepair, retired }
  }, [assets])

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        asset.name.toLowerCase().includes(q) ||
        asset.tag.toLowerCase().includes(q) ||
        asset.serial.toLowerCase().includes(q) ||
        asset.supplier.toLowerCase().includes(q)
      const matchesStatus = selectedStatus === "All Statuses" || asset.status === selectedStatus
      const matchesCategory = selectedCategory === "All Categories" || asset.category === selectedCategory
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [assets, searchQuery, selectedStatus, selectedCategory])

  function handleOpenModal(modal: ActiveModal, asset: HardwareAsset | null = null) {
    setSelectedAsset(asset)
    setActiveModal(modal)
  }

  function handleCloseModal() {
    setActiveModal(null)
    setSelectedAsset(null)
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) handleCloseModal()
  }

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
        location: formLocation || "—",
        warranty: formWarranty || "—",
        serial: formSerial || "—",
        history: [
          {
            date: todayStr,
            action: "Asset Registered",
            user: "John Doe",
            notes: `Initial registration. Supplier: ${formSupplier}`,
          },
        ],
      }
      setAssets((prev) => [newAsset, ...prev])
      toast.success(`Registered new asset ${formTag} successfully!`)
    } else if (activeModal === "edit" && selectedAsset) {
      setAssets((prev) =>
        prev.map((a) => {
          if (a.id !== selectedAsset.id) return a

          const updatedHistory = [...a.history]
          const changes: string[] = []
          if (a.name !== formName) changes.push(`Name to '${formName}'`)
          if (a.category !== formCategory) changes.push(`Category to '${formCategory}'`)
          if (a.supplier !== formSupplier) changes.push(`Supplier to '${formSupplier}'`)
          if (a.location !== (formLocation || "—")) changes.push(`Location to '${formLocation || "—"}'`)
          if (a.warranty !== formWarranty) changes.push(`Warranty to '${formWarranty}'`)

          if (changes.length > 0) {
            updatedHistory.unshift({
              date: todayStr,
              action: "Asset Updated",
              user: "John Doe",
              notes: `Changed: ${changes.join(", ")}`,
            })
          }

          return {
            ...a,
            name: formName,
            tag: formTag,
            category: formCategory,
            supplier: formSupplier,
            location: formLocation || "—",
            warranty: formWarranty || "—",
            serial: formSerial || "—",
            history: updatedHistory,
          }
        })
      )
      toast.success(`Updated asset details for ${formTag}.`)
    }

    handleCloseModal()
  }

  function handleAssignSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedAsset) return

    const todayStr = new Date().toISOString().split("T")[0]
    const wasAssigned = selectedAsset.status === "Assigned"

    setAssets((prev) =>
      prev.map((a) => {
        if (a.id !== selectedAsset.id) return a

        const updatedHistory = [...a.history]

        if (a.status === "Assigned") {
          updatedHistory.unshift({
            date: todayStr,
            action: "Returned / Unassigned",
            user: "John Doe",
            notes: `Checked back in by employee ${a.assignee}.`,
          })
          return {
            ...a,
            status: "In Stock" as AssetStatus,
            assignee: "",
            history: updatedHistory,
          }
        }

        updatedHistory.unshift({
          date: todayStr,
          action: "Assigned Device",
          user: "John Doe",
          notes: `Assigned ownership to ${selectedAssignee}.`,
        })
        return {
          ...a,
          status: "Assigned" as AssetStatus,
          assignee: selectedAssignee,
          history: updatedHistory,
        }
      })
    )

    toast.success(
      wasAssigned
        ? `Device ${selectedAsset.tag} checked back into inventory.`
        : `Device ${selectedAsset.tag} assigned to ${selectedAssignee} successfully.`
    )
    handleCloseModal()
  }

  function handleRepairSubmit(
    e: React.FormEvent | React.MouseEvent,
    targetAction: "repair" | "fixed" | "retire"
  ) {
    e.preventDefault()
    if (!selectedAsset) return

    const todayStr = new Date().toISOString().split("T")[0]

    setAssets((prev) =>
      prev.map((a) => {
        if (a.id !== selectedAsset.id) return a

        const updatedHistory = [...a.history]

        if (targetAction === "repair") {
          updatedHistory.unshift({
            date: todayStr,
            action: "Sent to Repair",
            user: "John Doe",
            notes: `${repairReason}. Notes: ${repairNotes || "None"}`,
          })
          return { ...a, status: "Repair" as AssetStatus, history: updatedHistory }
        }

        if (targetAction === "fixed") {
          updatedHistory.unshift({
            date: todayStr,
            action: "Repaired & Returned",
            user: "John Doe",
            notes: `Device diagnosed, issue resolved. Notes: ${repairNotes || "None"}`,
          })
          return { ...a, status: "In Stock" as AssetStatus, history: updatedHistory }
        }

        updatedHistory.unshift({
          date: todayStr,
          action: "Retired Device",
          user: "John Doe",
          notes: `Decommissioned during repair diagnostic. Reason: ${repairNotes || "Decommissioned"}`,
        })
        return {
          ...a,
          status: "Retired" as AssetStatus,
          assignee: "",
          history: updatedHistory,
        }
      })
    )

    toast.success(
      targetAction === "repair"
        ? `Asset ${selectedAsset.tag} marked as in repair.`
        : targetAction === "fixed"
          ? `Asset ${selectedAsset.tag} marked as fixed and returned to stock.`
          : `Asset ${selectedAsset.tag} has been retired.`
    )
    handleCloseModal()
  }

  function handleDeleteConfirm() {
    if (!selectedAsset) return
    setAssets((prev) => prev.filter((a) => a.id !== selectedAsset.id))
    toast.success(`Removed asset ${selectedAsset.tag} from database.`)
    handleCloseModal()
  }

  return (
    <>
      <Toaster position="top-right" closeButton richColors />

      <PageHeader
        // icon={HardDrive}
        eyebrow="Inventory"
        title="Hardware"
        description={`Track laptops, monitors, peripherals, and their assignment status across your organization. ${filteredAssets.length} of ${kpis.total} assets shown.`}
        actions={
          <Button onClick={() => handleOpenModal("add")}>
            <Plus />
            Add Asset
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <MetricCard label="Total Assets" value={String(kpis.total)} icon={HardDrive} iconVariant="badge" />
          <MetricCard label="Assigned" value={String(kpis.assigned)} icon={UserCheck} iconVariant="badge" />
          <MetricCard label="In Stock" value={String(kpis.inStock)} icon={Package} iconVariant="badge" />
          <MetricCard label="In Repair" value={String(kpis.inRepair)} icon={Wrench} iconVariant="badge" />
          <MetricCard label="Retired" value={String(kpis.retired)} icon={Archive} iconVariant="badge" />
        </div>

        <Card className={hardwareCardClassName}>
          <CardContent className={cn("flex flex-col gap-4", hardwareCardContentClassName)}>
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
              <InputGroup className="min-w-[240px] flex-1">
                <InputGroupAddon>
                  <Search className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Search by name, tag, serial, or supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>

              <CustomSelect
                className="w-full lg:w-44"
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(typeof value === "string" ? value : "All Statuses")}
                options={[
                  { label: "All Statuses", value: "All Statuses" },
                  ...ASSET_STATUSES.map((status) => ({
                    label: status === "Repair" ? "In Repair" : status,
                    value: status,
                  })),
                ]}
                showClear={false}
              />

              <CustomSelect
                className="w-full lg:w-48"
                value={selectedCategory}
                onChange={(value) =>
                  setSelectedCategory(typeof value === "string" ? value : "All Categories")
                }
                options={[
                  { label: "All Categories", value: "All Categories" },
                  { label: "Laptops", value: "Laptop" },
                  { label: "Monitors", value: "Monitor" },
                  { label: "Phones", value: "Phone" },
                  { label: "Accessories", value: "Accessories" },
                  { label: "Other", value: "Other" },
                ]}
                showClear={false}
              />
            </div>

            <HardwareAssetsTable
              rows={filteredAssets}
              onHistory={(asset) => handleOpenModal("history", asset)}
              onAssign={(asset) => handleOpenModal("assign", asset)}
              onRepair={(asset) => handleOpenModal("repair", asset)}
              onEdit={(asset) => handleOpenModal("edit", asset)}
              onDelete={(asset) => handleOpenModal("delete", asset)}
            />
          </CardContent>
        </Card>
      </PageHeader>

      <Dialog open={activeModal === "add" || activeModal === "edit"} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={dialogShellClassName}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>
              {activeModal === "add" ? "Register New Hardware Asset" : "Edit Asset Details"}
            </DialogTitle>
            <DialogDescription>Provide configuration details and warranty coverage dates.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAsset} className={dialogFormClassName}>
            <DialogBody className={cn(dialogScrollBodyClassName, settingsControlClassName)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="asset-name">Asset name</FieldLabel>
                  <Input
                    id="asset-name"
                    placeholder='e.g. Macbook Pro 14" (M3 Pro)'
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </Field>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="asset-tag">Asset tag</FieldLabel>
                    <Input
                      id="asset-tag"
                      placeholder="e.g. LAP-0012"
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="asset-serial">Serial number</FieldLabel>
                    <Input
                      id="asset-serial"
                      placeholder="S/N: Apple-..."
                      value={formSerial}
                      onChange={(e) => setFormSerial(e.target.value)}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="asset-category">Category</FieldLabel>
                    <CustomSelect
                      id="asset-category"
                      value={formCategory}
                      onChange={(value) => setFormCategory(typeof value === "string" ? value : formCategory)}
                      options={toSelectOptions(HARDWARE_CATEGORIES)}
                      showClear={false}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="asset-supplier">Supplier</FieldLabel>
                    <CustomSelect
                      id="asset-supplier"
                      value={formSupplier}
                      onChange={(value) => setFormSupplier(typeof value === "string" ? value : formSupplier)}
                      options={toSelectOptions(HARDWARE_SUPPLIERS)}
                      showClear={false}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="asset-location">Location</FieldLabel>
                    <Input
                      id="asset-location"
                      placeholder="HQ - Bangalore"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="asset-warranty">Warranty expiry date</FieldLabel>
                    <DatePicker
                      id="asset-warranty"
                      value={formWarranty}
                      onChange={setFormWarranty}
                      placeholder="Select date"
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
              <Button type="submit">{activeModal === "add" ? "Register Asset" : "Save Changes"}</Button>
            </CardActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "assign"} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={dialogShellClassName}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>
              {selectedAsset?.status === "Assigned" ? "Deallocate Hardware Asset" : "Allocate Hardware Asset"}
            </DialogTitle>
            <DialogDescription>
              {selectedAsset?.status === "Assigned"
                ? `Return device ${selectedAsset.tag} back into organization storage.`
                : `Assign device ${selectedAsset?.tag} to an active employee.`}
            </DialogDescription>
          </DialogHeader>

          {selectedAsset ? (
            <form onSubmit={handleAssignSubmit} className={dialogFormClassName}>
              <DialogBody className={cn(dialogScrollBodyClassName, settingsControlClassName)}>
                {selectedAsset.status === "Assigned" ? (
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className={typeScale.caption.overline}>Current assignee</p>
                    <div className="mt-2 flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback className="bg-accent text-xs text-primary">
                          {getInitials(selectedAsset.assignee)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={typeScale.body.emphasis}>{selectedAsset.assignee}</p>
                        <p className={typeScale.body.muted}>Assigned on active tenure</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Field>
                    <FieldLabel htmlFor="employee-select">Select active employee</FieldLabel>
                    <CustomSelect
                      id="employee-select"
                      value={selectedAssignee}
                      onChange={(value) =>
                        setSelectedAssignee(typeof value === "string" ? value : selectedAssignee)
                      }
                      options={HARDWARE_EMPLOYEES.map((emp) => ({ label: emp, value: emp }))}
                      showClear={false}
                    />
                  </Field>
                )}
              </DialogBody>
              <CardActions>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  variant={selectedAsset.status === "Assigned" ? "destructive" : "default"}
                >
                  {selectedAsset.status === "Assigned" ? "Unassign Device" : "Assign Asset"}
                </Button>
              </CardActions>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "repair"} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={dialogShellClassName}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>
              {selectedAsset?.status === "Repair"
                ? "Repair Diagnostic Completion"
                : "Initiate Repair Lifecycle"}
            </DialogTitle>
            <DialogDescription>
              {selectedAsset?.status === "Repair"
                ? `Diagnose or close repair service backlog for ${selectedAsset.tag}.`
                : `Send device ${selectedAsset?.tag} to specialized repairs.`}
            </DialogDescription>
          </DialogHeader>

          {selectedAsset ? (
            selectedAsset.status === "Repair" ? (
              <>
                <DialogBody className={cn(dialogScrollBodyClassName, settingsControlClassName)}>
                  <Field>
                    <FieldLabel htmlFor="repair-diag-notes">Closing diagnostic notes</FieldLabel>
                    <Input
                      id="repair-diag-notes"
                      placeholder="e.g. Replaced display panel. Tested successfully."
                      value={repairNotes}
                      onChange={(e) => setRepairNotes(e.target.value)}
                    />
                  </Field>
                </DialogBody>
                <CardActions className="flex-wrap gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={(e) => handleRepairSubmit(e, "retire")}
                  >
                    Decommission / Retire
                  </Button>
                  <Button type="button" onClick={(e) => handleRepairSubmit(e, "fixed")}>
                    Mark as Fixed
                  </Button>
                </CardActions>
              </>
            ) : (
              <form onSubmit={(e) => handleRepairSubmit(e, "repair")} className={dialogFormClassName}>
                <DialogBody className={cn(dialogScrollBodyClassName, settingsControlClassName)}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="repair-reason">Reason for service</FieldLabel>
                      <CustomSelect
                        id="repair-reason"
                        value={repairReason}
                        onChange={(value) =>
                          setRepairReason(typeof value === "string" ? value : repairReason)
                        }
                        options={REPAIR_REASONS.map((reason) => ({
                          label: reason.split("/")[0],
                          value: reason,
                        }))}
                        showClear={false}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="repair-incident-notes">Diagnostic notes</FieldLabel>
                      <Input
                        id="repair-incident-notes"
                        placeholder="Describe symptoms, device drops, or issues"
                        value={repairNotes}
                        onChange={(e) => setRepairNotes(e.target.value)}
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
                  <Button type="submit">Initiate Repairs</Button>
                </CardActions>
              </form>
            )
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "history"} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={dialogShellClassName}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>Audit & Activity Tracking</DialogTitle>
            <DialogDescription>
              Timeline logs for device <span className={typeScale.body.emphasis}>{selectedAsset?.tag}</span> (
              {selectedAsset?.name}).
            </DialogDescription>
          </DialogHeader>

          {selectedAsset ? (
            <>
              <DialogBody className={dialogScrollBodyClassName}>
                <div className="relative ml-2 space-y-6 border-l-2 border-border pl-6">
                  {selectedAsset.history.map((evt, idx) => (
                    <div key={`${evt.date}-${idx}`} className="relative">
                      <div className="absolute top-1.5 left-[-31px] size-2.5 rounded-full bg-primary ring-4 ring-card" />
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className={typeScale.body.emphasis}>{evt.action}</span>
                          <span className={cn(typeScale.caption.meta, "font-mono tabular-nums")}>
                            {evt.date}
                          </span>
                        </div>
                        <p className={cn("mt-0.5", typeScale.body.muted)}>
                          Performed by <span className={typeScale.body.emphasis}>{evt.user}</span>
                        </p>
                        {evt.notes ? (
                          <div className="mt-2 rounded-lg border border-border/60 bg-muted/30 p-2 italic">
                            <p className={typeScale.body.muted}>&ldquo;{evt.notes}&rdquo;</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogBody>
              <CardActions>
                <DialogClose asChild>
                  <Button type="button">Close Log</Button>
                </DialogClose>
              </CardActions>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "delete"} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={dialogShellClassNameCompact}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Retire & Delete Asset
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this hardware asset? This action will permanently remove it from
              tracking logs.
            </DialogDescription>
          </DialogHeader>

          {selectedAsset ? (
            <>
              <DialogBody>
                <div className="space-y-1.5 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <p className={typeScale.body.muted}>
                    <span className={typeScale.body.emphasis}>Asset name:</span> {selectedAsset.name}
                  </p>
                  <p className={typeScale.body.muted}>
                    <span className={typeScale.body.emphasis}>Asset tag:</span> {selectedAsset.tag}
                  </p>
                  <p className={typeScale.body.muted}>
                    <span className={typeScale.body.emphasis}>Serial no:</span> {selectedAsset.serial}
                  </p>
                  <p className={typeScale.body.muted}>
                    <span className={typeScale.body.emphasis}>Status:</span> {selectedAsset.status}
                  </p>
                </div>
              </DialogBody>
              <CardActions>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>
                  Permanently Delete
                </Button>
              </CardActions>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

export { HardwarePage }
