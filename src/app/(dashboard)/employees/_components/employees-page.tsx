"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"

import { CustomSelect } from "@/components/custom/CustomSelect"
import AddEditEmployeeDialog from "./add-edit-employee-dialog"
import DeleteEmployeeDialog from "./delete-employee-dialog"
import { EmployeeDetailSheet } from "./employee-detail-sheet"
import { EmployeesTable } from "./employees-table"
import { PageHeader } from "@/components/layout/PageHeader"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { CardContainer } from "@/components/ui/card-container"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
  AVAILABLE_HARDWARE,
  AVAILABLE_SOFTWARE,
  EMPLOYEE_DEPARTMENTS,
  initialEmployees,
  type Employee,
} from "@/lib/employees/data"
import { cn } from "@/lib/utils"

type ActiveModal = "add" | "edit" | "delete" | null

const employeesCardContentClassName = settingsControlClassName

function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")

  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

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

  function handleSaveEmployee(
    payload: Omit<Employee, "id" | "hardwareAssignments" | "softwareAssignments">,
    mode: "add" | "edit"
  ) {
    if (mode === "add") {
      const newEmp: Employee = {
        id: Math.random().toString(36).slice(2, 11),
        ...payload,
        hardwareAssignments: [],
        softwareAssignments: [],
      }
      setEmployees((prev) => [newEmp, ...prev])
      toast.success(`Added employee ${payload.name}.`)
    } else if (mode === "edit" && selectedEmployee) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === selectedEmployee.id ? { ...emp, ...payload } : emp))
      )
      toast.success(`Updated employee ${payload.name}.`)
    }
  }

  function handleDeleteConfirm(employee: Employee) {
    setEmployees((prev) => prev.filter((e) => e.id !== employee.id))
    toast.success(`Removed employee ${employee.name}.`)
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
      <PageHeader
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
        <CardContainer
          formControls
          contentClassName={cn("flex flex-col gap-4", employeesCardContentClassName)}
        >
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
        </CardContainer>
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

      {(activeModal === "add" || activeModal === "edit") && (
        <AddEditEmployeeDialog
          open
          mode={activeModal}
          onOpenChange={handleDialogOpenChange}
          selectedEmployee={selectedEmployee}
          onSave={handleSaveEmployee}
        />
      )}

      {activeModal === "delete" && selectedEmployee && (
        <DeleteEmployeeDialog
          open
          onOpenChange={handleDialogOpenChange}
          employee={selectedEmployee}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  )
}

export { EmployeesPage }
