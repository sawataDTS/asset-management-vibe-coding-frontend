"use client"

import * as React from "react"
import { toast } from "sonner"

import { CustomSelect, toSelectOptions } from "@/components/custom/CustomSelect"
import { SettingsPanel } from "./settings-panel"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  CURRENCY_OPTIONS,
  DEFAULT_ORGANIZATION,
  ORG_SIZE_OPTIONS,
  TIMEZONE_OPTIONS,
  type OrganizationSettings,
} from "@/lib/settings-data"

function OrganizationSettings() {
  const [organization, setOrganization] = React.useState<OrganizationSettings>(DEFAULT_ORGANIZATION)
  const [saving, setSaving] = React.useState(false)

  function updateField<K extends keyof OrganizationSettings>(key: K, value: OrganizationSettings[K]) {
    setOrganization((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 400))
    setSaving(false)
    toast.success("Organization saved")
  }

  return (
    <SettingsPanel title="Organization" saveLabel="Save organization" onSave={handleSave} saving={saving}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="org-name">Company name</FieldLabel>
          <Input
            id="org-name"
            value={organization.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="org-slug">Slug</FieldLabel>
          <Input
            id="org-slug"
            value={organization.slug}
            readOnly
            className="font-mono text-muted-foreground"
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="org-industry">Industry</FieldLabel>
            <Input
              id="org-industry"
              value={organization.industry}
              onChange={(e) => updateField("industry", e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="org-size">Size</FieldLabel>
            <CustomSelect
              id="org-size"
              placeholder="Select size"
              value={organization.size}
              options={toSelectOptions(ORG_SIZE_OPTIONS)}
              showClear={false}
              onChange={(value) => {
                if (typeof value === "string") updateField("size", value)
              }}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="org-timezone">Timezone</FieldLabel>
            <CustomSelect
              id="org-timezone"
              placeholder="Select timezone"
              value={organization.timezone}
              options={TIMEZONE_OPTIONS.map((tz) => ({
                label: tz.label,
                value: tz.value,
                description: tz.description,
              }))}
              searchable
              showClear={false}
              onChange={(value) => {
                if (typeof value === "string") updateField("timezone", value)
              }}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="org-currency">Default currency</FieldLabel>
            <CustomSelect
              id="org-currency"
              placeholder="Select currency"
              value={organization.defaultCurrency}
              options={toSelectOptions(CURRENCY_OPTIONS)}
              showClear={false}
              onChange={(value) => {
                if (typeof value === "string") updateField("defaultCurrency", value)
              }}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="org-logo">Logo URL</FieldLabel>
          <Input
            id="org-logo"
            type="url"
            value={organization.logoUrl}
            onChange={(e) => updateField("logoUrl", e.target.value)}
            placeholder="https://"
          />
        </Field>
      </FieldGroup>
    </SettingsPanel>
  )
}

export { OrganizationSettings }
