import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmployeeSchema, insertLeaveSchema, insertPerformanceSchema, insertPayrollSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
