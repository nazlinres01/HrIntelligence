import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdvancedFilters } from "@/components/ui/advanced-filters";
import { ExportReports } from "@/components/ui/export-reports";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  User,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  MoreHorizontal
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  startDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  address?: string;
  emergencyContact?: string;
  notes?: string;
}

export default function Employees() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({});

  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    startDate: "",
    salary: "",
    address: "",
    emergencyContact: "",
    notes: ""
  });

  const { data: employees, isLoading } = useQuery({
    queryKey: ["/api/employees"],
  });

  const createEmployeeMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/employees", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      setIsAddModalOpen(false);
      setNewEmployee({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        startDate: "",
        salary: "",
        address: "",
        emergencyContact: "",
        notes: ""
      });
      toast({
        title: "Başarılı",
        description: "Çalışan başarıyla eklendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Çalışan eklenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `/api/employees/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
      toast({
        title: "Başarılı",
        description: "Çalışan bilgileri güncellendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Çalışan güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/employees/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      toast({
        title: "Başarılı",
        description: "Çalışan silindi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Çalışan silinirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  // Advanced filter configuration
  const filterConfig = [
    {
      key: "firstName",
      label: "Ad",
      type: "text" as const
    },
    {
      key: "lastName", 
      label: "Soyad",
      type: "text" as const
    },
    {
      key: "email",
      label: "E-posta",
      type: "text" as const
    },
    {
      key: "department",
      label: "Departman",
      type: "select" as const,
      options: [
        { value: "Yazılım Geliştirme", label: "Yazılım Geliştirme" },
        { value: "Pazarlama ve Satış", label: "Pazarlama ve Satış" },
        { value: "İnsan Kaynakları", label: "İnsan Kaynakları" },
        { value: "Finans ve Muhasebe", label: "Finans ve Muhasebe" },
        { value: "Operasyon", label: "Operasyon" }
      ]
    },
    {
      key: "status",
      label: "Durum",
      type: "select" as const,
      options: [
        { value: "active", label: "Aktif" },
        { value: "on_leave", label: "İzinli" },
        { value: "inactive", label: "Pasif" }
      ]
    },
    {
      key: "salary",
      label: "Maaş",
      type: "number" as const
    }
  ];

  // Export field configuration
  const exportFields = [
    { key: "firstName", label: "Ad", required: true },
    { key: "lastName", label: "Soyad", required: true },
    { key: "email", label: "E-posta", required: true },
    { key: "phone", label: "Telefon" },
    { key: "department", label: "Departman", required: true },
    { key: "position", label: "Pozisyon", required: true },
    { key: "salary", label: "Maaş" },
    { key: "startDate", label: "İşe Başlama Tarihi" },
    { key: "status", label: "Durum", required: true },
    { key: "address", label: "Adres" },
    { key: "emergencyContact", label: "Acil Durum İletişim" },
    { key: "notes", label: "Notlar" }
  ];

  // Enhanced filtering with advanced filters
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    
    return employees.filter((employee: Employee) => {
      // Basic search filter
      const matchesSearch = 
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Basic filters
      const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
      
      // Advanced filters
      let matchesAdvanced = true;
      
      if (advancedFilters.firstName) {
        matchesAdvanced &&= employee.firstName.toLowerCase().includes(advancedFilters.firstName.toLowerCase());
      }
      
      if (advancedFilters.lastName) {
        matchesAdvanced &&= employee.lastName.toLowerCase().includes(advancedFilters.lastName.toLowerCase());
      }
      
      if (advancedFilters.email) {
        matchesAdvanced &&= employee.email.toLowerCase().includes(advancedFilters.email.toLowerCase());
      }
      
      if (advancedFilters.department) {
        matchesAdvanced &&= employee.department === advancedFilters.department;
      }
      
      if (advancedFilters.status) {
        matchesAdvanced &&= employee.status === advancedFilters.status;
      }
      
      if (advancedFilters.salary_min) {
        const salary = parseFloat(employee.salary?.toString() || "0");
        matchesAdvanced &&= salary >= parseFloat(advancedFilters.salary_min);
      }
      
      if (advancedFilters.salary_max) {
        const salary = parseFloat(employee.salary?.toString() || "0");
        matchesAdvanced &&= salary <= parseFloat(advancedFilters.salary_max);
      }
      
      return matchesSearch && matchesStatus && matchesDepartment && matchesAdvanced;
    });
  }, [employees, searchTerm, statusFilter, departmentFilter, advancedFilters]);

  const departments = Array.from(new Set(employees?.map((emp: Employee) => emp.department) || []));

  const handleAddEmployee = () => {
    const employeeData = {
      ...newEmployee,
      salary: parseFloat(newEmployee.salary) || 0,
      status: 'active' as const
    };
    createEmployeeMutation.mutate(employeeData);
  };

  const handleEditEmployee = () => {
    if (selectedEmployee) {
      updateEmployeeMutation.mutate(selectedEmployee);
    }
  };

  const handleDeleteEmployee = (id: number) => {
    if (confirm("Bu çalışanı silmek istediğinizden emin misiniz?")) {
      deleteEmployeeMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Pasif</Badge>;
      case 'on_leave':
        return <Badge className="bg-yellow-100 text-yellow-800">İzinli</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const statsCards = [
    {
      title: "Toplam Çalışan",
      value: employees?.length || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Aktif Çalışan",
      value: employees?.filter((emp: Employee) => emp.status === 'active').length || 0,
      icon: User,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "İzinli Çalışan",
      value: employees?.filter((emp: Employee) => emp.status === 'on_leave').length || 0,
      icon: Calendar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Departman Sayısı",
      value: departments.length || 0,
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <Header 
        title="Çalışan Yönetimi" 
        subtitle="Çalışan bilgilerini görüntüleyin ve yönetin" 
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {isLoading ? "..." : stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters and Actions */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Çalışan ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                  <SelectItem value="on_leave">İzinli</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Building className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Departman" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Departmanlar</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <AdvancedFilters
                filters={filterConfig}
                onFilterChange={setAdvancedFilters}
                activeFilters={advancedFilters}
              />
              
              <ExportReports
                data={filteredEmployees || []}
                filename="calisanlar"
                fields={exportFields}
                reportType="employees"
              />
              
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                İçe Aktar
              </Button>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Çalışan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Yeni Çalışan Ekle</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Ad</Label>
                      <Input
                        id="firstName"
                        value={newEmployee.firstName}
                        onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                        placeholder="Ad"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Soyad</Label>
                      <Input
                        id="lastName"
                        value={newEmployee.lastName}
                        onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                        placeholder="Soyad"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        placeholder="E-posta"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                        placeholder="Telefon"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Departman</Label>
                      <Input
                        id="department"
                        value={newEmployee.department}
                        onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                        placeholder="Departman"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Pozisyon</Label>
                      <Input
                        id="position"
                        value={newEmployee.position}
                        onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                        placeholder="Pozisyon"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">İşe Başlama Tarihi</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newEmployee.startDate}
                        onChange={(e) => setNewEmployee({ ...newEmployee, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">Maaş</Label>
                      <Input
                        id="salary"
                        type="number"
                        value={newEmployee.salary}
                        onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                        placeholder="Maaş"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="address">Adres</Label>
                      <Textarea
                        id="address"
                        value={newEmployee.address}
                        onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                        placeholder="Adres"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Acil Durum İletişim</Label>
                      <Input
                        id="emergencyContact"
                        value={newEmployee.emergencyContact}
                        onChange={(e) => setNewEmployee({ ...newEmployee, emergencyContact: e.target.value })}
                        placeholder="Acil durum iletişim"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notlar</Label>
                      <Textarea
                        id="notes"
                        value={newEmployee.notes}
                        onChange={(e) => setNewEmployee({ ...newEmployee, notes: e.target.value })}
                        placeholder="Notlar"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      İptal
                    </Button>
                    <Button 
                      onClick={handleAddEmployee} 
                      disabled={createEmployeeMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createEmployeeMutation.isPending ? "Ekleniyor..." : "Ekle"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee: Employee) => (
            <Card key={employee.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-16 w-16 ring-4 ring-blue-50">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {employee.firstName[0]}{employee.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {getStatusBadge(employee.status)}
                </div>
                
                <div className="space-y-2 mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{employee.position}</p>
                  <p className="text-sm text-blue-600 font-medium">{employee.department}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  {employee.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{employee.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(employee.startDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setIsViewModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Çalışan bulunamadı</p>
            <p className="text-gray-400">Arama kriterlerinizi değiştirin veya yeni çalışan ekleyin</p>
          </div>
        )}
      </div>

      {/* View Employee Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Çalışan Detayları</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xl">
                    {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h2>
                  <p className="text-lg text-gray-600">{selectedEmployee.position}</p>
                  <p className="text-blue-600 font-medium">{selectedEmployee.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">E-posta</Label>
                    <p className="text-gray-900">{selectedEmployee.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Telefon</Label>
                    <p className="text-gray-900">{selectedEmployee.phone || "Belirtilmemiş"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">İşe Başlama Tarihi</Label>
                    <p className="text-gray-900">
                      {new Date(selectedEmployee.startDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Maaş</Label>
                    <p className="text-gray-900">₺{selectedEmployee.salary?.toLocaleString('tr-TR')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Durum</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedEmployee.status)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Acil Durum İletişim</Label>
                    <p className="text-gray-900">{selectedEmployee.emergencyContact || "Belirtilmemiş"}</p>
                  </div>
                </div>
              </div>

              {selectedEmployee.address && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Adres</Label>
                  <p className="text-gray-900 mt-1">{selectedEmployee.address}</p>
                </div>
              )}

              {selectedEmployee.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Notlar</Label>
                  <p className="text-gray-900 mt-1">{selectedEmployee.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Employee Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Çalışan Düzenle</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">Ad</Label>
                <Input
                  id="editFirstName"
                  value={selectedEmployee.firstName}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName">Soyad</Label>
                <Input
                  id="editLastName"
                  value={selectedEmployee.lastName}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, lastName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">E-posta</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={selectedEmployee.email}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">Telefon</Label>
                <Input
                  id="editPhone"
                  value={selectedEmployee.phone || ""}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDepartment">Departman</Label>
                <Input
                  id="editDepartment"
                  value={selectedEmployee.department}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPosition">Pozisyon</Label>
                <Input
                  id="editPosition"
                  value={selectedEmployee.position}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, position: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStartDate">İşe Başlama Tarihi</Label>
                <Input
                  id="editStartDate"
                  type="date"
                  value={selectedEmployee.startDate}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSalary">Maaş</Label>
                <Input
                  id="editSalary"
                  type="number"
                  value={selectedEmployee.salary}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, salary: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStatus">Durum</Label>
                <Select
                  value={selectedEmployee.status}
                  onValueChange={(value) => setSelectedEmployee({ ...selectedEmployee, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Pasif</SelectItem>
                    <SelectItem value="on_leave">İzinli</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmergencyContact">Acil Durum İletişim</Label>
                <Input
                  id="editEmergencyContact"
                  value={selectedEmployee.emergencyContact || ""}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, emergencyContact: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="editAddress">Adres</Label>
                <Textarea
                  id="editAddress"
                  value={selectedEmployee.address || ""}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, address: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="editNotes">Notlar</Label>
                <Textarea
                  id="editNotes"
                  value={selectedEmployee.notes || ""}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, notes: e.target.value })}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              İptal
            </Button>
            <Button 
              onClick={handleEditEmployee} 
              disabled={updateEmployeeMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateEmployeeMutation.isPending ? "Güncelleniyor..." : "Güncelle"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}