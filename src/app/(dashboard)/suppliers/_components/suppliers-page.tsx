"use client"

import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { SuppliersTable } from "./suppliers-table"
import { PageHeader } from "@/components/layout/PageHeader"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Button } from "@/components/ui/button"
import { CardContainer } from "@/components/ui/card-container"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { initialSuppliers, type Supplier } from "@/lib/suppliers/data"
import { cn } from "@/lib/utils"
import DeleteSupplierDialog from "./delete-supplier-dialog"
import AddEditSupplierDialog from "./add-edit-supplier-dialog"

type ActiveModal = "add" | "edit" | "delete" | null

const suppliersCardContentClassName = settingsControlClassName

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  const filteredSuppliers = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return suppliers.filter((supplier) => {
      return (
        supplier.name.toLowerCase().includes(q) ||
        supplier.category.toLowerCase().includes(q) ||
        supplier.contactName.toLowerCase().includes(q) ||
        supplier.contactEmail.toLowerCase().includes(q) ||
        supplier.contactPhone.toLowerCase().includes(q) ||
        supplier.website.toLowerCase().includes(q)
      )
    })
  }, [suppliers, searchQuery])

  function handleOpenModal(modal: ActiveModal, supplier: Supplier | null = null) {
    setSelectedSupplier(supplier)
    setActiveModal(modal)
  }

  function handleCloseModal() {
    setActiveModal(null)
    setSelectedSupplier(null)
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) handleCloseModal()
  }

  return (
    <>
      <PageHeader
        eyebrow="Vendor directory"
        // icon={Truck}
        title="Suppliers"
        description="Vendors providing your hardware and software."
        actions={
          <Button onClick={() => handleOpenModal("add")}>
            <Plus />
            Add supplier
          </Button>
        }
      >
        <CardContainer
          formControls
          contentClassName={cn("flex flex-col gap-4", suppliersCardContentClassName)}
        >
          <InputGroup className="max-w-xl min-w-[240px]">
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <SuppliersTable
            rows={filteredSuppliers}
            onEdit={(supplier) => handleOpenModal("edit", supplier)}
            onDelete={(supplier) => handleOpenModal("delete", supplier)}
          />
        </CardContainer>
      </PageHeader>

      {(activeModal === "add" || activeModal === "edit") && (
        <AddEditSupplierDialog
          open
          mode={activeModal}
          onOpenChange={handleDialogOpenChange}
          selectedSupplier={selectedSupplier}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === "delete" && selectedSupplier && (
        <DeleteSupplierDialog
          open
          onOpenChange={handleDialogOpenChange}
          selectedSupplier={selectedSupplier}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

export { SuppliersPage }
