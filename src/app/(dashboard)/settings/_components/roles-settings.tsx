"use client"

import * as React from "react"
import { useState } from "react"
import { Plus, Shield } from "lucide-react"
import { toast } from "sonner"

import { CustomSelect } from "@/components/custom/CustomSelect"
import { settingsControlClassName } from "@/app/(dashboard)/settings/_components/settings-panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardActions, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  BUILT_IN_ROLES,
  isPermissionGranted,
  isSettingsPermissionGranted,
  ROLE_TEMPLATE_OPTIONS,
  VISIBLE_PERMISSION_MODULES,
  VISIBLE_SETTINGS_PERMISSIONS,
  type RoleDefinition,
  type RoleTemplateId,
} from "@/lib/settings/roles-data"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

function serializeRoleGrants(role: RoleDefinition) {
  return JSON.stringify({
    moduleGrants: role.moduleGrants,
    settingsGrants: role.settingsGrants,
  })
}

function createGrantSnapshots(roles: RoleDefinition[]) {
  return Object.fromEntries(roles.map((role) => [role.id, serializeRoleGrants(role)]))
}

function PermissionCheckbox({
  id,
  label,
  checked,
  disabled,
  onCheckedChange,
}: {
  id: string
  label: string
  checked: boolean
  disabled?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 py-1">
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        className="after:hidden"
        onCheckedChange={(value) => onCheckedChange?.(value === true)}
      />
      {disabled ? (
        <span className={cn(typeScale.body.default, "text-muted-foreground")}>{label}</span>
      ) : (
        <label htmlFor={id} className={cn(typeScale.body.default, "cursor-pointer")}>
          {label}
        </label>
      )}
    </div>
  )
}

function PermissionGroupCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-sidebar-border bg-muted/20 p-4">
      <p className={cn("mb-3", typeScale.title)}>{title}</p>
      <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  )
}

function RoleListItem({
  role,
  active,
  onSelect,
}: {
  role: RoleDefinition
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-lg border px-3 text-left text-sm leading-5 transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        active
          ? "border-sidebar-border bg-sidebar-active font-medium text-primary shadow-xs"
          : "border-transparent font-normal text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
      )}
    >
      <span className="min-w-0 truncate">{role.name}</span>
      {role.badge ? (
        <Badge variant="secondary" className="ml-auto h-4.5 shrink-0 px-1.5 text-[0.625rem]">
          {role.badge}
        </Badge>
      ) : null}
    </button>
  )
}

function RolePermissionsPanel({
  role,
  dirty,
  saving,
  onModulePermissionChange,
  onSettingsPermissionChange,
  onSave,
}: {
  role: RoleDefinition
  dirty: boolean
  saving?: boolean
  onModulePermissionChange: (moduleId: string, permission: string, granted: boolean) => void
  onSettingsPermissionChange: (permissionId: string, granted: boolean) => void
  onSave: () => void
}) {
  const readOnly = role.locked ?? false

  return (
    <Card className="flex h-full max-h-full min-h-0 flex-col gap-0 overflow-hidden py-0">
      <div className="shrink-0 px-(--card-spacing) pt-(--card-spacing)">
        <div className="flex flex-col gap-1">
          <h2 className={typeScale.heading}>{role.name}</h2>
          <p className={typeScale.body.muted}>{role.subtitle}</p>
          {role.description ? <p className={cn("mt-1", typeScale.caption.meta)}>{role.description}</p> : null}
        </div>
      </div>

      <CardContent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-(--card-spacing) pt-4 pb-0">
        <div className="flex flex-col gap-3 pb-(--card-spacing)">
          {VISIBLE_PERMISSION_MODULES.map((module) => (
            <PermissionGroupCard key={module.id} title={module.label}>
              {module.permissions.map((permission) => (
                <PermissionCheckbox
                  key={`${module.id}-${permission}`}
                  id={`${role.id}-${module.id}-${permission}`}
                  label={permission}
                  checked={isPermissionGranted(role, module.id, permission)}
                  disabled={readOnly}
                  onCheckedChange={(granted) => onModulePermissionChange(module.id, permission, granted)}
                />
              ))}
            </PermissionGroupCard>
          ))}

          <PermissionGroupCard title="Settings">
            {VISIBLE_SETTINGS_PERMISSIONS.map((permission) => (
              <PermissionCheckbox
                key={permission.id}
                id={`${role.id}-settings-${permission.id}`}
                label={permission.label}
                checked={isSettingsPermissionGranted(role, permission.id)}
                disabled={readOnly}
                onCheckedChange={(granted) => onSettingsPermissionChange(permission.id, granted)}
              />
            ))}
          </PermissionGroupCard>
        </div>
      </CardContent>

      {!readOnly ? (
        <CardActions className="shrink-0">
          <Button
            type="button"
            disabled={!dirty || saving}
            className="bg-gradient-brand text-primary-foreground hover:opacity-90"
            onClick={onSave}
          >
            Save permissions
          </Button>
        </CardActions>
      ) : null}
    </Card>
  )
}

