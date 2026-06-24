"use client"

import * as React from "react"
import { format, isValid, parseISO } from "date-fns"
import { CalendarIcon, XIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, POPOVER_SIDE_OFFSET, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface DatePickerProps {
  id?: string
  /** ISO date string (`YYYY-MM-DD`). */
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  /** Allow clearing the selected date (for optional fields). */
  allowClear?: boolean
}

function parseIsoDate(value?: string): Date | undefined {
  if (!value) return undefined
  const parsed = parseISO(value)
  return isValid(parsed) ? parsed : undefined
}

function toIsoDate(date: Date | undefined): string {
  if (!date) return ""
  return format(date, "yyyy-MM-dd")
}

function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled,
  allowClear = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const selected = parseIsoDate(value)

  function handleSelect(date: Date | undefined) {
    onChange(toIsoDate(date))
    setOpen(false)
  }

  function handleClear(event: React.MouseEvent) {
    event.stopPropagation()
    onChange("")
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            disabled={disabled}
            data-slot="date-picker-trigger"
            data-state={open ? "open" : "closed"}
            className={cn(
              "inline-flex h-9 w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm transition-colors outline-none",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              "data-[state=open]:border-ring data-[state=open]:ring-3 data-[state=open]:ring-ring/50",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
              "dark:bg-input/30 dark:disabled:bg-input/80",
              !selected && "text-muted-foreground",
              allowClear && selected && !disabled && "pr-10"
            )}
          >
            <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate text-left font-medium">
              {selected ? format(selected, "dd MMM yyyy") : placeholder}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" sideOffset={POPOVER_SIDE_OFFSET}>
          <Calendar mode="single" selected={selected} onSelect={handleSelect} defaultMonth={selected} />
        </PopoverContent>
      </Popover>
      {allowClear && selected && !disabled ? (
        <button
          type="button"
          aria-label="Clear date"
          onClick={handleClear}
          className="absolute top-1/2 right-2.5 z-10 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <XIcon className="size-4" />
        </button>
      ) : null}
    </div>
  )
}

export { DatePicker, parseIsoDate, toIsoDate }
