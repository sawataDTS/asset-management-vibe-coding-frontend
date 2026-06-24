import * as React from "react"

import { Badge } from "@/components/ui/badge"
import type { ReportRow } from "@/lib/reports/types"

type BadgeVariant = NonNullable<React.ComponentProps<typeof Badge>["variant"]>

const BADGE_VARIANT_BY_LABEL: Record<string, BadgeVariant> = {
  "In Stock": "success",
  Assigned: "info",
  Repair: "warning",
  "In Repair": "warning",
  Retired: "secondary",
  Active: "success",
  "Expiring Soon": "warning",
  Expired: "destructive",
  Expiring: "warning",
  Overdue: "warning",
  "Checked Out": "info",
  Underused: "outline",
  "Over-allocated": "warning",
  "Expired In Use": "destructive",
  "Missing Evidence": "warning",
  assigned: "info",
  "in stock": "success",
  repair: "warning",
  retired: "secondary",
  active: "success",
  expired: "destructive",
  expiring: "warning",
}

function resolveReportBadgeVariant(badge: string, badgeVariant?: ReportRow["badgeVariant"]): BadgeVariant {
  if (badgeVariant) return badgeVariant
  const normalized = badge.trim()
  return BADGE_VARIANT_BY_LABEL[normalized] ?? BADGE_VARIANT_BY_LABEL[normalized.toLowerCase()] ?? "outline"
}

function ReportStatusBadge({ badge, badgeVariant }: Pick<ReportRow, "badge" | "badgeVariant">) {
  if (!badge) return null

  return (
    <Badge variant={resolveReportBadgeVariant(badge, badgeVariant)} className="shrink-0">
      {badge}
    </Badge>
  )
}

export { ReportStatusBadge, resolveReportBadgeVariant }
