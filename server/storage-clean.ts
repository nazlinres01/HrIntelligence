import {
  users,
  companies,
  employees,
  departments,
  leaves,
  performance,
  payroll,
  activities,
  notifications,
  auditLogs,
  timeEntries,
  expenseReports,
  messages,
  settings,
  type User,
  type UpsertUser,
  type Company,
  type InsertCompany,
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
  type Setting,
  type InsertSetting,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm";

export interface IStorage {
  // User operations for authentication
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, userData: Partial<UpsertUser>): Promise<User>;

  // Company operations
  getCompany(id: number): Promise<Company | undefined>;
  getCompanyByUser(userId: string): Promise<Company | undefined>;
  getAllCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company>;

  // Employee operations
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeByEmail(email: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee>;
  deleteEmployee(id: number): Promise<boolean>;

  // Department operations
  getDepartments(): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department>;

  // Leave operations
  getLeaves(): Promise<Leave[]>;
  getLeavesByEmployee(employeeId: number): Promise<Leave[]>;
  getLeave(id: number): Promise<Leave | undefined>;
  createLeave(leave: InsertLeave): Promise<Leave>;
  updateLeave(id: number, leave: Partial<InsertLeave>): Promise<Leave>;
  deleteLeave(id: number): Promise<boolean>;

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
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
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

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Company operations
  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async getCompanyByUser(userId: string): Promise<Company | undefined> {
    const user = await this.getUser(userId);
    if (!user?.companyId) return undefined;
    return this.getCompany(user.companyId);
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

  async getAllCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  // Employee operations
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees);
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
    return (result.rowCount ?? 0) > 0;
  }

  // Department operations
  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments);
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

  // Leave operations
  async getLeaves(): Promise<Leave[]> {
    return await db.select().from(leaves).orderBy(desc(leaves.createdAt));
  }

  async getLeavesByEmployee(employeeId: number): Promise<Leave[]> {
    return await db.select().from(leaves).where(eq(leaves.employeeId, employeeId));
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
      .set({ ...leave, updatedAt: new Date() })
      .where(eq(leaves.id, id))
      .returning();
    return updatedLeave;
  }

  async deleteLeave(id: number): Promise<boolean> {
    const result = await db.delete(leaves).where(eq(leaves.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Performance operations
  async getPerformanceRecords(): Promise<Performance[]> {
    return await db.select().from(performance).orderBy(desc(performance.reviewDate));
  }

  async getPerformanceByEmployee(employeeId: number): Promise<Performance[]> {
    return await db.select().from(performance).where(eq(performance.employeeId, employeeId));
  }

  async createPerformance(performanceData: InsertPerformance): Promise<Performance> {
    const [newPerformance] = await db.insert(performance).values(performanceData).returning();
    return newPerformance;
  }

  async updatePerformance(id: number, performanceData: Partial<InsertPerformance>): Promise<Performance> {
    const [updatedPerformance] = await db
      .update(performance)
      .set({ ...performanceData, updatedAt: new Date() })
      .where(eq(performance.id, id))
      .returning();
    return updatedPerformance;
  }

  // Payroll operations
  async getPayrollRecords(): Promise<Payroll[]> {
    return await db.select().from(payroll).orderBy(desc(payroll.payDate));
  }

  async getPayrollByEmployee(employeeId: number): Promise<Payroll[]> {
    return await db.select().from(payroll).where(eq(payroll.employeeId, employeeId));
  }

  async createPayroll(payrollData: InsertPayroll): Promise<Payroll> {
    const [newPayroll] = await db.insert(payroll).values(payrollData).returning();
    return newPayroll;
  }

  async updatePayroll(id: number, payrollData: Partial<InsertPayroll>): Promise<Payroll> {
    const [updatedPayroll] = await db
      .update(payroll)
      .set({ ...payrollData, updatedAt: new Date() })
      .where(eq(payroll.id, id))
      .returning();
    return updatedPayroll;
  }

  // Activity operations
  async getActivities(limit: number = 10): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(desc(activities.timestamp)).limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  // Dashboard stats
  async getEmployeeStats(): Promise<{
    totalEmployees: number;
    activeLeaves: number;
    monthlyPayroll: string;
    avgPerformance: string;
  }> {
    // Return mock data for now since we have basic endpoints working
    return {
      totalEmployees: 1247,
      activeLeaves: 23,
      monthlyPayroll: "₺2,500,000",
      avgPerformance: "4.2",
    };
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
    return (result.rowCount ?? 0) > 0;
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
    const result = await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return result.length;
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
    return (result.rowCount ?? 0) > 0;
  }

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    const result = await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.userId, userId));
    return (result.rowCount ?? 0) > 0;
  }

  async deleteNotification(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(notifications)
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Audit log operations
  async createAuditLog(logData: InsertAuditLog): Promise<AuditLog> {
    const [log] = await db.insert(auditLogs).values(logData).returning();
    return log;
  }

  async getAuditLogs(limit: number = 100, companyId?: number): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(limit);
    return await query;
  }

  async getUserAuditLogs(userId: string, limit: number = 50): Promise<AuditLog[]> {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, userId))
      .orderBy(desc(auditLogs.timestamp))
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
      .orderBy(desc(timeEntries.date))
      .limit(limit);
  }

  async getPendingTimeEntries(limit: number = 50): Promise<TimeEntry[]> {
    return await db
      .select()
      .from(timeEntries)
      .where(eq(timeEntries.status, 'pending'))
      .orderBy(desc(timeEntries.date))
      .limit(limit);
  }

  async approveTimeEntry(id: number, approvedBy: string): Promise<boolean> {
    const result = await db
      .update(timeEntries)
      .set({ status: 'approved', approvedBy, approvedAt: new Date() })
      .where(eq(timeEntries.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async rejectTimeEntry(id: number, approvedBy: string): Promise<boolean> {
    const result = await db
      .update(timeEntries)
      .set({ status: 'rejected', approvedBy, approvedAt: new Date() })
      .where(eq(timeEntries.id, id));
    return (result.rowCount ?? 0) > 0;
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
      .orderBy(desc(expenseReports.submittedAt))
      .limit(limit);
  }

  async getPendingExpenseReports(limit: number = 50): Promise<ExpenseReport[]> {
    return await db
      .select()
      .from(expenseReports)
      .where(eq(expenseReports.status, 'pending'))
      .orderBy(desc(expenseReports.submittedAt))
      .limit(limit);
  }

  async approveExpenseReport(id: number, approvedBy: string): Promise<boolean> {
    const result = await db
      .update(expenseReports)
      .set({ status: 'approved', approvedBy, approvedAt: new Date() })
      .where(eq(expenseReports.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async rejectExpenseReport(id: number, approvedBy: string): Promise<boolean> {
    const result = await db
      .update(expenseReports)
      .set({ status: 'rejected', approvedBy, approvedAt: new Date() })
      .where(eq(expenseReports.id, id));
    return (result.rowCount ?? 0) > 0;
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
      .where(or(eq(messages.senderId, userId), eq(messages.recipientId, userId)))
      .orderBy(desc(messages.sentAt))
      .limit(limit);
  }

  async markMessageAsRead(id: number, userId: string): Promise<boolean> {
    const result = await db
      .update(messages)
      .set({ isRead: true, readAt: new Date() })
      .where(and(eq(messages.id, id), eq(messages.recipientId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  async deleteMessage(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(messages)
      .where(and(eq(messages.id, id), or(eq(messages.senderId, userId), eq(messages.recipientId, userId))));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();