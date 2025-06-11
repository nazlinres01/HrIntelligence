export type UserRole = "owner" | "admin" | "hr_manager" | "hr_specialist" | "department_manager" | "employee";

export interface Permission {
  canViewDashboard: boolean;
  canManageEmployees: boolean;
  canManagePayroll: boolean;
  canManageLeaves: boolean;
  canManagePerformance: boolean;
  canManageTeam: boolean;
  canManageCompany: boolean;
  canViewReports: boolean;
  canManageDepartments: boolean;
  canViewAllData: boolean;
  canManageOwnProfile: boolean;
  canRequestLeave: boolean;
}

export const rolePermissions: Record<UserRole, Permission> = {
  owner: {
    canViewDashboard: true,
    canManageEmployees: true,
    canManagePayroll: true,
    canManageLeaves: true,
    canManagePerformance: true,
    canManageTeam: true,
    canManageCompany: true,
    canViewReports: true,
    canManageDepartments: true,
    canViewAllData: true,
    canManageOwnProfile: true,
    canRequestLeave: false,
  },
  admin: {
    canViewDashboard: true,
    canManageEmployees: true,
    canManagePayroll: true,
    canManageLeaves: true,
    canManagePerformance: true,
    canManageTeam: true,
    canManageCompany: true,
    canViewReports: true,
    canManageDepartments: true,
    canViewAllData: true,
    canManageOwnProfile: true,
    canRequestLeave: false,
  },
  hr_manager: {
    canViewDashboard: true,
    canManageEmployees: true,
    canManagePayroll: true,
    canManageLeaves: true,
    canManagePerformance: true,
    canManageTeam: true,
    canManageCompany: false,
    canViewReports: true,
    canManageDepartments: true,
    canViewAllData: true,
    canManageOwnProfile: true,
    canRequestLeave: false,
  },
  hr_specialist: {
    canViewDashboard: true,
    canManageEmployees: true,
    canManagePayroll: false,
    canManageLeaves: true,
    canManagePerformance: true,
    canManageTeam: false,
    canManageCompany: false,
    canViewReports: true,
    canManageDepartments: false,
    canViewAllData: true,
    canManageOwnProfile: true,
    canRequestLeave: true,
  },
  department_manager: {
    canViewDashboard: true,
    canManageEmployees: false,
    canManagePayroll: false,
    canManageLeaves: true,
    canManagePerformance: true,
    canManageTeam: false,
    canManageCompany: false,
    canViewReports: true,
    canManageDepartments: false,
    canViewAllData: false,
    canManageOwnProfile: true,
    canRequestLeave: true,
  },
  employee: {
    canViewDashboard: false,
    canManageEmployees: false,
    canManagePayroll: false,
    canManageLeaves: false,
    canManagePerformance: false,
    canManageTeam: false,
    canManageCompany: false,
    canViewReports: false,
    canManageDepartments: false,
    canViewAllData: false,
    canManageOwnProfile: true,
    canRequestLeave: true,
  },
};

export function getUserPermissions(role: UserRole): Permission {
  return rolePermissions[role];
}

export function hasPermission(role: UserRole, permission: keyof Permission): boolean {
  return rolePermissions[role][permission];
}

export const roleLabels: Record<UserRole, string> = {
  owner: "Patron",
  admin: "Admin",
  hr_manager: "İK Müdürü", 
  hr_specialist: "İK Uzmanı",
  department_manager: "Departman Müdürü",
  employee: "Çalışan",
};