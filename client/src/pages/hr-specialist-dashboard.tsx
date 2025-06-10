import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  Clock, 
  UserCheck,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus
} from "lucide-react";

export default function HRSpecialistDashboard() {
  const { user } = useAuth();

  const { data: leaves } = useQuery({
    queryKey: ["/api/leaves"],
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  const pendingLeaves = (leaves as any)?.filter((leave: any) => leave.status === "pending") || [];
  const todayLeaves = (leaves as any)?.filter((leave: any) => {
    const today = new Date().toDateString();
    const leaveStart = new Date(leave.startDate).toDateString();
    return leaveStart === today;
  }) || [];

  const totalEmployees = (employees as any)?.length || 0;
  const activeEmployees = (employees as any)?.filter((emp: any) => emp.status === "active").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">İK Uzmanı Paneli</h1>
              <p className="text-teal-100">
                Hoş geldiniz, {(user as any)?.firstName} {(user as any)?.lastName}
              </p>
              <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                İK Uzmanı
              </Badge>
            </div>
          </div>
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Plus className="h-4 w-4 mr-2" />
            Yeni İzin Talebi
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Bekleyen İzinler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {pendingLeaves.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Onay bekleyen talepler</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Bugün İzinde
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {todayLeaves.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Bugün izin kullanan</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <UserCheck className="h-4 w-4 mr-2" />
              Aktif Çalışanlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {activeEmployees}
            </div>
            <p className="text-xs text-gray-500 mt-1">Toplam {totalEmployees} çalışan</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Bu Ay İzinler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {(leaves as any)?.filter((leave: any) => {
                const leaveDate = new Date(leave.startDate);
                const currentDate = new Date();
                return leaveDate.getMonth() === currentDate.getMonth() && 
                       leaveDate.getFullYear() === currentDate.getFullYear();
              }).length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Bu ay toplam izin</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                Bekleyen İzin Talepleri
              </span>
              <Badge variant="secondary">{pendingLeaves.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingLeaves.length > 0 ? (
              <div className="space-y-3">
                {pendingLeaves.slice(0, 5).map((leave: any) => (
                  <div key={leave.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{leave.employeeName}</p>
                      <p className="text-xs text-gray-500">{leave.type} - {leave.days} gün</p>
                      <p className="text-xs text-gray-500">
                        {new Date(leave.startDate).toLocaleDateString('tr-TR')} - 
                        {new Date(leave.endDate).toLocaleDateString('tr-TR')}
                      </p>
                      {leave.reason && (
                        <p className="text-xs text-gray-600 mt-1 italic">"{leave.reason}"</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Onayla
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        <XCircle className="h-3 w-3 mr-1" />
                        Reddet
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500">Bekleyen izin talebi bulunmuyor</p>
                <p className="text-xs text-gray-400 mt-1">Tüm talepler işlendi</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Leave Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Bugün İzinde Olanlar
              </span>
              <Badge variant="secondary">{todayLeaves.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayLeaves.length > 0 ? (
              <div className="space-y-3">
                {todayLeaves.map((leave: any) => (
                  <div key={leave.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{leave.employeeName}</p>
                      <p className="text-xs text-gray-500">{leave.type}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(leave.endDate).toLocaleDateString('tr-TR')} tarihine kadar
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      İzinde
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Bugün izinde kimse yok</p>
                <p className="text-xs text-gray-400 mt-1">Herkes işte</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">İzin Yönetimi</h3>
            <p className="text-sm text-gray-500">İzin talepleri ve onayları</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Çalışan Listesi</h3>
            <p className="text-sm text-gray-500">Çalışan bilgileri görüntüle</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Raporlar</h3>
            <p className="text-sm text-gray-500">İzin kullanım raporları</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Yeni Talep</h3>
            <p className="text-sm text-gray-500">İzin talebi oluştur</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}