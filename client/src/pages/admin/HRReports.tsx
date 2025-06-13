import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Award, 
  Calendar,
  Clock,
  FileText,
  Download,
  Target,
  Building2,
  UserCheck,
  UserX,
  Star,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export default function HRReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("Q4-2024");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const { data: employeeData = [], isLoading: empLoading } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: performanceData = [], isLoading: perfLoading } = useQuery({
    queryKey: ["/api/performance"],
  });

  const { data: leaveData = [], isLoading: leaveLoading } = useQuery({
    queryKey: ["/api/leaves"],
  });

  // Comprehensive HR sample data
  const hrMetrics = {
    totalEmployees: 156,
    activeEmployees: 148,
    newHires: 12,
    turnover: 8,
    avgTenure: 2.8,
    satisfactionScore: 4.2
  };

  const departmentMetrics = [
    { 
      name: "Yazılım Geliştirme", 
      employees: 45, 
      avgPerformance: 4.3, 
      turnover: 8.9, 
      satisfaction: 4.4,
      avgSalary: 85000,
      openPositions: 3
    },
    { 
      name: "İnsan Kaynakları", 
      employees: 12, 
      avgPerformance: 4.1, 
      turnover: 5.2, 
      satisfaction: 4.2,
      avgSalary: 65000,
      openPositions: 1
    },
    { 
      name: "Pazarlama", 
      employees: 28, 
      avgPerformance: 4.0, 
      turnover: 12.1, 
      satisfaction: 3.9,
      avgSalary: 58000,
      openPositions: 2
    },
    { 
      name: "Finans", 
      employees: 18, 
      avgPerformance: 4.2, 
      turnover: 6.3, 
      satisfaction: 4.1,
      avgSalary: 72000,
      openPositions: 0
    },
    { 
      name: "Operasyon", 
      employees: 35, 
      avgPerformance: 3.8, 
      turnover: 15.4, 
      satisfaction: 3.7,
      avgSalary: 52000,
      openPositions: 4
    },
    { 
      name: "Satış", 
      employees: 18, 
      avgPerformance: 3.9, 
      turnover: 18.2, 
      satisfaction: 3.8,
      avgSalary: 55000,
      openPositions: 2
    }
  ];

  const topPerformers = [
    { name: "Ahmet Yılmaz", department: "Yazılım Geliştirme", score: 4.8, position: "Senior Developer", improvement: 12 },
    { name: "Zeynep Kaya", department: "Pazarlama", score: 4.7, position: "Marketing Manager", improvement: 8 },
    { name: "Mehmet Demir", department: "Finans", score: 4.6, position: "Financial Analyst", improvement: 15 },
    { name: "Ayşe Özkan", department: "İK", score: 4.6, position: "HR Specialist", improvement: 10 },
    { name: "Can Arslan", department: "Yazılım Geliştirme", score: 4.5, position: "Tech Lead", improvement: 7 }
  ];

  const recentHires = [
    { name: "Emre Şahin", department: "Yazılım Geliştirme", position: "Frontend Developer", startDate: "2024-11-15", status: "probation" },
    { name: "Seda Yıldız", department: "Pazarlama", position: "Digital Marketing Specialist", startDate: "2024-11-08", status: "probation" },
    { name: "Burak Çelik", department: "Satış", position: "Sales Representative", startDate: "2024-10-22", status: "active" },
    { name: "Fatma Gül", department: "Operasyon", position: "Operations Specialist", startDate: "2024-10-15", status: "active" },
    { name: "Oğuz Kara", department: "Finans", position: "Junior Analyst", startDate: "2024-10-01", status: "active" }
  ];

  const leaveAnalysis = [
    { type: "Yıllık İzin", total: 145, approved: 138, pending: 7, avgDays: 12 },
    { type: "Hastalık İzni", total: 89, approved: 85, pending: 4, avgDays: 3 },
    { type: "Mazeret İzni", total: 34, approved: 32, pending: 2, avgDays: 1 },
    { type: "Doğum İzni", total: 8, approved: 8, pending: 0, avgDays: 90 },
    { type: "Babalık İzni", total: 12, approved: 12, pending: 0, avgDays: 15 }
  ];

  const trainingPrograms = [
    { name: "Liderlik Gelişimi", participants: 24, completion: 87, satisfaction: 4.3, duration: "3 ay" },
    { name: "Teknik Eğitimler", participants: 52, completion: 92, satisfaction: 4.5, duration: "6 hafta" },
    { name: "Müşteri Hizmetleri", participants: 18, completion: 94, satisfaction: 4.1, duration: "2 hafta" },
    { name: "Proje Yönetimi", participants: 15, completion: 80, satisfaction: 4.4, duration: "4 hafta" },
    { name: "Dijital Beceriler", participants: 38, completion: 89, satisfaction: 4.2, duration: "8 hafta" }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 4.5) return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Mükemmel</Badge>;
    if (score >= 4.0) return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">İyi</Badge>;
    if (score >= 3.5) return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Orta</Badge>;
    return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Gelişim Gerekli</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Aktif</Badge>;
      case 'probation':
        return <Badge variant="secondary">Deneme Süresi</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Pasif</Badge>;
      default:
        return <Badge variant="lightgray">{status}</Badge>;
    }
  };

  if (empLoading || perfLoading || leaveLoading) {
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
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">İK Raporları</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Çalışan performansı, devamsızlık ve İK metrikleri</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Q4-2024">Q4 2024</SelectItem>
              <SelectItem value="Q3-2024">Q3 2024</SelectItem>
              <SelectItem value="Q2-2024">Q2 2024</SelectItem>
              <SelectItem value="Q1-2024">Q1 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="lightgray" className="bg-white dark:bg-gray-800">
            <Download className="h-4 w-4 mr-2" />
            Excel İndir
          </Button>
        </div>
      </div>

      {/* Key HR Metrics */}
      <div className="grid gap-6 md:grid-cols-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Toplam Çalışan</CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{hrMetrics.totalEmployees}</div>
            <p className="text-xs text-blue-600 dark:text-blue-300">Aktif: {hrMetrics.activeEmployees}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">Yeni İşe Alım</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">+{hrMetrics.newHires}</div>
            <p className="text-xs text-green-600 dark:text-green-300">Bu çeyrek</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">İşten Ayrılma</CardTitle>
            <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">-{hrMetrics.turnover}</div>
            <p className="text-xs text-red-600 dark:text-red-300">%5.1 oran</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Ortalama Kıdem</CardTitle>
            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{hrMetrics.avgTenure}</div>
            <p className="text-xs text-purple-600 dark:text-purple-300">yıl</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">Memnuniyet</CardTitle>
            <Star className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{hrMetrics.satisfactionScore}</div>
            <p className="text-xs text-orange-600 dark:text-orange-300">/ 5.0</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-900 dark:text-indigo-100">Açık Pozisyon</CardTitle>
            <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
              {departmentMetrics.reduce((sum, dept) => sum + dept.openPositions, 0)}
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-300">aktif ilan</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="performance">Performans</TabsTrigger>
          <TabsTrigger value="attendance">Devamsızlık</TabsTrigger>
          <TabsTrigger value="training">Eğitimler</TabsTrigger>
          <TabsTrigger value="recruitment">İşe Alım</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Departman Bazlı Analiz</CardTitle>
                <CardDescription>Departmanların İK performans metrikleri</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Departman</TableHead>
                      <TableHead>Çalışan</TableHead>
                      <TableHead>Performans</TableHead>
                      <TableHead>Turnover</TableHead>
                      <TableHead>Memnuniyet</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentMetrics.map((dept) => (
                      <TableRow key={dept.name}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>{dept.employees}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{dept.avgPerformance}</span>
                            {getPerformanceBadge(dept.avgPerformance)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {dept.turnover > 10 ? <TrendingUp className="h-4 w-4 text-red-500" /> : <TrendingDown className="h-4 w-4 text-green-500" />}
                            <span className={dept.turnover > 10 ? "text-red-600" : "text-green-600"}>
                              %{dept.turnover}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{dept.satisfaction}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>En İyi Performans Gösterenler</CardTitle>
                <CardDescription>Çeyreklik performans liderleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <div key={performer.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="lightgray" className="w-8 h-8 p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{performer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{performer.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{performer.position}</div>
                          <div className="text-xs text-gray-500">{performer.department}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{performer.score}</div>
                        <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +{performer.improvement}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Performans Dağılımı</CardTitle>
                <CardDescription>Çalışanların performans skorları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mükemmel (4.5+)</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={28} className="w-20 h-2" />
                      <span className="text-sm font-medium">28%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">İyi (4.0-4.4)</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={45} className="w-20 h-2" />
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Orta (3.5-3.9)</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={22} className="w-20 h-2" />
                      <span className="text-sm font-medium">22%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gelişim Gerekli (3.5 altı)</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={5} className="w-20 h-2" />
                      <span className="text-sm font-medium">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Departman Performansı</CardTitle>
                <CardDescription>Ortalama performans skorları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departmentMetrics.map((dept) => (
                    <div key={dept.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{dept.name}</span>
                        <span className="font-medium">{dept.avgPerformance}</span>
                      </div>
                      <Progress value={dept.avgPerformance * 20} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performans Trendleri</CardTitle>
                <CardDescription>Çeyreklik değişim</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Genel Artış</span>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="font-bold">+8.5%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Hedef Gerçekleşme</span>
                      <div className="flex items-center text-blue-600">
                        <Target className="h-4 w-4 mr-1" />
                        <span className="font-bold">92%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Ortalama Skor</span>
                      <div className="flex items-center text-purple-600">
                        <Star className="h-4 w-4 mr-1" />
                        <span className="font-bold">4.12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>İzin Analizi</CardTitle>
              <CardDescription>İzin türleri ve kullanım istatistikleri</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>İzin Türü</TableHead>
                    <TableHead>Toplam Talep</TableHead>
                    <TableHead>Onaylanan</TableHead>
                    <TableHead>Bekleyen</TableHead>
                    <TableHead>Ortalama Gün</TableHead>
                    <TableHead>Onay Oranı</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveAnalysis.map((leave) => (
                    <TableRow key={leave.type}>
                      <TableCell className="font-medium">{leave.type}</TableCell>
                      <TableCell>{leave.total}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{leave.approved}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span>{leave.pending}</span>
                        </div>
                      </TableCell>
                      <TableCell>{leave.avgDays} gün</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={(leave.approved / leave.total) * 100} className="w-16 h-2" />
                          <span className="text-sm">%{Math.round((leave.approved / leave.total) * 100)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eğitim Programları</CardTitle>
              <CardDescription>Aktif eğitim programları ve tamamlanma oranları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {trainingPrograms.map((program) => (
                  <div key={program.name} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{program.name}</h4>
                      <Badge variant="lightgray">{program.duration}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Katılımcı: {program.participants}</span>
                        <span>Tamamlama: %{program.completion}</span>
                      </div>
                      <Progress value={program.completion} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>Memnuniyet: {program.satisfaction}</span>
                        </div>
                        <span className={`${program.completion > 90 ? 'text-green-600' : program.completion > 70 ? 'text-blue-600' : 'text-orange-600'}`}>
                          {program.completion > 90 ? 'Excellent' : program.completion > 70 ? 'Good' : 'Needs Attention'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recruitment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Yeni İşe Alımlar</CardTitle>
              <CardDescription>Son dönemde işe alınan çalışanlar</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Çalışan</TableHead>
                    <TableHead>Departman</TableHead>
                    <TableHead>Pozisyon</TableHead>
                    <TableHead>Başlangıç Tarihi</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentHires.map((hire) => (
                    <TableRow key={hire.name}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{hire.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{hire.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{hire.department}</TableCell>
                      <TableCell>{hire.position}</TableCell>
                      <TableCell>{new Date(hire.startDate).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{getStatusBadge(hire.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>İşe Alım Hedefleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Q4 Hedefi</span>
                    <span className="font-bold">15 kişi</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gerçekleşen</span>
                    <span className="font-bold text-green-600">{hrMetrics.newHires} kişi</span>
                  </div>
                  <Progress value={(hrMetrics.newHires / 15) * 100} className="h-3" />
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    %{Math.round((hrMetrics.newHires / 15) * 100)} tamamlandı
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>İşe Alım Süreci</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Ortalama Süre</span>
                    <span className="font-medium">28 gün</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Başvuru/Teklif Oranı</span>
                    <span className="font-medium">12:1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mülakat Başarı Oranı</span>
                    <span className="font-medium">%68</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Teklif Kabul Oranı</span>
                    <span className="font-medium">%89</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kaynak Analizi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Kariyer Sitesi</span>
                    <span className="font-medium">%42</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Referans</span>
                    <span className="font-medium">%31</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>LinkedIn</span>
                    <span className="font-medium">%18</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Diğer</span>
                    <span className="font-medium">%9</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}