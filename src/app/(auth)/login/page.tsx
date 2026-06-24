import type { Metadata } from "next"

import { LoginForm } from "../_components/login-form"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Asset360Hub workspace.",
}

export default function LoginPage() {
  return <LoginForm />
}
