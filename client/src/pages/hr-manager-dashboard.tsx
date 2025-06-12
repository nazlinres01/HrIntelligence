import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Calendar, 
  BarChart3, 
  BookOpen, 
  Briefcase, 
  Settings, 
  Bell,
  Home,
  UserCheck,
  Clock,
  FileText,
  DollarSign,
  Target,
  Award,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [location, setLocation] = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/hr-manager" },
    { icon: Users, label: "Çalışan Yönetimi", path: "/hr-manager/employees" },
    { icon: Calendar, label: "İzin Yönetimi", path: "/hr-manager/leaves" },
    { icon: BarChart3, label: "Performans", path: "/hr-manager/performance" },
    { icon: BookOpen, label: "Eğitim Programları", path: "/hr-manager/trainings" },
    { icon: Briefcase, label: "İş İlanları", path: "/hr-manager/jobs" },
    { icon: DollarSign, label: "Bordro Yönetimi", path: "/hr-manager/payroll" },
    { icon: FileText, label: "Raporlar", path: "/hr-manager/reports" },
    { icon: Settings, label: "Ayarlar", path: "/hr-manager/settings" },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-blue-600 to-blue-800 text-white h-screen fixed left-0 top-0 transition-all duration-300 z-50 shadow-2xl`}>
      {/* Header */}
      <div className="p-4 border-b border-blue-500/30">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">İK Müdürü</h1>
              <p className="text-blue-200 text-sm">Yönetim Paneli</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-white hover:bg-blue-700/50"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex items-center px-3 py-3 mb-1 rounded-lg transition-all cursor-pointer group ${
                isActive 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
              }`}>
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-500/30">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-blue-500 text-white">İM</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">İK Müdürü</p>
              <p className="text-xs text-blue-200 truncate">manager@company.com</p>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-blue-200 hover:bg-blue-700/50 hover:text-white"
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Ayarlar</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/api/logout'}
            className="text-blue-200 hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HRManagerDashboard() {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <div className={`${isSidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">İK Müdürü Dashboard</h1>
                <p className="text-gray-600">Hoş geldiniz, {user?.firstName || 'İK Müdürü'}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Bildirimler
                  <Badge variant="destructive" className="ml-2">3</Badge>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Toplam Çalışan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">156</div>
                <div className="text-sm opacity-80">+12 bu ay</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Onay Bekleyen İzinler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <div className="text-sm opacity-80">İnceleme gereken</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Aktif Eğitimler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <div className="text-sm opacity-80">Devam eden</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Bu Ay Performans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.2</div>
                <div className="text-sm opacity-80">Ortalama puan</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
                  Hızlı İşlemler
                </CardTitle>
                <CardDescription>Sık kullanılan işlemler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100">
                  <Users className="h-4 w-4 mr-2" />
                  Yeni Çalışan Ekle
                </Button>
                <Button className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100">
                  <Calendar className="h-4 w-4 mr-2" />
                  İzin Talepleri
                </Button>
                <Button className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Eğitim Programı Oluştur
                </Button>
                <Button className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Performans Raporu
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />
                  Son Aktiviteler
                </CardTitle>
                <CardDescription>Sistem üzerindeki son hareketler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Ahmet Yılmaz izin talebini gönderdi</p>
                    <p className="text-xs text-gray-500">2 saat önce</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">React Eğitimi tamamlandı</p>
                    <p className="text-xs text-gray-500">4 saat önce</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Yeni performans değerlendirmesi</p>
                    <p className="text-xs text-gray-500">1 gün önce</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Departman Genel Bakış
              </CardTitle>
              <CardDescription>Tüm departmanların durumu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">45</div>
                  <div className="text-sm text-gray-600">Yazılım Geliştirme</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">32</div>
                  <div className="text-sm text-gray-600">Pazarlama</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">28</div>
                  <div className="text-sm text-gray-600">Satış</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}