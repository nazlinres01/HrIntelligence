import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, CheckCircle, Calendar, User, FileText, Plus, Search, Filter, BarChart3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const activityFormSchema = z.object({
  title: z.string().min(1, "Aktivite başlığı gerekli"),
  description: z.string().min(1, "Açıklama gerekli"),
  category: z.string().min(1, "Kategori seçimi gerekli"),
  priority: z.string().min(1, "Öncelik seviyesi gerekli"),
  estimatedDuration: z.string().min(1, "Tahmini süre gerekli"),
  assignedTo: z.string().min(1, "Görevli seçimi gerekli"),
});

export default function DailyActivitiesPage() {
  const form = useForm<z.infer<typeof activityFormSchema>>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority: "",
      estimatedDuration: "",
      assignedTo: "",
    },
  });

  const todayActivities = [
    {
      id: 1,
      title: "Yeni çalışan oryantasyon görüşmesi",
      description: "Elif Şahin ile oryantasyon süreci değerlendirmesi",
      category: "Oryantasyon",
      priority: "yüksek",
      status: "tamamlandı",
      startTime: "09:00",
      endTime: "10:30",
      duration: "1.5 saat",
      assignedTo: "Ayşe Kaya",
      completedAt: "2024-06-13 10:30"
    },
    {
      id: 2,
      title: "Referans kontrol aramaları",
      description: "Can Arslan için referans doğrulama görüşmeleri",
      category: "İşe Alım",
      priority: "orta",
      status: "devam_ediyor",
      startTime: "11:00",
      endTime: "12:00",
      duration: "1 saat",
      assignedTo: "Ayşe Kaya",
      completedAt: null
    },
    {
      id: 3,
      title: "Performans değerlendirme formu hazırlama",
      description: "Q2 performans değerlendirme formlarının güncellenmesi",
      category: "Performans",
      priority: "orta",
      status: "bekliyor",
      startTime: "14:00",
      endTime: "15:30",
      duration: "1.5 saat",
      assignedTo: "Ayşe Kaya",
      completedAt: null
    },
    {
      id: 4,
      title: "Bordro hesaplama kontrolü",
      description: "Haziran ayı bordro hesaplamalarının final kontrolü",
      category: "Bordro",
      priority: "yüksek",
      status: "bekliyor",
      startTime: "16:00",
      endTime: "17:00",
      duration: "1 saat",
      assignedTo: "Ayşe Kaya",
      completedAt: null
    }
  ];

  const weeklyActivities = [
    {
      date: "2024-06-13",
      day: "Perşembe",
      activities: 4,
      completed: 1,
      pending: 3,
      totalHours: "5 saat"
    },
    {
      date: "2024-06-12",
      day: "Çarşamba",
      activities: 6,
      completed: 5,
      pending: 1,
      totalHours: "7.5 saat"
    },
    {
      date: "2024-06-11",
      day: "Salı",
      activities: 5,
      completed: 5,
      pending: 0,
      totalHours: "6 saat"
    },
    {
      date: "2024-06-10",
      day: "Pazartesi",
      activities: 7,
      completed: 6,
      pending: 1,
      totalHours: "8 saat"
    }
  ];

  const activityCategories = [
    { name: "İşe Alım", count: 12, color: "bg-blue-100 text-blue-800" },
    { name: "Oryantasyon", count: 8, color: "bg-green-100 text-green-800" },
    { name: "Performans", count: 6, color: "bg-purple-100 text-purple-800" },
    { name: "Bordro", count: 4, color: "bg-orange-100 text-orange-800" },
    { name: "Eğitim", count: 5, color: "bg-pink-100 text-pink-800" },
    { name: "Dokümantasyon", count: 3, color: "bg-gray-100 text-gray-800" }
  ];

  const stats = [
    {
      title: "Bugün Planlanan",
      value: "8",
      trend: "4 tamamlandı",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Bu Hafta Toplam",
      value: "32",
      trend: "26 tamamlandı",
      icon: BarChart3,
      color: "text-green-600"
    },
    {
      title: "Ortalama Günlük",
      value: "6.4 saat",
      trend: "Hedef: 7 saat",
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Tamamlanma Oranı",
      value: "92%",
      trend: "+5% geçen hafta",
      icon: CheckCircle,
      color: "text-orange-600"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'tamamlandı':
        return <Badge className="bg-green-100 text-green-800">✅ Tamamlandı</Badge>;
      case 'devam_ediyor':
        return <Badge className="bg-blue-100 text-blue-800">🔄 Devam Ediyor</Badge>;
      case 'bekliyor':
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ Bekliyor</Badge>;
      case 'ertelendi':
        return <Badge className="bg-gray-100 text-gray-800">⏸️ Ertelendi</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'yüksek':
        return <Badge className="bg-red-100 text-red-800">🔴 Yüksek</Badge>;
      case 'orta':
        return <Badge className="bg-yellow-100 text-yellow-800">🟡 Orta</Badge>;
      case 'düşük':
        return <Badge className="bg-green-100 text-green-800">🟢 Düşük</Badge>;
      default:
        return <Badge>Normal</Badge>;
    }
  };

  const onSubmit = (values: z.infer<typeof activityFormSchema>) => {
    console.log(values);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Günlük Aktiviteler</h1>
            <p className="text-gray-600">Günlük iş takibi ve aktivite yönetimi</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700 mt-4 lg:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Aktivite Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Yeni Aktivite Oluştur</DialogTitle>
                <DialogDescription>
                  Günlük iş planınıza yeni aktivite ekleyin
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aktivite Başlığı</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Aktivite başlığını girin" />
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
                        <FormLabel>Açıklama</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Aktivite detaylarını yazın" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kategori</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Kategori seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ise_alim">İşe Alım</SelectItem>
                              <SelectItem value="oryantasyon">Oryantasyon</SelectItem>
                              <SelectItem value="performans">Performans</SelectItem>
                              <SelectItem value="bordro">Bordro</SelectItem>
                              <SelectItem value="egitim">Eğitim</SelectItem>
                              <SelectItem value="dokumantasyon">Dokümantasyon</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Öncelik</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Öncelik seviyesi" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yüksek">Yüksek</SelectItem>
                              <SelectItem value="orta">Orta</SelectItem>
                              <SelectItem value="düşük">Düşük</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="estimatedDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tahmini Süre</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="örn: 2 saat" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="assignedTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Görevli</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Görevli seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ayse_kaya">Ayşe Kaya</SelectItem>
                              <SelectItem value="mehmet_oz">Mehmet Öz</SelectItem>
                              <SelectItem value="selin_koca">Selin Koca</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline">
                      İptal
                    </Button>
                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                      Aktivite Oluştur
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Bugün</TabsTrigger>
            <TabsTrigger value="weekly">Haftalık Görünüm</TabsTrigger>
            <TabsTrigger value="categories">Kategoriler</TabsTrigger>
            <TabsTrigger value="reports">Raporlar</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Bugünkü Aktiviteler</h2>
              <div className="flex gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Aktivite ara..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrele
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {todayActivities.map((activity) => (
                <Card key={activity.id} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{activity.title}</CardTitle>
                        <CardDescription className="mt-1">{activity.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(activity.status)}
                        {getPriorityBadge(activity.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Kategori:</span>
                        <p className="font-medium">{activity.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Zaman:</span>
                        <p className="font-medium">{activity.startTime} - {activity.endTime}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Süre:</span>
                        <p className="font-medium">{activity.duration}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Görevli:</span>
                        <p className="font-medium">{activity.assignedTo}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div>
                        {activity.completedAt && (
                          <span className="text-xs text-gray-500">
                            Tamamlandı: {activity.completedAt}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {activity.status !== 'tamamlandı' && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Tamamla
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Düzenle
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Bu Haftaki Aktivite Özeti</h2>
            
            <div className="grid gap-6">
              {weeklyActivities.map((day, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{day.day}</h3>
                        <p className="text-gray-600">{day.date}</p>
                      </div>
                      <div className="grid grid-cols-4 gap-8 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{day.activities}</p>
                          <p className="text-xs text-gray-500">Toplam</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{day.completed}</p>
                          <p className="text-xs text-gray-500">Tamamlandı</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-600">{day.pending}</p>
                          <p className="text-xs text-gray-500">Bekliyor</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-600">{day.totalHours}</p>
                          <p className="text-xs text-gray-500">Toplam Süre</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Aktivite Kategorileri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activityCategories.map((category, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        <p className="text-gray-600">{category.count} aktivite</p>
                      </div>
                      <Badge className={category.color}>
                        {category.count}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Aktivite Raporları</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bu Ayki Performans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Toplam Aktivite</span>
                      <span className="font-semibold">128</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tamamlanan</span>
                      <span className="font-semibold text-green-600">118 (92%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Ortalama Günlük</span>
                      <span className="font-semibold">6.4 aktivite</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kategori Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>İşe Alım</span>
                      <Badge className="bg-blue-100 text-blue-800">35%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Oryantasyon</span>
                      <Badge className="bg-green-100 text-green-800">25%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Performans</span>
                      <Badge className="bg-purple-100 text-purple-800">20%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Diğer</span>
                      <Badge className="bg-gray-100 text-gray-800">20%</Badge>
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