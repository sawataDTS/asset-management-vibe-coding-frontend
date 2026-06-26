import {
  ASSET_STATUSES,
  HARDWARE_CATEGORIES,
  initialHardwareAssets,
  type AssetStatus,
  type HardwareAsset,
} from "@/lib/hardware/data"
import type { ReportConfig, ReportKpi, ReportRow } from "@/lib/reports/types"
import { TABLE_EMPTY_CELL } from "@/lib/table-empty"

export type { ReportKpi, ReportRow }

export type AssetCondition = "Excellent" | "Good" | "Fair" | "Poor" | "Broken"

export type HardwareReportKind =
  | "full-inventory"
  | "retired-assets"
  | "overdue-assets"
  | "checkout-audit"
  | "eol-warranty"
  | "depreciation"
  | "service-repair"

export type ReportFilters = {
  search: string
  status: string
  category: string
  condition: string
  cost: string
  timeRange: string
}

export type ReportAsset = HardwareAsset & {
  model: string
  condition: AssetCondition
  cost: number
  purchaseDate: string
  isLoaner: boolean
}

export type HardwareReportConfig = ReportConfig<ReportAsset>

export const DEFAULT_REPORT_FILTERS: ReportFilters = {
  search: "",
  status: "All Statuses",
  category: "All Categories",
  condition: "All Conditions",
  cost: "Any Cost",
  timeRange: "All Time",
}

export const REPORT_STATUS_OPTIONS = ["All Statuses", "In Stock", "Assigned", "In Repair", "Retired"] as const

export const REPORT_CONDITION_OPTIONS = [
  "All Conditions",
  "Excellent",
  "Good",
  "Fair",
  "Poor",
  "Broken",
] as const

export const REPORT_COST_OPTIONS = ["Any Cost", "Under $500", "$500 – $2,000", "Over $2,000"] as const

export const REPORT_TIME_OPTIONS = ["All Time", "Last 30 Days", "Last 90 Days", "Last 12 Months"] as const

const CONDITIONS: AssetCondition[] = ["Excellent", "Good", "Fair", "Poor", "Broken"]

