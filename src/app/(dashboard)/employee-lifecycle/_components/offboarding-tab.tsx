"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import {
  ArrowRightLeft,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  EyeOff,
  FileText,
  HardDrive,
  Key,
  Play,
  RefreshCw,
  Search,
} from "lucide-react"
import { toast } from "sonner"

import { CustomSelect } from "@/components/custom/CustomSelect"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { CardActions } from "@/components/ui/card"
import { CardContainer } from "@/components/ui/card-container"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import {
  dialogBodyBeforeActionsClassName,
  dialogHeaderClassName,
  dialogShellClassNameCompact,
} from "@/lib/dialog-layout"
import {
  canFinalizeOffboarding,
  CHECKLIST_ITEM_STATUSES,
  CHECKLIST_STATUS_LABELS,
  createDefaultOffboardingChecklist,
  formatHistoryWhen,
  getChecklistProgress,
  summarizeOffboardingResult,
  type ActiveOffboarding,
  type ChecklistItemStatus,
  type LifecycleHistoryEntry,
  type OffboardingCandidate,
  type OffboardingChecklistItem,
} from "@/lib/employee-lifecycle/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

const lifecycleCardContentClassName = settingsControlClassName
/** Padding for nested panels (accordions, inset blocks) — not supplied by CardContainer slots. */
const lifecycleNestedPanelClassName = cn("p-(--card-spacing)", settingsControlClassName)

const CHECKLIST_ICONS = [HardDrive, Key, FileText, ArrowRightLeft, CheckCircle2, EyeOff, ClipboardList]

const CHECKLIST_ICON_WRAPPER_CLASS: Record<ChecklistItemStatus, string> = {
  pending: "bg-warning/12 text-warning",
  in_progress: "bg-info/12 text-info",
  done: "bg-success/12 text-success",
  skipped: "bg-muted text-muted-foreground",
}

function formatInitiatedAt(iso: string) {
  return formatHistoryWhen(iso)
}

