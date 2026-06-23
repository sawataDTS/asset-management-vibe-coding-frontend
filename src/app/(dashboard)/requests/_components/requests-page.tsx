"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Flag, Inbox, Search } from "lucide-react"

import { SectionHeading } from "@/components/layout/SectionHeading"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { TabNav, type TabNavItem } from "@/components/ui/tab-nav"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  initialEmployeeRequests,
  initialHardwareReconciliations,
  type EmployeeRequest,
  type HardwareReconciliation,
} from "@/lib/requests/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"
import { surfaceOutlineClassName } from "@/lib/surface"

const REQUEST_TABS: TabNavItem[] = [
  { value: "employee-requests", label: "Requests", icon: Inbox },
  { value: "hardware-reconciliations", label: "Hardware Reconciliations", icon: Flag },
]

type ViewFilter = "pending" | "all"

const requestsCardClassName = "gap-0 py-0"
const requestsCardContentClassName = cn("p-(--card-spacing)", settingsControlClassName)

function FilterPills({
  value,
  onChange,
  pendingCount,
  allCount,
}: {
  value: ViewFilter
  onChange: (filter: ViewFilter) => void
  pendingCount: number
  allCount: number
}) {
  const items: { id: ViewFilter; label: string; count: number }[] = [
    { id: "pending", label: "Pending", count: pendingCount },
    { id: "all", label: "All", count: allCount },
  ]

  return (
    <div className="inline-flex w-fit shrink-0 self-start rounded-lg bg-muted p-[3px]">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cn(
            "inline-flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-all",
            value === item.id
              ? cn(surfaceOutlineClassName, "bg-card text-foreground")
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item.label} ({item.count})
        </button>
      ))}
    </div>
  )
}

function RequestsEmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <Empty className={cn(surfaceOutlineClassName, "rounded-xl border-solid bg-card py-16")}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
    </Empty>
  )
}

function filterEmployeeRequests(
  requests: EmployeeRequest[],
  filter: ViewFilter,
  searchQuery: string
) {
  const q = searchQuery.trim().toLowerCase()
  return requests.filter((request) => {
    const matchesFilter = filter === "all" || request.status === "pending"
    const matchesSearch =
      !q ||
      request.title.toLowerCase().includes(q) ||
      request.employeeName.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })
}

function filterReconciliations(
  items: HardwareReconciliation[],
  filter: ViewFilter
) {
  return items.filter((item) => filter === "all" || item.status === "pending")
}

function EmployeeRequestsPanel({ requests }: { requests: EmployeeRequest[] }) {
  const [filter, setFilter] = useState<ViewFilter>("pending")
  const [searchQuery, setSearchQuery] = useState("")

  const pendingCount = requests.filter((request) => request.status === "pending").length
  const filtered = useMemo(
    () => filterEmployeeRequests(requests, filter, searchQuery),
    [requests, filter, searchQuery]
  )

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading
        title="Employee Requests"
        description="Review and respond to submissions from your team."
        actions={
          <InputGroup className="min-w-[240px] flex-1 sm:max-w-sm">
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search Title or Employee"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        }
      />

      <FilterPills
        value={filter}
        onChange={setFilter}
        pendingCount={pendingCount}
        allCount={requests.length}
      />

      {filtered.length === 0 ? (
        <RequestsEmptyState title="No requests here." />
      ) : (
        <Card className={requestsCardClassName}>
          <CardContent className={requestsCardContentClassName}>
            <p className={typeScale.body.muted}>{filtered.length} request(s) match this view.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function HardwareReconciliationsPanel({ items }: { items: HardwareReconciliation[] }) {
  const [filter, setFilter] = useState<ViewFilter>("pending")

  const pendingCount = items.filter((item) => item.status === "pending").length
  const filtered = useMemo(() => filterReconciliations(items, filter), [items, filter])

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading
        title="Hardware Reconciliations"
        description="Employee-flagged hardware items waiting for IT to reconcile."
      />

      <FilterPills
        value={filter}
        onChange={setFilter}
        pendingCount={pendingCount}
        allCount={items.length}
      />

      {filtered.length === 0 ? (
        <RequestsEmptyState title="No Reconciliations Match This View." />
      ) : (
        <Card className={requestsCardClassName}>
          <CardContent className={requestsCardContentClassName}>
            <p className={typeScale.body.muted}>{filtered.length} reconciliation(s) match this view.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function RequestsPage() {
  const [activeTab, setActiveTab] = useState("employee-requests")

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-6">
        <TabNav items={REQUEST_TABS} />

        <TabsContent value="employee-requests">
          <EmployeeRequestsPanel requests={initialEmployeeRequests} />
        </TabsContent>

        <TabsContent value="hardware-reconciliations">
          <HardwareReconciliationsPanel items={initialHardwareReconciliations} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { RequestsPage }
