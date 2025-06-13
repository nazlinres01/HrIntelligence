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
    refetchInterval: autoRefresh ? 30000 : false,
  });

  const { data: serverHealth } = useQuery({
    queryKey: ["/api/system/health"],
    refetchInterval: autoRefresh ? 10000 : false,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistem İzleme ve Performans</h1>
            <p className="text-gray-600 text-lg">Gerçek Zamanlı Sistem Performansı ve Kaynak Kullanım Analizi</p>
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
              variant="lightgray"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => refetchMetrics()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Yenile
            </Button>
            <Button 
              variant="lightgray"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <Activity className="w-4 h-4 mr-2" />
              {autoRefresh ? "Canlı" : "Durdur"}
            </Button>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CPU Kullanımı</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(systemMetrics as any)?.cpu?.usage || 73}%
                  </p>
                  <div className="mt-2">
                    <Progress 
                      value={(systemMetrics as any)?.cpu?.usage || 73} 
                      className={`h-2 ${getUsageColor((systemMetrics as any)?.cpu?.usage || 73)}`}
                    />
                  </div>
                </div>
                <Cpu className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bellek Kullanımı</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(systemMetrics as any)?.memory?.usage || 65}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatBytes((systemMetrics as any)?.memory?.used || 8589934592)} / {formatBytes((systemMetrics as any)?.memory?.total || 17179869184)}
                  </p>
                  <div className="mt-2">
                    <Progress 
                      value={(systemMetrics as any)?.memory?.usage || 65} 
                      className={`h-2 ${getUsageColor((systemMetrics as any)?.memory?.usage || 65)}`}
                    />
                  </div>
                </div>
                <HardDrive className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disk Kullanımı</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(systemMetrics as any)?.disk?.usage || 42}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatBytes((systemMetrics as any)?.disk?.used || 858993459200)} / {formatBytes((systemMetrics as any)?.disk?.total || 2147483648000)}
                  </p>
                  <div className="mt-2">
                    <Progress 
                      value={(systemMetrics as any)?.disk?.usage || 42} 
                      className={`h-2 ${getUsageColor((systemMetrics as any)?.disk?.usage || 42)}`}
                    />
                  </div>
                </div>
                <Database className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Kullanıcılar</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(activeUsers as any)?.count || 47}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(activeUsers as any)?.sessions || 68} aktif oturum
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Server Health */}
          <Card className="bg-white border-gray-200">
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
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="bg-white border-gray-200">
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
                  <p className="font-medium">{formatUptime((serverHealth as any)?.uptime || 1234567)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Load Average</p>
                  <p className="font-medium">{(serverHealth as any)?.loadAverage || '0.45'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prosesör</p>
                  <p className="font-medium">Intel Xeon E5-2673 v4</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Çekirdek Sayısı</p>
                  <p className="font-medium">{(serverHealth as any)?.cpuCores || 8} Core</p>
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
      </div>
    </div>
  );
}