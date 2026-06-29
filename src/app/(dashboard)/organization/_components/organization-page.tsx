"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"

import { OrganizationsTable } from "./organizations-table"
import { CustomSelect } from "@/components/custom/CustomSelect"
import { PageHeader } from "@/components/layout/PageHeader"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { CardContainer } from "@/components/ui/card-container"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
  initialOrganizations,
  ORGANIZATION_STATUS_FILTER_OPTIONS,
  type Organization,
  type OrganizationStatus,
} from "@/lib/organization/data"
import { cn } from "@/lib/utils"
import AddEditOrganizationDialog from "./add-edit-organization-dialog"
import DeleteOrganizationDialog from "./delete-organization-dialog"

type ActiveModal = "add" | "edit" | "delete" | null

const organizationsCardContentClassName = settingsControlClassName

function OrganizationPage() {
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)

  const filteredOrganizations = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return organizations.filter((organization) => {
      const matchesStatus = statusFilter === "all" || organization.status === statusFilter
      if (!matchesStatus) return false
      if (!query) return true

      return (
        organization.name.toLowerCase().includes(query) ||
        organization.slug.toLowerCase().includes(query) ||
        organization.industry.toLowerCase().includes(query) ||
        organization.billingEmail.toLowerCase().includes(query) ||
        organization.companyPhone.toLowerCase().includes(query) ||
        organization.website.toLowerCase().includes(query) ||
        organization.address.toLowerCase().includes(query)
      )
    })
  }, [organizations, searchQuery, statusFilter])

  function handleOpenModal(modal: ActiveModal, organization: Organization | null = null) {
    setSelectedOrganization(organization)
    setActiveModal(modal)
  }

  function handleCloseModal() {
    setActiveModal(null)
    setSelectedOrganization(null)
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) handleCloseModal()
  }

  function handleOnboard(organization: Organization) {
    const activatedAt = new Date().toISOString().slice(0, 10)
    // api call
    toast.success(`Onboarded ${organization.name}.`)
  }

  function handleToggleActive(organization: Organization) {
    const nextStatus: OrganizationStatus = organization.status === "active" ? "inactive" : "active"
    // api call
    toast.success(
      nextStatus === "active" ? `Activated ${organization.name}.` : `Deactivated ${organization.name}.`
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Platform administration"
        // icon={Building2}
        title="Organizations"
        description="Onboard, activate, and manage every workspace on the platform."
        actions={
          <Button onClick={() => handleOpenModal("add")}>
            <Plus />
            New organization
          </Button>
        }
      >
        <CardContainer
          formControls
          contentClassName={cn("flex flex-col gap-4", organizationsCardContentClassName)}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <InputGroup className="max-w-xl min-w-[240px]">
              <InputGroupAddon>
                <Search className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </InputGroup>

            <CustomSelect
              id="org-status-filter"
              className="w-full sm:w-52"
              placeholder="Filter by status"
              value={statusFilter}
              options={ORGANIZATION_STATUS_FILTER_OPTIONS.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              showClear={false}
              onChange={(value) => {
                if (typeof value === "string") setStatusFilter(value)
              }}
            />
          </div>

          <OrganizationsTable
            rows={filteredOrganizations}
            onEdit={(organization) => handleOpenModal("edit", organization)}
            onDelete={(organization) => handleOpenModal("delete", organization)}
            onOnboard={handleOnboard}
            onToggleActive={handleToggleActive}
          />
        </CardContainer>
      </PageHeader>

      {(activeModal === "add" || activeModal === "edit") && (
        <AddEditOrganizationDialog
          open={activeModal === "add" || activeModal === "edit"}
          onOpenChange={handleDialogOpenChange}
          activeModal={activeModal}
          handleCloseModal={handleCloseModal}
          selectedOrganization={selectedOrganization}
        />
      )}
      {activeModal === "delete" && (
        <DeleteOrganizationDialog
          open={activeModal === "delete"}
          onOpenChange={handleDialogOpenChange}
          handleCloseModal={handleCloseModal}
          selectedOrganization={selectedOrganization}
        />
      )}
    </>
  )
}

export { OrganizationPage }
