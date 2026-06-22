"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

import { DEFAULT_THEME, getWorkspaceThemeMode } from "@/lib/themes"

const sonnerThemeStyle = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
  "--border-radius": "var(--radius)",
  "--success-bg": "color-mix(in oklch, var(--success) 14%, var(--popover))",
  "--success-border": "color-mix(in oklch, var(--success) 32%, var(--border))",
  "--success-text": "var(--success)",
  "--info-bg": "color-mix(in oklch, var(--info) 14%, var(--popover))",
  "--info-border": "color-mix(in oklch, var(--info) 32%, var(--border))",
  "--info-text": "var(--info)",
  "--warning-bg": "color-mix(in oklch, var(--warning) 14%, var(--popover))",
  "--warning-border": "color-mix(in oklch, var(--warning) 32%, var(--border))",
  "--warning-text": "var(--warning)",
  "--error-bg": "color-mix(in oklch, var(--destructive) 14%, var(--popover))",
  "--error-border": "color-mix(in oklch, var(--destructive) 32%, var(--border))",
  "--error-text": "var(--destructive)",
} as React.CSSProperties

function Toaster({
  richColors = true,
  closeButton = true,
  position = "top-right",
  ...props
}: ToasterProps) {
  const { theme = DEFAULT_THEME } = useTheme()
  const sonnerTheme = getWorkspaceThemeMode(theme)

  return (
    <Sonner
      theme={sonnerTheme}
      richColors={richColors}
      closeButton={closeButton}
      position={position}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={sonnerThemeStyle}
      {...props}
    />
  )
}

export { Toaster }
