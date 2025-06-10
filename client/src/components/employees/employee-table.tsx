import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { DEPARTMENTS, EMPLOYEE_STATUSES } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Employee } from "@shared/schema";

interface EmployeeTableProps {
  onAddEmployee: () => void;
  onViewEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
}

export function EmployeeTable({ onAddEmployee, onViewEmployee, onEditEmployee }: EmployeeTableProps) {
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["/api/employees"],
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/employees/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      toast({
        title: "Başarılı",
        description: "Çalışan başarıyla silindi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Çalışan silinirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const filteredEmployees = employees.filter((employee: Employee) => {
    const departmentMatch = departmentFilter === "all" || employee.department === departmentFilter;
    const statusMatch = statusFilter === "all" || employee.status === statusFilter;
    return departmentMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + pageSize);

  const handleDeleteEmployee = (id: number) => {
    if (window.confirm("Bu çalışanı silmek istediğinizden emin misiniz?")) {
      deleteEmployeeMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="hr-status-active">Aktif</span>;
      case "on_leave":
        return <span className="hr-status-on-leave">İzinli</span>;
      case "inactive":
        return <span className="hr-status-inactive">Pasif</span>;
      default:
        return <span className="hr-status-active">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <Card className="hr-stat-card">
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </Card>
    );
  }

  return (
    <Card className="hr-stat-card">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Çalışan Yönetimi</h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tüm Departmanlar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Departmanlar</SelectItem>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tüm Durumlar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  {EMPLOYEE_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={onAddEmployee} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Çalışan Ekle
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Çalışan</TableHead>
              <TableHead className="min-w-[120px]">Departman</TableHead>
              <TableHead className="min-w-[120px]">Pozisyon</TableHead>
              <TableHead className="min-w-[100px]">Başlama Tarihi</TableHead>
              <TableHead className="min-w-[120px]">Performans</TableHead>
              <TableHead className="min-w-[80px]">Durum</TableHead>
              <TableHead className="min-w-[100px]">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmployees.map((employee: Employee) => (
              <TableRow key={employee.id} className="hr-table-row">
                <TableCell>
                  <div className="flex items-center">
                    <img
                      src={employee.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"}
                      alt="Employee"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">{employee.department}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">{employee.position}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">
                    {new Date(employee.startDate).toLocaleDateString('tr-TR')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900 mr-2">
                      {employee.performanceScore}
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(parseFloat(employee.performanceScore || "0") / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(employee.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewEmployee(employee)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditEmployee(employee)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Gösterilen: {startIndex + 1}-{Math.min(startIndex + pageSize, filteredEmployees.length)} / {filteredEmployees.length} sonuçtan
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Önceki
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Sonraki
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
