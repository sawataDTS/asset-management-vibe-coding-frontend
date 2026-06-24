"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Clock, DollarSign, KeyRound, TrendingUp, Users, type LucideIcon } from "lucide-react"

import { RecentLicensesTable } from "./recent-licenses-table"
import {
  CommercialVelocityChart,
  SoftwareLicenseLegend,
  SoftwareLicensesChart,
  VendorSeatConcentrationChart,
} from "./software-health-charts"
import { Button } from "@/components/ui/button"
import { CardContainer } from "@/components/ui/card-container"
import { ChartCard } from "@/components/ui/chart-card"
import { MetricCard } from "@/components/ui/metric-card"
import { cn } from "@/lib/utils"
import { typeScale } from "@/lib/typography"

function MetricFooter({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      {children}
    </span>
  )
}

/** Stretch alerts panel to match adjacent Recent Licenses table height (Operations row). */
const OPERATIONS_ALERTS_CARD_CLASSNAME = "h-full"
const OPERATIONS_ALERTS_CONTENT_CLASSNAME = "flex flex-1 flex-col"

export function SoftwareHealthTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Licenses"
          value="71"
          icon={KeyRound}
          iconVariant="badge"
          footer={
            <MetricFooter icon={TrendingUp}>
              <span>
                <span className={typeScale.body.emphasis}>51 Active</span>
                <span className="text-muted-foreground"> · +71 New vs prior month</span>
              </span>
            </MetricFooter>
          }
        />

        <MetricCard
          label="Seats Used"
          value="2"
          icon={Users}
          iconVariant="badge"
          footer={
            <MetricFooter icon={Users}>
              <span>
                <span className={typeScale.body.emphasis}>3%</span>
                <span className="text-muted-foreground"> of 78 seats</span>
              </span>
            </MetricFooter>
          }
        />

        <MetricCard
          label="Expiring Soon"
          value="20"
          icon={Clock}
          iconVariant="badge"
          footer={
            <MetricFooter icon={Clock}>
              <span className="text-muted-foreground">Next 60-day window</span>
            </MetricFooter>
          }
        />

        <MetricCard
          label="Annual Spend"
          value="$5,300"
          icon={DollarSign}
          iconVariant="badge"
          footer={
            <MetricFooter icon={DollarSign}>
              <span className="text-muted-foreground">≈ $68 / seat / year</span>
            </MetricFooter>
          }
        />
      </div>

      <ChartCard
        title="Software Licenses"
        description="Active vs. Expiring (Next 60 Days) Over the Last 8 Months"
        action={<SoftwareLicenseLegend />}
      >
        <SoftwareLicensesChart />
      </ChartCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Commercial Velocity"
          description="Tracks how aggressively new SKU lines are boarded into the entitlement ledger—not renewals—which is why it can spike around quarter-end purchasing pushes."
          eyebrow="Contract adds"
          meta="Net-new onboarding"
        >
          <CommercialVelocityChart />
        </ChartCard>

        <ChartCard
          title="Vendor Seat Concentration"
          description="Normalized pooled seats—not spend—expose where shadow IT risk accumulates whenever a mono-vendor SKU consumes unbalanced capacity."
          eyebrow="Ranking"
          meta="Top publishers"
        >
          <VendorSeatConcentrationChart />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
        <CardContainer
          className="lg:col-span-2"
          title="Recent Licenses"
          description="Latest software subscriptions onboarded into the tenant."
          action={
            <Button variant="ghost" asChild>
              <Link href="/software">
                View All
                <ArrowRight />
              </Link>
            </Button>
          }
        >
          <RecentLicensesTable />
        </CardContainer>

        <CardContainer
          variant="form"
          className={OPERATIONS_ALERTS_CARD_CLASSNAME}
          contentClassName={OPERATIONS_ALERTS_CONTENT_CLASSNAME}
          title="Software Alerts"
          description="Needs your attention"
          footer={
            <Button variant="outline" asChild>
              <Link href="/software">
                <KeyRound />
                Open Software
              </Link>
            </Button>
          }
          footerClassName="*:w-full"
        >
          <div className="flex items-start gap-3 rounded-lg bg-muted px-3 py-2.5">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning/12 text-warning">
              <Clock className="size-4" strokeWidth={1.75} />
            </span>
            <p className={cn("pt-0.5", typeScale.body.default)}>
              <span className={typeScale.body.emphasis}>20 licenses</span>{" "}
              <span className="text-muted-foreground">expiring within 60 days</span>
            </p>
          </div>
        </CardContainer>
      </div>
    </div>
  )
}
