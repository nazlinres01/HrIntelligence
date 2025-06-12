import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  BarChart3, 
  BookOpen, 
  Settings, 
  Bell,
  Home,
  Clock,
  FileText,
  User,
  MessageCircle,
  CheckCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [location, setLocation] = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/employee" },
    { icon: User, label: "Profilim", path: "/employee/profile" },
    { icon: Calendar, label: "İzin Talepleri", path: "/employee/leaves" },
    { icon: BarChart3, label: "Performansım", path: "/employee/performance" },
    { icon: BookOpen, label: "Eğitimlerim", path: "/employee/trainings" },
    { icon: Clock, label: "Mesai Takibi", path: "/employee/timesheet" },
    { icon: FileText, label: "Belgelerim", path: "/employee/documents" },
    { icon: MessageCircle, label: "Mesajlar", path: "/employee/messages" },
    { icon: Settings, label: "Ayarlar", path: "/employee/settings" },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-emerald-600 to-emerald-800 text-white h-screen fixed left-0 top-0 transition-all duration-300 z-50 shadow-2xl`}>
      {/* Header */}
      <div className="p-4 border-b border-emerald-500/30">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">Çalışan Paneli</h1>
              <p className="text-emerald-200 text-sm">Kişisel Dashboard</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-white hover:bg-emerald-700/50"
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
                  ? 'bg-emerald-500 text-white shadow-lg' 
                  : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white'
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
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-500/30">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-emerald-500 text-white">ÇL</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Çalışan</p>
              <p className="text-xs text-emerald-200 truncate">employee@company.com</p>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-emerald-200 hover:bg-emerald-700/50 hover:text-white"
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Ayarlar</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/api/logout'}
            className="text-emerald-200 hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeDashboard() {
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
                <h1 className="text-2xl font-bold text-gray-900">Kişisel Dashboard</h1>
                <p className="text-gray-600">Hoş geldiniz, {user?.firstName || 'Çalışan'}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Bildirimler
                  <Badge variant="destructive" className="ml-2">2</Badge>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Kalan İzin Günü</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">18</div>
                <div className="text-sm opacity-80">Bu yıl</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Tamamlanan Eğitimler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <div className="text-sm opacity-80">Bu yıl</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Performans Puanı</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.2</div>
                <div className="text-sm opacity-80">5 üzerinden</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Çalışma Günü</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">245</div>
                <div className="text-sm opacity-80">Bu yıl</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-emerald-600" />
                  Hızlı İşlemler
                </CardTitle>
                <CardDescription>Sık kullanılan işlemler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                  <Calendar className="h-4 w-4 mr-2" />
                  İzin Talep Et
                </Button>
                <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100">
                  <Clock className="h-4 w-4 mr-2" />
                  Mesai Giriş/Çıkış
                </Button>
                <Button className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Eğitim Başvurusu
                </Button>
                <Button className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100">
                  <FileText className="h-4 w-4 mr-2" />
                  Belge Talebi
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-emerald-600" />
                  Son Aktivitelerim
                </CardTitle>
                <CardDescription>Kişisel işlem geçmişi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">İzin talebim onaylandı</p>
                    <p className="text-xs text-gray-500">2 gün önce</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">React eğitimini tamamladım</p>
                    <p className="text-xs text-gray-500">1 hafta önce</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Performans değerlendirmesi yapıldı</p>
                    <p className="text-xs text-gray-500">2 hafta önce</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personal Info & Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-emerald-600" />
                Kişisel Bilgiler & Durum
              </CardTitle>
              <CardDescription>Çalışan profil özeti</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">Yazılım Geliştirme</div>
                  <div className="text-sm text-gray-600">Departman</div>
                  <div className="text-xs text-gray-500 mt-1">Senior Developer</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3.5 Yıl</div>
                  <div className="text-sm text-gray-600">Şirkette Çalışma</div>
                  <div className="text-xs text-gray-500 mt-1">01/2021'den beri</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">Aktif</div>
                  <div className="text-sm text-gray-600">Çalışma Durumu</div>
                  <div className="text-xs text-gray-500 mt-1">Tam zamanlı</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}