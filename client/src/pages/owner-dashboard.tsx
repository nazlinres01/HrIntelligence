import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  Settings,
  Plus,
  Calendar,
  Crown
} from "lucide-react";

export default function OwnerDashboard() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: company } = useQuery({
    queryKey: ["/api/company"],
  });

  const { data: teamStats } = useQuery({
    queryKey: ["/api/team/stats"],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Crown className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Patron Paneli</h1>
              <p className="text-purple-100">
                Hoş geldiniz, {(user as any)?.firstName} {(user as any)?.lastName}
              </p>
              <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                Şirket Sahibi
              </Badge>
            </div>
          </div>
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Settings className="h-4 w-4 mr-2" />
            Şirket Ayarları
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

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Aylık Bordro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ₺{(stats as any)?.monthlyPayroll || "0"}
            </div>
            <p className="text-xs text-gray-500 mt-1">Bu ay toplam maliyet</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
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

      {/* Company Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Şirket Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Şirket Adı</label>
              <p className="text-sm font-medium">{(company as any)?.name || "Şirket Adı"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Sektör</label>
              <p className="text-sm font-medium">{(company as any)?.industry || "Belirtilmemiş"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Adres</label>
              <p className="text-sm font-medium">{(company as any)?.address || "Belirtilmemiş"}</p>
            </div>
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Şirket Bilgilerini Düzenle
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Takım Özeti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Toplam Üye</span>
              <span className="font-semibold">{(teamStats as any)?.totalMembers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Aktif Üye</span>
              <span className="font-semibold text-green-600">{(teamStats as any)?.activeMembers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">İK Müdürü</span>
              <span className="font-semibold">{(teamStats as any)?.managers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">İK Uzmanı</span>
              <span className="font-semibold">{(teamStats as any)?.specialists || 0}</span>
            </div>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Takım Üyesi Ekle
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Çalışan Yönetimi</h3>
            <p className="text-sm text-gray-500">Personel ekleme, düzenleme ve yönetimi</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Raporlar</h3>
            <p className="text-sm text-gray-500">Detaylı iş gücü analizi ve raporları</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Bordro Yönetimi</h3>
            <p className="text-sm text-gray-500">Maaş hesaplamaları ve bordro işlemleri</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}