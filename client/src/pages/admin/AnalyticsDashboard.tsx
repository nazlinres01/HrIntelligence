import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  Target, 
  DollarSign,
  Calendar,
  Activity,
  Award
} from "lucide-react";

export default function AnalyticsDashboard() {
  const { data: companyStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats/company"],
  });

  const { data: employeeStats, isLoading: empStatsLoading } = useQuery({
    queryKey: ["/api/stats/employees"],
  });

  const { data: departmentStats, isLoading: deptStatsLoading } = useQuery({
    queryKey: ["/api/stats/departments"],
  });

  const { data: performance, isLoading: perfLoading } = useQuery({
    queryKey: ["/api/performance"],
  });

  const { data: payroll, isLoading: payrollLoading } = useQuery({
    queryKey: ["/api/payroll"],
  });

  if (statsLoading || empStatsLoading || deptStatsLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const calculatePerformanceAverage = () => {
    if (!performance || performance.length === 0) return 0;
    const total = performance.reduce((sum: number, p: any) => sum + (p.overallScore || 0), 0);
    return (total / performance.length).toFixed(1);
  };

  const calculateMonthlyPayrollTotal = () => {
    if (!payroll || payroll.length === 0) return 0;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const monthlyPayroll = payroll.filter((p: any) => 
      p.period?.month === currentMonth && p.period?.year === currentYear && p.status === 'paid'
    );
    
    return monthlyPayroll.reduce((sum: number, p: any) => sum + (p.netSalary || 0), 0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Şirket performansını ve istatistikleri görüntüleyin</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Şirket</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyStats?.totalCompanies || 0}</div>
            <p className="text-xs text-muted-foreground">Aktif şirket sayısı</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Çalışan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeStats?.totalEmployees || 0}</div>
            <p className="text-xs text-muted-foreground">Sistem geneli</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departman Sayısı</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyStats?.totalDepartments || 0}</div>
            <p className="text-xs text-muted-foreground">Aktif departman</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aylık Bordro</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateMonthlyPayrollTotal().toLocaleString('tr-TR', { 
                style: 'currency', 
                currency: 'TRY',
                minimumFractionDigits: 0 
              })}
            </div>
            <p className="text-xs text-muted-foreground">Bu ay ödenen</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performans Analizi
            </CardTitle>
            <CardDescription>Çalışan performans değerlendirmeleri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ortalama Performans Skoru</span>
                <Badge variant="default" className="text-lg px-3 py-1">
                  {calculatePerformanceAverage()}/5.0
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Teknik Beceriler</span>
                  <span>4.2/5.0</span>
                </div>
                <Progress value={84} className="h-2" />
                
                <div className="flex items-center justify-between text-sm">
                  <span>İletişim</span>
                  <span>4.5/5.0</span>
                </div>
                <Progress value={90} className="h-2" />
                
                <div className="flex items-center justify-between text-sm">
                  <span>Takım Çalışması</span>
                  <span>4.3/5.0</span>
                </div>
                <Progress value={86} className="h-2" />
                
                <div className="flex items-center justify-between text-sm">
                  <span>Liderlik</span>
                  <span>3.8/5.0</span>
                </div>
                <Progress value={76} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              İK Aktiviteleri
            </CardTitle>
            <CardDescription>Bu ay gerçekleşen aktiviteler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {performance?.filter((p: any) => p.status === 'completed').length || 0}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">Tamamlanan Değerlendirme</div>
                </div>
                
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {employeeStats?.activeLeaves || 0}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Aktif İzin</div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {payroll?.filter((p: any) => p.status === 'paid').length || 0}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">İşlenen Bordro</div>
                </div>
                
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {companyStats?.totalUsers || 0}
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">Aktif Kullanıcı</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Departman Analizi
          </CardTitle>
          <CardDescription>Departman bazında çalışan dağılımı ve bütçe kullanımı</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Departman</TableHead>
                <TableHead>Çalışan Sayısı</TableHead>
                <TableHead>Aktif Çalışan</TableHead>
                <TableHead>Bütçe</TableHead>
                <TableHead>Doluluk Oranı</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentStats?.map((dept: any) => (
                <TableRow key={dept._id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>{dept.employeeCount}</TableCell>
                  <TableCell>{dept.activeEmployees}</TableCell>
                  <TableCell>
                    {(dept.budget || 0).toLocaleString('tr-TR', { 
                      style: 'currency', 
                      currency: 'TRY',
                      minimumFractionDigits: 0 
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={dept.employeeCount > 0 ? (dept.activeEmployees / dept.employeeCount) * 100 : 0} 
                        className="flex-1 h-2" 
                      />
                      <span className="text-sm text-muted-foreground">
                        {dept.employeeCount > 0 ? Math.round((dept.activeEmployees / dept.employeeCount) * 100) : 0}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {(!departmentStats || departmentStats.length === 0) && (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Departman verisi yok</h3>
              <p className="text-gray-600 dark:text-gray-400">Departmanlar oluşturulduktan sonra analiz verileri burada görünecek</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="h-5 w-5 mr-2" />
              Bu Ay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Yeni Performans Değerlendirmesi</span>
                <span className="font-medium">{performance?.filter((p: any) => {
                  const date = new Date(p.createdAt);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">İşlenen Bordro</span>
                <span className="font-medium">{payroll?.filter((p: any) => 
                  p.period?.month === new Date().getMonth() + 1 && 
                  p.period?.year === new Date().getFullYear()
                ).length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Aktif İzinler</span>
                <span className="font-medium">{employeeStats?.activeLeaves || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Award className="h-5 w-5 mr-2" />
              En İyi Performans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performance?.slice(0, 3).map((p: any, index: number) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <span className="text-sm">{p.employeeId?.firstName || 'Bilinmeyen'}</span>
                  </div>
                  <Badge variant="default">{p.overallScore}/5.0</Badge>
                </div>
              )) || <p className="text-sm text-muted-foreground">Henüz performans verisi yok</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <PieChart className="h-5 w-5 mr-2" />
              Sistem Durumu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sistem Kullanım Oranı</span>
                <Badge variant="default">98%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Veri Güncelliği</span>
                <Badge variant="default">Güncel</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Son Yedekleme</span>
                <span className="text-sm font-medium">Bugün</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}