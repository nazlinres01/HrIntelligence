import { db } from "./db";
import { employees, departments, leaves, performance, payroll, activities, notifications } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingEmployees = await db.select().from(employees).limit(1);
    if (existingEmployees.length > 0) {
      console.log("Database already seeded");
      return;
    }

    console.log("Seeding database with comprehensive Turkish company data...");

    // Create departments first
    const sampleDepartments = [
      { name: "Yazılım Geliştirme", description: "Yazılım ürünleri ve teknoloji geliştirme", employeeCount: 15 },
      { name: "Pazarlama ve Satış", description: "Müşteri kazanımı ve marka yönetimi", employeeCount: 12 },
      { name: "İnsan Kaynakları", description: "Personel yönetimi ve organizasyon geliştirme", employeeCount: 6 },
      { name: "Finans ve Muhasebe", description: "Mali işler ve finansal planlama", employeeCount: 8 },
      { name: "Operasyon", description: "İş süreçleri ve operasyonel faaliyetler", employeeCount: 10 }
    ];

    await db.insert(departments).values(sampleDepartments);

    // Create realistic employees with Turkish company structure
    const sampleEmployees = [
      {
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

    await db.insert(employees).values(sampleEmployees);

    // Create comprehensive leave records with calculated days
    const sampleLeaves = [
      {
        employeeId: 2,
        leaveType: "annual",
        startDate: "2024-03-15",
        endDate: "2024-03-22",
        days: 8,
        reason: "Yıllık izin - aile ziyareti",
        status: "approved"
      },
      {
        employeeId: 3,
        leaveType: "sick",
        startDate: "2024-02-10",
        endDate: "2024-02-12",
        days: 3,
        reason: "Sağlık kontrolü ve tedavi",
        status: "approved"
      },
      {
        employeeId: 1,
        leaveType: "personal",
        startDate: "2024-04-20",
        endDate: "2024-04-21",
        days: 2,
        reason: "Özel işler",
        status: "pending"
      },
      {
        employeeId: 4,
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
        employeeId: 1,
        reviewPeriod: "2024-Q1",
        score: "4.8",
        goals: "Yeni mikroservis mimarisini tamamlama ve takım mentorluğu",
        achievements: "3 kritik projeyi zamanında teslim etti, junior geliştiricilere mentorluk yaptı",
        feedback: "Olağanüstü teknik yetkinlik ve liderlik becerileri gösterdi"
      },
      {
        employeeId: 2,
        reviewPeriod: "2024-Q1", 
        score: "4.5",
        goals: "Dijital pazarlama kampanyalarında %20 artış sağlama",
        achievements: "Müşteri kazanımında %25 artış, sosyal medya etkileşiminde %40 artış",
        feedback: "Hedefleri aştı, yaratıcı kampanyalar geliştirdi"
      },
      {
        employeeId: 3,
        reviewPeriod: "2024-Q1",
        score: "4.2",
        goals: "Personel eğitim programlarını modernize etme",
        achievements: "Online eğitim platformu kurdu, çalışan memnuniyetini %15 artırdı",
        feedback: "İnovatif yaklaşımlar sergiliyor, gelişim potansiyeli yüksek"
      },
      {
        employeeId: 4,
        reviewPeriod: "2024-Q1",
        score: "4.6",
        goals: "Mali raporlama süreçlerini otomatikleştirme",
        achievements: "Raporlama süresini %50 kısalttı, hata oranını minimize etti",
        feedback: "Analitik düşünce ve problem çözme becerileri mükemmel"
      },
      {
        employeeId: 5,
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
        employeeId: 1,
        month: "2024-03",
        baseSalary: "120000.00",
        bonuses: "8000.00",
        deductions: "22000.00",
        netSalary: "106000.00",
        status: "paid",
        paymentDate: "2024-03-31"
      },
      {
        employeeId: 2,
        month: "2024-03",
        baseSalary: "95000.00",
        bonuses: "6000.00",
        deductions: "18000.00",
        netSalary: "83000.00",
        status: "paid",
        paymentDate: "2024-03-31"
      },
      {
        employeeId: 3,
        month: "2024-03",
        baseSalary: "75000.00",
        bonuses: "4000.00",
        deductions: "14000.00",
        netSalary: "65000.00",
        status: "paid",
        paymentDate: "2024-03-30"
      },
      {
        employeeId: 4,
        month: "2024-03",
        baseSalary: "85000.00",
        bonuses: "5000.00",
        deductions: "16000.00",
        netSalary: "74000.00",
        status: "paid",
        paymentDate: "2024-03-31"
      },
      {
        employeeId: 5,
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