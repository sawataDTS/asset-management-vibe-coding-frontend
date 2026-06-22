"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Boxes,
  CircleCheck,
  Clock,
  KeyRound,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"

import {
  AssetGrowthChart,
  ChartContextBadge,
  LifecycleChart,
  LifecycleLegend,
  ProcurementPulseChart,
  TaxonomyChart,
} from "./hardware-health-charts"
import { RecentAssetsTable } from "./recent-assets-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { ChartCard } from "@/components/ui/chart-card"
import { MetricCard } from "@/components/ui/metric-card"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { cn } from "@/lib/utils"
import { typeScale } from "@/lib/typography"

type MetricTone = "primary" | "success" | "warning" | "info"

const METRIC_TONE_CLASS: Record<MetricTone, string> = {
  primary: "bg-accent/80 text-primary ring-primary/20",
  success: "bg-success/12 text-success ring-success/20",
  warning: "bg-warning/12 text-warning ring-warning/20",
  info: "bg-info/12 text-info ring-info/20",
}

function MetricIconBadge({ icon: Icon, tone }: { icon: LucideIcon; tone: MetricTone }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-border/60",
        METRIC_TONE_CLASS[tone]
      )}
    >
      <Icon className="size-4" strokeWidth={1.75} />
    </span>
  )
}

interface HealthStat {
  label: string
  value: string
  description: string
  icon: LucideIcon
  tone: MetricTone
}

const HARDWARE_STATS: HealthStat[] = [
  { label: "Total Assets", value: "51", description: "— Stable vs prior month-end", icon: Boxes, tone: "primary" },
  { label: "Assigned", value: "2", description: "4% of fleet assigned", icon: CircleCheck, tone: "success" },
  { label: "In Repair", value: "0", description: "Unavailable to deploy", icon: TriangleAlert, tone: "warning" },
  { label: "Warranty Expiring", value: "1", description: "Rolling 30-day window", icon: KeyRound, tone: "info" },
]

export function HardwareHealthTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {HARDWARE_STATS.map((stat) => (
          <MetricCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            action={<MetricIconBadge icon={stat.icon} tone={stat.tone} />}
            description={stat.description}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Asset Growth"
          description="Cumulative tracked assets over the last 8 months."
        >
          <AssetGrowthChart />
        </ChartCard>

        <ChartCard
          title="Lifecycle"
          description="Status breakdown of the current fleet."
          action={<LifecycleLegend />}
        >
          <LifecycleChart />
        </ChartCard>
      </div>

      <SectionHeading
        title="Insights"
        description="Procurement cadence and catalog concentration signals worth watching."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Procurement Pulse"
          description="Net-new hardware onboarding volume by calendar month—not cumulative stock—reveals bursts of capex-led activity versus dormant periods."
          action={
            <ChartContextBadge eyebrow="Rolling window" meta="Eight months trailing" />
          }
        >
          <ProcurementPulseChart />
        </ChartCard>

        <ChartCard
          title="Taxonomy Concentration"
          description="Which catalog labels absorb the plurality of capex-heavy units—helps spot imbalances before refresh cycles."
          action={<ChartContextBadge eyebrow="Top slices" meta="Showing 1 tier" />}
        >
          <TaxonomyChart />
        </ChartCard>
      </div>

      <SectionHeading
        title="Operations"
        description="Recently onboarded records and items that need your attention."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Assets</CardTitle>
            <CardDescription>Latest hardware records onboarded into the tenant.</CardDescription>
            <CardAction>
              <Button variant="ghost" asChild>
                <Link href="/hardware">
                  View All
                  <ArrowRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <RecentAssetsTable />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hardware Alerts</CardTitle>
            <CardDescription>Needs your attention</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning/12 text-warning">
                <Clock className="size-4" strokeWidth={1.75} />
              </span>
              <p className={cn("pt-0.5", typeScale.body.default)}>
                <span className="font-medium text-foreground">1 asset</span>{" "}
                <span className="text-muted-foreground">with warranty expiring in 30 days</span>
              </p>
            </div>

            <Button variant="outline" className="mt-auto w-full" asChild>
              <Link href="/hardware">Open Hardware</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
