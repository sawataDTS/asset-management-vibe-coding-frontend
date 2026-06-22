import type { Metadata } from "next"
import { ForgotPasswordForm } from "../_components/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot password — AssetOps",
  description: "Reset your AssetOps workspace password.",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
