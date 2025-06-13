export const sampleCompanies = [
  {
    id: 489,
    name: "TechCorp Yazılım A.Ş.",
    type: "corporation",
    industry: "Bilişim ve Teknoloji",
    taxId: "1234567890",
    address: {
      street: "Maslak Mahallesi Büyükdere Caddesi No:123",
      city: "İstanbul",
      country: "Türkiye"
    },
    phone: "+90 212 555 0123",
    email: "info@techcorp.com.tr",
    website: "https://www.techcorp.com.tr",
    foundedYear: "2015",
    employeeCount: "150",
    description: "Kurumsal yazılım çözümleri ve dijital dönüşüm hizmetleri"
  },
  {
    id: 490,
    name: "İnovasyon Mühendislik Ltd. Şti.",
    type: "llc",
    industry: "Mühendislik",
    taxId: "2345678901",
    address: {
      street: "Atatürk Mahallesi Cumhuriyet Caddesi No:45",
      city: "Ankara",
      country: "Türkiye"
    },
    phone: "+90 312 555 0456",
    email: "bilgi@inovasyon.com.tr",
    website: "https://www.inovasyon.com.tr",
    foundedYear: "2018",
    employeeCount: "85",
    description: "Endüstriyel otomasyon ve mühendislik çözümleri"
  }
];

export const sampleDepartments = [
  {
    id: 1302,
    companyId: 489,
    name: "Yazılım Geliştirme",
    description: "Web ve mobil uygulama geliştirme departmanı",
    head: "Ahmet Yılmaz",
    employeeCount: 25,
    budget: "2500000",
    location: "İstanbul Ofis - 3. Kat"
  },
  {
    id: 1303,
    companyId: 489,
    name: "İnsan Kaynakları",
    description: "Personel yönetimi ve organizasyon geliştirme",
    head: "Ayşe Demir",
    employeeCount: 8,
    budget: "800000",
    location: "İstanbul Ofis - 2. Kat"
  },
  {
    id: 1304,
    companyId: 489,
    name: "Pazarlama ve Satış",
    description: "Dijital pazarlama ve kurumsal satış departmanı",
    head: "Mehmet Kaya",
    employeeCount: 12,
    budget: "1800000",
    location: "İstanbul Ofis - 1. Kat"
  },
  {
    id: 1305,
    companyId: 489,
    name: "Muhasebe ve Finans",
    description: "Mali işler ve finansal planlama departmanı",
    head: "Fatma Özkan",
    employeeCount: 6,
    budget: "600000",
    location: "İstanbul Ofis - 4. Kat"
  }
];

export const sampleEmployees = [
  {
    id: 465,
    companyId: 489,
    departmentId: 1302,
    firstName: "Ahmet",
    lastName: "Yılmaz",
    email: "ahmet.yilmaz@techcorp.com.tr",
    phone: "+90 532 123 4567",
    position: "Yazılım Geliştirme Müdürü",
    startDate: "2020-03-15",
    salary: "18000",
    status: "active",
    birthDate: "1985-07-12",
    address: "Beşiktaş, İstanbul",
    emergencyContact: "Zeynep Yılmaz - +90 532 987 6543"
  },
  {
    id: 466,
    companyId: 489,
    departmentId: 1303,
    firstName: "Ayşe",
    lastName: "Demir",
    email: "ayse.demir@techcorp.com.tr",
    phone: "+90 533 234 5678",
    position: "İK Müdürü",
    startDate: "2019-08-20",
    salary: "16500",
    status: "active",
    birthDate: "1988-03-25",
    address: "Kadıköy, İstanbul",
    emergencyContact: "Murat Demir - +90 533 876 5432"
  },
  {
    id: 467,
    companyId: 489,
    departmentId: 1302,
    firstName: "Mehmet",
    lastName: "Kaya",
    email: "mehmet.kaya@techcorp.com.tr",
    phone: "+90 534 345 6789",
    position: "Senior Frontend Developer",
    startDate: "2021-01-10",
    salary: "14000",
    status: "active",
    birthDate: "1990-11-08",
    address: "Şişli, İstanbul",
    emergencyContact: "Elif Kaya - +90 534 765 4321"
  },
  {
    id: 468,
    companyId: 489,
    departmentId: 1304,
    firstName: "Fatma",
    lastName: "Özkan",
    email: "fatma.ozkan@techcorp.com.tr",
    phone: "+90 535 456 7890",
    position: "Pazarlama Uzmanı",
    startDate: "2022-05-15",
    salary: "12000",
    status: "active",
    birthDate: "1992-06-18",
    address: "Üsküdar, İstanbul",
    emergencyContact: "Ali Özkan - +90 535 654 3210"
  },
  {
    id: 469,
    companyId: 489,
    departmentId: 1302,
    firstName: "Emre",
    lastName: "Şahin",
    email: "emre.sahin@techcorp.com.tr",
    phone: "+90 536 567 8901",
    position: "Backend Developer",
    startDate: "2021-09-01",
    salary: "13500",
    status: "active",
    birthDate: "1989-12-03",
    address: "Bakırköy, İstanbul",
    emergencyContact: "Sema Şahin - +90 536 543 2109"
  }
];

