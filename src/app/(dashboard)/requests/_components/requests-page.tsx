"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Flag, Inbox, Plus, Search } from "lucide-react"
import { toast } from "sonner"

import { AddRequestDialog } from "@/app/(dashboard)/requests/_components/add-request-dialog"
import { EmployeeRequestsTable } from "@/app/(dashboard)/requests/_components/employee-requests-table"
import { FlagReconciliationDialog } from "@/app/(dashboard)/requests/_components/flag-reconciliation-dialog"
import { HardwareReconciliationsTable } from "@/app/(dashboard)/requests/_components/hardware-reconciliations-table"
import { ReviewReconciliationDialog } from "@/app/(dashboard)/requests/_components/review-reconciliation-dialog"
import { ReviewRequestDialog } from "@/app/(dashboard)/requests/_components/review-request-dialog"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { PageHeader } from "@/components/layout/PageHeader"
import { CardContainer } from "@/components/ui/card-container"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { TabNav, type TabNavItem } from "@/components/ui/tab-nav"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  canManageRequests,
  canSubmitRequests,
  canViewAllRequests,
  filterByViewScope,
  getMockWorkspaceUser,
} from "@/lib/auth/mock-user"
import {
  initialEmployeeRequests,
  initialHardwareReconciliations,
  type EmployeeRequest,
  type HardwareReconciliation,
  type ReconciliationStatus,
  type RequestStatus,
} from "@/lib/requests/data"

const REQUEST_TABS: TabNavItem[] = [
  { value: "employee-requests", label: "Requests", icon: Inbox },
  { value: "hardware-reconciliations", label: "Hardware Reconciliations", icon: Flag },
]

type ViewFilter = "pending" | "all"

const requestsCardContentClassName = settingsControlClassName

function ViewFilterNav({
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
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as ViewFilter)}>
      <TabNav
        size="default"
        items={[
          { value: "pending", label: "Pending", badge: pendingCount },
          { value: "all", label: "All", badge: allCount },
        ]}
      />
    </Tabs>
  )
}

function filterEmployeeRequests(requests: EmployeeRequest[], filter: ViewFilter, searchQuery: string) {
  const q = searchQuery.trim().toLowerCase()
  return requests.filter((request) => {
    const matchesFilter = filter === "all" || request.status === "pending"
    const matchesSearch =
      !q ||
      request.title.toLowerCase().includes(q) ||
      request.employeeName.toLowerCase().includes(q) ||
      request.employeeEmail.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })
}

function filterReconciliations(items: HardwareReconciliation[], filter: ViewFilter, searchQuery: string) {
  const q = searchQuery.trim().toLowerCase()
  return items.filter((item) => {
    const matchesFilter = filter === "all" || item.status === "pending"
    const matchesSearch =
      !q ||
      item.assetName.toLowerCase().includes(q) ||
      item.assetTag.toLowerCase().includes(q) ||
      item.employeeName.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })
}

function EmployeeRequestsPanel({
  requests,
  showEmployeeColumn,
  canManage,
  onView,
  onApprove,
  onReject,
}: {
  requests: EmployeeRequest[]
  showEmployeeColumn: boolean
  canManage: boolean
  onView: (request: EmployeeRequest) => void
  onApprove: (request: EmployeeRequest) => void
  onReject: (request: EmployeeRequest) => void
}) {
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
              placeholder="Search title or employee"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        }
      />

      <ViewFilterNav
        value={filter}
        onChange={setFilter}
        pendingCount={pendingCount}
        allCount={requests.length}
      />

      <CardContainer contentClassName={requestsCardContentClassName}>
        <EmployeeRequestsTable
          rows={filtered}
          showEmployeeColumn={showEmployeeColumn}
          canManage={canManage}
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
        />
      </CardContainer>
    </div>
  )
}

function HardwareReconciliationsPanel({
  items,
  showEmployeeColumn,
  canManage,
  onView,
  onReconcile,
  onDismiss,
}: {
  items: HardwareReconciliation[]
  showEmployeeColumn: boolean
  canManage: boolean
  onView: (item: HardwareReconciliation) => void
  onReconcile: (item: HardwareReconciliation) => void
  onDismiss: (item: HardwareReconciliation) => void
}) {
  const [filter, setFilter] = useState<ViewFilter>("pending")
  const [searchQuery, setSearchQuery] = useState("")

  const pendingCount = items.filter((item) => item.status === "pending").length
  const filtered = useMemo(
    () => filterReconciliations(items, filter, searchQuery),
    [items, filter, searchQuery]
  )

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading
        title="Hardware Reconciliations"
        description="Employee-flagged hardware items waiting for IT to reconcile."
        actions={
          <InputGroup className="min-w-[240px] flex-1 sm:max-w-sm">
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search asset or employee"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        }
      />

      <ViewFilterNav
        value={filter}
        onChange={setFilter}
        pendingCount={pendingCount}
        allCount={items.length}
      />

      <CardContainer contentClassName={requestsCardContentClassName}>
        <HardwareReconciliationsTable
          rows={filtered}
          showEmployeeColumn={showEmployeeColumn}
          canManage={canManage}
          onView={onView}
          onReconcile={onReconcile}
          onDismiss={onDismiss}
        />
      </CardContainer>
    </div>
  )
}

