import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Database, 
  Wifi, 
  Server, 
  Monitor,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Globe,
  Zap,
  Eye,
  RefreshCw,
  Download,
  Settings,
  Bell,
  Shield
} from "lucide-react";

export default function SystemMonitoring() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("1h");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: systemMetrics, refetch: refetchMetrics } = useQuery({
    queryKey: ["/api/system/metrics", selectedTimeRange],
    refetchInterval: autoRefresh ? 30000 : false, // 30 saniyede bir yenile
  });

  const { data: serverHealth } = useQuery({
    queryKey: ["/api/system/health"],
    refetchInterval: autoRefresh ? 10000 : false, // 10 saniyede bir yenile
  });

  const { data: networkStats } = useQuery({
    queryKey: ["/api/system/network"],
    refetchInterval: autoRefresh ? 15000 : false,
  });

  const { data: activeUsers } = useQuery({
    queryKey: ["/api/system/active-users"],
    refetchInterval: autoRefresh ? 20000 : false,
  });

  const { data: systemAlerts } = useQuery({
    queryKey: ["/api/system/alerts"],
    refetchInterval: autoRefresh ? 5000 : false,
  });

  const { data: performanceHistory } = useQuery({
    queryKey: ["/api/system/performance-history", selectedTimeRange],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-emerald-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'bg-red-500';
    if (usage >= 70) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}g ${hours}s ${minutes}d`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Sistem İzleme</h2>
            <p className="text-gray-600">Gerçek zamanlı sistem performansı ve kaynak kullanımı</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5m">Son 5 Dakika</SelectItem>
                <SelectItem value="1h">Son 1 Saat</SelectItem>
                <SelectItem value="24h">Son 24 Saat</SelectItem>
                <SelectItem value="7d">Son 7 Gün</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline"
              onClick={() => refetchMetrics()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Yenile
            </Button>
            <Button 
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <Activity className="w-4 h-4 mr-2" />
              {autoRefresh ? "Canlı" : "Durdur"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CPU Kullanımı</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {systemMetrics?.cpu?.usage || 0}%
                  </p>
                  <div className="mt-2">
                    <Progress 
                      value={systemMetrics?.cpu?.usage || 0} 
                      className={`h-2 ${getUsageColor(systemMetrics?.cpu?.usage || 0)}`}
                    />
                  </div>
                </div>
                <Cpu className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">RAM Kullanımı</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {systemMetrics?.memory?.usage || 0}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatBytes(systemMetrics?.memory?.used || 0)} / {formatBytes(systemMetrics?.memory?.total || 0)}
                  </p>
                  <div className="mt-2">
                    <Progress 
                      value={systemMetrics?.memory?.usage || 0} 
                      className={`h-2 ${getUsageColor(systemMetrics?.memory?.usage || 0)}`}
                    />
                  </div>
                </div>
                <HardDrive className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disk Kullanımı</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {systemMetrics?.disk?.usage || 0}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatBytes(systemMetrics?.disk?.used || 0)} / {formatBytes(systemMetrics?.disk?.total || 0)}
                  </p>
                  <div className="mt-2">
                    <Progress 
                      value={systemMetrics?.disk?.usage || 0} 
                      className={`h-2 ${getUsageColor(systemMetrics?.disk?.usage || 0)}`}
                    />
                  </div>
                </div>
                <Database className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {activeUsers?.count || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activeUsers?.sessions || 0} aktif oturum
                  </p>
                </div>
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="performance">Performans</TabsTrigger>
            <TabsTrigger value="network">Ağ</TabsTrigger>
            <TabsTrigger value="services">Servisler</TabsTrigger>
            <TabsTrigger value="alerts">Uyarılar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Server Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Sunucu Durumu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="font-medium text-emerald-900">Web Sunucusu</p>
                        <p className="text-sm text-emerald-700">Nginx - Çalışıyor</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">Çevrimiçi</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="font-medium text-emerald-900">Veritabanı</p>
                        <p className="text-sm text-emerald-700">PostgreSQL - Çalışıyor</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">Çevrimiçi</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-yellow-900">Redis Cache</p>
                        <p className="text-sm text-yellow-700">Yüksek bellek kullanımı</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Uyarı</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="font-medium text-emerald-900">Elasticsearch</p>
                        <p className="text-sm text-emerald-700">Arama motoru - Çalışıyor</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">Çevrimiçi</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* System Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Sistem Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">İşletim Sistemi</p>
                      <p className="font-medium">Ubuntu 22.04 LTS</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kernel</p>
                      <p className="font-medium">5.15.0-91-generic</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Çalışma Süresi</p>
                      <p className="font-medium">{formatUptime(serverHealth?.uptime || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Load Average</p>
                      <p className="font-medium">{serverHealth?.loadAverage || '0.45'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prosesör</p>
                      <p className="font-medium">Intel Xeon E5-2673 v4</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Çekirdek Sayısı</p>
                      <p className="font-medium">{serverHealth?.cpuCores || 8} Core</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">99.9%</p>
                        <p className="text-xs text-gray-600">Uptime</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">156</p>
                        <p className="text-xs text-gray-600">Prosesler</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">2.4TB</p>
                        <p className="text-xs text-gray-600">Toplam Disk</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Gerçek Zamanlı Aktivite
                </CardTitle>
                <CardDescription>
                  Son dakikadaki sistem aktiviteleri ve kaynak kullanımı
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">CPU Aktivitesi</h4>
                    <div className="space-y-2">
                      {[
                        { process: "nginx", usage: 15.2 },
                        { process: "postgres", usage: 8.7 },
                        { process: "node", usage: 12.3 },
                        { process: "redis", usage: 3.1 }
                      ].map((proc, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{proc.process}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${proc.usage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 w-10">{proc.usage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Bellek Kullanımı</h4>
                    <div className="space-y-2">
                      {[
                        { type: "Kullanılan", amount: "12.4 GB", percentage: 77 },
                        { type: "Buffer/Cache", amount: "2.1 GB", percentage: 13 },
                        { type: "Boş", amount: "1.5 GB", percentage: 10 }
                      ].map((mem, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{mem.type}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-16">{mem.amount}</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-600 h-2 rounded-full" 
                                style={{ width: `${mem.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Disk I/O</h4>
                    <div className="space-y-2">
                      {[
                        { operation: "Okuma", rate: "45.2 MB/s" },
                        { operation: "Yazma", rate: "23.8 MB/s" },
                        { operation: "IOPS", rate: "1.2K" },
                        { operation: "Queue", rate: "0.8" }
                      ].map((io, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{io.operation}</span>
                          <span className="text-sm font-medium">{io.rate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    CPU Performans Geçmişi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">CPU kullanım grafiği</p>
                      <p className="text-sm text-gray-400">Son {selectedTimeRange} verisi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Bellek Performans Geçmişi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Bellek kullanım grafiği</p>
                      <p className="text-sm text-gray-400">Son {selectedTimeRange} verisi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Performans Metrikleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold text-emerald-600">234ms</p>
                    <p className="text-sm text-gray-600">Ortalama Yanıt Süresi</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">1,247</p>
                    <p className="text-sm text-gray-600">Saniyede İstek</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold text-purple-600">99.97%</p>
                    <p className="text-sm text-gray-600">Erişilebilirlik</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold text-orange-600">2.3GB</p>
                    <p className="text-sm text-gray-600">Toplam Trafik</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="w-5 h-5" />
                    Ağ Trafiği
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">↓ 1.2 GB</p>
                      <p className="text-sm text-blue-700">Gelen Trafik</p>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <p className="text-2xl font-bold text-emerald-600">↑ 856 MB</p>
                      <p className="text-sm text-emerald-700">Giden Trafik</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bant Genişliği Kullanımı</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    {[
                      { metric: "Paket Kaybı", value: "0.01%" },
                      { metric: "Gecikme", value: "12ms" },
                      { metric: "Jitter", value: "2ms" },
                      { metric: "Aktif Bağlantı", value: "234" }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm text-gray-600">{item.metric}</span>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Bağlantı Durumu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { service: "CDN", status: "healthy", response: "45ms" },
                    { service: "DNS", status: "healthy", response: "12ms" },
                    { service: "External API", status: "warning", response: "234ms" },
                    { service: "Email Service", status: "healthy", response: "67ms" },
                    { service: "Backup Server", status: "healthy", response: "89ms" }
                  ].map((conn, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(conn.status)}
                        <span className="font-medium">{conn.service}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{conn.response}</p>
                        <Badge variant="outline" className={getStatusColor(conn.status)}>
                          {conn.status === 'healthy' ? 'Sağlıklı' : 'Uyarı'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Sistem Servisleri
                </CardTitle>
                <CardDescription>
                  Çalışan servisler ve durumları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {[
                    { name: "nginx", description: "Web Server", status: "running", port: "80,443", cpu: "2.1%", memory: "145MB" },
                    { name: "postgresql", description: "Database Server", status: "running", port: "5432", cpu: "8.7%", memory: "512MB" },
                    { name: "redis", description: "Cache Server", status: "running", port: "6379", cpu: "1.2%", memory: "78MB" },
                    { name: "elasticsearch", description: "Search Engine", status: "running", port: "9200", cpu: "12.3%", memory: "1.2GB" },
                    { name: "pm2", description: "Process Manager", status: "running", port: "-", cpu: "0.8%", memory: "34MB" },
                    { name: "fail2ban", description: "Security Service", status: "running", port: "-", cpu: "0.1%", memory: "12MB" }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">{service.description}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-right text-sm">
                        <div>
                          <p className="text-gray-500">Port</p>
                          <p className="font-medium">{service.port}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">CPU</p>
                          <p className="font-medium">{service.cpu}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Bellek</p>
                          <p className="font-medium">{service.memory}</p>
                        </div>
                        <div>
                          <Badge className="bg-emerald-100 text-emerald-800">Çalışıyor</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Sistem Uyarıları
                </CardTitle>
                <CardDescription>
                  Aktif uyarılar ve sistem bildirimleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "warning",
                      title: "Yüksek CPU kullanımı",
                      description: "Son 10 dakikada CPU kullanımı %85'in üzerinde",
                      time: "2 dakika önce",
                      severity: "medium"
                    },
                    {
                      type: "info",
                      title: "Sistem güncellemesi mevcut",
                      description: "12 güvenlik güncellemesi yüklenmeyi bekliyor",
                      time: "1 saat önce",
                      severity: "low"
                    },
                    {
                      type: "warning",
                      title: "Disk alanı azalıyor",
                      description: "/var partition %87 dolu, temizlik önerilir",
                      time: "3 saat önce",
                      severity: "medium"
                    },
                    {
                      type: "critical",
                      title: "SSL sertifikası süresi dolacak",
                      description: "Ana domain sertifikası 7 gün içinde sona erecek",
                      time: "6 saat önce",
                      severity: "high"
                    }
                  ].map((alert, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      {getStatusIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{alert.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {alert.severity === 'high' ? 'Yüksek' : 
                               alert.severity === 'medium' ? 'Orta' : 'Düşük'}
                            </Badge>
                            <span className="text-xs text-gray-500">{alert.time}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}