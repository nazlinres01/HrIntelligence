import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Users, Plus, Edit, Trash2, Mail, Phone, Building2, Shield, Search, Filter, Download, UserPlus, Crown, Settings, Eye, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "employee",
    companyId: "",
    password: "",
    isActive: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/users"],
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["/api/companies"],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"],
  });

  // Filter users based on search and filters
  const filteredUsers = (users as any[]).filter((user: any) => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesCompany = selectedCompany === "all" || user.companyId?.toString() === selectedCompany;
    
    return matchesSearch && matchesRole && matchesCompany;
  });

  // Get unique roles for filters
  const roles = [...new Set((users as any[]).map((u: any) => u.role).filter(Boolean))];

  const createUserMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/users", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Başarılı", description: "Kullanıcı başarıyla oluşturuldu" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Kullanıcı oluşturulurken hata oluştu", variant: "destructive" });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/users/${editingUser?.id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsDialogOpen(false);
      resetForm();
      setEditingUser(null);
      toast({ title: "Başarılı", description: "Kullanıcı başarıyla güncellendi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Kullanıcı güncellenirken hata oluştu", variant: "destructive" });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/users/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Başarılı", description: "Kullanıcı başarıyla silindi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Kullanıcı silinirken hata oluştu", variant: "destructive" });
    }
  });

  const toggleUserStatus = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      apiRequest(`/api/users/${id}`, "PUT", { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Başarılı", description: "Kullanıcı durumu güncellendi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Kullanıcı durumu güncellenirken hata oluştu", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "employee",
      companyId: "",
      password: "",
      isActive: true
    });
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      role: user.role || "employee",
      companyId: user.companyId?.toString() || "",
      password: "",
      isActive: user.isActive ?? true
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = {
      email: formData.email.toLowerCase(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      role: formData.role,
      companyId: formData.companyId ? parseInt(formData.companyId) : null,
      isActive: formData.isActive,
      ...(formData.password && { password: formData.password })
    };

    if (editingUser) {
      updateUserMutation.mutate(userData);
    } else {
      createUserMutation.mutate({ ...userData, password: formData.password });
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: "Sistem Yöneticisi",
      hr_manager: "İK Müdürü",
      hr_specialist: "İK Uzmanı",
      department_manager: "Departman Müdürü",
      employee: "Çalışan"
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleBadgeVariant = (role: string) => {
    const variants = {
      admin: "destructive",
      hr_manager: "default",
      hr_specialist: "secondary",
      department_manager: "outline",
      employee: "secondary"
    };
    return variants[role as keyof typeof variants] || "secondary";
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return Crown;
      case "hr_manager": return Shield;
      case "hr_specialist": return Users;
      case "department_manager": return Building2;
      default: return Users;
    }
  };

  const getCompanyName = (companyId: number) => {
    const company = (companies as any[]).find(c => c.id === companyId);
    return company?.name || "Bilinmeyen Şirket";
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Microsoft Fluent Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Kullanıcı Yönetimi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Sistem kullanıcılarını yönetin, roller atayın ve yetkileri düzenleyin
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
            <Download className="mr-2 h-4 w-4" />
            Dışa Aktar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingUser(null);
                  resetForm();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Yeni Kullanıcı Ekle
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{(users as any[]).length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aktif Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(users as any[]).filter((u: any) => u.isActive).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-4">
              <Crown className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Yönetici</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(users as any[]).filter((u: any) => ['admin', 'hr_manager'].includes(u.role)).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-4">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Son 7 Gün</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(users as any[]).filter((u: any) => {
                  const lastLogin = new Date(u.lastLoginAt || 0);
                  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                  return lastLogin > weekAgo;
                }).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Kullanıcı adı, e-posta ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Rol filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Roller</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>{getRoleLabel(role)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="w-48">
                  <Building2 className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Şirket filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Şirketler</SelectItem>
                  {(companies as any[]).map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Kullanıcı bulunamadı
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Arama kriterlerinize uygun kullanıcı bulunmadı. Filtrelerinizi kontrol edin veya yeni kullanıcı ekleyin.
              </p>
              <Button onClick={() => {
                setEditingUser(null);
                resetForm();
                setIsDialogOpen(true);
              }}>
                <UserPlus className="mr-2 h-4 w-4" />
                İlk Kullanıcıyı Ekle
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user: any) => {
            const RoleIcon = getRoleIcon(user.role);
            return (
              <Card key={user.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          {user.email}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getRoleBadgeVariant(user.role) as any} className="flex items-center space-x-1">
                        <RoleIcon className="h-3 w-3" />
                        <span>{getRoleLabel(user.role)}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="h-4 w-4 mr-2" />
                          {user.phone}
                        </div>
                      )}
                      {user.companyId && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Building2 className="h-4 w-4 mr-2" />
                          {getCompanyName(user.companyId)}
                        </div>
                      )}
                      {user.lastLoginAt && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-2" />
                          Son giriş: {new Date(user.lastLoginAt).toLocaleDateString('tr-TR')}
                        </div>
                      )}
                    </div>

                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.isActive}
                          onCheckedChange={(checked) => 
                            toggleUserStatus.mutate({ id: user.id, isActive: checked })
                          }
                          disabled={toggleUserStatus.isPending}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {user.isActive ? "Aktif" : "Pasif"}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(user)} className="border-gray-200 hover:bg-gray-50 dark:border-gray-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => deleteUserMutation.mutate(user.id)}
                          disabled={deleteUserMutation.isPending || user.role === 'admin'}
                          className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* User Creation/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {editingUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Kullanıcı bilgilerini doldurun ve kaydedin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Ad</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Soyad</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Sistem Yöneticisi</SelectItem>
                    <SelectItem value="hr_manager">İK Müdürü</SelectItem>
                    <SelectItem value="hr_specialist">İK Uzmanı</SelectItem>
                    <SelectItem value="department_manager">Departman Müdürü</SelectItem>
                    <SelectItem value="employee">Çalışan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="companyId">Şirket</Label>
              <Select value={formData.companyId} onValueChange={(value) => setFormData({...formData, companyId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Şirket seçin" />
                </SelectTrigger>
                <SelectContent>
                  {(companies as any[]).map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!editingUser && (
              <div>
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingUser}
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label>Aktif kullanıcı</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={createUserMutation.isPending || updateUserMutation.isPending}>
                {editingUser ? "Güncelle" : "Oluştur"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}