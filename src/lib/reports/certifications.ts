import type { ReportConfig, ReportKpi, ReportRow } from "@/lib/reports/types"

export type CertificationStatus = "Active" | "Expiring Soon" | "Expired"

export type CertificationType = "organization" | "vendor" | "employee"

export type CertificationRecord = {
  id: string
  name: string
  framework: string
  type: CertificationType
  status: CertificationStatus
  vendor?: string
  expiryDate: string
  hasEvidence: boolean
}

export type CertificationReportKind = "certification-status" | "expiring-soon" | "vendor-attestations"

export type CertificationReportFilters = {
  search: string
}

export const DEFAULT_CERTIFICATION_FILTERS: CertificationReportFilters = {
  search: "",
}

/** Seed registry — empty until certifications are ingested. */
export const initialCertifications: CertificationRecord[] = []

export function formatReportDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-GB")
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

function isExpiringWithinDays(record: CertificationRecord, days: number, reference = new Date()) {
  const remaining = daysUntil(record.expiryDate, reference)
  if (remaining == null) return false
  return remaining >= 0 && remaining <= days
}

function isExpired(record: CertificationRecord, reference = new Date()) {
  if (record.status === "Expired") return true
  const remaining = daysUntil(record.expiryDate, reference)
  return remaining != null && remaining < 0
}

export function applyCertificationFilters(
  records: CertificationRecord[],
  filters: CertificationReportFilters
) {
  const query = filters.search.trim().toLowerCase()
  if (!query) return records

  return records.filter((record) => {
    return (
      record.name.toLowerCase().includes(query) ||
      record.framework.toLowerCase().includes(query) ||
      (record.vendor?.toLowerCase().includes(query) ?? false)
    )
  })
}

export type CertificationReportConfig = ReportConfig<CertificationRecord>

export const CERTIFICATION_REPORT_CONFIG: Record<CertificationReportKind, CertificationReportConfig> = {
  "certification-status": {
    title: "Certification Status Report",
    description: "Organization, vendor, and employee certification registry",
    emptyMessage: "No data available for this report yet.",
    kpis: (records) => {
      const active = records.filter((record) => record.status === "Active").length
      const expiring = records.filter((record) => isExpiringWithinDays(record, 90)).length
      const frameworks = new Set(records.map((record) => record.framework)).size

      return [
        { label: "Total", value: String(records.length) },
        { label: "Active", value: String(active) },
        { label: "Expiring", value: String(expiring) },
        { label: "Frameworks", value: String(frameworks) },
      ]
    },
    selectItems: (records) => records,
    toRows: (records) =>
      records.map((record) => ({
        id: record.id,
        title: record.name,
        subtitle: `${record.framework} · ${record.type} · expires ${formatReportDate(record.expiryDate)}`,
        badge: record.status,
        badgeVariant:
          record.status === "Active"
            ? "success"
            : record.status === "Expiring Soon"
              ? "warning"
              : "destructive",
      })),
  },
  "expiring-soon": {
    title: "Expiring Certifications",
    description: "ISO, SOC 2, and other certifications expiring within 90 days",
    emptyMessage: "No data available for this report yet.",
    kpis: (records) => {
      const expiring = records.filter((record) => isExpiringWithinDays(record, 90))
      const active = records.filter((record) => record.status === "Active").length
      const expired = records.filter((record) => isExpired(record)).length
      const noEvidence = records.filter((record) => !record.hasEvidence).length

      return [
        { label: "Expiring 90d", value: String(expiring.length) },
        { label: "Active", value: String(active) },
        { label: "Expired", value: String(expired) },
        { label: "No Evidence", value: String(noEvidence) },
      ]
    },
    selectItems: (records) =>
      records.filter((record) => isExpiringWithinDays(record, 90) || isExpired(record)),
    toRows: (records) =>
      records.map((record) => ({
        id: record.id,
        title: record.name,
        subtitle: `${record.framework} · expires ${formatReportDate(record.expiryDate)}`,
        badge: isExpired(record) ? "Expired" : "Expiring",
        badgeVariant: isExpired(record) ? "destructive" : "warning",
      })),
  },
  "vendor-attestations": {
    title: "Vendor Attestations",
    description: "Supplier SOC 2, ISO, and security certifications",
    emptyMessage: "No data available for this report yet.",
    kpis: (records) => {
      const vendorRecords = records.filter((record) => record.type === "vendor")
      const active = vendorRecords.filter((record) => record.status === "Active").length
      const expiring = vendorRecords.filter((record) => isExpiringWithinDays(record, 90)).length
      const missingEvidence = vendorRecords.filter((record) => !record.hasEvidence).length

      return [
        { label: "Vendor Certs", value: String(vendorRecords.length) },
        { label: "Active", value: String(active) },
        { label: "Expiring", value: String(expiring) },
        { label: "Missing Evidence", value: String(missingEvidence) },
      ]
    },
    selectItems: (records) => records.filter((record) => record.type === "vendor"),
    toRows: (records) =>
      records.map((record) => ({
        id: record.id,
        title: record.name,
        subtitle: `${record.vendor ?? record.framework} · expires ${formatReportDate(record.expiryDate)}`,
        badge: record.hasEvidence ? record.status : "Missing Evidence",
        badgeVariant: record.hasEvidence
          ? record.status === "Active"
            ? "success"
            : record.status === "Expiring Soon"
              ? "warning"
              : "destructive"
          : "warning",
      })),
  },
}

export function getCertificationReportData(
  kind: CertificationReportKind,
  filters: CertificationReportFilters,
  sourceRecords: CertificationRecord[] = initialCertifications
) {
  const config = CERTIFICATION_REPORT_CONFIG[kind]
  const scoped = config.selectItems(sourceRecords)
  const filtered = applyCertificationFilters(scoped, filters)

  return {
    config,
    kpis: config.kpis(scoped),
    rows: config.toRows(filtered),
    generatedOn: formatReportDate(new Date().toISOString().split("T")[0]),
  }
}

export type { ReportKpi, ReportRow }
