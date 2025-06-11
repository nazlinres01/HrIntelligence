import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Building2, 
  Shield, 
  Settings, 
  BarChart3, 
  AlertTriangle,
  Activity,
  Database,
  UserPlus,
  FileText,
  Clock,
  TrendingUp
} from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: systemHealth, isLoading: healthLoading } = useQuery({
    queryKey: ["/api/admin/system-health"],
  });

  const { data: recentActivities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/admin/activities"],
  });

  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ["/api/admin/companies"],
  });

  if (statsLoading || healthLoading || activitiesLoading || companiesLoading) {
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
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Sistem yönetimi ve genel bakış
            </p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Settings className="h-4 w-4 mr-2" />
              Sistem Ayarları
            </Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Toplam Şirket
              </CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalCompanies || 0}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                +{stats?.newCompaniesThisMonth || 0} bu ay
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Toplam Kullanıcı
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalUsers || 0}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                +{stats?.newUsersThisMonth || 0} bu ay
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Aktif Oturumlar
              </CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.activeSessions || 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Son 24 saat
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Sistem Durumu
              </CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Çevrimiçi
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                99.9% uptime
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Şirketler
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Kullanıcılar
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Sistem
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Son Aktiviteler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities?.slice(0, 5).map((activity: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(activity.createdAt).toLocaleString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                    Sistem Sağlığı
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">CPU Kullanımı</span>
                      <span className="text-sm font-medium">
                        {systemHealth?.cpu || 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Bellek Kullanımı</span>
                      <span className="text-sm font-medium">
                        {systemHealth?.memory || 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Disk Kullanımı</span>
                      <span className="text-sm font-medium">
                        {systemHealth?.disk || 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Veritabanı</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Çevrimiçi
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Şirket Yönetimi</CardTitle>
                <CardDescription>
                  Tüm şirketleri görüntüleyin ve yönetin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companies?.map((company: any) => (
                    <div key={company.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {company.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {company.industry} • {company.employeeCount} çalışan
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Görüntüle
                        </Button>
                        <Button variant="outline" size="sm">
                          Düzenle
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Kullanıcı Yönetimi</CardTitle>
                <CardDescription>
                  Tüm kullanıcıları görüntüleyin ve yönetin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Kullanıcı yönetimi geliştiriliyor...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Sistem Ayarları</CardTitle>
                <CardDescription>
                  Sistem konfigürasyonu ve bakım
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Sistem ayarları geliştiriliyor...
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