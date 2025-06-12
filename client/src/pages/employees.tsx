import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const employeeSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Telefon numarası en az 10 karakter olmalıdır"),
  position: z.string().min(2, "Pozisyon belirtilmelidir"),
  department: z.string().min(2, "Departman seçilmelidir"),
  salary: z.string().min(1, "Maaş belirtilmelidir"),
  startDate: z.string().min(1, "İşe başlama tarihi belirtilmelidir"),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional()
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

const departmentOptions = [
  { value: "yazilim", label: "Yazılım Geliştirme" },
  { value: "pazarlama", label: "Pazarlama" },
  { value: "satis", label: "Satış" },
  { value: "ik", label: "İnsan Kaynakları" },
  { value: "muhasebe", label: "Muhasebe" },
  { value: "operasyon", label: "Operasyon" }
];

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ["/api/employees"]
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"]
  });

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      salary: "",
      startDate: "",
      address: "",
      emergencyContact: "",
      notes: ""
    }
  });

  const createEmployeeMutation = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      return apiRequest("/api/employees", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Çalışan başarıyla eklendi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Çalışan eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/employees/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      toast({
        title: "Başarılı",
        description: "Çalışan başarıyla silindi",
      });
    }
  });

  // Filter employees
  const filteredEmployees = React.useMemo(() => {
    return employees.filter((employee: any) => {
      const matchesSearch = employee.firstName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           employee.lastName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           employee.email?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           employee.position?.toLowerCase()?.includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchTerm, departmentFilter]);

  const handleSubmit = (data: EmployeeFormData) => {
    createEmployeeMutation.mutate(data);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(salary);
  };

  if (employeesLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Çalışan Yönetimi</h1>
            <p className="text-gray-600">Şirket çalışanlarını yönetin ve takip edin</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Çalışan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Yeni Çalışan Ekle</DialogTitle>
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
                            <Input placeholder="Çalışan adı" {...field} className="border-gray-300" />
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
                            <Input placeholder="Çalışan soyadı" {...field} className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">E-posta</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="ornek@email.com" {...field} className="border-gray-300" />
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Pozisyon</FormLabel>
                          <FormControl>
                            <Input placeholder="Yazılım Geliştirici" {...field} className="border-gray-300" />
                          </FormControl>
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
                              {departmentOptions.map((dept) => (
                                <SelectItem key={dept.value} value={dept.value}>
                                  {dept.label}
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
                      name="salary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Maaş (TL)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="15000" {...field} className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">İşe Başlama Tarihi</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Adres</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tam adres bilgisi" {...field} className="border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Acil Durum İletişim</FormLabel>
                        <FormControl>
                          <Input placeholder="Acil durum kişisi ve telefonu" {...field} className="border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Notlar</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Ek notlar ve açıklamalar" {...field} className="border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="border-gray-300 text-gray-700"
                    >
                      İptal
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createEmployeeMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {createEmployeeMutation.isPending ? "Ekleniyor..." : "Çalışan Ekle"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Toplam Çalışan</p>
                  <p className="text-3xl font-bold text-blue-900">{employees.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Aktif Çalışan</p>
                  <p className="text-3xl font-bold text-green-900">{employees.filter((emp: any) => emp.status === 'active').length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Departman Sayısı</p>
                  <p className="text-3xl font-bold text-orange-900">{departments.length}</p>
                </div>
                <Filter className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Ortalama Maaş</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {employees.length > 0 ? formatSalary(
                      employees.reduce((sum: number, emp: any) => sum + (emp.salary || 0), 0) / employees.length
                    ) : "₺0"}
                  </p>
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
              placeholder="Çalışan ara (ad, soyad, e-posta, pozisyon)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Departman filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Departmanlar</SelectItem>
              {departmentOptions.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee: any) => (
            <Card key={employee.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 bg-blue-100">
                      <AvatarFallback className="text-blue-600 font-semibold">
                        {getInitials(employee.firstName, employee.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={employee.status === 'active' ? 'default' : 'secondary'}
                    className={employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {employee.status === 'active' ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {employee.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {employee.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    İşe Başlama: {new Date(employee.startDate || employee.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                  {employee.salary && (
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {formatSalary(employee.salary)}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <Badge variant="outline" className="text-xs">
                    {departmentOptions.find(d => d.value === employee.department)?.label || employee.department}
                  </Badge>
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
                      onClick={() => deleteEmployeeMutation.mutate(employee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Çalışan bulunamadı</h3>
            <p className="text-gray-600">
              {searchTerm || departmentFilter !== "all" 
                ? "Arama kriterlerinize uygun çalışan bulunamadı. Filtreleri değiştirmeyi deneyin."
                : "Henüz hiç çalışan eklenmemiş. İlk çalışanınızı eklemek için yukarıdaki butonu kullanın."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}