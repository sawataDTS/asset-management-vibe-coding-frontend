"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CustomSelect } from "@/components/custom/CustomSelect"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  dialogFormClassName,
  dialogHeaderClassName,
  dialogScrollBodyClassName,
  dialogShellClassName,
} from "@/lib/dialog-layout"
import { REPAIR_REASONS, type AssetStatus } from "@/lib/hardware/data"

import { cn } from "@/lib/utils"

interface IProps {
  open: any
  activeModal: any
  onOpenChange: any
  handleCloseModal: any
  selectedAsset: any
}

export default function RepairHardwareDialog({
  open,
  activeModal,
  onOpenChange,
  handleCloseModal,
  selectedAsset,
}: IProps) {
  const [repairNotes, setRepairNotes] = useState("")
  const [repairReason, setRepairReason] = useState<string>(REPAIR_REASONS[0])

  function handleRepairSubmit(
    e: React.FormEvent | React.MouseEvent,
    targetAction: "repair" | "fixed" | "retire"
  ) {
    e.preventDefault()
    if (!selectedAsset) return

    const todayStr = new Date().toISOString().split("T")[0]

    // api call

    toast.success(
      targetAction === "repair"
        ? `Asset ${selectedAsset.tag} marked as in repair.`
        : targetAction === "fixed"
          ? `Asset ${selectedAsset.tag} marked as fixed and returned to stock.`
          : `Asset ${selectedAsset.tag} has been retired.`
    )
    handleCloseModal()
  }

  useEffect(() => {
    if (selectedAsset) {
      setRepairNotes("")
      setRepairReason(REPAIR_REASONS[0])
    }
  }, [selectedAsset, activeModal])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogShellClassName}>
        <DialogHeader className={dialogHeaderClassName}>
          <DialogTitle>
            {selectedAsset?.status === "Repair"
              ? "Repair Diagnostic Completion"
              : "Initiate Repair Lifecycle"}
          </DialogTitle>
          <DialogDescription>
            {selectedAsset?.status === "Repair"
              ? `Diagnose or close repair service backlog for ${selectedAsset.tag}.`
              : `Send device ${selectedAsset?.tag} to specialized repairs.`}
          </DialogDescription>
        </DialogHeader>

        {selectedAsset ? (
          selectedAsset.status === "Repair" ? (
            <>
              <DialogBody className={cn(dialogScrollBodyClassName, settingsControlClassName)}>
                <Field>
                  <FieldLabel htmlFor="repair-diag-notes">Closing diagnostic notes</FieldLabel>
                  <Input
                    id="repair-diag-notes"
                    placeholder="e.g. Replaced display panel. Tested successfully."
                    value={repairNotes}
                    onChange={(e) => setRepairNotes(e.target.value)}
                  />
                </Field>
              </DialogBody>
              <CardActions className="flex-wrap gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={(e) => handleRepairSubmit(e, "retire")}
                >
                  Decommission / Retire
                </Button>
                <Button type="button" onClick={(e) => handleRepairSubmit(e, "fixed")}>
                  Mark as Fixed
                </Button>
              </CardActions>
            </>
          ) : (
            <form onSubmit={(e) => handleRepairSubmit(e, "repair")} className={dialogFormClassName}>
              <DialogBody className={cn(dialogScrollBodyClassName, settingsControlClassName)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="repair-reason">Reason for service</FieldLabel>
                    <CustomSelect
                      id="repair-reason"
                      value={repairReason}
                      onChange={(value) => setRepairReason(typeof value === "string" ? value : repairReason)}
                      options={REPAIR_REASONS.map((reason) => ({
                        label: reason.split("/")[0],
                        value: reason,
                      }))}
                      showClear={false}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="repair-incident-notes">Diagnostic notes</FieldLabel>
                    <Input
                      id="repair-incident-notes"
                      placeholder="Describe symptoms, device drops, or issues"
                      value={repairNotes}
                      onChange={(e) => setRepairNotes(e.target.value)}
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
                <Button type="submit">Initiate Repairs</Button>
              </CardActions>
            </form>
          )
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
