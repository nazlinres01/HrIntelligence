import {
  users,
  companies,
  employees,
  departments,
  leaves,
  performance,
  payroll,
  notifications,
  activities,
  auditLogs,
  jobs,
  jobApplications,
  trainings,
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
  type Notification,
  type InsertNotification,
  type Activity,
  type InsertActivity,
  type AuditLog,
  type InsertAuditLog,
  type Job,
  type InsertJob,
  type JobApplication,
  type InsertJobApplication,
  type Training,
  type InsertTraining,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, userData: Partial<UpsertUser>): Promise<User>;

  // Company operations
  getAllCompanies(): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(companyData: InsertCompany): Promise<Company>;
  updateCompany(id: number, companyData: Partial<InsertCompany>): Promise<Company>;
  deleteCompany(id: number): Promise<boolean>;

  // Employee operations
  getEmployees(companyId?: number): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee>;
  deleteEmployee(id: number): Promise<boolean>;

  // Department operations
  getDepartments(companyId?: number): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department>;
  deleteDepartment(id: number): Promise<boolean>;

  // Leave operations
  getLeaves(companyId?: number): Promise<Leave[]>;
  getLeavesByEmployee(employeeId: number): Promise<Leave[]>;
  createLeave(leave: InsertLeave): Promise<Leave>;
  updateLeave(id: number, leave: Partial<InsertLeave>): Promise<Leave>;
  approveLeave(id: number, approvedBy: number): Promise<Leave>;
  rejectLeave(id: number, approvedBy: number): Promise<Leave>;

  // Performance operations
  getPerformanceRecords(companyId?: number): Promise<Performance[]>;
  getPerformanceByEmployee(employeeId: number): Promise<Performance[]>;
  createPerformance(performanceData: InsertPerformance): Promise<Performance>;
  updatePerformance(id: number, performanceData: Partial<InsertPerformance>): Promise<Performance>;

  // Payroll operations
  getPayrollRecords(companyId?: number): Promise<Payroll[]>;
  getPayrollByEmployee(employeeId: number): Promise<Payroll[]>;
  createPayroll(payrollData: InsertPayroll): Promise<Payroll>;
  updatePayroll(id: number, payrollData: Partial<InsertPayroll>): Promise<Payroll>;

  // Job operations
  getJobs(companyId?: number): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job>;
  deleteJob(id: number): Promise<boolean>;

  // Job application operations
  getJobApplications(jobId?: number): Promise<JobApplication[]>;
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  updateJobApplication(id: number, application: Partial<InsertJobApplication>): Promise<JobApplication>;

  // Training operations
  getTrainingPrograms(companyId?: number): Promise<Training[]>;
  createTrainingProgram(training: InsertTraining): Promise<Training>;
  updateTrainingProgram(id: number, training: Partial<InsertTraining>): Promise<Training>;
  deleteTrainingProgram(id: number): Promise<boolean>;

  // Notification operations
  getUserNotifications(userId: string, limit?: number): Promise<Notification[]>;
  getUnreadNotificationCount(userId: string): Promise<number>;
  createNotification(notificationData: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number, userId: string): Promise<boolean>;
  markAllNotificationsAsRead(userId: string): Promise<boolean>;

  // Analytics operations
  getDashboardStats(companyId?: number): Promise<any>;
  getEmployeeStats(companyId?: number): Promise<any>;
  getCompanyStats(): Promise<any>;
  getLeaveStats(companyId?: number): Promise<any>;
  getPayrollStats(companyId?: number): Promise<any>;
  getSystemHealth(): Promise<any>;
  getSystemMetrics(): Promise<any>;
  getActiveUsers(): Promise<any[]>;
  getSystemAlerts(): Promise<any[]>;

  // Audit operations
  createAuditLog(logData: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(limit?: number, companyId?: number): Promise<AuditLog[]>;

  // Activity operations
  getActivities(limit?: number, companyId?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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

  // Company operations
  async getAllCompanies(): Promise<Company[]> {
    return await db.select().from(companies).orderBy(desc(companies.createdAt));
  }

  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
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
    return (result.rowCount || 0) > 0;
  }

  // Employee operations
  async getEmployees(companyId?: number): Promise<Employee[]> {
    if (companyId) {
      return await db.select().from(employees).where(eq(employees.companyId, companyId));
    }
    return await db.select().from(employees).orderBy(desc(employees.createdAt));
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
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
    return (result.rowCount || 0) > 0;
  }

  // Department operations
  async getDepartments(companyId?: number): Promise<Department[]> {
    if (companyId) {
      return await db.select().from(departments).where(eq(departments.companyId, companyId));
    }
    return await db.select().from(departments).orderBy(desc(departments.createdAt));
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
    return (result.rowCount || 0) > 0;
  }

  // Leave operations
  async getLeaves(companyId?: number): Promise<Leave[]> {
    if (companyId) {
      return await db.select().from(leaves).where(eq(leaves.companyId, companyId));
    }
    return await db.select().from(leaves).orderBy(desc(leaves.appliedAt));
  }

  async getLeavesByEmployee(employeeId: number): Promise<Leave[]> {
    return await db.select().from(leaves).where(eq(leaves.employeeId, employeeId));
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

  async approveLeave(id: number, approvedBy: number): Promise<Leave> {
    const [updatedLeave] = await db
      .update(leaves)
      .set({ status: 'approved', approvedBy })
      .where(eq(leaves.id, id))
      .returning();
    return updatedLeave;
  }

  async rejectLeave(id: number, approvedBy: number): Promise<Leave> {
    const [updatedLeave] = await db
      .update(leaves)
      .set({ status: 'rejected', approvedBy })
      .where(eq(leaves.id, id))
      .returning();
    return updatedLeave;
  }

  // Performance operations
  async getPerformanceRecords(companyId?: number): Promise<Performance[]> {
    if (companyId) {
      return await db.select().from(performance).where(eq(performance.companyId, companyId));
    }
    return await db.select().from(performance).orderBy(desc(performance.reviewDate));
  }

  async getPerformanceByEmployee(employeeId: number): Promise<Performance[]> {
    return await db.select().from(performance).where(eq(performance.employeeId, employeeId));
  }

  async createPerformance(performanceData: InsertPerformance): Promise<Performance> {
    const [perf] = await db.insert(performance).values(performanceData).returning();
    return perf;
  }

  async updatePerformance(id: number, performanceData: Partial<InsertPerformance>): Promise<Performance> {
    const [perf] = await db
      .update(performance)
      .set(performanceData)
      .where(eq(performance.id, id))
      .returning();
    return perf;
  }

  // Payroll operations
  async getPayrollRecords(companyId?: number): Promise<Payroll[]> {
    if (companyId) {
      return await db.select().from(payroll).where(eq(payroll.companyId, companyId));
    }
    return await db.select().from(payroll).orderBy(desc(payroll.month));
  }

  async getPayrollByEmployee(employeeId: number): Promise<Payroll[]> {
    return await db.select().from(payroll).where(eq(payroll.employeeId, employeeId));
  }

  async createPayroll(payrollData: InsertPayroll): Promise<Payroll> {
    const [pay] = await db.insert(payroll).values(payrollData).returning();
    return pay;
  }

  async updatePayroll(id: number, payrollData: Partial<InsertPayroll>): Promise<Payroll> {
    const [pay] = await db
      .update(payroll)
      .set(payrollData)
      .where(eq(payroll.id, id))
      .returning();
    return pay;
  }

  // Job operations
  async getJobs(companyId?: number): Promise<Job[]> {
    if (companyId) {
      return await db.select().from(jobs).where(eq(jobs.companyId, companyId));
    }
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
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
    return (result.rowCount || 0) > 0;
  }

  // Job application operations
  async getJobApplications(jobId?: number): Promise<JobApplication[]> {
    if (jobId) {
      return await db.select().from(jobApplications).where(eq(jobApplications.jobId, jobId));
    }
    return await db.select().from(jobApplications).orderBy(desc(jobApplications.appliedAt));
  }

  async createJobApplication(application: InsertJobApplication): Promise<JobApplication> {
    const [newApp] = await db.insert(jobApplications).values(application).returning();
    return newApp;
  }

  async updateJobApplication(id: number, application: Partial<InsertJobApplication>): Promise<JobApplication> {
    const [updatedApp] = await db
      .update(jobApplications)
      .set({ ...application, updatedAt: new Date() })
      .where(eq(jobApplications.id, id))
      .returning();
    return updatedApp;
  }

  // Training operations
  async getTrainingPrograms(companyId?: number): Promise<Training[]> {
    if (companyId) {
      return await db.select().from(trainings).where(eq(trainings.companyId, companyId));
    }
    return await db.select().from(trainings).orderBy(desc(trainings.createdAt));
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
    return (result.rowCount || 0) > 0;
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
    const [result] = await db.select({ count: count() }).from(notifications)
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
    return (result.rowCount || 0) > 0;
  }

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    const result = await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.userId, userId));
    return (result.rowCount || 0) > 0;
  }

  // Analytics and statistics
  async getDashboardStats(companyId?: number): Promise<any> {
    const [employeeCount] = await db.select({ count: count() }).from(employees);
    const [leaveCount] = await db.select({ count: count() }).from(leaves).where(eq(leaves.status, 'pending'));
    
    return {
      totalEmployees: employeeCount.count,
      activeLeaves: leaveCount.count,
      monthlyPayroll: "₺2,500,000",
      avgPerformance: "4.2",
      totalCompanies: 85,
      newEmployeesThisMonth: 23,
      performanceScore: 87.5,
      totalRevenue: "₺15,250,000",
    };
  }

  async getEmployeeStats(companyId?: number): Promise<any> {
    const [totalCount] = await db.select({ count: count() }).from(employees);
    const [activeCount] = await db.select({ count: count() }).from(employees).where(eq(employees.status, 'active'));
    
    return {
      total: totalCount.count,
      active: activeCount.count,
      inactive: totalCount.count - activeCount.count,
      newThisMonth: 23,
      avgAge: 32,
      avgTenure: 2.8,
    };
  }

  async getCompanyStats(): Promise<any> {
    const [totalCount] = await db.select({ count: count() }).from(companies);
    const [activeCount] = await db.select({ count: count() }).from(companies).where(eq(companies.isActive, true));
    
    return {
      total: totalCount.count,
      active: activeCount.count,
      inactive: totalCount.count - activeCount.count,
      growth: 12.5,
      avgEmployees: 45,
      totalRevenue: "₺125,000,000",
    };
  }

  async getLeaveStats(companyId?: number): Promise<any> {
    const [totalCount] = await db.select({ count: count() }).from(leaves);
    const [pendingCount] = await db.select({ count: count() }).from(leaves).where(eq(leaves.status, 'pending'));
    const [approvedCount] = await db.select({ count: count() }).from(leaves).where(eq(leaves.status, 'approved'));
    
    return {
      total: totalCount.count,
      pending: pendingCount.count,
      approved: approvedCount.count,
      rejected: totalCount.count - pendingCount.count - approvedCount.count,
      avgDuration: 5.2,
      mostCommonType: "Yıllık İzin",
    };
  }

  async getPayrollStats(companyId?: number): Promise<any> {
    return {
      totalAmount: "₺2,500,000",
      averageSalary: "₺8,500",
      processedThisMonth: 295,
      pendingPayments: 12,
      totalBenefits: "₺450,000",
      taxDeductions: "₺680,000",
    };
  }

  async getSystemHealth(): Promise<any> {
    return {
      database: true,
      uptime: 99.8,
      activeUsers: 147,
      systemLoad: 34.2,
      memoryUsage: 68.5,
      diskUsage: 42.1,
      responseTime: 245,
    };
  }

  async getSystemMetrics(): Promise<any> {
    return {
      cpu: 34.2,
      memory: 68.5,
      disk: 42.1,
      network: {
        inbound: 450,
        outbound: 320,
      },
      activeConnections: 147,
      requestsPerMinute: 1250,
    };
  }

  async getActiveUsers(): Promise<any[]> {
    const activeUsers = await db.select().from(users).where(eq(users.isActive, true)).limit(10);
    return activeUsers.map(user => ({
      id: user.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      lastActive: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      role: 'Çalışan',
    }));
  }

  async getSystemAlerts(): Promise<any[]> {
    return [
      {
        id: 1,
        type: 'warning',
        message: 'Yüksek CPU kullanımı tespit edildi',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        severity: 'medium',
      },
      {
        id: 2,
        type: 'info',
        message: 'Sistem güncellemesi mevcut',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        severity: 'low',
      },
      {
        id: 3,
        type: 'error',
        message: 'Veritabanı bağlantı hatası (düzeltildi)',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        severity: 'high',
      },
    ];
  }

  // Audit log operations
  async createAuditLog(logData: InsertAuditLog): Promise<AuditLog> {
    const [log] = await db.insert(auditLogs).values(logData).returning();
    return log;
  }

  async getAuditLogs(limit: number = 100, companyId?: number): Promise<AuditLog[]> {
    if (companyId) {
      return await db.select().from(auditLogs)
        .where(eq(auditLogs.companyId, companyId))
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit);
    }
    return await db.select().from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  // Activity operations
  async getActivities(limit: number = 50, companyId?: number): Promise<Activity[]> {
    if (companyId) {
      return await db.select().from(activities)
        .where(eq(activities.companyId, companyId))
        .orderBy(desc(activities.timestamp))
        .limit(limit);
    }
    return await db.select().from(activities)
      .orderBy(desc(activities.timestamp))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }
}

export const storage = new DatabaseStorage();