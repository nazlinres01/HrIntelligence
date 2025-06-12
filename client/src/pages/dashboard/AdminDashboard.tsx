import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
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
  PieChart
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const userData = user as any;

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

  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Yönetici Paneli
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Şirket geneli performans ve yönetim özeti
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Rapor Oluştur
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Settings className="mr-2 h-4 w-4" />
            Sistem Ayarları
          </Button>
        </div>
      </div>

      {/* Executive Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Toplam Çalışan
            </CardTitle>
            <Building2 className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {employeeStats?.totalEmployees || 247}
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              +12 bu ay
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Aylık Gelir
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
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

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ortalama Performans
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
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

        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bekleyen Onaylar
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {(pendingTimeEntries?.length || 0) + (pendingExpenseReports?.length || 0)}
            </div>
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
              İnceleme bekliyor
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Company Performance */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
              Şirket Performans Özeti
            </CardTitle>
            <CardDescription>
              Departmanlar arası performans karşılaştırması
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">İnsan Kaynakları</span>
                  <span className="text-sm text-gray-600">94%</span>
                </div>
                <Progress value={94} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Teknoloji</span>
                  <span className="text-sm text-gray-600">91%</span>
                </div>
                <Progress value={91} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Satış</span>
                  <span className="text-sm text-gray-600">88%</span>
                </div>
                <Progress value={88} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Pazarlama</span>
                  <span className="text-sm text-gray-600">85%</span>
                </div>
                <Progress value={85} className="h-3" />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">97%</div>
                <p className="text-xs text-gray-600">Çalışan Memnuniyeti</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">4.2</div>
                <p className="text-xs text-gray-600">Ortalama Rating</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">92%</div>
                <p className="text-xs text-gray-600">İşe Devam Oranı</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
              Acil Eylemler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertTriangle className="h-5 w-5 text-red-600" />
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

            <Button className="w-full" variant="outline">
              Tüm Uyarıları Görüntüle
            </Button>
          </CardContent>
        </Card>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-indigo-600" />
              Departman Özeti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">İnsan Kaynakları</p>
                  <p className="text-sm text-gray-600">12 çalışan</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Aktif</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium">Teknoloji</p>
                  <p className="text-sm text-gray-600">45 çalışan</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Aktif</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="font-medium">Satış</p>
                  <p className="text-sm text-gray-600">28 çalışan</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Aktif</Badge>
            </div>

            <Button variant="ghost" className="w-full">
              Tüm Departmanları Görüntüle
            </Button>
          </CardContent>
        </Card>

        {/* Recent System Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-gray-600" />
              Sistem Aktiviteleri
            </CardTitle>
            <CardDescription>
              Son sistem olayları ve güncellemeleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Yeni çalışan kaydı</p>
                  <p className="text-xs text-gray-500">Sarah Johnson - Teknoloji</p>
                  <p className="text-xs text-gray-400">2 saat önce</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Bordro işlendi</p>
                  <p className="text-xs text-gray-500">Mayıs 2024 bordrodu</p>
                  <p className="text-xs text-gray-400">6 saat önce</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Performans değerlendirmesi</p>
                  <p className="text-xs text-gray-500">Q2 2024 tamamlandı</p>
                  <p className="text-xs text-gray-400">1 gün önce</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sistem güncellemesi</p>
                  <p className="text-xs text-gray-500">HR360 v2.1.4</p>
                  <p className="text-xs text-gray-400">2 gün önce</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-gray-600" />
              Yönetim Araçları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Kullanıcı Yönetimi
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Güvenlik Ayarları
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Rapor Merkezi
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Building2 className="mr-2 h-4 w-4" />
              Şirket Profili
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <PieChart className="mr-2 h-4 w-4" />
              Analytics Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}