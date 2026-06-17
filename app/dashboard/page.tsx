"use client"
import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ActivityIcon,
  BadgeCheckIcon,
  BoxesIcon,
  ChartNoAxesCombinedIcon,
  CpuIcon,
  HardDriveIcon,
  ShieldAlertIcon,
  WrenchIcon,
} from "lucide-react"
import { ChartCard } from "@/components/dashboard/chart-card"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { MetricCard } from "@/components/dashboard/metric-card"
import { SectionHeader } from "@/components/dashboard/section-header"
import {
  StatusBadge,
  type AssetStatus,
} from "@/components/dashboard/status-badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type RecentAsset = {
  asset: string
  assetId: string
  assignee: string
  status: AssetStatus
  warranty: string
}

const executiveSignals = [
  {
    icon: BadgeCheckIcon,
    iconColor: "text-blue-600",
    title: "Record Density",
    value: "92%",
    description: "Coverage across devices, owners, and lifecycle events.",
    progress: 92,
  },
  {
    icon: ChartNoAxesCombinedIcon,
    iconColor: "text-violet-600",
    title: "Deployment Depth",
    value: "74%",
    description: "Endpoint reach across regions and business units.",
    progress: 74,
  },
  {
    icon: ActivityIcon,
    iconColor: "text-emerald-600",
    title: "Seat Economics",
    value: "1.18×",
    description: "Paid seats vs. active users (90-day trailing).",
    progress: 62,
  },
  {
    icon: ShieldAlertIcon,
    iconColor: "text-amber-600",
    title: "Attention Radar",
    value: "Low",
    description: "Issues clustered in 3 vendors and 2 hardware cohorts.",
    progress: 28,
  },
] as const

const assetGrowth = [
  { month: "Nov", total: 920 },
  { month: "Dec", total: 980 },
  { month: "Jan", total: 1040 },
  { month: "Feb", total: 1115 },
  { month: "Mar", total: 1202 },
  { month: "Apr", total: 1280 },
  { month: "May", total: 1375 },
  { month: "Jun", total: 1460 },
]

const lifecycle = [
  { name: "Assigned", value: 972 },
  { name: "In Stock", value: 488 },
]

const procurementPulse = [
  { label: "Laptops", value: 46 },
  { label: "Monitors", value: 22 },
  { label: "Phones", value: 15 },
  { label: "Accessories", value: 9 },
  { label: "Other", value: 6 },
]

const taxonomyConcentration = [
  { label: "Apple", value: 62 },
  { label: "Dell", value: 18 },
  { label: "Lenovo", value: 12 },
  { label: "HP", value: 8 },
]

const recentAssets: RecentAsset[] = [
  {
    asset: "MacBook Pro 14” (M3 Pro)",
    assetId: "HW-48219",
    assignee: "Mahesh Raja",
    status: "Assigned",
    warranty: "Aug 22, 2027",
  },
  {
    asset: "Dell UltraSharp U2723QE",
    assetId: "HW-39104",
    assignee: "In Stock",
    status: "In Stock",
    warranty: "Feb 11, 2028",
  },
  {
    asset: "iPhone 15 Pro",
    assetId: "HW-15572",
    assignee: "Asha Nair",
    status: "Repair",
    warranty: "Dec 04, 2026",
  },
  {
    asset: "Lenovo ThinkPad X1 Carbon",
    assetId: "HW-22981",
    assignee: "Rahul Menon",
    status: "Assigned",
    warranty: "Mar 18, 2027",
  },
  {
    asset: "MacBook Air 13” (M2)",
    assetId: "HW-11806",
    assignee: "Retired Pool",
    status: "Retired",
    warranty: "Expired",
  },
]

