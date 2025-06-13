import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Target,
  UserPlus,
  BarChart3,
  Settings,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  FileText,
  Activity,
  Database,
  Zap,
  Filter,
  Download,
  UserCheck,
  UserX,
  Plus,
  Search,
  Bell,
  Briefcase,
  Award,
  TrendingDown,
  RefreshCw,
  Globe,
  Monitor,
  Smartphone,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface EmployeeStats {
  totalEmployees: number;
  activeLeaves: number;
  monthlyPayroll: string;
  avgPerformance: string;
}

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  companyId: number;
}

interface AuditLog {
  id: number;
  userId: string;
  action: string;
  resource: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Notification {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface TimeEntry {
  id: number;
  userId: string;
  description: string;
  hours: number;
  date: string;
  status: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

interface ExpenseReport {
  id: number;
  userId: string;
  title: string;
  amount: string;
  category: string;
  status: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export default function OwnerDashboard() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);

  const { data: stats = {
    totalEmployees: 0,
    activeLeaves: 0,
    monthlyPayroll: '₺0K',
    avgPerformance: '0.0'
  } } = useQuery<EmployeeStats>({
    queryKey: ['/api/stats/employees'],
  });

  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ['/api/team/members'],
  });

  const { data: auditLogs = [] } = useQuery<AuditLog[]>({
    queryKey: ['/api/audit-logs'],
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
  });

  const { data: pendingTimeEntries = [] } = useQuery<TimeEntry[]>({
    queryKey: ['/api/time-entries/pending'],
  });

  const { data: pendingExpenses = [] } = useQuery<ExpenseReport[]>({
    queryKey: ['/api/expense-reports/pending'],
  });

  const { data: recentActivities = [] } = useQuery<any[]>({
    queryKey: ['/api/activities'],
  });

  const { data: teamStats } = useQuery({
    queryKey: ['/api/stats/team'],
  });

