import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal, Mail, Phone, Calendar, MapPin, TrendingUp, Edit, Eye } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { Employee } from "@shared/schema";

interface ModernEmployeeCardProps {
  employee: Employee;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
}

export function ModernEmployeeCard({ employee, onView, onEdit }: ModernEmployeeCardProps) {
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t("Aktif")}</Badge>;
      case 'on_leave':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{t("İzinli")}</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{t("Pasif")}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPerformanceColor = (score: string) => {
    const numScore = parseFloat(score || "0");
    if (numScore >= 8) return "text-green-600 bg-green-50";
    if (numScore >= 6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 ring-2 ring-gray-100">
              <AvatarImage src={employee.profileImage || ""} alt={employee.firstName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-lg">
                {employee.firstName[0]}{employee.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-sm text-gray-600 font-medium">{employee.position}</p>
              <p className="text-xs text-gray-500">{employee.department}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusBadge(employee.status)}
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            <span>{employee.email}</span>
          </div>
          
          {employee.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              <span>{employee.phone}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{t("Başlangıç")}: {new Date(employee.startDate).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Performance & Salary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`px-2 py-1 rounded-lg flex items-center space-x-1 ${getPerformanceColor(employee.performanceScore || "0")}`}>
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-medium">{employee.performanceScore || "0"}/10</span>
            </div>
            
            <div className="text-sm font-semibold text-gray-900">
              ₺{parseFloat(employee.salary).toLocaleString('tr-TR')}
            </div>
          </div>
          
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView(employee)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Eye className="h-3 w-3 mr-1" />
              {t("Görüntüle")}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(employee)}
              className="text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              <Edit className="h-3 w-3 mr-1" />
              {t("Düzenle")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}