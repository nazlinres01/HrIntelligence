import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Phone, Mail, CheckCircle, XCircle, Clock, User, FileText, Plus, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const referenceFormSchema = z.object({
  candidateName: z.string().min(1, "Aday adı gerekli"),
  referenceName: z.string().min(1, "Referans kişi adı gerekli"),
  referenceTitle: z.string().min(1, "Referans kişi unvanı gerekli"),
  referenceCompany: z.string().min(1, "Referans şirketi gerekli"),
  referencePhone: z.string().min(1, "Telefon numarası gerekli"),
  referenceEmail: z.string().email("Geçerli email adresi gerekli"),
  workingPeriod: z.string().min(1, "Çalışma dönemi gerekli"),
  position: z.string().min(1, "Pozisyon gerekli"),
  relationship: z.string().min(1, "İlişki türü gerekli"),
});

export default function ReferenceChecksPage() {
  const form = useForm<z.infer<typeof referenceFormSchema>>({
    resolver: zodResolver(referenceFormSchema),
    defaultValues: {
      candidateName: "",
      referenceName: "",
      referenceTitle: "",
      referenceCompany: "",
      referencePhone: "",
      referenceEmail: "",
      workingPeriod: "",
      position: "",
      relationship: "",
    },
  });

  const referenceChecks = [
    {
      id: 1,
      candidateName: "Elif Şahin",
      position: "Senior Frontend Developer",
      referenceName: "Murat Demir",
      referenceTitle: "Yazılım Müdürü",
      referenceCompany: "ABC Tech",
      contactPhone: "+90 533 123 45 67",
      contactEmail: "murat.demir@abctech.com",
      status: "tamamlandı",
      result: "pozitif",
      checkDate: "2024-06-10",
      notes: "Çok başarılı bir çalışan, takım çalışmasında güçlü",
      workingPeriod: "2021-2024",
      reason: "İstifa",
      rating: 4.5
    },
    {
      id: 2,
      candidateName: "Can Arslan",
      position: "Product Manager",
      referenceName: "Selin Kaya",
      referenceTitle: "Genel Müdür",
      referenceCompany: "XYZ Solutions",
      contactPhone: "+90 532 987 65 43",
      contactEmail: "selin.kaya@xyzsolutions.com",
      status: "devam_ediyor",
      result: null,
      checkDate: null,
      notes: "",
      workingPeriod: "2020-2023",
      reason: "Kariyer değişikliği",
      rating: null
    },
    {
      id: 3,
      candidateName: "Zeynep Aktaş",
      position: "UX Designer",
      referenceName: "Ahmet Yılmaz",
      referenceTitle: "Tasarım Müdürü",
      referenceCompany: "Design Co",
      contactPhone: "+90 534 876 54 32",
      contactEmail: "ahmet.yilmaz@designco.com",
      status: "bekliyor",
      result: null,
      checkDate: null,
      notes: "",
      workingPeriod: "2019-2022",
      reason: "Şirketten ayrılma",
      rating: null
    }
  ];

  const checklistItems = [
    "Çalışma süresi doğrulaması",
    "Pozisyon ve sorumluluklar",
    "Performans değerlendirmesi",
    "Takım çalışması becerisi",
    "İletişim becerileri",
    "Teknik yetkinlikler",
    "İş disiplini ve güvenilirlik",
    "Ayrılma nedeni",
    "Tekrar işe alma durumu"
  ];

  const stats = [
    {
      title: "Toplam Referans Kontrolü",
      value: "86",
      trend: "+12 bu ay",
      icon: User,
      color: "text-blue-600"
    },
    {
      title: "Tamamlanan Kontroller",
      value: "72",
      trend: "84% başarı oranı",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Devam Eden Kontroller",
      value: "9",
      trend: "Ortalama 3 gün",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Pozitif Referanslar",
      value: "91%",
      trend: "+5% geçen aya göre",
      icon: FileText,
      color: "text-purple-600"
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
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getResultBadge = (result: string | null) => {
    if (!result) return null;
    switch(result) {
      case 'pozitif':
        return <Badge className="bg-green-100 text-green-800">👍 Pozitif</Badge>;
      case 'negatif':
        return <Badge className="bg-red-100 text-red-800">👎 Negatif</Badge>;
      case 'karma':
        return <Badge className="bg-yellow-100 text-yellow-800">⚖️ Karma</Badge>;
      default:
        return null;
    }
  };

  const onSubmit = (values: z.infer<typeof referenceFormSchema>) => {
    console.log(values);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Referans Kontrolleri</h1>
            <p className="text-gray-600">Aday referanslarını değerlendirin ve doğrulayın</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700 mt-4 lg:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Referans Kontrolü
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Yeni Referans Kontrolü Başlat</DialogTitle>
                <DialogDescription>
                  Aday için referans kontrol süreci başlatın
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="candidateName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aday Adı</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="referenceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Referans Kişi Adı</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="referenceTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Referans Kişi Unvanı</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="referenceCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referans Şirketi</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="referencePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="referenceEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="workingPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Çalışma Dönemi</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="örn: 2020-2023" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İlişki Türü</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="İlişki türü seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="direct_manager">Direkt Yönetici</SelectItem>
                              <SelectItem value="colleague">İş Arkadaşı</SelectItem>
                              <SelectItem value="hr_manager">İK Müdürü</SelectItem>
                              <SelectItem value="department_head">Departman Müdürü</SelectItem>
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
                      Referans Kontrolü Başlat
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

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Aktif Kontroller</TabsTrigger>
            <TabsTrigger value="completed">Tamamlanan</TabsTrigger>
            <TabsTrigger value="checklist">Kontrol Listesi</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Referans Kontrolleri</h2>
              <div className="flex gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Aday veya referans ara..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {referenceChecks.map((check) => (
                <Card key={check.id} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{check.candidateName}</CardTitle>
                        <CardDescription className="mt-1">
                          {check.position} | {check.referenceCompany}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(check.status)}
                        {getResultBadge(check.result)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">Referans Bilgileri</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Referans Kişi:</span>
                            <p className="font-medium">{check.referenceName} - {check.referenceTitle}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">İletişim:</span>
                            <p className="font-medium flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {check.contactPhone}
                            </p>
                            <p className="font-medium flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {check.contactEmail}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">Çalışma Detayları</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Çalışma Dönemi:</span>
                            <p className="font-medium">{check.workingPeriod}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Ayrılma Nedeni:</span>
                            <p className="font-medium">{check.reason}</p>
                          </div>
                          {check.rating && (
                            <div>
                              <span className="text-gray-500">Değerlendirme:</span>
                              <p className="font-medium">{check.rating}/5.0</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {check.notes && (
                      <div className="space-y-2">
                        <span className="text-gray-500 text-sm">Notlar:</span>
                        <p className="text-sm bg-gray-50 p-3 rounded-lg">{check.notes}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-xs text-gray-500">
                        {check.checkDate && `Tamamlanma: ${check.checkDate}`}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Düzenle
                        </Button>
                        {check.status !== 'tamamlandı' && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Kontrol Et
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Tamamlanan Referans Kontrolleri</h2>
            <div className="grid gap-6">
              {referenceChecks.filter(check => check.status === 'tamamlandı').map((check) => (
                <Card key={check.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{check.candidateName}</h3>
                        <p className="text-gray-600">{check.position}</p>
                        <div className="mt-2 flex gap-2">
                          {getResultBadge(check.result)}
                          <Badge variant="outline">Puan: {check.rating}/5.0</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Raporu Görüntüle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Referans Kontrol Listesi</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Standart Kontrol Maddeleri</CardTitle>
                <CardDescription>
                  Her referans kontrolünde sorulması gereken temel sorular
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {checklistItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}