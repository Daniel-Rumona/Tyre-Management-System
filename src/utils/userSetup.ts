export const ROLES = {
  ADMIN: 'Admin',
  DIRECTOR: 'Director',
  SITE_MANAGER: 'Site Manager',
  SUPERVISOR: 'Supervisor',
  FITTER: 'Tyre Fitter'
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  site?: string;
}

// Map role to base paths
export const ROLE_PATHS = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.DIRECTOR]: '/director',
  [ROLES.SITE_MANAGER]: '/sitemanager',
  [ROLES.SUPERVISOR]: '/supervisor',
  [ROLES.FITTER]: '/fitter'
};

// Permissions setup
export const PERMISSIONS: Record<string, RoleType[]> = {
  CREATE_USER: [ROLES.ADMIN],
  EDIT_USER: [ROLES.ADMIN],
  DELETE_USER: [ROLES.ADMIN],
  VIEW_REPORTS: [ROLES.ADMIN, ROLES.DIRECTOR, ROLES.SITE_MANAGER, ROLES.SUPERVISOR],
  CREATE_INSPECTION: [ROLES.ADMIN, ROLES.SITE_MANAGER, ROLES.SUPERVISOR, ROLES.FITTER],
  EDIT_SETTINGS: [ROLES.ADMIN],
  MANAGE_TYRES: [ROLES.ADMIN, ROLES.SITE_MANAGER],
  VIEW_ANALYTICS: [ROLES.ADMIN, ROLES.DIRECTOR, ROLES.SITE_MANAGER],
  FITMENT_OPERATIONS: [ROLES.FITTER, ROLES.SUPERVISOR, ROLES.SITE_MANAGER]
};

// Check if user has permission
export const hasPermission = (userRole: RoleType, permission: keyof typeof PERMISSIONS): boolean => {
  return PERMISSIONS[permission].includes(userRole);
};

// Utility to get default site based on role (for demo)
export const getDefaultSite = (role: RoleType): string => {
  switch (role) {
    case ROLES.SITE_MANAGER:
      return 'North Pit';
    case ROLES.SUPERVISOR:
      return 'South Pit';
    case ROLES.FITTER:
      return 'Main Workshop';
    default:
      return 'All Sites';
  }
}; 