/**
 * Workspace role & permission definitions for Settings → Roles.
 *
 * Modules with `visible: false` are defined for future routes (see nav-config
 * comments) but hidden in the UI until those pages ship.
 */

export type PermissionModuleDefinition = {
  id: string
  label: string
  permissions: readonly string[]
  /** When false, module is kept in data but not rendered. */
  visible: boolean
}

export type SettingsPermissionDefinition = {
  id: string
  label: string
  visible: boolean
}

export type RoleTemplateId = "admin" | "manager" | "hr" | "employee"

export type RoleDefinition = {
  id: RoleTemplateId | string
  name: string
  subtitle: string
  description?: string
  badge?: string
  locked?: boolean
  /** moduleId → granted permission labels */
  moduleGrants: Record<string, readonly string[]>
  /** settings permission ids */
  settingsGrants: readonly string[]
}

/** Workspace modules — mirror nav-config; set visible when the route exists. */
export const PERMISSION_MODULES: PermissionModuleDefinition[] = [
  { id: "overview", label: "Overview", permissions: ["View"], visible: true },
  { id: "intake", label: "Intake", permissions: ["View", "Create", "Receive stock"], visible: true },
  { id: "hardware", label: "Hardware", permissions: ["View", "Edit", "Import"], visible: true },
  { id: "software", label: "Software", permissions: ["View", "Edit", "Assign licenses"], visible: true },
  // { label: "AI Governance", href: "/ai-governance" }
  { id: "ai-governance", label: "AI Governance", permissions: ["View", "Manage"], visible: false },
  { id: "suppliers", label: "Suppliers", permissions: ["View", "Edit"], visible: true },
  // { label: "Compliance & Cert", href: "/compliance" }
  {
    id: "compliance",
    label: "Compliance",
    permissions: ["View", "Edit", "Assign certifications"],
    visible: false,
  },
  { id: "employees", label: "Employees", permissions: ["View", "Edit", "Provision"], visible: true },
  {
    id: "employee-lifecycle",
    label: "Employee lifecycle",
    permissions: ["View", "Onboard", "Offboard"],
    visible: true,
  },
  { id: "requests", label: "Requests", permissions: ["View", "Manage"], visible: true },
  // { label: "Campaigns", href: "/campaigns" }
  { id: "campaigns", label: "Campaigns", permissions: ["View", "Manage"], visible: false },
  // { label: "Integrations", href: "/integrations" }
  { id: "integrations", label: "Integrations", permissions: ["View", "Manage"], visible: false },
  { id: "integrations-demo", label: "Integrations (Demo)", permissions: ["View"], visible: false },
  // { label: "AI Assist", href: "/ai-assist" }
  { id: "ai-assist", label: "AI Assist", permissions: ["View"], visible: false },
  // { label: "Reminders", href: "/reminders" }
  { id: "reminders", label: "Reminders", permissions: ["View", "Manage"], visible: false },
  { id: "reports", label: "Reports", permissions: ["View", "Export"], visible: true },
]

/** Settings-area permissions — visible when a matching settings tab exists. */
export const SETTINGS_PERMISSIONS: SettingsPermissionDefinition[] = [
  { id: "own-profile", label: "Own profile", visible: true },
  { id: "organization", label: "Organization", visible: true },
  // Billing tab — not shipped
  { id: "company-ids", label: "Company IDs", visible: false },
  { id: "billing", label: "Billing", visible: false },
  // Security tab — not shipped
  { id: "sso-security", label: "SSO / security", visible: false },
  { id: "team", label: "Team", visible: true },
  { id: "roles-permissions", label: "Roles & permissions", visible: true },
  // Notifications tab — not shipped
  { id: "notifications", label: "Notifications", visible: false },
  { id: "appearance", label: "Appearance", visible: true },
]

export const VISIBLE_PERMISSION_MODULES = PERMISSION_MODULES.filter((module) => module.visible)

export const VISIBLE_SETTINGS_PERMISSIONS = SETTINGS_PERMISSIONS.filter((permission) => permission.visible)

function allModuleGrants(): Record<string, readonly string[]> {
  return Object.fromEntries(
    PERMISSION_MODULES.map((module) => [module.id, [...module.permissions]])
  )
}

function allSettingsGrants(): string[] {
  return SETTINGS_PERMISSIONS.map((permission) => permission.id)
}

const EMPLOYEE_MODULE_GRANTS: Record<string, readonly string[]> = {
  overview: ["View"],
  intake: ["View", "Create", "Receive stock"],
  hardware: ["View", "Edit", "Import"],
  software: ["View", "Edit", "Assign licenses"],
  "ai-governance": ["View", "Manage"],
  suppliers: ["View", "Edit"],
  compliance: ["View", "Edit", "Assign certifications"],
  employees: ["View", "Edit", "Provision"],
  "employee-lifecycle": ["View", "Onboard", "Offboard"],
  requests: ["View", "Manage"],
  campaigns: ["View", "Manage"],
  integrations: ["View", "Manage"],
  "integrations-demo": ["View"],
  "ai-assist": ["View"],
  reminders: ["View", "Manage"],
  reports: ["View", "Export"],
}

const EMPLOYEE_SETTINGS_GRANTS = [
  "own-profile",
  "organization",
  "company-ids",
  "billing",
  "sso-security",
  "team",
  "roles-permissions",
  "notifications",
  "appearance",
] as const

const MANAGER_MODULE_GRANTS = EMPLOYEE_MODULE_GRANTS

/** Manager: operational access without org/SSO/roles admin. */
const MANAGER_SETTINGS_GRANTS = EMPLOYEE_SETTINGS_GRANTS.filter(
  (id) => id !== "roles-permissions" && id !== "sso-security"
)

/** HR: people operations — same workspace scope as manager, focused on employee records. */
const HR_MODULE_GRANTS = MANAGER_MODULE_GRANTS

const HR_SETTINGS_GRANTS = MANAGER_SETTINGS_GRANTS

export const BUILT_IN_ROLES: RoleDefinition[] = [
  {
    id: "admin",
    name: "Admin",
    subtitle: "Full workspace access",
    description: "Admin has all permissions and cannot be edited.",
    badge: "Admin",
    locked: true,
    moduleGrants: allModuleGrants(),
    settingsGrants: allSettingsGrants(),
  },
  {
    id: "manager",
    name: "Manager",
    subtitle: "Operational access without org/SSO/roles admin",
    moduleGrants: MANAGER_MODULE_GRANTS,
    settingsGrants: [...MANAGER_SETTINGS_GRANTS],
  },
  {
    id: "hr",
    name: "HR",
    subtitle: "People operations, onboarding, and employee lifecycle",
    moduleGrants: HR_MODULE_GRANTS,
    settingsGrants: [...HR_SETTINGS_GRANTS],
  },
  {
    id: "employee",
    name: "Employee",
    subtitle: "Limited dashboard access",
    moduleGrants: EMPLOYEE_MODULE_GRANTS,
    settingsGrants: [...EMPLOYEE_SETTINGS_GRANTS],
  },
]

export const ROLE_TEMPLATE_OPTIONS = [
  { value: "admin", label: "Admin (full access)" },
  { value: "manager", label: "Manager (operational access)" },
  { value: "hr", label: "HR (people operations)" },
  { value: "employee", label: "Employee (limited)" },
] as const

export function isPermissionGranted(
  role: RoleDefinition,
  moduleId: string,
  permission: string
): boolean {
  return role.moduleGrants[moduleId]?.includes(permission) ?? false
}

export function isSettingsPermissionGranted(role: RoleDefinition, permissionId: string): boolean {
  return role.settingsGrants.includes(permissionId)
}
