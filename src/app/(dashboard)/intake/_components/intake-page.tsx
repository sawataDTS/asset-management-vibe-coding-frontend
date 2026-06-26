"use client"
import { AppWindow, FileSpreadsheet, HardDrive, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { TabNav, type TabNavItem } from "@/components/ui/tab-nav"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import HardwareIntakeForm from "./hardware-intake-form"
import SoftwareIntakeForm from "./software-intake-form"
import InvoiceIntakeForm from "./invoice-intake-form"
import CsvIntakeForm from "./csv-intake-form"

const INTAKE_TABS: TabNavItem[] = [
  { value: "hardware", label: "Hardware Inventory", icon: HardDrive },
  { value: "software", label: "Software License", icon: AppWindow },
  { value: "invoice", label: "By Invoice", icon: Sparkles },
  { value: "csv", label: "CSV Format", icon: FileSpreadsheet },
]

function IntakePage() {
  return (
    <PageHeader title="Intake" description="Manage hardware inventory and software licenses in one place.">
      <Tabs defaultValue="hardware" className="gap-4">
        <TabNav items={INTAKE_TABS} />

        <TabsContent value="hardware">
          <HardwareIntakeForm />
        </TabsContent>

        <TabsContent value="software">
          <SoftwareIntakeForm />
        </TabsContent>

        <TabsContent value="invoice">
          <InvoiceIntakeForm />
        </TabsContent>

        <TabsContent value="csv">
          <CsvIntakeForm />
        </TabsContent>
      </Tabs>
    </PageHeader>
  )
}

export { IntakePage }
