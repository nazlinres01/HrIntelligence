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
  Target, 
  Settings, 
  Bell,
  Home,
  UserCheck,
  Clock,
  TrendingUp,
  Award,
  CheckCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  UserPlus
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [location, setLocation] = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dept-manager" },
    { icon: Users, label: "Ekip Yönetimi", path: "/dept-manager/team" },
    { icon: Calendar, label: "İzin Onayları", path: "/dept-manager/leaves" },
    { icon: BarChart3, label: "Performans Takibi", path: "/dept-manager/performance" },
    { icon: Target, label: "Hedefler", path: "/dept-manager/goals" },
    { icon: Award, label: "Değerlendirmeler", path: "/dept-manager/evaluations" },
    { icon: FileText, label: "Raporlar", path: "/dept-manager/reports" },
    { icon: TrendingUp, label: "Analitik", path: "/dept-manager/analytics" },
    { icon: Settings, label: "Ayarlar", path: "/dept-manager/settings" },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-orange-600 to-orange-800 text-white h-screen fixed left-0 top-0 transition-all duration-300 z-50 shadow-2xl`}>
      {/* Header */}
      <div className="p-4 border-b border-orange-500/30">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">Departman Müdürü</h1>
              <p className="text-orange-200 text-sm">Takım Yönetimi</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-white hover:bg-orange-700/50"
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
                  : 'text-orange-100 hover:bg-orange-700/50 hover:text-white'
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
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-orange-500/30">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-orange-500 text-white">DM</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Departman Müdürü</p>
              <p className="text-xs text-orange-200 truncate">manager@department.com</p>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-orange-200 hover:bg-orange-700/50 hover:text-white"
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Ayarlar</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/api/logout'}
            className="text-orange-200 hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DepartmentManagerDashboard() {
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
                <h1 className="text-2xl font-bold text-gray-900">Departman Müdürü Dashboard</h1>
                <p className="text-gray-600">Hoş geldiniz, {user?.firstName || 'Departman Müdürü'}</p>
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
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Takım Üyesi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">28</div>
                <div className="text-sm opacity-80">Aktif çalışan</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Bekleyen İzinler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm opacity-80">Onay bekleyen</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Departman Performansı</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.3</div>
                <div className="text-sm opacity-80">5 üzerinden</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Hedef Tamamlama</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">85%</div>
                <div className="text-sm opacity-80">Bu çeyrek</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-orange-600" />
                  Hızlı İşlemler
                </CardTitle>
                <CardDescription>Takım yönetimi işlemleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100">
                  <Calendar className="h-4 w-4 mr-2" />
                  İzin Onaylama
                </Button>
                <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Performans Değerlendirmesi
                </Button>
                <Button className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100">
                  <Target className="h-4 w-4 mr-2" />
                  Hedef Belirleme
                </Button>
                <Button className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100">
                  <Award className="h-4 w-4 mr-2" />
                  Takdir & Ödül
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  Dikkat Gereken Konular
                </CardTitle>
                <CardDescription>Öncelikli takım konuları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">5 izin talebi onay bekliyor</p>
                    <p className="text-xs text-gray-500">Bugün karar verilmeli</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Çeyrek performans değerlendirmeleri</p>
                    <p className="text-xs text-gray-500">Bu hafta tamamlanmalı</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Yeni proje kickoff toplantısı</p>
                    <p className="text-xs text-gray-500">Yarın 14:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
                Takım Performans Özeti
              </CardTitle>
              <CardDescription>Departman bazlı durum değerlendirmesi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">92%</div>
                  <div className="text-sm text-gray-600">Genel Verimlilik</div>
                  <div className="text-xs text-gray-500 mt-1">+5% geçen aya göre</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">4.3</div>
                  <div className="text-sm text-gray-600">Ortalama Performans</div>
                  <div className="text-xs text-gray-500 mt-1">5 üzerinden değerlendirme</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">96%</div>
                  <div className="text-sm text-gray-600">Devam Oranı</div>
                  <div className="text-xs text-gray-500 mt-1">Departman ortalaması</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}