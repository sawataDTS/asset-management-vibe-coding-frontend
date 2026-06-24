import { AppWindow, BadgeCheck, HardDrive, Mail, Sparkles, type LucideIcon } from "lucide-react"

export const REPORT_TAB_ICONS = {
  hardware: HardDrive,
  software: AppWindow,
  certifications: BadgeCheck,
  mailbox: Mail,
  prompt: Sparkles,
} satisfies Record<string, LucideIcon>
