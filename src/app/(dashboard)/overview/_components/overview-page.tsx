"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  BarChart3,
  Plus,
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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { TabNav, type TabNavItem } from "@/components/ui/tab-nav"
import { Progress } from "@/components/ui/progress"
import { MetricCard } from "@/components/ui/metric-card"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { HardwareHealthTab } from "./hardware-health-tab"
import { SoftwareHealthTab } from "./software-health-tab"
import { typeScale } from "@/lib/typography"

const HEALTH_TABS: (TabNavItem & { value: string })[] = [
  { value: "hardware", label: "Hardware", icon: HardDrive, badge: "51" },
  { value: "software", label: "Software", icon: AppWindow, badge: "71" },
  { value: "mailbox", label: "Mailbox", icon: Mail, badge: "78" },
]

const ATTENTION_RADAR_ROWS = [
  { label: "Hardware warranty cliffs (30d)", value: "0" },
  { label: "Fleet in remediation", value: "0" },
  { label: "SaaS renewals (60d + expired)", value: "20" },
] as const

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
        actions={
          <>
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
          </>
        }
      >
        <section className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Record Density"
            icon={Layers}
            size="default"
            value="122"
            valueClassName="font-bold"
            description="Tracked roster · 51 hardware assets · 71 active license contracts"
            footer={
              <div className={cn("flex flex-col gap-1.5", typeScale.body.muted)}>
                <span className={cn(typeScale.caption.overline, "text-foreground")}>
                  Rolling 60-day intake
                </span>
                <p>
                  Hardware <span className={typeScale.body.emphasis}>+51</span> · Software{" "}
                  <span className={typeScale.body.emphasis}>+71</span> net-new records in the trailing
                  two telemetry windows.
                </p>
                <p>1 distinct catalog category represented across the hardware layer.</p>
              </div>
            }
          />

          <MetricCard label="Deployment Depth" icon={CircleCheck} size="default" value="3.9%" valueClassName="font-bold">
            <div className="mt-1 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className={typeScale.body.muted}>Assigned Coverage</span>
                <span className={typeScale.body.tabularEmphasis}>3.9%</span>
              </div>
              <Progress value={3.9} className="h-2 w-full" />
              <p className={typeScale.body.muted}>
                2 fielded units versus 51 total tags. Warehouse / staging buffer:{" "}
                <span className={typeScale.body.emphasis}>49</span>.
              </p>
            </div>
          </MetricCard>

          <MetricCard label="Seat Economics" icon={Users} size="default" value="2.6%" valueClassName="font-bold">
            <div className="mt-1 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className={typeScale.body.muted}>Seat Consumption</span>
                <span className={typeScale.body.tabularEmphasis}>2.6%</span>
              </div>
              <p className={typeScale.body.muted}>
                Entitled 78 pooled seats · 2 allocated to employees or shared mailboxes today.
              </p>
              <div className="rounded-lg border border-sidebar-border bg-muted/40 px-3 py-2.5">
                <p className={typeScale.body.muted}>
                  Largest vendor footprint{" "}
                  <Badge variant="secondary" className="align-middle">
                    META ~64.1%
                  </Badge>{" "}
                  of your entitled seat universe.
                </p>
              </div>
            </div>
          </MetricCard>

          <MetricCard
            label="Attention Radar"
            icon={TriangleAlert}
            size="default"
            value="~20"
            valueClassName="font-bold"
            description="Countable exposure units (warranty / repair / license cliffs)"
          >
            <ul className="mt-1 flex flex-col gap-2.5">
              {ATTENTION_RADAR_ROWS.map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-3">
                  <span className={typeScale.body.muted}>{row.label}</span>
                  <span className={typeScale.body.tabularEmphasis}>{row.value}</span>
                </li>
              ))}
            </ul>
          </MetricCard>
        </section>

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
