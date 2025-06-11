import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Clock,
  TrendingUp,
  AlertTriangle,
  FileText,
  UserPlus,
  Award,
  Target
} from "lucide-react";

interface HRStats {
  activeEmployees: number;
  newHires: number;
  pendingLeaves: number;
  absenteeismRate: string;
  satisfaction: string;
}

export default function HRManagerDashboard() {
  const { data: stats = {
    activeEmployees: 0,
    newHires: 0,
    pendingLeaves: 0,
    absenteeismRate: '0%',
    satisfaction: '0%'
  } } = useQuery<HRStats>({
    queryKey: ['/api/stats/hr-manager'],
  });

  const { data: pendingLeaves = [] } = useQuery<any[]>({
    queryKey: ['/api/leaves/pending'],
  });

  const { data: hrActivities = [] } = useQuery<any[]>({
    queryKey: ['/api/activities/hr'],
  });

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-slate-900">
      {/* Corporate Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              İK Müdürü Paneli
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              İnsan kaynakları süreçleri ve personel yönetimi
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              İK Raporları
            </Button>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Personel İşe Al
            </Button>
          </div>
        </div>
      </div>

      {/* Corporate HR Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-slate-800 border hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Personel</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {stats.newHires} yeni işe alım bu ay
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen İzinler</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingLeaves}</div>
            <p className="text-xs text-muted-foreground">
              Acil onay gerekli
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devamsızlık Oranı</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.absenteeismRate}</div>
            <p className="text-xs text-muted-foreground">
              -0.5% iyileştirme
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personel Memnuniyeti</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.satisfaction}</div>
            <p className="text-xs text-muted-foreground">
              +3% artış
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Corporate Pending Approvals */}
        <Card className="col-span-4 bg-white dark:bg-slate-800 border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 text-orange-600 mr-2" />
              Onay Bekleyen İşlemler
            </CardTitle>
            <CardDescription>
              Hızlı karar gerektiren İK süreçleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingLeaves.slice(0, 4).map((leave: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{leave.employeeName}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {leave.type} - {leave.days} gün
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Onayla
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-300 text-red-600">
                        Reddet
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Corporate HR Quick Actions */}
        <Card className="col-span-3 bg-white dark:bg-slate-800 border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 text-indigo-600 mr-2" />
              İK İşlemleri
            </CardTitle>
            <CardDescription>
              Sık kullanılan İK araçları
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <UserPlus className="h-4 w-4 mr-2" />
              Personel İşe Alma
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Award className="h-4 w-4 mr-2" />
              Performans Değerlendirme
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              İzin Planlaması
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Sözleşme Yönetimi
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Target className="h-4 w-4 mr-2" />
              Eğitim Programları
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Corporate Department Performance */}
      <Card className="bg-white dark:bg-slate-800 border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 text-emerald-600 mr-2" />
            Departman Performansı
          </CardTitle>
          <CardDescription>
            Departman bazında İK metrikleri ve performans göstergeleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Satış</Badge>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">8 kişi</span>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Performans</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Devamsızlık</span>
                    <span className="font-medium">1.2%</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">Teknoloji</Badge>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">12 kişi</span>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Performans</span>
                    <span className="font-medium">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Devamsızlık</span>
                    <span className="font-medium">2.8%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800">Finans</Badge>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">4 kişi</span>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Performans</span>
                    <span className="font-medium">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Devamsızlık</span>
                    <span className="font-medium">1.8%</span>
                  </div>
                  <Progress value={18} className="h-2" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">İK</Badge>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">3 kişi</span>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Performans</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Devamsızlık</span>
                    <span className="font-medium">2.1%</span>
                  </div>
                  <Progress value={21} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Corporate Recent HR Activities */}
      <Card className="bg-white dark:bg-slate-800 border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 text-rose-600 mr-2" />
            Son İK Aktiviteleri
          </CardTitle>
          <CardDescription>
            İnsan kaynakları departmanındaki son hareketler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hrActivities.length > 0 ? hrActivities.slice(0, 6).map((activity: any, index: number) => (
              <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{activity.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{activity.description}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(activity.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-6">
                <Clock className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 dark:text-slate-300">Henüz İK aktivitesi yok</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}