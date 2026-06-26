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
  handleCloseModal: any
  selectedAsset: any
}

export default function DeleteHardwareDialog({
  open,
  onOpenChange,
  handleCloseModal,
  selectedAsset,
}: IProps) {
  function handleDeleteConfirm() {
    if (!selectedAsset) return
    // api call
    toast.success(`Removed asset ${selectedAsset.tag} from database.`)
    handleCloseModal()
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogShellClassNameCompact}>
        <DialogHeader className={dialogHeaderClassName}>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            Retire & Delete Asset
          </DialogTitle>
        </DialogHeader>

        {selectedAsset ? (
          <>
            <DialogBody className={dialogBodyBeforeActionsClassName}>
              <DialogDescription>
                Are you sure you want to delete this hardware asset? This action will permanently remove it
                from tracking logs.
              </DialogDescription>
              <div className="mt-4 space-y-1.5 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <p className={typeScale.body.muted}>
                  <span className={typeScale.body.emphasis}>Asset name:</span> {selectedAsset.name}
                </p>
                <p className={typeScale.body.muted}>
                  <span className={typeScale.body.emphasis}>Asset tag:</span> {selectedAsset.tag}
                </p>
                <p className={typeScale.body.muted}>
                  <span className={typeScale.body.emphasis}>Serial no:</span> {selectedAsset.serial}
                </p>
                <p className={typeScale.body.muted}>
                  <span className={typeScale.body.emphasis}>Status:</span> {selectedAsset.status}
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
