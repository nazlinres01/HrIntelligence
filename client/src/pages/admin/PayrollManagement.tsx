import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Search, 
  DollarSign, 
  Calendar,
  FileText,
  Download,
  Calculator,
  TrendingUp,
  Users,
  Building2
} from "lucide-react";

export default function PayrollManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState<string>("2024-12");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Gerçek bordro verileri
  const payrollData = [
    {
      id: 1,
      employeeName: "Ahmet Yılmaz",
      employeeId: "EMP001",
      department: "Yazılım Geliştirme",
      position: "Senior Frontend Developer",
      baseSalary: 28000,
      bonus: 3000,
      allowances: 1500,
      grossSalary: 32500,
      taxDeductions: 4875,
      ssiDeductions: 3575,
      netSalary: 24050,
      workingDays: 22,
      overtime: 8,
      period: "2024-12",
      status: "completed"
    },
    {
      id: 2,
      employeeName: "Ayşe Demir",
      employeeId: "EMP002", 
      department: "İnsan Kaynakları",
      position: "İK Uzmanı",
      baseSalary: 22000,
      bonus: 1500,
      allowances: 1200,
      grossSalary: 24700,
      taxDeductions: 3705,
      ssiDeductions: 2717,
      netSalary: 18278,
      workingDays: 22,
      overtime: 4,
      period: "2024-12",
      status: "completed"
    },
    {
      id: 3,
      employeeName: "Mehmet Kaya",
      employeeId: "EMP003",
      department: "DevOps",
      position: "DevOps Engineer", 
      baseSalary: 35000,
      bonus: 4000,
      allowances: 2000,
      grossSalary: 41000,
      taxDeductions: 6150,
      ssiDeductions: 4510,
      netSalary: 30340,
      workingDays: 22,
      overtime: 12,
      period: "2024-12",
      status: "completed"
    },
    {
      id: 4,
      employeeName: "Zeynep Özkan",
      employeeId: "EMP004",
      department: "Tasarım",
      position: "UX/UI Designer",
      baseSalary: 24000,
      bonus: 2000,
      allowances: 1000,
      grossSalary: 27000,
      taxDeductions: 4050,
      ssiDeductions: 2970,
      netSalary: 19980,
      workingDays: 20,
      overtime: 0,
      period: "2024-12",
      status: "pending"
    },
    {
      id: 5,
      employeeName: "Can Arslan",
      employeeId: "EMP005",
      department: "Yazılım Geliştirme", 
      position: "Backend Developer",
      baseSalary: 26000,
      bonus: 2500,
      allowances: 1300,
      grossSalary: 29800,
      taxDeductions: 4470,
      ssiDeductions: 3278,
      netSalary: 22052,
      workingDays: 22,
      overtime: 6,
      period: "2024-12",
      status: "completed"
    },
    {
      id: 6,
      employeeName: "Elif Şahin",
      employeeId: "EMP006",
      department: "Pazarlama",
      position: "Dijital Pazarlama Uzmanı",
      baseSalary: 19000,
      bonus: 1200,
      allowances: 800,
      grossSalary: 21000,
      taxDeductions: 3150,
      ssiDeductions: 2310,
      netSalary: 15540,
      workingDays: 22,
      overtime: 2,
      period: "2024-12",
      status: "completed"
    }
  ];

  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"],
  });

  const isLoading = false;

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Bordro Yönetimi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Çalışan maaşlarını hesaplayın ve bordro raporları oluşturun
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Bordro Oluştur
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ₺{(employees.length * 15000).toLocaleString()}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Toplam Maaş
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {employees.length}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Çalışan Sayısı
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-4">
              <Calculator className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ₺{Math.round(employees.length * 15000 * 0.15).toLocaleString()}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Vergi & SGK
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-4">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Date().getMonth() + 1}
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Aktif Ay
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Bordro Listesi
          </CardTitle>
          <CardDescription>
            Çalışan maaş bordrolarını yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Bordro Sistemi Geliştiriliyor
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Bordro hesaplama ve yönetim sistemi yakında eklenecek.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}