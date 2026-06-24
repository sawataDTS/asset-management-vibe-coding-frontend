export type TemplateLineType = "hardware" | "software"

export type TemplateLine = {
  id: string
  type: TemplateLineType
  item: string
  quantity: number
  required: boolean
}

export type DepartmentTemplate = {
  id: string
  department: string
  notes: string
  lines: TemplateLine[]
}

export type StockItemStatus = "in_stock" | "out_of_stock"

export type OnboardingStockItem = {
  label: string
  status: StockItemStatus
  assigned: number
  total: number
}

export type PendingOnboardingEmployee = {
  id: string
  name: string
  email: string
  status: string
  department: string
  templateName: string
  stock: OnboardingStockItem[]
  assignableNow: number
}

export type LabelEmployee = {
  id: string
  name: string
  email: string
  department: string
  hardwareCount: number
  addressReady: boolean
}

export type LifecycleHistoryEntry = {
  id: string
  when: string
  employeeName: string
  mode: "onboard" | "offboard"
  successCount: number
  skippedCount: number
  pendingCount: number
}

export type ChecklistItemStatus = "pending" | "in_progress" | "done" | "skipped"

export type OffboardingChecklistItem = {
  id: string
  label: string
  optional?: boolean
  status: ChecklistItemStatus
}

export type OffboardingHardware = {
  id: string
  name: string
  tag: string
}

export type OffboardingLicense = {
  id: string
  name: string
  tag: string
}

export type ActiveOffboarding = {
  id: string
  employeeName: string
  department: string
  initiatedAt: string
  lastDay: string
  reasonNotes: string
  checklist: OffboardingChecklistItem[]
  hardware: OffboardingHardware[]
  licenses: OffboardingLicense[]
}

export type OffboardingCandidate = {
  id: string
  name: string
  email: string
  department: string
  status: string
}

export const CHECKLIST_ITEM_STATUSES: ChecklistItemStatus[] = ["pending", "in_progress", "done", "skipped"]

export const CHECKLIST_STATUS_LABELS: Record<ChecklistItemStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  done: "Done",
  skipped: "Skipped",
}

export const TEMPLATE_HARDWARE_CATEGORIES = [
  "Laptop",
  "Monitor",
  "Phone",
  "Tablet",
  "Accessory",
  "Desktop",
  "Other",
] as const

export const TEMPLATE_SOFTWARE_LICENSES = [
  "Adobe Premier",
  "Microsoft 365 Enterprise",
  "Microsoft Business 365 Basic",
  "Figma Organization",
  "Slack Pro Plan",
  "JetBrains IDE Suite",
] as const

export const initialDepartmentTemplates: DepartmentTemplate[] = [
  {
    id: "tpl-1",
    department: "Test",
    notes: "",
    lines: [
      {
        id: "ln-1",
        type: "hardware",
        item: "Monitor",
        quantity: 1,
        required: true,
      },
      {
        id: "ln-2",
        type: "software",
        item: "Microsoft Business 365 Basic",
        quantity: 1,
        required: true,
      },
    ],
  },
  {
    id: "tpl-2",
    department: "test_2",
    notes: "test_2_notes",
    lines: [
      {
        id: "ln-3",
        type: "hardware",
        item: "Laptop",
        quantity: 1,
        required: true,
      },
      {
        id: "ln-4",
        type: "software",
        item: "Adobe Premier",
        quantity: 1,
        required: true,
      },
    ],
  },
  {
    id: "tpl-3",
    department: "test_department_1",
    notes: "",
    lines: [],
  },
]

export const initialPendingOnboarding: PendingOnboardingEmployee[] = [
  {
    id: "onb-1",
    name: "Employee4",
    email: "employee4@gmail.com",
    status: "active",
    department: "Test",
    templateName: "Test",
    stock: [
      {
        label: "monitor x 1",
        status: "out_of_stock",
        assigned: 0,
        total: 1,
      },
    ],
    assignableNow: 1,
  },
  {
    id: "onb-2",
    name: "Employee5",
    email: "employee5@gmail.com",
    status: "active",
    department: "test_2",
    templateName: "test_2",
    stock: [
      {
        label: "laptop x 1",
        status: "in_stock",
        assigned: 0,
        total: 1,
      },
      {
        label: "Adobe Premier x 1",
        status: "in_stock",
        assigned: 0,
        total: 1,
      },
    ],
    assignableNow: 2,
  },
  {
    id: "onb-3",
    name: "Employee6",
    email: "employee6@gmail.com",
    status: "active",
    department: "Test",
    templateName: "Test",
    stock: [
      {
        label: "monitor x 1",
        status: "in_stock",
        assigned: 1,
        total: 1,
      },
      {
        label: "Microsoft Business 365 Basic x 1",
        status: "out_of_stock",
        assigned: 0,
        total: 1,
      },
    ],
    assignableNow: 0,
  },
]

