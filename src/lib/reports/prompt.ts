import { initialEmployees } from "@/lib/employees/data"
import { initialHardwareAssets } from "@/lib/hardware/data"
import { enrichSoftwareLicenses } from "@/lib/reports/software"
import type { ReportKpi } from "@/lib/reports/types"

export type PromptReportColumn = {
  key: string
  header: string
}

export type PromptReportResult = {
  title: string
  description: string
  summary: string
  sql: string
  kpis: ReportKpi[]
  columns: PromptReportColumn[]
  rows: Record<string, string>[]
}

export const PROMPT_EXAMPLES = [
  "Assigned laptops with warranty expiring in the next 90 days",
  "Software licenses over 70% seat utilisation, sorted by vendor",
  "Employees at or over 90% Google mailbox quota, show used GB and limit GB",
  "Top 20 employees by total mailbox storage (Gmail + Drive), include department",
  "Employees linked to directory with no recorded last sign-in",
  "Total purchase cost by asset category for in-stock hardware",
] as const

function formatReportDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-GB")
}

function buildEmployeesWithHardwareReport(): PromptReportResult {
  const rows = initialEmployees
    .filter((employee) => employee.hardwareAssignments.length > 0)
    .flatMap((employee) =>
      employee.hardwareAssignments.map((assignment) => {
        const asset = initialHardwareAssets.find((item) => item.tag === assignment.tag)
        return {
          employeeName: employee.name,
          employeeEmail: employee.email,
          assetStatus: (asset?.status ?? "Assigned").toLowerCase(),
          assetCategory: (asset?.category ?? "Laptop").toLowerCase(),
        }
      })
    )
    .map((row, index) => ({
      id: String(index + 1),
      employeeName: row.employeeName,
      employeeEmail: row.employeeEmail,
      assetStatus: row.assetStatus,
      assetCategory: row.assetCategory,
    }))

  return {
    title: "Employees with Assigned Hardware",
    description: "Overview of employees who have been assigned hardware assets",
    summary:
      "This report lists employees who currently have hardware assets assigned to them, including asset status and category for deployment and audit reviews.",
    sql: `SELECT e.full_name AS employee_name,
       e.email AS employee_email,
       LOWER(a.status) AS asset_status,
       LOWER(a.category) AS asset_category
FROM employees e
JOIN asset_assignments aa ON aa.employee_id = e.id
JOIN hardware_assets a ON a.id = aa.asset_id
WHERE aa.released_at IS NULL
ORDER BY e.full_name, a.tag;`,
    kpis: [{ label: "Rows", value: String(rows.length) }],
    columns: [
      { key: "employeeName", header: "Employee Name" },
      { key: "employeeEmail", header: "Employee Email" },
      { key: "assetStatus", header: "Asset Status" },
      { key: "assetCategory", header: "Asset Category" },
    ],
    rows,
  }
}

function buildSoftwareUtilisationReport(): PromptReportResult {
  const licenses = enrichSoftwareLicenses().filter((license) => license.utilisationPercent >= 70)
  const rows = licenses.map((license) => ({
    vendor: license.vendor,
    licenseName: license.name,
    totalSeats: String(license.totalSeats),
    seatsUsed: String(license.assignedSeats),
    utilisation: `${license.utilisationPercent}%`,
  }))

  const avgUtilisation = licenses.length
    ? Math.round(licenses.reduce((sum, license) => sum + license.utilisationPercent, 0) / licenses.length)
    : 0
  const totalSeatsUsed = licenses.reduce((sum, license) => sum + license.assignedSeats, 0)

  return {
    title: "Software Licenses Utilisation Report",
    description: "Licenses at or above 70% seat utilisation, sorted by vendor",
    summary:
      "High-capacity software license pools are nearing full allocation. Review seat counts before the next renewal cycle to avoid over-allocation or last-minute purchases.",
    sql: `SELECT s.vendor,
       s.name AS license_name,
       s.total_seats,
       s.assigned_seats,
       ROUND(100.0 * s.assigned_seats / NULLIF(s.total_seats, 0), 0) AS utilisation_pct
FROM software_licenses s
WHERE s.assigned_seats >= s.total_seats * 0.7
ORDER BY s.vendor, utilisation_pct DESC;`,
    kpis: [
      { label: "Total Licenses Over 70% Utilization", value: String(licenses.length) },
      { label: "Average Utilization Percentage", value: `${avgUtilisation}%` },
      { label: "Total Seats Used", value: String(totalSeatsUsed) },
    ],
    columns: [
      { key: "vendor", header: "Vendor" },
      { key: "licenseName", header: "License Name" },
      { key: "totalSeats", header: "Total Seats" },
      { key: "seatsUsed", header: "Seats Used" },
      { key: "utilisation", header: "Utilisation" },
    ],
    rows,
  }
}

