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

export default function HRManagerDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['/api/stats/hr-manager'],
  });

  const { data: pendingLeaves } = useQuery({
    queryKey: ['/api/leaves/pending'],
  });

  const { data: hrActivities } = useQuery({
    queryKey: ['/api/activities/hr'],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">İK Müdürü Dashboard</h1>
          <p className="text-muted-foreground">
            İnsan kaynakları süreçleri ve personel yönetimi
          </p>
        </div>
        <div className="flex space-x-2">
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

      {/* HR Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Personel</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeEmployees || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.newHires || 0} yeni işe alım bu ay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen İzinler</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingLeaves || 0}</div>
            <p className="text-xs text-muted-foreground">
              Onay bekleyen izin talepleri
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devamsızlık Oranı</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.absenteeismRate || "2.1"}%</div>
            <p className="text-xs text-muted-foreground">
              -0.5% geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personel Memnuniyeti</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.satisfaction || "87"}%</div>
            <p className="text-xs text-muted-foreground">
              +3% bu çeyrek
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Pending Approvals */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Onay Bekleyen İşlemler</CardTitle>
            <CardDescription>
              Hızlı karar gerektiren İK süreçleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingLeaves?.slice(0, 4).map((leave: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{leave.employeeName}</p>
                      <p className="text-xs text-muted-foreground">
                        {leave.type} - {leave.days} gün
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="text-green-600">
                      Onayla
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      Reddet
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* HR Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>İK İşlemleri</CardTitle>
            <CardDescription>
              Sık kullanılan İK araçları
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
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

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Departman Performansı</CardTitle>
          <CardDescription>
            Departman bazında İK metrikleri ve performans göstergeleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Satış</Badge>
                  <span className="text-sm text-muted-foreground">8 kişi</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Performans</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Devamsızlık</span>
                    <span>1.2%</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Teknoloji</Badge>
                  <span className="text-sm text-muted-foreground">12 kişi</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Performans</span>
                    <span>88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Devamsızlık</span>
                    <span>2.8%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Finans</Badge>
                  <span className="text-sm text-muted-foreground">4 kişi</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Performans</span>
                    <span>90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Devamsızlık</span>
                    <span>1.8%</span>
                  </div>
                  <Progress value={18} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">İK</Badge>
                  <span className="text-sm text-muted-foreground">3 kişi</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Performans</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Devamsızlık</span>
                    <span>2.1%</span>
                  </div>
                  <Progress value={21} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent HR Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Son İK Aktiviteleri</CardTitle>
          <CardDescription>
            İnsan kaynakları departmanındaki son hareketler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hrActivities?.slice(0, 6).map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(activity.createdAt).toLocaleDateString('tr-TR')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}