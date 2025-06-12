import type { Express } from "express";
import { createServer, type Server } from "http";
import { mongoStorage } from "./storage-mongo";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await mongoStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Company Management Routes
  app.get('/api/companies', isAuthenticated, async (req, res) => {
    try {
      const companies = await mongoStorage.getAllCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get('/api/companies/:id', isAuthenticated, async (req, res) => {
    try {
      const company = await mongoStorage.getCompany(req.params.id);
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
      const company = await mongoStorage.createCompany(req.body);
      res.status(201).json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ message: "Failed to create company" });
    }
  });

  app.put('/api/companies/:id', isAuthenticated, async (req, res) => {
    try {
      const company = await mongoStorage.updateCompany(req.params.id, req.body);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ message: "Failed to update company" });
    }
  });

  // Department Management Routes
  app.get('/api/departments', isAuthenticated, async (req, res) => {
    try {
      const departments = await mongoStorage.getDepartments();
      res.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  app.get('/api/departments/:id', isAuthenticated, async (req, res) => {
    try {
      const department = await mongoStorage.getDepartment(req.params.id);
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
      const department = await mongoStorage.createDepartment(req.body);
      res.status(201).json(department);
    } catch (error) {
      console.error("Error creating department:", error);
      res.status(500).json({ message: "Failed to create department" });
    }
  });

  app.put('/api/departments/:id', isAuthenticated, async (req, res) => {
    try {
      const department = await mongoStorage.updateDepartment(req.params.id, req.body);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      res.json(department);
    } catch (error) {
      console.error("Error updating department:", error);
      res.status(500).json({ message: "Failed to update department" });
    }
  });

  app.delete('/api/departments/:id', isAuthenticated, async (req, res) => {
    try {
      const success = await mongoStorage.deleteDepartment(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Department not found" });
      }
      res.json({ message: "Department deleted successfully" });
    } catch (error) {
      console.error("Error deleting department:", error);
      res.status(500).json({ message: "Failed to delete department" });
    }
  });

  // User Management Routes
  app.get('/api/users', isAuthenticated, async (req, res) => {
    try {
      // For now, we'll return employees as users since they're linked
      const employees = await mongoStorage.getEmployees();
      res.json(employees);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Employee Management Routes
  app.get('/api/employees', isAuthenticated, async (req, res) => {
    try {
      const employees = await mongoStorage.getEmployees();
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.get('/api/employees/:id', isAuthenticated, async (req, res) => {
    try {
      const employee = await mongoStorage.getEmployee(req.params.id);
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
      const employee = await mongoStorage.createEmployee(req.body);
      res.status(201).json(employee);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ message: "Failed to create employee" });
    }
  });

  app.put('/api/employees/:id', isAuthenticated, async (req, res) => {
    try {
      const employee = await mongoStorage.updateEmployee(req.params.id, req.body);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Failed to update employee" });
    }
  });

  app.delete('/api/employees/:id', isAuthenticated, async (req, res) => {
    try {
      const success = await mongoStorage.deleteEmployee(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  // Recruitment Routes
  app.get('/api/recruitment', isAuthenticated, async (req, res) => {
    try {
      const jobs = await mongoStorage.getRecruitmentJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching recruitment jobs:", error);
      res.status(500).json({ message: "Failed to fetch recruitment jobs" });
    }
  });

  app.get('/api/recruitment/:id', isAuthenticated, async (req, res) => {
    try {
      const job = await mongoStorage.getRecruitmentJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching recruitment job:", error);
      res.status(500).json({ message: "Failed to fetch recruitment job" });
    }
  });

  app.post('/api/recruitment', isAuthenticated, async (req, res) => {
    try {
      const job = await mongoStorage.createRecruitmentJob(req.body);
      res.status(201).json(job);
    } catch (error) {
      console.error("Error creating recruitment job:", error);
      res.status(500).json({ message: "Failed to create recruitment job" });
    }
  });

  app.put('/api/recruitment/:id', isAuthenticated, async (req, res) => {
    try {
      const job = await mongoStorage.updateRecruitmentJob(req.params.id, req.body);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error updating recruitment job:", error);
      res.status(500).json({ message: "Failed to update recruitment job" });
    }
  });

  app.delete('/api/recruitment/:id', isAuthenticated, async (req, res) => {
    try {
      const success = await mongoStorage.deleteRecruitmentJob(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      console.error("Error deleting recruitment job:", error);
      res.status(500).json({ message: "Failed to delete recruitment job" });
    }
  });

  app.post('/api/recruitment/:id/applications', isAuthenticated, async (req, res) => {
    try {
      const job = await mongoStorage.addJobApplication(req.params.id, req.body);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.status(201).json(job);
    } catch (error) {
      console.error("Error adding job application:", error);
      res.status(500).json({ message: "Failed to add job application" });
    }
  });

  // Performance Management Routes
  app.get('/api/performance', isAuthenticated, async (req, res) => {
    try {
      const records = await mongoStorage.getPerformanceRecords();
      res.json(records);
    } catch (error) {
      console.error("Error fetching performance records:", error);
      res.status(500).json({ message: "Failed to fetch performance records" });
    }
  });

  app.get('/api/performance/employee/:employeeId', isAuthenticated, async (req, res) => {
    try {
      const records = await mongoStorage.getPerformanceByEmployee(req.params.employeeId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching employee performance:", error);
      res.status(500).json({ message: "Failed to fetch employee performance" });
    }
  });

  app.post('/api/performance', isAuthenticated, async (req, res) => {
    try {
      const performance = await mongoStorage.createPerformance(req.body);
      res.status(201).json(performance);
    } catch (error) {
      console.error("Error creating performance record:", error);
      res.status(500).json({ message: "Failed to create performance record" });
    }
  });

  app.put('/api/performance/:id', isAuthenticated, async (req, res) => {
    try {
      const performance = await mongoStorage.updatePerformance(req.params.id, req.body);
      if (!performance) {
        return res.status(404).json({ message: "Performance record not found" });
      }
      res.json(performance);
    } catch (error) {
      console.error("Error updating performance record:", error);
      res.status(500).json({ message: "Failed to update performance record" });
    }
  });

  // Payroll Management Routes
  app.get('/api/payroll', isAuthenticated, async (req, res) => {
    try {
      const records = await mongoStorage.getPayrollRecords();
      res.json(records);
    } catch (error) {
      console.error("Error fetching payroll records:", error);
      res.status(500).json({ message: "Failed to fetch payroll records" });
    }
  });

  app.get('/api/payroll/employee/:employeeId', isAuthenticated, async (req, res) => {
    try {
      const records = await mongoStorage.getPayrollByEmployee(req.params.employeeId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching employee payroll:", error);
      res.status(500).json({ message: "Failed to fetch employee payroll" });
    }
  });

  app.post('/api/payroll', isAuthenticated, async (req, res) => {
    try {
      const payroll = await mongoStorage.createPayroll(req.body);
      res.status(201).json(payroll);
    } catch (error) {
      console.error("Error creating payroll record:", error);
      res.status(500).json({ message: "Failed to create payroll record" });
    }
  });

  app.put('/api/payroll/:id', isAuthenticated, async (req, res) => {
    try {
      const payroll = await mongoStorage.updatePayroll(req.params.id, req.body);
      if (!payroll) {
        return res.status(404).json({ message: "Payroll record not found" });
      }
      res.json(payroll);
    } catch (error) {
      console.error("Error updating payroll record:", error);
      res.status(500).json({ message: "Failed to update payroll record" });
    }
  });

  // Leave Management Routes
  app.get('/api/leaves', isAuthenticated, async (req, res) => {
    try {
      const leaves = await mongoStorage.getLeaves();
      res.json(leaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      res.status(500).json({ message: "Failed to fetch leaves" });
    }
  });

  app.get('/api/leaves/employee/:employeeId', isAuthenticated, async (req, res) => {
    try {
      const leaves = await mongoStorage.getLeavesByEmployee(req.params.employeeId);
      res.json(leaves);
    } catch (error) {
      console.error("Error fetching employee leaves:", error);
      res.status(500).json({ message: "Failed to fetch employee leaves" });
    }
  });

  app.post('/api/leaves', isAuthenticated, async (req, res) => {
    try {
      const leave = await mongoStorage.createLeave(req.body);
      res.status(201).json(leave);
    } catch (error) {
      console.error("Error creating leave record:", error);
      res.status(500).json({ message: "Failed to create leave record" });
    }
  });

  app.put('/api/leaves/:id', isAuthenticated, async (req, res) => {
    try {
      const leave = await mongoStorage.updateLeave(req.params.id, req.body);
      if (!leave) {
        return res.status(404).json({ message: "Leave record not found" });
      }
      res.json(leave);
    } catch (error) {
      console.error("Error updating leave record:", error);
      res.status(500).json({ message: "Failed to update leave record" });
    }
  });

  // Analytics and Stats Routes
  app.get('/api/stats/employees', isAuthenticated, async (req, res) => {
    try {
      const stats = await mongoStorage.getEmployeeStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching employee stats:", error);
      res.status(500).json({ message: "Failed to fetch employee stats" });
    }
  });

  app.get('/api/stats/departments', isAuthenticated, async (req, res) => {
    try {
      const stats = await mongoStorage.getDepartmentStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching department stats:", error);
      res.status(500).json({ message: "Failed to fetch department stats" });
    }
  });

  app.get('/api/stats/company', isAuthenticated, async (req, res) => {
    try {
      const stats = await mongoStorage.getCompanyStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching company stats:", error);
      res.status(500).json({ message: "Failed to fetch company stats" });
    }
  });

  // Activity and Audit Routes
  app.get('/api/activities', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await mongoStorage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post('/api/activities', isAuthenticated, async (req, res) => {
    try {
      const activity = await mongoStorage.createActivity(req.body);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  app.get('/api/audit-logs', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await mongoStorage.getAuditLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  app.post('/api/audit-logs', isAuthenticated, async (req, res) => {
    try {
      const log = await mongoStorage.createAuditLog(req.body);
      res.status(201).json(log);
    } catch (error) {
      console.error("Error creating audit log:", error);
      res.status(500).json({ message: "Failed to create audit log" });
    }
  });

  // Notification Routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 50;
      const notifications = await mongoStorage.getUserNotifications(userId, limit);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get('/api/notifications/unread-count', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const count = await mongoStorage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });

  app.post('/api/notifications', isAuthenticated, async (req, res) => {
    try {
      const notification = await mongoStorage.createNotification(req.body);
      res.status(201).json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.put('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await mongoStorage.markNotificationAsRead(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.put('/api/notifications/read-all', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await mongoStorage.markAllNotificationsAsRead(userId);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  app.delete('/api/notifications/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await mongoStorage.deleteNotification(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json({ message: "Notification deleted" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Failed to delete notification" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}