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

export default function HRManagerDashboard() {
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

  const approvalPendingLeaves = pendingLeaves?.filter(leave => leave.status === "pending") || [];
  const recentNotifications = notifications?.slice(0, 5) || [];
  const recentActivities = activities?.slice(0, 5) || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">İK Müdürü Dashboard</h2>
            <p className="text-gray-600">İnsan Kaynakları yönetim paneli</p>
          </div>
          <div className="flex items-center gap-4">
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
          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-600" />
                Son Bildirimler
              </CardTitle>
              <CardDescription>
                Güncel sistem bildirimleri ve uyarılar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notification: any) => (
                    <div key={notification.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <Bell className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-500">{notification.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Henüz bildirim yok</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                Son Aktiviteler
              </CardTitle>
              <CardDescription>
                Sistem üzerindeki son işlemler
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
              <Link href="/employees">
                <Button className="w-full h-20 flex flex-col gap-2 bg-teal-600 hover:bg-teal-700">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Çalışan Yönetimi</span>
                </Button>
              </Link>
              <Link href="/leaves">
                <Button className="w-full h-20 flex flex-col gap-2 bg-teal-600 hover:bg-teal-700">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">İzin Yönetimi</span>
                </Button>
              </Link>
              <Link href="/performance">
                <Button className="w-full h-20 flex flex-col gap-2 bg-teal-600 hover:bg-teal-700">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-sm">Performans</span>
                </Button>
              </Link>
              <Link href="/reports">
                <Button className="w-full h-20 flex flex-col gap-2 bg-teal-600 hover:bg-teal-700">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">Raporlar</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* HR Management Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600" />
              İK Yönetim Özeti
            </CardTitle>
            <CardDescription>
              Genel İnsan Kaynakları durumu ve istatistikler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <div className="text-2xl font-bold text-teal-600">89%</div>
                <div className="text-sm text-gray-600">Çalışan Memnuniyeti</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-sm text-gray-600">İşe Devam Oranı</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">92%</div>
                <div className="text-sm text-gray-600">Eğitim Tamamlama</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}