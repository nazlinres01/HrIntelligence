import {
  Company,
  Department,
  User,
  Employee,
  Recruitment,
  Performance,
  Payroll,
  Leave,
  AuditLog,
  Activity,
  Notification,
} from "./models";
import bcrypt from 'bcrypt';

export interface IMongoStorage {
  // User operations for authentication
  getUser(id: string): Promise<any | undefined>;
  getUserByEmail(email: string): Promise<any | undefined>;
  upsertUser(user: any): Promise<any>;
  updateUser(id: string, userData: any): Promise<any>;

  // Company operations
  getCompany(id: string): Promise<any | undefined>;
  getCompanyByUser(userId: string): Promise<any | undefined>;
  createCompany(company: any): Promise<any>;
  updateCompany(id: string, company: any): Promise<any>;
  getAllCompanies(): Promise<any[]>;

  // Department operations
  getDepartments(): Promise<any[]>;
  getDepartmentsByCompany(companyId: string): Promise<any[]>;
  getDepartment(id: string): Promise<any | undefined>;
  createDepartment(department: any): Promise<any>;
  updateDepartment(id: string, department: any): Promise<any>;
  deleteDepartment(id: string): Promise<boolean>;

  // Employee operations
  getEmployees(): Promise<any[]>;
  getEmployeesByCompany(companyId: string): Promise<any[]>;
  getEmployee(id: string): Promise<any | undefined>;
  getEmployeeByEmail(email: string): Promise<any | undefined>;
  createEmployee(employee: any): Promise<any>;
  updateEmployee(id: string, employee: any): Promise<any>;
  deleteEmployee(id: string): Promise<boolean>;

  // Recruitment operations
  getRecruitmentJobs(): Promise<any[]>;
  getRecruitmentJob(id: string): Promise<any | undefined>;
  createRecruitmentJob(job: any): Promise<any>;
  updateRecruitmentJob(id: string, job: any): Promise<any>;
  deleteRecruitmentJob(id: string): Promise<boolean>;
  addJobApplication(jobId: string, application: any): Promise<any>;

  // Performance operations
  getPerformanceRecords(): Promise<any[]>;
  getPerformanceByEmployee(employeeId: string): Promise<any[]>;
  getPerformance(id: string): Promise<any | undefined>;
  createPerformance(performance: any): Promise<any>;
  updatePerformance(id: string, performance: any): Promise<any>;

  // Payroll operations
  getPayrollRecords(): Promise<any[]>;
  getPayrollByEmployee(employeeId: string): Promise<any[]>;
  getPayroll(id: string): Promise<any | undefined>;
  createPayroll(payroll: any): Promise<any>;
  updatePayroll(id: string, payroll: any): Promise<any>;

  // Leave operations
  getLeaves(): Promise<any[]>;
  getLeavesByEmployee(employeeId: string): Promise<any[]>;
  getLeave(id: string): Promise<any | undefined>;
  createLeave(leave: any): Promise<any>;
  updateLeave(id: string, leave: any): Promise<any>;

  // Analytics operations
  getEmployeeStats(): Promise<any>;
  getDepartmentStats(): Promise<any[]>;
  getCompanyStats(): Promise<any>;

  // Activity operations
  getActivities(limit?: number): Promise<any[]>;
  createActivity(activity: any): Promise<any>;

  // Notification operations
  getUserNotifications(userId: string, limit?: number): Promise<any[]>;
  getUnreadNotificationCount(userId: string): Promise<number>;
  createNotification(notification: any): Promise<any>;
  markNotificationAsRead(id: string, userId: string): Promise<boolean>;
  markAllNotificationsAsRead(userId: string): Promise<boolean>;
  deleteNotification(id: string, userId: string): Promise<boolean>;

  // Audit log operations
  createAuditLog(log: any): Promise<any>;
  getAuditLogs(limit?: number): Promise<any[]>;
  getUserAuditLogs(userId: string, limit?: number): Promise<any[]>;
}

