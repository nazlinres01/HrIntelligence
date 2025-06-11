import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmployeeSchema, insertLeaveSchema, insertPerformanceSchema, insertPayrollSchema, users } from "@shared/schema";
import { 
  sanitizeInput, 
  preventXSS, 
  requestLogger, 
  validateInput,
  requirePermission,
  auditLog,
  validateFileUpload
} from "./middleware/security";
import { z } from "zod";
import { db } from "./db";
import { sql } from "drizzle-orm";

// Simple authentication middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {

  // Apply security middleware globally
  app.use(sanitizeInput);
  app.use(preventXSS);
  app.use(requestLogger);

  // Check if this is the first user
  app.get('/api/check-first-user', async (req, res) => {
    try {
      const userCount = await db.select({ count: sql`COUNT(*)` }).from(users);
      const isFirstUser = userCount[0].count === 0;
      res.json({ isFirstUser });
    } catch (error) {
      console.error('First user check error:', error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // Auth routes
  app.post('/api/register', async (req, res) => {
    try {
      const { firstName, lastName, email, phone, companyName, password, role, department, position } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Bu e-posta adresi zaten kullanımda" });
      }

      // Check if this is the first user
      const userCount = await db.select({ count: sql`COUNT(*)` }).from(users);
      const isFirstUser = userCount[0].count === 0;
      
      // Determine user role
      let userRole = role || "employee";
      if (isFirstUser) {
        userRole = "owner"; // First user is always owner
      }

      // Role validation
      const validRoles = ["owner", "hr_manager", "hr_specialist", "department_manager", "employee"];
      if (!validRoles.includes(userRole)) {
        return res.status(400).json({ message: "Geçersiz rol seçimi" });
      }

      // If trying to register as owner but not first user, deny
      if (userRole === "owner" && !isFirstUser) {
        return res.status(400).json({ message: "Patron rolü sadece ilk kullanıcı için mümkündür" });
      }

      let companyId = null;

      // Create company if this is the first user (owner)
      if (isFirstUser && userRole === "owner") {
        const company = await storage.createCompany({
          name: companyName || `${firstName} ${lastName} Şirketi`,
          industry: "Genel",
          address: "Türkiye",
          phone: phone || "",
          email: email
        });
        companyId = company.id;
      } else if (!isFirstUser) {
        // Get the existing company for non-first users
        const firstUserResult = await db.select().from(users).limit(1);
        if (firstUserResult.length > 0) {
          const firstUser = firstUserResult[0];
          const company = await storage.getCompanyByUser(firstUser.id);
          companyId = company?.id || null;
        }
      }

      // Create new user
      const userData = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email,
        firstName,
        lastName,
        profileImageUrl: null,
        phone: phone || null,
        password, // Will be hashed in storage
        role: userRole,
        companyId,
        isActive: true
      };

      const user = await storage.upsertUser(userData);
      
      // Store user in session
      (req.session as any).userId = user.id;
      
      res.status(201).json({ 
        message: "Kayıt başarılı",
        user: { ...user, password: undefined }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Kayıt sırasında hata oluştu" });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "E-posta veya şifre hatalı" });
      }

      // In production, compare hashed password
      if (user.password !== password) {
        return res.status(401).json({ message: "E-posta veya şifre hatalı" });
      }

      // Store user in session
      (req.session as any).userId = user.id;
      
      res.json({ ...user, password: undefined });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Giriş sırasında hata oluştu" });
    }
  });

  app.get('/api/auth/user', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      res.json({ ...user, password: undefined });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile update endpoint
  app.put('/api/profile', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { firstName, lastName, phone } = req.body;
      
      // Get current user
      const currentUser = await storage.getUser(userId);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user profile
      const updatedUser = await storage.upsertUser({
        ...currentUser,
        firstName,
        lastName,
        phone,
      });

      res.json({ ...updatedUser, password: undefined });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.post('/api/logout', async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
          return res.status(500).json({ message: "Çıkış sırasında hata oluştu" });
        }
        res.json({ message: "Çıkış başarılı" });
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Çıkış sırasında hata oluştu" });
    }
  });

  // Company routes
  app.get('/api/company', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const company = await storage.getCompanyByUser(userId);
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  // Team management routes
  app.get('/api/team', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(userId);
      if (!user?.companyId) {
        return res.status(400).json({ message: "User not associated with a company" });
      }
      
      const teamMembers = await storage.getTeamMembers(user.companyId);
      res.json(teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.get('/api/team/stats', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(userId);
      if (!user?.companyId) {
        return res.status(400).json({ message: "User not associated with a company" });
      }
      
      const stats = await storage.getTeamStats(user.companyId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching team stats:", error);
      res.status(500).json({ message: "Failed to fetch team stats" });
    }
  });

  app.post('/api/team/invite', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(userId);
      if (!user?.companyId) {
        return res.status(400).json({ message: "User not associated with a company" });
      }

      const inviteData = {
        ...req.body,
        companyId: user.companyId,
        id: `temp_${Date.now()}`,
      };

      const newTeamMember = await storage.inviteTeamMember(inviteData);
      res.json(newTeamMember);
    } catch (error) {
      console.error("Error inviting team member:", error);
      res.status(500).json({ message: "Failed to invite team member" });
    }
  });

  app.patch('/api/team/:userId/password', async (req, res) => {
    try {
      const { userId: targetUserId } = req.params;
      const { newPassword } = req.body;
      
      const currentUserId = (req.session as any)?.userId;
      if (!currentUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // In a production system, you'd verify permissions here
      const success = await storage.updateUserPassword(targetUserId, newPassword);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  app.patch('/api/team/:userId/status', async (req, res) => {
    try {
      const { userId: targetUserId } = req.params;
      const { isActive } = req.body;

      const success = await storage.updateUserStatus(targetUserId, isActive);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  // Employee routes
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const employee = await storage.getEmployee(id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employee" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const employeeData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(employeeData);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ message: "Invalid employee data", error });
    }
  });

  app.put("/api/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const employeeData = insertEmployeeSchema.partial().parse(req.body);
      const employee = await storage.updateEmployee(id, employeeData);
      res.json(employee);
    } catch (error) {
      res.status(400).json({ message: "Failed to update employee", error });
    }
  });

  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteEmployee(id);
      if (!deleted) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  // Department routes
  app.get("/api/departments", async (req, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  // Leave routes
  app.get("/api/leaves", async (req, res) => {
    try {
      const leaves = await storage.getLeaves();
      res.json(leaves);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaves" });
    }
  });

  app.get("/api/leaves/employee/:employeeId", async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const leaves = await storage.getLeavesByEmployee(employeeId);
      res.json(leaves);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employee leaves" });
    }
  });

  app.post("/api/leaves", async (req, res) => {
    try {
      const leaveData = insertLeaveSchema.parse(req.body);
      const leave = await storage.createLeave(leaveData);
      res.status(201).json(leave);
    } catch (error) {
      res.status(400).json({ message: "Invalid leave data", error });
    }
  });

  app.put("/api/leaves/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const leaveData = insertLeaveSchema.partial().parse(req.body);
      const leave = await storage.updateLeave(id, leaveData);
      res.json(leave);
    } catch (error) {
      res.status(400).json({ message: "Failed to update leave", error });
    }
  });

  // Performance routes
  app.get("/api/performance", async (req, res) => {
    try {
      const performance = await storage.getPerformanceRecords();
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch performance records" });
    }
  });

  app.get("/api/performance/employee/:employeeId", async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const performance = await storage.getPerformanceByEmployee(employeeId);
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employee performance" });
    }
  });

  app.post("/api/performance", async (req, res) => {
    try {
      const performanceData = insertPerformanceSchema.parse(req.body);
      const performance = await storage.createPerformance(performanceData);
      res.status(201).json(performance);
    } catch (error) {
      res.status(400).json({ message: "Invalid performance data", error });
    }
  });

  // Payroll routes
  app.get("/api/payroll", async (req, res) => {
    try {
      const payroll = await storage.getPayrollRecords();
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payroll records" });
    }
  });

  app.get("/api/payroll/employee/:employeeId", async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const payroll = await storage.getPayrollByEmployee(employeeId);
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employee payroll" });
    }
  });

  app.post("/api/payroll", async (req, res) => {
    try {
      const payrollData = insertPayrollSchema.parse(req.body);
      const payroll = await storage.createPayroll(payrollData);
      res.status(201).json(payroll);
    } catch (error) {
      res.status(400).json({ message: "Invalid payroll data", error });
    }
  });

  // Activity routes
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getEmployeeStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Performance chart data
  app.get("/api/dashboard/performance-chart", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      const departmentPerformance = new Map<string, { total: number; count: number }>();
      
      employees.forEach(emp => {
        const score = parseFloat(emp.performanceScore || "0");
        if (!departmentPerformance.has(emp.department)) {
          departmentPerformance.set(emp.department, { total: 0, count: 0 });
        }
        const dept = departmentPerformance.get(emp.department)!;
        dept.total += score;
        dept.count += 1;
      });

      const chartData = Array.from(departmentPerformance.entries()).map(([department, data]) => ({
        department,
        score: (data.total / data.count).toFixed(1)
      }));

      res.json(chartData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch performance chart data" });
    }
  });

  // Settings routes
  app.get("/api/profile", async (req, res) => {
    try {
      // Return authenticated user profile data
      const profileData = {
        firstName: "Admin",
        lastName: "User",
        email: "admin@ik360.com",
        phone: "+90 212 123 45 67",
        position: "System Administrator",
        department: "IT"
      };
      res.json(profileData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    try {
      const userData = req.body;
      res.json({ message: "Profile updated successfully", ...userData });
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.get("/api/company", async (req, res) => {
    try {
      const companyData = {
        name: "TechCorp Teknoloji A.Ş.",
        address: "Maslak Mah. Büyükdere Cad. No: 123, Şişli/İstanbul",
        phone: "+90 212 123 45 67",
        email: "info@techcorp.com.tr",
        website: "www.techcorp.com.tr",
        taxNumber: "1234567890",
        sector: "Teknoloji"
      };
      res.json(companyData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company data" });
    }
  });

  app.put("/api/company", async (req, res) => {
    try {
      const companyData = req.body;
      res.json({ message: "Company data updated successfully", ...companyData });
    } catch (error) {
      res.status(500).json({ message: "Failed to update company data" });
    }
  });

  // Import/Export endpoints with security
  app.post("/api/employees/import", 
    isAuthenticated,
    auditLog('import', 'employees'),
    requirePermission('employees:write'),
    validateInput(z.object({
      data: z.array(insertEmployeeSchema),
      mode: z.enum(['create', 'update', 'upsert']).default('create'),
      options: z.object({
        validateOnly: z.boolean().default(false),
        skipDuplicates: z.boolean().default(true),
        updateOnConflict: z.boolean().default(false)
      }).optional()
    })),
    async (req, res) => {
      try {
        const { data, mode, options = {} } = req.body;
        
        if (options.validateOnly) {
          return res.json({
            message: "Validation successful",
            valid: true,
            count: data.length
          });
        }

        const results = [];
        const errors = [];

        for (const employeeData of data) {
          try {
            let employee;
            
            if (mode === 'create') {
              employee = await storage.createEmployee(employeeData);
            } else if (mode === 'update' && employeeData.email) {
              const existing = await storage.getEmployeeByEmail(employeeData.email);
              if (existing) {
                employee = await storage.updateEmployee(existing.id, employeeData);
              } else if (!options.skipDuplicates) {
                employee = await storage.createEmployee(employeeData);
              }
            } else if (mode === 'upsert') {
              const existing = employeeData.email ? await storage.getEmployeeByEmail(employeeData.email) : null;
              if (existing) {
                employee = await storage.updateEmployee(existing.id, employeeData);
              } else {
                employee = await storage.createEmployee(employeeData);
              }
            }

            if (employee) {
              results.push(employee);
              await storage.createActivity({
                type: 'employee_imported',
                description: `${employeeData.firstName} ${employeeData.lastName} imported via bulk upload`,
                metadata: JSON.stringify({ mode, employeeId: employee.id })
              });
            }
          } catch (error: any) {
            errors.push({
              employee: employeeData,
              error: error.message
            });
          }
        }

        res.json({
          message: `Successfully imported ${results.length} employees`,
          imported: results.length,
          errorCount: errors.length,
          results,
          errors: errors.slice(0, 10) // Limit error details
        });
      } catch (error: any) {
        console.error("Employee import error:", error);
        res.status(500).json({ 
          message: "Import failed", 
          error: error.message 
        });
      }
    }
  );

  app.post("/api/leaves/import",
    isAuthenticated,
    auditLog('import', 'leaves'),
    requirePermission('leaves:write'),
    validateInput(z.object({
      data: z.array(insertLeaveSchema),
      mode: z.enum(['create', 'update', 'upsert']).default('create')
    })),
    async (req, res) => {
      try {
        const { data, mode } = req.body;
        const results = [];
        const errors = [];

        for (const leaveData of data) {
          try {
            const leave = await storage.createLeave(leaveData);
            results.push(leave);
            
            await storage.createActivity({
              type: 'leave_imported',
              description: `Leave request imported for employee ${leaveData.employeeId}`,
              metadata: JSON.stringify({ leaveId: leave.id, employeeId: leaveData.employeeId })
            });
          } catch (error: any) {
            errors.push({
              leave: leaveData,
              error: error.message
            });
          }
        }

        res.json({
          message: `Successfully imported ${results.length} leave records`,
          imported: results.length,
          errorCount: errors.length,
          results,
          errors: errors.slice(0, 10)
        });
      } catch (error: any) {
        console.error("Leave import error:", error);
        res.status(500).json({ 
          message: "Import failed", 
          error: error.message 
        });
      }
    }
  );

  app.post("/api/payroll/import",
    isAuthenticated,
    auditLog('import', 'payroll'),
    requirePermission('payroll:write'),
    validateInput(z.object({
      data: z.array(insertPayrollSchema),
      mode: z.enum(['create', 'update', 'upsert']).default('create')
    })),
    async (req, res) => {
      try {
        const { data, mode } = req.body;
        const results = [];
        const errors = [];

        for (const payrollData of data) {
          try {
            const payroll = await storage.createPayroll(payrollData);
            results.push(payroll);
            
            await storage.createActivity({
              type: 'payroll_imported',
              description: `Payroll record imported for employee ${payrollData.employeeId}`,
              metadata: JSON.stringify({ payrollId: payroll.id, employeeId: payrollData.employeeId })
            });
          } catch (error: any) {
            errors.push({
              payroll: payrollData,
              error: error.message
            });
          }
        }

        res.json({
          message: `Successfully imported ${results.length} payroll records`,
          imported: results.length,
          errorCount: errors.length,
          results,
          errors: errors.slice(0, 10)
        });
      } catch (error: any) {
        console.error("Payroll import error:", error);
        res.status(500).json({ 
          message: "Import failed", 
          error: error.message 
        });
      }
    }
  );

  app.post("/api/performance/import",
    isAuthenticated,
    auditLog('import', 'performance'),
    requirePermission('performance:write'),
    validateInput(z.object({
      data: z.array(insertPerformanceSchema),
      mode: z.enum(['create', 'update', 'upsert']).default('create')
    })),
    async (req, res) => {
      try {
        const { data, mode } = req.body;
        const results = [];
        const errors = [];

        for (const performanceData of data) {
          try {
            const performance = await storage.createPerformance(performanceData);
            results.push(performance);
            
            await storage.createActivity({
              type: 'performance_imported',
              description: `Performance record imported for employee ${performanceData.employeeId}`,
              metadata: JSON.stringify({ performanceId: performance.id, employeeId: performanceData.employeeId })
            });
          } catch (error: any) {
            errors.push({
              performance: performanceData,
              error: error.message
            });
          }
        }

        res.json({
          message: `Successfully imported ${results.length} performance records`,
          imported: results.length,
          errorCount: errors.length,
          results,
          errorDetails: errors.slice(0, 10)
        });
      } catch (error: any) {
        console.error("Performance import error:", error);
        res.status(500).json({ 
          message: "Import failed", 
          error: error.message 
        });
      }
    }
  );

  // Export endpoints with security
  app.get("/api/employees/export",
    isAuthenticated,
    auditLog('export', 'employees'),
    requirePermission('employees:read'),
    async (req, res) => {
      try {
        const employees = await storage.getEmployees();
        
        // Security: Remove sensitive data from export
        const sanitizedEmployees = employees.map(emp => ({
          ...emp,
          // Remove or mask sensitive fields for export
          notes: emp.notes ? '***CONFIDENTIAL***' : null
        }));

        res.json({
          data: sanitizedEmployees,
          count: sanitizedEmployees.length,
          exportedAt: new Date().toISOString()
        });
      } catch (error: any) {
        console.error("Employee export error:", error);
        res.status(500).json({ 
          message: "Export failed", 
          error: error.message 
        });
      }
    }
  );

  app.get("/api/leaves/export",
    isAuthenticated,
    auditLog('export', 'leaves'),
    requirePermission('leaves:read'),
    async (req, res) => {
      try {
        const leaves = await storage.getLeaves();
        res.json({
          data: leaves,
          count: leaves.length,
          exportedAt: new Date().toISOString()
        });
      } catch (error: any) {
        console.error("Leave export error:", error);
        res.status(500).json({ 
          message: "Export failed", 
          error: error.message 
        });
      }
    }
  );

  app.get("/api/payroll/export",
    isAuthenticated,
    auditLog('export', 'payroll'),
    requirePermission('payroll:read'),
    async (req, res) => {
      try {
        const payrolls = await storage.getPayrollRecords();
        res.json({
          data: payrolls,
          count: payrolls.length,
          exportedAt: new Date().toISOString()
        });
      } catch (error: any) {
        console.error("Payroll export error:", error);
        res.status(500).json({ 
          message: "Export failed", 
          error: error.message 
        });
      }
    }
  );

  app.get("/api/performance/export",
    isAuthenticated,
    auditLog('export', 'performance'),
    requirePermission('performance:read'),
    async (req, res) => {
      try {
        const performance = await storage.getPerformanceRecords();
        res.json({
          data: performance,
          count: performance.length,
          exportedAt: new Date().toISOString()
        });
      } catch (error: any) {
        console.error("Performance export error:", error);
        res.status(500).json({ 
          message: "Export failed", 
          error: error.message 
        });
      }
    }
  );

  // Settings endpoints for real-time persistence
  app.get("/api/settings",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const settings = await storage.getUserSettings(userId);
        res.json(settings);
      } catch (error: any) {
        console.error("Settings fetch error:", error);
        res.status(500).json({ message: "Failed to fetch settings" });
      }
    }
  );

  app.get("/api/settings/:category/:key",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const { category, key } = req.params;
        const setting = await storage.getUserSetting(userId, category, key);
        if (!setting) {
          return res.status(404).json({ message: "Setting not found" });
        }
        res.json(setting);
      } catch (error: any) {
        console.error("Setting fetch error:", error);
        res.status(500).json({ message: "Failed to fetch setting" });
      }
    }
  );

  app.put("/api/settings",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const { category, key, value } = req.body;
        
        // Basic validation
        if (!category || !key || value === undefined) {
          return res.status(400).json({ message: "Category, key, and value are required" });
        }
        
        const settingData = { category, key, value, userId };
        const setting = await storage.upsertUserSetting(settingData);
        res.json(setting);
      } catch (error: any) {
        console.error("Setting update error:", error);
        res.status(500).json({ message: "Failed to update setting" });
      }
    }
  );

  app.delete("/api/settings/:category/:key",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const { category, key } = req.params;
        const deleted = await storage.deleteUserSetting(userId, category, key);
        if (!deleted) {
          return res.status(404).json({ message: "Setting not found" });
        }
        res.json({ message: "Setting deleted successfully" });
      } catch (error: any) {
        console.error("Setting deletion error:", error);
        res.status(500).json({ message: "Failed to delete setting" });
      }
    }
  );

  // Notification endpoints
  app.get("/api/notifications",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user?.claims?.sub || req.user?.id;
        if (!userId) {
          return res.status(401).json({ message: "User ID not found" });
        }
        const limit = parseInt(req.query.limit as string) || 50;
        const notifications = await storage.getUserNotifications(userId, limit);
        res.json(notifications);
      } catch (error: any) {
        console.error("Notifications fetch error:", error);
        res.status(500).json({ message: "Failed to fetch notifications" });
      }
    }
  );

  app.get("/api/notifications/unread-count",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user?.claims?.sub || req.user?.id;
        if (!userId) {
          return res.status(401).json({ message: "User ID not found" });
        }
        const count = await storage.getUnreadNotificationCount(userId);
        res.json({ count });
      } catch (error: any) {
        console.error("Unread count fetch error:", error);
        res.status(500).json({ message: "Failed to fetch unread count" });
      }
    }
  );

  app.post("/api/notifications",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user?.claims?.sub || req.user?.id;
        if (!userId) {
          return res.status(401).json({ message: "User ID not found" });
        }
        const { title, message, type, actionUrl } = req.body;
        
        if (!title || !message) {
          return res.status(400).json({ message: "Title and message are required" });
        }
        
        const notificationData = { userId, title, message, type: type || "info", actionUrl };
        const notification = await storage.createNotification(notificationData);
        res.json(notification);
      } catch (error: any) {
        console.error("Notification creation error:", error);
        res.status(500).json({ message: "Failed to create notification" });
      }
    }
  );

  app.patch("/api/notifications/:id/read",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user?.claims?.sub || req.user?.id;
        if (!userId) {
          return res.status(401).json({ message: "User ID not found" });
        }
        const id = parseInt(req.params.id);
        const updated = await storage.markNotificationAsRead(id, userId);
        
        if (!updated) {
          return res.status(404).json({ message: "Notification not found" });
        }
        
        res.json({ message: "Notification marked as read" });
      } catch (error: any) {
        console.error("Mark as read error:", error);
        res.status(500).json({ message: "Failed to mark notification as read" });
      }
    }
  );

  app.patch("/api/notifications/read-all",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user?.claims?.sub || req.user?.id;
        if (!userId) {
          return res.status(401).json({ message: "User ID not found" });
        }
        await storage.markAllNotificationsAsRead(userId);
        res.json({ message: "All notifications marked as read" });
      } catch (error: any) {
        console.error("Mark all as read error:", error);
        res.status(500).json({ message: "Failed to mark all notifications as read" });
      }
    }
  );

  app.delete("/api/notifications/:id",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user?.claims?.sub || req.user?.id;
        if (!userId) {
          return res.status(401).json({ message: "User ID not found" });
        }
        const id = parseInt(req.params.id);
        const deleted = await storage.deleteNotification(id, userId);
        
        if (!deleted) {
          return res.status(404).json({ message: "Notification not found" });
        }
        
        res.json({ message: "Notification deleted" });
      } catch (error: any) {
        console.error("Notification deletion error:", error);
        res.status(500).json({ message: "Failed to delete notification" });
      }
    }
  );

  // Role-specific dashboard stats
  app.get('/api/stats/owner', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getEmployeeStats();
      const activities = await storage.getActivities(10);
      res.json({
        totalEmployees: stats.totalEmployees,
        monthlyPayroll: stats.monthlyPayroll,
        activeLeaves: stats.activeLeaves,
        avgPerformance: stats.avgPerformance,
        recentGrowth: "+5.2%",
        departmentCount: 4
      });
    } catch (error) {
      console.error('Error fetching owner stats:', error);
      res.status(500).json({ message: 'Failed to fetch owner stats' });
    }
  });

  app.get('/api/stats/hr-manager', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getEmployeeStats();
      res.json({
        activeEmployees: stats.totalEmployees,
        newHires: 3,
        pendingLeaves: stats.activeLeaves,
        absenteeismRate: "2.1",
        satisfaction: "87"
      });
    } catch (error) {
      console.error('Error fetching HR manager stats:', error);
      res.status(500).json({ message: 'Failed to fetch HR manager stats' });
    }
  });

  app.get('/api/stats/department', isAuthenticated, async (req, res) => {
    try {
      res.json({
        totalMembers: 8,
        activeMembers: 7,
        targetCompletion: "78",
        pendingLeaves: 2,
        teamPerformance: "85"
      });
    } catch (error) {
      console.error('Error fetching department stats:', error);
      res.status(500).json({ message: 'Failed to fetch department stats' });
    }
  });

  app.get('/api/stats/employee', isAuthenticated, async (req, res) => {
    try {
      res.json({
        activeTasks: 5,
        urgentTasks: 2,
        monthlyPerformance: "85",
        monthlySalary: "45000"
      });
    } catch (error) {
      console.error('Error fetching employee stats:', error);
      res.status(500).json({ message: 'Failed to fetch employee stats' });
    }
  });

  // Task endpoints for different roles
  app.get('/api/tasks/hr-specialist', isAuthenticated, async (req, res) => {
    try {
      res.json({
        pending: 8,
        urgent: 3,
        completed: 12,
        daily: [
          {
            title: "CV İncelemesi - Frontend Developer",
            description: "5 aday için CV değerlendirmesi",
            priority: "high"
          },
          {
            title: "Mülakat Planlaması",
            description: "Bu hafta için mülakat takvimi",
            priority: "medium"
          },
          {
            title: "İş Teklifi Hazırlama",
            description: "Seçilen aday için teklif belgesi",
            priority: "high"
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching HR specialist tasks:', error);
      res.status(500).json({ message: 'Failed to fetch HR specialist tasks' });
    }
  });

  app.get('/api/tasks/department', isAuthenticated, async (req, res) => {
    try {
      res.json({
        pending: [
          {
            title: "İzin Talebi Onayı",
            employee: "Ahmet Yılmaz",
            date: "15-20 Ocak",
            type: "leave"
          },
          {
            title: "Gider Raporu Onayı",
            employee: "Zeynep Demir",
            date: "Ocak 2025",
            type: "expense"
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching department tasks:', error);
      res.status(500).json({ message: 'Failed to fetch department tasks' });
    }
  });

  app.get('/api/tasks/my', isAuthenticated, async (req, res) => {
    try {
      res.json({
        active: [
          {
            title: "Website Yenileme Projesi",
            dueDate: "25 Ocak",
            progress: 75,
            priority: "high"
          },
          {
            title: "Müşteri Raporu Hazırlama",
            dueDate: "30 Ocak",
            progress: 45,
            priority: "medium"
          },
          {
            title: "Ekip Toplantısı Hazırlığı",
            dueDate: "22 Ocak",
            progress: 90,
            priority: "low"
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching employee tasks:', error);
      res.status(500).json({ message: 'Failed to fetch employee tasks' });
    }
  });

  // Interview and application endpoints
  app.get('/api/interviews/today', isAuthenticated, async (req, res) => {
    try {
      res.json({
        today: 3,
        completed: 1,
        schedule: [
          {
            candidateName: "Ali Kaya",
            position: "Frontend Developer",
            time: "10:00"
          },
          {
            candidateName: "Selin Öz",
            position: "UX Designer",
            time: "14:00"
          },
          {
            candidateName: "Murat Şen",
            position: "Backend Developer",
            time: "16:30"
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching interviews:', error);
      res.status(500).json({ message: 'Failed to fetch interviews' });
    }
  });

  app.get('/api/applications/pending', isAuthenticated, async (req, res) => {
    try {
      res.json({
        new: 12,
        inReview: 8,
        scheduled: 5
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ message: 'Failed to fetch applications' });
    }
  });

  // Leave balance for employees
  app.get('/api/leaves/balance', isAuthenticated, async (req, res) => {
    try {
      res.json({
        remaining: 12,
        total: 20,
        used: 8,
        history: [
          {
            type: "Yıllık İzin",
            startDate: "5 Ocak",
            endDate: "10 Ocak",
            days: 5,
            status: "approved"
          },
          {
            type: "Hastalık İzni",
            startDate: "20 Aralık",
            endDate: "22 Aralık",
            days: 3,
            status: "approved"
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching leave balance:', error);
      res.status(500).json({ message: 'Failed to fetch leave balance' });
    }
  });

  // Pending leaves for HR
  app.get('/api/leaves/pending', isAuthenticated, async (req, res) => {
    try {
      res.json([
        {
          employeeName: "Ahmet Yılmaz",
          type: "Yıllık İzin",
          days: 5,
          startDate: "15 Ocak",
          endDate: "19 Ocak"
        },
        {
          employeeName: "Zeynep Demir",
          type: "Hastalık İzni",
          days: 3,
          startDate: "22 Ocak",
          endDate: "24 Ocak"
        }
      ]);
    } catch (error) {
      console.error('Error fetching pending leaves:', error);
      res.status(500).json({ message: 'Failed to fetch pending leaves' });
    }
  });

  // Team members for department managers
  app.get('/api/team/members', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.companyId) {
        return res.status(400).json({ message: "Company ID not found" });
      }
      const members = await storage.getTeamMembers(user.companyId);
      res.json(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      res.status(500).json({ message: 'Failed to fetch team members' });
    }
  });

  // HR activities
  app.get('/api/activities/hr', isAuthenticated, async (req, res) => {
    try {
      res.json([
        {
          title: "Yeni işe alım tamamlandı",
          description: "Frontend Developer pozisyonu için Ali Kaya işe alındı",
          createdAt: new Date().toISOString()
        },
        {
          title: "Performans değerlendirmesi",
          description: "Q4 performans değerlendirmeleri başlatıldı",
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          title: "İzin onayı",
          description: "3 izin talebi onaylandı",
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching HR activities:', error);
      res.status(500).json({ message: 'Failed to fetch HR activities' });
    }
  });

  // Audit log endpoints for patron oversight
  app.get('/api/audit-logs', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
        return res.status(403).json({ message: "Unauthorized - Admin access required" });
      }
      
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await storage.getAuditLogs(limit, user.companyId);
      res.json(logs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      res.status(500).json({ message: 'Failed to fetch audit logs' });
    }
  });

  app.get('/api/audit-logs/user/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = req.user?.claims?.sub;
      const targetUserId = req.params.userId;
      const user = await storage.getUser(currentUserId);
      
      // Allow users to view their own logs, or admin to view any user's logs
      if (currentUserId !== targetUserId && user?.role !== 'Patron') {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await storage.getUserAuditLogs(targetUserId, limit);
      res.json(logs);
    } catch (error) {
      console.error('Error fetching user audit logs:', error);
      res.status(500).json({ message: 'Failed to fetch user audit logs' });
    }
  });

  // Time entry endpoints
  app.post('/api/time-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const timeEntryData = { ...req.body, userId };
      
      const timeEntry = await storage.createTimeEntry(timeEntryData);
      
      // Create notification for manager
      await storage.createNotification({
        userId: 'hr-manager', // In real app, get actual manager ID
        title: 'Yeni Mesai Kaydı',
        message: `${req.user?.email} tarafından mesai kaydı eklendi`,
        type: 'info'
      });
      
      res.status(201).json(timeEntry);
    } catch (error) {
      console.error('Error creating time entry:', error);
      res.status(500).json({ message: 'Failed to create time entry' });
    }
  });

  app.get('/api/time-entries/pending', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const user = await storage.getUser(userId);
      
      // Only HR managers and above can view pending entries
      if (!['Patron', 'İK Müdürü', 'Departman Müdürü'].includes(user?.role || '')) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      const limit = parseInt(req.query.limit as string) || 50;
      const entries = await storage.getPendingTimeEntries(limit);
      res.json(entries);
    } catch (error) {
      console.error('Error fetching pending time entries:', error);
      res.status(500).json({ message: 'Failed to fetch pending time entries' });
    }
  });

  app.patch('/api/time-entries/:id/approve', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const user = await storage.getUser(userId);
      const entryId = parseInt(req.params.id);
      
      if (!['Patron', 'İK Müdürü', 'Departman Müdürü'].includes(user?.role || '')) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      const success = await storage.approveTimeEntry(entryId, userId);
      if (success) {
        res.json({ message: 'Time entry approved successfully' });
      } else {
        res.status(404).json({ message: 'Time entry not found' });
      }
    } catch (error) {
      console.error('Error approving time entry:', error);
      res.status(500).json({ message: 'Failed to approve time entry' });
    }
  });

  // Expense report endpoints
  app.post('/api/expenses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const expenseData = { ...req.body, userId };
      
      const expense = await storage.createExpenseReport(expenseData);
      
      // Create notification for manager
      await storage.createNotification({
        userId: 'hr-manager',
        title: 'Yeni Gider Raporu',
        message: `${req.user?.email} tarafından ${expense.amount}₺ tutarında gider raporu eklendi`,
        type: 'info'
      });
      
      res.status(201).json(expense);
    } catch (error) {
      console.error('Error creating expense report:', error);
      res.status(500).json({ message: 'Failed to create expense report' });
    }
  });

  app.get('/api/expenses/pending', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const user = await storage.getUser(userId);
      
      if (!['Patron', 'İK Müdürü', 'Departman Müdürü'].includes(user?.role || '')) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      const limit = parseInt(req.query.limit as string) || 50;
      const expenses = await storage.getPendingExpenseReports(limit);
      res.json(expenses);
    } catch (error) {
      console.error('Error fetching pending expenses:', error);
      res.status(500).json({ message: 'Failed to fetch pending expenses' });
    }
  });

  app.patch('/api/expenses/:id/approve', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const user = await storage.getUser(userId);
      const expenseId = parseInt(req.params.id);
      
      if (!['Patron', 'İK Müdürü', 'Departman Müdürü'].includes(user?.role || '')) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      const success = await storage.approveExpenseReport(expenseId, userId);
      if (success) {
        res.json({ message: 'Expense report approved successfully' });
      } else {
        res.status(404).json({ message: 'Expense report not found' });
      }
    } catch (error) {
      console.error('Error approving expense report:', error);
      res.status(500).json({ message: 'Failed to approve expense report' });
    }
  });

  // Message endpoints
  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const fromUserId = req.user?.claims?.sub;
      const messageData = { ...req.body, fromUserId };
      
      const message = await storage.createMessage(messageData);
      
      // Create notification for recipient
      await storage.createNotification({
        userId: messageData.toUserId,
        title: 'Yeni Mesaj',
        message: `${req.user?.email} tarafından mesaj: ${messageData.subject}`,
        type: 'info'
      });
      
      res.status(201).json(message);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ message: 'Failed to create message' });
    }
  });

  app.get('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const messages = await storage.getUserMessages(userId, limit);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  // Enhanced leave request with notifications
  app.post('/api/leaves', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const user = await storage.getUser(userId);
      const leaveData = { 
        ...req.body, 
        employeeId: parseInt(userId) || 1, // Fallback for demo
        status: 'pending' 
      };
      
      const leave = await storage.createLeave(leaveData);
      
      // Create audit log
      await storage.createAuditLog({
        userId,
        action: 'create_leave_request',
        resource: 'leave',
        resourceId: leave.id.toString(),
        details: JSON.stringify({ 
          type: leaveData.type, 
          startDate: leaveData.startDate,
          endDate: leaveData.endDate 
        })
      });
      
      // Notify HR and managers
      await storage.createNotification({
        userId: 'hr-manager',
        title: 'Yeni İzin Talebi',
        message: `${user?.email} tarafından ${leaveData.type} talebi oluşturuldu`,
        type: 'info'
      });
      
      res.status(201).json(leave);
    } catch (error) {
      console.error('Error creating leave request:', error);
      res.status(500).json({ message: 'Failed to create leave request' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
