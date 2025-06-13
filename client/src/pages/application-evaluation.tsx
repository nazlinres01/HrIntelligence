import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Users, Clock, CheckCircle, Plus, Search, Eye, Star, Calendar, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const evaluationSchema = z.object({
  candidateId: z.string().min(1, "Aday seçimi gereklidir"),
  position: z.string().min(1, "Pozisyon gereklidir"),
  rating: z.string().min(1, "Değerlendirme puanı gereklidir"),
  notes: z.string().min(1, "Notlar gereklidir"),
  recommendation: z.string().min(1, "Öneri gereklidir")
});

export default function ApplicationEvaluationPage() {
  const form = useForm<z.infer<typeof evaluationSchema>>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      candidateId: "",
      position: "",
      rating: "",
      notes: "",
      recommendation: ""
    }
  });

  const applications = [
    {
      id: 1,
      candidateName: "Mehmet Aydın",
      position: "Senior Frontend Developer",
      applicationDate: "2024-06-10",
      experience: "5 yıl",
      education: "Bilgisayar Mühendisliği",
      status: "değerlendirme_aşamasında",
      cvScore: 85,
      skills: ["React", "TypeScript", "Next.js", "GraphQL"],
      expectedSalary: "₺25.000",
      availability: "1 ay",
      rating: null,
      phase: "cv_inceleme"
    },
    {
      id: 2,
      candidateName: "Ayşe Kara",
      position: "UX Designer",
      applicationDate: "2024-06-08",
      experience: "3 yıl",
      education: "Endüstriyel Tasarım",
      status: "mülakat_bekliyor",
      cvScore: 92,
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
      expectedSalary: "₺18.000",
      availability: "2 hafta",
      rating: 4.2,
      phase: "telefon_görüşmesi"
    },
    {
      id: 3,
      candidateName: "Emre Yılmaz",
      position: "DevOps Engineer",
      applicationDate: "2024-06-05",
      experience: "4 yıl",
      education: "Yazılım Mühendisliği",
      status: "teklif_aşamasında",
      cvScore: 88,
      skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
      expectedSalary: "₺22.000",
      availability: "Hemen",
      rating: 4.7,
      phase: "son_görüşme"
    },
    {
      id: 4,
      candidateName: "Seda Öztürk",
      position: "Product Manager",
      applicationDate: "2024-06-12",
      experience: "6 yıl",
      education: "İşletme",
      status: "red",
      cvScore: 78,
      skills: ["Product Strategy", "Agile", "Analytics", "Stakeholder Management"],
      expectedSalary: "₺30.000",
      availability: "1.5 ay",
      rating: 3.1,
      phase: "son_görüşme"
    },
    {
      id: 5,
      candidateName: "Can Demir",
      position: "Backend Developer",
      applicationDate: "2024-06-07",
      experience: "2 yıl",
      education: "Bilgisayar Mühendisliği",
      status: "onaylandı",
      cvScore: 90,
      skills: ["Node.js", "Python", "PostgreSQL", "Redis"],
      expectedSalary: "₺16.000",
      availability: "3 hafta",
      rating: 4.5,
      phase: "teklif_gönderildi"
    }
  ];

  const evaluationStats = [
    {
      title: "Toplam Başvuru",
      value: "128",
      trend: "+24 bu hafta",
      icon: FileText,
      color: "text-teal-600"
    },
    {
      title: "Değerlendirme Bekliyor",
      value: "32",
      trend: "+8 bugün",
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Onaylanan",
      value: "18",
      trend: "+5 bu hafta",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Ortalama Puan",
      value: "4.2",
      trend: "+0.3 bu ay",
      icon: Star,
      color: "text-purple-600"
    }
  ];

  const onSubmit = (values: z.infer<typeof evaluationSchema>) => {
    console.log(values);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'değerlendirme_aşamasında':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">🔄 Değerlendiriliyor</Badge>;
      case 'mülakat_bekliyor':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⏳ Mülakat Bekliyor</Badge>;
      case 'teklif_aşamasında':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">💼 Teklif Aşaması</Badge>;
      case 'onaylandı':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Onaylandı</Badge>;
      case 'red':
        return <Badge className="bg-red-100 text-red-800 border-red-200">❌ Red</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getPhaseText = (phase: string) => {
    switch(phase) {
      case 'cv_inceleme': return 'CV İnceleme';
      case 'telefon_görüşmesi': return 'Telefon Görüşmesi';
      case 'teknik_mülakat': return 'Teknik Mülakat';
      case 'son_görüşme': return 'Son Görüşme';
      case 'teklif_gönderildi': return 'Teklif Gönderildi';
      default: return phase;
    }
  };

  const getRatingStars = (rating: number | null) => {
    if (!rating) return "Henüz değerlendirilmedi";
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('✨');
    }
    
    return `${stars.join('')} (${rating}/5)`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Başvuru Değerlendirme</h1>
            <p className="text-gray-600">Aday başvurularını değerlendirin ve süreç yönetimi yapın</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 mt-4 lg:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Değerlendirme
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Aday Değerlendirmesi</DialogTitle>
                <DialogDescription>
                  Aday için detaylı değerlendirme yapın
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
                              {applications.map((app) => (
                                <SelectItem key={app.id} value={app.id.toString()}>
                                  {app.candidateName} - {app.position}
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
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Değerlendirme Puanı</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Puan verin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="5">⭐⭐⭐⭐⭐ (5/5) - Mükemmel</SelectItem>
                              <SelectItem value="4">⭐⭐⭐⭐ (4/5) - İyi</SelectItem>
                              <SelectItem value="3">⭐⭐⭐ (3/5) - Orta</SelectItem>
                              <SelectItem value="2">⭐⭐ (2/5) - Zayıf</SelectItem>
                              <SelectItem value="1">⭐ (1/5) - Çok Zayıf</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Değerlendirme Notları</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Detaylı değerlendirme notlarınızı yazın..." rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recommendation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Öneriniz</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Önerinizi seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hire">İşe Al</SelectItem>
                            <SelectItem value="next_round">Sonraki Aşamaya Geçir</SelectItem>
                            <SelectItem value="maybe">Kararsız - Tekrar Değerlendir</SelectItem>
                            <SelectItem value="reject">Red Et</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                      İptal
                    </Button>
                    <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                      Değerlendirmeyi Kaydet
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {evaluationStats.map((stat, index) => (
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

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Bekleyen</TabsTrigger>
            <TabsTrigger value="evaluated">Değerlendirilen</TabsTrigger>
            <TabsTrigger value="approved">Onaylanan</TabsTrigger>
            <TabsTrigger value="rejected">Red Edilen</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Değerlendirme Bekleyen Başvurular</h2>
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Aday ara..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-6">
              {applications.filter(app => app.status === 'değerlendirme_aşamasında' || app.status === 'mülakat_bekliyor').map((app) => (
                <Card key={app.id} className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{app.candidateName}</CardTitle>
                        <CardDescription className="mt-1">
                          {app.position} • Başvuru: {app.applicationDate}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(app.status)}
                        <Badge variant="outline">{getPhaseText(app.phase)}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Deneyim:</span>
                        <p className="font-medium">{app.experience}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Eğitim:</span>
                        <p className="font-medium">{app.education}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Beklenen Maaş:</span>
                        <p className="font-medium">{app.expectedSalary}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Başlayabilir:</span>
                        <p className="font-medium">{app.availability}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 text-sm">Yetenekler:</span>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {app.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-sm">
                        <span className="text-gray-500">CV Puanı: </span>
                        <span className="font-medium">{app.cvScore}/100</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                          <Eye className="h-4 w-4 mr-1" />
                          CV İncele
                        </Button>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                          <Star className="h-4 w-4 mr-1" />
                          Değerlendir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="evaluated" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Değerlendirilen Başvurular</h2>
            
            <div className="grid gap-6">
              {applications.filter(app => app.rating && app.status !== 'onaylandı' && app.status !== 'red').map((app) => (
                <Card key={app.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{app.candidateName}</CardTitle>
                        <CardDescription className="mt-1">
                          {app.position} • {getRatingStars(app.rating)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(app.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Notları Gör
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

          <TabsContent value="approved" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Onaylanan Başvurular</h2>
            
            <div className="grid gap-6">
              {applications.filter(app => app.status === 'onaylandı').map((app) => (
                <Card key={app.id} className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{app.candidateName}</CardTitle>
                        <CardDescription className="mt-1">
                          {app.position} • {getRatingStars(app.rating)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(app.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                        <Calendar className="h-4 w-4 mr-1" />
                        Başlangıç Planla
                      </Button>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        Onboarding
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Red Edilen Başvurular</h2>
            
            <div className="grid gap-6">
              {applications.filter(app => app.status === 'red').map((app) => (
                <Card key={app.id} className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{app.candidateName}</CardTitle>
                        <CardDescription className="mt-1">
                          {app.position} • {getRatingStars(app.rating)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(app.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Red Sebebi
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}