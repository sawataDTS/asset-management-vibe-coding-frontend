"use client"

import * as React from "react"
import { useEffect } from "react"
import { toast } from "sonner"
import { CustomSelect } from "@/components/custom/CustomSelect"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CardActions } from "@/components/ui/card"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  dialogFormClassName,
  dialogHeaderClassName,
  dialogScrollBodyClassName,
  dialogShellClassName,
} from "@/lib/dialog-layout"
import { HARDWARE_EMPLOYEES } from "@/lib/hardware/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

interface IProps {
  open: any
  activeModal: any
  onOpenChange: any
  handleCloseModal: any
  selectedAsset: any
  selectedAssignee: any
  setSelectedAssignee: any
}

export default function AssignHardwareDialog({
  open,
  activeModal,
  onOpenChange,
  handleCloseModal,
  selectedAsset,
  selectedAssignee,
  setSelectedAssignee,
}: IProps) {
  function getInitials(name: string) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  function handleAssignSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedAsset) return

    const todayStr = new Date().toISOString().split("T")[0]
    const wasAssigned = selectedAsset.status === "Assigned"

    // api call

    toast.success(
      wasAssigned
        ? `Device ${selectedAsset.tag} checked back into inventory.`
        : `Device ${selectedAsset.tag} assigned to ${selectedAssignee} successfully.`
    )
    handleCloseModal()
  }

  useEffect(() => {
    if (selectedAsset) {
      if (activeModal === "assign") {
        setSelectedAssignee(selectedAsset.assignee || HARDWARE_EMPLOYEES[0])
      }
    }
  }, [selectedAsset, activeModal])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogShellClassName}>
        <DialogHeader className={dialogHeaderClassName}>
          <DialogTitle>
            {selectedAsset?.status === "Assigned" ? "Deallocate Hardware Asset" : "Assign Asset"}
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
                      <AvatarFallback className="bg-accent text-primary">
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
              <Button type="submit" variant={selectedAsset.status === "Assigned" ? "destructive" : "default"}>
                {selectedAsset.status === "Assigned" ? "Unassign Device" : "Assign Asset"}
              </Button>
            </CardActions>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
