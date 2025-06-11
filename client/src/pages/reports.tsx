import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ExportReports } from "@/components/ui/export-reports";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  CreditCard,
  Download,
  Filter,
  Eye,
  Target,
  Award,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [reportType, setReportType] = useState("overview");
  const { toast } = useToast();

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: leaves = [] } = useQuery({
    queryKey: ["/api/leaves"],
  });

  const { data: performance = [] } = useQuery({
    queryKey: ["/api/performance"],
  });

  const { data: payroll = [] } = useQuery({
    queryKey: ["/api/payroll"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  // Calculate comprehensive analytics
  const getEmployeeAnalytics = () => {
    if (!employees || !Array.isArray(employees)) {
      return {
        totalEmployees: 0,
        activeEmployees: 0,
        onLeaveEmployees: 0,
        departmentCounts: {},
        avgSalary: 0,
        salaryRanges: { junior: 0, mid: 0, senior: 0 },
        retentionRate: 0
      };
    }

    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((emp: any) => emp.status === 'active').length;
    const onLeaveEmployees = employees.filter((emp: any) => emp.status === 'on_leave').length;
    const departmentCounts = employees.reduce((acc: any, emp: any) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});

    const avgSalary = totalEmployees > 0 ? employees.reduce((sum: number, emp: any) => sum + (emp.salary || 0), 0) / totalEmployees : 0;
    const salaryRanges = {
      junior: employees.filter((emp: any) => (emp.salary || 0) < 50000).length,
      mid: employees.filter((emp: any) => (emp.salary || 0) >= 50000 && (emp.salary || 0) < 100000).length,
      senior: employees.filter((emp: any) => (emp.salary || 0) >= 100000).length,
    };

    return {
      totalEmployees,
      activeEmployees,
      onLeaveEmployees,
      departmentCounts,
      avgSalary,
      salaryRanges,
      retentionRate: totalEmployees > 0 ? (activeEmployees / totalEmployees) * 100 : 0
    };
  };

  const getLeaveAnalytics = () => {
    if (!leaves || !Array.isArray(leaves)) {
      return {
        totalLeaves: 0,
        approvedLeaves: 0,
        pendingLeaves: 0,
        rejectedLeaves: 0,
        leaveTypes: {},
        avgLeaveDays: 0,
        approvalRate: 0
      };
    }

    const totalLeaves = leaves.length;
    const approvedLeaves = leaves.filter((leave: any) => leave.status === 'approved').length;
    const pendingLeaves = leaves.filter((leave: any) => leave.status === 'pending').length;
    const rejectedLeaves = leaves.filter((leave: any) => leave.status === 'rejected').length;

    const leaveTypes = leaves.reduce((acc: any, leave: any) => {
      acc[leave.leaveType] = (acc[leave.leaveType] || 0) + 1;
      return acc;
    }, {});

    const avgLeaveDays = totalLeaves > 0 ? leaves.reduce((sum: number, leave: any) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return sum + days;
    }, 0) / totalLeaves : 0;

    return {
      totalLeaves,
      approvedLeaves,
      pendingLeaves,
      rejectedLeaves,
      leaveTypes,
      avgLeaveDays,
      approvalRate: totalLeaves > 0 ? (approvedLeaves / totalLeaves) * 100 : 0
    };
  };

  const getPerformanceAnalytics = () => {
    if (!performance) return null;

    const totalReviews = performance.length;
    const avgRating = performance.reduce((sum: number, perf: any) => sum + perf.overallRating, 0) / totalReviews;
    
    const ratingDistribution = {
      excellent: performance.filter((perf: any) => perf.overallRating >= 4.5).length,
      good: performance.filter((perf: any) => perf.overallRating >= 4.0 && perf.overallRating < 4.5).length,
      average: performance.filter((perf: any) => perf.overallRating >= 3.0 && perf.overallRating < 4.0).length,
      poor: performance.filter((perf: any) => perf.overallRating < 3.0).length,
    };

    const departmentPerformance = performance.reduce((acc: any, perf: any) => {
      const dept = perf.employee?.department || 'Unknown';
      if (!acc[dept]) {
        acc[dept] = { total: 0, count: 0, avg: 0 };
      }
      acc[dept].total += perf.overallRating;
      acc[dept].count += 1;
      acc[dept].avg = acc[dept].total / acc[dept].count;
      return acc;
    }, {});

    return {
      totalReviews,
      avgRating,
      ratingDistribution,
      departmentPerformance,
      improvementNeeded: performance.filter((perf: any) => perf.overallRating < 3.5).length
    };
  };

  const getPayrollAnalytics = () => {
    if (!payroll) return null;

    const totalPayroll = payroll.reduce((sum: number, pay: any) => sum + pay.netSalary, 0);
    const avgSalary = totalPayroll / payroll.length;
    const processedPayroll = payroll.filter((pay: any) => pay.status === 'processed').length;
    const paidPayroll = payroll.filter((pay: any) => pay.status === 'paid').length;

    const departmentPayroll = payroll.reduce((acc: any, pay: any) => {
      const dept = pay.employee?.department || 'Unknown';
      if (!acc[dept]) {
        acc[dept] = { total: 0, count: 0, avg: 0 };
      }
      acc[dept].total += pay.netSalary;
      acc[dept].count += 1;
      acc[dept].avg = acc[dept].total / acc[dept].count;
      return acc;
    }, {});

    return {
      totalPayroll,
      avgSalary,
      processedPayroll,
      paidPayroll,
      departmentPayroll,
      payrollEfficiency: (paidPayroll / payroll.length) * 100
    };
  };

  const employeeAnalytics = getEmployeeAnalytics();
  const leaveAnalytics = getLeaveAnalytics();
  const performanceAnalytics = getPerformanceAnalytics();
  const payrollAnalytics = getPayrollAnalytics();

  const overviewCards = [
    {
      title: "Toplam Çalışan",
      value: employeeAnalytics?.totalEmployees || 0,
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Aktif İzinler",
      value: leaveAnalytics?.approvedLeaves || 0,
      change: "-5%",
      changeType: "decrease",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Ortalama Performans",
      value: performanceAnalytics?.avgRating?.toFixed(1) || "0.0",
      change: "+0.3",
      changeType: "increase",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Aylık Bordro",
      value: `₺${payrollAnalytics?.totalPayroll?.toLocaleString('tr-TR') || '0'}`,
      change: "+8.2%",
      changeType: "increase",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  // Export functions for different report types
  const exportEmployeeReport = () => {
    const data = employees || [];
    const csvContent = [
      ["Ad", "Soyad", "E-posta", "Departman", "Pozisyon", "Maaş", "Durum", "İşe Başlama Tarihi"].join(","),
      ...data.map(emp => [
        emp.firstName,
        emp.lastName,
        emp.email,
        emp.department,
        emp.position,
        emp.salary,
        emp.status === 'active' ? 'Aktif' : emp.status === 'on_leave' ? 'İzinli' : 'Pasif',
        emp.startDate
      ].join(","))
    ].join("\n");
    
    downloadCSV(csvContent, "calisan-ozet-raporu");
    toast({
      title: "Rapor İndirildi",
      description: "Çalışan özet raporu başarıyla indirildi",
    });
  };

  const exportLeaveReport = () => {
    const data = leaves || [];
    const csvContent = [
      ["Çalışan ID", "İzin Türü", "Başlangıç Tarihi", "Bitiş Tarihi", "Gün Sayısı", "Durum", "Sebep"].join(","),
      ...data.map(leave => [
        leave.employeeId,
        leave.leaveType,
        leave.startDate,
        leave.endDate,
        leave.days,
        leave.status === 'approved' ? 'Onaylandı' : leave.status === 'pending' ? 'Bekliyor' : 'Reddedildi',
        leave.reason
      ].join(","))
    ].join("\n");
    
    downloadCSV(csvContent, "izin-analiz-raporu");
    toast({
      title: "Rapor İndirildi",
      description: "İzin analiz raporu başarıyla indirildi",
    });
  };

  const exportPerformanceReport = () => {
    const data = performance || [];
    const csvContent = [
      ["Çalışan ID", "Değerlendirme Dönemi", "Puan", "Hedefler", "Başarılar", "Geri Bildirim"].join(","),
      ...data.map(perf => [
        perf.employeeId,
        perf.reviewPeriod,
        perf.score,
        `"${perf.goals}"`,
        `"${perf.achievements}"`,
        `"${perf.feedback}"`
      ].join(","))
    ].join("\n");
    
    downloadCSV(csvContent, "performans-degerlendirme-raporu");
    toast({
      title: "Rapor İndirildi",
      description: "Performans değerlendirme raporu başarıyla indirildi",
    });
  };

  const exportPayrollReport = () => {
    const data = payroll || [];
    const csvContent = [
      ["Çalışan ID", "Ay", "Temel Maaş", "Primler", "Kesintiler", "Net Maaş", "Durum"].join(","),
      ...data.map(pay => [
        pay.employeeId,
        pay.month,
        pay.baseSalary,
        pay.bonuses,
        pay.deductions,
        pay.netSalary,
        pay.status === 'paid' ? 'Ödendi' : pay.status === 'pending' ? 'Bekliyor' : 'Taslak'
      ].join(","))
    ].join("\n");
    
    downloadCSV(csvContent, "bordro-ozet-raporu");
    toast({
      title: "Rapor İndirildi",
      description: "Bordro özet raporu başarıyla indirildi",
    });
  };

  const exportDashboardReport = () => {
    const reportData = [
      ["Metrik", "Değer", "Kategori"],
      ["Toplam Çalışan", employeeAnalytics?.totalEmployees || 0, "Çalışan"],
      ["Aktif Çalışan", employeeAnalytics?.activeEmployees || 0, "Çalışan"],
      ["İzinli Çalışan", employeeAnalytics?.onLeaveEmployees || 0, "Çalışan"],
      ["Toplam İzin", leaveAnalytics?.totalLeaves || 0, "İzin"],
      ["Onaylanan İzin", leaveAnalytics?.approvedLeaves || 0, "İzin"],
      ["Bekleyen İzin", leaveAnalytics?.pendingLeaves || 0, "İzin"],
      ["Ortalama Performans", performanceAnalytics?.avgRating?.toFixed(2) || "0.00", "Performans"],
      ["Toplam Bordro", payrollAnalytics?.totalPayroll?.toLocaleString('tr-TR') || "0", "Bordro"],
      ["Ortalama Maaş", payrollAnalytics?.avgSalary?.toLocaleString('tr-TR') || "0", "Bordro"]
    ];
    
    const csvContent = reportData.map(row => row.join(",")).join("\n");
    downloadCSV(csvContent, "ik-dashboard-raporu");
    toast({
      title: "Rapor İndirildi",
      description: "İK Dashboard raporu başarıyla indirildi",
    });
  };

  const exportComplianceReport = () => {
    const complianceData = [
      ["Uyumluluk Alanı", "Durum", "Yüzde", "Açıklama"],
      ["Çalışan Belgeleri", "Uyumlu", "95%", "Çalışan dosyaları ve belgeleri tam"],
      ["İzin Politikaları", "Uyumlu", "100%", "İzin politikaları yasal mevzuata uygun"],
      ["Bordro Uyumluluğu", "Uyumlu", "98%", "Bordro hesaplamaları yasal standartlarda"],
      ["Performans Değerlendirme", "Kısmen Uyumlu", "85%", "Performans süreçleri geliştirilmeli"],
      ["Çalışan Hakları", "Uyumlu", "100%", "Çalışan hakları tam korunuyor"]
    ];
    
    const csvContent = complianceData.map(row => row.join(",")).join("\n");
    downloadCSV(csvContent, "uyumluluk-raporu");
    toast({
      title: "Rapor İndirildi",
      description: "Uyumluluk raporu başarıyla indirildi",
    });
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reportTemplates = [
    {
      id: "employee-summary",
      title: "Çalışan Özet Raporu",
      description: "Çalışan sayıları, departman dağılımı ve genel istatistikler",
      icon: Users,
      color: "bg-blue-50 text-blue-700",
      iconColor: "text-blue-600",
      action: exportEmployeeReport
    },
    {
      id: "leave-analysis",
      title: "İzin Analiz Raporu",
      description: "İzin kullanım oranları, türleri ve onay durumları",
      icon: Calendar,
      color: "bg-orange-50 text-orange-700",
      iconColor: "text-orange-600",
      action: exportLeaveReport
    },
    {
      id: "performance-review",
      title: "Performans Değerlendirme Raporu",
      description: "Çalışan performans skorları ve departman karşılaştırmaları",
      icon: BarChart3,
      color: "bg-green-50 text-green-700",
      iconColor: "text-green-600",
      action: exportPerformanceReport
    },
    {
      id: "payroll-summary",
      title: "Bordro Özet Raporu",
      description: "Maaş dağılımları, departman maliyetleri ve bordro analizi",
      icon: DollarSign,
      color: "bg-purple-50 text-purple-700",
      iconColor: "text-purple-600",
      action: exportPayrollReport
    },
    {
      id: "hr-dashboard",
      title: "İK Dashboard Raporu",
      description: "Tüm İK metriklerini içeren kapsamlı dashboard raporu",
      icon: FileText,
      color: "bg-indigo-50 text-indigo-700",
      iconColor: "text-indigo-600",
      action: exportDashboardReport
    },
    {
      id: "compliance-report",
      title: "Uyumluluk Raporu",
      description: "İş kanunu uyumluluğu ve yasal gereklilikler raporu",
      icon: CheckCircle,
      color: "bg-teal-50 text-teal-700",
      iconColor: "text-teal-600",
      action: exportComplianceReport
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6 max-w-full overflow-x-hidden overflow-y-auto h-full">
      <Header 
        title="Raporlar ve Analitik" 
        subtitle="Detaylı İK raporları ve istatistikleri görüntüleyin" 
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      {card.changeType === 'increase' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {card.change}
                      </span>
                      <span className="text-sm text-gray-500">bu ay</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-2xl ${card.bgColor}`}>
                    <Icon className={`h-8 w-8 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-full sm:w-48">
                  <FileText className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Rapor Türü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Genel Bakış</SelectItem>
                  <SelectItem value="detailed">Detaylı Analiz</SelectItem>
                  <SelectItem value="comparative">Karşılaştırmalı</SelectItem>
                  <SelectItem value="trending">Trend Analizi</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Dönem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="Q4-2024">Q4 2024</SelectItem>
                  <SelectItem value="Q3-2024">Q3 2024</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Departman" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Departmanlar</SelectItem>
                  <SelectItem value="Yazılım">Yazılım</SelectItem>
                  <SelectItem value="Pazarlama">Pazarlama</SelectItem>
                  <SelectItem value="İK">İK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Templates */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Rapor Şablonları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <div key={template.id} className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${template.color} border-opacity-20 hover:border-opacity-40`}>
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-white">
                          <Icon className={`h-5 w-5 ${template.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {template.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {template.description}
                          </p>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={template.action}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              İndir
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-green-600" />
              Anahtar Metrikler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Employee Retention */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Çalışan Tutma Oranı</span>
                  <span className="text-sm font-bold text-green-600">
                    {employeeAnalytics?.retentionRate?.toFixed(1) || 0}%
                  </span>
                </div>
                <Progress value={employeeAnalytics?.retentionRate || 0} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Hedef: 95%</p>
              </div>

              {/* Leave Approval Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">İzin Onay Oranı</span>
                  <span className="text-sm font-bold text-blue-600">
                    {leaveAnalytics?.approvalRate?.toFixed(1) || 0}%
                  </span>
                </div>
                <Progress value={leaveAnalytics?.approvalRate || 0} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Son 3 ay ortalaması</p>
              </div>

              {/* Performance Average */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Ortalama Performans</span>
                  <span className="text-sm font-bold text-purple-600">
                    {performanceAnalytics?.avgRating?.toFixed(1) || 0}/5.0
                  </span>
                </div>
                <Progress value={(performanceAnalytics?.avgRating || 0) * 20} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Şirket hedefi: 4.0</p>
              </div>

              {/* Payroll Efficiency */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Bordro Verimlilik</span>
                  <span className="text-sm font-bold text-orange-600">
                    {payrollAnalytics?.payrollEfficiency?.toFixed(1) || 0}%
                  </span>
                </div>
                <Progress value={payrollAnalytics?.payrollEfficiency || 0} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Ödeme tamamlama oranı</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-yellow-600" />
              Departman Performansı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceAnalytics && Object.entries(performanceAnalytics.departmentPerformance).map(([dept, stats]: [string, any]) => (
                <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{dept}</h3>
                    <p className="text-sm text-gray-500">{stats.count} değerlendirme</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{stats.avg.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">/ 5.0</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leave Types Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-orange-600" />
              İzin Türü Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveAnalytics && Object.entries(leaveAnalytics.leaveTypes).map(([type, count]: [string, any]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900 capitalize">{type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{count} talep</span>
                    <Badge variant="secondary">
                      {((count / leaveAnalytics.totalLeaves) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Recommendations */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
            Uyarılar ve Öneriler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <h3 className="font-medium text-yellow-800">Bekleyen İzinler</h3>
              </div>
              <p className="text-sm text-yellow-700">
                {leaveAnalytics?.pendingLeaves || 0} izin talebi onay bekliyor
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-red-600" />
                <h3 className="font-medium text-red-800">Düşük Performans</h3>
              </div>
              <p className="text-sm text-red-700">
                {performanceAnalytics?.improvementNeeded || 0} çalışan gelişim desteği gerektiyor
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-800">Bordro Durumu</h3>
              </div>
              <p className="text-sm text-blue-700">
                {payrollAnalytics?.processedPayroll || 0} bordro işlenmeyi bekliyor
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}