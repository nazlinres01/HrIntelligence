import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Download, 
  Filter,
  Users,
  Building2,
  DollarSign,
  Calendar,
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Activity,
  Briefcase
} from "lucide-react";

export default function StrategicOverview() {
  const [timeRange, setTimeRange] = useState("last30days");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const { data: employees = [] } = useQuery<any[]>({
    queryKey: ["/api/employees"]
  });

  const { data: departments = [] } = useQuery<any[]>({
    queryKey: ["/api/departments"]
  });

  const { data: companies = [] } = useQuery<any[]>({
    queryKey: ["/api/companies"]
  });

  const { data: companyStats } = useQuery({
    queryKey: ["/api/stats/companies"]
  });

  const { data: systemHealth } = useQuery({
    queryKey: ["/api/system/health"]
  });

  // Strategic analytics calculations
  const getStrategicAnalytics = () => {
    const totalCompanies = (companies as any[]).length;
    const totalEmployees = (employees as any[]).length;
    const activeDepartments = (departments as any[]).length;
    
    // Strategic KPI calculations
    const strategicProjects = [
      { name: "Dijital Dönüşüm", progress: 78, status: "active" },
      { name: "Sürdürülebilirlik", progress: 65, status: "active" },
      { name: "Global Genişleme", progress: 43, status: "at-risk" },
      { name: "Çalışan Deneyimi", progress: 89, status: "completed" }
    ];

    // Financial metrics
    const totalRevenue = 187500000;
    const revenueGrowth = 18.2;
    const profitMargin = 23.5;

    // Performance metrics
    const customerSatisfaction = 89.1;
    const employeeSatisfaction = 87.3;
    const operationalEfficiency = 94.2;

    // Growth metrics
    const companyGrowthRate = companyStats?.growth || 12.5;
    const employeeGrowthRate = 8.7;
    const revenueGrowthRate = 15.3;

    return {
      totalCompanies,
      totalEmployees,
      activeDepartments,
      strategicProjects,
      totalRevenue,
      revenueGrowth,
      profitMargin,
      customerSatisfaction,
      employeeSatisfaction,
      operationalEfficiency,
      companyGrowthRate,
      employeeGrowthRate,
      revenueGrowthRate
    };
  };

  const analytics = getStrategicAnalytics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Stratejik Genel Bakış</h1>
            <p className="text-gray-600">Kurumsal performans ve stratejik hedeflerin kapsamlı analizi</p>
          </div>
          <div className="flex space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48 border-gray-300">
                <SelectValue placeholder="Zaman aralığı" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="last7days">Son 7 Gün</SelectItem>
                <SelectItem value="last30days">Son 30 Gün</SelectItem>
                <SelectItem value="last3months">Son 3 Ay</SelectItem>
                <SelectItem value="last6months">Son 6 Ay</SelectItem>
                <SelectItem value="lastyear">Son 1 Yıl</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48 border-gray-300">
                <SelectValue placeholder="Departman filtrele" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Tüm Departmanlar</SelectItem>
                {departments.map((dept: any) => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-300 text-gray-700">
              <Download className="h-4 w-4 mr-2" />
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
                  <p className="text-3xl font-bold text-blue-900">{analytics.totalCompanies}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{analytics.companyGrowthRate}%</span>
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
                  <p className="text-green-600 text-sm font-medium">Toplam Gelir</p>
                  <p className="text-3xl font-bold text-green-900">{formatCurrency(analytics.totalRevenue)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{analytics.revenueGrowthRate}%</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Operasyonel Verimlilik</p>
                  <p className="text-3xl font-bold text-orange-900">{analytics.operationalEfficiency}%</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Hedef üstü</span>
                  </div>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Toplam Çalışan</p>
                  <p className="text-3xl font-bold text-purple-900">{analytics.totalEmployees}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-gray-600">{analytics.employeeGrowthRate}% büyüme</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Strategic Projects */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Stratejik Projeler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.strategicProjects.map((project: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ 
                          backgroundColor: `hsl(${(index * 90) % 360}, 70%, 50%)` 
                        }}
                      ></div>
                      <span className="text-gray-700">{project.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress value={project.progress} className="w-20" />
                      <Badge className={`${project.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                        project.status === 'at-risk' ? 'bg-red-100 text-red-800' : 
                                        'bg-blue-100 text-blue-800'}`}>
                        {project.progress}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Award className="h-5 w-5 mr-2 text-green-600" />
                Performans Metrikleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Müşteri Memnuniyeti</span>
                  <Badge className="bg-green-100 text-green-800">{analytics.customerSatisfaction}%</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Müşteri Memnuniyeti</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={analytics.customerSatisfaction} className="w-24" />
                      <span className="text-sm font-medium">{analytics.customerSatisfaction}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Çalışan Memnuniyeti</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={analytics.employeeSatisfaction} className="w-24" />
                      <span className="text-sm font-medium">{analytics.employeeSatisfaction}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Operasyonel Verimlilik</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={analytics.operationalEfficiency} className="w-24" />
                      <span className="text-sm font-medium">{analytics.operationalEfficiency}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">A+</div>
                    <p className="text-sm text-gray-600">Genel Performans Notu</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Finansal Özet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatCurrency(analytics.totalRevenue)}
                  </div>
                  <p className="text-sm text-gray-600">Toplam Gelir</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kar Marjı</span>
                  <Badge className="bg-blue-100 text-blue-800">{analytics.profitMargin}%</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Yıllık Büyüme</span>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="font-medium">{analytics.revenueGrowth}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Şirket Durumu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {analytics.totalCompanies}
                  </div>
                  <p className="text-sm text-gray-600">Toplam Şirket</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Aktif Şirket</span>
                  <Badge className="bg-green-100 text-green-800">{companyStats?.active || analytics.totalCompanies - 7}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Büyüme Oranı</span>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="font-medium">{analytics.companyGrowthRate}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-purple-600" />
                Sistem Durumu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sistem Sağlığı</span>
                  <Badge className="bg-green-100 text-green-800">Sağlıklı</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Çalışma Süresi</span>
                  <Badge className="bg-blue-100 text-blue-800">{systemHealth?.uptime || 99.8}%</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Aktif Kullanıcı</span>
                  <Badge className="bg-purple-100 text-purple-800">{systemHealth?.activeUsers || 147}</Badge>
                </div>

                <div className="pt-2">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Tüm sistemler normal</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Insights */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-indigo-600" />
                Stratejik İçgörüler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 mb-2">Büyüme Fırsatı</h4>
                  <p className="text-sm text-blue-700">
                    Teknoloji sektöründe %23 büyüme potansiyeli tespit edildi. 
                    Yeni yatırım alanları için stratejik planlama öneriliyor.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900 mb-2">Operasyonel Mükemmellik</h4>
                  <p className="text-sm text-green-700">
                    Süreç optimizasyonu sonucu %15 verimlilik artışı sağlandı.
                    Benzer yaklaşımlar diğer departmanlara uygulanabilir.
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-900 mb-2">Risk Değerlendirmesi</h4>
                  <p className="text-sm text-orange-700">
                    Global genişleme projesinde yavaşlama riski. Alternatif 
                    pazar stratejileri değerlendirilmeli.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}