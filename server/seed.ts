import { db } from "./db";
import { employees, departments, leaves, performance, payroll, activities } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingEmployees = await db.select().from(employees).limit(1);
    if (existingEmployees.length > 0) {
      console.log("Database already seeded");
      return;
    }

    console.log("Seeding database...");

    // Create departments first
    const sampleDepartments = [
      { name: "Yazılım", description: "Software Development", employeeCount: 25 },
      { name: "İnsan Kaynakları", description: "Human Resources", employeeCount: 8 },
      { name: "Pazarlama", description: "Marketing", employeeCount: 12 },
      { name: "Satış", description: "Sales", employeeCount: 20 },
      { name: "Muhasebe", description: "Accounting", employeeCount: 6 }
    ];

    await db.insert(departments).values(sampleDepartments);

    // Create sample employees
    const sampleEmployees = [
      {
        firstName: "Can",
        lastName: "Yılmaz",
        email: "can.yilmaz@sirket.com",
        phone: "+90 555 123 4567",
        department: "Yazılım",
        position: "Senior Developer",
        startDate: "2021-03-15",
        salary: "15000.00",
        status: "active",
        performanceScore: "8.5",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
      },
      {
        firstName: "Elif",
        lastName: "Kara",
        email: "elif.kara@sirket.com",
        phone: "+90 555 234 5678",
        department: "İnsan Kaynakları",
        position: "İK Uzmanı",
        startDate: "2020-08-22",
        salary: "12000.00",
        status: "on_leave",
        performanceScore: "9.2",
        profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
      },
      {
        firstName: "Okan",
        lastName: "Şahin",
        email: "okan.sahin@sirket.com",
        phone: "+90 555 345 6789",
        department: "Pazarlama",
        position: "Pazarlama Müdürü",
        startDate: "2019-01-10",
        salary: "18000.00",
        status: "active",
        performanceScore: "7.8",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"
      }
    ];

    await db.insert(employees).values(sampleEmployees);

    // Create sample leaves
    const sampleLeaves = [
      {
        employeeId: 2,
        leaveType: "annual",
        startDate: "2024-11-15",
        endDate: "2024-11-19",
        days: 5,
        status: "approved",
        reason: "Yıllık izin"
      }
    ];

    await db.insert(leaves).values(sampleLeaves);

    // Create sample performance records
    const samplePerformance = [
      {
        employeeId: 1,
        reviewPeriod: "2024-Q3",
        score: "8.5",
        goals: "Complete project milestones",
        achievements: "Delivered all features on time",
        feedback: "Excellent technical skills"
      }
    ];

    await db.insert(performance).values(samplePerformance);

    // Create sample payroll records
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const samplePayroll = [
      {
        employeeId: 1,
        month: currentMonth,
        baseSalary: "15000.00",
        bonuses: "2000.00",
        deductions: "1500.00",
        netSalary: "15500.00",
        status: "paid",
        paymentDate: "2024-11-30"
      }
    ];

    await db.insert(payroll).values(samplePayroll);

    // Create sample activities
    const sampleActivities = [
      {
        type: "employee_added",
        description: "Yeni çalışan eklendi",
        entityId: 1,
        performedBy: null
      },
      {
        type: "leave_approved",
        description: "İzin talebi onaylandı",
        entityId: 1,
        performedBy: null
      }
    ];

    await db.insert(activities).values(sampleActivities);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}