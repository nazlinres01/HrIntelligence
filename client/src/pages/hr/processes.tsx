import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Users, Clock, CheckCircle, AlertCircle, Plus, Calendar, FileText, Target } from "lucide-react";

export default function HRProcessesPage() {
  const hrProcesses = [
    {
      id: 1,
      name: "İşe Alım Süreci",
      description: "Aday değerlendirmeden işe başlangıca kadar olan süreç",
      status: "aktif",
      completion: 85,
      totalSteps: 8,
      completedSteps: 7,
      averageDuration: "14 gün",
      responsibleTeam: "İK Uzmanı",
      lastUpdated: "2024-06-13",
      nextMilestone: "Oryantasyon Programı"
    },
    {
      id: 2,
      name: "Performans Değerlendirme",
      description: "Çeyreklik performans değerlendirme süreci",
      status: "devam_ediyor",
      completion: 60,
      totalSteps: 5,
      completedSteps: 3,
      averageDuration: "21 gün",
      responsibleTeam: "İK & Departman Müdürleri",
      lastUpdated: "2024-06-10",
      nextMilestone: "Manager Review"
    },
    {
      id: 3,
      name: "İzin Onay Süreci",
      description: "Çalışan izin talep ve onay işlem adımları",
      status: "tamamlandı",
      completion: 100,
      totalSteps: 4,
      completedSteps: 4,
      averageDuration: "3 gün",
      responsibleTeam: "İK Uzmanı",
      lastUpdated: "2024-06-12",
      nextMilestone: "Süreç Tamamlandı"
    },
    {
      id: 4,
      name: "Bordro Hazırlama",
      description: "Aylık bordro hesaplama ve onay süreci",
      status: "bekliyor",
      completion: 25,
      totalSteps: 6,
      completedSteps: 1,
      averageDuration: "7 gün",
      responsibleTeam: "İK Uzmanı & Muhasebe",
      lastUpdated: "2024-06-01",
      nextMilestone: "Puantaj Kontrolü"
    }
  ];

  const processMetrics = [
    {
      title: "Aktif Süreçler",
      value: "12",
      trend: "+2",
      description: "Bu ay başlatılan süreçler",
      icon: Zap,
      color: "text-blue-600"
    },
    {
      title: "Ortalama Tamamlanma",
      value: "18 gün",
      trend: "-3 gün",
      description: "Geçen aya göre iyileşme",
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "Başarı Oranı",
      value: "94%",
      trend: "+5%",
      description: "Süreç tamamlama başarısı",
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: "Bekleyen İşlemler",
      value: "7",
      trend: "-2",
      description: "Onay bekleyen işlemler",
      icon: AlertCircle,
      color: "text-orange-600"
    }
  ];

  const processTemplates = [
    {
      id: 1,
      name: "Standart İşe Alım",
      description: "Genel pozisyonlar için işe alım süreci",
      steps: ["CV İnceleme", "Telefon Görüşmesi", "Teknik Mülakat", "İK Görüşmesi", "Referans Kontrolü", "Onay", "Teklif", "Oryantasyon"],
      estimatedDuration: "10-15 gün",
      category: "İşe Alım"
    },
    {
      id: 2,
      name: "Üst Düzey İşe Alım",
      description: "Yönetici pozisyonları için detaylı süreç",
      steps: ["CV İnceleme", "İlk Görüşme", "Case Study", "Panel Mülakat", "Referans Kontrolü", "Background Check", "Nihai Onay", "Onboarding"],
      estimatedDuration: "20-25 gün",
      category: "İşe Alım"
    },
    {
      id: 3,
      name: "Çıkış Süreci",
      description: "Personel ayrılık işlem adımları",
      steps: ["İstifa Bildirimi", "İş Devir Teslim", "Clearance Form", "Exit Interview", "Hesap Kapatma", "Belge Teslimi"],
      estimatedDuration: "5-10 gün",
      category: "Ayrılık"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'aktif':
        return <Badge className="bg-green-100 text-green-800 border-green-200">🟢 Aktif</Badge>;
      case 'devam_ediyor':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">🔄 Devam Ediyor</Badge>;
      case 'tamamlandı':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">✅ Tamamlandı</Badge>;
      case 'bekliyor':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⏳ Bekliyor</Badge>;
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">İK Süreçleri</h1>
            <p className="text-gray-600">İnsan kaynakları süreçlerini yönetin ve optimize edin</p>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {processMetrics.map((metric, index) => (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-xs text-green-600 mt-1">{metric.trend} {metric.description}</p>
                  </div>
                  <metric.icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Aktif Süreçler</TabsTrigger>
            <TabsTrigger value="templates">Süreç Şablonları</TabsTrigger>
            <TabsTrigger value="analytics">Süreç Analitiği</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Aktif İK Süreçleri</h2>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Süreç Başlat
              </Button>
            </div>

            <div className="grid gap-6">
              {hrProcesses.map((process) => (
                <Card key={process.id} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{process.name}</CardTitle>
                        <CardDescription className="mt-1">{process.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(process.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Sorumlu:</span>
                        <p className="font-medium">{process.responsibleTeam}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Ortalama Süre:</span>
                        <p className="font-medium">{process.averageDuration}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">İlerleme:</span>
                        <p className="font-medium">{process.completedSteps}/{process.totalSteps} adım</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Sonraki Milestone:</span>
                        <p className="font-medium">{process.nextMilestone}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Tamamlanma Oranı</span>
                        <span className="text-sm font-bold text-orange-600">{process.completion}%</span>
                      </div>
                      <Progress value={process.completion} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-gray-500">Son güncelleme: {process.lastUpdated}</span>
                      <Button variant="outline" size="sm">
                        Detayları Görüntüle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Süreç Şablonları</h2>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Şablon Oluştur
              </Button>
            </div>

            <div className="grid gap-6">
              {processTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{template.name}</CardTitle>
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500 text-sm">Süreç Adımları:</span>
                        <div className="mt-2 space-y-1">
                          {template.steps.map((step, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                                {index + 1}
                              </span>
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-gray-500 text-sm">Tahmini Süre:</span>
                          <p className="font-medium">{template.estimatedDuration}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Şablonu Düzenle
                          </Button>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Süreci Başlat
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Süreç Performans Analitiği</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Süreç Verimlilik Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>İşe Alım Süreci</span>
                      <span className="text-green-600 font-medium">+15% iyileşme</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Performans Değerlendirme</span>
                      <span className="text-blue-600 font-medium">Sabit performans</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>İzin Onay Süreci</span>
                      <span className="text-green-600 font-medium">+25% hızlanma</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Süreç Bottlenecks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Referans Kontrolü</span>
                      <Badge className="bg-red-100 text-red-800">Darboğaz</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Manager Onayları</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Yavaş</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Dokümantasyon</span>
                      <Badge className="bg-green-100 text-green-800">Sorunsuz</Badge>
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