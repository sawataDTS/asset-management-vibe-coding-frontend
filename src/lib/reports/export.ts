import type { ReportKpi, ReportRow } from "@/lib/reports/types"

export type ReportExportColumn = {
  key: string
  header: string
}

export type ReportExportSnapshot = {
  reportTitle: string
  rowCount: number
  columns: ReportExportColumn[]
  rows: Record<string, string>[]
  kpis?: ReportKpi[]
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function escapeCsvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function reportRowsToExportSnapshot(reportTitle: string, rows: ReportRow[]): ReportExportSnapshot {
  return {
    reportTitle,
    rowCount: rows.length,
    columns: [
      { key: "title", header: "Title" },
      { key: "subtitle", header: "Details" },
      { key: "value", header: "Status / Value" },
    ],
    rows: rows.map((row) => ({
      title: row.title,
      subtitle: row.subtitle,
      value: row.trailingText ?? row.badge ?? row.actionLabel ?? "",
    })),
  }
}

export function downloadReportCsv(snapshot: ReportExportSnapshot) {
  const header = snapshot.columns.map((column) => escapeCsvCell(column.header)).join(",")
  const body = snapshot.rows
    .map((row) =>
      snapshot.columns.map((column) => escapeCsvCell(row[column.key] ?? "")).join(",")
    )
    .join("\n")

  const csv = `\uFEFF${header}\n${body}`
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${slugify(snapshot.reportTitle) || "report"}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function buildPrintableHtml(snapshot: ReportExportSnapshot) {
  const kpiBlock =
    snapshot.kpis && snapshot.kpis.length > 0
      ? `<section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin:0 0 24px;">
          ${snapshot.kpis
            .map(
              (kpi) => `<div style="border:1px solid #dbeafe;border-radius:12px;padding:12px 14px;">
                <div style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">${kpi.label}</div>
                <div style="margin-top:6px;font-size:24px;font-weight:600;color:#0f172a;">${kpi.value}</div>
              </div>`
            )
            .join("")}
        </section>`
      : ""

  const tableHead = snapshot.columns
    .map(
      (column) =>
        `<th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;">${column.header}</th>`
    )
    .join("")

  const tableBody = snapshot.rows
    .map(
      (row) =>
        `<tr>${snapshot.columns
          .map(
            (column) =>
              `<td style="padding:10px 12px;font-size:14px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${row[column.key] ?? "—"}</td>`
          )
          .join("")}</tr>`
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${snapshot.reportTitle}</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; color: #0f172a; margin: 24px; }
      h1 { font-size: 24px; margin: 0 0 8px; }
      p { margin: 0 0 20px; color: #64748b; font-size: 14px; }
      table { width: 100%; border-collapse: collapse; }
    </style>
  </head>
  <body>
    <h1>${snapshot.reportTitle}</h1>
    <p>Filtered report · ${snapshot.rowCount} ${snapshot.rowCount === 1 ? "row" : "rows"}</p>
    ${kpiBlock}
    <table>
      <thead><tr>${tableHead}</tr></thead>
      <tbody>${tableBody}</tbody>
    </table>
  </body>
</html>`
}

export function downloadReportPdf(snapshot: ReportExportSnapshot) {
  return openPrintableReport(snapshot)
}

export function openPrintableReport(snapshot: ReportExportSnapshot) {
  const printWindow = window.open("", "_blank", "noopener,noreferrer")
  if (!printWindow) return false

  printWindow.document.write(buildPrintableHtml(snapshot))
  printWindow.document.close()
  printWindow.focus()

  window.setTimeout(() => {
    printWindow.print()
  }, 250)

  return true
}

export function printReportPreview() {
  window.print()
}

export function getExportMenuLabel(snapshot: ReportExportSnapshot | null) {
  const rowCount = snapshot?.rowCount ?? 0
  return `Filtered report · ${rowCount} ${rowCount === 1 ? "row" : "rows"}`
}
