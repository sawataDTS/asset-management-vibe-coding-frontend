"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { ModalContainer } from "@/components/ui/modal-container"
import { dialogBodyBeforeActionsClassName } from "@/lib/dialog-layout"
import { type Supplier } from "@/lib/suppliers/data"
import { typeScale } from "@/lib/typography"

export interface DeleteSupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSupplier: Supplier | null
  onClose: () => void
}

function DeleteSupplierDialog({
  open,
  onOpenChange,
  selectedSupplier,
  onClose,
}: DeleteSupplierDialogProps) {
  function handleDeleteConfirm() {
    if (!selectedSupplier) return
    // call api here
    toast.success(`Removed supplier ${selectedSupplier.name}.`)
    onClose()
  }

  if (!selectedSupplier) return null

  return (
    <ModalContainer
      open={open}
      onOpenChange={onOpenChange}
      title="Remove supplier?"
      bodyClassName={dialogBodyBeforeActionsClassName}
      footer={
        <>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>
            Remove
          </Button>
        </>
      }
    >
      <p className={typeScale.body.default}>
        <span className={typeScale.body.emphasis}>&ldquo;{selectedSupplier.name}&rdquo;</span> will be
        unlinked from any hardware or software it supplies.
      </p>
    </ModalContainer>
  )
}

export { DeleteSupplierDialog }
export default DeleteSupplierDialog
