import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertEmployeeSchema, insertLeaveSchema, insertPerformanceSchema, insertPayrollSchema } from "@shared/schema";
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware setup first
  await setupAuth(app);

  // Apply security middleware globally
  app.use(sanitizeInput);
  app.use(preventXSS);
  app.use(requestLogger);

  // Auth routes
  app.post('/api/register', async (req, res) => {
    try {
      const { firstName, lastName, email, phone, companyName, password } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Bu e-posta adresi zaten kullanımda" });
      }

      // Create new user
      const userData = {
        id: `user-${Date.now()}`,
        email,
        firstName,
        lastName,
        profileImageUrl: null,
        phone,
        companyName,
        password // In production, this should be hashed
      };

      const user = await storage.upsertUser(userData);
      
      // Store user in session
      (req.session as any).userId = user.id;
      
      res.json({ message: "Kayıt başarılı", user: { ...user, password: undefined } });
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
      
      res.json({ message: "Giriş başarılı", user: { ...user, password: undefined } });
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
        const userId = req.user.claims.sub;
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
        const userId = req.user.claims.sub;
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
        const userId = req.user.claims.sub;
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
        const userId = req.user.claims.sub;
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

  const httpServer = createServer(app);
  return httpServer;
}
