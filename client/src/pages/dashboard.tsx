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
  role: z.enum(["admin", "hr_manager", "hr_specialist", "department_manager", "employee"])
});

const editUserSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  role: z.enum(["admin", "hr_manager", "hr_specialist", "department_manager", "employee"])
});

type InviteUserData = z.infer<typeof inviteUserSchema>;
type EditUserData = z.infer<typeof editUserSchema>;

export default function Dashboard() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { toast } = useToast();

  // Enhanced form configurations
  const inviteForm = useForm<InviteUserData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: "employee"
    }
  });

  const editForm = useForm<EditUserData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "employee"
    }
  });

  // Corporate data queries
  const { data: employeeStats } = useQuery({
    queryKey: ['/api/stats/employees'],
  });

  const { data: teamMembers } = useQuery({
    queryKey: ['/api/team/members'],
  });

  const { data: teamStats } = useQuery({
    queryKey: ['/api/team/stats'],
  });

  const { data: activities } = useQuery({
    queryKey: ['/api/activities'],
  });

  // Corporate mutations
  const inviteUserMutation = useMutation({
    mutationFn: async (data: InviteUserData) => {
      return apiRequest('/api/team/invite', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: "Davet Gönderildi",
        description: "Kullanıcı daveti başarıyla gönderildi.",
      });
      setInviteDialogOpen(false);
      inviteForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team/stats'] });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Davet gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: EditUserData & { id: string }) => {
      return apiRequest(`/api/team/members/${data.id}`, 'PATCH', data);
    },
    onSuccess: () => {
      toast({
        title: "Güncellendi",
        description: "Kullanıcı bilgileri başarıyla güncellendi.",
      });
      setEditDialogOpen(false);
      editForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Güncelleme sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      return apiRequest(`/api/team/members/${userId}/status`, 'PATCH', { isActive });
    },
    onSuccess: () => {
      toast({
        title: "Durum Güncellendi",
        description: "Kullanıcı durumu başarıyla güncellendi.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Durum güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });

  const handleInviteUser = (data: InviteUserData) => {
    inviteUserMutation.mutate(data);
  };

  const handleEditUser = (data: EditUserData) => {
    if (selectedUser) {
      updateUserMutation.mutate({ ...data, id: selectedUser.id });
    }
  };

  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    editForm.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
    setEditDialogOpen(true);
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      "admin": "Sistem Yöneticisi",
      "hr_manager": "İK Müdürü",
      "hr_specialist": "İK Uzmanı", 
      "department_manager": "Departman Müdürü",
      "employee": "Çalışan"
    };
    return roleMap[role] || role;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="p-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Corporate Header */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Operasyon Paneli
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-1">
                  Merkezi yönetim ve kontrol sistemi
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600">
                  <Download className="h-4 w-4 mr-2" />
                  Rapor İndir
                </Button>
                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Kullanıcı
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Yeni Kullanıcı Davet Et</DialogTitle>
                      <DialogDescription>
                        Takımınıza yeni bir üye ekleyin.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...inviteForm}>
                      <form onSubmit={inviteForm.handleSubmit(handleInviteUser)} className="space-y-4">
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
                                <Input placeholder="ornek@sirket.com" {...field} />
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
                                  <SelectItem value="employee">Çalışan</SelectItem>
                                  <SelectItem value="department_manager">Departman Müdürü</SelectItem>
                                  <SelectItem value="hr_specialist">İK Uzmanı</SelectItem>
                                  <SelectItem value="hr_manager">İK Müdürü</SelectItem>
                                  <SelectItem value="admin">Sistem Yöneticisi</SelectItem>
                                </SelectContent>
                              </Select>
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
              </div>
            </div>
          </div>

          {/* Corporate Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Toplam Çalışan</CardTitle>
                <Users className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{employeeStats?.totalEmployees || 0}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  +{employeeStats?.newThisMonth || 0} bu ay
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Aktif İzinler</CardTitle>
                <Calendar className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{employeeStats?.activeLeaves || 0}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Devam eden izinler
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Aylık Bordro</CardTitle>
                <DollarSign className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">₺{employeeStats?.monthlyPayroll || "0"}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Toplam maliyet
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Ortalama Performans</CardTitle>
                <BarChart3 className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{employeeStats?.avgPerformance || "0"}%</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Genel başarı oranı
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Corporate Team Overview and Activities */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Takım Üyeleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers?.slice(0, 8).map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-750">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                            {member.firstName?.[0]}{member.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {getRoleDisplayName(member.role)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={member.isActive ? "default" : "secondary"} className="text-xs">
                          {member.isActive ? "Aktif" : "Pasif"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(member)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleUserStatusMutation.mutate({ 
                            userId: member.id, 
                            isActive: !member.isActive 
                          })}
                          className="h-8 w-8 p-0"
                        >
                          {member.isActive ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-6">
                      <Users className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600 dark:text-slate-300">Henüz takım üyesi yok</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Son Aktiviteler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities?.slice(0, 6).map((activity: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 text-sm">
                      <div className="mt-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 dark:text-white">{activity.description}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {new Date(activity.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-6">
                      <Clock className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600 dark:text-slate-300">Henüz aktivite yok</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Corporate Quick Links */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/employees">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                      <Users className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Çalışanlar</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Personel yönetimi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/leaves">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                      <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">İzinler</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">İzin yönetimi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/payroll">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                      <CreditCard className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Bordro</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Maaş yönetimi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/performance">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                      <BarChart3 className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Performans</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Değerlendirme</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Kullanıcı Düzenle</DialogTitle>
            <DialogDescription>
              Kullanıcı bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditUser)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
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
                  control={editForm.control}
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
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input placeholder="ornek@sirket.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Rol seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="employee">Çalışan</SelectItem>
                        <SelectItem value="department_manager">Departman Müdürü</SelectItem>
                        <SelectItem value="hr_specialist">İK Uzmanı</SelectItem>
                        <SelectItem value="hr_manager">İK Müdürü</SelectItem>
                        <SelectItem value="admin">Sistem Yöneticisi</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={updateUserMutation.isPending}>
                  {updateUserMutation.isPending ? "Güncelleniyor..." : "Güncelle"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}