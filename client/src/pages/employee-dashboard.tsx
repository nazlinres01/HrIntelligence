import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  Clock, Calendar, FileText, User, 
  Target, BookOpen, MessageSquare, Bell,
  CheckCircle, TrendingUp, Award, Coffee
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Çalışan Dashboard</h1>
              <p className="text-blue-100 text-lg">Günlük işlerinizi takip edin ve hedeflerinize odaklanın</p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold">8</div>
                <div className="text-blue-200 text-sm">Aktif Görev</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">92%</div>
                <div className="text-blue-200 text-sm">Tamamlama</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">15</div>
                <div className="text-blue-200 text-sm">İzin Hakkı</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Günlük Görevler</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">6/8</div>
              <p className="text-xs text-blue-600">Tamamlandı</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Toplantılar</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">3</div>
              <p className="text-xs text-blue-600">Bugün</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Eğitimler</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">2</div>
              <p className="text-xs text-blue-600">Devam eden</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Performans</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">4.2/5</div>
              <p className="text-xs text-blue-600">Bu çeyrek</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-blue-200">
            <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Görevlerim
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Program
            </TabsTrigger>
            <TabsTrigger value="leaves" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              İzinlerim
            </TabsTrigger>
            <TabsTrigger value="development" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Gelişim
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Today's Tasks */}
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Bugünkü Görevlerim
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { task: "Haftalık raporu hazırla", deadline: "16:00", priority: "Yüksek", completed: false },
                    { task: "Müşteri toplantısına katıl", deadline: "14:30", priority: "Orta", completed: true },
                    { task: "Proje kodlarını gözden geçir", deadline: "17:00", priority: "Düşük", completed: false },
                    { task: "Takım standup toplantısı", deadline: "10:00", priority: "Orta", completed: true }
                  ].map((item, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-blue-100'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                          }`} />
                          <span className={`text-sm font-medium ${
                            item.completed ? 'text-green-700 line-through' : 'text-gray-800'
                          }`}>
                            {item.task}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            item.priority === "Yüksek" ? "destructive" : 
                            item.priority === "Orta" ? "default" : "secondary"
                          }>
                            {item.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">{item.deadline}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Performance Overview */}
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Performans Özeti
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Görev Tamamlama</span>
                      <span className="font-bold text-blue-700">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Zamanında Teslimat</span>
                      <span className="font-bold text-blue-700">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Kalite Skoru</span>
                      <span className="font-bold text-blue-700">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Takım İşbirliği</span>
                      <span className="font-bold text-blue-700">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="text-blue-700">Bugünkü Program</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: "09:00", event: "Günlük standup toplantısı", type: "meeting", duration: "30 dk" },
                    { time: "10:30", event: "Proje geliştirme - Sprint planning", type: "work", duration: "2 saat" },
                    { time: "13:00", event: "Öğle arası", type: "break", duration: "1 saat" },
                    { time: "14:30", event: "Müşteri demo sunumu", type: "meeting", duration: "45 dk" },
                    { time: "16:00", event: "Kod review ve test", type: "work", duration: "1.5 saat" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-blue-100">
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-bold text-blue-700">{item.time}</div>
                        <div className="text-xs text-gray-500">{item.duration}</div>
                      </div>
                      <div className={`p-2 rounded-full ${
                        item.type === 'meeting' ? 'bg-green-100 text-green-600' :
                        item.type === 'work' ? 'bg-blue-100 text-blue-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {item.type === 'meeting' && <Calendar className="h-4 w-4" />}
                        {item.type === 'work' && <FileText className="h-4 w-4" />}
                        {item.type === 'break' && <Coffee className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.event}</p>
                        <p className="text-sm text-gray-600 capitalize">{
                          item.type === 'meeting' ? 'Toplantı' :
                          item.type === 'work' ? 'Çalışma' : 'Mola'
                        }</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaves" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CardTitle className="text-blue-700">İzin Durumum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                      <div className="text-2xl font-bold text-blue-700">15</div>
                      <div className="text-sm text-gray-600">Yıllık İzin</div>
                      <div className="text-xs text-gray-500">Kalan</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                      <div className="text-2xl font-bold text-green-600">8</div>
                      <div className="text-sm text-gray-600">Hastalık İzni</div>
                      <div className="text-xs text-gray-500">Kalan</div>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Yeni İzin Talebi
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CardTitle className="text-blue-700">Son İzin Talepleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: "15-20 Şubat", type: "Yıllık İzin", status: "Onaylandı", days: 5 },
                      { date: "8 Ocak", type: "Hastalık İzni", status: "Onaylandı", days: 1 },
                      { date: "23-27 Aralık", type: "Yıllık İzin", status: "Bekliyor", days: 5 }
                    ].map((leave, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                        <div>
                          <p className="font-medium text-gray-900">{leave.date}</p>
                          <p className="text-sm text-gray-600">{leave.type} - {leave.days} gün</p>
                        </div>
                        <Badge variant={
                          leave.status === "Onaylandı" ? "default" : 
                          leave.status === "Bekliyor" ? "secondary" : "destructive"
                        }>
                          {leave.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="development" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CardTitle className="text-blue-700">Aktif Eğitimler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "React Advanced Patterns", progress: 75, instructor: "John Doe", deadline: "2024-02-15" },
                      { title: "Leadership Skills", progress: 45, instructor: "Jane Smith", deadline: "2024-03-01" }
                    ].map((training, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg border border-blue-100">
                        <h3 className="font-medium text-gray-900 mb-2">{training.title}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Eğitmen: {training.instructor}</span>
                            <span className="text-gray-600">Bitiş: {training.deadline}</span>
                          </div>
                          <Progress value={training.progress} className="h-2" />
                          <div className="text-xs text-gray-500">{training.progress}% tamamlandı</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                  <CardTitle className="text-blue-700">Hedeflerim</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { goal: "Q1 projesini zamanında tamamla", progress: 80, deadline: "31 Mart" },
                      { goal: "React certification al", progress: 60, deadline: "15 Şubat" },
                      { goal: "Takım liderliği becerileri geliştir", progress: 40, deadline: "30 Haziran" },
                      { goal: "2 yeni teknoloji öğren", progress: 25, deadline: "31 Aralık" }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-800">{item.goal}</span>
                          <span className="text-xs text-gray-500">{item.deadline}</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                        <div className="text-xs text-gray-500">{item.progress}% tamamlandı</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="text-blue-700">Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center space-y-2">
                <Clock className="h-6 w-6" />
                <span className="text-sm">Mesai Başlat</span>
              </Button>
              <Button className="h-20 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">İzin Talep Et</span>
              </Button>
              <Button className="h-20 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center space-y-2">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Rapor Gönder</span>
              </Button>
              <Button className="h-20 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center space-y-2">
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Mesaj Gönder</span>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}