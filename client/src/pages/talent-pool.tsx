import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Star, Users, TrendingUp, Plus, Search, Eye, MessageSquare, Calendar, Award, Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const talentSchema = z.object({
  name: z.string().min(1, "Ad Soyad gereklidir"),
  email: z.string().email("Geçerli email gereklidir"),
  phone: z.string().min(1, "Telefon gereklidir"),
  position: z.string().min(1, "Pozisyon gereklidir"),
  experience: z.string().min(1, "Deneyim gereklidir"),
  skills: z.string().min(1, "Yetenekler gereklidir"),
  source: z.string().min(1, "Kaynak gereklidir"),
  notes: z.string().min(1, "Notlar gereklidir")
});

export default function TalentPoolPage() {
  const form = useForm<z.infer<typeof talentSchema>>({
    resolver: zodResolver(talentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      skills: "",
      source: "",
      notes: ""
    }
  });

  const talents = [
    {
      id: 1,
      name: "Ahmet Kaya",
      email: "ahmet.kaya@email.com",
      phone: "+90 532 123 4567",
      position: "Full Stack Developer",
      experience: "6 yıl",
      skills: ["React", "Node.js", "Python", "AWS", "Docker"],
      rating: 4.8,
      availability: "2 hafta",
      expectedSalary: "₺28.000",
      location: "İstanbul",
      source: "LinkedIn",
      lastContact: "2024-06-10",
      status: "aktif",
      notes: "Çok güçlü teknik background, startup deneyimi var",
      education: "Bilgisayar Mühendisliği - Boğaziçi Üniversitesi",
      projects: 3,
      interviewHistory: ["Telefon görüşmesi - 2024-05-15", "Teknik mülakat - 2024-05-20"]
    },
    {
      id: 2,
      name: "Zeynep Özkan",
      email: "zeynep.ozkan@email.com",
      phone: "+90 533 234 5678",
      position: "Senior UX Designer",
      experience: "5 yıl",
      skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems"],
      rating: 4.6,
      availability: "1 ay",
      expectedSalary: "₺22.000",
      location: "Ankara",
      source: "Referans",
      lastContact: "2024-06-08",
      status: "ilgilenmiyor",
      notes: "Mükemmel portfolio, büyük şirketlerde çalışmış",
      education: "Endüstriyel Tasarım - ODTÜ",
      projects: 5,
      interviewHistory: ["Portfolio review - 2024-04-12"]
    },
    {
      id: 3,
      name: "Can Demir",
      email: "can.demir@email.com",
      phone: "+90 534 345 6789",
      position: "DevOps Engineer",
      experience: "4 yıl",
      skills: ["Kubernetes", "Terraform", "Jenkins", "AWS", "Monitoring"],
      rating: 4.4,
      availability: "Hemen",
      expectedSalary: "₺25.000",
      location: "İzmir",
      source: "Kariyer.net",
      lastContact: "2024-06-12",
      status: "müsait",
      notes: "Altyapı konusunda çok deneyimli, sertifikaları var",
      education: "Yazılım Mühendisliği - Ege Üniversitesi",
      projects: 2,
      interviewHistory: []
    },
    {
      id: 4,
      name: "Elif Yılmaz",
      email: "elif.yilmaz@email.com",
      phone: "+90 535 456 7890",
      position: "Product Manager",
      experience: "7 yıl",
      skills: ["Product Strategy", "Agile", "Data Analysis", "Stakeholder Management", "Roadmapping"],
      rating: 4.9,
      availability: "3 hafta",
      expectedSalary: "₺35.000",
      location: "İstanbul",
      source: "Headhunter",
      lastContact: "2024-06-05",
      status: "görüşmede",
      notes: "Çok güçlü liderlik deneyimi, uluslararası şirketlerde çalışmış",
      education: "İşletme - İstanbul Üniversitesi, MBA - Koç Üniversitesi",
      projects: 8,
      interviewHistory: ["İlk görüşme - 2024-05-28", "Case study - 2024-06-03"]
    },
    {
      id: 5,
      name: "Mehmet Arslan",
      email: "mehmet.arslan@email.com",
      phone: "+90 536 567 8901",
      position: "Data Scientist",
      experience: "3 yıl",
      skills: ["Python", "Machine Learning", "SQL", "Tableau", "Statistics"],
      rating: 4.2,
      availability: "1.5 ay",
      expectedSalary: "₺20.000",
      location: "Bursa",
      source: "Teknoloji etkinliği",
      lastContact: "2024-06-07",
      status: "takipte",
      notes: "AI projelerinde deneyimi var, akademik geçmişi güçlü",
      education: "İstatistik - Hacettepe Üniversitesi, Yüksek Lisans",
      projects: 4,
      interviewHistory: ["Telefon görüşmesi - 2024-05-10"]
    }
  ];

  const poolStats = [
    {
      title: "Toplam Yetenek",
      value: "342",
      trend: "+28 bu ay",
      icon: Users,
      color: "text-teal-600"
    },
    {
      title: "Aktif Adaylar",
      value: "128",
      trend: "+15 bu hafta",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Ortalama Rating",
      value: "4.3",
      trend: "+0.2 bu çeyrek",
      icon: Star,
      color: "text-yellow-600"
    },
    {
      title: "Bu Ay İşe Alınan",
      value: "12",
      trend: "+3 geçen ay",
      icon: Award,
      color: "text-green-600"
    }
  ];

  const onSubmit = (values: z.infer<typeof talentSchema>) => {
    console.log(values);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'aktif':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Aktif</Badge>;
      case 'müsait':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">💼 Müsait</Badge>;
      case 'görüşmede':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">🔄 Görüşmede</Badge>;
      case 'takipte':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">👁️ Takipte</Badge>;
      case 'ilgilenmiyor':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">❌ İlgilenmiyor</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Yetenek Havuzu</h1>
            <p className="text-gray-600">Aday havuzunuzu yönetin ve yetenekleri takip edin</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 mt-4 lg:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Yetenek Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yeni Yetenek Ekle</DialogTitle>
                <DialogDescription>
                  Yetenek havuzuna yeni aday ekleyin
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ad Soyad</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Adı Soyadı" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="ornek@email.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+90 5XX XXX XXXX" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pozisyon</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="İlgilendiği pozisyon" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deneyim</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="5 yıl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kaynak</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Nereden geldi?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="referans">Referans</SelectItem>
                              <SelectItem value="kariyer_net">Kariyer.net</SelectItem>
                              <SelectItem value="headhunter">Headhunter</SelectItem>
                              <SelectItem value="etkinlik">Teknoloji Etkinliği</SelectItem>
                              <SelectItem value="website">Şirket Website</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yetenekler</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="React, Node.js, Python (virgülle ayırın)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notlar</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Aday hakkında notlarınız..." rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                      İptal
                    </Button>
                    <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                      Yetenek Ekle
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {poolStats.map((stat, index) => (
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

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Tümü</TabsTrigger>
            <TabsTrigger value="active">Aktif</TabsTrigger>
            <TabsTrigger value="available">Müsait</TabsTrigger>
            <TabsTrigger value="interviewing">Görüşmede</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Yetenek Havuzu</h2>
              <div className="flex gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Yetenek ara..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrele
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {talents.map((talent) => (
                <Card key={talent.id} className="border-l-4 border-l-teal-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{talent.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {talent.position} • {talent.experience} deneyim • {talent.location}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(talent.status)}
                        <Badge variant="outline">{talent.source}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Rating:</span>
                        <p className="font-medium">{getRatingStars(talent.rating)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Müsaitlik:</span>
                        <p className="font-medium">{talent.availability}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Beklenen Maaş:</span>
                        <p className="font-medium">{talent.expectedSalary}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Son İletişim:</span>
                        <p className="font-medium">{talent.lastContact}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 text-sm">Yetenekler:</span>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {talent.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 text-sm">Eğitim:</span>
                      <p className="text-sm mt-1">{talent.education}</p>
                    </div>

                    {talent.notes && (
                      <div className="text-sm bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium">Notlar: </span>
                        {talent.notes}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-sm text-gray-600">
                        {talent.projects} proje • {talent.interviewHistory.length} mülakat geçmişi
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                          <Eye className="h-4 w-4 mr-1" />
                          Profil
                        </Button>
                        <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          İletişim
                        </Button>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                          <Calendar className="h-4 w-4 mr-1" />
                          Randevu
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Aktif Yetenekler</h2>
            
            <div className="grid gap-6">
              {talents.filter(talent => talent.status === 'aktif').map((talent) => (
                <Card key={talent.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{talent.name}</h3>
                        <p className="text-gray-600">{talent.position}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                          Detaylar
                        </Button>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                          İletişim Kur
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="available" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Müsait Yetenekler</h2>
            
            <div className="grid gap-6">
              {talents.filter(talent => talent.status === 'müsait').map((talent) => (
                <Card key={talent.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{talent.name}</h3>
                        <p className="text-gray-600">{talent.position} • {talent.availability}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                          Mülakat Planla
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interviewing" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Görüşme Sürecindeki Yetenekler</h2>
            
            <div className="grid gap-6">
              {talents.filter(talent => talent.status === 'görüşmede').map((talent) => (
                <Card key={talent.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{talent.name}</h3>
                        <p className="text-gray-600">{talent.position}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Son görüşme: {talent.interviewHistory[talent.interviewHistory.length - 1]}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                          Görüşme Notları
                        </Button>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                          Sonraki Adım
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Yetenek Havuzu Analitikleri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pozisyon Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Full Stack Developer</span>
                      <Badge>85 kişi</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>UX/UI Designer</span>
                      <Badge>42 kişi</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>DevOps Engineer</span>
                      <Badge>38 kişi</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Product Manager</span>
                      <Badge>28 kişi</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Data Scientist</span>
                      <Badge>24 kişi</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kaynak Analizi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>LinkedIn</span>
                      <Badge>%38</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Referans</span>
                      <Badge>%25</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Kariyer.net</span>
                      <Badge>%18</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Headhunter</span>
                      <Badge>%12</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Etkinlik</span>
                      <Badge>%7</Badge>
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