function ActiveOffboardingCard({
  offboarding,
  expanded,
  onExpandedChange,
  onUpdate,
  onCancelRequest,
  onFinalizeRequest,
}: {
  offboarding: ActiveOffboarding
  expanded: boolean
  onExpandedChange: (open: boolean) => void
  onUpdate: (updated: ActiveOffboarding) => void
  onCancelRequest: () => void
  onFinalizeRequest: () => void
}) {
  const progress = getChecklistProgress(offboarding.checklist)
  const canFinalize = canFinalizeOffboarding(offboarding.checklist)

  function updateChecklistItem(itemId: string, status: ChecklistItemStatus) {
    onUpdate({
      ...offboarding,
      checklist: offboarding.checklist.map((item) => (item.id === itemId ? { ...item, status } : item)),
    })
  }

  return (
    <Collapsible open={expanded} onOpenChange={onExpandedChange} className="rounded-lg border border-border">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-(--card-spacing) py-3 text-left transition-colors hover:bg-muted/50">
        <span className={typeScale.body.emphasis}>
          {offboarding.employeeName} · {offboarding.department}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="border-t border-border">
        <div className={cn("flex flex-col gap-4", lifecycleNestedPanelClassName)}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className={typeScale.caption.meta}>Initiated {formatInitiatedAt(offboarding.initiatedAt)}</p>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toast.info("Refreshed checklist.")}
              >
                <RefreshCw />
                Refresh
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={onCancelRequest}>
                Cancel offboarding
              </Button>
              <Button type="button" size="sm" disabled={!canFinalize} onClick={onFinalizeRequest}>
                Finalize offboarding
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className={typeScale.caption.overline}>Checklist</p>
              <p className={typeScale.caption.meta}>
                {progress.doneCount}/{progress.total} done · {progress.requiredOpen} required open
              </p>
            </div>

            <ul className="divide-y divide-border rounded-lg border border-border">
              {offboarding.checklist.map((item, index) => {
                const Icon = CHECKLIST_ICONS[index] ?? CheckCircle2
                const isComplete = item.status === "done" || item.status === "skipped"
                return (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                          CHECKLIST_ICON_WRAPPER_CLASS[item.status]
                        )}
                      >
                        <Icon className="size-4" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            typeScale.body.default,
                            isComplete && "text-muted-foreground line-through"
                          )}
                        >
                          {item.label}
                        </p>
                        {item.optional ? <p className={typeScale.caption.meta}>OPTIONAL</p> : null}
                      </div>
                    </div>
                    <CustomSelect
                      className="w-full sm:w-36"
                      value={item.status}
                      onChange={(value) =>
                        updateChecklistItem(
                          item.id,
                          typeof value === "string" ? (value as ChecklistItemStatus) : item.status
                        )
                      }
                      options={CHECKLIST_ITEM_STATUSES.map((status) => ({
                        label: CHECKLIST_STATUS_LABELS[status],
                        value: status,
                      }))}
                      showClear={false}
                    />
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className={typeScale.caption.overline}>Assigned hardware</p>
                <p className={cn(typeScale.caption.meta, "tabular-nums")}>{offboarding.hardware.length}</p>
              </div>
              {offboarding.hardware.length === 0 ? (
                <p className={typeScale.caption.meta}>—</p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {offboarding.hardware.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3">
                      <span className={typeScale.body.emphasis}>{item.name}</span>
                      <span className={cn(typeScale.caption.meta, "font-mono tabular-nums")}>{item.tag}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className={typeScale.caption.overline}>Active licenses</p>
                <p className={cn(typeScale.caption.meta, "tabular-nums")}>{offboarding.licenses.length}</p>
              </div>
              {offboarding.licenses.length === 0 ? (
                <p className={typeScale.caption.meta}>—</p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {offboarding.licenses.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3">
                      <span className={typeScale.body.emphasis}>{item.name}</span>
                      <span className={cn(typeScale.caption.meta, "font-mono tabular-nums")}>{item.tag}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className={typeScale.caption.meta}>
                On finalize, seats are released and rows are kept with a revoked_at timestamp for audit.
              </p>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export interface OffboardingTabProps {
  candidates: OffboardingCandidate[]
  activeOffboardings: ActiveOffboarding[]
  onCandidatesChange: React.Dispatch<React.SetStateAction<OffboardingCandidate[]>>
  onActiveOffboardingsChange: React.Dispatch<React.SetStateAction<ActiveOffboarding[]>>
  onHistoryAdd: (entry: LifecycleHistoryEntry) => void
}

function OffboardingTab({
  candidates,
  activeOffboardings,
  onCandidatesChange,
  onActiveOffboardingsChange,
  onHistoryAdd,
}: OffboardingTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All departments")
  const [lastDay, setLastDay] = useState("")
  const [reasonNotes, setReasonNotes] = useState("")
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(new Set())
  const [expandedOffboardingId, setExpandedOffboardingId] = useState<string | null>(null)

  const [startConfirmOpen, setStartConfirmOpen] = useState(false)
  const [finalizeTarget, setFinalizeTarget] = useState<ActiveOffboarding | null>(null)
  const [cancelTarget, setCancelTarget] = useState<ActiveOffboarding | null>(null)
  const [skipAwaitingReturn, setSkipAwaitingReturn] = useState(false)
  const [revokeReason, setRevokeReason] = useState("Offboarding finalized")

  const departmentOptions = useMemo(() => {
    const departments = Array.from(
      new Set(candidates.map((candidate) => candidate.department).filter(Boolean))
    )
    return [
      { label: "All departments", value: "All departments" },
      ...departments.map((dept) => ({ label: dept, value: dept })),
    ]
  }, [candidates])

  const filteredCandidates = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(q) ||
        candidate.email.toLowerCase().includes(q) ||
        candidate.department.toLowerCase().includes(q) ||
        candidate.status.toLowerCase().includes(q)
      const matchesDepartment =
        departmentFilter === "All departments" || candidate.department === departmentFilter
      return matchesSearch && matchesDepartment
    })
  }, [candidates, searchQuery, departmentFilter])

  const selectedCount = selectedCandidateIds.size

  function toggleCandidate(id: string, checked: boolean) {
    setSelectedCandidateIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function handleSelectAllFiltered() {
    setSelectedCandidateIds(new Set(filteredCandidates.map((candidate) => candidate.id)))
  }

  function handleClearSelection() {
    setSelectedCandidateIds(new Set())
  }

  function handleStartConfirm() {
    const selected = candidates.filter((candidate) => selectedCandidateIds.has(candidate.id))
    if (selected.length === 0) return

    const newOffboardings: ActiveOffboarding[] = selected.map((candidate) => ({
      id: `off-${candidate.id}-${Date.now()}`,
      employeeName: candidate.name,
      department: candidate.department,
      initiatedAt: new Date().toISOString(),
      lastDay,
      reasonNotes,
      checklist: createDefaultOffboardingChecklist(),
      hardware:
        candidate.name === "employee_3" ? [{ id: "hw-off-1", name: 'MacBook Pro 14"', tag: "LAP-0047" }] : [],
      licenses: [],
    }))

    onActiveOffboardingsChange((prev) => [...prev, ...newOffboardings])
    onCandidatesChange((prev) => prev.filter((candidate) => !selectedCandidateIds.has(candidate.id)))
    setExpandedOffboardingId(newOffboardings[0]?.id ?? null)
    setSelectedCandidateIds(new Set())
    setStartConfirmOpen(false)
    toast.success(`Started offboarding for ${selected.length} employee(s).`)
  }

  function handleUpdateOffboarding(updated: ActiveOffboarding) {
    onActiveOffboardingsChange((prev) => prev.map((entry) => (entry.id === updated.id ? updated : entry)))
    setFinalizeTarget((current) => (current?.id === updated.id ? updated : current))
  }

  function handleFinalizeConfirm() {
    if (!finalizeTarget) return

    const result = summarizeOffboardingResult(finalizeTarget.checklist)
    onHistoryAdd({
      id: `hist-${Date.now()}`,
      when: new Date().toISOString(),
      employeeName: finalizeTarget.employeeName,
      mode: "offboard",
      ...result,
    })

    onActiveOffboardingsChange((prev) => prev.filter((entry) => entry.id !== finalizeTarget.id))
    if (expandedOffboardingId === finalizeTarget.id) {
      setExpandedOffboardingId(null)
    }

    setFinalizeTarget(null)
    setSkipAwaitingReturn(false)
    setRevokeReason("Offboarding finalized")
    toast.success(`Finalized offboarding for ${finalizeTarget.employeeName}.`)
  }

  function handleCancelConfirm() {
    if (!cancelTarget) return

    onCandidatesChange((prev) => [
      ...prev,
      {
        id: cancelTarget.id.replace(/^off-/, "off-cand-restored-"),
        name: cancelTarget.employeeName,
        email: `${cancelTarget.employeeName.toLowerCase().replace(/\s+/g, "")}@company.com`,
        department: cancelTarget.department,
        status: "active",
      },
    ])

    onActiveOffboardingsChange((prev) => prev.filter((entry) => entry.id !== cancelTarget.id))
    if (expandedOffboardingId === cancelTarget.id) {
      setExpandedOffboardingId(null)
    }

    setCancelTarget(null)
    toast.success(`Cancelled offboarding for ${cancelTarget.employeeName}.`)
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <CardContainer
          variant="form"
          title="Initiate offboarding (single or bulk)"
          description="Initiating creates a 7-step checklist and flags the employee as pending. Hardware and licenses are not changed until you finalize each offboarding."
          formControls
          contentClassName={cn("flex flex-col gap-4", lifecycleCardContentClassName)}
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="offboard-search">Search employees</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Search className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                  id="offboard-search"
                  placeholder="Name, email, department, status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="offboard-dept">Department filter</FieldLabel>
              <CustomSelect
                id="offboard-dept"
                value={departmentFilter}
                onChange={(value) =>
                  setDepartmentFilter(typeof value === "string" ? value : "All departments")
                }
                options={departmentOptions}
                showClear={false}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="offboard-last-day">Last Day</FieldLabel>
              <DatePicker
                id="offboard-last-day"
                value={lastDay}
                onChange={setLastDay}
                placeholder="dd-mm-yyyy"
              />
            </Field>

            <Field className="lg:col-span-2">
              <FieldLabel htmlFor="offboard-reason">Reason / notes (optional)</FieldLabel>
              <Textarea
                id="offboard-reason"
                placeholder="Voluntary resignation, end of contract, role change..."
                value={reasonNotes}
                onChange={(e) => setReasonNotes(e.target.value)}
                rows={3}
              />
            </Field>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className={typeScale.caption.overline}>Select employees</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleSelectAllFiltered}>
                  Select all filtered
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleClearSelection}>
                  Clear
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={selectedCount === 0}
                  onClick={() => setStartConfirmOpen(true)}
                >
                  <Play />
                  Start selected ({selectedCount})
                </Button>
              </div>
            </div>

            <ul className="divide-y divide-border rounded-lg border border-border">
              {filteredCandidates.length === 0 ? (
                <li className="px-4 py-8 text-center">
                  <p className={typeScale.body.muted}>No employees match your search.</p>
                </li>
              ) : (
                filteredCandidates.map((candidate) => (
                  <li key={candidate.id}>
                    <label className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-muted/40">
                      <Checkbox
                        checked={selectedCandidateIds.has(candidate.id)}
                        onCheckedChange={(checked) => toggleCandidate(candidate.id, checked === true)}
                      />
                      <span className={typeScale.body.default}>
                        {candidate.name} · {candidate.department}
                      </span>
                    </label>
                  </li>
                ))
              )}
            </ul>
          </div>
        </CardContainer>

        <CardContainer
          title={`Active offboardings (${activeOffboardings.length})`}
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast.info("Refreshed active offboardings.")}
            >
              <RefreshCw />
              Refresh
            </Button>
          }
          contentClassName="flex flex-col gap-3"
        >
          {activeOffboardings.length === 0 ? (
            <p className={typeScale.body.muted}>No employees are currently being offboarded.</p>
          ) : (
            <div className="space-y-3">
              {activeOffboardings.map((offboarding) => (
                <ActiveOffboardingCard
                  key={offboarding.id}
                  offboarding={offboarding}
                  expanded={expandedOffboardingId === offboarding.id}
                  onExpandedChange={(open) => setExpandedOffboardingId(open ? offboarding.id : null)}
                  onUpdate={handleUpdateOffboarding}
                  onCancelRequest={() => setCancelTarget(offboarding)}
                  onFinalizeRequest={() => {
                    setRevokeReason("Offboarding finalized")
                    setSkipAwaitingReturn(false)
                    setFinalizeTarget(offboarding)
                  }}
                />
              ))}
            </div>
          )}
        </CardContainer>
      </div>

      <Dialog open={startConfirmOpen} onOpenChange={setStartConfirmOpen}>
        <DialogContent className={dialogShellClassNameCompact}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>Start bulk offboarding?</DialogTitle>
          </DialogHeader>
          <DialogBody className={dialogBodyBeforeActionsClassName}>
            <DialogDescription>
              This will initiate offboarding for {selectedCount} selected employee(s), create their
              checklists, and set status to pending offboarding. Finalization still happens per employee.
            </DialogDescription>
          </DialogBody>
          <CardActions>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleStartConfirm}>
              Start {selectedCount}
            </Button>
          </CardActions>
        </DialogContent>
      </Dialog>

      <Dialog open={finalizeTarget != null} onOpenChange={(open) => !open && setFinalizeTarget(null)}>
        <DialogContent className={dialogShellClassNameCompact}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>Finalize offboarding?</DialogTitle>
          </DialogHeader>

          <DialogBody className={cn(dialogBodyBeforeActionsClassName, settingsControlClassName)}>
            <DialogDescription>
              Locks the portal account, revokes license seats (history kept), moves hardware to
              awaiting_return for IT to confirm, and marks the employee as offboarded.
            </DialogDescription>

            <div className="mt-4 space-y-4">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
                <Checkbox
                  checked={skipAwaitingReturn}
                  onCheckedChange={(checked) => setSkipAwaitingReturn(checked === true)}
                  className="mt-0.5"
                />
                <span className={typeScale.body.muted}>
                  Skip &apos;awaiting return&apos; — assets are already in hand, return them straight to
                  stock.
                </span>
              </label>

              <Field>
                <FieldLabel htmlFor="revoke-reason">Revoke Reason (saved on each license row)</FieldLabel>
                <Input
                  id="revoke-reason"
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                />
              </Field>
            </div>
          </DialogBody>

          <CardActions>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleFinalizeConfirm}>
              Finalize
            </Button>
          </CardActions>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelTarget != null} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent className={dialogShellClassNameCompact}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>Cancel offboarding?</DialogTitle>
          </DialogHeader>
          <DialogBody className={dialogBodyBeforeActionsClassName}>
            <DialogDescription>
              {cancelTarget?.employeeName} will stay with the company. Their status returns to Active or On
              leave (whichever they had before offboarding started), the checklist is removed, and hardware
              and licenses are left unchanged. Use this if the exit was started by mistake or they are
              staying.
            </DialogDescription>
          </DialogBody>
          <CardActions>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Keep offboarding
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleCancelConfirm}>
              Cancel offboarding
            </Button>
          </CardActions>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { OffboardingTab }
