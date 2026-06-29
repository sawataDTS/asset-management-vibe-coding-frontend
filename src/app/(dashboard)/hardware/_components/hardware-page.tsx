"use client"

import { useMemo, useState } from "react"
import { Archive, HardDrive, Package, Plus, Search, UserCheck, Wrench } from "lucide-react"
import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { HardwareAssetsTable } from "./hardware-assets-table"
import { PageHeader } from "@/components/layout/PageHeader"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { CardContainer } from "@/components/ui/card-container"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { MetricCard } from "@/components/ui/metric-card"

import {
  ASSET_STATUSES,
  HARDWARE_CATEGORIES,
  HARDWARE_EMPLOYEES,
  initialHardwareAssets,
  type HardwareAsset,
} from "@/lib/hardware/data"

import { cn } from "@/lib/utils"
import AddEditHardwareDialog from "./add-edit-hardware-dialog"
import AssignHardwareDialog from "./assign-hardware-dialog"
import RepairHardwareDialog from "./repair-hardware-dialog"
import HistoryHardwareDialog from "./history-hardware-dialog"
import DeleteHardwareDialog from "./delete-hardware-dialog"

type ActiveModal = "add" | "edit" | "assign" | "repair" | "history" | "delete" | null

const hardwareCardContentClassName = settingsControlClassName

function HardwarePage() {
  const [assets, setAssets] = useState<HardwareAsset[]>(initialHardwareAssets)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [selectedAsset, setSelectedAsset] = useState<HardwareAsset | null>(null)
  const [selectedAssignee, setSelectedAssignee] = useState<string>(HARDWARE_EMPLOYEES[0])

  const kpis = useMemo(() => {
    const total = assets.length
    const assigned = assets.filter((a) => a.status === "Assigned").length
    const inStock = assets.filter((a) => a.status === "In Stock").length
    const inRepair = assets.filter((a) => a.status === "Repair").length
    const retired = assets.filter((a) => a.status === "Retired").length
    return { total, assigned, inStock, inRepair, retired }
  }, [assets])

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        asset.name.toLowerCase().includes(q) ||
        asset.tag.toLowerCase().includes(q) ||
        asset.serial.toLowerCase().includes(q) ||
        asset.supplier.toLowerCase().includes(q)
      const matchesStatus = selectedStatus === "All Statuses" || asset.status === selectedStatus
      const matchesCategory = selectedCategory === "All Categories" || asset.category === selectedCategory
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [assets, searchQuery, selectedStatus, selectedCategory])

  function handleOpenModal(modal: ActiveModal, asset: HardwareAsset | null = null) {
    setSelectedAsset(asset)
    setActiveModal(modal)
  }

  function handleCloseModal() {
    setActiveModal(null)
    setSelectedAsset(null)
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) handleCloseModal()
  }

  return (
    <>
      <PageHeader
        // icon={HardDrive}
        eyebrow="Inventory"
        title="Hardware"
        description={`Track laptops, monitors, peripherals, and their assignment status across your organization. ${filteredAssets.length} of ${kpis.total} assets shown.`}
        actions={
          <Button onClick={() => handleOpenModal("add")}>
            <Plus />
            Add Asset
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <MetricCard label="Total Assets" value={String(kpis.total)} icon={HardDrive} iconVariant="badge" />
          <MetricCard label="Assigned" value={String(kpis.assigned)} icon={UserCheck} iconVariant="badge" />
          <MetricCard label="In Stock" value={String(kpis.inStock)} icon={Package} iconVariant="badge" />
          <MetricCard label="In Repair" value={String(kpis.inRepair)} icon={Wrench} iconVariant="badge" />
          <MetricCard label="Retired" value={String(kpis.retired)} icon={Archive} iconVariant="badge" />
        </div>

        <CardContainer
          formControls
          contentClassName={cn("flex flex-col gap-4", hardwareCardContentClassName)}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
            <InputGroup className="min-w-[240px] flex-1">
              <InputGroupAddon>
                <Search className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search by name, tag, serial, or supplier..."
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
                ...ASSET_STATUSES.map((status) => ({
                  label: status === "Repair" ? "In Repair" : status,
                  value: status,
                })),
              ]}
              showClear={false}
            />

            <CustomSelect
              className="w-full lg:w-48"
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(typeof value === "string" ? value : "All Categories")}
              options={toSelectOptions(HARDWARE_CATEGORIES)}
              showClear={false}
            />
          </div>

          <HardwareAssetsTable
            rows={filteredAssets}
            onHistory={(asset) => handleOpenModal("history", asset)}
            onAssign={(asset) => handleOpenModal("assign", asset)}
            onRepair={(asset) => handleOpenModal("repair", asset)}
            onEdit={(asset) => handleOpenModal("edit", asset)}
            onDelete={(asset) => handleOpenModal("delete", asset)}
          />
        </CardContainer>
      </PageHeader>

      {(activeModal === "add" || activeModal === "edit") && (
        <AddEditHardwareDialog
          open={activeModal === "add" || activeModal === "edit"}
          activeModal={activeModal}
          onOpenChange={handleDialogOpenChange}
          handleCloseModal={handleCloseModal}
          selectedAsset={selectedAsset}
        />
      )}
      {activeModal === "assign" && (
        <AssignHardwareDialog
          open={activeModal === "assign"}
          activeModal={activeModal}
          onOpenChange={handleDialogOpenChange}
          handleCloseModal={handleCloseModal}
          selectedAsset={selectedAsset}
          selectedAssignee={selectedAssignee}
          setSelectedAssignee={setSelectedAssignee}
        />
      )}
      {activeModal === "repair" && (
        <RepairHardwareDialog
          open={activeModal === "repair"}
          activeModal={activeModal}
          onOpenChange={handleDialogOpenChange}
          handleCloseModal={handleCloseModal}
          selectedAsset={selectedAsset}
        />
      )}
      {activeModal == "history" && (
        <HistoryHardwareDialog
          open={activeModal === "history"}
          onOpenChange={handleDialogOpenChange}
          selectedAsset={selectedAsset}
        />
      )}
      {activeModal == "delete" && (
        <DeleteHardwareDialog
          open={activeModal === "delete"}
          onOpenChange={handleDialogOpenChange}
          handleCloseModal={handleCloseModal}
          selectedAsset={selectedAsset}
        />
      )}
    </>
  )
}

export { HardwarePage }
