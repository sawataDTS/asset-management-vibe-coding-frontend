"use client"

import * as React from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { typeScale } from "@/lib/typography"

const licenseTrendData = [
  { month: "Dec", active: 0, expiring: 0 },
  { month: "Jan", active: 0, expiring: 0 },
  { month: "Feb", active: 0, expiring: 0 },
  { month: "Mar", active: 0, expiring: 0 },
  { month: "Apr", active: 0, expiring: 0 },
  { month: "May", active: 0, expiring: 0 },
  { month: "Jun", active: 75, expiring: 20 },
  { month: "Jul", active: 51, expiring: 0 },
]

const licenseTrendConfig = {
  active: { label: "Active", color: "var(--color-success)" },
  expiring: { label: "Expiring Soon", color: "var(--color-warning)" },
} satisfies ChartConfig

const LICENSE_LEGEND = [
  { key: "active", label: "Active", value: 51, className: "bg-success" },
  { key: "expiring", label: "Expiring", value: 20, className: "bg-warning" },
  { key: "expired", label: "Expired", value: 0, className: "bg-destructive" },
] as const

export function SoftwareLicenseLegend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-3", className)}>
      {LICENSE_LEGEND.map((item) => (
        <li key={item.key} className={cn("flex items-center gap-1.5", typeScale.caption.meta)}>
          <span className={cn("size-2 shrink-0 rounded-full", item.className)} />
          <span className="text-muted-foreground">{item.label}</span>
          <span className="font-medium text-foreground tabular-nums">{item.value}</span>
        </li>
      ))}
    </ul>
  )
}

export function SoftwareLicensesChart() {
  return (
    <ChartContainer config={licenseTrendConfig} className="h-56 w-full">
        <AreaChart data={licenseTrendData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="softwareActiveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="softwareExpiringFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-warning)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-warning)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={4} width={36} allowDecimals={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Area
            dataKey="active"
            type="monotone"
            stroke="var(--color-success)"
            strokeWidth={2}
            fill="url(#softwareActiveFill)"
          />
          <Area
            dataKey="expiring"
            type="monotone"
            stroke="var(--color-warning)"
            strokeWidth={2}
            fill="url(#softwareExpiringFill)"
          />
        </AreaChart>
      </ChartContainer>
  )
}

const commercialVelocityData = [
  { month: "Nov", count: 0 },
  { month: "Dec", count: 0 },
  { month: "Jan", count: 0 },
  { month: "Feb", count: 0 },
  { month: "Mar", count: 0 },
  { month: "Apr", count: 0 },
  { month: "May", count: 0 },
  { month: "Jun", count: 71 },
]

const commercialVelocityConfig = {
  count: { label: "Net-new", color: "var(--color-success)" },
} satisfies ChartConfig

export function CommercialVelocityChart() {
  return (
    <ChartContainer config={commercialVelocityConfig} className="h-52 w-full">
      <BarChart data={commercialVelocityData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={4} width={36} allowDecimals={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-success)" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ChartContainer>
  )
}

const vendorConcentrationData = [
  { vendor: "META", seats: 50, fill: "var(--color-chart-1)" },
  { vendor: "Microsoft", seats: 18, fill: "var(--color-chart-1)" },
  { vendor: "Unknown vendor", seats: 10, fill: "var(--color-chart-1)" },
]

const vendorConcentrationConfig = {
  seats: { label: "Seats" },
} satisfies ChartConfig

export function VendorSeatConcentrationChart() {
  return (
    <ChartContainer config={vendorConcentrationConfig} className="h-52 w-full">
      <BarChart
        data={vendorConcentrationData}
        layout="vertical"
        margin={{ left: 8, right: 16, top: 8, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="vendor"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={96}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="seats" radius={6} maxBarSize={56}>
          {vendorConcentrationData.map((entry) => (
            <Cell key={entry.vendor} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
