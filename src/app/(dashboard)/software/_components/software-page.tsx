"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  BadgeCheck,
  Clock,
  CreditCard,
  Layers3,
  Plus,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { PageHeader } from "@/components/layout/PageHeader"
import { SeatUtilization } from "./seat-utilization"
import { SoftwareLicensesTable } from "./software-licenses-table"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { Textarea } from "@/components/ui/textarea"
import {
  dialogFormClassName,
  dialogBodyBeforeActionsClassName,
  dialogHeaderClassName,
  dialogScrollBodyClassName,
  dialogShellClassName,
  dialogShellClassNameCompact,
} from "@/lib/dialog-layout"
import {
  initialLicenses,
  LICENSE_STATUSES,
  SOFTWARE_CATEGORIES,
  SOFTWARE_EMPLOYEES,
  type SoftwareLicense,
} from "@/lib/software/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

type ActiveModal = "add" | "edit" | "seats" | "history" | "delete" | null

const softwareCardClassName = "gap-0 py-0"
const softwareCardContentClassName = cn("p-(--card-spacing)", settingsControlClassName)

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function SoftwarePage() {
  const [licenses, setLicenses] = useState<SoftwareLicense[]>(initialLicenses)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [selectedLicense, setSelectedLicense] = useState<SoftwareLicense | null>(null)

  const [formName, setFormName] = useState("")
  const [formCategory, setFormCategory] = useState<string>(SOFTWARE_CATEGORIES[0])
  const [formSupplier, setFormSupplier] = useState("")
  const [formTotalSeats, setFormTotalSeats] = useState(10)
  const [formCost, setFormCost] = useState("")
  const [formRenewalDate, setFormRenewalDate] = useState("")
  const [formKey, setFormKey] = useState("")
  const [formDescription, setFormDescription] = useState("")

  const [newAssignee, setNewAssignee] = useState<string>(SOFTWARE_EMPLOYEES[0])

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
    } else if (activeModal === "add") {
      setFormName("")
      setFormCategory(SOFTWARE_CATEGORIES[0])
      setFormSupplier("")
      setFormTotalSeats(10)
      setFormCost("$50/mo")
      setFormRenewalDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
      setFormKey(`LIC-${Math.random().toString(36).slice(2, 11).toUpperCase()}`)
      setFormDescription("")
    }
  }, [selectedLicense, activeModal])

  const eligibleEmployees = useMemo(() => {
    if (!selectedLicense) return []
    return SOFTWARE_EMPLOYEES.filter((emp) => !selectedLicense.assignees.includes(emp))
  }, [selectedLicense])

  useEffect(() => {
    if (eligibleEmployees.length > 0) {
      setNewAssignee(eligibleEmployees[0])
    }
  }, [eligibleEmployees])

  const kpis = useMemo(() => {
    let totalSeats = 0
    let assignedSeats = 0
    let expiringSoon = 0
    let totalCostNum = 0

    licenses.forEach((lic) => {
      totalSeats += lic.totalSeats
      assignedSeats += lic.assignedSeats
      if (lic.status === "Expiring Soon") expiringSoon++
      const costMatch = lic.cost.replace(/[^0-9]/g, "")
      const val = parseInt(costMatch, 10)
      if (!Number.isNaN(val)) totalCostNum += val
    })

    return {
      totalLicenses: licenses.length,
      assignedSeats,
      availableSeats: totalSeats - assignedSeats,
      expiringSoon,
      monthlySpend: `$${totalCostNum.toLocaleString()}/mo`,
    }
  }, [licenses])

  const filteredLicenses = useMemo(() => {
    return licenses.filter((lic) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        lic.name.toLowerCase().includes(q) ||
        lic.supplier.toLowerCase().includes(q) ||
        lic.key.toLowerCase().includes(q)
      const matchesStatus = selectedStatus === "All Statuses" || lic.status === selectedStatus
      const matchesCategory = selectedCategory === "All Categories" || lic.category === selectedCategory
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [licenses, searchQuery, selectedStatus, selectedCategory])

  function handleOpenModal(modal: ActiveModal, license: SoftwareLicense | null = null) {
    setSelectedLicense(license)
    setActiveModal(modal)
  }

  function handleCloseModal() {
    setActiveModal(null)
    setSelectedLicense(null)
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) handleCloseModal()
  }

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
        renewalDate: formRenewalDate || "—",
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
      setLicenses((prev) => [newLic, ...prev])
      toast.success(`Registered subscription for ${formName}.`)
    } else if (activeModal === "edit" && selectedLicense) {
      setLicenses((prev) =>
        prev.map((lic) => {
          if (lic.id !== selectedLicense.id) return lic

          const updatedHistory = [...lic.history]
          const changes: string[] = []
          if (lic.name !== formName) changes.push(`Name to '${formName}'`)
          if (lic.category !== formCategory) changes.push(`Category to '${formCategory}'`)
          if (lic.supplier !== formSupplier) changes.push(`Supplier to '${formSupplier}'`)
          if (lic.totalSeats !== formTotalSeats) changes.push(`Total seats to ${formTotalSeats}`)
          if (lic.cost !== formCost) changes.push(`Cost model to '${formCost}'`)
          if (lic.renewalDate !== formRenewalDate) changes.push(`Renewal date to '${formRenewalDate}'`)

          if (changes.length > 0) {
            updatedHistory.unshift({
              date: todayStr,
              action: "Subscription Updated",
              user: "John Doe",
              notes: `Changed: ${changes.join(", ")}`,
            })
          }

          return {
            ...lic,
            name: formName,
            category: formCategory,
            supplier: formSupplier,
            totalSeats: formTotalSeats,
            cost: formCost,
            renewalDate: formRenewalDate,
            key: formKey,
            description: formDescription,
            history: updatedHistory,
          }
        })
      )
      toast.success(`Updated subscription details for ${selectedLicense.name}.`)
    }

    handleCloseModal()
  }

  function handleAllocateSeat() {
    if (!selectedLicense || !newAssignee) return

    if (selectedLicense.assignedSeats >= selectedLicense.totalSeats) {
      toast.error("Allocation failed. Seat capacity limit reached.")
      return
    }

    const todayStr = new Date().toISOString().split("T")[0]

    setLicenses((prev) =>
      prev.map((lic) => {
        if (lic.id !== selectedLicense.id) return lic

        const updatedAssignees = [...lic.assignees, newAssignee]
        const updatedLicense: SoftwareLicense = {
          ...lic,
          assignees: updatedAssignees,
          assignedSeats: updatedAssignees.length,
          history: [
            {
              date: todayStr,
              action: "Seat Allocated",
              user: "John Doe",
              notes: `Assigned license seat to employee ${newAssignee}.`,
            },
            ...lic.history,
          ],
        }
        setSelectedLicense(updatedLicense)
        return updatedLicense
      })
    )
    toast.success(`License seat allocated to ${newAssignee}.`)
  }

  function handleDeallocateSeat(empName: string) {
    if (!selectedLicense) return

    const todayStr = new Date().toISOString().split("T")[0]

    setLicenses((prev) =>
      prev.map((lic) => {
        if (lic.id !== selectedLicense.id) return lic

        const updatedAssignees = lic.assignees.filter((name) => name !== empName)
        const updatedLicense: SoftwareLicense = {
          ...lic,
          assignees: updatedAssignees,
          assignedSeats: updatedAssignees.length,
          history: [
            {
              date: todayStr,
              action: "Seat Deallocated",
              user: "John Doe",
              notes: `Revoked seat assignment from employee ${empName}.`,
            },
            ...lic.history,
          ],
        }
        setSelectedLicense(updatedLicense)
        return updatedLicense
      })
    )
    toast.info(`Seat revoked from ${empName}. Seat is now available.`)
  }

  function handleDeleteConfirm() {
    if (!selectedLicense) return
    setLicenses((prev) => prev.filter((lic) => lic.id !== selectedLicense.id))
    toast.success(`Removed subscription registry for ${selectedLicense.name}.`)
    handleCloseModal()
  }

  return (
    <>
      <PageHeader
        // icon={AppWindow}
        eyebrow="Apps, subscriptions & licensing"
        title="Software"
        description={`Track seat allocation, renewal dates, and subscription spend across vendors. ${filteredLicenses.length} of ${kpis.totalLicenses} subscriptions shown.`}
        actions={
          <Button onClick={() => handleOpenModal("add")}>
            <Plus />
            Add Subscription
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <MetricCard
            label="Subscriptions"
            value={String(kpis.totalLicenses)}
            icon={Layers3}
            iconVariant="badge"
          />
          <MetricCard
            label="Assigned Seats"
            value={kpis.assignedSeats.toLocaleString()}
            icon={Users}
            iconVariant="badge"
          />
          <MetricCard
            label="Available Seats"
            value={kpis.availableSeats.toLocaleString()}
            icon={BadgeCheck}
            iconVariant="badge"
          />
          <MetricCard
            label="Expiring Soon"
            value={String(kpis.expiringSoon)}
            icon={Clock}
            iconVariant="badge"
          />
          <MetricCard label="Monthly Spend" value={kpis.monthlySpend} icon={CreditCard} iconVariant="badge" />
        </div>

        <Card className={softwareCardClassName}>
          <CardContent className={cn("flex flex-col gap-4", softwareCardContentClassName)}>
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
              <InputGroup className="min-w-[240px] flex-1">
                <InputGroupAddon>
                  <Search className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Search by license name, supplier, or key..."
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
                  ...LICENSE_STATUSES.map((status) => ({ label: status, value: status })),
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
                  ...SOFTWARE_CATEGORIES.map((category) => ({ label: category, value: category })),
                ]}
                showClear={false}
              />
            </div>

            <SoftwareLicensesTable
              rows={filteredLicenses}
              onHistory={(license) => handleOpenModal("history", license)}
              onSeats={(license) => handleOpenModal("seats", license)}
              onEdit={(license) => handleOpenModal("edit", license)}
              onDelete={(license) => handleOpenModal("delete", license)}
            />
          </CardContent>
        </Card>
      </PageHeader>

      <Dialog open={activeModal === "add" || activeModal === "edit"} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={dialogShellClassName}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>
              {activeModal === "add" ? "Register Software Subscription" : "Modify Subscription Plan"}
            </DialogTitle>
            <DialogDescription>
              Configure software access details, billing terms, and seat sizes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveLicense} className={dialogFormClassName}>
            <DialogBody className={cn(dialogScrollBodyClassName, settingsControlClassName)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="license-name">Software name</FieldLabel>
                  <Input
                    id="license-name"
                    placeholder="e.g. GitHub Enterprise"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </Field>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="license-supplier">Supplier / publisher</FieldLabel>
                    <Input
                      id="license-supplier"
                      placeholder="e.g. Adobe Inc."
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

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="license-seats">Total seats</FieldLabel>
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
                    <FieldLabel htmlFor="license-cost">Billing model</FieldLabel>
                    <Input
                      id="license-cost"
                      placeholder="e.g. $450/mo"
                      value={formCost}
                      onChange={(e) => setFormCost(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="license-renewal">Renewal date</FieldLabel>
                    <DatePicker
                      id="license-renewal"
                      value={formRenewalDate}
                      onChange={setFormRenewalDate}
                      placeholder="Select date"
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="license-key">License / activation key</FieldLabel>
                  <Input
                    id="license-key"
                    placeholder="Product serial key or subscription URL"
                    value={formKey}
                    onChange={(e) => setFormKey(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="license-desc">Product description</FieldLabel>
                  <Textarea
                    id="license-desc"
                    rows={2}
                    placeholder="Details about packages, seat limits, or access teams..."
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
              <Button type="submit">{activeModal === "add" ? "Register Subscription" : "Save Plan"}</Button>
            </CardActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "seats"} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={dialogShellClassName}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>Manage License Seats</DialogTitle>
            <DialogDescription>
              Add or revoke seats for <span className={typeScale.body.emphasis}>{selectedLicense?.name}</span>
              .
            </DialogDescription>
          </DialogHeader>

          {selectedLicense ? (
            <>
              <DialogBody className={dialogScrollBodyClassName}>
                <div className="space-y-5">
                  <Card size="sm" className={softwareCardClassName}>
                    <CardContent className={softwareCardContentClassName}>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className={typeScale.caption.overline}>Seat utilization</span>
                        <span className={typeScale.body.emphasis}>
                          {selectedLicense.assignedSeats} / {selectedLicense.totalSeats} seats
                        </span>
                      </div>
                      <SeatUtilization
                        assigned={selectedLicense.assignedSeats}
                        total={selectedLicense.totalSeats}
                      />
                    </CardContent>
                  </Card>

                  {selectedLicense.assignedSeats < selectedLicense.totalSeats ? (
                    eligibleEmployees.length > 0 ? (
                      <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-4 sm:flex-row sm:items-end">
                        <Field className="flex-1">
                          <FieldLabel htmlFor="seat-employee-select">Allocate seat to employee</FieldLabel>
                          <CustomSelect
                            id="seat-employee-select"
                            value={newAssignee}
                            onChange={(value) =>
                              setNewAssignee(typeof value === "string" ? value : newAssignee)
                            }
                            options={eligibleEmployees.map((emp) => ({ label: emp, value: emp }))}
                            showClear={false}
                          />
                        </Field>
                        <Button type="button" size="lg" className="shrink-0" onClick={handleAllocateSeat}>
                          <UserPlus />
                          Allocate
                        </Button>
                      </div>
                    ) : (
                      <p className={cn("text-center italic", typeScale.body.muted)}>
                        All company employees already hold a seat for this subscription.
                      </p>
                    )
                  ) : (
                    <Alert variant="destructive">
                      <AlertTriangle />
                      <AlertTitle>Subscription at capacity</AlertTitle>
                      <AlertDescription>
                        All {selectedLicense.totalSeats} seats are filled. Revoke seats or edit the
                        subscription to expand seat size.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <p className={cn("mb-2", typeScale.caption.overline)}>
                      Current seat holders ({selectedLicense.assignees.length})
                    </p>
                    {selectedLicense.assignees.length > 0 ? (
                      <div className="space-y-2">
                        {selectedLicense.assignees.map((name) => (
                          <div
                            key={name}
                            className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-2"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <Avatar size="sm">
                                <AvatarFallback className="bg-accent text-primary">
                                  {getInitials(name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className={typeScale.body.emphasis}>{name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Revoke seat from ${name}`}
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleDeallocateSeat(name)}
                            >
                              <X />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border py-6 text-center">
                        <p className={cn("italic", typeScale.body.muted)}>
                          No active employees allocated to seats yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </DialogBody>
              <CardActions>
                <DialogClose asChild>
                  <Button type="button">Close</Button>
                </DialogClose>
              </CardActions>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "history"} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={dialogShellClassName}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>Audit & Activity</DialogTitle>
            <DialogDescription>
              Timeline logs for <span className={typeScale.body.emphasis}>{selectedLicense?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          {selectedLicense ? (
            <>
              <DialogBody className={dialogScrollBodyClassName}>
                <div className="relative ml-2 space-y-6 border-l-2 border-border pl-6">
                  {selectedLicense.history.map((evt, idx) => (
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
                  <Button type="button">Close</Button>
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
              Retire & Delete Subscription
            </DialogTitle>
          </DialogHeader>

          {selectedLicense ? (
            <>
              <DialogBody className={dialogBodyBeforeActionsClassName}>
                <DialogDescription>
                  Are you sure you want to permanently delete this software license registry? All seat allocations
                  will be terminated.
                </DialogDescription>
                <div className="mt-4 space-y-1.5 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <p className={typeScale.body.muted}>
                    <span className={typeScale.body.emphasis}>Software:</span> {selectedLicense.name}
                  </p>
                  <p className={typeScale.body.muted}>
                    <span className={typeScale.body.emphasis}>Category:</span> {selectedLicense.category}
                  </p>
                  <p className={typeScale.body.muted}>
                    <span className={typeScale.body.emphasis}>License key:</span> {selectedLicense.key}
                  </p>
                  <p className={typeScale.body.muted}>
                    <span className={typeScale.body.emphasis}>Seat usage:</span>{" "}
                    {selectedLicense.assignedSeats} / {selectedLicense.totalSeats}
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

export { SoftwarePage }