export class MongoStorage implements IMongoStorage {
  // User operations
  async getUser(id: string): Promise<any | undefined> {
    try {
      return await User.findById(id).populate('companyId departmentId');
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<any | undefined> {
    try {
      return await User.findOne({ email }).populate('companyId departmentId');
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async upsertUser(userData: any): Promise<any> {
    try {
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      
      const user = await User.findOneAndUpdate(
        { email: userData.email },
        { ...userData, updatedAt: new Date() },
        { upsert: true, new: true, runValidators: true }
      ).populate('companyId departmentId');
      
      return user;
    } catch (error) {
      console.error('Error upserting user:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: any): Promise<any> {
    try {
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      
      const user = await User.findByIdAndUpdate(
        id,
        { ...userData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('companyId departmentId');
      
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Company operations
  async getCompany(id: string): Promise<any | undefined> {
    try {
      return await Company.findById(id);
    } catch (error) {
      console.error('Error getting company:', error);
      return undefined;
    }
  }

  async getCompanyByUser(userId: string): Promise<any | undefined> {
    try {
      const user = await User.findById(userId).populate('companyId');
      return user?.companyId;
    } catch (error) {
      console.error('Error getting company by user:', error);
      return undefined;
    }
  }

  async createCompany(companyData: any): Promise<any> {
    try {
      const company = new Company(companyData);
      return await company.save();
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  async updateCompany(id: string, companyData: any): Promise<any> {
    try {
      return await Company.findByIdAndUpdate(
        id,
        { ...companyData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }

  async getAllCompanies(): Promise<any[]> {
    try {
      return await Company.find({ isActive: true }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting companies:', error);
      return [];
    }
  }

  // Department operations
  async getDepartments(): Promise<any[]> {
    try {
      return await Department.find({ isActive: true })
        .populate('companyId managerId')
        .sort({ name: 1 });
    } catch (error) {
      console.error('Error getting departments:', error);
      return [];
    }
  }

  async getDepartmentsByCompany(companyId: string): Promise<any[]> {
    try {
      return await Department.find({ companyId, isActive: true })
        .populate('managerId')
        .sort({ name: 1 });
    } catch (error) {
      console.error('Error getting departments by company:', error);
      return [];
    }
  }

  async getDepartment(id: string): Promise<any | undefined> {
    try {
      return await Department.findById(id).populate('companyId managerId');
    } catch (error) {
      console.error('Error getting department:', error);
      return undefined;
    }
  }

  async createDepartment(departmentData: any): Promise<any> {
    try {
      const department = new Department(departmentData);
      return await department.save();
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  }

  async updateDepartment(id: string, departmentData: any): Promise<any> {
    try {
      return await Department.findByIdAndUpdate(
        id,
        { ...departmentData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  }

  async deleteDepartment(id: string): Promise<boolean> {
    try {
      await Department.findByIdAndUpdate(id, { isActive: false });
      return true;
    } catch (error) {
      console.error('Error deleting department:', error);
      return false;
    }
  }

  // Employee operations
  async getEmployees(): Promise<any[]> {
    try {
      return await Employee.find({ isActive: true })
        .populate('userId companyId departmentId managerId')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting employees:', error);
      return [];
    }
  }

  async getEmployeesByCompany(companyId: string): Promise<any[]> {
    try {
      return await Employee.find({ companyId, isActive: true })
        .populate('userId departmentId managerId')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting employees by company:', error);
      return [];
    }
  }

  async getEmployee(id: string): Promise<any | undefined> {
    try {
      return await Employee.findById(id)
        .populate('userId companyId departmentId managerId');
    } catch (error) {
      console.error('Error getting employee:', error);
      return undefined;
    }
  }

  async getEmployeeByEmail(email: string): Promise<any | undefined> {
    try {
      const user = await User.findOne({ email });
      if (!user) return undefined;
      
      return await Employee.findOne({ userId: user._id })
        .populate('userId companyId departmentId managerId');
    } catch (error) {
      console.error('Error getting employee by email:', error);
      return undefined;
    }
  }

  async createEmployee(employeeData: any): Promise<any> {
    try {
      const employee = new Employee(employeeData);
      return await employee.save();
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployee(id: string, employeeData: any): Promise<any> {
    try {
      return await Employee.findByIdAndUpdate(
        id,
        { ...employeeData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  async deleteEmployee(id: string): Promise<boolean> {
    try {
      await Employee.findByIdAndUpdate(id, { isActive: false });
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      return false;
    }
  }

  // Recruitment operations
  async getRecruitmentJobs(): Promise<any[]> {
    try {
      return await Recruitment.find()
        .populate('departmentId companyId createdBy')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting recruitment jobs:', error);
      return [];
    }
  }

  async getRecruitmentJob(id: string): Promise<any | undefined> {
    try {
      return await Recruitment.findById(id)
        .populate('departmentId companyId createdBy');
    } catch (error) {
      console.error('Error getting recruitment job:', error);
      return undefined;
    }
  }

  async createRecruitmentJob(jobData: any): Promise<any> {
    try {
      const job = new Recruitment(jobData);
      return await job.save();
    } catch (error) {
      console.error('Error creating recruitment job:', error);
      throw error;
    }
  }

  async updateRecruitmentJob(id: string, jobData: any): Promise<any> {
    try {
      return await Recruitment.findByIdAndUpdate(
        id,
        { ...jobData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating recruitment job:', error);
      throw error;
    }
  }

  async deleteRecruitmentJob(id: string): Promise<boolean> {
    try {
      await Recruitment.findByIdAndDelete(id);
      return true;
    } catch (error) {
      console.error('Error deleting recruitment job:', error);
      return false;
    }
  }

  async addJobApplication(jobId: string, application: any): Promise<any> {
    try {
      return await Recruitment.findByIdAndUpdate(
        jobId,
        { $push: { applications: application } },
        { new: true }
      );
    } catch (error) {
      console.error('Error adding job application:', error);
      throw error;
    }
  }

  // Performance operations
  async getPerformanceRecords(): Promise<any[]> {
    try {
      return await Performance.find()
        .populate('employeeId reviewerId')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting performance records:', error);
      return [];
    }
  }

  async getPerformanceByEmployee(employeeId: string): Promise<any[]> {
    try {
      return await Performance.find({ employeeId })
        .populate('reviewerId')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting performance by employee:', error);
      return [];
    }
  }

  async getPerformance(id: string): Promise<any | undefined> {
    try {
      return await Performance.findById(id)
        .populate('employeeId reviewerId');
    } catch (error) {
      console.error('Error getting performance:', error);
      return undefined;
    }
  }

  async createPerformance(performanceData: any): Promise<any> {
    try {
      const performance = new Performance(performanceData);
      return await performance.save();
    } catch (error) {
      console.error('Error creating performance:', error);
      throw error;
    }
  }

  async updatePerformance(id: string, performanceData: any): Promise<any> {
    try {
      return await Performance.findByIdAndUpdate(
        id,
        { ...performanceData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating performance:', error);
      throw error;
    }
  }

  // Payroll operations
  async getPayrollRecords(): Promise<any[]> {
    try {
      return await Payroll.find()
        .populate('employeeId companyId processedBy')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting payroll records:', error);
      return [];
    }
  }

  async getPayrollByEmployee(employeeId: string): Promise<any[]> {
    try {
      return await Payroll.find({ employeeId })
        .populate('companyId processedBy')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting payroll by employee:', error);
      return [];
    }
  }

  async getPayroll(id: string): Promise<any | undefined> {
    try {
      return await Payroll.findById(id)
        .populate('employeeId companyId processedBy');
    } catch (error) {
      console.error('Error getting payroll:', error);
      return undefined;
    }
  }

  async createPayroll(payrollData: any): Promise<any> {
    try {
      const payroll = new Payroll(payrollData);
      return await payroll.save();
    } catch (error) {
      console.error('Error creating payroll:', error);
      throw error;
    }
  }

  async updatePayroll(id: string, payrollData: any): Promise<any> {
    try {
      return await Payroll.findByIdAndUpdate(
        id,
        { ...payrollData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating payroll:', error);
      throw error;
    }
  }

  // Leave operations
  async getLeaves(): Promise<any[]> {
    try {
      return await Leave.find()
        .populate('employeeId approvedBy')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting leaves:', error);
      return [];
    }
  }

  async getLeavesByEmployee(employeeId: string): Promise<any[]> {
    try {
      return await Leave.find({ employeeId })
        .populate('approvedBy')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting leaves by employee:', error);
      return [];
    }
  }

  async getLeave(id: string): Promise<any | undefined> {
    try {
      return await Leave.findById(id)
        .populate('employeeId approvedBy');
    } catch (error) {
      console.error('Error getting leave:', error);
      return undefined;
    }
  }

  async createLeave(leaveData: any): Promise<any> {
    try {
      const leave = new Leave(leaveData);
      return await leave.save();
    } catch (error) {
      console.error('Error creating leave:', error);
      throw error;
    }
  }

  async updateLeave(id: string, leaveData: any): Promise<any> {
    try {
      return await Leave.findByIdAndUpdate(
        id,
        { ...leaveData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating leave:', error);
      throw error;
    }
  }

  // Analytics operations
  async getEmployeeStats(): Promise<any> {
    try {
      const totalEmployees = await Employee.countDocuments({ isActive: true });
      const activeLeaves = await Leave.countDocuments({ status: 'approved' });
      
      const payrollAgg = await Payroll.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$netSalary' } } }
      ]);
      const monthlyPayroll = payrollAgg[0]?.total || 0;

      const perfAgg = await Performance.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, avg: { $avg: '$overallScore' } } }
      ]);
      const avgPerformance = perfAgg[0]?.avg || 0;

      return {
        totalEmployees,
        activeLeaves,
        monthlyPayroll: monthlyPayroll.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }),
        avgPerformance: avgPerformance.toFixed(1)
      };
    } catch (error) {
      console.error('Error getting employee stats:', error);
      return { totalEmployees: 0, activeLeaves: 0, monthlyPayroll: '0', avgPerformance: '0' };
    }
  }

  async getDepartmentStats(): Promise<any[]> {
    try {
      return await Department.aggregate([
        { $match: { isActive: true } },
        {
          $lookup: {
            from: 'employees',
            localField: '_id',
            foreignField: 'departmentId',
            as: 'employees'
          }
        },
        {
          $project: {
            name: 1,
            budget: 1,
            employeeCount: { $size: '$employees' },
            activeEmployees: {
              $size: {
                $filter: {
                  input: '$employees',
                  cond: { $eq: ['$$this.isActive', true] }
                }
              }
            }
          }
        }
      ]);
    } catch (error) {
      console.error('Error getting department stats:', error);
      return [];
    }
  }

  async getCompanyStats(): Promise<any> {
    try {
      const totalCompanies = await Company.countDocuments({ isActive: true });
      const totalDepartments = await Department.countDocuments({ isActive: true });
      const totalEmployees = await Employee.countDocuments({ isActive: true });
      const totalUsers = await User.countDocuments({ isActive: true });

      return {
        totalCompanies,
        totalDepartments,
        totalEmployees,
        totalUsers
      };
    } catch (error) {
      console.error('Error getting company stats:', error);
      return { totalCompanies: 0, totalDepartments: 0, totalEmployees: 0, totalUsers: 0 };
    }
  }

  // Activity operations
  async getActivities(limit: number = 10): Promise<any[]> {
    try {
      return await Activity.find()
        .populate('userId')
        .sort({ timestamp: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting activities:', error);
      return [];
    }
  }

  async createActivity(activityData: any): Promise<any> {
    try {
      const activity = new Activity(activityData);
      return await activity.save();
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  // Notification operations
  async getUserNotifications(userId: string, limit: number = 50): Promise<any[]> {
    try {
      return await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return [];
    }
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    try {
      return await Notification.countDocuments({ userId, isRead: false });
    } catch (error) {
      console.error('Error getting unread notification count:', error);
      return 0;
    }
  }

  async createNotification(notificationData: any): Promise<any> {
    try {
      const notification = new Notification(notificationData);
      return await notification.save();
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async markNotificationAsRead(id: string, userId: string): Promise<boolean> {
    try {
      await Notification.findOneAndUpdate(
        { _id: id, userId },
        { isRead: true, readAt: new Date() }
      );
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    try {
      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  async deleteNotification(id: string, userId: string): Promise<boolean> {
    try {
      await Notification.findOneAndDelete({ _id: id, userId });
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  // Audit log operations
  async createAuditLog(logData: any): Promise<any> {
    try {
      const log = new AuditLog(logData);
      return await log.save();
    } catch (error) {
      console.error('Error creating audit log:', error);
      throw error;
    }
  }

  async getAuditLogs(limit: number = 100): Promise<any[]> {
    try {
      return await AuditLog.find()
        .populate('userId')
        .sort({ timestamp: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting audit logs:', error);
      return [];
    }
  }

  async getUserAuditLogs(userId: string, limit: number = 50): Promise<any[]> {
    try {
      return await AuditLog.find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting user audit logs:', error);
      return [];
    }
  }
}

export const mongoStorage = new MongoStorage();