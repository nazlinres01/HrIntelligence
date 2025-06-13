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
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-800 text-xs">
            Sistem Sağlıklı
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 text-xs">
            45 Şirket
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Toplam Şirket</p>
              <p className="text-sm font-medium text-gray-900">45</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Aktif Kullanıcılar</p>
              <p className="text-sm font-medium text-gray-900">1,247</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Sistem Sağlığı</p>
              <p className="text-sm font-medium text-gray-900">99.8%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Güvenlik</p>
              <p className="text-sm font-medium text-gray-900">A+</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Son Aktiviteler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
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
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.action}
                    </Badge>
                    <p className="text-sm text-gray-900">{activity.details}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                      company.plan === "Pro" ? "bg-gray-100 text-gray-800" : 
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

    </div>
  );
}