"use client"

import * as React from "react"
import { useState, useMemo, useEffect } from "react"
import {
  Layers3Icon,
  UsersIcon,
  CreditCardIcon,
  ClockIcon,
  SearchIcon,
  PlusIcon,
  Trash2Icon,
  PencilIcon,
  HistoryIcon,
  AlertTriangleIcon,
  BadgeCheckIcon,
  XIcon,
  UserPlusIcon,
} from "lucide-react"
import { Toaster, toast } from "sonner"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { LicenseStatusBadge } from "@/components/dashboard/license-status-badge"
import { SeatUtilization } from "@/components/dashboard/seat-utilization"
import { FilterToolbar } from "@/components/dashboard/filter-toolbar"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

// Audit timeline log type
type AuditEvent = {
  date: string
  action: string
  user: string
  notes?: string
}

// Software License subscription type
type SoftwareLicense = {
  id: string
  name: string
  category: string
  supplier: string
  totalSeats: number
  assignedSeats: number
  renewalDate: string
  cost: string
  key: string
  status: "Active" | "Expiring Soon" | "Expired"
  assignees: string[]
  history: AuditEvent[]
  description?: string
}

// Active employees list
const employees = [
  "Mahesh Raja",
  "Asha Nair",
  "Rahul Menon",
  "John Doe",
  "Jane Smith",
  "David Miller",
  "Sarah Jenkins",
  "Nikhil Sharma",
  "Priya Patel",
  "Rohan Gupta",
]

// Initial Software dataset (6 products)
const initialLicenses: SoftwareLicense[] = [
  {
    id: "1",
    name: "Microsoft 365 Enterprise",
    category: "Productivity",
    supplier: "Microsoft Corp.",
    totalSeats: 50,
    assignedSeats: 42,
    renewalDate: "2027-04-18",
    cost: "$750/mo",
    key: "M365-ENT-88X92-J29KL-44910",
    status: "Active",
    assignees: ["Mahesh Raja", "Asha Nair", "Rahul Menon", "John Doe", "Jane Smith", "David Miller", "Sarah Jenkins"],
    history: [
      { date: "2026-04-18", action: "Subscription Renewed", user: "Mahesh Raja", notes: "Enterprise billing renewal for 12 months." },
      { date: "2026-04-20", action: "Seat Allocated", user: "Mahesh Raja", notes: "Assigned license seat to John Doe." },
    ],
    description: "Office suite apps including Word, Excel, Teams, and Cloud storage.",
  },
  {
    id: "2",
    name: "Figma Organization",
    category: "Design",
    supplier: "Figma Inc.",
    totalSeats: 20,
    assignedSeats: 18,
    renewalDate: "2026-12-14",
    cost: "$900/mo",
    key: "FIG-ORG-DESIGN-77F12-FIGMA",
    status: "Active",
    assignees: ["Mahesh Raja", "Asha Nair", "Rahul Menon", "Sarah Jenkins"],
    history: [
      { date: "2025-12-14", action: "Subscription Ingested", user: "Mahesh Raja", notes: "Design team seat setup." },
    ],
    description: "Collaborative interface design tool for UX/UI designers.",
  },
  {
    id: "3",
    name: "JetBrains IDE Suite",
    category: "Developer Tools",
    supplier: "JetBrains s.r.o.",
    totalSeats: 15,
    assignedSeats: 14,
    renewalDate: "2026-07-28",
    cost: "$350/mo",
    key: "JB-IDE-SUITE-99B12-JETBR",
    status: "Expiring Soon",
    assignees: ["Rahul Menon", "Jane Smith", "David Miller"],
    history: [
      { date: "2025-07-28", action: "Subscription Ingested", user: "Mahesh Raja" },
    ],
    description: "All-product pack containing IntelliJ, WebStorm, PyCharm, and CLion.",
  },
  {
    id: "4",
    name: "Slack Pro Plan",
    category: "Collaboration",
    supplier: "Slack Technologies",
    totalSeats: 100,
    assignedSeats: 92,
    renewalDate: "2027-02-05",
    cost: "$660/mo",
    key: "SLK-PRO-CHAT-55K01-SLACK",
    status: "Active",
    assignees: ["Mahesh Raja", "Asha Nair", "Rahul Menon", "John Doe", "Jane Smith"],
    history: [
      { date: "2026-02-05", action: "Subscription Renewed", user: "Mahesh Raja" },
    ],
    description: "Communication workspace for channels, threads, and huddles.",
  },
  {
    id: "5",
    name: "GitHub Enterprise",
    category: "Developer Tools",
    supplier: "GitHub Inc.",
    totalSeats: 30,
    assignedSeats: 30,
    renewalDate: "2026-07-15",
    cost: "$630/mo",
    key: "GH-ENT-CODE-44D92-GITUB",
    status: "Expiring Soon",
    assignees: ["Mahesh Raja", "Rahul Menon", "Jane Smith", "David Miller"],
    history: [
      { date: "2025-07-15", action: "Subscription Ingested", user: "Mahesh Raja" },
      { date: "2026-05-10", action: "Upgraded Capacity", user: "Mahesh Raja", notes: "Increased seats limit from 20 to 30." },
    ],
    description: "Enterprise software repository hosting and CI/CD pipelines.",
  },
  {
    id: "6",
    name: "Adobe Creative Cloud",
    category: "Design",
    supplier: "Adobe Inc.",
    totalSeats: 10,
    assignedSeats: 10,
    renewalDate: "2026-06-01",
    cost: "$800/mo",
    key: "ADB-CRE-CLOUD-11A99-ADOBE",
    status: "Expired",
    assignees: ["Asha Nair", "Sarah Jenkins"],
    history: [
      { date: "2025-06-01", action: "Subscription Ingested", user: "Mahesh Raja" },
      { date: "2026-06-01", action: "Subscription Expired", user: "System Alerts", notes: "Auto-renew disabled. Payment failed." },
    ],
    description: "Creative suite including Photoshop, Illustrator, Premiere, and After Effects.",
  },
]

