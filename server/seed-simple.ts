import { db } from "./db";
import { companies, users, employees, departments } from "@shared/schema";

export async function seedSimpleDatabase() {
  try {
    // Clear existing data in correct order
    await db.delete(employees);
    await db.delete(departments);
    await db.delete(users);
    await db.delete(companies);

    console.log("Seeding database with company and team data...");

    // Create sample company first
    const [sampleCompany] = await db.insert(companies).values({
      name: "TechCorp Yazılım A.Ş.",
      industry: "Yazılım ve Teknoloji",
      address: "Maslak Mahallesi, Büyükdere Cad. No:245 Sarıyer/İstanbul",
      phone: "+90 212 456 78 90",
      email: "info@techcorp.com.tr",
      website: "https://www.techcorp.com.tr",
      taxNumber: "1234567890"
    }).returning();

    // Create departments for the company
    await db.insert(departments).values([
      { companyId: sampleCompany.id, name: "Yazılım Geliştirme", description: "Yazılım ürünleri ve teknoloji geliştirme", employeeCount: 15 },
      { companyId: sampleCompany.id, name: "Pazarlama ve Satış", description: "Müşteri kazanımı ve marka yönetimi", employeeCount: 12 },
      { companyId: sampleCompany.id, name: "İnsan Kaynakları", description: "Personel yönetimi ve organizasyon geliştirme", employeeCount: 6 },
      { companyId: sampleCompany.id, name: "Finans ve Muhasebe", description: "Mali işler ve finansal planlama", employeeCount: 8 },
      { companyId: sampleCompany.id, name: "Operasyon", description: "İş süreçleri ve operasyonel faaliyetler", employeeCount: 10 }
    ]);

    // Create HR team users for the company
    await db.insert(users).values([
      {
        id: "hr_manager_001",
        email: "fatma.yilmaz@techcorp.com.tr",
        firstName: "Fatma",
        lastName: "Yılmaz",
        phone: "+90 532 111 22 33",
        companyId: sampleCompany.id,
        role: "hr_manager",
        password: "password123",
        isActive: true
      },
      {
        id: "hr_specialist_001", 
        email: "mehmet.demir@techcorp.com.tr",
        firstName: "Mehmet",
        lastName: "Demir",
        phone: "+90 533 444 55 66",
        companyId: sampleCompany.id,
        role: "hr_specialist",
        password: "password123",
        isActive: true
      },
      {
        id: "hr_specialist_002",
        email: "ayse.kaya@techcorp.com.tr", 
        firstName: "Ayşe",
        lastName: "Kaya",
        phone: "+90 534 777 88 99",
        companyId: sampleCompany.id,
        role: "hr_specialist",
        password: "password123",
        isActive: true
      },
      {
        id: "admin_001",
        email: "admin@gmail.com",
        firstName: "System",
        lastName: "Admin",
        phone: "+90 535 123 45 67",
        companyId: sampleCompany.id,
        role: "admin",
        password: "admin123",
        isActive: true
      }
    ]);

    // Create basic employees
    await db.insert(employees).values([
      {
        companyId: sampleCompany.id,
        firstName: "Ahmet",
        lastName: "Özkan",
        email: "ahmet.ozkan@techcorp.com.tr",
        phone: "+90 532 123 45 67",
        department: "Yazılım Geliştirme",
        position: "Senior Full Stack Developer",
        startDate: "2021-03-15",
        salary: "120000.00",
        status: "active",
        address: "Levent Mahallesi, Beşiktaş/İstanbul",
        emergencyContact: "+90 532 987 65 43",
        notes: "React ve Node.js uzmanı, takım lideri",
        performanceScore: "4.8"
      },
      {
        companyId: sampleCompany.id,
        firstName: "Zeynep",
        lastName: "Yılmaz", 
        email: "zeynep.yilmaz@techcorp.com.tr",
        phone: "+90 533 234 56 78",
        department: "Pazarlama ve Satış",
        position: "Pazarlama Müdürü",
        startDate: "2020-08-20",
        salary: "95000.00",
        status: "active",
        address: "Fenerbahçe Mahallesi, Kadıköy/İstanbul",
        emergencyContact: "+90 533 876 54 32",
        notes: "Dijital pazarlama stratejileri uzmanı",
        performanceScore: "4.5"
      },
      {
        companyId: sampleCompany.id,
        firstName: "Emre",
        lastName: "Kaya",
        email: "emre.kaya@techcorp.com.tr",
        phone: "+90 534 345 67 89",
        department: "İnsan Kaynakları",
        position: "İK Uzmanı",
        startDate: "2022-01-10",
        salary: "75000.00",
        status: "on_leave",
        address: "Nişantaşı Mahallesi, Şişli/İstanbul",
        emergencyContact: "+90 534 765 43 21",
        notes: "Personel gelişimi ve eğitim programları sorumlusu",
        performanceScore: "4.2"
      }
    ]);

    console.log("Database seeded successfully with company and team data");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}