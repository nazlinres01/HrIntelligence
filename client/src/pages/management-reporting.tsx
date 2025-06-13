import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, TrendingUp, Calendar, Send, Download, Eye, Plus, BarChart3, Target } from "lucide-react";

export default function ManagementReportingPage() {
  const executiveReports = [
    {
      id: 1,
      title: "Aylık Departman Performans Raporu",
      type: "performans",
      period: "Haziran 2024",
      status: "tamamlandı",
      recipient: "Genel Müdür",
      dueDate: "2024-06-15",
      submittedDate: "2024-06-14",
      keyMetrics: [
        { metric: "Hedef Tamamlama", value: "87%", trend: "artış" },
        { metric: "Takım Verimliliği", value: "92%", trend: "artış" },
        { metric: "Bütçe Kullanımı", value: "₺485K", trend: "hedefte" },
        { metric: "Müşteri Memnuniyeti", value: "4.6/5", trend: "artış" }
      ]
    },
    {
      id: 2,
      title: "Çeyreklik Stratejik Hedefler Değerlendirmesi",
      type: "stratejik",
      period: "Q2 2024",
      status: "hazırlanıyor",
      recipient: "Yönetim Kurulu",
      dueDate: "2024-06-30",
      submittedDate: null,
      keyMetrics: [
        { metric: "Stratejik Hedefler", value: "8/12", trend: "hedefte" },
        { metric: "ROI", value: "%15.8", trend: "artış" },
        { metric: "Market Payı", value: "%23.4", trend: "artış" },
        { metric: "Operasyonel Verimlilik", value: "89%", trend: "artış" }
      ]
    },
    {
      id: 3,
      title: "Risk Yönetimi ve Uyum Raporu",
      type: "risk",
      period: "Haziran 2024",
      status: "inceleme",
      recipient: "Risk Komitesi",
      dueDate: "2024-06-20",
      submittedDate: "2024-06-18",
      keyMetrics: [
        { metric: "Risk Skoru", value: "Düşük", trend: "iyileşme" },
        { metric: "Uyum Oranı", value: "96%", trend: "artış" },
        { metric: "Açık Riskler", value: "3", trend: "azalış" },
        { metric: "Denetim Skoru", value: "A-", trend: "sabit" }
      ]
    }
  ];

  const reportTemplates = [
    {
      id: 1,
      name: "Departman KPI Dashboard",
      description: "Temel performans göstergeleri özet raporu",
      frequency: "Aylık",
      lastUsed: "2024-06-14",
      sections: ["Finansal Metrikler", "Operasyonel KPI'lar", "İnsan Kaynakları", "Müşteri Metrikleri"]
    },
    {
      id: 2,
      name: "Stratejik İnisiyatif Raporu",
      description: "Stratejik projeler ilerleme takibi",
      frequency: "Çeyreklik",
      lastUsed: "2024-03-31",
      sections: ["Proje Durumu", "Bütçe Analizi", "Risk Değerlendirmesi", "Sonraki Adımlar"]
    },
    {
      id: 3,
      name: "Operasyonel Verimlilik Raporu",
      description: "Süreç verimliliği ve optimizasyon analizi",
      frequency: "Aylık",
      lastUsed: "2024-06-10",
      sections: ["Süreç Metrikleri", "Darboğaz Analizi", "İyileştirme Fırsatları", "Aksiyon Planı"]
    }
  ];

  const upcomingDeadlines = [
    {
      report: "Yıllık Stratejik Plan Raporu",
      dueDate: "2024-06-25",
      recipient: "CEO & Yönetim Kurulu",
      priority: "yüksek",
      status: "başlanmadı"
    },
    {
      report: "Çalışan Memnuniyet Analizi",
      dueDate: "2024-06-28",
      recipient: "İK Müdürü",
      priority: "orta",
      status: "devam_ediyor"
    },
    {
      report: "Teknoloji Altyapı Değerlendirmesi",
      dueDate: "2024-07-05",
      recipient: "CTO",
      priority: "orta",
      status: "başlanmadı"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'tamamlandı':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Tamamlandı</Badge>;
      case 'hazırlanıyor':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">📝 Hazırlanıyor</Badge>;
      case 'inceleme':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">👁️ İnceleme</Badge>;
      case 'devam_ediyor':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">🔄 Devam Ediyor</Badge>;
      case 'başlanmadı':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">⏳ Başlanmadı</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'yüksek':
        return <Badge className="bg-red-100 text-red-800 border-red-200">🔴 Yüksek</Badge>;
      case 'orta':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">🟡 Orta</Badge>;
      case 'düşük':
        return <Badge className="bg-green-100 text-green-800 border-green-200">🟢 Düşük</Badge>;
      default:
        return <Badge>Normal</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'artış':
      case 'iyileşme':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'azalış':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      case 'sabit':
      case 'hedefte':
        return <Target className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Üst Yönetime Raporlama</h1>
            <p className="text-gray-600">Yönetici raporlarını hazırlayın ve takip edin</p>
          </div>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports">Mevcut Raporlar</TabsTrigger>
            <TabsTrigger value="templates">Rapor Şablonları</TabsTrigger>
            <TabsTrigger value="deadlines">Yaklaşan Teslimler</TabsTrigger>
          <TabsTrigger value="analytics">Analitik Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Yönetici Raporları</h2>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Rapor Oluştur
            </Button>
          </div>

          <div className="grid gap-6">
            {executiveReports.map((report) => (
              <Card key={report.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gray-800">{report.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {report.period} • Alıcı: {report.recipient}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(report.status)}
                      <Badge variant="outline">{report.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Son Teslim Tarihi:</span>
                      <p className="font-medium">{report.dueDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Teslim Tarihi:</span>
                      <p className="font-medium">{report.submittedDate || "Henüz teslim edilmedi"}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Temel Metrikler:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {report.keyMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">{metric.metric}</p>
                            <p className="text-lg font-bold text-gray-800">{metric.value}</p>
                          </div>
                          {getTrendIcon(metric.trend)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Görüntüle
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      İndir
                    </Button>
                    {report.status === 'tamamlandı' && (
                      <Button variant="outline" className="flex-1">
                        <Send className="h-4 w-4 mr-2" />
                        Gönder
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Rapor Şablonları</h2>
          
          <div className="grid gap-4">
            {reportTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{template.frequency}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Son kullanım: {template.lastUsed}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Rapor Bölümleri:</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.sections.map((section, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="bg-red-600 hover:bg-red-700 flex-1">
                      Şablonu Kullan
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Şablonu Düzenle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Şablon Oluştur
          </Button>
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Yaklaşan Teslim Tarihleri</h2>
          
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{deadline.report}</h3>
                      <p className="text-gray-600">Alıcı: {deadline.recipient}</p>
                    </div>
                    <div className="flex gap-2">
                      {getPriorityBadge(deadline.priority)}
                      {getStatusBadge(deadline.status)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Son Teslim Tarihi:</span>
                      <p className="font-bold text-lg">{deadline.dueDate}</p>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700">
                      Raporu Başlat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Rapor Hatırlatıcıları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="font-medium text-yellow-800">Yıllık Stratejik Plan Raporu</p>
                <p className="text-sm text-yellow-700">3 gün içinde teslim edilmeli - Yüksek öncelik</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-800">Çalışan Memnuniyet Analizi</p>
                <p className="text-sm text-blue-700">6 gün içinde teslim edilmeli - Hazırlık aşamasında</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Raporlama Analitiği</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-red-600" />
                  Rapor Performansı
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Zamanında Teslim Oranı</span>
                  <span className="font-bold">94%</span>
                </div>
                <Progress value={94} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span>Kalite Skoru</span>
                  <span className="font-bold">4.7/5</span>
                </div>
                <Progress value={94} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span>Geri Bildirim Puanı</span>
                  <span className="font-bold">4.5/5</span>
                </div>
                <Progress value={90} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
                  Bu Ay İstatistikleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">8</div>
                  <div className="text-sm text-gray-600">Tamamlanan Rapor</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">Devam Eden Rapor</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">12h</div>
                  <div className="text-sm text-gray-600">Ortalama Hazırlık Süresi</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">Rapor Tiplerinin Dağılımı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Performans Raporları</span>
                  <Badge>45%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Stratejik Raporlar</span>
                  <Badge>30%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Risk ve Uyum</span>
                  <Badge>15%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Operasyonel Raporlar</span>
                  <Badge>10%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">Alıcı Dağılımı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Genel Müdür</span>
                  <Badge>35%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Yönetim Kurulu</span>
                  <Badge>25%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Departman Müdürleri</span>
                  <Badge>25%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Dış Paydaşlar</span>
                  <Badge>15%</Badge>
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