function hashSeed(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function inferModel(asset: HardwareAsset) {
  const serialParts = asset.serial.split("-")
  if (serialParts.length >= 3) {
    return serialParts.slice(2, -1).join(" ") || asset.name
  }
  return asset.name
}

function inferCost(asset: HardwareAsset) {
  const seed = hashSeed(asset.id + asset.tag)
  const base = 400 + (seed % 3600)
  if (asset.category === "Monitor") return base * 0.6
  if (asset.category === "Accessories") return base * 0.15
  if (asset.category === "Phone") return base * 0.9
  return base
}

function inferCondition(asset: HardwareAsset): AssetCondition {
  if (asset.status === "Repair") return "Fair"
  if (asset.status === "Retired") return "Poor"
  return CONDITIONS[hashSeed(asset.id) % CONDITIONS.length]
}

function getPurchaseDate(asset: HardwareAsset) {
  const first = asset.history.at(-1)?.date ?? asset.history[0]?.date
  return first ?? new Date().toISOString().split("T")[0]
}

export function enrichHardwareAssets(assets: HardwareAsset[] = initialHardwareAssets): ReportAsset[] {
  return assets.map((asset) => ({
    ...asset,
    model: inferModel(asset),
    condition: inferCondition(asset),
    cost: inferCost(asset),
    purchaseDate: getPurchaseDate(asset),
    isLoaner: false,
  }))
}

export function formatReportDate(value: string) {
  if (!value) return TABLE_EMPTY_CELL
  if (value === "Expired") return value
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-GB")
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function parseDate(value: string) {
  if (value === "Expired" || !value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function daysBetween(from: Date, to: Date) {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
}

function isWithinTimeRange(dateValue: string, timeRange: string, reference = new Date()) {
  if (timeRange === "All Time") return true
  const date = parseDate(dateValue)
  if (!date) return timeRange === "All Time"

  const days =
    timeRange === "Last 30 Days"
      ? 30
      : timeRange === "Last 90 Days"
        ? 90
        : timeRange === "Last 12 Months"
          ? 365
          : null

  if (days == null) return true
  return daysBetween(date, reference) <= days
}

function matchesCost(cost: number, filter: string) {
  if (filter === "Any Cost") return true
  if (filter === "Under $500") return cost < 500
  if (filter === "$500 – $2,000") return cost >= 500 && cost <= 2000
  if (filter === "Over $2,000") return cost > 2000
  return true
}

function normalizeStatus(status: AssetStatus) {
  return status === "Repair" ? "In Repair" : status
}

function getAssignmentDate(asset: ReportAsset) {
  const assignedEvent = asset.history.find((event) => event.action === "Assigned Device")
  return assignedEvent?.date ?? asset.purchaseDate
}

function getDaysHeld(asset: ReportAsset, reference = new Date()) {
  const assignedDate = parseDate(getAssignmentDate(asset))
  if (!assignedDate) return 0
  return Math.max(daysBetween(assignedDate, reference), 0)
}

function isWarrantyExpired(warranty: string, reference = new Date()) {
  if (warranty === "Expired") return true
  const date = parseDate(warranty)
  if (!date) return false
  return date < reference
}

function isWarrantyExpiringSoon(warranty: string, withinDays: number, reference = new Date()) {
  if (warranty === "Expired") return true
  const date = parseDate(warranty)
  if (!date) return false
  const days = daysBetween(reference, date)
  return days >= 0 && days <= withinDays
}

function getDepreciation(asset: ReportAsset, reference = new Date()) {
  const purchaseDate = parseDate(asset.purchaseDate)
  if (!purchaseDate) {
    return { bookValue: asset.cost, percentDepreciated: 0, fullyDepreciated: false }
  }

  const elapsedYears = daysBetween(purchaseDate, reference) / 365
  const scheduleYears = 3
  const percentDepreciated = Math.min(Math.round((elapsedYears / scheduleYears) * 100), 100)
  const bookValue = Math.max(Math.round(asset.cost * (1 - percentDepreciated / 100)), 0)

  return {
    bookValue,
    percentDepreciated,
    fullyDepreciated: percentDepreciated >= 100,
  }
}

export function applyReportFilters(assets: ReportAsset[], filters: ReportFilters) {
  const query = filters.search.trim().toLowerCase()

  return assets.filter((asset) => {
    const matchesSearch =
      !query ||
      asset.name.toLowerCase().includes(query) ||
      asset.tag.toLowerCase().includes(query) ||
      asset.supplier.toLowerCase().includes(query) ||
      asset.model.toLowerCase().includes(query) ||
      asset.serial.toLowerCase().includes(query)

    const matchesStatus =
      filters.status === "All Statuses" || normalizeStatus(asset.status) === filters.status

    const matchesCategory = filters.category === "All Categories" || asset.category === filters.category

    const matchesCondition = filters.condition === "All Conditions" || asset.condition === filters.condition

    const matchesCostFilter = matchesCost(asset.cost, filters.cost)
    const matchesTime = isWithinTimeRange(asset.purchaseDate, filters.timeRange)

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesCondition &&
      matchesCostFilter &&
      matchesTime
    )
  })
}

function statusBadge(status: AssetStatus) {
  return normalizeStatus(status)
}

function assetStatusBadgeVariant(status: AssetStatus): ReportRow["badgeVariant"] {
  switch (status) {
    case "In Stock":
      return "success"
    case "Assigned":
      return "info"
    case "Repair":
      return "warning"
    case "Retired":
      return "secondary"
    default:
      return "outline"
  }
}

export const HARDWARE_REPORT_CONFIG: Record<HardwareReportKind, HardwareReportConfig> = {
  "full-inventory": {
    title: "Hardware Inventory Report",
    description: "Full asset stock, allocation and lifecycle status",
    kpis: (assets) => {
      const total = assets.length
      const assigned = assets.filter((asset) => asset.status === "Assigned").length
      const loaner = assets.filter((asset) => asset.isLoaner).length
      const inStock = assets.filter((asset) => asset.status === "In Stock").length
      const retired = assets.filter((asset) => asset.status === "Retired").length

      return [
        { label: "Total Assets", value: String(total) },
        { label: "Assigned", value: String(assigned) },
        { label: "Loaner", value: String(loaner) },
        { label: "In Stock", value: String(inStock) },
        { label: "Retired", value: String(retired) },
      ]
    },
    selectItems: (assets) => assets,
    toRows: (assets) =>
      assets.map((asset) => ({
        id: asset.id,
        title: `${asset.name} · ${asset.tag}`,
        subtitle: `${asset.supplier} · ${asset.model} · ${asset.category.toLowerCase()} · ${formatReportDate(asset.purchaseDate)}`,
        badge: statusBadge(asset.status),
        badgeVariant: assetStatusBadgeVariant(asset.status),
      })),
  },
  "retired-assets": {
    title: "Retired Assets Report",
    description: "Assets removed from active circulation",
    kpis: (assets) => {
      const retired = assets.filter((asset) => asset.status === "Retired")
      const activeFleet = assets.filter((asset) => asset.status !== "Retired").length
      const sunkCost = retired.reduce((sum, asset) => sum + asset.cost, 0)
      const fleetPercent = assets.length ? Math.round((retired.length / assets.length) * 100) : 0

      return [
        { label: "Retired", value: String(retired.length) },
        { label: "% of Fleet", value: `${fleetPercent}%` },
        { label: "Sunk Cost", value: formatCurrency(sunkCost) },
        { label: "Active Fleet", value: String(activeFleet) },
      ]
    },
    selectItems: (assets) => assets.filter((asset) => asset.status === "Retired"),
    toRows: (assets) =>
      assets.map((asset) => {
        const retiredEvent = asset.history.find((event) => event.action === "Retired Device")
        return {
          id: asset.id,
          title: `${asset.name} · ${asset.tag}`,
          subtitle: `${asset.supplier} · ${asset.model} · ${asset.category.toLowerCase()} · retired · ${formatReportDate(retiredEvent?.date ?? asset.purchaseDate)}`,
          badge: "Retired",
          badgeVariant: "secondary",
        }
      }),
  },
  "overdue-assets": {
    title: "Overdue Assets Report",
    description: "Assigned >12 months or out-of-warranty units flagged for return / refresh",
    kpis: (assets) => {
      const overdue = assets.filter(
        (asset) =>
          asset.status === "Assigned" && (getDaysHeld(asset) > 365 || isWarrantyExpired(asset.warranty))
      )
      const assignedTotal = assets.filter((asset) => asset.status === "Assigned").length
      const avgDaysHeld = assignedTotal
        ? Math.round(
            assets
              .filter((asset) => asset.status === "Assigned")
              .reduce((sum, asset) => sum + getDaysHeld(asset), 0) / assignedTotal
          )
        : 0
      const outOfWarranty = assets.filter((asset) => isWarrantyExpired(asset.warranty)).length

      return [
        { label: "Overdue", value: String(overdue.length) },
        { label: "Assigned Total", value: String(assignedTotal) },
        { label: "Avg Days Held", value: String(avgDaysHeld) },
        { label: "Out of Warranty", value: String(outOfWarranty) },
      ]
    },
    selectItems: (assets) =>
      assets.filter(
        (asset) =>
          asset.status === "Assigned" && (getDaysHeld(asset) > 365 || isWarrantyExpired(asset.warranty))
      ),
    toRows: (assets) =>
      assets.map((asset) => ({
        id: asset.id,
        title: `${asset.name} · ${asset.tag}`,
        subtitle: `${asset.supplier} · ${asset.model} · ${asset.category.toLowerCase()} · held ${getDaysHeld(asset)} days`,
        badge: "Overdue",
        badgeVariant: "warning",
      })),
  },
  "checkout-audit": {
    title: "Checkout Audit Report",
    description: "All asset checkouts and returns over the audit window",
    kpis: (assets) => {
      const checkedOut = assets.filter((asset) => asset.status === "Assigned")
      const locations = new Set(
        checkedOut.map((asset) => asset.location).filter(Boolean)
      ).size

      return [
        { label: "Checkouts (90d)", value: String(checkedOut.length) },
        { label: "Currently Out", value: String(checkedOut.length) },
        { label: "Available", value: String(assets.filter((asset) => asset.status === "In Stock").length) },
        { label: "Locations", value: String(locations) },
      ]
    },
    selectItems: (assets) => assets.filter((asset) => asset.status === "Assigned"),
    toRows: (assets) =>
      assets.map((asset) => ({
        id: asset.id,
        title: `${asset.name} · ${asset.tag}`,
        subtitle: `${asset.supplier} · ${asset.model} · ${asset.category.toLowerCase()} · to ${asset.assignee || "Unassigned"} · ${formatReportDate(getAssignmentDate(asset))}`,
        badge: "Checked Out",
        badgeVariant: "info",
      })),
  },
  "eol-warranty": {
    title: "End-of-Life · Warranty Report",
    description: "Assets approaching or past warranty / lifecycle end",
    kpis: (assets) => {
      const expired = assets.filter((asset) => isWarrantyExpired(asset.warranty))
      const expiring = assets.filter((asset) => isWarrantyExpiringSoon(asset.warranty, 90))
      const covered = assets.filter((asset) => !isWarrantyExpired(asset.warranty)).length
      const replacementValue = expired.reduce((sum, asset) => sum + asset.cost, 0)

      return [
        { label: "Expired", value: String(expired.length) },
        { label: "Expiring 90d", value: String(expiring.length) },
        { label: "Replacement Value", value: formatCurrency(replacementValue) },
        { label: "Covered", value: String(covered) },
      ]
    },
    selectItems: (assets) =>
      assets.filter(
        (asset) => isWarrantyExpired(asset.warranty) || isWarrantyExpiringSoon(asset.warranty, 90)
      ),
    toRows: (assets) =>
      assets.map((asset) => ({
        id: asset.id,
        title: `${asset.name} · ${asset.tag}`,
        subtitle: `${asset.supplier} · ${asset.model} · ${asset.category.toLowerCase()} · warranty ${formatReportDate(asset.warranty)}`,
        badge: isWarrantyExpired(asset.warranty) ? "Expired" : "Expiring",
        badgeVariant: isWarrantyExpired(asset.warranty) ? "destructive" : "warning",
      })),
  },
  depreciation: {
    title: "Depreciation Report",
    description: "Straight-line book value across hardware fleet (3-year schedule)",
    kpis: (assets) => {
      const originalCost = assets.reduce((sum, asset) => sum + asset.cost, 0)
      const netBookValue = assets.reduce((sum, asset) => sum + getDepreciation(asset).bookValue, 0)
      const depreciated = originalCost - netBookValue
      const fullyDepreciated = assets.filter((asset) => getDepreciation(asset).fullyDepreciated).length

      return [
        { label: "Original Cost", value: formatCurrency(originalCost) },
        { label: "Net Book Value", value: formatCurrency(netBookValue) },
        { label: "Depreciated", value: formatCurrency(depreciated) },
        { label: "Fully Depreciated", value: String(fullyDepreciated) },
      ]
    },
    selectItems: (assets) => assets,
    toRows: (assets) =>
      assets.map((asset) => {
        const { bookValue, percentDepreciated } = getDepreciation(asset)
        return {
          id: asset.id,
          title: `${asset.name} · ${asset.tag}`,
          subtitle: `${asset.supplier} · ${asset.model} · ${asset.category.toLowerCase()} · book ${formatCurrency(bookValue)}`,
          badge: `${percentDepreciated}% Depreciated`,
          badgeVariant: "secondary",
        }
      }),
  },
  "service-repair": {
    title: "Service - Repair Report",
    description: "Assets in maintenance, damaged or flagged for repair",
    kpis: (assets) => {
      const inQueue = assets.filter((asset) => asset.status === "Repair").length
      const poor = assets.filter((asset) => asset.condition === "Poor").length
      const broken = assets.filter((asset) => asset.condition === "Broken").length
      const healthy = assets.filter(
        (asset) => asset.status !== "Repair" && !["Poor", "Broken"].includes(asset.condition)
      ).length

      return [
        { label: "In Service Queue", value: String(inQueue) },
        { label: "Poor Condition", value: String(poor) },
        { label: "Broken", value: String(broken) },
        { label: "Healthy", value: String(healthy) },
      ]
    },
    selectItems: (assets) =>
      assets.filter(
        (asset) => asset.status === "Repair" || asset.condition === "Poor" || asset.condition === "Broken"
      ),
    toRows: (assets) =>
      assets.map((asset) => ({
        id: asset.id,
        title: `${asset.name} · ${asset.tag}`,
        subtitle: `${asset.supplier} · ${asset.model} · ${asset.category.toLowerCase()} · status: ${asset.status === "Repair" ? "in_repair" : asset.condition.toLowerCase()}`,
        badge: asset.status === "Repair" ? "In Repair" : asset.condition,
        badgeVariant:
          asset.status === "Repair"
            ? "warning"
            : asset.condition === "Broken"
              ? "destructive"
              : asset.condition === "Poor"
                ? "warning"
                : "secondary",
      })),
  },
}

export function getHardwareReportData(
  kind: HardwareReportKind,
  filters: ReportFilters,
  sourceAssets: ReportAsset[] = enrichHardwareAssets()
) {
  const config = HARDWARE_REPORT_CONFIG[kind]
  const scoped = config.selectItems(sourceAssets)
  const filtered = applyReportFilters(scoped, filters)

  return {
    config,
    kpis: config.kpis(scoped),
    rows: config.toRows(filtered),
    totalRows: filtered.length,
    generatedOn: formatReportDate(new Date().toISOString().split("T")[0]),
  }
}

export const HARDWARE_CATEGORY_FILTER_OPTIONS = ["All Categories", ...HARDWARE_CATEGORIES] as const

export { ASSET_STATUSES, HARDWARE_CATEGORIES }
