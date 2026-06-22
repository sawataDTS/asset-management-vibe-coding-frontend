export type AuditEvent = {
  date: string
  action: string
  user: string
  notes?: string
}

export type LicenseStatus = "Active" | "Expiring Soon" | "Expired"

export type SoftwareLicense = {
  id: string
  name: string
  category: string
  supplier: string
  totalSeats: number
  assignedSeats: number
  renewalDate: string
  cost: string
  key: string
  status: LicenseStatus
  assignees: string[]
  history: AuditEvent[]
  description?: string
}

export const SOFTWARE_EMPLOYEES = [
  "John Doe",
  "Asha Nair",
  "Rahul Menon",
  "John Doe",
  "Jane Smith",
  "David Miller",
  "Sarah Jenkins",
  "Nikhil Sharma",
  "Priya Patel",
  "Rohan Gupta",
] as const

export const SOFTWARE_CATEGORIES = ["Developer Tools", "Design", "Collaboration", "Productivity"] as const

export const LICENSE_STATUSES: LicenseStatus[] = ["Active", "Expiring Soon", "Expired"]

export const initialLicenses: SoftwareLicense[] = [
  {
    id: "1",
    name: "Microsoft 365 Enterprise",
    category: "Productivity",
    supplier: "Microsoft Corp.",
    totalSeats: 50,
    assignedSeats: 42,
    renewalDate: "2027-04-18",
    cost: "$750/mo",
    key: "M365-ENT-88X92-J29KL-44910",
    status: "Active",
    assignees: [
      "John Doe",
      "Asha Nair",
      "Rahul Menon",
      "John Doe",
      "Jane Smith",
      "David Miller",
      "Sarah Jenkins",
    ],
    history: [
      {
        date: "2026-04-18",
        action: "Subscription Renewed",
        user: "John Doe",
        notes: "Enterprise billing renewal for 12 months.",
      },
      {
        date: "2026-04-20",
        action: "Seat Allocated",
        user: "John Doe",
        notes: "Assigned license seat to John Doe.",
      },
    ],
    description: "Office suite apps including Word, Excel, Teams, and Cloud storage.",
  },
  {
    id: "2",
    name: "Figma Organization",
    category: "Design",
    supplier: "Figma Inc.",
    totalSeats: 20,
    assignedSeats: 18,
    renewalDate: "2026-12-14",
    cost: "$900/mo",
    key: "FIG-ORG-DESIGN-77F12-FIGMA",
    status: "Active",
    assignees: ["John Doe", "Asha Nair", "Rahul Menon", "Sarah Jenkins"],
    history: [
      {
        date: "2025-12-14",
        action: "Subscription Ingested",
        user: "John Doe",
        notes: "Design team seat setup.",
      },
    ],
    description: "Collaborative interface design tool for UX/UI designers.",
  },
  {
    id: "3",
    name: "JetBrains IDE Suite",
    category: "Developer Tools",
    supplier: "JetBrains s.r.o.",
    totalSeats: 15,
    assignedSeats: 14,
    renewalDate: "2026-07-28",
    cost: "$350/mo",
    key: "JB-IDE-SUITE-99B12-JETBR",
    status: "Expiring Soon",
    assignees: ["Rahul Menon", "Jane Smith", "David Miller"],
    history: [{ date: "2025-07-28", action: "Subscription Ingested", user: "John Doe" }],
    description: "All-product pack containing IntelliJ, WebStorm, PyCharm, and CLion.",
  },
  {
    id: "4",
    name: "Slack Pro Plan",
    category: "Collaboration",
    supplier: "Slack Technologies",
    totalSeats: 100,
    assignedSeats: 92,
    renewalDate: "2027-02-05",
    cost: "$660/mo",
    key: "SLK-PRO-CHAT-55K01-SLACK",
    status: "Active",
    assignees: ["John Doe", "Asha Nair", "Rahul Menon", "John Doe", "Jane Smith"],
    history: [{ date: "2026-02-05", action: "Subscription Renewed", user: "John Doe" }],
    description: "Communication workspace for channels, threads, and huddles.",
  },
  {
    id: "5",
    name: "GitHub Enterprise",
    category: "Developer Tools",
    supplier: "GitHub Inc.",
    totalSeats: 30,
    assignedSeats: 30,
    renewalDate: "2026-07-15",
    cost: "$630/mo",
    key: "GH-ENT-CODE-44D92-GITUB",
    status: "Expiring Soon",
    assignees: ["John Doe", "Rahul Menon", "Jane Smith", "David Miller"],
    history: [
      { date: "2025-07-15", action: "Subscription Ingested", user: "John Doe" },
      {
        date: "2026-05-10",
        action: "Upgraded Capacity",
        user: "John Doe",
        notes: "Increased seats limit from 20 to 30.",
      },
    ],
    description: "Enterprise software repository hosting and CI/CD pipelines.",
  },
  {
    id: "6",
    name: "Adobe Creative Cloud",
    category: "Design",
    supplier: "Adobe Inc.",
    totalSeats: 10,
    assignedSeats: 10,
    renewalDate: "2026-06-01",
    cost: "$800/mo",
    key: "ADB-CRE-CLOUD-11A99-ADOBE",
    status: "Expired",
    assignees: ["Asha Nair", "Sarah Jenkins"],
    history: [
      { date: "2025-06-01", action: "Subscription Ingested", user: "John Doe" },
      {
        date: "2026-06-01",
        action: "Subscription Expired",
        user: "System Alerts",
        notes: "Auto-renew disabled. Payment failed.",
      },
    ],
    description: "Creative suite including Photoshop, Illustrator, Premiere, and After Effects.",
  },
]
