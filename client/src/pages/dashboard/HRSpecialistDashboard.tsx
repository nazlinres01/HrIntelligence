import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Mail,
  Edit,
  Archive
} from "lucide-react";

export default function HRSpecialistDashboard() {
  const { data: dailyTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["/api/hr-specialist/daily-tasks"],
  });

  const { data: employeeRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["/api/hr-specialist/requests"],
  });

  const { data: documentQueue, isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/hr-specialist/documents"],
  });

  const { data: recentActivities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/hr-specialist/activities"],
  });

  if (tasksLoading || requestsLoading || documentsLoading || activitiesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              İK Uzmanı Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Günlük işlemler ve çalışan destek hizmetleri
            </p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <FileText className="h-4 w-4 mr-2" />
              Yeni Belge
            </Button>
            <Button variant="outline">
              <User className="h-4 w-4 mr-2" />
              Çalışan Ekle
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Günlük Görevler
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {dailyTasks?.pending || 0}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {dailyTasks?.completed || 0} tamamlandı
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Çalışan Talepleri
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {employeeRequests?.pending || 0}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Yanıt bekliyor
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Belge İşlemleri
              </CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {documentQueue?.pending || 0}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                İşlem bekliyor
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Bu Hafta İşlem
              </CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {recentActivities?.thisWeek || 0}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Tamamlanan işlem
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Günlük Görevler
            </TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Çalışan İşlemleri
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Belgeler
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Talepler
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Priority Tasks */}
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                    Öncelikli Görevler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900 dark:text-red-100">
                          5 izin belgesi hazırlama
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-300">
                          Bugün teslim
                        </p>
                      </div>
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        Acil
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                          Yeni çalışan dosyası oluşturma
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">
                          Yarın başlama tarihi
                        </p>
                      </div>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Önemli
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Bordro hazırlama kontrolü
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Bu hafta içinde
                        </p>
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Normal
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-green-600" />
                    Hızlı İşlemler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      İş Belgesi Hazırla
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      İzin Kaydı Gir
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Çalışan Bilgisi Güncelle
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Toplu E-posta Gönder
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Archive className="h-4 w-4 mr-2" />
                      Dosya Arşivle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Çalışan Bilgi Yönetimi</CardTitle>
                <CardDescription>
                  Çalışan dosyaları ve kişisel bilgi güncellemeleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Ahmet Yılmaz
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Yazılım Geliştirici • IT Departmanı
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Düzenle
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Belge
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Ayşe Kaya
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Muhasebe Uzmanı • Finans Departmanı
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Düzenle
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Belge
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Belge Yönetimi</CardTitle>
                <CardDescription>
                  İş belgeleri, sözleşmeler ve resmi evraklar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          İş Sözleşmeleri
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        12 belge işlem bekliyor
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Görüntüle
                      </Button>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          İzin Belgeleri
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        8 belge hazırlanacak
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Hazırla
                      </Button>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          SGK Belgeleri
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        3 belge gönderilecek
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Gönder
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Çalışan Talepleri</CardTitle>
                <CardDescription>
                  Gelen talepler ve destek istekleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Maaş bordrosu talebi
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Mehmet Demir • 2 saat önce
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Yanıtla
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          İletişim bilgisi güncelleme
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Fatma Öz • 4 saat önce
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        İşle
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}