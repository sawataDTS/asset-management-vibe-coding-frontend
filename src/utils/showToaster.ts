import { toast } from "sonner"
import { AxiosError } from "axios"

interface ErrorResponse {
  detail?: string
  error?: string
}

function isAxiosError(error: unknown): error is AxiosError<ErrorResponse> {
  return typeof error === "object" && error !== null && (error as AxiosError).isAxiosError === true
}

export function showError(message: string): void {
  toast.error(message)
}

export function showApiError(error: unknown): void {
  console.error("Error:", error)
  let message = "Something went wrong"

  if (isAxiosError(error)) {
    const data = error.response?.data

    if (data) {
      if (typeof data === "string") {
        message = data
      } else if (typeof data.detail === "string") {
        message = data.detail
      } else if (typeof data.error === "string") {
        message = data.error
      } else if (Array.isArray(data.errors)) {
        message = data.errors.map(String).join(", ")
      } else if (typeof data.errors === "object") {
        message = Object.entries(data.errors)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
          .join("; ")
      }
    }
  }

  toast.error(String(message))
}

export function showSuccess(message: string): void {
  toast.success(message)
}

export function showWarning(message: string): void {
  toast.warning(message)
}

export function showInfo(message: string): void {
  toast.info(message)
}
