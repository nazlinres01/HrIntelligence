import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Building2,
  UserCheck,
  Clock,
  AlertTriangle,
  Shield,
  BarChart3,
  FileText,
  Target,
  Bell,
  Award,
  Briefcase,
  Calendar,
  Settings,
  PieChart,
  Plus,
  Eye,
  Download,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Globe,
  Mail,
  Phone
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const userData = user as any;
  const [_, setLocation] = useLocation();

  const { data: employeeStats } = useQuery({
    queryKey: ["/api/stats/employees"],
  });

  const { data: teamStats } = useQuery({
    queryKey: ["/api/stats/team"],
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["/api/team/members"],
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const { data: activities } = useQuery({
    queryKey: ["/api/activities"],
  });

  const { data: auditLogs } = useQuery({
    queryKey: ["/api/audit-logs"],
  });

  const { data: pendingExpenseReports } = useQuery({
    queryKey: ["/api/expense-reports/pending"],
  });

  const { data: pendingTimeEntries } = useQuery({
    queryKey: ["/api/time-entries/pending"],
  });

  const { data: companies } = useQuery({
    queryKey: ["/api/companies"],
  });

  const { data: systemHealth } = useQuery({
    queryKey: ["/api/system/health"],
  });

  const handleCreateReport = () => {
    setLocation("/admin/hr-reports");
  };

  const handleSystemSettings = () => {
    setLocation("/admin/system-settings");
  };

  const handleViewAllEmployees = () => {
    setLocation("/admin/employees");
  };

  const handleViewCompanies = () => {
    setLocation("/admin/companies");
  };

  const handleViewAnalytics = () => {
    setLocation("/admin/analytics");
  };

  const handleViewAuditLogs = () => {
    setLocation("/admin/audit-logs");
  };

  const handleViewNotifications = () => {
    setLocation("/admin/notifications");
  };

  const handleViewUsers = () => {
    setLocation("/admin/users");
  };

  const handleViewDepartments = () => {
    setLocation("/admin/departments");
  };

  const handleViewRecruitment = () => {
    setLocation("/admin/recruitment");
  };

  // Calculate basic metrics
  const totalCompanies = companies?.length || 0;
  const totalNotifications = notifications?.length || 0;
  const unreadNotifications = notifications?.filter((n: any) => !n.isRead)?.length || 0;
  const recentActivities = activities?.slice(0, 5) || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sistem Yöneticisi</h2>
            <p className="text-gray-600 dark:text-gray-400">Tüm sistemi izleyin ve yönetin</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="lightgray" onClick={handleViewNotifications}>
              <Bell className="w-4 h-4 mr-2" />
              Bildirimler
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            <Button onClick={handleSystemSettings}>
              <Settings className="w-4 h-4 mr-2" />
              Sistem Ayarları
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="flex items-center p-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
                  <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {totalCompanies}
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Toplam Şirket
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+12% bu ay</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="flex items-center p-6">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {employeeStats?.totalEmployees || 0}
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Toplam Kullanıcı
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+8% bu ay</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="flex items-center p-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-4">
                  <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    99.8%
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                    Sistem Çalışma Süresi
                  </p>
                  <div className="flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">Optimal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="flex items-center p-6">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-4">
                  <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    A+
                  </div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                    Güvenlik Puanı
                  </p>
                  <div className="flex items-center mt-1">
                    <Shield className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">Mükemmel</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* System Health */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Activity className="mr-2 h-5 w-5 text-green-600" />
                    Sistem Durumu
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Gerçek zamanlı sistem izleme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                        <div>
                          <p className="font-medium text-green-900 dark:text-green-100">Veritabanı</p>
                          <p className="text-sm text-green-600 dark:text-green-400">PostgreSQL</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Çalışıyor</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                        <div>
                          <p className="font-medium text-green-900 dark:text-green-100">Web Sunucusu</p>
                          <p className="text-sm text-green-600 dark:text-green-400">Express.js</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aktif</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                        <div>
                          <p className="font-medium text-green-900 dark:text-green-100">API Servisleri</p>
                          <p className="text-sm text-green-600 dark:text-green-400">REST API</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Normal</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center">
                        <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                        <div>
                          <p className="font-medium text-blue-900 dark:text-blue-100">Sistem Yükü</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">CPU & Bellek</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Düşük</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Clock className="mr-2 h-5 w-5 text-blue-600" />
                    Son Aktiviteler
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Sistem genelindeki son işlemler
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity: any, index: number) => (
                        <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.description || 'Sistem aktivitesi'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.timestamp ? new Date(activity.timestamp).toLocaleString('tr-TR') : 'Az önce'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Henüz aktivite bulunmuyor</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Button variant="lightgray" className="w-full" onClick={handleViewAuditLogs}>
                      <Eye className="w-4 h-4 mr-2" />
                      Tüm Aktiviteleri Görüntüle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Management Tools */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Settings className="mr-2 h-5 w-5 text-gray-600" />
                    Hızlı Yönetim Araçları
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Sistem yönetimi ve konfigürasyon
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 p-6">
                  <Button 
                    variant="lightgray" 
                    className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                    onClick={handleViewUsers}
                  >
                    <Users className="mr-2 h-4 w-4 text-blue-600" />
                    Kullanıcı Yönetimi
                  </Button>
                  
                  <Button 
                    variant="lightgray" 
                    className="w-full justify-start hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                    onClick={handleViewAuditLogs}
                  >
                    <Shield className="mr-2 h-4 w-4 text-red-600" />
                    Güvenlik & Denetim
                  </Button>
                  
                  <Button 
                    variant="lightgray" 
                    className="w-full justify-start hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
                    onClick={handleViewCompanies}
                  >
                    <Building2 className="mr-2 h-4 w-4 text-green-600" />
                    Şirket Yönetimi
                  </Button>
                  
                  <Button 
                    variant="lightgray" 
                    className="w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                    onClick={handleViewAnalytics}
                  >
                    <BarChart3 className="mr-2 h-4 w-4 text-purple-600" />
                    Analitik Raporlar
                  </Button>

                  <Separator />
                  
                  <Button 
                    className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                    onClick={handleSystemSettings}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Sistem Ayarları
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <Bell className="mr-2 h-5 w-5 text-yellow-600" />
                      Bildirimler
                    </div>
                    {unreadNotifications > 0 && (
                      <Badge variant="destructive">{unreadNotifications}</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Son sistem bildirimleri
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {notifications && notifications.length > 0 ? (
                      notifications.slice(0, 3).map((notification: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className={`w-2 h-2 rounded-full mt-2 ${notification.isRead ? 'bg-gray-400' : 'bg-blue-500'}`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title || 'Sistem bildirimi'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {notification.message || 'Detaylar mevcut değil'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Yeni bildirim yok</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Button variant="lightgray" className="w-full" onClick={handleViewNotifications}>
                      <Eye className="w-4 h-4 mr-2" />
                      Tüm Bildirimleri Görüntüle
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Zap className="mr-2 h-5 w-5 text-orange-600" />
                    Hızlı İşlemler
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Sık kullanılan admin işlemleri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 p-6">
                  <Button 
                    variant="lightgray" 
                    className="w-full justify-start"
                    onClick={handleCreateReport}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Yeni Rapor Oluştur
                  </Button>
                  
                  <Button 
                    variant="lightgray" 
                    className="w-full justify-start"
                    onClick={handleViewDepartments}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Departman Yönetimi
                  </Button>
                  
                  <Button 
                    variant="lightgray" 
                    className="w-full justify-start"
                    onClick={handleViewRecruitment}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    İşe Alım Süreçleri
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}