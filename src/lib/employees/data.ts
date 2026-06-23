export type WorkspaceRole = "Employee" | "Manager" | "Admin"

export type EmploymentStatus = "Active" | "On Leave" | "Terminated"

export type EmployeeAssignment = {
  id: string
  name: string
  tag: string
  supplier?: string
}

export type Employee = {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  jobTitle: string
  department: string
  manager: string
  startDate: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  workspaceEnabled: boolean
  workspaceRole: WorkspaceRole
  status: EmploymentStatus
  notes: string
  hardwareAssignments: EmployeeAssignment[]
  softwareAssignments: EmployeeAssignment[]
}

export const EMPLOYEE_DEPARTMENTS = [
  "Engineering",
  "Design",
  "IT Ops",
  "HR",
  "Finance",
  "Sales",
  "Marketing",
] as const

export const EMPLOYEE_MANAGERS = ["— None —", "John Doe", "Asha Nair", "Rahul Menon"] as const

export const WORKSPACE_ROLES: WorkspaceRole[] = ["Employee", "Manager", "Admin"]

export const EMPLOYMENT_STATUSES: EmploymentStatus[] = ["Active", "On Leave", "Terminated"]

export const AVAILABLE_HARDWARE = [
  { id: "hw-1", name: "MacBook Pro 14", tag: "LAP-0001" },
  { id: "hw-2", name: "Dell UltraSharp U2723QE", tag: "MON-0042" },
  { id: "hw-3", name: "HP Laptops", tag: "LAP-0012" },
  { id: "hw-4", name: "iPhone 15 Pro", tag: "PHN-0088" },
  {
    id: "hw-long",
    name: "Lenovo ThinkPad P16 Gen 2 Mobile Workstation — 64GB RAM / 2TB NVMe / RTX 5000 Ada",
    tag: "LAP-ENTERPRISE-LONG-ASSIGN-TEST",
  },
] as const

export const AVAILABLE_SOFTWARE = [
  { id: "sw-1", name: "Microsoft 365 Enterprise", tag: "M365-ENT", supplier: "Microsoft" },
  { id: "sw-2", name: "Adobe Premier", tag: "ADOBE-PR", supplier: "Adobe" },
  { id: "sw-3", name: "Figma Organization", tag: "FIG-ORG", supplier: "Figma" },
  { id: "sw-4", name: "Slack Pro Plan", tag: "SLK-PRO", supplier: "Slack" },
  {
    id: "sw-long",
    name: "Microsoft Business 365 Enterprise E5 Security & Compliance Add-on (Global Tenant License Pool)",
    tag: "M365-E5-LONG-ASSIGN-TEST",
    supplier: "Microsoft Corporation · Enterprise Agreement",
  },
] as const

export const initialEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP-1001",
    name: "Mahesh",
    email: "mahesh@dtskill.com",
    phone: "97900191202",
    jobTitle: "IT Administrator",
    department: "",
    manager: "— None —",
    startDate: "2024-03-15",
    address: "afas",
    city: "fas",
    state: "fafa",
    zip: "60606",
    country: "nfd",
    workspaceEnabled: true,
    workspaceRole: "Admin",
    status: "Active",
    notes: "",
    hardwareAssignments: [
      { id: "hw-a", name: "Macbook Pro 14", tag: "LAP-0001" },
      { id: "hw-b", name: "HP Laptops", tag: "LAP-0011" },
    ],
    softwareAssignments: [
      { id: "sw-a", name: "Adobe Premier", tag: "ADOBE-PR" },
      {
        id: "sw-b",
        name: "Microsoft Business 365 Basic #1",
        tag: "M365-BASIC",
        supplier: "Microsoft",
      },
    ],
  },
  {
    id: "2",
    employeeId: "EMP-1002",
    name: "Asha Nair",
    email: "asha.nair@dtskill.com",
    phone: "+91 98765 43210",
    jobTitle: "Design Lead",
    department: "Design",
    manager: "John Doe",
    startDate: "2023-08-01",
    address: "42 MG Road",
    city: "Bangalore",
    state: "Karnataka",
    zip: "560001",
    country: "India",
    workspaceEnabled: true,
    workspaceRole: "Manager",
    status: "Active",
    notes: "Leads product design team.",
    hardwareAssignments: [{ id: "hw-c", name: "MacBook Air 13", tag: "LAP-0022" }],
    softwareAssignments: [{ id: "sw-c", name: "Figma Organization", tag: "FIG-ORG", supplier: "Figma" }],
  },
  {
    id: "3",
    employeeId: "EMP-1003",
    name: "Rahul Menon",
    email: "rahul.menon@dtskill.com",
    phone: "+91 91234 56789",
    jobTitle: "Software Engineer",
    department: "Engineering",
    manager: "John Doe",
    startDate: "2025-01-10",
    address: "18 Residency Road",
    city: "Bangalore",
    state: "Karnataka",
    zip: "560025",
    country: "India",
    workspaceEnabled: true,
    workspaceRole: "Employee",
    status: "Active",
    notes: "",
    hardwareAssignments: [],
    softwareAssignments: [{ id: "sw-d", name: "JetBrains IDE Suite", tag: "JB-IDE", supplier: "JetBrains" }],
  },
  {
    id: "4",
    employeeId: "EMP-1004",
    name: "John Doe",
    email: "john.doe@dtskill.com",
    phone: "+1 555 010 2233",
    jobTitle: "Account Executive",
    department: "Sales",
    manager: "Asha Nair",
    startDate: "2022-11-20",
    address: "500 Market Street",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "USA",
    workspaceEnabled: false,
    workspaceRole: "Employee",
    status: "On Leave",
    notes: "Extended leave until July.",
    hardwareAssignments: [],
    softwareAssignments: [],
  },
]

export function formatEmployeeLocation(emp: Employee) {
  const parts = [emp.address, emp.city, emp.state, emp.zip, emp.country].filter(Boolean)
  return parts.join(", ")
}
