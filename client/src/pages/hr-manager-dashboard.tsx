import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  Calendar, 
  BarChart3,
  FileText,
  Plus,
  AlertCircle,
  Shield
} from "lucide-react";

export default function HRManagerDashboard() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: leaves } = useQuery({
    queryKey: ["/api/leaves"],
  });

  const pendingLeaves = (leaves as any)?.filter((leave: any) => leave.status === "pending") || [];
  const recentEmployees = (employees as any)?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">İK Müdürü Paneli</h1>
              <p className="text-blue-100">
                Hoş geldiniz, {(user as any)?.firstName} {(user as any)?.lastName}
              </p>
              <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                İnsan Kaynakları Müdürü
              </Badge>
            </div>
          </div>
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Çalışan Ekle
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Toplam Çalışan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {(stats as any)?.totalEmployees || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Aktif personel sayısı</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
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

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <UserCheck className="h-4 w-4 mr-2" />
              Aktif İzinler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {(stats as any)?.activeLeaves || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">İzinde olan personel</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Ortalama Performans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {(stats as any)?.avgPerformance || "0"}/10
            </div>
            <p className="text-xs text-gray-500 mt-1">Genel performans skoru</p>
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
                      <p className="text-xs text-gray-500">{new Date(leave.startDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                        Onayla
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                        Reddet
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Bekleyen izin talebi bulunmuyor</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Employees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Son Eklenen Çalışanlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentEmployees.length > 0 ? (
              <div className="space-y-3">
                {recentEmployees.map((employee: any) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{employee.firstName} {employee.lastName}</p>
                      <p className="text-xs text-gray-500">{employee.position}</p>
                      <p className="text-xs text-gray-500">{employee.department}</p>
                    </div>
                    <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                      {employee.status === "active" ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Henüz çalışan bulunmuyor</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Çalışan Yönetimi</h3>
            <p className="text-sm text-gray-500">Personel ekleme ve düzenleme</p>
          </CardContent>
        </Card>

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
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Performans</h3>
            <p className="text-sm text-gray-500">Performans değerlendirmeleri</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Raporlar</h3>
            <p className="text-sm text-gray-500">İK raporları ve analizler</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}