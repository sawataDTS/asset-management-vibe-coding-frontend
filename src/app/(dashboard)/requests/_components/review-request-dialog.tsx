"use client"

import * as React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { ModalContainer } from "@/components/ui/modal-container"
import { Textarea } from "@/components/ui/textarea"
import { REQUEST_TYPE_LABELS } from "@/lib/requests/constants"
import type { EmployeeRequest, RequestStatus } from "@/lib/requests/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"
import {
  RequestPriorityBadge,
  RequestStatusBadge,
} from "@/app/(dashboard)/requests/_components/request-status-badge"

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null
  return (
    <div className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <span className={typeScale.caption.meta}>{label}</span>
      <span className={typeScale.body.default}>{value}</span>
    </div>
  )
}

export interface ReviewRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: EmployeeRequest | null
  canManage: boolean
  onUpdateStatus: (requestId: string, status: RequestStatus, reviewNotes?: string) => void
}

function ReviewRequestDialog({
  open,
  onOpenChange,
  request,
  canManage,
  onUpdateStatus,
}: ReviewRequestDialogProps) {
  const [reviewNotes, setReviewNotes] = useState("")

  React.useEffect(() => {
    if (open) setReviewNotes("")
  }, [open, request?.id])

  if (!request) return null

  const isPending = request.status === "pending"
  const isApproved = request.status === "approved"

  function handleAction(status: RequestStatus) {
    onUpdateStatus(request!.id, status, reviewNotes.trim() || undefined)
    onOpenChange(false)
  }

  return (
    <ModalContainer
      open={open}
      onOpenChange={onOpenChange}
      size="wide"
      title={request.title}
      description={`${REQUEST_TYPE_LABELS[request.type]} submitted by ${request.employeeName}`}
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
                onClick={() => handleAction("rejected")}
              >
                Reject
              </Button>
              <Button type="button" onClick={() => handleAction("approved")}>
                Approve
              </Button>
            </>
          ) : null}
          {canManage && isApproved ? (
            <Button type="button" onClick={() => handleAction("closed")}>
              Mark closed
            </Button>
          ) : null}
          {!canManage && isPending ? (
            <span className={cn("text-sm", typeScale.body.muted)}>Awaiting review from IT.</span>
          ) : null}
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <RequestStatusBadge status={request.status} />
        <RequestPriorityBadge priority={request.priority} />
      </div>

      <div className="mt-6 space-y-4">
        <DetailRow label="Employee" value={`${request.employeeName} (${request.employeeEmail})`} />
        <DetailRow label="Submitted" value={request.submittedAt} />
        <DetailRow label="Needed by" value={request.neededBy} />
        <DetailRow label="Category" value={request.category} />
        <DetailRow label="Item" value={request.itemName} />
        <DetailRow label="Quantity" value={request.quantity ? String(request.quantity) : undefined} />
        <DetailRow label="Seats" value={request.seats ? String(request.seats) : undefined} />
        <DetailRow label="Asset tag" value={request.assetTag} />
        <DetailRow label="Replacement reason" value={request.replacementReason} />
        <DetailRow label="Return reason" value={request.returnReason} />
        <DetailRow label="Description" value={request.description} />
        <DetailRow label="Reviewed by" value={request.reviewedBy} />
        <DetailRow label="Reviewed on" value={request.reviewedAt} />
        <DetailRow label="Review notes" value={request.reviewNotes} />
      </div>

      {canManage && (isPending || isApproved) ? (
        <FieldGroup className="mt-6">
          <Field>
            <FieldLabel htmlFor="review-notes">Review notes</FieldLabel>
            <Textarea
              id="review-notes"
              rows={3}
              placeholder="Optional notes for the requester..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
            />
          </Field>
        </FieldGroup>
      ) : null}
    </ModalContainer>
  )
}

export { ReviewRequestDialog }
