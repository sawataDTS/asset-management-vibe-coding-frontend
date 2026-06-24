/**
 * Five-level typography scale for consistent visual hierarchy across the app.
 * Import these class strings instead of ad-hoc size/weight combinations.
 *
 * L1 Display  — font-display (page title, brand, navbar)
 * L2 Heading  — font-heading text-lg (section / settings panel titles)
 * L3 Title    — font-heading text-base (card titles, KPI values)
 * L4 Body     — text-sm (copy, nav items, table cells)
 * L5 Caption  — text-xs (overlines, metadata, table headers)
 */
export const typeScale = {
  display: {
    page: "font-display text-3xl font-bold leading-tight tracking-tight text-foreground",
    brand: "font-display text-2xl font-extrabold leading-snug tracking-tight text-foreground",
    nav: "font-display text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl",
  },
  heading: "font-heading text-lg font-semibold tracking-tight text-foreground",
  title: "font-heading text-base font-semibold tracking-tight text-foreground",
  titleMetric: "font-heading text-3xl font-semibold leading-none tracking-tight tabular-nums text-foreground",
  body: {
    default: "text-sm font-normal text-foreground",
    muted: "text-sm leading-relaxed text-muted-foreground",
    emphasis: "text-sm font-medium text-foreground",
    tabularEmphasis: "text-sm font-medium tabular-nums text-foreground",
  },
  caption: {
    overline: "text-xs font-semibold tracking-wide uppercase text-muted-foreground",
    meta: "text-xs font-normal text-muted-foreground",
    tableHeader: "text-xs font-medium text-muted-foreground",
  },
} as const
