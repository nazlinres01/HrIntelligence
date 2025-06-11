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
  Edit,
  Download
} from "lucide-react";
import { Link } from "wouter";

// Schemas for team management
const inviteUserSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  role: z.string().min(1, "Rol seçiniz"),
  phone: z.string().optional(),
});

export default function Dashboard() {
  const { toast } = useToast();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  // Form for inviting team members
  const inviteForm = useForm({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: "",
      phone: "",
    },
  });

  // Stats queries with proper error handling
  const { data: employeeStats } = useQuery({
    queryKey: ['/api/stats/dashboard'],
  });

  const stats = (employeeStats as any) || {
    totalEmployees: 0,
    newThisMonth: 0,
    activeLeaves: 0,
    monthlyPayroll: "0",
    avgPerformance: "0"
  };

  const { data: activities = [] } = useQuery({
    queryKey: ['/api/activities'],
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['/api/employees'],
  });

  // Team invite mutation
  const inviteUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/team/invite", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team/members"] });
      toast({
        title: "Davet gönderildi",
        description: "Ekip üyesi başarıyla davet edildi",
      });
      inviteForm.reset();
      setInviteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Davet gönderilirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const onInviteSubmit = (data: any) => {
    inviteUserMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="space-y-8 p-6">
        {/* Corporate Header Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                İK yönetim sistemi genel bakış
              </p>
            </div>
            <div className="flex space-x-3">
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ekip Üyesi Davet Et
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yeni Ekip Üyesi Davet Et</DialogTitle>
                    <DialogDescription>
                      Şirketinize yeni bir çalışan eklemek için bilgilerini girin.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...inviteForm}>
                    <form onSubmit={inviteForm.handleSubmit(onInviteSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={inviteForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ad</FormLabel>
                              <FormControl>
                                <Input placeholder="Ad" {...field} />
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
                                <Input placeholder="Soyad" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={inviteForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-posta</FormLabel>
                            <FormControl>
                              <Input placeholder="ornek@email.com" type="email" {...field} />
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
                                  <SelectValue placeholder="Rol seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="hr_manager">İK Müdürü</SelectItem>
                                <SelectItem value="hr_specialist">İK Uzmanı</SelectItem>
                                <SelectItem value="department_manager">Departman Müdürü</SelectItem>
                                <SelectItem value="employee">Çalışan</SelectItem>
                              </SelectContent>
                            </Select>
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
                              <Input placeholder="+90 555 123 45 67" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setInviteDialogOpen(false)}>
                          İptal
                        </Button>
                        <Button type="submit" disabled={inviteUserMutation.isPending}>
                          {inviteUserMutation.isPending ? "Gönderiliyor..." : "Davet Gönder"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <Button 
                size="sm"
                className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
              >
                <FileText className="h-4 w-4 mr-2" />
                Rapor Oluştur
              </Button>
            </div>
          </div>
        </div>

        {/* Corporate Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Toplam Çalışan</CardTitle>
              <Users className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalEmployees}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                +{stats.newThisMonth} bu ay
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Aktif İzinler</CardTitle>
              <Calendar className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeLeaves}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Devam eden izinler
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Aylık Bordro</CardTitle>
              <CreditCard className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">₺{stats.monthlyPayroll}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Bu ay ödemeler
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Ortalama Performans</CardTitle>
              <BarChart3 className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.avgPerformance}/5</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Genel performans skoru
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Activities */}
          <Card className="col-span-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">Son Aktiviteler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(activities) && (activities as any[]).slice(0, 5).map((activity: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-750">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {activity.description || `Aktivite ${index + 1}`}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : "Bugün"}
                      </p>
                    </div>
                  </div>
                ))}
                {(!activities || (activities as any[]).length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400">Henüz aktivite bulunmuyor</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/employees">
                <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                  <Users className="h-4 w-4 mr-2" />
                  Çalışan Yönetimi
                </Button>
              </Link>
              <Link href="/leaves">
                <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                  <Calendar className="h-4 w-4 mr-2" />
                  İzin Yönetimi
                </Button>
              </Link>
              <Link href="/performance">
                <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Performans Takibi
                </Button>
              </Link>
              <Link href="/payroll">
                <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Bordro İşlemleri
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750">
                  <FileText className="h-4 w-4 mr-2" />
                  Raporlar
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Employees */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-900 dark:text-slate-100">Son Eklenen Çalışanlar</CardTitle>
              <Link href="/employees">
                <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600">
                  Tümünü Görüntüle
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(employees) && (employees as any[]).slice(0, 5).map((employee: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={employee.profileImage} />
                      <AvatarFallback className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                        {employee.firstName?.[0]}{employee.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {employee.position} - {employee.department}
                      </p>
                    </div>
                  </div>
                  <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                    {employee.status === 'active' ? 'Aktif' : 'İzinli'}
                  </Badge>
                </div>
              ))}
              {(!employees || (employees as any[]).length === 0) && (
                <div className="text-center py-8">
                  <p className="text-slate-600 dark:text-slate-400">Henüz çalışan eklenmemiş</p>
                  <Link href="/employees">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      İlk Çalışanı Ekle
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}