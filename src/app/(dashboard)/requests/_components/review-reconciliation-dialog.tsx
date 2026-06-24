"use client"

import * as React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { ModalContainer } from "@/components/ui/modal-container"
import { Textarea } from "@/components/ui/textarea"
import { RECONCILIATION_ISSUE_LABELS } from "@/lib/requests/constants"
import type { HardwareReconciliation, ReconciliationStatus } from "@/lib/requests/data"
import { typeScale } from "@/lib/typography"
import { ReconciliationStatusBadge } from "@/app/(dashboard)/requests/_components/request-status-badge"

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null
  return (
    <div className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <span className={typeScale.caption.meta}>{label}</span>
      <span className={typeScale.body.default}>{value}</span>
    </div>
  )
}

export interface ReviewReconciliationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: HardwareReconciliation | null
  canManage: boolean
  onUpdateStatus: (itemId: string, status: ReconciliationStatus, reviewNotes?: string) => void
}

function ReviewReconciliationDialog({
  open,
  onOpenChange,
  item,
  canManage,
  onUpdateStatus,
}: ReviewReconciliationDialogProps) {
  const [reviewNotes, setReviewNotes] = useState("")

  React.useEffect(() => {
    if (open) setReviewNotes("")
  }, [open, item?.id])

  if (!item) return null

  const isPending = item.status === "pending"

  function handleAction(status: ReconciliationStatus) {
    onUpdateStatus(item!.id, status, reviewNotes.trim() || undefined)
    onOpenChange(false)
  }

  return (
    <ModalContainer
      open={open}
      onOpenChange={onOpenChange}
      size="wide"
      title={item.assetName}
      description={`Hardware reconciliation flagged by ${item.employeeName}`}
      footer={
        <>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          {canManage && isPending ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleAction("dismissed")}
              >
                Dismiss
              </Button>
              <Button type="button" onClick={() => handleAction("reconciled")}>
                Mark reconciled
              </Button>
            </>
          ) : null}
        </>
      }
    >
      <ReconciliationStatusBadge status={item.status} />

      <div className="mt-6 space-y-4">
        <DetailRow label="Asset tag" value={item.assetTag} />
        <DetailRow label="Employee" value={`${item.employeeName} (${item.employeeEmail})`} />
        <DetailRow label="Issue" value={RECONCILIATION_ISSUE_LABELS[item.issueType]} />
        <DetailRow label="Flagged" value={item.flaggedAt} />
        <DetailRow label="Notes" value={item.notes} />
        <DetailRow label="Reviewed by" value={item.reviewedBy} />
        <DetailRow label="Reviewed on" value={item.reviewedAt} />
        <DetailRow label="Review notes" value={item.reviewNotes} />
      </div>

      {canManage && isPending ? (
        <FieldGroup className="mt-6">
          <Field>
            <FieldLabel htmlFor="recon-review-notes">Review notes</FieldLabel>
            <Textarea
              id="recon-review-notes"
              rows={3}
              placeholder="Optional notes for the employee..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
            />
          </Field>
        </FieldGroup>
      ) : null}
    </ModalContainer>
  )
}

export { ReviewReconciliationDialog }
