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
    <div className="flex-1 space-y-8 p-8 max-w-full overflow-x-hidden overflow-y-auto h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Modern Header with Gradient */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-0 p-8 backdrop-blur-sm bg-opacity-90">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              İK Yönetim Paneli
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
              Şirketinizin insan kaynakları süreçlerini yönetin ve analiz edin
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-3 shadow-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards with Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:scale-105 rounded-2xl">
              <CardContent className="p-7">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{stat.title}</p>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">
                      {statsLoading ? (
                        <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-10 w-20 rounded"></div>
                      ) : stat.value}
                    </p>
                    <div className="flex items-center space-x-2">
                      {stat.changeType === 'increase' ? (
                        <div className="flex items-center bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-600 dark:text-green-400 ml-1">
                            {stat.change}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                          <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                          <span className="text-sm font-medium text-red-600 dark:text-red-400 ml-1">
                            {stat.change}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-slate-500 dark:text-slate-400">bu ay</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-3xl ${stat.bgColor} dark:bg-opacity-20 shadow-lg`}>
                    <Icon className={`h-10 w-10 ${stat.textColor} dark:text-white`} />
                  </div>
                </div>
                <div className={`absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r ${stat.color.replace('bg-', 'from-')}-400 to-${stat.color.replace('bg-', '')}-600 rounded-b-2xl`}></div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-2xl font-bold">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-3 mr-4 shadow-lg">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Hızlı İşlemler
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} href={action.href}>
                      <div className="group relative p-6 rounded-2xl border-2 border-transparent bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:scale-105 hover:border-blue-200 dark:hover:border-blue-600">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-start space-x-4">
                          <div className={`p-3 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 ${action.color.replace('hover:', '').replace('border-', 'bg-').split(' ')[0]}/10`}>
                            <Icon className={`h-6 w-6 ${action.iconColor} transition-colors duration-300`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                              {action.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {action.description}
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowRight className="h-5 w-5 text-blue-500" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Pending Leaves */}
        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-3 mr-4 shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Bekleyen İzinler
                </span>
              </div>
              <Link href="/leaves">
                <Button variant="ghost" size="sm" className="hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl">
                  <Eye className="h-4 w-4 mr-2" />
                  Tümü
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leavesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse p-4 bg-slate-100 dark:bg-slate-700 rounded-2xl">
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : Array.isArray(leaves) && leaves.filter((leave: any) => leave.status === 'pending').length > 0 ? (
              <div className="space-y-4">
                {leaves.filter((leave: any) => leave.status === 'pending').slice(0, 3).map((leave: any) => (
                  <div key={leave.id} className="group p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                          <p className="font-bold text-slate-900 dark:text-white">İzin Talebi #{leave.id}</p>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                          {new Date(leave.startDate).toLocaleDateString('tr-TR')} - {new Date(leave.endDate).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-600 font-semibold px-3 py-1">
                        {leave.leaveType}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">Bekleyen izin talebi yok</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tüm izin talepleri onaylandı</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Recent Activities */}
        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center text-2xl font-bold">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-3 mr-4 shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Son Aktiviteler
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse p-4 bg-slate-100 dark:bg-slate-700 rounded-2xl">
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity: any) => {
                  const Icon = getActivityIcon(activity.type);
                  const iconColor = getActivityColor(activity.type);
                  
                  return (
                    <div key={activity.id} className="group p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-600">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-5 w-5 ${iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {new Date(activity.createdAt).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">Henüz aktivite yok</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sistem kullanımı başladığında aktiviteler görünecek</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Recent Employees */}
        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-3 mr-4 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Son Eklenen Çalışanlar
                </span>
              </div>
              <Link href="/employees">
                <Button variant="ghost" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl">
                  <Eye className="h-4 w-4 mr-2" />
                  Tümü
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {employeesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-2xl">
                    <div className="h-12 w-12 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentEmployees.length > 0 ? (
              <div className="space-y-4">
                {recentEmployees.map((employee: any) => (
                  <div key={employee.id} className="group p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl hover:shadow-lg transition-all duration-300 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-lg">
                          {employee.firstName?.[0]}{employee.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-slate-900 dark:text-white mb-1">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                          {employee.department} • {employee.position}
                        </p>
                      </div>
                      <Badge 
                        className={`font-semibold px-3 py-1 ${
                          employee.status === 'active' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600' 
                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {employee.status === 'active' ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">Henüz çalışan yok</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">İlk çalışanları sisteme ekleyin</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Performance Overview */}
      {Array.isArray(performanceData) && performanceData.length > 0 && (
        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center text-2xl font-bold">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-3 mr-4 shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Departman Performans Özeti
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceData.map((dept: any, index: number) => (
                <div key={index} className="group p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{dept.department}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {dept.score}%
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={dept.score} 
                    className="h-3 mb-4 bg-slate-200 dark:bg-slate-700" 
                  />
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      dept.score >= 80 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                        : dept.score >= 60 
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                    }`}>
                      {dept.score >= 80 ? 'Mükemmel' : dept.score >= 60 ? 'İyi' : 'Gelişmeli'}
                    </p>
                  </div>
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