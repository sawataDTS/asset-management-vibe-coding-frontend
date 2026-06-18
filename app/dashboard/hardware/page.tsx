"use client"

import * as React from "react"
import { useState, useMemo, useEffect } from "react"
import {
  ActivityIcon,
  SearchIcon,
  PlusIcon,
  UserIcon,
  PencilIcon,
  Trash2Icon,
  HistoryIcon,
  AlertTriangleIcon,
} from "lucide-react"
import { Toaster, toast } from "sonner"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table"
import { StatusBadge, type AssetStatus } from "@/components/dashboard/status-badge"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { FilterToolbar } from "@/components/dashboard/filter-toolbar"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

// Asset audit history entry type
type AuditEvent = {
  date: string
  action: string
  user: string
  notes?: string
}

// Hardware Asset type
type HardwareAsset = {
  id: string
  name: string
  tag: string
  category: string
  status: AssetStatus
  assignee: string
  supplier: string
  location: string
  warranty: string
  serial: string
  history: AuditEvent[]
}

// Mock employees list
const employees = [
  "Mahesh Raja",
  "Asha Nair",
  "Rahul Menon",
  "John Doe",
  "Jane Smith",
  "David Miller",
  "Sarah Jenkins",
]

// Mock initial data (15 assets)
const initialAssets: HardwareAsset[] = [
  {
    id: "1",
    name: "HP Laptops",
    tag: "LAP-0012",
    category: "Laptop",
    status: "In Stock",
    assignee: "",
    supplier: "Trace",
    location: "—",
    warranty: "2027-06-16",
    serial: "S/N: HP-LAP-0012-X",
    history: [
      { date: "2026-06-16", action: "Asset Ingested", user: "Mahesh Raja", notes: "Procured from supplier Trace." },
    ],
  },
  {
    id: "2",
    name: "HP Laptops",
    tag: "LAP-0013",
    category: "Laptop",
    status: "In Stock",
    assignee: "",
    supplier: "Trace",
    location: "—",
    warranty: "2027-06-16",
    serial: "S/N: HP-LAP-0013-X",
    history: [
      { date: "2026-06-16", action: "Asset Ingested", user: "Mahesh Raja", notes: "Procured from supplier Trace." },
    ],
  },
  {
    id: "3",
    name: "HP Laptops",
    tag: "LAP-0014",
    category: "Laptop",
    status: "In Stock",
    assignee: "",
    supplier: "Trace",
    location: "—",
    warranty: "2027-06-16",
    serial: "S/N: HP-LAP-0014-X",
    history: [
      { date: "2026-06-16", action: "Asset Ingested", user: "Mahesh Raja", notes: "Procured from supplier Trace." },
    ],
  },
  {
    id: "4",
    name: "HP Laptops",
    tag: "LAP-0015",
    category: "Laptop",
    status: "In Stock",
    assignee: "",
    supplier: "Trace",
    location: "—",
    warranty: "2027-06-16",
    serial: "S/N: HP-LAP-0015-X",
    history: [
      { date: "2026-06-16", action: "Asset Ingested", user: "Mahesh Raja", notes: "Procured from supplier Trace." },
    ],
  },
  {
    id: "5",
    name: "HP Laptops",
    tag: "LAP-0011",
    category: "Laptop",
    status: "Assigned",
    assignee: "Mahesh",
    supplier: "Trace",
    location: "—",
    warranty: "2027-06-16",
    serial: "S/N: HP-LAP-0011-Y",
    history: [
      { date: "2026-06-15", action: "Asset Ingested", user: "Mahesh Raja", notes: "Procured from supplier Trace." },
      { date: "2026-06-16", action: "Assigned Device", user: "Mahesh Raja", notes: "Assigned during onboarding to Mahesh Raja." },
    ],
  },
  {
    id: "6",
    name: "Macbook Pro 14",
    tag: "LAP-0027",
    category: "Laptop",
    status: "In Stock",
    assignee: "",
    supplier: "InnovB",
    location: "—",
    warranty: "2026-06-14",
    serial: "S/N: AP-MBP-0027-A",
    history: [
      { date: "2025-06-14", action: "Asset Ingested", user: "Mahesh Raja", notes: "Procured from supplier InnovB." },
    ],
  },
  {
    id: "7",
    name: "Macbook Pro 14",
    tag: "LAP-0028",
    category: "Laptop",
    status: "In Stock",
    assignee: "",
    supplier: "InnovB",
    location: "—",
    warranty: "2026-06-14",
    serial: "S/N: AP-MBP-0028-B",
    history: [
      { date: "2025-06-14", action: "Asset Ingested", user: "Mahesh Raja", notes: "Procured from supplier InnovB." },
    ],
  },
  {
    id: "8",
    name: "Dell UltraSharp U2723QE",
    tag: "MON-0104",
    category: "Monitor",
    status: "In Stock",
    assignee: "",
    supplier: "Dell Direct",
    location: "HQ - Bangalore",
    warranty: "2028-02-11",
    serial: "S/N: DE-MON-0104-M",
    history: [
      { date: "2025-02-11", action: "Asset Ingested", user: "Mahesh Raja", notes: "Standard desktop screen procurement." },
    ],
  },
  {
    id: "9",
    name: "Dell UltraSharp U2723QE",
    tag: "MON-0105",
    category: "Monitor",
    status: "In Stock",
    assignee: "",
    supplier: "Dell Direct",
    location: "HQ - Bangalore",
    warranty: "2028-02-11",
    serial: "S/N: DE-MON-0105-N",
    history: [
      { date: "2025-02-11", action: "Asset Ingested", user: "Mahesh Raja", notes: "Standard desktop screen procurement." },
    ],
  },
  {
    id: "10",
    name: "iPhone 15 Pro",
    tag: "PHN-0052",
    category: "Phone",
    status: "Repair",
    assignee: "Asha Nair",
    supplier: "Apple Store",
    location: "Remote - US",
    warranty: "2026-12-04",
    serial: "S/N: AP-IPH-0052-P",
    history: [
      { date: "2024-12-04", action: "Asset Ingested", user: "Mahesh Raja", notes: "Ingested mobile fleet device." },
      { date: "2025-01-10", action: "Assigned Device", user: "Mahesh Raja", notes: "Assigned to Asha Nair." },
      { date: "2026-06-12", action: "Sent to Repair", user: "Asha Nair", notes: "Battery health issue. Sent for diag service." },
    ],
  },
  {
    id: "11",
    name: "Lenovo ThinkPad X1 Carbon",
    tag: "LAP-0081",
    category: "Laptop",
    status: "Assigned",
    assignee: "Rahul Menon",
    supplier: "Lenovo Direct",
    location: "Remote - US",
    warranty: "2027-03-18",
    serial: "S/N: LE-THK-0081-L",
    history: [
      { date: "2024-03-18", action: "Asset Ingested", user: "Mahesh Raja", notes: "Procured through IT contract." },
      { date: "2024-04-01", action: "Assigned Device", user: "Mahesh Raja", notes: "Assigned to Rahul Menon for remote work setup." },
    ],
  },
  {
    id: "12",
    name: "MacBook Air 13” (M2)",
    tag: "LAP-0106",
    category: "Laptop",
    status: "Retired",
    assignee: "",
    supplier: "Apple Store",
    location: "—",
    warranty: "Expired",
    serial: "S/N: AP-MBA-0106-E",
    history: [
      { date: "2022-06-15", action: "Asset Ingested", user: "Mahesh Raja" },
      { date: "2026-06-15", action: "Retired Device", user: "Mahesh Raja", notes: "Out of support warranty cycle. Device decommissioned." },
    ],
  },
  {
    id: "13",
    name: "Apple Magic Keyboard",
    tag: "ACC-0210",
    category: "Accessories",
    status: "In Stock",
    assignee: "",
    supplier: "Apple Store",
    location: "HQ - Bangalore",
    warranty: "2026-09-22",
    serial: "S/N: AP-KBD-0210-K",
    history: [
      { date: "2025-09-22", action: "Asset Ingested", user: "Mahesh Raja" },
    ],
  },
  {
    id: "14",
    name: "Apple Magic Mouse",
    tag: "ACC-0211",
    category: "Accessories",
    status: "In Stock",
    assignee: "",
    supplier: "Apple Store",
    location: "HQ - Bangalore",
    warranty: "2026-09-22",
    serial: "S/N: AP-MSE-0211-M",
    history: [
      { date: "2025-09-22", action: "Asset Ingested", user: "Mahesh Raja" },
    ],
  },
  {
    id: "15",
    name: "Logitech MX Master 3S",
    tag: "ACC-0345",
    category: "Accessories",
    status: "Assigned",
    assignee: "Mahesh",
    supplier: "Logitech Store",
    location: "—",
    warranty: "2026-11-05",
    serial: "S/N: LO-MSE-0345-S",
    history: [
      { date: "2024-11-05", action: "Asset Ingested", user: "Mahesh Raja" },
      { date: "2024-12-01", action: "Assigned Device", user: "Mahesh Raja", notes: "Assigned custom mouse to Mahesh." },
    ],
  },
]

