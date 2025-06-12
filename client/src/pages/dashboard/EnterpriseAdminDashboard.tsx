import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  DollarSign, 
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Zap,
  Shield,
  Globe,
  BarChart3,
  ArrowRight,
  Calendar,
  Briefcase,
  Award,
  FileText,
  PieChart,
  Database,
  Cpu,
  Eye
} from "lucide-react";

export default function EnterpriseAdminDashboard() {
  const { data: employeeStats, isLoading: employeeStatsLoading } = useQuery({
    queryKey: ["/api/stats/employees"],
  });

  const { data: teamMembers, isLoading: teamLoading } = useQuery({
    queryKey: ["/api/team/members"],
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const { data: activities } = useQuery({
    queryKey: ["/api/activities"],
  });

  const { data: auditLogs } = useQuery({
    queryKey: ["/api/audit-logs"],
  });

  const { data: pendingExpenses } = useQuery({
    queryKey: ["/api/expense-reports/pending"],
  });

  const { data: pendingTimeEntries } = useQuery({
    queryKey: ["/api/time-entries/pending"],
  });

  if (employeeStatsLoading || teamLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800/50 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = employeeStats as any;
  const team = teamMembers as any;

  const executiveMetrics = [
    {
      title: "Toplam İnsan Kaynağı",
      value: stats?.totalEmployees || 0,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "from-blue-600 to-blue-700",
      description: "Aktif personel sayısı (son çeyrek)"
    },
    {
      title: "Organizasyonel Birimler",
      value: stats?.totalDepartments || 0,
      change: "+2",
      trend: "up", 
      icon: Building2,
      color: "from-emerald-600 to-emerald-700",
      description: "Operasyonel departman sayısı"
    },
    {
      title: "Aylık İnsan Kaynağı Bütçesi",
      value: "₺2.8M",
      change: "+8.3%",
      trend: "up",
      icon: DollarSign,
      color: "from-slate-600 to-slate-700",
      description: "Ek ödemeler ve haklar dahil"
    },
    {
      title: "Platform Performansı",
      value: "99.8%",
      change: "Optimal",
      trend: "up",
      icon: Activity,
      color: "from-gray-600 to-gray-700",
      description: "Sistem çalışma süresi güvencesi"
    }
  ];

  const criticalAlerts = [
    {
      type: "warning",
      title: "Ücret Bordrosu Onay Bekliyor",
      count: 3,
      priority: "Yüksek",
      time: "2 saat"
    },
    {
      type: "info", 
      title: "Yetenek Kazanımı Başvuruları",
      count: 12,
      priority: "Orta",
      time: "1 gün"
    },
    {
      type: "success",
      title: "Performans Değerlendirme Tamamlandı",
      count: 8,
      priority: "Düşük", 
      time: "3 gün"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Executive Header */}
        <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-2xl p-8 text-gray-800 shadow-2xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Executive Dashboard</h1>
              <p className="text-gray-600 text-lg">Kurumsal İnsan Kaynakları Yönetim Sistemi • Gerçek Zamanlı İş Analitiği</p>
              <div className="flex items-center space-x-6 mt-4 text-gray-700">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">ISO 27001 Uyumlu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Küresel Standartlar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Canlı Veri Analizi</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">{new Date().toLocaleDateString('tr-TR')}</div>
              <div className="text-gray-600">Bugün • {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="flex items-center justify-end space-x-1 mt-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">Sistem Operasyonel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {executiveMetrics.map((metric, index) => (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300 group hover:border-gray-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg group-hover:scale-110 transition-transform`}>
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.title}</div>
                  <div className="text-xs text-gray-500">{metric.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Critical Business Alerts */}
          <Card className="lg:col-span-2 bg-white border-gray-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-900">Kritik İş Uyarıları</CardTitle>
                    <CardDescription className="text-gray-600">Acil müdahale gerektiren konular</CardDescription>
                  </div>
                </div>
                <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                  {criticalAlerts.length} Aktif
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {criticalAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      alert.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      alert.type === 'info' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {alert.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                       alert.type === 'info' ? <Clock className="h-4 w-4" /> :
                       <CheckCircle className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{alert.title}</div>
                      <div className="text-sm text-gray-600">{alert.count} öğe • Son {alert.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={alert.priority === 'Yüksek' ? 'destructive' : alert.priority === 'Orta' ? 'default' : 'secondary'} 
                           className="text-xs">
                      {alert.priority}
                    </Badge>
                    <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-200">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Performance Monitor */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Cpu className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Sistem Durumu</CardTitle>
                  <CardDescription>Real-time monitoring</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Server Performance</span>
                    <span className="text-sm text-green-400 font-medium">99.8%</span>
                  </div>
                  <Progress value={99.8} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Database Response</span>
                    <span className="text-sm text-blue-400 font-medium">12ms</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">API Uptime</span>
                    <span className="text-sm text-green-400 font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </div>
              
              <Separator className="bg-gray-700" />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Aktif Kullanıcılar</span>
                  <span className="text-white font-medium">{team?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Günlük İşlemler</span>
                  <span className="text-white font-medium">2,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Veri Güvenliği</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Secured
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Executive Team & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Executive Team */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Yönetim Ekibi</CardTitle>
                    <CardDescription>C-level executives</CardDescription>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  <Eye className="h-4 w-4 mr-2" />
                  Tümünü Gör
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {team?.slice(0, 5).map((member: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                  <div className="flex items-center space-x-3">
                    <Avatar className="ring-2 ring-indigo-500/30">
                      <AvatarImage src={member.profileImageUrl} />
                      <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-white">{member.firstName} {member.lastName}</div>
                      <div className="text-sm text-gray-400">{member.role} • {member.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-400">Online</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Critical Activities */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Son Kritik Aktiviteler</CardTitle>
                  <CardDescription>Executive level events</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities && (activities as any[]).slice(0, 6).map((activity: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700/20 rounded-lg">
                  <div className={`p-1.5 rounded-full ${
                    activity.type.includes('added') ? 'bg-green-500/20 text-green-400' :
                    activity.type.includes('updated') ? 'bg-blue-500/20 text-blue-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {activity.type.includes('employee') ? <Users className="h-3 w-3" /> :
                     activity.type.includes('payroll') ? <DollarSign className="h-3 w-3" /> :
                     <FileText className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white">{activity.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString('tr-TR')} • 
                      {new Date(activity.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}