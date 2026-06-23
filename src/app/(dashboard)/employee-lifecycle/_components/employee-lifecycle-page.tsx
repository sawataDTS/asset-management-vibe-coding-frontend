"use client"

import * as React from "react"
import { useCallback, useState } from "react"
import {
  ClipboardCheck,
  History,
  Sparkles,
  UserMinus,
  UserPlus,
} from "lucide-react"

import { DepartmentsTab } from "./departments-tab"
import { GenerateLabelTab } from "./generate-label-tab"
import { HistoryTab } from "./history-tab"
import { OffboardingTab } from "./offboarding-tab"
import { OnboardingTab } from "./onboarding-tab"
import { PageHeader } from "@/components/layout/PageHeader"
import { TabNav, type TabNavItem } from "@/components/ui/tab-nav"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  initialActiveOffboardings,
  initialDepartmentTemplates,
  initialLabelEmployees,
  initialLifecycleHistory,
  initialOffboardingCandidates,
  initialPendingOnboarding,
  type ActiveOffboarding,
  type DepartmentTemplate,
  type LifecycleHistoryEntry,
  type OffboardingCandidate,
} from "@/lib/employee-lifecycle/data"

const LIFECYCLE_TABS: TabNavItem[] = [
  { value: "departments", label: "Departments", icon: UserPlus },
  { value: "onboarding", label: "Onboarding", icon: Sparkles },
  { value: "generate-label", label: "Generate Label", icon: ClipboardCheck },
  { value: "offboarding", label: "Offboarding", icon: UserMinus },
  { value: "history", label: "History", icon: History },
]

function EmployeeLifecyclePage() {
  const [activeTab, setActiveTab] = useState("departments")
  const [templates, setTemplates] = useState<DepartmentTemplate[]>(initialDepartmentTemplates)
  const [history, setHistory] = useState<LifecycleHistoryEntry[]>(initialLifecycleHistory)
  const [offboardingCandidates, setOffboardingCandidates] = useState<OffboardingCandidate[]>(
    initialOffboardingCandidates
  )
  const [activeOffboardings, setActiveOffboardings] = useState<ActiveOffboarding[]>(
    initialActiveOffboardings
  )

  const handleHistoryAdd = useCallback((entry: LifecycleHistoryEntry) => {
    setHistory((prev) => [entry, ...prev])
  }, [])

  return (
    <>
      <PageHeader
        eyebrow="Workflows"
        title="Department onboarding & offboarding"
        description="Configure per-department provisioning rules, then onboard or offboard employees in one click."
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-6">
          <TabNav items={LIFECYCLE_TABS} />

          <TabsContent value="departments">
            <DepartmentsTab templates={templates} onTemplatesChange={setTemplates} />
          </TabsContent>

          <TabsContent value="onboarding">
            <OnboardingTab employees={initialPendingOnboarding} />
          </TabsContent>

          <TabsContent value="generate-label">
            <GenerateLabelTab employees={initialLabelEmployees} />
          </TabsContent>

          <TabsContent value="offboarding" forceMount className={activeTab === "offboarding" ? undefined : "hidden"}>
            <OffboardingTab
              candidates={offboardingCandidates}
              activeOffboardings={activeOffboardings}
              onCandidatesChange={setOffboardingCandidates}
              onActiveOffboardingsChange={setActiveOffboardings}
              onHistoryAdd={handleHistoryAdd}
            />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab entries={history} />
          </TabsContent>
        </Tabs>
      </PageHeader>
    </>
  )
}

export { EmployeeLifecyclePage }
