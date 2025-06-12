import { db } from "./db";
import { companies, users, employees, departments, leaves, performance, payroll, activities, notifications } from "@shared/schema";
import bcrypt from "bcrypt";

export async function seedDatabase() {
  try {
    // Clear existing data in correct order (child tables first)
    await db.delete(notifications);
    await db.delete(activities);
    await db.delete(payroll);
    await db.delete(performance);
    await db.delete(leaves);
    await db.delete(employees);
    await db.delete(departments);
    await db.delete(users);
    await db.delete(companies);

    console.log("Seeding database with comprehensive Turkish company data...");

    // Generate hashed passwords
    const adminHashedPassword = await bcrypt.hash("admin123", 12);
    const userHashedPassword = await bcrypt.hash("password123", 12);

    // Create sample companies
    const sampleCompanies = [
      {
        name: "TechCorp Yazılım A.Ş.",
        industry: "Yazılım ve Teknoloji",
        size: "large",
        description: "Türkiye'nin önde gelen yazılım ve teknoloji şirketlerinden biri. Kurumsal çözümler ve dijital dönüşüm hizmetleri sunmaktadır.",
        address: {
          street: "Maslak Mahallesi, Büyükdere Cad. No:245",
          city: "İstanbul",
          country: "Türkiye"
        },
        contactInfo: {
          phone: "+90 212 456 78 90",
          email: "info@techcorp.com.tr"
        },
        website: "https://www.techcorp.com.tr",
        taxNumber: "1234567890",
        employeeCount: 125
      },
      {
        name: "İnovasyon Teknoloji Ltd.",
        industry: "Bilgi Teknolojileri",
        size: "medium",
        description: "Mobil uygulama geliştirme ve web çözümleri konusunda uzman teknoloji firması.",
        address: {
          street: "Kızılay Mahallesi, Atatürk Bulvarı No:108",
          city: "Ankara",
          country: "Türkiye"
        },
        contactInfo: {
          phone: "+90 312 555 66 77",
          email: "info@inovasyon.com.tr"
        },
        website: "https://www.inovasyon.com.tr",
        taxNumber: "9876543210",
        employeeCount: 45
      },
      {
        name: "Digital Solutions Corp",
        industry: "Dijital Pazarlama",
        size: "startup",
        description: "Yeni nesil dijital pazarlama çözümleri ve e-ticaret platformları geliştiren girişim şirketi.",
        address: {
          street: "Alsancak Mahallesi, Cumhuriyet Bulvarı No:67",
          city: "İzmir", 
          country: "Türkiye"
        },
        contactInfo: {
          phone: "+90 232 333 44 55",
          email: "hello@digitalsolutions.com"
        },
        website: "https://www.digitalsolutions.com",
        taxNumber: "5432167890",
        employeeCount: 12
      },
      {
        name: "Microsoft Türkiye A.Ş.",
        industry: "Yazılım ve Teknoloji",
        size: "enterprise",
        description: "Dünyanın en büyük yazılım şirketlerinden Microsoft'un Türkiye ofisi. Bulut bilişim, yapay zeka ve kurumsal çözümler sunmaktadır.",
        address: {
          street: "Eski Büyükdere Cad. No:13 Maslak",
          city: "İstanbul",
          country: "Türkiye"
        },
        contactInfo: {
          phone: "+90 212 335 10 00",
          email: "info@microsoft.com.tr"
        },
        website: "https://www.microsoft.com/tr-tr",
        taxNumber: "1122334455",
        employeeCount: 850
      }
    ];

    const [sampleCompany, ...otherCompanies] = await db.insert(companies).values(sampleCompanies).returning();

    // Create departments for the company
    const sampleDepartments = [
      { companyId: sampleCompany.id, name: "Yazılım Geliştirme", description: "Yazılım ürünleri ve teknoloji geliştirme", employeeCount: 15 },
      { companyId: sampleCompany.id, name: "Pazarlama ve Satış", description: "Müşteri kazanımı ve marka yönetimi", employeeCount: 12 },
      { companyId: sampleCompany.id, name: "İnsan Kaynakları", description: "Personel yönetimi ve organizasyon geliştirme", employeeCount: 6 },
      { companyId: sampleCompany.id, name: "Finans ve Muhasebe", description: "Mali işler ve finansal planlama", employeeCount: 8 },
      { companyId: sampleCompany.id, name: "Operasyon", description: "İş süreçleri ve operasyonel faaliyetler", employeeCount: 10 }
    ];

    await db.insert(departments).values(sampleDepartments);



    // Create HR team users for the company
    const hrTeamUsers = [
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
    ];

    await db.insert(users).values(hrTeamUsers);

    // Create realistic employees with Turkish company structure
    const sampleEmployees = [
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
      },
      {
        companyId: sampleCompany.id,
        firstName: "Selin",
        lastName: "Demir",
        email: "selin.demir@techcorp.com.tr",
        phone: "+90 535 456 78 90",
        department: "Finans ve Muhasebe",
        position: "Mali İşler Uzmanı",
        startDate: "2021-11-05",
        salary: "85000.00",
        status: "active",
        address: "Etiler Mahallesi, Beşiktaş/İstanbul",
        emergencyContact: "+90 535 654 32 10",
        notes: "Bütçe planlama ve finansal analiz uzmanı",
        performanceScore: "4.6"
      },
      {
        companyId: sampleCompany.id,
        firstName: "Burak",
        lastName: "Şen",
        email: "burak.sen@techcorp.com.tr",
        phone: "+90 536 567 89 01", 
        department: "Operasyon",
        position: "Operasyon Koordinatörü",
        startDate: "2023-05-15",
        salary: "70000.00",
        status: "active",
        address: "Acıbadem Mahallesi, Üsküdar/İstanbul",
        emergencyContact: "+90 536 543 21 09",
        notes: "Süreç iyileştirme ve kalite yönetimi",
        performanceScore: "4.0"
      }
    ];

    const insertedEmployees = await db.insert(employees).values(sampleEmployees).returning();

    // Create comprehensive leave records with calculated days
    const sampleLeaves = [
      {
        employeeId: insertedEmployees[1].id,
        leaveType: "annual",
        startDate: "2024-03-15",
        endDate: "2024-03-22",
        days: 8,
        reason: "Yıllık izin - aile ziyareti",
        status: "approved"
      },
      {
        employeeId: insertedEmployees[2].id,
        leaveType: "sick",
        startDate: "2024-02-10",
        endDate: "2024-02-12",
        days: 3,
        reason: "Sağlık kontrolü ve tedavi",
        status: "approved"
      },
      {
        employeeId: insertedEmployees[0].id,
        leaveType: "personal",
        startDate: "2024-04-20",
        endDate: "2024-04-21",
        days: 2,
        reason: "Özel işler",
        status: "pending"
      },
      {
        employeeId: insertedEmployees[3].id,
        leaveType: "annual",
        startDate: "2024-05-10",
        endDate: "2024-05-17",
        days: 8,
        reason: "Tatil planı",
        status: "pending"
      }
    ];

    await db.insert(leaves).values(sampleLeaves);

    // Create detailed performance records with realistic ratings
    const samplePerformance = [
      {
        employeeId: insertedEmployees[0].id,
        reviewPeriod: "2024-Q1",
        score: "4.8",
        goals: "Yeni mikroservis mimarisini tamamlama ve takım mentorluğu",
        achievements: "3 kritik projeyi zamanında teslim etti, junior geliştiricilere mentorluk yaptı",
        feedback: "Olağanüstü teknik yetkinlik ve liderlik becerileri gösterdi"
      },
      {
        employeeId: insertedEmployees[1].id,
        reviewPeriod: "2024-Q1", 
        score: "4.5",
        goals: "Dijital pazarlama kampanyalarında %20 artış sağlama",
        achievements: "Müşteri kazanımında %25 artış, sosyal medya etkileşiminde %40 artış",
        feedback: "Hedefleri aştı, yaratıcı kampanyalar geliştirdi"
      },
      {
        employeeId: insertedEmployees[2].id,
        reviewPeriod: "2024-Q1",
        score: "4.2",
        goals: "Personel eğitim programlarını modernize etme",
        achievements: "Online eğitim platformu kurdu, çalışan memnuniyetini %15 artırdı",
        feedback: "İnovatif yaklaşımlar sergiliyor, gelişim potansiyeli yüksek"
      },
      {
        employeeId: insertedEmployees[3].id,
        reviewPeriod: "2024-Q1",
        score: "4.6",
        goals: "Mali raporlama süreçlerini otomatikleştirme",
        achievements: "Raporlama süresini %50 kısalttı, hata oranını minimize etti",
        feedback: "Analitik düşünce ve problem çözme becerileri mükemmel"
      },
      {
        employeeId: insertedEmployees[4].id,
        reviewPeriod: "2024-Q1",
        score: "4.0",
        goals: "Operasyonel verimliliği %10 artırma",
        achievements: "Süreç optimizasyonları ile %12 verimlilik artışı sağladı",
        feedback: "Sistematik yaklaşım, sürekli iyileştirme odaklı"
      }
    ];

    await db.insert(performance).values(samplePerformance);

    // Create realistic payroll records
    const samplePayroll = [
      {
        employeeId: insertedEmployees[0].id,
        month: "2024-03",
        baseSalary: "120000.00",
        bonuses: "8000.00",
        deductions: "22000.00",
        netSalary: "106000.00",
        status: "paid",
        paymentDate: "2024-03-31"
      },
      {
        employeeId: insertedEmployees[1].id,
        month: "2024-03",
        baseSalary: "95000.00",
        bonuses: "6000.00",
        deductions: "18000.00",
        netSalary: "83000.00",
        status: "paid",
        paymentDate: "2024-03-31"
      },
      {
        employeeId: insertedEmployees[2].id,
        month: "2024-03",
        baseSalary: "75000.00",
        bonuses: "4000.00",
        deductions: "14000.00",
        netSalary: "65000.00",
        status: "paid",
        paymentDate: "2024-03-30"
      },
      {
        employeeId: insertedEmployees[3].id,
        month: "2024-03",
        baseSalary: "85000.00",
        bonuses: "5000.00",
        deductions: "16000.00",
        netSalary: "74000.00",
        status: "paid",
        paymentDate: "2024-03-31"
      },
      {
        employeeId: insertedEmployees[4].id,
        month: "2024-03",
        baseSalary: "70000.00",
        bonuses: "3500.00",
        deductions: "13000.00",
        netSalary: "60500.00",
        status: "pending"
      }
    ];

    await db.insert(payroll).values(samplePayroll);

    // Create comprehensive activity records
    const sampleActivities = [
      {
        type: "employee_added",
        description: "Yeni çalışan sisteme eklendi: Ahmet Özkan",
        entityId: 1,
        entityType: "employee"
      },
      {
        type: "leave_approved",
        description: "İzin talebi onaylandı: Zeynep Yılmaz - Yıllık izin",
        entityId: 1,
        entityType: "leave"
      },
      {
        type: "performance_review",
        description: "Performans değerlendirmesi tamamlandı: Ahmet Özkan",
        entityId: 1,
        entityType: "performance"
      },
      {
        type: "payroll_processed",
        description: "Mart ayı bordroları işlendi",
        entityId: 1,
        entityType: "payroll"
      },
      {
        type: "employee_updated",
        description: "Çalışan bilgileri güncellendi: Selin Demir",
        entityId: 4,
        entityType: "employee"
      }
    ];

    await db.insert(activities).values(sampleActivities);

    // Create sample notifications for testing
    const sampleNotifications = [
      {
        userId: "user-1749570121228",
        title: "Hoş Geldiniz!",
        message: "İK360 sistemine hoş geldiniz. Tüm özelliklerimizi keşfetmek için yardım sayfasını ziyaret edebilirsiniz.",
        type: "info",
        isRead: false
      },
      {
        userId: "user-1749570121228", 
        title: "Yeni Çalışan Eklendi",
        message: "Ahmet Özkan sisteme başarıyla eklendi ve Yazılım Geliştirme departmanına atandı.",
        type: "success",
        isRead: false
      },
      {
        userId: "user-1749570121228",
        title: "İzin Talebi Beklemede",
        message: "1 izin talebi onayınızı bekliyor. Lütfen kontrol ediniz.",
        type: "warning",
        isRead: false,
        actionUrl: "/leaves"
      },
      {
        userId: "user-1749570121228",
        title: "Bordro Hazırlandı",
        message: "Aralık ayı bordroları hazırlandı ve çalışanlara gönderildi.",
        type: "success",
        isRead: true
      },
      {
        userId: "user-1749570121228",
        title: "Sistem Güncellemesi",
        message: "İK360 sistemi başarıyla güncellendi. Yeni özellikler kullanıma hazır.",
        type: "info",
        isRead: true
      }
    ];

    await db.insert(notifications).values(sampleNotifications);

    console.log("Database seeded successfully with comprehensive Turkish company data");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}