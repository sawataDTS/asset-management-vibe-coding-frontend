"use client"

import * as React from "react"
import { Check, ChevronDownIcon, X } from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, POPOVER_SIDE_OFFSET, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface Option {
  label: string
  value: string
  description?: string
}

export function toSelectOptions(values: readonly string[]): Option[] {
  return values.map((value) => ({ label: value, value }))
}

interface CustomSelectProps {
  id?: string
  label?: string
  labelClassName?: string
  placeholder?: string
  value?: string | string[]
  onChange: (value: string | string[] | undefined) => void
  options: Option[]
  className?: string
  /** Trigger height utility. Defaults to `h-9` to match `Input`. */
  triggerHeight?: string
  contentClassName?: string
  contentMinWidth?: string
  alignContent?: "start" | "center" | "end"
  textSize?: string
  isDisabled?: boolean
  showClear?: boolean
  searchable?: boolean
  isMultiple?: boolean
  pluralLabel?: string
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  label,
  labelClassName,
  placeholder = "Select",
  value,
  onChange,
  options,
  className,
  triggerHeight = "h-9",
  contentClassName,
  contentMinWidth,
  alignContent = "start",
  textSize = "text-sm",
  isDisabled,
  showClear = true,
  searchable = false,
  isMultiple = false,
  pluralLabel = "items",
}) => {
  const [open, setOpen] = React.useState(false)
  const [hasPointerMoved, setHasPointerMoved] = React.useState(false)

  const selectedValues = isMultiple
    ? Array.isArray(value)
      ? value
      : value
        ? [value]
        : []
    : typeof value === "string"
      ? [value]
      : []
  const selectedOptions = options.filter((opt) => selectedValues.includes(opt.value))
  const hasSelection = selectedOptions.length > 0

  const getDisplayText = () => {
    if (isMultiple) {
      if (selectedOptions.length === 0) return placeholder
      if (selectedOptions.length === 1) return selectedOptions[0].label
      return `${selectedOptions.length} ${pluralLabel}`
    }
    return selectedOptions[0]?.label || placeholder
  }

  const handleSelect = (optionValue: string) => {
    if (isMultiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue]
      onChange(newValues)
      return
    }

    onChange(optionValue)
    setOpen(false)
  }

  return (
    <div className={cn("flex min-w-0 flex-col", label ? "gap-2" : "gap-0", className)}>
      {label ? (
        <label
          htmlFor={id}
          className={cn("self-start text-sm leading-tight font-medium text-foreground", labelClassName)}
        >
          {label}
        </label>
      ) : null}
      <div className="relative min-w-0 w-full">
        <Popover
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen)
            if (nextOpen) setHasPointerMoved(false)
          }}
        >
          <PopoverTrigger asChild>
            <button
              id={id}
              type="button"
              disabled={isDisabled}
              data-slot="select-trigger"
              data-state={open ? "open" : "closed"}
              className={cn(
                "inline-flex w-full min-w-0 items-center gap-1 rounded-lg border border-input bg-transparent px-2.5 text-foreground transition-colors outline-none",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                "data-[state=open]:border-ring data-[state=open]:ring-3 data-[state=open]:ring-ring/50",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
                "dark:bg-input/30 dark:disabled:bg-input/80",
                triggerHeight,
                textSize
              )}
            >
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-left font-medium",
                  hasSelection ? "text-foreground" : "text-muted-foreground",
                  textSize
                )}
              >
                {getDisplayText()}
              </span>

              <span className="flex shrink-0 items-center gap-0.5">
                {showClear && hasSelection && !isDisabled ? (
                  <span
                    role="button"
                    tabIndex={-1}
                    aria-label="Clear selection"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      onChange(isMultiple ? [] : "")
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        event.stopPropagation()
                        onChange(isMultiple ? [] : "")
                      }
                    }}
                    className="rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="size-4" />
                  </span>
                ) : null}
                <ChevronDownIcon
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform",
                    open && "rotate-180"
                  )}
                />
              </span>
            </button>
          </PopoverTrigger>

          <PopoverContent
            className={cn("w-max max-w-80 p-0", contentClassName)}
            align={alignContent}
            sideOffset={POPOVER_SIDE_OFFSET}
            style={{
              minWidth: contentMinWidth || "var(--radix-popover-trigger-width)",
            }}
          >
            <Command className="p-1 pb-0">
              {searchable ? <CommandInput placeholder="Search" className="text-sm font-medium" /> : null}
              <CommandEmpty>No options found</CommandEmpty>
              <CommandList
                className={cn(
                  "max-h-72 w-full overflow-auto",
                  !hasPointerMoved &&
                    "[&_[data-slot=command-item][data-selected=true]:not([data-is-selected=true])]:bg-transparent [&_[data-slot=command-item][data-selected=true]:not([data-is-selected=true])]:text-inherit"
                )}
                onWheel={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
                onPointerMove={() => setHasPointerMoved(true)}
              >
                <CommandGroup className="p-0">
                  {options.map((option, index) => {
                    const isSelected = selectedValues.includes(option.value)

                    const showSelectedHighlight = isSelected && !hasPointerMoved

                    return (
                      <CommandItem
                        key={`${option.value}-${index}`}
                        value={option.label}
                        data-is-selected={isSelected ? true : undefined}
                        showIndicator={false}
                        onSelect={() => handleSelect(option.value)}
                        className={cn(
                          "mb-1 pr-1.5",
                          hasPointerMoved &&
                            "data-selected:bg-accent data-selected:text-accent-foreground",
                          showSelectedHighlight &&
                            "bg-accent text-accent-foreground data-selected:bg-accent data-selected:text-accent-foreground data-selected:*:[svg]:text-accent-foreground"
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <div className={cn("truncate font-medium", textSize)}>{option.label}</div>
                          {option.description ? (
                            <div
                              className={cn(
                                "truncate text-xs",
                                showSelectedHighlight
                                  ? "text-accent-foreground/80"
                                  : "text-muted-foreground group-data-selected/command-item:text-accent-foreground/80"
                              )}
                            >
                              {option.description}
                            </div>
                          ) : null}
                        </div>
                        {isSelected ? (
                          <Check
                            className={cn(
                              "size-4 shrink-0",
                              showSelectedHighlight ? "text-accent-foreground" : "text-primary"
                            )}
                          />
                        ) : null}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
