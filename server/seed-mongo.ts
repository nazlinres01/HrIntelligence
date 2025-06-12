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

export async function seedMongoDatabase() {
  try {
    console.log('Starting MongoDB database seeding...');

    // Clear existing data
    await Promise.all([
      Company.deleteMany({}),
      Department.deleteMany({}),
      User.deleteMany({}),
      Employee.deleteMany({}),
      Recruitment.deleteMany({}),
      Performance.deleteMany({}),
      Payroll.deleteMany({}),
      Leave.deleteMany({}),
      AuditLog.deleteMany({}),
      Activity.deleteMany({}),
      Notification.deleteMany({})
    ]);

    // Create companies
    const companies = await Company.insertMany([
      {
        name: 'TechCorp Türkiye',
        description: 'Türkiye\'nin önde gelen teknoloji şirketi',
        industry: 'Teknoloji',
        size: 'large',
        website: 'https://techcorp.com.tr',
        address: {
          street: 'Maslak Mahallesi Büyükdere Caddesi No:123',
          city: 'İstanbul',
          state: 'İstanbul',
          country: 'Türkiye',
          zipCode: '34485'
        },
        contactInfo: {
          email: 'info@techcorp.com.tr',
          phone: '+90 212 555 0123'
        },
        settings: {
          workingHours: { start: '09:00', end: '18:00' },
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          timezone: 'Europe/Istanbul'
        }
      },
      {
        name: 'İnovasyon A.Ş.',
        description: 'Dijital dönüşüm ve inovasyon danışmanlığı',
        industry: 'Danışmanlık',
        size: 'medium',
        website: 'https://inovasyon.com.tr',
        address: {
          street: 'Levent Mahallesi Büyükdere Caddesi No:456',
          city: 'İstanbul',
          state: 'İstanbul',
          country: 'Türkiye',
          zipCode: '34394'
        },
        contactInfo: {
          email: 'info@inovasyon.com.tr',
          phone: '+90 212 555 0456'
        }
      }
    ]);

    // Create departments
    const departments = await Department.insertMany([
      {
        name: 'Yazılım Geliştirme',
        description: 'Yazılım ürünleri geliştirme departmanı',
        companyId: companies[0]._id,
        budget: 5000000,
        employeeCount: 25,
        goals: ['Yeni ürün geliştirme', 'Kod kalitesi artırma', 'DevOps süreçleri']
      },
      {
        name: 'İnsan Kaynakları',
        description: 'İK ve personel yönetimi',
        companyId: companies[0]._id,
        budget: 1500000,
        employeeCount: 8,
        goals: ['Yetenek kazanımı', 'Çalışan memnuniyeti', 'Performans yönetimi']
      },
      {
        name: 'Pazarlama',
        description: 'Pazarlama ve satış faaliyetleri',
        companyId: companies[0]._id,
        budget: 3000000,
        employeeCount: 15,
        goals: ['Marka bilinirliği', 'Müşteri kazanımı', 'Dijital pazarlama']
      },
      {
        name: 'Finans',
        description: 'Mali işler ve muhasebe',
        companyId: companies[0]._id,
        budget: 1200000,
        employeeCount: 6,
        goals: ['Mali kontrol', 'Raporlama', 'Bütçe yönetimi']
      },
      {
        name: 'Proje Yönetimi',
        description: 'Proje planlama ve yönetimi',
        companyId: companies[1]._id,
        budget: 2000000,
        employeeCount: 12,
        goals: ['Proje başarısı', 'Zaman yönetimi', 'Kalite güvencesi']
      }
    ]);

    // Create users with hashed passwords
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    const users = await User.insertMany([
      {
        email: 'admin@gmail.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        companyId: companies[0]._id,
        permissions: {
          canViewEmployees: true,
          canEditEmployees: true,
          canDeleteEmployees: true,
          canViewPerformance: true,
          canEditPerformance: true,
          canViewPayroll: true,
          canEditPayroll: true,
          canViewReports: true,
          canManageTeam: true,
          canViewAuditLogs: true
        }
      },
      {
        email: 'fatma.yilmaz@techcorp.com.tr',
        password: hashedPassword,
        firstName: 'Fatma',
        lastName: 'Yılmaz',
        role: 'hr_manager',
        companyId: companies[0]._id,
        departmentId: departments[1]._id,
        permissions: {
          canViewEmployees: true,
          canEditEmployees: true,
          canViewPerformance: true,
          canEditPerformance: true,
          canViewPayroll: true,
          canViewReports: true,
          canManageTeam: true
        }
      },
      {
        email: 'mehmet.demir@techcorp.com.tr',
        password: hashedPassword,
        firstName: 'Mehmet',
        lastName: 'Demir',
        role: 'hr_specialist',
        companyId: companies[0]._id,
        departmentId: departments[1]._id,
        permissions: {
          canViewEmployees: true,
          canEditEmployees: true,
          canViewPerformance: true,
          canViewReports: true
        }
      },
      {
        email: 'ayse.kaya@techcorp.com.tr',
        password: hashedPassword,
        firstName: 'Ayşe',
        lastName: 'Kaya',
        role: 'department_manager',
        companyId: companies[0]._id,
        departmentId: departments[0]._id,
        permissions: {
          canViewEmployees: true,
          canViewPerformance: true,
          canManageTeam: true
        }
      },
      {
        email: 'ali.ozkan@techcorp.com.tr',
        password: hashedPassword,
        firstName: 'Ali',
        lastName: 'Özkan',
        role: 'employee',
        companyId: companies[0]._id,
        departmentId: departments[0]._id
      },
      {
        email: 'zeynep.celik@techcorp.com.tr',
        password: hashedPassword,
        firstName: 'Zeynep',
        lastName: 'Çelik',
        role: 'employee',
        companyId: companies[0]._id,
        departmentId: departments[2]._id
      },
      {
        email: 'burak.arslan@techcorp.com.tr',
        password: hashedPassword,
        firstName: 'Burak',
        lastName: 'Arslan',
        role: 'employee',
        companyId: companies[0]._id,
        departmentId: departments[3]._id
      }
    ]);

    // Update department managers
    await Department.findByIdAndUpdate(departments[0]._id, { managerId: users[3]._id });
    await Department.findByIdAndUpdate(departments[1]._id, { managerId: users[1]._id });

    // Create employees
    const employees = await Employee.insertMany([
      {
        employeeId: 'EMP001',
        userId: users[1]._id,
        companyId: companies[0]._id,
        departmentId: departments[1]._id,
        position: 'İK Müdürü',
        level: 'manager',
        salary: 85000,
        contractType: 'full-time',
        startDate: new Date('2020-03-15'),
        skills: ['İK Yönetimi', 'Performans Değerlendirme', 'Bordro'],
        personalInfo: {
          phone: '+90 532 123 4567',
          emergencyContact: {
            name: 'Ahmet Yılmaz',
            phone: '+90 532 765 4321',
            relationship: 'Eş'
          }
        }
      },
      {
        employeeId: 'EMP002',
        userId: users[2]._id,
        companyId: companies[0]._id,
        departmentId: departments[1]._id,
        position: 'İK Uzmanı',
        level: 'senior',
        salary: 65000,
        contractType: 'full-time',
        startDate: new Date('2021-07-10'),
        managerId: users[1]._id,
        skills: ['İşe Alım', 'Eğitim Koordinasyonu', 'Çalışan İlişkileri'],
        personalInfo: {
          phone: '+90 533 234 5678'
        }
      },
      {
        employeeId: 'EMP003',
        userId: users[3]._id,
        companyId: companies[0]._id,
        departmentId: departments[0]._id,
        position: 'Yazılım Geliştirme Müdürü',
        level: 'manager',
        salary: 95000,
        contractType: 'full-time',
        startDate: new Date('2019-11-20'),
        skills: ['Team Leadership', 'Software Architecture', 'Project Management'],
        personalInfo: {
          phone: '+90 534 345 6789'
        }
      },
      {
        employeeId: 'EMP004',
        userId: users[4]._id,
        companyId: companies[0]._id,
        departmentId: departments[0]._id,
        position: 'Senior Yazılım Geliştirici',
        level: 'senior',
        salary: 75000,
        contractType: 'full-time',
        startDate: new Date('2022-02-01'),
        managerId: users[3]._id,
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
        personalInfo: {
          phone: '+90 535 456 7890'
        }
      },
      {
        employeeId: 'EMP005',
        userId: users[5]._id,
        companyId: companies[0]._id,
        departmentId: departments[2]._id,
        position: 'Pazarlama Uzmanı',
        level: 'mid',
        salary: 55000,
        contractType: 'full-time',
        startDate: new Date('2022-09-15'),
        skills: ['Digital Marketing', 'Content Creation', 'SEO'],
        personalInfo: {
          phone: '+90 536 567 8901'
        }
      },
      {
        employeeId: 'EMP006',
        userId: users[6]._id,
        companyId: companies[0]._id,
        departmentId: departments[3]._id,
        position: 'Mali Müşavir',
        level: 'senior',
        salary: 70000,
        contractType: 'full-time',
        startDate: new Date('2021-01-10'),
        skills: ['Accounting', 'Financial Analysis', 'Budget Planning'],
        personalInfo: {
          phone: '+90 537 678 9012'
        }
      }
    ]);

    // Create recruitment jobs
    await Recruitment.insertMany([
      {
        jobTitle: 'Senior Frontend Developer',
        departmentId: departments[0]._id,
        companyId: companies[0]._id,
        description: 'React ve TypeScript deneyimi olan senior frontend developer aranıyor.',
        requirements: ['5+ yıl React deneyimi', 'TypeScript bilgisi', 'Redux/Zustand', 'Jest/Testing'],
        benefits: ['Esnek çalışma saatleri', 'Remote çalışma imkanı', 'Eğitim desteği'],
        salaryRange: { min: 70000, max: 90000, currency: 'TRY' },
        location: 'İstanbul - Maslak',
        employmentType: 'full-time',
        status: 'active',
        applications: [
          {
            candidateName: 'Can Yılmaz',
            candidateEmail: 'can.yilmaz@email.com',
            candidatePhone: '+90 532 111 2222',
            status: 'interview',
            appliedAt: new Date('2024-12-01'),
            notes: 'Güçlü React deneyimi var'
          },
          {
            candidateName: 'Elif Demir',
            candidateEmail: 'elif.demir@email.com',
            candidatePhone: '+90 533 222 3333',
            status: 'screening',
            appliedAt: new Date('2024-12-05')
          }
        ],
        postedAt: new Date('2024-11-15'),
        createdBy: users[1]._id
      },
      {
        jobTitle: 'İK Uzmanı',
        departmentId: departments[1]._id,
        companyId: companies[0]._id,
        description: 'İnsan kaynakları departmanında çalışacak deneyimli uzman aranıyor.',
        requirements: ['3+ yıl İK deneyimi', 'İşe alım süreçleri', 'Performans yönetimi'],
        benefits: ['Sağlık sigortası', 'Yemek kartı', 'Ulaşım desteği'],
        salaryRange: { min: 50000, max: 65000, currency: 'TRY' },
        location: 'İstanbul - Maslak',
        employmentType: 'full-time',
        status: 'active',
        applications: [],
        postedAt: new Date('2024-12-10'),
        createdBy: users[1]._id
      }
    ]);

    // Create performance records
    await Performance.insertMany([
      {
        employeeId: employees[3]._id,
        reviewerId: employees[2]._id,
        period: {
          start: new Date('2024-07-01'),
          end: new Date('2024-09-30')
        },
        type: 'quarterly',
        goals: [
          {
            title: 'Proje teslimi',
            description: 'E-ticaret projesini zamanında teslim etmek',
            targetDate: new Date('2024-09-15'),
            status: 'completed',
            score: 5
          },
          {
            title: 'Kod kalitesi',
            description: 'Code review süreçlerine aktif katılım',
            targetDate: new Date('2024-09-30'),
            status: 'completed',
            score: 4
          }
        ],
        ratings: {
          technical: 5,
          communication: 4,
          teamwork: 5,
          leadership: 3,
          initiative: 4
        },
        overallScore: 4.2,
        feedback: 'Teknik becerileri çok güçlü, takım çalışmasında başarılı.',
        achievements: ['Proje liderliği', 'Mentor rolü'],
        status: 'completed'
      },
      {
        employeeId: employees[4]._id,
        reviewerId: employees[2]._id,
        period: {
          start: new Date('2024-10-01'),
          end: new Date('2024-12-31')
        },
        type: 'quarterly',
        goals: [
          {
            title: 'Pazarlama kampanyası',
            description: 'Yeni ürün lansmanı için pazarlama kampanyası',
            targetDate: new Date('2024-12-15'),
            status: 'in-progress',
            score: 3
          }
        ],
        ratings: {
          technical: 4,
          communication: 5,
          teamwork: 4,
          leadership: 4,
          initiative: 5
        },
        overallScore: 4.4,
        status: 'pending'
      }
    ]);

    // Create payroll records
    const currentDate = new Date();
    await Payroll.insertMany([
      {
        employeeId: employees[0]._id,
        companyId: companies[0]._id,
        period: { month: currentDate.getMonth() + 1, year: currentDate.getFullYear() },
        baseSalary: 85000,
        allowances: { housing: 5000, transport: 1500, meal: 2000 },
        deductions: { tax: 15300, socialSecurity: 8500, insurance: 500 },
        overtime: { hours: 0, rate: 0, amount: 0 },
        bonus: 10000,
        grossSalary: 103500,
        netSalary: 79200,
        status: 'paid',
        paidAt: new Date(),
        processedBy: users[0]._id
      },
      {
        employeeId: employees[1]._id,
        companyId: companies[0]._id,
        period: { month: currentDate.getMonth() + 1, year: currentDate.getFullYear() },
        baseSalary: 65000,
        allowances: { housing: 3000, transport: 1500, meal: 2000 },
        deductions: { tax: 11700, socialSecurity: 6500, insurance: 500 },
        overtime: { hours: 5, rate: 250, amount: 1250 },
        bonus: 5000,
        grossSalary: 76750,
        netSalary: 58050,
        status: 'approved',
        processedBy: users[0]._id
      },
      {
        employeeId: employees[2]._id,
        companyId: companies[0]._id,
        period: { month: currentDate.getMonth() + 1, year: currentDate.getFullYear() },
        baseSalary: 95000,
        allowances: { housing: 6000, transport: 1500, meal: 2000 },
        deductions: { tax: 18810, socialSecurity: 9500, insurance: 500 },
        bonus: 15000,
        grossSalary: 119500,
        netSalary: 90690,
        status: 'draft',
        processedBy: users[0]._id
      }
    ]);

    // Create leave records
    await Leave.insertMany([
      {
        employeeId: employees[3]._id,
        type: 'annual',
        startDate: new Date('2024-12-20'),
        endDate: new Date('2024-12-27'),
        days: 6,
        reason: 'Yıl sonu tatili',
        status: 'approved',
        approvedBy: users[1]._id,
        approvedAt: new Date()
      },
      {
        employeeId: employees[4]._id,
        type: 'sick',
        startDate: new Date('2024-12-15'),
        endDate: new Date('2024-12-16'),
        days: 2,
        reason: 'Grip',
        status: 'pending'
      },
      {
        employeeId: employees[1]._id,
        type: 'personal',
        startDate: new Date('2024-12-30'),
        endDate: new Date('2025-01-02'),
        days: 3,
        reason: 'Kişisel işler',
        status: 'approved',
        approvedBy: users[1]._id,
        approvedAt: new Date()
      }
    ]);

    // Create activities
    await Activity.insertMany([
      {
        userId: users[0]._id,
        type: 'user_login',
        description: 'Admin kullanıcısı sisteme giriş yaptı',
        metadata: { ipAddress: '192.168.1.100' }
      },
      {
        userId: users[1]._id,
        type: 'employee_created',
        description: 'Yeni çalışan kaydı oluşturuldu',
        metadata: { employeeId: 'EMP007' }
      },
      {
        userId: users[2]._id,
        type: 'performance_review',
        description: 'Performans değerlendirmesi tamamlandı',
        metadata: { reviewId: 'REV001' }
      },
      {
        userId: users[1]._id,
        type: 'leave_approved',
        description: 'İzin talebi onaylandı',
        metadata: { leaveType: 'annual', days: 6 }
      },
      {
        userId: users[0]._id,
        type: 'payroll_processed',
        description: 'Bordro işlemleri tamamlandı',
        metadata: { month: 12, year: 2024, employeeCount: 6 }
      }
    ]);

    // Create notifications
    await Notification.insertMany([
      {
        userId: users[1]._id,
        title: 'Yeni İzin Talebi',
        message: 'Ali Özkan yıllık izin talebinde bulundu.',
        type: 'info'
      },
      {
        userId: users[0]._id,
        title: 'Bordro Onayı Gerekli',
        message: 'Aralık ayı bordro işlemleri onay bekliyor.',
        type: 'warning'
      },
      {
        userId: users[2]._id,
        title: 'Performans Değerlendirmesi',
        message: 'Q4 performans değerlendirmenizi tamamlayınız.',
        type: 'info'
      },
      {
        userId: users[3]._id,
        title: 'Toplantı Hatırlatması',
        message: 'Yarın saat 14:00\'da departman toplantısı.',
        type: 'info',
        isRead: true,
        readAt: new Date()
      }
    ]);

    // Create audit logs
    await AuditLog.insertMany([
      {
        userId: users[0]._id,
        action: 'CREATE',
        resource: 'employee',
        resourceId: employees[5]._id.toString(),
        details: { action: 'Yeni çalışan eklendi', employeeId: 'EMP006' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        userId: users[1]._id,
        action: 'UPDATE',
        resource: 'leave',
        resourceId: 'leave_001',
        details: { action: 'İzin talebi onaylandı', status: 'approved' },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      },
      {
        userId: users[0]._id,
        action: 'CREATE',
        resource: 'payroll',
        resourceId: 'payroll_001',
        details: { action: 'Bordro kaydı oluşturuldu', month: 12, year: 2024 },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    ]);

    console.log('MongoDB database seeded successfully!');
    console.log(`Created: ${companies.length} companies, ${departments.length} departments, ${users.length} users, ${employees.length} employees`);

  } catch (error) {
    console.error('Error seeding MongoDB database:', error);
    throw error;
  }
}