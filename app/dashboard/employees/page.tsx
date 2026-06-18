"use client"

import * as React from "react"
import { useState, useMemo, useEffect } from "react"
import {
  SearchIcon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  AlertTriangleIcon,
  CpuIcon,
  KeyIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react"
import { Toaster, toast } from "sonner"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import {
  EmployeeStatusBadge,
  type EmploymentStatus,
} from "@/components/dashboard/employee-status-badge"
import { FilterToolbar } from "@/components/dashboard/filter-toolbar"
import { PageHeader } from "@/components/dashboard/page-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type WorkspaceRole = "Employee" | "Manager" | "Admin"

type EmployeeAssignment = {
  id: string
  name: string
  tag: string
  supplier?: string
}

type Employee = {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  jobTitle: string
  department: string
  manager: string
  startDate: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  workspaceEnabled: boolean
  workspaceRole: WorkspaceRole
  status: EmploymentStatus
  notes: string
  hardwareAssignments: EmployeeAssignment[]
  softwareAssignments: EmployeeAssignment[]
}

const departments = [
  "Engineering",
  "Design",
  "IT Ops",
  "HR",
  "Finance",
  "Sales",
  "Marketing",
]

const managers = ["— None —", "Mahesh Raja", "Asha Nair", "Rahul Menon"]

const availableHardware = [
  { id: "hw-1", name: "MacBook Pro 14", tag: "LAP-0001" },
  { id: "hw-2", name: "Dell UltraSharp U2723QE", tag: "MON-0042" },
  { id: "hw-3", name: "HP Laptops", tag: "LAP-0012" },
  { id: "hw-4", name: "iPhone 15 Pro", tag: "PHN-0088" },
]

const availableSoftware = [
  { id: "sw-1", name: "Microsoft 365 Enterprise", tag: "M365-ENT", supplier: "Microsoft" },
  { id: "sw-2", name: "Adobe Premier", tag: "ADOBE-PR", supplier: "Adobe" },
  { id: "sw-3", name: "Figma Organization", tag: "FIG-ORG", supplier: "Figma" },
  { id: "sw-4", name: "Slack Pro Plan", tag: "SLK-PRO", supplier: "Slack" },
]

const initialEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP-1001",
    name: "Mahesh",
    email: "mahesh@dtskill.com",
    phone: "97900191202",
    jobTitle: "IT Administrator",
    department: "",
    manager: "— None —",
    startDate: "2024-03-15",
    address: "afas",
    city: "fas",
    state: "fafa",
    zip: "60606",
    country: "nfd",
    workspaceEnabled: true,
    workspaceRole: "Admin",
    status: "Active",
    notes: "",
    hardwareAssignments: [
      { id: "hw-a", name: "Macbook Pro 14", tag: "LAP-0001" },
      { id: "hw-b", name: "HP Laptops", tag: "LAP-0011" },
    ],
    softwareAssignments: [
      { id: "sw-a", name: "Adobe Premier", tag: "ADOBE-PR" },
      { id: "sw-b", name: "Microsoft Business 365 Basic #1", tag: "M365-BASIC", supplier: "Microsoft" },
    ],
  },
  {
    id: "2",
    employeeId: "EMP-1002",
    name: "Asha Nair",
    email: "asha.nair@dtskill.com",
    phone: "+91 98765 43210",
    jobTitle: "Design Lead",
    department: "Design",
    manager: "Mahesh Raja",
    startDate: "2023-08-01",
    address: "42 MG Road",
    city: "Bangalore",
    state: "Karnataka",
    zip: "560001",
    country: "India",
    workspaceEnabled: true,
    workspaceRole: "Manager",
    status: "Active",
    notes: "Leads product design team.",
    hardwareAssignments: [{ id: "hw-c", name: "MacBook Air 13", tag: "LAP-0022" }],
    softwareAssignments: [
      { id: "sw-c", name: "Figma Organization", tag: "FIG-ORG", supplier: "Figma" },
    ],
  },
  {
    id: "3",
    employeeId: "EMP-1003",
    name: "Rahul Menon",
    email: "rahul.menon@dtskill.com",
    phone: "+91 91234 56789",
    jobTitle: "Software Engineer",
    department: "Engineering",
    manager: "Mahesh Raja",
    startDate: "2025-01-10",
    address: "18 Residency Road",
    city: "Bangalore",
    state: "Karnataka",
    zip: "560025",
    country: "India",
    workspaceEnabled: true,
    workspaceRole: "Employee",
    status: "Active",
    notes: "",
    hardwareAssignments: [],
    softwareAssignments: [
      { id: "sw-d", name: "JetBrains IDE Suite", tag: "JB-IDE", supplier: "JetBrains" },
    ],
  },
  {
    id: "4",
    employeeId: "EMP-1004",
    name: "John Doe",
    email: "john.doe@dtskill.com",
    phone: "+1 555 010 2233",
    jobTitle: "Account Executive",
    department: "Sales",
    manager: "Asha Nair",
    startDate: "2022-11-20",
    address: "500 Market Street",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "USA",
    workspaceEnabled: false,
    workspaceRole: "Employee",
    status: "On Leave",
    notes: "Extended leave until July.",
    hardwareAssignments: [],
    softwareAssignments: [],
  },
]

