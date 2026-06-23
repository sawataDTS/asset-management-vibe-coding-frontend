import {
  initialLicenses,
  SOFTWARE_CATEGORIES,
  type LicenseStatus,
  type SoftwareLicense,
} from "@/lib/software/data"
import type { ReportConfig, ReportKpi, ReportRow } from "@/lib/reports/types"

export type { ReportKpi, ReportRow }

export type SoftwareReportKind =
  | "license-inventory"
  | "renewals-eol"
  | "spend-analysis"
  | "seat-utilisation"
  | "unused-licenses"
  | "license-compliance"
  | "license-keys"

export type SoftwareReportFilters = {
  search: string
  status: string
  vendor: string
  category: string
  utilisation: string
  cost: string
}

export type ReportLicense = SoftwareLicense & {
  vendor: string
  utilisationPercent: number
  annualCost: number
  billingLabel: string
  isOverAllocated: boolean
}

export const DEFAULT_SOFTWARE_REPORT_FILTERS: SoftwareReportFilters = {
  search: "",
  status: "All Statuses",
  vendor: "All Vendors",
  category: "All Categories",
  utilisation: "Any Utilisation",
  cost: "Any Cost",
}

export const SOFTWARE_STATUS_OPTIONS = [
  "All Statuses",
  "Active",
  "Expiring Soon",
  "Expired",
] as const

export const SOFTWARE_UTILISATION_OPTIONS = [
  "Any Utilisation",
  "Under 30%",
  "30 – 70%",
  "Over 70%",
  "Over-allocated",
] as const

export const SOFTWARE_COST_OPTIONS = [
  "Any Cost",
  "Under $500",
  "$500 – $2,000",
  "Over $2,000",
] as const

function parseCostAmount(cost: string) {
  return parseInt(cost.replace(/[^0-9]/g, ""), 10) || 0
}

function isMonthlyBilling(cost: string) {
  return cost.toLowerCase().includes("/mo")
}

function getBillingLabel(cost: string) {
  return isMonthlyBilling(cost) ? "Monthly" : "Annually"
}

function getAnnualCost(cost: string) {
  const amount = parseCostAmount(cost)
  return isMonthlyBilling(cost) ? amount * 12 : amount
}

function normalizeVendor(supplier: string) {
  return supplier
    .replace(/\s+(Corp\.|Inc\.|s\.r\.o\.|Technologies)$/i, "")
    .replace(/\.$/, "")
    .trim()
}

function getUtilisationPercent(license: SoftwareLicense) {
  if (license.totalSeats <= 0) return 0
  return Math.round((license.assignedSeats / license.totalSeats) * 100)
}

export function enrichSoftwareLicenses(
  licenses: SoftwareLicense[] = initialLicenses
): ReportLicense[] {
  return licenses.map((license) => ({
    ...license,
    vendor: normalizeVendor(license.supplier),
    utilisationPercent: getUtilisationPercent(license),
    annualCost: getAnnualCost(license.cost),
    billingLabel: getBillingLabel(license.cost),
    isOverAllocated: license.assignedSeats > license.totalSeats,
  }))
}

export function formatReportDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-GB")
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function parseDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function daysUntil(value: string, reference = new Date()) {
  const date = parseDate(value)
  if (!date) return null
  return Math.floor((date.getTime() - reference.getTime()) / (1000 * 60 * 60 * 24))
}

function isExpiringWithinDays(license: ReportLicense, days: number, reference = new Date()) {
  const remaining = daysUntil(license.renewalDate, reference)
  if (remaining == null) return false
  return remaining >= 0 && remaining <= days
}

function isExpiredLicense(license: ReportLicense, reference = new Date()) {
  if (license.status === "Expired") return true
  const remaining = daysUntil(license.renewalDate, reference)
  return remaining != null && remaining < 0
}

function matchesCostFilter(annualCost: number, filter: string) {
  if (filter === "Any Cost") return true
  if (filter === "Under $500") return annualCost < 500
  if (filter === "$500 – $2,000") return annualCost >= 500 && annualCost <= 2000
  if (filter === "Over $2,000") return annualCost > 2000
  return true
}

