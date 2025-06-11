import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  Target, 
  Calendar, 
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Award,
  Clock,
  FileText,
  UserCheck,
  MessageSquare
} from "lucide-react";

export default function DepartmentManagerDashboard() {
  const { data: teamStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/department-manager/team-stats"],
  });

  const { data: teamMembers, isLoading: membersLoading } = useQuery({
    queryKey: ["/api/department-manager/team-members"],
  });

  const { data: pendingApprovals, isLoading: approvalsLoading } = useQuery({
    queryKey: ["/api/department-manager/pending-approvals"],
  });

  const { data: departmentGoals, isLoading: goalsLoading } = useQuery({
    queryKey: ["/api/department-manager/goals"],
  });

  if (statsLoading || membersLoading || approvalsLoading || goalsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Departman Müdürü Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Takım yönetimi ve departman performansı
            </p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Target className="h-4 w-4 mr-2" />
              Hedef Belirle
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Rapor Al
            </Button>
          </div>
        </div>

        {/* Department Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Takım Üyesi
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {teamStats?.totalMembers || 0}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {teamStats?.activeMembers || 0} aktif
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Onay Bekleyen
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingApprovals?.total || 0}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                İzin ve talepler
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Takım Performansı
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {teamStats?.averagePerformance || "0.0"}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                5.0 üzerinden
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Hedef Tamamlama
              </CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {departmentGoals?.completionRate || 0}%
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Bu çeyrek
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Takım
            </TabsTrigger>
            <TabsTrigger value="approvals" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Onaylar
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Hedefler
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Team Performance Overview */}
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Takım Performans Özeti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Yüksek Performans</span>
                      <span className="text-sm font-medium text-green-600">
                        {teamStats?.highPerformers || 0} kişi
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Orta Performans</span>
                      <span className="text-sm font-medium text-yellow-600">
                        {teamStats?.averagePerformers || 0} kişi
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Gelişim Gereken</span>
                      <span className="text-sm font-medium text-orange-600">
                        {teamStats?.lowPerformers || 0} kişi
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Bu Ay Değerlendirilen</span>
                      <span className="text-sm font-medium">
                        {teamStats?.evaluatedThisMonth || 0} kişi
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions for Managers */}
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Yönetici İşlemleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Performans Değerlendirme ({teamStats?.pendingEvaluations || 0})
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      İzin Onayları ({pendingApprovals?.leaves || 0})
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Award className="h-4 w-4 mr-2" />
                      Takım Toplantısı Planla
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="h-4 w-4 mr-2" />
                      Departman Hedefleri
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Geri Bildirim Ver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Focus Areas */}
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                  Odaklanılması Gereken Alanlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                        3 çalışanın performans değerlendirmesi gecikmiş
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-300">
                        Son tarih: Bu hafta içinde
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      İncele
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Departman hedefleri güncellenmeli
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Q2 hedefleri için revizyon gerekli
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Güncelle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Takım Üyeleri</CardTitle>
                <CardDescription>
                  Departmanınızdaki çalışanların durumu ve performansı
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers?.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {member.position} • Performans: {member.performanceScore}/5.0
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant="outline" 
                          className={
                            member.status === 'active' 
                              ? 'text-green-600 border-green-600' 
                              : 'text-orange-600 border-orange-600'
                          }
                        >
                          {member.status === 'active' ? 'Aktif' : 'İzinli'}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Görüntüle
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Onay Bekleyen İşlemler</CardTitle>
                <CardDescription>
                  Takım üyelerinden gelen talepler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals?.items?.map((approval: any) => (
                    <div key={approval.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {approval.type} - {approval.employeeName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {approval.details} • {approval.requestDate}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          Onayla
                        </Button>
                        <Button size="sm" variant="outline">
                          Reddet
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Departman Hedefleri</CardTitle>
                <CardDescription>
                  Takım hedefleri ve ilerleme durumu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentGoals?.goals?.map((goal: any) => (
                    <div key={goal.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {goal.title}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={
                            goal.status === 'completed' 
                              ? 'text-green-600 border-green-600' 
                              : goal.status === 'in-progress'
                              ? 'text-blue-600 border-blue-600'
                              : 'text-gray-600 border-gray-600'
                          }
                        >
                          {goal.status === 'completed' ? 'Tamamlandı' : 
                           goal.status === 'in-progress' ? 'Devam Ediyor' : 'Başlanmadı'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {goal.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          İlerleme: {goal.progress}%
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Hedef Tarih: {goal.targetDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}