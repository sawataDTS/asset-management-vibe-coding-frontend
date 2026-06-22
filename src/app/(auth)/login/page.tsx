import type { Metadata } from "next"

import { LoginForm } from "../_components/login-form"

export const metadata: Metadata = {
  title: "Sign in — AssetOps",
  description: "Sign in to your AssetOps workspace.",
}

export default function LoginPage() {
  return <LoginForm />
}
