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

        <Card className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:scale-105 rounded-2xl">
          <CardContent className="p-7">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Bekleyen İzinler</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">
                  {stats.pendingLeaves}
                </p>
                <div className="flex items-center bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400 ml-1">
                    Acil onay
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-orange-50 dark:bg-orange-900/20 shadow-lg">
                <Calendar className="h-10 w-10 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-b-2xl"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:scale-105 rounded-2xl">
          <CardContent className="p-7">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Devamsızlık Oranı</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">
                  {stats.absenteeismRate}
                </p>
                <div className="flex items-center bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400 ml-1">
                    -0.5% iyileştirme
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-red-50 dark:bg-red-900/20 shadow-lg">
                <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-red-400 to-red-600 rounded-b-2xl"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:scale-105 rounded-2xl">
          <CardContent className="p-7">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Personel Memnuniyeti</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">
                  {stats.satisfaction}
                </p>
                <div className="flex items-center bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                  <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400 ml-1">
                    +3% artış
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-purple-50 dark:bg-purple-900/20 shadow-lg">
                <Award className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-b-2xl"></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        {/* Enhanced Pending Approvals */}
        <Card className="col-span-4 shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center text-2xl font-bold">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-3 mr-4 shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Onay Bekleyen İşlemler
              </span>
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
              Hızlı karar gerektiren İK süreçleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingLeaves.slice(0, 4).map((leave: any, index: number) => (
                <div key={index} className="group p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl border border-orange-200 dark:border-orange-700 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900 dark:text-white">{leave.employeeName}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                          {leave.type} - {leave.days} gün
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                        Onayla
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                        Reddet
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced HR Quick Actions */}
        <Card className="col-span-3 shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center text-2xl font-bold">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-3 mr-4 shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                İK İşlemleri
              </span>
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
              Sık kullanılan İK araçları
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start p-4 h-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 rounded-xl group">
              <UserPlus className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold text-slate-900 dark:text-white">Personel İşe Alma</span>
            </Button>
            <Button variant="outline" className="w-full justify-start p-4 h-auto bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 rounded-xl group">
              <Award className="h-5 w-5 mr-3 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold text-slate-900 dark:text-white">Performans Değerlendirme</span>
            </Button>
            <Button variant="outline" className="w-full justify-start p-4 h-auto bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300 rounded-xl group">
              <Calendar className="h-5 w-5 mr-3 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold text-slate-900 dark:text-white">İzin Planlaması</span>
            </Button>
            <Button variant="outline" className="w-full justify-start p-4 h-auto bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-700 hover:shadow-lg transition-all duration-300 rounded-xl group">
              <FileText className="h-5 w-5 mr-3 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold text-slate-900 dark:text-white">Sözleşme Yönetimi</span>
            </Button>
            <Button variant="outline" className="w-full justify-start p-4 h-auto bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-700 hover:shadow-lg transition-all duration-300 rounded-xl group">
              <Target className="h-5 w-5 mr-3 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold text-slate-900 dark:text-white">Eğitim Programları</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Department Performance */}
      <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center text-2xl font-bold">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-3 mr-4 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Departman Performansı
            </span>
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
            Departman bazında İK metrikleri ve performans göstergeleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600 font-semibold px-3 py-1">Satış</Badge>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">8 kişi</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Performans</span>
                    <span className="text-blue-600 dark:text-blue-400">92%</span>
                  </div>
                  <Progress value={92} className="h-3 bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Devamsızlık</span>
                    <span className="text-green-600 dark:text-green-400">1.2%</span>
                  </div>
                  <Progress value={12} className="h-3 bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </div>

            <div className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600 font-semibold px-3 py-1">Teknoloji</Badge>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">12 kişi</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Performans</span>
                    <span className="text-purple-600 dark:text-purple-400">88%</span>
                  </div>
                  <Progress value={88} className="h-3 bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Devamsızlık</span>
                    <span className="text-yellow-600 dark:text-yellow-400">2.8%</span>
                  </div>
                  <Progress value={28} className="h-3 bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </div>

            <div className="group p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600 font-semibold px-3 py-1">Finans</Badge>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">4 kişi</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Performans</span>
                    <span className="text-green-600 dark:text-green-400">90%</span>
                  </div>
                  <Progress value={90} className="h-3 bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Devamsızlık</span>
                    <span className="text-green-600 dark:text-green-400">1.8%</span>
                  </div>
                  <Progress value={18} className="h-3 bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </div>

            <div className="group p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-600 font-semibold px-3 py-1">İK</Badge>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">3 kişi</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Performans</span>
                    <span className="text-amber-600 dark:text-amber-400">85%</span>
                  </div>
                  <Progress value={85} className="h-3 bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Devamsızlık</span>
                    <span className="text-yellow-600 dark:text-yellow-400">2.1%</span>
                  </div>
                  <Progress value={21} className="h-3 bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Recent HR Activities */}
      <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center text-2xl font-bold">
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-3 mr-4 shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Son İK Aktiviteleri
            </span>
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
            İnsan kaynakları departmanındaki son hareketler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hrActivities.length > 0 ? hrActivities.slice(0, 6).map((activity: any, index: number) => (
              <div key={index} className="group p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg animate-pulse"></div>
                    <div>
                      <p className="text-base font-bold text-slate-900 dark:text-white">{activity.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{activity.description}</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                    {new Date(activity.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-10 w-10 text-slate-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">Henüz İK aktivitesi yok</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">İK süreçleri başladığında aktiviteler burada görünecek</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}