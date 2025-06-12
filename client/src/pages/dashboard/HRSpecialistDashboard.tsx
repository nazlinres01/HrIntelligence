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
  UserCog,
  LogOut
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// İK Uzmanı Sidebar Navigation
const sidebarItems = [
  { icon: Home, label: "Ana Sayfa", path: "/hr-specialist" },
  { icon: Users, label: "Çalışan İşlemleri", path: "/hr-specialist/employees" },
  { icon: Calendar, label: "İzin İşlemleri", path: "/hr-specialist/leaves" },
  { icon: TrendingUp, label: "Performans Takip", path: "/hr-specialist/performance" },
  { icon: BookOpen, label: "Eğitim Kayıtları", path: "/hr-specialist/trainings" },
  { icon: ClipboardList, label: "İşe Alım", path: "/hr-specialist/recruitment" },
  { icon: FileText, label: "Belgeler", path: "/hr-specialist/documents" },
  { icon: Bell, label: "Bildirimler", path: "/hr-specialist/notifications" },
  { icon: Settings, label: "Ayarlar", path: "/hr-specialist/settings" },
];

export default function HRSpecialistDashboard() {
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

  const processingLeaves = pendingLeaves?.filter(leave => leave.status === "pending") || [];
  const recentNotifications = notifications?.slice(0, 5) || [];
  const recentActivities = activities?.slice(0, 5) || [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Orange tema İK Uzmanı için */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-orange-600 to-orange-800 text-white transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-orange-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <UserCog className="w-5 h-5 text-orange-600" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg">İK Uzmanı</h1>
                <p className="text-xs text-orange-200">İşlemler Paneli</p>
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
                      ? "bg-white text-orange-800 shadow-sm" 
                      : "text-white hover:bg-orange-700 hover:text-white"
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
        <div className="p-4 border-t border-orange-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center">
              <UserCog className="w-4 h-4 text-orange-800" />
            </div>
            {sidebarOpen && (
              <div className="text-sm">
                <p className="font-medium">İK Uzmanı</p>
                <p className="text-orange-200 text-xs">specialist@techcorp.com</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white hover:bg-orange-700"
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
              <h2 className="text-2xl font-bold text-gray-900">İK Uzmanı Dashboard</h2>
              <p className="text-gray-600">İnsan kaynakları işlemler paneli</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <UserCog className="w-4 h-4" />
              </Button>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                İK Uzmanı
              </Badge>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">İşlediğim Çalışanlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats?.totalEmployees || 0}</div>
                <p className="text-xs text-gray-500 mt-1">Kayıt altındaki personel</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">İşlemdeki İzinler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{processingLeaves.length}</div>
                <p className="text-xs text-gray-500 mt-1">İşleme alınan talepler</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Bu Ay Tamamlanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">23</div>
                <p className="text-xs text-gray-500 mt-1">İşlem sayısı</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Bekleyen Görevler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">5</div>
                <p className="text-xs text-gray-500 mt-1">Yapılacak işlemler</p>
              </CardContent>
            </Card>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-orange-600" />
                  Bugünkü Görevlerim
                </CardTitle>
                <CardDescription>
                  Tamamlanması gereken işlemler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Yeni işe giriş evrakları</p>
                      <p className="text-xs text-gray-500">3 personel için</p>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      Öncelikli
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">İzin belgesi hazırlama</p>
                      <p className="text-xs text-gray-500">5 talep için</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Normal
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Performans formları</p>
                      <p className="text-xs text-gray-500">2. çeyrek değerlendirme</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Tamamlandı
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  Son İşlemlerim
                </CardTitle>
                <CardDescription>
                  Gerçekleştirdiğim son aktiviteler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity: any) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-orange-600" />
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
                Sık kullanılan İK uzmanı işlemleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/hr-specialist/employees">
                  <Button className="w-full h-20 flex flex-col gap-2 bg-orange-600 hover:bg-orange-700">
                    <Users className="w-6 h-6" />
                    <span className="text-sm">Çalışan Kaydı</span>
                  </Button>
                </Link>
                <Link href="/hr-specialist/leaves">
                  <Button className="w-full h-20 flex flex-col gap-2 bg-orange-600 hover:bg-orange-700">
                    <Calendar className="w-6 h-6" />
                    <span className="text-sm">İzin İşle</span>
                  </Button>
                </Link>
                <Link href="/hr-specialist/documents">
                  <Button className="w-full h-20 flex flex-col gap-2 bg-orange-600 hover:bg-orange-700">
                    <FileText className="w-6 h-6" />
                    <span className="text-sm">Belge Hazırla</span>
                  </Button>
                </Link>
                <Link href="/hr-specialist/trainings">
                  <Button className="w-full h-20 flex flex-col gap-2 bg-orange-600 hover:bg-orange-700">
                    <BookOpen className="w-6 h-6" />
                    <span className="text-sm">Eğitim Kayıt</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-orange-600" />
                İşlenmesi Gereken Talepler
              </CardTitle>
              <CardDescription>
                İK uzmanı işlemi gereken talepler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {processingLeaves.length > 0 ? (
                  processingLeaves.slice(0, 3).map((leave: any) => (
                    <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Çalışan #{leave.employeeId}</p>
                        <p className="text-xs text-gray-500">{leave.leaveType} - {leave.days} gün</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          İşle
                        </Button>
                        <Button size="sm" variant="outline">
                          Detay
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">İşlenecek talep yok</p>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}