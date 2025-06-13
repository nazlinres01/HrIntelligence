import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-simple";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { 
  insertEmployeeSchema,
  insertDepartmentSchema,
  insertLeaveSchema,
  insertPerformanceSchema,
  insertPayrollSchema,
  insertNotificationSchema,
  insertJobSchema,
  insertJobApplicationSchema,
  insertTrainingSchema,
  insertCompanySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // =============================================================================
  // AUTH ROUTES
  // =============================================================================
  
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // =============================================================================
  // COMPANY MANAGEMENT ROUTES
  // =============================================================================

  app.get('/api/companies', async (req, res) => {
    try {
      const companies = await storage.getAllCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get('/api/companies/:id', async (req, res) => {
    try {
      const company = await storage.getCompany(parseInt(req.params.id));
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.post('/api/companies', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(validatedData);
      res.status(201).json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ message: "Failed to create company" });
    }
  });

  app.put('/api/companies/:id', isAuthenticated, async (req, res) => {
    try {
      const company = await storage.updateCompany(parseInt(req.params.id), req.body);
      res.json(company);
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ message: "Failed to update company" });
    }
  });

  app.delete('/api/companies/:id', isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteCompany(parseInt(req.params.id));
      if (success) {
        res.json({ message: "Company deleted successfully" });
      } else {
        res.status(404).json({ message: "Company not found" });
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      res.status(500).json({ message: "Failed to delete company" });
    }
  });

  // =============================================================================
  // EMPLOYEE MANAGEMENT ROUTES
  // =============================================================================

  app.get('/api/employees', async (req, res) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const employees = await storage.getEmployees(companyId);
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.get('/api/employees/:id', async (req, res) => {
    try {
      const employee = await storage.getEmployee(parseInt(req.params.id));
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      console.error("Error fetching employee:", error);
      res.status(500).json({ message: "Failed to fetch employee" });
    }
  });

  app.post('/api/employees', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(validatedData);
      res.status(201).json(employee);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ message: "Failed to create employee" });
    }
  });

  app.put('/api/employees/:id', isAuthenticated, async (req, res) => {
    try {
      const employee = await storage.updateEmployee(parseInt(req.params.id), req.body);
      res.json(employee);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Failed to update employee" });
    }
  });

  app.delete('/api/employees/:id', isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteEmployee(parseInt(req.params.id));
      if (success) {
        res.json({ message: "Employee deleted successfully" });
      } else {
        res.status(404).json({ message: "Employee not found" });
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  // =============================================================================
  // DEPARTMENT MANAGEMENT ROUTES
  // =============================================================================

  app.get('/api/departments', async (req, res) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const departments = await storage.getDepartments(companyId);
      res.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  app.get('/api/departments/:id', async (req, res) => {
    try {
      const department = await storage.getDepartment(parseInt(req.params.id));
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      res.json(department);
    } catch (error) {
      console.error("Error fetching department:", error);
      res.status(500).json({ message: "Failed to fetch department" });
    }
  });

  app.post('/api/departments', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertDepartmentSchema.parse(req.body);
      const department = await storage.createDepartment(validatedData);
      res.status(201).json(department);
    } catch (error) {
      console.error("Error creating department:", error);
      res.status(500).json({ message: "Failed to create department" });
    }
  });

  app.put('/api/departments/:id', isAuthenticated, async (req, res) => {
    try {
      const department = await storage.updateDepartment(parseInt(req.params.id), req.body);
      res.json(department);
    } catch (error) {
      console.error("Error updating department:", error);
      res.status(500).json({ message: "Failed to update department" });
    }
  });

  app.delete('/api/departments/:id', isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteDepartment(parseInt(req.params.id));
      if (success) {
        res.json({ message: "Department deleted successfully" });
      } else {
        res.status(404).json({ message: "Department not found" });
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      res.status(500).json({ message: "Failed to delete department" });
    }
  });

  // =============================================================================
  // LEAVE MANAGEMENT ROUTES
  // =============================================================================

  app.get('/api/leaves', async (req, res) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const leaves = await storage.getLeaves(companyId);
      res.json(leaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      res.status(500).json({ message: "Failed to fetch leaves" });
    }
  });

  app.get('/api/leaves/employee/:employeeId', async (req, res) => {
    try {
      const leaves = await storage.getLeavesByEmployee(parseInt(req.params.employeeId));
      res.json(leaves);
    } catch (error) {
      console.error("Error fetching employee leaves:", error);
      res.status(500).json({ message: "Failed to fetch employee leaves" });
    }
  });

  app.post('/api/leaves', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertLeaveSchema.parse(req.body);
      const leave = await storage.createLeave(validatedData);
      res.status(201).json(leave);
    } catch (error) {
      console.error("Error creating leave:", error);
      res.status(500).json({ message: "Failed to create leave" });
    }
  });

  app.put('/api/leaves/:id', isAuthenticated, async (req, res) => {
    try {
      const leave = await storage.updateLeave(parseInt(req.params.id), req.body);
      res.json(leave);
    } catch (error) {
      console.error("Error updating leave:", error);
      res.status(500).json({ message: "Failed to update leave" });
    }
  });

  app.put('/api/leaves/:id/approve', isAuthenticated, async (req, res) => {
    try {
      const leave = await storage.approveLeave(parseInt(req.params.id), parseInt(req.body.approvedBy));
      res.json(leave);
    } catch (error) {
      console.error("Error approving leave:", error);
      res.status(500).json({ message: "Failed to approve leave" });
    }
  });

  app.put('/api/leaves/:id/reject', isAuthenticated, async (req, res) => {
    try {
      const leave = await storage.rejectLeave(parseInt(req.params.id), parseInt(req.body.approvedBy));
      res.json(leave);
    } catch (error) {
      console.error("Error rejecting leave:", error);
      res.status(500).json({ message: "Failed to reject leave" });
    }
  });

  // =============================================================================
  // PERFORMANCE MANAGEMENT ROUTES
  // =============================================================================

  app.get('/api/performance', async (req, res) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const performance = await storage.getPerformanceRecords(companyId);
      res.json(performance);
    } catch (error) {
      console.error("Error fetching performance records:", error);
      res.status(500).json({ message: "Failed to fetch performance records" });
    }
  });

  app.get('/api/performance/employee/:employeeId', async (req, res) => {
    try {
      const performance = await storage.getPerformanceByEmployee(parseInt(req.params.employeeId));
      res.json(performance);
    } catch (error) {
      console.error("Error fetching employee performance:", error);
      res.status(500).json({ message: "Failed to fetch employee performance" });
    }
  });

  app.post('/api/performance', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPerformanceSchema.parse(req.body);
      const performance = await storage.createPerformance(validatedData);
      res.status(201).json(performance);
    } catch (error) {
      console.error("Error creating performance record:", error);
      res.status(500).json({ message: "Failed to create performance record" });
    }
  });

  app.put('/api/performance/:id', isAuthenticated, async (req, res) => {
    try {
      const performance = await storage.updatePerformance(parseInt(req.params.id), req.body);
      res.json(performance);
    } catch (error) {
      console.error("Error updating performance record:", error);
      res.status(500).json({ message: "Failed to update performance record" });
    }
  });

  // =============================================================================
  // PAYROLL MANAGEMENT ROUTES
  // =============================================================================

  app.get('/api/payroll', async (req, res) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const payroll = await storage.getPayrollRecords(companyId);
      res.json(payroll);
    } catch (error) {
      console.error("Error fetching payroll records:", error);
      res.status(500).json({ message: "Failed to fetch payroll records" });
    }
  });

  app.get('/api/payroll/employee/:employeeId', async (req, res) => {
    try {
      const payroll = await storage.getPayrollByEmployee(parseInt(req.params.employeeId));
      res.json(payroll);
    } catch (error) {
      console.error("Error fetching employee payroll:", error);
      res.status(500).json({ message: "Failed to fetch employee payroll" });
    }
  });

  app.post('/api/payroll', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPayrollSchema.parse(req.body);
      const payroll = await storage.createPayroll(validatedData);
      res.status(201).json(payroll);
    } catch (error) {
      console.error("Error creating payroll record:", error);
      res.status(500).json({ message: "Failed to create payroll record" });
    }
  });

  app.put('/api/payroll/:id', isAuthenticated, async (req, res) => {
    try {
      const payroll = await storage.updatePayroll(parseInt(req.params.id), req.body);
      res.json(payroll);
    } catch (error) {
      console.error("Error updating payroll record:", error);
      res.status(500).json({ message: "Failed to update payroll record" });
    }
  });

  // =============================================================================
  // JOB MANAGEMENT ROUTES
  // =============================================================================

  app.get('/api/jobs', async (req, res) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const jobs = await storage.getJobs(companyId);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const job = await storage.getJob(parseInt(req.params.id));
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.post('/api/jobs', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(validatedData);
      res.status(201).json(job);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  app.put('/api/jobs/:id', isAuthenticated, async (req, res) => {
    try {
      const job = await storage.updateJob(parseInt(req.params.id), req.body);
      res.json(job);
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ message: "Failed to update job" });
    }
  });

  app.delete('/api/jobs/:id', isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteJob(parseInt(req.params.id));
      if (success) {
        res.json({ message: "Job deleted successfully" });
      } else {
        res.status(404).json({ message: "Job not found" });
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ message: "Failed to delete job" });
    }
  });

  // =============================================================================
  // JOB APPLICATION ROUTES
  // =============================================================================

  app.get('/api/job-applications', async (req, res) => {
    try {
      const jobId = req.query.jobId ? parseInt(req.query.jobId as string) : undefined;
      const applications = await storage.getJobApplications(jobId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      res.status(500).json({ message: "Failed to fetch job applications" });
    }
  });

  app.post('/api/job-applications', async (req, res) => {
    try {
      const validatedData = insertJobApplicationSchema.parse(req.body);
      const application = await storage.createJobApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating job application:", error);
      res.status(500).json({ message: "Failed to create job application" });
    }
  });

  app.put('/api/job-applications/:id', isAuthenticated, async (req, res) => {
    try {
      const application = await storage.updateJobApplication(parseInt(req.params.id), req.body);
      res.json(application);
    } catch (error) {
      console.error("Error updating job application:", error);
      res.status(500).json({ message: "Failed to update job application" });
    }
  });

  // =============================================================================
  // TRAINING MANAGEMENT ROUTES
  // =============================================================================

  app.get('/api/trainings', async (req, res) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const trainings = await storage.getTrainingPrograms(companyId);
      res.json(trainings);
    } catch (error) {
      console.error("Error fetching trainings:", error);
      res.status(500).json({ message: "Failed to fetch trainings" });
    }
  });

  app.post('/api/trainings', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTrainingSchema.parse(req.body);
      const training = await storage.createTrainingProgram(validatedData);
      res.status(201).json(training);
    } catch (error) {
      console.error("Error creating training:", error);
      res.status(500).json({ message: "Failed to create training" });
    }
  });

  app.put('/api/trainings/:id', isAuthenticated, async (req, res) => {
    try {
      const training = await storage.updateTrainingProgram(parseInt(req.params.id), req.body);
      res.json(training);
    } catch (error) {
      console.error("Error updating training:", error);
      res.status(500).json({ message: "Failed to update training" });
    }
  });

  app.delete('/api/trainings/:id', isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteTrainingProgram(parseInt(req.params.id));
      if (success) {
        res.json({ message: "Training deleted successfully" });
      } else {
        res.status(404).json({ message: "Training not found" });
      }
    } catch (error) {
      console.error("Error deleting training:", error);
      res.status(500).json({ message: "Failed to delete training" });
    }
  });

  // =============================================================================
  // NOTIFICATION ROUTES
  // =============================================================================

  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const notifications = await storage.getUserNotifications(userId, limit);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get('/api/notifications/unread-count', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });

  app.put('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await storage.markNotificationAsRead(parseInt(req.params.id), userId);
      if (success) {
        res.json({ message: "Notification marked as read" });
      } else {
        res.status(404).json({ message: "Notification not found" });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.put('/api/notifications/read-all', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await storage.markAllNotificationsAsRead(userId);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  // =============================================================================
  // ANALYTICS & STATISTICS ROUTES
  // =============================================================================

  app.get('/api/stats/dashboard', async (req, res) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const stats = await storage.getDashboardStats(companyId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/stats/employees', async (req, res) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const stats = await storage.getEmployeeStats(companyId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching employee stats:", error);
      res.status(500).json({ message: "Failed to fetch employee stats" });
    }
  });

  app.get('/api/stats/companies', async (req, res) => {
    try {
      const stats = await storage.getCompanyStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching company stats:", error);
      res.status(500).json({ message: "Failed to fetch company stats" });
    }
  });

  app.get('/api/stats/leaves', async (req, res) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const stats = await storage.getLeaveStats(companyId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching leave stats:", error);
      res.status(500).json({ message: "Failed to fetch leave stats" });
    }
  });

  app.get('/api/stats/payroll', async (req, res) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const stats = await storage.getPayrollStats(companyId);
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
      const health = await storage.getSystemHealth();
      res.json(health);
    } catch (error) {
      console.error("Error fetching system health:", error);
      res.status(500).json({ message: "Failed to fetch system health" });
    }
  });

  app.get('/api/system/metrics', async (req, res) => {
    try {
      const metrics = await storage.getSystemMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching system metrics:", error);
      res.status(500).json({ message: "Failed to fetch system metrics" });
    }
  });

  app.get('/api/system/active-users', async (req, res) => {
    try {
      const users = await storage.getActiveUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching active users:", error);
      res.status(500).json({ message: "Failed to fetch active users" });
    }
  });

  app.get('/api/system/alerts', async (req, res) => {
    try {
      const alerts = await storage.getSystemAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching system alerts:", error);
      res.status(500).json({ message: "Failed to fetch system alerts" });
    }
  });

  // =============================================================================
  // ACTIVITY & AUDIT LOG ROUTES
  // =============================================================================

  app.get('/api/activities', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const activities = await storage.getActivities(limit, companyId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get('/api/audit-logs', isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const logs = await storage.getAuditLogs(limit, companyId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}