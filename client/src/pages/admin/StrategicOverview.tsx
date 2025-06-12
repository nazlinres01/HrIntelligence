import React, { useState } from "react";
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
  Star
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

  const { data: payrolls = [] } = useQuery<any[]>({
    queryKey: ["/api/payroll"]
  });

  const { data: performance = [] } = useQuery<any[]>({
    queryKey: ["/api/performance"]
  });

  const { data: trainings = [] } = useQuery<any[]>({
    queryKey: ["/api/trainings"]
  });

  // Strategic metrics calculations
  const getStrategicMetrics = () => {
    const totalEmployees = employees.length;
    const totalCompanies = companies.length;
    const totalDepartments = departments.length;
    
    // Financial metrics
    const totalPayrollCost = payrolls.reduce((sum: number, payroll: any) => {
      return sum + (parseFloat(payroll.baseSalary || 0) + parseFloat(payroll.bonus || 0));
    }, 0);

    const avgSalaryPerEmployee = totalEmployees > 0 ? totalPayrollCost / totalEmployees : 0;

    // Performance metrics
    const avgPerformanceScore = performance.length > 0 
      ? performance.reduce((sum: number, perf: any) => sum + (perf.overallScore || 0), 0) / performance.length 
      : 0;

    const highPerformers = performance.filter((perf: any) => (perf.overallScore || 0) >= 4.0).length;
    const performanceSuccessRate = performance.length > 0 ? (highPerformers / performance.length) * 100 : 0;

    // Training & Development
    const activeTrainings = trainings.filter((training: any) => training.status === 'active').length;
    const completedTrainings = trainings.filter((training: any) => training.status === 'completed').length;
    const trainingCompletionRate = trainings.length > 0 ? (completedTrainings / trainings.length) * 100 : 0;

    // Strategic KPIs (mock data representing strategic metrics)
    const employeeRetentionRate = 94.2;
    const employeeSatisfactionScore = 4.6;
    const timeToHire = 18; // days
    const costPerHire = 15750; // TL
    const productivityIndex = 87.5;
    const diversityIndex = 78.3;
    const trainingROI = 245; // %
    const complianceScore = 98.1;

    // Growth metrics
    const quarterlyGrowthRate = 12.8;
    const revenuePerEmployee = 285000; // Mock data
    const hrEfficiencyScore = 92.3;

    return {
      totalEmployees,
      totalCompanies,
      totalDepartments,
      totalPayrollCost,
      avgSalaryPerEmployee,
      avgPerformanceScore,
      performanceSuccessRate,
      activeTrainings,
      trainingCompletionRate,
      employeeRetentionRate,
      employeeSatisfactionScore,
      timeToHire,
      costPerHire,
      productivityIndex,
      diversityIndex,
      trainingROI,
      complianceScore,
      quarterlyGrowthRate,
      revenuePerEmployee,
      hrEfficiencyScore
    };
  };

  const metrics = getStrategicMetrics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getScoreColor = (score: number, threshold: number = 80) => {
    if (score >= threshold) return "text-green-600";
    if (score >= threshold - 20) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Stratejik Genel Bakış</h1>
            <p className="text-gray-600">İK stratejisi, performans göstergeleri ve kurumsal hedefler</p>
          </div>
          <div className="flex space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48 border-gray-300">
                <SelectValue placeholder="Dönem seçin" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="monthly">Aylık</SelectItem>
                <SelectItem value="quarterly">Çeyreklik</SelectItem>
                <SelectItem value="yearly">Yıllık</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-300 text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Stratejik Rapor
            </Button>
          </div>
        </div>

        {/* Executive Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-8">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center text-xl">
              <Target className="h-6 w-6 mr-2" />
              Yönetici Özeti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{metrics.quarterlyGrowthRate}%</div>
                <div className="text-blue-800 font-medium">Çeyreklik Büyüme</div>
                <div className="text-sm text-blue-600 mt-1">Hedefin üzerinde</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{metrics.hrEfficiencyScore.toFixed(1)}%</div>
                <div className="text-green-800 font-medium">İK Verimliliği</div>
                <div className="text-sm text-green-600 mt-1">Mükemmel seviye</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{formatCurrency(metrics.revenuePerEmployee)}</div>
                <div className="text-purple-800 font-medium">Çalışan Başına Gelir</div>
                <div className="text-sm text-purple-600 mt-1">Sektör ortalaması üstü</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Strategic Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Çalışan Elde Tutma</p>
                  <p className="text-3xl font-bold text-green-900">{metrics.employeeRetentionRate}%</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+2.3%</span>
                  </div>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Memnuniyet Skoru</p>
                  <p className="text-3xl font-bold text-blue-900">{metrics.employeeSatisfactionScore}/5</p>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-blue-600">Yüksek</span>
                  </div>
                </div>
                <Award className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">İşe Alım Süresi</p>
                  <p className="text-3xl font-bold text-orange-900">{metrics.timeToHire}</p>
                  <div className="flex items-center mt-2">
                    <Clock className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-sm text-orange-600">gün</span>
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
                  <p className="text-purple-600 text-sm font-medium">Üretkenlik İndeksi</p>
                  <p className="text-3xl font-bold text-purple-900">{metrics.productivityIndex}%</p>
                  <div className="flex items-center mt-2">
                    <Zap className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-sm text-purple-600">Optimal</span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance & Development */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Performans ve Gelişim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ortalama Performans</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(metrics.avgPerformanceScore / 5) * 100} className="w-24" />
                    <Badge className="bg-blue-100 text-blue-800">
                      {metrics.avgPerformanceScore.toFixed(1)}/5
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Başarı Oranı</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={metrics.performanceSuccessRate} className="w-24" />
                    <Badge className={`${getScoreColor(metrics.performanceSuccessRate, 75) === 'text-green-600' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {metrics.performanceSuccessRate.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Eğitim Tamamlama</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={metrics.trainingCompletionRate} className="w-24" />
                    <Badge className="bg-purple-100 text-purple-800">
                      {metrics.trainingCompletionRate.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Eğitim ROI</span>
                  <Badge className="bg-green-100 text-green-800">
                    {metrics.trainingROI}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial & Operational */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Mali ve Operasyonel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Toplam Bordro Maliyeti</span>
                  <Badge className="bg-green-100 text-green-800">
                    {formatCurrency(metrics.totalPayrollCost)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ortalama Maaş</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {formatCurrency(metrics.avgSalaryPerEmployee)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">İşe Alım Maliyeti</span>
                  <Badge className="bg-orange-100 text-orange-800">
                    {formatCurrency(metrics.costPerHire)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Uyum Skoru</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={metrics.complianceScore} className="w-24" />
                    <Badge className="bg-green-100 text-green-800">
                      {metrics.complianceScore}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Initiatives */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Target className="h-5 w-5 mr-2 text-red-600" />
                Stratejik Hedefler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Çalışan Artışı</span>
                  <Badge className="bg-green-100 text-green-800">✓ %15</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Dijital Dönüşüm</span>
                  <Badge className="bg-blue-100 text-blue-800">⏳ %78</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Çeşitlilik Artışı</span>
                  <Badge className="bg-purple-100 text-purple-800">⏳ %83</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sürdürülebilirlik</span>
                  <Badge className="bg-green-100 text-green-800">✓ %92</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                Risk Göstergeleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Personel Devir Riski</span>
                  <Badge className="bg-green-100 text-green-800">Düşük</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Yetenek Açığı</span>
                  <Badge className="bg-orange-100 text-orange-800">Orta</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Uyum Riski</span>
                  <Badge className="bg-green-100 text-green-800">Düşük</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bütçe Aşımı</span>
                  <Badge className="bg-green-100 text-green-800">Düşük</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Başarı Faktörleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Liderlik Kalitesi</span>
                  <Badge className="bg-green-100 text-green-800">Yüksek</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Teknoloji Adaptasyonu</span>
                  <Badge className="bg-blue-100 text-blue-800">İyi</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Kültürel Uyum</span>
                  <Badge className="bg-green-100 text-green-800">Mükemmel</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">İnovasyon İndeksi</span>
                  <Badge className="bg-purple-100 text-purple-800">Yüksek</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Roadmap */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-indigo-600" />
              Stratejik Yol Haritası
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Q1 2024</h3>
                <p className="text-sm text-gray-600 mt-1">Dijital HR Altyapısı</p>
                <Badge className="bg-green-100 text-green-800 mt-2">Tamamlandı</Badge>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Q2 2024</h3>
                <p className="text-sm text-gray-600 mt-1">Yetenek Gelişim Programı</p>
                <Badge className="bg-blue-100 text-blue-800 mt-2">Devam Ediyor</Badge>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Q3 2024</h3>
                <p className="text-sm text-gray-600 mt-1">Organizasyon Optimizasyonu</p>
                <Badge className="bg-gray-100 text-gray-800 mt-2">Planlanıyor</Badge>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Q4 2024</h3>
                <p className="text-sm text-gray-600 mt-1">Global Expansion HR</p>
                <Badge className="bg-gray-100 text-gray-800 mt-2">Gelecek</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}