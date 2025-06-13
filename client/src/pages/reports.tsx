import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  PieChart,
  LineChart,
  Filter
} from "lucide-react";

export default function Reports() {
  const [periodFilter, setPeriodFilter] = useState("all");
  const [reportType, setReportType] = useState("summary");

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"]
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"]
  });

  const { data: payrolls = [] } = useQuery({
    queryKey: ["/api/payroll"]
  });

  const { data: leaves = [] } = useQuery({
    queryKey: ["/api/leaves"]
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getEmployeeStats = () => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((emp: any) => emp.status === 'active').length;
    const departmentCount = departments.length;
    const avgSalary = employees.length > 0 
      ? employees.reduce((sum: number, emp: any) => sum + (emp.salary || 0), 0) / employees.length 
      : 0;
    
    return { totalEmployees, activeEmployees, departmentCount, avgSalary };
  };

  const getDepartmentStats = () => {
    return departments.map((dept: any) => {
      const deptEmployees = employees.filter((emp: any) => emp.department === dept.name);
      const avgSalary = deptEmployees.length > 0 
        ? deptEmployees.reduce((sum: number, emp: any) => sum + (emp.salary || 0), 0) / deptEmployees.length 
        : 0;
      
      return {
        name: dept.name,
        employeeCount: deptEmployees.length,
        avgSalary
      };
    });
  };

  const getLeaveStats = () => {
    const totalLeaves = leaves.length;
    const pendingLeaves = leaves.filter((leave: any) => leave.status === 'pending').length;
    const approvedLeaves = leaves.filter((leave: any) => leave.status === 'approved').length;
    const rejectedLeaves = leaves.filter((leave: any) => leave.status === 'rejected').length;
    
    return { totalLeaves, pendingLeaves, approvedLeaves, rejectedLeaves };
  };

  const stats = getEmployeeStats();
  const departmentStats = getDepartmentStats();
  const leaveStats = getLeaveStats();

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Raporlar ve Analitik</h1>
            <p className="text-gray-600">Detaylı raporlar ve iş zekası analizleri</p>
          </div>
          <div className="flex space-x-3">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48 border-gray-300">
                <SelectValue placeholder="Rapor türü" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="summary">Özet Rapor</SelectItem>
                <SelectItem value="detailed">Detaylı Rapor</SelectItem>
                <SelectItem value="financial">Mali Rapor</SelectItem>
                <SelectItem value="performance">Performans Raporu</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              PDF İndir
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Toplam Çalışan</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
                  <p className="text-xs text-gray-500 mt-1">Aktif: {stats.activeEmployees}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Departman Sayısı</p>
                  <p className="text-3xl font-bold text-green-900">{stats.departmentCount}</p>
                  <p className="text-xs text-green-600 mt-1">Aktif birimler</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Ortalama Maaş</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.avgSalary)}</p>
                  <p className="text-xs text-gray-500 mt-1">Aylık brüt</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">İzin Talepleri</p>
                  <p className="text-3xl font-bold text-gray-900">{leaveStats.totalLeaves}</p>
                  <p className="text-xs text-gray-500 mt-1">Bekleyen: {leaveStats.pendingLeaves}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
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
                {departmentStats.map((dept: any, index: number) => (
                  <div key={dept.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ 
                          backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)` 
                        }}
                      ></div>
                      <span className="font-medium text-gray-900">{dept.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{dept.employeeCount} kişi</p>
                      <p className="text-xs text-gray-600">{formatCurrency(dept.avgSalary)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leave Status Distribution */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                İzin Durumu Analizi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span className="font-medium text-gray-900">Onaylanan</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{leaveStats.approvedLeaves}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded bg-yellow-500"></div>
                    <span className="font-medium text-gray-900">Bekleyen</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">{leaveStats.pendingLeaves}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span className="font-medium text-gray-900">Reddedilen</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">{leaveStats.rejectedLeaves}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Trends */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-indigo-600" />
                Aylık Trendler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Yeni İşe Alımlar</span>
                  <span className="font-medium text-gray-900">+12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ayrılanlar</span>
                  <span className="font-medium text-gray-900">-3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Terfi Alanlar</span>
                  <span className="font-medium text-gray-900">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Eğitim Tamamlayanlar</span>
                  <span className="font-medium text-gray-900">24</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                Performans Metrikleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ortalama Performans</span>
                  <Badge className="bg-green-100 text-green-800">8.2/10</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hedef Tamamlama</span>
                  <Badge className="bg-blue-100 text-blue-800">%87</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Çalışan Memnuniyeti</span>
                  <Badge className="bg-purple-100 text-purple-800">%92</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Devamsızlık Oranı</span>
                  <Badge className="bg-orange-100 text-orange-800">%3.1</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-gray-600" />
                Hızlı Rapor İşlemleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  Aylık Özet Raporu
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  Bordro Raporu
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  İzin Raporu
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  Performans Raporu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}