import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  User, 
  Calendar, 
  Clock,
  Target,
  Award,
  FileText,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  DollarSign
} from "lucide-react";

export default function EmployeeDashboard() {
  const { data: personalStats } = useQuery({
    queryKey: ['/api/stats/employee'],
  });

  const { data: myTasks } = useQuery({
    queryKey: ['/api/tasks/my'],
  });

  const { data: leaveBalance } = useQuery({
    queryKey: ['/api/leaves/balance'],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Çalışan Dashboard</h1>
          <p className="text-muted-foreground">
            Kişisel performans ve iş takibi
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            İzin Talep Et
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Gider Raporu
          </Button>
        </div>
      </div>

      {/* Personal Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Görevler</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalStats?.activeTasks || 0}</div>
            <p className="text-xs text-muted-foreground">
              {personalStats?.urgentTasks || 0} acil
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay Performans</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalStats?.monthlyPerformance || "85"}%</div>
            <p className="text-xs text-muted-foreground">
              +2% geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kalan İzin</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveBalance?.remaining || 0}</div>
            <p className="text-xs text-muted-foreground">
              {leaveBalance?.total || 14} günden
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay Bordro</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{personalStats?.monthlySalary || "0"}</div>
            <p className="text-xs text-muted-foreground">
              Net maaş
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* My Tasks */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Görevlerim</CardTitle>
            <CardDescription>
              Aktif görevler ve tamamlanma durumu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myTasks?.active?.slice(0, 5).map((task: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Son teslim: {task.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress value={task.progress} className="w-16" />
                    <span className="text-sm font-medium">{task.progress}%</span>
                    <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                      {task.priority === 'high' ? 'Acil' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
            <CardDescription>
              Günlük kullanılan araçlar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              İzin Talep Et
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Gider Raporu
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Clock className="h-4 w-4 mr-2" />
              Mesai Kayıt
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Yöneticimle İletişim
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Profil Güncelle
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performans Özeti</CardTitle>
          <CardDescription>
            Aylık performans değerlendirmesi ve hedefler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Bu Ay Hedeflerim</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Proje Teslim</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={80} className="w-20" />
                    <span className="text-sm font-medium">80%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Kalite Skoru</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={92} className="w-20" />
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ekip İşbirliği</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={88} className="w-20" />
                    <span className="text-sm font-medium">88%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Kazanımlarım</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Ayın Çalışanı</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Proje Tamamlama</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Performans Artışı</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Gelişim Alanları</h4>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  • Zaman yönetimi
                </div>
                <div className="text-sm text-muted-foreground">
                  • Takım liderliği
                </div>
                <div className="text-sm text-muted-foreground">
                  • Teknik beceriler
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave History */}
      <Card>
        <CardHeader>
          <CardTitle>İzin Geçmişi</CardTitle>
          <CardDescription>
            Son izin talepleri ve durumları
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaveBalance?.history?.map((leave: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">{leave.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {leave.startDate} - {leave.endDate} ({leave.days} gün)
                    </p>
                  </div>
                </div>
                <Badge variant={leave.status === 'approved' ? 'default' : leave.status === 'pending' ? 'secondary' : 'destructive'}>
                  {leave.status === 'approved' ? 'Onaylandı' : leave.status === 'pending' ? 'Beklemede' : 'Reddedildi'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}