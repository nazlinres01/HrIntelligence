import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  BarChart3,
  Target,
  Award
} from "lucide-react";

export default function HRManagerDashboard() {
  const { data: hrStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/hr/stats"],
  });

  const { data: pendingLeaves, isLoading: leavesLoading } = useQuery({
    queryKey: ["/api/hr/pending-leaves"],
  });

  const { data: teamPerformance, isLoading: performanceLoading } = useQuery({
    queryKey: ["/api/hr/team-performance"],
  });

  const { data: recruitmentPipeline, isLoading: recruitmentLoading } = useQuery({
    queryKey: ["/api/hr/recruitment"],
  });

  if (statsLoading || leavesLoading || performanceLoading || recruitmentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
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
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              İK Müdürü Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              İnsan kaynakları yönetimi ve stratejik planlama
            </p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Yeni İşe Alım
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Rapor Oluştur
            </Button>
          </div>
        </div>

        {/* HR Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Toplam Çalışan
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {hrStats?.totalEmployees || 0}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                +{hrStats?.newHiresThisMonth || 0} bu ay
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Bekleyen İzinler
              </CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {hrStats?.pendingLeaves || 0}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Onay bekliyor
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ortalama Performans
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {hrStats?.averagePerformance || "0.0"}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                +0.2 geçen aya göre
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                İşe Alım Süreci
              </CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {hrStats?.activeRecruitments || 0}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Aktif pozisyon
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Çalışanlar
            </TabsTrigger>
            <TabsTrigger value="leaves" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              İzin Yönetimi
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Performans
            </TabsTrigger>
            <TabsTrigger value="recruitment" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              İşe Alım
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                    Hızlı İşlemler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Yeni Çalışan Ekle
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      İzin Talepleri ({hrStats?.pendingLeaves || 0})
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Award className="h-4 w-4 mr-2" />
                      Performans Değerlendirme
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Aylık Rapor
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Team Statistics */}
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                    Takım İstatistikleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Aktif Çalışan</span>
                      <span className="text-sm font-medium">
                        {hrStats?.activeEmployees || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">İzinli Çalışan</span>
                      <span className="text-sm font-medium">
                        {hrStats?.employeesOnLeave || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Departman Sayısı</span>
                      <span className="text-sm font-medium">
                        {hrStats?.departmentCount || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Ortalama Maaş</span>
                      <span className="text-sm font-medium">
                        ₺{hrStats?.averageSalary || "0"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Son Aktiviteler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          Ahmet Yılmaz performans değerlendirmesi tamamlandı
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          2 saat önce
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          Yeni çalışan kayıt süreci başlatıldı
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          4 saat önce
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                    Dikkat Gereken Konular
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                          5 izin talebi onay bekliyor
                        </p>
                        <p className="text-xs text-orange-700 dark:text-orange-300">
                          Ortalama bekleme süresi: 2 gün
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        İncele
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          2 pozisyon için işe alım süreci
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Mülakatlar bu hafta
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Görüntüle
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Çalışan Yönetimi</CardTitle>
                <CardDescription>
                  Tüm çalışanları görüntüleyin ve yönetin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Çalışan listesi yükleniyor...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaves" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>İzin Yönetimi</CardTitle>
                <CardDescription>
                  İzin talepleri ve onay süreçleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingLeaves?.map((leave: any) => (
                    <div key={leave.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {leave.employeeName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {leave.leaveType} • {leave.startDate} - {leave.endDate}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          Onayla
                        </Button>
                        <Button size="sm" variant="outline">
                          Reddet
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Performans Yönetimi</CardTitle>
                <CardDescription>
                  Çalışan performans değerlendirmeleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Performans raporları hazırlanıyor...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recruitment" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>İşe Alım Süreci</CardTitle>
                <CardDescription>
                  Açık pozisyonlar ve aday takibi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    İşe alım modülü geliştiriliyor...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}