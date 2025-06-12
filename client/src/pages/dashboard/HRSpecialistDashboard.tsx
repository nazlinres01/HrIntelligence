import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, 
  Calendar,
  CreditCard,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  TrendingUp,
  Bell,
  UserCheck,
  Archive,
  Edit,
  Download
} from "lucide-react";

export default function HRSpecialistDashboard() {
  const { user } = useAuth();
  const userData = user as any;

  const { data: employeeRecords } = useQuery({
    queryKey: ["/api/employee-records"],
  });

  const { data: pendingDocuments } = useQuery({
    queryKey: ["/api/documents/pending"],
  });

  const { data: leaveRequests } = useQuery({
    queryKey: ["/api/leave-requests"],
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
  });

  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            İK Uzmanı Paneli
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Personel işlemleri ve dokümantasyon merkezi
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Yeni Belge
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Users className="mr-2 h-4 w-4" />
            Çalışan Ekle
          </Button>
        </div>
      </div>

      {/* Specialist Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Aktif Dosyalar
            </CardTitle>
            <Archive className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {employeeRecords?.length || 156}
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Güncel kayıtlar
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bekleyen İşlemler
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {pendingDocuments?.length || 23}
            </div>
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
              İşlem gerekli
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bu Ay Tamamlanan
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              47
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              İşlem tamamlandı
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Eğitim Kayıtları
            </CardTitle>
            <BookOpen className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              94
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              Aktif eğitim
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Tasks */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              Bugünün Görevleri
            </CardTitle>
            <CardDescription>
              Öncelikli işlemler ve bekleyen talepler
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Sözleşme Yenileme</h4>
                  <p className="text-sm text-gray-600">Ahmet Yılmaz - Teknoloji</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-orange-100 text-orange-800">Yüksek</Badge>
                <Button size="sm" variant="outline">İşle</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">İzin Belgesi Hazırlama</h4>
                  <p className="text-sm text-gray-600">Fatma Demir - 5 gün yıllık izin</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-800">Normal</Badge>
                <Button size="sm" variant="outline">İşle</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Performans Raporu</h4>
                  <p className="text-sm text-gray-600">Q2 2024 dönem raporu</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">Düşük</Badge>
                <Button size="sm" variant="outline">İşle</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Bordro Kontrolü</h4>
                  <p className="text-sm text-gray-600">Mayıs 2024 bordro verileri</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-100 text-red-800">Kritik</Badge>
                <Button size="sm" variant="outline">İşle</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-indigo-600" />
              Belge Yönetimi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">İş Sözleşmeleri</span>
              <span className="text-sm text-gray-600">156</span>
            </div>
            <Progress value={92} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">SGK Bildirimler</span>
              <span className="text-sm text-gray-600">89</span>
            </div>
            <Progress value={67} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">İzin Belgeleri</span>
              <span className="text-sm text-gray-600">234</span>
            </div>
            <Progress value={85} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Eğitim Sertifikaları</span>
              <span className="text-sm text-gray-600">78</span>
            </div>
            <Progress value={45} className="h-2" />

            <Separator />

            <Button variant="ghost" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Tüm Belgeleri İndir
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Edit className="mr-2 h-5 w-5 text-gray-600" />
              Hızlı İşlemler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Personel Dosyası Oluştur
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              İzin Belgesi Hazırla
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Bordro Verileri Gir
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              Eğitim Kaydı Yap
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Rapor Hazırla
            </Button>
          </CardContent>
        </Card>

        {/* Employee Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-yellow-600" />
              Çalışan Talepleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Maaş Belgesi</h4>
                <p className="text-sm text-yellow-600 dark:text-yellow-300">Zeynep Kaya - Kredi başvurusu</p>
                <p className="text-xs text-gray-500">2 saat önce</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">İş Belgesi</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">Mustafa Özkan - Vize başvurusu</p>
                <p className="text-xs text-gray-500">1 gün önce</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <UserCheck className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-green-800 dark:text-green-200">Referans Mektubu</h4>
                <p className="text-sm text-green-600 dark:text-green-300">Ali Vural - İş başvurusu</p>
                <p className="text-xs text-gray-500">3 gün önce</p>
              </div>
            </div>

            <Button variant="ghost" className="w-full">
              Tüm Talepleri Görüntüle
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-600" />
              Son Aktiviteler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">Sözleşme yenilendi</p>
                <p className="text-xs text-gray-500">Mehmet Demir - 2 yıl</p>
                <p className="text-xs text-gray-400">1 saat önce</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <FileText className="w-4 h-4 text-blue-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">İzin belgesi hazırlandı</p>
                <p className="text-xs text-gray-500">Ayşe Yılmaz - 10 gün</p>
                <p className="text-xs text-gray-400">3 saat önce</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <BookOpen className="w-4 h-4 text-purple-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">Eğitim kaydı oluşturuldu</p>
                <p className="text-xs text-gray-500">İK Eğitimi - 15 kişi</p>
                <p className="text-xs text-gray-400">1 gün önce</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CreditCard className="w-4 h-4 text-green-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">Bordro verileri güncellendi</p>
                <p className="text-xs text-gray-500">Mayıs 2024</p>
                <p className="text-xs text-gray-400">2 gün önce</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Development */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-emerald-600" />
              Kişisel Gelişim
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">8.5/10</div>
              <p className="text-sm text-gray-600">Bu Ay Performans</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Verimlilik</span>
                <span className="text-sm font-medium">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Zamanında Teslimat</span>
                <span className="text-sm font-medium">98%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Müşteri Memnuniyeti</span>
                <span className="text-sm font-medium">96%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Takım İşbirliği</span>
                <span className="text-sm font-medium">92%</span>
              </div>
            </div>

            <Button variant="ghost" className="w-full">
              Detaylı Rapor
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}