"use client"

import * as React from "react"
import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { TemplateFormDialog } from "./template-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardActions } from "@/components/ui/card"
import { CardContainer } from "@/components/ui/card-container"
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
import { type DepartmentTemplate, type TemplateLine } from "@/lib/employee-lifecycle/data"
import { TABLE_EMPTY_CELL } from "@/lib/table-empty"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

function TemplateSection({
  label,
  children,
  bordered = true,
}: {
  label: string
  children: React.ReactNode
  bordered?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        bordered && "border-t border-border pt-4"
      )}
    >
      <p className={typeScale.caption.overline}>{label}</p>
      {children}
    </div>
  )
}

function TemplateLinesSection({ title, lines }: { title: "Hardware" | "Software"; lines: TemplateLine[] }) {
  const filtered = lines.filter((line) =>
    title === "Hardware" ? line.type === "hardware" : line.type === "software"
  )

  return (
    <TemplateSection label={title}>
      {filtered.length === 0 ? (
        <p className={typeScale.body.muted}>{TABLE_EMPTY_CELL}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((line) => (
            <li key={line.id} className="flex items-start justify-between gap-3">
              <span className={cn(typeScale.body.default, "min-w-0 leading-snug")}>
                {line.item}{" "}
                <span className={cn(typeScale.body.muted, "tabular-nums")}>× {line.quantity}</span>
              </span>
              {line.required ? (
                <Badge variant="warning" className="shrink-0">
                  Required
                </Badge>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </TemplateSection>
  )
}

function getTemplateSummary(template: DepartmentTemplate) {
  const hardwareCount = template.lines.filter((line) => line.type === "hardware").length
  const softwareCount = template.lines.filter((line) => line.type === "software").length
  const parts: string[] = []

  if (hardwareCount > 0) {
    parts.push(`${hardwareCount} hardware ${hardwareCount === 1 ? "line" : "lines"}`)
  }
  if (softwareCount > 0) {
    parts.push(`${softwareCount} software ${softwareCount === 1 ? "line" : "lines"}`)
  }

  return parts.length > 0 ? parts.join(" · ") : "No hardware or software lines yet"
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
  const notes = template.notes.trim()

  return (
    <CardContainer
      size="sm"
      className="h-full"
      title={<span className={cn(typeScale.title, "truncate")}>{template.department}</span>}
      description={getTemplateSummary(template)}
      descriptionClassName={typeScale.caption.meta}
      headerClassName="gap-2"
      action={
        <div className="flex items-center gap-0.5">
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
      }
      contentClassName="flex flex-col gap-4 pt-1"
    >
      <TemplateSection label="Notes" bordered={false}>
        <p className={cn(notes ? typeScale.body.default : typeScale.body.muted, "leading-relaxed")}>
          {notes || "No notes"}
        </p>
      </TemplateSection>

      <TemplateLinesSection title="Hardware" lines={template.lines} />
      <TemplateLinesSection title="Software" lines={template.lines} />
    </CardContainer>
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
          <CardContainer size="sm" contentClassName="py-12 text-center">
            <p className={typeScale.body.muted}>No department templates yet. Create one to get started.</p>
          </CardContainer>
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
          </DialogHeader>

          {selectedTemplate ? (
            <>
              <DialogBody className={dialogBodyBeforeActionsClassName}>
                <DialogDescription>
                  This removes the{" "}
                  <span className={typeScale.body.emphasis}>{selectedTemplate.department}</span> template and
                  all its lines. Existing assignments are not changed.
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
    </>
  )
}

export { DepartmentsTab }