export default function HardwarePage() {
  const [assets, setAssets] = useState<HardwareAsset[]>(initialAssets)

  // Filtering states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses")
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories")

  // Modal control states
  const [activeModal, setActiveModal] = useState<"add" | "edit" | "assign" | "repair" | "history" | "delete" | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<HardwareAsset | null>(null)

  // Form states
  const [formName, setFormName] = useState("")
  const [formTag, setFormTag] = useState("")
  const [formCategory, setFormCategory] = useState("Laptop")
  const [formSupplier, setFormSupplier] = useState("Trace")
  const [formLocation, setFormLocation] = useState("")
  const [formWarranty, setFormWarranty] = useState("")
  const [formSerial, setFormSerial] = useState("")

  // Assign form state
  const [selectedAssignee, setSelectedAssignee] = useState(employees[0])

  // Repair form state
  const [repairNotes, setRepairNotes] = useState("")
  const [repairReason, setRepairReason] = useState("Battery issues")

  // Load selected asset properties into form state on change
  useEffect(() => {
    if (selectedAsset) {
      if (activeModal === "edit") {
        setFormName(selectedAsset.name)
        setFormTag(selectedAsset.tag)
        setFormCategory(selectedAsset.category)
        setFormSupplier(selectedAsset.supplier)
        setFormLocation(selectedAsset.location === "—" ? "" : selectedAsset.location)
        setFormWarranty(selectedAsset.warranty)
        setFormSerial(selectedAsset.serial)
      } else if (activeModal === "assign") {
        setSelectedAssignee(selectedAsset.assignee || employees[0])
      } else if (activeModal === "repair") {
        setRepairNotes("")
        setRepairReason("Battery issues")
      }
    } else if (activeModal === "add") {
      setFormName("")
      setFormTag(`LAP-${Math.floor(1000 + Math.random() * 9000)}`)
      setFormCategory("Laptop")
      setFormSupplier("Trace")
      setFormLocation("")
      setFormWarranty(new Date().toISOString().split("T")[0])
      setFormSerial("")
    }
  }, [selectedAsset, activeModal])

  // KPI Calculations (used for page meta)
  const kpis = useMemo(() => {
    const total = assets.length
    const assigned = assets.filter((a) => a.status === "Assigned").length
    const inStock = assets.filter((a) => a.status === "In Stock").length
    const inRepair = assets.filter((a) => a.status === "Repair").length
    const retired = assets.filter((a) => a.status === "Retired").length

    return { total, assigned, inStock, inRepair, retired }
  }, [assets])

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.supplier.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        selectedStatus === "All Statuses" || asset.status === selectedStatus

      const matchesCategory =
        selectedCategory === "All Categories" || asset.category === selectedCategory

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [assets, searchQuery, selectedStatus, selectedCategory])

  const handleOpenModal = (modal: typeof activeModal, asset: HardwareAsset | null = null) => {
    setSelectedAsset(asset)
    setActiveModal(modal)
  }

  const handleCloseModal = () => {
    setActiveModal(null)
    setSelectedAsset(null)
  }

  // Add or Edit Asset Submit
  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName || !formTag) {
      toast.error("Asset Name and Tag are required.")
      return
    }

    const todayStr = new Date().toISOString().split("T")[0]

    if (activeModal === "add") {
      const newAsset: HardwareAsset = {
        id: Math.random().toString(36).substr(2, 9),
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
            user: "Mahesh Raja",
            notes: `Initial registration. Supplier: ${formSupplier}`,
          },
        ],
      }
      setAssets([newAsset, ...assets])
      toast.success(`Registered new asset ${formTag} successfully!`)
    } else if (activeModal === "edit" && selectedAsset) {
      setAssets(
        assets.map((a) => {
          if (a.id === selectedAsset.id) {
            const updatedHistory = [...a.history]
            // Detect modified properties for log notes
            const changes = []
            if (a.name !== formName) changes.push(`Name to '${formName}'`)
            if (a.category !== formCategory) changes.push(`Category to '${formCategory}'`)
            if (a.supplier !== formSupplier) changes.push(`Supplier to '${formSupplier}'`)
            if (a.location !== (formLocation || "—")) changes.push(`Location to '${formLocation || "—"}'`)
            if (a.warranty !== formWarranty) changes.push(`Warranty to '${formWarranty}'`)

            if (changes.length > 0) {
              updatedHistory.unshift({
                date: todayStr,
                action: "Asset Updated",
                user: "Mahesh Raja",
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
          }
          return a
        })
      )
      toast.success(`Updated asset details for ${formTag}.`)
    }

    handleCloseModal()
  }

  // Handle assign or unassign device
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAsset) return

    const todayStr = new Date().toISOString().split("T")[0]

    setAssets(
      assets.map((a) => {
        if (a.id === selectedAsset.id) {
          const updatedHistory = [...a.history]

          if (a.status === "Assigned") {
            // Unassign
            updatedHistory.unshift({
              date: todayStr,
              action: "Returned / Unassigned",
              user: "Mahesh Raja",
              notes: `Checked back in by employee ${a.assignee}.`,
            })
            return {
              ...a,
              status: "In Stock" as AssetStatus,
              assignee: "",
              history: updatedHistory,
            }
          } else {
            // Assign
            updatedHistory.unshift({
              date: todayStr,
              action: "Assigned Device",
              user: "Mahesh Raja",
              notes: `Assigned ownership to ${selectedAssignee}.`,
            })
            return {
              ...a,
              status: "Assigned" as AssetStatus,
              assignee: selectedAssignee,
              history: updatedHistory,
            }
          }
        }
        return a
      })
    )

    toast.success(
      selectedAsset.status === "Assigned"
        ? `Device ${selectedAsset.tag} checked back into inventory.`
        : `Device ${selectedAsset.tag} assigned to ${selectedAssignee} successfully.`
    )
    handleCloseModal()
  }

  // Handle Repair / Fixed toggle
  const handleRepairSubmit = (e: React.FormEvent, targetAction: "repair" | "fixed" | "retire") => {
    e.preventDefault()
    if (!selectedAsset) return

    const todayStr = new Date().toISOString().split("T")[0]

    setAssets(
      assets.map((a) => {
        if (a.id === selectedAsset.id) {
          const updatedHistory = [...a.history]

          if (targetAction === "repair") {
            updatedHistory.unshift({
              date: todayStr,
              action: "Sent to Repair",
              user: "Mahesh Raja",
              notes: `${repairReason}. Notes: ${repairNotes || "None"}`,
            })
            return {
              ...a,
              status: "Repair" as AssetStatus,
              history: updatedHistory,
            }
          } else if (targetAction === "fixed") {
            updatedHistory.unshift({
              date: todayStr,
              action: "Repaired & Returned",
              user: "Mahesh Raja",
              notes: `Device diagnosed, issue resolved. Notes: ${repairNotes || "None"}`,
            })
            return {
              ...a,
              status: "In Stock" as AssetStatus,
              history: updatedHistory,
            }
          } else if (targetAction === "retire") {
            updatedHistory.unshift({
              date: todayStr,
              action: "Retired Device",
              user: "Mahesh Raja",
              notes: `Decommissioned during repair diagnostic. Reason: ${repairNotes || "Decommissioned"}`,
            })
            return {
              ...a,
              status: "Retired" as AssetStatus,
              assignee: "",
              history: updatedHistory,
            }
          }
        }
        return a
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

  // Delete Asset
  const handleDeleteConfirm = () => {
    if (!selectedAsset) return
    setAssets(assets.filter((a) => a.id !== selectedAsset.id))
    toast.success(`Removed asset ${selectedAsset.tag} from database.`)
    handleCloseModal()
  }

  // Columns definition for DataTable
  const columns: ColumnDef<HardwareAsset>[] = [
    {
      key: "asset",
      header: "Asset",
      cell: (row) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">{row.name}</div>
          <div className="text-xs text-muted-foreground">{row.tag}</div>
        </div>
      ),
      className: "w-[24%]",
    },
    {
      key: "category",
      header: "Category",
      cell: (row) => <span className="text-sm text-muted-foreground">{row.category}</span>,
      className: "w-[12%]",
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
      className: "w-[12%]",
    },
    {
      key: "assignee",
      header: "Assignee",
      cell: (row) => (
        <span className="text-sm text-foreground">
          {row.assignee || <span className="text-muted-foreground">—</span>}
        </span>
      ),
      className: "w-[14%]",
    },
    {
      key: "supplier",
      header: "Supplier",
      cell: (row) => <span className="text-sm text-muted-foreground">{row.supplier}</span>,
      className: "w-[12%]",
    },
    {
      key: "location",
      header: "Location",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.location !== "—" ? row.location : "—"}
        </span>
      ),
      className: "w-[12%]",
    },
    {
      key: "warranty",
      header: "Warranty",
      cell: (row) => (
        <span className="font-mono text-sm tabular-nums text-muted-foreground">{row.warranty}</span>
      ),
      className: "w-[14%]",
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
            title="View History Log"
          >
            <HistoryIcon className="size-3.5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-lg hover:bg-muted"
            onClick={() => handleOpenModal("assign", row)}
            title={row.status === "Assigned" ? "Deallocate / Return" : "Assign to Employee"}
          >
            <UserIcon className="size-3.5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-lg hover:bg-muted"
            onClick={() => handleOpenModal("repair", row)}
            title={row.status === "Repair" ? "Diagnostic / Resolve" : "Send to Repair"}
          >
            <ActivityIcon className="size-3.5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-lg hover:bg-muted"
            onClick={() => handleOpenModal("edit", row)}
            title="Edit Details"
          >
            <PencilIcon className="size-3.5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-lg text-destructive hover:bg-destructive/10"
            onClick={() => handleOpenModal("delete", row)}
            title="Retire / Delete"
          >
            <Trash2Icon className="size-3.5" />
          </Button>
        </div>
      ),
      className: "w-[20%]",
    },
  ]

  return (
    <DashboardShell
      title="Hardware Inventory"
      actions={
        <Button onClick={() => handleOpenModal("add")}>
          <PlusIcon className="size-4" />
          Add Asset
        </Button>
      }
    >
      <Toaster position="top-right" closeButton richColors />

      <PageHeader
        eyebrow="Inventory"
        title="Hardware Inventory"
        description="Track laptops, monitors, peripherals, and their assignment status across your organization."
        meta={`${kpis.total} assets total · ${kpis.assigned} assigned · ${kpis.inStock} in stock`}
      />

      <DashboardCard className="mt-6 overflow-hidden">
        <FilterToolbar>
          <div className="relative min-w-[240px] flex-1">
            <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, tag, serial, or supplier..."
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
            <NativeSelectOption value="In Stock">In Stock</NativeSelectOption>
            <NativeSelectOption value="Assigned">Assigned</NativeSelectOption>
            <NativeSelectOption value="Repair">In Repair</NativeSelectOption>
            <NativeSelectOption value="Retired">Retired</NativeSelectOption>
          </NativeSelect>

          <NativeSelect
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <NativeSelectOption value="All Categories">All Categories</NativeSelectOption>
            <NativeSelectOption value="Laptop">Laptops</NativeSelectOption>
            <NativeSelectOption value="Monitor">Monitors</NativeSelectOption>
            <NativeSelectOption value="Phone">Phones</NativeSelectOption>
            <NativeSelectOption value="Accessories">Accessories</NativeSelectOption>
            <NativeSelectOption value="Other">Other</NativeSelectOption>
          </NativeSelect>
        </FilterToolbar>

        <div className="p-4">
          {filteredAssets.length > 0 ? (
            <DataTable
              columns={columns}
              rows={filteredAssets}
              className="ring-0"
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 p-12 text-center">
              <AlertTriangleIcon className="mb-2 size-8 text-muted-foreground/60" />
              <div className="text-sm font-medium text-foreground">No hardware assets found</div>
              <div className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try adjusting your search query or filters to find inventory items.
              </div>
            </div>
          )}
        </div>
      </DashboardCard>

      {/* 1. Add / Edit Asset Modal */}
      <Dialog open={activeModal === "add" || activeModal === "edit"} onOpenChange={handleCloseModal}>
        <DialogContent className="rounded-xl p-5 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{activeModal === "add" ? "Register New Hardware Asset" : "Edit Asset Details"}</DialogTitle>
            <DialogDescription>
              Provide configuration details and warranty coverage dates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAsset} className="space-y-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="asset-name" className="text-xs font-medium text-muted-foreground">Asset Name</Label>
              <Input
                id="asset-name"
                placeholder="e.g. Macbook Pro 14” (M3 Pro)"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="asset-tag" className="text-xs font-medium text-muted-foreground">Asset Tag</Label>
                <Input
                  id="asset-tag"
                  placeholder="e.g. LAP-0012"
                  value={formTag}
                  onChange={(e) => setFormTag(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="asset-serial" className="text-xs font-medium text-muted-foreground">Serial Number</Label>
                <Input
                  id="asset-serial"
                  placeholder="S/N: Apple-..."
                  value={formSerial}
                  onChange={(e) => setFormSerial(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="asset-category" className="text-xs font-medium text-muted-foreground">Category</Label>
                <NativeSelect
                  id="asset-category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full h-9"
                >
                  <NativeSelectOption value="Laptop">Laptop</NativeSelectOption>
                  <NativeSelectOption value="Monitor">Monitor</NativeSelectOption>
                  <NativeSelectOption value="Phone">Phone</NativeSelectOption>
                  <NativeSelectOption value="Accessories">Accessories</NativeSelectOption>
                  <NativeSelectOption value="Other">Other</NativeSelectOption>
                </NativeSelect>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="asset-supplier" className="text-xs font-medium text-muted-foreground">Supplier</Label>
                <NativeSelect
                  id="asset-supplier"
                  value={formSupplier}
                  onChange={(e) => setFormSupplier(e.target.value)}
                  className="w-full h-9"
                >
                  <NativeSelectOption value="Trace">Trace</NativeSelectOption>
                  <NativeSelectOption value="InnovB">InnovB</NativeSelectOption>
                  <NativeSelectOption value="Dell Direct">Dell Direct</NativeSelectOption>
                  <NativeSelectOption value="Lenovo Direct">Lenovo Direct</NativeSelectOption>
                  <NativeSelectOption value="Apple Store">Apple Store</NativeSelectOption>
                  <NativeSelectOption value="Logitech Store">Logitech Store</NativeSelectOption>
                </NativeSelect>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="asset-location" className="text-xs font-medium text-muted-foreground">Location</Label>
                <Input
                  id="asset-location"
                  placeholder="HQ - Bangalore"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="asset-warranty" className="text-xs font-medium text-muted-foreground">Warranty Expiry Date</Label>
                <Input
                  id="asset-warranty"
                  type="date"
                  value={formWarranty}
                  onChange={(e) => setFormWarranty(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {activeModal === "add" ? "Register Asset" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Assign / Unassign Dialog */}
      <Dialog open={activeModal === "assign"} onOpenChange={handleCloseModal}>
        <DialogContent className="rounded-xl p-5 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedAsset?.status === "Assigned" ? "Deallocate Hardware Asset" : "Allocate Hardware Asset"}
            </DialogTitle>
            <DialogDescription>
              {selectedAsset?.status === "Assigned"
                ? `Return device ${selectedAsset.tag} back into organization storage.`
                : `Assign device ${selectedAsset?.tag} to an active employee.`}
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <form onSubmit={handleAssignSubmit} className="space-y-4 py-2">
              {selectedAsset.status === "Assigned" ? (
                <div className="p-4 rounded-lg bg-muted/40 border border-border">
                  <div className="text-xs font-medium text-muted-foreground">Current assignee</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {selectedAsset.assignee.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{selectedAsset.assignee}</div>
                      <div className="text-xs text-muted-foreground">Assigned on active tenure</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="employee-select" className="text-xs font-medium text-muted-foreground">Select Active Employee</Label>
                  <NativeSelect
                    id="employee-select"
                    value={selectedAssignee}
                    onChange={(e) => setSelectedAssignee(e.target.value)}
                    className="w-full h-10"
                  >
                    {employees.map((emp) => (
                      <NativeSelectOption key={emp} value={emp}>
                        {emp}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>
              )}

              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" variant={selectedAsset.status === "Assigned" ? "destructive" : "default"}>
                  {selectedAsset.status === "Assigned" ? "Unassign Device" : "Assign Asset"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 3. Repair / Diagnostic Dialog */}
      <Dialog open={activeModal === "repair"} onOpenChange={handleCloseModal}>
        <DialogContent className="rounded-xl p-5 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedAsset?.status === "Repair" ? "Repair Diagnostic Completion" : "Initiate Repair Lifecycle"}
            </DialogTitle>
            <DialogDescription>
              {selectedAsset?.status === "Repair"
                ? `Diagnose or close repair service backlog for ${selectedAsset.tag}.`
                : `Send device ${selectedAsset?.tag} to specialized repairs.`}
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="space-y-4 py-2">
              {selectedAsset.status === "Repair" ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="repair-diag-notes" className="font-mono text-xs font-medium text-muted-foreground">Closing diagnostic notes</Label>
                    <Input
                      id="repair-diag-notes"
                      placeholder="e.g. Replaced display panel. Tested successfully."
                      value={repairNotes}
                      onChange={(e) => setRepairNotes(e.target.value)}
                    />
                  </div>

                  <DialogFooter className="pt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Close</Button>
                    </DialogClose>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={(e) => handleRepairSubmit(e, "retire")}
                    >
                      Decommission / Retire
                    </Button>
                    <Button
                      type="button"
                      onClick={(e) => handleRepairSubmit(e, "fixed")}
                    >
                      Mark as Fixed
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <form onSubmit={(e) => handleRepairSubmit(e, "repair")} className="space-y-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="repair-reason" className="text-xs font-medium text-muted-foreground">Reason for Service</Label>
                    <NativeSelect
                      id="repair-reason"
                      value={repairReason}
                      onChange={(e) => setRepairReason(e.target.value)}
                      className="w-full h-10"
                    >
                      <NativeSelectOption value="Battery replacement/swollen">Battery replacement</NativeSelectOption>
                      <NativeSelectOption value="Display/Screen replacement">Display issues</NativeSelectOption>
                      <NativeSelectOption value="Keyboard/Trackpad damage">Keyboard/Trackpad diagnostic</NativeSelectOption>
                      <NativeSelectOption value="Software corruption / OS wipe">Software issue / Intune locked</NativeSelectOption>
                      <NativeSelectOption value="Other diagnostics">Other diagnostics</NativeSelectOption>
                    </NativeSelect>
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="repair-incident-notes" className="text-xs font-medium text-muted-foreground">Diagnostic Notes</Label>
                    <Input
                      id="repair-incident-notes"
                      placeholder="Describe symptoms, device drops, or issues"
                      value={repairNotes}
                      onChange={(e) => setRepairNotes(e.target.value)}
                    />
                  </div>

                  <DialogFooter className="pt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">
                      Initiate Repairs
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 4. Timeline Audit History Dialog */}
      <Dialog open={activeModal === "history"} onOpenChange={handleCloseModal}>
        <DialogContent className="rounded-xl p-5 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Audit & Activity Tracking</DialogTitle>
            <DialogDescription>
              Timeline logs for device {selectedAsset?.tag} ({selectedAsset?.name}).
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="py-4 max-h-[320px] overflow-y-auto pr-1">
              <div className="relative pl-6 border-l-2 border-border/80 ml-2 space-y-6">
                {selectedAsset.history.map((evt, idx) => (
                  <div key={idx} className="relative">
                    {/* Bullet marker */}
                    <div className="absolute -left-[31px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-popover" />
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-foreground">{evt.action}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{evt.date}</span>
                      </div>
                      <div className="text-[11.5px] text-muted-foreground mt-0.5">
                        Performed by <span className="font-medium text-foreground/80">{evt.user}</span>
                      </div>
                      {evt.notes && (
                        <div className="mt-1 text-[11px] bg-muted/40 p-2 rounded-md border border-border/40 text-muted-foreground leading-relaxed italic">
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

      {/* 5. Delete Confirmation Dialog */}
      <Dialog open={activeModal === "delete"} onOpenChange={handleCloseModal}>
        <DialogContent className="rounded-xl p-5 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangleIcon className="size-5" />
              Retire & Delete Asset
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this hardware asset? This action will permanently remove it from tracking logs.
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20 text-xs space-y-1.5 my-2">
              <div><strong className="text-muted-foreground">Asset Name:</strong> {selectedAsset.name}</div>
              <div><strong className="text-muted-foreground">Asset Tag:</strong> {selectedAsset.tag}</div>
              <div><strong className="text-muted-foreground">Serial No:</strong> {selectedAsset.serial}</div>
              <div><strong className="text-muted-foreground">Status:</strong> {selectedAsset.status}</div>
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
