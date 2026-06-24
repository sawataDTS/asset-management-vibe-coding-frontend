import type { Metadata } from "next"
import { ForgotPasswordForm } from "../_components/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Asset360Hub workspace password.",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
