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

export default function DepartmentManagerDashboard() {
  const [location] = useLocation();

  // Dashboard verileri
  const { data: stats } = useQuery({
    queryKey: ["/api/stats/employees"],
  });

  const { data: pendingLeaves } = useQuery({
    queryKey: ["/api/leaves"],
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const { data: activities } = useQuery({
    queryKey: ["/api/activities"],
  });

  const departmentLeaves = (pendingLeaves as any)?.filter((leave: any) => leave.status === "pending") || [];
  const recentNotifications = (notifications as any)?.slice(0, 5) || [];
  const recentActivities = (activities as any)?.slice(0, 5) || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Departman Müdürü Dashboard</h1>
            <p className="text-gray-600">Yazılım Geliştirme Departmanı yönetim paneli</p>
          </div>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Departman Müdürü
          </Badge>
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ekip Üyelerim</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">15</div>
              <p className="text-xs text-gray-500 mt-1">Yazılım geliştirme ekibi</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Onay Bekleyen İzinler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{departmentLeaves.length}</div>
              <p className="text-xs text-gray-500 mt-1">Müdür onayı gereken</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Aktif Projeler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">8</div>
              <p className="text-xs text-gray-500 mt-1">Devam eden projeler</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ekip Performansı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">4.3/5</div>
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
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Ahmet Yılmaz</p>
                    <p className="text-xs text-gray-500">Senior Developer</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Mükemmel
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Ayşe Demir</p>
                    <p className="text-xs text-gray-500">Frontend Developer</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    İyi
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Mehmet Özkan</p>
                    <p className="text-xs text-gray-500">Backend Developer</p>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Gelişmeli
                  </Badge>
                </div>
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
                {departmentLeaves.length > 0 ? (
                  departmentLeaves.slice(0, 4).map((leave: any) => (
                    <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Çalışan #{leave.employeeId}</p>
                        <p className="text-xs text-gray-500">{leave.leaveType} - {leave.days} gün</p>
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
                  ))
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
      </main>
    </div>
  );
}