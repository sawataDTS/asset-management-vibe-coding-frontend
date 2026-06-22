"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "../ui/input"

interface PasswordFieldProps {
  label?: string
  placeholder?: string
  value: string
  name?: string
  onChange: (value: string) => void
  className?: string
}

export default function PasswordField({
  label,
  placeholder = "Enter password",
  name,
  value,
  onChange,
  className,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          className={`w-full pr-10 text-sm leading-tight font-normal ${className}`}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          name={name}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-1/2 right-3 -translate-y-1/2 transform text-muted-foreground transition-colors hover:text-foreground"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
