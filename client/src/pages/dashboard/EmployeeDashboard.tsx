import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
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
  User,
  LogOut
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Çalışan Sidebar Navigation
const sidebarItems = [
  { icon: Home, label: "Ana Sayfa", path: "/employee" },
  { icon: User, label: "Profilim", path: "/employee/profile" },
  { icon: Calendar, label: "İzin Talepleri", path: "/employee/leaves" },
  { icon: TrendingUp, label: "Performansım", path: "/employee/performance" },
  { icon: BookOpen, label: "Eğitimlerim", path: "/employee/trainings" },
  { icon: ClipboardList, label: "Görevlerim", path: "/employee/tasks" },
  { icon: FileText, label: "Belgelerim", path: "/employee/documents" },
  { icon: Bell, label: "Bildirimler", path: "/employee/notifications" },
  { icon: Settings, label: "Ayarlar", path: "/employee/settings" },
];

export default function EmployeeDashboard() {
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

  const myLeaves = pendingLeaves?.filter(leave => leave.status === "pending") || [];
  const recentNotifications = notifications?.slice(0, 5) || [];
  const recentActivities = activities?.slice(0, 5) || [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Green tema Çalışan için */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-emerald-600 to-emerald-800 text-white transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-emerald-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg">Çalışan</h1>
                <p className="text-xs text-emerald-200">Kişisel Panel</p>
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
                      ? "bg-white text-emerald-800 shadow-sm" 
                      : "text-white hover:bg-emerald-700 hover:text-white"
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
        <div className="p-4 border-t border-emerald-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-emerald-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-800" />
            </div>
            {sidebarOpen && (
              <div className="text-sm">
                <p className="font-medium">Çalışan</p>
                <p className="text-emerald-200 text-xs">employee@techcorp.com</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white hover:bg-emerald-700"
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
              <h2 className="text-2xl font-bold text-gray-900">Çalışan Dashboard</h2>
              <p className="text-gray-600">Kişisel çalışan paneli</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <User className="w-4 h-4" />
              </Button>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                Çalışan
              </Badge>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Kalan İzin Hakkım</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">18</div>
                <p className="text-xs text-gray-500 mt-1">Bu yıl kullanabileceğim</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tamamlanan Eğitimler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">7</div>
                <p className="text-xs text-gray-500 mt-1">Bu yıl aldığım eğitimler</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Performans Puanım</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">4.2/5</div>
                <p className="text-xs text-gray-500 mt-1">Son değerlendirme</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Çalıştığım Günler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">245</div>
                <p className="text-xs text-gray-500 mt-1">Bu yıl toplam</p>
              </CardContent>
            </Card>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Leave Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  İzin Taleplerim
                </CardTitle>
                <CardDescription>
                  Gönderdiğim izin talepleri ve durumları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Yıllık İzin</p>
                      <p className="text-xs text-gray-500">5 gün - 15-19 Haziran</p>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Beklemede
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Hastalık İzni</p>
                      <p className="text-xs text-gray-500">2 gün - 10-11 Haziran</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Onaylandı
                    </Badge>
                  </div>
                  <div className="text-center mt-4">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Yeni İzin Talebi
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Training Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  Eğitim Durumum
                </CardTitle>
                <CardDescription>
                  Katıldığım ve devam eden eğitimler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">React Gelişmiş Konular</p>
                      <p className="text-xs text-gray-500">%75 tamamlandı</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Devam ediyor
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">TypeScript Temelleri</p>
                      <p className="text-xs text-gray-500">Tamamlandı</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Sertifikalı
                    </Badge>
                  </div>
                  <div className="text-center mt-4">
                    <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                      Eğitim Kataloğu
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
              <CardDescription>
                Sık kullanılan çalışan işlemleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/employee/leaves">
                  <Button className="w-full h-20 flex flex-col gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <Calendar className="w-6 h-6" />
                    <span className="text-sm">İzin Talep Et</span>
                  </Button>
                </Link>
                <Link href="/employee/performance">
                  <Button className="w-full h-20 flex flex-col gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <TrendingUp className="w-6 h-6" />
                    <span className="text-sm">Performansım</span>
                  </Button>
                </Link>
                <Link href="/employee/trainings">
                  <Button className="w-full h-20 flex flex-col gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <BookOpen className="w-6 h-6" />
                    <span className="text-sm">Eğitimlerim</span>
                  </Button>
                </Link>
                <Link href="/employee/documents">
                  <Button className="w-full h-20 flex flex-col gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <FileText className="w-6 h-6" />
                    <span className="text-sm">Belgelerim</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Personal Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Kişisel Özet
              </CardTitle>
              <CardDescription>
                Çalışan profil bilgileri ve durum
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">Yazılım Geliştirme</div>
                  <div className="text-sm text-gray-600">Departmanım</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">Senior Developer</div>
                  <div className="text-sm text-gray-600">Pozisyonum</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">3.5 Yıl</div>
                  <div className="text-sm text-gray-600">Şirketteki Sürem</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}