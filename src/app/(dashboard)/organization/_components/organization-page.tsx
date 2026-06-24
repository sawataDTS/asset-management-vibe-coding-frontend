"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"

import { OrganizationsTable } from "./organizations-table"
import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { CardActions } from "@/components/ui/card"
import { CardContainer } from "@/components/ui/card-container"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import {
  dialogFormClassName,
  dialogBodyBeforeActionsClassName,
  dialogHeaderClassName,
  dialogScrollBodyClassName,
  dialogShellClassNameCompact,
  dialogShellClassNameWide,
} from "@/lib/dialog-layout"
import {
  CURRENCY_OPTIONS,
  createEmptyOrganization,
  createOrganizationSlug,
  initialOrganizations,
  ORGANIZATION_STATUS_FILTER_OPTIONS,
  ORGANIZATION_STATUS_OPTIONS,
  ORG_SIZE_OPTIONS,
  TIMEZONE_OPTIONS,
  type Organization,
  type OrganizationStatus,
} from "@/lib/organization/data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

type ActiveModal = "add" | "edit" | "delete" | null

const organizationsCardContentClassName = settingsControlClassName

function OrganizationPage() {
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)
  const [form, setForm] = useState<Organization>(createEmptyOrganization())

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

  useEffect(() => {
    if (selectedOrganization && activeModal === "edit") {
      setForm({ ...selectedOrganization })
    } else if (activeModal === "add") {
      setForm(createEmptyOrganization())
    }
  }, [selectedOrganization, activeModal])

  function updateFormField<K extends keyof Organization>(key: K, value: Organization[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

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

  function handleSaveOrganization(event: React.FormEvent) {
    event.preventDefault()

    if (!form.name.trim()) {
      toast.error("Organization name is required.")
      return
    }

    if (!form.billingEmail.trim()) {
      toast.error("Billing email is required.")
      return
    }

    const payload = {
      name: form.name.trim(),
      industry: form.industry.trim(),
      size: form.size,
      timezone: form.timezone,
      defaultCurrency: form.defaultCurrency,
      status: form.status,
      billingEmail: form.billingEmail.trim(),
      activatedAt: form.activatedAt,
      companyPhone: form.companyPhone.trim(),
      address: form.address.trim(),
      website: form.website.trim(),
    }

    if (activeModal === "add") {
      const newOrganization: Organization = {
        id: `org-${Date.now()}`,
        slug: createOrganizationSlug(payload.name),
        ...payload,
      }
      setOrganizations((prev) => [...prev, newOrganization])
      toast.success(`Created organization ${newOrganization.name}.`)
    } else if (activeModal === "edit" && selectedOrganization) {
      setOrganizations((prev) =>
        prev.map((organization) =>
          organization.id === selectedOrganization.id
            ? {
                ...organization,
                ...payload,
                slug: organization.slug,
              }
            : organization
        )
      )
      toast.success(`Updated organization ${payload.name}.`)
    }

    handleCloseModal()
  }

  function handleDeleteConfirm() {
    if (!selectedOrganization) return
    setOrganizations((prev) => prev.filter((organization) => organization.id !== selectedOrganization.id))
    toast.success(`Deleted organization ${selectedOrganization.name}.`)
    handleCloseModal()
  }

  function handleOnboard(organization: Organization) {
    const activatedAt = new Date().toISOString().slice(0, 10)
    setOrganizations((prev) =>
      prev.map((item) =>
        item.id === organization.id
          ? { ...item, status: "active", activatedAt: item.activatedAt || activatedAt }
          : item
      )
    )
    toast.success(`Onboarded ${organization.name}.`)
  }

  function handleToggleActive(organization: Organization) {
    const nextStatus: OrganizationStatus = organization.status === "active" ? "inactive" : "active"
    setOrganizations((prev) =>
      prev.map((item) =>
        item.id === organization.id
          ? {
              ...item,
              status: nextStatus,
              activatedAt:
                nextStatus === "active" && !item.activatedAt
                  ? new Date().toISOString().slice(0, 10)
                  : item.activatedAt,
            }
          : item
      )
    )
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

      <Dialog open={activeModal === "add" || activeModal === "edit"} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={dialogShellClassNameWide}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>{activeModal === "add" ? "New organization" : "Edit organization"}</DialogTitle>
            <DialogDescription>
              {activeModal === "add"
                ? "Create a workspace and configure billing, regional defaults, and contact details."
                : "Update organization profile, status, and operational settings."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveOrganization} className={dialogFormClassName}>
            <DialogBody className={cn(dialogScrollBodyClassName, settingsControlClassName)}>
              <div className="flex flex-col gap-8">
                <section className="flex flex-col gap-5">
                  <SectionHeading title="Company details" description="Identity and workspace metadata." />

                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="org-form-name">Name *</FieldLabel>
                      <Input
                        id="org-form-name"
                        value={form.name}
                        onChange={(event) => updateFormField("name", event.target.value)}
                        required
                      />
                    </Field>

                    {activeModal === "edit" ? (
                      <Field>
                        <FieldLabel htmlFor="org-form-slug">Slug</FieldLabel>
                        <Input
                          id="org-form-slug"
                          value={form.slug}
                          readOnly
                          className="font-mono text-muted-foreground"
                        />
                        <p className={cn("mt-1.5", typeScale.caption.meta)}>
                          Slugs are fixed after creation.
                        </p>
                      </Field>
                    ) : null}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="org-form-industry">Industry</FieldLabel>
                        <Input
                          id="org-form-industry"
                          value={form.industry}
                          onChange={(event) => updateFormField("industry", event.target.value)}
                          placeholder="e.g. Information Technology"
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="org-form-size">Size</FieldLabel>
                        <CustomSelect
                          id="org-form-size"
                          placeholder="Select size"
                          value={form.size}
                          options={toSelectOptions(ORG_SIZE_OPTIONS)}
                          showClear={false}
                          onChange={(value) => {
                            if (typeof value === "string") updateFormField("size", value)
                          }}
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="org-form-status">Status</FieldLabel>
                        <CustomSelect
                          id="org-form-status"
                          placeholder="Select status"
                          value={form.status}
                          options={ORGANIZATION_STATUS_OPTIONS.map((option) => ({
                            label: option.label,
                            value: option.value,
                          }))}
                          showClear={false}
                          onChange={(value) => {
                            if (typeof value === "string") {
                              updateFormField("status", value as OrganizationStatus)
                            }
                          }}
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="org-form-activated-at">Activated at</FieldLabel>
                        <DatePicker
                          id="org-form-activated-at"
                          value={form.activatedAt}
                          onChange={(value) => updateFormField("activatedAt", value)}
                          placeholder="Select activation date"
                          allowClear
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                </section>

                <section className="flex flex-col gap-5 border-t border-border/60 pt-8">
                  <SectionHeading
                    title="Regional defaults"
                    description="Timezone and currency for new records and reports."
                  />

                  <FieldGroup>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="org-form-timezone">Timezone</FieldLabel>
                        <CustomSelect
                          id="org-form-timezone"
                          placeholder="Select timezone"
                          value={form.timezone}
                          options={TIMEZONE_OPTIONS.map((timezone) => ({
                            label: timezone.label,
                            value: timezone.value,
                            description: timezone.description,
                          }))}
                          searchable
                          showClear={false}
                          onChange={(value) => {
                            if (typeof value === "string") updateFormField("timezone", value)
                          }}
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="org-form-currency">Default currency</FieldLabel>
                        <CustomSelect
                          id="org-form-currency"
                          placeholder="Select currency"
                          value={form.defaultCurrency}
                          options={toSelectOptions(CURRENCY_OPTIONS)}
                          showClear={false}
                          onChange={(value) => {
                            if (typeof value === "string") updateFormField("defaultCurrency", value)
                          }}
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                </section>

                <section className="flex flex-col gap-5 border-t border-border/60 pt-8">
                  <SectionHeading
                    title="Billing & contact"
                    description="Invoices, support outreach, and company contact information."
                  />

                  <FieldGroup>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="org-form-billing-email">Billing email *</FieldLabel>
                        <Input
                          id="org-form-billing-email"
                          type="email"
                          value={form.billingEmail}
                          onChange={(event) => updateFormField("billingEmail", event.target.value)}
                          placeholder="billing@company.com"
                          required
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="org-form-company-phone">Company phone</FieldLabel>
                        <Input
                          id="org-form-company-phone"
                          type="tel"
                          value={form.companyPhone}
                          onChange={(event) => updateFormField("companyPhone", event.target.value)}
                          placeholder="+1 555 010 2233"
                        />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="org-form-website">Website</FieldLabel>
                      <Input
                        id="org-form-website"
                        type="url"
                        value={form.website}
                        onChange={(event) => updateFormField("website", event.target.value)}
                        placeholder="https://company.com"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="org-form-address">Address</FieldLabel>
                      <Textarea
                        id="org-form-address"
                        value={form.address}
                        onChange={(event) => updateFormField("address", event.target.value)}
                        placeholder="Street, city, state, postal code, country"
                        className="min-h-24"
                      />
                    </Field>
                  </FieldGroup>
                </section>
              </div>
            </DialogBody>

            <CardActions>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">{activeModal === "add" ? "Create organization" : "Save changes"}</Button>
            </CardActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "delete"} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={dialogShellClassNameCompact}>
          <DialogHeader className={dialogHeaderClassName}>
            <DialogTitle>Delete organization?</DialogTitle>
          </DialogHeader>

          {selectedOrganization ? (
            <>
              <DialogBody className={dialogBodyBeforeActionsClassName}>
                <DialogDescription>
                  <span className={typeScale.body.emphasis}>&ldquo;{selectedOrganization.name}&rdquo;</span>{" "}
                  and all associated workspace data will be permanently removed.
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

export { OrganizationPage }
