import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, TrendingUp, Clock, Target, Plus, ArrowUp, ArrowDown, CheckCircle, AlertTriangle } from "lucide-react";

export default function ProcessOptimizationPage() {
  const optimizationProjects = [
    {
      id: 1,
      processName: "Müşteri Onboarding Süreci",
      currentDuration: "12 gün",
      targetDuration: "7 gün",
      currentCost: "₺2,450",
      targetCost: "₺1,800",
      efficiency: 68,
      status: "aktif",
      impact: "yüksek",
      improvements: [
        { area: "Dokümantasyon", improvement: "Digital form geçişi", savings: "40% zaman tasarrufu" },
        { area: "Onay Süreci", improvement: "Otomatik onay sistemi", savings: "60% hızlanma" },
        { area: "İletişim", improvement: "Müşteri portal", savings: "₺650 maliyet azalması" }
      ]
    },
    {
      id: 2,
      processName: "İç Raporlama Sistemi",
      currentDuration: "3 gün",
      targetDuration: "4 saat",
      currentCost: "₺1,200",
      targetCost: "₺400",
      efficiency: 85,
      status: "tamamlandı",
      impact: "orta",
      improvements: [
        { area: "Veri Toplama", improvement: "Otomatik dashboard", savings: "85% zaman tasarrufu" },
        { area: "Analiz", improvement: "AI destekli analiz", savings: "70% doğruluk artışı" },
        { area: "Dağıtım", improvement: "Otomatik e-posta", savings: "₺800 maliyet azalması" }
      ]
    },
    {
      id: 3,
      processName: "Tedarik Zinciri Yönetimi",
      currentDuration: "15 gün",
      targetDuration: "10 gün",
      currentCost: "₺8,500",
      targetCost: "₺6,200",
      efficiency: 42,
      status: "planlama",
      impact: "kritik",
      improvements: [
        { area: "Tedarikçi Seçimi", improvement: "AI destekli seçim", savings: "30% hızlanma" },
        { area: "Sipariş Takibi", improvement: "Real-time tracking", savings: "50% görünürlük artışı" },
        { area: "Stok Yönetimi", improvement: "Predictive analytics", savings: "₺2,300 maliyet azalması" }
      ]
    }
  ];

  const kpiMetrics = [
    { name: "Ortalama Süreç Süresi", current: "8.5 gün", target: "5.2 gün", change: -15, trend: "iyileşiyor" },
    { name: "Süreç Verimliliği", current: "%78", target: "%90", change: 8, trend: "iyileşiyor" },
    { name: "Operasyonel Maliyet", current: "₺45,200", target: "₺38,000", change: -12, trend: "iyileşiyor" },
    { name: "Müşteri Memnuniyeti", current: "%84", target: "%92", change: 6, trend: "iyileşiyor" },
    { name: "Hata Oranı", current: "%3.2", target: "%1.5", change: -25, trend: "iyileşiyor" },
    { name: "Çalışan Verimliliği", current: "%89", target: "%95", change: 4, trend: "iyileşiyor" }
  ];

  const bottlenecks = [
    {
      process: "Finansal Onay Süreci",
      impact: "Yüksek",
      delay: "3-5 gün",
      reason: "Manuel onay adımları",
      solution: "Dijital onay workflow",
      priority: "acil"
    },
    {
      process: "Kalite Kontrol",
      impact: "Orta",
      delay: "1-2 gün",
      reason: "Kaynak yetersizliği",
      solution: "Ek personel ve otomasyon",
      priority: "yüksek"
    },
    {
      process: "Dokümantasyon",
      impact: "Düşük",
      delay: "4-6 saat",
      reason: "Standart eksikliği",
      solution: "Template oluşturma",
      priority: "orta"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'aktif':
        return <Badge className="bg-green-100 text-green-800 border-green-200">🔄 Aktif</Badge>;
      case 'tamamlandı':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">✅ Tamamlandı</Badge>;
      case 'planlama':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">📋 Planlama</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch(impact) {
      case 'kritik':
        return <Badge variant="destructive">🚨 Kritik</Badge>;
      case 'yüksek':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">🔥 Yüksek</Badge>;
      case 'orta':
        return <Badge variant="secondary">📊 Orta</Badge>;
      default:
        return <Badge>Düşük</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'acil':
        return <Badge variant="destructive">🚨 Acil</Badge>;
      case 'yüksek':
        return <Badge className="bg-red-100 text-red-800 border-red-200">🔴 Yüksek</Badge>;
      case 'orta':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">🟡 Orta</Badge>;
      default:
        return <Badge>Düşük</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-red-50 via-white to-rose-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Süreç Optimizasyonu</h1>
            <p className="text-red-100 text-lg">İş süreçlerini analiz edin ve verimliliği artırın</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <Zap className="h-8 w-8 mx-auto mb-1" />
              <div className="text-2xl font-bold">78%</div>
              <div className="text-red-200 text-sm">Ortalama Verimlilik</div>
            </div>
            <div>
              <TrendingUp className="h-8 w-8 mx-auto mb-1" />
              <div className="text-2xl font-bold">+12%</div>
              <div className="text-red-200 text-sm">Bu Ay İyileşme</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Optimizasyon Projeleri</TabsTrigger>
          <TabsTrigger value="kpi">Performans Metrikleri</TabsTrigger>
          <TabsTrigger value="bottlenecks">Darboğazlar</TabsTrigger>
          <TabsTrigger value="tools">Analiz Araçları</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Optimizasyon Projeleri</h2>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Proje Başlat
            </Button>
          </div>

          <div className="grid gap-6">
            {optimizationProjects.map((project) => (
              <Card key={project.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gray-800">{project.processName}</CardTitle>
                      <CardDescription className="mt-1">
                        {project.currentDuration} → {project.targetDuration} • {project.currentCost} → {project.targetCost}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(project.status)}
                      {getImpactBadge(project.impact)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Verimlilik Skoru</span>
                      <span className="text-sm font-bold text-red-600">{project.efficiency}%</span>
                    </div>
                    <Progress value={project.efficiency} className="h-2" />
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">İyileştirme Alanları:</h4>
                    <div className="space-y-2">
                      {project.improvements.map((improvement, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium text-sm">{improvement.area}</span>
                              <p className="text-xs text-gray-600">{improvement.improvement}</p>
                            </div>
                            <Badge variant="outline" className="text-green-700 border-green-200">
                              {improvement.savings}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Detaylı Analiz Görüntüle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kpi" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Performans Metrikleri</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {kpiMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-800">{metric.name}</h3>
                    <div className="flex items-center gap-1">
                      {metric.change > 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(metric.change)}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mevcut:</span>
                      <span className="font-bold text-lg">{metric.current}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Hedef:</span>
                      <span className="text-sm text-gray-800">{metric.target}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bottlenecks" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Süreç Darboğazları</h2>
          
          <div className="space-y-4">
            {bottlenecks.map((bottleneck, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{bottleneck.process}</h3>
                      <p className="text-sm text-gray-600">Gecikme: {bottleneck.delay}</p>
                    </div>
                    <div className="flex gap-2">
                      {getImpactBadge(bottleneck.impact.toLowerCase())}
                      {getPriorityBadge(bottleneck.priority)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Neden:</span>
                      <p className="font-medium">{bottleneck.reason}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Önerilen Çözüm:</span>
                      <p className="font-medium">{bottleneck.solution}</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    Çözüm Planı Oluştur
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Darboğaz Çözüm Önerileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Otomasyon Fırsatı</p>
                  <p className="text-sm text-blue-700">Manuel süreçlerin %60'ı otomatikleştirilebilir.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Kaynak Eksikliği</p>
                  <p className="text-sm text-yellow-700">Kritik süreçlerde ek personel ihtiyacı tespit edildi.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Analiz Araçları</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-red-600" />
                  Süreç Haritalama
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">İş süreçlerini görselleştirin ve analiz edin</p>
                <Button variant="outline" className="w-full">Harita Oluştur</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
                  Performans Analizi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Süreç performansını detaylı analiz edin</p>
                <Button variant="outline" className="w-full">Analiz Başlat</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-red-600" />
                  Kaizen Metodolojisi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Sürekli iyileştirme projelerini yönetin</p>
                <Button variant="outline" className="w-full">Kaizen Başlat</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-red-600" />
                  Lean Six Sigma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Kalite ve verimlilik metodolojileri</p>
                <Button variant="outline" className="w-full">Proje Başlat</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}