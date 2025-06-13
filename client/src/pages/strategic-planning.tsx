import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, TrendingUp, Calendar, Users, ChevronRight, Plus, AlertTriangle, CheckCircle } from "lucide-react";

export default function StrategicPlanningPage() {
  const strategicObjectives = [
    {
      id: 1,
      title: "Dijital Dönüşüm İnisiyatifi",
      description: "Departman süreçlerinin %80'ini dijitalleştirme",
      deadline: "2024-12-31",
      progress: 65,
      status: "devam_ediyor",
      responsible: "Ahmet Yılmaz",
      budget: "₺450,000",
      keyResults: [
        "CRM sistemi implementasyonu - %90 tamamlandı",
        "Süreç otomasyonu - %60 tamamlandı", 
        "Personel eğitimleri - %45 tamamlandı"
      ]
    },
    {
      id: 2,
      title: "Yetenek Geliştirme Programı",
      description: "Ekip üyelerinin teknik ve liderlik becerilerini artırma",
      deadline: "2024-10-15",
      progress: 85,
      status: "hedefte",
      responsible: "Zeynep Kara",
      budget: "₺180,000",
      keyResults: [
        "Liderlik eğitimi programı - %100 tamamlandı",
        "Teknik sertifikasyon - %80 tamamlandı",
        "Mentorluk programı - %75 tamamlandı"
      ]
    },
    {
      id: 3,
      title: "Müşteri Memnuniyeti Artırma",
      description: "Müşteri memnuniyet skorunu %95'e çıkarma",
      deadline: "2024-11-30",
      progress: 42,
      status: "risk",
      responsible: "Mehmet Öz",
      budget: "₺320,000",
      keyResults: [
        "Müşteri geri bildirim sistemi - %80 tamamlandı",
        "Hizmet kalitesi iyileştirmeleri - %30 tamamlandı",
        "Müşteri destek ekibi güçlendirme - %25 tamamlandı"
      ]
    }
  ];

  const quarterlyGoals = [
    {
      quarter: "Q4 2024",
      goals: [
        { title: "Operasyonel Verimlilik", target: "%25 artış", current: "%18 artış", status: "hedefte" },
        { title: "Çalışan Bağlılığı", target: "%90", current: "%87", status: "hedefte" },
        { title: "Proje Teslim Süresi", target: "15 gün", current: "18 gün", status: "risk" },
        { title: "Kalite Skorları", target: "%95", current: "%92", status: "hedefte" }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'hedefte':
        return <Badge className="bg-green-100 text-green-800 border-green-200">🎯 Hedefte</Badge>;
      case 'risk':
        return <Badge className="bg-red-100 text-red-800 border-red-200">⚠️ Risk</Badge>;
      case 'devam_ediyor':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">🔄 Devam Ediyor</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-red-50 via-white to-rose-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Stratejik Planlama</h1>
            <p className="text-red-100 text-lg">Departman stratejilerini yönetin ve hedefleri takip edin</p>
          </div>
          <div className="text-center">
            <Target className="h-16 w-16 mx-auto mb-2" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-red-200 text-sm">Aktif Hedef</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="objectives" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="objectives">Stratejik Hedefler</TabsTrigger>
          <TabsTrigger value="quarterly">Çeyreklik Hedefler</TabsTrigger>
          <TabsTrigger value="planning">Planlama Araçları</TabsTrigger>
        </TabsList>

        <TabsContent value="objectives" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Stratejik Hedefler</h2>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Hedef Ekle
            </Button>
          </div>

          <div className="grid gap-6">
            {strategicObjectives.map((objective) => (
              <Card key={objective.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-800">{objective.title}</CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        {objective.description}
                      </CardDescription>
                    </div>
                    {getStatusBadge(objective.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Sorumlu:</span>
                      <p className="font-medium">{objective.responsible}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Bitiş Tarihi:</span>
                      <p className="font-medium">{objective.deadline}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Bütçe:</span>
                      <p className="font-medium">{objective.budget}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">İlerleme</span>
                      <span className="text-sm font-bold text-red-600">{objective.progress}%</span>
                    </div>
                    <Progress value={objective.progress} className="h-2" />
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Temel Sonuçlar:</h4>
                    <div className="space-y-1">
                      {objective.keyResults.map((result, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Detayları Görüntüle
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quarterly" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Çeyreklik Performans Hedefleri</h2>
          
          {quarterlyGoals.map((quarter) => (
            <Card key={quarter.quarter}>
              <CardHeader>
                <CardTitle className="text-red-700">{quarter.quarter}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quarter.goals.map((goal, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{goal.title}</h4>
                        {getStatusBadge(goal.status)}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Hedef: {goal.target}</p>
                        <p>Mevcut: {goal.current}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Planlama Araçları</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
                  SWOT Analizi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Departmanın güçlü ve zayıf yönlerini analiz edin</p>
                <Button variant="outline" className="w-full">Analiz Başlat</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-red-600" />
                  Gantt Şeması
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Proje zaman çizelgelerini görselleştirin</p>
                <Button variant="outline" className="w-full">Şema Oluştur</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-red-600" />
                  Kaynak Planlama
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">İnsan kaynakları ve bütçe planlaması</p>
                <Button variant="outline" className="w-full">Planlama Başlat</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Risk Analizi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Potansiyel riskleri belirleyin ve önlem alın</p>
                <Button variant="outline" className="w-full">Risk Analizi</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}