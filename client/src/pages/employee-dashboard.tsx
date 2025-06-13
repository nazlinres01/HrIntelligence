import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  Clock, Calendar, FileText, User, 
  Target, BookOpen, MessageSquare, Bell,
  CheckCircle, Coffee
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
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Çalışan Dashboard</h1>
          <p className="text-gray-600">Günlük işlerinizi takip edin ve hedeflerinize odaklanın</p>
        </div>
        <Button className="bg-yellow-600 hover:bg-yellow-700">
          <User className="w-4 h-4 mr-2" />
          Profil Düzenle
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Aktif Görevler</p>
              <p className="text-sm font-medium text-gray-900">8</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Tamamlanan</p>
              <p className="text-sm font-medium text-gray-900">92%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">İzin Hakkı</p>
              <p className="text-sm font-medium text-gray-900">15 gün</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Bu Ay Çalışılan</p>
              <p className="text-sm font-medium text-gray-900">22 gün</p>
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
              { task: "Proje raporunu tamamla", status: "pending", priority: "high", time: "14:00" },
              { task: "Müşteri toplantısına katıl", status: "completed", priority: "medium", time: "10:00" },
              { task: "E-postaları yanıtla", status: "pending", priority: "low", time: "16:00" },
              { task: "Haftalık rapor hazırla", status: "pending", priority: "medium", time: "17:30" }
            ].map((task, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status === 'completed' ? 'Tamamlandı' : 
                         task.priority === 'high' ? 'Yüksek' :
                         task.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </Badge>
                      <span className="text-xs text-gray-600">{task.time}</span>
                    </div>
                    <p className="text-sm text-gray-900">{task.task}</p>
                  </div>
                  {task.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Son İzin Talepleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: "Yıllık İzin", dates: "15-20 Temmuz", status: "approved", days: "5 gün" },
              { type: "Hastalık İzni", dates: "3 Haziran", status: "approved", days: "1 gün" },
              { type: "Kişisel İzin", dates: "25 Mayıs", status: "pending", days: "0.5 gün" }
            ].map((leave, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${
                        leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                        leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {leave.type}
                      </Badge>
                      <Badge className={`text-xs ${
                        leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                        leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {leave.status === 'approved' ? 'Onaylandı' :
                         leave.status === 'pending' ? 'Beklemede' : 'Reddedildi'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-900">{leave.dates}</p>
                    <p className="text-xs text-gray-600">{leave.days}</p>
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
            <Button className="h-16 bg-yellow-600 hover:bg-yellow-700 flex flex-col items-center justify-center space-y-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">İzin Talebi</span>
            </Button>
            <Button className="h-16 bg-yellow-600 hover:bg-yellow-700 flex flex-col items-center justify-center space-y-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Mesai Kaydı</span>
            </Button>
            <Button className="h-16 bg-yellow-600 hover:bg-yellow-700 flex flex-col items-center justify-center space-y-1">
              <FileText className="h-4 w-4" />
              <span className="text-xs">Rapor Gönder</span>
            </Button>
            <Button className="h-16 bg-yellow-600 hover:bg-yellow-700 flex flex-col items-center justify-center space-y-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">Mesaj Gönder</span>
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}