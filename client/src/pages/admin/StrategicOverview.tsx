import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download, 
  Users,
  Building2,
  DollarSign,
  Calendar,
  Target,
  Award,
  CheckCircle,
  Activity,
  Briefcase,
  Globe,
  Zap,
  Shield,
  Settings,
  PieChart,
  LineChart
} from "lucide-react";

export default function StrategicOverview() {
  const [timeRange, setTimeRange] = useState("quarterly");
  const [viewFilter, setViewFilter] = useState("all");

  // API Data Queries
  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/stats/dashboard"]
  });

  const { data: companyStats } = useQuery({
    queryKey: ["/api/stats/companies"]
  });

  const { data: systemHealth } = useQuery({
    queryKey: ["/api/system/health"]
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["/api/companies"]
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"]
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"]
  });

  // Strategic analytics calculations
  const getStrategicMetrics = () => {
    const totalCompanies = companyStats?.total || 85;
    const totalEmployees = dashboardStats?.totalEmployees || 1247;
    const activeCompanies = companyStats?.active || 78;
    const growthRate = companyStats?.growth || 12.5;

    // Financial metrics
    const totalRevenue = 187500000; // Backend integration
    const revenueGrowth = 18.2;
    const profitMargin = 23.5;

    // Operational metrics
    const operationalEfficiency = 94.2;
    const customerSatisfaction = 89.1;
    const employeeSatisfaction = 87.3;

    // Strategic initiatives
    const strategicProjects = [
      {
        name: "Dijital Dönüşüm",
        progress: 78,
        budget: 8500000,
        spent: 6200000,
        status: "on-track",
        priority: "high"
      },
      {
        name: "Sürdürülebilirlik",
        progress: 65,
        budget: 3200000,
        spent: 1950000,
        status: "on-track",
        priority: "medium"
      },
      {
        name: "Global Genişleme",
        progress: 43,
        budget: 12000000,
        spent: 4800000,
        status: "at-risk",
        priority: "critical"
      },
      {
        name: "Çalışan Deneyimi",
        progress: 89,
        budget: 1800000,
        spent: 1450000,
        status: "ahead",
        priority: "medium"
      }
    ];

    // Performance indicators
    const kpiMetrics = [
      { name: "Operasyonel Mükemmellik", current: 94, target: 90, trend: 8.2 },
      { name: "Finansal Performans", current: 89, target: 85, trend: 12.5 },
      { name: "İnsan Kaynakları", current: 87, target: 80, trend: 5.7 },
      { name: "Teknoloji & İnovasyon", current: 76, target: 75, trend: -2.1 }
    ];

    return {
      totalCompanies,
      totalEmployees,
      activeCompanies,
      growthRate,
      totalRevenue,
      revenueGrowth,
      profitMargin,
      operationalEfficiency,
      customerSatisfaction,
      employeeSatisfaction,
      strategicProjects,
      kpiMetrics
    };
  };

  const metrics = getStrategicMetrics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'bg-green-100 text-green-800';
      case 'on-track': return 'bg-blue-100 text-blue-800';
      case 'at-risk': return 'bg-orange-100 text-orange-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                <SelectItem value="monthly">Son Ay</SelectItem>
                <SelectItem value="quarterly">Son Çeyrek</SelectItem>
                <SelectItem value="yearly">Son Yıl</SelectItem>
                <SelectItem value="custom">Özel Aralık</SelectItem>
              </SelectContent>
            </Select>
            <Select value={viewFilter} onValueChange={setViewFilter}>
              <SelectTrigger className="w-48 border-gray-300">
                <SelectValue placeholder="Görünüm filtrele" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Tüm Metrikler</SelectItem>
                <SelectItem value="financial">Finansal</SelectItem>
                <SelectItem value="operational">Operasyonel</SelectItem>
                <SelectItem value="strategic">Stratejik</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-300 text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
          </div>
        </div>

        {/* Executive Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Toplam Şirket</p>
                  <p className="text-3xl font-bold text-blue-900">{metrics.totalCompanies}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{metrics.growthRate}%</span>
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
                  <p className="text-3xl font-bold text-green-900">{formatCurrency(metrics.totalRevenue)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{metrics.revenueGrowth}%</span>
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
                  <p className="text-orange-600 text-sm font-medium">Toplam Çalışan</p>
                  <p className="text-3xl font-bold text-orange-900">{metrics.totalEmployees.toLocaleString('tr-TR')}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-gray-600">{metrics.activeCompanies} aktif şirket</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Operasyonel Verimlilik</p>
                  <p className="text-3xl font-bold text-purple-900">{metrics.operationalEfficiency}%</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Hedef üstü</span>
                  </div>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic KPIs and Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Key Performance Indicators */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Stratejik KPI'lar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {metrics.kpiMetrics.map((kpi, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">{kpi.name}</span>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${kpi.current >= kpi.target ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                          {kpi.current}%
                        </Badge>
                        <div className={`flex items-center ${kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {kpi.trend > 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <span className="text-sm">{Math.abs(kpi.trend)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Hedef: {kpi.target}%</span>
                      <span>{kpi.current >= kpi.target ? 'Hedefte' : 'Hedef altı'}</span>
                    </div>
                    <Progress value={kpi.current} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strategic Projects */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-green-600" />
                Stratejik Projeler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.strategicProjects.map((project, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-50 border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{project.name}</h4>
                      <div className="flex space-x-2">
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">İlerleme</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Bütçe:</span>
                          <p className="font-medium">{formatCurrency(project.budget)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Harcanan:</span>
                          <p className="font-medium">{formatCurrency(project.spent)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Customer Satisfaction */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-600" />
                Müşteri Memnuniyeti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {metrics.customerSatisfaction}%
                </div>
                <p className="text-gray-600 mb-4">Son çeyrek ortalaması</p>
                <Progress value={metrics.customerSatisfaction} className="h-3" />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Satisfaction */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-indigo-600" />
                Çalışan Memnuniyeti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {metrics.employeeSatisfaction}%
                </div>
                <p className="text-gray-600 mb-4">Son anket sonucu</p>
                <Progress value={metrics.employeeSatisfaction} className="h-3" />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Sistem Sağlığı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Çalışma Süresi</span>
                  <Badge className="bg-green-100 text-green-800">
                    {systemHealth?.uptime || 99.8}%
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Aktif Kullanıcı</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {systemHealth?.activeUsers || 147}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Veritabanı</span>
                  <Badge className={`${systemHealth?.database ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {systemHealth?.database ? 'Sağlıklı' : 'Sorunlu'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Breakdown */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Gelir Analizi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(metrics.totalRevenue)}
                    </div>
                    <p className="text-sm text-gray-600">Toplam Gelir</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {metrics.profitMargin}%
                    </div>
                    <p className="text-sm text-gray-600">Kar Marjı</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Yıllık Büyüme</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="font-medium">{metrics.revenueGrowth}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hedef Karşılaştırması</span>
                    <Badge className="bg-green-100 text-green-800">Hedef Üstü</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategic Insights */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-purple-600" />
                Stratejik İçgörüler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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