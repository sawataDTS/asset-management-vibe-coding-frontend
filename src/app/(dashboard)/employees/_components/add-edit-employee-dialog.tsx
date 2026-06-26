"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"

import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { CardContainer } from "@/components/ui/card-container"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { DialogClose } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ModalContainer } from "@/components/ui/modal-container"
import { Textarea } from "@/components/ui/textarea"
import {
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_MANAGERS,
  EMPLOYMENT_STATUSES,
  WORKSPACE_ROLES,
  type Employee,
  type EmploymentStatus,
  type WorkspaceRole,
} from "@/lib/employees/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

export type EmployeeFormPayload = Omit<Employee, "id" | "hardwareAssignments" | "softwareAssignments">

export interface AddEditEmployeeDialogProps {
  open: boolean
  mode: "add" | "edit"
  onOpenChange: (open: boolean) => void
  selectedEmployee: Employee | null
  onSave: (payload: EmployeeFormPayload, mode: "add" | "edit") => void
}

function AddEditEmployeeDialog({
  open,
  mode,
  onOpenChange,
  selectedEmployee,
  onSave,
}: AddEditEmployeeDialogProps) {
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

  useEffect(() => {
    if (selectedEmployee && mode === "edit") {
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
    } else if (mode === "add") {
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
  }, [selectedEmployee, mode])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formEmployeeId || !formName || !formEmail || !formPhone) {
      toast.error("Employee ID, name, email, and phone are required.")
      return
    }
    if (!formAddress || !formCity || !formState || !formZip || !formCountry) {
      toast.error("Complete shipping address is required.")
      return
    }

    onSave(
      {
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
      },
      mode
    )
    onOpenChange(false)
  }

  return (
    <ModalContainer
      open={open}
      onOpenChange={onOpenChange}
      size="wide"
      title={mode === "add" ? "Add Employee" : "Edit Employee"}
      description="Add or update employee details and workspace access."
      formControls
      onSubmit={handleSubmit}
      footer={
        <>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">{mode === "add" ? "Add Employee" : "Save Changes"}</Button>
        </>
      }
    >
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

        <CardContainer size="sm" contentClassName={cn("space-y-4", settingsControlClassName)}>
          <div>
            <p className={cn(typeScale.body.emphasis, "text-destructive")}>Shipping address *</p>
            <FieldDescription>Required so hardware can be shipped to the employee.</FieldDescription>
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
        </CardContainer>

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
    </ModalContainer>
  )
}

export { AddEditEmployeeDialog }
export default AddEditEmployeeDialog
