import {
  LayoutGrid,
  Inbox,
  HardDrive,
  AppWindow,
  // ShieldCheck,
  Truck,
  // BadgeCheck,
  Users,
  Repeat,
  FileText,
  // Megaphone,
  // Plug,
  // Sparkles,
  // Bell,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
}

export interface NavSection {
  label: string
  items: NavItem[]
}

/**
 * Single source of truth for the workspace navigation. Consumed by the Sidebar
 * (to render groups/items) and by the Navbar (to derive the active page title).
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", href: "/overview", icon: LayoutGrid },
      { label: "Intake", href: "/intake", icon: Inbox },
      { label: "Hardware", href: "/hardware", icon: HardDrive },
      { label: "Software", href: "/software", icon: AppWindow },
      // { label: "AI Governance", href: "/ai-governance", icon: ShieldCheck, badge: "Beta" },
      { label: "Suppliers", href: "/suppliers", icon: Truck },
      // { label: "Compliance & Cert", href: "/compliance", icon: BadgeCheck },
      { label: "Employees", href: "/employees", icon: Users },
      { label: "Employee Lifecycle", href: "/employee-lifecycle", icon: Repeat },
      { label: "Requests", href: "/requests", icon: FileText },
      // { label: "Campaigns", href: "/campaigns", icon: Megaphone },
      // { label: "Integrations", href: "/integrations", icon: Plug },
      // { label: "AI Assist", href: "/ai-assist", icon: Sparkles, badge: "Beta" },
      // { label: "Reminders", href: "/reminders", icon: Bell },
      { label: "Reports", href: "/reports", icon: BarChart3 },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

const ALL_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items)

/** Resolve the page title for a pathname using the nav config. */
export function getPageTitle(pathname: string): string {
  const match = ALL_ITEMS.filter(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  ).sort((a, b) => b.href.length - a.href.length)[0]
  return match?.label ?? "Workspace"
}
