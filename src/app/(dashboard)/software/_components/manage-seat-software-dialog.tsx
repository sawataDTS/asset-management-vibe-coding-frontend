"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, UserPlus, X } from "lucide-react"
import { toast } from "sonner"
import { CustomSelect } from "@/components/custom/CustomSelect"
import { SeatUtilization } from "./seat-utilization"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CardActions } from "@/components/ui/card"
import { CardContainer } from "@/components/ui/card-container"
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
import { dialogHeaderClassName, dialogScrollBodyClassName, dialogShellClassName } from "@/lib/dialog-layout"
import { SOFTWARE_EMPLOYEES } from "@/lib/software/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

interface IProps {
  open: any
  onOpenChange: any
  selectedLicense: any
}

export default function ManageSeatSoftwareDialog({ open, onOpenChange, selectedLicense }: IProps) {
  const [newAssignee, setNewAssignee] = useState<string>(SOFTWARE_EMPLOYEES[0])
  const softwareCardContentClassName = settingsControlClassName

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  function handleAllocateSeat() {
    if (!selectedLicense || !newAssignee) return

    if (selectedLicense.assignedSeats >= selectedLicense.totalSeats) {
      toast.error("Allocation failed. Seat capacity limit reached.")
      return
    }

    const todayStr = new Date().toISOString().split("T")[0]
    // api call
    toast.success(`License seat allocated to ${newAssignee}.`)
  }

  function handleDeallocateSeat(empName: string) {
    if (!selectedLicense) return

    const todayStr = new Date().toISOString().split("T")[0]

    // api call
    toast.info(`Seat revoked from ${empName}. Seat is now available.`)
  }

  const eligibleEmployees = useMemo(() => {
    if (!selectedLicense) return []
    return SOFTWARE_EMPLOYEES.filter((emp) => !selectedLicense.assignees.includes(emp))
  }, [selectedLicense])

  useEffect(() => {
    if (eligibleEmployees.length > 0) {
      setNewAssignee(eligibleEmployees[0])
    }
  }, [eligibleEmployees])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogShellClassName}>
        <DialogHeader className={dialogHeaderClassName}>
          <DialogTitle>Manage License Seats</DialogTitle>
          <DialogDescription>
            Add or revoke seats for <span className={typeScale.body.emphasis}>{selectedLicense?.name}</span>.
          </DialogDescription>
        </DialogHeader>

        {selectedLicense ? (
          <>
            <DialogBody className={dialogScrollBodyClassName}>
              <div className="space-y-5">
                <CardContainer size="sm" contentClassName={softwareCardContentClassName}>
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
                </CardContainer>

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
                      All {selectedLicense.totalSeats} seats are filled. Revoke seats or edit the subscription
                      to expand seat size.
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <p className={cn("mb-2", typeScale.caption.overline)}>
                    Current seat holders ({selectedLicense.assignees.length})
                  </p>
                  {selectedLicense.assignees.length > 0 ? (
                    <div className="space-y-2">
                      {selectedLicense.assignees.map((name, idx) => (
                        <div
                          key={idx}
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
  )
}
