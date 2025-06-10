import {
  users,
  employees,
  departments,
  leaves,
  performance,
  payroll,
  activities,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations for authentication
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

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
}

export class DatabaseStorage implements IStorage {
  // User operations for authentication
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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

  // Employee operations
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees);
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
    const [newEmployee] = await db.insert(employees).values({
      ...employee,
      phone: employee.phone || null,
      status: employee.status || "active",
      performanceScore: employee.performanceScore || "0.0",
      profileImage: employee.profileImage || null,
    }).returning();
    
    // Create activity
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
    const [newDepartment] = await db.insert(departments).values({
      ...department,
      description: department.description || null,
      managerId: department.managerId || null,
      budget: department.budget || null,
      employeeCount: department.employeeCount || null,
    }).returning();
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

  async getLeave(id: number): Promise<Leave | undefined> {
    const [leave] = await db.select().from(leaves).where(eq(leaves.id, id));
    return leave || undefined;
  }

  async createLeave(leave: InsertLeave): Promise<Leave> {
    const [newLeave] = await db.insert(leaves).values({
      ...leave,
      status: leave.status || "pending",
      reason: leave.reason || null,
      approvedBy: leave.approvedBy || null,
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

  // Performance operations
  async getPerformanceRecords(): Promise<Performance[]> {
    return await db.select().from(performance);
  }

  async getPerformanceByEmployee(employeeId: number): Promise<Performance[]> {
    return await db.select().from(performance).where(eq(performance.employeeId, employeeId));
  }

  async createPerformance(performanceData: InsertPerformance): Promise<Performance> {
    const [newPerformance] = await db.insert(performance).values({
      ...performanceData,
      goals: performanceData.goals || null,
      achievements: performanceData.achievements || null,
      feedback: performanceData.feedback || null,
      reviewedBy: performanceData.reviewedBy || null,
    }).returning();
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
    const [newPayroll] = await db.insert(payroll).values({
      ...payrollData,
      status: payrollData.status || "pending",
      bonuses: payrollData.bonuses || null,
      deductions: payrollData.deductions || null,
      paymentDate: payrollData.paymentDate || null,
    }).returning();
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
    return await db.select().from(activities)
      .orderBy(desc(activities.timestamp))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values({
      ...activity,
      entityId: activity.entityId || null,
      performedBy: activity.performedBy || null,
    }).returning();
    return newActivity;
  }

  // Dashboard stats
  async getEmployeeStats(): Promise<{
    totalEmployees: number;
    activeLeaves: number;
    monthlyPayroll: string;
    avgPerformance: string;
  }> {
    const allEmployees = await this.getEmployees();
    const allLeaves = await this.getLeaves();
    const activeLeaves = allLeaves.filter(leave => leave.status === "approved").length;
    
    const totalSalary = allEmployees.reduce((sum, emp) => sum + parseFloat(emp.salary), 0);
    const avgPerformance = allEmployees.reduce((sum, emp) => 
      sum + parseFloat(emp.performanceScore || "0"), 0) / (allEmployees.length || 1);

    return {
      totalEmployees: allEmployees.length,
      activeLeaves,
      monthlyPayroll: `₺${(totalSalary / 1000).toFixed(1)}K`,
      avgPerformance: avgPerformance.toFixed(1)
    };
  }
}

export const storage = new DatabaseStorage();