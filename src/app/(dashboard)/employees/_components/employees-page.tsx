"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, Plus, Search, Users } from "lucide-react"
import { toast } from "sonner"

import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { EmployeeDetailSheet } from "./employee-detail-sheet"
import { EmployeesTable } from "./employees-table"
import { PageHeader } from "@/components/layout/PageHeader"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { Card, CardActions, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Toaster } from "@/components/ui/sonner"
import { Textarea } from "@/components/ui/textarea"
import {
  dialogFormClassName,
  dialogHeaderClassName,
  dialogScrollBodyClassName,
  dialogShellClassNameCompact,
  dialogShellClassNameWide,
} from "@/lib/dialog-layout"
import {
  AVAILABLE_HARDWARE,
  AVAILABLE_SOFTWARE,
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_MANAGERS,
  EMPLOYMENT_STATUSES,
  initialEmployees,
  WORKSPACE_ROLES,
  type Employee,
  type EmploymentStatus,
  type WorkspaceRole,
} from "@/lib/employees/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

type ActiveModal = "add" | "edit" | "delete" | null

const employeesCardClassName = "gap-0 py-0"
const employeesCardContentClassName = cn("p-(--card-spacing)", settingsControlClassName)

function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")

  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [formEmployeeId, setFormEmployeeId] = useState("")
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formJobTitle, setFormJobTitle] = useState("")
  const [formDepartment, setFormDepartment] = useState("")
  const [formManager, setFormManager] = useState<string>(EMPLOYEE_MANAGERS[0])
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
      setFormManager(EMPLOYEE_MANAGERS[0])
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

  function openDetail(emp: Employee) {
    setSelectedEmployee(emp)
    setDetailOpen(true)
  }

  function handleOpenModal(modal: ActiveModal, emp: Employee | null = null) {
    setSelectedEmployee(emp)
    setActiveModal(modal)
  }

  function handleCloseModal() {
    setActiveModal(null)
    if (!detailOpen) setSelectedEmployee(null)
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) handleCloseModal()
  }

  function handleSaveEmployee(e: React.FormEvent) {
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
        id: Math.random().toString(36).slice(2, 11),
        ...payload,
        hardwareAssignments: [],
        softwareAssignments: [],
      }
      setEmployees((prev) => [newEmp, ...prev])
      toast.success(`Added employee ${formName}.`)
    } else if (activeModal === "edit" && selectedEmployee) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === selectedEmployee.id ? { ...emp, ...payload } : emp))
      )
      toast.success(`Updated employee ${formName}.`)
    }

    handleCloseModal()
  }

  function handleDeleteConfirm() {
    if (!selectedEmployee) return
    setEmployees((prev) => prev.filter((e) => e.id !== selectedEmployee.id))
    toast.success(`Removed employee ${selectedEmployee.name}.`)
    setDetailOpen(false)
    handleCloseModal()
  }

  function assignHardware(assetId: string) {
    if (!selectedEmployee) return
    const asset = AVAILABLE_HARDWARE.find((a) => a.id === assetId)
    if (!asset) return
    if (selectedEmployee.hardwareAssignments.some((a) => a.tag === asset.tag)) {
      toast.error("Asset already assigned to this employee.")
      return
    }

    setEmployees((prev) =>
      prev.map((emp) =>
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
    toast.success(`Assigned ${asset.tag} to ${selectedEmployee.name}.`)
  }

  function unassignHardware(tag: string) {
    if (!selectedEmployee) return
    setEmployees((prev) =>
      prev.map((emp) =>
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

  function assignSoftware(licenseId: string) {
    if (!selectedEmployee) return
    const lic = AVAILABLE_SOFTWARE.find((a) => a.id === licenseId)
    if (!lic) return
    if (selectedEmployee.softwareAssignments.some((a) => a.tag === lic.tag)) {
      toast.error("License already assigned to this employee.")
      return
    }

    setEmployees((prev) =>
      prev.map((emp) =>
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
    toast.success(`Assigned ${lic.name} to ${selectedEmployee.name}.`)
  }

  function unassignSoftware(tag: string) {
    if (!selectedEmployee) return
    setEmployees((prev) =>
      prev.map((emp) =>
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

  const employeeCountLabel = employees.length === 1 ? "1 employee" : `${employees.length} employees`

  return (
    <>
      <Toaster position="top-right" closeButton richColors />

      <PageHeader
        icon={Users}
        eyebrow="Directory"
        title="Employees"
        description={`Manage employee records, shipping addresses, workspace access, and asset assignments. ${employeeCountLabel} · click an employee to manage their assignments.`}
        actions={
          <Button onClick={() => handleOpenModal("add")}>
            <Plus />
            Add Employee
          </Button>
        }
      >
        <Card className={employeesCardClassName}>
          <CardContent className={cn("flex flex-col gap-4", employeesCardContentClassName)}>
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
              <InputGroup className="min-w-[240px] flex-1">
                <InputGroupAddon>
                  <Search className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Search by name, email, employee ID, role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>

              <CustomSelect
                className="w-full lg:w-48"
                value={selectedDepartment}
                onChange={(value) =>
                  setSelectedDepartment(typeof value === "string" ? value : "All Departments")
                }
                options={[
                  { label: "All Departments", value: "All Departments" },
                  { label: "Unassigned", value: "Unassigned" },
                  ...EMPLOYEE_DEPARTMENTS.map((dept) => ({ label: dept, value: dept })),
                ]}
                showClear={false}
              />
            </div>

            <EmployeesTable
              rows={filteredEmployees}
              onOpenDetail={openDetail}
              onEdit={(emp) => handleOpenModal("edit", emp)}
              onDelete={(emp) => handleOpenModal("delete", emp)}
            />
          </CardContent>
        </Card>
      </PageHeader>

      <EmployeeDetailSheet
        employee={selectedEmployee}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onAssignHardware={assignHardware}
        onUnassignHardware={unassignHardware}
        onAssignSoftware={assignSoftware}
        onUnassignSoftware={unassignSoftware}
      />

      <Dialog open={activeModal === "add" || activeModal === "edit"} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={dialogShellClassNameWide}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>{activeModal === "add" ? "Add Employee" : "Edit Employee"}</DialogTitle>
            <DialogDescription>Add or update employee details and workspace access.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEmployee} className={dialogFormClassName}>
            <DialogBody className={cn(dialogScrollBodyClassName, settingsControlClassName)}>
              <FieldGroup>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="emp-id">Employee ID *</FieldLabel>
                    <Input
                      id="emp-id"
                      placeholder="e.g. EMP-1024"
                      value={formEmployeeId}
                      onChange={(e) => setFormEmployeeId(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="emp-name">Full name *</FieldLabel>
                    <Input
                      id="emp-name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="emp-email">Email *</FieldLabel>
                    <Input
                      id="emp-email"
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="emp-phone">Phone *</FieldLabel>
                    <Input
                      id="emp-phone"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="emp-title">Job title</FieldLabel>
                    <Input
                      id="emp-title"
                      value={formJobTitle}
                      onChange={(e) => setFormJobTitle(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="emp-dept">Department</FieldLabel>
                    <CustomSelect
                      id="emp-dept"
                      value={formDepartment}
                      onChange={(value) =>
                        setFormDepartment(typeof value === "string" ? value : formDepartment)
                      }
                      options={[
                        { label: "Type or pick a department", value: "" },
                        ...toSelectOptions(EMPLOYEE_DEPARTMENTS),
                      ]}
                      showClear={false}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="emp-manager">Manager</FieldLabel>
                    <CustomSelect
                      id="emp-manager"
                      value={formManager}
                      onChange={(value) => setFormManager(typeof value === "string" ? value : formManager)}
                      options={toSelectOptions(EMPLOYEE_MANAGERS)}
                      showClear={false}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="emp-start">Start date</FieldLabel>
                    <DatePicker
                      id="emp-start"
                      value={formStartDate}
                      onChange={setFormStartDate}
                      placeholder="Select date"
                    />
                  </Field>
                </div>

                <Card size="sm" className={employeesCardClassName}>
                  <CardContent className={cn("space-y-4", employeesCardContentClassName)}>
                    <div>
                      <p className={cn(typeScale.body.emphasis, "text-destructive")}>Shipping address *</p>
                      <FieldDescription>
                        Required so hardware can be shipped to the employee.
                      </FieldDescription>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="emp-address">Address *</FieldLabel>
                      <Input
                        id="emp-address"
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        required
                      />
                    </Field>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="emp-city">City *</FieldLabel>
                        <Input
                          id="emp-city"
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="emp-state">State / region *</FieldLabel>
                        <Input
                          id="emp-state"
                          value={formState}
                          onChange={(e) => setFormState(e.target.value)}
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="emp-zip">ZIP / postal code *</FieldLabel>
                        <Input
                          id="emp-zip"
                          value={formZip}
                          onChange={(e) => setFormZip(e.target.value)}
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="emp-country">Country *</FieldLabel>
                        <Input
                          id="emp-country"
                          value={formCountry}
                          onChange={(e) => setFormCountry(e.target.value)}
                          required
                        />
                      </Field>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-xl border border-border p-4">
                    <Checkbox
                      id="emp-workspace"
                      checked={formWorkspaceEnabled}
                      onCheckedChange={(v) => setFormWorkspaceEnabled(v === true)}
                    />
                    <div className="space-y-1">
                      <FieldLabel htmlFor="emp-workspace" className="text-sm font-medium">
                        Enable workspace sign-in
                      </FieldLabel>
                      <FieldDescription>
                        They sign in at the login page with Microsoft or Google. Work email must match.
                      </FieldDescription>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="emp-role">Workspace role</FieldLabel>
                      <CustomSelect
                        id="emp-role"
                        value={formWorkspaceRole}
                        onChange={(value) =>
                          setFormWorkspaceRole(
                            typeof value === "string" ? (value as WorkspaceRole) : formWorkspaceRole
                          )
                        }
                        options={toSelectOptions(WORKSPACE_ROLES)}
                        showClear={false}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="emp-status">Employment status</FieldLabel>
                      <CustomSelect
                        id="emp-status"
                        value={formStatus}
                        onChange={(value) =>
                          setFormStatus(typeof value === "string" ? (value as EmploymentStatus) : formStatus)
                        }
                        options={toSelectOptions(EMPLOYMENT_STATUSES)}
                        showClear={false}
                      />
                    </Field>
                  </div>
                </div>

                <Field>
                  <FieldLabel htmlFor="emp-notes">Notes</FieldLabel>
                  <Textarea
                    id="emp-notes"
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
              <Button type="submit">{activeModal === "add" ? "Add Employee" : "Save Changes"}</Button>
            </CardActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "delete"} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={dialogShellClassNameCompact}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Remove Employee
            </DialogTitle>
            <DialogDescription>
              This will permanently remove{" "}
              <span className={typeScale.body.emphasis}>{selectedEmployee?.name}</span> from the directory.
              Assigned assets will need to be reassigned separately.
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee ? (
            <>
              <DialogBody>
                <div className="space-y-1.5 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <p className={typeScale.body.muted}>
                    <span className={typeScale.body.emphasis}>Name:</span> {selectedEmployee.name}
                  </p>
                  <p className={typeScale.body.muted}>
                    <span className={typeScale.body.emphasis}>Employee ID:</span>{" "}
                    {selectedEmployee.employeeId}
                  </p>
                  <p className={typeScale.body.muted}>
                    <span className={typeScale.body.emphasis}>Email:</span> {selectedEmployee.email}
                  </p>
                  <p className={typeScale.body.muted}>
                    <span className={typeScale.body.emphasis}>Hardware:</span>{" "}
                    {selectedEmployee.hardwareAssignments.length} assigned
                  </p>
                  <p className={typeScale.body.muted}>
                    <span className={typeScale.body.emphasis}>Software:</span>{" "}
                    {selectedEmployee.softwareAssignments.length} assigned
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
                  Delete Employee
                </Button>
              </CardActions>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

export { EmployeesPage }
