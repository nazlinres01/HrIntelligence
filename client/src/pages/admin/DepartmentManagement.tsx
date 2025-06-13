import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, Edit, Trash2, Users, DollarSign, Building2, User, Download, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DepartmentManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    companyId: "",
    managerId: "",
    budget: "",
    goals: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ["/api/departments"],
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["/api/companies"],
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"],
  });

  const createDepartmentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/departments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "Departman başarıyla oluşturuldu.",
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

  const updateDepartmentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/departments/${editingDepartment.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "Departman başarıyla güncellendi.",
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

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/departments/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      toast({
        title: "Başarılı",
        description: "Departman başarıyla silindi.",
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
      name: "",
      description: "",
      companyId: "",
      managerId: "",
      budget: "",
      goals: ""
    });
    setEditingDepartment(null);
  };

  const handleEdit = (department: any) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name || "",
      description: department.description || "",
      companyId: department.companyId?.toString() || "",
      managerId: department.managerId?.toString() || "",
      budget: department.budget?.toString() || "",
      goals: department.goals || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bu departmanı silmek istediğinizden emin misiniz?")) {
      deleteDepartmentMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const departmentData = {
      name: formData.name,
      description: formData.description,
      companyId: parseInt(formData.companyId),
      managerId: formData.managerId ? parseInt(formData.managerId) : null,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      goals: formData.goals
    };

    if (editingDepartment) {
      updateDepartmentMutation.mutate(departmentData);
    } else {
      createDepartmentMutation.mutate(departmentData);
    }
  };

  const getCompanyName = (companyId: number) => {
    const company = Array.isArray(companies) ? companies.find((c: any) => c.id === companyId) : null;
    return company?.name || "Bilinmeyen Şirket";
  };

  const getManagerName = (managerId: number) => {
    const manager = Array.isArray(employees) ? employees.find((e: any) => e.id === managerId) : null;
    return manager ? `${manager.firstName} ${manager.lastName}` : "Atanmamış";
  };

  // Filter departments based on search and company
  const filteredDepartments = Array.isArray(departments) ? departments.filter((department: any) => {
    const matchesSearch = department.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompany === "all" || department.companyId?.toString() === selectedCompany;
    return matchesSearch && matchesCompany;
  }) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="h-16 bg-white/80 rounded-xl shadow-sm animate-pulse border border-gray-200"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Departman Yönetimi</h1>
            <p className="text-gray-600 text-lg">Departmanları Yönetin, Organize Edin ve Yapısal Hiyerarşiyi Düzenleyin</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-300 text-gray-700">
              <Download className="mr-2 h-4 w-4" />
              Dışa Aktar
            </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingDepartment(null);
                  resetForm();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Yeni Departman Ekle
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
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {Array.isArray(departments) ? departments.length : 0}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Toplam Departman
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {Array.isArray(employees) ? employees.length : 0}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Toplam Çalışan
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
                Aktif Şirket
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ₺2.4M
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Toplam Bütçe
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
              placeholder="Departman ara..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
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

      {/* Department Cards */}
      {filteredDepartments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.map((department: any) => (
            <Card key={department.id} className="hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{department.name}</CardTitle>
                      <CardDescription>{getCompanyName(department.companyId)}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {department.employeeCount || 0} çalışan
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Müdür:</span>
                    <span className="text-gray-900 dark:text-white">{getManagerName(department.managerId)}</span>
                  </div>
                  {department.budget && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Bütçe:</span>
                      <span className="text-gray-900 dark:text-white">₺{department.budget?.toLocaleString()}</span>
                    </div>
                  )}
                  {department.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {department.description}
                    </p>
                  )}
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(department)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(department.id)}
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
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Henüz departman yok</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">İlk departmanınızı ekleyerek başlayın</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Departman Ekle
          </Button>
        </div>
      )}

      {/* Dialog for Creating/Editing Department */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingDepartment ? "Departman Düzenle" : "Yeni Departman Ekle"}</DialogTitle>
            <DialogDescription>
              Departman bilgilerini doldurun ve kaydedin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Departman Adı</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
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
            </div>
            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Departman açıklaması..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="managerId">Departman Müdürü</Label>
                <Select value={formData.managerId} onValueChange={(value) => setFormData({...formData, managerId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Müdür seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(employees) && employees.map((employee: any) => (
                      <SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget">Bütçe (TRY)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="goals">Hedefler (virgülle ayırın)</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => setFormData({...formData, goals: e.target.value})}
                placeholder="Satış artışı, Müşteri memnuniyeti, Kalite iyileştirme"
                rows={2}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={createDepartmentMutation.isPending || updateDepartmentMutation.isPending}>
                {editingDepartment ? "Güncelle" : "Oluştur"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}