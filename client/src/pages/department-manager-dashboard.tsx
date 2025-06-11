import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Target, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  FileText,
  MessageSquare
} from "lucide-react";

interface DepartmentStats {
  totalMembers: number;
  activeMembers: number;
  targetCompletion: string;
  pendingLeaves: number;
  teamPerformance: string;
}

interface TeamRequests {
  pending: any[];
}

export default function DepartmentManagerDashboard() {
  const { data: teamStats = {
    totalMembers: 0,
    activeMembers: 0,
    targetCompletion: '0%',
    pendingLeaves: 0,
    teamPerformance: '0%'
  } } = useQuery<DepartmentStats>({
    queryKey: ['/api/stats/department'],
  });

  const { data: teamMembers = [] } = useQuery<any[]>({
    queryKey: ['/api/team/members'],
  });

  const { data: departmentTasks = {
    pending: []
  } } = useQuery<TeamRequests>({
    queryKey: ['/api/tasks/department'],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departman Müdürü Dashboard</h1>
          <p className="text-muted-foreground">
            Ekip yönetimi ve departman performans takibi
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Departman Raporu
          </Button>
          <Button size="sm">
            <Award className="h-4 w-4 mr-2" />
            Performans Değerlendirme
          </Button>
        </div>
      </div>

      {/* Team Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ekip Üyesi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {teamStats.activeMembers} aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hedef Tamamlama</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.targetCompletion}</div>
            <p className="text-xs text-muted-foreground">
              Bu ay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen İzinler</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.pendingLeaves}</div>
            <p className="text-xs text-muted-foreground">
              Onay gereken
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ekip Performansı</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.teamPerformance}</div>
            <p className="text-xs text-muted-foreground">
              +5% bu ay
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Team Members */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ekip Üyeleri</CardTitle>
            <CardDescription>
              Departman çalışanları ve performans durumu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.slice(0, 5).map((member: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.position}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{member.performance}%</p>
                      <p className="text-xs text-muted-foreground">Performans</p>
                    </div>
                    <Progress value={member.performance} className="w-16" />
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status === 'active' ? 'Aktif' : 'İzinli'}
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
            <CardTitle>Yönetim İşlemleri</CardTitle>
            <CardDescription>
              Departman yönetimi araçları
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Award className="h-4 w-4 mr-2" />
              Performans Değerlendirme
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              İzin Onaylama
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Ekip Toplantısı
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Target className="h-4 w-4 mr-2" />
              Hedef Belirleme
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Rapor Oluştur
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Department Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Departman Hedefleri</CardTitle>
          <CardDescription>
            Aylık ve çeyrek dönem hedeflerinin takibi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Bu Ay Hedefleri</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Satış Hedefi</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={82} className="w-20" />
                      <span className="text-sm font-medium">82%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Müşteri Memnuniyeti</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={95} className="w-20" />
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Proje Teslimi</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={67} className="w-20" />
                      <span className="text-sm font-medium">67%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Çeyrek Dönem Hedefleri</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gelir Artışı</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={58} className="w-20" />
                      <span className="text-sm font-medium">58%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ekip Büyümesi</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={75} className="w-20" />
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verimlilik Artışı</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={88} className="w-20" />
                      <span className="text-sm font-medium">88%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Onay Bekleyen İşlemler</CardTitle>
          <CardDescription>
            Departman müdürü onayı gereken işlemler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {departmentTasks.pending.map((task: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${task.type === 'leave' ? 'bg-blue-500' : task.type === 'expense' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.employee} - {task.date}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Onayla
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Reddet
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}