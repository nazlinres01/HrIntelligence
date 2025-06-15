import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { requireAuth, requireRole } from "./middleware/auth";
import { insertEmployeeSchema, insertLeaveSchema, insertPerformanceSchema, insertPayrollSchema, insertDepartmentSchema, users, companies } from "@shared/schema";
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

      // Check if company already exists or create new one
      const existingCompanies = await db.select().from(companies).where(eq(companies.name, companyName)).limit(1);
      
      let companyRecord;
      if (existingCompanies.length === 0) {
        // Create new company
        const [newCompany] = await db
          .insert(companies)
          .values({
            name: companyName,
            industry: "",
            email: email
          })
          .returning();
        companyRecord = newCompany;
      } else {
        companyRecord = existingCompanies[0];
      }

      // Create user
      const crypto = await import('crypto');
      const user = await storage.upsertUser({
        id: crypto.randomUUID(),
        email: email.toLowerCase(),
        firstName,
        lastName,
        companyId: companyRecord.id,
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
        companyId: companyRecord.id,
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
      // Skip audit log for now to avoid database issues

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

  // Password reset request endpoint
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "E-posta adresi gerekli" });
      }

      // Check if user exists
      const user = await storage.getUserByEmail(email.toLowerCase());
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({ message: "E-posta adresinize şifre sıfırlama talimatları gönderildi" });
      }

      // Generate reset token
      const crypto = await import('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // Save reset token to user
      await storage.updateUser(user.id, {
        resetToken,
        resetTokenExpiry
      });

      // Log password reset request
      await storage.createAuditLog({
        action: "password_reset_requested",
        resource: "user",
        resourceId: user.id,
        userId: user.id,
        companyId: user.companyId,
        details: `Şifre sıfırlama talep edildi: ${email}`,
        ipAddress: req.ip
      });

      // In production, send email with reset link
      // For now, just return success message
      res.json({ 
        message: "E-posta adresinize şifre sıfırlama talimatları gönderildi",
        // In development, include token for testing
        ...(process.env.NODE_ENV === 'development' && { resetToken })
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Şifre sıfırlama talebi başarısız" });
    }
  });

  // Password reset endpoint
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token ve yeni şifre gerekli" });
      }

      // Password strength validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ message: "Şifre güvenlik gereksinimlerini karşılamıyor" });
      }

      // Find user with valid reset token
      const users = await storage.getAllUsers();
      const user = users.find(u => 
        u.resetToken === token && 
        u.resetTokenExpiry && 
        u.resetTokenExpiry > new Date()
      );

      if (!user) {
        return res.status(400).json({ message: "Geçersiz veya süresi dolmuş token" });
      }

      // Hash new password
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update user password and clear reset token
      await storage.updateUser(user.id, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      });

      // Log successful password reset
      await storage.createAuditLog({
        action: "password_reset_completed",
        resource: "user",
        resourceId: user.id,
        userId: user.id,
        companyId: user.companyId,
        details: `Şifre başarıyla sıfırlandı: ${user.email}`,
        ipAddress: req.ip
      });

      res.json({ message: "Şifre başarıyla güncellendi" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Şifre sıfırlama başarısız" });
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
        startTime: "09:00",
        endTime: "18:00",
        description: description || "Mesai kaydı",
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

  // Department Manager specific endpoints
  app.get('/api/stats/department-manager', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get department manager stats
      const stats = {
        totalTeamMembers: 24,
        averagePerformance: 89,
        activeProjects: 7,
        targetCompletion: 92,
        pendingApprovals: 5,
        monthlyBudgetUtilization: 78,
        teamSatisfaction: 95,
        departmentRevenue: "2.4M TL"
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching department manager stats:", error);
      res.status(500).json({ message: "Departman müdürü istatistikleri alınamadı" });
    }
  });

  app.get('/api/department-team', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get department team members
      const teamMembers = [
        {
          id: "emp_001",
          name: "Ahmet Yılmaz",
          position: "Senior Yazılım Geliştirici",
          performance: 95,
          tasksCompleted: 28,
          totalTasks: 30,
          lastActivity: "2 saat önce",
          status: "active"
        },
        {
          id: "emp_002", 
          name: "Ayşe Demir",
          position: "UI/UX Designer",
          performance: 88,
          tasksCompleted: 15,
          totalTasks: 18,
          lastActivity: "1 saat önce",
          status: "active"
        },
        {
          id: "emp_003",
          name: "Mehmet Kaya", 
          position: "Backend Developer",
          performance: 92,
          tasksCompleted: 22,
          totalTasks: 25,
          lastActivity: "30 dakika önce",
          status: "active"
        },
        {
          id: "emp_004",
          name: "Fatma Özkan",
          position: "QA Engineer", 
          performance: 90,
          tasksCompleted: 18,
          totalTasks: 20,
          lastActivity: "4 saat önce",
          status: "active"
        }
      ];

      res.json(teamMembers);
    } catch (error) {
      console.error("Error fetching department team:", error);
      res.status(500).json({ message: "Departman takımı bilgileri alınamadı" });
    }
  });

  app.get('/api/department-projects', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get department projects
      const projects = [
        {
          id: 1,
          name: "E-ticaret Platformu",
          progress: 75,
          deadline: "2024-12-15",
          teamSize: 5,
          budget: "850.000 TL",
          status: "progress",
          priority: "high",
          manager: "Ahmet Yılmaz"
        },
        {
          id: 2,
          name: "Mobil Uygulama Geliştirme",
          progress: 45,
          deadline: "2024-12-30", 
          teamSize: 3,
          budget: "620.000 TL",
          status: "progress",
          priority: "medium",
          manager: "Ayşe Demir"
        },
        {
          id: 3,
          name: "API Modernizasyonu",
          progress: 90,
          deadline: "2024-12-10",
          teamSize: 4,
          budget: "420.000 TL", 
          status: "nearly_complete",
          priority: "high",
          manager: "Mehmet Kaya"
        },
        {
          id: 4,
          name: "Database Optimizasyonu",
          progress: 25,
          deadline: "2024-12-20",
          teamSize: 2,
          budget: "180.000 TL",
          status: "early",
          priority: "low", 
          manager: "Fatma Özkan"
        }
      ];

      res.json(projects);
    } catch (error) {
      console.error("Error fetching department projects:", error);
      res.status(500).json({ message: "Departman projeleri alınamadı" });
    }
  });

  app.get('/api/pending-approvals', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get pending approvals for department manager
      const approvals = [
        {
          id: 1,
          type: "leave",
          employeeName: "Ahmet Yılmaz",
          requestType: "Yıllık İzin",
          startDate: "2024-12-20",
          endDate: "2024-12-25",
          days: 5,
          reason: "Aile ziyareti",
          submittedAt: "2024-12-10"
        },
        {
          id: 2,
          type: "expense",
          employeeName: "Ayşe Demir",
          requestType: "Seyahat Gideri",
          amount: "2.500 TL",
          description: "İstanbul müşteri ziyareti",
          category: "Ulaşım",
          submittedAt: "2024-12-11"
        },
        {
          id: 3,
          type: "overtime",
          employeeName: "Mehmet Kaya",
          requestType: "Fazla Mesai",
          date: "2024-12-09",
          hours: 4,
          reason: "Proje deadline",
          submittedAt: "2024-12-10"
        }
      ];

      res.json(approvals);
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
      res.status(500).json({ message: "Bekleyen onaylar alınamadı" });
    }
  });

  app.post('/api/approve-request', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { requestId, requestType, action, comments } = req.body;
      
      // Process approval/rejection
      const result = {
        id: requestId,
        status: action, // 'approved' or 'rejected'
        approvedBy: userId,
        approvedAt: new Date().toISOString(),
        comments: comments || ""
      };

      // Create audit log
      await storage.createAuditLog({
        action: `${requestType}_${action}`,
        resource: "approval_request",
        details: `${requestType} talebi ${action === 'approved' ? 'onaylandı' : 'reddedildi'}: ${comments}`,
        userId: userId,
        companyId: 753
      });

      res.json(result);
    } catch (error) {
      console.error("Error processing approval:", error);
      res.status(500).json({ message: "Onay işlemi gerçekleştirilemedi" });
    }
  });

  app.get('/api/department-analytics', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get department analytics data
      const analytics = {
        performanceMetrics: {
          averagePerformance: 89.2,
          topPerformer: "Ahmet Yılmaz",
          improvementNeeded: 1,
          monthlyTrend: [85, 87, 89, 92, 89]
        },
        productivityMetrics: {
          tasksCompleted: 156,
          tasksInProgress: 23,
          averageCompletionTime: "2.3 gün",
          monthlyProductivity: [92, 94, 89, 95, 93]
        },
        projectMetrics: {
          onTimeDelivery: 87,
          budgetAdherence: 93,
          qualityScore: 91,
          clientSatisfaction: 95
        },
        teamMetrics: {
          attendance: 96,
          turnoverRate: 8,
          trainingCompletion: 94,
          teamSatisfaction: 92
        }
      };

      res.json(analytics);
    } catch (error) {
      console.error("Error fetching department analytics:", error);
      res.status(500).json({ message: "Departman analitikleri alınamadı" });
    }
  });

  // HR Specialist specific endpoints
  app.get('/api/stats/hr-specialist', async (req: any, res) => {
    try {
      // Get HR specialist stats
      const stats = {
        totalApplications: 156,
        processedApplications: 124,
        pendingInterviews: 18,
        activeTrainings: 12,
        completedTasks: 89,
        pendingTasks: 7,
        monthlyHires: 8,
        employeesSupportedThisMonth: 45
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching HR specialist stats:", error);
      res.status(500).json({ message: "İK uzmanı istatistikleri alınamadı" });
    }
  });

  app.get('/api/tasks/hr-specialist', async (req: any, res) => {
    try {
      
      // Get HR specialist tasks
      const tasks = [
        {
          id: 1,
          title: "Yeni işe giriş evrakları hazırla",
          description: "3 yeni çalışan için evrak hazırlığı",
          priority: "high",
          dueDate: "2024-12-15",
          status: "pending",
          category: "onboarding"
        },
        {
          id: 2,
          title: "İzin belgesi işle",
          description: "5 adet izin talebi belgesi hazırla",
          priority: "medium",
          dueDate: "2024-12-14",
          status: "in_progress",
          category: "leave_management"
        },
        {
          id: 3,
          title: "Performans formları gözden geçir",
          description: "Q4 performans değerlendirme formları",
          priority: "high",
          dueDate: "2024-12-20",
          status: "pending",
          category: "performance"
        },
        {
          id: 4,
          title: "Eğitim koordinasyonu",
          description: "Liderlik eğitimi katılımcı listesi hazırla",
          priority: "low",
          dueDate: "2024-12-18",
          status: "completed",
          category: "training"
        }
      ];

      res.json(tasks);
    } catch (error) {
      console.error("Error fetching HR specialist tasks:", error);
      res.status(500).json({ message: "İK uzmanı görevleri alınamadı" });
    }
  });

  app.get('/api/hr-processes', async (req: any, res) => {
    try {
      
      // Get HR processes
      const processes = [
        {
          id: 1,
          name: "İşe Alım Süreci",
          description: "Yeni çalışan işe alım prosedürleri",
          steps: [
            "Başvuru değerlendirme",
            "İlk mülakat",
            "Teknik değerlendirme", 
            "Referans kontrolü",
            "Teklif sunma",
            "İşe başlama işlemleri"
          ],
          averageDuration: "14 gün",
          currentCases: 8
        },
        {
          id: 2,
          name: "İzin Yönetim Süreci",
          description: "Çalışan izin talep ve onay süreçleri",
          steps: [
            "İzin talebi oluşturma",
            "Departman müdürü onayı",
            "İK kontrolü",
            "Bordro bilgilendirme",
            "İzin belgesi hazırlama"
          ],
          averageDuration: "3 gün",
          currentCases: 12
        },
        {
          id: 3,
          name: "Performans Değerlendirme",
          description: "Çalışan performans değerlendirme süreci",
          steps: [
            "Hedef belirleme",
            "Dönemsel takip",
            "360 derece değerlendirme",
            "Sonuç analizi",
            "Gelişim planı oluşturma"
          ],
          averageDuration: "30 gün",
          currentCases: 25
        }
      ];

      res.json(processes);
    } catch (error) {
      console.error("Error fetching HR processes:", error);
      res.status(500).json({ message: "İK süreçleri alınamadı" });
    }
  });

  app.get('/api/personnel-affairs', async (req: any, res) => {
    try {
      
      // Get personnel affairs data
      const affairs = [
        {
          id: 1,
          employeeName: "Ahmet Yılmaz",
          type: "Bordro Düzeltme",
          description: "Ekim ayı fazla mesai eklenmesi",
          status: "pending",
          submittedDate: "2024-12-10",
          priority: "medium"
        },
        {
          id: 2,
          employeeName: "Ayşe Demir",
          type: "Adres Değişikliği",
          description: "İkamet adres güncelleme talebi",
          status: "completed",
          submittedDate: "2024-12-08",
          priority: "low"
        },
        {
          id: 3,
          employeeName: "Mehmet Kaya",
          type: "Sağlık Raporu",
          description: "10 günlük hastalık raporu kayıt",
          status: "in_review",
          submittedDate: "2024-12-11",
          priority: "high"
        },
        {
          id: 4,
          employeeName: "Fatma Özkan",
          type: "Terfi Başvurusu",
          description: "Senior pozisyona terfi talebi",
          status: "pending",
          submittedDate: "2024-12-09",
          priority: "high"
        }
      ];

      res.json(affairs);
    } catch (error) {
      console.error("Error fetching personnel affairs:", error);
      res.status(500).json({ message: "Özlük işleri alınamadı" });
    }
  });

  app.post('/api/complete-task', async (req: any, res) => {
    try {
      const { taskId, notes } = req.body;
      
      // Complete task
      const result = {
        id: taskId,
        status: 'completed',
        completedBy: "hr_specialist_002",
        completedAt: new Date().toISOString(),
        notes: notes || ""
      };

      // Create audit log
      await storage.createAuditLog({
        action: "task_completed",
        resource: "hr_task",
        details: `İK görevi tamamlandı: ${notes}`,
        userId: "hr_specialist_002",
        companyId: 753
      });

      res.json(result);
    } catch (error) {
      console.error("Error completing task:", error);
      res.status(500).json({ message: "Görev tamamlanamadı" });
    }
  });

  app.get('/api/training-coordination', async (req: any, res) => {
    try {
      
      // Get training coordination data
      const coordination = {
        activePrograms: [
          {
            id: 1,
            title: "Liderlik Geliştirme Programı",
            description: "Orta seviye yöneticiler için liderlik becerileri geliştirme",
            instructor: "Dr. Mehmet Özkan",
            startDate: "2024-12-20",
            endDate: "2025-01-15",
            duration: "4 hafta",
            participants: 15,
            maxCapacity: 20,
            location: "Eğitim Salonu A",
            status: "enrollment_open",
            budget: "45.000 TL",
            materials: ["Liderlik El Kitabı", "Vaka Analizi Dokümanları", "Değerlendirme Formları"],
            schedule: [
              { day: "Pazartesi", time: "09:00-12:00", topic: "Liderlik Temelleri" },
              { day: "Çarşamba", time: "14:00-17:00", topic: "Takım Yönetimi" },
              { day: "Cuma", time: "09:00-12:00", topic: "İletişim Becerileri" }
            ]
          },
          {
            id: 2,
            title: "Dijital Dönüşüm Eğitimi",
            description: "Tüm çalışanlar için dijital araçlar ve süreçler eğitimi",
            instructor: "Ayşe Kara",
            startDate: "2024-12-25",
            endDate: "2025-01-10",
            duration: "3 hafta",
            participants: 32,
            maxCapacity: 35,
            location: "Online",
            status: "ongoing",
            budget: "25.000 TL",
            materials: ["Dijital Araçlar Rehberi", "Online Platform Erişimi", "Sertifika"],
            schedule: [
              { day: "Salı", time: "10:00-12:00", topic: "Dijital Araçlara Giriş" },
              { day: "Perşembe", time: "14:00-16:00", topic: "Süreç Otomasyonu" },
              { day: "Cumartesi", time: "09:00-11:00", topic: "Veri Analizi Temelleri" }
            ]
          },
          {
            id: 3,
            title: "İletişim Becerileri Atölyesi",
            description: "Etkili iletişim teknikleri ve sunum becerileri",
            instructor: "Prof. Dr. Zeynep Yıldız",
            startDate: "2025-01-05",
            endDate: "2025-01-20",
            duration: "2 hafta",
            participants: 18,
            maxCapacity: 25,
            location: "Eğitim Salonu B",
            status: "planning",
            budget: "30.000 TL",
            materials: ["İletişim Teknikleri Kitabı", "Uygulama Videoları", "Geri Bildirim Formları"],
            schedule: [
              { day: "Pazartesi", time: "13:00-16:00", topic: "Etkili Dinleme" },
              { day: "Çarşamba", time: "13:00-16:00", topic: "Beden Dili" },
              { day: "Cuma", time: "13:00-16:00", topic: "Sunum Teknikleri" }
            ]
          }
        ],
        upcomingPrograms: [
          {
            id: 4,
            title: "Proje Yönetimi Sertifikasyonu",
            plannedStartDate: "2025-02-01",
            estimatedDuration: "6 hafta",
            targetParticipants: 20,
            status: "planning"
          },
          {
            id: 5,
            title: "Satış Teknikleri Eğitimi",
            plannedStartDate: "2025-02-15",
            estimatedDuration: "3 hafta",
            targetParticipants: 15,
            status: "budget_approval"
          }
        ],
        statistics: {
          totalParticipants: 65,
          completionRate: 87,
          satisfactionScore: 4.6,
          totalBudgetUsed: "100.000 TL",
          totalBudgetAllocated: "150.000 TL"
        }
      };

      res.json(coordination);
    } catch (error) {
      console.error("Error fetching training coordination:", error);
      res.status(500).json({ message: "Eğitim koordinasyonu verileri alınamadı" });
    }
  });

  // HR Manager specific endpoints
  app.get('/api/stats/hr-manager', async (req: any, res) => {
    try {
      // Get HR manager stats
      const stats = {
        totalEmployees: 156,
        pendingLeaves: 8,
        activeTrainings: 12,
        performanceAverage: 87,
        monthlyHires: 14,
        departmentCount: 8,
        satisfactionScore: 4.2,
        budgetUtilization: 78
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching HR manager stats:", error);
      res.status(500).json({ message: "İK müdürü istatistikleri alınamadı" });
    }
  });

  app.get('/api/hr-manager/strategic-goals', async (req: any, res) => {
    try {
      // Get strategic goals for HR manager
      const goals = [
        {
          id: 1,
          title: "Çalışan Memnuniyeti Artırma",
          description: "2024 yılında çalışan memnuniyet oranını %95'e çıkarma",
          progress: 87,
          status: "devam_ediyor",
          deadline: "2024-12-31",
          responsible: "İK Müdürü",
          priority: "yüksek",
          metrics: ["Memnuniyet anketleri", "Çıkış mülakatları", "Geri bildirim skorları"]
        },
        {
          id: 2,
          title: "İşe Alım Süreçlerini Optimize Etme",
          description: "İşe alım süresini 30 günden 21 güne düşürme",
          progress: 65,
          status: "devam_ediyor",
          deadline: "2024-11-30",
          responsible: "İK Uzmanları",
          priority: "yüksek",
          metrics: ["Ortalama işe alım süresi", "Başvuru-işe başlama oranı"]
        },
        {
          id: 3,
          title: "Çalışan Gelişim Programları",
          description: "Tüm çalışanlar için kişisel gelişim planları oluşturma",
          progress: 45,
          status: "planlama",
          deadline: "2025-03-31",
          responsible: "Eğitim Koordinatörü",
          priority: "orta",
          metrics: ["Gelişim planı tamamlama oranı", "Beceri geliştirme skorları"]
        }
      ];

      res.json(goals);
    } catch (error) {
      console.error("Error fetching strategic goals:", error);
      res.status(500).json({ message: "Stratejik hedefler alınamadı" });
    }
  });

  app.get('/api/hr-manager/department-overview', async (req: any, res) => {
    try {
      // Get department overview data
      const departments = [
        {
          id: 1,
          name: "Yazılım Geliştirme",
          employeeCount: 45,
          manager: "Ali Demir",
          performance: 92,
          satisfaction: 4.4,
          openPositions: 3,
          budget: "2.500.000 TL",
          budgetUsage: 78
        },
        {
          id: 2,
          name: "Pazarlama",
          employeeCount: 32,
          manager: "Ayşe Kaya",
          performance: 89,
          satisfaction: 4.2,
          openPositions: 2,
          budget: "1.800.000 TL",
          budgetUsage: 85
        },
        {
          id: 3,
          name: "Satış",
          employeeCount: 28,
          manager: "Mehmet Özkan",
          performance: 95,
          satisfaction: 4.6,
          openPositions: 4,
          budget: "2.200.000 TL",
          budgetUsage: 72
        },
        {
          id: 4,
          name: "İnsan Kaynakları",
          employeeCount: 12,
          manager: "Elif Çelik",
          performance: 88,
          satisfaction: 4.3,
          openPositions: 1,
          budget: "850.000 TL",
          budgetUsage: 65
        }
      ];

      res.json(departments);
    } catch (error) {
      console.error("Error fetching department overview:", error);
      res.status(500).json({ message: "Departman genel bakış alınamadı" });
    }
  });

  app.get('/api/hr-manager/activities', async (req: any, res) => {
    try {
      // Get recent HR activities
      const activities = [
        {
          id: 1,
          type: "leave_request",
          description: "Ahmet Yılmaz izin talebini gönderdi",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          priority: "normal",
          status: "pending"
        },
        {
          id: 2,
          type: "training_completed",
          description: "React Eğitimi tamamlandı",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          priority: "low",
          status: "completed"
        },
        {
          id: 3,
          type: "performance_review",
          description: "Yeni performans değerlendirmesi eklendi",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          priority: "high",
          status: "pending"
        },
        {
          id: 4,
          type: "new_hire",
          description: "Zeynep Aktaş işe başladı",
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          priority: "normal",
          status: "completed"
        }
      ];

      res.json(activities);
    } catch (error) {
      console.error("Error fetching HR activities:", error);
      res.status(500).json({ message: "İK aktiviteleri alınamadı" });
    }
  });

  app.get('/api/hr-manager/reports', async (req: any, res) => {
    try {
      // Get HR reports data
      const reports = {
        monthlyMetrics: {
          totalHires: 14,
          totalTerminations: 3,
          averageTimeToHire: 21,
          employeeTurnover: 5.2,
          trainingHours: 1250,
          performanceRating: 4.1
        },
        departmentMetrics: [
          { department: "Yazılım", headcount: 45, growth: 12, satisfaction: 4.4 },
          { department: "Pazarlama", headcount: 32, growth: 8, satisfaction: 4.2 },
          { department: "Satış", headcount: 28, growth: 15, satisfaction: 4.6 },
          { department: "İK", headcount: 12, growth: 5, satisfaction: 4.3 }
        ],
        budgetAnalysis: {
          totalBudget: 7350000,
          usedBudget: 5680000,
          remainingBudget: 1670000,
          utilizationRate: 77.3
        }
      };

      res.json(reports);
    } catch (error) {
      console.error("Error fetching HR reports:", error);
      res.status(500).json({ message: "İK raporları alınamadı" });
    }
  });

  app.post('/api/hr-manager/strategic-goal', async (req: any, res) => {
    try {
      const { title, description, deadline, responsible, priority, metrics } = req.body;
      
      // Create new strategic goal
      const newGoal = {
        id: Date.now(),
        title,
        description,
        progress: 0,
        status: "planlama",
        deadline,
        responsible,
        priority,
        metrics: metrics.split(',').map((m: string) => m.trim()),
        createdAt: new Date().toISOString()
      };

      // Create audit log
      await storage.createAuditLog({
        action: "strategic_goal_created",
        resource: "hr_strategy",
        details: `Yeni stratejik hedef oluşturuldu: ${title}`,
        userId: "hr_manager_002",
        companyId: 753
      });

      res.json(newGoal);
    } catch (error) {
      console.error("Error creating strategic goal:", error);
      res.status(500).json({ message: "Stratejik hedef oluşturulamadı" });
    }
  });

  app.put('/api/hr-manager/strategic-goal/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const { progress, status } = req.body;
      
      // Update strategic goal
      const updatedGoal = {
        id: parseInt(id),
        progress,
        status,
        updatedAt: new Date().toISOString()
      };

      // Create audit log
      await storage.createAuditLog({
        action: "strategic_goal_updated",
        resource: "hr_strategy",
        details: `Stratejik hedef güncellendi: ID ${id}`,
        userId: "hr_manager_002",
        companyId: 753
      });

      res.json(updatedGoal);
    } catch (error) {
      console.error("Error updating strategic goal:", error);
      res.status(500).json({ message: "Stratejik hedef güncellenemedi" });
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