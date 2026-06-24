"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"

import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ModalContainer } from "@/components/ui/modal-container"
import { DatePicker } from "@/components/ui/date-picker"
import { Textarea } from "@/components/ui/textarea"
import type { WorkspaceUser } from "@/lib/auth/mock-user"
import { initialHardwareAssets, REPAIR_REASONS } from "@/lib/hardware/data"
import { hardwareCategories, softwareCategories } from "@/lib/intake/constants"
import {
  REQUEST_PRIORITIES,
  REQUEST_PRIORITY_LABELS,
  REQUEST_TYPE_LABELS,
  REQUEST_TYPES,
  RETURN_REASONS,
  type RequestPriority,
  type RequestType,
} from "@/lib/requests/constants"
import type { EmployeeRequest } from "@/lib/requests/data"

function buildRequestTitle(type: RequestType, fields: Record<string, string | number>): string {
  switch (type) {
    case "hardware":
      return fields.itemName ? String(fields.itemName) : "New hardware request"
    case "software":
      return fields.itemName ? String(fields.itemName) : "New software request"
    case "replacement":
      return fields.assetTag ? `Replace ${fields.assetTag}` : "Hardware replacement"
    case "return":
      return fields.assetTag ? `Return ${fields.assetTag}` : "Equipment return"
    case "other":
      return fields.title ? String(fields.title) : "General request"
    default:
      return "Request"
  }
}

export interface AddRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: WorkspaceUser
  onSubmit: (request: EmployeeRequest) => void
}

