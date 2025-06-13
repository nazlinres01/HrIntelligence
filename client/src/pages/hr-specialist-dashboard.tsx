import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, Clock, FileText, TrendingUp, 
  Calendar, CheckCircle, AlertCircle, Star,
  BookOpen, Target, Award, MessageSquare, Settings
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
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İK Uzmanı</h1>
          <p className="text-gray-600">Günlük işlerinizi takip edin ve yönetin</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Settings className="w-4 h-4 mr-2" />
          İK Ayarları
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Başvurular</p>
              <p className="text-sm font-medium text-gray-900">24</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Mülakatlar</p>
              <p className="text-sm font-medium text-gray-900">8</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Eğitimler</p>
              <p className="text-sm font-medium text-gray-900">5</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Performans</p>
              <p className="text-sm font-medium text-gray-900">92%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Bugünkü Görevler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { task: "CV incelemesi tamamla", priority: "Yüksek", progress: 75 },
              { task: "Mülakat programını düzenle", priority: "Orta", progress: 100 },
              { task: "Eğitim materyali hazırla", priority: "Düşük", progress: 25 },
              { task: "Performans raporları gözden geçir", priority: "Yüksek", progress: 50 }
            ].map((item, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{item.task}</span>
                  <Badge className={`text-xs ${
                    item.priority === "Yüksek" ? 'bg-red-100 text-red-800' : 
                    item.priority === "Orta" ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.priority}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600">{item.progress}% tamamlandı</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">İş Başvuruları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Ahmet Yılmaz", position: "Frontend Developer", status: "İnceleniyor", date: "2024-01-15" },
              { name: "Mehmet Demir", position: "Backend Developer", status: "Mülakat", date: "2024-01-14" },
              { name: "Ayşe Kaya", position: "UI/UX Designer", status: "Son Aşama", date: "2024-01-13" },
              { name: "Fatma Özkan", position: "DevOps Engineer", status: "Değerlendirme", date: "2024-01-12" }
            ].map((app, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-900">{app.name}</h3>
                    <p className="text-xs text-gray-600">{app.position}</p>
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs bg-blue-100 text-blue-800">
                        {app.status}
                      </Badge>
                      <span className="text-xs text-gray-600">{app.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Eğitim Programları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: "Liderlik Geliştirme", participants: 15, completion: 75, duration: "4 hafta" },
              { title: "Teknik Beceri Eğitimi", participants: 22, completion: 60, duration: "6 hafta" },
              { title: "İletişim Becerileri", participants: 18, completion: 90, duration: "2 hafta" },
              { title: "Proje Yönetimi", participants: 12, completion: 45, duration: "8 hafta" }
            ].map((training, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-900">{training.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${
                        training.completion >= 80 ? 'bg-green-100 text-green-800' :
                        training.completion >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        %{training.completion} Tamamlandı
                      </Badge>
                      <span className="text-xs text-gray-600">{training.participants} katılımcı</span>
                      <span className="text-xs text-gray-600">{training.duration}</span>
                    </div>
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
            <Button className="h-16 bg-orange-600 hover:bg-orange-700 flex flex-col items-center justify-center space-y-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Çalışan Kaydı</span>
            </Button>
            <Button className="h-16 bg-orange-600 hover:bg-orange-700 flex flex-col items-center justify-center space-y-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">İzin İşle</span>
            </Button>
            <Button className="h-16 bg-orange-600 hover:bg-orange-700 flex flex-col items-center justify-center space-y-1">
              <FileText className="h-4 w-4" />
              <span className="text-xs">Belge Hazırla</span>
            </Button>
            <Button className="h-16 bg-orange-600 hover:bg-orange-700 flex flex-col items-center justify-center space-y-1">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">Eğitim Kayıt</span>
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}