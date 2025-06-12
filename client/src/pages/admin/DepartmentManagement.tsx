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
import { Target, Plus, Edit, Trash2, Users, DollarSign, Building2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DepartmentManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
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
    mutationFn: (data: any) => apiRequest("/api/departments", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Başarılı", description: "Departman başarıyla oluşturuldu" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Departman oluşturulurken hata oluştu", variant: "destructive" });
    }
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/departments/${editingDepartment.id}`, { method: "PUT", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      setIsDialogOpen(false);
      resetForm();
      setEditingDepartment(null);
      toast({ title: "Başarılı", description: "Departman başarıyla güncellendi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Departman güncellenirken hata oluştu", variant: "destructive" });
    }
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/departments/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      toast({ title: "Başarılı", description: "Departman başarıyla silindi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Departman silinirken hata oluştu", variant: "destructive" });
    }
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
  };

  const handleEdit = (department: any) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name || "",
      description: department.description || "",
      companyId: department.companyId?.toString() || "",
      managerId: department.managerId?.toString() || "",
      budget: department.budget?.toString() || "",
      goals: department.goals?.join(", ") || ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const departmentData = {
      name: formData.name,
      description: formData.description,
      companyId: parseInt(formData.companyId),
      managerId: formData.managerId ? parseInt(formData.managerId) : null,
      budget: formData.budget ? parseFloat(formData.budget) : 0,
      goals: formData.goals.split(",").map(g => g.trim()).filter(g => g)
    };

    if (editingDepartment) {
      updateDepartmentMutation.mutate(departmentData);
    } else {
      createDepartmentMutation.mutate(departmentData);
    }
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(budget);
  };

  const getCompanyName = (companyId: number) => {
    const company = companies.find((c: any) => c.id === companyId);
    return company?.name || "Bilinmeyen Şirket";
  };

  const getManagerName = (managerId: number) => {
    const manager = employees.find((e: any) => e.id === managerId);
    return manager ? `${manager.firstName} ${manager.lastName}` : "Atanmamış";
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
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Departman Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Departmanları yönetin ve organize edin</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setEditingDepartment(null); resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Departman
            </Button>
          </DialogTrigger>
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
                      {companies.map((company: any) => (
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
                      <SelectItem value="">Atanmamış</SelectItem>
                      {employees.map((employee: any) => (
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department: any) => (
          <Card key={department.id} className="hover:shadow-lg transition-shadow duration-200">
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
                {department.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {department.description}
                  </p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <User className="h-4 w-4 mr-2" />
                      Müdür
                    </div>
                    <span className="font-medium">{getManagerName(department.managerId)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Bütçe
                    </div>
                    <span className="font-medium">{formatBudget(department.budget || 0)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-2" />
                      Çalışan
                    </div>
                    <span className="font-medium">{department.employeeCount || 0} kişi</span>
                  </div>
                </div>

                {department.goals && department.goals.length > 0 && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Hedefler:</p>
                    <div className="flex flex-wrap gap-1">
                      {department.goals.slice(0, 3).map((goal: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                      {department.goals.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{department.goals.length - 3} daha
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Oluşturulma: {new Date(department.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(department)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deleteDepartmentMutation.mutate(department.id)}
                      disabled={deleteDepartmentMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {departments.length === 0 && (
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
    </div>
  );
}