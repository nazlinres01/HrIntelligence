import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  TrendingUp,
  Target,
  Award,
  Search,
  Filter,
  MoreVertical,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Shield,
  Star,
  Zap,
  Database,
  Activity,
  Eye,
  BarChart3
} from "lucide-react";

export default function EnterpriseCompanyManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: companies, isLoading } = useQuery({
    queryKey: ["/api/companies"],
  });

  const { data: departments } = useQuery({
    queryKey: ["/api/departments"],
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  const createCompanyMutation = useMutation({
    mutationFn: async (companyData: any) => {
      return await apiRequest("POST", "/api/companies", companyData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Şirket Başarıyla Oluşturuldu",
        description: "Yeni şirket kurumsal yapıya başarıyla eklendi.",
      });
    },
    onError: () => {
      toast({
        title: "Şirket Oluşturma Hatası",
        description: "Şirket oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async ({ id, ...companyData }: any) => {
      return await apiRequest("PATCH", `/api/companies/${id}`, companyData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      setIsEditDialogOpen(false);
      setEditingCompany(null);
      toast({
        title: "Şirket Güncellendi",
        description: "Şirket bilgileri başarıyla güncellendi.",
      });
    },
    onError: () => {
      toast({
        title: "Güncelleme Hatası",
        description: "Şirket güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/companies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Şirket Silindi",
        description: "Şirket sistemden başarıyla kaldırıldı.",
      });
    },
    onError: () => {
      toast({
        title: "Silme Hatası",
        description: "Şirket silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const companyData = {
      name: formData.get("name") as string,
      industry: formData.get("industry") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      website: formData.get("website") as string,
      description: formData.get("description") as string,
      employeeCount: parseInt(formData.get("employeeCount") as string) || 0,
    };

    if (editingCompany) {
      updateCompanyMutation.mutate({ id: editingCompany.id, ...companyData });
    } else {
      createCompanyMutation.mutate(companyData);
    }
  };

  const handleEdit = (company: any) => {
    setEditingCompany(company);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bu şirketi silmek istediğinizden emin misiniz?")) {
      deleteCompanyMutation.mutate(id);
    }
  };

  const filteredCompanies = (companies as any[])?.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && company.isActive) ||
                         (statusFilter === "inactive" && !company.isActive);
    return matchesSearch && matchesStatus;
  }) || [];

  const getCompanyEmployeeCount = (companyId: number) => {
    return (employees as any[])?.filter(emp => emp.companyId === companyId).length || 0;
  };

  const getCompanyDepartmentCount = (companyId: number) => {
    return (departments as any[])?.filter(dept => dept.companyId === companyId).length || 0;
  };

  const companyStats = {
    total: filteredCompanies.length,
    active: filteredCompanies.filter(c => c.isActive !== false).length,
    totalEmployees: (employees as any[])?.length || 0,
    totalDepartments: (departments as any[])?.length || 0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800/50 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Enterprise Header */}
        <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-2xl p-8 text-gray-800 shadow-2xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">Kurumsal Organizasyon Yönetimi</h1>
                  <p className="text-gray-600 text-lg">Şirket Hiyerarşisi ve Organizasyonel Yapı Kontrolü</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-gray-700">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Kurumsal Yönetişim</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Merkezi Kayıt Sistemi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Gerçek Zamanlı Senkronizasyon</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">{companyStats.total}</div>
              <div className="text-gray-600">Toplam Şirket Sayısı</div>
              <div className="flex items-center justify-end space-x-1 mt-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700">Sistem Operasyonel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300 group hover:border-gray-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg group-hover:scale-110 transition-transform">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">+5%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">{companyStats.total}</div>
                <div className="text-sm text-gray-600">Toplam Şirket Sayısı</div>
                <div className="text-xs text-gray-500">Kurumsal ağdaki tüm şirketler</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {Math.round((companyStats.active / companyStats.total) * 100)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">{companyStats.active}</div>
                <div className="text-sm text-gray-400">Aktif Şirketler</div>
                <div className="text-xs text-gray-500">Operasyonel durumdaki şirketler</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">+12%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">{companyStats.totalEmployees}</div>
                <div className="text-sm text-gray-400">Toplam Çalışan</div>
                <div className="text-xs text-gray-500">Tüm şirketlerdeki personel</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Organized
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">{companyStats.totalDepartments}</div>
                <div className="text-sm text-gray-400">Toplam Departman</div>
                <div className="text-xs text-gray-500">Organizasyonel birimler</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enterprise Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Şirket ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 w-80"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-gray-800/50 border-gray-700 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Tüm Şirketler</SelectItem>
                <SelectItem value="active">Aktif Şirketler</SelectItem>
                <SelectItem value="inactive">Pasif Şirketler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Şirket Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Yeni Şirket Oluştur</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Kurumsal yapıya yeni bir şirket ekleyin
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Şirket Adı</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Şirket adını girin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry" className="text-white">Sektör</Label>
                    <Input
                      id="industry"
                      name="industry"
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Teknoloji, Finans, vb."
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address" className="text-white">Adres</Label>
                  <Textarea
                    id="address"
                    name="address"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Şirket adresi"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-white">Telefon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="+90 212 000 00 00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">E-posta</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="info@sirket.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website" className="text-white">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="www.sirket.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">Açıklama</Label>
                  <Textarea
                    id="description"
                    name="description"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Şirket hakkında kısa açıklama"
                  />
                </div>
                <div>
                  <Label htmlFor="employeeCount" className="text-white">Çalışan Sayısı</Label>
                  <Input
                    id="employeeCount"
                    name="employeeCount"
                    type="number"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="0"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={createCompanyMutation.isPending}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  >
                    {createCompanyMutation.isPending ? "Oluşturuluyor..." : "Şirket Oluştur"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company: any) => (
            <Card key={company.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white group-hover:text-emerald-400 transition-colors">
                        {company.name}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {company.industry || "Genel"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={company.isActive !== false ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                      {company.isActive !== false ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Çalışanlar</span>
                    </div>
                    <span className="text-white font-medium">{getCompanyEmployeeCount(company.id)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Target className="h-4 w-4" />
                      <span className="text-sm">Departmanlar</span>
                    </div>
                    <span className="text-white font-medium">{getCompanyDepartmentCount(company.id)}</span>
                  </div>

                  {company.address && (
                    <div className="flex items-start space-x-2 text-gray-400">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span className="text-xs flex-1">{company.address}</span>
                    </div>
                  )}

                  {company.email && (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span className="text-xs">{company.email}</span>
                    </div>
                  )}
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(company)}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(company.id)}
                      className="text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Detaylar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Şirket Düzenle</DialogTitle>
              <DialogDescription className="text-gray-400">
                Şirket bilgilerini güncelleyin
              </DialogDescription>
            </DialogHeader>
            {editingCompany && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name" className="text-white">Şirket Adı</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      defaultValue={editingCompany.name}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-industry" className="text-white">Sektör</Label>
                    <Input
                      id="edit-industry"
                      name="industry"
                      defaultValue={editingCompany.industry}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-address" className="text-white">Adres</Label>
                  <Textarea
                    id="edit-address"
                    name="address"
                    defaultValue={editingCompany.address}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-phone" className="text-white">Telefon</Label>
                    <Input
                      id="edit-phone"
                      name="phone"
                      defaultValue={editingCompany.phone}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email" className="text-white">E-posta</Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      defaultValue={editingCompany.email}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-website" className="text-white">Website</Label>
                    <Input
                      id="edit-website"
                      name="website"
                      defaultValue={editingCompany.website}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-description" className="text-white">Açıklama</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editingCompany.description}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setEditingCompany(null);
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateCompanyMutation.isPending}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  >
                    {updateCompanyMutation.isPending ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}