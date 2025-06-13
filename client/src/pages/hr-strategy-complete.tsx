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
import { Target, TrendingUp, Users, Calendar, CheckCircle, AlertCircle, Plus, BarChart3, PieChart, Activity, Award, BookOpen, Zap, Clock, Building, DollarSign } from "lucide-react";
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

export default function HRStrategyComplete() {
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
      description: "2024 yılında çalışan memnuniyet oranını %95'e çıkarma hedefi",
      progress: 87,
      status: "devam_ediyor",
      deadline: "2024-12-31",
      responsible: "İK Müdürü",
      priority: "yüksek",
      metrics: ["Memnuniyet anketleri: %87", "Çıkış mülakatları pozitif: %82", "Geri bildirim skorları: 4.3/5"],
      budget: "₺150.000",
      team: ["Elif Çelik", "Mehmet Yıldız", "Ayşe Kara"]
    },
    {
      id: 2,
      title: "Yetenek Kazanımı Programı",
      description: "Stratejik pozisyonlar için kaliteli aday havuzu oluşturma",
      progress: 65,
      status: "aktif",
      deadline: "2024-09-30",
      responsible: "İK Uzmanı",
      priority: "yüksek",
      metrics: ["Başvuru kalitesi artışı: %45", "İşe alım süresi azalması: 18 gün", "Başarılı işe alım oranı: %78"],
      budget: "₺85.000",
      team: ["Ahmet Özkan", "Seda Yılmaz"]
    },
    {
      id: 3,
      title: "Dijital İK Dönüşümü",
      description: "İK süreçlerinin %100 dijitalleştirilmesi ve otomasyon",
      progress: 78,
      status: "devam_ediyor",
      deadline: "2024-08-15",
      responsible: "İK Müdürü",
      priority: "orta",
      metrics: ["Dijital süreç oranı: %78", "Verimlilik artışı: %32", "Kullanıcı adaptasyonu: %85"],
      budget: "₺220.000",
      team: ["IT Departmanı", "İK Ekibi"]
    },
    {
      id: 4,
      title: "Performans Yönetimi 2.0",
      description: "Modern performans değerlendirme sisteminin tam implementasyonu",
      progress: 92,
      status: "tamamlanma_aşamasında",
      deadline: "2024-07-01",
      responsible: "İK Uzmanı",
      priority: "kritik",
      metrics: ["Sistem kullanım oranı: %92", "Manager kabul oranı: %89", "Çalışan memnuniyeti: %91"],
      budget: "₺75.000",
      team: ["Tüm Departman Müdürleri"]
    },
    {
      id: 5,
      title: "Eğitim ve Gelişim Stratejisi",
      description: "Kapsamlı çalışan gelişim programları ve kariyer planlaması",
      progress: 56,
      status: "başlatıldı",
      deadline: "2024-11-30",
      responsible: "İK Müdürü",
      priority: "orta",
      metrics: ["Eğitim katılım oranı: %72", "Beceri geliştirme skoru: %56", "İç terfi oranı: %34"],
      budget: "₺180.000",
      team: ["Eğitim Koordinatörü", "Departman Liderleri"]
    }
  ];

  const kpiMetrics = [
    {
      title: "Genel Çalışan Memnuniyeti",
      value: "87%",
      change: "+8%",
      changeType: "increase",
      icon: Users,
      color: "text-green-600",
      bgColor: "from-green-50 to-emerald-100",
      borderColor: "border-green-200"
    },
    {
      title: "Yıllık Turnover Oranı",
      value: "12%",
      change: "-5%",
      changeType: "decrease",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "from-blue-50 to-sky-100",
      borderColor: "border-blue-200"
    },
    {
      title: "İşe Alım Süresi",
      value: "18 gün",
      change: "-7 gün",
      changeType: "decrease",
      icon: Clock,
      color: "text-emerald-600",
      bgColor: "from-emerald-50 to-green-100",
      borderColor: "border-emerald-200"
    },
    {
      title: "Eğitim ROI",
      value: "₺3.2M",
      change: "+15%",
      changeType: "increase",
      icon: Award,
      color: "text-teal-600",
      bgColor: "from-teal-50 to-emerald-100",
      borderColor: "border-teal-200"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'devam_ediyor':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">🔄 Devam Ediyor</Badge>;
      case 'aktif':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Aktif</Badge>;
      case 'tamamlanma_aşamasında':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⚡ Tamamlanıyor</Badge>;
      case 'başlatıldı':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">🚀 Başlatıldı</Badge>;
      case 'beklemede':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">⏸️ Beklemede</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'kritik':
        return <Badge className="bg-red-100 text-red-800 border-red-200">🔴 Kritik</Badge>;
      case 'yüksek':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">🟡 Yüksek</Badge>;
      case 'orta':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">🔵 Orta</Badge>;
      case 'düşük':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">⚪ Düşük</Badge>;
      default:
        return <Badge>Normal</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-3">
              İK Stratejik Komuta Merkezi
            </h1>
            <p className="text-gray-700 text-lg">Kurumsal İK hedefleri ve stratejik planları yönetin</p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
              <BarChart3 className="h-4 w-4 mr-2" />
              Stratejik Analitik
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Stratejik Hedef
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-green-700">Yeni Stratejik Hedef Oluştur</DialogTitle>
                  <DialogDescription>
                    Kurumsal İK stratejiniz için yeni hedef tanımlayın
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hedef Başlığı</FormLabel>
                          <FormControl>
                            <Input placeholder="ör: Çalışan Memnuniyeti Artırma" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detaylı Açıklama</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Hedefinizin detaylı açıklamasını yazın..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bitiş Tarihi</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="responsible"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sorumlu Kişi</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sorumlu seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ik_muduru">İK Müdürü</SelectItem>
                                <SelectItem value="ik_uzmani">İK Uzmanı</SelectItem>
                                <SelectItem value="departman_muduru">Departman Müdürü</SelectItem>
                                <SelectItem value="genel_mudur">Genel Müdür</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Öncelik Seviyesi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Öncelik seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="kritik">🔴 Kritik</SelectItem>
                              <SelectItem value="yuksek">🟡 Yüksek</SelectItem>
                              <SelectItem value="orta">🟠 Orta</SelectItem>
                              <SelectItem value="dusuk">🟢 Düşük</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metrics"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Başarı Metrikleri</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Bu hedefin başarısını nasıl ölçeceksiniz? (KPI'lar, metrikler)"
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline">İptal</Button>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Hedef Oluştur
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {kpiMetrics.map((metric, index) => (
            <Card key={index} className={`bg-gradient-to-r ${metric.bgColor} ${metric.borderColor} hover:shadow-lg transition-all duration-300 border-l-4`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
                    <p className={`text-sm ${metric.color} flex items-center`}>
                      {metric.changeType === 'increase' ? '↗️' : '↘️'} {metric.change}
                    </p>
                  </div>
                  <metric.icon className={`h-10 w-10 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-green-100">
            <TabsTrigger value="goals" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Stratejik Hedefler
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Analitik & Raporlar
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Yol Haritası
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Kaynak Yönetimi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid gap-6">
              {strategicGoals.map((goal) => (
                <Card key={goal.id} className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow bg-white">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-xl text-gray-900 mb-2">{goal.title}</h3>
                            <p className="text-gray-600 mb-3">{goal.description}</p>
                            <div className="flex gap-2 mb-3">
                              {getStatusBadge(goal.status)}
                              {getPriorityBadge(goal.priority)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>İlerleme Durumu</span>
                            <span className="font-medium text-green-600">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-3 bg-green-100" />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Hedef Detayları</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Bitiş: {new Date(goal.deadline).toLocaleDateString('tr-TR')}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            <span>Sorumlu: {goal.responsible}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>Bütçe: {goal.budget}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Building className="h-4 w-4 mr-2" />
                            <span>Ekip: {goal.team.length} kişi</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50">
                          <Target className="h-4 w-4 mr-2" />
                          Detayları Gör
                        </Button>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          İlerleme Raporu
                        </Button>
                        <Button variant="outline" size="sm" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                          <Activity className="h-4 w-4 mr-2" />
                          Görev Yönetimi
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h5 className="font-medium text-gray-900 mb-2">Başarı Metrikleri</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {goal.metrics.map((metric, index) => (
                          <div key={index} className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-gray-700">{metric}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">Hedef Başarı Oranları</CardTitle>
                  <CardDescription>Son 6 ay stratejik hedef performansı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Tamamlanan Hedefler</span>
                      <span className="font-bold text-green-600">12/15 (%80)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Zamanında Tamamlanan</span>
                      <span className="font-bold text-blue-600">9/12 (%75)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Bütçe Uyumu</span>
                      <span className="font-bold text-emerald-600">%92</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">ROI Analizi</CardTitle>
                  <CardDescription>İK stratejilerinin getirisi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Toplam Yatırım</span>
                      <span className="font-bold">₺710.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Getiri</span>
                      <span className="font-bold text-green-600">₺2.1M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI Oranı</span>
                      <span className="font-bold text-green-600">%295</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">2024 İK Stratejik Yol Haritası</CardTitle>
                <CardDescription>Yıllık hedefler ve kilometre taşları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h4 className="font-medium">Q1 - Temel Altyapı</h4>
                      <p className="text-sm text-gray-600">Sistemler entegrasyonu ve süreç optimizasyonu</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Tamamlandı</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <Activity className="h-6 w-6 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Q2 - Yetenek Geliştirme</h4>
                      <p className="text-sm text-gray-600">Eğitim programları ve kariyer planlaması</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Devam Ediyor</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                    <Target className="h-6 w-6 text-yellow-600" />
                    <div>
                      <h4 className="font-medium">Q3 - İnovasyon</h4>
                      <p className="text-sm text-gray-600">AI destekli İK çözümleri ve dijitalleşme</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Planlandı</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Q4 - Süreklilik</h4>
                      <p className="text-sm text-gray-600">Sürdürülebilirlik ve sürekli iyileştirme</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Beklemede</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">Bütçe Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Eğitim & Gelişim</span>
                      <span>%35</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Teknoloji</span>
                      <span>%28</span>
                    </div>
                    <div className="flex justify-between">
                      <span>İşe Alım</span>
                      <span>%22</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Çalışan Deneyimi</span>
                      <span>%15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">İnsan Kaynağı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>İK Uzmanı</span>
                      <span>3 kişi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>İK Müdürü</span>
                      <span>1 kişi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Destek Ekibi</span>
                      <span>2 kişi</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dış Danışman</span>
                      <span>1 firma</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">Teknoloji Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>HRIS Sistemi</span>
                      <span>✅ Aktif</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ATS Platform</span>
                      <span>✅ Aktif</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Analitik Tools</span>
                      <span>🔄 Entegre</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Assistants</span>
                      <span>📋 Planlı</span>
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