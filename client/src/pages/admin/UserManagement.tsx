import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Shield,
  UserPlus,
  Settings,
  FileText,
  Eye,
  Edit,
  Trash2,
  Key,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const userSchema = z.object({
  firstName: z.string().min(1, "Ad belirtilmelidir"),
  lastName: z.string().min(1, "Soyad belirtilmelidir"),
  email: z.string().email("Geçerli bir email adresi belirtilmelidir"),
  role: z.string().min(1, "Rol seçilmelidir"),
  department: z.string().optional(),
  position: z.string().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().default(true)
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: usersLoading } = useQuery<any[]>({
    queryKey: ["/api/users"]
  });

  const { data: departments = [] } = useQuery<any[]>({
    queryKey: ["/api/departments"]
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      department: "",
      position: "",
      phone: "",
      isActive: true
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      return apiRequest("POST", "/api/users", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsUserDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla oluşturuldu",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Kullanıcı oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla silindi",
      });
    }
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return apiRequest("PATCH", `/api/users/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Başarılı",
        description: "Kullanıcı durumu güncellendi",
      });
    }
  });

  // Filter users
  const filteredUsers = React.useMemo(() => {
    return (users as any[]).filter((user: any) => {
      const matchesSearch = user.firstName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           user.lastName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase()?.includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "active" && user.isActive) ||
                           (statusFilter === "inactive" && !user.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleSubmit = (data: UserFormData) => {
    createUserMutation.mutate(data);
  };

  const getUserStats = () => {
    const totalUsers = (users as any[]).length;
    const activeUsers = (users as any[]).filter((u: any) => u.isActive).length;
    const adminUsers = (users as any[]).filter((u: any) => u.role === 'admin').length;
    const employeeUsers = (users as any[]).filter((u: any) => u.role === 'employee').length;
    
    return { totalUsers, activeUsers, adminUsers, employeeUsers };
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'admin': 'Sistem Yöneticisi',
      'hr_manager': 'İK Müdürü',
      'hr': 'İK Uzmanı',
      'department_manager': 'Departman Müdürü',
      'employee': 'Çalışan'
    };
    return roleMap[role] || role;
  };

  const stats = getUserStats();

  if (usersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="h-16 bg-white/80 rounded-xl shadow-sm animate-pulse border border-gray-200"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white/80 rounded-xl shadow-sm animate-pulse border border-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Kullanıcı Yönetimi</h1>
            <p className="text-gray-600 text-lg">Sistem Kullanıcıları, Roller ve Yetkilendirme Kontrolü</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-300 text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Kullanıcı
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl bg-white">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Yeni Kullanıcı</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Ad</FormLabel>
                            <FormControl>
                              <Input placeholder="Ahmet" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Soyad</FormLabel>
                            <FormControl>
                              <Input placeholder="Yılmaz" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">E-posta</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="ahmet.yilmaz@sirket.com" {...field} className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Rol</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Rol seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white">
                                <SelectItem value="admin">Sistem Yöneticisi</SelectItem>
                                <SelectItem value="hr_manager">İK Müdürü</SelectItem>
                                <SelectItem value="hr">İK Uzmanı</SelectItem>
                                <SelectItem value="department_manager">Departman Müdürü</SelectItem>
                                <SelectItem value="employee">Çalışan</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Departman</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Departman seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white">
                                <SelectItem value="">Seçiniz</SelectItem>
                                {(departments as any[]).map((dept: any) => (
                                  <SelectItem key={dept.id} value={dept.name}>
                                    {dept.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Pozisyon</FormLabel>
                            <FormControl>
                              <Input placeholder="Software Developer" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Telefon</FormLabel>
                            <FormControl>
                              <Input placeholder="+90 555 123 45 67" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-300 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-gray-700">Aktif Kullanıcı</FormLabel>
                            <div className="text-sm text-gray-600">
                              Kullanıcının sisteme giriş yapabilmesini sağlar
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsUserDialogOpen(false)}
                        className="border-gray-300 text-gray-700"
                      >
                        İptal
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createUserMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {createUserMutation.isPending ? "Oluşturuluyor..." : "Kullanıcı Oluştur"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Toplam Kullanıcı</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Aktif Kullanıcı</p>
                  <p className="text-3xl font-bold text-green-900">{stats.activeUsers}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Yönetici</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.adminUsers}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Çalışan</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.employeeUsers}</p>
                </div>
                <UserPlus className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Kullanıcı ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Rol filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Roller</SelectItem>
              <SelectItem value="admin">Sistem Yöneticisi</SelectItem>
              <SelectItem value="hr_manager">İK Müdürü</SelectItem>
              <SelectItem value="hr">İK Uzmanı</SelectItem>
              <SelectItem value="department_manager">Departman Müdürü</SelectItem>
              <SelectItem value="employee">Çalışan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Durum filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Pasif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Kullanıcılar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-sm font-medium text-gray-600">Kullanıcı</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">E-posta</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Rol</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Departman</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Durum</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Son Giriş</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-600">{user.position}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge 
                          className={
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'hr_manager' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'hr' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'department_manager' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {getRoleDisplayName(user.role)}
                        </Badge>
                      </td>
                      <td className="py-4 text-gray-700">
                        {user.department || "-"}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {user.isActive ? 'Aktif' : 'Pasif'}
                          </Badge>
                          <Switch 
                            checked={user.isActive}
                            onCheckedChange={(checked) => 
                              toggleUserStatusMutation.mutate({ id: user.id, isActive: checked })
                            }
                          />
                        </div>
                      </td>
                      <td className="py-4 text-gray-700">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('tr-TR') : '-'}
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50">
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => deleteUserMutation.mutate(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Kullanıcı bulunamadı</h3>
                <p className="text-gray-600">
                  {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                    ? "Arama kriterlerinize uygun kullanıcı bulunamadı."
                    : "Henüz hiç kullanıcı oluşturulmamış. İlk kullanıcınızı oluşturmak için yukarıdaki butonu kullanın."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}