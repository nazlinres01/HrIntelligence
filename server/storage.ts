import {
  companies,
  users,
  employees,
  departments,
  leaves,
  performance,
  payroll,
  activities,
  settings,
  notifications,
  auditLogs,
  timeEntries,
  expenseReports,
  messages,
  trainings,
  trainingEnrollments,
  jobs,
  jobApplications,
  interviews,
  rolePermissions,
  securitySessions,
  passwordResetTokens,
  companySettings,
  fileUploads,
  systemLogs,
  strategicGoals,
  hrAnalytics,
  type Company,
  type InsertCompany,
  type User,
  type UpsertUser,
  type Employee,
  type InsertEmployee,
  type Department,
  type InsertDepartment,
  type Leave,
  type InsertLeave,
  type Performance,
  type InsertPerformance,
  type Payroll,
  type InsertPayroll,
  type Activity,
  type InsertActivity,
  type Setting,
  type InsertSetting,
  type Notification,
  type InsertNotification,
  type AuditLog,
  type InsertAuditLog,
  type TimeEntry,
  type InsertTimeEntry,
  type ExpenseReport,
  type InsertExpenseReport,
  type Message,
  type InsertMessage,
  type Training,
  type InsertTraining,
  type TrainingEnrollment,
  type InsertTrainingEnrollment,
  type Job,
  type InsertJob,
  type JobApplication,
  type InsertJobApplication,
  type Interview,
  type InsertInterview,
  type RolePermission,
  type InsertRolePermission,
  type SecuritySession,
  type InsertSecuritySession,
  type PasswordResetToken,
  type InsertPasswordResetToken,
  type CompanySetting,
  type InsertCompanySetting,
  type FileUpload,
  type InsertFileUpload,
  type SystemLog,
  type InsertSystemLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, count, sql, like, gte, lte, asc } from "drizzle-orm";

