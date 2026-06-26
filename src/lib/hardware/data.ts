export type AuditEvent = {
  date: string
  action: string
  user: string
  notes?: string
}

export type AssetStatus = "In Stock" | "Assigned" | "Repair" | "Retired"

export type HardwareAsset = {
  id: string
  name: string
  tag: string
  category: string
  status: AssetStatus
  assignee: string
  supplier: string
  location: string
  warranty: string
  serial: string
  history: AuditEvent[]
}

export const HARDWARE_EMPLOYEES = [
  "John Doe",
  "Asha Nair",
  "Rahul Menon",
  "John Doe",
  "Jane Smith",
  "David Miller",
  "Sarah Jenkins",
] as const

export const HARDWARE_SUPPLIERS = [
  "Trace",
  "InnovB",
  "Dell Direct",
  "Apple Store",
  "Lenovo Direct",
  "Logitech Store",
] as const

export const HARDWARE_CATEGORIES = ["Laptop", "Monitor", "Phone", "Accessories", "Other"] as const

export const ASSET_STATUSES: AssetStatus[] = ["In Stock", "Assigned", "Repair", "Retired"]

export const Condition = ["New", "Good", "Fair", "Poor", "Broken"] as const

export const REPAIR_REASONS = [
  "Battery replacement/swollen",
  "Display/Screen replacement",
  "Keyboard/Trackpad damage",
  "Software corruption / OS wipe",
  "Other diagnostics",
] as const