function matchesUtilisationFilter(license: ReportLicense, filter: string) {
  if (filter === "Any Utilisation") return true
  if (filter === "Under 30%") return license.utilisationPercent < 30
  if (filter === "30 – 70%") return license.utilisationPercent >= 30 && license.utilisationPercent <= 70
  if (filter === "Over 70%") return license.utilisationPercent > 70
  if (filter === "Over-allocated") return license.isOverAllocated
  return true
}

function matchesStatusFilter(license: ReportLicense, filter: string) {
  if (filter === "All Statuses") return true
  return license.status === filter
}

export function getSoftwareVendorOptions(licenses: ReportLicense[]) {
  const vendors = [...new Set(licenses.map((license) => license.vendor))].sort()
  return ["All Vendors", ...vendors] as const
}

export function getSoftwareCategoryOptions() {
  return ["All Categories", ...SOFTWARE_CATEGORIES] as const
}

export function applySoftwareReportFilters(licenses: ReportLicense[], filters: SoftwareReportFilters) {
  const query = filters.search.trim().toLowerCase()

  return licenses.filter((license) => {
    const matchesSearch =
      !query ||
      license.name.toLowerCase().includes(query) ||
      license.vendor.toLowerCase().includes(query) ||
      license.category.toLowerCase().includes(query) ||
      license.key.toLowerCase().includes(query)

    const matchesStatus = matchesStatusFilter(license, filters.status)
    const matchesVendor = filters.vendor === "All Vendors" || license.vendor === filters.vendor
    const matchesCategory =
      filters.category === "All Categories" || license.category === filters.category
    const matchesUtilisation = matchesUtilisationFilter(license, filters.utilisation)
    const matchesCost = matchesCostFilter(license.annualCost, filters.cost)

    return (
      matchesSearch &&
      matchesStatus &&
      matchesVendor &&
      matchesCategory &&
      matchesUtilisation &&
      matchesCost
    )
  })
}

function seatLabel(license: ReportLicense) {
  return `${license.assignedSeats}/${license.totalSeats}`
}

function licenseMeta(license: ReportLicense) {
  return `${license.vendor} · ${license.category} · expires ${formatReportDate(license.renewalDate)}`
}

function costDisplay(license: ReportLicense) {
  const amount = parseCostAmount(license.cost)
  return `${formatCurrency(amount)} / ${license.billingLabel}`
}

function aggregateAnnualSpend(licenses: ReportLicense[]) {
  return licenses.reduce((sum, license) => sum + license.annualCost, 0)
}

function aggregateSeats(licenses: ReportLicense[]) {
  const used = licenses.reduce((sum, license) => sum + license.assignedSeats, 0)
  const total = licenses.reduce((sum, license) => sum + license.totalSeats, 0)
  return { used, total }
}

function countExpiring(licenses: ReportLicense[], days: number) {
  return licenses.filter((license) => isExpiringWithinDays(license, days)).length
}

function fleetUtilisation(licenses: ReportLicense[]) {
  const { used, total } = aggregateSeats(licenses)
  if (!total) return 0
  return Math.round((used / total) * 100)
}

function complianceRiskScore(licenses: ReportLicense[]) {
  const issues = licenses.filter(
    (license) =>
      license.isOverAllocated || (isExpiredLicense(license) && license.assignedSeats > 0)
  ).length
  if (!licenses.length) return 0
  return Math.round((issues / licenses.length) * 100)
}

export type SoftwareReportConfig = ReportConfig<ReportLicense>

