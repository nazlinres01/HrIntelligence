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
  Mail,
  Target,
  TrendingUp
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
}

interface ApplicationStats {
  new: number;
  inReview: number;
  scheduled: number;
  rejected: number;
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

  const { data: applications = {
    new: 0,
    inReview: 0,
    scheduled: 0,
    rejected: 0
  } } = useQuery<ApplicationStats>({
    queryKey: ['/api/applications/pending'],
  });

  const { data: interviews = {
    today: 0,
    completed: 0,
    schedule: []
  } } = useQuery<InterviewStats>({
    queryKey: ['/api/interviews/today'],
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="space-y-8 p-6">
        {/* Corporate Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                İK Uzmanı Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                İnsan kaynakları işlemleri ve başvuru yönetimi
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
              >
                <FileText className="h-4 w-4 mr-2" />
                İK Raporu
              </Button>
              <Button 
                size="sm"
                className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Yeni Başvuru
              </Button>
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Bekleyen Görevler</CardTitle>
              <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{tasks.pending}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {tasks.urgent} acil
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Bugünkü Görüşmeler</CardTitle>
              <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{interviews.today}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {interviews.completed} tamamlandı
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Yeni Başvurular</CardTitle>
              <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{applications.new}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Bu hafta
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Tamamlanan Görevler</CardTitle>
              <CheckCircle className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{tasks.completed}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Bu ay
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Today's Schedule */}
          <Card className="col-span-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">Bugünkü Program</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Görüşmeler ve randevular
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interviews.schedule?.slice(0, 5).map((interview: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-750">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                        <Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {interview.candidate || interview.name || `Aday ${index + 1}`}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {interview.position || interview.role || 'Yazılım Geliştirici'} - {interview.time || '14:00'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={interview.status === 'confirmed' ? 'default' : 'secondary'}>
                        {interview.status === 'confirmed' ? 'Onaylandı' : 'Beklemede'}
                      </Badge>
                      <Button size="sm" variant="outline" className="border-slate-300 dark:border-slate-600">
                        <Phone className="h-4 w-4 mr-1" />
                        Ara
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">Hızlı İşlemler</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                İK işlem araçları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                <GraduationCap className="h-4 w-4 mr-2" />
                Başvuru İncele
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                <Calendar className="h-4 w-4 mr-2" />
                Görüşme Planla
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                <Mail className="h-4 w-4 mr-2" />
                E-posta Gönder
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                <FileText className="h-4 w-4 mr-2" />
                Rapor Oluştur
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                <Briefcase className="h-4 w-4 mr-2" />
                İlan Yayınla
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Application Pipeline */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">Başvuru Süreci</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Aday başvurularının durumu ve aşamaları
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100">Yeni Başvurular</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{applications.new}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Bu hafta</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100">İncelemede</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{applications.inReview}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Değerlendirme</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100">Görüşme</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{applications.scheduled}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Planlandı</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                </div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100">Reddedilen</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{applications.rejected}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Bu ay</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">İK Performans Metrikleri</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Bu ay performans göstergeleri
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">İşe Alım Oranı</span>
                <div className="flex items-center space-x-2">
                  <Progress value={78} className="w-20" />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">78%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Görüşme Başarı</span>
                <div className="flex items-center space-x-2">
                  <Progress value={85} className="w-20" />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Süreç Hızı</span>
                <div className="flex items-center space-x-2">
                  <Progress value={92} className="w-20" />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">92%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">Bu Hafta Hedefler</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Haftalık işe alım hedefleri
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Yeni Başvuru</span>
                <div className="flex items-center space-x-2">
                  <Progress value={67} className="w-20" />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">67%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Görüşme Sayısı</span>
                <div className="flex items-center space-x-2">
                  <Progress value={89} className="w-20" />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">89%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">İşe Alım</span>
                <div className="flex items-center space-x-2">
                  <Progress value={45} className="w-20" />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">45%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}