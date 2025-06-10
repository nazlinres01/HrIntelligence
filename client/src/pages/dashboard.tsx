import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { EnhancedStatsCards } from "@/components/dashboard/enhanced-stats-cards";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { LeaveCalendar } from "@/components/dashboard/leave-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, FileText, Megaphone, UserPlus, CalendarCheck, TrendingUp } from "lucide-react";
import { QUICK_ACTIONS } from "@/lib/constants";

export default function Dashboard() {
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities"],
  });

  const quickActions = [
    {
      title: "Toplu Maaş Güncelleme",
      icon: DollarSign,
      color: "bg-blue-50 hover:bg-blue-100 text-blue-700",
      iconColor: "text-blue-600"
    },
    {
      title: "Aylık Rapor Oluştur",
      icon: FileText,
      color: "bg-teal-50 hover:bg-teal-100 text-teal-700",
      iconColor: "text-teal-600"
    },
    {
      title: "Duyuru Gönder",
      icon: Megaphone,
      color: "bg-orange-50 hover:bg-orange-100 text-orange-700",
      iconColor: "text-orange-600"
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "error",
      title: "Bordro Hesaplama Hatası",
      description: "3 çalışan için maaş hesaplaması yapılamadı",
      color: "bg-red-50 border-red-200 text-red-800",
      iconColor: "text-red-500",
      icon: "fas fa-exclamation-triangle"
    },
    {
      id: 2,
      type: "warning",
      title: "Bekleyen İzin Talepleri",
      description: "7 adet izin talebi onay bekliyor",
      color: "bg-yellow-50 border-yellow-200 text-yellow-800", 
      iconColor: "text-yellow-500",
      icon: "fas fa-clock"
    },
    {
      id: 3,
      type: "info",
      title: "Sistem Güncellemesi",
      description: "Yeni özellikler mevcut, güncelleyin",
      color: "bg-blue-50 border-blue-200 text-blue-800",
      iconColor: "text-blue-500",
      icon: "fas fa-info-circle"
    }
  ];

  const recentActivities = [
    {
      type: "employee_added",
      message: "Yeni çalışan eklendi",
      employee: "Fatma Yıldız - Yazılım",
      timestamp: "2 saat önce",
      icon: UserPlus,
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      type: "leave_approved",
      message: "İzin talebi onaylandı",
      employee: "Ahmet Kaya - 3 günlük izin",
      timestamp: "5 saat önce",
      icon: CalendarCheck,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      type: "performance_reviewed",
      message: "Performans değerlendirmesi tamamlandı",
      employee: "Q3 2024 - Yazılım Departmanı",
      timestamp: "1 gün önce",
      icon: TrendingUp,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    }
  ];

  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        title="Dashboard" 
        subtitle="İnsan kaynakları genel görünümü"
      />
      
      <main className="flex-1 overflow-auto p-6">
        {/* Enhanced Stats Cards */}
        <EnhancedStatsCards />

        {/* Charts and Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PerformanceChart />
          <LeaveCalendar />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Actions Card */}
          <Card className="hr-stat-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`w-full justify-between p-3 h-auto ${action.color} transition-colors`}
                >
                  <div className="flex items-center">
                    <action.icon className={`mr-3 h-5 w-5 ${action.iconColor}`} />
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <ArrowRight className={`h-4 w-4 ${action.iconColor}`} />
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="hr-stat-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Son Aktiviteler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center mt-1`}>
                    <activity.icon className={`${activity.iconColor} h-4 w-4`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.employee}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-4 text-blue-600 hover:text-blue-700">
                Tüm Aktiviteleri Gör
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card className="hr-stat-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Sistem Uyarıları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 ${alert.color} border rounded-lg`}>
                  <div className="flex items-start">
                    <i className={`${alert.icon} ${alert.iconColor} mt-1 mr-3`}></i>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs mt-1">{alert.description}</p>
                      <button className="text-xs hover:underline font-medium mt-2">
                        {alert.type === "error" ? "Çöz" : alert.type === "warning" ? "İncele" : "Güncelle"} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
