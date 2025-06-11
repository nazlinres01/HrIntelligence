import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { requireAuth, requireRole } from "./middleware/auth";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { insertEmployeeSchema, insertLeaveSchema, insertPerformanceSchema, insertPayrollSchema, insertDepartmentSchema, users } from "@shared/schema";
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
import { sql, desc, eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  const pgStore = connectPg(session);
  app.use(session({
    store: new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
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

  // Apply security middleware globally
  app.use(sanitizeInput);
  app.use(preventXSS);
  app.use(requestLogger);

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
        address: "",
        phone: "",
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
  app.get('/api/employees', isAuthenticated, async (req: any, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Çalışan listesi alınırken hata oluştu" });
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
  app.get('/api/departments', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/leaves', isAuthenticated, async (req: any, res) => {
    try {
      const leaves = await storage.getLeaves();
      res.json(leaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      res.status(500).json({ message: "İzin listesi alınırken hata oluştu" });
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
  app.get('/api/performance', isAuthenticated, async (req: any, res) => {
    try {
      const performance = await storage.getPerformanceRecords();
      res.json(performance);
    } catch (error) {
      console.error("Error fetching performance records:", error);
      res.status(500).json({ message: "Performans kayıtları alınırken hata oluştu" });
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
  app.get('/api/payroll', isAuthenticated, async (req: any, res) => {
    try {
      const payroll = await storage.getPayrollRecords();
      res.json(payroll);
    } catch (error) {
      console.error("Error fetching payroll records:", error);
      res.status(500).json({ message: "Bordro kayıtları alınırken hata oluştu" });
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
  app.get('/api/team/members', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  // Activities routes
  app.get('/api/activities', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { limit = 50 } = req.query;
      const notifications = await storage.getUserNotifications(userId, parseInt(limit as string));
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Bildirimler alınırken hata oluştu" });
    }
  });

  app.get('/api/notifications/unread-count', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app.get('/api/audit-logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const { limit = 100 } = req.query;
      
      const logs = await storage.getAuditLogs(parseInt(limit as string), user?.companyId ?? undefined);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Denetim kayıtları alınırken hata oluştu" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}