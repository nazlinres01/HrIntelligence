import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Users,
  TrendingUp,
  UserPlus,
  Settings,
  FileText,
  Eye,
  Edit,
  Trash2,
  Target,
  BarChart3,
  PieChart,
  DollarSign,
  Calendar
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const departmentSchema = z.object({
  name: z.string().min(1, "Departman adı belirtilmelidir"),
  description: z.string().optional(),
  manager: z.string().min(1, "Departman müdürü seçilmelidir"),
  budget: z.string().optional(),
  location: z.string().optional(),
  parentDepartment: z.string().optional()
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

export default function DepartmentControl() {
  const [searchTerm, setSearchTerm] = useState("");
  const [managerFilter, setManagerFilter] = useState("all");
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments = [], isLoading: departmentsLoading } = useQuery({
    queryKey: ["/api/departments"]
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"]
  });

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      description: "",
      manager: "",
      budget: "",
      location: "",
      parentDepartment: ""
    }
  });

  const createDepartmentMutation = useMutation({
    mutationFn: async (data: DepartmentFormData) => {
      return apiRequest("/api/departments", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      setIsDepartmentDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Departman başarıyla oluşturuldu",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Departman oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/departments/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
      toast({
        title: "Başarılı",
        description: "Departman başarıyla silindi",
      });
    }
  });

  // Filter departments
  const filteredDepartments = React.useMemo(() => {
    return departments.filter((dept: any) => {
      const matchesSearch = dept.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           dept.description?.toLowerCase()?.includes(searchTerm.toLowerCase());
      const matchesManager = managerFilter === "all" || dept.manager === managerFilter;
      return matchesSearch && matchesManager;
    });
  }, [departments, searchTerm, managerFilter]);

  const handleSubmit = (data: DepartmentFormData) => {
    createDepartmentMutation.mutate(data);
  };

  const getDepartmentStats = () => {
    const totalDepartments = departments.length;
    const totalEmployees = employees.length;
    const avgEmployeesPerDept = departments.length > 0 ? Math.round(employees.length / departments.length) : 0;
    const departmentsWithBudget = departments.filter((d: any) => d.budget && parseFloat(d.budget) > 0).length;
    
    return { totalDepartments, totalEmployees, avgEmployeesPerDept, departmentsWithBudget };
  };

  const getEmployeesByDepartment = (departmentId: string) => {
    return employees.filter((emp: any) => emp.departmentId === departmentId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const stats = getDepartmentStats();

  if (departmentsLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Departman Kontrolü</h1>
            <p className="text-gray-600">Departman yapısı, bütçe ve personel yönetimi</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-300 text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
            <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Departman
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl bg-white">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Yeni Departman</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Departman Adı</FormLabel>
                            <FormControl>
                              <Input placeholder="Yazılım Geliştirme" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="manager"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Departman Müdürü</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Müdür seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white">
                                {employees.map((employee: any) => (
                                  <SelectItem key={employee.id} value={employee.id}>
                                    {employee.firstName} {employee.lastName}
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
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Yıllık Bütçe (TL)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="5000000" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Lokasyon</FormLabel>
                            <FormControl>
                              <Input placeholder="3. Kat, A Blok" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="parentDepartment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Ana Departman</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="Ana departman seçin (opsiyonel)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              <SelectItem value="">Hiçbiri</SelectItem>
                              {departments.map((dept: any) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Açıklama</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Departman görev ve sorumlulukları..." 
                              {...field} 
                              className="border-gray-300 min-h-24" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDepartmentDialogOpen(false)}
                        className="border-gray-300 text-gray-700"
                      >
                        İptal
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createDepartmentMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {createDepartmentMutation.isPending ? "Oluşturuluyor..." : "Departman Oluştur"}
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
                  <p className="text-blue-600 text-sm font-medium">Toplam Departman</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalDepartments}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Toplam Çalışan</p>
                  <p className="text-3xl font-bold text-green-900">{stats.totalEmployees}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Ortalama Personel</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.avgEmployeesPerDept}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Bütçeli Departman</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.departmentsWithBudget}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Departman ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={managerFilter} onValueChange={setManagerFilter}>
            <SelectTrigger className="w-full sm:w-64 border-gray-300">
              <SelectValue placeholder="Müdür filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Müdürler</SelectItem>
              {employees.map((employee: any) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Departments Table */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Departmanlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-sm font-medium text-gray-600">Departman</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Müdür</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Personel Sayısı</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Lokasyon</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Yıllık Bütçe</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((department: any) => {
                    const deptEmployees = getEmployeesByDepartment(department.id);
                    const manager = employees.find((emp: any) => emp.id === department.manager);
                    
                    return (
                      <tr key={department.id} className="border-b border-gray-100">
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-gray-900">{department.name}</p>
                            {department.description && (
                              <p className="text-sm text-gray-600">{department.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          {manager ? (
                            <div>
                              <p className="text-gray-900">{manager.firstName} {manager.lastName}</p>
                              <p className="text-sm text-gray-600">{manager.position}</p>
                            </div>
                          ) : (
                            <Badge className="bg-orange-100 text-orange-800">Atanmadı</Badge>
                          )}
                        </td>
                        <td className="py-4">
                          <Badge className="bg-blue-100 text-blue-800">
                            {deptEmployees.length} kişi
                          </Badge>
                        </td>
                        <td className="py-4 text-gray-700">
                          {department.location || "-"}
                        </td>
                        <td className="py-4 text-gray-700">
                          {department.budget ? formatCurrency(parseFloat(department.budget)) : "-"}
                        </td>
                        <td className="py-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => deleteDepartmentMutation.mutate(department.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredDepartments.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Departman bulunamadı</h3>
                <p className="text-gray-600">
                  {searchTerm || managerFilter !== "all"
                    ? "Arama kriterlerinize uygun departman bulunamadı."
                    : "Henüz hiç departman oluşturulmamış. İlk departmanınızı oluşturmak için yukarıdaki butonu kullanın."
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