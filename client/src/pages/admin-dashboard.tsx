import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  Building2, Users, Shield, Settings, 
  BarChart3, Activity, Database
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
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistem Yöneticisi</h1>
          <p className="text-gray-600">Tüm sistemi izleyin ve yönetin</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className="bg-green-100 text-green-800">
            Sistem Sağlıklı
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            45 Şirket Aktif
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Toplam Şirket</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">45</div>
            <p className="text-xs text-gray-600">Bu ay +3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aktif Kullanıcılar</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <p className="text-xs text-gray-600">Online: 234</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sistem Sağlığı</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">99.8%</div>
            <p className="text-xs text-gray-600">Son 30 gün</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Güvenlik Skoru</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">A+</div>
            <p className="text-xs text-gray-600">Mükemmel</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Sistem Performansı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">CPU Kullanımı</span>
                <span className="text-sm font-medium text-gray-900">34%</span>
              </div>
              <Progress value={34} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">RAM Kullanımı</span>
                <span className="text-sm font-medium text-gray-900">67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Disk Kullanımı</span>
                <span className="text-sm font-medium text-gray-900">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Son Aktiviteler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { action: "Yeni şirket kaydı", details: "TechCorp A.Ş.", time: "5 dakika önce", type: "success" },
              { action: "Sistem güncellemesi", details: "v2.1.3 uygulandı", time: "1 saat önce", type: "info" },
              { action: "Güvenlik taraması", details: "Tamamlandı", time: "2 saat önce", type: "success" },
              { action: "Yedekleme işlemi", details: "Başarılı", time: "4 saat önce", type: "success" }
            ].map((activity, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Badge className={`text-xs ${
                      activity.type === 'success' ? 'bg-green-100 text-green-800' :
                      activity.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      activity.type === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.action}
                    </Badge>
                    <p className="text-sm text-gray-900">{activity.details}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Company List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Şirket Yönetimi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "TechCorp A.Ş.", users: 145, status: "Aktif", plan: "Enterprise", lastActive: "Şimdi" },
              { name: "Digital Solutions Ltd.", users: 89, status: "Aktif", plan: "Pro", lastActive: "2 saat önce" },
              { name: "Innovation Hub", users: 234, status: "Aktif", plan: "Enterprise", lastActive: "5 dakika önce" },
              { name: "StartupCo", users: 23, status: "Deneme", plan: "Basic", lastActive: "1 gün önce" }
            ].map((company, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-900">{company.name}</h3>
                    <p className="text-xs text-gray-600">{company.users} kullanıcı • {company.lastActive}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${
                      company.plan === "Enterprise" ? "bg-purple-100 text-purple-800" : 
                      company.plan === "Pro" ? "bg-blue-100 text-blue-800" : 
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {company.plan}
                    </Badge>
                    <Badge className={`text-xs ${
                      company.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {company.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Hızlı İşlemler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button className="h-16 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center space-y-1">
              <Building2 className="h-4 w-4" />
              <span className="text-xs">Şirket Ekle</span>
            </Button>
            <Button className="h-16 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center space-y-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Kullanıcı Yönet</span>
            </Button>
            <Button className="h-16 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center space-y-1">
              <Database className="h-4 w-4" />
              <span className="text-xs">Yedekle</span>
            </Button>
            <Button className="h-16 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center space-y-1">
              <Settings className="h-4 w-4" />
              <span className="text-xs">Ayarlar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}