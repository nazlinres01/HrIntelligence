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
            <Button variant="lightgray" className="border-gray-300 text-gray-700">
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
                  variant="lightgray"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Departman Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingDepartment ? "Departman Düzenle" : "Yeni Departman Oluştur"}
                  </DialogTitle>
                  <DialogDescription>
                    Departman bilgilerini girin ve yönetim hiyerarşisini belirleyin.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Departman Adı</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Örn: İnsan Kaynakları"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyId">Şirket</Label>
                      <Select value={formData.companyId} onValueChange={(value) => setFormData({ ...formData, companyId: value })}>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Departmanın görev ve sorumluluklarını açıklayın"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="managerId">Departman Müdürü</Label>
                      <Select value={formData.managerId} onValueChange={(value) => setFormData({ ...formData, managerId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Müdür seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Atanmamış</SelectItem>
                          {Array.isArray(employees) && employees.map((employee: any) => (
                            <SelectItem key={employee.id} value={employee.id.toString()}>
                              {employee.firstName} {employee.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Bütçe (TL)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="Örn: 500000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goals">Hedefler</Label>
                    <Textarea
                      id="goals"
                      value={formData.goals}
                      onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                      placeholder="Departmanın yıllık hedeflerini belirtin"
                      rows={3}
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="lightgray" onClick={() => setIsDialogOpen(false)}>
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
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {Array.isArray(departments) ? departments.length : 0}
                </div>
                <p className="text-sm text-blue-600 font-medium">
                  Toplam Departman
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {Array.isArray(employees) ? employees.length : 0}
                </div>
                <p className="text-sm text-green-600 font-medium">
                  Toplam Çalışan
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-yellow-100 rounded-full mr-4">
                <Building2 className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {Array.isArray(companies) ? companies.length : 0}
                </div>
                <p className="text-sm text-yellow-600 font-medium">
                  Aktif Şirket
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  ₺2.4M
                </div>
                <p className="text-sm text-purple-600 font-medium">
                  Toplam Bütçe
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Departman ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="w-full sm:w-48">
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
          </CardContent>
        </Card>

        {/* Departments List */}
        <div className="grid gap-4">
          {filteredDepartments.map((department: any) => (
            <Card key={department.id} className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                        <p className="text-sm text-gray-500">{getCompanyName(department.companyId)}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Müdür</p>
                        <p className="text-sm font-medium">{getManagerName(department.managerId)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bütçe</p>
                        <p className="text-sm font-medium">
                          {department.budget ? `₺${department.budget.toLocaleString()}` : "Belirtilmemiş"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Çalışan Sayısı</p>
                        <p className="text-sm font-medium">
                          {Array.isArray(employees) ? employees.filter((e: any) => e.departmentId === department.id).length : 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Durum</p>
                        <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                      </div>
                    </div>
                    {department.description && (
                      <p className="mt-3 text-sm text-gray-600">{department.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="lightgray"
                      size="sm"
                      onClick={() => handleEdit(department)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="lightgray"
                      size="sm"
                      onClick={() => handleDelete(department.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}