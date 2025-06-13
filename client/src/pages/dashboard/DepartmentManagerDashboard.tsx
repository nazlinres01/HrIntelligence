import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Settings, 
  Bell,
  Home,
  UserCheck,
  ClipboardList,
  Award,
  BookOpen,
  BarChart3,
  Building,
  LogOut
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDepartmentManager } from "@/lib/departmentUtils";

export default function DepartmentManagerDashboard() {
  const [location] = useLocation();
  const { departmentId, isDepartmentManager } = useDepartmentManager();

  // Department-specific data queries
  const { data: departmentEmployees = [] } = useQuery({
    queryKey: [`/api/employees/department/${departmentId}`],
    enabled: !!departmentId,
  });

  const { data: departmentLeaves = [] } = useQuery({
    queryKey: [`/api/leaves/department/${departmentId}`],
    enabled: !!departmentId,
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const { data: activities } = useQuery({
    queryKey: ["/api/activities"],
  });

  // Filter only pending leaves that need department manager approval
  const pendingLeaves = (departmentLeaves as any[]).filter((leave: any) => leave.status === "pending");
  const recentNotifications = (notifications as any)?.slice(0, 5) || [];
  const recentActivities = (activities as any)?.slice(0, 5) || [];

  // Department-specific statistics
  const departmentStats = {
    totalEmployees: departmentEmployees.length,
    pendingLeaves: pendingLeaves.length,
    activeProjects: 8, // Mock data - could be fetched from API
    avgPerformance: 4.3
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Departman Müdürü Dashboard</h1>
            <p className="text-gray-600">Yazılım Geliştirme Departmanı yönetim paneli</p>
          </div>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Departman Müdürü
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ekip Üyelerim</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{departmentStats.totalEmployees}</div>
              <p className="text-xs text-gray-500 mt-1">Departman çalışanları</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Onay Bekleyen İzinler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{departmentStats.pendingLeaves}</div>
              <p className="text-xs text-gray-500 mt-1">Müdür onayı gereken</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Aktif Projeler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{departmentStats.activeProjects}</div>
              <p className="text-xs text-gray-500 mt-1">Devam eden projeler</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ekip Performansı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{departmentStats.avgPerformance}/5</div>
              <p className="text-xs text-gray-500 mt-1">Ortalama değerlendirme</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                Ekip Performansı
              </CardTitle>
              <CardDescription>
                Departman çalışanlarının performans durumu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(departmentEmployees as any[]).length > 0 ? (
                  (departmentEmployees as any[]).slice(0, 3).map((employee: any) => {
                    const getPerformanceBadge = (score: number) => {
                      if (score >= 4.5) return <Badge variant="secondary" className="bg-green-100 text-green-800">Mükemmel</Badge>;
                      if (score >= 4.0) return <Badge variant="secondary" className="bg-blue-100 text-blue-800">İyi</Badge>;
                      if (score >= 3.5) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Orta</Badge>;
                      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Gelişmeli</Badge>;
                    };

                    return (
                      <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{employee.firstName} {employee.lastName}</p>
                          <p className="text-xs text-gray-500">{employee.position}</p>
                        </div>
                        {getPerformanceBadge(parseFloat(employee.performanceScore || "3.5"))}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">Departman çalışanı bulunamadı</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-red-600" />
                Onay Bekleyen İzinler
              </CardTitle>
              <CardDescription>
                Departman müdürü onayı gereken izin talepleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingLeaves.length > 0 ? (
                  pendingLeaves.slice(0, 4).map((leave: any) => {
                    const employee = (departmentEmployees as any[]).find((emp: any) => emp.id === leave.employeeId);
                    const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : `Çalışan #${leave.employeeId}`;
                    
                    return (
                      <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{employeeName}</p>
                          <p className="text-xs text-gray-500">{leave.leaveType} - {leave.days} gün</p>
                          <p className="text-xs text-gray-400">{leave.startDate} - {leave.endDate}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Onayla
                          </Button>
                          <Button size="sm" variant="outline">
                            Reddet
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">Onay bekleyen izin yok</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
            <CardDescription>
              Sık kullanılan departman müdürü işlemleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/employees">
                <Button className="w-full h-20 flex flex-col gap-2 bg-red-600 hover:bg-red-700">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Ekip Yönetimi</span>
                </Button>
              </Link>
              <Link href="/leaves">
                <Button className="w-full h-20 flex flex-col gap-2 bg-red-600 hover:bg-red-700">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">İzin Onayla</span>
                </Button>
              </Link>
              <Link href="/performance">
                <Button className="w-full h-20 flex flex-col gap-2 bg-red-600 hover:bg-red-700">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-sm">Performans</span>
                </Button>
              </Link>
              <Link href="/reports">
                <Button className="w-full h-20 flex flex-col gap-2 bg-red-600 hover:bg-red-700">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">Raporlar</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Department Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-red-600" />
              Departman Genel Durumu
            </CardTitle>
            <CardDescription>
              Yazılım Geliştirme Departmanı performans özeti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">92%</div>
                <div className="text-sm text-gray-600">Proje Başarı Oranı</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-sm text-gray-600">Çalışan Memnuniyeti</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">88%</div>
                <div className="text-sm text-gray-600">Hedef Tutturma</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}