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
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Edit, Trash2, Shield, Mail, Phone, Building2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "employee",
    companyId: "",
    departmentId: "",
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

  const createUserMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/users", { method: "POST", body: data }),
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
    mutationFn: (data: any) => apiRequest(`/api/users/${editingUser.id}`, { method: "PUT", body: data }),
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
    mutationFn: (id: number) => apiRequest(`/api/users/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Başarılı", description: "Kullanıcı başarıyla silindi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Kullanıcı silinirken hata oluştu", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "employee",
      companyId: "",
      departmentId: "",
      isActive: true
    });
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "employee",
      companyId: user.companyId?.toString() || "",
      departmentId: user.departmentId?.toString() || "",
      isActive: user.isActive !== false
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      companyId: formData.companyId ? parseInt(formData.companyId) : null,
      departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
      isActive: formData.isActive
    };

    if (editingUser) {
      updateUserMutation.mutate(userData);
    } else {
      createUserMutation.mutate(userData);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: "Admin", variant: "destructive" },
      hr_manager: { label: "İK Müdürü", variant: "default" },
      hr_specialist: { label: "İK Uzmanı", variant: "secondary" },
      department_manager: { label: "Departman Müdürü", variant: "outline" },
      employee: { label: "Çalışan", variant: "secondary" }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, variant: "secondary" };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getCompanyName = (companyId: number) => {
    const company = companies.find((c: any) => c.id === companyId);
    return company?.name || "Atanmamış";
  };

  const getDepartmentName = (departmentId: number) => {
    const department = departments.find((d: any) => d.id === departmentId);
    return department?.name || "Atanmamış";
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Sistem kullanıcılarını yönetin ve düzenleyin</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setEditingUser(null); resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Kullanıcı
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
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
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="hr_manager">İK Müdürü</SelectItem>
                    <SelectItem value="hr_specialist">İK Uzmanı</SelectItem>
                    <SelectItem value="department_manager">Departman Müdürü</SelectItem>
                    <SelectItem value="employee">Çalışan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyId">Şirket</Label>
                  <Select value={formData.companyId} onValueChange={(value) => setFormData({...formData, companyId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Şirket seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Atanmamış</SelectItem>
                      {companies.map((company: any) => (
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
                      <SelectItem value="">Atanmamış</SelectItem>
                      {departments.map((department: any) => (
                        <SelectItem key={department.id} value={department.id.toString()}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">Aktif kullanıcı</Label>
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

      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Listesi</CardTitle>
          <CardDescription>Sistemdeki tüm kullanıcıları görüntüleyin ve yönetin</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Şirket</TableHead>
                <TableHead>Departman</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImageUrl} />
                        <AvatarFallback>
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Building2 className="h-4 w-4 mr-1 text-gray-400" />
                      {getCompanyName(user.companyId)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {getDepartmentName(user.departmentId)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteUserMutation.mutate(user.id)}
                        disabled={deleteUserMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {users.length === 0 && (
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
        </CardContent>
      </Card>
    </div>
  );
}