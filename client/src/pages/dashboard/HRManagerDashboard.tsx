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
  Shield,
  LogOut
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// İK Müdürü Sidebar Navigation
const sidebarItems = [
  { icon: Home, label: "Ana Sayfa", path: "/hr-manager" },
  { icon: Users, label: "Çalışan Yönetimi", path: "/hr-manager/employees" },
  { icon: Calendar, label: "İzin Yönetimi", path: "/hr-manager/leaves" },
  { icon: TrendingUp, label: "Performans", path: "/hr-manager/performance" },
  { icon: BookOpen, label: "Eğitimler", path: "/hr-manager/trainings" },
  { icon: FileText, label: "Bordro Yönetimi", path: "/hr-manager/payroll" },
  { icon: ClipboardList, label: "İşe Alım", path: "/hr-manager/recruitment" },
  { icon: BarChart3, label: "Raporlar", path: "/hr-manager/reports" },
  { icon: Bell, label: "Bildirimler", path: "/hr-manager/notifications" },
  { icon: Settings, label: "Ayarlar", path: "/hr-manager/settings" },
];

export default function HRManagerDashboard() {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const approvalPendingLeaves = pendingLeaves?.filter(leave => leave.status === "pending") || [];
  const recentNotifications = notifications?.slice(0, 5) || [];
  const recentActivities = activities?.slice(0, 5) || [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Teal/Yeşil tema İK Müdürü için */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-teal-600 to-teal-800 text-white transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-teal-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-teal-600" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg">İK Müdürü</h1>
                <p className="text-xs text-teal-200">Yönetim Paneli</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-11 ${
                    isActive 
                      ? "bg-white text-teal-800 shadow-sm" 
                      : "text-white hover:bg-teal-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-teal-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-teal-300 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-teal-800" />
            </div>
            {sidebarOpen && (
              <div className="text-sm">
                <p className="font-medium">İK Müdürü</p>
                <p className="text-teal-200 text-xs">hr@techcorp.com</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white hover:bg-teal-700"
            onClick={() => window.location.href = '/api/logout'}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Çıkış Yap</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">İK Müdürü Dashboard</h2>
              <p className="text-gray-600">İnsan kaynakları yönetim paneli</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Users className="w-4 h-4" />
              </Button>
              <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                İK Müdürü
              </Badge>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-l-4 border-l-teal-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Toplam Çalışan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats?.totalEmployees || 0}</div>
                <p className="text-xs text-gray-500 mt-1">Aktif personel sayısı</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Bekleyen İzinler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{approvalPendingLeaves.length}</div>
                <p className="text-xs text-gray-500 mt-1">Onay bekleyen talepler</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Aylık Bordro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">₺{stats?.monthlyPayroll || '0'}</div>
                <p className="text-xs text-gray-500 mt-1">Bu ay toplam</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ortalama Performans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats?.avgPerformance || '0'}/5</div>
                <p className="text-xs text-gray-500 mt-1">Genel değerlendirme</p>
              </CardContent>
            </Card>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-teal-600" />
                  Onay Bekleyen İzinler
                </CardTitle>
                <CardDescription>
                  İK müdürü onayı gereken izin talepleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {approvalPendingLeaves.length > 0 ? (
                    approvalPendingLeaves.slice(0, 5).map((leave: any) => (
                      <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">Çalışan #{leave.employeeId}</p>
                          <p className="text-xs text-gray-500">{leave.leaveType} - {leave.days} gün</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
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

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-600" />
                  Son Aktiviteler
                </CardTitle>
                <CardDescription>
                  Sistem genelindeki son hareketler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity: any) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.type}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Henüz aktivite yok</p>
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
                Sık kullanılan İK müdürü işlemleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/hr-manager/employees">
                  <Button className="w-full h-20 flex flex-col gap-2 bg-teal-600 hover:bg-teal-700">
                    <Users className="w-6 h-6" />
                    <span className="text-sm">Çalışan Ekle</span>
                  </Button>
                </Link>
                <Link href="/hr-manager/leaves">
                  <Button className="w-full h-20 flex flex-col gap-2 bg-teal-600 hover:bg-teal-700">
                    <Calendar className="w-6 h-6" />
                    <span className="text-sm">İzin Onayla</span>
                  </Button>
                </Link>
                <Link href="/hr-manager/performance">
                  <Button className="w-full h-20 flex flex-col gap-2 bg-teal-600 hover:bg-teal-700">
                    <TrendingUp className="w-6 h-6" />
                    <span className="text-sm">Performans</span>
                  </Button>
                </Link>
                <Link href="/hr-manager/reports">
                  <Button className="w-full h-20 flex flex-col gap-2 bg-teal-600 hover:bg-teal-700">
                    <BarChart3 className="w-6 h-6" />
                    <span className="text-sm">Raporlar</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}