export const sampleLeaves = [
  {
    id: 221,
    employeeId: 466,
    leaveType: "annual",
    startDate: "2024-07-15",
    endDate: "2024-07-26",
    status: "approved",
    reason: "Yıllık izin - Aile tatili planı",
    appliedDate: "2024-06-10",
    approvedBy: "ahmet.yilmaz@techcorp.com.tr",
    approvedDate: "2024-06-12"
  },
  {
    id: 222,
    employeeId: 467,
    leaveType: "sick",
    startDate: "2024-06-20",
    endDate: "2024-06-22",
    status: "approved",
    reason: "Sağlık kontrolü ve tedavi süreci",
    appliedDate: "2024-06-18",
    approvedBy: "ayse.demir@techcorp.com.tr",
    approvedDate: "2024-06-18"
  },
  {
    id: 223,
    employeeId: 468,
    leaveType: "personal",
    startDate: "2024-08-05",
    endDate: "2024-08-07",
    status: "pending",
    reason: "Evlilik hazırlıkları",
    appliedDate: "2024-06-11",
    approvedBy: null,
    approvedDate: null
  },
  {
    id: 224,
    employeeId: 469,
    leaveType: "annual",
    startDate: "2024-09-10",
    endDate: "2024-09-20",
    status: "pending",
    reason: "Yıllık izin - Memleket ziyareti",
    appliedDate: "2024-06-12",
    approvedBy: null,
    approvedDate: null
  }
];

