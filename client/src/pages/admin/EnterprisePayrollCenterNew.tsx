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
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  TrendingUp,
  Users,
  CreditCard,
  FileText,
  Eye,
  Edit,
  Trash2,
  Calculator,
  PieChart
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const payrollSchema = z.object({
  employeeId: z.string().min(1, "Çalışan seçilmelidir"),
  period: z.string().min(1, "Dönem belirtilmelidir"),
  baseSalary: z.string().min(1, "Temel maaş belirtilmelidir"),
  bonus: z.string().optional(),
  allowances: z.string().optional(),
  deductions: z.string().optional(),
  overtime: z.string().optional(),
  workingDays: z.string().min(1, "Çalışma günü belirtilmelidir")
});

type PayrollFormData = z.infer<typeof payrollSchema>;

export default function EnterprisePayrollCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payrolls = [], isLoading: payrollsLoading } = useQuery({
    queryKey: ["/api/payroll"]
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"]
  });

  const form = useForm<PayrollFormData>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      employeeId: "",
      period: "",
      baseSalary: "",
      bonus: "0",
      allowances: "0",
      deductions: "0",
      overtime: "0",
      workingDays: "22"
    }
  });

  const createPayrollMutation = useMutation({
    mutationFn: async (data: PayrollFormData) => {
      return apiRequest("POST", "/api/payroll", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Bordro kaydı başarıyla oluşturuldu",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Bordro kaydı oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const deletePayrollMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/payroll/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll"] });
      toast({
        title: "Başarılı",
        description: "Bordro kaydı başarıyla silindi",
      });
    }
  });

  // Filter payrolls
  const filteredPayrolls = React.useMemo(() => {
    return (payrolls as any[]).filter((payroll: any) => {
      const matchesSearch = payroll.employee?.firstName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           payroll.employee?.lastName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           payroll.employeeId?.toLowerCase()?.includes(searchTerm.toLowerCase());
      const matchesPeriod = periodFilter === "all" || payroll.period === periodFilter;
      const matchesStatus = statusFilter === "all" || payroll.status === statusFilter;
      return matchesSearch && matchesPeriod && matchesStatus;
    });
  }, [payrolls, searchTerm, periodFilter, statusFilter]);

  const handleSubmit = (data: PayrollFormData) => {
    createPayrollMutation.mutate(data);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const calculateNetSalary = (payroll: any) => {
    const basic = parseFloat(payroll.baseSalary || 0);
    const bonus = parseFloat(payroll.bonus || 0);
    const allowances = parseFloat(payroll.allowances || 0);
    const deductions = parseFloat(payroll.deductions || 0);
    const tax = basic * 0.15; // Simple tax calculation
    const socialSecurity = basic * 0.14; // SSK
    
    return basic + bonus + allowances - deductions - tax - socialSecurity;
  };

  const getTotalPayroll = () => {
    return payrolls.reduce((total: number, payroll: any) => total + calculateNetSalary(payroll), 0);
  };

  const getPayrollStats = () => {
    const totalPayroll = getTotalPayroll();
    const processedCount = payrolls.filter((p: any) => p.status === 'processed').length;
    const pendingCount = payrolls.filter((p: any) => p.status === 'pending').length;
    const avgSalary = payrolls.length > 0 ? totalPayroll / payrolls.length : 0;
    
    return { totalPayroll, processedCount, pendingCount, avgSalary };
  };

  const stats = getPayrollStats();

  if (payrollsLoading) {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ücret & Haklar Yönetim Merkezi</h1>
            <p className="text-gray-600">Kurumsal bordro sistemi ve ücret yönetimi</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-300 text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Bordro
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl bg-white">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Yeni Bordro Kaydı</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Çalışan</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Çalışan seçin" />
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
                      <FormField
                        control={form.control}
                        name="period"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Dönem</FormLabel>
                            <FormControl>
                              <Input type="month" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="baseSalary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Temel Maaş (TL)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="15000" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bonus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Prim/Bonus (TL)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="allowances"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Haklar/Ödenekler (TL)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="workingDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Çalışma Günü</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="22" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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
                        disabled={createPayrollMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {createPayrollMutation.isPending ? "Kaydediliyor..." : "Bordro Oluştur"}
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
                  <p className="text-blue-600 text-sm font-medium">Toplam Bordro</p>
                  <p className="text-3xl font-bold text-blue-900">{formatCurrency(stats.totalPayroll)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">İşlenen Bordro</p>
                  <p className="text-3xl font-bold text-green-900">{stats.processedCount}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Bekleyen Bordro</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.pendingCount}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Ortalama Maaş</p>
                  <p className="text-3xl font-bold text-purple-900">{formatCurrency(stats.avgSalary)}</p>
                </div>
                <Calculator className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Çalışan ara veya çalışan ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Dönem filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Dönemler</SelectItem>
              <SelectItem value="2024-01">Ocak 2024</SelectItem>
              <SelectItem value="2024-02">Şubat 2024</SelectItem>
              <SelectItem value="2024-03">Mart 2024</SelectItem>
              <SelectItem value="2024-04">Nisan 2024</SelectItem>
              <SelectItem value="2024-05">Mayıs 2024</SelectItem>
              <SelectItem value="2024-06">Haziran 2024</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Durum filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="processed">İşlenen</SelectItem>
              <SelectItem value="pending">Bekleyen</SelectItem>
              <SelectItem value="failed">Başarısız</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payroll Table */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Bordro Kayıtları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-sm font-medium text-gray-600">Çalışan</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Dönem</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Temel Maaş</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Prim/Bonus</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Net Maaş</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Durum</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayrolls.map((payroll: any) => (
                    <tr key={payroll.id} className="border-b border-gray-100">
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {payroll.employee?.firstName} {payroll.employee?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{payroll.employee?.position}</p>
                        </div>
                      </td>
                      <td className="py-4 text-gray-700">
                        {new Date(payroll.period + "-01").toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                      </td>
                      <td className="py-4 text-gray-700">{formatCurrency(payroll.baseSalary)}</td>
                      <td className="py-4 text-gray-700">{formatCurrency(payroll.bonus || 0)}</td>
                      <td className="py-4">
                        <Badge className="bg-green-100 text-green-800">
                          {formatCurrency(calculateNetSalary(payroll))}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Badge 
                          className={
                            payroll.status === 'processed' ? 'bg-green-100 text-green-800' :
                            payroll.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {payroll.status === 'processed' ? 'İşlenen' :
                           payroll.status === 'pending' ? 'Bekleyen' : 'Başarısız'}
                        </Badge>
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
                            onClick={() => deletePayrollMutation.mutate(payroll.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPayrolls.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bordro kaydı bulunamadı</h3>
                <p className="text-gray-600">
                  {searchTerm || periodFilter !== "all" || statusFilter !== "all" 
                    ? "Arama kriterlerinize uygun bordro kaydı bulunamadı."
                    : "Henüz hiç bordro kaydı oluşturulmamış. İlk kaydınızı oluşturmak için yukarıdaki butonu kullanın."
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