function AddRequestDialog({ open, onOpenChange, user, onSubmit }: AddRequestDialogProps) {
  const today = new Date().toISOString().split("T")[0]
  const [requestType, setRequestType] = useState<RequestType>("hardware")
  const [priority, setPriority] = useState<RequestPriority>("normal")
  const [neededBy, setNeededBy] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<string>(hardwareCategories[0])
  const [itemName, setItemName] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [seats, setSeats] = useState("1")
  const [title, setTitle] = useState("")
  const [selectedAssetId, setSelectedAssetId] = useState("")
  const [replacementReason, setReplacementReason] = useState<string>(REPAIR_REASONS[0])
  const [returnReason, setReturnReason] = useState<string>(RETURN_REASONS[0])

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
    setRequestType("hardware")
    setPriority("normal")
    setNeededBy("")
    setDescription("")
    setCategory(hardwareCategories[0])
    setItemName("")
    setQuantity("1")
    setSeats("1")
    setTitle("")
    setSelectedAssetId(assignedAssets[0]?.id ?? "")
    setReplacementReason(REPAIR_REASONS[0])
    setReturnReason(RETURN_REASONS[0])
  }, [open, assignedAssets])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const selectedAsset = assignedAssets.find((asset) => asset.id === selectedAssetId)
    const parsedQuantity = Math.max(1, parseInt(quantity, 10) || 1)
    const parsedSeats = Math.max(1, parseInt(seats, 10) || 1)

    const titleValue = buildRequestTitle(requestType, {
      itemName,
      title,
      assetTag: selectedAsset?.tag ?? "",
    })

    const request: EmployeeRequest = {
      id: `req-${Date.now()}`,
      type: requestType,
      title: titleValue,
      employeeName: user.name,
      employeeEmail: user.email,
      status: "pending",
      priority,
      submittedAt: today,
      description,
    }

    if (requestType === "hardware") {
      request.category = category
      request.itemName = itemName
      request.quantity = parsedQuantity
      if (neededBy) request.neededBy = neededBy
    } else if (requestType === "software") {
      request.category = category
      request.itemName = itemName
      request.seats = parsedSeats
      if (neededBy) request.neededBy = neededBy
    } else if (requestType === "replacement" || requestType === "return") {
      if (!selectedAsset) return
      request.assetId = selectedAsset.id
      request.assetTag = selectedAsset.tag
      if (requestType === "replacement") {
        request.replacementReason = replacementReason
      } else {
        request.returnReason = returnReason
      }
    } else {
      request.title = title || titleValue
    }

    onSubmit(request)
    onOpenChange(false)
  }

  const needsAsset = requestType === "replacement" || requestType === "return"
  const assetRequiredButMissing = needsAsset && assignedAssets.length === 0

  return (
    <ModalContainer
      open={open}
      onOpenChange={onOpenChange}
      title="Add request"
      description="Submit a hardware, software, or equipment request for IT review."
      formControls
      onSubmit={handleSubmit}
      footer={
        <>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={assetRequiredButMissing}>
            Submit request
          </Button>
        </>
      }
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="req-type">Request type</FieldLabel>
          <CustomSelect
            id="req-type"
            value={requestType}
            onChange={(value) =>
              setRequestType((typeof value === "string" ? value : requestType) as RequestType)
            }
            options={REQUEST_TYPES.map((type) => ({
              label: REQUEST_TYPE_LABELS[type],
              value: type,
            }))}
            showClear={false}
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="req-priority">Priority</FieldLabel>
            <CustomSelect
              id="req-priority"
              value={priority}
              onChange={(value) =>
                setPriority((typeof value === "string" ? value : priority) as RequestPriority)
              }
              options={REQUEST_PRIORITIES.map((entry) => ({
                label: REQUEST_PRIORITY_LABELS[entry],
                value: entry,
              }))}
              showClear={false}
            />
          </Field>
          {requestType !== "other" && requestType !== "return" ? (
            <Field>
              <FieldLabel htmlFor="req-needed-by">Needed by</FieldLabel>
              <DatePicker id="req-needed-by" value={neededBy} onChange={setNeededBy} placeholder="Optional" />
            </Field>
          ) : null}
        </div>

        {requestType === "hardware" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="req-category">Category</FieldLabel>
              <CustomSelect
                id="req-category"
                value={category}
                onChange={(value) => setCategory(typeof value === "string" ? value : category)}
                options={toSelectOptions(hardwareCategories)}
                showClear={false}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="req-quantity">Quantity</FieldLabel>
              <Input
                id="req-quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="req-item">Preferred item / brand / model</FieldLabel>
              <Input
                id="req-item"
                placeholder='e.g. MacBook Pro 14"'
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </Field>
          </div>
        ) : null}

        {requestType === "software" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="req-sw-name">App name</FieldLabel>
              <Input
                id="req-sw-name"
                placeholder="e.g. Figma Professional"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="req-sw-category">Category</FieldLabel>
              <CustomSelect
                id="req-sw-category"
                value={category}
                onChange={(value) => setCategory(typeof value === "string" ? value : category)}
                options={toSelectOptions(softwareCategories)}
                showClear={false}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="req-seats">Seats</FieldLabel>
              <Input
                id="req-seats"
                type="number"
                min={1}
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                required
              />
            </Field>
          </div>
        ) : null}

        {needsAsset ? (
          <Field>
            <FieldLabel htmlFor="req-asset">Assigned asset</FieldLabel>
            {assignedAssets.length > 0 ? (
              <CustomSelect
                id="req-asset"
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
        ) : null}

        {requestType === "replacement" ? (
          <Field>
            <FieldLabel htmlFor="req-replacement-reason">Replacement reason</FieldLabel>
            <CustomSelect
              id="req-replacement-reason"
              value={replacementReason}
              onChange={(value) =>
                setReplacementReason(typeof value === "string" ? value : replacementReason)
              }
              options={toSelectOptions(REPAIR_REASONS)}
              showClear={false}
            />
          </Field>
        ) : null}

        {requestType === "return" ? (
          <Field>
            <FieldLabel htmlFor="req-return-reason">Return reason</FieldLabel>
            <CustomSelect
              id="req-return-reason"
              value={returnReason}
              onChange={(value) => setReturnReason(typeof value === "string" ? value : returnReason)}
              options={toSelectOptions(RETURN_REASONS)}
              showClear={false}
            />
          </Field>
        ) : null}

        {requestType === "other" ? (
          <Field>
            <FieldLabel htmlFor="req-title">Title</FieldLabel>
            <Input
              id="req-title"
              placeholder="Brief summary of your request"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Field>
        ) : null}

        <Field>
          <FieldLabel htmlFor="req-description">
            {requestType === "other" ? "Description" : "Justification / notes"}
          </FieldLabel>
          <Textarea
            id="req-description"
            rows={3}
            placeholder="Explain why this request is needed..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Field>
      </FieldGroup>
    </ModalContainer>
  )
}

export { AddRequestDialog }
