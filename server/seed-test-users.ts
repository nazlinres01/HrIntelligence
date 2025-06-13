import bcrypt from "bcrypt";
import { db } from "./db";
import { users, companies, employees, departments } from "@shared/schema";

export async function seedTestUsers() {
  console.log("Creating test users for different roles...");

  // Test şirketi oluştur
  const [testCompany] = await db.insert(companies).values({
    name: "TechCorp Yazılım A.Ş.",
    address: "Levent, İstanbul",
    email: "info@techcorp.com.tr", 
    phone: "+90 212 555 0123",
    website: "https://techcorp.com.tr",
    description: "Yazılım geliştirme ve teknoloji danışmanlığı",
    industry: "Teknoloji",
    employeeCount: 150
  }).returning();

  // Test departmanları oluştur
  const [itDept] = await db.insert(departments).values({
    name: "Bilgi Teknolojileri",
    description: "IT altyapı ve yazılım geliştirme",
    companyId: testCompany.id
  }).returning();

  const [hrDept] = await db.insert(departments).values({
    name: "İnsan Kaynakları", 
    description: "İK süreçleri ve çalışan yönetimi",
    companyId: testCompany.id
  }).returning();

  // Test kullanıcıları oluştur
  const testUsers = [
    {
      id: "admin001",
      email: "admin@techcorp.com.tr",
      password: await bcrypt.hash("admin123", 10),
      firstName: "Ahmet",
      lastName: "Yıldırım", 
      role: "admin",
      profileImageUrl: null
    },
    {
      id: "hr_manager001",
      email: "ik.muduru@techcorp.com.tr", 
      password: await bcrypt.hash("ik123", 10),
      firstName: "Ayşe",
      lastName: "Demir",
      role: "hr_manager", 
      profileImageUrl: null
    },
    {
      id: "hr_specialist001",
      email: "ik.uzman@techcorp.com.tr",
      password: await bcrypt.hash("uzman123", 10),
      firstName: "Mehmet",
      lastName: "Kaya",
      role: "hr_specialist",
      profileImageUrl: null
    },
    {
      id: "dept_manager001", 
      email: "dept.muduru@techcorp.com.tr",
      password: await bcrypt.hash("dept123", 10),
      firstName: "Fatma",
      lastName: "Özkan",
      role: "department_manager",
      profileImageUrl: null
    },
    {
      id: "employee001",
      email: "calisan@techcorp.com.tr",
      password: await bcrypt.hash("calisan123", 10),
      firstName: "Ali",
      lastName: "Şahin", 
      role: "employee",
      profileImageUrl: null
    }
  ];

  // Kullanıcıları veritabanına ekle
  for (const user of testUsers) {
    await db.insert(users).values(user).onConflictDoUpdate({
      target: users.id,
      set: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        updatedAt: new Date()
      }
    });
  }

  // Çalışan kayıtları oluştur
  const employeeRecords = [
    {
      companyId: testCompany.id,
      firstName: "Ahmet",
      lastName: "Yıldırım",
      email: "admin@techcorp.com.tr",
      phone: "+90 555 123 4567",
      department: "Yönetim",
      position: "Genel Müdür",
      startDate: new Date("2020-01-15"),
      salary: "25000.00",
      status: "active" as const
    },
    {
      companyId: testCompany.id,
      firstName: "Ayşe",
      lastName: "Demir",
      email: "ik.muduru@techcorp.com.tr", 
      phone: "+90 555 234 5678",
      department: "İnsan Kaynakları",
      position: "İK Müdürü",
      startDate: new Date("2021-03-10"),
      salary: "18000.00",
      status: "active" as const
    },
    {
      companyId: testCompany.id,
      firstName: "Mehmet",
      lastName: "Kaya",
      email: "ik.uzman@techcorp.com.tr",
      phone: "+90 555 345 6789",
      department: "İnsan Kaynakları", 
      position: "İK Uzmanı",
      startDate: new Date("2022-06-01"),
      salary: "12000.00",
      status: "active" as const
    },
    {
      companyId: testCompany.id,
      firstName: "Fatma",
      lastName: "Özkan",
      email: "dept.muduru@techcorp.com.tr",
      phone: "+90 555 456 7890",
      department: "Bilgi Teknolojileri",
      position: "Yazılım Geliştirme Müdürü", 
      startDate: new Date("2021-09-15"),
      salary: "16000.00",
      status: "active" as const
    },
    {
      companyId: testCompany.id,
      firstName: "Ali",
      lastName: "Şahin",
      email: "calisan@techcorp.com.tr",
      phone: "+90 555 567 8901",
      department: "Bilgi Teknolojileri",
      position: "Senior Developer",
      startDate: new Date("2023-02-20"),
      salary: "14000.00",
      status: "active" as const
    }
  ];

  for (const emp of employeeRecords) {
    await db.insert(employees).values(emp);
  }

  console.log("Test users created successfully!");
  
  // Giriş bilgilerini konsola yazdır
  console.log("\n=== TEST GİRİŞ BİLGİLERİ ===");
  console.log("1. ADMIN:");
  console.log("   Email: admin@techcorp.com.tr");
  console.log("   Şifre: admin123");
  console.log("");
  console.log("2. İK MÜDÜRÜ:");
  console.log("   Email: ik.muduru@techcorp.com.tr");
  console.log("   Şifre: ik123");
  console.log("");
  console.log("3. İK UZMANI:");
  console.log("   Email: ik.uzman@techcorp.com.tr");
  console.log("   Şifre: uzman123");
  console.log("");
  console.log("4. DEPARTMAN MÜDÜRÜ:");
  console.log("   Email: dept.muduru@techcorp.com.tr");
  console.log("   Şifre: dept123");
  console.log("");
  console.log("5. ÇALIŞAN:");
  console.log("   Email: calisan@techcorp.com.tr");
  console.log("   Şifre: calisan123");
  console.log("================================\n");
}