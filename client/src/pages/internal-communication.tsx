import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Users, Calendar, Bell, Plus, Search, Pin, Reply } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const messageFormSchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  content: z.string().min(1, "Mesaj içeriği gerekli"),
  recipient: z.string().min(1, "Alıcı seçimi gerekli"),
  priority: z.string().min(1, "Öncelik seviyesi gerekli"),
  category: z.string().min(1, "Kategori seçimi gerekli"),
});

export default function InternalCommunicationPage() {
  const form = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      title: "",
      content: "",
      recipient: "",
      priority: "",
      category: "",
    },
  });

  const communications = [
    {
      id: 1,
      title: "Yaz Tatili Planlaması Duyurusu",
      content: "Sevgili ekip, yaz tatili döneminde izin planlamalarınızı yapmanız için son tarih 15 Haziran...",
      sender: "Ayşe Kaya",
      senderRole: "İK Uzmanı",
      recipient: "Tüm Çalışanlar",
      category: "Duyuru",
      priority: "orta",
      status: "gönderildi",
      date: "2024-06-13",
      time: "09:30",
      replies: 12,
      views: 85,
      isPinned: true
    },
    {
      id: 2,
      title: "Yeni Çalışan Tanıtımı - Elif Şahin",
      content: "Ekibimize katılan Elif Şahin'i tanıtmak istiyoruz. Yazılım Geliştirme departmanında Senior Developer olarak...",
      sender: "Mehmet Öz",
      senderRole: "Departman Müdürü",
      recipient: "Yazılım Geliştirme Ekibi",
      category: "Tanıtım",
      priority: "düşük",
      status: "gönderildi",
      date: "2024-06-12",
      time: "14:15",
      replies: 8,
      views: 45,
      isPinned: false
    },
    {
      id: 3,
      title: "Acil: Sistem Bakımı Bildirimi",
      content: "Bu akşam 22:00-02:00 saatleri arasında sistem bakımı yapılacaktır. Bu süre zarfında sistemlere erişim olmayacak...",
      sender: "Can Arslan",
      senderRole: "IT Müdürü",
      recipient: "Tüm Çalışanlar",
      category: "Sistem",
      priority: "yüksek",
      status: "gönderildi",
      date: "2024-06-13",
      time: "16:45",
      replies: 3,
      views: 120,
      isPinned: true
    },
    {
      id: 4,
      title: "Aylık Performans Görüşmeleri",
      content: "Haziran ayı performans değerlendirme görüşmeleri 20-25 Haziran tarihleri arasında yapılacaktır...",
      sender: "Selin Koca",
      senderRole: "İK Müdürü",
      recipient: "Departman Müdürleri",
      category: "Performans",
      priority: "orta",
      status: "taslak",
      date: "2024-06-13",
      time: "11:20",
      replies: 0,
      views: 0,
      isPinned: false
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "Şirket Pikniği - 30 Haziran",
      content: "Yıllık şirket pikniği 30 Haziran Pazar günü Polonezköy'de düzenlenecektir.",
      date: "2024-06-20",
      category: "Etkinlik",
      author: "İK Departmanı"
    },
    {
      id: 2,
      title: "Yeni Ofis Kuralları",
      content: "Hibrit çalışma modeline geçiş ile birlikte yeni ofis kullanım kuralları yürürlüğe girmiştir.",
      date: "2024-06-15",
      category: "Politika",
      author: "Genel Müdür"
    },
    {
      id: 3,
      title: "Eğitim Programı Kayıtları",
      content: "Q3 döneminde düzenlenecek teknik eğitim programlarına kayıtlar başlamıştır.",
      date: "2024-06-18",
      category: "Eğitim",
      author: "İK Departmanı"
    }
  ];

  const stats = [
    {
      title: "Toplam Mesaj",
      value: "234",
      trend: "+18 bu hafta",
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      title: "Aktif Duyuru",
      value: "12",
      trend: "3 yeni eklendi",
      icon: Bell,
      color: "text-green-600"
    },
    {
      title: "Mesaj Okuma Oranı",
      value: "87%",
      trend: "+5% geçen hafta",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Ortalama Yanıt Süresi",
      value: "2.4 saat",
      trend: "-0.5 saat iyileşme",
      icon: Reply,
      color: "text-orange-600"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'gönderildi':
        return <Badge className="bg-green-100 text-green-800">📤 Gönderildi</Badge>;
      case 'taslak':
        return <Badge className="bg-yellow-100 text-yellow-800">📝 Taslak</Badge>;
      case 'planlandı':
        return <Badge className="bg-blue-100 text-blue-800">⏰ Planlandı</Badge>;
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

  const onSubmit = (values: z.infer<typeof messageFormSchema>) => {
    console.log(values);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">İç İletişim</h1>
            <p className="text-gray-600">Kurumsal iletişimi koordine edin ve yönetin</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700 mt-4 lg:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Mesaj Oluştur
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Yeni İç İletişim Mesajı</DialogTitle>
                <DialogDescription>
                  Çalışanlara duyuru veya bilgilendirme mesajı gönderin
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mesaj Başlığı</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Mesaj başlığını girin" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mesaj İçeriği</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Mesaj içeriğini yazın" rows={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="recipient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alıcı</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Alıcı seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all_employees">Tüm Çalışanlar</SelectItem>
                              <SelectItem value="department_managers">Departman Müdürleri</SelectItem>
                              <SelectItem value="hr_team">İK Ekibi</SelectItem>
                              <SelectItem value="tech_team">Teknoloji Ekibi</SelectItem>
                              <SelectItem value="sales_team">Satış Ekibi</SelectItem>
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
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Mesaj kategorisi" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="duyuru">Duyuru</SelectItem>
                            <SelectItem value="politika">Politika</SelectItem>
                            <SelectItem value="etkinlik">Etkinlik</SelectItem>
                            <SelectItem value="sistem">Sistem</SelectItem>
                            <SelectItem value="eğitim">Eğitim</SelectItem>
                            <SelectItem value="performans">Performans</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                      Taslak Kaydet
                    </Button>
                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                      <Send className="h-4 w-4 mr-2" />
                      Gönder
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

        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messages">Mesajlar</TabsTrigger>
            <TabsTrigger value="announcements">Duyurular</TabsTrigger>
            <TabsTrigger value="analytics">İletişim Analitiği</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">İç İletişim Mesajları</h2>
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Mesajlarda ara..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-6">
              {communications.map((comm) => (
                <Card key={comm.id} className={`border-l-4 ${comm.isPinned ? 'border-l-red-500' : 'border-l-orange-500'}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        {comm.isPinned && <Pin className="h-5 w-5 text-red-500 mt-1" />}
                        <div>
                          <CardTitle className="text-xl text-gray-800">{comm.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {comm.sender} ({comm.senderRole}) → {comm.recipient}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(comm.status)}
                        {getPriorityBadge(comm.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 text-sm">{comm.content}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                      <div>
                        <span>Kategori:</span>
                        <p className="font-medium">{comm.category}</p>
                      </div>
                      <div>
                        <span>Gönderim:</span>
                        <p className="font-medium">{comm.date} {comm.time}</p>
                      </div>
                      <div>
                        <span>Görüntüleme:</span>
                        <p className="font-medium">{comm.views} kişi</p>
                      </div>
                      <div>
                        <span>Yanıtlar:</span>
                        <p className="font-medium">{comm.replies} yanıt</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Reply className="h-4 w-4 mr-1" />
                          Yanıtla
                        </Button>
                        {comm.status === 'taslak' && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            <Send className="h-4 w-4 mr-1" />
                            Gönder
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Aktif Duyurular</h2>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Duyuru
              </Button>
            </div>

            <div className="grid gap-6">
              {announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{announcement.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {announcement.author} • {announcement.date}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{announcement.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{announcement.content}</p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        Düzenle
                      </Button>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Yayınla
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">İletişim Performans Analitiği</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mesaj Etkileşim Oranları</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Duyuru Mesajları</span>
                      <span className="text-green-600 font-medium">92% okunma</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sistem Bildirimleri</span>
                      <span className="text-blue-600 font-medium">87% okunma</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Eğitim Duyuruları</span>
                      <span className="text-purple-600 font-medium">78% okunma</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Departman Bazlı Yanıt Süreleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>İK Departmanı</span>
                      <Badge className="bg-green-100 text-green-800">1.2 saat</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Teknoloji</span>
                      <Badge className="bg-yellow-100 text-yellow-800">2.8 saat</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Satış</span>
                      <Badge className="bg-blue-100 text-blue-800">3.1 saat</Badge>
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