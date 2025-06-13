import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Lock, 
  Key, 
  Server, 
  Users, 
  FileText,
  Download,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Clock,
  Database,
  Network,
  Monitor
} from "lucide-react";

export default function SecurityAudit() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7");
  const [refreshing, setRefreshing] = useState(false);

  // Security metrics data
  const securityMetrics = {
    overallScore: 78,
    criticalIssues: 3,
    highIssues: 12,
    mediumIssues: 28,
    lowIssues: 45,
    resolvedIssues: 156,
    lastScanDate: "2024-06-13T20:30:00Z"
  };

  // Mock audit logs data
  const auditLogs = [
    {
      id: 1,
      timestamp: "2024-06-13T20:25:00Z",
      event: "Başarısız Giriş Denemesi",
      user: "admin@teknolojisumo.com",
      ip: "192.168.1.100",
      severity: "high",
      status: "detected",
      description: "Çoklu başarısız giriş denemesi tespit edildi"
    },
    {
      id: 2,
      timestamp: "2024-06-13T20:20:00Z",
      event: "Yetkisiz Dosya Erişimi",
      user: "mehmet.yilmaz@teknolojisumo.com",
      ip: "10.0.0.45",
      severity: "critical",
      status: "blocked",
      description: "Yetkisiz kullanıcı kritik dosyalara erişim denedi"
    },
    {
      id: 3,
      timestamp: "2024-06-13T20:15:00Z",
      event: "Şüpheli Ağ Trafiği",
      user: "system",
      ip: "external",
      severity: "medium",
      status: "monitoring",
      description: "Olağandışı ağ trafiği paterni tespit edildi"
    },
    {
      id: 4,
      timestamp: "2024-06-13T20:10:00Z",
      event: "Sistem Güncellemesi",
      user: "system",
      ip: "localhost",
      severity: "low",
      status: "completed",
      description: "Güvenlik yamaları başarıyla uygulandı"
    },
    {
      id: 5,
      timestamp: "2024-06-13T20:05:00Z",
      event: "Privilege Escalation",
      user: "ayse.demir@teknolojisumo.com",
      ip: "192.168.1.150",
      severity: "high",
      status: "investigating",
      description: "Kullanıcı yetki yükseltme işlemi gerçekleştirdi"
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "detected": return "bg-red-100 text-red-800";
      case "blocked": return "bg-orange-100 text-orange-800";
      case "monitoring": return "bg-yellow-100 text-yellow-800";
      case "investigating": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Güvenlik Denetimi</h1>
            <p className="text-gray-600 text-lg">Sistem Güvenliğini İzleyin, Tehditleri Tespit Edin ve Güvenlik Önlemlerini Yönetin</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="lightgray" 
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-gray-300 text-gray-700"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Yenile
            </Button>
            <Button variant="lightgray" className="border-gray-300 text-gray-700">
              <Download className="mr-2 h-4 w-4" />
              Rapor İndir
            </Button>
          </div>
        </div>

        {/* Security Score Alert */}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Güvenlik Durumu: Orta Seviye Risk</AlertTitle>
          <AlertDescription className="text-orange-700">
            Sistemde {securityMetrics.criticalIssues} kritik ve {securityMetrics.highIssues} yüksek öncelikli güvenlik sorunu tespit edildi. 
            Acil müdahale gerekiyor.
          </AlertDescription>
        </Alert>

        {/* Security Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{securityMetrics.overallScore}%</div>
                <p className="text-sm text-blue-600 font-medium">Genel Güvenlik Skoru</p>
                <Progress value={securityMetrics.overallScore} className="mt-2 h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-red-100 rounded-full mr-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{securityMetrics.criticalIssues}</div>
                <p className="text-sm text-red-600 font-medium">Kritik Sorunlar</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-orange-100 rounded-full mr-4">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{securityMetrics.highIssues}</div>
                <p className="text-sm text-orange-600 font-medium">Yüksek Öncelik</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{securityMetrics.resolvedIssues}</div>
                <p className="text-sm text-green-600 font-medium">Çözümlenen</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="audit-logs" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="audit-logs" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <FileText className="mr-2 h-4 w-4" />
              Denetim Günlükleri
            </TabsTrigger>
            <TabsTrigger value="vulnerabilities" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Güvenlik Açıkları
            </TabsTrigger>
            <TabsTrigger value="access-control" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Lock className="mr-2 h-4 w-4" />
              Erişim Kontrolü
            </TabsTrigger>
            <TabsTrigger value="network-security" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Network className="mr-2 h-4 w-4" />
              Ağ Güvenliği
            </TabsTrigger>
          </TabsList>

          <TabsContent value="audit-logs" className="space-y-6">
            {/* Filter Section */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Denetim günlüklerinde ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Önem derecesi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Seviyeler</SelectItem>
                      <SelectItem value="critical">Kritik</SelectItem>
                      <SelectItem value="high">Yüksek</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="low">Düşük</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Zaman aralığı" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Son 24 Saat</SelectItem>
                      <SelectItem value="7">Son 7 Gün</SelectItem>
                      <SelectItem value="30">Son 30 Gün</SelectItem>
                      <SelectItem value="90">Son 90 Gün</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Audit Logs Table */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Güvenlik Olayları</CardTitle>
                <CardDescription>Son güvenlik olayları ve denetim kayıtları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{log.event}</h3>
                            <Badge className={getSeverityColor(log.severity)}>
                              {log.severity === 'critical' ? 'Kritik' :
                               log.severity === 'high' ? 'Yüksek' :
                               log.severity === 'medium' ? 'Orta' : 'Düşük'}
                            </Badge>
                            <Badge className={getStatusColor(log.status)}>
                              {log.status === 'detected' ? 'Tespit Edildi' :
                               log.status === 'blocked' ? 'Engellendi' :
                               log.status === 'monitoring' ? 'İzleniyor' :
                               log.status === 'investigating' ? 'Araştırılıyor' : 'Tamamlandı'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{log.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{log.user}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Server className="h-4 w-4" />
                              <span>{log.ip}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(log.timestamp).toLocaleString('tr-TR')}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="lightgray" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Detay
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vulnerabilities" className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Güvenlik Açıkları</CardTitle>
                <CardDescription>Sistem güvenlik açıkları ve önerileri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-red-200 bg-red-50">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">Kritik: Güvenlik Duvarı Konfigürasyonu</AlertTitle>
                    <AlertDescription className="text-red-700">
                      Güvenlik duvarında açık portlar tespit edildi. Acil müdahale gerekiyor.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertTitle className="text-orange-800">Yüksek: SSL Sertifikası Süresi</AlertTitle>
                    <AlertDescription className="text-orange-700">
                      SSL sertifikası 15 gün içinde sona erecek. Yenileme işlemi planlanmalı.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">Orta: Güvenlik Yamaları</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      12 adet güvenlik yaması mevcut. Sistem güncellemesi önerilir.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access-control" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Kullanıcı Yetkileri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Admin Kullanıcıları</span>
                      <Badge className="bg-red-100 text-red-800">5</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Standart Kullanıcılar</span>
                      <Badge className="bg-green-100 text-green-800">142</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Misafir Erişimleri</span>
                      <Badge className="bg-yellow-100 text-yellow-800">8</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Erişim İstatistikleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Başarılı Girişler</span>
                      <span className="font-semibold text-green-600">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Başarısız Girişler</span>
                      <span className="font-semibold text-red-600">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Şüpheli Aktiviteler</span>
                      <span className="font-semibold text-orange-600">7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="network-security" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Firewall Durumu</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">DDoS Koruması</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Monitor className="h-8 w-8 text-blue-600" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">İzleniyor</Badge>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Ağ Trafiği</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="p-4 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Database className="h-8 w-8 text-yellow-600" />
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Normal</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}