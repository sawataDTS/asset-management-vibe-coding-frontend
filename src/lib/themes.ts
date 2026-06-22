export type WorkspaceThemeId =
  | "purple-workspace"
  | "arctic-light"
  | "ocean-cyan"
  | "emerald-workspace"
  | "slate-enterprise"
  | "rose-quartz"
  | "amber-executive"
  | "carbon-enterprise"
  | "azure-corporate"
  | "atlassian-executive"
  | "enterprise-navy"
  | "graphite-premium"
  | "linear-lavender"
  | "slack-aubergine"
  | "hubspot-coral"
  | "shopify-forest"
  | "miro-canary"
  | "twilio-signal"
  | "notion-studio"
  | "zendesk-garden"
  | "midnight-dark"
  | "graphite-dark"
  | "neon-cyber"
  | "linear-obsidian"
  | "vercel-midnight"

export type WorkspaceThemeMode = "light" | "dark"

export interface WorkspaceTheme {
  id: WorkspaceThemeId
  name: string
  mode: WorkspaceThemeMode
  description: string
}

export const DEFAULT_THEME: WorkspaceThemeId = "arctic-light"

export const WORKSPACE_THEMES: WorkspaceTheme[] = [
  {
    id: "arctic-light",
    name: "Arctic Light",
    mode: "light",
    description: "Default — extremely clean white with subtle blue accents.",
  },
  {
    id: "purple-workspace",
    name: "Purple Workspace",
    mode: "light",
    description: "Modern, professional executive SaaS.",
  },
  {
    id: "ocean-cyan",
    name: "Ocean Cyan",
    mode: "light",
    description: "Modern analytics & monitoring platform.",
  },
  {
    id: "emerald-workspace",
    name: "Emerald Workspace",
    mode: "light",
    description: "Asset, finance & operations — stable and trustworthy.",
  },
  {
    id: "slate-enterprise",
    name: "Slate Enterprise",
    mode: "light",
    description: "Corporate B2B internal tools. Very neutral.",
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    mode: "light",
    description: "Premium, soft and modern.",
  },
  {
    id: "amber-executive",
    name: "Amber Executive",
    mode: "light",
    description: "Financial dashboards & reporting. Warm, professional.",
  },
  {
    id: "carbon-enterprise",
    name: "Carbon Enterprise",
    mode: "light",
    description: "Enterprise analytics, operations, governance, and internal tools.",
  },
  {
    id: "azure-corporate",
    name: "Azure Corporate",
    mode: "light",
    description: "Monitoring, cloud operations, reporting, and asset management.",
  },
  {
    id: "atlassian-executive",
    name: "Atlassian Executive",
    mode: "light",
    description: "Workflow management, enterprise SaaS, and project operations.",
  },
  {
    id: "enterprise-navy",
    name: "Enterprise Navy",
    mode: "light",
    description: "Finance, procurement, compliance, and executive reporting.",
  },
  {
    id: "graphite-premium",
    name: "Graphite Premium",
    mode: "light",
    description: "Modern premium SaaS, analytics, billing, and platform administration.",
  },
  {
    id: "linear-lavender",
    name: "Linear Lavender",
    mode: "light",
    description: "Linear-inspired issue tracking — restrained indigo on cool neutrals.",
  },
  {
    id: "slack-aubergine",
    name: "Slack Aubergine",
    mode: "light",
    description: "Slack-inspired collaboration — deep aubergine with warm lavender surfaces.",
  },
  {
    id: "hubspot-coral",
    name: "HubSpot Coral",
    mode: "light",
    description: "HubSpot-inspired CRM — energetic coral for marketing and sales ops.",
  },
  {
    id: "shopify-forest",
    name: "Shopify Forest",
    mode: "light",
    description: "Shopify-inspired commerce — deep forest teal for retail and inventory.",
  },
  {
    id: "miro-canary",
    name: "Miro Canary",
    mode: "light",
    description: "Miro-inspired visual workspace — confident gold accent on clean white.",
  },
  {
    id: "twilio-signal",
    name: "Twilio Signal",
    mode: "light",
    description: "Twilio-inspired communications — bold signal red for alerts and ops.",
  },
  {
    id: "notion-studio",
    name: "Notion Studio",
    mode: "light",
    description: "Notion-inspired docs & wiki — warm paper tones with studio violet.",
  },
  {
    id: "zendesk-garden",
    name: "Zendesk Garden",
    mode: "light",
    description: "Zendesk-inspired support — garden teal for helpdesk and service desks.",
  },
  {
    id: "midnight-dark",
    name: "Midnight Dark",
    mode: "dark",
    description: "Premium dark mode with shadcn-grade contrast.",
  },
  {
    id: "graphite-dark",
    name: "Graphite Dark",
    mode: "dark",
    description: "Neutral, minimal, engineering focused.",
  },
  {
    id: "neon-cyber",
    name: "Neon Cyber",
    mode: "dark",
    description: "Futuristic AI / analytics. Bold but professional.",
  },
  {
    id: "linear-obsidian",
    name: "Linear Obsidian",
    mode: "dark",
    description: "Linear dark mode — near-black canvas with a single lavender accent.",
  },
  {
    id: "vercel-midnight",
    name: "Vercel Midnight",
    mode: "dark",
    description: "Vercel-inspired engineering — pure monochrome with high-contrast type.",
  },
]

export const WORKSPACE_THEME_IDS: WorkspaceThemeId[] = WORKSPACE_THEMES.map((t) => t.id)

export const LIGHT_THEMES: WorkspaceTheme[] = WORKSPACE_THEMES.filter((t) => t.mode === "light")
export const DARK_THEMES: WorkspaceTheme[] = WORKSPACE_THEMES.filter((t) => t.mode === "dark")

/** Map a workspace theme id to Sonner's light/dark mode (not a palette id). */
export function getWorkspaceThemeMode(themeId: string | undefined): WorkspaceThemeMode {
  return WORKSPACE_THEMES.find((theme) => theme.id === themeId)?.mode ?? "light"
}