export const initialHardwareAssets: HardwareAsset[] = [
  {
    id: "1",
    name: "HP Laptops",
    tag: "LAP-0012",
    category: "Laptop",
    status: "In Stock",
    assignee: "",
    supplier: "Trace",
    location: "",
    warranty: "2027-06-16",
    serial: "S/N: HP-LAP-0012-X",
    history: [
      {
        date: "2026-06-16",
        action: "Asset Ingested",
        user: "John Doe",
        notes: "Procured from supplier Trace.",
      },
    ],
  },
  {
    id: "2",
    name: "HP Laptops",
    tag: "LAP-0013",
    category: "Laptop",
    status: "In Stock",
    assignee: "",
    supplier: "Trace",
    location: "",
    warranty: "2027-06-16",
    serial: "S/N: HP-LAP-0013-X",
    history: [
      {
        date: "2026-06-16",
        action: "Asset Ingested",
        user: "John Doe",
        notes: "Procured from supplier Trace.",
      },
    ],
  },
  {
    id: "3",
    name: "HP Laptops",
    tag: "LAP-0014",
    category: "Laptop",
    status: "In Stock",
    assignee: "",
    supplier: "Trace",
    location: "",
    warranty: "2027-06-16",
    serial: "S/N: HP-LAP-0014-X",
    history: [
      {
        date: "2026-06-16",
        action: "Asset Ingested",
        user: "John Doe",
        notes: "Procured from supplier Trace.",
      },
    ],
  },
  {
    id: "4",
    name: "HP Laptops",
    tag: "LAP-0015",
    category: "Laptop",
    status: "In Stock",
    assignee: "",
    supplier: "Trace",
    location: "",
    warranty: "2027-06-16",
    serial: "S/N: HP-LAP-0015-X",
    history: [
      {
        date: "2026-06-16",
        action: "Asset Ingested",
        user: "John Doe",
        notes: "Procured from supplier Trace.",
      },
    ],
  },
  {
    id: "5",
    name: "HP Laptops",
    tag: "LAP-0011",
    category: "Laptop",
    status: "Assigned",
    assignee: "Mahesh",
    supplier: "Trace",
    location: "",
    warranty: "2027-06-16",
    serial: "S/N: HP-LAP-0011-Y",
    history: [
      {
        date: "2026-06-15",
        action: "Asset Ingested",
        user: "John Doe",
        notes: "Procured from supplier Trace.",
      },
      {
        date: "2026-06-16",
        action: "Assigned Device",
        user: "John Doe",
        notes: "Assigned during onboarding to John Doe.",
      },
    ],
  },
  {
    id: "6",
    name: "Macbook Pro 14",
    tag: "LAP-0027",
    category: "Laptop",
    status: "In Stock",
    assignee: "",
    supplier: "InnovB",
    location: "",
    warranty: "2026-06-14",
    serial: "S/N: AP-MBP-0027-A",
    history: [
      {
        date: "2025-06-14",
        action: "Asset Ingested",
        user: "John Doe",
        notes: "Procured from supplier InnovB.",
      },
    ],
  },
  {
    id: "7",
    name: "Macbook Pro 14",
    tag: "LAP-0028",
    category: "Laptop",
    status: "In Stock",
    assignee: "",
    supplier: "InnovB",
    location: "",
    warranty: "2026-06-14",
    serial: "S/N: AP-MBP-0028-B",
    history: [
      {
        date: "2025-06-14",
        action: "Asset Ingested",
        user: "John Doe",
        notes: "Procured from supplier InnovB.",
      },
    ],
  },
  {
    id: "8",
    name: "Dell UltraSharp U2723QE",
    tag: "MON-0104",
    category: "Monitor",
    status: "In Stock",
    assignee: "",
    supplier: "Dell Direct",
    location: "HQ - Bangalore",
    warranty: "2028-02-11",
    serial: "S/N: DE-MON-0104-M",
    history: [
      {
        date: "2025-02-11",
        action: "Asset Ingested",
        user: "John Doe",
        notes: "Standard desktop screen procurement.",
      },
    ],
  },
  {
    id: "9",
    name: "Dell UltraSharp U2723QE",
    tag: "MON-0105",
    category: "Monitor",
    status: "In Stock",
    assignee: "",
    supplier: "Dell Direct",
    location: "HQ - Bangalore",
    warranty: "2028-02-11",
    serial: "S/N: DE-MON-0105-N",
    history: [
      {
        date: "2025-02-11",
        action: "Asset Ingested",
        user: "John Doe",
        notes: "Standard desktop screen procurement.",
      },
    ],
  },
  {
    id: "10",
    name: "iPhone 15 Pro",
    tag: "PHN-0052",
    category: "Phone",
    status: "Repair",
    assignee: "Asha Nair",
    supplier: "Apple Store",
    location: "Remote - US",
    warranty: "2026-12-04",
    serial: "S/N: AP-IPH-0052-P",
    history: [
      {
        date: "2024-12-04",
        action: "Asset Ingested",
        user: "John Doe",
        notes: "Ingested mobile fleet device.",
      },
      {
        date: "2025-01-10",
        action: "Assigned Device",
        user: "John Doe",
        notes: "Assigned to Asha Nair.",
      },
      {
        date: "2026-06-12",
        action: "Sent to Repair",
        user: "Asha Nair",
        notes: "Battery health issue. Sent for diag service.",
      },
    ],
  },
  {
    id: "11",
    name: "Lenovo ThinkPad X1 Carbon",
    tag: "LAP-0081",
    category: "Laptop",
    status: "Assigned",
    assignee: "Rahul Menon",
    supplier: "Lenovo Direct",
    location: "Remote - US",
    warranty: "2027-03-18",
    serial: "S/N: LE-THK-0081-L",
    history: [
      {
        date: "2024-03-18",
        action: "Asset Ingested",
        user: "John Doe",
        notes: "Procured through IT contract.",
      },
      {
        date: "2024-04-01",
        action: "Assigned Device",
        user: "John Doe",
        notes: "Assigned to Rahul Menon for remote work setup.",
      },
    ],
  },
  {
    id: "12",
    name: "MacBook Air 13” (M2)",
    tag: "LAP-0106",
    category: "Laptop",
    status: "Retired",
    assignee: "",
    supplier: "Apple Store",
    location: "",
    warranty: "Expired",
    serial: "S/N: AP-MBA-0106-E",
    history: [
      { date: "2022-06-15", action: "Asset Ingested", user: "John Doe" },
      {
        date: "2026-06-15",
        action: "Retired Device",
        user: "John Doe",
        notes: "Out of support warranty cycle. Device decommissioned.",
      },
    ],
  },
  {
    id: "13",
    name: "Apple Magic Keyboard",
    tag: "ACC-0210",
    category: "Accessories",
    status: "In Stock",
    assignee: "",
    supplier: "Apple Store",
    location: "HQ - Bangalore",
    warranty: "2026-09-22",
    serial: "S/N: AP-KBD-0210-K",
    history: [{ date: "2025-09-22", action: "Asset Ingested", user: "John Doe" }],
  },
  {
    id: "14",
    name: "Apple Magic Mouse",
    tag: "ACC-0211",
    category: "Accessories",
    status: "In Stock",
    assignee: "",
    supplier: "Apple Store",
    location: "HQ - Bangalore",
    warranty: "2026-09-22",
    serial: "S/N: AP-MSE-0211-M",
    history: [{ date: "2025-09-22", action: "Asset Ingested", user: "John Doe" }],
  },
  {
    id: "15",
    name: "Logitech MX Master 3S",
    tag: "ACC-0345",
    category: "Accessories",
    status: "Assigned",
    assignee: "Mahesh",
    supplier: "Logitech Store",
    location: "",
    warranty: "2026-11-05",
    serial: "S/N: LO-MSE-0345-S",
    history: [
      { date: "2024-11-05", action: "Asset Ingested", user: "John Doe" },
      {
        date: "2024-12-01",
        action: "Assigned Device",
        user: "John Doe",
        notes: "Assigned custom mouse to Mahesh.",
      },
    ],
  },
]