export interface IStorage {
  // User operations for authentication
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserWithCompany(id: string): Promise<User & { company?: Company } | undefined>;
  getAllUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, userData: Partial<UpsertUser>): Promise<User>;

  // Security operations
  getActiveSession(token: string): Promise<SecuritySession | undefined>;
  createSecuritySession(session: InsertSecuritySession): Promise<SecuritySession>;
  updateSessionActivity(sessionId: number): Promise<void>;
  deactivateSession(sessionId: number): Promise<void>;
  getUserPermissions(userId: string, companyId: number): Promise<RolePermission[]>;
  createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  usePasswordResetToken(tokenId: number): Promise<void>;

  // System operations
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
  getSystemLogs(limit?: number): Promise<SystemLog[]>;
  createFileUpload(upload: InsertFileUpload): Promise<FileUpload>;
  getFileUpload(id: number): Promise<FileUpload | undefined>;

  // Company settings
  getCompanySetting(companyId: number, category: string, key: string): Promise<CompanySetting | undefined>;
  upsertCompanySetting(setting: InsertCompanySetting): Promise<CompanySetting>;
  getCompanySettings(companyId: number, category?: string): Promise<CompanySetting[]>;

  // Interview operations
  createInterview(interview: InsertInterview): Promise<Interview>;
  getInterview(id: number): Promise<Interview | undefined>;
  getInterviewsByApplication(applicationId: number): Promise<Interview[]>;
  updateInterview(id: number, interview: Partial<InsertInterview>): Promise<Interview>;
  deleteInterview(id: number): Promise<boolean>;

  // Company operations
  getCompany(id: number): Promise<Company | undefined>;
  getCompanyByUser(userId: string): Promise<Company | undefined>;
  getAllCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company>;

  // Team operations
  getTeamMembers(companyId: number): Promise<User[]>;
  getTeamStats(companyId: number): Promise<{
    totalMembers: number;
    activeMembers: number;
    managers: number;
    specialists: number;
  }>;
  inviteTeamMember(userData: UpsertUser): Promise<User>;
  updateUserStatus(userId: string, isActive: boolean): Promise<boolean>;
  updateUserPassword(userId: string, newPassword: string): Promise<boolean>;

  // Employee operations
  getEmployees(): Promise<Employee[]>;
  getEmployeesByDepartment(departmentId: number): Promise<Employee[]>;
  getEmployeesByCompany(companyId: number): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeByEmail(email: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee>;
  deleteEmployee(id: number): Promise<boolean>;

  // Dashboard statistics
  getEmployeeStats(): Promise<{
    totalEmployees: number;
    activeLeaves: number;
    monthlyPayroll: string;
    avgPerformance: string;
  }>;
  
  getHRManagerStats(): Promise<{
    totalEmployees: number;
    pendingLeaves: number;
    performanceReviews: number;
    recruitment: number;
    payrollAmount: string;
    departmentCount: number;
  }>;
  
  getDepartmentManagerStats(userId: string): Promise<{
    teamSize: number;
    pendingApprovals: number;
    avgTeamPerformance: string;
    completedProjects: number;
    teamBudget: string;
  }>;

  // Department operations
  getDepartments(): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department>;

  // Leave operations
  getLeaves(): Promise<Leave[]>;
  getLeavesByEmployee(employeeId: number): Promise<Leave[]>;
  getLeavesByDepartment(departmentId: number): Promise<Leave[]>;
  getLeave(id: number): Promise<Leave | undefined>;
  createLeave(leave: InsertLeave): Promise<Leave>;
  updateLeave(id: number, leave: Partial<InsertLeave>): Promise<Leave>;
  deleteLeave(id: number): Promise<boolean>;

  // Training operations
  getTrainingPrograms(): Promise<any[]>;
  createTrainingProgram(training: any): Promise<any>;
  updateTrainingProgram(id: number, training: any): Promise<any>;
  deleteTrainingProgram(id: number): Promise<boolean>;

  // Job operations
  getJobs(): Promise<any[]>;
  createJob(job: any): Promise<any>;
  updateJob(id: number, job: any): Promise<any>;
  deleteJob(id: number): Promise<boolean>;

  // Job application operations
  getJobApplications(): Promise<any[]>;
  createJobApplication(application: any): Promise<any>;
  updateJobApplication(id: number, application: any): Promise<any>;

  // Performance operations
  getPerformanceRecords(): Promise<Performance[]>;
  getPerformanceByEmployee(employeeId: number): Promise<Performance[]>;
  createPerformance(performance: InsertPerformance): Promise<Performance>;
  updatePerformance(id: number, performance: Partial<InsertPerformance>): Promise<Performance>;

  // Payroll operations
  getPayrollRecords(): Promise<Payroll[]>;
  getPayrollByEmployee(employeeId: number): Promise<Payroll[]>;
  createPayroll(payroll: InsertPayroll): Promise<Payroll>;
  updatePayroll(id: number, payroll: Partial<InsertPayroll>): Promise<Payroll>;

  // Activity operations
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Dashboard stats
  getEmployeeStats(): Promise<{
    totalEmployees: number;
    activeLeaves: number;
    monthlyPayroll: string;
    avgPerformance: string;
  }>;

  // Settings operations
  getUserSettings(userId: string): Promise<Setting[]>;
  getUserSetting(userId: string, category: string, key: string): Promise<Setting | undefined>;
  upsertUserSetting(setting: InsertSetting): Promise<Setting>;
  deleteUserSetting(userId: string, category: string, key: string): Promise<boolean>;

  // Notification operations
  getUserNotifications(userId: string, limit?: number): Promise<Notification[]>;
  getUnreadNotificationCount(userId: string): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number, userId: string): Promise<boolean>;
  markAllNotificationsAsRead(userId: string): Promise<boolean>;
  deleteNotification(id: number, userId: string): Promise<boolean>;

  // Audit log operations
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(limit?: number, companyId?: number): Promise<AuditLog[]>;
  getUserAuditLogs(userId: string, limit?: number): Promise<AuditLog[]>;

  // Time entry operations
  createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry>;
  getUserTimeEntries(userId: string, limit?: number): Promise<TimeEntry[]>;
  getPendingTimeEntries(limit?: number): Promise<TimeEntry[]>;
  approveTimeEntry(id: number, approvedBy: string): Promise<boolean>;
  rejectTimeEntry(id: number, approvedBy: string): Promise<boolean>;

  // Expense report operations
  createExpenseReport(report: InsertExpenseReport): Promise<ExpenseReport>;
  getUserExpenseReports(userId: string, limit?: number): Promise<ExpenseReport[]>;
  getPendingExpenseReports(limit?: number): Promise<ExpenseReport[]>;
  approveExpenseReport(id: number, approvedBy: string): Promise<boolean>;
  rejectExpenseReport(id: number, approvedBy: string): Promise<boolean>;

  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getUserMessages(userId: string, limit?: number): Promise<Message[]>;
  markMessageAsRead(id: number, userId: string): Promise<boolean>;
  deleteMessage(id: number, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations for authentication
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUserWithCompany(id: string): Promise<User & { company?: Company } | undefined> {
    const result = await db
      .select()
      .from(users)
      .leftJoin(companies, eq(users.companyId, companies.id))
      .where(eq(users.id, id));
    
    if (result.length === 0) return undefined;
    
    const user = result[0].users;
    const company = result[0].companies;
    
    return { ...user, company: company || undefined };
  }

  // Security operations
  async getActiveSession(token: string): Promise<SecuritySession | undefined> {
    const [session] = await db
      .select()
      .from(securitySessions)
      .where(and(
        eq(securitySessions.sessionToken, token),
        eq(securitySessions.isActive, true),
        gte(securitySessions.expiresAt, new Date())
      ));
    return session;
  }

  async createSecuritySession(sessionData: InsertSecuritySession): Promise<SecuritySession> {
    const [session] = await db
      .insert(securitySessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async updateSessionActivity(sessionId: number): Promise<void> {
    await db
      .update(securitySessions)
      .set({ lastActivity: new Date() })
      .where(eq(securitySessions.id, sessionId));
  }

  async deactivateSession(sessionId: number): Promise<void> {
    await db
      .update(securitySessions)
      .set({ isActive: false })
      .where(eq(securitySessions.id, sessionId));
  }

  async getUserPermissions(userId: string, companyId: number): Promise<RolePermission[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    return await db
      .select()
      .from(rolePermissions)
      .where(and(
        eq(rolePermissions.role, user.role),
        eq(rolePermissions.companyId, companyId),
        eq(rolePermissions.isActive, true)
      ));
  }

  async createPasswordResetToken(tokenData: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [token] = await db
      .insert(passwordResetTokens)
      .values(tokenData)
      .returning();
    return token;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.used, false),
        gte(passwordResetTokens.expiresAt, new Date())
      ));
    return resetToken;
  }

  async usePasswordResetToken(tokenId: number): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, tokenId));
  }

  // System operations
  async createSystemLog(logData: InsertSystemLog): Promise<SystemLog> {
    const [log] = await db
      .insert(systemLogs)
      .values(logData)
      .returning();
    return log;
  }

  async getSystemLogs(limit: number = 100): Promise<SystemLog[]> {
    return await db
      .select()
      .from(systemLogs)
      .orderBy(desc(systemLogs.createdAt))
      .limit(limit);
  }

  async createFileUpload(uploadData: InsertFileUpload): Promise<FileUpload> {
    const [upload] = await db
      .insert(fileUploads)
      .values(uploadData)
      .returning();
    return upload;
  }

  async getFileUpload(id: number): Promise<FileUpload | undefined> {
    const [upload] = await db
      .select()
      .from(fileUploads)
      .where(eq(fileUploads.id, id));
    return upload;
  }

  // Company settings
  async getCompanySetting(companyId: number, category: string, key: string): Promise<CompanySetting | undefined> {
    const [setting] = await db
      .select()
      .from(companySettings)
      .where(and(
        eq(companySettings.companyId, companyId),
        eq(companySettings.category, category),
        eq(companySettings.key, key)
      ));
    return setting;
  }

  async upsertCompanySetting(settingData: InsertCompanySetting): Promise<CompanySetting> {
    const [setting] = await db
      .insert(companySettings)
      .values(settingData)
      .onConflictDoUpdate({
        target: [companySettings.companyId, companySettings.category, companySettings.key],
        set: {
          value: settingData.value,
          updatedAt: new Date(),
          updatedBy: settingData.updatedBy
        }
      })
      .returning();
    return setting;
  }

  async getCompanySettings(companyId: number, category?: string): Promise<CompanySetting[]> {
    const conditions = [eq(companySettings.companyId, companyId)];
    if (category) {
      conditions.push(eq(companySettings.category, category));
    }
    
    return await db
      .select()
      .from(companySettings)
      .where(and(...conditions))
      .orderBy(companySettings.category, companySettings.key);
  }

  // Interview operations
  async createInterview(interviewData: InsertInterview): Promise<Interview> {
    const [interview] = await db
      .insert(interviews)
      .values(interviewData)
      .returning();
    return interview;
  }

  async getInterview(id: number): Promise<Interview | undefined> {
    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, id));
    return interview;
  }

  async getInterviewsByApplication(applicationId: number): Promise<Interview[]> {
    return await db
      .select()
      .from(interviews)
      .where(eq(interviews.applicationId, applicationId))
      .orderBy(interviews.scheduledDate);
  }

  async updateInterview(id: number, interviewData: Partial<InsertInterview>): Promise<Interview> {
    const [interview] = await db
      .update(interviews)
      .set({
        ...interviewData,
        updatedAt: new Date()
      })
      .where(eq(interviews.id, id))
      .returning();
    return interview;
  }

  async deleteInterview(id: number): Promise<boolean> {
    const result = await db
      .delete(interviews)
      .where(eq(interviews.id, id));
    return result.rowCount > 0;
  }

  // Company operations
  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async getCompanyByUser(userId: string): Promise<Company | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user || !user.companyId) return undefined;
    return this.getCompany(user.companyId);
  }

  async createCompany(companyData: InsertCompany): Promise<Company> {
    const [company] = await db
      .insert(companies)
      .values(companyData)
      .returning();
    return company;
  }

  async updateCompany(id: number, companyData: Partial<InsertCompany>): Promise<Company> {
    const [company] = await db
      .update(companies)
      .set({ ...companyData, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();
    return company;
  }

  async getAllCompanies(): Promise<Company[]> {
    return await db.select().from(companies).orderBy(desc(companies.createdAt));
  }

  // Team operations
  async getTeamMembers(companyId: number): Promise<User[]> {
    return await db.select().from(users).where(eq(users.companyId, companyId));
  }

  async getTeamStats(companyId: number): Promise<{
    totalMembers: number;
    activeMembers: number;
    managers: number;
    specialists: number;
  }> {
    const teamMembers = await this.getTeamMembers(companyId);
    
    return {
      totalMembers: teamMembers.length,
      activeMembers: teamMembers.filter(m => m.isActive).length,
      managers: teamMembers.filter(m => m.role === 'hr_manager').length,
      specialists: teamMembers.filter(m => m.role === 'hr_specialist').length,
    };
  }

  async inviteTeamMember(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        isActive: true,
        password: 'temp_password_' + Date.now(),
      })
      .returning();
    return user;
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<boolean> {
    const result = await db
      .update(users)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(users.id, userId));
    return (result.rowCount ?? 0) > 0;
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
    const result = await db
      .update(users)
      .set({ password: newPassword, updatedAt: new Date() })
      .where(eq(users.id, userId));
    return (result.rowCount ?? 0) > 0;
  }

  // Employee operations
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees);
  }

  async getEmployeesByDepartment(departmentId: number): Promise<Employee[]> {
    // Get department name first, then filter employees by department name
    const [department] = await db.select().from(departments).where(eq(departments.id, departmentId));
    if (!department) return [];
    
    return await db.select().from(employees).where(eq(employees.department, department.name));
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee || undefined;
  }

  async getEmployeeByEmail(email: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.email, email));
    return employee || undefined;
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [newEmployee] = await db.insert(employees).values(employee).returning();
    
    await this.createActivity({
      type: "employee_added",
      description: `${employee.firstName} ${employee.lastName} eklendi`,
      entityId: newEmployee.id,
      performedBy: null
    });
    
    return newEmployee;
  }

  async updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee> {
    const [updated] = await db.update(employees)
      .set({
        ...employee,
        updatedAt: new Date(),
      })
      .where(eq(employees.id, id))
      .returning();
    
    if (!updated) throw new Error("Employee not found");
    return updated;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    const result = await db.delete(employees).where(eq(employees.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Department operations
  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments);
  }

  async getDepartment(id: number): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department || undefined;
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const [newDepartment] = await db.insert(departments).values(department).returning();
    return newDepartment;
  }

  async updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department> {
    const [updated] = await db.update(departments)
      .set(department)
      .where(eq(departments.id, id))
      .returning();
    
    if (!updated) throw new Error("Department not found");
    return updated;
  }

  // Leave operations
  async getLeaves(): Promise<Leave[]> {
    return await db.select().from(leaves);
  }

  async getLeavesByEmployee(employeeId: number): Promise<Leave[]> {
    return await db.select().from(leaves).where(eq(leaves.employeeId, employeeId));
  }

  async getLeavesByDepartment(departmentId: number): Promise<Leave[]> {
    // Get department name first, then join leaves with employees to filter by department
    const [department] = await db.select().from(departments).where(eq(departments.id, departmentId));
    if (!department) return [];
    
    const departmentLeaves = await db
      .select({
        id: leaves.id,
        employeeId: leaves.employeeId,
        leaveType: leaves.leaveType,
        startDate: leaves.startDate,
        endDate: leaves.endDate,
        days: leaves.days,
        reason: leaves.reason,
        status: leaves.status,
        approvedBy: leaves.approvedBy,
        appliedAt: leaves.appliedAt
      })
      .from(leaves)
      .innerJoin(employees, eq(leaves.employeeId, employees.id))
      .where(eq(employees.department, department.name));
    
    return departmentLeaves;
  }

  async getLeave(id: number): Promise<Leave | undefined> {
    const [leave] = await db.select().from(leaves).where(eq(leaves.id, id));
    return leave || undefined;
  }

  async createLeave(leave: InsertLeave): Promise<Leave> {
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const [newLeave] = await db.insert(leaves).values({
      ...leave,
      days,
      status: "pending",
    }).returning();
    return newLeave;
  }

  async updateLeave(id: number, leave: Partial<InsertLeave>): Promise<Leave> {
    const [updated] = await db.update(leaves)
      .set(leave)
      .where(eq(leaves.id, id))
      .returning();
    
    if (!updated) throw new Error("Leave not found");
    return updated;
  }

  async deleteLeave(id: number): Promise<boolean> {
    const result = await db.delete(leaves).where(eq(leaves.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Training operations
  async getTrainingPrograms(): Promise<any[]> {
    return await db.select().from(trainings);
  }

  async createTrainingProgram(training: any): Promise<any> {
    const [newTraining] = await db.insert(trainings).values(training).returning();
    return newTraining;
  }

  async updateTrainingProgram(id: number, training: any): Promise<any> {
    const [updated] = await db.update(trainings)
      .set(training)
      .where(eq(trainings.id, id))
      .returning();
    
    if (!updated) throw new Error("Training program not found");
    return updated;
  }

  async deleteTrainingProgram(id: number): Promise<boolean> {
    const result = await db.delete(trainings).where(eq(trainings.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Job operations
  async getJobs(): Promise<any[]> {
    return await db.select().from(jobs);
  }

  async createJob(job: any): Promise<any> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async updateJob(id: number, job: any): Promise<any> {
    const [updated] = await db.update(jobs)
      .set(job)
      .where(eq(jobs.id, id))
      .returning();
    
    if (!updated) throw new Error("Job not found");
    return updated;
  }

  async deleteJob(id: number): Promise<boolean> {
    const result = await db.delete(jobs).where(eq(jobs.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Job application operations
  async getJobApplications(): Promise<any[]> {
    return await db.select().from(jobApplications);
  }

  async createJobApplication(application: any): Promise<any> {
    const [newApplication] = await db.insert(jobApplications).values(application).returning();
    return newApplication;
  }

  async updateJobApplication(id: number, application: any): Promise<any> {
    const [updated] = await db.update(jobApplications)
      .set(application)
      .where(eq(jobApplications.id, id))
      .returning();
    
    if (!updated) throw new Error("Job application not found");
    return updated;
  }

  // Performance operations  
  async getPerformanceRecords(): Promise<Performance[]> {
    return await db.select().from(performance);
  }

  async getPerformanceByEmployee(employeeId: number): Promise<Performance[]> {
    return await db.select().from(performance).where(eq(performance.employeeId, employeeId));
  }

  async createPerformance(performanceData: InsertPerformance): Promise<Performance> {
    const [newPerformance] = await db.insert(performance).values(performanceData).returning();
    return newPerformance;
  }

  async updatePerformance(id: number, performanceData: Partial<InsertPerformance>): Promise<Performance> {
    const [updated] = await db.update(performance)
      .set(performanceData)
      .where(eq(performance.id, id))
      .returning();
    
    if (!updated) throw new Error("Performance record not found");
    return updated;
  }

  // Payroll operations
  async getPayrollRecords(): Promise<Payroll[]> {
    return await db.select().from(payroll);
  }

  async getPayrollByEmployee(employeeId: number): Promise<Payroll[]> {
    return await db.select().from(payroll).where(eq(payroll.employeeId, employeeId));
  }

  async createPayroll(payrollData: InsertPayroll): Promise<Payroll> {
    const [newPayroll] = await db.insert(payroll).values(payrollData).returning();
    return newPayroll;
  }

  async updatePayroll(id: number, payrollData: Partial<InsertPayroll>): Promise<Payroll> {
    const [updated] = await db.update(payroll)
      .set(payrollData)
      .where(eq(payroll.id, id))
      .returning();
    
    if (!updated) throw new Error("Payroll record not found");
    return updated;
  }

  // Activity operations
  async getActivities(limit: number = 10): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(desc(activities.timestamp)).limit(limit);
  }

  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(activities).values(activityData).returning();
    return activity;
  }



  // Settings operations
  async getUserSettings(userId: string): Promise<Setting[]> {
    return await db.select().from(settings).where(eq(settings.userId, userId));
  }

  async getUserSetting(userId: string, category: string, key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings)
      .where(and(eq(settings.userId, userId), eq(settings.category, category), eq(settings.key, key)));
    return setting || undefined;
  }

  async upsertUserSetting(setting: InsertSetting): Promise<Setting> {
    const [upserted] = await db.insert(settings).values(setting).returning();
    return upserted;
  }

  async deleteUserSetting(userId: string, category: string, key: string): Promise<boolean> {
    const result = await db.delete(settings)
      .where(and(eq(settings.userId, userId), eq(settings.category, category), eq(settings.key, key)));
    return (result.rowCount || 0) > 0;
  }

  // Notification operations
  async getUserNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const unreadNotifications = await db.select().from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return unreadNotifications.length;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationAsRead(id: number, userId: string): Promise<boolean> {
    const result = await db.update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
    return (result.rowCount || 0) > 0;
  }

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    const result = await db.update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.userId, userId));
    return (result.rowCount || 0) > 0;
  }

  async deleteNotification(id: number, userId: string): Promise<boolean> {
    const result = await db.delete(notifications)
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
    return (result.rowCount || 0) > 0;
  }

  // Audit log operations
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [auditLog] = await db.insert(auditLogs).values(log).returning();
    return auditLog;
  }

  async getAuditLogs(limit: number = 100, companyId?: number): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
  }

  async getUserAuditLogs(userId: string, limit: number = 50): Promise<AuditLog[]> {
    return await db.select().from(auditLogs)
      .where(eq(auditLogs.userId, userId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  // Time entry operations
  async createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry> {
    const [timeEntry] = await db.insert(timeEntries).values(entry).returning();
    return timeEntry;
  }

  async getUserTimeEntries(userId: string, limit: number = 50): Promise<TimeEntry[]> {
    return await db.select().from(timeEntries)
      .where(eq(timeEntries.userId, userId))
      .orderBy(desc(timeEntries.createdAt))
      .limit(limit);
  }

  async getPendingTimeEntries(limit: number = 50): Promise<TimeEntry[]> {
    return await db.select().from(timeEntries)
      .where(eq(timeEntries.status, "pending"))
      .orderBy(desc(timeEntries.createdAt))
      .limit(limit);
  }

  async approveTimeEntry(id: number, approvedBy: string): Promise<boolean> {
    const result = await db.update(timeEntries)
      .set({ status: "approved", approvedBy, approvedAt: new Date() })
      .where(eq(timeEntries.id, id));
    return (result.rowCount || 0) > 0;
  }

  async rejectTimeEntry(id: number, approvedBy: string): Promise<boolean> {
    const result = await db.update(timeEntries)
      .set({ status: "rejected", approvedBy, approvedAt: new Date() })
      .where(eq(timeEntries.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Expense report operations
  async createExpenseReport(report: InsertExpenseReport): Promise<ExpenseReport> {
    const [expenseReport] = await db.insert(expenseReports).values(report).returning();
    return expenseReport;
  }

  async getUserExpenseReports(userId: string, limit: number = 50): Promise<ExpenseReport[]> {
    return await db.select().from(expenseReports)
      .where(eq(expenseReports.userId, userId))
      .orderBy(desc(expenseReports.createdAt))
      .limit(limit);
  }

  async getPendingExpenseReports(limit: number = 50): Promise<ExpenseReport[]> {
    return await db.select().from(expenseReports)
      .where(eq(expenseReports.status, "pending"))
      .orderBy(desc(expenseReports.createdAt))
      .limit(limit);
  }

  async approveExpenseReport(id: number, approvedBy: string): Promise<boolean> {
    const result = await db.update(expenseReports)
      .set({ status: "approved", approvedBy, approvedAt: new Date() })
      .where(eq(expenseReports.id, id));
    return (result.rowCount || 0) > 0;
  }

  async rejectExpenseReport(id: number, approvedBy: string): Promise<boolean> {
    const result = await db.update(expenseReports)
      .set({ status: "rejected", approvedBy, approvedAt: new Date() })
      .where(eq(expenseReports.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getUserMessages(userId: string, limit: number = 50): Promise<Message[]> {
    return await db.select().from(messages)
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async markMessageAsRead(id: number, userId: string): Promise<boolean> {
    const result = await db.update(messages)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(messages.id, id));
    return (result.rowCount || 0) > 0;
  }

  async deleteMessage(id: number, userId: string): Promise<boolean> {
    const result = await db.delete(messages).where(eq(messages.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Dashboard Statistics Methods
  async getEmployeeStats(): Promise<{
    totalEmployees: number;
    activeLeaves: number;
    monthlyPayroll: string;
    avgPerformance: string;
  }> {
    const allEmployees = await db.select().from(employees);
    const totalEmployees = allEmployees.length;
    
    // Get employees currently on leave
    const currentDate = new Date().toISOString().split('T')[0];
    const onLeaveResult = await db.select().from(leaves)
      .where(and(
        eq(leaves.status, 'approved'),
        eq(leaves.startDate, currentDate)
      ));
    const activeLeaves = onLeaveResult.length;

    // Calculate average performance
    const performanceResults = await db.select().from(performance);
    const avgPerformance = performanceResults.length > 0 
      ? (performanceResults.reduce((sum, p) => sum + parseFloat(p.score || '0'), 0) / performanceResults.length).toFixed(1)
      : '0.0';

    // Calculate monthly payroll
    const currentMonth = new Date().toISOString().slice(0, 7);
    const payrollResults = await db.select().from(payroll)
      .where(eq(payroll.month, currentMonth));
    const monthlyPayroll = payrollResults.reduce((sum, p) => sum + parseFloat(p.netSalary || '0'), 0).toLocaleString('tr-TR');

    return {
      totalEmployees,
      activeLeaves,
      avgPerformance,
      monthlyPayroll
    };
  }

  async getHRManagerStats(): Promise<{
    totalEmployees: number;
    pendingLeaves: number;
    performanceReviews: number;
    recruitment: number;
    payrollAmount: string;
    departmentCount: number;
  }> {
    const allEmployees = await db.select().from(employees);
    const totalEmployees = allEmployees.length;

    // Get pending leaves
    const pendingLeavesResult = await db.select().from(leaves)
      .where(eq(leaves.status, 'pending'));
    const pendingLeaves = pendingLeavesResult.length;

    // Get performance reviews this quarter
    const currentYear = new Date().getFullYear();
    const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
    const quarterString = `Q${currentQuarter} ${currentYear}`;
    
    const performanceReviews = await db.select().from(performance)
      .where(eq(performance.reviewPeriod, quarterString));

    // Get active job postings (recruitment)
    const activeJobs = await db.select().from(jobs)
      .where(eq(jobs.status, 'active'));
    const recruitment = activeJobs.length;

    // Calculate current month payroll
    const currentMonth = new Date().toISOString().slice(0, 7);
    const payrollResults = await db.select().from(payroll)
      .where(eq(payroll.month, currentMonth));
    const payrollAmount = payrollResults.reduce((sum, p) => sum + parseFloat(p.netSalary || '0'), 0).toLocaleString('tr-TR');

    // Get department count
    const allDepartments = await db.select().from(departments);
    const departmentCount = allDepartments.length;

    return {
      totalEmployees,
      pendingLeaves,
      performanceReviews: performanceReviews.length,
      recruitment,
      payrollAmount,
      departmentCount
    };
  }

  async getDepartmentManagerStats(userId: string): Promise<{
    teamSize: number;
    pendingApprovals: number;
    avgTeamPerformance: string;
    completedProjects: number;
    teamBudget: string;
  }> {
    // Get user's department
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) throw new Error('User not found');

    // Find department where user is manager
    const [department] = await db.select().from(departments);
    if (!department) {
      return {
        teamSize: 0,
        pendingApprovals: 0,
        avgTeamPerformance: '0.0',
        completedProjects: 0,
        teamBudget: '0'
      };
    }

    // Get team members in user's department
    const teamMembers = await db.select().from(employees)
      .where(eq(employees.department, department.name));
    const teamSize = teamMembers.length;

    // Get pending leave approvals for team
    const teamEmployeeIds = teamMembers.map(emp => emp.id);
    const pendingApprovals = await db.select().from(leaves)
      .where(and(
        eq(leaves.status, 'pending'),
        or(...teamEmployeeIds.map(id => eq(leaves.employeeId, id)))
      ));

    // Calculate average team performance
    const teamPerformanceResults = await db.select().from(performance)
      .where(or(...teamEmployeeIds.map(id => eq(performance.employeeId, id))));
    
    const avgTeamPerformance = teamPerformanceResults.length > 0
      ? (teamPerformanceResults.reduce((sum, p) => sum + parseFloat(p.score || '0'), 0) / teamPerformanceResults.length).toFixed(1)
      : '0.0';

    // Mock completed projects (would be from a projects table in real implementation)
    const completedProjects = 8;

    // Get team budget
    const teamBudget = department.budget ? parseFloat(department.budget).toLocaleString('tr-TR') : '0';

    return {
      teamSize,
      pendingApprovals: pendingApprovals.length,
      avgTeamPerformance,
      completedProjects,
      teamBudget
    };
  }

  async getEmployeesByCompany(companyId: number): Promise<Employee[]> {
    return await db.select().from(employees).where(eq(employees.companyId, companyId));
  }


}

export const storage = new DatabaseStorage();