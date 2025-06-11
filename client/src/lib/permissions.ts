export type UserRole = "owner" | "admin" | "hr_manager" | "hr_specialist" | "department_manager" | "employee";

export interface Permission {
  canViewDashboard: boolean;
  canViewEmployees: boolean;
  canEditEmployees: boolean;
  canDeleteEmployees: boolean;
  canViewPerformance: boolean;
  canEditPerformance: boolean;
  canViewPayroll: boolean;
  canEditPayroll: boolean;
  canViewReports: boolean;
  canManageTeam: boolean;
  canViewAuditLogs: boolean;
  canManageEmployees: boolean;
  canManagePayroll: boolean;
  canManageLeaves: boolean;
  canManagePerformance: boolean;
  canManageCompany: boolean;
  canManageDepartments: boolean;
  canViewAllData: boolean;
  canManageOwnProfile: boolean;
  canRequestLeave: boolean;
}

export const rolePermissions: Record<UserRole, Permission> = {
  owner: {
    canViewDashboard: true,
    canViewEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: true,
    canViewPerformance: true,
    canEditPerformance: true,
    canViewPayroll: true,
    canEditPayroll: true,
    canViewReports: true,
    canManageTeam: true,
    canViewAuditLogs: true,
    canManageEmployees: true,
    canManagePayroll: true,
    canManageLeaves: true,
    canManagePerformance: true,
    canManageCompany: true,
    canManageDepartments: true,
    canViewAllData: true,
    canManageOwnProfile: true,
    canRequestLeave: false,
  },
  admin: {
    canViewDashboard: true,
    canViewEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: true,
    canViewPerformance: true,
    canEditPerformance: true,
    canViewPayroll: true,
    canEditPayroll: true,
    canViewReports: true,
    canManageTeam: true,
    canViewAuditLogs: true,
    canManageEmployees: true,
    canManagePayroll: true,
    canManageLeaves: true,
    canManagePerformance: true,
    canManageCompany: true,
    canManageDepartments: true,
    canViewAllData: true,
    canManageOwnProfile: true,
    canRequestLeave: false,
  },
  hr_manager: {
    canViewDashboard: true,
    canViewEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: true,
    canViewPerformance: true,
    canEditPerformance: true,
    canViewPayroll: true,
    canEditPayroll: true,
    canViewReports: true,
    canManageTeam: true,
    canViewAuditLogs: true,
    canManageEmployees: true,
    canManagePayroll: true,
    canManageLeaves: true,
    canManagePerformance: true,
    canManageCompany: false,
    canManageDepartments: true,
    canViewAllData: true,
    canManageOwnProfile: true,
    canRequestLeave: false,
  },
  hr_specialist: {
    canViewDashboard: true,
    canViewEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: false,
    canViewPerformance: true,
    canEditPerformance: true,
    canViewPayroll: false,
    canEditPayroll: false,
    canViewReports: true,
    canManageTeam: false,
    canViewAuditLogs: false,
    canManageEmployees: true,
    canManagePayroll: false,
    canManageLeaves: true,
    canManagePerformance: true,
    canManageCompany: false,
    canManageDepartments: false,
    canViewAllData: true,
    canManageOwnProfile: true,
    canRequestLeave: true,
  },
  department_manager: {
    canViewDashboard: true,
    canViewEmployees: true,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canViewPerformance: true,
    canEditPerformance: true,
    canViewPayroll: false,
    canEditPayroll: false,
    canViewReports: true,
    canManageTeam: false,
    canViewAuditLogs: false,
    canManageEmployees: false,
    canManagePayroll: false,
    canManageLeaves: true,
    canManagePerformance: true,
    canManageCompany: false,
    canManageDepartments: false,
    canViewAllData: false,
    canManageOwnProfile: true,
    canRequestLeave: true,
  },
  employee: {
    canViewDashboard: false,
    canViewEmployees: false,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canViewPerformance: false,
    canEditPerformance: false,
    canViewPayroll: false,
    canEditPayroll: false,
    canViewReports: false,
    canManageTeam: false,
    canViewAuditLogs: false,
    canManageEmployees: false,
    canManagePayroll: false,
    canManageLeaves: false,
    canManagePerformance: false,
    canManageCompany: false,
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