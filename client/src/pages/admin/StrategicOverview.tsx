import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Download, 
  Users,
  Building2,
  DollarSign,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Activity,
  Briefcase,
  BarChart3,
  PieChart,
  Globe,
  Zap,
  Shield,
  Clock,
  Star,
  UserCheck,
  Building,
  Brain,
  Rocket,
  MapPin,
  Database,
  Cpu,
  HardDrive,
  Network,
  Gauge,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

export default function StrategicOverview() {
  const [timeRange, setTimeRange] = useState("quarterly");
  const [selectedView, setSelectedView] = useState("overview");

  // API Data Queries
  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/stats/dashboard"]
  });

  const { data: companyStats } = useQuery({
    queryKey: ["/api/stats/companies"]
  });

  const { data: employeeStats } = useQuery({
    queryKey: ["/api/stats/employees"]
  });

  const { data: systemHealth } = useQuery({
    queryKey: ["/api/system/health"]
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["/api/companies"]
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"]
  });

  const { data: performanceHistory } = useQuery({
    queryKey: ["/api/system/performance-history"]
  });

  // Chart Data Processing
  const companyGrowthData = [
    { month: 'Oca', companies: 72, employees: 1150 },
    { month: 'Şub', companies: 75, employees: 1185 },
    { month: 'Mar', companies: 78, employees: 1210 },
    { month: 'Nis', companies: 82, employees: 1235 },
    { month: 'May', companies: 85, employees: 1247 },
  ];

  const revenueData = [
    { month: 'Oca', revenue: 12500000, target: 12000000 },
    { month: 'Şub', revenue: 13200000, target: 12500000 },
    { month: 'Mar', revenue: 14100000, target: 13000000 },
    { month: 'Nis', revenue: 14800000, target: 13500000 },
    { month: 'May', revenue: 15250000, target: 14000000 },
  ];

  const departmentData = [
    { name: 'İK', value: 35, color: '#3b82f6' },
    { name: 'Muhasebe', value: 28, color: '#10b981' },
    { name: 'Satış', value: 22, color: '#f59e0b' },
    { name: 'Pazarlama', value: 15, color: '#ef4444' },
  ];

  const performanceMetrics = [
    { metric: 'Çalışan Memnuniyeti', current: 87, target: 85, trend: 'up' },
    { metric: 'Şirket Büyümesi', current: 12.5, target: 10, trend: 'up' },
    { metric: 'Operasyonel Verimlilik', current: 94, target: 90, trend: 'up' },
    { metric: 'İnovasyon Endeksi', current: 78, target: 80, trend: 'down' },
  ];

  const strategicGoals = [
    { 
      title: 'Dijital Dönüşüm',
      progress: 75,
      deadline: '2024 Q3',
      status: 'on-track',
      initiatives: 3
    },
    { 
      title: 'Sürdürülebilirlik',
      progress: 60,
      deadline: '2024 Q4',
      status: 'at-risk',
      initiatives: 5
    },
    { 
      title: 'Küresel Genişleme',
      progress: 45,
      deadline: '2025 Q1',
      status: 'on-track',
      initiatives: 7
    },
    { 
      title: 'Yetenek Yönetimi',
      progress: 85,
      deadline: '2024 Q2',
      status: 'ahead',
      initiatives: 4
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ahead': return 'text-green-600 bg-green-50 border-green-200';
      case 'on-track': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'at-risk': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'behind': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'ahead': return 'Hedefin Önünde';
      case 'on-track': return 'Hedefte';
      case 'at-risk': return 'Risk Altında';
      case 'behind': return 'Geride';
      default: return 'Belirsiz';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Stratejik Genel Bakış
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Kurumsal performans ve stratejik hedeflerin kapsamlı analizi
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Son Hafta</SelectItem>
                <SelectItem value="monthly">Son Ay</SelectItem>
                <SelectItem value="quarterly">Son Çeyrek</SelectItem>
                <SelectItem value="yearly">Son Yıl</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Download className="w-4 h-4 mr-2" />
              Rapor İndir
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Toplam Şirket</p>
                  <p className="text-3xl font-bold">{companyStats?.total || 85}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-300" />
                    <span className="text-green-300 text-sm ml-1">+{companyStats?.growth || 12.5}%</span>
                  </div>
                </div>
                <Building2 className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Toplam Çalışan</p>
                  <p className="text-3xl font-bold">{dashboardStats?.totalEmployees || 1247}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-300" />
                    <span className="text-green-300 text-sm ml-1">+{dashboardStats?.newEmployeesThisMonth || 23} bu ay</span>
                  </div>
                </div>
                <Users className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Toplam Gelir</p>
                  <p className="text-3xl font-bold">{dashboardStats?.totalRevenue || "₺15,250,000"}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-300" />
                    <span className="text-green-300 text-sm ml-1">+8.2%</span>
                  </div>
                </div>
                <DollarSign className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Performans Skoru</p>
                  <p className="text-3xl font-bold">{dashboardStats?.performanceScore || 87.5}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-300" />
                    <span className="text-green-300 text-sm ml-1">+2.1%</span>
                  </div>
                </div>
                <Target className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Performans
            </TabsTrigger>
            <TabsTrigger value="strategic" className="flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Stratejik Hedefler
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Analitik
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Growth Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    Şirket ve Çalışan Büyümesi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={companyGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'companies' ? value + ' şirket' : value + ' çalışan',
                          name === 'companies' ? 'Şirket Sayısı' : 'Çalışan Sayısı'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="companies" 
                        stackId="1"
                        stroke="#3b82f6" 
                        fill="url(#companyGradient)"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="employees" 
                        stackId="2"
                        stroke="#10b981" 
                        fill="url(#employeeGradient)"
                      />
                      <defs>
                        <linearGradient id="companyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="employeeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue Growth Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Gelir Büyümesi vs Hedef
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(Number(value)), 'Tutar']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        name="Gerçekleşen"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#6b7280" 
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        name="Hedef"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Department Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-600" />
                    Departman Dağılımı
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-0 shadow-lg lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    Hızlı İstatistikler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Aktif İzinler</span>
                        <span className="font-semibold">{dashboardStats?.activeLeaves || 23}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Aylık Bordro</span>
                        <span className="font-semibold">{dashboardStats?.monthlyPayroll || "₺2,500,000"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Ortalama Performans</span>
                        <span className="font-semibold">{dashboardStats?.avgPerformance || "4.2"}/5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Sistem Çalışma Süresi</span>
                        <span className="font-semibold">{systemHealth?.uptime || 99.8}%</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Aktif Kullanıcılar</span>
                        <span className="font-semibold">{systemHealth?.activeUsers || 147}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Yanıt Süresi</span>
                        <span className="font-semibold">{systemHealth?.responseTime || 245}ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Sistem Yükü</span>
                        <span className="font-semibold">{systemHealth?.systemLoad || 34.2}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Bellek Kullanımı</span>
                        <span className="font-semibold">{systemHealth?.memoryUsage || 68.5}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {performanceMetrics.map((metric, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{metric.metric}</h3>
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Mevcut</span>
                        <span className="font-semibold text-xl">{metric.current}%</span>
                      </div>
                      <Progress value={metric.current} className="h-3" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Hedef: {metric.target}%</span>
                        <span className={`font-medium ${
                          metric.current >= metric.target ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {metric.current >= metric.target ? 'Hedefte' : 'Hedefin Altında'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Strategic Goals Tab */}
          <TabsContent value="strategic" className="space-y-6">
            <div className="grid gap-6">
              {strategicGoals.map((goal, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Target className="w-6 h-6 text-blue-600" />
                        <h3 className="font-semibold text-xl">{goal.title}</h3>
                      </div>
                      <Badge className={`${getStatusColor(goal.status)} border`}>
                        {getStatusText(goal.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">İlerleme</span>
                            <span className="font-semibold">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-3" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Hedef Tarih</span>
                          <span className="font-medium">{goal.deadline}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Girişimler</span>
                          <span className="font-medium">{goal.initiatives} aktif</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Gelişmiş Analitik
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Öngörü Analizi</h4>
                      <p className="text-sm text-blue-700">
                        Mevcut büyüme trendine göre, önümüzdeki çeyrekte %15 büyüme bekleniyor.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">Risk Analizi</h4>
                      <p className="text-sm text-green-700">
                        Düşük risk seviyesi. Tüm kritik göstergeler normal aralıkta.
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-2">Fırsat Analizi</h4>
                      <p className="text-sm text-orange-700">
                        Yeni pazar segmentlerinde %22 büyüme potansiyeli tespit edildi.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-indigo-600" />
                    Performans Özeti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Genel Performans</span>
                        <span className="text-lg font-bold text-green-600">Mükemmel</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Finansal Sağlık</span>
                        <span className="text-lg font-bold text-blue-600">Çok İyi</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Operasyonel Verimlilik</span>
                        <span className="text-lg font-bold text-purple-600">İyi</span>
                      </div>
                      <Progress value={84} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">İnovasyon Kapasitesi</span>
                        <span className="text-lg font-bold text-orange-600">Orta</span>
                      </div>
                      <Progress value={76} className="h-2" />
                    </div>
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