"use client"

import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"
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
import {
  dialogBodyBeforeActionsClassName,
  dialogHeaderClassName,
  dialogShellClassNameCompact,
} from "@/lib/dialog-layout"
import { typeScale } from "@/lib/typography"

interface IProps {
  open: any
  onOpenChange: any
  selectedLicense: any
  handleCloseModal: any
}

export default function DeleteSoftwareDialog({
  open,
  onOpenChange,
  selectedLicense,
  handleCloseModal,
}: IProps) {
  function handleDeleteConfirm() {
    if (!selectedLicense) return
    // api call
    toast.success(`Removed subscription registry for ${selectedLicense.name}.`)
    handleCloseModal()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogShellClassNameCompact}>
        <DialogHeader className={dialogHeaderClassName}>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            Retire & Delete Subscription
          </DialogTitle>
        </DialogHeader>

        {selectedLicense ? (
          <>
            <DialogBody className={dialogBodyBeforeActionsClassName}>
              <DialogDescription>
                Are you sure you want to permanently delete this software license registry? All seat
                allocations will be terminated.
              </DialogDescription>
              <div className="mt-4 space-y-1.5 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <p className={typeScale.body.muted}>
                  <span className={typeScale.body.emphasis}>Software:</span> {selectedLicense.name}
                </p>
                <p className={typeScale.body.muted}>
                  <span className={typeScale.body.emphasis}>Category:</span> {selectedLicense.category}
                </p>
                <p className={typeScale.body.muted}>
                  <span className={typeScale.body.emphasis}>License key:</span> {selectedLicense.key}
                </p>
                <p className={typeScale.body.muted}>
                  <span className={typeScale.body.emphasis}>Seat usage:</span> {selectedLicense.assignedSeats}{" "}
                  / {selectedLicense.totalSeats}
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
                Permanently Delete
              </Button>
            </CardActions>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
