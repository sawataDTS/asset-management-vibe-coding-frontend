"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  BarChart3,
  Plus,
  Target,
  Layers,
  CircleCheck,
  Users,
  TriangleAlert,
  HardDrive,
  AppWindow,
  Mail,
} from "lucide-react"

import { PageHeader } from "@/components/layout/PageHeader"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { TabNav, type TabNavItem } from "@/components/ui/tab-nav"
import { Progress } from "@/components/ui/progress"
import { MetricCard } from "@/components/ui/metric-card"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { HardwareHealthTab } from "./hardware-health-tab"
import { SoftwareHealthTab } from "./software-health-tab"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className={cn(typeScale.caption.overline, "tracking-widest")}>{children}</h3>
}

const HEALTH_TABS: (TabNavItem & { value: string })[] = [
  { value: "hardware", label: "Hardware", icon: HardDrive, badge: "51" },
  { value: "software", label: "Software", icon: AppWindow, badge: "71" },
  { value: "mailbox", label: "Mailbox", icon: Mail, badge: "78" },
]

export function OverviewPage() {
  const [healthTab, setHealthTab] = React.useState("hardware")

  function handleRefreshMailboxes() {
    toast.success("Mailboxes refreshed")
  }

  return (
    <>
      <PageHeader
        eyebrow="Welcome back, John Doe"
        title="Portfolio Analytics Overview"
        description="Live KPIs synthesized from utilization, ingestion cadence, renewal pressure, and vendor-led seat concentration—designed for quick IT Ops and Finance reviews inside your tenant footprint."
      >
        {/* SECTION 1 — Executive Signals */}
        <section className="flex flex-col gap-4">
          <Card className="gap-6 border border-primary/25 bg-linear-to-b from-primary/8 via-accent/30 to-card ring-1 ring-primary/15">
            <CardContent className="flex flex-col gap-10">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 flex-col gap-2.5">
                  <SectionLabel>Executive Signals</SectionLabel>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 mb-1 flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/80 text-primary ring-1 ring-primary/20">
                      <Target className="size-5" strokeWidth={1.75} />
                    </span>
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <h2 className={cn(typeScale.heading, "text-xl")}>
                        Cross-domain readiness &amp; risk posture
                      </h2>
                      <p className={cn("max-w-3xl", typeScale.body.muted)}>
                        Blends hardware posture (deployment depth, ingestion cadence) with entitlement
                        economics (seat burn-down, SaaS cliff risk, vendor concentration)—no manual
                        spreadsheet stitching required.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/reports">
                      <BarChart3 />
                      Detailed Reports
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/intake">
                      <Plus />
                      Intake Workspace
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label="Record Density"
                  icon={Layers}
                  value="122"
                  description="Tracked roster · 51 hardware assets · 71 active license contracts"
                  footer={
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold tracking-wide text-foreground uppercase">
                        Rolling 60-day intake
                      </span>
                      <span>
                        Hardware <span className="text-foreground">+51</span> · Software{" "}
                        <span className="text-foreground">+71</span> net-new records surfaced in the trailing
                        two telemetry windows.
                      </span>
                      <span>
                        1 distinct catalog categories materially represented across the hardware layer.
                      </span>
                    </div>
                  }
                />

                <MetricCard label="Deployment Depth" icon={CircleCheck}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assigned Coverage</span>
                    <span className="font-medium text-foreground tabular-nums">3.9%</span>
                  </div>
                  <Progress value={3.9} className="mt-2 h-2" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    2 fielded units versus 51 total tags. Warehouse / staging buffer:{" "}
                    <span className="text-foreground">49</span>.
                  </p>
                </MetricCard>

                <MetricCard label="Seat Economics" icon={Users}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Seat Consumption</span>
                    <span className="font-medium text-foreground tabular-nums">2.6%</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Entitled 78 pooled seats · 2 allocated to employees or shared mailboxes today.
                  </p>
                  <div className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                    Largest vendor footprint: <span className="font-medium text-foreground">META</span>{" "}
                    commanding ~64.1% of your entitled seat universe.
                  </div>
                </MetricCard>

                <MetricCard
                  label="Attention Radar"
                  icon={TriangleAlert}
                  value="~20"
                  description="countable exposure units (warranty / repair / license cliffs)"
                >
                  <ul className="mt-3 flex flex-col gap-2 text-sm">
                    {[
                      { label: "Hardware warranty cliffs (30d)", value: "0" },
                      { label: "Fleet in remediation", value: "0" },
                      { label: "SaaS renewals (60d + expired)", value: "20" },
                    ].map((row) => (
                      <li key={row.label} className="flex items-center justify-between">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="font-medium text-foreground tabular-nums">{row.value}</span>
                      </li>
                    ))}
                  </ul>
                </MetricCard>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SECTION 2 — Asset Health */}
        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Asset Health"
            description="Real-time posture across your hardware, software, and mailbox domains."
            actions={
              healthTab === "mailbox" ? (
                <Button variant="outline" onClick={handleRefreshMailboxes}>
                  <Mail />
                  Refresh mailboxes
                </Button>
              ) : healthTab === "software" ? (
                <Button asChild>
                  <Link href="/software">
                    <Plus />
                    Manage Software
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/hardware">
                    <Plus />
                    Manage Hardware
                  </Link>
                </Button>
              )
            }
          />
          <Tabs value={healthTab} onValueChange={setHealthTab} className="gap-4">
            <TabNav items={HEALTH_TABS} />

            <TabsContent value="hardware">
              <HardwareHealthTab />
            </TabsContent>

            <TabsContent value="software">
              <SoftwareHealthTab />
            </TabsContent>

            <TabsContent value="mailbox">
              <Card>
                <CardContent className="py-16">
                  <Empty className="border-0">
                    <EmptyHeader>
                      <EmptyMedia variant="icon" className="bg-accent text-primary">
                        <Mail />
                      </EmptyMedia>
                      <EmptyTitle>Mailbox overview</EmptyTitle>
                      <EmptyDescription>Coming soon — mailbox insights will appear here.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </PageHeader>
    </>
  )
}
