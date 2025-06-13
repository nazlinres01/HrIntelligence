import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Users, 
  Building2, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  CreditCard,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  Award
} from "lucide-react";

export default function AnalyticsDashboard() {
  const { data: companies = [] } = useQuery({
    queryKey: ["/api/companies"],
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  // Calculate analytics data
  const analytics = {
    totalCompanies: Array.isArray(companies) ? companies.length : 0,
    totalEmployees: Array.isArray(employees) ? employees.length : 0,
    totalDepartments: Array.isArray(departments) ? departments.length : 0,
    totalUsers: Array.isArray(users) ? users.length : 0,
    activeUsers: Array.isArray(users) ? users.filter((u: any) => u.isActive).length : 0,
    inactiveUsers: Array.isArray(users) ? users.filter((u: any) => !u.isActive).length : 0,
    averageEmployeesPerCompany: Array.isArray(companies) && companies.length > 0 
      ? Math.round((Array.isArray(employees) ? employees.length : 0) / companies.length) 
      : 0,
    averageDepartmentsPerCompany: Array.isArray(companies) && companies.length > 0 
      ? Math.round((Array.isArray(departments) ? departments.length : 0) / companies.length) 
      : 0,
  };

  // Department distribution
  const departmentStats = Array.isArray(departments) ? departments.map((dept: any) => {
    const employeeCount = Array.isArray(employees) 
      ? employees.filter((emp: any) => emp.departmentId === dept.id).length 
      : 0;
    return {
      name: dept.name,
      employeeCount,
      percentage: analytics.totalEmployees > 0 ? Math.round((employeeCount / analytics.totalEmployees) * 100) : 0
    };
  }) : [];

  // Company size distribution
  const companySizes = Array.isArray(companies) ? companies.reduce((acc: any, company: any) => {
    const size = company.size || "Belirtilmemiş";
    acc[size] = (acc[size] || 0) + 1;
    return acc;
  }, {}) : {};

  // Role distribution
  const roleStats = Array.isArray(users) ? users.reduce((acc: any, user: any) => {
    const role = user.role || "Belirtilmemiş";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {}) : {};

  if (!companies || !employees || !departments || !users) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Departman Analitiği</h1>
            <p className="text-gray-600">Şirket verilerinizi analiz edin ve performans trendlerini takip edin</p>
          </div>
          <Badge variant="outline" className="text-sm">
            <Activity className="h-4 w-4 mr-2" />
            Canlı Veriler
          </Badge>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.totalCompanies}
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
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.totalEmployees}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Toplam Çalışan
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
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.totalDepartments}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Toplam Departman
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+5% bu ay</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-4">
              <UserCheck className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.activeUsers}
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Aktif Kullanıcı
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">
                  {analytics.totalUsers} toplam kullanıcı
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="departments">Departmanlar</TabsTrigger>
          <TabsTrigger value="companies">Şirketler</TabsTrigger>
          <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Organizasyon Metrikleri
                </CardTitle>
                <CardDescription>Temel organizasyon istatistikleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Şirket Başına Ortalama Çalışan</span>
                  <span className="text-2xl font-bold text-blue-600">{analytics.averageEmployeesPerCompany}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Şirket Başına Ortalama Departman</span>
                  <span className="text-2xl font-bold text-purple-600">{analytics.averageDepartmentsPerCompany}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Kullanıcı Aktivasyon Oranı</span>
                  <span className="text-2xl font-bold text-green-600">
                    {analytics.totalUsers > 0 ? Math.round((analytics.activeUsers / analytics.totalUsers) * 100) : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Performans Göstergeleri
                </CardTitle>
                <CardDescription>Temel KPI'lar ve başarı metrikleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Sistem Kullanım Oranı</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Veri Tamamlanma Oranı</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Aktif Kullanıcı Oranı</span>
                    <span className="text-sm font-medium">
                      {analytics.totalUsers > 0 ? Math.round((analytics.activeUsers / analytics.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={analytics.totalUsers > 0 ? (analytics.activeUsers / analytics.totalUsers) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {departmentStats.map((dept: any, index: number) => (
              <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                  <CardDescription>Departman detayları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Çalışan Sayısı</span>
                      <span className="text-2xl font-bold text-blue-600">{dept.employeeCount}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Toplam İçindeki Payı</span>
                        <span className="text-sm font-medium">{dept.percentage}%</span>
                      </div>
                      <Progress value={dept.percentage} className="h-2" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Aktif departman</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Şirket Boyut Dağılımı</CardTitle>
                <CardDescription>Şirketlerin boyut kategorilerine göre dağılımı</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(companySizes).map(([size, count]: [string, any]) => (
                  <div key={size} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{size}</span>
                      <span className="text-sm font-medium">{count} şirket</span>
                    </div>
                    <Progress 
                      value={analytics.totalCompanies > 0 ? (count / analytics.totalCompanies) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Şirket İstatistikleri</CardTitle>
                <CardDescription>Detaylı şirket analizi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{analytics.totalCompanies}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Şirket</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{analytics.averageEmployeesPerCompany}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Ort. Çalışan</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Büyüme Oranı</span>
                    <span className="text-sm font-medium text-green-600">+12%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Kullanıcı Rol Dağılımı</CardTitle>
                <CardDescription>Sistemdeki rollere göre kullanıcı dağılımı</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(roleStats).map(([role, count]: [string, any]) => (
                  <div key={role} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{role}</span>
                      <span className="text-sm font-medium">{count} kullanıcı</span>
                    </div>
                    <Progress 
                      value={analytics.totalUsers > 0 ? (count / analytics.totalUsers) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Kullanıcı Aktivitesi</CardTitle>
                <CardDescription>Kullanıcı durum analizi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{analytics.activeUsers}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Aktif Kullanıcı</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <UserX className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">{analytics.inactiveUsers}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pasif Kullanıcı</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Aktivasyon Oranı</span>
                    <span className="text-sm font-medium">
                      {analytics.totalUsers > 0 ? Math.round((analytics.activeUsers / analytics.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={analytics.totalUsers > 0 ? (analytics.activeUsers / analytics.totalUsers) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}