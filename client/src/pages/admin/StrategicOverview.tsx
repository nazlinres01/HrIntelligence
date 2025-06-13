import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Download, 
  Users,
  Building2,
  DollarSign,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Activity,
  Briefcase,
  BarChart3,
  PieChart,
  Globe,
  Zap,
  Shield,
  Clock,
  Star,
  UserCheck,
  Building
} from "lucide-react";

export default function StrategicOverview() {
  const [timeRange, setTimeRange] = useState("quarterly");

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

  // Mock metrics for comprehensive strategic overview
  const metrics = {
    totalCompanies: companies.length || 45,
    totalEmployees: employees.length || 1847,
    totalDepartments: departments.length || 28,
    activeUsers: users.length || 1247,
    quarterlyGrowthRate: 12.5,
    hrEfficiencyScore: 94.2,
    revenuePerEmployee: 285000,
    employeeSatisfactionScore: 4.3,
    employeeRetentionRate: 92.5,
    totalPayrollCost: payroll.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 12500000,
    averagePerformanceScore: 4.1,
    trainingCompletionRate: 87.3,
    systemUptime: 99.8,
    securityScore: "A+",
    // Strategic KPIs
    marketShare: 18.2,
    customerSatisfactionIndex: 4.6,
    operationalEfficiencyRatio: 89.4,
    digitalTransformationProgress: 76.8,
    sustainabilityScore: 82.3,
    innovationIndex: 4.2,
    complianceScore: 96.7,
    riskManagementRating: "Low",
    // Growth metrics
    yearOverYearGrowth: 24.6,
    quarterlyRevenueGrowth: 15.8,
    newClientAcquisition: 34,
    marketExpansion: 3.2,
    // Operational metrics
    processAutomationLevel: 67.4,
    dataAnalyticsMaturity: 4.1,
    cloudAdoptionRate: 89.2,
    cybersecurityMaturity: 4.4
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stratejik Genel Bakış</h1>
          <p className="text-gray-600 mt-2">
            Kurumsal performans göstergeleri ve stratejik hedeflerin kapsamlı analizi
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Aylık</SelectItem>
              <SelectItem value="quarterly">Çeyreklik</SelectItem>
              <SelectItem value="yearly">Yıllık</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Rapor İndir
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Toplam Şirket</p>
                <p className="text-3xl font-bold text-blue-900">45</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12%</span>
                </div>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Aktif Kullanıcılar</p>
                <p className="text-3xl font-bold text-green-900">1,247</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+8%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Sistem Sağlığı</p>
                <p className="text-3xl font-bold text-emerald-900">99.8%</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-sm text-emerald-600">Optimal</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Güvenlik</p>
                <p className="text-3xl font-bold text-purple-900">A+</p>
                <div className="flex items-center mt-2">
                  <Shield className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600">Mükemmel</span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Toplam Çalışan</p>
                <p className="text-3xl font-bold text-orange-900">{metrics.totalEmployees}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+15%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 text-sm font-medium">Aktif Departman</p>
                <p className="text-3xl font-bold text-indigo-900">{metrics.totalDepartments}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+5%</span>
                </div>
              </div>
              <Building className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-600 text-sm font-medium">Toplam Bordro</p>
                <p className="text-3xl font-bold text-teal-900">{formatCurrency(metrics.totalPayrollCost)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+7%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-rose-50 to-rose-100 border-rose-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-600 text-sm font-medium">Çalışan Memnuniyeti</p>
                <p className="text-3xl font-bold text-rose-900">{metrics.employeeSatisfactionScore}/5</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+0.3</span>
                </div>
              </div>
              <Award className="h-8 w-8 text-rose-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center text-lg">
              <Target className="h-5 w-5 mr-2" />
              Stratejik Hedefler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pazar Payı</p>
                  <p className="text-lg font-bold text-blue-900">{metrics.marketShare}%</p>
                </div>
                <Progress value={metrics.marketShare * 5} className="w-24" />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">Müşteri Memnuniyeti</p>
                  <p className="text-lg font-bold text-green-700">{metrics.customerSatisfactionIndex}/5</p>
                </div>
                <Progress value={metrics.customerSatisfactionIndex * 20} className="w-24" />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">Operasyonel Verimlilik</p>
                  <p className="text-lg font-bold text-purple-700">{metrics.operationalEfficiencyRatio}%</p>
                </div>
                <Progress value={metrics.operationalEfficiencyRatio} className="w-24" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center text-lg">
              <Zap className="h-5 w-5 mr-2" />
              Dijital Dönüşüm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dijital Dönüşüm İlerlemesi</p>
                  <p className="text-lg font-bold text-green-900">{metrics.digitalTransformationProgress}%</p>
                </div>
                <Progress value={metrics.digitalTransformationProgress} className="w-24" />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">Süreç Otomasyonu</p>
                  <p className="text-lg font-bold text-blue-700">{metrics.processAutomationLevel}%</p>
                </div>
                <Progress value={metrics.processAutomationLevel} className="w-24" />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bulut Teknolojisi Benimimi</p>
                  <p className="text-lg font-bold text-purple-700">{metrics.cloudAdoptionRate}%</p>
                </div>
                <Progress value={metrics.cloudAdoptionRate} className="w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center text-lg">
              <BarChart3 className="h-5 w-5 mr-2" />
              Büyüme Analizi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Yıllık Büyüme</span>
                <span className="text-sm font-semibold text-green-600">+{metrics.yearOverYearGrowth}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Çeyreklik Gelir</span>
                <span className="text-sm font-semibold text-blue-600">+{metrics.quarterlyRevenueGrowth}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Yeni Müşteri</span>
                <span className="text-sm font-semibold text-purple-600">{metrics.newClientAcquisition}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center text-lg">
              <Globe className="h-5 w-5 mr-2" />
              Sürdürülebilirlik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sürdürülebilirlik Skoru</span>
                <span className="text-sm font-semibold text-green-600">{metrics.sustainabilityScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">İnovasyon İndeksi</span>
                <span className="text-sm font-semibold text-blue-600">{metrics.innovationIndex}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Uyumluluk Skoru</span>
                <span className="text-sm font-semibold text-purple-600">{metrics.complianceScore}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center text-lg">
              <Shield className="h-5 w-5 mr-2" />
              Risk Yönetimi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Risk Seviyesi</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {metrics.riskManagementRating}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Siber Güvenlik</span>
                <span className="text-sm font-semibold text-blue-600">{metrics.cybersecurityMaturity}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Veri Analizi Olgunluğu</span>
                <span className="text-sm font-semibold text-purple-600">{metrics.dataAnalyticsMaturity}/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center text-xl">
            <CheckCircle className="h-6 w-6 mr-2" />
            Stratejik Eylem Planı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Kısa Vadeli Hedefler (Q1)</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-orange-500" />
                  Dijital dönüşüm projesinin %80'ini tamamla
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                  Çalışan memnuniyet oranını %95'e çıkar
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                  Operasyonel verimliliği %92'ye yükselt
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Uzun Vadeli Hedefler (2024)</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <Globe className="h-4 w-4 mr-2 text-purple-500" />
                  Pazar payını %25'e çıkar
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                  Tam otomasyon seviyesine ulaş
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 mr-2 text-red-500" />
                  Sektör lideri pozisyonunu güçlendir
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}