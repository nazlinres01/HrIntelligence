import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // =============================================================================
  // AUTH ROUTES
  // =============================================================================
  
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Return mock user data for now
      res.json({
        id: userId,
        email: req.user.claims.email,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
        profileImageUrl: req.user.claims.profile_image_url,
        role: 'Admin',
        isActive: true,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // =============================================================================
  // ANALYTICS & STATISTICS ROUTES
  // =============================================================================

  app.get('/api/stats/dashboard', async (req, res) => {
    try {
      const stats = {
        totalEmployees: 1247,
        activeLeaves: 23,
        monthlyPayroll: "₺2,500,000",
        avgPerformance: "4.2",
        totalCompanies: 85,
        newEmployeesThisMonth: 23,
        performanceScore: 87.5,
        totalRevenue: "₺15,250,000",
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/stats/employees', async (req, res) => {
    try {
      const stats = {
        total: 1247,
        active: 1198,
        inactive: 49,
        newThisMonth: 23,
        avgAge: 32,
        avgTenure: 2.8,
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching employee stats:", error);
      res.status(500).json({ message: "Failed to fetch employee stats" });
    }
  });

  app.get('/api/stats/companies', async (req, res) => {
    try {
      const stats = {
        total: 85,
        active: 78,
        inactive: 7,
        growth: 12.5,
        avgEmployees: 45,
        totalRevenue: "₺125,000,000",
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching company stats:", error);
      res.status(500).json({ message: "Failed to fetch company stats" });
    }
  });

  app.get('/api/stats/leaves', async (req, res) => {
    try {
      const stats = {
        total: 324,
        pending: 23,
        approved: 287,
        rejected: 14,
        avgDuration: 5.2,
        mostCommonType: "Yıllık İzin",
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching leave stats:", error);
      res.status(500).json({ message: "Failed to fetch leave stats" });
    }
  });

  app.get('/api/stats/payroll', async (req, res) => {
    try {
      const stats = {
        totalAmount: "₺2,500,000",
        averageSalary: "₺8,500",
        processedThisMonth: 295,
        pendingPayments: 12,
        totalBenefits: "₺450,000",
        taxDeductions: "₺680,000",
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching payroll stats:", error);
      res.status(500).json({ message: "Failed to fetch payroll stats" });
    }
  });

  // =============================================================================
  // SYSTEM MONITORING ROUTES
  // =============================================================================

  app.get('/api/system/health', async (req, res) => {
    try {
      const health = {
        database: true,
        uptime: 99.8,
        activeUsers: 147,
        systemLoad: 34.2,
        memoryUsage: 68.5,
        diskUsage: 42.1,
        responseTime: 245,
      };
      res.json(health);
    } catch (error) {
      console.error("Error fetching system health:", error);
      res.status(500).json({ message: "Failed to fetch system health" });
    }
  });

  app.get('/api/system/metrics', async (req, res) => {
    try {
      const metrics = {
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
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching system metrics:", error);
      res.status(500).json({ message: "Failed to fetch system metrics" });
    }
  });

  app.get('/api/system/active-users', async (req, res) => {
    try {
      const users = Array.from({ length: 10 }, (_, i) => ({
        id: `user_${i + 1}`,
        name: `Kullanıcı ${i + 1}`,
        email: `user${i + 1}@example.com`,
        lastActive: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        role: ['Admin', 'İK Müdürü', 'İK Uzmanı', 'Departman Müdürü', 'Çalışan'][Math.floor(Math.random() * 5)],
      }));
      res.json(users);
    } catch (error) {
      console.error("Error fetching active users:", error);
      res.status(500).json({ message: "Failed to fetch active users" });
    }
  });

  app.get('/api/system/alerts', async (req, res) => {
    try {
      const alerts = [
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
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching system alerts:", error);
      res.status(500).json({ message: "Failed to fetch system alerts" });
    }
  });

  // =============================================================================
  // MOCK DATA ENDPOINTS FOR DEVELOPMENT
  // =============================================================================

  app.get('/api/companies', async (req, res) => {
    try {
      const companies = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Şirket ${i + 1}`,
        email: `info@sirket${i + 1}.com`,
        phone: `+90 212 ${String(i + 1).padStart(3, '0')} ${String(Math.floor(Math.random() * 90) + 10)} ${String(Math.floor(Math.random() * 90) + 10)}`,
        address: `İstanbul Adres ${i + 1}`,
        website: `https://sirket${i + 1}.com`,
        industry: ['Teknoloji', 'Finans', 'Sağlık', 'Eğitim', 'Perakende'][Math.floor(Math.random() * 5)],
        size: ['Küçük', 'Orta', 'Büyük'][Math.floor(Math.random() * 3)],
        foundedYear: 2000 + Math.floor(Math.random() * 24),
        totalEmployees: Math.floor(Math.random() * 500) + 50,
        isActive: Math.random() > 0.1,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get('/api/employees', async (req, res) => {
    try {
      const employees = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        companyId: Math.floor(Math.random() * 15) + 1,
        firstName: `Ad${i + 1}`,
        lastName: `Soyad${i + 1}`,
        email: `calisan${i + 1}@example.com`,
        phone: `+90 532 ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 90) + 10)} ${String(Math.floor(Math.random() * 90) + 10)}`,
        department: ['İK', 'Muhasebe', 'Satış', 'Pazarlama', 'IT'][Math.floor(Math.random() * 5)],
        position: ['Uzman', 'Müdür', 'Direktör', 'Koordinatör', 'Analyst'][Math.floor(Math.random() * 5)],
        startDate: new Date(Date.now() - Math.random() * 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        salary: String(Math.floor(Math.random() * 50000) + 15000),
        status: ['active', 'inactive'][Math.floor(Math.random() * 2)],
        managerId: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 1 : null,
        profileImageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.get('/api/activities', async (req, res) => {
    try {
      const activities = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        userId: `user_${Math.floor(Math.random() * 10) + 1}`,
        action: ['Giriş yaptı', 'Çıkış yaptı', 'Profil güncelledi', 'İzin talebi oluşturdu', 'Rapor oluşturdu'][Math.floor(Math.random() * 5)],
        details: `Sistem aktivitesi ${i + 1}`,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (compatible)',
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Security endpoints
  app.get('/api/security/metrics', (req, res) => {
    res.json({
      totalChecks: 45,
      passedChecks: 42,
      failedChecks: 3,
      securityScore: 93.3,
      lastScan: new Date().toISOString(),
      threatLevel: 'low',
      activeThreats: 2,
      blockedAttacks: 15,
      failedLogins: 8,
    });
  });

  app.get('/api/security/vulnerabilities', (req, res) => {
    res.json([
      {
        id: 1,
        title: 'Zayıf Parola Politikası',
        severity: 'medium',
        status: 'open',
        description: 'Bazı kullanıcılar zayıf parolalar kullanıyor',
        affectedUsers: 23,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Güncel Olmayan Yazılım',
        severity: 'low',
        status: 'reviewing',
        description: 'Sistem güncellemeleri beklemede',
        affectedUsers: 0,
        createdAt: new Date().toISOString(),
      },
    ]);
  });

  app.get('/api/security/alerts', (req, res) => {
    res.json([
      {
        id: 1,
        type: 'failed_login',
        message: 'Çoklu başarısız giriş denemesi tespit edildi',
        severity: 'high',
        timestamp: new Date().toISOString(),
        resolved: false,
      },
      {
        id: 2,
        type: 'suspicious_activity',
        message: 'Şüpheli kullanıcı aktivitesi',
        severity: 'medium',
        timestamp: new Date().toISOString(),
        resolved: true,
      },
    ]);
  });

  // System configuration endpoints
  app.get('/api/system/config', (req, res) => {
    res.json({
      maintenanceMode: false,
      allowRegistration: true,
      sessionTimeout: 30,
      maxFileUpload: 10,
      debugMode: false,
      backupEnabled: true,
      sslEnabled: true,
      apiRateLimit: 1000,
      cpuUsage: 34.2,
      memoryUsage: 68.5,
      diskUsage: 42.1,
    });
  });

  app.get('/api/system/performance-history', (req, res) => {
    const history = Array.from({ length: 24 }, (_, i) => ({
      time: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      disk: Math.floor(Math.random() * 100),
    }));
    res.json(history);
  });

  // Network and monitoring endpoints
  app.get('/api/system/network', (req, res) => {
    res.json({
      inbound: Math.floor(Math.random() * 1000),
      outbound: Math.floor(Math.random() * 1000),
      latency: Math.floor(Math.random() * 100),
    });
  });

  app.get('/api/system/status', (req, res) => {
    res.json({
      database: { status: 'healthy', responseTime: 45 },
      cache: { status: 'healthy', hitRate: 95.2 },
      storage: { status: 'healthy', freeSpace: '2.1 TB' },
      queue: { status: 'healthy', pendingJobs: 12 },
      api: { status: 'healthy', avgResponseTime: 120 },
      uptime: Math.floor(Math.random() * 100000),
      loadAverage: [1.2, 1.5, 1.8],
      cpuCores: 8,
    });
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}