export const samplePerformance = [
  {
    id: 251,
    employeeId: 465,
    reviewPeriod: "Q1-2024",
    goals: "Departman verimliliğini %15 artırmak, yeni teknolojileri araştırmak ve ekip liderlik becerilerini geliştirmek",
    achievements: "Departman verimliliği %18 arttı, React 18 ve Next.js 14 teknolojileri entegre edildi, 3 yeni ekip üyesi başarıyla onboarding edildi",
    skillsRating: "5",
    communicationRating: "4",
    teamworkRating: "5",
    overallScore: "4.7",
    feedback: "Ahmet, departmanında mükemmel liderlik gösteriyor. Teknik becerileri ve ekip yönetimi konusunda örnek bir performans sergiliyor.",
    improvementAreas: "Proje yönetimi araçlarında daha sistematik yaklaşım geliştirilebilir",
    nextGoals: "Agile metodolojilerini derinleştirmek ve cross-functional ekip çalışmalarını artırmak"
  },
  {
    id: 252,
    employeeId: 467,
    reviewPeriod: "Q1-2024",
    goals: "Frontend teknolojilerinde uzmanlaşmak, kod kalitesini artırmak ve mentörlük yapmak",
    achievements: "TypeScript'te ileri seviye projeler tamamladı, kod review süreçlerini optimize etti, 2 junior developera mentorluk yaptı",
    skillsRating: "4",
    communicationRating: "4",
    teamworkRating: "4",
    overallScore: "4.0",
    feedback: "Mehmet, teknik yetenekleriyle ekibe büyük katkı sağlıyor. Kod kalitesi konusunda takım için örnek oluyor.",
    improvementAreas: "UI/UX tasarım prensipleri konusunda gelişim gösterebilir",
    nextGoals: "Design system geliştirmek ve accessibility standartlarını iyileştirmek"
  },
  {
    id: 253,
    employeeId: 469,
    reviewPeriod: "Q1-2024",
    goals: "Backend API geliştirme becerilerini artırmak, database optimizasyonu yapmak",
    achievements: "Mikroservis mimarisine geçiş projesinde aktif rol aldı, database performansını %25 iyileştirdi",
    skillsRating: "4",
    communicationRating: "3",
    teamworkRating: "4",
    overallScore: "3.7",
    feedback: "Emre, backend geliştirme konusunda güçlü performans gösteriyor. Teknik problem çözme kabiliyeti gelişiyor.",
    improvementAreas: "İletişim becerileri ve dokümantasyon yazma konularında gelişim sağlanabilir",
    nextGoals: "DevOps süreçlerini öğrenmek ve CI/CD pipeline geliştirmek"
  }
];

export const sampleTrainings = [
  {
    id: 301,
    title: "React ve Modern Frontend Geliştirme",
    description: "React 18, Next.js 14 ve modern frontend teknolojileri üzerine kapsamlı eğitim",
    instructor: "Dr. Can Özgür",
    category: "technical",
    duration: "40",
    startDate: "2024-07-01",
    endDate: "2024-07-05",
    maxParticipants: "15",
    location: "Eğitim Salonu A - İstanbul Ofis",
    status: "scheduled",
    objectives: "Modern React patterns, state management, performance optimization ve best practices öğretmek",
    requirements: "Temel JavaScript bilgisi, React deneyimi tercih edilir"
  },
  {
    id: 302,
    title: "Liderlik ve Ekip Yönetimi",
    description: "Etkili liderlik teknikleri ve ekip yönetimi stratejileri",
    instructor: "Prof. Dr. Ayşe Kaya",
    category: "leadership",
    duration: "24",
    startDate: "2024-06-20",
    endDate: "2024-06-22",
    maxParticipants: "20",
    location: "Konferans Salonu - İstanbul Ofis",
    status: "active",
    objectives: "Liderlik becerilerini geliştirmek, ekip motivasyonu artırmak, conflict resolution öğrenmek",
    requirements: "Yöneticilik deneyimi veya potansiyeli olan çalışanlar"
  },
  {
    id: 303,
    title: "Dijital Pazarlama ve SEO",
    description: "Modern dijital pazarlama stratejileri ve arama motoru optimizasyonu",
    instructor: "Uzm. Murat Şen",
    category: "technical",
    duration: "32",
    startDate: "2024-08-10",
    endDate: "2024-08-14",
    maxParticipants: "12",
    location: "Eğitim Salonu B - İstanbul Ofis",
    status: "scheduled",
    objectives: "Google Ads, Social Media Marketing, SEO stratejileri ve analytics kullanımı",
    requirements: "Temel pazarlama bilgisi, Google Analytics hesabı"
  },
  {
    id: 304,
    title: "İş Güvenliği ve Risk Yönetimi",
    description: "Workplace safety protocols ve risk assessment süreçleri",
    instructor: "İSG Uzm. Elif Demir",
    category: "safety",
    duration: "16",
    startDate: "2024-05-15",
    endDate: "2024-05-16",
    maxParticipants: "25",
    location: "Ana Konferans Salonu",
    status: "completed",
    objectives: "İş güvenliği bilincini artırmak, risk analizi yapmayı öğrenmek",
    requirements: "Tüm çalışanlar için zorunlu eğitim"
  }
];

