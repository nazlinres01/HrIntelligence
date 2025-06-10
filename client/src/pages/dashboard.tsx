import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart3,
  DollarSign,
  FileText,
  Megaphone,
  UserPlus,
  CalendarCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Eye,
  Plus
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities"],
  });

  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: leaves, isLoading: leavesLoading } = useQuery({
    queryKey: ["/api/leaves"],
  });

  const { data: performanceData } = useQuery({
    queryKey: ["/api/dashboard/performance-chart"],
  });

  const statsCards = [
    {
      title: "Toplam Çalışan",
      value: stats?.totalEmployees || 0,
      change: "+2",
      changeType: "increase",
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "Aktif İzinler",
      value: stats?.activeLeaves || 0,
      change: "-1",
      changeType: "decrease",
      icon: Calendar,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
    {
      title: "Aylık Bordro",
      value: stats?.monthlyPayroll || "₺0",
      change: "+5.2%",
      changeType: "increase",
      icon: CreditCard,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: "Ortalama Performans",
      value: stats?.avgPerformance || "0%",
      change: "+1.8%",
      changeType: "increase",
      icon: BarChart3,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
  ];

  const quickActions = [
    {
      title: "Yeni Çalışan Ekle",
      description: "Sisteme yeni çalışan kaydı",
      icon: UserPlus,
      href: "/employees",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      title: "İzin Talebini Onayla",
      description: "Bekleyen izin taleplerini incele",
      icon: CalendarCheck,
      href: "/leaves",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      iconColor: "text-green-600"
    },
    {
      title: "Bordro Hesapla",
      description: "Aylık bordro hesaplaması",
      icon: DollarSign,
      href: "/payroll",
      color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
      iconColor: "text-yellow-600"
    },
    {
      title: "Performans Raporu",
      description: "Detaylı performans analizi",
      icon: BarChart3,
      href: "/performance",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      iconColor: "text-purple-600"
    },
    {
      title: "Aylık Rapor Oluştur",
      description: "Kapsamlı aylık özet raporu",
      icon: FileText,
      href: "/reports",
      color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
      iconColor: "text-indigo-600"
    },
    {
      title: "Duyuru Gönder",
      description: "Şirket geneli duyuru paylaş",
      icon: Megaphone,
      href: "/settings",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
      iconColor: "text-orange-600"
    }
  ];

  const recentActivities = activities?.slice(0, 6) || [];
  const recentEmployees = employees?.slice(0, 4) || [];
  const pendingLeaves = leaves?.filter(leave => leave.status === 'pending').slice(0, 3) || [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'employee_added': return UserPlus;
      case 'leave_requested': return Calendar;
      case 'payroll_processed': return CreditCard;
      case 'performance_updated': return BarChart3;
      default: return CheckCircle;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'employee_added': return 'text-blue-500';
      case 'leave_requested': return 'text-orange-500';
      case 'payroll_processed': return 'text-green-500';
      case 'performance_updated': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <Header 
        title="Dashboard" 
        subtitle="İnsan kaynakları sisteminizin genel görünümü" 
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {statsLoading ? "..." : stat.value}
                    </p>
                    <div className="flex items-center space-x-1">
                      {stat.changeType === 'increase' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500">bu ay</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                    <Icon className={`h-8 w-8 ${stat.textColor}`} />
                  </div>
                </div>
                <div className={`absolute inset-x-0 bottom-0 h-1 ${stat.color}`}></div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5 text-blue-600" />
                Hızlı İşlemler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} href={action.href}>
                      <div className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${action.color}`}>
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg bg-white`}>
                            <Icon className={`h-5 w-5 ${action.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Leaves */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-orange-600" />
                Bekleyen İzinler
              </div>
              <Link href="/leaves">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Tümü
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leavesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : pendingLeaves.length > 0 ? (
              <div className="space-y-4">
                {pendingLeaves.map((leave) => (
                  <div key={leave.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">İzin Talebi #{leave.id}</p>
                      <p className="text-sm text-gray-600">{leave.startDate} - {leave.endDate}</p>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {leave.leaveType}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Bekleyen izin talebi yok</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-green-600" />
              Son Aktiviteler
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  const iconColor = getActivityColor(activity.type);
                  
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-full bg-gray-100`}>
                        <Icon className={`h-4 w-4 ${iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Employees */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-600" />
                Son Eklenen Çalışanlar
              </div>
              <Link href="/employees">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Tümü
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {employeesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {employee.department} • {employee.position}
                      </p>
                    </div>
                    <Badge 
                      variant={employee.status === 'active' ? 'default' : 'secondary'}
                      className={employee.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {employee.status === 'active' ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      {performanceData && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-purple-600" />
              Departman Performans Özeti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceData.map((dept, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{dept.department}</h3>
                    <span className="text-sm font-semibold text-purple-600">{dept.score}%</span>
                  </div>
                  <Progress value={dept.score} className="h-2" />
                  <p className="text-xs text-gray-500 mt-2">
                    {dept.score >= 80 ? 'Mükemmel' : dept.score >= 60 ? 'İyi' : 'Gelişmeli'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}