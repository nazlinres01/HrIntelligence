import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import {
  Calendar,
  Clock,
  TrendingUp,
  FileText,
  Award,
  BookOpen,
  CreditCard,
  MessageSquare,
  Target,
  CheckCircle,
  AlertCircle,
  Users
} from "lucide-react";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const userData = user as any;

  const { data: timeEntries } = useQuery({
    queryKey: ["/api/time-entries/my"],
  });

  const { data: myPerformance } = useQuery({
    queryKey: ["/api/performance/my"],
  });

  const { data: leaveBalance } = useQuery({
    queryKey: ["/api/leaves/balance"],
  });

  const { data: upcomingTrainings } = useQuery({
    queryKey: ["/api/trainings/upcoming"],
  });

  const { data: messages } = useQuery({
    queryKey: ["/api/messages/my"],
  });

  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Hoş geldin, {userData.firstName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Bugün kendini nasıl hissediyorsun? İşte günlük özetin.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Clock className="mr-2 h-4 w-4" />
          Mesai Başlat
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay Mesai</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">162h 30m</div>
            <p className="text-xs text-green-600">+12h geçen aya göre</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kalan İzin</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 gün</div>
            <p className="text-xs text-gray-600">28 günden kalan</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performans</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-purple-600">Hedefin üzerinde</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Okunmamış</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-orange-600">Yeni mesaj</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-600" />
              Bugünün Programı
            </CardTitle>
            <CardDescription>
              Bugün için planlanan etkinlikler ve toplantılar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <h4 className="font-medium">Haftalık Ekip Toplantısı</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">09:30 - 10:30</p>
              </div>
              <Badge variant="secondary">Zoom</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="w-2 h-8 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <h4 className="font-medium">Proje Review</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">14:00 - 15:30</p>
              </div>
              <Badge variant="secondary">Toplantı Odası A</Badge>
            </div>

            <div className="flex items-center space-x-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <h4 className="font-medium">İK Eğitimi</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">16:00 - 17:00</p>
              </div>
              <Badge variant="secondary">Online</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
              Performans Özeti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Proje Tamamlama</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Zamanında Teslimat</span>
                <span className="font-medium">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Takım İşbirliği</span>
                <span className="font-medium">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>

            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Genel Puan</span>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-green-600">4.3</span>
                <span className="text-sm text-gray-500 ml-1">/5.0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              Son Etkinlikler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">İzin talebin onaylandı</p>
                <p className="text-xs text-gray-500">2 saat önce</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">Yeni eğitim atandı</p>
                <p className="text-xs text-gray-500">1 gün önce</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">Performans değerlendirmesi tamamlandı</p>
                <p className="text-xs text-gray-500">3 gün önce</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">Bordro görüntülendi</p>
                <p className="text-xs text-gray-500">1 hafta önce</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-indigo-600" />
              Hızlı İşlemler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              İzin Talep Et
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Harcama Raporu
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Bordro Görüntüle
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Destek Talebi
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Trainings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-emerald-600" />
              Yaklaşan Eğitimler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              <div className="flex-1">
                <h4 className="font-medium">Dijital Dönüşüm</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">15 Haziran, 14:00</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <h4 className="font-medium">Takım Çalışması</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">20 Haziran, 10:00</p>
              </div>
            </div>
            
            <Button variant="ghost" className="w-full">
              Tüm Eğitimleri Görüntüle
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}