function RequestsPage() {
  const user = getMockWorkspaceUser()
  const canManage = canManageRequests(user)
  const canSubmit = canSubmitRequests(user)
  const showEmployeeColumn = canViewAllRequests(user)

  const [activeTab, setActiveTab] = useState("employee-requests")
  const [requests, setRequests] = useState<EmployeeRequest[]>(initialEmployeeRequests)
  const [reconciliations, setReconciliations] = useState<HardwareReconciliation[]>(
    initialHardwareReconciliations
  )

  const [addRequestOpen, setAddRequestOpen] = useState(false)
  const [flagReconciliationOpen, setFlagReconciliationOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<EmployeeRequest | null>(null)
  const [selectedReconciliation, setSelectedReconciliation] = useState<HardwareReconciliation | null>(null)
  const [reviewRequestOpen, setReviewRequestOpen] = useState(false)
  const [reviewReconciliationOpen, setReviewReconciliationOpen] = useState(false)

  const visibleRequests = useMemo(() => filterByViewScope(requests, user), [requests, user])
  const visibleReconciliations = useMemo(
    () => filterByViewScope(reconciliations, user),
    [reconciliations, user]
  )

  const pageDescription = canManage
    ? "Review and respond to submissions from your team."
    : "Submit and track your hardware and software requests."

  function handleAddRequest(request: EmployeeRequest) {
    setRequests((prev) => [request, ...prev])
    toast.success("Request submitted for IT review.")
  }

  function handleFlagReconciliation(item: HardwareReconciliation) {
    setReconciliations((prev) => [item, ...prev])
    toast.success("Hardware issue flagged for IT review.")
  }

  function handleUpdateRequestStatus(requestId: string, status: RequestStatus, reviewNotes?: string) {
    const today = new Date().toISOString().split("T")[0]
    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status,
              reviewedBy: user.name,
              reviewedAt: today,
              reviewNotes: reviewNotes ?? request.reviewNotes,
            }
          : request
      )
    )
    const label =
      status === "approved"
        ? "approved"
        : status === "rejected"
          ? "rejected"
          : status === "closed"
            ? "closed"
            : "updated"
    toast.success(`Request ${label}.`)
  }

  function handleUpdateReconciliationStatus(
    itemId: string,
    status: ReconciliationStatus,
    reviewNotes?: string
  ) {
    const today = new Date().toISOString().split("T")[0]
    setReconciliations((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status,
              reviewedBy: user.name,
              reviewedAt: today,
              reviewNotes: reviewNotes ?? item.reviewNotes,
            }
          : item
      )
    )
    toast.success(status === "reconciled" ? "Reconciliation marked reconciled." : "Reconciliation dismissed.")
  }

  function openRequestReview(request: EmployeeRequest) {
    setSelectedRequest(request)
    setReviewRequestOpen(true)
  }

  function openReconciliationReview(item: HardwareReconciliation) {
    setSelectedReconciliation(item)
    setReviewReconciliationOpen(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="Team submissions"
        title="Requests"
        description={pageDescription}
        actions={
          canSubmit ? (
            activeTab === "employee-requests" ? (
              <Button onClick={() => setAddRequestOpen(true)}>
                <Plus />
                Add Request
              </Button>
            ) : (
              <Button onClick={() => setFlagReconciliationOpen(true)}>
                <Flag />
                Flag issue
              </Button>
            )
          ) : null
        }
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-6">
          <TabNav items={REQUEST_TABS} />

          <TabsContent value="employee-requests">
            <EmployeeRequestsPanel
              requests={visibleRequests}
              showEmployeeColumn={showEmployeeColumn}
              canManage={canManage}
              onView={openRequestReview}
              onApprove={(request) => handleUpdateRequestStatus(request.id, "approved")}
              onReject={(request) => handleUpdateRequestStatus(request.id, "rejected")}
            />
          </TabsContent>

          <TabsContent value="hardware-reconciliations">
            <HardwareReconciliationsPanel
              items={visibleReconciliations}
              showEmployeeColumn={showEmployeeColumn}
              canManage={canManage}
              onView={openReconciliationReview}
              onReconcile={(item) => handleUpdateReconciliationStatus(item.id, "reconciled")}
              onDismiss={(item) => handleUpdateReconciliationStatus(item.id, "dismissed")}
            />
          </TabsContent>
        </Tabs>
      </PageHeader>

      {addRequestOpen ? (
        <AddRequestDialog
          open={addRequestOpen}
          onOpenChange={setAddRequestOpen}
          user={user}
          onSubmit={handleAddRequest}
        />
      ) : null}

      {flagReconciliationOpen ? (
        <FlagReconciliationDialog
          open={flagReconciliationOpen}
          onOpenChange={setFlagReconciliationOpen}
          user={user}
          onSubmit={handleFlagReconciliation}
        />
      ) : null}

      {reviewRequestOpen && selectedRequest ? (
        <ReviewRequestDialog
          open={reviewRequestOpen}
          onOpenChange={setReviewRequestOpen}
          request={selectedRequest}
          canManage={canManage}
          onUpdateStatus={handleUpdateRequestStatus}
        />
      ) : null}

      {reviewReconciliationOpen && selectedReconciliation ? (
        <ReviewReconciliationDialog
          open={reviewReconciliationOpen}
          onOpenChange={setReviewReconciliationOpen}
          item={selectedReconciliation}
          canManage={canManage}
          onUpdateStatus={handleUpdateReconciliationStatus}
        />
      ) : null}
    </>
  )
}

export { RequestsPage }
