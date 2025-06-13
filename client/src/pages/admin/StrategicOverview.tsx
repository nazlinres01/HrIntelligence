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
  Award,
  AlertTriangle,
  CheckCircle,
  Activity,
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
  ArrowDownRight,
  Calendar,
  Filter,
  RefreshCw,
  Eye,
  Settings,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, RadialBarChart, RadialBar, ComposedChart, Pie } from 'recharts';

export default function StrategicOverview() {
  const [timeRange, setTimeRange] = useState("quarterly");
  const [selectedView, setSelectedView] = useState("executive");
  const [refreshing, setRefreshing] = useState(false);

  // API Data Queries
  const { data: dashboardStats, refetch: refetchDashboard } = useQuery({
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

  // Enhanced Chart Data
  const executiveMetrics = [
    { 
      title: "Operasyonel Mükemmellik", 
      value: 94, 
      target: 90, 
      trend: 8.2, 
      status: "excellent",
      color: "#10b981"
    },
    { 
      title: "Finansal Performans", 
      value: 89, 
      target: 85, 
      trend: 12.5, 
      status: "good",
      color: "#3b82f6"
    },
    { 
      title: "İnsan Kaynakları", 
      value: 87, 
      target: 80, 
      trend: 5.7, 
      status: "good",
      color: "#8b5cf6"
    },
    { 
      title: "Teknoloji & İnovasyon", 
      value: 76, 
      target: 75, 
      trend: -2.1, 
      status: "warning",
      color: "#f59e0b"
    },
  ];

  const monthlyPerformance = [
    { month: 'Ocak', revenue: 12500000, employees: 1150, efficiency: 85, satisfaction: 82 },
    { month: 'Şubat', revenue: 13200000, employees: 1185, efficiency: 87, satisfaction: 84 },
    { month: 'Mart', revenue: 14100000, employees: 1210, efficiency: 89, satisfaction: 86 },
    { month: 'Nisan', revenue: 14800000, employees: 1235, efficiency: 91, satisfaction: 87 },
    { month: 'Mayıs', revenue: 15250000, employees: 1247, efficiency: 94, satisfaction: 89 },
  ];

  const departmentPerformance = [
    { name: 'İnsan Kaynakları', budget: 2500000, spent: 2100000, efficiency: 94, headcount: 35 },
    { name: 'Teknoloji', budget: 5000000, spent: 4200000, efficiency: 91, headcount: 128 },
    { name: 'Satış', budget: 3200000, spent: 2950000, efficiency: 88, headcount: 95 },
    { name: 'Pazarlama', budget: 2800000, spent: 2600000, efficiency: 85, headcount: 42 },
    { name: 'Operasyon', budget: 4100000, spent: 3800000, efficiency: 92, headcount: 156 },
  ];

  const strategicInitiatives = [
    {
      title: "Dijital Dönüşüm 2024",
      category: "Teknoloji",
      progress: 78,
      budget: 8500000,
      spent: 6200000,
      timeline: "Q4 2024",
      risk: "düşük",
      impact: "yüksek",
      owner: "CTO",
      milestones: { completed: 12, total: 16 }
    },
    {
      title: "Sürdürülebilirlik Programı",
      category: "Operasyon",
      progress: 65,
      budget: 3200000,
      spent: 1950000,
      timeline: "Q1 2025",
      risk: "orta",
      impact: "yüksek",
      owner: "COO",
      milestones: { completed: 8, total: 14 }
    },
    {
      title: "Global Pazar Genişleme",
      category: "Stratejik",
      progress: 43,
      budget: 12000000,
      spent: 4800000,
      timeline: "Q2 2025",
      risk: "yüksek",
      impact: "kritik",
      owner: "CEO",
      milestones: { completed: 6, total: 18 }
    },
    {
      title: "Çalışan Deneyimi Programı",
      category: "İK",
      progress: 89,
      budget: 1800000,
      spent: 1450000,
      timeline: "Q3 2024",
      risk: "düşük",
      impact: "orta",
      owner: "CHRO",
      milestones: { completed: 15, total: 17 }
    }
  ];

  const kpiTrends = [
    { period: 'Q1 2024', customerSat: 82, employeeSat: 79, revenue: 42500000, efficiency: 85 },
    { period: 'Q2 2024', customerSat: 85, employeeSat: 82, revenue: 45200000, efficiency: 88 },
    { period: 'Q3 2024', customerSat: 87, employeeSat: 84, revenue: 47100000, efficiency: 91 },
    { period: 'Q4 2024', customerSat: 89, employeeSat: 87, revenue: 48800000, efficiency: 94 },
    { period: 'Q1 2025', customerSat: 91, employeeSat: 89, revenue: 50250000, efficiency: 96 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'düşük': return 'text-green-600 bg-green-50 border-green-200';
      case 'orta': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'yüksek': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'kritik': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'yüksek': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'orta': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchDashboard();
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-8xl mx-auto space-y-8">
        
        {/* Executive Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 p-8 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-5xl font-bold mb-3">
                  Stratejik Genel Bakış
                </h1>
                <p className="text-xl text-indigo-100 mb-4">
                  Kurumsal performans ve stratejik hedeflerin kapsamlı yönetici özeti
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{dashboardStats?.totalEmployees || 1247} Çalışan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{companyStats?.total || 85} Şirket</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Son Hafta</SelectItem>
                    <SelectItem value="monthly">Son Ay</SelectItem>
                    <SelectItem value="quarterly">Son Çeyrek</SelectItem>
                    <SelectItem value="yearly">Son Yıl</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Yenile
                </Button>
                
                <Button className="bg-white text-indigo-900 hover:bg-indigo-50">
                  <Download className="w-4 h-4 mr-2" />
                  Rapor İndir
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Executive KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {executiveMetrics.map((metric, index) => (
            <Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-3xl font-bold" style={{ color: metric.color }}>{metric.value}%</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${metric.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.trend > 0 ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{Math.abs(metric.trend)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hedef: {metric.target}%</span>
                    <Badge className={`${metric.value >= metric.target ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'} border-0`}>
                      {metric.value >= metric.target ? 'Hedefte' : 'Geride'}
                    </Badge>
                  </div>
                  <Progress value={metric.value} className="h-2" style={{ 
                    '--progress-background': metric.color 
                  } as React.CSSProperties} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="executive" className="flex items-center gap-2 data-[state=active]:bg-white">
              <Star className="w-4 h-4" />
              Yönetici Özeti
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-white">
              <BarChart3 className="w-4 h-4" />
              Performans
            </TabsTrigger>
            <TabsTrigger value="initiatives" className="flex items-center gap-2 data-[state=active]:bg-white">
              <Rocket className="w-4 h-4" />
              Stratejik Girişimler
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-white">
              <Brain className="w-4 h-4" />
              Gelişmiş Analitik
            </TabsTrigger>
          </TabsList>

          {/* Executive Summary Tab */}
          <TabsContent value="executive" className="space-y-6">
            {/* Monthly Performance Trend */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Aylık Performans Trendi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'revenue') return [formatCurrency(Number(value)), 'Gelir'];
                        if (name === 'employees') return [value + ' kişi', 'Çalışan Sayısı'];
                        if (name === 'efficiency') return [value + '%', 'Verimlilik'];
                        if (name === 'satisfaction') return [value + '%', 'Memnuniyet'];
                        return [value, name];
                      }}
                    />
                    <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="revenue" />
                    <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} name="efficiency" />
                    <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#8b5cf6" strokeWidth={3} name="satisfaction" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Performance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-purple-600" />
                    Departman Performansı
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentPerformance.map((dept, index) => (
                      <div key={index} className="p-4 rounded-lg bg-gray-50 border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{dept.name}</h4>
                          <Badge className="bg-blue-100 text-blue-800 border-0">
                            {dept.efficiency}% Verimli
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Bütçe:</span>
                            <p className="font-medium">{formatCurrency(dept.budget)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Harcanan:</span>
                            <p className="font-medium">{formatCurrency(dept.spent)}</p>
                          </div>
                        </div>
                        <Progress value={(dept.spent / dept.budget) * 100} className="mt-3 h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Çeyreklik KPI Trendi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={kpiTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="customerSat" 
                        stackId="1"
                        stroke="#3b82f6" 
                        fill="#3b82f6"
                        fillOpacity={0.6}
                        name="Müşteri Memnuniyeti"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="employeeSat" 
                        stackId="2"
                        stroke="#10b981" 
                        fill="#10b981"
                        fillOpacity={0.6}
                        name="Çalışan Memnuniyeti"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Real-time Metrics */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Gerçek Zamanlı Metrikler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {systemHealth?.uptime || 99.8}%
                      </div>
                      <p className="text-sm text-gray-600">Sistem Çalışma Süresi</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {systemHealth?.activeUsers || 147}
                      </div>
                      <p className="text-sm text-gray-600">Aktif Kullanıcı</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {systemHealth?.responseTime || 245}ms
                      </div>
                      <p className="text-sm text-gray-600">Ortalama Yanıt Süresi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Sistem Sağlığı
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">CPU Kullanımı</span>
                          <span className="text-sm text-gray-600">{systemHealth?.systemLoad || 34.2}%</span>
                        </div>
                        <Progress value={systemHealth?.systemLoad || 34.2} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Bellek Kullanımı</span>
                          <span className="text-sm text-gray-600">{systemHealth?.memoryUsage || 68.5}%</span>
                        </div>
                        <Progress value={systemHealth?.memoryUsage || 68.5} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Disk Kullanımı</span>
                          <span className="text-sm text-gray-600">{systemHealth?.diskUsage || 42.1}%</span>
                        </div>
                        <Progress value={systemHealth?.diskUsage || 42.1} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Veritabanı Durumu</span>
                          <Badge className="bg-green-100 text-green-800 border-0">
                            {systemHealth?.database ? 'Sağlıklı' : 'Sorunlu'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Strategic Initiatives Tab */}
          <TabsContent value="initiatives" className="space-y-6">
            <div className="grid gap-6">
              {strategicInitiatives.map((initiative, index) => (
                <Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Initiative Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{initiative.title}</h3>
                            <Badge className="bg-indigo-100 text-indigo-800 border-0 mb-2">
                              {initiative.category}
                            </Badge>
                            <p className="text-sm text-gray-600">Sahip: {initiative.owner}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getRiskColor(initiative.risk)} border mb-2`}>
                              Risk: {initiative.risk}
                            </Badge>
                            <br />
                            <Badge className={`${getImpactColor(initiative.impact)} border`}>
                              Etki: {initiative.impact}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">İlerleme</span>
                              <span className="text-lg font-bold text-blue-600">{initiative.progress}%</span>
                            </div>
                            <Progress value={initiative.progress} className="h-3" />
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Hedef Tarih</span>
                            <span className="font-medium">{initiative.timeline}</span>
                          </div>
                        </div>
                      </div>

                      {/* Budget & Milestones */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Bütçe Durumu</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Toplam:</span>
                              <span className="font-medium">{formatCurrency(initiative.budget)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Harcanan:</span>
                              <span className="font-medium">{formatCurrency(initiative.spent)}</span>
                            </div>
                            <Progress value={(initiative.spent / initiative.budget) * 100} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Kilometre Taşları</h4>
                          <div className="flex items-center gap-3">
                            <div className="text-2xl font-bold text-green-600">
                              {initiative.milestones.completed}
                            </div>
                            <div className="text-gray-400">/</div>
                            <div className="text-2xl font-bold text-gray-600">
                              {initiative.milestones.total}
                            </div>
                          </div>
                          <Progress 
                            value={(initiative.milestones.completed / initiative.milestones.total) * 100} 
                            className="h-2 mt-2" 
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Advanced Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Öngörü Analitiği
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Gelir Projeksiyonu</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Mevcut büyüme trendine göre 2024 yıl sonu gelir projeksiyonu:
                      </p>
                      <div className="text-2xl font-bold text-blue-900">₺187.5M</div>
                      <div className="text-sm text-blue-600">+18.2% YoY büyüme</div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">Çalışan Analizi</h4>
                      <p className="text-sm text-green-700 mb-3">
                        Optimum takım büyüklüğü ve performans korelasyonu:
                      </p>
                      <div className="text-2xl font-bold text-green-900">1,485</div>
                      <div className="text-sm text-green-600">Önerilen çalışan sayısı</div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-2">Risk Değerlendirmesi</h4>
                      <p className="text-sm text-orange-700 mb-3">
                        Kritik risk faktörleri ve önlem önerileri:
                      </p>
                      <div className="text-2xl font-bold text-orange-900">Düşük</div>
                      <div className="text-sm text-orange-600">Genel risk seviyesi</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-indigo-600" />
                    Performans Skorları
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        A+
                      </div>
                      <p className="text-lg font-semibold text-gray-700">Genel Performans Notu</p>
                      <p className="text-sm text-gray-600">En yüksek %10'luk dilimde</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Finansal Sağlık</span>
                          <span className="font-bold text-green-600">96/100</span>
                        </div>
                        <Progress value={96} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Operasyonel Mükemmellik</span>
                          <span className="font-bold text-blue-600">94/100</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">İnovasyon Kapasitesi</span>
                          <span className="font-bold text-purple-600">87/100</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Sürdürülebilirlik</span>
                          <span className="font-bold text-orange-600">83/100</span>
                        </div>
                        <Progress value={83} className="h-2" />
                      </div>
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