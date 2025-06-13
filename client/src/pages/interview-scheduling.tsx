import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, Video, Plus, Search, Edit, Eye, CheckCircle, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const interviewSchema = z.object({
  candidateId: z.string().min(1, "Aday seçimi gereklidir"),
  interviewType: z.string().min(1, "Mülakat türü gereklidir"),
  date: z.string().min(1, "Tarih gereklidir"),
  time: z.string().min(1, "Saat gereklidir"),
  interviewer: z.string().min(1, "Mülakatçı seçimi gereklidir"),
  duration: z.string().min(1, "Süre gereklidir")
});

export default function InterviewSchedulingPage() {
  const form = useForm<z.infer<typeof interviewSchema>>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      candidateId: "",
      interviewType: "",
      date: "",
      time: "",
      interviewer: "",
      duration: ""
    }
  });

  const interviews = [
    {
      id: 1,
      candidateName: "Mehmet Aydın",
      position: "Senior Frontend Developer",
      type: "Teknik Mülakat",
      date: "2024-06-15",
      time: "14:00",
      duration: "90 dakika",
      interviewer: "Ahmet Yılmaz",
      location: "Meeting Room A",
      status: "planlandı",
      meetingLink: "https://meet.google.com/abc-def-ghi",
      notes: "React ve TypeScript odaklı teknik sorular"
    },
    {
      id: 2,
      candidateName: "Ayşe Kara",
      position: "UX Designer",
      type: "Portfolio İncelemesi",
      date: "2024-06-14",
      time: "10:30",
      duration: "60 dakika",
      interviewer: "Selin Kaya",
      location: "Online",
      status: "tamamlandı",
      meetingLink: "https://zoom.us/j/123456789",
      notes: "Portfolio sunumu ve design process tartışması"
    },
    {
      id: 3,
      candidateName: "Emre Yılmaz",
      position: "DevOps Engineer",
      type: "Son Görüşme",
      date: "2024-06-16",
      time: "11:00",
      duration: "45 dakika",
      interviewer: "Elif Çelik",
      location: "HR Office",
      status: "bekliyor",
      meetingLink: null,
      notes: "Kültürel uyum ve beklentiler görüşmesi"
    },
    {
      id: 4,
      candidateName: "Seda Öztürk",
      position: "Product Manager",
      type: "Case Study",
      date: "2024-06-13",
      time: "15:30",
      duration: "120 dakika",
      interviewer: "Can Demir",
      location: "Conference Room B",
      status: "iptal_edildi",
      meetingLink: null,
      notes: "Product strategy case study sunumu"
    },
    {
      id: 5,
      candidateName: "Ali Özkan",
      position: "Sales Manager",
      type: "Telefon Görüşmesi",
      date: "2024-06-17",
      time: "09:00",
      duration: "30 dakika",
      interviewer: "Mehmet Özkan",
      location: "Phone",
      status: "planlandı",
      meetingLink: null,
      notes: "İlk değerlendirme görüşmesi"
    }
  ];

  const scheduleStats = [
    {
      title: "Bu Hafta Mülakatlar",
      value: "12",
      trend: "+3 geçen hafta",
      icon: Calendar,
      color: "text-teal-600"
    },
    {
      title: "Bugün Planlanan",
      value: "4",
      trend: "2 tamamlandı",
      icon: Clock,
      color: "text-blue-600"
    },
    {
      title: "Bekleyen Onay",
      value: "8",
      trend: "+2 bugün",
      icon: AlertCircle,
      color: "text-yellow-600"
    },
    {
      title: "Tamamlanan",
      value: "28",
      trend: "+5 bu hafta",
      icon: CheckCircle,
      color: "text-green-600"
    }
  ];

  const interviewers = [
    { id: "ahmet_yilmaz", name: "Ahmet Yılmaz", role: "Tech Lead", department: "Yazılım" },
    { id: "selin_kaya", name: "Selin Kaya", role: "Design Lead", department: "Tasarım" },
    { id: "elif_celik", name: "Elif Çelik", role: "HR Manager", department: "İK" },
    { id: "can_demir", name: "Can Demir", role: "Product Manager", department: "Ürün" },
    { id: "mehmet_ozkan", name: "Mehmet Özkan", role: "Sales Director", department: "Satış" }
  ];

  const onSubmit = (values: z.infer<typeof interviewSchema>) => {
    console.log(values);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'planlandı':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">📅 Planlandı</Badge>;
      case 'tamamlandı':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Tamamlandı</Badge>;
      case 'bekliyor':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⏳ Bekliyor</Badge>;
      case 'iptal_edildi':
        return <Badge className="bg-red-100 text-red-800 border-red-200">❌ İptal</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getLocationIcon = (location: string) => {
    if (location.includes("Online") || location.includes("Zoom") || location.includes("Meet")) {
      return <Video className="w-4 h-4 text-blue-600" />;
    }
    if (location.includes("Phone")) {
      return <span className="text-green-600">📞</span>;
    }
    return <span className="text-gray-600">📍</span>;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mülakat Programları</h1>
            <p className="text-gray-600">Mülakat takviminizi yönetin ve süreçleri planlayın</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 mt-4 lg:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Mülakat Planla
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Yeni Mülakat Planla</DialogTitle>
                <DialogDescription>
                  Aday için mülakat randevusu oluşturun
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="candidateId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aday</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Aday seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mehmet_aydin">Mehmet Aydın - Frontend Developer</SelectItem>
                              <SelectItem value="ayse_kara">Ayşe Kara - UX Designer</SelectItem>
                              <SelectItem value="emre_yilmaz">Emre Yılmaz - DevOps Engineer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="interviewType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mülakat Türü</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Tür seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="telefon">Telefon Görüşmesi</SelectItem>
                              <SelectItem value="teknik">Teknik Mülakat</SelectItem>
                              <SelectItem value="ik">İK Görüşmesi</SelectItem>
                              <SelectItem value="son_gorusme">Son Görüşme</SelectItem>
                              <SelectItem value="case_study">Case Study</SelectItem>
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
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tarih</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Saat</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="interviewer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mülakatçı</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Mülakatçı seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {interviewers.map((interviewer) => (
                                <SelectItem key={interviewer.id} value={interviewer.id}>
                                  {interviewer.name} - {interviewer.role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Süre</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Süre seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="30">30 dakika</SelectItem>
                              <SelectItem value="45">45 dakika</SelectItem>
                              <SelectItem value="60">60 dakika</SelectItem>
                              <SelectItem value="90">90 dakika</SelectItem>
                              <SelectItem value="120">120 dakika</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                      İptal
                    </Button>
                    <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                      Mülakat Planla
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {scheduleStats.map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-xs mt-1 ${stat.color}`}>{stat.trend}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upcoming">Yaklaşan</TabsTrigger>
            <TabsTrigger value="today">Bugün</TabsTrigger>
            <TabsTrigger value="completed">Tamamlanan</TabsTrigger>
            <TabsTrigger value="calendar">Takvim</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Yaklaşan Mülakatlar</h2>
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Mülakat ara..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-6">
              {interviews.filter(interview => interview.status === 'planlandı' || interview.status === 'bekliyor').map((interview) => (
                <Card key={interview.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{interview.candidateName}</CardTitle>
                        <CardDescription className="mt-1">
                          {interview.position} • {interview.type}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(interview.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Tarih:</span>
                        <p className="font-medium">{interview.date}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Saat:</span>
                        <p className="font-medium">{interview.time}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Süre:</span>
                        <p className="font-medium">{interview.duration}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Mülakatçı:</span>
                        <p className="font-medium">{interview.interviewer}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getLocationIcon(interview.location)}
                      <span className="text-sm text-gray-600">{interview.location}</span>
                      {interview.meetingLink && (
                        <Button variant="outline" size="sm" className="ml-auto border-teal-600 text-teal-600 hover:bg-teal-50">
                          <Video className="h-4 w-4 mr-1" />
                          Katıl
                        </Button>
                      )}
                    </div>

                    {interview.notes && (
                      <div className="text-sm bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium">Notlar: </span>
                        {interview.notes}
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                        <Edit className="h-4 w-4 mr-1" />
                        Düzenle
                      </Button>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        <Eye className="h-4 w-4 mr-1" />
                        Detaylar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="today" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Bugünün Mülakatları</h2>
            
            <div className="grid gap-6">
              {interviews.filter(interview => interview.date === "2024-06-13").map((interview) => (
                <Card key={interview.id} className="border-l-4 border-l-teal-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{interview.candidateName}</CardTitle>
                        <CardDescription className="mt-1">
                          {interview.type} • {interview.time} • {interview.duration}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(interview.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                        Hazırlık Notları
                      </Button>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        Mülakata Başla
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {interviews.filter(interview => interview.date === "2024-06-13").length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Bugün Mülakat Yok</h3>
                    <p className="text-gray-600">Bugün için planlanmış mülakat bulunmuyor.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Tamamlanan Mülakatlar</h2>
            
            <div className="grid gap-6">
              {interviews.filter(interview => interview.status === 'tamamlandı').map((interview) => (
                <Card key={interview.id} className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{interview.candidateName}</CardTitle>
                        <CardDescription className="mt-1">
                          {interview.position} • {interview.date} • {interview.time}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(interview.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                        Sonuçları Gör
                      </Button>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        Sonraki Adım
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Mülakat Takvimi</h2>
            
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-7 gap-4 text-center">
                  <div className="font-semibold text-gray-700">Pzt</div>
                  <div className="font-semibold text-gray-700">Sal</div>
                  <div className="font-semibold text-gray-700">Çar</div>
                  <div className="font-semibold text-gray-700">Per</div>
                  <div className="font-semibold text-gray-700">Cum</div>
                  <div className="font-semibold text-gray-700">Cmt</div>
                  <div className="font-semibold text-gray-700">Paz</div>
                  
                  {/* Örnek takvim günleri */}
                  <div className="p-2 h-16"></div>
                  <div className="p-2 h-16"></div>
                  <div className="p-2 h-16"></div>
                  <div className="p-2 h-16"></div>
                  <div className="p-2 h-16"></div>
                  <div className="p-2 h-16"></div>
                  <div className="p-2 h-16"></div>
                  
                  <div className="p-2 h-16 border rounded">
                    <div className="text-sm">10</div>
                  </div>
                  <div className="p-2 h-16 border rounded">
                    <div className="text-sm">11</div>
                  </div>
                  <div className="p-2 h-16 border rounded">
                    <div className="text-sm">12</div>
                  </div>
                  <div className="p-2 h-16 border rounded bg-blue-50">
                    <div className="text-sm">13</div>
                    <div className="text-xs text-blue-600">2 mülakat</div>
                  </div>
                  <div className="p-2 h-16 border rounded bg-green-50">
                    <div className="text-sm">14</div>
                    <div className="text-xs text-green-600">1 mülakat</div>
                  </div>
                  <div className="p-2 h-16 border rounded bg-purple-50">
                    <div className="text-sm">15</div>
                    <div className="text-xs text-purple-600">3 mülakat</div>
                  </div>
                  <div className="p-2 h-16 border rounded">
                    <div className="text-sm">16</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}