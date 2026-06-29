"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AuthCardHeader, AuthPageShell } from "./auth-shell"
import { GoogleIcon, MicrosoftIcon } from "./oauth-icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import apiService from "@/services/apiService"
import { showInfo } from "@/utils/showToaster"

// Zod validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required.").min(6, "Password must be at least 6 characters long."),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm({ className }: { className?: string }) {
  const router = useRouter()
  const [submitting, setSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setSubmitting(true)
    try {
      const res = await apiService.post("api/auth/login", {
        email: data.email,
        password: data.password,
      })
      const user = res.data.user
      if (!user?.is_active) return showInfo("Your account is not active.")
      sessionStorage.setItem("jwtToken", res.data?.token)
      sessionStorage.setItem("refreshToken", res.data?.refresh_token)
      sessionStorage.setItem("role", res.data?.user?.role)
      router.push("/overview")
    } catch (error) {
      console.error(error)
      setSubmitting(false)
    }
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
                Sign in to your workspace. New companies are onboarded by the Asset360Hub team.{" "}
                <Link
                  href="/early-access"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Request early access
                </Link>{" "}
                if you don&apos;t have an account yet.
              </>
            }
          />

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="login-email">Email</FieldLabel>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  error={errors.email?.message}
                  {...register("email")}
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
                  error={errors.password?.message}
                  {...register("password")}
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
