import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, Target, TrendingUp, Clock, 
  Award, CheckCircle, AlertTriangle, BarChart3,
  Calendar, MessageSquare, FileText, Settings
} from "lucide-react";

export default function DepartmentManagerDashboard() {
  const { data: teamStats } = useQuery({
    queryKey: ["/api/stats/department-manager"],
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["/api/team-members"],
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      <div className="container mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-rose-700 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Departman Müdürü Dashboard</h1>
              <p className="text-red-100 text-lg">Takımınızı yönetin ve hedeflere ulaşın</p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold">24</div>
                <div className="text-red-200 text-sm">Takım Üyesi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">89%</div>
                <div className="text-red-200 text-sm">Performans</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">7</div>
                <div className="text-red-200 text-sm">Aktif Proje</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Takım Performansı</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">89%</div>
              <p className="text-xs text-red-600">Bu ay +5%</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Tamamlanan Projeler</CardTitle>
              <CheckCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">12</div>
              <p className="text-xs text-red-600">Bu çeyrekte</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Bekleyen Onaylar</CardTitle>
              <Clock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">5</div>
              <p className="text-xs text-red-600">Acil işlem gerekli</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Bütçe Kullanımı</CardTitle>
              <BarChart3 className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">67%</div>
              <p className="text-xs text-red-600">Hedefin altında</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="team" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-red-200">
            <TabsTrigger value="team" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Takım
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Projeler
            </TabsTrigger>
            <TabsTrigger value="approvals" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Onaylar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Analitik
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Team Overview */}
              <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
                <CardHeader>
                  <CardTitle className="text-red-700 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Takım Özeti
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Ali Yılmaz", role: "Senior Developer", performance: 95, status: "active" },
                    { name: "Ayşe Demir", role: "UI/UX Designer", performance: 88, status: "active" },
                    { name: "Mehmet Kaya", role: "Project Manager", performance: 92, status: "leave" },
                    { name: "Fatma Özkan", role: "QA Engineer", performance: 87, status: "active" }
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-medium">{member.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-center">
                          <div className="text-sm font-bold text-red-700">{member.performance}%</div>
                          <div className="text-xs text-gray-500">Performans</div>
                        </div>
                        <Badge variant={member.status === "active" ? "default" : "secondary"}>
                          {member.status === "active" ? "Aktif" : "İzinli"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Team Performance */}
              <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
                <CardHeader>
                  <CardTitle className="text-red-700 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Takım Performansı
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Hedef Tamamlama</span>
                      <span className="font-bold text-red-700">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Zamanında Teslimat</span>
                      <span className="font-bold text-red-700">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Kalite Skoru</span>
                      <span className="font-bold text-red-700">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Takım Memnuniyeti</span>
                      <span className="font-bold text-red-700">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
              <CardHeader>
                <CardTitle className="text-red-700">Aktif Projeler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "E-ticaret Platform Geliştirme", progress: 75, deadline: "2024-02-15", priority: "Yüksek", team: 8 },
                    { name: "Mobil Uygulama Yenileme", progress: 45, deadline: "2024-03-01", priority: "Orta", team: 5 },
                    { name: "API Entegrasyonu", progress: 90, deadline: "2024-01-30", priority: "Yüksek", team: 3 },
                    { name: "UI/UX Tasarım Güncellemesi", progress: 60, deadline: "2024-02-20", priority: "Düşük", team: 4 }
                  ].map((project, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border border-red-100">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <Badge variant={
                          project.priority === "Yüksek" ? "destructive" : 
                          project.priority === "Orta" ? "default" : "secondary"
                        }>
                          {project.priority}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Takım: {project.team} kişi</span>
                          <span className="text-gray-600">Bitiş: {project.deadline}</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">{project.progress}% tamamlandı</span>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Detaylar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
              <CardHeader>
                <CardTitle className="text-red-700">Bekleyen Onaylar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "İzin Talebi", requester: "Ali Yılmaz", details: "5 günlük yıllık izin", date: "2024-01-20", urgent: true },
                    { type: "Harcama Onayı", requester: "Ayşe Demir", details: "Tasarım araçları lisansı", date: "2024-01-19", urgent: false },
                    { type: "Proje Bütçesi", requester: "Mehmet Kaya", details: "Ek geliştirici kaynağı", date: "2024-01-18", urgent: true },
                    { type: "Performans Değerlendirmesi", requester: "Fatma Özkan", details: "Çeyreklik değerlendirme", date: "2024-01-17", urgent: false }
                  ].map((approval, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-100">
                      <div className="flex items-center space-x-3">
                        {approval.urgent && <AlertTriangle className="h-5 w-5 text-red-500" />}
                        <div>
                          <h3 className="font-medium text-gray-900">{approval.type}</h3>
                          <p className="text-sm text-gray-600">{approval.requester} - {approval.details}</p>
                          <p className="text-xs text-gray-500">{approval.date}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-red-200 text-red-700">
                          Reddet
                        </Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Onayla
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
                <CardHeader>
                  <CardTitle className="text-red-700">Departman İstatistikleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Toplam proje</span>
                      <span className="font-bold text-red-700">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tamamlanan</span>
                      <span className="font-bold text-green-600">18</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Devam eden</span>
                      <span className="font-bold text-blue-600">6</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bütçe kullanımı</span>
                      <span className="font-bold text-orange-600">67%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
                <CardHeader>
                  <CardTitle className="text-red-700">Takım Metrikleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ortalama performans</span>
                      <span className="font-bold text-red-700">89%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Memnuniyet oranı</span>
                      <span className="font-bold text-green-600">88%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Devamsızlık oranı</span>
                      <span className="font-bold text-red-600">3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Eğitim tamamlama</span>
                      <span className="font-bold text-purple-600">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
          <CardHeader>
            <CardTitle className="text-red-700">Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Takım Toplantısı</span>
              </Button>
              <Button className="h-20 bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center space-y-2">
                <Target className="h-6 w-6" />
                <span className="text-sm">Hedef Belirle</span>
              </Button>
              <Button className="h-20 bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center space-y-2">
                <CheckCircle className="h-6 w-6" />
                <span className="text-sm">Onay Ver</span>
              </Button>
              <Button className="h-20 bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Rapor Oluştur</span>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}