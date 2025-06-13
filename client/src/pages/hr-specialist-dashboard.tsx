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
  Settings, 
  Bell,
  Home,
  UserCheck,
  Clock,
  FileText,
  UserPlus,
  CheckCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [location, setLocation] = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/hr-specialist" },
    { icon: UserPlus, label: "Çalışan İşlemleri", path: "/hr-specialist/employees" },
    { icon: Calendar, label: "İzin İşlemleri", path: "/hr-specialist/leaves" },
    { icon: BarChart3, label: "Performans Takibi", path: "/hr-specialist/performance" },
    { icon: BookOpen, label: "Eğitim Desteği", path: "/hr-specialist/trainings" },
    { icon: ClipboardList, label: "Döküman Yönetimi", path: "/hr-specialist/documents" },
    { icon: FileText, label: "Rapor Hazırlama", path: "/hr-specialist/reports" },
    { icon: Settings, label: "Ayarlar", path: "/hr-specialist/settings" },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-orange-500 to-orange-700 text-white h-screen fixed left-0 top-0 transition-all duration-300 z-50 shadow-2xl`}>
      {/* Header */}
      <div className="p-4 border-b border-orange-400/30">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">İK Uzmanı</h1>
              <p className="text-green-200 text-sm">Operasyonel Panel</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-white hover:bg-green-700/50"
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
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'text-orange-100 hover:bg-orange-600/50 hover:text-white'
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
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-orange-400/30">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-orange-500 text-white">İU</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">İK Uzmanı</p>
              <p className="text-xs text-green-200 truncate">specialist@company.com</p>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-green-200 hover:bg-green-700/50 hover:text-white"
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Ayarlar</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/api/logout'}
            className="text-green-200 hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HRSpecialistDashboard() {
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
                <h1 className="text-2xl font-bold text-gray-900">İK Uzmanı Dashboard</h1>
                <p className="text-gray-600">Hoş geldiniz, {user?.firstName || 'İK Uzmanı'}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Bildirimler
                  <Badge variant="destructive" className="ml-2">5</Badge>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Güncel İzin Talepleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">15</div>
                <div className="text-sm text-gray-500">İşlenmeli</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Yeni Başvurular</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">7</div>
                <div className="text-sm text-gray-500">Bu hafta</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tamamlanan Eğitimler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">24</div>
                <div className="text-sm text-gray-500">Bu ay</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Bekleyen Görevler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">11</div>
                <div className="text-sm text-gray-500">Yüksek öncelik</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Hızlı İşlemler
                </CardTitle>
                <CardDescription>Günlük operasyonel görevler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100">
                  <Calendar className="h-4 w-4 mr-2" />
                  İzin Onaylama
                </Button>
                <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Yeni Çalışan Kaydı
                </Button>
                <Button className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100">
                  <FileText className="h-4 w-4 mr-2" />
                  Döküman Hazırlama
                </Button>
                <Button className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Performans Girişi
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />
                  Günün Görevleri
                </CardTitle>
                <CardDescription>Bugün tamamlanması gereken işler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">İzin onayları (5 adet)</p>
                    <p className="text-xs text-gray-500">Bugün son</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Yeni çalışan özlük dosyası</p>
                    <p className="text-xs text-gray-500">Yarın teslim</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Eğitim katılım raporu</p>
                    <p className="text-xs text-gray-500">Bu hafta</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-green-600" />
                Devam Eden İşlemler
              </CardTitle>
              <CardDescription>Aktif olarak takip edilen süreçler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-gray-600">İzin Onay Süreçleri</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">İşe Alım Süreçleri</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <div className="text-sm text-gray-600">Eğitim Koordinasyonu</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}