export type ReportRow = {
  id: string
  title: string
  subtitle: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "outline" | "warning" | "destructive"
  /** Right-aligned text (cost, utilisation %, seat counts). */
  trailingText?: string
  /** Renders an outline action button on the right (e.g. Renew). */
  actionLabel?: string
}

export type ReportKpi = {
  label: string
  value: string
}

export type ReportConfig<T> = {
  title: string
  description: string
  emptyMessage?: string
  kpis: (items: T[]) => ReportKpi[]
  selectItems: (items: T[]) => T[]
  toRows: (items: T[]) => ReportRow[]
}
