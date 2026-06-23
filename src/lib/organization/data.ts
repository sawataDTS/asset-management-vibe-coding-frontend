import {
  CURRENCY_OPTIONS,
  ORG_SIZE_OPTIONS,
  TIMEZONE_OPTIONS,
} from "@/lib/settings-data"

export type OrganizationStatus = "active" | "pending" | "suspended" | "inactive"

export type Organization = {
  id: string
  name: string
  slug: string
  industry: string
  size: string
  timezone: string
  defaultCurrency: string
  status: OrganizationStatus
  billingEmail: string
  activatedAt: string
  companyPhone: string
  address: string
  website: string
}

export const ORGANIZATION_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
  { value: "inactive", label: "Inactive" },
] as const

export const ORGANIZATION_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  ...ORGANIZATION_STATUS_OPTIONS,
] as const

export const initialOrganizations: Organization[] = [
  {
    id: "org-1",
    name: "DTSkill Services Private Limited",
    slug: "dtskill-services-private-limited-db377d5c",
    industry: "Information Technology",
    size: "51-200",
    timezone: "Asia/Kolkata",
    defaultCurrency: "USD",
    status: "active",
    billingEmail: "billing@dtskill.com",
    activatedAt: "2024-03-15",
    companyPhone: "+91 80 1234 5678",
    address: "42 MG Road, Bangalore, Karnataka 560001, India",
    website: "https://dtskill.com",
  },
  {
    id: "org-2",
    name: "Acme Corporation",
    slug: "acme-corporation-a1b2c3d4",
    industry: "Manufacturing",
    size: "201-500",
    timezone: "America/Chicago",
    defaultCurrency: "USD",
    status: "pending",
    billingEmail: "finance@acme.example",
    activatedAt: "",
    companyPhone: "+1 312 555 0100",
    address: "100 Industrial Way, Chicago, IL 60601, USA",
    website: "https://acme.example",
  },
  {
    id: "org-3",
    name: "Northwind Traders",
    slug: "northwind-traders-e5f6g7h8",
    industry: "Retail",
    size: "11-50",
    timezone: "Europe/London",
    defaultCurrency: "GBP",
    status: "inactive",
    billingEmail: "accounts@northwind.example",
    activatedAt: "2023-08-01",
    companyPhone: "+44 20 7946 0958",
    address: "5 King Street, London, UK",
    website: "https://northwind.example",
  },
  {
    id: "org-4",
    name: "Contoso Ltd",
    slug: "contoso-ltd-i9j0k1l2",
    industry: "Financial Services",
    size: "501-1000",
    timezone: "America/New_York",
    defaultCurrency: "USD",
    status: "suspended",
    billingEmail: "billing@contoso.example",
    activatedAt: "2022-11-20",
    companyPhone: "+1 212 555 0199",
    address: "1 Microsoft Way, Redmond, WA 98052, USA",
    website: "https://contoso.example",
  },
  {
    id: "org-5",
    name: "Fabrikam Inc",
    slug: "fabrikam-inc-m3n4o5p6",
    industry: "Healthcare",
    size: "51-200",
    timezone: "America/Los_Angeles",
    defaultCurrency: "USD",
    status: "active",
    billingEmail: "ap@fabrikam.example",
    activatedAt: "2024-01-10",
    companyPhone: "+1 415 555 0142",
    address: "500 Market Street, San Francisco, CA 94105, USA",
    website: "https://fabrikam.example",
  },
]

export function formatOrganizationStatus(status: OrganizationStatus) {
  return ORGANIZATION_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status
}

export function createOrganizationSlug(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  const suffix = Math.random().toString(36).slice(2, 10)
  return base ? `${base}-${suffix}` : `organization-${suffix}`
}

export function createEmptyOrganization(): Organization {
  return {
    id: "",
    name: "",
    slug: "",
    industry: "",
    size: "51-200",
    timezone: "UTC",
    defaultCurrency: "USD",
    status: "pending",
    billingEmail: "",
    activatedAt: "",
    companyPhone: "",
    address: "",
    website: "",
  }
}

export { CURRENCY_OPTIONS, ORG_SIZE_OPTIONS, TIMEZONE_OPTIONS }
