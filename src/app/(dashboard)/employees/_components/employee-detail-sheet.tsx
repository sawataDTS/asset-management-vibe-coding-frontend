"use client"

import * as React from "react"
import { useState } from "react"
import { format, isValid, parseISO } from "date-fns"
import { AppWindow, HardDrive, UserPlus, X } from "lucide-react"

import { CustomSelect } from "@/components/custom/CustomSelect"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  AVAILABLE_HARDWARE,
  AVAILABLE_SOFTWARE,
  formatEmployeeLocation,
  type Employee,
} from "@/lib/employees/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

function formatStartDate(value: string) {
  if (!value) return "—"
  const parsed = parseISO(value)
  return isValid(parsed) ? format(parsed, "dd MMM yyyy") : value
}

export interface EmployeeDetailSheetProps {
  employee: Employee | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssignHardware: (assetId: string) => void
  onUnassignHardware: (tag: string) => void
  onAssignSoftware: (licenseId: string) => void
  onUnassignSoftware: (tag: string) => void
}

function EmployeeDetailSheet({
  employee,
  open,
  onOpenChange,
  onAssignHardware,
  onUnassignHardware,
  onAssignSoftware,
  onUnassignSoftware,
}: EmployeeDetailSheetProps) {
  const [pickHardware, setPickHardware] = useState("")
  const [pickSoftware, setPickSoftware] = useState("")

  function handleOpenChange(next: boolean) {
    if (!next) {
      setPickHardware("")
      setPickSoftware("")
    }
    onOpenChange(next)
  }

  const availableHardwareOptions =
    employee?.hardwareAssignments != null
      ? AVAILABLE_HARDWARE.filter((a) => !employee.hardwareAssignments.some((h) => h.tag === a.tag)).map(
          (a) => ({ label: `${a.name} · ${a.tag}`, value: a.id })
        )
      : []

  const availableSoftwareOptions =
    employee?.softwareAssignments != null
      ? AVAILABLE_SOFTWARE.filter((a) => !employee.softwareAssignments.some((s) => s.tag === a.tag)).map(
          (a) => ({ label: `${a.name} · ${a.supplier}`, value: a.id })
        )
      : []

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto bg-card p-0 sm:max-w-lg">
        {employee ? (
          <>
            <SheetHeader className="border-b border-border px-4 py-4 pr-12">
              <SheetTitle className={typeScale.heading}>{employee.name}</SheetTitle>
              <SheetDescription className={cn(typeScale.body.muted, "font-mono tabular-nums")}>
                {employee.employeeId}
              </SheetDescription>
            </SheetHeader>

            <div className={cn("space-y-6 p-4", settingsControlClassName)}>
              <section className="space-y-3">
                <h3 className={typeScale.body.emphasis}>Basic information</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between gap-4">
                    <dt className={typeScale.body.muted}>Email</dt>
                    <dd className={cn("text-right", typeScale.body.emphasis)}>{employee.email}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className={typeScale.body.muted}>Phone</dt>
                    <dd className={cn("text-right", typeScale.body.emphasis)}>{employee.phone}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className={typeScale.body.muted}>Job title</dt>
                    <dd className={cn("text-right", typeScale.body.emphasis)}>{employee.jobTitle || "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className={typeScale.body.muted}>Department</dt>
                    <dd className={cn("text-right", typeScale.body.emphasis)}>
                      {employee.department || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className={typeScale.body.muted}>Manager</dt>
                    <dd className={cn("text-right", typeScale.body.emphasis)}>{employee.manager}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className={typeScale.body.muted}>Start date</dt>
                    <dd className={cn("text-right font-mono tabular-nums", typeScale.body.emphasis)}>
                      {formatStartDate(employee.startDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className={typeScale.body.muted}>Location</dt>
                    <dd className={cn("mt-1 leading-relaxed", typeScale.body.default)}>
                      {formatEmployeeLocation(employee) || "—"}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="size-4 shrink-0 text-muted-foreground" />
                  <h3 className={typeScale.body.emphasis}>
                    Hardware ({employee.hardwareAssignments.length})
                  </h3>
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  <CustomSelect
                    className="min-w-0 flex-1"
                    value={pickHardware}
                    onChange={(value) => setPickHardware(typeof value === "string" ? value : "")}
                    options={availableHardwareOptions}
                    showClear={false}
                    placeholder="Pick available asset..."
                  />
                  <Button
                    className="size-9 shrink-0"
                    size="icon"
                    aria-label="Assign hardware"
                    onClick={() => {
                      if (pickHardware) {
                        onAssignHardware(pickHardware)
                        setPickHardware("")
                      }
                    }}
                    disabled={!pickHardware}
                  >
                    <UserPlus />
                  </Button>
                </div>
                <div className="space-y-2">
                  {employee.hardwareAssignments.map((item) => (
                    <div
                      key={item.tag}
                      className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2"
                    >
                      <span className={cn("min-w-0 truncate", typeScale.body.default)}>
                        {item.name} ·{" "}
                        <span className={cn(typeScale.caption.meta, "font-mono")}>{item.tag}</span>
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0"
                        aria-label={`Remove ${item.tag}`}
                        onClick={() => onUnassignHardware(item.tag)}
                      >
                        <X />
                      </Button>
                    </div>
                  ))}
                  {employee.hardwareAssignments.length === 0 ? (
                    <p className={typeScale.body.muted}>No hardware assigned.</p>
                  ) : null}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <AppWindow className="size-4 shrink-0 text-muted-foreground" />
                  <h3 className={typeScale.body.emphasis}>
                    Software ({employee.softwareAssignments.length})
                  </h3>
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  <CustomSelect
                    className="min-w-0 flex-1"
                    value={pickSoftware}
                    onChange={(value) => setPickSoftware(typeof value === "string" ? value : "")}
                    options={availableSoftwareOptions}
                    showClear={false}
                    placeholder="Pick license..."
                  />
                  <Button
                    className="size-9 shrink-0"
                    size="icon"
                    aria-label="Assign software"
                    onClick={() => {
                      if (pickSoftware) {
                        onAssignSoftware(pickSoftware)
                        setPickSoftware("")
                      }
                    }}
                    disabled={!pickSoftware}
                  >
                    <UserPlus />
                  </Button>
                </div>
                <div className="space-y-2">
                  {employee.softwareAssignments.map((item) => (
                    <div
                      key={item.tag}
                      className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2"
                    >
                      <span className={cn("min-w-0 truncate", typeScale.body.default)}>
                        {item.name}
                        {item.supplier ? ` · ${item.supplier}` : ""}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0"
                        aria-label={`Remove ${item.tag}`}
                        onClick={() => onUnassignSoftware(item.tag)}
                      >
                        <X />
                      </Button>
                    </div>
                  ))}
                  {employee.softwareAssignments.length === 0 ? (
                    <p className={typeScale.body.muted}>No software assigned.</p>
                  ) : null}
                </div>
              </section>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export { EmployeeDetailSheet }
