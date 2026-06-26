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
import { HardwareHealthTab } from "./hardware-asset-health/hardware-health-tab"
import { SoftwareHealthTab } from "./software-asset-health/software-health-tab"
import { typeScale } from "@/lib/typography"
import { accentIconTileClassName } from "@/lib/surface"
import { cn } from "@/lib/utils"
import MailboxHealthTab from "./mailbox-asset-health/mailbox-health-tab"

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
    <PageHeader
      eyebrow="Welcome back, John Doe"
      title="Portfolio Analytics Overview"
      description="Live KPIs synthesized from utilization, ingestion cadence, renewal pressure, and vendor-led seat concentration, designed for quick IT Ops and Finance reviews inside your tenant footprint."
    >
      {/* SECTION 1: Executive Signals */}
      <section className="flex flex-col gap-5">
        <Card className="gap-0 border border-primary/25 bg-linear-to-b from-primary/8 via-accent/30 to-card py-0 ring-1 ring-primary/15">
          <CardContent className="flex flex-col gap-8 p-(--card-spacing) sm:gap-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 flex-col gap-3">
                <SectionLabel>Executive Signals</SectionLabel>
                <div className="flex items-start gap-3">
                  <span className={cn(accentIconTileClassName, "mt-0.5")}>
                    <Target className="size-5" strokeWidth={1.75} />
                  </span>
                  <div className="flex min-w-0 flex-col gap-2">
                    <h2 className={cn(typeScale.heading, "text-xl")}>
                      Cross-domain readiness &amp; risk posture
                    </h2>
                    <p className={cn("max-w-3xl leading-relaxed", typeScale.body.muted)}>
                      Blends hardware posture (deployment depth, ingestion cadence) with entitlement economics
                      (seat burn-down, SaaS cliff risk, vendor concentration) without manual spreadsheet
                      stitching required.
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

            <div className="grid grid-cols-1 gap-5 *:h-full sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Record Density"
                icon={Layers}
                value="122"
                description="Tracked roster · 51 hardware assets · 71 active license contracts"
                footer={
                  <div className="flex flex-col gap-2">
                    <span className={cn(typeScale.caption.overline, "text-foreground")}>
                      Rolling 60-day intake
                    </span>
                    <p className={typeScale.caption.meta}>
                      Hardware <span className={typeScale.body.emphasis}>+51</span> · Software{" "}
                      <span className={typeScale.body.emphasis}>+71</span> net-new records surfaced in the
                      trailing two telemetry windows.
                    </p>
                    <p className={typeScale.caption.meta}>
                      1 distinct catalog categories materially represented across the hardware layer.
                    </p>
                  </div>
                }
              />

              <MetricCard label="Deployment Depth" icon={CircleCheck}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className={typeScale.body.muted}>Assigned Coverage</span>
                    <span className={typeScale.body.tabularEmphasis}>3.9%</span>
                  </div>
                  <Progress value={3.9} className="h-2" />
                  <p className={typeScale.body.muted}>
                    2 fielded units versus 51 total tags. Warehouse / staging buffer:{" "}
                    <span className={typeScale.body.emphasis}>49</span>.
                  </p>
                </div>
              </MetricCard>

              <MetricCard label="Seat Economics" icon={Users}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className={typeScale.body.muted}>Seat Consumption</span>
                    <span className={typeScale.body.tabularEmphasis}>2.6%</span>
                  </div>
                  <Progress value={2.6} className="h-2" />
                  <p className={typeScale.body.muted}>
                    Entitled 78 pooled seats · 2 allocated to employees or shared mailboxes today.
                  </p>
                  <div className="rounded-lg border border-dashed border-border px-3 py-2.5">
                    <p className={typeScale.body.muted}>
                      Largest vendor footprint: <span className={typeScale.body.emphasis}>META</span>{" "}
                      commanding ~64.1% of your entitled seat universe.
                    </p>
                  </div>
                </div>
              </MetricCard>

              <MetricCard
                label="Attention Radar"
                icon={TriangleAlert}
                value="~20"
                description="countable exposure units (warranty / repair / license cliffs)"
                descriptionClassName={typeScale.body.emphasis}
              >
                <ul className="flex flex-col gap-2.5">
                  {[
                    { label: "Hardware warranty cliffs (30d)", value: "0" },
                    { label: "Fleet in remediation", value: "0" },
                    { label: "SaaS renewals (60d + expired)", value: "20" },
                  ].map((row) => (
                    <li key={row.label} className="flex items-center justify-between gap-3">
                      <span className={typeScale.body.muted}>{row.label}</span>
                      <span className={typeScale.body.tabularEmphasis}>{row.value}</span>
                    </li>
                  ))}
                </ul>
              </MetricCard>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 2: Asset Health */}
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
            <MailboxHealthTab />
          </TabsContent>
        </Tabs>
      </section>
    </PageHeader>
  )
}
