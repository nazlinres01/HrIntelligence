import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Eye, 
  Users, 
  Activity, 
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  FileText,
  Globe,
  Cpu,
  Database,
  Wifi,
  Key,
  UserCheck,
  AlertCircle,
  XCircle,
  Settings,
  Zap,
  MonitorSpeaker
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SecurityAudit() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["/api/audit-logs", selectedTimeRange],
  });

  const { data: securityMetrics } = useQuery({
    queryKey: ["/api/security/metrics"],
  });

  const { data: activeThreats } = useQuery({
    queryKey: ["/api/security/threats"],
  });

  const { data: vulnerabilities } = useQuery({
    queryKey: ["/api/security/vulnerabilities"],
  });

  const { data: accessLogs } = useQuery({
    queryKey: ["/api/security/access-logs"],
  });

  const { data: systemAlerts } = useQuery({
    queryKey: ["/api/security/alerts"],
  });

  const runSecurityScan = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/security/scan");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security"] });
      toast({
        title: "Güvenlik Taraması Başlatıldı",
        description: "Sistem güvenlik taraması başarıyla başlatıldı.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Güvenlik taraması başlatılırken hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Kritik</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">Yüksek</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Orta</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Düşük</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Belirsiz</Badge>;
    }
  };

  if (logsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="h-16 bg-white/80 rounded-xl shadow-sm animate-pulse border border-gray-200"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-white/80 rounded-xl shadow-sm animate-pulse border border-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Güvenlik Denetimi ve İzleme</h1>
            <p className="text-gray-600 text-lg">Sistem Güvenliği, Tehdit Analizi ve Denetim Raporları</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Son 1 Saat</SelectItem>
                <SelectItem value="24h">Son 24 Saat</SelectItem>
                <SelectItem value="7d">Son 7 Gün</SelectItem>
                <SelectItem value="30d">Son 30 Gün</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline"
              onClick={() => runSecurityScan.mutate()}
              disabled={runSecurityScan.isPending}
            >
              <Shield className="w-4 h-4 mr-2" />
              {runSecurityScan.isPending ? "Taranıyor..." : "Güvenlik Taraması"}
            </Button>
          </div>
        </div>

        {/* Security Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Güvenlik Skoru</p>
                  <p className="text-3xl font-bold text-green-600">92%</p>
                  <p className="text-xs text-gray-500 mt-1">Mükemmel durum</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Tehditler</p>
                  <p className="text-3xl font-bold text-red-600">{(systemAlerts as any)?.length || 3}</p>
                  <p className="text-xs text-gray-500 mt-1">Acil müdahale gerekli</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Zayıflıklar</p>
                  <p className="text-3xl font-bold text-yellow-600">{(vulnerabilities as any)?.length || 7}</p>
                  <p className="text-xs text-gray-500 mt-1">Güncelleme önerilir</p>
                </div>
                <XCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Başarısız Girişler</p>
                  <p className="text-3xl font-bold text-orange-600">{(accessLogs as any)?.failedLogins || 24}</p>
                  <p className="text-xs text-gray-500 mt-1">Son 24 saatte</p>
                </div>
                <Lock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
        return <Badge>Bilinmeyen</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getComplianceScore = () => {
    const total = securityMetrics?.totalChecks || 100;
    const passed = securityMetrics?.passedChecks || 85;
    return Math.round((passed / total) * 100);
  };

  const filteredLogs = auditLogs?.filter((log: any) => {
    const matchesSearch = log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  }) || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Güvenlik Denetimi</h2>
            <p className="text-gray-600">Sistem güvenliği izleme ve denetim merkezi</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/security"] })}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Yenile
            </Button>
            <Button 
              onClick={() => runSecurityScan.mutate()}
              disabled={runSecurityScan.isPending}
            >
              <Shield className="w-4 h-4 mr-2" />
              Güvenlik Taraması
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Güvenlik Skoru</p>
                  <p className="text-3xl font-bold text-gray-900">{getComplianceScore()}%</p>
                  <p className="text-xs text-emerald-600 mt-1">+5% bu ay</p>
                </div>
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Tehditler</p>
                  <p className="text-3xl font-bold text-gray-900">{activeThreats?.length || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Son 24 saat</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Güvenlik Açıkları</p>
                  <p className="text-3xl font-bold text-gray-900">{vulnerabilities?.length || 0}</p>
                  <p className="text-xs text-yellow-600 mt-1">3 kritik</p>
                </div>
                <XCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Başarısız Girişler</p>
                  <p className="text-3xl font-bold text-gray-900">{securityMetrics?.failedLogins || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Son 1 saat</p>
                </div>
                <Lock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="threats">Tehdit Analizi</TabsTrigger>
            <TabsTrigger value="access">Erişim Logları</TabsTrigger>
            <TabsTrigger value="vulnerabilities">Güvenlik Açıkları</TabsTrigger>
            <TabsTrigger value="compliance">Uyumluluk</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Security Status Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Sistem Güvenlik Durumu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="font-medium text-emerald-900">Firewall Koruması</p>
                        <p className="text-sm text-emerald-700">Aktif ve güncel</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">Aktif</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="font-medium text-emerald-900">SSL Sertifikaları</p>
                        <p className="text-sm text-emerald-700">Geçerli - 89 gün kaldı</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">Güvenli</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-yellow-900">Antivirüs Koruması</p>
                        <p className="text-sm text-yellow-700">Güncelleme gerekli</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Uyarı</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-900">İki Faktörlü Kimlik Doğrulama</p>
                        <p className="text-sm text-red-700">%23 kullanıcı etkinleştirdi</p>
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Risk</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Güvenlik Metrikleri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Genel Güvenlik Skoru</span>
                      <span className="text-sm text-gray-600">{getComplianceScore()}%</span>
                    </div>
                    <Progress value={getComplianceScore()} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Veri Şifreleme</span>
                      <span className="text-sm text-gray-600">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Erişim Kontrolü</span>
                      <span className="text-sm text-gray-600">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Güvenlik Güncellemeleri</span>
                      <span className="text-sm text-gray-600">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">24/7</p>
                      <p className="text-xs text-gray-600">İzleme</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">99.9%</p>
                      <p className="text-xs text-gray-600">Uptime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Security Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Son Güvenlik Olayları
                </CardTitle>
                <CardDescription>
                  Son 24 saatteki güvenlik olayları ve uyarılar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemAlerts?.slice(0, 5).map((alert: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(alert.severity)}
                        <div>
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-xs text-gray-500">{alert.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getSeverityBadge(alert.severity)}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.timestamp).toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-center py-8 text-gray-500">Son güvenlik olayı bulunamadı</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Aktif Tehdit Analizi
                </CardTitle>
                <CardDescription>
                  Sistem tarafından tespit edilen aktif tehditler ve risk analizleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeThreats?.map((threat: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <h3 className="font-semibold">{threat.type}</h3>
                        </div>
                        {getSeverityBadge(threat.severity)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{threat.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Kaynak IP:</span>
                          <p className="text-gray-600">{threat.sourceIp}</p>
                        </div>
                        <div>
                          <span className="font-medium">Hedef:</span>
                          <p className="text-gray-600">{threat.target}</p>
                        </div>
                        <div>
                          <span className="font-medium">Tespit Zamanı:</span>
                          <p className="text-gray-600">{new Date(threat.detectedAt).toLocaleString('tr-TR')}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="destructive">
                          Engelle
                        </Button>
                        <Button size="sm" variant="outline">
                          Analiz Et
                        </Button>
                        <Button size="sm" variant="outline">
                          Yoksay
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                      <p className="text-gray-500">Aktif tehdit tespit edilmedi</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Kullanıcı adı, IP adresi veya işlem ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Seviyeler</SelectItem>
                      <SelectItem value="critical">Kritik</SelectItem>
                      <SelectItem value="high">Yüksek</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="low">Düşük</SelectItem>
                      <SelectItem value="info">Bilgi</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Son 1 Saat</SelectItem>
                      <SelectItem value="24h">Son 24 Saat</SelectItem>
                      <SelectItem value="7d">Son 7 Gün</SelectItem>
                      <SelectItem value="30d">Son 30 Gün</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Access Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Erişim Logları
                </CardTitle>
                <CardDescription>
                  Sistem erişim kayıtları ve kullanıcı aktiviteleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredLogs.slice(0, 20).map((log: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <UserCheck className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="font-medium text-sm">{log.action}</p>
                            <p className="text-xs text-gray-500">
                              {log.userEmail} • {log.ipAddress}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getSeverityBadge(log.severity || 'info')}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(log.timestamp).toLocaleString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vulnerabilities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Güvenlik Açıkları
                </CardTitle>
                <CardDescription>
                  Sistem güvenlik açıkları ve önerilen düzeltme adımları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vulnerabilities?.map((vuln: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{vuln.title}</h3>
                        {getSeverityBadge(vuln.severity)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{vuln.description}</p>
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm font-medium mb-2">Önerilen Çözüm:</p>
                        <p className="text-sm text-gray-600">{vuln.solution}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Etkilenen Sistem: {vuln.affectedSystem}</span>
                          <span>CVSS Skoru: {vuln.cvssScore}</span>
                        </div>
                        <Button size="sm">
                          Düzeltme Uygula
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                      <p className="text-gray-500">Kritik güvenlik açığı tespit edilmedi</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Uyumluluk Standartları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "ISO 27001", status: "Uyumlu", score: 95 },
                    { name: "SOX Compliance", status: "Uyumlu", score: 92 },
                    { name: "GDPR", status: "Kısmi Uyumlu", score: 78 },
                    { name: "PCI DSS", status: "Uyumlu", score: 88 }
                  ].map((standard, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{standard.name}</p>
                        <p className="text-sm text-gray-500">{standard.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{standard.score}%</p>
                        <Progress value={standard.score} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Denetim Raporları
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Aylık Güvenlik Raporu", date: "2024-12-01", status: "Tamamlandı" },
                      { name: "Üç Aylık Risk Analizi", date: "2024-11-15", status: "İnceleme" },
                      { name: "Yıllık Uyumluluk Raporu", date: "2024-10-30", status: "Hazırlanıyor" }
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{report.name}</p>
                          <p className="text-xs text-gray-500">{report.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{report.status}</Badge>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}