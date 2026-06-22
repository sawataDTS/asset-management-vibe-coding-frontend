"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { AuthCardHeader, AuthPageShell } from "./auth-shell"
import { GoogleIcon, MicrosoftIcon } from "./oauth-icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const DEMO_EMAIL = "john.doe@example.com"
const DEMO_PASSWORD = "password123"

function LoginForm({ className }: { className?: string }) {
  const router = useRouter()
  const [email, setEmail] = React.useState(DEMO_EMAIL)
  const [password, setPassword] = React.useState(DEMO_PASSWORD)
  const [submitting, setSubmitting] = React.useState(false)

  async function handleEmailSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 400))
    setSubmitting(false)
    router.push("/overview")
  }

  function handleOAuthSignIn(provider: "microsoft" | "google") {
    void provider
    router.push("/overview")
  }

  return (
    <AuthPageShell className={className}>
      <Card className="w-full gap-0 py-0 shadow-md">
        <CardContent className="flex flex-col gap-6 p-(--card-spacing)">
          <AuthCardHeader
            title="Sign in"
            description={
              <>
                Sign in to your workspace. New companies are onboarded by the AssetOps team
                {/* —{" "} <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
                  request early access
                </Link>{" "}
                on our homepage. */}
              </>
            }
          />

          <form onSubmit={handleEmailSignIn} className="flex flex-col gap-5">
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="login-email">Email</FieldLabel>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={submitting}
              className="h-10 w-full bg-gradient-brand text-primary-foreground hover:opacity-90"
            >
              Sign in with email
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="shrink-0 text-xs font-medium text-muted-foreground">or continue with</span>
            <Separator className="flex-1" />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-9 w-full justify-center gap-2 bg-background"
              onClick={() => handleOAuthSignIn("microsoft")}
            >
              <MicrosoftIcon />
              Sign in with Microsoft
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 w-full justify-center gap-2 bg-background"
              onClick={() => handleOAuthSignIn("google")}
            >
              <GoogleIcon />
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthPageShell>
  )
}

export { LoginForm }
