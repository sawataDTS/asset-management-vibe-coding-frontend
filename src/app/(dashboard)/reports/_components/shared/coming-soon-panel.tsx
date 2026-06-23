"use client"

import { type LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

type ComingSoonPanelProps = {
  icon: LucideIcon
  label: string
  description?: string
}

function ComingSoonPanel({ icon: Icon, label, description }: ComingSoonPanelProps) {
  return (
    <Card>
      <CardContent className="py-16 text-center">
        <span className="mx-auto mb-4 flex size-10 items-center justify-center rounded-xl bg-accent text-primary ring-1 ring-border/60">
          <Icon className="size-5" />
        </span>
        <p className={typeScale.title}>{label}</p>
        <p className={cn("mt-2", typeScale.body.muted)}>
          {description ?? "This report section is coming soon."}
        </p>
      </CardContent>
    </Card>
  )
}

export { ComingSoonPanel }