const tableColumns: ColumnDef<RecentAsset>[] = [
  {
    key: "asset",
    header: "Asset",
    cell: (row) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">{row.asset}</div>
      </div>
    ),
    className: "w-[36%]",
  },
  { key: "assetId", header: "Asset ID", cell: (row) => row.assetId },
  { key: "assignee", header: "Assignee", cell: (row) => row.assignee },
  {
    key: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} />,
  },
  { key: "warranty", header: "Warranty", cell: (row) => row.warranty },
]

export default function Page() {
  return (
    <DashboardShell title="Overview">
      {/* Executive Signals (hero panel) */}
      <section className="rounded-2xl border border-border bg-[#F0F9FF] p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="text-sm text-muted-foreground">
              Welcome back,{" "}
              <span className="font-medium text-foreground">Mahesh Raja</span>
            </div>
            <div className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Portfolio Analytics Overview
            </div>
            <div className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Live KPIs synthesized from utilization, ingestion cadence, renewal pressure, and vendor-led seat
              concentration—designed for executive readiness reviews and audit-grade reporting.
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button variant="outline" className="bg-white/70">
              Detailed Reports
            </Button>
            <Button>Intake Workspace</Button>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {executiveSignals.map((m) => (
            <MetricCard key={m.title} {...m} />
          ))}
        </div>
      </section>

      {/* Asset Health */}
      <section className="mt-10 space-y-5">
        <SectionHeader
          title="Asset Health"
          description="Operational posture across inventory readiness, repairs, and warranty pressure."
          actions={<Button variant="outline">Manage Assets</Button>}
        />

        <DashboardCard className="p-6">
          <Tabs defaultValue="hardware" className="w-full sm:w-auto">
            <TabsList variant="default">
              <TabsTrigger value="hardware">Hardware</TabsTrigger>
              <TabsTrigger value="software">Software</TabsTrigger>
              <TabsTrigger value="mailbox">Mailbox</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              <KpiCard
                icon={BoxesIcon}
                iconColor="text-blue-600"
                label="Total Assets"
                value="1,460"
                helper="Across all tracked endpoints."
                trend={{ direction: "up", value: "+6.1%", label: "8-month trailing" }}
              />
              <KpiCard
                icon={CpuIcon}
                iconColor="text-violet-600"
                label="Assigned"
                value="972"
                helper="Actively in use by employees."
                trend={{ direction: "up", value: "+3.4%", label: "vs last month" }}
              />
              <KpiCard
                icon={WrenchIcon}
                iconColor="text-amber-600"
                label="In Repair"
                value="14"
                helper="Awaiting parts or service return."
                trend={{ direction: "down", value: "-2", label: "week-over-week" }}
              />
              <KpiCard
                icon={HardDriveIcon}
                iconColor="text-emerald-600"
                label="Warranty Expiring"
                value="31"
                helper="Devices expiring in the next 60 days."
                trend={{ direction: "up", value: "+7", label: "since last review" }}
              />
            </div>

            <div className="rounded-2xl border border-border bg-muted/40 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium tracking-tight">Readiness Summary</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <span className="size-2 rounded-full bg-emerald-500/70" />
                    Healthy
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="size-2 rounded-full bg-amber-500/70" />
                    Watch
                  </span>
                </div>
              </div>
              <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Overall posture remains strong. Repairs are concentrated in two cohorts and warranty pressure is
                rising in a single region. Recommend proactive refresh on top 10 expiring devices.
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="text-xs font-medium text-muted-foreground">Highest Exposure</div>
                  <div className="mt-1 text-sm font-medium">Warranty cliff (60d)</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    31 devices · 4 teams impacted
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="text-xs font-medium text-muted-foreground">Most Concentrated</div>
                  <div className="mt-1 text-sm font-medium">Apple fleet</div>
                  <div className="mt-1 text-xs text-muted-foreground">62% share · stable</div>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </section>

      {/* 4) Analytics */}
      <section className="mt-6 grid gap-3 lg:grid-cols-2">
        <ChartCard title="Asset Growth" description="Last 8 months">
          <ChartContainer
            className="h-[240px] w-full"
            config={{
              total: { label: "Total", color: "var(--chart-1)" },
            }}
          >
            <AreaChart
              data={assetGrowth}
              margin={{ left: 6, right: 10, top: 10, bottom: 0 }}
            >
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs"
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--color-total)"
                fill="color-mix(in oklab, var(--color-total), transparent 82%)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard
          title="Lifecycle Breakdown"
          description="Assigned vs. In Stock"
        >
          <div className="grid gap-4 sm:grid-cols-[220px_1fr] sm:items-center">
            <ChartContainer
              className="h-[220px] w-full"
              config={{
                Assigned: { label: "Assigned", color: "var(--chart-1)" },
                "In Stock": { label: "In Stock", color: "var(--chart-2)" },
              }}
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Pie
                  data={lifecycle}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={64}
                  outerRadius={92}
                  paddingAngle={2}
                >
                  {lifecycle.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        entry.name === "Assigned"
                          ? "var(--color-Assigned)"
                          : "var(--color-In\\ Stock)"
                      }
                      stroke="transparent"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="space-y-3">
              {lifecycle.map((row) => (
                <div
                  key={row.name}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        row.name === "Assigned" ? "bg-chart-1" : "bg-chart-2"
                      )}
                    />
                    <div className="text-sm text-muted-foreground">
                      {row.name}
                    </div>
                  </div>
                  <div className="font-mono text-sm font-medium tabular-nums">
                    {row.value.toLocaleString()}
                  </div>
                </div>
              ))}
              <div className="pt-1 text-xs text-muted-foreground">
                Distribution stabilizes once intake cadence stays above 95%.
              </div>
            </div>
          </div>
        </ChartCard>
      </section>

      {/* 5) Insights */}
      <section className="mt-6 grid gap-3 lg:grid-cols-2">
        <ChartCard
          title="Procurement Pulse"
          description="Category demand (rolling 30 days)"
        >
          <ChartContainer
            className="h-[240px] w-full"
            config={{
              value: { label: "Requests", color: "var(--chart-1)" },
            }}
          >
            <BarChart
              data={procurementPulse}
              margin={{ left: 8, right: 10, top: 10, bottom: 0 }}
            >
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={24}
                className="text-xs"
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="value"
                radius={[8, 8, 8, 8]}
                fill="var(--color-value)"
              />
            </BarChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard
          title="Taxonomy Concentration"
          description="Vendor share by hardware fleet"
        >
          <ChartContainer
            className="h-[240px] w-full"
            config={{
              value: { label: "Share", color: "var(--chart-1)" },
            }}
          >
            <BarChart
              layout="vertical"
              data={taxonomyConcentration}
              margin={{ left: 10, right: 10, top: 10, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="label"
                axisLine={false}
                tickLine={false}
                width={70}
                className="text-xs"
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="value"
                radius={[10, 10, 10, 10]}
                fill="var(--color-value)"
              />
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </section>

      {/* 6 + 7) Recent Assets + Hardware Alerts */}
      <section className="mt-6 grid gap-3 lg:grid-cols-[1fr_320px]">
        <DashboardCard className="p-5">
          <SectionHeader
            title="Recent Assets"
            description="Latest updates across assigned inventory, intake, and service events."
            actions={<Button variant="outline">View All</Button>}
          />
          <div className="mt-4">
            <DataTable columns={tableColumns} rows={recentAssets} />
          </div>
        </DashboardCard>

        <DashboardCard className="p-5">
          <SectionHeader
            title="Hardware Alerts"
            description="Proactive queue for expiring warranties and repair backlog."
          />
          <div className="mt-5 rounded-2xl border border-border/60 bg-muted/30 p-4">
            <div className="text-sm font-medium tracking-tight">
              All Clear — No Action Needed
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              No devices currently require immediate attention.
            </div>
          </div>
          <div className="mt-4">
            <Button className="w-full">Open Hardware</Button>
          </div>
        </DashboardCard>
      </section>
    </DashboardShell>
  )
}
