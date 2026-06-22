"use client"

import * as React from "react"
import { toast } from "sonner"

import { SettingsPanel } from "./settings-panel"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { DEFAULT_PROFILE, type ProfileSettings } from "@/lib/settings-data"

function ProfileSettings() {
  const [profile, setProfile] = React.useState<ProfileSettings>(DEFAULT_PROFILE)
  const [saving, setSaving] = React.useState(false)

  function updateField<K extends keyof ProfileSettings>(key: K, value: ProfileSettings[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 400))
    setSaving(false)
    toast.success("Profile saved")
  }

  return (
    <SettingsPanel title="Your profile" saveLabel="Save profile" onSave={handleSave} saving={saving}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="profile-name">Full name</FieldLabel>
          <Input
            id="profile-name"
            value={profile.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            autoComplete="name"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-email">Email</FieldLabel>
          <Input
            id="profile-email"
            type="email"
            value={profile.email}
            onChange={(e) => updateField("email", e.target.value)}
            autoComplete="email"
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="profile-job-title">Job title</FieldLabel>
            <Input
              id="profile-job-title"
              value={profile.jobTitle}
              onChange={(e) => updateField("jobTitle", e.target.value)}
              autoComplete="organization-title"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="profile-phone">Phone</FieldLabel>
            <Input
              id="profile-phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              autoComplete="tel"
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="profile-avatar">Avatar URL</FieldLabel>
          <Input
            id="profile-avatar"
            type="url"
            value={profile.avatarUrl}
            onChange={(e) => updateField("avatarUrl", e.target.value)}
            placeholder="https://"
          />
        </Field>
      </FieldGroup>
    </SettingsPanel>
  )
}

export { ProfileSettings }
