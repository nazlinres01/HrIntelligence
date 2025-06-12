import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  PieChart,
  FileText,
  Download,
  Calendar,
  Building2,
  Users,
  Target,
  AlertCircle
} from "lucide-react";

export default function FinancialReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const { data: payrollData = [], isLoading: payrollLoading } = useQuery({
    queryKey: ["/api/payroll"],
  });

  const { data: departmentData = [], isLoading: deptLoading } = useQuery({
    queryKey: ["/api/departments"],
  });

  const { data: companyStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats/company"],
  });

  // Sample financial data for demonstration
  const monthlyExpenses = [
    { month: "Ocak", payroll: 1250000, benefits: 125000, operations: 85000, total: 1460000 },
    { month: "Şubat", payroll: 1280000, benefits: 128000, operations: 92000, total: 1500000 },
    { month: "Mart", payroll: 1320000, benefits: 132000, operations: 88000, total: 1540000 },
    { month: "Nisan", payroll: 1350000, benefits: 135000, operations: 95000, total: 1580000 },
    { month: "Mayıs", payroll: 1380000, benefits: 138000, operations: 82000, total: 1600000 },
    { month: "Haziran", payroll: 1420000, benefits: 142000, operations: 90000, total: 1652000 },
  ];

  const departmentBudgets = [
    { name: "Yazılım Geliştirme", budget: 5000000, spent: 3200000, remaining: 1800000, utilization: 64 },
    { name: "İnsan Kaynakları", budget: 1500000, spent: 980000, remaining: 520000, utilization: 65 },
    { name: "Pazarlama", budget: 3000000, spent: 2100000, remaining: 900000, utilization: 70 },
    { name: "Finans", budget: 1200000, spent: 720000, remaining: 480000, utilization: 60 },
  ];

  const costCenters = [
    { category: "Personel Giderleri", amount: 8520000, percentage: 68, trend: "up" },
    { category: "Operasyonel Giderler", amount: 1680000, percentage: 13, trend: "down" },
    { category: "Teknoloji & Ekipman", amount: 1260000, percentage: 10, trend: "up" },
    { category: "Pazarlama & Satış", amount: 840000, percentage: 7, trend: "stable" },
    { category: "Diğer", amount: 252000, percentage: 2, trend: "down" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const totalYearlyExpense = monthlyExpenses.reduce((sum, month) => sum + month.total, 0);
  const averageMonthlyExpense = totalYearlyExpense / monthlyExpenses.length;

  if (payrollLoading || deptLoading || statsLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Finansal Raporlar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Bütçe, giderler ve mali performans analizi</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-white dark:bg-gray-800">
            <Download className="h-4 w-4 mr-2" />
            Rapor İndir
          </Button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Toplam Bütçe</CardTitle>
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(departmentBudgets.reduce((sum, dept) => sum + dept.budget, 0))}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-300">Yıllık toplam bütçe</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">Toplam Harcama</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(departmentBudgets.reduce((sum, dept) => sum + dept.spent, 0))}
            </div>
            <p className="text-xs text-green-600 dark:text-green-300">Bu yıl harcanan</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Kalan Bütçe</CardTitle>
            <PieChart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {formatCurrency(departmentBudgets.reduce((sum, dept) => sum + dept.remaining, 0))}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-300">Kullanılabilir bütçe</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">Aylık Ortalama</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {formatCurrency(averageMonthlyExpense)}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-300">Aylık ortalama gider</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="departments">Departman Analizi</TabsTrigger>
          <TabsTrigger value="trends">Trend Analizi</TabsTrigger>
          <TabsTrigger value="cost-centers">Maliyet Merkezleri</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Aylık Gider Trendi
                </CardTitle>
                <CardDescription>Son 6 ayın gider dağılımı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyExpenses.map((month, index) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{month.month}</span>
                        <span className="font-bold">{formatCurrency(month.total)}</span>
                      </div>
                      <Progress 
                        value={(month.total / Math.max(...monthlyExpenses.map(m => m.total))) * 100} 
                        className="h-3"
                      />
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span>Bordro: {formatCurrency(month.payroll)}</span>
                        <span>Yan Haklar: {formatCurrency(month.benefits)}</span>
                        <span>Operasyon: {formatCurrency(month.operations)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Bütçe Kullanım Oranları
                </CardTitle>
                <CardDescription>Departman bazında bütçe kullanımı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentBudgets.map((dept) => (
                    <div key={dept.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{dept.name}</span>
                        <Badge variant={dept.utilization > 70 ? "destructive" : dept.utilization > 50 ? "default" : "secondary"}>
                          %{dept.utilization}
                        </Badge>
                      </div>
                      <Progress value={dept.utilization} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Harcanan: {formatCurrency(dept.spent)}</span>
                        <span>Kalan: {formatCurrency(dept.remaining)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Departman Bazlı Mali Performans</CardTitle>
              <CardDescription>Departmanların bütçe kullanımı ve mali durumu</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Departman</TableHead>
                    <TableHead>Toplam Bütçe</TableHead>
                    <TableHead>Harcanan</TableHead>
                    <TableHead>Kalan</TableHead>
                    <TableHead>Kullanım %</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentBudgets.map((dept) => (
                    <TableRow key={dept.name}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{formatCurrency(dept.budget)}</TableCell>
                      <TableCell>{formatCurrency(dept.spent)}</TableCell>
                      <TableCell>{formatCurrency(dept.remaining)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={dept.utilization} className="flex-1 h-2" />
                          <span className="text-sm">%{dept.utilization}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {dept.utilization > 80 ? (
                          <Badge variant="destructive" className="flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Kritik
                          </Badge>
                        ) : dept.utilization > 60 ? (
                          <Badge variant="default">Normal</Badge>
                        ) : (
                          <Badge variant="secondary">İyi</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>6 Aylık Harcama Trendi</CardTitle>
                <CardDescription>Giderlerin aylık değişimi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyExpenses.map((month, index) => {
                    const previousMonth = index > 0 ? monthlyExpenses[index - 1] : null;
                    const change = previousMonth ? ((month.total - previousMonth.total) / previousMonth.total) * 100 : 0;
                    const isIncrease = change > 0;
                    
                    return (
                      <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium">{month.month}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatCurrency(month.total)}
                          </div>
                        </div>
                        {previousMonth && (
                          <div className={`flex items-center ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                            {isIncrease ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            <span className="text-sm font-medium">{Math.abs(change).toFixed(1)}%</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yıllık Tahminler</CardTitle>
                <CardDescription>Mevcut trend bazında yıl sonu projeksiyonu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Tahmini Yıl Sonu Toplam</div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {formatCurrency(averageMonthlyExpense * 12)}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-sm text-green-600 dark:text-green-400 mb-1">Beklenen Tasarruf</div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {formatCurrency(departmentBudgets.reduce((sum, dept) => sum + dept.remaining, 0))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">Bütçe Kullanım Oranı</div>
                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      %{Math.round((departmentBudgets.reduce((sum, dept) => sum + dept.spent, 0) / departmentBudgets.reduce((sum, dept) => sum + dept.budget, 0)) * 100)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cost-centers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maliyet Merkezi Analizi</CardTitle>
              <CardDescription>Gider kategorilerine göre detaylı analiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {costCenters.map((center) => (
                  <div key={center.category} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{center.category}</span>
                        {getTrendIcon(center.trend)}
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(center.amount)}</div>
                        <div className={`text-sm ${getTrendColor(center.trend)}`}>
                          %{center.percentage} toplam gider
                        </div>
                      </div>
                    </div>
                    <Progress value={center.percentage * 2} className="h-3" />
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Toplam Yıllık Gider</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(costCenters.reduce((sum, center) => sum + center.amount, 0))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}