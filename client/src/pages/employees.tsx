import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { ModernEmployeeCard } from "@/components/employees/modern-employee-card";
import { AddEmployeeModal } from "@/components/employees/add-employee-modal";
import { EmployeeDetailsModal } from "@/components/employees/employee-details-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { Search, Plus, Grid, List, Download } from "lucide-react";
import type { Employee } from "@shared/schema";

export default function Employees() {
  const { t } = useLanguage();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["/api/employees"],
  });

  const filteredEmployees = employees.filter((employee: Employee) => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = [...new Set(employees.map((emp: Employee) => emp.department))];

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setAddModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden bg-gray-50">
        <Header title={t("Çalışanlar")} subtitle={t("Çalışan yönetimi ve detayları")} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden bg-gray-50">
      <Header title={t("Çalışanlar")} subtitle={t("Çalışan yönetimi ve detayları")} />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm border-0 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={t("Çalışan ara...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder={t("Durum")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("Tümü")}</SelectItem>
                    <SelectItem value="active">{t("Aktif")}</SelectItem>
                    <SelectItem value="on_leave">{t("İzinli")}</SelectItem>
                    <SelectItem value="inactive">{t("Pasif")}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder={t("Departman")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("Tümü")}</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex border border-gray-200 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="px-3"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t("Dışa Aktar")}
                </Button>
                
                <Button onClick={() => setAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("Yeni Çalışan")}
                </Button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{filteredEmployees.length}</span> {t("çalışan gösteriliyor")}
                {searchTerm && (
                  <span className="ml-2">
                    "{searchTerm}" {t("için sonuçlar")}
                  </span>
                )}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{t("Aktif")}: {employees.filter((emp: Employee) => emp.status === 'active').length}</span>
                <span>{t("İzinli")}: {employees.filter((emp: Employee) => emp.status === 'on_leave').length}</span>
                <span>{t("Pasif")}: {employees.filter((emp: Employee) => emp.status === 'inactive').length}</span>
              </div>
            </div>
          </div>

          {/* Employee Grid */}
          {filteredEmployees.length === 0 ? (
            <Card className="shadow-sm border-0">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t("Çalışan bulunamadı")}</h3>
                <p className="text-gray-500 text-center max-w-md">
                  {searchTerm 
                    ? t("Arama kriterlerinize uygun çalışan bulunamadı.")
                    : t("Henüz sistemde kayıtlı çalışan bulunmuyor.")
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={() => setAddModalOpen(true)} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("İlk Çalışanı Ekle")}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            }>
              {filteredEmployees.map((employee: Employee) => (
                <ModernEmployeeCard
                  key={employee.id}
                  employee={employee}
                  onView={handleViewEmployee}
                  onEdit={handleEditEmployee}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AddEmployeeModal 
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
      />

      <EmployeeDetailsModal 
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        employee={selectedEmployee}
      />
    </div>
  );
}