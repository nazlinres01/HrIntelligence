import { pgTable, text, serial, integer, boolean, date, decimal, timestamp, varchar, jsonb, index, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

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

// Company table for multi-tenancy
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  industry: varchar("industry"),
  size: varchar("size"), // startup, small, medium, large, enterprise
  description: text("description"),
  address: text("address"),
  phone: varchar("phone"),
  email: varchar("email"),
  website: varchar("website"),
  taxNumber: varchar("tax_number"),
  employeeCount: integer("employee_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User storage table for authentication with company association
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  companyId: integer("company_id").references(() => companies.id),
  role: varchar("role").notNull().default("employee"), // admin, hr_manager, hr_specialist, department_manager, employee
  password: varchar("password").notNull(),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Strategic Goals table for HR management
export const strategicGoals = pgTable("strategic_goals", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  progress: integer("progress").default(0), // 0-100
  status: varchar("status").default("planning"), // planning, active, on_track, at_risk, completed, cancelled
  priority: varchar("priority").default("medium"), // low, medium, high, critical
  deadline: date("deadline"),
  responsible: varchar("responsible"),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  metrics: jsonb("metrics"), // Array of success metrics
  team: jsonb("team"), // Array of team member IDs
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// HR Analytics table for tracking key metrics
export const hrAnalytics = pgTable("hr_analytics", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  metricType: varchar("metric_type").notNull(), // turnover_rate, satisfaction_score, time_to_hire, etc.
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  period: varchar("period").notNull(), // YYYY-MM format
  target: decimal("target", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  department: text("department").notNull(),
  position: text("position").notNull(),
  startDate: date("start_date").notNull(),
  salary: decimal("salary", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("active"), // active, on_leave, inactive
  performanceScore: decimal("performance_score", { precision: 3, scale: 1 }).default("0.0"),
  profileImage: text("profile_image"),
  address: text("address"),
  emergencyContact: text("emergency_contact"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  managerId: integer("manager_id").references(() => employees.id),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  employeeCount: integer("employee_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  metadata: text("metadata"), // JSON string for additional data
  timestamp: timestamp("timestamp").defaultNow(),
});

// Settings storage for real-time persistence
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: varchar("category", { length: 100 }).notNull(),
  key: varchar("key", { length: 200 }).notNull(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull().default("info"), // info, success, warning, error
  isRead: boolean("is_read").notNull().default(false),
  actionUrl: varchar("action_url"),
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at"),
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

// Types
export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
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
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Audit log table for tracking all user actions
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  action: varchar("action").notNull(), // login, logout, create_leave, approve_leave, etc.
  resource: varchar("resource").notNull(), // user, leave, employee, etc.
  resourceId: varchar("resource_id"), // ID of the affected resource
  details: jsonb("details"), // Additional context about the action
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  companyId: integer("company_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Time entries table for employee time tracking
export const timeEntries = pgTable("time_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  breakMinutes: integer("break_minutes").default(0),
  description: text("description"),
  status: varchar("status").default("pending"), // pending, approved, rejected
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Expense reports table
export const expenseReports = pgTable("expense_reports", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  description: varchar("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category").notNull(),
  date: date("date").notNull(),
  receiptUrl: varchar("receipt_url"),
  status: varchar("status").default("pending"), // pending, approved, rejected
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages table for internal communication
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  fromUserId: varchar("from_user_id").notNull(),
  toUserId: varchar("to_user_id").notNull(),
  subject: varchar("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export const insertTimeEntrySchema = createInsertSchema(timeEntries).omit({
  id: true,
  createdAt: true,
  approvedAt: true,
});

export const insertExpenseReportSchema = createInsertSchema(expenseReports).omit({
  id: true,
  createdAt: true,
});

// Training programs table
export const trainings = pgTable("trainings", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  instructor: varchar("instructor"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  duration: integer("duration"), // in hours
  capacity: integer("capacity").default(50),
  enrolledCount: integer("enrolled_count").default(0),
  status: varchar("status").default("planned"), // planned, ongoing, completed, cancelled
  category: varchar("category").notNull(), // technical, leadership, compliance, etc.
  cost: decimal("cost", { precision: 10, scale: 2 }).default("0.00"),
  location: varchar("location"),
  materials: text("materials"),
  requirements: text("requirements"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Training enrollments table
export const trainingEnrollments = pgTable("training_enrollments", {
  id: serial("id").primaryKey(),
  trainingId: integer("training_id").references(() => trainings.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  status: varchar("status").default("enrolled"), // enrolled, completed, cancelled
  completedAt: timestamp("completed_at"),
  feedback: text("feedback"),
  rating: integer("rating"), // 1-5 stars
});

export const insertTrainingSchema = createInsertSchema(trainings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrainingEnrollmentSchema = createInsertSchema(trainingEnrollments).omit({
  id: true,
  enrolledAt: true,
  completedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type TimeEntry = typeof timeEntries.$inferSelect;
export type InsertTimeEntry = z.infer<typeof insertTimeEntrySchema>;
export type ExpenseReport = typeof expenseReports.$inferSelect;
export type InsertExpenseReport = z.infer<typeof insertExpenseReportSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Training = typeof trainings.$inferSelect;
export type InsertTraining = z.infer<typeof insertTrainingSchema>;
export type TrainingEnrollment = typeof trainingEnrollments.$inferSelect;
export type InsertTrainingEnrollment = z.infer<typeof insertTrainingEnrollmentSchema>;



// =============================================================================
// DATABASE RELATIONS - Complete Relational Mapping
// =============================================================================

// Company Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  users: many(users),
  employees: many(employees),
  departments: many(departments),
  strategicGoals: many(strategicGoals),
  hrAnalytics: many(hrAnalytics),
  trainings: many(trainings),
  jobs: many(jobs),
}));

// User Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
  createdGoals: many(strategicGoals),
  settings: many(settings),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
  timeEntries: many(timeEntries),
  expenseReports: many(expenseReports),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  trainingEnrollments: many(trainingEnrollments),
  jobApplications: many(jobApplications),
}));

// Employee Relations
export const employeesRelations = relations(employees, ({ one, many }) => ({
  company: one(companies, {
    fields: [employees.companyId],
    references: [companies.id],
  }),
  department: one(departments, {
    fields: [employees.department],
    references: [departments.name],
  }),
  managedDepartments: many(departments),
  leaves: many(leaves),
  performanceRecords: many(performance),
  payrollRecords: many(payroll),
  activitiesPerformed: many(activities),
  approvedLeaves: many(leaves, { relationName: "approvedLeaves" }),
  reviewsGiven: many(performance, { relationName: "reviewsGiven" }),
}));

// Department Relations
export const departmentsRelations = relations(departments, ({ one, many }) => ({
  company: one(companies, {
    fields: [departments.companyId],
    references: [companies.id],
  }),
  manager: one(employees, {
    fields: [departments.managerId],
    references: [employees.id],
  }),
  employees: many(employees),
}));

// Strategic Goals Relations
export const strategicGoalsRelations = relations(strategicGoals, ({ one }) => ({
  company: one(companies, {
    fields: [strategicGoals.companyId],
    references: [companies.id],
  }),
  creator: one(users, {
    fields: [strategicGoals.createdBy],
    references: [users.id],
  }),
}));

// HR Analytics Relations
export const hrAnalyticsRelations = relations(hrAnalytics, ({ one }) => ({
  company: one(companies, {
    fields: [hrAnalytics.companyId],
    references: [companies.id],
  }),
}));

// Leave Relations
export const leavesRelations = relations(leaves, ({ one }) => ({
  employee: one(employees, {
    fields: [leaves.employeeId],
    references: [employees.id],
  }),
  approver: one(employees, {
    fields: [leaves.approvedBy],
    references: [employees.id],
  }),
}));

// Performance Relations
export const performanceRelations = relations(performance, ({ one }) => ({
  employee: one(employees, {
    fields: [performance.employeeId],
    references: [employees.id],
  }),
  reviewer: one(employees, {
    fields: [performance.reviewedBy],
    references: [employees.id],
  }),
}));

// Payroll Relations
export const payrollRelations = relations(payroll, ({ one }) => ({
  employee: one(employees, {
    fields: [payroll.employeeId],
    references: [employees.id],
  }),
}));

// Activity Relations
export const activitiesRelations = relations(activities, ({ one }) => ({
  performer: one(employees, {
    fields: [activities.performedBy],
    references: [employees.id],
  }),
}));

// Settings Relations
export const settingsRelations = relations(settings, ({ one }) => ({
  user: one(users, {
    fields: [settings.userId],
    references: [users.id],
  }),
}));

// Notification Relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// Audit Log Relations
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// Time Entry Relations
export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  user: one(users, {
    fields: [timeEntries.userId],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [timeEntries.approvedBy],
    references: [users.id],
  }),
}));

// Expense Report Relations
export const expenseReportsRelations = relations(expenseReports, ({ one }) => ({
  user: one(users, {
    fields: [expenseReports.userId],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [expenseReports.approvedBy],
    references: [users.id],
  }),
}));

// Message Relations
export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.fromUserId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  recipient: one(users, {
    fields: [messages.toUserId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
}));

// Training Relations
export const trainingsRelations = relations(trainings, ({ one, many }) => ({
  company: one(companies, {
    fields: [trainings.companyId],
    references: [companies.id],
  }),
  enrollments: many(trainingEnrollments),
}));

// Training Enrollment Relations
export const trainingEnrollmentsRelations = relations(trainingEnrollments, ({ one }) => ({
  training: one(trainings, {
    fields: [trainingEnrollments.trainingId],
    references: [trainings.id],
  }),
  user: one(users, {
    fields: [trainingEnrollments.userId],
    references: [users.id],
  }),
}));

// Job postings table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  title: varchar("title").notNull(),
  department: varchar("department").notNull(),
  location: varchar("location").notNull(),
  type: varchar("type").notNull(), // full-time, part-time, contract
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  salary: varchar("salary"),
  status: varchar("status").default("active"), // active, closed, draft
  postedBy: varchar("posted_by").references(() => users.id),
  postedDate: date("posted_date").notNull(),
  closingDate: date("closing_date"),
  views: integer("views").default(0),
  applicationCount: integer("application_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job applications table
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  applicantId: varchar("applicant_id").references(() => users.id),
  candidateName: varchar("candidate_name").notNull(),
  candidateEmail: varchar("candidate_email").notNull(),
  phone: varchar("phone"),
  resumeUrl: varchar("resume_url"),
  coverLetter: text("cover_letter"),
  status: varchar("status").default("under_review"), // under_review, interview_scheduled, rejected, hired
  stage: varchar("stage").default("application"), // application, phone_screen, technical_interview, final_interview, offer
  appliedDate: date("applied_date").notNull(),
  experience: varchar("experience"),
  education: varchar("education"),
  skills: text("skills"),
  expectedSalary: varchar("expected_salary"),
  availableFrom: date("available_from"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Interview schedules table
export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => jobApplications.id).notNull(),
  interviewerId: varchar("interviewer_id").references(() => users.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration").default(60), // in minutes
  type: varchar("type").notNull(), // phone, video, in_person, technical
  location: varchar("location"),
  meetingLink: varchar("meeting_link"),
  status: varchar("status").default("scheduled"), // scheduled, completed, cancelled, rescheduled
  feedback: text("feedback"),
  rating: integer("rating"), // 1-5
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Role permissions table for comprehensive RBAC
export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  role: varchar("role").notNull(),
  resource: varchar("resource").notNull(), // employees, payroll, performance, etc.
  permission: varchar("permission").notNull(), // create, read, update, delete, approve
  companyId: integer("company_id").references(() => companies.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Security sessions table for session management
export const securitySessions = pgTable("security_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionToken: varchar("session_token").notNull().unique(),
  deviceInfo: jsonb("device_info"),
  ipAddress: varchar("ip_address"),
  location: varchar("location"),
  isActive: boolean("is_active").default(true),
  lastActivity: timestamp("last_activity").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Password reset tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Company settings table
export const companySettings = pgTable("company_settings", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  category: varchar("category").notNull(), // security, payroll, leave_policy, etc.
  key: varchar("key").notNull(),
  value: text("value").notNull(),
  isEncrypted: boolean("is_encrypted").default(false),
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// File uploads table for document management
export const fileUploads = pgTable("file_uploads", {
  id: serial("id").primaryKey(),
  fileName: varchar("file_name").notNull(),
  originalName: varchar("original_name").notNull(),
  fileType: varchar("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: varchar("file_path").notNull(),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  companyId: integer("company_id").references(() => companies.id),
  category: varchar("category").notNull(), // resume, contract, report, etc.
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// System logs for comprehensive tracking
export const systemLogs = pgTable("system_logs", {
  id: serial("id").primaryKey(),
  level: varchar("level").notNull(), // info, warning, error, critical
  message: text("message").notNull(),
  context: jsonb("context"),
  userId: varchar("user_id"),
  companyId: integer("company_id"),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  endpoint: varchar("endpoint"),
  method: varchar("method"),
  responseTime: integer("response_time"),
  statusCode: integer("status_code"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Additional schema exports and relations for new tables
export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInterviewSchema = createInsertSchema(interviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRolePermissionSchema = createInsertSchema(rolePermissions).omit({
  id: true,
  createdAt: true,
});

export const insertSecuritySessionSchema = createInsertSchema(securitySessions).omit({
  id: true,
  createdAt: true,
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  createdAt: true,
});

export const insertCompanySettingSchema = createInsertSchema(companySettings).omit({
  id: true,
  updatedAt: true,
});

export const insertFileUploadSchema = createInsertSchema(fileUploads).omit({
  id: true,
  createdAt: true,
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
  createdAt: true,
});

// Types for all new tables
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type Interview = typeof interviews.$inferSelect;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = z.infer<typeof insertRolePermissionSchema>;
export type SecuritySession = typeof securitySessions.$inferSelect;
export type InsertSecuritySession = z.infer<typeof insertSecuritySessionSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type CompanySetting = typeof companySettings.$inferSelect;
export type InsertCompanySetting = z.infer<typeof insertCompanySettingSchema>;
export type FileUpload = typeof fileUploads.$inferSelect;
export type InsertFileUpload = z.infer<typeof insertFileUploadSchema>;
export type SystemLog = typeof systemLogs.$inferSelect;
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;

// Extended relations for new tables
export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
  poster: one(users, {
    fields: [jobs.postedBy],
    references: [users.id],
  }),
  applications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one, many }) => ({
  job: one(jobs, {
    fields: [jobApplications.jobId],
    references: [jobs.id],
  }),
  applicant: one(users, {
    fields: [jobApplications.applicantId],
    references: [users.id],
  }),
  interviews: many(interviews),
}));

export const interviewsRelations = relations(interviews, ({ one }) => ({
  application: one(jobApplications, {
    fields: [interviews.applicationId],
    references: [jobApplications.id],
  }),
  interviewer: one(users, {
    fields: [interviews.interviewerId],
    references: [users.id],
  }),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  company: one(companies, {
    fields: [rolePermissions.companyId],
    references: [companies.id],
  }),
}));

export const securitySessionsRelations = relations(securitySessions, ({ one }) => ({
  user: one(users, {
    fields: [securitySessions.userId],
    references: [users.id],
  }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}));

export const companySettingsRelations = relations(companySettings, ({ one }) => ({
  company: one(companies, {
    fields: [companySettings.companyId],
    references: [companies.id],
  }),
  updater: one(users, {
    fields: [companySettings.updatedBy],
    references: [users.id],
  }),
}));

export const fileUploadsRelations = relations(fileUploads, ({ one }) => ({
  uploader: one(users, {
    fields: [fileUploads.uploadedBy],
    references: [users.id],
  }),
  company: one(companies, {
    fields: [fileUploads.companyId],
    references: [companies.id],
  }),
}));

// Permission type for role-based access control
export type Permission = {
  canViewEmployees: boolean;
  canEditEmployees: boolean;
  canDeleteEmployees: boolean;
  canViewPerformance: boolean;
  canEditPerformance: boolean;
  canViewPayroll: boolean;
  canEditPayroll: boolean;
  canViewReports: boolean;
  canManageTeam: boolean;
  canViewAuditLogs: boolean;
};
