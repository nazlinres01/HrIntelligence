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

interface SpecialistStats {
  pending: number;
  urgent: number;
  today: number;
  completed: number;
  new: number;
}

interface InterviewStats {
  today: number;
  completed: number;
  schedule: any[];
  daily: any[];
}

export default function HRSpecialistDashboard() {
  const { data: tasks = {
    pending: 0,
    urgent: 0,
    today: 0,
    completed: 0,
    new: 0
  } } = useQuery<SpecialistStats>({
    queryKey: ['/api/tasks/hr-specialist'],
  });

  const { data: applications = [] } = useQuery<any[]>({
    queryKey: ['/api/applications/pending'],
  });

  const { data: interviews = {
    today: 0,
    completed: 0,
    schedule: [],
    daily: []
  } } = useQuery<InterviewStats>({
    queryKey: ['/api/interviews/today'],
  });

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-slate-900">
      {/* Corporate Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              İK Uzmanı Paneli
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Günlük İK işlemleri ve operasyonel süreç yönetimi
            </p>
          </div>
          <div className="flex items-center space-x-2">
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
      </div>

      {/* Corporate Daily Tasks */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-slate-800 border hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Görevler</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.pending}</div>
            <p className="text-xs text-muted-foreground">
              {tasks.urgent} acil görev
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugünkü Mülakatlar</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviews.today}</div>
            <p className="text-xs text-muted-foreground">
              {interviews.completed} tamamlandı
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yeni Başvurular</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              Bu hafta
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlanan İşler</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks?.completed || 0}</div>
            <p className="text-xs text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400 ml-1">
                    Bu hafta
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-green-50 dark:bg-green-900/20 shadow-lg">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-b-2xl"></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        {/* Enhanced Today's Interviews */}
        <Card className="col-span-4 shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center text-2xl font-bold">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-3 mr-4 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Bugünkü Mülakatlar
              </span>
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
              Planlanan mülakat takvimi ve adaylar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interviews.schedule && interviews.schedule.length > 0 ? interviews.schedule.slice(0, 4).map((interview: any, index: number) => (
                <div key={index} className="group p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-700 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900 dark:text-white">{interview.candidateName}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                          {interview.position} • {interview.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                        <Phone className="h-4 w-4 mr-2" />
                        Ara
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl">
                        <Mail className="h-4 w-4 mr-2" />
                        Mail
                      </Button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-10 w-10 text-slate-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">Bugün mülakat yok</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Yeni mülakatlar planlandığında burada görünecek</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <Card className="col-span-3 shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center text-2xl font-bold">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-3 mr-4 shadow-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Hızlı İşlemler
              </span>
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
              Günlük kullanılan araçlar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start p-4 h-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 rounded-xl group">
              <FileText className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold text-slate-900 dark:text-white">CV İnceleme</span>
            </Button>
            <Button variant="outline" className="w-full justify-start p-4 h-auto bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 rounded-xl group">
              <Calendar className="h-5 w-5 mr-3 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold text-slate-900 dark:text-white">Mülakat Planla</span>
            </Button>
            <Button variant="outline" className="w-full justify-start p-4 h-auto bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300 rounded-xl group">
              <Phone className="h-5 w-5 mr-3 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold text-slate-900 dark:text-white">Aday Görüşmesi</span>
            </Button>
            <Button variant="outline" className="w-full justify-start p-4 h-auto bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700 hover:shadow-lg transition-all duration-300 rounded-xl group">
              <GraduationCap className="h-5 w-5 mr-3 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold text-slate-900 dark:text-white">Oryantasyon</span>
            </Button>
            <Button variant="outline" className="w-full justify-start p-4 h-auto bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-700 hover:shadow-lg transition-all duration-300 rounded-xl group">
              <Briefcase className="h-5 w-5 mr-3 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold text-slate-900 dark:text-white">İş Teklifi</span>
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
            {interviews.daily.map((task: any, index: number) => (
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