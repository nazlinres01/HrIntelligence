import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  BookOpen, GraduationCap, Code, Laptop, 
  Trophy, Target, PlayCircle, FileText,
  MessageSquare, HelpCircle, Settings, User,
  Monitor, Bookmark, Award, Brain, Star
} from "lucide-react";

export default function EmployeeDashboard() {
  const { data: employeeStats } = useQuery({
    queryKey: ["/api/stats/employee"],
  });

  const { data: myTasks } = useQuery({
    queryKey: ["/api/my-tasks"],
  });

  const { data: myLeaves } = useQuery({
    queryKey: ["/api/my-leaves"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      <div className="container mx-auto p-6 space-y-8">
        
        {/* Header - Learning Platform Style */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Öğrenme Dashboard'u</h1>
                  <p className="text-blue-100 text-lg">Gelişim yolculuğunuzu takip edin</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold">85%</div>
                <div className="text-blue-200 text-sm">Tamamlanan</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">12</div>
                <div className="text-blue-200 text-sm">Sertifika</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">240</div>
                <div className="text-blue-200 text-sm">Puan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Aktif Kurslar</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">3</div>
              <p className="text-xs text-blue-600">2 kurs bu hafta başlıyor</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-indigo-50 to-white group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-700">Tamamlanan Projeler</CardTitle>
              <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <Code className="h-4 w-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-800">8</div>
              <p className="text-xs text-indigo-600">Bu ay +2</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-purple-50 to-white group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Öğrenme Puanı</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Trophy className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">2,480</div>
              <p className="text-xs text-purple-600">Bu hafta +150</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-green-50 to-white group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Başarı Oranı</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Target className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">94%</div>
              <p className="text-xs text-green-600">Hedefleri aştı</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="learning" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-blue-200 p-1 rounded-xl">
            <TabsTrigger value="learning" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all">
              📚 Öğrenme
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all">
              📊 Dashboard
            </TabsTrigger>
            <TabsTrigger value="help" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all">
              💬 Yardım & Destek
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all">
              ⚙️ Ayarlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Current Courses */}
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <PlayCircle className="h-5 w-5" />
                    Devam Eden Kurslar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { 
                      title: "React & TypeScript Mastery", 
                      progress: 75, 
                      level: "İleri", 
                      nextLesson: "Custom Hooks",
                      timeLeft: "2 saat"
                    },
                    { 
                      title: "Modern JavaScript ES6+", 
                      progress: 45, 
                      level: "Orta", 
                      nextLesson: "Async/Await",
                      timeLeft: "1.5 saat"
                    },
                    { 
                      title: "Node.js Backend Development", 
                      progress: 30, 
                      level: "Başlangıç", 
                      nextLesson: "Express Routing",
                      timeLeft: "3 saat"
                    }
                  ].map((course, index) => (
                    <div key={index} className="p-4 bg-white rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-600">Sonraki: {course.nextLesson}</p>
                        </div>
                        <Badge variant={course.level === "İleri" ? "default" : course.level === "Orta" ? "secondary" : "outline"}>
                          {course.level}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">İlerleme</span>
                          <span className="font-semibold text-blue-700">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Kalan: {course.timeLeft}</span>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Devam Et
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Achievements & Certificates */}
              <Card className="border-blue-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <CardTitle className="text-purple-700 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Başarılar & Sertifikalar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { 
                      title: "JavaScript Expert", 
                      date: "15 Haziran 2025", 
                      type: "Sertifika",
                      color: "bg-yellow-100 text-yellow-800"
                    },
                    { 
                      title: "100 Gün Kod Yazma", 
                      date: "10 Haziran 2025", 
                      type: "Başarı",
                      color: "bg-green-100 text-green-800"
                    },
                    { 
                      title: "React Mastery", 
                      date: "5 Haziran 2025", 
                      type: "Sertifika",
                      color: "bg-blue-100 text-blue-800"
                    },
                    { 
                      title: "İlk Proje Tamamlandı", 
                      date: "1 Haziran 2025", 
                      type: "Başarı",
                      color: "bg-purple-100 text-purple-800"
                    }
                  ].map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-purple-100">
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full">
                        {achievement.type === "Sertifika" ? 
                          <GraduationCap className="h-5 w-5 text-purple-600" /> :
                          <Trophy className="h-5 w-5 text-purple-600" />
                        }
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.date}</p>
                      </div>
                      <Badge className={achievement.color}>
                        {achievement.type}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recommended Courses */}
            <Card className="border-blue-200 bg-gradient-to-br from-indigo-50 to-white">
              <CardHeader>
                <CardTitle className="text-indigo-700 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Önerilen Kurslar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { 
                      title: "Advanced TypeScript Patterns", 
                      duration: "8 saat", 
                      level: "İleri",
                      rating: 4.9,
                      students: 1250
                    },
                    { 
                      title: "GraphQL & Apollo Client", 
                      duration: "6 saat", 
                      level: "Orta",
                      rating: 4.8,
                      students: 890
                    },
                    { 
                      title: "Docker & Kubernetes", 
                      duration: "12 saat", 
                      level: "İleri",
                      rating: 4.7,
                      students: 650
                    }
                  ].map((course, index) => (
                    <div key={index} className="p-4 bg-white rounded-xl border border-indigo-100 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant={course.level === "İleri" ? "default" : "secondary"}>
                          {course.level}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                        <span>{course.duration}</span>
                        <span>{course.students} öğrenci</span>
                      </div>
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Kursa Katıl
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Learning Analytics */}
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CardTitle className="text-blue-700">Öğrenme Analitikleri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Günlük Öğrenme Hedefi</span>
                      <span className="font-bold text-blue-700">2.5 / 3 saat</span>
                    </div>
                    <Progress value={83} className="h-3" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Haftalık İlerleme</span>
                      <span className="font-bold text-blue-700">18 / 20 saat</span>
                    </div>
                    <Progress value={90} className="h-3" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Proje Tamamlama</span>
                      <span className="font-bold text-blue-700">6 / 8 proje</span>
                    </div>
                    <Progress value={75} className="h-3" />
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Bu Hafta</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• 3 yeni konu öğrenildi</li>
                      <li>• 2 proje tamamlandı</li>
                      <li>• 1 sertifika kazanıldı</li>
                      <li>• 150 puan eklendi</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Tasks */}
              <Card className="border-blue-200 bg-gradient-to-br from-green-50 to-white">
                <CardHeader>
                  <CardTitle className="text-green-700">Yaklaşan Görevler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { 
                      task: "TypeScript Quiz", 
                      due: "Yarın", 
                      type: "Quiz", 
                      priority: "high"
                    },
                    { 
                      task: "React Proje Sunumu", 
                      due: "3 gün", 
                      type: "Proje", 
                      priority: "medium"
                    },
                    { 
                      task: "JavaScript Code Review", 
                      due: "1 hafta", 
                      type: "İnceleme", 
                      priority: "low"
                    },
                    { 
                      task: "Node.js API Geliştirme", 
                      due: "2 hafta", 
                      type: "Proje", 
                      priority: "medium"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          item.priority === 'high' ? 'bg-red-500' :
                          item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">{item.task}</p>
                          <p className="text-sm text-gray-600">{item.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{item.due}</p>
                        <p className="text-xs text-gray-500">kaldı</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Help & Support */}
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Yardım Merkezi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { title: "Nasıl kursa katılırım?", category: "Kurslar" },
                      { title: "Sertifika nasıl alınır?", category: "Sertifikalar" },
                      { title: "İlerleme takibi nerede?", category: "Dashboard" },
                      { title: "Teknik destek nasıl alınır?", category: "Destek" }
                    ].map((faq, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{faq.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Canlı Destek
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="border-blue-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <CardTitle className="text-purple-700 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    İletişim & Destek
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { 
                        method: "E-posta Desteği", 
                        info: "destek@sirket.com", 
                        time: "24 saat içinde yanıt",
                        icon: <FileText className="h-5 w-5" />
                      },
                      { 
                        method: "Canlı Chat", 
                        info: "Hemen başlat", 
                        time: "Anında yanıt",
                        icon: <MessageSquare className="h-5 w-5" />
                      },
                      { 
                        method: "Eğitim Mentoru", 
                        info: "Randevu al", 
                        time: "1:1 görüşme",
                        icon: <User className="h-5 w-5" />
                      }
                    ].map((contact, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-purple-100">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          {contact.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{contact.method}</h3>
                          <p className="text-sm text-gray-600">{contact.info}</p>
                          <p className="text-xs text-gray-500">{contact.time}</p>
                        </div>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Başlat
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Personal Settings */}
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Kişisel Ayarlar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                      <div>
                        <h3 className="font-medium text-gray-900">Profil Bilgileri</h3>
                        <p className="text-sm text-gray-600">Ad, e-posta ve fotoğraf düzenle</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Düzenle
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                      <div>
                        <h3 className="font-medium text-gray-900">Öğrenme Hedefleri</h3>
                        <p className="text-sm text-gray-600">Günlük ve haftalık hedefler</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Ayarla
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                      <div>
                        <h3 className="font-medium text-gray-900">Bildirim Tercihleri</h3>
                        <p className="text-sm text-gray-600">E-posta ve push bildirimleri</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Düzenle
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                      <div>
                        <h3 className="font-medium text-gray-900">Gizlilik Ayarları</h3>
                        <p className="text-sm text-gray-600">Veri paylaşımı ve gizlilik</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Yönet
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Preferences */}
              <Card className="border-blue-200 bg-gradient-to-br from-indigo-50 to-white">
                <CardHeader>
                  <CardTitle className="text-indigo-700 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Öğrenme Tercihleri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-100">
                      <div>
                        <h3 className="font-medium text-gray-900">Öğrenme Hızı</h3>
                        <p className="text-sm text-gray-600">Kurs hızı: Orta</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Değiştir
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-100">
                      <div>
                        <h3 className="font-medium text-gray-900">Favori Konular</h3>
                        <p className="text-sm text-gray-600">JavaScript, React, Node.js</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Düzenle
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-100">
                      <div>
                        <h3 className="font-medium text-gray-900">Öğrenme Saatleri</h3>
                        <p className="text-sm text-gray-600">Sabah 9:00 - 12:00</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Ayarla
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-100">
                      <div>
                        <h3 className="font-medium text-gray-900">Dil Tercihi</h3>
                        <p className="text-sm text-gray-600">Türkçe</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Değiştir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Learning Actions */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="text-blue-700">Hızlı Eylemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button className="h-20 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center space-y-2 rounded-xl">
                <PlayCircle className="h-6 w-6" />
                <span className="text-sm">Kursa Devam</span>
              </Button>
              <Button className="h-20 bg-indigo-600 hover:bg-indigo-700 flex flex-col items-center justify-center space-y-2 rounded-xl">
                <BookOpen className="h-6 w-6" />
                <span className="text-sm">Yeni Kurs</span>
              </Button>
              <Button className="h-20 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center space-y-2 rounded-xl">
                <Code className="h-6 w-6" />
                <span className="text-sm">Kod Alıştır</span>
              </Button>
              <Button className="h-20 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center space-y-2 rounded-xl">
                <Trophy className="h-6 w-6" />
                <span className="text-sm">Başarılar</span>
              </Button>
              <Button className="h-20 bg-orange-600 hover:bg-orange-700 flex flex-col items-center justify-center space-y-2 rounded-xl">
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Mentor Chat</span>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}