function formatLocation(emp: Employee) {
  const parts = [emp.address, emp.city, emp.state, emp.zip, emp.country].filter(Boolean)
  return parts.join(", ")
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")

  const [activeModal, setActiveModal] = useState<"add" | "edit" | "delete" | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [formEmployeeId, setFormEmployeeId] = useState("")
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formJobTitle, setFormJobTitle] = useState("")
  const [formDepartment, setFormDepartment] = useState("")
  const [formManager, setFormManager] = useState("— None —")
  const [formStartDate, setFormStartDate] = useState("")
  const [formAddress, setFormAddress] = useState("")
  const [formCity, setFormCity] = useState("")
  const [formState, setFormState] = useState("")
  const [formZip, setFormZip] = useState("")
  const [formCountry, setFormCountry] = useState("")
  const [formWorkspaceEnabled, setFormWorkspaceEnabled] = useState(true)
  const [formWorkspaceRole, setFormWorkspaceRole] = useState<WorkspaceRole>("Employee")
  const [formStatus, setFormStatus] = useState<EmploymentStatus>("Active")
  const [formNotes, setFormNotes] = useState("")

  const [pickHardware, setPickHardware] = useState("")
  const [pickSoftware, setPickSoftware] = useState("")

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.employeeId.toLowerCase().includes(q) ||
        emp.jobTitle.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)

      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        (selectedDepartment === "Unassigned" ? !emp.department : emp.department === selectedDepartment)

      return matchesSearch && matchesDepartment
    })
  }, [employees, searchQuery, selectedDepartment])

  useEffect(() => {
    if (selectedEmployee && detailOpen) {
      const updated = employees.find((e) => e.id === selectedEmployee.id)
      if (updated) setSelectedEmployee(updated)
    }
  }, [employees, selectedEmployee?.id, detailOpen])

  useEffect(() => {
    if (selectedEmployee && activeModal === "edit") {
      setFormEmployeeId(selectedEmployee.employeeId)
      setFormName(selectedEmployee.name)
      setFormEmail(selectedEmployee.email)
      setFormPhone(selectedEmployee.phone)
      setFormJobTitle(selectedEmployee.jobTitle)
      setFormDepartment(selectedEmployee.department)
      setFormManager(selectedEmployee.manager)
      setFormStartDate(selectedEmployee.startDate)
      setFormAddress(selectedEmployee.address)
      setFormCity(selectedEmployee.city)
      setFormState(selectedEmployee.state)
      setFormZip(selectedEmployee.zip)
      setFormCountry(selectedEmployee.country)
      setFormWorkspaceEnabled(selectedEmployee.workspaceEnabled)
      setFormWorkspaceRole(selectedEmployee.workspaceRole)
      setFormStatus(selectedEmployee.status)
      setFormNotes(selectedEmployee.notes)
    } else if (activeModal === "add") {
      setFormEmployeeId(`EMP-${Math.floor(1000 + Math.random() * 9000)}`)
      setFormName("")
      setFormEmail("")
      setFormPhone("")
      setFormJobTitle("")
      setFormDepartment("")
      setFormManager("— None —")
      setFormStartDate(new Date().toISOString().split("T")[0])
      setFormAddress("")
      setFormCity("")
      setFormState("")
      setFormZip("")
      setFormCountry("")
      setFormWorkspaceEnabled(true)
      setFormWorkspaceRole("Employee")
      setFormStatus("Active")
      setFormNotes("")
    }
  }, [selectedEmployee, activeModal])

  const openDetail = (emp: Employee) => {
    setSelectedEmployee(emp)
    setPickHardware("")
    setPickSoftware("")
    setDetailOpen(true)
  }

  const handleOpenModal = (modal: typeof activeModal, emp: Employee | null = null) => {
    setSelectedEmployee(emp)
    setActiveModal(modal)
  }

  const handleCloseModal = () => {
    setActiveModal(null)
    if (!detailOpen) setSelectedEmployee(null)
  }

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formEmployeeId || !formName || !formEmail || !formPhone) {
      toast.error("Employee ID, name, email, and phone are required.")
      return
    }
    if (!formAddress || !formCity || !formState || !formZip || !formCountry) {
      toast.error("Complete shipping address is required.")
      return
    }

    const payload: Omit<Employee, "id" | "hardwareAssignments" | "softwareAssignments"> = {
      employeeId: formEmployeeId,
      name: formName,
      email: formEmail,
      phone: formPhone,
      jobTitle: formJobTitle,
      department: formDepartment,
      manager: formManager,
      startDate: formStartDate,
      address: formAddress,
      city: formCity,
      state: formState,
      zip: formZip,
      country: formCountry,
      workspaceEnabled: formWorkspaceEnabled,
      workspaceRole: formWorkspaceRole,
      status: formStatus,
      notes: formNotes,
    }

    if (activeModal === "add") {
      const newEmp: Employee = {
        id: Math.random().toString(36).slice(2, 9),
        ...payload,
        hardwareAssignments: [],
        softwareAssignments: [],
      }
      setEmployees([newEmp, ...employees])
      toast.success(`Added employee ${formName}.`)
    } else if (activeModal === "edit" && selectedEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === selectedEmployee.id
            ? { ...emp, ...payload }
            : emp
        )
      )
      toast.success(`Updated employee ${formName}.`)
    }

    handleCloseModal()
  }

  const handleDeleteConfirm = () => {
    if (!selectedEmployee) return
    setEmployees(employees.filter((e) => e.id !== selectedEmployee.id))
    toast.success(`Removed employee ${selectedEmployee.name}.`)
    setDetailOpen(false)
    handleCloseModal()
  }

  const assignHardware = () => {
    if (!selectedEmployee || !pickHardware) return
    const asset = availableHardware.find((a) => a.id === pickHardware)
    if (!asset) return
    if (selectedEmployee.hardwareAssignments.some((a) => a.tag === asset.tag)) {
      toast.error("Asset already assigned to this employee.")
      return
    }

    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              hardwareAssignments: [
                ...emp.hardwareAssignments,
                { id: asset.id, name: asset.name, tag: asset.tag },
              ],
            }
          : emp
      )
    )
    setPickHardware("")
    toast.success(`Assigned ${asset.tag} to ${selectedEmployee.name}.`)
  }

  const unassignHardware = (tag: string) => {
    if (!selectedEmployee) return
    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              hardwareAssignments: emp.hardwareAssignments.filter((a) => a.tag !== tag),
            }
          : emp
      )
    )
    toast.info(`Removed hardware assignment ${tag}.`)
  }

  const assignSoftware = () => {
    if (!selectedEmployee || !pickSoftware) return
    const lic = availableSoftware.find((a) => a.id === pickSoftware)
    if (!lic) return
    if (selectedEmployee.softwareAssignments.some((a) => a.tag === lic.tag)) {
      toast.error("License already assigned to this employee.")
      return
    }

    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              softwareAssignments: [
                ...emp.softwareAssignments,
                { id: lic.id, name: lic.name, tag: lic.tag, supplier: lic.supplier },
              ],
            }
          : emp
      )
    )
    setPickSoftware("")
    toast.success(`Assigned ${lic.name} to ${selectedEmployee.name}.`)
  }

  const unassignSoftware = (tag: string) => {
    if (!selectedEmployee) return
    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              softwareAssignments: emp.softwareAssignments.filter((a) => a.tag !== tag),
            }
          : emp
      )
    )
    toast.info(`Removed software assignment ${tag}.`)
  }

  const columns: ColumnDef<Employee>[] = [
    {
      key: "employee",
      header: "Employee",
      cell: (row) => (
        <button
          type="button"
          onClick={() => openDetail(row)}
          className="flex min-w-0 items-center gap-3 text-left"
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(row.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground">{row.name}</div>
            <div className="truncate text-xs text-muted-foreground">{row.email}</div>
          </div>
        </button>
      ),
      className: "w-[28%]",
    },
    {
      key: "employeeId",
      header: "Employee ID",
      cell: (row) => (
        <span className="font-mono text-sm text-muted-foreground">{row.employeeId}</span>
      ),
      className: "w-[12%]",
    },
    {
      key: "department",
      header: "Department",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.department || "—"}
        </span>
      ),
      className: "w-[12%]",
    },
    {
      key: "location",
      header: "Location",
      cell: (row) => (
        <span className="max-w-[180px] truncate text-sm text-muted-foreground">
          {formatLocation(row) || "—"}
        </span>
      ),
      className: "w-[18%]",
    },
    {
      key: "assigned",
      header: "Assigned",
      cell: (row) => (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CpuIcon className="size-3.5" />
            {row.hardwareAssignments.length}
          </span>
          <span className="inline-flex items-center gap-1">
            <KeyIcon className="size-3.5" />
            {row.softwareAssignments.length}
          </span>
        </div>
      ),
      className: "w-[10%]",
    },
    {
      key: "workspace",
      header: "Workspace",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.workspaceEnabled ? row.workspaceRole : "—"}
        </span>
      ),
      className: "w-[10%]",
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <EmployeeStatusBadge status={row.status} />,
      className: "w-[10%]",
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
            onClick={() => handleOpenModal("edit", row)}
            title="Edit employee"
          >
            <PencilIcon className="size-3.5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-lg text-destructive hover:bg-destructive/10"
            onClick={() => handleOpenModal("delete", row)}
            title="Delete employee"
          >
            <Trash2Icon className="size-3.5" />
          </Button>
        </div>
      ),
      className: "w-[10%]",
    },
  ]

  return (
    <DashboardShell
      title="Employees"
      actions={
        <Button onClick={() => handleOpenModal("add")}>
          <PlusIcon className="size-4" />
          Add employees
        </Button>
      }
    >
      <Toaster position="top-right" closeButton richColors />

      <PageHeader
        eyebrow="Directory"
        title="Employees"
        description="Manage employee records, shipping addresses, workspace access, and asset assignments."
        meta={`${employees.length} employee${employees.length !== 1 ? "s" : ""} · click an employee to manage their assignments`}
      />

      <DashboardCard className="mt-6 overflow-hidden">
        <FilterToolbar>
          <div className="relative min-w-[240px] flex-1">
            <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, employee ID, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg bg-background pl-9"
            />
          </div>

          <NativeSelect
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <NativeSelectOption value="All Departments">All Departments</NativeSelectOption>
            <NativeSelectOption value="Unassigned">Unassigned</NativeSelectOption>
            {departments.map((dept) => (
              <NativeSelectOption key={dept} value={dept}>
                {dept}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FilterToolbar>

        <div className="p-4">
          {filteredEmployees.length > 0 ? (
            <>
              <DataTable columns={columns} rows={filteredEmployees} className="ring-0" />
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing 1–{filteredEmployees.length} of {filteredEmployees.length}
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 p-12 text-center">
              <AlertTriangleIcon className="mb-2 size-8 text-muted-foreground/60" />
              <div className="text-sm font-medium text-foreground">No employees found</div>
              <div className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try adjusting your search or filters, or add a new employee.
              </div>
            </div>
          )}
        </div>
      </DashboardCard>

      {/* Employee detail sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selectedEmployee && (
            <>
              <SheetHeader className="border-b border-border pb-4">
                <SheetTitle className="text-xl font-semibold">{selectedEmployee.name}</SheetTitle>
                <p className="text-sm text-muted-foreground">{selectedEmployee.employeeId}</p>
              </SheetHeader>

              <div className="space-y-6 px-4 pb-6">
                <section className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground">Basic information</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd className="text-right font-medium">{selectedEmployee.email}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd className="text-right font-medium">{selectedEmployee.phone}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Job title</dt>
                      <dd className="text-right font-medium">{selectedEmployee.jobTitle || "—"}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Department</dt>
                      <dd className="text-right font-medium">{selectedEmployee.department || "—"}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Manager</dt>
                      <dd className="text-right font-medium">{selectedEmployee.manager}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Start date</dt>
                      <dd className="font-mono text-right text-sm">{selectedEmployee.startDate || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Location</dt>
                      <dd className="mt-1 text-sm leading-relaxed">{formatLocation(selectedEmployee)}</dd>
                    </div>
                  </dl>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CpuIcon className="size-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">
                      Hardware ({selectedEmployee.hardwareAssignments.length})
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <NativeSelect
                      value={pickHardware}
                      onChange={(e) => setPickHardware(e.target.value)}
                      className="flex-1"
                    >
                      <NativeSelectOption value="">Pick available asset...</NativeSelectOption>
                      {availableHardware
                        .filter(
                          (a) =>
                            !selectedEmployee.hardwareAssignments.some((h) => h.tag === a.tag)
                        )
                        .map((a) => (
                          <NativeSelectOption key={a.id} value={a.id}>
                            {a.name} · {a.tag}
                          </NativeSelectOption>
                        ))}
                    </NativeSelect>
                    <Button size="icon" onClick={assignHardware} disabled={!pickHardware}>
                      <UserPlusIcon className="size-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {selectedEmployee.hardwareAssignments.map((item) => (
                      <div
                        key={item.tag}
                        className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2"
                      >
                        <span className="text-sm">
                          {item.name} · <span className="font-mono text-xs">{item.tag}</span>
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="size-7"
                          onClick={() => unassignHardware(item.tag)}
                        >
                          <XIcon className="size-3.5" />
                        </Button>
                      </div>
                    ))}
                    {selectedEmployee.hardwareAssignments.length === 0 && (
                      <p className="text-sm text-muted-foreground">No hardware assigned.</p>
                    )}
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <KeyIcon className="size-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">
                      Software ({selectedEmployee.softwareAssignments.length})
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <NativeSelect
                      value={pickSoftware}
                      onChange={(e) => setPickSoftware(e.target.value)}
                      className="flex-1"
                    >
                      <NativeSelectOption value="">Pick license...</NativeSelectOption>
                      {availableSoftware
                        .filter(
                          (a) =>
                            !selectedEmployee.softwareAssignments.some((s) => s.tag === a.tag)
                        )
                        .map((a) => (
                          <NativeSelectOption key={a.id} value={a.id}>
                            {a.name} · {a.supplier}
                          </NativeSelectOption>
                        ))}
                    </NativeSelect>
                    <Button size="icon" onClick={assignSoftware} disabled={!pickSoftware}>
                      <UserPlusIcon className="size-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {selectedEmployee.softwareAssignments.map((item) => (
                      <div
                        key={item.tag}
                        className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2"
                      >
                        <span className="text-sm">
                          {item.name}
                          {item.supplier ? ` · ${item.supplier}` : ""}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="size-7"
                          onClick={() => unassignSoftware(item.tag)}
                        >
                          <XIcon className="size-3.5" />
                        </Button>
                      </div>
                    ))}
                    {selectedEmployee.softwareAssignments.length === 0 && (
                      <p className="text-sm text-muted-foreground">No software assigned.</p>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add / Edit employee */}
      <Dialog
        open={activeModal === "add" || activeModal === "edit"}
        onOpenChange={handleCloseModal}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl p-5 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {activeModal === "add" ? "Add employees" : "Edit employee"}
            </DialogTitle>
            <DialogDescription>
              Add or update employee details and workspace access.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEmployee} className="space-y-5 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="emp-id" className="text-xs font-medium text-muted-foreground">
                  Employee ID *
                </Label>
                <Input
                  id="emp-id"
                  placeholder="e.g. EMP-1024"
                  value={formEmployeeId}
                  onChange={(e) => setFormEmployeeId(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="emp-name" className="text-xs font-medium text-muted-foreground">
                  Full name *
                </Label>
                <Input
                  id="emp-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="emp-email" className="text-xs font-medium text-muted-foreground">
                  Email *
                </Label>
                <Input
                  id="emp-email"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="emp-phone" className="text-xs font-medium text-muted-foreground">
                  Phone *
                </Label>
                <Input
                  id="emp-phone"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="emp-title" className="text-xs font-medium text-muted-foreground">
                  Job title
                </Label>
                <Input
                  id="emp-title"
                  value={formJobTitle}
                  onChange={(e) => setFormJobTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="emp-dept" className="text-xs font-medium text-muted-foreground">
                  Department
                </Label>
                <NativeSelect
                  id="emp-dept"
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  className="w-full"
                >
                  <NativeSelectOption value="">Type or pick a department</NativeSelectOption>
                  {departments.map((dept) => (
                    <NativeSelectOption key={dept} value={dept}>
                      {dept}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="emp-manager" className="text-xs font-medium text-muted-foreground">
                  Manager
                </Label>
                <NativeSelect
                  id="emp-manager"
                  value={formManager}
                  onChange={(e) => setFormManager(e.target.value)}
                  className="w-full"
                >
                  {managers.map((m) => (
                    <NativeSelectOption key={m} value={m}>
                      {m}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="emp-start" className="text-xs font-medium text-muted-foreground">
                  Start date
                </Label>
                <Input
                  id="emp-start"
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
              <div>
                <p className="text-xs font-medium tracking-wide text-destructive">
                  Shipping address *
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Required so hardware can be shipped to the employee.
                </p>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="emp-address" className="text-xs font-medium text-muted-foreground">
                  Address *
                </Label>
                <Input
                  id="emp-address"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="emp-city" className="text-xs font-medium text-muted-foreground">
                    City *
                  </Label>
                  <Input
                    id="emp-city"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="emp-state" className="text-xs font-medium text-muted-foreground">
                    State / Region *
                  </Label>
                  <Input
                    id="emp-state"
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="emp-zip" className="text-xs font-medium text-muted-foreground">
                    ZIP / Postal code *
                  </Label>
                  <Input
                    id="emp-zip"
                    value={formZip}
                    onChange={(e) => setFormZip(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="emp-country" className="text-xs font-medium text-muted-foreground">
                    Country *
                  </Label>
                  <Input
                    id="emp-country"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-border p-4">
                <Checkbox
                  id="emp-workspace"
                  checked={formWorkspaceEnabled}
                  onCheckedChange={(v) => setFormWorkspaceEnabled(v === true)}
                />
                <div className="space-y-1">
                  <Label htmlFor="emp-workspace" className="text-sm font-medium">
                    Enable workspace sign-in
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    They sign in at the login page with Microsoft or Google. Work email must match.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="emp-role" className="text-xs font-medium text-muted-foreground">
                    Workspace role
                  </Label>
                  <NativeSelect
                    id="emp-role"
                    value={formWorkspaceRole}
                    onChange={(e) => setFormWorkspaceRole(e.target.value as WorkspaceRole)}
                    className="w-full"
                  >
                    <NativeSelectOption value="Employee">Employee</NativeSelectOption>
                    <NativeSelectOption value="Manager">Manager</NativeSelectOption>
                    <NativeSelectOption value="Admin">Admin</NativeSelectOption>
                  </NativeSelect>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="emp-status" className="text-xs font-medium text-muted-foreground">
                    Employment status
                  </Label>
                  <NativeSelect
                    id="emp-status"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as EmploymentStatus)}
                    className="w-full"
                  >
                    <NativeSelectOption value="Active">Active</NativeSelectOption>
                    <NativeSelectOption value="On Leave">On Leave</NativeSelectOption>
                    <NativeSelectOption value="Terminated">Terminated</NativeSelectOption>
                  </NativeSelect>
                </div>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="emp-notes" className="text-xs font-medium text-muted-foreground">
                Notes
              </Label>
              <Textarea
                id="emp-notes"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                {activeModal === "add" ? "Add employees" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={activeModal === "delete"} onOpenChange={handleCloseModal}>
        <DialogContent className="rounded-xl p-5 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangleIcon className="size-5" />
              Remove employee
            </DialogTitle>
            <DialogDescription>
              This will permanently remove <strong>{selectedEmployee?.name}</strong> from the
              directory. Assigned assets will need to be reassigned separately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>
              Delete employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
