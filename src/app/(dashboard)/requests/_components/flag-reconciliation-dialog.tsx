"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"

import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { ModalContainer } from "@/components/ui/modal-container"
import { Textarea } from "@/components/ui/textarea"
import type { WorkspaceUser } from "@/lib/auth/mock-user"
import { initialHardwareAssets } from "@/lib/hardware/data"
import {
  RECONCILIATION_ISSUE_LABELS,
  RECONCILIATION_ISSUE_TYPES,
  type ReconciliationIssueType,
} from "@/lib/requests/constants"
import type { HardwareReconciliation } from "@/lib/requests/data"

export interface FlagReconciliationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: WorkspaceUser
  onSubmit: (item: HardwareReconciliation) => void
}

function FlagReconciliationDialog({ open, onOpenChange, user, onSubmit }: FlagReconciliationDialogProps) {
  const today = new Date().toISOString().split("T")[0]
  const [selectedAssetId, setSelectedAssetId] = useState("")
  const [issueType, setIssueType] = useState<ReconciliationIssueType>("wrong-device")
  const [notes, setNotes] = useState("")

  const assignedAssets = useMemo(
    () =>
      initialHardwareAssets.filter((asset) => asset.status === "Assigned" && asset.assignee === user.name),
    [user.name]
  )

  const assetOptions = useMemo(
    () =>
      assignedAssets.map((asset) => ({
        label: `${asset.name} (${asset.tag})`,
        value: asset.id,
      })),
    [assignedAssets]
  )

  useEffect(() => {
    if (!open) return
    setSelectedAssetId(assignedAssets[0]?.id ?? "")
    setIssueType("wrong-device")
    setNotes("")
  }, [open, assignedAssets])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const asset = assignedAssets.find((entry) => entry.id === selectedAssetId)
    if (!asset) return

    onSubmit({
      id: `rec-${Date.now()}`,
      assetId: asset.id,
      assetName: asset.name,
      assetTag: asset.tag,
      employeeName: user.name,
      employeeEmail: user.email,
      issueType,
      notes,
      status: "pending",
      flaggedAt: today,
    })
    onOpenChange(false)
  }

  return (
    <ModalContainer
      open={open}
      onOpenChange={onOpenChange}
      title="Flag hardware issue"
      description="Report a mismatch between your assigned hardware and what you actually have."
      formControls
      onSubmit={handleSubmit}
      footer={
        <>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={assignedAssets.length === 0}>
            Submit flag
          </Button>
        </>
      }
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="recon-asset">Assigned asset</FieldLabel>
          {assignedAssets.length > 0 ? (
            <CustomSelect
              id="recon-asset"
              value={selectedAssetId}
              onChange={(value) => setSelectedAssetId(typeof value === "string" ? value : selectedAssetId)}
              options={assetOptions}
              showClear={false}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              No assigned hardware found for your account. Contact IT if this is incorrect.
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="recon-issue">Issue type</FieldLabel>
          <CustomSelect
            id="recon-issue"
            value={issueType}
            onChange={(value) =>
              setIssueType((typeof value === "string" ? value : issueType) as ReconciliationIssueType)
            }
            options={RECONCILIATION_ISSUE_TYPES.map((type) => ({
              label: RECONCILIATION_ISSUE_LABELS[type],
              value: type,
            }))}
            showClear={false}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="recon-notes">Notes</FieldLabel>
          <Textarea
            id="recon-notes"
            rows={3}
            placeholder="Describe the issue in detail..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
        </Field>
      </FieldGroup>
    </ModalContainer>
  )
}

export { FlagReconciliationDialog }
