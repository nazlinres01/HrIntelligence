import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, DollarSign, Calendar, TrendingUp, Plus, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function ResourcePlanningPage() {
  const resourceAllocations = [
    {
      id: 1,
      projectName: "CRM Sistem Geliştirme",
      teamSize: 8,
      budget: "₺680,000",
      budgetUsed: "₺420,000",
      budgetUtilization: 62,
      timeline: "6 ay",
      status: "aktif",
      priority: "yüksek",
      resources: [
        { type: "Yazılım Geliştirici", allocated: 4, needed: 4, utilization: 85 },
        { type: "UI/UX Tasarımcı", allocated: 2, needed: 2, utilization: 90 },
        { type: "Test Uzmanı", allocated: 1, needed: 2, utilization: 95 },
        { type: "Proje Yöneticisi", allocated: 1, needed: 1, utilization: 75 }
      ]
    },
    {
      id: 2,
      projectName: "Dijital Pazarlama Kampanyası",
      teamSize: 5,
      budget: "₺320,000",
      budgetUsed: "₺180,000",
      budgetUtilization: 56,
      timeline: "3 ay",
      status: "planlama",
      priority: "orta",
      resources: [
        { type: "Pazarlama Uzmanı", allocated: 2, needed: 3, utilization: 80 },
        { type: "Grafik Tasarımcı", allocated: 1, needed: 1, utilization: 70 },
        { type: "İçerik Editörü", allocated: 1, needed: 2, utilization: 85 },
        { type: "Sosyal Medya Uzmanı", allocated: 1, needed: 1, utilization: 90 }
      ]
    },
    {
      id: 3,
      projectName: "Operasyonel Verimlilik Projesi",
      teamSize: 6,
      budget: "₺450,000",
      budgetUsed: "₺380,000",
      budgetUtilization: 84,
      timeline: "4 ay",
      status: "risk",
      priority: "kritik",
      resources: [
        { type: "İş Analisti", allocated: 2, needed: 2, utilization: 95 },
        { type: "Süreç Uzmanı", allocated: 2, needed: 3, utilization: 100 },
        { type: "Veri Analisti", allocated: 1, needed: 1, utilization: 90 },
        { type: "Change Management", allocated: 1, needed: 1, utilization: 85 }
      ]
    }
  ];

  const budgetBreakdown = [
    { category: "Personel Maliyetleri", allocated: "₺1,200,000", used: "₺980,000", percentage: 82 },
    { category: "Teknoloji & Araçlar", allocated: "₺300,000", used: "₺185,000", percentage: 62 },
    { category: "Eğitim & Gelişim", allocated: "₺180,000", used: "₺120,000", percentage: 67 },
    { category: "Operasyonel Giderler", allocated: "₺220,000", used: "₺195,000", percentage: 89 },
    { category: "Acil Durum Rezervi", allocated: "₺100,000", used: "₺0", percentage: 0 }
  ];

  const upcomingNeeds = [
    {
      project: "Q1 2025 Büyüme Projesi",
      needs: [
        { role: "Senior Developer", count: 2, urgency: "yüksek", startDate: "2025-01-15" },
        { role: "DevOps Engineer", count: 1, urgency: "orta", startDate: "2025-02-01" },
        { role: "Product Manager", count: 1, urgency: "yüksek", startDate: "2025-01-10" }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'aktif':
        return <Badge className="bg-green-100 text-green-800 border-green-200">🟢 Aktif</Badge>;
      case 'risk':
        return <Badge className="bg-red-100 text-red-800 border-red-200">🔴 Risk</Badge>;
      case 'planlama':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">📋 Planlama</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
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

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-red-50 via-white to-rose-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">Kaynak Planlaması</h1>
            <p className="text-gray-600 text-lg">İnsan kaynakları ve bütçe yönetimi</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <Users className="h-8 w-8 mx-auto mb-1 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">19</div>
              <div className="text-gray-500 text-sm">Aktif Kaynak</div>
            </div>
            <div>
              <DollarSign className="h-8 w-8 mx-auto mb-1 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">₺2.0M</div>
              <div className="text-gray-500 text-sm">Toplam Bütçe</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Proje Kaynakları</TabsTrigger>
          <TabsTrigger value="budget">Bütçe Yönetimi</TabsTrigger>
          <TabsTrigger value="planning">Kaynak Planlaması</TabsTrigger>
          <TabsTrigger value="forecast">Gelecek İhtiyaçlar</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Proje Kaynak Dağılımı</h2>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Proje Ekle
            </Button>
          </div>

          <div className="grid gap-6">
            {resourceAllocations.map((project) => (
              <Card key={project.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gray-800">{project.projectName}</CardTitle>
                      <CardDescription className="mt-1">
                        {project.teamSize} kişi • {project.timeline} • {project.budget}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(project.status)}
                      {getPriorityBadge(project.priority)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Bütçe Kullanımı</span>
                        <span className="text-sm font-bold text-red-600">{project.budgetUtilization}%</span>
                      </div>
                      <Progress value={project.budgetUtilization} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {project.budgetUsed} / {project.budget}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Kaynak Dağılımı:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {project.resources.map((resource, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">{resource.type}</span>
                            <span className="text-xs text-gray-500">
                              {resource.allocated}/{resource.needed}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={resource.utilization} className="flex-1 h-1" />
                            <span className="text-xs font-medium">{resource.utilization}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Bütçe Analizi</h2>
          
          <div className="grid gap-4">
            {budgetBreakdown.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">{item.category}</h3>
                    <div className="text-right">
                      <p className="font-bold text-lg">{item.used}</p>
                      <p className="text-sm text-gray-500">/ {item.allocated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={item.percentage} className="flex-1" />
                    <span className="font-medium text-sm">{item.percentage}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Bütçe Önerileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Operasyonel Giderler Yüksek</p>
                  <p className="text-sm text-yellow-700">%89 kullanım oranı ile bütçe aşımı riski bulunuyor.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Teknoloji Bütçesi Optimize</p>
                  <p className="text-sm text-green-700">Verimli kullanım ile tasarruf fırsatı var.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Kaynak Planlama Araçları</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-red-600" />
                  Kapasite Planlama
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Ekip kapasitesini ve iş yükünü analiz edin</p>
                <Button variant="outline" className="w-full">Kapasite Analizi</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
                  Maliyet Analizi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Proje maliyetlerini detaylı analiz edin</p>
                <Button variant="outline" className="w-full">Maliyet Raporu</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-red-600" />
                  Beceri Matrisi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Ekip becerilerini haritala ve yönet</p>
                <Button variant="outline" className="w-full">Beceri Analizi</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-red-600" />
                  Zaman Çizelgesi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Proje zaman çizelgelerini optimize edin</p>
                <Button variant="outline" className="w-full">Zaman Planlama</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Gelecek İhtiyaçlar</h2>
          
          {upcomingNeeds.map((project, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-red-700">{project.project}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.needs.map((need, needIndex) => (
                    <div key={needIndex} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{need.role}</h4>
                        <p className="text-sm text-gray-600">{need.count} kişi • Başlangıç: {need.startDate}</p>
                      </div>
                      <Badge className={need.urgency === 'yüksek' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                        {need.urgency === 'yüksek' ? '🔥 Acil' : '📋 Normal'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <Button className="w-full bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Yeni İhtiyaç Talebinde Bulun
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}