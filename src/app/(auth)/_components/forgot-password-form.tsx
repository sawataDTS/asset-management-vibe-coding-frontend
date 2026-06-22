"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

import { AuthCardHeader, AuthPageShell } from "./auth-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function ForgotPasswordForm({ className }: { className?: string }) {
  const [email, setEmail] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 400))
    setSubmitting(false)
    setSent(true)
  }

  return (
    <AuthPageShell className={className}>
      <Card className="w-full gap-0 py-0 shadow-md">
        <CardContent className="flex flex-col gap-6 p-(--card-spacing)">
          <AuthCardHeader
            title="Forgot password"
            description="Enter your work email. We will send a one-time code to reset your password."
          />

          {sent ? (
            <p className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground">
              If an account exists for <span className="font-medium text-foreground">{email}</span>, a
              verification code is on its way. Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field>
                <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
                <Input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Button
                type="submit"
                disabled={submitting}
                className="h-10 w-full bg-gradient-brand text-primary-foreground hover:opacity-90"
              >
                <Mail />
                Send verification code
              </Button>
            </form>
          )}

          <div className="flex justify-center pt-1">
            <Button variant="ghost" className="h-9 gap-1.5 text-foreground" asChild>
              <Link href="/login">
                <ArrowLeft />
                Back to sign in
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthPageShell>
  )
}

export { ForgotPasswordForm }
