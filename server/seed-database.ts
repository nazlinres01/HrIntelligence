import { db } from "./db";
import { 
  companies, employees, departments, leaves, performance, 
  payroll, trainings, jobs, jobApplications, notifications
} from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Insert company
    const [company] = await db.insert(companies).values({
      name: "TechCorp Yazılım A.Ş.",
      industry: "Bilişim ve Teknoloji",
      size: "medium",
      description: "Kurumsal yazılım çözümleri ve dijital dönüşüm hizmetleri",
      address: "Maslak Mahallesi Büyükdere Caddesi No:123, İstanbul",
      phone: "+90 212 555 0123",
      email: "info@techcorp.com.tr",
      website: "https://www.techcorp.com.tr",
      taxNumber: "1234567890",
      employeeCount: 150
    }).returning();

    console.log("Company created:", company.name);

    // Insert departments
    const deptData = [
      {
        companyId: company.id,
        name: "Yazılım Geliştirme",
        description: "Web ve mobil uygulama geliştirme departmanı",
        budget: "2500000",
        employeeCount: 25
      },
      {
        companyId: company.id,
        name: "İnsan Kaynakları",
        description: "Personel yönetimi ve organizasyon geliştirme",
        budget: "800000",
        employeeCount: 8
      },
      {
        companyId: company.id,
        name: "Pazarlama ve Satış",
        description: "Dijital pazarlama ve kurumsal satış departmanı",
        budget: "1800000",
        employeeCount: 12
      },
      {
        companyId: company.id,
        name: "Muhasebe ve Finans",
        description: "Mali işler ve finansal planlama departmanı",
        budget: "600000",
        employeeCount: 6
      }
    ];

    const insertedDepts = await db.insert(departments).values(deptData).returning();
    console.log(`${insertedDepts.length} departments created`);

    // Insert employees
    const employeeData = [
      {
        companyId: company.id,
        firstName: "Ahmet",
        lastName: "Yılmaz",
        email: "ahmet.yilmaz@techcorp.com.tr",
        phone: "+90 532 123 4567",
        department: "Yazılım Geliştirme",
        position: "Yazılım Geliştirme Müdürü",
        startDate: "2020-03-15",
        salary: "18000",
        status: "active",
        address: "Beşiktaş, İstanbul",
        emergencyContact: "Zeynep Yılmaz - +90 532 987 6543"
      },
      {
        companyId: company.id,
        firstName: "Ayşe",
        lastName: "Demir",
        email: "ayse.demir@techcorp.com.tr",
        phone: "+90 533 234 5678",
        department: "İnsan Kaynakları",
        position: "İK Müdürü",
        startDate: "2019-08-20",
        salary: "16500",
        status: "active",
        address: "Kadıköy, İstanbul",
        emergencyContact: "Murat Demir - +90 533 876 5432"
      },
      {
        companyId: company.id,
        firstName: "Mehmet",
        lastName: "Kaya",
        email: "mehmet.kaya@techcorp.com.tr",
        phone: "+90 534 345 6789",
        department: "Yazılım Geliştirme",
        position: "Senior Frontend Developer",
        startDate: "2021-01-10",
        salary: "14000",
        status: "active",
        address: "Şişli, İstanbul",
        emergencyContact: "Elif Kaya - +90 534 765 4321"
      },
      {
        companyId: company.id,
        firstName: "Fatma",
        lastName: "Özkan",
        email: "fatma.ozkan@techcorp.com.tr",
        phone: "+90 535 456 7890",
        department: "Pazarlama ve Satış",
        position: "Pazarlama Uzmanı",
        startDate: "2022-05-15",
        salary: "12000",
        status: "active",
        address: "Üsküdar, İstanbul",
        emergencyContact: "Ali Özkan - +90 535 654 3210"
      },
      {
        companyId: company.id,
        firstName: "Emre",
        lastName: "Şahin",
        email: "emre.sahin@techcorp.com.tr",
        phone: "+90 536 567 8901",
        department: "Yazılım Geliştirme",
        position: "Backend Developer",
        startDate: "2021-09-01",
        salary: "13500",
        status: "active",
        address: "Bakırköy, İstanbul",
        emergencyContact: "Sema Şahin - +90 536 543 2109"
      }
    ];

    const insertedEmployees = await db.insert(employees).values(employeeData).returning();
    console.log(`${insertedEmployees.length} employees created`);

    // Insert training programs
    const trainingData = [
      {
        title: "React ve Modern Frontend Geliştirme",
        description: "React 18, Next.js 14 ve modern frontend teknolojileri üzerine kapsamlı eğitim",
        instructor: "Dr. Can Özgür",
        category: "technical",
        duration: 40,
        startDate: "2024-07-01",
        endDate: "2024-07-05",
        maxParticipants: 15,
        location: "Eğitim Salonu A - İstanbul Ofis",
        status: "scheduled",
        objectives: "Modern React patterns, state management, performance optimization ve best practices öğretmek",
        requirements: "Temel JavaScript bilgisi, React deneyimi tercih edilir"
      },
      {
        title: "Liderlik ve Ekip Yönetimi",
        description: "Etkili liderlik teknikleri ve ekip yönetimi stratejileri",
        instructor: "Prof. Dr. Ayşe Kaya",
        category: "leadership",
        duration: 24,
        startDate: "2024-06-20",
        endDate: "2024-06-22",
        maxParticipants: 20,
        location: "Konferans Salonu - İstanbul Ofis",
        status: "active",
        objectives: "Liderlik becerilerini geliştirmek, ekip motivasyonu artırmak, conflict resolution öğrenmek",
        requirements: "Yöneticilik deneyimi veya potansiyeli olan çalışanlar"
      }
    ];

    const insertedTrainings = await db.insert(trainings).values(trainingData).returning();
    console.log(`${insertedTrainings.length} training programs created`);

    // Insert job postings
    const jobData = [
      {
        title: "Senior Full Stack Developer",
        department: "Yazılım Geliştirme",
        location: "İstanbul",
        type: "full-time",
        description: "React, Node.js ve modern web teknolojileri konusunda deneyimli full stack developer aranıyor.",
        requirements: "5+ yıl web geliştirme deneyimi, React, Node.js, TypeScript bilgisi",
        salary: "15000-20000",
        status: "active",
        postedDate: "2024-06-01",
        closingDate: "2024-07-01"
      },
      {
        title: "İK Uzmanı",
        department: "İnsan Kaynakları",
        location: "İstanbul",
        type: "full-time",
        description: "İnsan kaynakları süreçlerini yönetecek deneyimli İK uzmanı aranıyor.",
        requirements: "3+ yıl İK deneyimi, işe alım süreçleri deneyimi, iletişim becerileri",
        salary: "12000-15000",
        status: "active",
        postedDate: "2024-06-05",
        closingDate: "2024-06-30"
      }
    ];

    const insertedJobs = await db.insert(jobs).values(jobData).returning();
    console.log(`${insertedJobs.length} job postings created`);

    // Insert notifications
    const notificationData = [
      {
        userId: "admin_001",
        title: "Yeni İzin Talebi",
        message: "Fatma Özkan'dan yeni bir izin talebi geldi. Onayınızı bekliyor.",
        type: "info",
        isRead: false
      },
      {
        userId: "admin_001",
        title: "Bordro İşlemi Tamamlandı",
        message: "Haziran 2024 bordro işlemleri başarıyla tamamlandı. 45 çalışan için ödeme gerçekleştirildi.",
        type: "success",
        isRead: false
      },
      {
        userId: "admin_001",
        title: "Performans Değerlendirme Hatırlatması",
        message: "Q2 2024 performans değerlendirme süreci 15 Haziran'da başlayacak.",
        type: "reminder",
        isRead: true
      }
    ];

    const insertedNotifications = await db.insert(notifications).values(notificationData).returning();
    console.log(`${insertedNotifications.length} notifications created`);

    console.log("Database seeding completed successfully!");
    return true;

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}