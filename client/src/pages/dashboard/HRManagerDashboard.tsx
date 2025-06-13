import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Settings, 
  Bell,
  Home,
  UserCheck,
  ClipboardList,
  Award,
  BookOpen,
  BarChart3,
  Shield,
  LogOut,
  Eye,
  Check,
  X
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function HRManagerDashboard() {
  const [location] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Dashboard verileri
  const { data: stats } = useQuery({
    queryKey: ["/api/stats/employees"],
  });

  const { data: pendingLeaves } = useQuery({
    queryKey: ["/api/leaves"],
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const { data: activities } = useQuery({
    queryKey: ["/api/activities"],
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"],
  });

  const approvalPendingLeaves = pendingLeaves?.filter(leave => leave.status === "pending") || [];
  const recentNotifications = notifications?.slice(0, 5) || [];
  const recentActivities = activities?.slice(0, 5) || [];

  // İzin onaylama mutations
  const approveLeave = useMutation({
    mutationFn: async (leaveId: number) => {
      return apiRequest(`/api/leaves/${leaveId}/approve`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaves"] });
      toast({
        title: "İzin Onaylandı",
        description: "İzin talebi başarıyla onaylandı.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İzin onaylanırken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const rejectLeave = useMutation({
    mutationFn: async (leaveId: number) => {
      return apiRequest(`/api/leaves/${leaveId}/reject`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaves"] });
      toast({
        title: "İzin Reddedildi",
        description: "İzin talebi reddedildi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İzin reddedilirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  // Çalışan bilgilerini bul
  const getEmployeeInfo = (employeeId: number) => {
    const employee = employees.find((emp: any) => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : `Çalışan #${employeeId}`;
  };

  const getLeaveTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      "annual": "Yıllık İzin",
      "sick": "Hastalık İzni",
      "maternity": "Doğum İzni",
      "paternity": "Babalık İzni",
      "personal": "Kişisel İzin",
      "emergency": "Acil Durum İzni"
    };
    return types[type] || type;
  };

  // Detaylı izin görüntüleme komponenti
  const LeaveDetailModal = ({ leave }: { leave: any }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>İzin Talebi Detayları</DialogTitle>
        <DialogDescription>
          {getEmployeeInfo(leave.employeeId)} tarafından gönderilen izin talebi
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Çalışan</Label>
            <p className="text-sm font-medium">{getEmployeeInfo(leave.employeeId)}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">İzin Türü</Label>
            <p className="text-sm">{getLeaveTypeLabel(leave.leaveType)}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Başlangıç Tarihi</Label>
            <p className="text-sm">{new Date(leave.startDate).toLocaleDateString('tr-TR')}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Bitiş Tarihi</Label>
            <p className="text-sm">{new Date(leave.endDate).toLocaleDateString('tr-TR')}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Toplam Gün</Label>
            <p className="text-sm font-medium">{leave.days} gün</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Başvuru Tarihi</Label>
            <p className="text-sm">{new Date(leave.appliedDate || new Date()).toLocaleDateString('tr-TR')}</p>
          </div>
        </div>
        
        {leave.reason && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Açıklama</Label>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">{leave.reason}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={() => {
              approveLeave.mutate(leave.id);
            }}
            disabled={approveLeave.isPending}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-2" />
            İzni Onayla
          </Button>
          <Button 
            onClick={() => {
              rejectLeave.mutate(leave.id);
            }}
            disabled={rejectLeave.isPending}
            variant="destructive"
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            İzni Reddet
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">İK Müdürü Dashboard</h2>
            <p className="text-gray-600">İnsan Kaynakları yönetim paneli</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/hr/strategy">
              <Button className="bg-green-600 hover:bg-green-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                İK Stratejisi
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Toplam Çalışan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.totalEmployees || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Aktif personel sayısı</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Bekleyen İzinler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{approvalPendingLeaves.length}</div>
              <p className="text-xs text-gray-500 mt-1">Onay bekleyen talepler</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Aylık Bordro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">₺{stats?.monthlyPayroll || '0'}</div>
              <p className="text-xs text-gray-500 mt-1">Bu ay toplam</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ortalama Performans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.avgPerformance || '0'}/5</div>
              <p className="text-xs text-gray-500 mt-1">Genel değerlendirme</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Leave Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                Onay Bekleyen İzinler
              </CardTitle>
              <CardDescription>
                İK Müdürü onayı gereken izin talepleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {approvalPendingLeaves.length > 0 ? (
                  approvalPendingLeaves.slice(0, 3).map((leave: any) => (
                    <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{getEmployeeInfo(leave.employeeId)}</p>
                        <p className="text-xs text-gray-500">{getLeaveTypeLabel(leave.leaveType)} - {leave.days} gün</p>
                        <p className="text-xs text-gray-400">{new Date(leave.startDate).toLocaleDateString('tr-TR')} - {new Date(leave.endDate).toLocaleDateString('tr-TR')}</p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                              <Eye className="w-3 h-3 mr-1" />
                              Detay
                            </Button>
                          </DialogTrigger>
                          <LeaveDetailModal leave={leave} />
                        </Dialog>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                          onClick={() => approveLeave.mutate(leave.id)}
                          disabled={approveLeave.isPending}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Onayla
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="text-xs px-2 py-1"
                          onClick={() => rejectLeave.mutate(leave.id)}
                          disabled={rejectLeave.isPending}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Reddet
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Onay bekleyen izin yok</p>
                )}
                {approvalPendingLeaves.length > 0 && (
                  <div className="pt-3 border-t">
                    <Link href="/leaves">
                      <Button variant="outline" className="w-full text-sm border-green-600 text-green-600 hover:bg-green-50">
                        Tüm İzinleri Görüntüle ({approvalPendingLeaves.length})
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-600" />
                Son Bildirimler
              </CardTitle>
              <CardDescription>
                Güncel sistem bildirimleri ve uyarılar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notification: any) => (
                    <div key={notification.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Bell className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-500">{notification.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Henüz bildirim yok</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Son Aktiviteler
              </CardTitle>
              <CardDescription>
                Sistem üzerindeki son işlemler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity: any) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.type}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Henüz aktivite yok</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
            <CardDescription>
              Sık kullanılan İK müdürü işlemleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/employees">
                <Button className="w-full h-20 flex flex-col gap-2 bg-green-600 hover:bg-green-700">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Çalışan Yönetimi</span>
                </Button>
              </Link>
              <Link href="/leaves">
                <Button className="w-full h-20 flex flex-col gap-2 bg-green-600 hover:bg-green-700">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">İzin Yönetimi</span>
                </Button>
              </Link>
              <Link href="/performance">
                <Button className="w-full h-20 flex flex-col gap-2 bg-green-600 hover:bg-green-700">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-sm">Performans</span>
                </Button>
              </Link>
              <Link href="/reports">
                <Button className="w-full h-20 flex flex-col gap-2 bg-green-600 hover:bg-green-700">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">Raporlar</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* HR Management Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-gray-600" />
              İK Yönetim Özeti
            </CardTitle>
            <CardDescription>
              Genel İnsan Kaynakları durumu ve istatistikler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">89%</div>
                <div className="text-sm text-gray-600">Çalışan Memnuniyeti</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">İşe Devam Oranı</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">92%</div>
                <div className="text-sm text-gray-600">Eğitim Tamamlama</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}