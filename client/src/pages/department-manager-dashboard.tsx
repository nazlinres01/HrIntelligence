import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departman Müdürü</h1>
          <p className="text-gray-600">Takımınızı yönetin ve hedeflere ulaşın</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Settings className="w-4 h-4 mr-2" />
          Departman Ayarları
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Takım Üyesi</p>
              <p className="text-sm font-medium text-gray-900">24</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Performans</p>
              <p className="text-sm font-medium text-gray-900">89%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Aktif Proje</p>
              <p className="text-sm font-medium text-gray-900">7</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Hedef Tamamlama</p>
              <p className="text-sm font-medium text-gray-900">92%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Takım Performansı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Ahmet Yılmaz", position: "Yazılım Geliştirici", performance: 95, tasks: 8, completed: 7 },
              { name: "Ayşe Demir", position: "UI/UX Designer", performance: 88, tasks: 6, completed: 5 },
              { name: "Mehmet Kaya", position: "Backend Developer", performance: 92, tasks: 10, completed: 9 },
              { name: "Fatma Özkan", position: "QA Engineer", performance: 90, tasks: 7, completed: 6 }
            ].map((member, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-900">{member.name}</h3>
                    <p className="text-xs text-gray-600">{member.position}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${
                        member.performance >= 90 ? 'bg-green-100 text-green-800' :
                        member.performance >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        %{member.performance} Performans
                      </Badge>
                      <span className="text-xs text-gray-600">{member.completed}/{member.tasks} görev</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Aktif Projeler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "E-ticaret Platformu", progress: 75, deadline: "15 Aralık", team: 5, status: "progress" },
              { name: "Mobil Uygulama", progress: 45, deadline: "30 Aralık", team: 3, status: "progress" },
              { name: "API Geliştirme", progress: 90, deadline: "10 Aralık", team: 4, status: "nearly_complete" },
              { name: "Database Optimizasyonu", progress: 25, deadline: "20 Aralık", team: 2, status: "early" }
            ].map((project, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-900">{project.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${
                        project.status === 'nearly_complete' ? 'bg-green-100 text-green-800' :
                        project.status === 'progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        %{project.progress} Tamamlandı
                      </Badge>
                      <span className="text-xs text-gray-600">{project.team} kişi</span>
                      <span className="text-xs text-gray-600">Son: {project.deadline}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Son Aktiviteler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { activity: "Proje toplantısı tamamlandı", person: "Tüm takım", time: "2 saat önce", type: "meeting" },
              { activity: "Kod incelemesi yapıldı", person: "Ahmet Yılmaz", time: "4 saat önce", type: "review" },
              { activity: "Yeni özellik dağıtıldı", person: "Mehmet Kaya", time: "1 gün önce", type: "deployment" },
              { activity: "Bug düzeltildi", person: "Fatma Özkan", time: "2 gün önce", type: "fix" }
            ].map((activity, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Badge className={`text-xs ${
                      activity.type === 'deployment' ? 'bg-green-100 text-green-800' :
                      activity.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                      activity.type === 'review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.activity}
                    </Badge>
                    <p className="text-sm text-gray-900">{activity.person}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
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
            <Button className="h-16 bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center space-y-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Takım Yönet</span>
            </Button>
            <Button className="h-16 bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center space-y-1">
              <Target className="h-4 w-4" />
              <span className="text-xs">Hedef Belirle</span>
            </Button>
            <Button className="h-16 bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center space-y-1">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Rapor Görüntüle</span>
            </Button>
            <Button className="h-16 bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center space-y-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Toplantı Planla</span>
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}