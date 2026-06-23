"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  dialogFormClassName,
  dialogHeaderClassName,
  dialogScrollBodyClassName,
  dialogShellClassNameWide,
} from "@/lib/dialog-layout"
import {
  getTemplateDepartmentOptions,
  TEMPLATE_HARDWARE_CATEGORIES,
  TEMPLATE_SOFTWARE_LICENSES,
  type DepartmentTemplate,
  type TemplateLine,
  type TemplateLineType,
} from "@/lib/employee-lifecycle/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

type TemplateFormMode = "add" | "edit"

export interface TemplateFormDialogProps {
  open: boolean
  mode: TemplateFormMode
  template: DepartmentTemplate | null
  templates: DepartmentTemplate[]
  onOpenChange: (open: boolean) => void
  onSave: (payload: Omit<DepartmentTemplate, "id">, id?: string) => void
}

function createLine(type: TemplateLineType): TemplateLine {
  return {
    id: `ln-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    item: type === "hardware" ? TEMPLATE_HARDWARE_CATEGORIES[0] : TEMPLATE_SOFTWARE_LICENSES[0],
    quantity: 1,
    required: true,
  }
}

function TemplateLineRow({
  line,
  onChange,
  onRemove,
}: {
  line: TemplateLine
  onChange: (line: TemplateLine) => void
  onRemove: () => void
}) {
  const typeLabel = line.type === "hardware" ? "Hardware" : "Software"
  const itemLabel = line.type === "hardware" ? "Asset category" : "License"

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className={typeScale.caption.overline}>{typeLabel}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Remove line"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 />
        </Button>
      </div>

      <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_5rem_auto]">
        <Field>
          <FieldLabel htmlFor={`item-${line.id}`}>{itemLabel}</FieldLabel>
          <CustomSelect
            id={`item-${line.id}`}
            value={line.item}
            onChange={(value) => onChange({ ...line, item: typeof value === "string" ? value : line.item })}
            options={toSelectOptions(
              line.type === "hardware" ? TEMPLATE_HARDWARE_CATEGORIES : TEMPLATE_SOFTWARE_LICENSES
            )}
            showClear={false}
            placeholder={itemLabel}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`qty-${line.id}`}>Qty</FieldLabel>
          <Input
            id={`qty-${line.id}`}
            type="number"
            min={1}
            value={line.quantity}
            onChange={(e) => onChange({ ...line, quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
          />
        </Field>

        <div className="flex items-center gap-2 pb-1">
          <Switch
            id={`required-${line.id}`}
            checked={line.required}
            onCheckedChange={(checked) => onChange({ ...line, required: checked === true })}
          />
          <Label htmlFor={`required-${line.id}`} className={typeScale.body.default}>
            Required
          </Label>
        </div>
      </div>
    </div>
  )
}

function TemplateFormDialog({
  open,
  mode,
  template,
  templates,
  onOpenChange,
  onSave,
}: TemplateFormDialogProps) {
  const [department, setDepartment] = useState("")
  const [notes, setNotes] = useState("")
  const [lines, setLines] = useState<TemplateLine[]>([])

  const departmentOptions = useMemo(
    () => toSelectOptions(getTemplateDepartmentOptions(templates)),
    [templates]
  )

  useEffect(() => {
    if (!open) return
    if (mode === "edit" && template) {
      setDepartment(template.department)
      setNotes(template.notes)
      setLines(template.lines.map((line) => ({ ...line })))
    } else {
      setDepartment("")
      setNotes("")
      setLines([])
    }
  }, [open, mode, template])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!department.trim()) return
    onSave(
      {
        department: department.trim(),
        notes: notes.trim(),
        lines,
      },
      mode === "edit" ? template?.id : undefined
    )
    onOpenChange(false)
  }

  function addLine(type: TemplateLineType) {
    setLines((prev) => [...prev, createLine(type)])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogShellClassNameWide}>
        <DialogHeader className={dialogHeaderClassName}>
          <DialogTitle>{mode === "add" ? "New department template" : "Edit department template"}</DialogTitle>
          <DialogDescription>Define what new hires in this department should receive.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className={dialogFormClassName}>
          <DialogBody className={cn(dialogScrollBodyClassName, settingsControlClassName)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="template-department">Department</FieldLabel>
                <CustomSelect
                  id="template-department"
                  placeholder="Type or pick a department"
                  value={department}
                  onChange={(value) => setDepartment(typeof value === "string" ? value : "")}
                  options={departmentOptions}
                  searchable
                  showClear={false}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="template-notes">Notes (optional)</FieldLabel>
                <Textarea
                  id="template-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </Field>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={typeScale.body.emphasis}>Lines</span>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => addLine("hardware")}>
                      <Plus />
                      Hardware
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addLine("software")}>
                      <Plus />
                      Software
                    </Button>
                  </div>
                </div>

                {lines.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border bg-surface/40 px-4 py-8 text-center">
                    <p className={typeScale.body.muted}>No lines yet — add hardware or software above.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lines.map((line) => (
                      <TemplateLineRow
                        key={line.id}
                        line={line}
                        onChange={(updated) =>
                          setLines((prev) => prev.map((entry) => (entry.id === line.id ? updated : entry)))
                        }
                        onRemove={() => setLines((prev) => prev.filter((entry) => entry.id !== line.id))}
                      />
                    ))}
                  </div>
                )}
              </div>
            </FieldGroup>
          </DialogBody>

          <CardActions>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!department.trim()}>
              Save template
            </Button>
          </CardActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { TemplateFormDialog }
