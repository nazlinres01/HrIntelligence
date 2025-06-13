import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { requireAuth, requireRole } from "./middleware/auth";
import { insertEmployeeSchema, insertLeaveSchema, insertPerformanceSchema, insertPayrollSchema, insertDepartmentSchema, users } from "@shared/schema";
import { 
  sanitizeInput, 
  xssProtection, 
  rateLimiter, 
  validateInput,
  authenticate,
  authorize,
  auditLog,
  companyIsolation
} from "./middleware/security";
import { z } from "zod";
import { db } from "./db";
import { sql, desc, eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { 
  sampleCompanies, 
  sampleDepartments, 
  sampleEmployees, 
  sampleLeaves, 
  samplePerformance, 
  sampleTrainings, 
  samplePayroll, 
  sampleNotifications, 
  sampleJobs, 
  sampleJobApplications 
} from "./sample-data";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  const pgStore = connectPg(session);
  app.use(session({
    store: new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Auth middleware
  await setupAuth(app);

  // Apply basic security middleware
  app.use(xssProtection);
  app.use(sanitizeInput);

  // Enhanced registration endpoint with security
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { 
        firstName, lastName, email, companyName, position, role,
        password, userAgent, timestamp, timezone, honeypot 
      } = req.body;

      // Honeypot check
      if (honeypot) {
        return res.status(400).json({ message: "Bot aktivitesi tespit edildi" });
      }

      // Rate limiting check (basic)
      const clientIP = req.ip;
      // In production, implement Redis-based rate limiting

      // Email domain validation
      const emailDomain = email.split('@')[1];
      const suspiciousDomains = ['10minutemail.com', 'guerrillamail.com', 'tempmail.org'];
      if (suspiciousDomains.includes(emailDomain)) {
        return res.status(400).json({ message: "Geçici e-posta adresleri kabul edilmez" });
      }

      // Password strength validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Şifre güvenlik gereksinimlerini karşılamıyor" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Bu e-posta adresi zaten kayıtlı" });
      }

      // Hash password
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create company first
      const company = await storage.createCompany({
        name: companyName,
        industry: "",
        email: email
      });

      // Create user
      const crypto = await import('crypto');
      const user = await storage.upsertUser({
        id: crypto.randomUUID(),
        email: email.toLowerCase(),
        firstName,
        lastName,
        companyId: company.id,
        role: role,
        password: hashedPassword,
        isActive: true
      });

      // Log registration
      await storage.createAuditLog({
        action: "user_registered",
        resource: "user",
        resourceId: user.id,
        userId: user.id,
        companyId: company.id,
        details: `Yeni kullanıcı kaydı: ${firstName} ${lastName} - ${companyName}`,
        ipAddress: clientIP
      });

      res.status(201).json({ 
        message: "Kayıt başarılı",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Kayıt işlemi başarısız" });
    }
  });

  // Enhanced login endpoint with security
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password, rememberMe, userAgent, fingerprint, timezone } = req.body;
      const clientIP = req.ip;

      // Rate limiting - in production use Redis
      // For now, basic in-memory tracking would be implemented

      // Find user
      const user = await storage.getUserByEmail(email.toLowerCase());
      if (!user) {
        return res.status(401).json({ message: "E-posta veya şifre hatalı" });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ message: "Hesap deaktif durumda" });
      }

      // Verify password
      const bcrypt = await import('bcrypt');
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        // Log failed attempt
        await storage.createAuditLog({
          action: "login_failed",
          resource: "user",
          resourceId: user.id,
          userId: user.id,
          companyId: user.companyId,
          details: `Başarısız giriş denemesi: ${email}`,
          ipAddress: clientIP
        });
        return res.status(401).json({ message: "E-posta veya şifre hatalı" });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });

      // Log successful login
      await storage.createAuditLog({
        action: "login_success",
        resource: "user",
        resourceId: user.id,
        userId: user.id,
        companyId: user.companyId,
        details: `Başarılı giriş: ${email}`,
        ipAddress: clientIP
      });

      // Create session
      (req as any).session.userId = user.id;
      (req as any).session.userRole = user.role;
      (req as any).session.companyId = user.companyId;
      
      res.json({
        message: "Giriş başarılı",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          companyId: user.companyId
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Giriş işlemi başarısız" });
    }
  });

  // Auth routes
  app.get('/api/auth/user', requireAuth, async (req: any, res) => {
    try {
      res.json({
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        companyId: req.user.companyId,
        isActive: req.user.isActive
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', requireAuth, async (req: any, res) => {
    try {
      // Log logout activity
      await storage.createAuditLog({
        action: "logout",
        resource: "user", 
        resourceId: req.user.id,
        userId: req.user.id,
        companyId: req.user.companyId,
        details: `Kullanıcı çıkış yaptı: ${req.user.email}`,
        ipAddress: req.ip
      });

      // Destroy session
      req.session.destroy((err: any) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({ message: 'Çıkış işlemi başarısız' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Başarıyla çıkış yapıldı' });
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Çıkış işlemi başarısız" });
    }
  });

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

  // Company routes
  app.get('/api/company', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUser(userId);
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Şirket bilgileri alınırken hata oluştu" });
    }
  });

  // Get all companies (public for demo)
  app.get('/api/companies', async (req: any, res) => {
    try {
      const companies = await storage.getAllCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Şirket listesi alınırken hata oluştu" });
    }
  });

  // Get all users (public for demo)
  app.get('/api/users', async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Kullanıcı listesi alınırken hata oluştu" });
    }
  });

  app.put('/api/company/:id', isAuthenticated, validateInput(z.object({
    name: z.string().min(1),
    industry: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().optional(),
    taxNumber: z.string().optional()
  })), async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const company = await storage.updateCompany(parseInt(id), updateData);
      res.json(company);
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ message: "Şirket bilgileri güncellenirken hata oluştu" });
    }
  });

  // Employee routes
  app.get('/api/employees', requireAuth, async (req: any, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Çalışan listesi alınırken hata oluştu" });
    }
  });

  // Department-specific employees for department managers
  app.get('/api/employees/department/:departmentId', requireAuth, async (req: any, res) => {
    try {
      const { departmentId } = req.params;
      const employees = await storage.getEmployeesByDepartment(parseInt(departmentId));
      res.json(employees);
    } catch (error) {
      console.error("Error fetching department employees:", error);
      res.status(500).json({ message: "Departman çalışan listesi alınırken hata oluştu" });
    }
  });

  app.get('/api/employees/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const employee = await storage.getEmployee(parseInt(id));
      if (!employee) {
        return res.status(404).json({ message: "Çalışan bulunamadı" });
      }
      res.json(employee);
    } catch (error) {
      console.error("Error fetching employee:", error);
      res.status(500).json({ message: "Çalışan bilgileri alınırken hata oluştu" });
    }
  });

  app.post('/api/employees', isAuthenticated, validateInput(insertEmployeeSchema), async (req: any, res) => {
    try {
      const employeeData = req.body;
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.companyId) {
        return res.status(400).json({ message: "Şirket bilgisi bulunamadı" });
      }

      employeeData.companyId = user.companyId;
      const employee = await storage.createEmployee(employeeData);
      
      // Create audit log
      await storage.createAuditLog({
        action: "employee_created",
        resource: "employee",
        resourceId: employee.id.toString(),
        userId: userId,
        companyId: user.companyId,
        details: `Yeni çalışan eklendi: ${employee.firstName} ${employee.lastName}`,
        ipAddress: req.ip
      });

      res.status(201).json(employee);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ message: "Çalışan eklenirken hata oluştu" });
    }
  });

  app.put('/api/employees/:id', isAuthenticated, validateInput(insertEmployeeSchema.partial()), async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const employee = await storage.updateEmployee(parseInt(id), updateData);
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Create audit log
      await storage.createAuditLog({
        action: "employee_updated",
        resource: "employee", 
        resourceId: id,
        userId: userId,
        companyId: user?.companyId || 0,
        details: `Çalışan bilgileri güncellendi: ${employee.firstName} ${employee.lastName}`,
        ipAddress: req.ip
      });

      res.json(employee);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Çalışan güncellenirken hata oluştu" });
    }
  });

  app.delete('/api/employees/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteEmployee(parseInt(id));
      
      if (success) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        
        // Create audit log
        await storage.createAuditLog({
          action: "employee_deleted",
          resource: "employee",
          resourceId: id,
          userId: userId,
          companyId: user?.companyId || 0,
          details: `Çalışan silindi`,
          ipAddress: req.ip
        });

        res.json({ message: "Çalışan başarıyla silindi" });
      } else {
        res.status(404).json({ message: "Çalışan bulunamadı" });
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Çalışan silinirken hata oluştu" });
    }
  });

  // Department routes
  app.get('/api/departments', requireAuth, async (req: any, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ message: "Departman listesi alınırken hata oluştu" });
    }
  });

  app.post('/api/departments', isAuthenticated, validateInput(insertDepartmentSchema), async (req: any, res) => {
    try {
      const departmentData = req.body;
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.companyId) {
        return res.status(400).json({ message: "Şirket bilgisi bulunamadı" });
      }

      departmentData.companyId = user.companyId;
      const department = await storage.createDepartment(departmentData);
      res.status(201).json(department);
    } catch (error) {
      console.error("Error creating department:", error);
      res.status(500).json({ message: "Departman oluşturulurken hata oluştu" });
    }
  });

  // Leave routes
  app.get('/api/leaves', requireAuth, async (req: any, res) => {
    try {
      const leaves = await storage.getLeaves();
      res.json(leaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      res.status(500).json({ message: "İzin listesi alınırken hata oluştu" });
    }
  });

  // Department-specific leaves for department managers
  app.get('/api/leaves/department/:departmentId', requireAuth, async (req: any, res) => {
    try {
      const { departmentId } = req.params;
      const leaves = await storage.getLeavesByDepartment(parseInt(departmentId));
      res.json(leaves);
    } catch (error) {
      console.error("Error fetching department leaves:", error);
      res.status(500).json({ message: "Departman izin listesi alınırken hata oluştu" });
    }
  });

  app.post('/api/leaves', requireAuth, async (req: any, res) => {
    try {
      const leaveData = req.body;
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      const newLeave = await storage.createLeave(leaveData);
      
      await storage.createAuditLog({
        action: "leave_created",
        resource: "leave",
        resourceId: newLeave.id.toString(),
        userId: userId,
        companyId: user?.companyId || 0,
        details: `Yeni izin talebi oluşturuldu: ${leaveData.leaveType}`,
        ipAddress: req.ip
      });

      res.status(201).json(newLeave);
    } catch (error) {
      console.error("Error creating leave:", error);
      res.status(500).json({ message: "İzin talebi oluşturulurken hata oluştu" });
    }
  });

  app.put('/api/leaves/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      const updatedLeave = await storage.updateLeave(parseInt(id), updateData);
      
      if (!updatedLeave) {
        return res.status(404).json({ message: "İzin talebi bulunamadı" });
      }
      
      await storage.createAuditLog({
        action: "leave_updated",
        resource: "leave",
        resourceId: id,
        userId: userId,
        companyId: user?.companyId || 0,
        details: `İzin durumu güncellendi: ${updateData.status || 'güncelleme'}`,
        ipAddress: req.ip
      });

      res.json(updatedLeave);
    } catch (error) {
      console.error("Error updating leave:", error);
      res.status(500).json({ message: "İzin talebi güncellenirken hata oluştu" });
    }
  });

  app.delete('/api/leaves/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      const deleted = await storage.deleteLeave(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ message: "İzin talebi bulunamadı" });
      }
      
      await storage.createAuditLog({
        action: "leave_deleted",
        resource: "leave",
        resourceId: id,
        userId: userId,
        companyId: user?.companyId || 0,
        details: `İzin talebi silindi`,
        ipAddress: req.ip
      });

      res.json({ message: "İzin talebi başarıyla silindi" });
    } catch (error) {
      console.error("Error deleting leave:", error);
      res.status(500).json({ message: "İzin talebi silinirken hata oluştu" });
    }
  });

  app.get('/api/leaves/employee/:employeeId', isAuthenticated, async (req: any, res) => {
    try {
      const { employeeId } = req.params;
      const leaves = await storage.getLeavesByEmployee(parseInt(employeeId));
      res.json(leaves);
    } catch (error) {
      console.error("Error fetching employee leaves:", error);
      res.status(500).json({ message: "Çalışan izinleri alınırken hata oluştu" });
    }
  });

  app.post('/api/leaves', isAuthenticated, validateInput(insertLeaveSchema), async (req: any, res) => {
    try {
      const leaveData = req.body;
      const leave = await storage.createLeave(leaveData);
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Create audit log
      await storage.createAuditLog({
        action: "leave_requested",
        resource: "leave",
        resourceId: leave.id.toString(),
        userId: userId,
        companyId: user?.companyId || 0,
        details: `İzin talebi oluşturuldu: ${leave.leaveType} (${leave.days} gün)`,
        ipAddress: req.ip
      });

      res.status(201).json(leave);
    } catch (error) {
      console.error("Error creating leave:", error);
      res.status(500).json({ message: "İzin talebi oluşturulurken hata oluştu" });
    }
  });

  app.put('/api/leaves/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status, approvedBy } = req.body;
      
      const updateData: any = { status };
      if (approvedBy) {
        updateData.approvedBy = approvedBy;
      }

      const leave = await storage.updateLeave(parseInt(id), updateData);
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Create audit log
      await storage.createAuditLog({
        action: "leave_updated",
        resource: "leave",
        resourceId: id,
        userId: userId,
        companyId: user?.companyId || 0,
        details: `İzin durumu güncellendi: ${status}`,
        ipAddress: req.ip
      });

      res.json(leave);
    } catch (error) {
      console.error("Error updating leave:", error);
      res.status(500).json({ message: "İzin güncellenirken hata oluştu" });
    }
  });

  // Performance routes
  app.get('/api/performance', requireAuth, async (req: any, res) => {
    try {
      res.json(samplePerformance);
    } catch (error) {
      console.error("Error fetching performance records:", error);
      res.status(500).json({ message: "Performans kayıtları alınırken hata oluştu" });
    }
  });

  app.post('/api/performance', requireAuth, async (req: any, res) => {
    try {
      const performanceData = req.body;
      const newId = Math.max(...samplePerformance.map(p => p.id)) + 1;
      const newPerformance = {
        id: newId,
        ...performanceData
      };
      
      samplePerformance.push(newPerformance);
      res.status(201).json(newPerformance);
    } catch (error) {
      console.error("Error creating performance:", error);
      res.status(500).json({ message: "Performans değerlendirmesi oluşturulurken hata oluştu" });
    }
  });

  app.put('/api/performance/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const performanceIndex = samplePerformance.findIndex(p => p.id === parseInt(id));
      
      if (performanceIndex === -1) {
        return res.status(404).json({ message: "Performans kaydı bulunamadı" });
      }
      
      samplePerformance[performanceIndex] = { ...samplePerformance[performanceIndex], ...updateData };
      res.json(samplePerformance[performanceIndex]);
    } catch (error) {
      console.error("Error updating performance:", error);
      res.status(500).json({ message: "Performans kaydı güncellenirken hata oluştu" });
    }
  });

  app.delete('/api/performance/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const performanceIndex = samplePerformance.findIndex(p => p.id === parseInt(id));
      
      if (performanceIndex === -1) {
        return res.status(404).json({ message: "Performans kaydı bulunamadı" });
      }
      
      samplePerformance.splice(performanceIndex, 1);
      res.json({ message: "Performans kaydı başarıyla silindi" });
    } catch (error) {
      console.error("Error deleting performance:", error);
      res.status(500).json({ message: "Performans kaydı silinirken hata oluştu" });
    }
  });

  app.get('/api/performance/employee/:employeeId', isAuthenticated, async (req: any, res) => {
    try {
      const { employeeId } = req.params;
      const performance = await storage.getPerformanceByEmployee(parseInt(employeeId));
      res.json(performance);
    } catch (error) {
      console.error("Error fetching employee performance:", error);
      res.status(500).json({ message: "Çalışan performansı alınırken hata oluştu" });
    }
  });

  app.post('/api/performance', isAuthenticated, validateInput(insertPerformanceSchema), async (req: any, res) => {
    try {
      const performanceData = req.body;
      const performance = await storage.createPerformance(performanceData);
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Create audit log
      await storage.createAuditLog({
        action: "performance_created",
        resource: "performance",
        resourceId: performance.id.toString(),
        userId: userId,
        companyId: user?.companyId || 0,
        details: `Performans değerlendirmesi oluşturuldu: ${performance.reviewPeriod} (Puan: ${performance.score})`,
        ipAddress: req.ip
      });

      res.status(201).json(performance);
    } catch (error) {
      console.error("Error creating performance:", error);
      res.status(500).json({ message: "Performans kaydı oluşturulurken hata oluştu" });
    }
  });

  // Payroll routes
  app.get('/api/payroll', requireAuth, async (req: any, res) => {
    try {
      res.json(samplePayroll);
    } catch (error) {
      console.error("Error fetching payroll records:", error);
      res.status(500).json({ message: "Bordro kayıtları alınırken hata oluştu" });
    }
  });

  app.post('/api/payroll', requireAuth, async (req: any, res) => {
    try {
      const payrollData = req.body;
      const newId = Math.max(...samplePayroll.map(p => p.id)) + 1;
      const newPayroll = {
        id: newId,
        status: 'pending',
        ...payrollData
      };
      
      samplePayroll.push(newPayroll);
      res.status(201).json(newPayroll);
    } catch (error) {
      console.error("Error creating payroll:", error);
      res.status(500).json({ message: "Bordro oluşturulurken hata oluştu" });
    }
  });

  app.put('/api/payroll/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const payrollIndex = samplePayroll.findIndex(p => p.id === parseInt(id));
      
      if (payrollIndex === -1) {
        return res.status(404).json({ message: "Bordro kaydı bulunamadı" });
      }
      
      samplePayroll[payrollIndex] = { ...samplePayroll[payrollIndex], ...updateData };
      res.json(samplePayroll[payrollIndex]);
    } catch (error) {
      console.error("Error updating payroll:", error);
      res.status(500).json({ message: "Bordro güncellenirken hata oluştu" });
    }
  });

  app.delete('/api/payroll/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const payrollIndex = samplePayroll.findIndex(p => p.id === parseInt(id));
      
      if (payrollIndex === -1) {
        return res.status(404).json({ message: "Bordro kaydı bulunamadı" });
      }
      
      samplePayroll.splice(payrollIndex, 1);
      res.json({ message: "Bordro kaydı başarıyla silindi" });
    } catch (error) {
      console.error("Error deleting payroll:", error);
      res.status(500).json({ message: "Bordro silinirken hata oluştu" });
    }
  });

  app.get('/api/payroll/employee/:employeeId', isAuthenticated, async (req: any, res) => {
    try {
      const { employeeId } = req.params;
      const payroll = await storage.getPayrollByEmployee(parseInt(employeeId));
      res.json(payroll);
    } catch (error) {
      console.error("Error fetching employee payroll:", error);
      res.status(500).json({ message: "Çalışan bordrosu alınırken hata oluştu" });
    }
  });

  app.post('/api/payroll', isAuthenticated, validateInput(insertPayrollSchema), async (req: any, res) => {
    try {
      const payrollData = req.body;
      const payroll = await storage.createPayroll(payrollData);
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Create audit log
      await storage.createAuditLog({
        action: "payroll_created",
        resource: "payroll",
        resourceId: payroll.id.toString(),
        userId: userId,
        companyId: user?.companyId || 0,
        details: `Bordro oluşturuldu: ${payroll.month} (Net: ${payroll.netSalary})`,
        ipAddress: req.ip
      });

      res.status(201).json(payroll);
    } catch (error) {
      console.error("Error creating payroll:", error);
      res.status(500).json({ message: "Bordro oluşturulurken hata oluştu" });
    }
  });

  // Dashboard stats routes
  app.get('/api/stats/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const stats = await storage.getEmployeeStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Dashboard istatistikleri alınırken hata oluştu" });
    }
  });

  app.get('/api/stats/department', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.companyId) {
        return res.status(400).json({ message: "Şirket bilgisi bulunamadı" });
      }

      const stats = await storage.getTeamStats(user.companyId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching department stats:", error);
      res.status(500).json({ message: "Departman istatistikleri alınırken hata oluştu" });
    }
  });

  // Team management routes
  app.get('/api/team/members', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.companyId) {
        return res.status(400).json({ message: "Şirket bilgisi bulunamadı" });
      }

      const members = await storage.getTeamMembers(user.companyId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Ekip üyeleri alınırken hata oluştu" });
    }
  });

  app.post('/api/team/invite', isAuthenticated, async (req: any, res) => {
    try {
      const userData = req.body;
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.companyId) {
        return res.status(400).json({ message: "Şirket bilgisi bulunamadı" });
      }

      userData.companyId = user.companyId;
      const newUser = await storage.inviteTeamMember(userData);
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error inviting team member:", error);
      res.status(500).json({ message: "Ekip üyesi davet edilirken hata oluştu" });
    }
  });

  // Task routes for different roles
  app.get('/api/tasks/hr-specialist', isAuthenticated, async (req: any, res) => {
    try {
      // Mock data for HR specialist tasks
      const tasks = {
        pending: 8,
        urgent: 3,
        today: 5,
        completed: 15,
        new: 12
      };
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching HR specialist tasks:", error);
      res.status(500).json({ message: "İK uzmanı görevleri alınırken hata oluştu" });
    }
  });

  app.get('/api/tasks/department', isAuthenticated, async (req: any, res) => {
    try {
      // Mock data for department tasks
      const tasks = {
        pending: [
          {
            title: "İzin Talebi Onayı",
            employee: "Ahmet Yılmaz",
            date: "2024-06-11",
            type: "leave"
          },
          {
            title: "Masraf Raporu",
            employee: "Ayşe Demir",
            date: "2024-06-10",
            type: "expense"
          },
          {
            title: "Performans Değerlendirmesi",
            employee: "Mehmet Kaya",
            date: "2024-06-09",
            type: "performance"
          }
        ]
      };
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching department tasks:", error);
      res.status(500).json({ message: "Departman görevleri alınırken hata oluştu" });
    }
  });

  // Interview routes
  app.get('/api/interviews/today', isAuthenticated, async (req: any, res) => {
    try {
      // Mock data for today's interviews
      const interviews = {
        today: 3,
        completed: 1,
        schedule: [
          {
            candidate: "Ali Vural",
            position: "Frontend Developer",
            time: "14:00",
            status: "confirmed"
          },
          {
            candidate: "Zeynep Özkan",
            position: "Backend Developer", 
            time: "15:30",
            status: "pending"
          },
          {
            candidate: "Murat Şen",
            position: "UI/UX Designer",
            time: "16:00",
            status: "confirmed"
          }
        ]
      };
      res.json(interviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      res.status(500).json({ message: "Görüşmeler alınırken hata oluştu" });
    }
  });

  // Application routes
  app.get('/api/applications/pending', isAuthenticated, async (req: any, res) => {
    try {
      // Mock data for pending applications
      const applications = {
        new: 12,
        inReview: 8,
        scheduled: 5,
        rejected: 3
      };
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Başvurular alınırken hata oluştu" });
    }
  });

  // Dashboard Statistics Routes for All Roles
  
  // HR Manager Dashboard Statistics
  app.get('/api/stats/hr-manager', isAuthenticated, async (req: any, res) => {
    try {
      const stats = await storage.getHRManagerStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching HR manager stats:", error);
      res.status(500).json({ message: "İK müdürü istatistikleri alınırken hata oluştu" });
    }
  });

  // Department Manager Dashboard Statistics
  app.get('/api/stats/department-manager', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDepartmentManagerStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching department manager stats:", error);
      res.status(500).json({ message: "Departman müdürü istatistikleri alınırken hata oluştu" });
    }
  });

  // Admin Dashboard Statistics
  app.get('/api/stats/admin', isAuthenticated, async (req: any, res) => {
    try {
      const [employeeStats, hrStats] = await Promise.all([
        storage.getEmployeeStats(),
        storage.getHRManagerStats()
      ]);
      
      const adminStats = {
        ...employeeStats,
        ...hrStats,
        totalCompanies: await storage.getAllCompanies().then(companies => companies.length),
        totalUsers: await storage.getAllUsers().then(users => users.length),
        systemHealth: "healthy",
        serverUptime: process.uptime()
      };
      
      res.json(adminStats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Yönetici istatistikleri alınırken hata oluştu" });
    }
  });

  // Activities routes
  app.get('/api/activities', requireAuth, async (req: any, res) => {
    try {
      const { limit = 10 } = req.query;
      const activities = await storage.getActivities(parseInt(limit as string));
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Aktiviteler alınırken hata oluştu" });
    }
  });

  // Notifications routes
  app.get('/api/notifications', requireAuth, async (req: any, res) => {
    try {
      res.json(sampleNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Bildirimler alınırken hata oluştu" });
    }
  });

  app.get('/api/notifications/unread-count', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Okunmamış bildirim sayısı alınırken hata oluştu" });
    }
  });

  app.put('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      const success = await storage.markNotificationAsRead(parseInt(id), userId);
      
      if (success) {
        res.json({ message: "Bildirim okundu olarak işaretlendi" });
      } else {
        res.status(404).json({ message: "Bildirim bulunamadı" });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Bildirim güncellenirken hata oluştu" });
    }
  });

  app.put('/api/notifications/mark-all-read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.markAllNotificationsAsRead(userId);
      res.json({ message: "Tüm bildirimler okundu olarak işaretlendi" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Bildirimler güncellenirken hata oluştu" });
    }
  });

  // Settings routes
  app.get('/api/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settings = await storage.getUserSettings(userId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Ayarlar alınırken hata oluştu" });
    }
  });

  app.post('/api/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { category, key, value } = req.body;
      
      const setting = await storage.upsertUserSetting({
        userId,
        category,
        key,
        value
      });
      
      res.json(setting);
    } catch (error) {
      console.error("Error saving setting:", error);
      res.status(500).json({ message: "Ayar kaydedilirken hata oluştu" });
    }
  });

  // Audit logs routes
  app.get('/api/audit-logs', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      const { limit = 100 } = req.query;
      
      const logs = await storage.getAuditLogs(parseInt(limit as string), user?.companyId ?? undefined);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Denetim kayıtları alınırken hata oluştu" });
    }
  });

  // Employee-specific routes
  app.get('/api/stats/employee', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      }

      // Employee-specific stats
      const stats = {
        totalTasks: 8,
        completedTasks: 6,
        pendingTasks: 2,
        completionRate: 75,
        totalLeaves: 15,
        usedLeaves: 3,
        remainingLeaves: 12,
        currentMonth: "Aralık 2024",
        workingDays: 22,
        attendanceRate: 95
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching employee stats:", error);
      res.status(500).json({ message: "Çalışan istatistikleri alınırken hata oluştu" });
    }
  });

  app.get('/api/my-tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Sample employee tasks
      const tasks = [
        {
          id: 1,
          title: "Proje raporunu tamamla",
          description: "Q4 proje raporunu hazırla ve gönder",
          status: "pending",
          priority: "high",
          dueDate: "2024-12-15",
          assignedBy: "Ahmet Yılmaz",
          createdAt: "2024-12-10"
        },
        {
          id: 2,
          title: "Müşteri toplantısına katıl",
          description: "ABC Şirketi ile haftalık görüşme",
          status: "completed",
          priority: "medium",
          dueDate: "2024-12-12",
          assignedBy: "Fatma Demir",
          createdAt: "2024-12-08"
        },
        {
          id: 3,
          title: "E-postaları yanıtla",
          description: "Bekleyen müşteri e-postalarını yanıtla",
          status: "pending",
          priority: "low",
          dueDate: "2024-12-13",
          assignedBy: "Ali Kaya",
          createdAt: "2024-12-09"
        }
      ];

      res.json(tasks);
    } catch (error) {
      console.error("Error fetching my tasks:", error);
      res.status(500).json({ message: "Görevler alınırken hata oluştu" });
    }
  });

  app.get('/api/my-leaves', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Sample employee leaves
      const leaves = [
        {
          id: 1,
          type: "annual",
          startDate: "2024-07-15",
          endDate: "2024-07-20",
          days: 5,
          status: "approved",
          reason: "Yaz tatili",
          appliedDate: "2024-06-10",
          approvedBy: "İK Müdürü",
          approvedDate: "2024-06-12"
        },
        {
          id: 2,
          type: "sick",
          startDate: "2024-06-03",
          endDate: "2024-06-03",
          days: 1,
          status: "approved",
          reason: "Sağlık sorunu",
          appliedDate: "2024-06-02",
          approvedBy: "İK Uzmanı",
          approvedDate: "2024-06-02"
        },
        {
          id: 3,
          type: "personal",
          startDate: "2024-05-25",
          endDate: "2024-05-25",
          days: 0.5,
          status: "pending",
          reason: "Kişisel işler",
          appliedDate: "2024-05-20",
          approvedBy: null,
          approvedDate: null
        }
      ];

      res.json(leaves);
    } catch (error) {
      console.error("Error fetching my leaves:", error);
      res.status(500).json({ message: "İzinler alınırken hata oluştu" });
    }
  });

  app.post('/api/my-tasks/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Create audit log
      await storage.createAuditLog({
        action: "task_completed",
        resource: "task",
        resourceId: id,
        userId: userId,
        companyId: 1,
        details: `Görev tamamlandı: ${id}`,
        ipAddress: req.ip
      });

      res.json({ message: "Görev başarıyla tamamlandı" });
    } catch (error) {
      console.error("Error completing task:", error);
      res.status(500).json({ message: "Görev tamamlanırken hata oluştu" });
    }
  });

  app.get('/api/my-profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      }

      // Employee profile data
      const profile = {
        id: user.id,
        firstName: user.firstName || "Ceren",
        lastName: user.lastName || "Bağ",
        email: user.email,
        position: "Yazılım Geliştirici",
        department: "Bilgi İşlem",
        startDate: "2023-01-15",
        phone: "+90 555 123 4567",
        address: "İstanbul, Türkiye",
        emergencyContact: "+90 555 987 6543",
        profileImage: user.profileImageUrl
      };

      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Profil alınırken hata oluştu" });
    }
  });

  app.put('/api/my-profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updateData = req.body;
      
      const updatedUser = await storage.updateUser(userId, {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        email: updateData.email
      });

      // Create audit log
      await storage.createAuditLog({
        action: "profile_updated",
        resource: "profile",
        resourceId: userId,
        userId: userId,
        companyId: 1,
        details: "Profil bilgileri güncellendi",
        ipAddress: req.ip
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Profil güncellenirken hata oluştu" });
    }
  });

  app.get('/api/my-attendance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Sample attendance data
      const attendance = [
        {
          date: "2024-12-12",
          checkIn: "09:00",
          checkOut: "18:00",
          workingHours: "9:00",
          status: "present"
        },
        {
          date: "2024-12-11",
          checkIn: "09:15",
          checkOut: "18:30",
          workingHours: "9:15",
          status: "present"
        },
        {
          date: "2024-12-10",
          checkIn: "08:45",
          checkOut: "17:45",
          workingHours: "9:00",
          status: "present"
        }
      ];

      res.json(attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({ message: "Devam kayıtları alınırken hata oluştu" });
    }
  });

  app.post('/api/time-entry', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { type, description, hours } = req.body;
      
      const timeEntry = await storage.createTimeEntry({
        userId: userId,
        date: new Date().toISOString().split('T')[0],
        type: type,
        description: description,
        hours: parseFloat(hours),
        status: 'pending'
      });

      // Create audit log
      await storage.createAuditLog({
        action: "time_entry_created",
        resource: "time_entry",
        resourceId: timeEntry.id.toString(),
        userId: userId,
        companyId: 1,
        details: `Mesai kaydı oluşturuldu: ${hours} saat`,
        ipAddress: req.ip
      });

      res.status(201).json(timeEntry);
    } catch (error) {
      console.error("Error creating time entry:", error);
      res.status(500).json({ message: "Mesai kaydı oluşturulurken hata oluştu" });
    }
  });

  // Training routes
  app.get('/api/training', requireAuth, async (req: any, res) => {
    try {
      const trainings = await storage.getTrainingPrograms();
      res.json(trainings);
    } catch (error) {
      console.error("Error fetching training records:", error);
      res.status(500).json({ message: "Eğitim kayıtları alınırken hata oluştu" });
    }
  });

  app.get('/api/trainings', requireAuth, async (req: any, res) => {
    try {
      const trainings = await storage.getTrainingPrograms();
      res.json(trainings);
    } catch (error) {
      console.error("Error fetching training records:", error);
      res.status(500).json({ message: "Eğitim kayıtları alınırken hata oluştu" });
    }
  });

  app.post('/api/training', requireAuth, async (req: any, res) => {
    try {
      const trainingData = req.body;
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      const newTraining = await storage.createTrainingProgram(trainingData);
      
      await storage.createAuditLog({
        action: "training_created",
        resource: "training",
        resourceId: newTraining.id.toString(),
        userId: userId,
        companyId: user?.companyId || 0,
        details: `Yeni eğitim programı oluşturuldu: ${trainingData.title}`,
        ipAddress: req.ip
      });

      res.status(201).json(newTraining);
    } catch (error) {
      console.error("Error creating training:", error);
      res.status(500).json({ message: "Eğitim programı oluşturulurken hata oluştu" });
    }
  });

  app.put('/api/training/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      const updatedTraining = await storage.updateTrainingProgram(parseInt(id), updateData);
      
      if (!updatedTraining) {
        return res.status(404).json({ message: "Eğitim programı bulunamadı" });
      }
      
      await storage.createAuditLog({
        action: "training_updated",
        resource: "training",
        resourceId: id,
        userId: userId,
        companyId: user?.companyId || 0,
        details: `Eğitim programı güncellendi: ${updatedTraining.title}`,
        ipAddress: req.ip
      });

      res.json(updatedTraining);
    } catch (error) {
      console.error("Error updating training:", error);
      res.status(500).json({ message: "Eğitim programı güncellenirken hata oluştu" });
    }
  });

  app.delete('/api/training/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      const deleted = await storage.deleteTrainingProgram(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ message: "Eğitim programı bulunamadı" });
      }
      
      await storage.createAuditLog({
        action: "training_deleted",
        resource: "training",
        resourceId: id,
        userId: userId,
        companyId: user?.companyId || 0,
        details: `Eğitim programı silindi`,
        ipAddress: req.ip
      });

      res.json({ message: "Eğitim programı başarıyla silindi" });
    } catch (error) {
      console.error("Error deleting training:", error);
      res.status(500).json({ message: "Eğitim programı silinirken hata oluştu" });
    }
  });

  // Companies routes
  app.get('/api/companies', requireAuth, async (req: any, res) => {
    try {
      res.json(sampleCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Şirket listesi alınırken hata oluştu" });
    }
  });

  // Departments routes
  app.get('/api/departments', requireAuth, async (req: any, res) => {
    try {
      res.json(sampleDepartments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ message: "Departman listesi alınırken hata oluştu" });
    }
  });

  app.post('/api/departments', requireAuth, async (req: any, res) => {
    try {
      const departmentData = req.body;
      const newId = Math.max(...sampleDepartments.map(d => d.id)) + 1;
      const newDepartment = {
        id: newId,
        companyId: 489,
        employeeCount: 0,
        budget: "0",
        location: "İstanbul Ofis",
        ...departmentData
      };
      
      sampleDepartments.push(newDepartment);
      res.status(201).json(newDepartment);
    } catch (error) {
      console.error("Error creating department:", error);
      res.status(500).json({ message: "Departman oluşturulurken hata oluştu" });
    }
  });

  app.put('/api/departments/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const deptIndex = sampleDepartments.findIndex(d => d.id === parseInt(id));
      
      if (deptIndex === -1) {
        return res.status(404).json({ message: "Departman bulunamadı" });
      }
      
      sampleDepartments[deptIndex] = { ...sampleDepartments[deptIndex], ...updateData };
      res.json(sampleDepartments[deptIndex]);
    } catch (error) {
      console.error("Error updating department:", error);
      res.status(500).json({ message: "Departman güncellenirken hata oluştu" });
    }
  });

  app.delete('/api/departments/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const deptIndex = sampleDepartments.findIndex(d => d.id === parseInt(id));
      
      if (deptIndex === -1) {
        return res.status(404).json({ message: "Departman bulunamadı" });
      }
      
      sampleDepartments.splice(deptIndex, 1);
      res.json({ message: "Departman başarıyla silindi" });
    } catch (error) {
      console.error("Error deleting department:", error);
      res.status(500).json({ message: "Departman silinirken hata oluştu" });
    }
  });

  // Employees routes
  app.get('/api/employees', requireAuth, async (req: any, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Çalışan listesi alınırken hata oluştu" });
    }
  });

  app.post('/api/employees', requireAuth, async (req: any, res) => {
    try {
      const employeeData = req.body;
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user?.companyId) {
        return res.status(400).json({ message: "Şirket bilgisi bulunamadı" });
      }

      employeeData.companyId = user.companyId;
      const newEmployee = await storage.createEmployee(employeeData);
      
      // Create audit log
      await storage.createAuditLog({
        action: "employee_created",
        resource: "employee",
        resourceId: newEmployee.id.toString(),
        userId: userId,
        companyId: user.companyId,
        details: `Yeni çalışan eklendi: ${newEmployee.firstName} ${newEmployee.lastName}`,
        ipAddress: req.ip
      });

      res.status(201).json(newEmployee);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ message: "Çalışan oluşturulurken hata oluştu" });
    }
  });

  app.put('/api/employees/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      const updatedEmployee = await storage.updateEmployee(parseInt(id), updateData);
      
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Çalışan bulunamadı" });
      }
      
      // Create audit log
      await storage.createAuditLog({
        action: "employee_updated",
        resource: "employee",
        resourceId: id,
        userId: userId,
        companyId: user?.companyId || 0,
        details: `Çalışan bilgileri güncellendi: ${updatedEmployee.firstName} ${updatedEmployee.lastName}`,
        ipAddress: req.ip
      });

      res.json(updatedEmployee);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Çalışan güncellenirken hata oluştu" });
    }
  });

  app.delete('/api/employees/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      const deleted = await storage.deleteEmployee(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ message: "Çalışan bulunamadı" });
      }
      
      // Create audit log
      await storage.createAuditLog({
        action: "employee_deleted",
        resource: "employee",
        resourceId: id,
        userId: userId,
        companyId: user?.companyId || 0,
        details: `Çalışan silindi`,
        ipAddress: req.ip
      });

      res.json({ message: "Çalışan başarıyla silindi" });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Çalışan silinirken hata oluştu" });
    }
  });

  // Job posting routes
  app.get('/api/jobs', requireAuth, async (req: any, res) => {
    try {
      res.json(sampleJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "İş ilanları alınırken hata oluştu" });
    }
  });

  app.post('/api/jobs', requireAuth, async (req: any, res) => {
    try {
      const jobData = req.body;
      const newId = Math.max(...sampleJobs.map(j => j.id)) + 1;
      const newJob = {
        id: newId,
        status: 'active',
        postedDate: new Date().toISOString().split('T')[0],
        closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        ...jobData
      };
      
      sampleJobs.push(newJob);
      res.status(201).json(newJob);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ message: "İş ilanı oluşturulurken hata oluştu" });
    }
  });

  app.put('/api/jobs/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const jobIndex = sampleJobs.findIndex(j => j.id === parseInt(id));
      
      if (jobIndex === -1) {
        return res.status(404).json({ message: "İş ilanı bulunamadı" });
      }
      
      sampleJobs[jobIndex] = { ...sampleJobs[jobIndex], ...updateData };
      res.json(sampleJobs[jobIndex]);
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ message: "İş ilanı güncellenirken hata oluştu" });
    }
  });

  app.delete('/api/jobs/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const jobIndex = sampleJobs.findIndex(j => j.id === parseInt(id));
      
      if (jobIndex === -1) {
        return res.status(404).json({ message: "İş ilanı bulunamadı" });
      }
      
      sampleJobs.splice(jobIndex, 1);
      res.json({ message: "İş ilanı başarıyla silindi" });
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ message: "İş ilanı silinirken hata oluştu" });
    }
  });

  // Job applications routes
  app.get('/api/job-applications', requireAuth, async (req: any, res) => {
    try {
      res.json(sampleJobApplications);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      res.status(500).json({ message: "İş başvuruları alınırken hata oluştu" });
    }
  });

  app.post('/api/job-applications', requireAuth, async (req: any, res) => {
    try {
      const applicationData = req.body;
      const newId = Math.max(...sampleJobApplications.map(a => a.id)) + 1;
      const newApplication = {
        id: newId,
        status: 'under_review',
        appliedDate: new Date().toISOString().split('T')[0],
        ...applicationData
      };
      
      sampleJobApplications.push(newApplication);
      res.status(201).json(newApplication);
    } catch (error) {
      console.error("Error creating job application:", error);
      res.status(500).json({ message: "İş başvurusu oluşturulurken hata oluştu" });
    }
  });

  app.put('/api/job-applications/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const applicationIndex = sampleJobApplications.findIndex(a => a.id === parseInt(id));
      
      if (applicationIndex === -1) {
        return res.status(404).json({ message: "İş başvurusu bulunamadı" });
      }
      
      sampleJobApplications[applicationIndex] = { ...sampleJobApplications[applicationIndex], ...updateData };
      res.json(sampleJobApplications[applicationIndex]);
    } catch (error) {
      console.error("Error updating job application:", error);
      res.status(500).json({ message: "İş başvurusu güncellenirken hata oluştu" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}