export default function SoftwarePage() {
  const [licenses, setLicenses] = useState<SoftwareLicense[]>(initialLicenses)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses")
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories")

  // Modal states
  const [activeModal, setActiveModal] = useState<"add" | "edit" | "seats" | "history" | "delete" | null>(null)
  const [selectedLicense, setSelectedLicense] = useState<SoftwareLicense | null>(null)

  // Form states (Add/Edit)
  const [formName, setFormName] = useState("")
  const [formCategory, setFormCategory] = useState("Developer Tools")
  const [formSupplier, setFormSupplier] = useState("")
  const [formTotalSeats, setFormTotalSeats] = useState(10)
  const [formCost, setFormCost] = useState("")
  const [formRenewalDate, setFormRenewalDate] = useState("")
  const [formKey, setFormKey] = useState("")
  const [formDescription, setFormDescription] = useState("")

  // Seats allocator states
  const [newAssignee, setNewAssignee] = useState(employees[0])

  // Reset fields on modal toggle
  useEffect(() => {
    if (selectedLicense) {
      if (activeModal === "edit") {
        setFormName(selectedLicense.name)
        setFormCategory(selectedLicense.category)
        setFormSupplier(selectedLicense.supplier)
        setFormTotalSeats(selectedLicense.totalSeats)
        setFormCost(selectedLicense.cost)
        setFormRenewalDate(selectedLicense.renewalDate)
        setFormKey(selectedLicense.key)
        setFormDescription(selectedLicense.description || "")
      }
    } else if (activeModal === "add") {
      setFormName("")
      setFormCategory("Developer Tools")
      setFormSupplier("")
      setFormTotalSeats(10)
      setFormCost("$50/mo")
      setFormRenewalDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
      setFormKey(`LIC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`)
      setFormDescription("")
    }
  }, [selectedLicense, activeModal])

  // Get list of employees who do not hold a seat on the selected license
  const eligibleEmployees = useMemo(() => {
    if (!selectedLicense) return []
    return employees.filter((emp) => !selectedLicense.assignees.includes(emp))
  }, [selectedLicense])

  // Set default assignee when eligible list changes
  useEffect(() => {
    if (eligibleEmployees.length > 0) {
      setNewAssignee(eligibleEmployees[0])
    }
  }, [eligibleEmployees])

  // KPIs
  const kpis = useMemo(() => {
    const totalLicenses = licenses.length
    let totalSeats = 0
    let assignedSeats = 0
    let expiringSoon = 0
    let totalCostNum = 0

    licenses.forEach((lic) => {
      totalSeats += lic.totalSeats
      assignedSeats += lic.assignedSeats
      if (lic.status === "Expiring Soon") expiringSoon++

      // Parse cost to calculate monthly spending (e.g. "$750/mo" -> 750)
      const costMatch = lic.cost.replace(/[^0-9]/g, "")
      const val = parseInt(costMatch, 10)
      if (!isNaN(val)) {
        totalCostNum += val
      }
    })

    return {
      totalLicenses,
      assignedSeats,
      availableSeats: totalSeats - assignedSeats,
      expiringSoon,
      monthlySpend: `$${totalCostNum.toLocaleString()}/mo`,
    }
  }, [licenses])

  // Filtered subscriptions list
  const filteredLicenses = useMemo(() => {
    return licenses.filter((lic) => {
      const matchesSearch =
        lic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lic.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lic.key.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        selectedStatus === "All Statuses" || lic.status === selectedStatus

      const matchesCategory =
        selectedCategory === "All Categories" || lic.category === selectedCategory

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [licenses, searchQuery, selectedStatus, selectedCategory])

  const handleOpenModal = (modal: typeof activeModal, license: SoftwareLicense | null = null) => {
    setSelectedLicense(license)
    setActiveModal(modal)
  }

  const handleCloseModal = () => {
    setActiveModal(null)
    setSelectedLicense(null)
  }

  // CRUD Submit
  const handleSaveLicense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName || !formSupplier) {
      toast.error("Name and Supplier are required fields.")
      return
    }

    const todayStr = new Date().toISOString().split("T")[0]

    if (activeModal === "add") {
      const newLic: SoftwareLicense = {
        id: Math.random().toString(36).substr(2, 9),
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
          { date: todayStr, action: "License Subscription Registered", user: "Mahesh Raja", notes: `Initial seat size: ${formTotalSeats}.` },
        ],
      }
      setLicenses([newLic, ...licenses])
      toast.success(`Registered subscription for ${formName} successfully!`)
    } else if (activeModal === "edit" && selectedLicense) {
      setLicenses(
        licenses.map((lic) => {
          if (lic.id === selectedLicense.id) {
            const updatedHistory = [...lic.history]
            const changes = []
            if (lic.name !== formName) changes.push(`Name to '${formName}'`)
            if (lic.category !== formCategory) changes.push(`Category to '${formCategory}'`)
            if (lic.supplier !== formSupplier) changes.push(`Supplier to '${formSupplier}'`)
            if (lic.totalSeats !== formTotalSeats) changes.push(`Total Seats to ${formTotalSeats}`)
            if (lic.cost !== formCost) changes.push(`Cost model to '${formCost}'`)
            if (lic.renewalDate !== formRenewalDate) changes.push(`Renewal Date to '${formRenewalDate}'`)

            if (changes.length > 0) {
              updatedHistory.unshift({
                date: todayStr,
                action: "Subscription Updated",
                user: "Mahesh Raja",
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
          }
          return lic
        })
      )
      toast.success(`Updated subscription details for ${selectedLicense.name}.`)
    }

    handleCloseModal()
  }

  // Allocate a seat to an employee
  const handleAllocateSeat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLicense || !newAssignee) return

    if (selectedLicense.assignedSeats >= selectedLicense.totalSeats) {
      toast.error("Allocation failed. Seat capacity limit reached!")
      return
    }

    const todayStr = new Date().toISOString().split("T")[0]

    const updatedLicenses = licenses.map((lic) => {
      if (lic.id === selectedLicense.id) {
        const updatedAssignees = [...lic.assignees, newAssignee]
        const updatedHistory = [...lic.history]
        updatedHistory.unshift({
          date: todayStr,
          action: "Seat Allocated",
          user: "Mahesh Raja",
          notes: `Assigned license seat to employee ${newAssignee}.`,
        })

        const updatedLicense: SoftwareLicense = {
          ...lic,
          assignees: updatedAssignees,
          assignedSeats: updatedAssignees.length,
          history: updatedHistory,
        }

        // Set the active selected license state as well to update modal view
        setSelectedLicense(updatedLicense)
        return updatedLicense
      }
      return lic
    })

    setLicenses(updatedLicenses)
    toast.success(`License seat allocated to ${newAssignee}.`)
  }

  // Deallocate a seat from an employee
  const handleDeallocateSeat = (empName: string) => {
    if (!selectedLicense) return

    const todayStr = new Date().toISOString().split("T")[0]

    const updatedLicenses = licenses.map((lic) => {
      if (lic.id === selectedLicense.id) {
        const updatedAssignees = lic.assignees.filter((name) => name !== empName)
        const updatedHistory = [...lic.history]
        updatedHistory.unshift({
          date: todayStr,
          action: "Seat Deallocated",
          user: "Mahesh Raja",
          notes: `Revoked seat assignment from employee ${empName}.`,
        })

        const updatedLicense: SoftwareLicense = {
          ...lic,
          assignees: updatedAssignees,
          assignedSeats: updatedAssignees.length,
          history: updatedHistory,
        }

        setSelectedLicense(updatedLicense)
        return updatedLicense
      }
      return lic
    })

    setLicenses(updatedLicenses)
    toast.info(`Seat revoked from ${empName}. Seat is now available.`)
  }

  // Delete license subscription
  const handleDeleteConfirm = () => {
    if (!selectedLicense) return
    setLicenses(licenses.filter((lic) => lic.id !== selectedLicense.id))
    toast.success(`Removed subscription registry for ${selectedLicense.name}.`)
    handleCloseModal()
  }

  // Column Mapping
  const columns: ColumnDef<SoftwareLicense>[] = [
    {
      key: "software",
      header: "Software Plan",
      cell: (row) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">{row.name}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Badge variant="outline" className="h-5 px-1.5 text-xs font-medium">
              {row.category}
            </Badge>
            <span className="truncate">{row.supplier}</span>
          </div>
        </div>
      ),
      className: "w-[26%]",
    },
    {
      key: "seats",
      header: "Seat Allocation & Utilization",
      cell: (row) => (
        <SeatUtilization assigned={row.assignedSeats} total={row.totalSeats} />
      ),
      className: "w-[24%]",
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <LicenseStatusBadge status={row.status} />,
      className: "w-[12%]",
    },
    {
      key: "cost",
      header: "Subscription Cost",
      cell: (row) => (
        <span className="font-mono text-sm font-medium tabular-nums text-foreground">{row.cost}</span>
      ),
      className: "w-[12%]",
    },
    {
      key: "renewal",
      header: "Renewal Date",
      cell: (row) => (
        <span className="font-mono text-sm tabular-nums text-muted-foreground">{row.renewalDate}</span>
      ),
      className: "w-[12%]",
    },
    {
      key: "actions",
      header: <span className="flex justify-end pr-2">Actions</span>,
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5 pr-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-lg hover:bg-muted"
            onClick={() => handleOpenModal("history", row)}
            title="View History Timeline"
          >
            <HistoryIcon className="size-3.5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-lg hover:bg-muted"
            onClick={() => handleOpenModal("seats", row)}
            title="Manage Seat Allocations"
          >
            <UsersIcon className="size-3.5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-lg hover:bg-muted"
            onClick={() => handleOpenModal("edit", row)}
            title="Edit Plan"
          >
            <PencilIcon className="size-3.5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-lg text-destructive hover:bg-destructive/10"
            onClick={() => handleOpenModal("delete", row)}
            title="Delete Subscription"
          >
            <Trash2Icon className="size-3.5" />
          </Button>
        </div>
      ),
      className: "w-[14%]",
    },
  ]

  return (
    <DashboardShell
      title="Software Subscriptions"
      actions={
        <Button onClick={() => handleOpenModal("add")}>
          <PlusIcon className="size-4" />
          Add Subscription
        </Button>
      }
    >
      <Toaster position="top-right" closeButton richColors />

      <PageHeader
        eyebrow="Apps, subscriptions & licensing"
        title="Software Subscriptions"
        description="Track seat allocation, renewal dates, and subscription spend across vendors."
        meta={`${kpis.totalLicenses} subscriptions total · ${kpis.assignedSeats} seats assigned · ${kpis.availableSeats} seats available · ${kpis.monthlySpend} spend`}
      />

      <DashboardCard className="mt-6 overflow-hidden">
        <FilterToolbar>
          <div className="relative min-w-[240px] flex-1">
            <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by license name, supplier, or key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg bg-background pl-9"
            />
          </div>

          <NativeSelect
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <NativeSelectOption value="All Statuses">All Statuses</NativeSelectOption>
            <NativeSelectOption value="Active">Active</NativeSelectOption>
            <NativeSelectOption value="Expiring Soon">Expiring Soon</NativeSelectOption>
            <NativeSelectOption value="Expired">Expired</NativeSelectOption>
          </NativeSelect>

          <NativeSelect
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <NativeSelectOption value="All Categories">All Categories</NativeSelectOption>
            <NativeSelectOption value="Developer Tools">Developer Tools</NativeSelectOption>
            <NativeSelectOption value="Design">Design</NativeSelectOption>
            <NativeSelectOption value="Collaboration">Collaboration</NativeSelectOption>
            <NativeSelectOption value="Productivity">Productivity</NativeSelectOption>
          </NativeSelect>
        </FilterToolbar>

        <div className="p-4">
          {filteredLicenses.length > 0 ? (
            <DataTable columns={columns} rows={filteredLicenses} className="ring-0" />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 p-12 text-center">
              <AlertTriangleIcon className="mb-2 size-8 text-muted-foreground/60" />
              <div className="text-sm font-medium text-foreground">No software subscriptions found</div>
              <div className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try adjusting your search query or filters to find license subscriptions.
              </div>
            </div>
          )}
        </div>
      </DashboardCard>

      {/* 1. Add / Edit Subscription Dialog */}
      <Dialog open={activeModal === "add" || activeModal === "edit"} onOpenChange={handleCloseModal}>
        <DialogContent className="rounded-xl p-5 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{activeModal === "add" ? "Register Software Subscription" : "Modify Subscription Plan"}</DialogTitle>
            <DialogDescription>
              Configure software access details, billing terms, and seat sizes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveLicense} className="space-y-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="license-name" className="text-xs font-medium text-muted-foreground">Software Name</Label>
              <Input
                id="license-name"
                placeholder="e.g. GitHub Enterprise"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="license-supplier" className="text-xs font-medium text-muted-foreground">Supplier / Publisher</Label>
                <Input
                  id="license-supplier"
                  placeholder="e.g. Adobe Inc."
                  value={formSupplier}
                  onChange={(e) => setFormSupplier(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="license-category" className="text-xs font-medium text-muted-foreground">Category</Label>
                <NativeSelect
                  id="license-category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full h-9"
                >
                  <NativeSelectOption value="Developer Tools">Developer Tools</NativeSelectOption>
                  <NativeSelectOption value="Design">Design</NativeSelectOption>
                  <NativeSelectOption value="Collaboration">Collaboration</NativeSelectOption>
                  <NativeSelectOption value="Productivity">Productivity</NativeSelectOption>
                </NativeSelect>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-1.5 col-span-1">
                <Label htmlFor="license-seats" className="text-xs font-medium text-muted-foreground">Total Seats</Label>
                <Input
                  id="license-seats"
                  type="number"
                  min="1"
                  value={formTotalSeats}
                  onChange={(e) => setFormTotalSeats(parseInt(e.target.value, 10) || 0)}
                  required
                />
              </div>
              <div className="grid gap-1.5 col-span-1">
                <Label htmlFor="license-cost" className="text-xs font-medium text-muted-foreground">Billing Model</Label>
                <Input
                  id="license-cost"
                  placeholder="e.g. $450/mo"
                  value={formCost}
                  onChange={(e) => setFormCost(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5 col-span-1">
                <Label htmlFor="license-renewal" className="text-xs font-medium text-muted-foreground">Renewal Date</Label>
                <Input
                  id="license-renewal"
                  type="date"
                  value={formRenewalDate}
                  onChange={(e) => setFormRenewalDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="license-key" className="text-xs font-medium text-muted-foreground">License / Activation Key</Label>
              <Input
                id="license-key"
                placeholder="Product serial key or subscription URL"
                value={formKey}
                onChange={(e) => setFormKey(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="license-desc" className="text-xs font-medium text-muted-foreground">Product Description</Label>
              <Input
                id="license-desc"
                placeholder="Details about packages, seats limits, or access teams..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {activeModal === "add" ? "Register Subscription" : "Save Plan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Seats Allocation Manager Dialog */}
      <Dialog open={activeModal === "seats"} onOpenChange={handleCloseModal}>
        <DialogContent className="rounded-xl p-5 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage License Seats Allocation</DialogTitle>
            <DialogDescription>
              Add or revoke seats for <strong>{selectedLicense?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          {selectedLicense && (
            <div className="space-y-5 py-2">
              {/* Utilization progress bar detail */}
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium">Seat utilization</span>
                  <span className="text-foreground">
                    {selectedLicense.assignedSeats} / {selectedLicense.totalSeats} seats allocated
                  </span>
                </div>
                <SeatUtilization
                  assigned={selectedLicense.assignedSeats}
                  total={selectedLicense.totalSeats}
                />
              </div>

              {/* Allocate new seat sub-form */}
              {selectedLicense.assignedSeats < selectedLicense.totalSeats ? (
                eligibleEmployees.length > 0 ? (
                  <form onSubmit={handleAllocateSeat} className="flex items-end gap-2 p-3 border border-dashed border-border/80 rounded-lg">
                    <div className="grid gap-1.5 flex-1">
                      <Label htmlFor="seat-employee-select" className="text-xs font-medium text-muted-foreground">Allocate Seat to Employee</Label>
                      <NativeSelect
                        id="seat-employee-select"
                        value={newAssignee}
                        onChange={(e) => setNewAssignee(e.target.value)}
                        className="w-full"
                      >
                        {eligibleEmployees.map((emp) => (
                          <NativeSelectOption key={emp} value={emp}>
                            {emp}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </div>
                    <Button type="submit" size="sm">
                      <UserPlusIcon className="size-3.5 mr-1.5" />
                      Allocate
                    </Button>
                  </form>
                ) : (
                  <div className="text-center text-xs text-muted-foreground py-2 italic">
                    All company employees already hold a seat for this license subscription.
                  </div>
                )
              ) : (
                <div className="p-3 bg-red-500/5 border border-red-500/10 text-red-600 rounded-lg text-xs flex items-start gap-2">
                  <AlertTriangleIcon className="size-4.5 shrink-0 mt-0.5" />
                  <div>
                    <strong>Subscription Full Capacity:</strong> All {selectedLicense.totalSeats} seats are filled. Revoke seats or edit subscription plan to expand seats size.
                  </div>
                </div>
              )}

              {/* Current assignees timeline list */}
              <div>
                <div className="mb-2 text-xs font-medium text-muted-foreground">
                  Current seat holders ({selectedLicense.assignees.length})
                </div>
                {selectedLicense.assignees.length > 0 ? (
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {selectedLicense.assignees.map((name) => (
                      <div key={name} className="flex items-center justify-between p-2 rounded-md bg-muted/20 border border-border/40">
                        <div className="flex items-center gap-2">
                          <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-xs font-medium text-foreground">{name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="size-7 rounded-md text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeallocateSeat(name)}
                          title="Revoke License Access"
                        >
                          <XIcon className="size-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-xs text-muted-foreground py-4 italic border border-dashed rounded-lg">
                    No active employees allocated to seats yet.
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button">Close Manager</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Subscription History Logs Dialog */}
      <Dialog open={activeModal === "history"} onOpenChange={handleCloseModal}>
        <DialogContent className="rounded-xl p-5 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Audit & Activity Tracking</DialogTitle>
            <DialogDescription>
              Timeline logs for subscription <strong>{selectedLicense?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          {selectedLicense && (
            <div className="py-4 max-h-[320px] overflow-y-auto pr-1">
              <div className="relative pl-6 border-l-2 border-border/80 ml-2 space-y-6">
                {selectedLicense.history.map((evt, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute left-[-31px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-popover" />
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-foreground">{evt.action}</span>
                        <span className="font-mono text-xs text-muted-foreground">{evt.date}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        Performed by <span className="font-medium text-foreground/80">{evt.user}</span>
                      </div>
                      {evt.notes && (
                        <div className="mt-1 rounded-md border border-border/40 bg-muted/40 p-2 text-xs leading-relaxed text-muted-foreground italic">
                          “{evt.notes}”
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button">Close Log</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Delete Subscription Dialog */}
      <Dialog open={activeModal === "delete"} onOpenChange={handleCloseModal}>
        <DialogContent className="rounded-xl p-5 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangleIcon className="size-5" />
              Retire & Delete Subscription
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this software license registry? All seat allocations will be terminated.
            </DialogDescription>
          </DialogHeader>

          {selectedLicense && (
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20 text-xs space-y-1.5 my-2">
              <div><strong className="text-muted-foreground">Software Name:</strong> {selectedLicense.name}</div>
              <div><strong className="text-muted-foreground">Category:</strong> {selectedLicense.category}</div>
              <div><strong className="text-muted-foreground">License Key:</strong> {selectedLicense.key}</div>
              <div><strong className="text-muted-foreground">Seat Usage:</strong> {selectedLicense.assignedSeats} / {selectedLicense.totalSeats} seats</div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Permanently Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
