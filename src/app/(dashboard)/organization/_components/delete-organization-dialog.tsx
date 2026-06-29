"use client"

import * as React from "react"
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
  handleCloseModal: any
  selectedOrganization: any
}

export default function DeleteOrganizationDialog({
  open,
  onOpenChange,
  selectedOrganization,
  handleCloseModal,
}: IProps) {
  function handleDeleteConfirm() {
    if (!selectedOrganization) return
    // api call
    toast.success(`Deleted organization ${selectedOrganization.name}.`)
    handleCloseModal()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogShellClassNameCompact}>
        <DialogHeader className={dialogHeaderClassName}>
          <DialogTitle>Delete organization?</DialogTitle>
        </DialogHeader>

        {selectedOrganization ? (
          <>
            <DialogBody className={dialogBodyBeforeActionsClassName}>
              <DialogDescription>
                <span className={typeScale.body.emphasis}>&ldquo;{selectedOrganization.name}&rdquo;</span> and
                all associated workspace data will be permanently removed.
              </DialogDescription>
            </DialogBody>
            <CardActions>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </CardActions>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