export const samplePayroll = [
  {
    id: 251,
    employeeId: 465,
    month: "2024-06",
    baseSalary: "28000",
    bonus: "5000",
    allowances: "1200",
    deductions: "800",
    overtime: "3200",
    workingDays: "22",
    grossSalary: "36400",
    netSalary: "24680",
    taxAmount: "6240",
    socialSecurityAmount: "4480",
    status: "paid"
  },
  {
    id: 252,
    employeeId: 466,
    month: "2024-06",
    baseSalary: "22000",
    bonus: "2000",
    allowances: "800",
    deductions: "500",
    overtime: "0",
    workingDays: "22",
    grossSalary: "24300",
    netSalary: "15780",
    taxAmount: "4200",
    socialSecurityAmount: "3520",
    status: "paid"
  },
  {
    id: 253,
    employeeId: 467,
    month: "2024-06",
    baseSalary: "20000",
    bonus: "1500",
    allowances: "600",
    deductions: "400",
    overtime: "1200",
    workingDays: "22",
    grossSalary: "22900",
    netSalary: "16720",
    taxAmount: "3580",
    socialSecurityAmount: "2600",
    status: "paid"
  },
  {
    id: 254,
    employeeId: 468,
    month: "2024-06",
    baseSalary: "15000",
    bonus: "800",
    allowances: "500",
    deductions: "200",
    overtime: "600",
    workingDays: "22",
    grossSalary: "16700",
    netSalary: "12456",
    taxAmount: "2544",
    socialSecurityAmount: "1700",
    status: "paid"
  },
  {
    id: 255,
    employeeId: 469,
    month: "2024-06",
    baseSalary: "19000",
    bonus: "1200",
    allowances: "700",
    deductions: "300",
    overtime: "800",
    workingDays: "22",
    grossSalary: "21400",
    netSalary: "15892",
    taxAmount: "3508",
    socialSecurityAmount: "2000",
    status: "paid"
  },
  {
    id: 256,
    employeeId: 470,
    month: "2024-06",
    baseSalary: "16500",
    bonus: "1000",
    allowances: "600",
    deductions: "250",
    overtime: "400",
    workingDays: "22",
    grossSalary: "18250",
    netSalary: "13567",
    taxAmount: "2983",
    socialSecurityAmount: "1700",
    status: "paid"
  },
  {
    id: 257,
    employeeId: 471,
    month: "2024-06",
    baseSalary: "32000",
    bonus: "6000",
    allowances: "1500",
    deductions: "1000",
    overtime: "0",
    workingDays: "22",
    grossSalary: "38500",
    netSalary: "25992",
    taxAmount: "7708",
    socialSecurityAmount: "4800",
    status: "paid"
  },
  {
    id: 258,
    employeeId: 472,
    month: "2024-06",
    baseSalary: "18000",
    bonus: "800",
    allowances: "600",
    deductions: "200",
    overtime: "600",
    workingDays: "22",
    grossSalary: "19200",
    netSalary: "12744",
    taxAmount: "3480",
    socialSecurityAmount: "2976",
    status: "prepared"
  },
  {
    id: 259,
    employeeId: 473,
    month: "2024-06",
    baseSalary: "26000",
    bonus: "4500",
    allowances: "1000",
    deductions: "750",
    overtime: "2800",
    workingDays: "22",
    grossSalary: "32550",
    netSalary: "21740",
    taxAmount: "5850",
    socialSecurityAmount: "4160",
    status: "paid"
  },
  {
    id: 260,
    employeeId: 474,
    month: "2024-06",
    baseSalary: "19000",
    bonus: "3000",
    allowances: "800",
    deductions: "400",
    overtime: "1200",
    workingDays: "22",
    grossSalary: "23600",
    netSalary: "15472",
    taxAmount: "4080",
    socialSecurityAmount: "3248",
    status: "paid"
  },
  {
    id: 261,
    employeeId: 475,
    month: "2024-06",
    baseSalary: "23000",
    bonus: "2500",
    allowances: "900",
    deductions: "300",
    overtime: "1600",
    workingDays: "22",
    grossSalary: "27700",
    netSalary: "17034",
    taxAmount: "4830",
    socialSecurityAmount: "3936",
    status: "pending"
  },
  {
    id: 262,
    employeeId: 476,
    month: "2024-06",
    baseSalary: "21000",
    bonus: "1800",
    allowances: "700",
    deductions: "600",
    overtime: "2000",
    workingDays: "22",
    grossSalary: "24900",
    netSalary: "16200",
    taxAmount: "4320",
    socialSecurityAmount: "3680",
    status: "paid"
  },
  {
    id: 263,
    employeeId: 477,
    month: "2024-06",
    baseSalary: "35000",
    bonus: "8500",
    allowances: "1800",
    deductions: "1200",
    overtime: "0",
    workingDays: "22",
    grossSalary: "44100",
    netSalary: "28895",
    taxAmount: "7805",
    socialSecurityAmount: "5600",
    status: "paid"
  }
];

