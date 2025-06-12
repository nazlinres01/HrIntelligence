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
  TrendingUp, 
  Calendar,
  CreditCard,
  FileText,
  Clock,
  AlertTriangle,
  Shield,
  BarChart3,
  UserPlus,
  Target,
  Briefcase,
  Award,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function HRManagerDashboard() {
  const { user } = useAuth();
  const userData = user as any;

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: pendingLeaves } = useQuery({
    queryKey: ["/api/leaves/pending"],
  });

  const { data: performanceData } = useQuery({
    queryKey: ["/api/performance"],
  });

  const { data: payrollData } = useQuery({
    queryKey: ["/api/payroll"],
  });

  const { data: recruitmentPipeline } = useQuery({
    queryKey: ["/api/recruitment/pipeline"],
  });

  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            İK Müdürü Paneli
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            İnsan kaynakları yönetimi ve stratejik planlama merkezi
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Yeni İşe Alım
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="mr-2 h-4 w-4" />
            İK Raporu
          </Button>
        </div>
      </div>

      {/* HR Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Toplam Çalışan
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {employees?.length || 247}
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              +5 bu ay
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bekleyen İzinler
            </CardTitle>
            <Calendar className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {pendingLeaves?.length || 12}
            </div>
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
              Onay bekliyor
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
              4.2/5.0
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              +0.3 geçen döneme göre
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              İşe Alım Süreci
            </CardTitle>
            <Briefcase className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              8
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              Aktif pozisyon
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recruitment Pipeline */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
              İşe Alım Süreci
            </CardTitle>
            <CardDescription>
              Aktif pozisyonlar ve aday durumu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Senior Frontend Developer</h4>
                    <p className="text-sm text-gray-600">Teknoloji Departmanı</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-800">12 Aday</Badge>
                  <p className="text-xs text-gray-500 mt-1">Mülakat aşaması</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">İK Uzmanı</h4>
                    <p className="text-sm text-gray-600">İnsan Kaynakları</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-100 text-blue-800">8 Aday</Badge>
                  <p className="text-xs text-gray-500 mt-1">CV incelemesi</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Satış Temsilcisi</h4>
                    <p className="text-sm text-gray-600">Satış Departmanı</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-orange-100 text-orange-800">3 Aday</Badge>
                  <p className="text-xs text-gray-500 mt-1">Final mülakat</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">23</div>
                <p className="text-xs text-gray-600">Toplam Aday</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">8</div>
                <p className="text-xs text-gray-600">Final Aşama</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">15</div>
                <p className="text-xs text-gray-600">Ortalama Gün</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-orange-600" />
              Bekleyen Onaylar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-200">İzin Talepleri</h4>
                  <p className="text-sm text-orange-600 dark:text-orange-300">12 bekleyen</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Görüntüle</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Bordro Onayı</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300">3 departman</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Görüntüle</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <h4 className="font-medium text-purple-800 dark:text-purple-200">Performans</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-300">5 değerlendirme</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Görüntüle</Button>
            </div>

            <Button className="w-full" variant="ghost">
              Tüm Onayları Görüntüle
            </Button>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-indigo-600" />
              Departman Performansı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Teknoloji</span>
                <span className="text-sm text-gray-600">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Satış</span>
                <span className="text-sm text-gray-600">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Pazarlama</span>
                <span className="text-sm text-gray-600">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">İK</span>
                <span className="text-sm text-gray-600">96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>

            <Separator />
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">90.3%</div>
              <p className="text-xs text-gray-600">Genel Ortalama</p>
            </div>
          </CardContent>
        </Card>

        {/* HR Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-gray-600" />
              İK İşlemleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <UserPlus className="mr-2 h-4 w-4" />
              Yeni Çalışan Ekle
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              İzin Planlaması
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Performans Takibi
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Bordro Yönetimi
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              İK Raporları
            </Button>
          </CardContent>
        </Card>

        {/* Recent HR Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-600" />
              Son İK Aktiviteleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">İzin talebi onaylandı</p>
                <p className="text-xs text-gray-500">Ahmet Yılmaz - 3 gün</p>
                <p className="text-xs text-gray-400">2 saat önce</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <UserPlus className="w-4 h-4 text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">Yeni işe alım</p>
                <p className="text-xs text-gray-500">Sarah Johnson - Frontend</p>
                <p className="text-xs text-gray-400">1 gün önce</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-4 h-4 text-purple-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">Performans değerlendirmesi</p>
                <p className="text-xs text-gray-500">Teknoloji Departmanı</p>
                <p className="text-xs text-gray-400">2 gün önce</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CreditCard className="w-4 h-4 text-green-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">Bordro işlendi</p>
                <p className="text-xs text-gray-500">Mayıs 2024</p>
                <p className="text-xs text-gray-400">3 gün önce</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-yellow-600" />
              Çalışan Memnuniyeti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">4.6/5.0</div>
              <p className="text-sm text-gray-600">Genel Memnuniyet</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">İş Ortamı</span>
                <span className="text-sm font-medium">4.8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Yönetim</span>
                <span className="text-sm font-medium">4.5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Kariyer Fırsatları</span>
                <span className="text-sm font-medium">4.3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Maaş & Yan Haklar</span>
                <span className="text-sm font-medium">4.7</span>
              </div>
            </div>

            <Button variant="ghost" className="w-full">
              Detaylı Analiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}