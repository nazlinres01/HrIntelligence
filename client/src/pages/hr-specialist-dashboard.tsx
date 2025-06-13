import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, Clock, FileText, TrendingUp, 
  Calendar, CheckCircle, AlertCircle, Star,
  BookOpen, Target, Award, MessageSquare
} from "lucide-react";

export default function HRSpecialistDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats/hr-specialist"],
  });

  const { data: tasks } = useQuery({
    queryKey: ["/api/tasks/hr-specialist"],
  });

  const { data: applications } = useQuery({
    queryKey: ["/api/job-applications"],
  });

  const { data: trainings } = useQuery({
    queryKey: ["/api/trainings"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">İK Uzmanı Dashboard</h1>
              <p className="text-orange-100 text-lg">Günlük işlerinizi takip edin ve yönetin</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold">85%</div>
                <div className="text-orange-200 text-sm">Tamamlanan</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">12</div>
                <div className="text-orange-200 text-sm">Aktif Görev</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Başvurular</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">24</div>
              <p className="text-xs text-orange-600">Bu hafta +3</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Mülakatlar</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">8</div>
              <p className="text-xs text-orange-600">Bu hafta</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Eğitimler</CardTitle>
              <BookOpen className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">5</div>
              <p className="text-xs text-orange-600">Aktif program</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Performans</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">92%</div>
              <p className="text-xs text-orange-600">Hedef başarı</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-orange-200">
            <TabsTrigger value="tasks" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Görevler
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Başvurular
            </TabsTrigger>
            <TabsTrigger value="trainings" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Eğitimler
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Analitik
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Today's Tasks */}
              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                <CardHeader>
                  <CardTitle className="text-orange-700 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Bugünkü Görevler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { task: "CV incelemesi tamamla", priority: "Yüksek", progress: 75 },
                    { task: "Mülakat programını düzenle", priority: "Orta", progress: 100 },
                    { task: "Eğitim materyali hazırla", priority: "Düşük", progress: 25 },
                    { task: "Performans raporları gözden geçir", priority: "Yüksek", progress: 50 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">{item.task}</span>
                        <Badge variant={
                          item.priority === "Yüksek" ? "destructive" : 
                          item.priority === "Orta" ? "default" : "secondary"
                        }>
                          {item.priority}
                        </Badge>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                      <div className="text-xs text-gray-600">{item.progress}% tamamlandı</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                <CardHeader>
                  <CardTitle className="text-orange-700 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Son Aktiviteler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { action: "Yeni başvuru incelendi", time: "5 dakika önce", type: "application" },
                    { action: "Mülakat planlandı", time: "15 dakika önce", type: "interview" },
                    { action: "Eğitim tamamlandı", time: "1 saat önce", type: "training" },
                    { action: "Performans değerlendirmesi", time: "2 saat önce", type: "performance" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-orange-100">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'application' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'interview' ? 'bg-green-100 text-green-600' :
                        activity.type === 'training' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {activity.type === 'application' && <FileText className="h-4 w-4" />}
                        {activity.type === 'interview' && <Calendar className="h-4 w-4" />}
                        {activity.type === 'training' && <BookOpen className="h-4 w-4" />}
                        {activity.type === 'performance' && <Star className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader>
                <CardTitle className="text-orange-700">İş Başvuruları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Ahmet Yılmaz", position: "Frontend Developer", status: "İnceleniyor", date: "2024-01-15" },
                    { name: "Mehmet Demir", position: "Backend Developer", status: "Mülakat", date: "2024-01-14" },
                    { name: "Ayşe Kaya", position: "UI/UX Designer", status: "Son Aşama", date: "2024-01-13" },
                    { name: "Fatma Özkan", position: "DevOps Engineer", status: "Değerlendirme", date: "2024-01-12" }
                  ].map((app, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-100">
                      <div>
                        <h3 className="font-medium text-gray-900">{app.name}</h3>
                        <p className="text-sm text-gray-600">{app.position}</p>
                        <p className="text-xs text-gray-500">{app.date}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="border-orange-200 text-orange-700">
                          {app.status}
                        </Badge>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          İncele
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trainings" className="space-y-6">
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader>
                <CardTitle className="text-orange-700">Eğitim Programları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Liderlik Geliştirme", participants: 15, completion: 75, duration: "4 hafta" },
                    { title: "Teknik Beceri Eğitimi", participants: 22, completion: 60, duration: "6 hafta" },
                    { title: "İletişim Becerileri", participants: 18, completion: 90, duration: "2 hafta" },
                    { title: "Proje Yönetimi", participants: 12, completion: 45, duration: "8 hafta" }
                  ].map((training, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border border-orange-100">
                      <h3 className="font-medium text-gray-900 mb-2">{training.title}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Katılımcı: {training.participants}</span>
                          <span className="text-gray-600">{training.duration}</span>
                        </div>
                        <Progress value={training.completion} className="h-2" />
                        <div className="text-xs text-gray-500">{training.completion}% tamamlandı</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                <CardHeader>
                  <CardTitle className="text-orange-700">Başvuru Analitikleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bu ay toplam başvuru</span>
                      <span className="font-bold text-orange-700">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Kabul edilen</span>
                      <span className="font-bold text-green-600">34</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Reddedilen</span>
                      <span className="font-bold text-red-600">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bekleyen</span>
                      <span className="font-bold text-yellow-600">33</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                <CardHeader>
                  <CardTitle className="text-orange-700">Eğitim İstatistikleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Aktif eğitim</span>
                      <span className="font-bold text-orange-700">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tamamlanan</span>
                      <span className="font-bold text-green-600">45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ortalama tamamlama</span>
                      <span className="font-bold text-blue-600">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Memnuniyet oranı</span>
                      <span className="font-bold text-purple-600">4.6/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader>
            <CardTitle className="text-orange-700">Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 bg-orange-600 hover:bg-orange-700 flex flex-col items-center justify-center space-y-2">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Yeni Başvuru</span>
              </Button>
              <Button className="h-20 bg-orange-600 hover:bg-orange-700 flex flex-col items-center justify-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Mülakat Planla</span>
              </Button>
              <Button className="h-20 bg-orange-600 hover:bg-orange-700 flex flex-col items-center justify-center space-y-2">
                <BookOpen className="h-6 w-6" />
                <span className="text-sm">Eğitim Oluştur</span>
              </Button>
              <Button className="h-20 bg-orange-600 hover:bg-orange-700 flex flex-col items-center justify-center space-y-2">
                <Star className="h-6 w-6" />
                <span className="text-sm">Değerlendirme</span>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}