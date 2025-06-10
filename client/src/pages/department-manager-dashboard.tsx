import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Users, 
  BarChart3, 
  Calendar, 
  TrendingUp,
  Award,
  Plus,
  AlertCircle,
  Target
} from "lucide-react";

export default function DepartmentManagerDashboard() {
  const { user } = useAuth();

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: performance } = useQuery({
    queryKey: ["/api/performance"],
  });

  const { data: leaves } = useQuery({
    queryKey: ["/api/leaves"],
  });

  const departmentEmployees = (employees as any)?.filter((emp: any) => 
    emp.department === "Yazılım Geliştirme" // Example department
  ) || [];
  
  const pendingLeaves = (leaves as any)?.filter((leave: any) => 
    leave.status === "pending" && departmentEmployees.some((emp: any) => emp.id === leave.employeeId)
  ) || [];

  const avgPerformance = departmentEmployees.length > 0 
    ? (departmentEmployees.reduce((sum: number, emp: any) => sum + (emp.performanceScore || 0), 0) / departmentEmployees.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-red-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Briefcase className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Departman Müdürü Paneli</h1>
              <p className="text-orange-100">
                Hoş geldiniz, {(user as any)?.firstName} {(user as any)?.lastName}
              </p>
              <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                Departman Müdürü
              </Badge>
            </div>
          </div>
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Target className="h-4 w-4 mr-2" />
            Hedef Belirle
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Departman Çalışanları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {departmentEmployees.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Aktif çalışan sayısı</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Ortalama Performans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {avgPerformance}/10
            </div>
            <p className="text-xs text-gray-500 mt-1">Departman ortalaması</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Bekleyen İzinler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {pendingLeaves.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Onay bekleyen talepler</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Yüksek Performans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {departmentEmployees.filter((emp: any) => emp.performanceScore >= 8).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">8+ puan alan çalışan</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Departman Ekibi
              </span>
              <Badge variant="secondary">{departmentEmployees.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {departmentEmployees.length > 0 ? (
              <div className="space-y-3">
                {departmentEmployees.slice(0, 5).map((employee: any) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{employee.firstName} {employee.lastName}</p>
                      <p className="text-xs text-gray-500">{employee.position}</p>
                      <div className="flex items-center mt-1">
                        <BarChart3 className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">Performans: {employee.performanceScore || 0}/10</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                        {employee.status === "active" ? "Aktif" : "Pasif"}
                      </Badge>
                      {employee.performanceScore >= 8 && (
                        <div className="mt-1">
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            <Award className="h-3 w-3 mr-1" />
                            Yüksek
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Departman çalışanı bulunmuyor</p>
            )}
          </CardContent>
        </Card>

        {/* Pending Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                Bekleyen İzin Talepleri
              </span>
              <Badge variant="secondary">{pendingLeaves.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingLeaves.length > 0 ? (
              <div className="space-y-3">
                {pendingLeaves.slice(0, 5).map((leave: any) => (
                  <div key={leave.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{leave.employeeName}</p>
                      <p className="text-xs text-gray-500">{leave.type} - {leave.days} gün</p>
                      <p className="text-xs text-gray-500">{new Date(leave.startDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                        Onayla
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                        Reddet
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Bekleyen izin talebi bulunmuyor</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Ekip Yönetimi</h3>
            <p className="text-sm text-gray-500">Departman çalışanlarını yönet</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Performans</h3>
            <p className="text-sm text-gray-500">Performans değerlendirmeleri</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">İzin Onayları</h3>
            <p className="text-sm text-gray-500">Departman izin talepleri</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Raporlar</h3>
            <p className="text-sm text-gray-500">Departman raporları</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}