export const initialLabelEmployees: LabelEmployee[] = [
  {
    id: "lbl-1",
    name: "Employee4",
    email: "employee4@gmail.com",
    department: "test_2",
    hardwareCount: 1,
    addressReady: true,
  },
  {
    id: "lbl-2",
    name: "Mahesh",
    email: "mahesh@dtskill.com",
    department: "—",
    hardwareCount: 2,
    addressReady: true,
  },
  {
    id: "lbl-3",
    name: "Asha Nair",
    email: "asha.nair@dtskill.com",
    department: "Design",
    hardwareCount: 1,
    addressReady: false,
  },
]

export const initialLifecycleHistory: LifecycleHistoryEntry[] = [
  {
    id: "hist-1",
    when: "2026-06-18T17:07:25",
    employeeName: "Employee_1",
    mode: "offboard",
    successCount: 2,
    skippedCount: 0,
    pendingCount: 0,
  },
  {
    id: "hist-2",
    when: "2026-06-17T11:22:10",
    employeeName: "Employee4",
    mode: "onboard",
    successCount: 1,
    skippedCount: 1,
    pendingCount: 0,
  },
  {
    id: "hist-3",
    when: "2026-06-15T09:45:00",
    employeeName: "Employee5",
    mode: "onboard",
    successCount: 2,
    skippedCount: 0,
    pendingCount: 0,
  },
]

export const initialOffboardingCandidates: OffboardingCandidate[] = [
  {
    id: "off-cand-1",
    name: "employee_3",
    email: "employee3@gmail.com",
    department: "test_2",
    status: "active",
  },
  {
    id: "off-cand-2",
    name: "Employee4",
    email: "employee4@gmail.com",
    department: "Test",
    status: "active",
  },
  {
    id: "off-cand-3",
    name: "Mahesh",
    email: "mahesh@dtskill.com",
    department: "—",
    status: "active",
  },
]

export const initialActiveOffboardings: ActiveOffboarding[] = []

export function createDefaultOffboardingChecklist(): OffboardingChecklistItem[] {
  return [
    { id: "chk-1", label: "Collect and verify all assigned hardware", status: "pending" },
    { id: "chk-2", label: "Review software licenses to revoke", status: "pending" },
    { id: "chk-3", label: "Export / transfer work data and mailbox", status: "pending" },
    {
      id: "chk-4",
      label: "Knowledge transfer with manager / peer",
      optional: true,
      status: "pending",
    },
    { id: "chk-5", label: "Manager sign-off received", status: "pending" },
    { id: "chk-6", label: "Disable portal access on last day", status: "pending" },
    { id: "chk-7", label: "Exit interview completed", optional: true, status: "pending" },
  ]
}

export function getChecklistProgress(checklist: OffboardingChecklistItem[]) {
  const doneCount = checklist.filter((item) => item.status === "done" || item.status === "skipped").length
  const requiredOpen = checklist.filter(
    (item) => !item.optional && item.status !== "done" && item.status !== "skipped"
  ).length
  return { doneCount, total: checklist.length, requiredOpen }
}

export function canFinalizeOffboarding(checklist: OffboardingChecklistItem[]) {
  return checklist
    .filter((item) => !item.optional)
    .every((item) => item.status === "done" || item.status === "skipped")
}

export function summarizeOffboardingResult(checklist: OffboardingChecklistItem[]) {
  return {
    successCount: checklist.filter((item) => item.status === "done").length,
    skippedCount: checklist.filter((item) => item.status === "skipped").length,
    pendingCount: checklist.filter((item) => item.status === "pending" || item.status === "in_progress")
      .length,
  }
}

export function formatHistoryWhen(iso: string) {
  const date = new Date(iso)
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })
}

export function getTemplateDepartmentOptions(templates: DepartmentTemplate[]) {
  const fromTemplates = templates.map((t) => t.department)
  return Array.from(new Set(fromTemplates))
}
