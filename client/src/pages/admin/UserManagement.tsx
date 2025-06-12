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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, Edit, Trash2, Building2, UserCheck, UserX, Download, Search, Filter, Mail, Phone } from "lucide-react";
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
    password: "",
    role: "",
    companyId: "",
    departmentId: "",
    phone: "",
    position: ""
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

  const createUserMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/users", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla oluşturuldu.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/users/${editingUser.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/users/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla silindi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      role: "",
      companyId: "",
      departmentId: "",
      phone: "",
      position: ""
    });
    setEditingUser(null);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      password: "",
      role: user.role || "",
      companyId: user.companyId?.toString() || "",
      departmentId: user.departmentId?.toString() || "",
      phone: user.phone || "",
      position: user.position || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
      role: formData.role,
      companyId: formData.companyId ? parseInt(formData.companyId) : null,
      departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
      phone: formData.phone,
      position: formData.position
    };

    if (editingUser) {
      updateUserMutation.mutate(userData);
    } else {
      createUserMutation.mutate(userData);
    }
  };

  const getCompanyName = (companyId: number) => {
    const company = Array.isArray(companies) ? companies.find((c: any) => c.id === companyId) : null;
    return company?.name || "Bilinmeyen Şirket";
  };

  const getDepartmentName = (departmentId: number) => {
    const department = Array.isArray(departments) ? departments.find((d: any) => d.id === departmentId) : null;
    return department?.name || "Atanmamış";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "İK Müdürü":
        return "bg-purple-100 text-purple-800";
      case "İK":
        return "bg-blue-100 text-blue-800";
      case "Departman Müdürü":
        return "bg-green-100 text-green-800";
      case "Çalışan":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter users based on search, role, and company
  const filteredUsers = Array.isArray(users) ? users.filter((user: any) => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesCompany = selectedCompany === "all" || user.companyId?.toString() === selectedCompany;
    return matchesSearch && matchesRole && matchesCompany;
  }) : [];

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
    <div className="flex-1 space-y-8 p-8 pt-6 bg-gray-50 dark:bg-gray-900">
      {/* Microsoft Fluent Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Kullanıcı Yönetimi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Sistem kullanıcılarını yönetin, roller atayın ve erişim kontrolü sağlayın
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
                <Plus className="mr-2 h-4 w-4" />
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
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {Array.isArray(users) ? users.length : 0}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Toplam Kullanıcı
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {Array.isArray(users) ? users.filter((u: any) => u.isActive).length : 0}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Aktif Kullanıcı
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-4">
              <UserX className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {Array.isArray(users) ? users.filter((u: any) => !u.isActive).length : 0}
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Pasif Kullanıcı
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-4">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {Array.isArray(companies) ? companies.length : 0}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Bağlı Şirket
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Kullanıcı ara..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Rol filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Roller</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="İK Müdürü">İK Müdürü</SelectItem>
              <SelectItem value="İK">İK</SelectItem>
              <SelectItem value="Departman Müdürü">Departman Müdürü</SelectItem>
              <SelectItem value="Çalışan">Çalışan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-48">
              <Building2 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Şirket filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Şirketler</SelectItem>
              {Array.isArray(companies) && companies.map((company: any) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Sırala
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrele
          </Button>
        </div>
      </div>

      {/* User Cards */}
      {filteredUsers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user: any) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profileImageUrl} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{user.firstName} {user.lastName}</CardTitle>
                      <CardDescription>{user.position || user.role}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Şirket:</span>
                    <span className="text-gray-900 dark:text-white">{getCompanyName(user.companyId)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Departman:</span>
                    <span className="text-gray-900 dark:text-white">{getDepartmentName(user.departmentId)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Durum:</span>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Henüz kullanıcı yok</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">İlk kullanıcınızı ekleyerek başlayın</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Kullanıcı Ekle
          </Button>
        </div>
      )}

      {/* Dialog for Creating/Editing User */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}</DialogTitle>
            <DialogDescription>
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
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingUser}
                  placeholder={editingUser ? "Değiştirmek için yeni şifre girin" : ""}
                />
              </div>
              <div>
                <Label htmlFor="position">Pozisyon</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rol seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="İK Müdürü">İK Müdürü</SelectItem>
                    <SelectItem value="İK">İK</SelectItem>
                    <SelectItem value="Departman Müdürü">Departman Müdürü</SelectItem>
                    <SelectItem value="Çalışan">Çalışan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="companyId">Şirket</Label>
                <Select value={formData.companyId} onValueChange={(value) => setFormData({...formData, companyId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Şirket seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(companies) && companies.map((company: any) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="departmentId">Departman</Label>
                <Select value={formData.departmentId} onValueChange={(value) => setFormData({...formData, departmentId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Departman seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(departments) && departments.map((department: any) => (
                      <SelectItem key={department.id} value={department.id.toString()}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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