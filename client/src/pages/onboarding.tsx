import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, User, FileText, Calendar, BookOpen, Plus, Users, Building } from "lucide-react";

export default function OnboardingPage() {
  const onboardingPrograms = [
    {
      id: 1,
      employeeName: "Elif Şahin",
      employeeId: "EMP156",
      position: "Senior Frontend Developer",
      department: "Yazılım Geliştirme",
      startDate: "2024-06-17",
      buddy: "Ahmet Yılmaz",
      manager: "Selin Koca",
      progress: 85,
      currentWeek: 3,
      totalWeeks: 4,
      status: "devam_ediyor",
      completedTasks: 17,
      totalTasks: 20,
      nextMilestone: "Proje Atama"
    },
    {
      id: 2,
      employeeName: "Can Arslan",
      employeeId: "EMP157",
      position: "Product Manager",
      department: "Ürün Yönetimi",
      startDate: "2024-06-10",
      buddy: "Zeynep Aktaş",
      manager: "Murat Demir",
      progress: 100,
      currentWeek: 4,
      totalWeeks: 4,
      status: "tamamlandı",
      completedTasks: 22,
      totalTasks: 22,
      nextMilestone: "Oryantasyon Tamamlandı"
    },
    {
      id: 3,
      employeeName: "Fatma Demir",
      employeeId: "EMP158",
      position: "UX Designer",
      department: "Tasarım",
      startDate: "2024-06-20",
      buddy: "Ayşe Kaya",
      manager: "Mehmet Öz",
      progress: 25,
      currentWeek: 1,
      totalWeeks: 4,
      status: "yeni_başladı",
      completedTasks: 5,
      totalTasks: 20,
      nextMilestone: "Sistem Erişim Kontrolü"
    }
  ];

  const onboardingTasks = [
    {
      week: 1,
      title: "İlk Hafta - Karşılama ve Tanıtım",
      tasks: [
        "Karşılama toplantısı ve tanışma",
        "Şirket kültürü ve değerleri sunumu",
        "Sistem erişimleri ve hesap kurulumu",
        "İş sağlığı ve güvenliği eğitimi",
        "Buddy atama ve tanışma"
      ]
    },
    {
      week: 2,
      title: "İkinci Hafta - Departman Tanıtımı",
      tasks: [
        "Departman tanıtımı ve ekip toplantısı",
        "İş süreçleri ve prosedürler eğitimi",
        "Araç ve teknoloji eğitimi",
        "Ofis gezisi ve alan tanıtımı",
        "İlk proje briefingi"
      ]
    },
    {
      week: 3,
      title: "Üçüncü Hafta - Uygulamalı Eğitim",
      tasks: [
        "Uygulamalı proje çalışmaları",
        "Mentor ile birebir görüşmeler",
        "İlk görev ataması",
        "Feedback ve değerlendirme",
        "Sosyal aktiviteler ve takım entegrasyonu"
      ]
    },
    {
      week: 4,
      title: "Dördüncü Hafta - Değerlendirme ve Sonuç",
      tasks: [
        "Oryantasyon değerlendirme anketi",
        "Yönetici ile final görüşmesi",
        "İK ile süreç değerlendirmesi",
        "İlk performans hedeflerinin belirlenmesi",
        "Oryantasyon sertifikası"
      ]
    }
  ];

  const onboardingTemplates = [
    {
      id: 1,
      name: "Yazılım Geliştirme Oryantasyonu",
      department: "Teknoloji",
      duration: "4 hafta",
      tasks: 20,
      description: "Yazılım geliştiriciler için özel oryantasyon programı"
    },
    {
      id: 2,
      name: "Satış Ekibi Oryantasyonu",
      department: "Satış",
      duration: "3 hafta",
      tasks: 18,
      description: "Satış temsilcileri için ürün ve süreç odaklı program"
    },
    {
      id: 3,
      name: "Yönetici Oryantasyonu",
      department: "Tüm Departmanlar",
      duration: "6 hafta",
      tasks: 25,
      description: "Üst düzey pozisyonlar için kapsamlı oryantasyon"
    }
  ];

  const stats = [
    {
      title: "Aktif Oryantasyon",
      value: "12",
      trend: "+3 bu ay",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Tamamlanan Program",
      value: "48",
      trend: "95% başarı oranı",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Ortalama Süre",
      value: "3.8 hafta",
      trend: "Hedef: 4 hafta",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Memnuniyet Oranı",
      value: "4.7/5",
      trend: "+0.3 geçen dönem",
      icon: User,
      color: "text-purple-600"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'tamamlandı':
        return <Badge className="bg-green-100 text-green-800">✅ Tamamlandı</Badge>;
      case 'devam_ediyor':
        return <Badge className="bg-blue-100 text-blue-800">🔄 Devam Ediyor</Badge>;
      case 'yeni_başladı':
        return <Badge className="bg-yellow-100 text-yellow-800">🆕 Yeni Başladı</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Oryantasyon Süreci</h1>
            <p className="text-gray-600">Yeni çalışan oryantasyon programlarını yönetin</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 mt-4 lg:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Oryantasyon Başlat
          </Button>
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
            <TabsTrigger value="active">Aktif Oryantasyonlar</TabsTrigger>
            <TabsTrigger value="program">Program Şablonları</TabsTrigger>
            <TabsTrigger value="schedule">Haftalık Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Aktif Oryantasyon Programları</h2>

            <div className="grid gap-6">
              {onboardingPrograms.map((program) => (
                <Card key={program.id} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{program.employeeName}</CardTitle>
                        <CardDescription className="mt-1">
                          {program.position} - {program.department}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(program.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Personel No:</span>
                        <p className="font-medium">{program.employeeId}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Başlangıç Tarihi:</span>
                        <p className="font-medium">{program.startDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Buddy:</span>
                        <p className="font-medium">{program.buddy}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Yönetici:</span>
                        <p className="font-medium">{program.manager}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Program İlerlemesi</span>
                        <span className="text-sm font-bold text-orange-600">{program.progress}%</span>
                      </div>
                      <Progress value={program.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Hafta {program.currentWeek}/{program.totalWeeks}</span>
                        <span>{program.completedTasks}/{program.totalTasks} görev tamamlandı</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <span className="text-xs text-gray-500">Sonraki Milestone: </span>
                        <span className="font-medium">{program.nextMilestone}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Detayları Görüntüle
                        </Button>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          Güncelle
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="program" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Program Şablonları</h2>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Şablon Oluştur
              </Button>
            </div>

            <div className="grid gap-6">
              {onboardingTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{template.name}</CardTitle>
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{template.department}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Süre:</span>
                        <p className="font-medium">{template.duration}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Görev Sayısı:</span>
                        <p className="font-medium">{template.tasks} görev</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Departman:</span>
                        <p className="font-medium">{template.department}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Düzenle
                      </Button>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Kullan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Haftalık Oryantasyon Planı</h2>
            
            <div className="grid gap-6">
              {onboardingTasks.map((week) => (
                <Card key={week.week}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      {week.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {week.tasks.map((task, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium">{task}</span>
                        </div>
                      ))}
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