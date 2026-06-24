"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Boxes, CircleCheck, Clock, KeyRound, TriangleAlert } from "lucide-react"

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
import { CardContainer } from "@/components/ui/card-container"
import { ChartCard } from "@/components/ui/chart-card"
import { MetricCard } from "@/components/ui/metric-card"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { cn } from "@/lib/utils"
import { typeScale } from "@/lib/typography"

const HARDWARE_STATS = [
  { label: "Total Assets", value: "51", description: "— Stable vs prior month-end", icon: Boxes },
  { label: "Assigned", value: "2", description: "4% of fleet assigned", icon: CircleCheck },
  { label: "In Repair", value: "0", description: "Unavailable to deploy", icon: TriangleAlert },
  { label: "Warranty Expiring", value: "1", description: "Rolling 30-day window", icon: KeyRound },
] as const

/** Stretch alerts panel to match adjacent Recent Assets table height (Operations row). */
const OPERATIONS_ALERTS_CARD_CLASSNAME = "h-full"
const OPERATIONS_ALERTS_CONTENT_CLASSNAME = "flex flex-1 flex-col"

export function HardwareHealthTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {HARDWARE_STATS.map((stat) => (
          <MetricCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconVariant="badge"
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
          action={<ChartContextBadge eyebrow="Rolling window" meta="Eight months trailing" />}
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

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
        <CardContainer
          className="lg:col-span-2"
          title="Recent Assets"
          description="Latest hardware records onboarded into the tenant."
          action={
            <Button variant="ghost" asChild>
              <Link href="/hardware">
                View All
                <ArrowRight />
              </Link>
            </Button>
          }
        >
          <RecentAssetsTable />
        </CardContainer>

        <CardContainer
          variant="form"
          className={OPERATIONS_ALERTS_CARD_CLASSNAME}
          contentClassName={OPERATIONS_ALERTS_CONTENT_CLASSNAME}
          title="Hardware Alerts"
          description="Needs your attention"
          footer={
            <Button variant="outline" asChild>
              <Link href="/hardware">Open Hardware</Link>
            </Button>
          }
          footerClassName="*:w-full"
        >
          <div className="flex items-start gap-3 rounded-lg bg-muted px-3 py-2.5">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning/12 text-warning">
              <Clock className="size-4" strokeWidth={1.75} />
            </span>
            <p className={cn("pt-0.5", typeScale.body.default)}>
              <span className={typeScale.body.emphasis}>1 asset</span>{" "}
              <span className="text-muted-foreground">with warranty expiring in 30 days</span>
            </p>
          </div>
        </CardContainer>
      </div>
    </div>
  )
}
