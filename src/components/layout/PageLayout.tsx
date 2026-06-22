import React from "react"
import { cn } from "@/lib/utils"

export default function PageLayout({
  children,
  title,
  className,
  rightContent,
}: Readonly<{
  children: React.ReactNode
  title: string
  className?: string
  rightContent?: React.ReactNode
}>) {
  return <section>{children}</section>
}
