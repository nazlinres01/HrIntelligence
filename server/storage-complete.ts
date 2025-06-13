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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, count, sql, like, gte, lte, asc, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations for authentication
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, userData: Partial<UpsertUser>): Promise<User>;
  authenticateUser(email: string, password: string): Promise<User | null>;

  // Company operations
  getCompany(id: number): Promise<Company | undefined>;
  getCompanyByUser(userId: string): Promise<Company | undefined>;
  getAllCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company>;
  deleteCompany(id: number): Promise<boolean>;
  getCompanyStats(): Promise<{
    totalCompanies: number;
    activeCompanies: number;
    totalEmployees: number;
    averageEmployeesPerCompany: number;
  }>;

  // Employee operations
  getEmployees(companyId?: number): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeByEmail(email: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee>;
  deleteEmployee(id: number): Promise<boolean>;
  getEmployeesByDepartment(departmentName: string, companyId?: number): Promise<Employee[]>;
  getEmployeeStats(companyId?: number): Promise<{
    totalEmployees: number;
    activeEmployees: number;
    avgPerformanceScore: number;
    departmentDistribution: Array<{ department: string; count: number }>;
  }>;

  // Department operations
  getDepartments(companyId?: number): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department>;
  deleteDepartment(id: number): Promise<boolean>;

  // Leave operations
  getLeaves(companyId?: number): Promise<Leave[]>;
  getLeavesByEmployee(employeeId: number): Promise<Leave[]>;
  getLeave(id: number): Promise<Leave | undefined>;
  createLeave(leave: InsertLeave): Promise<Leave>;
  updateLeave(id: number, leave: Partial<InsertLeave>): Promise<Leave>;
  deleteLeave(id: number): Promise<boolean>;
  approveLeave(id: number, approvedBy: number): Promise<Leave>;
  rejectLeave(id: number, approvedBy: number): Promise<Leave>;
  getLeaveStats(companyId?: number): Promise<{
    totalLeaves: number;
    pendingLeaves: number;
    approvedLeaves: number;
    rejectedLeaves: number;
    leavesByType: Array<{ type: string; count: number }>;
  }>;

  // Performance operations
  getPerformanceRecords(companyId?: number): Promise<Performance[]>;
  getPerformanceByEmployee(employeeId: number): Promise<Performance[]>;
  createPerformance(performance: InsertPerformance): Promise<Performance>;
  updatePerformance(id: number, performance: Partial<InsertPerformance>): Promise<Performance>;
  deletePerformance(id: number): Promise<boolean>;

  // Payroll operations
  getPayrollRecords(companyId?: number): Promise<Payroll[]>;
  getPayrollByEmployee(employeeId: number): Promise<Payroll[]>;
  createPayroll(payroll: InsertPayroll): Promise<Payroll>;
  updatePayroll(id: number, payroll: Partial<InsertPayroll>): Promise<Payroll>;
  deletePayroll(id: number): Promise<boolean>;
  getPayrollStats(companyId?: number): Promise<{
    totalPayroll: number;
    avgSalary: number;
    monthlyPayroll: number;
    payrollTrend: Array<{ month: string; amount: number }>;
  }>;

  // Activity operations
  getActivities(limit?: number, companyId?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Notification operations
  getUserNotifications(userId: string, limit?: number): Promise<Notification[]>;
  getUnreadNotificationCount(userId: string): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number, userId: string): Promise<boolean>;
  markAllNotificationsAsRead(userId: string): Promise<boolean>;
  deleteNotification(id: number, userId: string): Promise<boolean>;

  // Settings operations
  getUserSettings(userId: string): Promise<Setting[]>;
  getUserSetting(userId: string, category: string, key: string): Promise<Setting | undefined>;
  upsertUserSetting(setting: InsertSetting): Promise<Setting>;
  deleteUserSetting(userId: string, category: string, key: string): Promise<boolean>;

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

  // Training operations
  getTrainingPrograms(companyId?: number): Promise<Training[]>;
  createTrainingProgram(training: InsertTraining): Promise<Training>;
  updateTrainingProgram(id: number, training: Partial<InsertTraining>): Promise<Training>;
  deleteTrainingProgram(id: number): Promise<boolean>;
  enrollInTraining(enrollment: InsertTrainingEnrollment): Promise<TrainingEnrollment>;
  getTrainingEnrollments(trainingId: number): Promise<TrainingEnrollment[]>;
  getUserTrainingEnrollments(userId: string): Promise<TrainingEnrollment[]>;

  // Job operations
  getJobs(companyId?: number): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job>;
  deleteJob(id: number): Promise<boolean>;
  getActiveJobs(companyId?: number): Promise<Job[]>;

  // Job application operations
  getJobApplications(jobId?: number): Promise<JobApplication[]>;
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  updateJobApplication(id: number, application: Partial<InsertJobApplication>): Promise<JobApplication>;
  deleteJobApplication(id: number): Promise<boolean>;
  getApplicationsByJob(jobId: number): Promise<JobApplication[]>;
  getApplicationsByStatus(status: string): Promise<JobApplication[]>;

  // Interview operations
  getInterviews(applicationId?: number): Promise<Interview[]>;
  createInterview(interview: InsertInterview): Promise<Interview>;
  updateInterview(id: number, interview: Partial<InsertInterview>): Promise<Interview>;
  deleteInterview(id: number): Promise<boolean>;
  getInterviewsByInterviewer(interviewerId: string): Promise<Interview[]>;

  // Analytics operations
  getCompanyAnalytics(companyId: number): Promise<{
    employees: { total: number; active: number; growth: number };
    departments: { total: number; avgSize: number };
    leaves: { pending: number; approved: number; rejected: number };
    payroll: { total: number; average: number };
    performance: { average: number; distribution: any[] };
  }>;

  // Dashboard stats
  getDashboardStats(companyId?: number): Promise<{
    totalEmployees: number;
    activeLeaves: number;
    monthlyPayroll: string;
    avgPerformance: string;
    pendingApplications: number;
    upcomingTrainings: number;
  }>;

  // System operations
  getSystemHealth(): Promise<{
    database: boolean;
    uptime: number;
    activeUsers: number;
    systemLoad: number;
  }>;

  getSystemMetrics(): Promise<{
    cpu: { usage: number; cores: number };
    memory: { used: number; total: number; percentage: number };
    disk: { used: number; total: number; percentage: number };
    network: { inbound: number; outbound: number };
  }>;

  getActiveUsers(): Promise<Array<{
    id: string;
    name: string;
    lastActivity: Date;
    status: string;
  }>>;

  getSystemAlerts(): Promise<Array<{
    id: number;
    type: string;
    message: string;
    severity: string;
    timestamp: Date;
  }>>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
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
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  // Company operations
  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async getCompanyByUser(userId: string): Promise<Company | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user?.companyId) return undefined;
    return this.getCompany(user.companyId);
  }

  async getAllCompanies(): Promise<Company[]> {
    return await db.select().from(companies).orderBy(desc(companies.createdAt));
  }

  async createCompany(companyData: InsertCompany): Promise<Company> {
    const [company] = await db.insert(companies).values(companyData).returning();
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

  async deleteCompany(id: number): Promise<boolean> {
    const result = await db.delete(companies).where(eq(companies.id, id));
    return result.rowCount > 0;
  }

  async getCompanyStats(): Promise<{
    totalCompanies: number;
    activeCompanies: number;
    totalEmployees: number;
    averageEmployeesPerCompany: number;
  }> {
    const [companiesCount] = await db.select({ count: count() }).from(companies);
    const [employeesCount] = await db.select({ count: count() }).from(employees);
    
    return {
      totalCompanies: companiesCount.count,
      activeCompanies: companiesCount.count, // Assume all are active for now
      totalEmployees: employeesCount.count,
      averageEmployeesPerCompany: Math.round(employeesCount.count / (companiesCount.count || 1)),
    };
  }

  // Employee operations
  async getEmployees(companyId?: number): Promise<Employee[]> {
    const query = db.select().from(employees);
    if (companyId) {
      return await query.where(eq(employees.companyId, companyId)).orderBy(desc(employees.createdAt));
    }
    return await query.orderBy(desc(employees.createdAt));
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee;
  }

  async getEmployeeByEmail(email: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.email, email));
    return employee;
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [newEmployee] = await db.insert(employees).values(employee).returning();
    return newEmployee;
  }

  async updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee> {
    const [updatedEmployee] = await db
      .update(employees)
      .set({ ...employee, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return updatedEmployee;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    const result = await db.delete(employees).where(eq(employees.id, id));
    return result.rowCount > 0;
  }

  async getEmployeesByDepartment(departmentName: string, companyId?: number): Promise<Employee[]> {
    const query = db.select().from(employees).where(eq(employees.department, departmentName));
    if (companyId) {
      return await query.where(and(eq(employees.department, departmentName), eq(employees.companyId, companyId)));
    }
    return await query;
  }

  async getEmployeeStats(companyId?: number): Promise<{
    totalEmployees: number;
    activeEmployees: number;
    avgPerformanceScore: number;
    departmentDistribution: Array<{ department: string; count: number }>;
  }> {
    const baseQuery = companyId 
      ? db.select().from(employees).where(eq(employees.companyId, companyId))
      : db.select().from(employees);

    const [totalCount] = await db.select({ count: count() }).from(employees);
    const [activeCount] = await db.select({ count: count() }).from(employees).where(eq(employees.status, 'active'));
    
    const departmentStats = await db
      .select({
        department: employees.department,
        count: count(),
      })
      .from(employees)
      .groupBy(employees.department);

    return {
      totalEmployees: totalCount.count,
      activeEmployees: activeCount.count,
      avgPerformanceScore: 4.2, // Mock for now
      departmentDistribution: departmentStats.map(stat => ({
        department: stat.department,
        count: stat.count,
      })),
    };
  }

  // Department operations
  async getDepartments(companyId?: number): Promise<Department[]> {
    const query = db.select().from(departments);
    if (companyId) {
      return await query.where(eq(departments.companyId, companyId)).orderBy(desc(departments.createdAt));
    }
    return await query.orderBy(desc(departments.createdAt));
  }

  async getDepartment(id: number): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department;
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const [newDepartment] = await db.insert(departments).values(department).returning();
    return newDepartment;
  }

  async updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department> {
    const [updatedDepartment] = await db
      .update(departments)
      .set({ ...department, updatedAt: new Date() })
      .where(eq(departments.id, id))
      .returning();
    return updatedDepartment;
  }

  async deleteDepartment(id: number): Promise<boolean> {
    const result = await db.delete(departments).where(eq(departments.id, id));
    return result.rowCount > 0;
  }

  // Leave operations
  async getLeaves(companyId?: number): Promise<Leave[]> {
    const query = db.select().from(leaves);
    if (companyId) {
      return await query
        .innerJoin(employees, eq(leaves.employeeId, employees.id))
        .where(eq(employees.companyId, companyId))
        .orderBy(desc(leaves.appliedAt));
    }
    return await query.orderBy(desc(leaves.appliedAt));
  }

  async getLeavesByEmployee(employeeId: number): Promise<Leave[]> {
    return await db.select().from(leaves).where(eq(leaves.employeeId, employeeId)).orderBy(desc(leaves.appliedAt));
  }

  async getLeave(id: number): Promise<Leave | undefined> {
    const [leave] = await db.select().from(leaves).where(eq(leaves.id, id));
    return leave;
  }

  async createLeave(leave: InsertLeave): Promise<Leave> {
    const [newLeave] = await db.insert(leaves).values(leave).returning();
    return newLeave;
  }

  async updateLeave(id: number, leave: Partial<InsertLeave>): Promise<Leave> {
    const [updatedLeave] = await db
      .update(leaves)
      .set(leave)
      .where(eq(leaves.id, id))
      .returning();
    return updatedLeave;
  }

  async deleteLeave(id: number): Promise<boolean> {
    const result = await db.delete(leaves).where(eq(leaves.id, id));
    return result.rowCount > 0;
  }

  async approveLeave(id: number, approvedBy: number): Promise<Leave> {
    const [leave] = await db
      .update(leaves)
      .set({ status: 'approved', approvedBy })
      .where(eq(leaves.id, id))
      .returning();
    return leave;
  }

  async rejectLeave(id: number, approvedBy: number): Promise<Leave> {
    const [leave] = await db
      .update(leaves)
      .set({ status: 'rejected', approvedBy })
      .where(eq(leaves.id, id))
      .returning();
    return leave;
  }

  async getLeaveStats(companyId?: number): Promise<{
    totalLeaves: number;
    pendingLeaves: number;
    approvedLeaves: number;
    rejectedLeaves: number;
    leavesByType: Array<{ type: string; count: number }>;
  }> {
    const [totalCount] = await db.select({ count: count() }).from(leaves);
    const [pendingCount] = await db.select({ count: count() }).from(leaves).where(eq(leaves.status, 'pending'));
    const [approvedCount] = await db.select({ count: count() }).from(leaves).where(eq(leaves.status, 'approved'));
    const [rejectedCount] = await db.select({ count: count() }).from(leaves).where(eq(leaves.status, 'rejected'));

    const typeStats = await db
      .select({
        type: leaves.leaveType,
        count: count(),
      })
      .from(leaves)
      .groupBy(leaves.leaveType);

    return {
      totalLeaves: totalCount.count,
      pendingLeaves: pendingCount.count,
      approvedLeaves: approvedCount.count,
      rejectedLeaves: rejectedCount.count,
      leavesByType: typeStats.map(stat => ({
        type: stat.type,
        count: stat.count,
      })),
    };
  }

  // Performance operations
  async getPerformanceRecords(companyId?: number): Promise<Performance[]> {
    return await db.select().from(performance).orderBy(desc(performance.reviewDate));
  }

  async getPerformanceByEmployee(employeeId: number): Promise<Performance[]> {
    return await db.select().from(performance).where(eq(performance.employeeId, employeeId)).orderBy(desc(performance.reviewDate));
  }

  async createPerformance(performanceData: InsertPerformance): Promise<Performance> {
    const [performance] = await db.insert(performance).values(performanceData).returning();
    return performance;
  }

  async updatePerformance(id: number, performanceData: Partial<InsertPerformance>): Promise<Performance> {
    const [performance] = await db
      .update(performance)
      .set(performanceData)
      .where(eq(performance.id, id))
      .returning();
    return performance;
  }

  async deletePerformance(id: number): Promise<boolean> {
    const result = await db.delete(performance).where(eq(performance.id, id));
    return result.rowCount > 0;
  }

  // Payroll operations
  async getPayrollRecords(companyId?: number): Promise<Payroll[]> {
    return await db.select().from(payroll).orderBy(desc(payroll.month));
  }

  async getPayrollByEmployee(employeeId: number): Promise<Payroll[]> {
    return await db.select().from(payroll).where(eq(payroll.employeeId, employeeId)).orderBy(desc(payroll.month));
  }

  async createPayroll(payrollData: InsertPayroll): Promise<Payroll> {
    const [payroll] = await db.insert(payroll).values(payrollData).returning();
    return payroll;
  }

  async updatePayroll(id: number, payrollData: Partial<InsertPayroll>): Promise<Payroll> {
    const [payroll] = await db
      .update(payroll)
      .set(payrollData)
      .where(eq(payroll.id, id))
      .returning();
    return payroll;
  }

  async deletePayroll(id: number): Promise<boolean> {
    const result = await db.delete(payroll).where(eq(payroll.id, id));
    return result.rowCount > 0;
  }

  async getPayrollStats(companyId?: number): Promise<{
    totalPayroll: number;
    avgSalary: number;
    monthlyPayroll: number;
    payrollTrend: Array<{ month: string; amount: number }>;
  }> {
    const records = await db.select().from(payroll);
    const totalPayroll = records.reduce((sum, record) => sum + Number(record.netSalary), 0);
    const avgSalary = records.length > 0 ? totalPayroll / records.length : 0;

    const monthlyTrend = await db
      .select({
        month: payroll.month,
        amount: sql<number>`SUM(${payroll.netSalary})`,
      })
      .from(payroll)
      .groupBy(payroll.month)
      .orderBy(payroll.month);

    return {
      totalPayroll,
      avgSalary,
      monthlyPayroll: totalPayroll,
      payrollTrend: monthlyTrend.map(trend => ({
        month: trend.month,
        amount: Number(trend.amount),
      })),
    };
  }

  // Activity operations
  async getActivities(limit: number = 50, companyId?: number): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(desc(activities.timestamp)).limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  // Notification operations
  async getUserNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return result.count;
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(notificationData).returning();
    return notification;
  }

  async markNotificationAsRead(id: number, userId: string): Promise<boolean> {
    const result = await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
    return result.rowCount > 0;
  }

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    const result = await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.userId, userId));
    return result.rowCount > 0;
  }

  async deleteNotification(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(notifications)
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
    return result.rowCount > 0;
  }

  // Settings operations
  async getUserSettings(userId: string): Promise<Setting[]> {
    return await db.select().from(settings).where(eq(settings.userId, userId));
  }

  async getUserSetting(userId: string, category: string, key: string): Promise<Setting | undefined> {
    const [setting] = await db
      .select()
      .from(settings)
      .where(and(eq(settings.userId, userId), eq(settings.category, category), eq(settings.key, key)));
    return setting;
  }

  async upsertUserSetting(settingData: InsertSetting): Promise<Setting> {
    const [setting] = await db
      .insert(settings)
      .values(settingData)
      .onConflictDoUpdate({
        target: [settings.userId, settings.category, settings.key],
        set: {
          value: settingData.value,
          updatedAt: new Date(),
        },
      })
      .returning();
    return setting;
  }

  async deleteUserSetting(userId: string, category: string, key: string): Promise<boolean> {
    const result = await db
      .delete(settings)
      .where(and(eq(settings.userId, userId), eq(settings.category, category), eq(settings.key, key)));
    return result.rowCount > 0;
  }

  // Audit log operations
  async createAuditLog(logData: InsertAuditLog): Promise<AuditLog> {
    const [log] = await db.insert(auditLogs).values(logData).returning();
    return log;
  }

  async getAuditLogs(limit: number = 100, companyId?: number): Promise<AuditLog[]> {
    const query = db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
    if (companyId) {
      return await query.where(eq(auditLogs.companyId, companyId));
    }
    return await query;
  }

  async getUserAuditLogs(userId: string, limit: number = 50): Promise<AuditLog[]> {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, userId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  // Time entry operations
  async createTimeEntry(entryData: InsertTimeEntry): Promise<TimeEntry> {
    const [entry] = await db.insert(timeEntries).values(entryData).returning();
    return entry;
  }

  async getUserTimeEntries(userId: string, limit: number = 30): Promise<TimeEntry[]> {
    return await db
      .select()
      .from(timeEntries)
      .where(eq(timeEntries.userId, userId))
      .orderBy(desc(timeEntries.createdAt))
      .limit(limit);
  }

  async getPendingTimeEntries(limit: number = 50): Promise<TimeEntry[]> {
    return await db
      .select()
      .from(timeEntries)
      .where(eq(timeEntries.status, 'pending'))
      .orderBy(desc(timeEntries.createdAt))
      .limit(limit);
  }

  async approveTimeEntry(id: number, approvedBy: string): Promise<boolean> {
    const result = await db
      .update(timeEntries)
      .set({ status: 'approved', approvedBy, approvedAt: new Date() })
      .where(eq(timeEntries.id, id));
    return result.rowCount > 0;
  }

  async rejectTimeEntry(id: number, approvedBy: string): Promise<boolean> {
    const result = await db
      .update(timeEntries)
      .set({ status: 'rejected', approvedBy, approvedAt: new Date() })
      .where(eq(timeEntries.id, id));
    return result.rowCount > 0;
  }

  // Expense report operations
  async createExpenseReport(reportData: InsertExpenseReport): Promise<ExpenseReport> {
    const [report] = await db.insert(expenseReports).values(reportData).returning();
    return report;
  }

  async getUserExpenseReports(userId: string, limit: number = 30): Promise<ExpenseReport[]> {
    return await db
      .select()
      .from(expenseReports)
      .where(eq(expenseReports.userId, userId))
      .orderBy(desc(expenseReports.createdAt))
      .limit(limit);
  }

  async getPendingExpenseReports(limit: number = 50): Promise<ExpenseReport[]> {
    return await db
      .select()
      .from(expenseReports)
      .where(eq(expenseReports.status, 'pending'))
      .orderBy(desc(expenseReports.createdAt))
      .limit(limit);
  }

  async approveExpenseReport(id: number, approvedBy: string): Promise<boolean> {
    const result = await db
      .update(expenseReports)
      .set({ status: 'approved', approvedBy, approvedAt: new Date() })
      .where(eq(expenseReports.id, id));
    return result.rowCount > 0;
  }

  async rejectExpenseReport(id: number, approvedBy: string): Promise<boolean> {
    const result = await db
      .update(expenseReports)
      .set({ status: 'rejected', approvedBy, approvedAt: new Date() })
      .where(eq(expenseReports.id, id));
    return result.rowCount > 0;
  }

  // Message operations
  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(messageData).returning();
    return message;
  }

  async getUserMessages(userId: string, limit: number = 50): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(or(eq(messages.fromUserId, userId), eq(messages.toUserId, userId)))
      .orderBy(desc(messages.createdAt))
      .limit(limit);
  }

  async markMessageAsRead(id: number, userId: string): Promise<boolean> {
    const result = await db
      .update(messages)
      .set({ isRead: true, readAt: new Date() })
      .where(and(eq(messages.id, id), eq(messages.toUserId, userId)));
    return result.rowCount > 0;
  }

  async deleteMessage(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(messages)
      .where(and(eq(messages.id, id), or(eq(messages.fromUserId, userId), eq(messages.toUserId, userId))));
    return result.rowCount > 0;
  }

  // Training operations
  async getTrainingPrograms(companyId?: number): Promise<Training[]> {
    const query = db.select().from(trainings);
    if (companyId) {
      return await query.where(eq(trainings.companyId, companyId)).orderBy(desc(trainings.createdAt));
    }
    return await query.orderBy(desc(trainings.createdAt));
  }

  async createTrainingProgram(training: InsertTraining): Promise<Training> {
    const [newTraining] = await db.insert(trainings).values(training).returning();
    return newTraining;
  }

  async updateTrainingProgram(id: number, training: Partial<InsertTraining>): Promise<Training> {
    const [updatedTraining] = await db
      .update(trainings)
      .set({ ...training, updatedAt: new Date() })
      .where(eq(trainings.id, id))
      .returning();
    return updatedTraining;
  }

  async deleteTrainingProgram(id: number): Promise<boolean> {
    const result = await db.delete(trainings).where(eq(trainings.id, id));
    return result.rowCount > 0;
  }

  async enrollInTraining(enrollment: InsertTrainingEnrollment): Promise<TrainingEnrollment> {
    const [newEnrollment] = await db.insert(trainingEnrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async getTrainingEnrollments(trainingId: number): Promise<TrainingEnrollment[]> {
    return await db.select().from(trainingEnrollments).where(eq(trainingEnrollments.trainingId, trainingId));
  }

  async getUserTrainingEnrollments(userId: string): Promise<TrainingEnrollment[]> {
    return await db.select().from(trainingEnrollments).where(eq(trainingEnrollments.userId, userId));
  }

  // Job operations
  async getJobs(companyId?: number): Promise<Job[]> {
    const query = db.select().from(jobs);
    if (companyId) {
      return await query.where(eq(jobs.companyId, companyId)).orderBy(desc(jobs.createdAt));
    }
    return await query.orderBy(desc(jobs.createdAt));
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async updateJob(id: number, job: Partial<InsertJob>): Promise<Job> {
    const [updatedJob] = await db
      .update(jobs)
      .set({ ...job, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob;
  }

  async deleteJob(id: number): Promise<boolean> {
    const result = await db.delete(jobs).where(eq(jobs.id, id));
    return result.rowCount > 0;
  }

  async getActiveJobs(companyId?: number): Promise<Job[]> {
    const query = db.select().from(jobs).where(eq(jobs.status, 'active'));
    if (companyId) {
      return await query.where(and(eq(jobs.status, 'active'), eq(jobs.companyId, companyId)));
    }
    return await query;
  }

  // Job application operations
  async getJobApplications(jobId?: number): Promise<JobApplication[]> {
    const query = db.select().from(jobApplications);
    if (jobId) {
      return await query.where(eq(jobApplications.jobId, jobId)).orderBy(desc(jobApplications.appliedAt));
    }
    return await query.orderBy(desc(jobApplications.appliedAt));
  }

  async createJobApplication(application: InsertJobApplication): Promise<JobApplication> {
    const [newApplication] = await db.insert(jobApplications).values(application).returning();
    return newApplication;
  }

  async updateJobApplication(id: number, application: Partial<InsertJobApplication>): Promise<JobApplication> {
    const [updatedApplication] = await db
      .update(jobApplications)
      .set({ ...application, updatedAt: new Date() })
      .where(eq(jobApplications.id, id))
      .returning();
    return updatedApplication;
  }

  async deleteJobApplication(id: number): Promise<boolean> {
    const result = await db.delete(jobApplications).where(eq(jobApplications.id, id));
    return result.rowCount > 0;
  }

  async getApplicationsByJob(jobId: number): Promise<JobApplication[]> {
    return await db.select().from(jobApplications).where(eq(jobApplications.jobId, jobId));
  }

  async getApplicationsByStatus(status: string): Promise<JobApplication[]> {
    return await db.select().from(jobApplications).where(eq(jobApplications.status, status));
  }

  // Interview operations
  async getInterviews(applicationId?: number): Promise<Interview[]> {
    const query = db.select().from(interviews);
    if (applicationId) {
      return await query.where(eq(interviews.applicationId, applicationId)).orderBy(desc(interviews.createdAt));
    }
    return await query.orderBy(desc(interviews.createdAt));
  }

  async createInterview(interview: InsertInterview): Promise<Interview> {
    const [newInterview] = await db.insert(interviews).values(interview).returning();
    return newInterview;
  }

  async updateInterview(id: number, interview: Partial<InsertInterview>): Promise<Interview> {
    const [updatedInterview] = await db
      .update(interviews)
      .set({ ...interview, updatedAt: new Date() })
      .where(eq(interviews.id, id))
      .returning();
    return updatedInterview;
  }

  async deleteInterview(id: number): Promise<boolean> {
    const result = await db.delete(interviews).where(eq(interviews.id, id));
    return result.rowCount > 0;
  }

  async getInterviewsByInterviewer(interviewerId: string): Promise<Interview[]> {
    return await db.select().from(interviews).where(eq(interviews.interviewerId, interviewerId));
  }

  // Analytics operations
  async getCompanyAnalytics(companyId: number): Promise<{
    employees: { total: number; active: number; growth: number };
    departments: { total: number; avgSize: number };
    leaves: { pending: number; approved: number; rejected: number };
    payroll: { total: number; average: number };
    performance: { average: number; distribution: any[] };
  }> {
    const employeeStats = await this.getEmployeeStats(companyId);
    const leaveStats = await this.getLeaveStats(companyId);
    const payrollStats = await this.getPayrollStats(companyId);

    return {
      employees: {
        total: employeeStats.totalEmployees,
        active: employeeStats.activeEmployees,
        growth: 12, // Mock growth percentage
      },
      departments: {
        total: employeeStats.departmentDistribution.length,
        avgSize: Math.round(employeeStats.totalEmployees / employeeStats.departmentDistribution.length),
      },
      leaves: {
        pending: leaveStats.pendingLeaves,
        approved: leaveStats.approvedLeaves,
        rejected: leaveStats.rejectedLeaves,
      },
      payroll: {
        total: payrollStats.totalPayroll,
        average: payrollStats.avgSalary,
      },
      performance: {
        average: employeeStats.avgPerformanceScore,
        distribution: [], // Mock distribution
      },
    };
  }

  // Dashboard stats
  async getDashboardStats(companyId?: number): Promise<{
    totalEmployees: number;
    activeLeaves: number;
    monthlyPayroll: string;
    avgPerformance: string;
    pendingApplications: number;
    upcomingTrainings: number;
  }> {
    const employeeStats = await this.getEmployeeStats(companyId);
    const leaveStats = await this.getLeaveStats(companyId);
    const payrollStats = await this.getPayrollStats(companyId);
    const [pendingApps] = await db.select({ count: count() }).from(jobApplications).where(eq(jobApplications.status, 'submitted'));
    const [upcomingTrainings] = await db.select({ count: count() }).from(trainings).where(eq(trainings.status, 'planned'));

    return {
      totalEmployees: employeeStats.totalEmployees,
      activeLeaves: leaveStats.pendingLeaves,
      monthlyPayroll: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(payrollStats.monthlyPayroll),
      avgPerformance: employeeStats.avgPerformanceScore.toFixed(1),
      pendingApplications: pendingApps.count,
      upcomingTrainings: upcomingTrainings.count,
    };
  }

  // System operations
  async getSystemHealth(): Promise<{
    database: boolean;
    uptime: number;
    activeUsers: number;
    systemLoad: number;
  }> {
    const [activeUsersCount] = await db.select({ count: count() }).from(users).where(eq(users.isActive, true));
    
    return {
      database: true,
      uptime: Math.floor(Math.random() * 100000),
      activeUsers: activeUsersCount.count,
      systemLoad: Math.random() * 100,
    };
  }

  async getSystemMetrics(): Promise<{
    cpu: { usage: number; cores: number };
    memory: { used: number; total: number; percentage: number };
    disk: { used: number; total: number; percentage: number };
    network: { inbound: number; outbound: number };
  }> {
    return {
      cpu: { usage: Math.random() * 100, cores: 8 },
      memory: { used: 4096, total: 8192, percentage: 50 },
      disk: { used: 250000, total: 500000, percentage: 50 },
      network: { inbound: Math.random() * 1000, outbound: Math.random() * 1000 },
    };
  }

  async getActiveUsers(): Promise<Array<{
    id: string;
    name: string;
    lastActivity: Date;
    status: string;
  }>> {
    const activeUsers = await db.select().from(users).where(eq(users.isActive, true)).limit(10);
    
    return activeUsers.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      lastActivity: user.lastLoginAt || new Date(),
      status: 'online',
    }));
  }

  async getSystemAlerts(): Promise<Array<{
    id: number;
    type: string;
    message: string;
    severity: string;
    timestamp: Date;
  }>> {
    return [
      {
        id: 1,
        type: 'security',
        message: 'Yüksek CPU kullanımı tespit edildi',
        severity: 'warning',
        timestamp: new Date(),
      },
      {
        id: 2,
        type: 'system',
        message: 'Veritabanı bağlantısı normal',
        severity: 'info',
        timestamp: new Date(),
      },
    ];
  }
}

export const storage = new DatabaseStorage();