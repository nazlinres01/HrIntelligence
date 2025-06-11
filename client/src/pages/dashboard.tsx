import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
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
  Plus,
  Shield,
  Settings2,
  Mail,
  Phone,
  Key,
  Edit
} from "lucide-react";
import { Link } from "wouter";

// Schemas for team management
const inviteUserSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  role: z.enum(["hr_manager", "hr_specialist", "admin"], {
    required_error: "Lütfen bir rol seçiniz"
  }),
  phone: z.string().optional(),
});

const changePasswordSchema = z.object({
  newPassword: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

type InviteUserFormData = z.infer<typeof inviteUserSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

function Dashboard() {
  const { toast } = useToast();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<any>(null);
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities"],
  });

  // Team management queries
  const { data: teamMembers } = useQuery({
    queryKey: ["/api/team"],
  });

  const { data: teamStats } = useQuery({
    queryKey: ["/api/team/stats"],
  });

  // Forms
  const inviteForm = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: "hr_specialist",
      phone: "",
    },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Mutations
  const inviteUserMutation = useMutation({
    mutationFn: async (data: InviteUserFormData) => {
      return await apiRequest("/api/team/invite", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/team/stats"] });
      setIsInviteDialogOpen(false);
      inviteForm.reset();
      toast({
        title: "Davet Gönderildi",
        description: "Yeni İK uzmanı başarıyla sisteme eklendi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Kullanıcı eklenemedi.",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
      return await apiRequest(`/api/team/${userId}/password`, "PATCH", { newPassword });
    },
    onSuccess: () => {
      setSelectedUserForPassword(null);
      passwordForm.reset();
      toast({
        title: "Şifre Değiştirildi",
        description: "Kullanıcı şifresi başarıyla güncellendi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Şifre değiştirilemedi.",
        variant: "destructive",
      });
    },
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      return await apiRequest(`/api/team/${userId}/status`, "PATCH", { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      toast({
        title: "Durum Güncellendi",
        description: "Kullanıcı durumu başarıyla değiştirildi.",
      });
    },
  });

  const getRoleDisplay = (role: string) => {
    const roles = {
      hr_manager: { label: "İK Müdürü", color: "bg-purple-100 text-purple-800" },
      hr_specialist: { label: "İK Uzmanı", color: "bg-blue-100 text-blue-800" },
      admin: { label: "Sistem Yöneticisi", color: "bg-green-100 text-green-800" }
    };
    return roles[role as keyof typeof roles] || { label: role, color: "bg-gray-100 text-gray-800" };
  };

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
      value: (stats && typeof (stats as any).totalEmployees === 'number') ? (stats as any).totalEmployees : 0,
      change: "+2",
      changeType: "increase" as const,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "Aktif İzinler",
      value: (stats && typeof (stats as any).activeLeaves === 'number') ? (stats as any).activeLeaves : 0,
      change: "-1",
      changeType: "decrease" as const,
      icon: Calendar,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
    {
      title: "Aylık Bordro",
      value: (stats && (stats as any).monthlyPayroll) ? (stats as any).monthlyPayroll : "₺0",
      change: "+5.2%",
      changeType: "increase" as const,
      icon: CreditCard,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: "Ortalama Performans",
      value: (stats && (stats as any).avgPerformance) ? (stats as any).avgPerformance : "0%",
      change: "+1.8%",
      changeType: "increase" as const,
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

  const recentActivities = Array.isArray(activities) ? activities.slice(0, 6) : [];
  const recentEmployees = Array.isArray(employees) ? employees.slice(0, 4) : [];
  const pendingLeaves = Array.isArray(leaves) ? leaves.filter((leave: any) => leave.status === 'pending').slice(0, 3) : [];

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
    <div className="flex-1 space-y-6 p-6 max-w-full overflow-x-hidden overflow-y-auto h-full bg-gray-50 dark:bg-slate-900">
      {/* Corporate Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              İK Yönetim Paneli
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              İnsan kaynakları süreçlerini yönetin ve analiz edin
            </p>
          </div>
          <div className="bg-blue-600 rounded-lg p-3">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Corporate Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white dark:bg-slate-800 border hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {statsLoading ? (
                        <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-8 w-16 rounded"></div>
                      ) : stat.value}
                    </p>
                    <div className="flex items-center space-x-1">
                      {stat.changeType === 'increase' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-slate-500">bu ay</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Corporate Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-slate-800 border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 text-blue-600 mr-2" />
                Hızlı İşlemler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} href={action.href}>
                      <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${action.color.split(' ')[0]}`}>
                            <Icon className={`h-5 w-5 ${action.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                              {action.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
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

        {/* Corporate Pending Leaves */}
        <Card className="bg-white dark:bg-slate-800 border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-orange-600 mr-2" />
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
                  <div key={i} className="animate-pulse p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
                    <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : Array.isArray(leaves) && leaves.filter((leave: any) => leave.status === 'pending').length > 0 ? (
              <div className="space-y-3">
                {leaves.filter((leave: any) => leave.status === 'pending').slice(0, 3).map((leave: any) => (
                  <div key={leave.id} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">İzin Talebi #{leave.id}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {new Date(leave.startDate).toLocaleDateString('tr-TR')} - {new Date(leave.endDate).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        {leave.leaveType}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-slate-600 dark:text-slate-300">Bekleyen izin talebi yok</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Corporate Recent Activities */}
        <Card className="bg-white dark:bg-slate-800 border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 text-green-600 mr-2" />
              Son Aktiviteler
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
                    <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity: any) => {
                  const Icon = getActivityIcon(activity.type);
                  const iconColor = getActivityColor(activity.type);
                  
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <div className={`p-2 rounded-lg bg-gray-100 dark:bg-slate-600`}>
                        <Icon className={`h-4 w-4 ${iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {new Date(activity.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 dark:text-slate-300">Henüz aktivite yok</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Corporate Recent Employees */}
        <Card className="bg-white dark:bg-slate-800 border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
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
                  <div key={i} className="animate-pulse flex items-center space-x-3 p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-slate-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentEmployees.length > 0 ? (
              <div className="space-y-3">
                {recentEmployees.map((employee: any) => (
                  <div key={employee.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                        {employee.firstName?.[0]}{employee.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
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
            ) : (
              <div className="text-center py-6">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 dark:text-slate-300">Henüz çalışan yok</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Corporate Performance Overview */}
      {Array.isArray(performanceData) && performanceData.length > 0 && (
        <Card className="bg-white dark:bg-slate-800 border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
              Departman Performans Özeti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceData.map((dept: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-slate-900 dark:text-white">{dept.department}</h3>
                    <span className="text-sm font-semibold text-purple-600">{dept.score}%</span>
                  </div>
                  <Progress value={dept.score} className="h-2 mb-3" />
                  <p className={`text-xs px-2 py-1 rounded ${
                    dept.score >= 80 
                      ? 'bg-green-100 text-green-800' 
                      : dept.score >= 60 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {dept.score >= 80 ? 'Mükemmel' : dept.score >= 60 ? 'İyi' : 'Gelişmeli'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Team Overview */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-600" />
                Takım Yönetimi
              </CardTitle>
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni İK Uzmanı
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Yeni İK Uzmanı Ekle</DialogTitle>
                    <DialogDescription>
                      Yeni bir İK uzmanı davet edin ve rol atayın.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...inviteForm}>
                    <form onSubmit={inviteForm.handleSubmit((data) => inviteUserMutation.mutate(data))}>
                      <div className="space-y-4">
                        <FormField
                          control={inviteForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ad</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ahmet" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={inviteForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Soyad</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Yılmaz" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={inviteForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-posta</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" placeholder="ahmet@sirket.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={inviteForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefon (Opsiyonel)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="+90 555 123 4567" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={inviteForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rol</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Rol seçiniz" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="hr_manager">İK Müdürü</SelectItem>
                                  <SelectItem value="hr_specialist">İK Uzmanı</SelectItem>
                                  <SelectItem value="admin">Sistem Yöneticisi</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <DialogFooter className="mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsInviteDialogOpen(false)}
                        >
                          İptal
                        </Button>
                        <Button type="submit" disabled={inviteUserMutation.isPending}>
                          {inviteUserMutation.isPending ? "Ekleniyor..." : "Ekle"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {teamStats && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{teamStats.totalMembers}</div>
                  <p className="text-sm text-gray-600">Toplam Üye</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{teamStats.activeMembers}</div>
                  <p className="text-sm text-gray-600">Aktif Üye</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {teamMembers && Array.isArray(teamMembers) && teamMembers.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.profileImageUrl} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                        <Badge className={getRoleDisplay(member.role).color}>
                          {getRoleDisplay(member.role).label}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        {member.email && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Mail className="mr-1 h-3 w-3" />
                            {member.email}
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="mr-1 h-3 w-3" />
                            {member.phone}  
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={member.isActive ? "default" : "secondary"}>
                      {member.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUserForPassword(member)}
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={member.isActive ? "destructive" : "default"}
                      onClick={() => updateUserStatusMutation.mutate({
                        userId: member.id,
                        isActive: !member.isActive
                      })}
                    >
                      {member.isActive ? "Pasifleştir" : "Aktifleştir"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Statistics */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-purple-600" />
              Takım İstatistikleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamStats && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Shield className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                    <div className="text-xl font-bold text-purple-600">{teamStats.managers}</div>
                    <p className="text-sm text-gray-600">İK Müdürü</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                    <div className="text-xl font-bold text-blue-600">{teamStats.specialists}</div>
                    <p className="text-sm text-gray-600">İK Uzmanı</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Aktif Kullanıcı Oranı</span>
                    <span className="font-medium">
                      {teamStats.totalMembers > 0 
                        ? Math.round((teamStats.activeMembers / teamStats.totalMembers) * 100)
                        : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={teamStats.totalMembers > 0 
                      ? (teamStats.activeMembers / teamStats.totalMembers) * 100 
                      : 0} 
                    className="h-2" 
                  />
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Yetki Dağılımı</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tam Yetki</span>
                      <Badge variant="secondary">{teamStats.managers} kişi</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Kısıtlı Yetki</span>
                      <Badge variant="secondary">{teamStats.specialists} kişi</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={!!selectedUserForPassword} onOpenChange={() => setSelectedUserForPassword(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Şifre Değiştir</DialogTitle>
            <DialogDescription>
              {selectedUserForPassword?.firstName} {selectedUserForPassword?.lastName} için yeni şifre belirleyin.
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit((data) => 
              changePasswordMutation.mutate({
                userId: selectedUserForPassword?.id,
                newPassword: data.newPassword
              })
            )}>
              <div className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yeni Şifre</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="En az 6 karakter" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şifre Tekrar</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="Şifreyi tekrar giriniz" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedUserForPassword(null)}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={changePasswordMutation.isPending}>
                  {changePasswordMutation.isPending ? "Değiştiriliyor..." : "Değiştir"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Dashboard;