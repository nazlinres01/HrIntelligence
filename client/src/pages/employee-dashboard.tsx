import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { 
  Clock, Calendar, FileText, User, 
  Target, BookOpen, MessageSquare, Bell,
  CheckCircle, Coffee, TrendingUp, Award,
  MapPin, Phone, Mail, BarChart3, PlusCircle
} from "lucide-react";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { data: employeeStats } = useQuery({
    queryKey: ["/api/stats/employee"],
  });

  const { data: myTasks } = useQuery({
    queryKey: ["/api/my-tasks"],
  });

  const { data: myLeaves } = useQuery({
    queryKey: ["/api/my-leaves"],
  });

  // Mock data for enhanced dashboard
  const employeeData = {
    firstName: user?.firstName || "Emre",
    lastName: user?.lastName || "Şahin",
    position: "Senior Frontend Developer",
    department: "Yazılım Geliştirme",
    profileImage: "",
    todayHours: "7.5",
    weeklyTarget: "40",
    currentWeekHours: "32.5",
    performanceScore: 4.2,
    upcomingMeetings: 2,
    unreadMessages: 5,
    pendingApprovals: 1
  };

  const userInitials = `${employeeData.firstName[0]}${employeeData.lastName[0]}`;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* Welcome Header with Profile */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={employeeData.profileImage} />
              <AvatarFallback className="text-lg bg-blue-100 text-blue-800 font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hoş Geldin, {employeeData.firstName}!
              </h1>
              <p className="text-gray-600">{employeeData.position} • {employeeData.department}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="outline" className="text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Aktif Çalışan
                </Badge>
                <span className="text-sm text-gray-500">Bugün {employeeData.todayHours} saat çalıştınız</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Bildirimler ({employeeData.unreadMessages})
            </Button>
            <Button variant="lightgray">
              <User className="w-4 h-4 mr-2" />
              Profil Düzenle
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Haftalık Progress</p>
                <p className="text-2xl font-bold text-blue-900">{employeeData.currentWeekHours}h</p>
                <p className="text-xs text-blue-700">Hedef: {employeeData.weeklyTarget}h</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-full">
                <Clock className="w-6 h-6 text-blue-700" />
              </div>
            </div>
            <Progress 
              value={(parseFloat(employeeData.currentWeekHours) / parseFloat(employeeData.weeklyTarget)) * 100} 
              className="mt-3 h-2" 
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Performans Skoru</p>
                <p className="text-2xl font-bold text-green-900">{employeeData.performanceScore}/5.0</p>
                <p className="text-xs text-green-700">Bu ay %8 artış</p>
              </div>
              <div className="p-3 bg-green-200 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-700" />
              </div>
            </div>
            <div className="flex mt-2">
              {[1,2,3,4,5].map(star => (
                <Award key={star} className={`w-4 h-4 ${star <= Math.floor(employeeData.performanceScore) ? 'text-green-500' : 'text-gray-300'}`} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Aktif Görevler</p>
                <p className="text-2xl font-bold text-purple-900">8</p>
                <p className="text-xs text-purple-700">2 acil, 6 normal</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-full">
                <Target className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">İzin Hakkı</p>
                <p className="text-2xl font-bold text-orange-900">15</p>
                <p className="text-xs text-orange-700">gün kaldı</p>
              </div>
              <div className="p-3 bg-orange-200 rounded-full">
                <Calendar className="w-6 h-6 text-orange-700" />
              </div>
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
            <Button variant="lightgray" className="h-16 flex flex-col items-center justify-center space-y-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium">İzin Talebi</span>
            </Button>
            <Button variant="lightgray" className="h-16 flex flex-col items-center justify-center space-y-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Mesai Kaydı</span>
            </Button>
            <Button variant="lightgray" className="h-16 flex flex-col items-center justify-center space-y-1">
              <FileText className="h-4 w-4" />
              <span className="text-xs font-medium">Rapor Gönder</span>
            </Button>
            <Button variant="lightgray" className="h-16 flex flex-col items-center justify-center space-y-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-medium">Mesaj Gönder</span>
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}