function RolesSettings() {
  const sidebarRef = React.useRef<HTMLElement>(null)
  const [panelHeight, setPanelHeight] = useState<number>()
  const [roles, setRoles] = useState<RoleDefinition[]>(BUILT_IN_ROLES)
  const [savedSnapshots, setSavedSnapshots] = useState<Record<string, string>>(() =>
    createGrantSnapshots(BUILT_IN_ROLES)
  )
  const [saving, setSaving] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<string>(BUILT_IN_ROLES[0]?.id ?? "admin")
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDescription, setNewRoleDescription] = useState("")
  const [newRoleTemplate, setNewRoleTemplate] = useState<RoleTemplateId>("employee")

  React.useLayoutEffect(() => {
    const node = sidebarRef.current
    if (!node) return

    const updateHeight = () => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches
      if (!isDesktop) {
        setPanelHeight(undefined)
        return
      }

      // Match the right panel to the left column's natural height (roles list + new role card).
      setPanelHeight(node.offsetHeight)
    }

    updateHeight()
    requestAnimationFrame(updateHeight)

    const observer = new ResizeObserver(() => updateHeight())
    observer.observe(node)
    window.addEventListener("resize", updateHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateHeight)
    }
  }, [roles.length, selectedRoleId])

  const selectedRole = roles.find((role) => role.id === selectedRoleId) ?? roles[0]
  const isDirty =
    selectedRole != null &&
    !selectedRole.locked &&
    serializeRoleGrants(selectedRole) !== (savedSnapshots[selectedRole.id] ?? "")

  function handleSavePermissions() {
    if (!selectedRole || selectedRole.locked) return

    setSaving(true)
    setSavedSnapshots((current) => ({
      ...current,
      [selectedRole.id]: serializeRoleGrants(selectedRole),
    }))
    toast.success(`Saved permissions for ${selectedRole.name}.`)
    setSaving(false)
  }

  function handleModulePermissionChange(moduleId: string, permission: string, granted: boolean) {
    setRoles((current) =>
      current.map((role) => {
        if (role.id !== selectedRoleId || role.locked) return role

        const currentGrants = [...(role.moduleGrants[moduleId] ?? [])]
        const nextGrants = granted
          ? currentGrants.includes(permission)
            ? currentGrants
            : [...currentGrants, permission]
          : currentGrants.filter((entry) => entry !== permission)

        return {
          ...role,
          moduleGrants: { ...role.moduleGrants, [moduleId]: nextGrants },
        }
      })
    )
  }

  function handleSettingsPermissionChange(permissionId: string, granted: boolean) {
    setRoles((current) =>
      current.map((role) => {
        if (role.id !== selectedRoleId || role.locked) return role

        const nextGrants = granted
          ? role.settingsGrants.includes(permissionId)
            ? role.settingsGrants
            : [...role.settingsGrants, permissionId]
          : role.settingsGrants.filter((entry) => entry !== permissionId)

        return { ...role, settingsGrants: nextGrants }
      })
    )
  }

  function handleCreateRole() {
    const name = newRoleName.trim()
    if (!name) {
      toast.error("Enter a role name.")
      return
    }

    const template = BUILT_IN_ROLES.find((role) => role.id === newRoleTemplate) ?? BUILT_IN_ROLES[3]
    const id = `custom-${Date.now()}`
    const newRole: RoleDefinition = {
      id,
      name,
      subtitle: newRoleDescription.trim() || `Based on ${template.name}`,
      moduleGrants: Object.fromEntries(
        Object.entries(template.moduleGrants).map(([moduleId, grants]) => [moduleId, [...grants]])
      ),
      settingsGrants: [...template.settingsGrants],
    }

    setRoles((current) => [...current, newRole])
    setSavedSnapshots((current) => ({
      ...current,
      [id]: serializeRoleGrants(newRole),
    }))
    setSelectedRoleId(id)
    setNewRoleName("")
    setNewRoleDescription("")
    toast.success(`Created role “${name}”.`)
  }

  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]",
        panelHeight == null && "lg:items-start"
      )}
      style={
        panelHeight != null ? ({ gridTemplateRows: `${panelHeight}px` } as React.CSSProperties) : undefined
      }
    >
      <aside ref={sidebarRef} className="flex w-full flex-col gap-4 self-start lg:w-auto">
        <Card size="sm" className="gap-0 py-0">
          <CardContent className="flex flex-col gap-3 p-(--card-spacing)">
            <div className="flex items-center gap-2">
              <Shield className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
              <span className={typeScale.title}>Roles</span>
            </div>

            <div className="flex flex-col gap-1">
              {roles.map((role) => (
                <RoleListItem
                  key={role.id}
                  role={role}
                  active={role.id === selectedRoleId}
                  onSelect={() => setSelectedRoleId(role.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card size="sm" className="gap-0 py-0">
          <CardContent className={cn("flex flex-col gap-4 p-(--card-spacing)", settingsControlClassName)}>
            <p className={typeScale.caption.overline}>New role</p>

            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="new-role-name">Name</FieldLabel>
                <Input
                  id="new-role-name"
                  placeholder="Procurement"
                  value={newRoleName}
                  onChange={(event) => setNewRoleName(event.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="new-role-description">Description</FieldLabel>
                <Textarea
                  id="new-role-description"
                  placeholder="Optional"
                  rows={3}
                  value={newRoleDescription}
                  onChange={(event) => setNewRoleDescription(event.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="new-role-template">Start from template</FieldLabel>
                <CustomSelect
                  id="new-role-template"
                  value={newRoleTemplate}
                  onChange={(value) =>
                    setNewRoleTemplate(typeof value === "string" ? (value as RoleTemplateId) : "employee")
                  }
                  options={ROLE_TEMPLATE_OPTIONS.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  showClear={false}
                />
              </Field>
            </FieldGroup>

            <Button type="button" className="w-full" onClick={handleCreateRole}>
              <Plus />
              Create role
            </Button>
          </CardContent>
        </Card>
      </aside>

      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-col self-stretch overflow-hidden",
          panelHeight == null && "max-h-[min(70vh,42rem)]"
        )}
      >
        {selectedRole ? (
          <RolePermissionsPanel
            key={selectedRole.id}
            role={selectedRole}
            dirty={isDirty}
            saving={saving}
            onModulePermissionChange={handleModulePermissionChange}
            onSettingsPermissionChange={handleSettingsPermissionChange}
            onSave={handleSavePermissions}
          />
        ) : null}
      </div>
    </div>
  )
}

export { RolesSettings }
