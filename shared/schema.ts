import { pgTable, text, serial, integer, boolean, date, decimal, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  department: text("department").notNull(),
  position: text("position").notNull(),
  startDate: date("start_date").notNull(),
  salary: decimal("salary", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("active"), // active, on_leave, inactive
  performanceScore: decimal("performance_score", { precision: 3, scale: 1 }).default("0.0"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  managerId: integer("manager_id").references(() => employees.id),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  employeeCount: integer("employee_count").default(0),
});

export const leaves = pgTable("leaves", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  leaveType: text("leave_type").notNull(), // annual, sick, personal, maternity
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  days: integer("days").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  reason: text("reason"),
  approvedBy: integer("approved_by").references(() => employees.id),
  appliedAt: timestamp("applied_at").defaultNow(),
});

export const performance = pgTable("performance", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  reviewPeriod: text("review_period").notNull(), // Q1 2024, Q2 2024, etc.
  score: decimal("score", { precision: 3, scale: 1 }).notNull(),
  goals: text("goals"),
  achievements: text("achievements"),
  feedback: text("feedback"),
  reviewedBy: integer("reviewed_by").references(() => employees.id),
  reviewDate: timestamp("review_date").defaultNow(),
});

export const payroll = pgTable("payroll", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  month: text("month").notNull(), // 2024-11
  baseSalary: decimal("base_salary", { precision: 10, scale: 2 }).notNull(),
  bonuses: decimal("bonuses", { precision: 10, scale: 2 }).default("0.00"),
  deductions: decimal("deductions", { precision: 10, scale: 2 }).default("0.00"),
  netSalary: decimal("net_salary", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("payment_date"),
  status: text("status").notNull().default("pending"), // pending, paid, cancelled
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // employee_added, leave_approved, performance_reviewed, etc.
  description: text("description").notNull(),
  entityId: integer("entity_id"), // ID of related employee, leave, etc.
  performedBy: integer("performed_by").references(() => employees.id),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas
export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
});

export const insertLeaveSchema = createInsertSchema(leaves).omit({
  id: true,
  appliedAt: true,
});

export const insertPerformanceSchema = createInsertSchema(performance).omit({
  id: true,
  reviewDate: true,
});

export const insertPayrollSchema = createInsertSchema(payroll).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Leave = typeof leaves.$inferSelect;
export type InsertLeave = z.infer<typeof insertLeaveSchema>;
export type Performance = typeof performance.$inferSelect;
export type InsertPerformance = z.infer<typeof insertPerformanceSchema>;
export type Payroll = typeof payroll.$inferSelect;
export type InsertPayroll = z.infer<typeof insertPayrollSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