  // Quick Actions Mutations
  const approveTimeEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('PUT', `/api/time-entries/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-entries/pending'] });
      toast({ title: "Zaman kaydı onaylandı" });
    }
  });

  const approveExpenseMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('PUT', `/api/expense-reports/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expense-reports/pending'] });
      toast({ title: "Harcama raporu onaylandı" });
    }
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      await apiRequest('PUT', `/api/users/${userId}/status`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      toast({ title: "Kullanıcı durumu güncellendi" });
    }
  });

  const createNotificationMutation = useMutation({
    mutationFn: async (data: { title: string; message: string; type: string }) => {
      await apiRequest('POST', '/api/notifications/broadcast', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({ title: "Bildirim gönderildi" });
    }
  });

  // Employee creation mutation
  const createEmployeeMutation = useMutation({
    mutationFn: async (employeeData: any) => {
      const response = await apiRequest('POST', '/api/employees', employeeData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      setIsEmployeeDialogOpen(false);
      toast({ title: "Yeni çalışan başarıyla eklendi" });
    },
    onError: () => {
      toast({ title: "Çalışan eklenirken hata oluştu", variant: "destructive" });
    }
  });

  const handleEmployeeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const employeeData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      position: formData.get('position') as string,
      department: formData.get('department') as string,
      salary: parseFloat(formData.get('salary') as string),
      startDate: formData.get('startDate') as string,
      employeeId: `EMP_${Date.now()}`,
      status: 'active'
    };
    
    createEmployeeMutation.mutate(employeeData);
  };

  const roleLabels: Record<string, string> = {
    admin: "Admin",
    owner: "Patron", 
    hr_manager: "İK Müdürü",
    hr_specialist: "İK Uzmanı",
    department_manager: "Departman Müdürü",
    employee: "Çalışan"
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "default",
      rejected: "destructive",
      active: "default",
      inactive: "secondary"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Admin Kontrol Paneli
                </h1>
                <p className="text-gray-600 text-lg">
                  Kurumsal sistem yönetimi ve denetim merkezi
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70"
              onClick={() => createNotificationMutation.mutate({
                title: "Sistem Duyurusu",
                message: "Tüm kullanıcılara genel duyuru",
                type: "info"
              })}
            >
              <Zap className="h-4 w-4 mr-2" />
              Duyuru Gönder
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70"
              onClick={() => {
                const reportData = {
                  totalEmployees: stats.totalEmployees,
                  activeLeaves: stats.activeLeaves,
                  monthlyPayroll: stats.monthlyPayroll,
                  avgPerformance: stats.avgPerformance,
                  teamMembers: teamMembers.map(m => ({
                    name: `${m.firstName} ${m.lastName}`,
                    email: m.email,
                    role: m.role,
                    status: m.isActive ? 'Aktif' : 'Pasif'
                  })),
                  exportDate: new Date().toISOString()
                };
                
                const csvContent = [
                  'Ad,Email,Rol,Durum',
                  ...reportData.teamMembers.map(m => 
                    `${m.name},${m.email},${m.role},${m.status}`
                  )
                ].join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ik360-rapor-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
                toast({ title: "Sistem raporu indiriliyor..." });
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setIsEmployeeDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Yeni Kullanıcı
            </Button>
          </div>
        </div>

        {/* Enhanced Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Toplam Çalışan</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</div>
              <div className="flex items-center mt-2 space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-500">
                  Aktif: {teamMembers.filter(m => m.isActive).length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Bekleyen Onaylar</CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {pendingTimeEntries.length + pendingExpenses.length}
              </div>
              <div className="flex items-center mt-2 space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-gray-500">
                  Zaman: {pendingTimeEntries.length}, Harcama: {pendingExpenses.length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sistem Logları</CardTitle>
              <Activity className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{auditLogs.length}</div>
              <div className="flex items-center mt-2 space-x-2">
                <Monitor className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-500">
                  Son 24 saat
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Aylık Bordro</CardTitle>
              <DollarSign className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.monthlyPayroll}</div>
              <div className="flex items-center mt-2 space-x-2">
                <Award className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-500">
                  Ortalama performans: {stats.avgPerformance}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs Section */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg rounded-xl p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Building2 className="h-4 w-4 mr-2" />
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Users className="h-4 w-4 mr-2" />
              Ekip Yönetimi
            </TabsTrigger>
            <TabsTrigger value="approvals" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <CheckCircle className="h-4 w-4 mr-2" />
              Onaylar
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Shield className="h-4 w-4 mr-2" />
              Denetim Logları
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Bell className="h-4 w-4 mr-2" />
              Bildirimler
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analitik
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Enhanced Recent Activities */}
              <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Son Aktiviteler
                  </CardTitle>
                  <CardDescription>Sistem geneli son işlemler ve güncellemeler</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { 
                        icon: UserPlus, 
                        title: "Yeni çalışan kaydı", 
                        description: "Ahmet Yılmaz - Frontend Developer pozisyonuna atandı",
                        time: "2 saat önce",
                        color: "text-green-600"
                      },
                      { 
                        icon: CheckCircle, 
                        title: "İzin talebi onaylandı", 
                        description: "Zeynep Demir - 5 günlük yıllık izin onayı",
                        time: "4 saat önce",
                        color: "text-blue-600"
                      },
                      { 
                        icon: Award, 
                        title: "Performans değerlendirmesi", 
                        description: "Q1 2025 performans raporları tamamlandı",
                        time: "6 saat önce",
                        color: "text-purple-600"
                      },
                      { 
                        icon: FileText, 
                        title: "Bordro işlemleri", 
                        description: "Ocak 2025 bordro ödemeleri gerçekleştirildi",
                        time: "1 gün önce",
                        color: "text-indigo-600"
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
                        <div className={`p-2 rounded-lg bg-white shadow-sm ${activity.color}`}>
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                          <p className="text-xs text-slate-600">{activity.description}</p>
                          <p className="text-xs text-slate-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Quick Actions */}
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    Hızlı İşlemler
                  </CardTitle>
                  <CardDescription>Sık kullanılan yönetim fonksiyonları</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-3">
                    <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="justify-start h-12 hover:bg-blue-50 hover:border-blue-200"
                        >
                          <UserPlus className="h-4 w-4 mr-3 text-blue-600" />
                          <div className="text-left">
                            <div className="font-medium">Yeni Çalışan Ekle</div>
                            <div className="text-xs text-slate-500">Personel kaydı oluştur</div>
                          </div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Yeni Çalışan Ekle</DialogTitle>
                          <DialogDescription>
                            Yeni çalışan bilgilerini girin ve sisteme kaydedin
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEmployeeSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">Ad</Label>
                              <Input id="firstName" name="firstName" required />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Soyad</Label>
                              <Input id="lastName" name="lastName" required />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="email">E-posta</Label>
                            <Input id="email" name="email" type="email" required />
                          </div>
                          <div>
                            <Label htmlFor="phone">Telefon</Label>
                            <Input id="phone" name="phone" type="tel" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="position">Pozisyon</Label>
                              <Input id="position" name="position" required />
                            </div>
                            <div>
                              <Label htmlFor="department">Departman</Label>
                              <Select name="department" required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Departman seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="IT">Bilgi İşlem</SelectItem>
                                  <SelectItem value="HR">İnsan Kaynakları</SelectItem>
                                  <SelectItem value="Finance">Finans</SelectItem>
                                  <SelectItem value="Marketing">Pazarlama</SelectItem>
                                  <SelectItem value="Operations">Operasyon</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="salary">Maaş (TL)</Label>
                              <Input id="salary" name="salary" type="number" min="0" step="100" required />
                            </div>
                            <div>
                              <Label htmlFor="startDate">İşe Başlama Tarihi</Label>
                              <Input id="startDate" name="startDate" type="date" required />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>
                              İptal
                            </Button>
                            <Button type="submit" disabled={createEmployeeMutation.isPending}>
                              {createEmployeeMutation.isPending ? 'Ekleniyor...' : 'Çalışan Ekle'}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      className="justify-start h-12 hover:bg-green-50 hover:border-green-200"
                      onClick={() => {
                        // Export employee data
                        const csvData = teamMembers.map(member => 
                          `${member.firstName},${member.lastName},${member.email},${member.role}`
                        ).join('\n');
                        const blob = new Blob([csvData], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'calisanlar_raporu.csv';
                        a.click();
                        toast({ title: "Çalışan raporu indiriliyor..." });
                      }}
                    >
                      <FileText className="h-4 w-4 mr-3 text-green-600" />
                      <div className="text-left">
                        <div className="font-medium">Rapor İndir</div>
                        <div className="text-xs text-slate-500">CSV formatında dışa aktar</div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-12 hover:bg-purple-50 hover:border-purple-200"
                      onClick={() => {
                        setLocation("/settings");
                        toast({ title: "Sistem ayarları açılıyor..." });
                      }}
                    >
                      <Settings className="h-4 w-4 mr-3 text-purple-600" />
                      <div className="text-left">
                        <div className="font-medium">Sistem Ayarları</div>
                        <div className="text-xs text-slate-500">Yapılandırma seçenekleri</div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-12 hover:bg-indigo-50 hover:border-indigo-200"
                      onClick={() => {
                        createNotificationMutation.mutate({
                          title: "Veri Yedekleme",
                          message: "Sistem verileri yedekleme işlemi başlatıldı",
                          type: "info"
                        });
                        toast({ title: "Veri yedekleme işlemi başlatıldı..." });
                      }}
                    >
                      <Database className="h-4 w-4 mr-3 text-indigo-600" />
                      <div className="text-left">
                        <div className="font-medium">Veri Yedekleme</div>
                        <div className="text-xs text-slate-500">Güvenli yedekleme başlat</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Ekip Üyeleri Yönetimi
                </CardTitle>
                <CardDescription>Tüm kullanıcıların detaylı listesi ve yönetim araçları</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-semibold">Kullanıcı</TableHead>
                        <TableHead className="font-semibold">Rol</TableHead>
                        <TableHead className="font-semibold">Durum</TableHead>
                        <TableHead className="font-semibold">Son Giriş</TableHead>
                        <TableHead className="font-semibold">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => (
                        <TableRow key={member.id} className="hover:bg-slate-50/50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                                  {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-slate-900">{member.firstName} {member.lastName}</p>
                                <p className="text-sm text-slate-600">{member.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {roleLabels[member.role] || member.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {member.isActive ? (
                              <Badge className="bg-green-100 text-green-800 border-green-200">Aktif</Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Pasif</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {member.lastLoginAt ? 
                              new Date(member.lastLoginAt).toLocaleDateString('tr-TR') : 
                              'Hiçbir zaman'
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => toggleUserStatusMutation.mutate({
                                  userId: member.id,
                                  isActive: !member.isActive
                                })}
                              >
                                {member.isActive ? 
                                  <UserX className="h-4 w-4 text-red-600" /> : 
                                  <UserCheck className="h-4 w-4 text-green-600" />
                                }
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4 text-blue-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Bekleyen Zaman Kayıtları
                  </CardTitle>
                  <CardDescription>{pendingTimeEntries.length} kayıt onay bekliyor</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {pendingTimeEntries.length > 0 ? pendingTimeEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50/50 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {entry.user?.firstName} {entry.user?.lastName}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">{entry.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {entry.hours} saat
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(entry.date).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => approveTimeEntryMutation.mutate(entry.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-slate-500">
                        <Clock className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                        <p>Bekleyen zaman kaydı yok.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-green-600" />
                    Bekleyen Harcama Raporları
                  </CardTitle>
                  <CardDescription>{pendingExpenses.length} rapor onay bekliyor</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {pendingExpenses.length > 0 ? pendingExpenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50/50 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {expense.user?.firstName} {expense.user?.lastName}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">{expense.title}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                              ₺{expense.amount}
                            </span>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                              {expense.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => approveExpenseMutation.mutate(expense.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-slate-500">
                        <Briefcase className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                        <p>Bekleyen harcama raporu yok.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Denetim Logları
                </CardTitle>
                <CardDescription>Sistem aktiviteleri ve güvenlik olayları</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-semibold">Kullanıcı</TableHead>
                        <TableHead className="font-semibold">İşlem</TableHead>
                        <TableHead className="font-semibold">Kaynak</TableHead>
                        <TableHead className="font-semibold">IP Adresi</TableHead>
                        <TableHead className="font-semibold">Tarih</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.slice(0, 10).map((log) => (
                        <TableRow key={log.id} className="hover:bg-slate-50/50">
                          <TableCell>
                            {log.user ? (
                              <div>
                                <p className="font-medium text-slate-900">{log.user.firstName} {log.user.lastName}</p>
                                <p className="text-xs text-slate-600">{log.user.email}</p>
                              </div>
                            ) : (
                              <span className="text-slate-500 italic">Sistem</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">{log.resource}</TableCell>
                          <TableCell className="font-mono text-sm text-slate-600">{log.ipAddress || 'N/A'}</TableCell>
                          <TableCell className="text-slate-600">
                            {new Date(log.createdAt).toLocaleString('tr-TR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    Aktif Bildirimler
                  </CardTitle>
                  <CardDescription>Son sistem bildirimleri ve duyurular</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        title: "Sistem Güncellemesi",
                        message: "İK360 sistemi başarıyla v2.1.5 sürümüne güncellendi. Yeni özellikler aktif.",
                        type: "success",
                        createdAt: new Date(Date.now() - 3600000).toISOString(),
                        isRead: false
                      },
                      {
                        id: 2,
                        title: "Yedekleme Tamamlandı",
                        message: "Günlük veri yedekleme işlemi başarıyla tamamlandı. Tüm veriler güvende.",
                        type: "info",
                        createdAt: new Date(Date.now() - 7200000).toISOString(),
                        isRead: true
                      },
                      {
                        id: 3,
                        title: "Güvenlik Taraması",
                        message: "Otomatik güvenlik taraması tamamlandı. Herhangi bir tehdit bulunamadı.",
                        type: "success",
                        createdAt: new Date(Date.now() - 10800000).toISOString(),
                        isRead: true
                      },
                      {
                        id: 4,
                        title: "Performans Raporu",
                        message: "Ocak ayı performans raporları hazır. İnceleme için yöneticilere gönderildi.",
                        type: "info",
                        createdAt: new Date(Date.now() - 14400000).toISOString(),
                        isRead: false
                      }
                    ].map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50/50 transition-colors">
                        <div className={`p-2 rounded-lg ${notification.type === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
                          <Bell className={`h-4 w-4 ${notification.type === 'success' ? 'text-green-600' : 'text-blue-600'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-slate-900">{notification.title}</h4>
                            <Badge variant={notification.type === 'success' ? 'default' : 'outline'} className="text-xs">
                              {notification.type === 'success' ? 'Başarılı' : 'Bilgi'}
                            </Badge>
                            {!notification.isRead && <Badge className="bg-red-100 text-red-800 text-xs">Yeni</Badge>}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(notification.createdAt).toLocaleString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    Bildirim Yönetimi
                  </CardTitle>
                  <CardDescription>Sistem geneli bildirim araçları</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      <Button 
                        className="justify-start h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        onClick={() => createNotificationMutation.mutate({
                          title: "Sistem Duyurusu",
                          message: "Tüm kullanıcılara önemli sistem duyurusu gönderildi",
                          type: "info"
                        })}
                      >
                        <Zap className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Genel Duyuru Gönder</div>
                          <div className="text-xs opacity-90">Tüm kullanıcılara bildirim</div>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="justify-start h-12 hover:bg-amber-50 hover:border-amber-200"
                        onClick={() => createNotificationMutation.mutate({
                          title: "Acil Bilgilendirme",
                          message: "Sistem bakım çalışması hakkında acil bilgilendirme",
                          type: "warning"
                        })}
                      >
                        <AlertTriangle className="h-4 w-4 mr-3 text-amber-600" />
                        <div className="text-left">
                          <div className="font-medium">Acil Bildirim</div>
                          <div className="text-xs text-slate-500">Önemli uyarı mesajı</div>
                        </div>
                      </Button>

                      <Button 
                        variant="outline" 
                        className="justify-start h-12 hover:bg-green-50 hover:border-green-200"
                        onClick={() => createNotificationMutation.mutate({
                          title: "Başarı Bildirimi",
                          message: "Sistem işlemleri başarıyla tamamlandı",
                          type: "success"
                        })}
                      >
                        <CheckCircle className="h-4 w-4 mr-3 text-green-600" />
                        <div className="text-left">
                          <div className="font-medium">Başarı Mesajı</div>
                          <div className="text-xs text-slate-500">Pozitif geri bildirim</div>
                        </div>
                      </Button>
                    </div>

                    <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Bildirim İstatistikleri</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Bugün Gönderilen</p>
                          <p className="font-bold text-lg text-blue-600">23</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Okunma Oranı</p>
                          <p className="font-bold text-lg text-green-600">87%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Kullanıcı Aktivitesi
                  </CardTitle>
                  <CardDescription>Son 30 günlük aktivite özeti</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Aktif Kullanıcılar</span>
                      <span className="font-bold text-lg text-green-600">{teamMembers.filter(m => m.isActive).length}</span>
                    </div>
                    <Progress value={85} className="w-full h-3" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Haftalık Giriş Oranı</span>
                      <span className="font-bold text-lg text-blue-600">91%</span>
                    </div>
                    <Progress value={91} className="w-full h-3" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Sistem Kullanımı</span>
                      <span className="font-bold text-lg text-purple-600">96%</span>
                    </div>
                    <Progress value={96} className="w-full h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-indigo-600" />
                    Sistem Sağlığı
                  </CardTitle>
                  <CardDescription>Gerçek zamanlı sistem durumu</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-slate-700">Veritabanı</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Çevrimiçi</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-slate-700">API Yanıt</span>
                      </div>
                      <span className="font-semibold text-blue-600">89ms</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-slate-700">Uptime</span>
                      </div>
                      <span className="font-semibold text-purple-600">99.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-amber-600" />
                    Performans Metrikleri
                  </CardTitle>
                  <CardDescription>Sistem performans analizi</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-cyan-600" />
                        <span className="text-sm font-medium text-slate-700">Mobil Kullanım</span>
                      </div>
                      <span className="font-semibold text-cyan-600">34%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Masaüstü</span>
                      </div>
                      <span className="font-semibold text-slate-600">66%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-slate-700">Ortalama Seans</span>
                      </div>
                      <span className="font-semibold text-emerald-600">24dk</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-rose-600" />
                    Departman Bazlı Analiz
                  </CardTitle>
                  <CardDescription>Bölümsel performans değerlendirmesi</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { dept: "İnsan Kaynakları", users: 8, efficiency: 94, color: "bg-blue-500" },
                      { dept: "Bilgi İşlem", users: 12, efficiency: 89, color: "bg-green-500" },
                      { dept: "Muhasebe", users: 6, efficiency: 92, color: "bg-purple-500" },
                      { dept: "Pazarlama", users: 15, efficiency: 87, color: "bg-orange-500" },
                      { dept: "Satış", users: 20, efficiency: 91, color: "bg-cyan-500" }
                    ].map((dept, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                          <div>
                            <p className="font-medium text-slate-900">{dept.dept}</p>
                            <p className="text-xs text-slate-600">{dept.users} çalışan</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{dept.efficiency}%</p>
                          <p className="text-xs text-slate-500">verimlilik</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-violet-600" />
                    Zaman Analizi
                  </CardTitle>
                  <CardDescription>Çalışma saatleri ve verimlilik</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Bu Hafta Özeti</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Toplam Çalışma</p>
                          <p className="font-bold text-lg text-blue-600">1,847 saat</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Ortalama/Kişi</p>
                          <p className="font-bold text-lg text-green-600">38.2 saat</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Verimlilik Trendi</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Bu Ay</p>
                          <p className="font-bold text-lg text-green-600">↑ 12%</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Geçen Aya Göre</p>
                          <p className="font-bold text-lg text-emerald-600">+5.8%</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">İzin ve Devamsızlık</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Aktif İzinler</p>
                          <p className="font-bold text-lg text-purple-600">{stats.activeLeaves}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">İzin Oranı</p>
                          <p className="font-bold text-lg text-pink-600">2.1%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}