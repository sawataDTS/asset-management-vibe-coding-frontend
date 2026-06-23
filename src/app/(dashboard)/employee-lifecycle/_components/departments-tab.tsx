"use client"

import * as React from "react"
import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { TemplateFormDialog } from "./template-form-dialog"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { Card, CardActions, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { dialogHeaderClassName, dialogShellClassNameCompact } from "@/lib/dialog-layout"
import { type DepartmentTemplate, type TemplateLine } from "@/lib/employee-lifecycle/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const lifecycleCardClassName = "gap-0 py-0"
const lifecycleCardContentClassName = cn("p-(--card-spacing)", settingsControlClassName)

function TemplateLinesSection({
  title,
  lines,
}: {
  title: "Hardware" | "Software"
  lines: TemplateLine[]
}) {
  const filtered = lines.filter((line) =>
    title === "Hardware" ? line.type === "hardware" : line.type === "software"
  )

  return (
    <div className="space-y-2">
      <p className={typeScale.caption.overline}>{title}</p>
      {filtered.length === 0 ? (
        <p className={typeScale.body.muted}>—</p>
      ) : (
        <ul className="space-y-1.5">
          {filtered.map((line) => (
            <li key={line.id} className="flex items-start justify-between gap-3">
              <span className={typeScale.body.default}>
                {line.item} × {line.quantity}
              </span>
              {line.required ? (
                <span className={cn(typeScale.caption.meta, "shrink-0 text-warning")}>required</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DepartmentTemplateCard({
  template,
  onEdit,
  onDelete,
}: {
  template: DepartmentTemplate
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card className={lifecycleCardClassName}>
      <CardContent className={cn("flex flex-col gap-4", lifecycleCardContentClassName)}>
        <div className="flex items-start justify-between gap-3">
          <h3 className={typeScale.title}>{template.department}</h3>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon-sm" aria-label="Edit template" onClick={onEdit}>
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Delete template"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 />
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <p className={typeScale.caption.overline}>Notes</p>
          <p className={typeScale.body.muted}>{template.notes || "No notes"}</p>
        </div>

        <TemplateLinesSection title="Hardware" lines={template.lines} />
        <TemplateLinesSection title="Software" lines={template.lines} />
      </CardContent>
    </Card>
  )
}

export interface DepartmentsTabProps {
  templates: DepartmentTemplate[]
  onTemplatesChange: (templates: DepartmentTemplate[]) => void
}

function DepartmentsTab({ templates, onTemplatesChange }: DepartmentsTabProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"add" | "edit">("add")
  const [selectedTemplate, setSelectedTemplate] = useState<DepartmentTemplate | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function openAdd() {
    setFormMode("add")
    setSelectedTemplate(null)
    setFormOpen(true)
  }

  function openEdit(template: DepartmentTemplate) {
    setFormMode("edit")
    setSelectedTemplate(template)
    setFormOpen(true)
  }

  function openDelete(template: DepartmentTemplate) {
    setSelectedTemplate(template)
    setDeleteOpen(true)
  }

  function handleSave(payload: Omit<DepartmentTemplate, "id">, id?: string) {
    if (id) {
      onTemplatesChange(
        templates.map((template) => (template.id === id ? { ...template, ...payload } : template))
      )
      toast.success(`Updated template for ${payload.department}.`)
      return
    }

    const newTemplate: DepartmentTemplate = {
      id: `tpl-${Date.now()}`,
      ...payload,
    }
    onTemplatesChange([...templates, newTemplate])
    toast.success(`Created template for ${payload.department}.`)
  }

  function handleDeleteConfirm() {
    if (!selectedTemplate) return
    onTemplatesChange(templates.filter((template) => template.id !== selectedTemplate.id))
    toast.success(`Removed ${selectedTemplate.department} template.`)
    setDeleteOpen(false)
    setSelectedTemplate(null)
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <Button className="w-fit" onClick={openAdd}>
          <Plus />
          New department template
        </Button>

        {templates.length === 0 ? (
          <Card className={lifecycleCardClassName}>
            <CardContent className={cn("py-12 text-center", lifecycleCardContentClassName)}>
              <p className={typeScale.body.muted}>No department templates yet. Create one to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <DepartmentTemplateCard
                key={template.id}
                template={template}
                onEdit={() => openEdit(template)}
                onDelete={() => openDelete(template)}
              />
            ))}
          </div>
        )}
      </div>

      <TemplateFormDialog
        open={formOpen}
        mode={formMode}
        template={selectedTemplate}
        templates={templates}
        onOpenChange={setFormOpen}
        onSave={handleSave}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className={dialogShellClassNameCompact}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>Delete template?</DialogTitle>
            <DialogDescription>
              This removes the{" "}
              <span className={typeScale.body.emphasis}>{selectedTemplate?.department}</span> template and all
              its lines. Existing assignments are not changed.
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate ? (
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
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

export { DepartmentsTab }
