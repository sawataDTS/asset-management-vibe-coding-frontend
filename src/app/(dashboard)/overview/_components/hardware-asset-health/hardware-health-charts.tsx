"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

/** Brand primary — Asset Growth line, Procurement bars, Lifecycle “Assigned”. */
const HARDWARE_CHART_PRIMARY = "var(--color-primary)"
/** Primary + success mix — Lifecycle “In Stock”, Taxonomy bars (green accent in reference). */
const HARDWARE_CHART_ACCENT = "var(--color-chart-4)"

const assetGrowthData = [
  { month: "Dec", assets: 0 },
  { month: "Jan", assets: 0 },
  { month: "Feb", assets: 0 },
  { month: "Mar", assets: 0 },
  { month: "Apr", assets: 0 },
  { month: "May", assets: 0 },
  { month: "Jun", assets: 51 },
  { month: "Jul", assets: 51 },
]

const assetGrowthConfig = {
  assets: { label: "Total assets", color: HARDWARE_CHART_PRIMARY },
} satisfies ChartConfig

export function AssetGrowthChart() {
  return (
    <ChartContainer config={assetGrowthConfig} className="h-56 w-full">
      <AreaChart data={assetGrowthData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="hardwareAssetGrowthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={HARDWARE_CHART_PRIMARY} stopOpacity={0.4} />
            <stop offset="100%" stopColor={HARDWARE_CHART_PRIMARY} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={4} width={36} allowDecimals={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="assets"
          type="monotone"
          stroke={HARDWARE_CHART_PRIMARY}
          strokeWidth={2}
          fill="url(#hardwareAssetGrowthFill)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0, fill: HARDWARE_CHART_PRIMARY }}
        />
      </AreaChart>
    </ChartContainer>
  )
}

const lifecycleData = [
  { status: "assigned", label: "Assigned", value: 2, fill: HARDWARE_CHART_PRIMARY },
  { status: "inStock", label: "In Stock", value: 49, fill: HARDWARE_CHART_ACCENT },
] as const

const lifecycleConfig = {
  value: { label: "Units" },
  assigned: { label: "Assigned", color: HARDWARE_CHART_PRIMARY },
  inStock: { label: "In Stock", color: HARDWARE_CHART_ACCENT },
} satisfies ChartConfig

export function LifecycleLegend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-3", className)}>
      {lifecycleData.map((item) => (
        <li key={item.status} className={cn("flex items-center gap-1.5", typeScale.caption.meta)}>
          <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.fill }} aria-hidden />
          <span className="text-muted-foreground">{item.label}</span>
          <span className="font-medium text-foreground tabular-nums">{item.value}</span>
        </li>
      ))}
    </ul>
  )
}

export function LifecycleChart() {
  return (
    <ChartContainer config={lifecycleConfig} className="mx-auto aspect-square h-48 w-full max-w-52">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="label" hideLabel />} />
        <Pie
          data={lifecycleData}
          dataKey="value"
          nameKey="label"
          innerRadius={52}
          outerRadius={84}
          strokeWidth={3}
          paddingAngle={2}
          minAngle={8}
        >
          {lifecycleData.map((entry) => (
            <Cell key={entry.status} fill={entry.fill} stroke="var(--color-card)" />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

const procurementData = [
  { month: "Nov", count: 0 },
  { month: "Dec", count: 0 },
  { month: "Jan", count: 0 },
  { month: "Feb", count: 0 },
  { month: "Mar", count: 0 },
  { month: "Apr", count: 0 },
  { month: "May", count: 7 },
  { month: "Jun", count: 51 },
]

const procurementConfig = {
  count: { label: "Net-new", color: HARDWARE_CHART_PRIMARY },
} satisfies ChartConfig

export function ProcurementPulseChart() {
  return (
    <ChartContainer config={procurementConfig} className="h-52 w-full">
      <BarChart data={procurementData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={4} width={36} allowDecimals={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill={HARDWARE_CHART_PRIMARY} radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ChartContainer>
  )
}

const taxonomyData = [
  { category: "laptop", count: 51 },
  { category: "Desktop", count: 21 },
  { category: "Monitor", count: 10 },
]

const taxonomyConfig = {
  count: { label: "Units", color: HARDWARE_CHART_ACCENT },
} satisfies ChartConfig

export function TaxonomyChart() {
  return (
    <ChartContainer config={taxonomyConfig} className="h-52 w-full">
      <BarChart data={taxonomyData} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="category"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={72}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" fill={HARDWARE_CHART_ACCENT} radius={[0, 6, 6, 0]} maxBarSize={48} />
      </BarChart>
    </ChartContainer>
  )
}

export function ChartContextBadge({ eyebrow, meta }: { eyebrow: string; meta: string }) {
  return (
    <div className="flex flex-col items-end gap-0.5 text-right">
      <span className={typeScale.caption.overline}>{eyebrow}</span>
      <span className={typeScale.caption.meta}>{meta}</span>
    </div>
  )
}
