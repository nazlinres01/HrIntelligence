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

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-gray-50 dark:bg-gray-900">
      {/* Microsoft Fluent Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Yönetici Paneli
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Şirket geneli performans ve yönetim özeti · Hoş geldiniz, {userData?.firstName} {userData?.lastName}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handleCreateReport}
            className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
          >
            <FileText className="mr-2 h-4 w-4" />
            Rapor Oluştur
          </Button>
          <Button 
            onClick={handleSystemSettings}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            <Settings className="mr-2 h-4 w-4" />
            Sistem Ayarları
          </Button>
        </div>
      </div>

      {/* Executive Summary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={handleViewAllEmployees}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Toplam Çalışan
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {(employeeStats as any)?.totalEmployees || 247}
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              +{(teamMembers as any)?.length || 12} aktif üye
            </p>
          </CardContent>
        </Card>

        <Card 
          className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={handleViewAnalytics}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Aylık Gelir
            </CardTitle>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              ₺2.4M
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              +8.2% geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card 
          className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900 hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={handleViewAnalytics}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ortalama Performans
            </CardTitle>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              87.4%
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              Hedefin üzerinde
            </p>
          </CardContent>
        </Card>

        <Card 
          className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900 hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={handleViewNotifications}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bekleyen Onaylar
            </CardTitle>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {((pendingTimeEntries as any)?.length || 0) + ((pendingExpenseReports as any)?.length || 0)}
            </div>
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
              İnceleme bekliyor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <Card 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer border-blue-200 dark:border-blue-800"
          onClick={handleViewUsers}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Kullanıcılar</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Yönetim</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer border-green-200 dark:border-green-800"
          onClick={handleViewCompanies}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Şirketler</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Yönetim</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer border-purple-200 dark:border-purple-800"
          onClick={handleViewDepartments}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Departmanlar</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Organizasyon</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer border-orange-200 dark:border-orange-800"
          onClick={handleViewRecruitment}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <Briefcase className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">İşe Alım</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Süreçler</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer border-teal-200 dark:border-teal-800"
          onClick={handleViewAnalytics}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-full">
              <BarChart3 className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Analytics</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Raporlar</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer border-red-200 dark:border-red-800"
          onClick={handleViewAuditLogs}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Güvenlik</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Denetim</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Company Performance */}
        <Card className="md:col-span-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                  Şirket Performans Özeti
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Departmanlar arası performans karşılaştırması
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewAnalytics}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300"
              >
                <Eye className="mr-2 h-4 w-4" />
                Detay
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">İnsan Kaynakları</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">94%</Badge>
                </div>
                <Progress value={94} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Teknoloji</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">91%</Badge>
                </div>
                <Progress value={91} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Satış</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">88%</Badge>
                </div>
                <Progress value={88} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Pazarlama</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">85%</Badge>
                </div>
                <Progress value={85} className="h-3" />
              </div>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-700" />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">97%</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Çalışan Memnuniyeti</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">4.2</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ortalama Rating</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">92%</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">İşe Devam Oranı</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Actions */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
              Acil Eylemler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800 dark:text-red-200">Bordro Onayı</h4>
                <p className="text-sm text-red-600 dark:text-red-300">3 departman beklemede</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <Clock className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <h4 className="font-medium text-orange-800 dark:text-orange-200">İzin Talepleri</h4>
                <p className="text-sm text-orange-600 dark:text-orange-300">8 bekleyen talep</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <Shield className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Güvenlik Uyarısı</h4>
                <p className="text-sm text-yellow-600 dark:text-yellow-300">Sistem güncellemesi</p>
              </div>
            </div>

            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleViewNotifications}
            >
              Tüm Uyarıları Görüntüle
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Team Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent System Activity */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Activity className="mr-2 h-5 w-5 text-gray-600" />
                  Son Aktiviteler
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Sistem olayları ve güncellemeleri
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewAuditLogs}
                className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              >
                <Eye className="mr-2 h-4 w-4" />
                Tümü
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {(activities as any)?.slice(0, 4).map((activity: any, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'employee_added' ? 'bg-green-500' :
                    activity.type === 'payroll_processed' ? 'bg-blue-500' :
                    activity.type === 'performance_review' ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.type}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Henüz aktivite bulunmuyor</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  Ekip Üyeleri
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Aktif yönetim ekibi
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewAllEmployees}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300"
              >
                <Eye className="mr-2 h-4 w-4" />
                Tümü
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {(teamMembers as any)?.slice(0, 4).map((member: any, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.profileImageUrl} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {member.firstName?.[0]}{member.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      member.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    }`}
                  >
                    {member.isActive ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>
              )) || (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ekip üyesi bulunmuyor</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
              variant="outline" 
              className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              onClick={handleViewUsers}
            >
              <Users className="mr-2 h-4 w-4 text-blue-600" />
              Kullanıcı Yönetimi
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
              onClick={handleViewAuditLogs}
            >
              <Shield className="mr-2 h-4 w-4 text-red-600" />
              Güvenlik & Denetim
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
              onClick={handleCreateReport}
            >
              <FileText className="mr-2 h-4 w-4 text-green-600" />
              Rapor Merkezi
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800"
              onClick={handleViewCompanies}
            >
              <Building2 className="mr-2 h-4 w-4 text-purple-600" />
              Şirket Profili
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-orange-50 dark:hover:bg-orange-900/20 border-orange-200 dark:border-orange-800"
              onClick={handleViewAnalytics}
            >
              <PieChart className="mr-2 h-4 w-4 text-orange-600" />
              Analytics Dashboard
            </Button>

            <Separator className="my-4" />

            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleSystemSettings}
              >
                <Zap className="mr-2 h-4 w-4" />
                Sistem
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Yenile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}