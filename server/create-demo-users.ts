import { db } from "./db";
import { users, companies } from "@shared/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

export async function createDemoUsers() {
  console.log("Creating demo users...");

  // Get the first company
  const [company] = await db.select().from(companies).limit(1);
  
  if (!company) {
    console.log("No companies found, skipping demo user creation");
    return;
  }

  const demoUsers = [
    {
      id: "admin_demo",
      email: "admin@hr360.com",
      firstName: "Sistem",
      lastName: "Yöneticisi", 
      role: "admin",
      password: "Admin123!",
      companyId: null
    },
    {
      id: "hr_manager_demo",
      email: "hr.manager@techcorp.com.tr",
      firstName: "Fatma",
      lastName: "Yılmaz",
      role: "hr_manager", 
      password: "HrManager123!",
      companyId: company.id
    },
    {
      id: "hr_specialist_demo",
      email: "hr.specialist@techcorp.com.tr",
      firstName: "Mehmet",
      lastName: "Demir",
      role: "hr_specialist",
      password: "HrSpecialist123!",
      companyId: company.id
    },
    {
      id: "dept_manager_demo", 
      email: "dept.manager@techcorp.com.tr",
      firstName: "Ali",
      lastName: "Özkan",
      role: "department_manager",
      password: "DeptManager123!",
      companyId: company.id
    },
    {
      id: "employee_demo",
      email: "employee@techcorp.com.tr", 
      firstName: "Zeynep",
      lastName: "Arslan",
      role: "employee",
      password: "Employee123!",
      companyId: company.id
    }
  ];

  for (const userData of demoUsers) {
    try {
      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email));

      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      await db.insert(users).values({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        password: hashedPassword,
        companyId: userData.companyId,
        isActive: true,
      });

      console.log(`✓ Created demo user: ${userData.email} (${userData.role})`);
    } catch (error) {
      console.error(`Error creating user ${userData.email}:`, error);
    }
  }

  console.log("Demo user creation completed!");
}