"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Send } from "lucide-react"

import { AuthCardHeader, AuthPageShell } from "./auth-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Zod validation schema
const earlyAccessSchema = z.object({
  name: z.string().min(1, "Name is required."),
  work_email: z.string().min(1, "Work email is required.").email("Please enter a valid email address."),
  company: z.string().min(1, "Company name is required."),
  phone: z.string().optional(),
  anything_else: z.string().optional(),
})

type EarlyAccessFormData = z.infer<typeof earlyAccessSchema>

function EarlyAccessForm({ className }: { className?: string }) {
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EarlyAccessFormData>({
    resolver: zodResolver(earlyAccessSchema),
  })

  async function onSubmit(data: EarlyAccessFormData) {
    setSubmitting(true)
    try {
      // TODO: POST /api/early-access
      console.log("Early access request:", data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitted(true)
    } catch (error) {
      console.error(error)
      setSubmitting(false)
    }
  }

  return (
    <AuthPageShell className={className}>
      <Card className="w-full gap-0 py-0 shadow-md">
        <CardContent className="flex flex-col gap-6 p-(--card-spacing)">
          <AuthCardHeader
            title="Request early access"
            description="New companies are onboarded by the Asset360Hub team. Fill out the form below and we will get back to you shortly."
          />

          {submitted ? (
            <div className="flex flex-col gap-4">
              <p className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground">
                Thank you for your interest! We have received your request and will contact you soon at your
                provided email address.
              </p>
              <div className="flex justify-center pt-1">
                <Button variant="ghost" className="h-9 gap-1.5 text-foreground" asChild>
                  <Link href="/login">
                    <ArrowLeft />
                    Back to sign in
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel htmlFor="early-access-name">Name</FieldLabel>
                    <Input
                      id="early-access-name"
                      type="text"
                      autoComplete="name"
                      placeholder="John Doe"
                      error={errors.name?.message}
                      {...register("name")}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="early-access-email">Work Email</FieldLabel>
                    <Input
                      id="early-access-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      error={errors.work_email?.message}
                      {...register("work_email")}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="early-access-company">Company</FieldLabel>
                    <Input
                      id="early-access-company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Your Company Inc."
                      error={errors.company?.message}
                      {...register("company")}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="early-access-phone">Phone (optional)</FieldLabel>
                    <Input
                      id="early-access-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+1 (555) 000-0000"
                      error={errors.phone?.message}
                      {...register("phone")}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="early-access-notes">Anything else? (optional)</FieldLabel>
                    <Textarea
                      id="early-access-notes"
                      placeholder="Tell us about your organization and asset management needs..."
                      rows={4}
                      {...register("anything_else")}
                    />
                  </Field>
                </FieldGroup>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-10 w-full bg-gradient-brand text-primary-foreground hover:opacity-90"
                >
                  <Send />
                  Submit request
                </Button>
              </form>

              <div className="flex justify-center pt-1">
                <Button variant="ghost" className="h-9 gap-1.5 text-foreground" asChild>
                  <Link href="/login">
                    <ArrowLeft />
                    Back to sign in
                  </Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </AuthPageShell>
  )
}

export { EarlyAccessForm }
