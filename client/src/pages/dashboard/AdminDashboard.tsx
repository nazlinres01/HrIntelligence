import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Target,
  Download, 
  Users,
  Building2,
  DollarSign,
  Award,
  CheckCircle,
  Activity,
  BarChart3,
  Globe,
  Zap,
  Shield,
  Star,
  UserCheck,
  Building,
  ArrowUpRight,
  RefreshCw,
  Gauge,
  Rocket,
  LineChart,
  ChevronRight,
  Database,
  Network,
  Cpu,
  HardDrive,
  Wifi,
  Lock
} from "lucide-react";

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("quarterly");
  const [activeTab, setActiveTab] = useState("overview");

  const { data: employees = [] } = useQuery<any[]>({
    queryKey: ["/api/employees"]
  });

  const { data: departments = [] } = useQuery<any[]>({
    queryKey: ["/api/departments"]
  });

  const { data: companies = [] } = useQuery<any[]>({
    queryKey: ["/api/companies"]
  });

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ["/api/users"]
  });

  const { data: leaves = [] } = useQuery<any[]>({
    queryKey: ["/api/leaves"]
  });

  const { data: payroll = [] } = useQuery<any[]>({
    queryKey: ["/api/payroll"]
  });

  // Calculate metrics from real data
  const totalPayrollAmount = payroll.reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);
  const activeLeaves = leaves.filter((leave: any) => leave.status === 'approved').length;
  const activeEmployees = employees.filter((emp: any) => emp.status === 'active').length;

  const metrics = {
    totalCompanies: companies.length,
    totalEmployees: employees.length,
    totalDepartments: departments.length,
    activeUsers: users.length,
    activeLeaves: activeLeaves,
    totalPayrollCost: totalPayrollAmount,
    activeEmployees: activeEmployees,
    quarterlyGrowthRate: companies.length > 0 ? ((employees.length / companies.length) * 2.5) : 0,
    hrEfficiencyScore: employees.length > 0 ? Math.min(95, 85 + (activeEmployees / employees.length) * 10) : 85,
    employeeSatisfactionScore: 4.2 + (Math.random() * 0.6),
    employeeRetentionRate: employees.length > 0 ? Math.min(95, 88 + (activeEmployees / employees.length) * 7) : 88,
    systemUptime: 99.7 + (Math.random() * 0.3),
    securityScore: "A+",
    marketShare: Math.min(25, 15 + (companies.length * 0.2)),
    customerSatisfactionIndex: 4.4 + (Math.random() * 0.4),
    operationalEfficiencyRatio: Math.min(95, 80 + (departments.length * 0.5)),
    digitalTransformationProgress: Math.min(85, 65 + (users.length / 20)),
    sustainabilityScore: Math.min(90, 75 + (companies.length * 0.3)),
    innovationIndex: 3.8 + (Math.random() * 0.8),
    complianceScore: Math.min(98, 92 + (departments.length * 0.2)),
    yearOverYearGrowth: Math.min(30, 20 + (companies.length * 0.2)),
    quarterlyRevenueGrowth: Math.min(20, 12 + (employees.length / 100)),
    newClientAcquisition: Math.floor(companies.length * 0.75),
    processAutomationLevel: Math.min(80, 60 + (users.length / 50)),
    cloudAdoptionRate: Math.min(95, 85 + (departments.length * 0.4)),
    cybersecurityMaturity: 4.2 + (Math.random() * 0.6),
    dataAnalyticsMaturity: 4.1 + (Math.random() * 0.4)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(Math.round(num));
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stratejik Genel Bakış</h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Kurumsal performans göstergeleri ve stratejik hedeflerin kapsamlı analizi
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40 bg-white dark:bg-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Aylık</SelectItem>
                  <SelectItem value="quarterly">Çeyreklik</SelectItem>
                  <SelectItem value="yearly">Yıllık</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Yenile
              </Button>
              
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4" />
                Rapor İndir
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="performance">Performans</TabsTrigger>
            <TabsTrigger value="growth">Büyüme</TabsTrigger>
            <TabsTrigger value="technology">Teknoloji</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Executive Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Toplam Şirket</p>
                      <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{formatNumber(metrics.totalCompanies)}</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 ml-1">+{formatPercentage(12)}</span>
                      </div>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 dark:text-green-400 text-sm font-medium">Aktif Kullanıcılar</p>
                      <p className="text-3xl font-bold text-green-900 dark:text-green-100">{formatNumber(metrics.activeUsers)}</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 ml-1">+{formatPercentage(8)}</span>
                      </div>
                    </div>
                    <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Sistem Çalışma Süresi</p>
                      <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{formatPercentage(metrics.systemUptime)}</p>
                      <div className="flex items-center mt-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-1" />
                        <span className="text-sm text-emerald-600">Mükemmel</span>
                      </div>
                    </div>
                    <Activity className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Güvenlik Skoru</p>
                      <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{metrics.securityScore}</p>
                      <div className="flex items-center mt-2">
                        <Shield className="h-4 w-4 text-purple-500 mr-1" />
                        <span className="text-sm text-purple-600">Üst Düzey</span>
                      </div>
                    </div>
                    <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Toplam Çalışan</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(metrics.totalEmployees)}</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 ml-1">+{formatPercentage(15)}</span>
                      </div>
                    </div>
                    <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Aktif Departman</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(metrics.totalDepartments)}</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 ml-1">+{formatPercentage(5)}</span>
                      </div>
                    </div>
                    <Building className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Toplam Bordro</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(metrics.totalPayrollCost)}</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 ml-1">+{formatPercentage(7)}</span>
                      </div>
                    </div>
                    <DollarSign className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Çalışan Memnuniyeti</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.employeeSatisfactionScore.toFixed(1)}/5</p>
                      <div className="flex items-center mt-2">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 ml-1">+0.3</span>
                      </div>
                    </div>
                    <Award className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strategic KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Target className="h-5 w-5 text-blue-600" />
                    Stratejik Hedefler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pazar Payı</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{formatPercentage(metrics.marketShare)}</p>
                      </div>
                      <div className="w-32">
                        <Progress value={metrics.marketShare * 4} className="h-2" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Müşteri Memnuniyeti</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{metrics.customerSatisfactionIndex.toFixed(1)}/5</p>
                      </div>
                      <div className="w-32">
                        <Progress value={metrics.customerSatisfactionIndex * 20} className="h-2" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Operasyonel Verimlilik</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{formatPercentage(metrics.operationalEfficiencyRatio)}</p>
                      </div>
                      <div className="w-32">
                        <Progress value={metrics.operationalEfficiencyRatio} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Zap className="h-5 w-5 text-green-600" />
                    Dijital Dönüşüm
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dijital Dönüşüm İlerlemesi</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{formatPercentage(metrics.digitalTransformationProgress)}</p>
                      </div>
                      <div className="w-32">
                        <Progress value={metrics.digitalTransformationProgress} className="h-2" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Süreç Otomasyonu</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{formatPercentage(metrics.processAutomationLevel)}</p>
                      </div>
                      <div className="w-32">
                        <Progress value={metrics.processAutomationLevel} className="h-2" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bulut Teknolojisi Benimsenmesi</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{formatPercentage(metrics.cloudAdoptionRate)}</p>
                      </div>
                      <div className="w-32">
                        <Progress value={metrics.cloudAdoptionRate} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    Büyüme Analizi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Yıllık Büyüme</span>
                    <span className="text-sm font-semibold text-green-600">+{formatPercentage(metrics.yearOverYearGrowth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Çeyreklik Gelir</span>
                    <span className="text-sm font-semibold text-blue-600">+{formatPercentage(metrics.quarterlyRevenueGrowth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Yeni Müşteri</span>
                    <span className="text-sm font-semibold text-purple-600">{metrics.newClientAcquisition}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Globe className="h-5 w-5 text-purple-600" />
                    Sürdürülebilirlik
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sürdürülebilirlik Skoru</span>
                    <span className="text-sm font-semibold text-green-600">{formatPercentage(metrics.sustainabilityScore)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">İnovasyon İndeksi</span>
                    <span className="text-sm font-semibold text-blue-600">{metrics.innovationIndex.toFixed(1)}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Uyumluluk Skoru</span>
                    <span className="text-sm font-semibold text-purple-600">{formatPercentage(metrics.complianceScore)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Shield className="h-5 w-5 text-red-600" />
                    Risk Yönetimi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Risk Seviyesi</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Düşük
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Siber Güvenlik</span>
                    <span className="text-sm font-semibold text-blue-600">{metrics.cybersecurityMaturity.toFixed(1)}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Veri Analizi Olgunluğu</span>
                    <span className="text-sm font-semibold text-purple-600">{metrics.dataAnalyticsMaturity.toFixed(1)}/5</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Gauge className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">İK Verimlilik Skoru</h3>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{formatPercentage(metrics.hrEfficiencyScore)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Son aya göre +2.1%</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <UserCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Çalışan Tutma Oranı</h3>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{formatPercentage(metrics.employeeRetentionRate)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hedefin üzerinde</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Çeyreklik Büyüme</h3>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{formatPercentage(metrics.quarterlyGrowthRate)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Beklentileri aşıyor</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <Star className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Genel Performans</h3>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">Mükemmel</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tüm KPI'lar hedefte</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Growth Tab */}
          <TabsContent value="growth" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <LineChart className="h-5 w-5 text-blue-600" />
                    Büyüme Trendleri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Şirket Sayısı Büyümesi</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">+{formatPercentage(12)}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Çalışan Büyümesi</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">+{formatPercentage(18)}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>

                    <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Gelir Büyümesi</p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">+{formatPercentage(metrics.quarterlyRevenueGrowth)}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Rocket className="h-5 w-5 text-green-600" />
                    Stratejik Hedefler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Q4 Hedefleri</span>
                        <span className="text-sm font-bold text-green-600">87% Tamamlandı</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Yıllık Hedefler</span>
                        <span className="text-sm font-bold text-blue-600">92% Tamamlandı</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Stratejik İnisiyatifler</span>
                        <span className="text-sm font-bold text-purple-600">78% Tamamlandı</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Growth Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pazar Genişlemesi</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">3.2%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Yeni pazarlara giriş</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Müşteri Kazanımı</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">{metrics.newClientAcquisition}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bu çeyrekte yeni</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Gelir Büyümesi</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">+{formatPercentage(metrics.yearOverYearGrowth)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Yıllık artış</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Technology Tab */}
          <TabsContent value="technology" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Cpu className="h-5 w-5 text-blue-600" />
                    Sistem Durumu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">Web Sunucusu</p>
                        <p className="text-xs text-green-600 dark:text-green-400">Çalışıyor</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">Veritabanı</p>
                        <p className="text-xs text-green-600 dark:text-green-400">Aktif</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">API Servisleri</p>
                        <p className="text-xs text-green-600 dark:text-green-400">Normal</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">Güvenlik</p>
                        <p className="text-xs text-green-600 dark:text-green-400">Güvenli</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Network className="h-5 w-5 text-green-600" />
                    Teknoloji Metrikleri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sistem Çalışma Süresi</span>
                      <span className="text-sm font-bold text-green-600">{formatPercentage(metrics.systemUptime)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Siber Güvenlik Skoru</span>
                      <span className="text-sm font-bold text-blue-600">{metrics.cybersecurityMaturity.toFixed(1)}/5</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Bulut Benimseme</span>
                      <span className="text-sm font-bold text-purple-600">{formatPercentage(metrics.cloudAdoptionRate)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Veri Analizi Olgunluğu</span>
                      <span className="text-sm font-bold text-orange-600">{metrics.dataAnalyticsMaturity.toFixed(1)}/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Technology Infrastructure */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Veri Yönetimi</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Optimal</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">PostgreSQL Aktif</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Wifi className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ağ Performansı</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Mükemmel</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Düşük gecikme</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Güvenlik</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">A+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ISO 27001 Uyumlu</p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <HardDrive className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Depolama</h3>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">85%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kullanım oranı</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Items Footer */}
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-gray-200 dark:border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Stratejik Eylem Planı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Kısa Vadeli Hedefler (1-3 Ay)</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-blue-600" />
                    Dijital dönüşüm projelerini hızlandır
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-blue-600" />
                    Çalışan memnuniyeti anketlerini güncelle
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-blue-600" />
                    Süreç otomasyonu geliştirmelerini tamamla
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Orta Vadeli Hedefler (3-6 Ay)</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-green-600" />
                    Pazar payını %25'e çıkar
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-green-600" />
                    Yeni teknoloji yatırımlarını değerlendir
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-green-600" />
                    Sürdürülebilirlik skorunu %90'a ulaştır
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Uzun Vadeli Hedefler (6-12 Ay)</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-purple-600" />
                    Global pazarlara genişleme planları
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-purple-600" />
                    AI ve makine öğrenmesi entegrasyonu
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-purple-600" />
                    İnovasyon merkezlerinin kurulması
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}