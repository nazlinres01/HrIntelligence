import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  TrendingUp, 
  FileText, 
  Bell,
  UserCheck,
  ClipboardList,
  Award,
  BookOpen,
  BarChart3,
  Clock,
  CreditCard,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function EmployeeDashboard() {
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

  const myLeaves = pendingLeaves?.filter((leave: any) => leave.status === "pending") || [];
  const recentNotifications = notifications?.slice(0, 5) || [];
  const recentActivities = activities?.slice(0, 5) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Çalışan Dashboard</h1>
          <p className="text-gray-600">Kişisel çalışan paneli ve günlük aktiviteler</p>
        </div>
        <Badge className="bg-yellow-100 text-yellow-800">
          Çalışan
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardDescription>Bekleyen İzin</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{myLeaves.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-gray-600">Onay bekliyor</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardDescription>Bu Ay Mesai</CardDescription>
            <CardTitle className="text-2xl text-blue-600">168h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Hedef: 160h</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardDescription>Performans</CardDescription>
            <CardTitle className="text-2xl text-green-600">4.2/5.0</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Son değerlendirme</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardDescription>Tamamlanan Eğitim</CardDescription>
            <CardTitle className="text-2xl text-purple-600">3</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-600">Bu çeyrek</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
          <CardDescription>Sık kullanılan işlemleriniz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/my-leaves">
              <Button variant="lightgray" className="w-full h-20 flex-col gap-2 hover:bg-yellow-50">
                <Calendar className="w-6 h-6 text-yellow-600" />
                <span className="text-sm">İzin Talebi</span>
              </Button>
            </Link>
            <Link href="/timesheet">
              <Button variant="lightgray" className="w-full h-20 flex-col gap-2 hover:bg-blue-50">
                <Clock className="w-6 h-6 text-blue-600" />
                <span className="text-sm">Mesai Kaydı</span>
              </Button>
            </Link>
            <Link href="/expenses">
              <Button variant="lightgray" className="w-full h-20 flex-col gap-2 hover:bg-green-50">
                <CreditCard className="w-6 h-6 text-green-600" />
                <span className="text-sm">Harcama</span>
              </Button>
            </Link>
            <Link href="/messages">
              <Button variant="lightgray" className="w-full h-20 flex-col gap-2 hover:bg-purple-50">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                <span className="text-sm">Mesajlar</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Son Bildirimler
              </CardTitle>
              <CardDescription>Size özel duyurular ve güncellemeler</CardDescription>
            </div>
            <Link href="/announcements">
              <Button variant="ghost" size="sm">
                Tümü <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.length > 0 ? (
                recentNotifications.map((notification: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Yeni bildirim yok</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Son Aktiviteler
              </CardTitle>
              <CardDescription>Sistem üzerindeki son hareketleriniz</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.timestamp}</p>
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

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Performans Özeti
              </CardTitle>
              <CardDescription>Bu ay ki başarılarınız ve gelişim alanlarınız</CardDescription>
            </div>
            <Link href="/my-performance">
              <Button variant="lightgray" size="sm">
                Detaylar <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Genel Performans</h4>
              <p className="text-2xl font-bold text-yellow-600 mt-1">4.2/5.0</p>
              <p className="text-sm text-gray-600">Mükemmel seviye</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ClipboardList className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Tamamlanan Görevler</h4>
              <p className="text-2xl font-bold text-blue-600 mt-1">23/25</p>
              <p className="text-sm text-gray-600">Bu ay</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Takım Değerlendirmesi</h4>
              <p className="text-2xl font-bold text-green-600 mt-1">4.8/5.0</p>
              <p className="text-sm text-gray-600">Mükemmel işbirliği</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}