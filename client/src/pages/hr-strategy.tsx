import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, TrendingUp, Users, Calendar, CheckCircle, AlertCircle, Plus, BarChart3, PieChart, Activity, Award, BookOpen, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const strategySchema = z.object({
  title: z.string().min(1, "Hedef başlığı gereklidir"),
  description: z.string().min(10, "En az 10 karakter açıklama gereklidir"),
  deadline: z.string().min(1, "Bitiş tarihi gereklidir"),
  responsible: z.string().min(1, "Sorumlu kişi seçimi gereklidir"),
  priority: z.string().min(1, "Öncelik seviyesi gereklidir"),
  metrics: z.string().min(5, "Başarı metrikleri gereklidir")
});

type StrategyFormData = z.infer<typeof strategySchema>;

export default function HRStrategyPage() {
  const form = useForm<StrategyFormData>({
    resolver: zodResolver(strategySchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
      responsible: "",
      priority: "",
      metrics: ""
    }
  });
  
  const strategicGoals = [
    {
      id: 1,
      title: "Çalışan Memnuniyeti Artırma",
      description: "2024 yılında çalışan memnuniyet oranını %95'e çıkarma",
      progress: 87,
      status: "devam_ediyor",
      deadline: "2024-12-31",
      responsible: "İK Müdürü",
      priority: "yüksek",
      metrics: ["Memnuniyet anketleri", "Çıkış mülakatları", "Geri bildirim skorları"]
    },
    {
      id: 2,
      title: "Yetenek Kazanımı",
      description: "Stratejik pozisyonlar için kaliteli aday havuzu oluşturma",
      progress: 65,
      status: "aktif",
      deadline: "2024-09-30",
      responsible: "İK Uzmanı",
      priority: "yüksek",
      metrics: ["Başvuru kalitesi", "İşe alım süresi", "Başarılı işe alım oranı"]
    },
    {
      id: 3,
      title: "Dijital Dönüşüm",
      description: "İK süreçlerinin %100 dijitalleştirilmesi",
      progress: 78,
      status: "devam_ediyor",
      deadline: "2024-08-15",
      responsible: "İK Müdürü",
      priority: "orta",
      metrics: ["Dijital süreç oranı", "Verimlilik artışı", "Kullanıcı adaptasyonu"]
    },
    {
      id: 4,
      title: "Performans Yönetimi",
      description: "Modern performans değerlendirme sisteminin implementasyonu",
      progress: 92,
      status: "tamamlanma_aşamasında",
      deadline: "2024-07-01",
      responsible: "İK Müdürü",
      priority: "yüksek",
      metrics: ["Değerlendirme tamamlanma oranı", "Manager feedback", "Goal achievement"]
    }
  ];

  const hrMetrics = [
    {
      title: "Çalışan Devir Oranı",
      value: "8.2%",
      trend: "↓ 2.1%",
      status: "pozitif",
      target: "<%10"
    },
    {
      title: "İşe Alım Süresi",
      value: "12 gün",
      trend: "↓ 3 gün",
      status: "pozitif",
      target: "<15 gün"
    },
    {
      title: "Eğitim ROI",
      value: "₺4.2M",
      trend: "↑ 15%",
      status: "pozitif",
      target: ">₺3M"
    },
    {
      title: "Çalışan NPS",
      value: "72",
      trend: "↑ 8 puan",
      status: "pozitif",
      target: ">70"
    }
  ];

  const strategicInitiatives = [
    {
      id: 1,
      name: "Hibrit Çalışma Modeli",
      phase: "Pilot",
      completion: 45,
      startDate: "2024-03-01",
      endDate: "2024-12-31",
      budget: "₺150.000",
      team: "5 kişi",
      impact: "Yüksek"
    },
    {
      id: 2,
      name: "AI Destekli İşe Alım",
      phase: "Araştırma",
      completion: 25,
      startDate: "2024-05-15",
      endDate: "2024-11-30",
      budget: "₺280.000",
      team: "3 kişi",
      impact: "Orta"
    },
    {
      id: 3,
      name: "Çalışan Wellness Programı",
      phase: "İmplementasyon",
      completion: 75,
      startDate: "2024-01-15",
      endDate: "2024-10-31",
      budget: "₺320.000",
      team: "4 kişi",
      impact: "Yüksek"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'aktif':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">🟢 Aktif</Badge>;
      case 'devam_ediyor':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">🔄 Devam Ediyor</Badge>;
      case 'tamamlanma_aşamasında':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">⚡ Tamamlanıyor</Badge>;
      case 'tamamlandı':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">✅ Tamamlandı</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'yüksek': return 'border-l-gray-500';
      case 'orta': return 'border-l-gray-400';
      case 'düşük': return 'border-l-gray-300';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 pb-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">İK Stratejisi</h1>
              <p className="text-gray-600">Stratejik İnsan Kaynakları planlaması ve hedef yönetimi</p>
            </div>
            <Button className="mt-4 lg:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Strateji Ekle
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {hrMetrics.map((metric, index) => (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-xs mt-1 text-gray-600">{metric.trend} (Hedef: {metric.target})</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="goals">Stratejik Hedefler</TabsTrigger>
            <TabsTrigger value="initiatives">İnisiyatifler</TabsTrigger>
            <TabsTrigger value="roadmap">Yol Haritası</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">2024 Stratejik Hedefleri</h2>
              <Button>
                <Target className="h-4 w-4 mr-2" />
                Yeni Hedef Belirle
              </Button>
            </div>

            <div className="grid gap-6">
              {strategicGoals.map((goal) => (
                <Card key={goal.id} className={`border-l-4 ${getPriorityColor(goal.priority)}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{goal.title}</CardTitle>
                        <CardDescription className="mt-1">{goal.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(goal.status)}
                        <Badge variant="outline">{goal.priority}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Sorumlu:</span>
                        <p className="font-medium">{goal.responsible}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Son Tarih:</span>
                        <p className="font-medium">{goal.deadline}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">İlerleme:</span>
                        <p className="font-medium">%{goal.progress}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Öncelik:</span>
                        <p className="font-medium capitalize">{goal.priority}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">İlerleme</span>
                        <span className="text-sm text-gray-600">%{goal.progress}</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>

                    <div>
                      <span className="text-gray-500 text-sm">Ana Metrikler:</span>
                      <div className="flex gap-2 mt-1">
                        {goal.metrics.map((metric, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        Detaylar
                      </Button>
                      <Button size="sm">
                        Güncelle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="initiatives" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Stratejik İnisiyatifler</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Yeni İnisiyatif
              </Button>
            </div>

            <div className="grid gap-6">
              {strategicInitiatives.map((initiative) => (
                <Card key={initiative.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{initiative.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {initiative.startDate} - {initiative.endDate}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{initiative.phase}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Bütçe:</span>
                        <p className="font-medium">{initiative.budget}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Takım:</span>
                        <p className="font-medium">{initiative.team}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Etki:</span>
                        <p className="font-medium">{initiative.impact}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tamamlanma:</span>
                        <p className="font-medium">%{initiative.completion}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">İlerleme</span>
                        <span className="text-sm text-gray-600">%{initiative.completion}</span>
                      </div>
                      <Progress value={initiative.completion} className="h-2" />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analiz
                      </Button>
                      <Button size="sm">
                        Yönet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">2024-2025 İK Yol Haritası</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    Q2 2024
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">Performans sistemi launch</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">Wellness programı pilot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">Hibrit model geliştirme</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    Q3 2024
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">AI işe alım sistemi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">Dijital onboarding</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">Yetenek analizi platformu</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    Q4 2024
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">Global expansion İK</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">Sürdürülebilirlik programı</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">2025 strateji planlama</span>
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