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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="space-y-8 p-6">
        {/* Corporate Header Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Departman Müdürü Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Ekip yönetimi ve departman performans takibi
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
              >
                <FileText className="h-4 w-4 mr-2" />
                Departman Raporu
              </Button>
              <Button 
                size="sm"
                className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
              >
                <Award className="h-4 w-4 mr-2" />
                Performans Değerlendirme
              </Button>
            </div>
          </div>
        </div>

        {/* Team Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Ekip Üyesi</CardTitle>
              <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{teamStats.totalMembers}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {teamStats.activeMembers} aktif
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Hedef Tamamlama</CardTitle>
              <Target className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{teamStats.targetCompletion}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Bu ay
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Bekleyen İzinler</CardTitle>
              <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{teamStats.pendingLeaves}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Onay gereken
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Ekip Performansı</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{teamStats.teamPerformance}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                +5% bu ay
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Team Members */}
          <Card className="col-span-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">Ekip Üyeleri</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Departman çalışanları ve performans durumu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.slice(0, 5).map((member: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-750">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                        <Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{member.name || `${member.firstName} ${member.lastName}`}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {member.position || member.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{member.performance || '85'}%</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Performans</p>
                      </div>
                      <Progress value={member.performance || 85} className="w-16" />
                      <Badge variant={member.status === 'active' || member.isActive ? 'default' : 'secondary'}>
                        {member.status === 'active' || member.isActive ? 'Aktif' : 'İzinli'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">Yönetim İşlemleri</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Departman yönetimi araçları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                <Award className="h-4 w-4 mr-2" />
                Performans Değerlendirme
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                <Calendar className="h-4 w-4 mr-2" />
                İzin Onaylama
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                <MessageSquare className="h-4 w-4 mr-2" />
                Ekip Toplantısı
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                <Target className="h-4 w-4 mr-2" />
                Hedef Belirleme
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                <FileText className="h-4 w-4 mr-2" />
                Rapor Oluştur
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Department Goals */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">Departman Hedefleri</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Aylık ve çeyrek dönem hedeflerinin takibi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">Bu Ay Hedefleri</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">Satış Hedefi</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={82} className="w-20" />
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">82%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">Müşteri Memnuniyeti</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={95} className="w-20" />
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">95%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">Proje Teslimi</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={67} className="w-20" />
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">67%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">Çeyrek Dönem Hedefleri</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">Gelir Artışı</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={58} className="w-20" />
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">58%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">Ekip Büyümesi</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-20" />
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">Verimlilik Artışı</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={88} className="w-20" />
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">88%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">Onay Bekleyen İşlemler</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Departman müdürü onayı gereken işlemler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentTasks.pending.map((task: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-750">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${task.type === 'leave' ? 'bg-blue-500' : task.type === 'expense' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{task.employee} - {task.date}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Onayla
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-950"
                    >
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
    </div>
  );
}