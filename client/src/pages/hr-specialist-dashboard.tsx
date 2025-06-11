import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Calendar, 
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Phone,
  Mail
} from "lucide-react";

export default function HRSpecialistDashboard() {
  const { data: tasks } = useQuery({
    queryKey: ['/api/tasks/hr-specialist'],
  });

  const { data: applications } = useQuery({
    queryKey: ['/api/applications/pending'],
  });

  const { data: interviews } = useQuery({
    queryKey: ['/api/interviews/today'],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">İK Uzmanı Dashboard</h1>
          <p className="text-muted-foreground">
            Günlük İK işlemleri ve operasyonel süreçler
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Mülakat Takvimi
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Yeni Başvuru
          </Button>
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Görevler</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">
              {tasks?.urgent || 0} acil görev
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugünkü Mülakatlar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviews?.today || 0}</div>
            <p className="text-xs text-muted-foreground">
              {interviews?.completed || 0} tamamlandı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yeni Başvurular</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications?.new || 0}</div>
            <p className="text-xs text-muted-foreground">
              Bu hafta gelen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlanan İşler</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks?.completed || 0}</div>
            <p className="text-xs text-muted-foreground">
              Bu hafta
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Today's Interviews */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Bugünkü Mülakatlar</CardTitle>
            <CardDescription>
              Planlanan mülakat takvimi ve adaylar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interviews?.schedule?.slice(0, 4).map((interview: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{interview.candidateName}</p>
                      <p className="text-xs text-muted-foreground">
                        {interview.position} - {interview.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Ara
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      Mail
                    </Button>
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
              <FileText className="h-4 w-4 mr-2" />
              CV İnceleme
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Mülakat Planla
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Phone className="h-4 w-4 mr-2" />
              Aday Görüşmesi
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <GraduationCap className="h-4 w-4 mr-2" />
              Oryantasyon
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Briefcase className="h-4 w-4 mr-2" />
              İş Teklifi
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Application Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Başvuru Süreci</CardTitle>
          <CardDescription>
            Pozisyon bazında başvuru durumu ve aşama takibi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Frontend Developer</h4>
                  <Badge variant="secondary">5 aday</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CV İnceleme</span>
                    <span>3 aday</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Teknik Mülakat</span>
                    <span>2 aday</span>
                  </div>
                  <Progress value={40} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Son Mülakat</span>
                    <span>1 aday</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Sales Manager</h4>
                  <Badge variant="secondary">8 aday</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CV İnceleme</span>
                    <span>5 aday</span>
                  </div>
                  <Progress value={62} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>İlk Mülakat</span>
                    <span>3 aday</span>
                  </div>
                  <Progress value={37} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Son Mülakat</span>
                    <span>2 aday</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Marketing Specialist</h4>
                  <Badge variant="secondary">3 aday</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CV İnceleme</span>
                    <span>2 aday</span>
                  </div>
                  <Progress value={67} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Portfolio İnceleme</span>
                    <span>2 aday</span>
                  </div>
                  <Progress value={67} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Son Mülakat</span>
                    <span>1 aday</span>
                  </div>
                  <Progress value={33} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Günlük Görevler</CardTitle>
          <CardDescription>
            Bugün tamamlanması gereken İK işlemleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks?.daily?.map((task: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                    {task.priority === 'high' ? 'Acil' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Tamamla
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