export type Permission =
  | 'org:delete'
  | 'org:update'
  | 'org:view'
  | 'member:invite'
  | 'member:remove'
  | 'member:update_role'
  | 'member:view'
  | 'project:create'
  | 'project:update'
  | 'project:delete'
  | 'project:view'
  | 'todo:create'
  | 'todo:update'
  | 'todo:delete'
  | 'todo:view'
  | 'settings:manage'
  | 'roles:view'
  | 'roles:manage'
  | 'invitation:view'
  | 'invitation:manage'

export type RoleDefinition = {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem: boolean
  color: string
}

export const PERMISSIONS_METADATA: Record<Permission, { label: string; description: string; category: string }> = {
  'org:delete': {
    label: 'Delete Organization',
    description: 'Permanently delete the entire organization',
    category: 'Organization'
  },
  'org:update': {
    label: 'Update Organization',
    description: 'Modify organization settings and details',
    category: 'Organization'
  },
  'org:view': {
    label: 'View Organization',
    description: 'View organization information',
    category: 'Organization'
  },
  'member:invite': {
    label: 'Invite Members',
    description: 'Send invitations to new team members',
    category: 'Members'
  },
  'member:remove': {
    label: 'Remove Members',
    description: 'Remove members from the organization',
    category: 'Members'
  },
  'member:update_role': {
    label: 'Update Member Roles',
    description: 'Change member roles and permissions',
    category: 'Members'
  },
  'member:view': {
    label: 'View Members',
    description: 'View organization members list',
    category: 'Members'
  },
  'project:create': {
    label: 'Create Projects',
    description: 'Create new projects',
    category: 'Projects'
  },
  'project:update': {
    label: 'Update Projects',
    description: 'Modify existing projects',
    category: 'Projects'
  },
  'project:delete': {
    label: 'Delete Projects',
    description: 'Remove projects permanently',
    category: 'Projects'
  },
  'project:view': {
    label: 'View Projects',
    description: 'View project information',
    category: 'Projects'
  },
  'todo:create': {
    label: 'Create Todos',
    description: 'Create new todo items',
    category: 'Todos'
  },
  'todo:update': {
    label: 'Update Todos',
    description: 'Modify existing todos',
    category: 'Todos'
  },
  'todo:delete': {
    label: 'Delete Todos',
    description: 'Remove todos permanently',
    category: 'Todos'
  },
  'todo:view': {
    label: 'View Todos',
    description: 'View todo items',
    category: 'Todos'
  },
  'settings:manage': {
    label: 'Manage Settings',
    description: 'Access and modify organization settings',
    category: 'Settings'
  },
  'roles:view': {
    label: 'View Roles',
    description: 'View role definitions and permissions',
    category: 'Roles'
  },
  'roles:manage': {
    label: 'Manage Roles',
    description: 'Create and modify custom roles',
    category: 'Roles'
  },
  'invitation:view': {
    label: 'View Invitations',
    description: 'View pending invitations',
    category: 'Invitations'
  },
  'invitation:manage': {
    label: 'Manage Invitations',
    description: 'Create, cancel, and resend invitations',
    category: 'Invitations'
  },
}

export const DEFAULT_ROLES: RoleDefinition[] = [
  {
    id: 'owner',
    name: 'Owner',
    description: 'Full control over the organization including deletion',
    isSystem: true,
    color: '#DC2626',
    permissions: [
      'org:delete',
      'org:update',
      'org:view',
      'member:invite',
      'member:remove',
      'member:update_role',
      'member:view',
      'project:create',
      'project:update',
      'project:delete',
      'project:view',
      'todo:create',
      'todo:update',
      'todo:delete',
      'todo:view',
      'settings:manage',
      'roles:view',
      'roles:manage',
      'invitation:view',
      'invitation:manage',
    ]
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Comprehensive access except organization deletion',
    isSystem: true,
    color: '#3B82F6',
    permissions: [
      'org:update',
      'org:view',
      'member:invite',
      'member:remove',
      'member:update_role',
      'member:view',
      'project:create',
      'project:update',
      'project:delete',
      'project:view',
      'todo:create',
      'todo:update',
      'todo:delete',
      'todo:view',
      'settings:manage',
      'roles:view',
      'invitation:view',
      'invitation:manage',
    ]
  },
  {
    id: 'member',
    name: 'Member',
    description: 'Limited permissions for standard team members',
    isSystem: true,
    color: '#6B7280',
    permissions: [
      'org:view',
      'member:view',
      'project:create',
      'project:update',
      'project:view',
      'todo:create',
      'todo:update',
      'todo:delete',
      'todo:view',
      'roles:view',
      'invitation:view',
    ]
  }
]

export function getRoleById(roleId: string): RoleDefinition | undefined {
  return DEFAULT_ROLES.find(role => role.id === roleId)
}

export function hasPermission(role: string, permission: Permission): boolean {
  const roleDefinition = getRoleById(role)
  return roleDefinition?.permissions.includes(permission) ?? false
}

export function getPermissionsByCategory() {
  const categories: Record<string, Permission[]> = {}

  Object.entries(PERMISSIONS_METADATA).forEach(([permission, metadata]) => {
    if (!categories[metadata.category]) {
      categories[metadata.category] = []
    }
    categories[metadata.category].push(permission as Permission)
  })

  return categories
}
