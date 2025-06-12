import mongoose from 'mongoose';

// Company Schema
const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  industry: String,
  size: { type: String, enum: ['startup', 'small', 'medium', 'large', 'enterprise'], default: 'medium' },
  logo: String,
  website: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  contactInfo: {
    email: String,
    phone: String
  },
  settings: {
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' }
    },
    workingDays: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
    timezone: { type: String, default: 'Europe/Istanbul' }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Department Schema
const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  budget: { type: Number, default: 0 },
  employeeCount: { type: Number, default: 0 },
  goals: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'hr_manager', 'hr_specialist', 'department_manager', 'employee'], required: true },
  profileImage: String,
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  permissions: {
    canViewEmployees: { type: Boolean, default: false },
    canEditEmployees: { type: Boolean, default: false },
    canDeleteEmployees: { type: Boolean, default: false },
    canViewPerformance: { type: Boolean, default: false },
    canEditPerformance: { type: Boolean, default: false },
    canViewPayroll: { type: Boolean, default: false },
    canEditPayroll: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false },
    canManageTeam: { type: Boolean, default: false },
    canViewAuditLogs: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Employee Schema
const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  position: { type: String, required: true },
  level: { type: String, enum: ['junior', 'mid', 'senior', 'lead', 'manager', 'director'], default: 'junior' },
  salary: { type: Number, required: true },
  currency: { type: String, default: 'TRY' },
  contractType: { type: String, enum: ['full-time', 'part-time', 'contract', 'intern'], default: 'full-time' },
  startDate: { type: Date, required: true },
  endDate: Date,
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  skills: [String],
  certifications: [String],
  personalInfo: {
    phone: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Recruitment Schema
const recruitmentSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  description: { type: String, required: true },
  requirements: [String],
  benefits: [String],
  salaryRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'TRY' }
  },
  location: String,
  employmentType: { type: String, enum: ['full-time', 'part-time', 'contract', 'intern'], default: 'full-time' },
  status: { type: String, enum: ['draft', 'active', 'paused', 'closed'], default: 'draft' },
  applications: [{
    candidateName: String,
    candidateEmail: String,
    candidatePhone: String,
    resume: String,
    coverLetter: String,
    status: { type: String, enum: ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'], default: 'applied' },
    appliedAt: { type: Date, default: Date.now },
    notes: String
  }],
  postedAt: Date,
  closedAt: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Performance Schema
const performanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  period: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  type: { type: String, enum: ['quarterly', 'annual', 'probation', 'project'], default: 'quarterly' },
  goals: [{
    title: String,
    description: String,
    targetDate: Date,
    status: { type: String, enum: ['not-started', 'in-progress', 'completed', 'overdue'], default: 'not-started' },
    score: { type: Number, min: 1, max: 5 }
  }],
  ratings: {
    technical: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    teamwork: { type: Number, min: 1, max: 5 },
    leadership: { type: Number, min: 1, max: 5 },
    initiative: { type: Number, min: 1, max: 5 }
  },
  overallScore: { type: Number, min: 1, max: 5 },
  feedback: String,
  improvementAreas: [String],
  achievements: [String],
  status: { type: String, enum: ['draft', 'pending', 'completed', 'approved'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Payroll Schema
const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  period: {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true }
  },
  baseSalary: { type: Number, required: true },
  allowances: {
    housing: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    meal: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  deductions: {
    tax: { type: Number, default: 0 },
    socialSecurity: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  overtime: {
    hours: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    amount: { type: Number, default: 0 }
  },
  bonus: { type: Number, default: 0 },
  grossSalary: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  currency: { type: String, default: 'TRY' },
  status: { type: String, enum: ['draft', 'approved', 'paid'], default: 'draft' },
  paidAt: Date,
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Leave Schema
const leaveSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  type: { type: String, enum: ['annual', 'sick', 'maternity', 'paternity', 'personal', 'emergency'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true },
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  rejectionReason: String,
  documents: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Audit Log Schema
const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  resourceId: String,
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
});

// Activity Schema
const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'error', 'success'], default: 'info' },
  isRead: { type: Boolean, default: false },
  readAt: Date,
  createdAt: { type: Date, default: Date.now }
});

// Export models
export const Company = mongoose.model('Company', companySchema);
export const Department = mongoose.model('Department', departmentSchema);
export const User = mongoose.model('User', userSchema);
export const Employee = mongoose.model('Employee', employeeSchema);
export const Recruitment = mongoose.model('Recruitment', recruitmentSchema);
export const Performance = mongoose.model('Performance', performanceSchema);
export const Payroll = mongoose.model('Payroll', payrollSchema);
export const Leave = mongoose.model('Leave', leaveSchema);
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export const Activity = mongoose.model('Activity', activitySchema);
export const Notification = mongoose.model('Notification', notificationSchema);