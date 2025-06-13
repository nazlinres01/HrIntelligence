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

export default function AnalyticsCenter() {
  const [timeRange, setTimeRange] = useState("last30days");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const { data: employees = [] } = useQuery<any[]>({
    queryKey: ["/api/employees"]
  });

  const { data: departments = [] } = useQuery<any[]>({
    queryKey: ["/api/departments"]
  });

  const { data: payrolls = [] } = useQuery<any[]>({
    queryKey: ["/api/payroll"]
  });

  const { data: leaves = [] } = useQuery<any[]>({
    queryKey: ["/api/leaves"]
  });

  const { data: performance = [] } = useQuery<any[]>({
    queryKey: ["/api/performance"]
  });

  const { data: trainings = [] } = useQuery<any[]>({
    queryKey: ["/api/trainings"]
  });

  // Analytics calculations
  const getAnalytics = () => {
    const totalEmployees = (employees as any[]).length;
    const activeDepartments = (departments as any[]).length;
    
    // Employee distribution by department
    const departmentDistribution = (departments as any[]).map((dept: any) => {
      const deptEmployees = (employees as any[]).filter((emp: any) => emp.departmentId === dept.id);
      return {
        name: dept.name,
        count: deptEmployees.length,
        percentage: totalEmployees > 0 ? Math.round((deptEmployees.length / totalEmployees) * 100) : 0
      };
    });

    // Payroll analytics
    const totalPayroll = (payrolls as any[]).reduce((sum: number, payroll: any) => {
      return sum + (parseFloat(payroll.baseSalary || 0) + parseFloat(payroll.bonus || 0));
    }, 0);

    const avgSalary = (payrolls as any[]).length > 0 ? totalPayroll / (payrolls as any[]).length : 0;

    // Leave analytics
    const pendingLeaves = (leaves as any[]).filter((leave: any) => leave.status === 'pending').length;
    const approvedLeaves = (leaves as any[]).filter((leave: any) => leave.status === 'approved').length;
    const totalLeaves = (leaves as any[]).length;

    // Performance analytics
    const avgPerformanceScore = (performance as any[]).length > 0 
      ? (performance as any[]).reduce((sum: number, perf: any) => sum + (perf.overallScore || 0), 0) / (performance as any[]).length 
      : 0;

    const highPerformers = (performance as any[]).filter((perf: any) => (perf.overallScore || 0) >= 4.0).length;

    // Training analytics
    const activeTrainings = (trainings as any[]).filter((training: any) => training.status === 'active').length;
    const completedTrainings = (trainings as any[]).filter((training: any) => training.status === 'completed').length;

    // Growth metrics
    const employeeGrowthRate = 12.5; // Mock data - would calculate from historical data
    const payrollGrowthRate = 8.3;
    const performanceGrowthRate = 15.2;

    return {
      totalEmployees,
      activeDepartments,
      departmentDistribution,
      totalPayroll,
      avgSalary,
      pendingLeaves,
      approvedLeaves,
      totalLeaves,
      avgPerformanceScore,
      highPerformers,
      activeTrainings,
      completedTrainings,
      employeeGrowthRate,
      payrollGrowthRate,
      performanceGrowthRate
    };
  };

  const analytics = getAnalytics();

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analitik Merkezi</h1>
            <p className="text-gray-600">İK verileri, trendler ve performans analizi</p>
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
            <Button variant="lightgray" className="border-gray-300 text-gray-700">
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
                  <p className="text-blue-600 text-sm font-medium">Toplam Çalışan</p>
                  <p className="text-3xl font-bold text-blue-900">{analytics.totalEmployees}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{analytics.employeeGrowthRate}%</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Toplam Bordro</p>
                  <p className="text-3xl font-bold text-green-900">{formatCurrency(analytics.totalPayroll)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{analytics.payrollGrowthRate}%</span>
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
                  <p className="text-orange-600 text-sm font-medium">Ortalama Performans</p>
                  <p className="text-3xl font-bold text-orange-900">{analytics.avgPerformanceScore.toFixed(1)}/5</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{analytics.performanceGrowthRate}%</span>
                  </div>
                </div>
                <Award className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Aktif Eğitim</p>
                  <p className="text-3xl font-bold text-purple-900">{analytics.activeTrainings}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-gray-600">{analytics.completedTrainings} tamamlandı</span>
                  </div>
                </div>
                <Briefcase className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Department Distribution */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                Departman Dağılımı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.departmentDistribution.map((dept: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ 
                          backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)` 
                        }}
                      ></div>
                      <span className="text-gray-700">{dept.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress value={dept.percentage} className="w-20" />
                      <Badge className="bg-gray-100 text-gray-800">
                        {dept.count} kişi ({dept.percentage}%)
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leave Management Stats */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                İzin Analizi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Toplam İzin Talebi</span>
                  <Badge className="bg-blue-100 text-blue-800">{analytics.totalLeaves}</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Onaylanmış</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={(analytics.approvedLeaves / analytics.totalLeaves) * 100} className="w-24" />
                      <span className="text-sm font-medium">{analytics.approvedLeaves}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bekleyen</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={(analytics.pendingLeaves / analytics.totalLeaves) * 100} className="w-24" />
                      <span className="text-sm font-medium">{analytics.pendingLeaves}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Onay Oranı</span>
                    <Badge className="bg-green-100 text-green-800">
                      {analytics.totalLeaves > 0 ? Math.round((analytics.approvedLeaves / analytics.totalLeaves) * 100) : 0}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance & Training */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Overview */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Target className="h-5 w-5 mr-2 text-orange-600" />
                Performans Genel Bakış
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {analytics.avgPerformanceScore.toFixed(1)}
                  </div>
                  <div className="text-gray-600">Ortalama Performans Skoru</div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Yüksek Performans (4.0+)</span>
                    <Badge className="bg-green-100 text-green-800">
                      {analytics.highPerformers} kişi
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Toplam Değerlendirme</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {performance.length} kayıt
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Başarı Oranı</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {performance.length > 0 ? Math.round((analytics.highPerformers / performance.length) * 100) : 0}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Analytics */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Maaş Analizi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(analytics.avgSalary)}
                  </div>
                  <div className="text-gray-600">Ortalama Maaş</div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Toplam Bordro</span>
                    <Badge className="bg-green-100 text-green-800">
                      {formatCurrency(analytics.totalPayroll)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Bordro Kayıt Sayısı</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {payrolls.length} kayıt
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Büyüme Oranı</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <Badge className="bg-green-100 text-green-800">
                        {analytics.payrollGrowthRate}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-600" />
              Önemli Göstergeler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">İK Verimliliği</h3>
                <p className="text-2xl font-bold text-green-600 mt-1">92%</p>
                <p className="text-xs text-gray-500 mt-1">Son 30 günde artış</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Ortalama İşlem Süresi</h3>
                <p className="text-2xl font-bold text-orange-600 mt-1">2.4 gün</p>
                <p className="text-xs text-gray-500 mt-1">İK süreçleri için</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900">Çalışan Memnuniyeti</h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">4.6/5</p>
                <p className="text-xs text-gray-500 mt-1">Son anket sonuçları</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}