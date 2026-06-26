"use client"

import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { ModalContainer } from "@/components/ui/modal-container"
import { dialogBodyBeforeActionsClassName } from "@/lib/dialog-layout"
import { type Employee } from "@/lib/employees/data"
import { typeScale } from "@/lib/typography"

export interface DeleteEmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee | null
  onConfirm: (employee: Employee) => void
}

function DeleteEmployeeDialog({ open, onOpenChange, employee, onConfirm }: DeleteEmployeeDialogProps) {
  if (!employee) return null

  return (
    <ModalContainer
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-5" />
          Remove Employee
        </span>
      }
      bodyClassName={dialogBodyBeforeActionsClassName}
      footer={
        <>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={() => onConfirm(employee)}>
            Delete Employee
          </Button>
        </>
      }
    >
      <p className={typeScale.body.default}>
        This will permanently remove{" "}
        <span className={typeScale.body.emphasis}>{employee.name}</span> from the directory. Assigned
        assets will need to be reassigned separately.
      </p>
      <div className="mt-4 space-y-1.5 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <p className={typeScale.body.muted}>
          <span className={typeScale.body.emphasis}>Name:</span> {employee.name}
        </p>
        <p className={typeScale.body.muted}>
          <span className={typeScale.body.emphasis}>Employee ID:</span> {employee.employeeId}
        </p>
        <p className={typeScale.body.muted}>
          <span className={typeScale.body.emphasis}>Email:</span> {employee.email}
        </p>
        <p className={typeScale.body.muted}>
          <span className={typeScale.body.emphasis}>Hardware:</span> {employee.hardwareAssignments.length}{" "}
          assigned
        </p>
        <p className={typeScale.body.muted}>
          <span className={typeScale.body.emphasis}>Software:</span> {employee.softwareAssignments.length}{" "}
          assigned
        </p>
      </div>
    </ModalContainer>
  )
}

export { DeleteEmployeeDialog }
export default DeleteEmployeeDialog
