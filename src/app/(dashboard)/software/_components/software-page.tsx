"use client"

import { useMemo, useState } from "react"
import {
  BadgeCheck,
  Clock,
  CreditCard,
  Layers3,
  Plus,
  Search,
  Users,
} from "lucide-react"

import { CustomSelect } from "@/components/custom/CustomSelect"
import { PageHeader } from "@/components/layout/PageHeader"
import { SoftwareLicensesTable } from "./software-licenses-table"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { CardContainer } from "@/components/ui/card-container"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { MetricCard } from "@/components/ui/metric-card"
import {
  initialLicenses,
  LICENSE_STATUSES,
  SOFTWARE_CATEGORIES,
  type SoftwareLicense,
} from "@/lib/software/data"

import { cn } from "@/lib/utils"
import AddEditSoftwareDialog from "./add-edit-software-dialog"
import ManageSeatSoftwareDialog from "./manage-seat-software-dialog"
import HistorySoftwareDialog from "./history-software-dialog"
import DeleteSoftwareDialog from "./delete-software-dialog"

type ActiveModal = "add" | "edit" | "seats" | "history" | "delete" | null

const softwareCardContentClassName = settingsControlClassName

function SoftwarePage() {
  const [licenses, setLicenses] = useState<SoftwareLicense[]>(initialLicenses)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [selectedLicense, setSelectedLicense] = useState<SoftwareLicense | null>(null)

  const kpis = useMemo(() => {
    let totalSeats = 0
    let assignedSeats = 0
    let expiringSoon = 0
    let totalCostNum = 0

    licenses.forEach((lic) => {
      totalSeats += lic.totalSeats
      assignedSeats += lic.assignedSeats
      if (lic.status === "Expiring Soon") expiringSoon++
      const costMatch = lic.cost.replace(/[^0-9]/g, "")
      const val = parseInt(costMatch, 10)
      if (!Number.isNaN(val)) totalCostNum += val
    })

    return {
      totalLicenses: licenses.length,
      assignedSeats,
      availableSeats: totalSeats - assignedSeats,
      expiringSoon,
      monthlySpend: `$${totalCostNum.toLocaleString()}/mo`,
    }
  }, [licenses])

  const filteredLicenses = useMemo(() => {
    return licenses.filter((lic) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        lic.name.toLowerCase().includes(q) ||
        lic.supplier.toLowerCase().includes(q) ||
        lic.key.toLowerCase().includes(q)
      const matchesStatus = selectedStatus === "All Statuses" || lic.status === selectedStatus
      const matchesCategory = selectedCategory === "All Categories" || lic.category === selectedCategory
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [licenses, searchQuery, selectedStatus, selectedCategory])

  function handleOpenModal(modal: ActiveModal, license: SoftwareLicense | null = null) {
    setSelectedLicense(license)
    setActiveModal(modal)
  }

  function handleCloseModal() {
    setActiveModal(null)
    setSelectedLicense(null)
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) handleCloseModal()
  }

  return (
    <>
      <PageHeader
        // icon={AppWindow}
        eyebrow="Apps, subscriptions & licensing"
        title="Software"
        description={`Track seat allocation, renewal dates, and subscription spend across vendors. ${filteredLicenses.length} of ${kpis.totalLicenses} subscriptions shown.`}
        actions={
          <Button onClick={() => handleOpenModal("add")}>
            <Plus />
            Add Subscription
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <MetricCard
            label="Subscriptions"
            value={String(kpis.totalLicenses)}
            icon={Layers3}
            iconVariant="badge"
          />
          <MetricCard
            label="Assigned Seats"
            value={kpis.assignedSeats.toLocaleString()}
            icon={Users}
            iconVariant="badge"
          />
          <MetricCard
            label="Available Seats"
            value={kpis.availableSeats.toLocaleString()}
            icon={BadgeCheck}
            iconVariant="badge"
          />
          <MetricCard
            label="Expiring Soon"
            value={String(kpis.expiringSoon)}
            icon={Clock}
            iconVariant="badge"
          />
          <MetricCard label="Monthly Spend" value={kpis.monthlySpend} icon={CreditCard} iconVariant="badge" />
        </div>

        <CardContainer
          formControls
          contentClassName={cn("flex flex-col gap-4", softwareCardContentClassName)}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
            <InputGroup className="min-w-[240px] flex-1">
              <InputGroupAddon>
                <Search className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search by license name, supplier, or key..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <CustomSelect
              className="w-full lg:w-44"
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(typeof value === "string" ? value : "All Statuses")}
              options={[
                { label: "All Statuses", value: "All Statuses" },
                ...LICENSE_STATUSES.map((status) => ({ label: status, value: status })),
              ]}
              showClear={false}
            />

            <CustomSelect
              className="w-full lg:w-48"
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(typeof value === "string" ? value : "All Categories")}
              options={[
                { label: "All Categories", value: "All Categories" },
                ...SOFTWARE_CATEGORIES.map((category) => ({ label: category, value: category })),
              ]}
              showClear={false}
            />
          </div>

          <SoftwareLicensesTable
            rows={filteredLicenses}
            onHistory={(license) => handleOpenModal("history", license)}
            onSeats={(license) => handleOpenModal("seats", license)}
            onEdit={(license) => handleOpenModal("edit", license)}
            onDelete={(license) => handleOpenModal("delete", license)}
          />
        </CardContainer>
      </PageHeader>

      {(activeModal === "add" || activeModal === "edit") && (
        <AddEditSoftwareDialog
          open={activeModal === "add" || activeModal === "edit"}
          activeModal={activeModal}
          onOpenChange={handleDialogOpenChange}
          handleCloseModal={handleCloseModal}
          selectedLicense={selectedLicense}
        />
      )}
      {activeModal === "seats" && (
        <ManageSeatSoftwareDialog
          open={activeModal === "seats"}
          onOpenChange={handleDialogOpenChange}
          selectedLicense={selectedLicense}
        />
      )}
      {activeModal === "history" && (
        <HistorySoftwareDialog
          open={activeModal === "history"}
          onOpenChange={handleDialogOpenChange}
          selectedLicense={selectedLicense}
        />
      )}
      {activeModal === "delete" && (
        <DeleteSoftwareDialog
          open={activeModal === "delete"}
          onOpenChange={handleDialogOpenChange}
          selectedLicense={selectedLicense}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  )
}

export { SoftwarePage }
