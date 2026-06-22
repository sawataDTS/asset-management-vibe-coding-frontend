import { cn } from "@/lib/utils"
import React from "react"

export default function ShowLoading({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("flex h-[calc(100vh-98px)] items-center justify-center", className)}>
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-black-400 mt-4 font-normal">{text}</p>
      </div>
    </div>
  )
}