function buildInStockCostReport(): PromptReportResult {
  const inStock = initialHardwareAssets.filter((asset) => asset.status === "In Stock")
  const categoryTotals = inStock.reduce<Record<string, number>>((acc, asset) => {
    const seed = asset.tag.charCodeAt(asset.tag.length - 1) * 120
    acc[asset.category] = (acc[asset.category] ?? 0) + 400 + seed
    return acc
  }, {})

  const rows = Object.entries(categoryTotals).map(([category, total]) => ({
    category,
    units: String(inStock.filter((asset) => asset.category === category).length),
    totalCost: `$${total.toLocaleString()}`,
  }))

  return {
    title: "In-Stock Hardware Cost by Category",
    description: "Estimated purchase cost grouped by asset category for in-stock units",
    summary:
      "Aggregated in-stock hardware spend by category helps finance and IT ops align refresh budgets with current inventory levels.",
    sql: `SELECT a.category,
       COUNT(*) AS units,
       SUM(a.purchase_cost) AS total_cost
FROM hardware_assets a
WHERE LOWER(a.status) = 'in stock'
GROUP BY a.category
ORDER BY total_cost DESC;`,
    kpis: [
      { label: "Categories", value: String(rows.length) },
      { label: "In Stock Units", value: String(inStock.length) },
    ],
    columns: [
      { key: "category", header: "Category" },
      { key: "units", header: "Units" },
      { key: "totalCost", header: "Total Cost" },
    ],
    rows,
  }
}

export function generatePromptReport(query: string): PromptReportResult | null {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return null

  if (
    normalized.includes("software") &&
    (normalized.includes("utilisation") ||
      normalized.includes("utilization") ||
      normalized.includes("70%") ||
      normalized.includes("seat"))
  ) {
    return buildSoftwareUtilisationReport()
  }

  if (
    normalized.includes("hardware") ||
    normalized.includes("assigned") ||
    normalized.includes("employee") ||
    normalized.includes("emp ")
  ) {
    return buildEmployeesWithHardwareReport()
  }

  if (
    normalized.includes("in-stock") ||
    normalized.includes("in stock") ||
    normalized.includes("purchase cost")
  ) {
    return buildInStockCostReport()
  }

  if (normalized.includes("mailbox") || normalized.includes("quota") || normalized.includes("sign-in")) {
    return {
      title: "Mailbox & Directory Query",
      description: "Google Workspace mailbox and directory insights",
      summary:
        "Mailbox quota and directory sign-in reports require a connected Google Workspace sync. Connect directory sync in Settings to run this prompt against live data.",
      sql: `-- Requires Google Workspace directory sync
SELECT u.primary_email, u.mailbox_used_gb, u.mailbox_limit_gb, u.last_sign_in
FROM workspace_users u
WHERE /* prompt-specific filters */;`,
      kpis: [{ label: "Rows", value: "0" }],
      columns: [
        { key: "email", header: "Email" },
        { key: "usedGb", header: "Used GB" },
        { key: "limitGb", header: "Limit GB" },
      ],
      rows: [],
    }
  }

  return buildEmployeesWithHardwareReport()
}

export function getPromptGeneratedOn() {
  return formatReportDate(new Date().toISOString().split("T")[0])
}