export const sampleNotifications = [
  {
    id: 501,
    title: "Yeni İzin Talebi",
    message: "Fatma Özkan'dan yeni bir izin talebi geldi. Onayınızı bekliyor.",
    type: "info",
    isRead: false,
    createdAt: "2024-06-12T09:30:00Z",
    userId: "admin_001"
  },
  {
    id: 502,
    title: "Bordro İşlemi Tamamlandı",
    message: "Haziran 2024 bordro işlemleri başarıyla tamamlandı. 45 çalışan için ödeme gerçekleştirildi.",
    type: "success",
    isRead: false,
    createdAt: "2024-06-12T08:15:00Z",
    userId: "admin_001"
  },
  {
    id: 503,
    title: "Performans Değerlendirme Hatırlatması",
    message: "Q2 2024 performans değerlendirme süreci 15 Haziran'da başlayacak.",
    type: "reminder",
    isRead: true,
    createdAt: "2024-06-11T14:20:00Z",
    userId: "admin_001"
  },
  {
    id: 504,
    title: "Eğitim Programı Açıldı",
    message: "React ve Modern Frontend Geliştirme eğitimi için kayıtlar başladı.",
    type: "announcement",
    isRead: false,
    createdAt: "2024-06-10T16:45:00Z",
    userId: "admin_001"
  },
  {
    id: 505,
    title: "Sistem Bakımı",
    message: "Bu gece 02:00-04:00 arası sistem bakımı yapılacak. Geçici kesinti yaşanabilir.",
    type: "warning",
    isRead: true,
    createdAt: "2024-06-09T17:30:00Z",
    userId: "admin_001"
  }
];

export const sampleJobs = [
  {
    id: 401,
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
    id: 402,
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

export const sampleJobApplications = [
  {
    id: 601,
    jobId: 401,
    candidateName: "Ali Vural",
    candidateEmail: "ali.vural@email.com",
    phone: "+90 532 111 2233",
    resumeUrl: "/uploads/ali_vural_cv.pdf",
    coverLetter: "Full stack geliştirici olarak 6 yıllık deneyimim var. React ve Node.js projelerinde uzmanım.",
    status: "interview_scheduled",
    appliedDate: "2024-06-08",
    experience: "6 yıl",
    education: "Bilgisayar Mühendisliği - İTÜ"
  },
  {
    id: 602,
    jobId: 402,
    candidateName: "Zeynep Özkan",
    candidateEmail: "zeynep.ozkan@email.com",
    phone: "+90 533 444 5566",
    resumeUrl: "/uploads/zeynep_ozkan_cv.pdf",
    coverLetter: "İnsan kaynakları alanında 4 yıllık deneyimim bulunmaktadır. Işe alım süreçlerinde uzmanım.",
    status: "under_review",
    appliedDate: "2024-06-10",
    experience: "4 yıl",
    education: "İşletme - Boğaziçi Üniversitesi"
  }
];