import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  Building2, Users, Shield, Settings, 
  BarChart3, TrendingUp, Database, Globe,
  Server, Lock, Activity, AlertTriangle
} from "lucide-react";

export default function AdminDashboard() {
  const { data: systemStats } = useQuery({
    queryKey: ["/api/stats/admin"],
  });

  const { data: companies } = useQuery({
    queryKey: ["/api/companies"],
  });

  const { data: systemHealth } = useQuery({
    queryKey: ["/api/system/health"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Sistem Yöneticisi Dashboard</h1>
              <p className="text-purple-100 text-lg">Tüm sistemi izleyin ve yönetin</p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold">45</div>
                <div className="text-purple-200 text-sm">Şirket</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1,247</div>
                <div className="text-purple-200 text-sm">Kullanıcı</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99.8%</div>
                <div className="text-purple-200 text-sm">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Toplam Şirket</CardTitle>
              <Building2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">45</div>
              <p className="text-xs text-purple-600">Bu ay +3</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Aktif Kullanıcılar</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">1,247</div>
              <p className="text-xs text-purple-600">Online: 234</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Sistem Sağlığı</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">99.8%</div>
              <p className="text-xs text-purple-600">Son 30 gün</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Güvenlik Skoru</CardTitle>
              <Shield className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">A+</div>
              <p className="text-xs text-purple-600">Mükemmel</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-purple-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Şirketler
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Sistem
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Güvenlik
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* System Performance */}
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <CardTitle className="text-purple-700 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Sistem Performansı
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">CPU Kullanımı</span>
                      <span className="font-bold text-purple-700">34%</span>
                    </div>
                    <Progress value={34} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">RAM Kullanımı</span>
                      <span className="font-bold text-purple-700">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Disk Kullanımı</span>
                      <span className="font-bold text-purple-700">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Network I/O</span>
                      <span className="font-bold text-purple-700">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <CardTitle className="text-purple-700 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Son Sistem Aktiviteleri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { action: "Yeni şirket kaydı", details: "TechCorp A.Ş.", time: "5 dakika önce", type: "success" },
                    { action: "Sistem güncellemesi", details: "v2.1.3 uygulandı", time: "1 saat önce", type: "info" },
                    { action: "Güvenlik taraması", details: "Tamamlandı", time: "2 saat önce", type: "success" },
                    { action: "Yedekleme işlemi", details: "Başarılı", time: "4 saat önce", type: "success" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-purple-100">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'success' ? 'bg-green-100 text-green-600' :
                        activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        activity.type === 'error' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader>
                <CardTitle className="text-purple-700">Şirket Yönetimi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "TechCorp A.Ş.", users: 145, status: "Aktif", plan: "Enterprise", lastActive: "Şimdi" },
                    { name: "Digital Solutions Ltd.", users: 89, status: "Aktif", plan: "Pro", lastActive: "2 saat önce" },
                    { name: "Innovation Hub", users: 234, status: "Aktif", plan: "Enterprise", lastActive: "5 dakika önce" },
                    { name: "StartupCo", users: 23, status: "Deneme", plan: "Basic", lastActive: "1 gün önce" }
                  ].map((company, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{company.name}</h3>
                          <p className="text-sm text-gray-600">{company.users} kullanıcı • {company.lastActive}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={company.plan === "Enterprise" ? "default" : company.plan === "Pro" ? "secondary" : "outline"}>
                          {company.plan}
                        </Badge>
                        <Badge variant={company.status === "Aktif" ? "default" : "secondary"}>
                          {company.status}
                        </Badge>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Yönet
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <CardTitle className="text-purple-700">Sistem Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Sürüm</span>
                      <span className="font-bold text-purple-700">v2.1.3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Uptime</span>
                      <span className="font-bold text-green-600">15 gün 8 saat</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Son yedekleme</span>
                      <span className="font-bold text-purple-700">4 saat önce</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Veritabanı boyutu</span>
                      <span className="font-bold text-purple-700">2.3 GB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <CardTitle className="text-purple-700">Sistem Durumu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { service: "Web Sunucusu", status: "Çalışıyor", health: "good" },
                      { service: "Veritabanı", status: "Çalışıyor", health: "good" },
                      { service: "Redis Cache", status: "Çalışıyor", health: "good" },
                      { service: "E-posta Servisi", status: "Çalışıyor", health: "good" }
                    ].map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100">
                        <span className="text-sm font-medium text-gray-900">{service.service}</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            service.health === 'good' ? 'bg-green-500' :
                            service.health === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm text-gray-600">{service.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <CardTitle className="text-purple-700">Güvenlik Özeti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Aktif oturumlar</span>
                      <span className="font-bold text-purple-700">234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Başarısız giriş</span>
                      <span className="font-bold text-red-600">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Son güvenlik taraması</span>
                      <span className="font-bold text-green-600">2 saat önce</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">SSL sertifikası</span>
                      <span className="font-bold text-green-600">Geçerli</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <CardTitle className="text-purple-700">Son Güvenlik Olayları</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { event: "Başarısız giriş denemesi", ip: "192.168.1.100", time: "5 dakika önce", severity: "low" },
                      { event: "Güvenlik taraması", result: "Temiz", time: "2 saat önce", severity: "info" },
                      { event: "Admin girişi", user: "admin@system.com", time: "1 gün önce", severity: "info" }
                    ].map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{event.event}</p>
                          <p className="text-xs text-gray-600">
                            {event.ip && `IP: ${event.ip}`}
                            {event.result && `Sonuç: ${event.result}`}
                            {event.user && `Kullanıcı: ${event.user}`}
                          </p>
                          <p className="text-xs text-gray-500">{event.time}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          event.severity === 'high' ? 'bg-red-500' :
                          event.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <CardTitle className="text-purple-700">Sistem Yönetimi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center space-y-2">
                <Building2 className="h-6 w-6" />
                <span className="text-sm">Şirket Ekle</span>
              </Button>
              <Button className="h-20 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Kullanıcı Yönet</span>
              </Button>
              <Button className="h-20 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center space-y-2">
                <Database className="h-6 w-6" />
                <span className="text-sm">Yedekle</span>
              </Button>
              <Button className="h-20 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center space-y-2">
                <Settings className="h-6 w-6" />
                <span className="text-sm">Sistem Ayarları</span>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}