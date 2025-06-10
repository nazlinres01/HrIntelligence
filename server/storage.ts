import {
  employees,
  departments,
  leaves,
  performance,
  payroll,
  activities,
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

export interface IStorage {
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

export class MemStorage implements IStorage {
  private employees: Map<number, Employee> = new Map();
  private departments: Map<number, Department> = new Map();
  private leaves: Map<number, Leave> = new Map();
  private performance: Map<number, Performance> = new Map();
  private payroll: Map<number, Payroll> = new Map();
  private activities: Map<number, Activity> = new Map();
  private currentId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed initial data to match the design
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Create employees
    const sampleEmployees: InsertEmployee[] = [
      {
        firstName: "Can",
        lastName: "Yılmaz",
        email: "can.yilmaz@sirket.com",
        phone: "+90 555 123 4567",
        department: "Yazılım",
        position: "Senior Developer",
        startDate: "2021-03-15",
        salary: "15000.00",
        status: "active",
        performanceScore: "8.5",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
      },
      {
        firstName: "Elif",
        lastName: "Kara",
        email: "elif.kara@sirket.com",
        phone: "+90 555 234 5678",
        department: "İnsan Kaynakları",
        position: "İK Uzmanı",
        startDate: "2020-08-22",
        salary: "12000.00",
        status: "on_leave",
        performanceScore: "9.2",
        profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
      },
      {
        firstName: "Okan",
        lastName: "Şahin",
        email: "okan.sahin@sirket.com",
        phone: "+90 555 345 6789",
        department: "Pazarlama",
        position: "Pazarlama Müdürü",
        startDate: "2019-01-10",
        salary: "18000.00",
        status: "active",
        performanceScore: "7.8",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
      }
    ];

    sampleEmployees.forEach(emp => this.createEmployee(emp));

    // Create departments
    const sampleDepartments: InsertDepartment[] = [
      { name: "Yazılım", description: "Software Development", employeeCount: 25 },
      { name: "İnsan Kaynakları", description: "Human Resources", employeeCount: 8 },
      { name: "Pazarlama", description: "Marketing", employeeCount: 12 },
      { name: "Satış", description: "Sales", employeeCount: 20 },
      { name: "Muhasebe", description: "Accounting", employeeCount: 6 }
    ];

    sampleDepartments.forEach(dept => this.createDepartment(dept));

    // Create sample leaves
    const sampleLeaves: InsertLeave[] = [
      {
        employeeId: 2,
        leaveType: "annual",
        startDate: "2024-11-15",
        endDate: "2024-11-19",
        days: 5,
        status: "approved",
        reason: "Yıllık izin"
      }
    ];

    sampleLeaves.forEach(leave => this.createLeave(leave));

    // Create activities
    const sampleActivities: InsertActivity[] = [
      {
        type: "employee_added",
        description: "Yeni çalışan eklendi",
        entityId: 1,
        performedBy: 1
      },
      {
        type: "leave_approved",
        description: "İzin talebi onaylandı",
        entityId: 1,
        performedBy: 1
      }
    ];

    sampleActivities.forEach(activity => this.createActivity(activity));
  }

  // Employee operations
  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeeByEmail(email: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(emp => emp.email === email);
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const id = this.currentId++;
    const now = new Date();
    const newEmployee: Employee = {
      ...employee,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.employees.set(id, newEmployee);
    
    // Create activity
    await this.createActivity({
      type: "employee_added",
      description: `${employee.firstName} ${employee.lastName} eklendi`,
      entityId: id,
      performedBy: 1
    });
    
    return newEmployee;
  }

  async updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee> {
    const existing = this.employees.get(id);
    if (!existing) throw new Error("Employee not found");
    
    const updated: Employee = {
      ...existing,
      ...employee,
      updatedAt: new Date(),
    };
    this.employees.set(id, updated);
    return updated;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    return this.employees.delete(id);
  }

  // Department operations
  async getDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }

  async getDepartment(id: number): Promise<Department | undefined> {
    return this.departments.get(id);
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const id = this.currentId++;
    const newDepartment: Department = { ...department, id };
    this.departments.set(id, newDepartment);
    return newDepartment;
  }

  async updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department> {
    const existing = this.departments.get(id);
    if (!existing) throw new Error("Department not found");
    
    const updated: Department = { ...existing, ...department };
    this.departments.set(id, updated);
    return updated;
  }

  // Leave operations
  async getLeaves(): Promise<Leave[]> {
    return Array.from(this.leaves.values());
  }

  async getLeavesByEmployee(employeeId: number): Promise<Leave[]> {
    return Array.from(this.leaves.values()).filter(leave => leave.employeeId === employeeId);
  }

  async getLeave(id: number): Promise<Leave | undefined> {
    return this.leaves.get(id);
  }

  async createLeave(leave: InsertLeave): Promise<Leave> {
    const id = this.currentId++;
    const newLeave: Leave = {
      ...leave,
      id,
      appliedAt: new Date(),
    };
    this.leaves.set(id, newLeave);
    return newLeave;
  }

  async updateLeave(id: number, leave: Partial<InsertLeave>): Promise<Leave> {
    const existing = this.leaves.get(id);
    if (!existing) throw new Error("Leave not found");
    
    const updated: Leave = { ...existing, ...leave };
    this.leaves.set(id, updated);
    return updated;
  }

  // Performance operations
  async getPerformanceRecords(): Promise<Performance[]> {
    return Array.from(this.performance.values());
  }

  async getPerformanceByEmployee(employeeId: number): Promise<Performance[]> {
    return Array.from(this.performance.values()).filter(perf => perf.employeeId === employeeId);
  }

  async createPerformance(performance: InsertPerformance): Promise<Performance> {
    const id = this.currentId++;
    const newPerformance: Performance = {
      ...performance,
      id,
      reviewDate: new Date(),
    };
    this.performance.set(id, newPerformance);
    return newPerformance;
  }

  async updatePerformance(id: number, performance: Partial<InsertPerformance>): Promise<Performance> {
    const existing = this.performance.get(id);
    if (!existing) throw new Error("Performance record not found");
    
    const updated: Performance = { ...existing, ...performance };
    this.performance.set(id, updated);
    return updated;
  }

  // Payroll operations
  async getPayrollRecords(): Promise<Payroll[]> {
    return Array.from(this.payroll.values());
  }

  async getPayrollByEmployee(employeeId: number): Promise<Payroll[]> {
    return Array.from(this.payroll.values()).filter(payroll => payroll.employeeId === employeeId);
  }

  async createPayroll(payroll: InsertPayroll): Promise<Payroll> {
    const id = this.currentId++;
    const newPayroll: Payroll = { ...payroll, id };
    this.payroll.set(id, newPayroll);
    return newPayroll;
  }

  async updatePayroll(id: number, payroll: Partial<InsertPayroll>): Promise<Payroll> {
    const existing = this.payroll.get(id);
    if (!existing) throw new Error("Payroll record not found");
    
    const updated: Payroll = { ...existing, ...payroll };
    this.payroll.set(id, updated);
    return updated;
  }

  // Activity operations
  async getActivities(limit: number = 10): Promise<Activity[]> {
    const activities = Array.from(this.activities.values())
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime());
    return activities.slice(0, limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const newActivity: Activity = {
      ...activity,
      id,
      timestamp: new Date(),
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Dashboard stats
  async getEmployeeStats(): Promise<{
    totalEmployees: number;
    activeLeaves: number;
    monthlyPayroll: string;
    avgPerformance: string;
  }> {
    const employees = await this.getEmployees();
    const leaves = await this.getLeaves();
    const activeLeaves = leaves.filter(leave => leave.status === "approved").length;
    
    const totalSalary = employees.reduce((sum, emp) => sum + parseFloat(emp.salary), 0);
    const avgPerformance = employees.reduce((sum, emp) => 
      sum + parseFloat(emp.performanceScore || "0"), 0) / employees.length;

    return {
      totalEmployees: employees.length,
      activeLeaves,
      monthlyPayroll: `₺${(totalSalary / 1000).toFixed(1)}K`,
      avgPerformance: avgPerformance.toFixed(1)
    };
  }
}

export const storage = new MemStorage();
