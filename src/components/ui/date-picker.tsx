"use client"

import * as React from "react"
import { format, isValid, parseISO } from "date-fns"
import { CalendarIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
          <Button
            id={id}
            type="button"
            variant="outline"
            size="lg"
            disabled={disabled}
            className={cn(
              "w-full justify-start gap-2 px-2.5 font-normal",
              !selected && "text-muted-foreground",
              allowClear && selected && !disabled && "pr-10"
            )}
          >
            <CalendarIcon className="size-4 shrink-0 opacity-70" />
            <span className="truncate">
              {selected ? format(selected, "dd MMM yyyy") : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            defaultMonth={selected}
          />
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
