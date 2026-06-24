import { DEFAULT_PROFILE } from "@/lib/settings-data"
import {
  BUILT_IN_ROLES,
  isPermissionGranted,
  type RoleDefinition,
  type RoleTemplateId,
} from "@/lib/settings/roles-data"

export type WorkspaceUser = {
  name: string
  email: string
  roleId: RoleTemplateId
  role: RoleDefinition
}

export function getMockWorkspaceUser(): WorkspaceUser {
  const roleId = DEFAULT_PROFILE.workspaceRole
  const role =
    BUILT_IN_ROLES.find((entry) => entry.id === roleId) ??
    BUILT_IN_ROLES.find((entry) => entry.id === "employee")!

  return {
    name: DEFAULT_PROFILE.fullName,
    email: DEFAULT_PROFILE.email,
    roleId: role.id as RoleTemplateId,
    role,
  }
}

export function canViewAllRequests(user: WorkspaceUser): boolean {
  return isPermissionGranted(user.role, "requests", "Manage")
}

export function canSubmitRequests(user: WorkspaceUser): boolean {
  return isPermissionGranted(user.role, "requests", "Submit")
}

export function canManageRequests(user: WorkspaceUser): boolean {
  return isPermissionGranted(user.role, "requests", "Manage")
}

export function filterByViewScope<T extends { employeeEmail: string }>(items: T[], user: WorkspaceUser): T[] {
  if (canViewAllRequests(user)) return items
  return items.filter((item) => item.employeeEmail === user.email)
}
