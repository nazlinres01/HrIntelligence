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
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 h-screen fixed left-0 top-0 transition-all duration-300 z-50 shadow-lg`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">İK Müdürü</h1>
              <p className="text-gray-600 text-sm">Yönetim Paneli</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-gray-600 hover:bg-gray-100"
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
                  ? 'bg-gray-100 text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
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
          <div className="px-8 py-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">İK Yönetim Merkezi</h1>
                  <p className="text-gray-600">Organizasyonel insan kaynakları yönetimi ve stratejik planlama</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Settings className="h-4 w-4 mr-2" />
                    İK Ayarları
                  </Button>
                  <Button variant="lightgray" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Bildirimler
                    <Badge variant="destructive" className="ml-2">3</Badge>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>156 Aktif Çalışan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>%87 Performans Ortalaması</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>8 Bekleyen Onay</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Toplam Çalışan</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                    <p className="text-xs text-gray-500 mt-1">+12 bu ay</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Bekleyen İzinler</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                    <p className="text-xs text-gray-500 mt-1">İnceleme gereken</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Aktif Eğitimler</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-xs text-gray-500 mt-1">Devam eden</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Performans Ort.</p>
                    <p className="text-2xl font-bold text-gray-900">87%</p>
                    <p className="text-xs text-gray-500 mt-1">Bu ay ortalama</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
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
                <Button className="w-full justify-start bg-gray-600 hover:bg-gray-700 text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Yeni Çalışan Ekle
                </Button>
                <Button className="w-full justify-start bg-gray-600 hover:bg-gray-700 text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  İzin Talepleri
                </Button>
                <Button className="w-full justify-start bg-gray-600 hover:bg-gray-700 text-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Eğitim Programı Oluştur
                </Button>
                <Button className="w-full justify-start bg-gray-600 hover:bg-gray-700 text-white">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Performans Raporu
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-600" />
                  Son Aktiviteler
                </CardTitle>
                <CardDescription>Sistem üzerindeki son hareketler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
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