export const SOFTWARE_REPORT_CONFIG: Record<SoftwareReportKind, SoftwareReportConfig> = {
  "license-inventory": {
    title: "Software Licensing Report",
    description: "License utilisation, renewals, and spend overview",
    kpis: (licenses) => {
      const { used, total } = aggregateSeats(licenses)
      return [
        { label: "Licenses", value: String(licenses.length) },
        { label: "Seats Used", value: `${used}/${total}` },
        { label: "Annual Spend", value: formatCurrency(aggregateAnnualSpend(licenses)) },
        { label: "Expiring 60d", value: String(countExpiring(licenses, 60)) },
      ]
    },
    selectItems: (licenses) => licenses,
    toRows: (licenses) =>
      licenses.map((license) => ({
        id: license.id,
        title: license.name,
        subtitle: `${license.vendor} · ${license.category} · expires ${formatReportDate(license.renewalDate)}`,
        trailingText: `${seatLabel(license)} Seats`,
      })),
  },
  "renewals-eol": {
    title: "Renewals - End-of-Life Report",
    description: "Licenses expiring in the next 90 days",
    kpis: (licenses) => {
      const expiring = licenses.filter((license) => isExpiringWithinDays(license, 90))
      const renewalSpend = expiring.reduce((sum, license) => sum + license.annualCost, 0)
      const expired = licenses.filter((license) => isExpiredLicense(license)).length
      const active = licenses.filter((license) => license.status === "Active").length

      return [
        { label: "Expiring 90d", value: String(expiring.length) },
        { label: "Renewal Spend", value: formatCurrency(renewalSpend) },
        { label: "Already Expired", value: String(expired) },
        { label: "Active", value: String(active) },
      ]
    },
    selectItems: (licenses) =>
      licenses.filter(
        (license) => isExpiringWithinDays(license, 90) || isExpiredLicense(license)
      ),
    toRows: (licenses) =>
      licenses.map((license) => ({
        id: license.id,
        title: license.name,
        subtitle: `${licenseMeta(license)} · ${costDisplay(license)}`,
        actionLabel: "Renew",
      })),
  },
  "spend-analysis": {
    title: "Spend Analysis Report",
    description: "Software spend ranked by annualized cost (from billing period)",
    kpis: (licenses) => {
      const annualSpend = aggregateAnnualSpend(licenses)
      const avgLicense = licenses.length ? Math.round(annualSpend / licenses.length) : 0
      const { used } = aggregateSeats(licenses)
      const costPerSeat = used ? Math.round(annualSpend / used) : 0
      const vendors = new Set(licenses.map((license) => license.vendor)).size

      return [
        { label: "Annual Spend", value: formatCurrency(annualSpend) },
        { label: "Avg / License", value: formatCurrency(avgLicense) },
        { label: "Cost / Seat", value: formatCurrency(costPerSeat) },
        { label: "Vendors", value: String(vendors) },
      ]
    },
    selectItems: (licenses) => [...licenses].sort((a, b) => b.annualCost - a.annualCost),
    toRows: (licenses) =>
      licenses.map((license) => ({
        id: license.id,
        title: license.name,
        subtitle: `${license.vendor} · ${license.category} · ${seatLabel(license)} seats`,
        trailingText: costDisplay(license),
      })),
  },
  "seat-utilisation": {
    title: "Seat Utilisation Report",
    description: "How fully each license pool is being used",
    kpis: (licenses) => {
      const { used, total } = aggregateSeats(licenses)
      const overAllocated = licenses.filter((license) => license.isOverAllocated).length
      const underHalf = licenses.filter((license) => license.utilisationPercent < 50).length

      return [
        { label: "Seats Used", value: `${used}/${total}` },
        { label: "Utilisation", value: `${fleetUtilisation(licenses)}%` },
        { label: "Over-allocated", value: String(overAllocated) },
        { label: "Under 50%", value: String(underHalf) },
      ]
    },
    selectItems: (licenses) =>
      [...licenses].sort((a, b) => b.utilisationPercent - a.utilisationPercent),
    toRows: (licenses) =>
      licenses.map((license) => ({
        id: license.id,
        title: license.name,
        subtitle: `${license.vendor} · ${license.category} · ${seatLabel(license)} seats`,
        trailingText: `${license.utilisationPercent}%`,
      })),
  },
  "unused-licenses": {
    title: "Unused Licenses Report",
    description: "Licenses with <30% utilisation — reclaim candidates",
    kpis: (licenses) => {
      const candidates = licenses.filter((license) => license.utilisationPercent < 30)
      const lostYtd = candidates.reduce(
        (sum, license) => sum + license.annualCost * (1 - license.utilisationPercent / 100),
        0
      )
      const freeSeats = licenses.reduce(
        (sum, license) => sum + Math.max(license.totalSeats - license.assignedSeats, 0),
        0
      )

      return [
        { label: "Reclaim Candidates", value: String(candidates.length) },
        { label: "Lost So Far (YTD)", value: formatCurrency(Math.round(lostYtd)) },
        { label: "Free Seats", value: String(freeSeats) },
        { label: "Annual Spend", value: formatCurrency(aggregateAnnualSpend(licenses)) },
      ]
    },
    selectItems: (licenses) => licenses.filter((license) => license.utilisationPercent < 30),
    toRows: (licenses) =>
      licenses.map((license) => ({
        id: license.id,
        title: license.name,
        subtitle: `${license.vendor} · ${license.category} · ${seatLabel(license)} · ${costDisplay(license)}`,
        badge: "Underused",
        badgeVariant: "secondary",
      })),
  },
  "license-compliance": {
    title: "License Compliance Report",
    description: "Over-allocated and expired licenses requiring action",
    emptyMessage: "No data available for this report yet.",
    kpis: (licenses) => {
      const overAllocated = licenses.filter((license) => license.isOverAllocated).length
      const expiredInUse = licenses.filter(
        (license) => isExpiredLicense(license) && license.assignedSeats > 0
      ).length
      const compliant = licenses.length - overAllocated - expiredInUse

      return [
        { label: "Over-allocated", value: String(overAllocated) },
        { label: "Expired In Use", value: String(expiredInUse) },
        { label: "Compliant", value: String(Math.max(compliant, 0)) },
        { label: "Risk Score", value: `${complianceRiskScore(licenses)}%` },
      ]
    },
    selectItems: (licenses) =>
      licenses.filter(
        (license) => license.isOverAllocated || (isExpiredLicense(license) && license.assignedSeats > 0)
      ),
    toRows: (licenses) =>
      licenses.map((license) => ({
        id: license.id,
        title: license.name,
        subtitle: `${licenseMeta(license)} · ${seatLabel(license)} seats in use`,
        badge: license.isOverAllocated ? "Over-allocated" : "Expired In Use",
        badgeVariant: license.isOverAllocated ? "warning" : "destructive",
      })),
  },
  "license-keys": {
    title: "License Keys Report",
    description: "Tracked license keys for activation and recovery",
    kpis: (licenses) => {
      const vendors = new Set(licenses.map((license) => license.vendor)).size
      const active = licenses.filter((license) => license.status === "Active").length

      return [
        { label: "Keys Tracked", value: String(licenses.length) },
        { label: "Vendors", value: String(vendors) },
        { label: "Active", value: String(active) },
        { label: "Expiring 90d", value: String(countExpiring(licenses, 90)) },
      ]
    },
    selectItems: (licenses) => licenses,
    toRows: (licenses) =>
      licenses.map((license) => ({
        id: license.id,
        title: license.name,
        subtitle: licenseMeta(license),
        badge: license.status,
        badgeVariant:
          license.status === "Active"
            ? "secondary"
            : license.status === "Expiring Soon"
              ? "warning"
              : "destructive",
      })),
  },
}

export function getSoftwareReportData(
  kind: SoftwareReportKind,
  filters: SoftwareReportFilters,
  sourceLicenses: ReportLicense[] = enrichSoftwareLicenses()
) {
  const config = SOFTWARE_REPORT_CONFIG[kind]
  const scoped = config.selectItems(sourceLicenses)
  const filtered = applySoftwareReportFilters(scoped, filters)

  return {
    config,
    kpis: config.kpis(scoped),
    rows: config.toRows(filtered),
    totalRows: filtered.length,
    generatedOn: formatReportDate(new Date().toISOString().split("T")[0]),
  }
}

export { SOFTWARE_CATEGORIES, type LicenseStatus }
