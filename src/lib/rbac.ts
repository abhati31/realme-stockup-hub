export type ModuleKey =
  | 'inventory'
  | 'orders'
  | 'onboarding'
  | 'distributors'
  | 'analytics'
  | 'compliance'
  | 'access'
  | 'settings';

export type PermissionKey = 'view' | 'edit' | 'approve';

export interface ModulePermissions {
  view: boolean;
  edit: boolean;
  approve: boolean;
}

export interface RoleConfig {
  name: string;
  key: string; // unique identifier, e.g., 'sales_admin'
  permissions: Record<ModuleKey, ModulePermissions>;
}

export interface RbacConfig {
  roles: RoleConfig[];
}

export const MODULES: { key: ModuleKey; label: string }[] = [
  { key: 'inventory', label: 'Inventory' },
  { key: 'orders', label: 'Orders' },
  { key: 'onboarding', label: 'Onboarding' },
  { key: 'distributors', label: 'Distributors' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'access', label: 'Access Control' },
  { key: 'settings', label: 'Settings' },
];

export const DEFAULT_ROLE_PERMS: Record<ModuleKey, ModulePermissions> = MODULES.reduce((acc, m) => {
  acc[m.key] = { view: false, edit: false, approve: false };
  return acc;
}, {} as Record<ModuleKey, ModulePermissions>);

export const DEFAULT_RBAC: RbacConfig = {
  roles: [
    {
      key: 'distributor',
      name: 'Distributor',
      permissions: {
        ...DEFAULT_ROLE_PERMS,
        orders: { view: true, edit: true, approve: false },
        distributors: { view: true, edit: false, approve: false },
      },
    },
    {
      key: 'sales_admin',
      name: 'Sales Admin',
      permissions: {
        ...DEFAULT_ROLE_PERMS,
        orders: { view: true, edit: true, approve: true },
        analytics: { view: true, edit: false, approve: false },
        distributors: { view: true, edit: true, approve: false },
        settings: { view: true, edit: true, approve: false },
      },
    },
    {
      key: 'inventory_manager',
      name: 'Inventory Manager',
      permissions: {
        ...DEFAULT_ROLE_PERMS,
        inventory: { view: true, edit: true, approve: false },
        orders: { view: true, edit: true, approve: false },
      },
    },
    {
      key: 'finance',
      name: 'Finance',
      permissions: {
        ...DEFAULT_ROLE_PERMS,
        analytics: { view: true, edit: false, approve: false },
        compliance: { view: true, edit: true, approve: false },
        orders: { view: true, edit: false, approve: true },
        settings: { view: true, edit: true, approve: false },
      },
    },
    {
      key: 'system_admin',
      name: 'System Admin',
      permissions: MODULES.reduce((acc, m) => {
        acc[m.key] = { view: true, edit: true, approve: true };
        return acc;
      }, {} as Record<ModuleKey, ModulePermissions>),
    },
  ],
};

const STORAGE_KEY = 'rbac-config';

export function loadRbac(): RbacConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as RbacConfig;
  } catch {}
  return DEFAULT_RBAC;
}

export function saveRbac(cfg: RbacConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {}
}

export function hasPermission(config: RbacConfig, roleKey: string, moduleKey: ModuleKey, perm: PermissionKey): boolean {
  const role = config.roles.find(r => r.key === roleKey);
  if (!role) return false;
  return !!role.permissions[moduleKey]?.[perm];
}


