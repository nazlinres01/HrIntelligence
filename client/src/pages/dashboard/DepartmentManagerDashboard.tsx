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
  CheckCircle,
  AlertCircle,
  Target,
  BarChart3,
  Award,
  Briefcase,
  Settings,
  UserCheck,
  MessageSquare,
  Star,
  Activity
} from "lucide-react";

export default function DepartmentManagerDashboard() {
  const { user } = useAuth();
  const userData = user as any;

  const { data: teamMembers } = useQuery({
    queryKey: ["/api/team/my-team"],
  });

  const { data: teamPerformance } = useQuery({
    queryKey: ["/api/team/performance"],
  });

  const { data: pendingApprovals } = useQuery({
    queryKey: ["/api/approvals/pending"],
  });

  const { data: departmentProjects } = useQuery({
    queryKey: ["/api/projects/department"],
  });

  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Departman Müdürü Paneli
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Ekip yönetimi ve departman performans takibi
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Toplantı Planla
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="mr-2 h-4 w-4" />
            Departman Raporu
          </Button>
        </div>
      </div>

      {/* Department Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ekip Üyesi
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              15
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Aktif çalışan
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ekip Performansı
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              91.4%
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              Hedefin üzerinde
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bekleyen Onaylar
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              8
            </div>
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
              İnceleme bekliyor
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Aktif Projeler
            </CardTitle>
            <Briefcase className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              6
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              Devam eden
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Team Performance Overview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
              Ekip Performans Özeti
            </CardTitle>
            <CardDescription>
              Ekip üyelerinin individual performans değerlendirmesi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-green-600 text-white">AY</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">Ahmet Yılmaz</h4>
                  <p className="text-sm text-gray-600">Senior Developer</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">95%</Badge>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
                <Progress value={95} className="w-20 h-2 mt-1" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-600 text-white">ZK</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">Zeynep Kaya</h4>
                  <p className="text-sm text-gray-600">Product Manager</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-100 text-blue-800">92%</Badge>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
                <Progress value={92} className="w-20 h-2 mt-1" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-purple-600 text-white">MÖ</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">Mustafa Özkan</h4>
                  <p className="text-sm text-gray-600">UI/UX Designer</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-purple-100 text-purple-800">88%</Badge>
                  <Star className="h-4 w-4 text-gray-400" />
                </div>
                <Progress value={88} className="w-20 h-2 mt-1" />
              </div>
            </div>

            <Button variant="ghost" className="w-full">
              Tüm Ekip Üyelerini Görüntüle
            </Button>
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
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">İzin Talebi</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300">Fatma Demir - 3 gün</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <AlertCircle className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">Harcama Talebi</h4>
                  <p className="text-sm text-green-600 dark:text-green-300">Ali Vural - ₺2,450</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <AlertCircle className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <h4 className="font-medium text-purple-800 dark:text-purple-200">Mesai Onayı</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-300">Ekip - 12 saat</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <AlertCircle className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Button variant="ghost" className="w-full">
              Tüm Onayları Görüntüle
            </Button>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-indigo-600" />
              Proje Durumu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">E-ticaret Platform</span>
                <span className="text-sm text-gray-600">75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Hedef: 30 Haziran</p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Mobil Uygulama</span>
                <span className="text-sm text-gray-600">92%</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Hedef: 15 Haziran</p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">API Geliştirme</span>
                <span className="text-sm text-gray-600">68%</span>
              </div>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Hedef: 20 Temmuz</p>
            </div>

            <Separator />
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">78%</div>
              <p className="text-xs text-gray-600">Genel İlerleme</p>
            </div>
          </CardContent>
        </Card>

        {/* Team Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-gray-600" />
              Ekip Yönetimi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Performans Değerlendirmesi
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Ekip Toplantısı
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Award className="mr-2 h-4 w-4" />
              Takdir & Ödül
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Ekip Geri Bildirimi
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Departman Raporu
            </Button>
          </CardContent>
        </Card>

        {/* Recent Team Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-gray-600" />
              Son Ekip Aktiviteleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">Proje milestone tamamlandı</p>
                <p className="text-xs text-gray-500">E-ticaret Platform - Phase 2</p>
                <p className="text-xs text-gray-400">2 saat önce</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <UserCheck className="w-4 h-4 text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">Yeni ekip üyesi eklendi</p>
                <p className="text-xs text-gray-500">Can Demir - Frontend Developer</p>
                <p className="text-xs text-gray-400">1 gün önce</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Award className="w-4 h-4 text-yellow-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">Performans ödülü verildi</p>
                <p className="text-xs text-gray-500">Ahmet Yılmaz - Ayın Çalışanı</p>
                <p className="text-xs text-gray-400">3 gün önce</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <MessageSquare className="w-4 h-4 text-purple-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">Ekip toplantısı gerçekleştirildi</p>
                <p className="text-xs text-gray-500">Haftalık sprint review</p>
                <p className="text-xs text-gray-400">1 hafta önce</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Department Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-emerald-600" />
              Departman Hedefleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">Q2 2024</div>
              <p className="text-sm text-gray-600">Mevcut Dönem</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Proje Teslim Oranı</span>
                <span className="text-sm font-medium text-green-600">92%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Müşteri Memnuniyeti</span>
                <span className="text-sm font-medium text-blue-600">4.6/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Ekip Verimliliği</span>
                <span className="text-sm font-medium text-purple-600">88%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Bütçe Kullanımı</span>
                <span className="text-sm font-medium text-orange-600">76%</span>
              </div>
            </div>

            <Button variant="ghost" className="w-full">
              Detaylı Hedef Analizi
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}