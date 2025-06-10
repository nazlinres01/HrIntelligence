import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Calendar, DollarSign, Award } from "lucide-react";
import type { Employee } from "@shared/schema";

interface EmployeeDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function EmployeeDetailsModal({ open, onOpenChange, employee }: EmployeeDetailsModalProps) {
  if (!employee) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Aktif</Badge>;
      case "on_leave":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">İzinli</Badge>;
      case "inactive":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Pasif</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Çalışan Detayları</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header with photo and basic info */}
          <div className="flex items-start space-x-4">
            <img
              src={employee.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"}
              alt="Employee"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-gray-600">{employee.position}</p>
              <p className="text-sm text-gray-500">{employee.department}</p>
              <div className="mt-2">
                {getStatusBadge(employee.status)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{employee.email}</span>
              </div>
              {employee.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{employee.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">İş Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-sm font-medium">Başlama Tarihi: </span>
                  <span className="text-sm">{new Date(employee.startDate).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-sm font-medium">Maaş: </span>
                  <span className="text-sm">₺{parseFloat(employee.salary).toLocaleString('tr-TR')}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-sm font-medium">Performans Skoru: </span>
                  <span className="text-sm">{employee.performanceScore || "0.0"}/10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(parseFloat(employee.performanceScore || "0") / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {employee.performanceScore || "0.0"}/10
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>Oluşturulma: {new Date(employee.createdAt!).toLocaleString('tr-TR')}</p>
            <p>Son Güncelleme: {new Date(employee.updatedAt!).toLocaleString('tr-TR')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
