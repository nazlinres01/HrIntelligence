import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, CheckCircle, AlertTriangle, XCircle, Star, Plus, TrendingUp, FileText } from "lucide-react";

export default function QualityControlPage() {
  const qualityMetrics = [
    {
      id: 1,
      category: "Ürün Kalitesi",
      currentScore: 94,
      targetScore: 98,
      trend: "artış",
      lastMonth: 91,
      issues: 3,
      tests: 156,
      passRate: 96.2,
      criticalIssues: 1
    },
    {
      id: 2,
      category: "Hizmet Kalitesi",
      currentScore: 87,
      targetScore: 95,
      trend: "artış",
      lastMonth: 85,
      issues: 7,
      tests: 89,
      passRate: 92.1,
      criticalIssues: 2
    },
    {
      id: 3,
      category: "Süreç Kalitesi",
      currentScore: 92,
      targetScore: 96,
      trend: "sabit",
      lastMonth: 92,
      issues: 4,
      tests: 134,
      passRate: 97.0,
      criticalIssues: 0
    }
  ];

  const recentInspections = [
    {
      id: 1,
      area: "Üretim Hattı A",
      inspector: "Ali Demir",
      date: "2024-06-10",
      score: 96,
      status: "geçti",
      findings: [
        { type: "minor", description: "Ekipman kalibrasyonu gecikmesi", resolved: true },
        { type: "observation", description: "İş güvenliği uyarısı eksik", resolved: false }
      ]
    },
    {
      id: 2,
      area: "Müşteri Hizmetleri",
      inspector: "Ayşe Kara",
      date: "2024-06-11",
      score: 89,
      status: "koşullu",
      findings: [
        { type: "major", description: "Yanıt süresi hedefi aşımı", resolved: false },
        { type: "minor", description: "Dokümantasyon eksikliği", resolved: true }
      ]
    },
    {
      id: 3,
      area: "IT Altyapısı",
      inspector: "Mehmet Yılmaz",
      date: "2024-06-12",
      score: 92,
      status: "geçti",
      findings: [
        { type: "observation", description: "Backup süre optimizasyonu", resolved: true }
      ]
    }
  ];

  const nonConformities = [
    {
      id: "NC-2024-015",
      title: "Kalite Dokümantasyon Eksikliği",
      severity: "yüksek",
      area: "Üretim",
      reportedBy: "Fatma Öz",
      reportedDate: "2024-06-08",
      status: "açık",
      dueDate: "2024-06-20",
      assignee: "Hasan Kurt",
      rootCause: "Prosedür güncellemesi yapılmamış",
      correctiveAction: "Dokümantasyon revizyon süreci başlatıldı"
    },
    {
      id: "NC-2024-016",
      title: "Müşteri Şikayet İşlem Süresi",
      severity: "orta",
      area: "Müşteri Hizmetleri",
      reportedBy: "Kemal Aslan",
      reportedDate: "2024-06-09",
      status: "inceleme",
      dueDate: "2024-06-15",
      assignee: "Zeynep Ak",
      rootCause: "Personel eksikliği ve süreç karmaşıklığı",
      correctiveAction: "Ek personel atama ve süreç basitleştirme"
    },
    {
      id: "NC-2024-017",
      title: "Tedarikçi Kalite Sorunu",
      severity: "kritik",
      area: "Tedarik",
      reportedBy: "Emre Tan",
      reportedDate: "2024-06-11",
      status: "acil",
      dueDate: "2024-06-14",
      assignee: "Seda Çelik",
      rootCause: "Tedarikçi kalite kontrol sürecinde açık",
      correctiveAction: "Acil tedarikçi auditi ve alternatif tedarikçi araştırması"
    }
  ];

  const auditSchedule = [
    {
      id: 1,
      auditType: "İç Denetim",
      area: "Kalite Yönetim Sistemi",
      auditor: "Gamze Köksal",
      plannedDate: "2024-06-18",
      status: "planlandı",
      scope: "ISO 9001:2015 uygunluk denetimi"
    },
    {
      id: 2,
      auditType: "Tedarikçi Denetimi",
      area: "Ana Tedarikçiler",
      auditor: "Burak Yıldız",
      plannedDate: "2024-06-25",
      status: "hazırlık",
      scope: "Tedarikçi kalite sistemleri değerlendirmesi"
    },
    {
      id: 3,
      auditType: "Süreç Denetimi",
      area: "Üretim Süreçleri",
      auditor: "Canan Demir",
      plannedDate: "2024-07-02",
      status: "planlandı",
      scope: "Üretim kalite kontrol süreçleri"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'geçti':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Geçti</Badge>;
      case 'koşullu':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⚠️ Koşullu</Badge>;
      case 'kaldı':
        return <Badge className="bg-red-100 text-red-800 border-red-200">❌ Kaldı</Badge>;
      case 'açık':
        return <Badge className="bg-red-100 text-red-800 border-red-200">🔴 Açık</Badge>;
      case 'inceleme':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">🔍 İnceleme</Badge>;
      case 'acil':
        return <Badge variant="destructive">🚨 Acil</Badge>;
      case 'planlandı':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">📅 Planlandı</Badge>;
      case 'hazırlık':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">📋 Hazırlık</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'kritik':
        return <Badge variant="destructive">🚨 Kritik</Badge>;
      case 'yüksek':
        return <Badge className="bg-red-100 text-red-800 border-red-200">🔴 Yüksek</Badge>;
      case 'orta':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">🟡 Orta</Badge>;
      case 'düşük':
        return <Badge className="bg-green-100 text-green-800 border-green-200">🟢 Düşük</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kalite Kontrolü</h1>
            <p className="text-gray-600">Kalite standartlarını yönetin ve süreçleri izleyin</p>
          </div>
        </div>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="metrics">Kalite Metrikleri</TabsTrigger>
            <TabsTrigger value="inspections">Denetimler</TabsTrigger>
            <TabsTrigger value="nonconformities">Uygunsuzluklar</TabsTrigger>
            <TabsTrigger value="audits">Denetim Takvimi</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Kalite Performans Metrikleri</h2>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Metrik Ekle
            </Button>
          </div>

          <div className="grid gap-6">
            {qualityMetrics.map((metric) => (
              <Card key={metric.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gray-800 flex items-center">
                        <Star className="h-5 w-5 mr-2 text-yellow-500" />
                        {metric.category}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {metric.tests} test yapıldı • %{metric.passRate} başarı oranı
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-600">{metric.currentScore}</div>
                      <div className="text-sm text-gray-500">Hedef: {metric.targetScore}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Hedef İlerleme</span>
                      <span className="text-sm font-bold text-red-600">
                        {Math.round((metric.currentScore / metric.targetScore) * 100)}%
                      </span>
                    </div>
                    <Progress value={(metric.currentScore / metric.targetScore) * 100} className="h-2" />
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-800">{metric.issues}</div>
                      <div className="text-xs text-gray-600">Toplam Sorun</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-lg font-bold text-red-600">{metric.criticalIssues}</div>
                      <div className="text-xs text-red-700">Kritik Sorun</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{metric.passRate}%</div>
                      <div className="text-xs text-green-700">Başarı Oranı</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {metric.trend === 'artış' ? '+' : metric.trend === 'azalış' ? '-' : ''}
                        {Math.abs(metric.currentScore - metric.lastMonth)}
                      </div>
                      <div className="text-xs text-blue-700">Geçen Ay</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inspections" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Son Denetimler</h2>
          
          <div className="grid gap-4">
            {recentInspections.map((inspection) => (
              <Card key={inspection.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{inspection.area}</CardTitle>
                      <CardDescription>
                        Denetçi: {inspection.inspector} • {inspection.date}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">{inspection.score}</div>
                        <div className="text-xs text-gray-500">Puan</div>
                      </div>
                      {getStatusBadge(inspection.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Bulgular:</h4>
                    <div className="space-y-2">
                      {inspection.findings.map((finding, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            {finding.type === 'major' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                            {finding.type === 'minor' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                            {finding.type === 'observation' && <FileText className="h-4 w-4 text-blue-500" />}
                            <span className="text-sm">{finding.description}</span>
                          </div>
                          {finding.resolved ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nonconformities" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Uygunsuzluk Kayıtları</h2>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Uygunsuzluk Bildirin
            </Button>
          </div>
          
          <div className="grid gap-4">
            {nonConformities.map((nc) => (
              <Card key={nc.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{nc.id}: {nc.title}</CardTitle>
                      <CardDescription>
                        {nc.area} • Bildiren: {nc.reportedBy} • {nc.reportedDate}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getSeverityBadge(nc.severity)}
                      {getStatusBadge(nc.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Sorumlu:</span>
                      <p className="font-medium">{nc.assignee}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Son Tarih:</span>
                      <p className="font-medium">{nc.dueDate}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-500 text-sm">Kök Neden:</span>
                    <p className="text-sm mt-1">{nc.rootCause}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-500 text-sm">Düzeltici Faaliyet:</span>
                    <p className="text-sm mt-1">{nc.correctiveAction}</p>
                  </div>

                  <Button variant="outline" className="w-full">
                    Detayları Görüntüle ve Güncelle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audits" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Denetim Takvimi</h2>
          
          <div className="grid gap-4">
            {auditSchedule.map((audit) => (
              <Card key={audit.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{audit.auditType}</h3>
                      <p className="text-gray-600">{audit.area}</p>
                      <p className="text-sm text-gray-500">Denetçi: {audit.auditor}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{audit.plannedDate}</p>
                      {getStatusBadge(audit.status)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="text-sm font-medium text-gray-700">Kapsam:</span>
                    <p className="text-sm mt-1">{audit.scope}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Denetim Planlama Araçları</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Risk Değerlendirmesi
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                Denetim Checklist
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <Shield className="h-4 w-4" />
                Uygunluk Matrisi
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Aksiyon Takibi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}