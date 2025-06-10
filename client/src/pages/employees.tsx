import { useState } from "react";
import { Header } from "@/components/layout/header";
import { EmployeeTable } from "@/components/employees/employee-table";
import { AddEmployeeModal } from "@/components/employees/add-employee-modal";
import { EmployeeDetailsModal } from "@/components/employees/employee-details-modal";
import type { Employee } from "@shared/schema";

export default function Employees() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        title="Çalışanlar" 
        subtitle="Çalışan yönetimi ve detayları"
      />
      
      <main className="flex-1 overflow-auto p-6">
        <EmployeeTable
          onAddEmployee={() => setAddModalOpen(true)}
          onViewEmployee={handleViewEmployee}
          onEditEmployee={handleEditEmployee}
        />
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
