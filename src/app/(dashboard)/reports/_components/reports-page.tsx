"use client"

import { useState } from "react"
import { toast } from "sonner"
import { BadgeCheck, FileText, HardDrive, Mail, Send, Sparkles } from "lucide-react"

import { CertificationsReportTab } from "./certifications/certifications-report-tab"
import { HardwareReportTab } from "./hardware/hardware-report-tab"
import { MailboxReportTab } from "./mailbox/mailbox-report-tab"
import { PromptReportTab } from "./prompt/prompt-report-tab"
import { SoftwareReportTab } from "./software/software-report-tab"
import { ReportExportMenu } from "./shared/report-export-menu"
import { ReportsExportProvider } from "./shared/reports-export-context"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { TabNav, type TabNavItem } from "@/components/ui/tab-nav"
import { Tabs, TabsContent } from "@/components/ui/tabs"

const REPORT_TABS: TabNavItem[] = [
  { value: "hardware", label: "Hardware", icon: HardDrive },
  { value: "software", label: "Software", icon: FileText },
  { value: "certifications", label: "Certifications", icon: BadgeCheck },
  { value: "mailbox", label: "Mail Box", icon: Mail, disabled: true },
  { value: "prompt", label: "Prompt", icon: Sparkles },
]

const reportPanelClassName = "mt-0 flex-none outline-none data-[state=inactive]:hidden"

function ReportsPage() {
  const [activeTab, setActiveTab] = useState("hardware")

  function handleSendToManagement() {
    toast.success("Report sent to management")
  }

  return (
    <>
      <Toaster position="top-right" closeButton richColors />

      <ReportsExportProvider>
        <PageHeader
          eyebrow="Filter findings · share with leadership"
          title="Reports"
          description="Drill into hardware, software, and mailbox reports, or use Prompt to ask about assets, licenses, or mailbox storage in plain language."
          actions={
            <>
              <ReportExportMenu />
              <Button
                className="bg-gradient-brand text-primary-foreground hover:opacity-90"
                onClick={handleSendToManagement}
                data-report-export-hide
              >
                <Send />
                Send to management
              </Button>
            </>
          }
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-4">
            <div className="relative z-10 shrink-0 overflow-x-auto pb-1" data-report-export-hide>
              <TabNav items={REPORT_TABS} size="lg" />
            </div>

            <TabsContent value="hardware" className={reportPanelClassName}>
              <HardwareReportTab />
            </TabsContent>

            <TabsContent value="software" className={reportPanelClassName}>
              <SoftwareReportTab />
            </TabsContent>

            <TabsContent value="certifications" className={reportPanelClassName}>
              <CertificationsReportTab />
            </TabsContent>

            <TabsContent value="mailbox" className={reportPanelClassName}>
              <MailboxReportTab />
            </TabsContent>

            <TabsContent value="prompt" className={reportPanelClassName}>
              <PromptReportTab />
            </TabsContent>
          </Tabs>
        </PageHeader>
      </ReportsExportProvider>
    </>
  )
}

export { ReportsPage }
