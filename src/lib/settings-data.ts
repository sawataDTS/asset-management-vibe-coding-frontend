import type { RoleTemplateId } from "@/lib/settings/roles-data"

export interface ProfileSettings {
  fullName: string
  email: string
  jobTitle: string
  phone: string
  avatarUrl: string
  workspaceRole: RoleTemplateId
}

export interface OrganizationSettings {
  companyName: string
  slug: string
  industry: string
  size: string
  timezone: string
  defaultCurrency: string
  logoUrl: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
}

export const DEFAULT_PROFILE: ProfileSettings = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  jobTitle: "",
  phone: "",
  avatarUrl: "",
  workspaceRole: "employee",
}

export const DEFAULT_ORGANIZATION: OrganizationSettings = {
  companyName: "DTSkill Services Private Limited",
  slug: "dtskill-services-private-limited-db377d5c",
  industry: "",
  size: "51-200",
  timezone: "UTC",
  defaultCurrency: "USD",
  logoUrl: "",
}

export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Employee",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "Admin",
  },
  {
    id: "3",
    name: "Michael Rivera",
    email: "michael.rivera@example.com",
    role: "Manager",
  },
  {
    id: "4",
    name: "Emily Watson",
    email: "emily.watson@example.com",
    role: "HR",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "Employee",
  },
  {
    id: "6",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    role: "Employee",
  },
]

export const ORG_SIZE_OPTIONS = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"] as const

export const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC", description: "Coordinated Universal Time" },
  { value: "America/New_York", label: "Eastern Time", description: "America/New_York (ET)" },
  { value: "America/Chicago", label: "Central Time", description: "America/Chicago (CT)" },
  { value: "America/Los_Angeles", label: "Pacific Time", description: "America/Los_Angeles (PT)" },
  { value: "Europe/London", label: "London", description: "Europe/London (GMT/BST)" },
  { value: "Asia/Kolkata", label: "India Standard Time", description: "Asia/Kolkata (IST)" },
] as const

export const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "INR", "AUD", "CAD"] as const
