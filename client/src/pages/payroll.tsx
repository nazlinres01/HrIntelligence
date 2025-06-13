import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Trash2
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const payrollSchema = z.object({
  employeeId: z.string().min(1, "Çalışan seçilmelidir"),
  period: z.string().min(1, "Dönem belirtilmelidir"),
  basicSalary: z.string().min(1, "Temel maaş belirtilmelidir"),
  overtime: z.string().optional(),
  bonus: z.string().optional(),
  deductions: z.string().optional(),
  tax: z.string().optional(),
  socialSecurity: z.string().optional(),
  notes: z.string().optional()
});

type PayrollFormData = z.infer<typeof payrollSchema>;

export default function Payroll() {
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payrolls = [], isLoading: payrollsLoading } = useQuery({
    queryKey: ["/api/payroll"]
  });

  // Örnek bordro verileri (API'den veri gelmezse)
  const samplePayrolls = [
    {
      id: 1,
      employeeId: 465,
      employee: { firstName: "Ahmet", lastName: "Yılmaz", position: "Senior Frontend Developer", department: "Yazılım Geliştirme" },
      period: "2024-06",
      basicSalary: 28000,
      overtime: 3200,
      bonus: 5000,
      deductions: 800,
      tax: 6240,
      socialSecurity: 4480,
      notes: "Proje bonus eklendi",
      status: "ödendi",
      paymentDate: "2024-06-30",
      netSalary: 24680
    },
    {
      id: 2,
      employeeId: 466,
      employee: { firstName: "Ayşe", lastName: "Kaya", position: "UX Designer", department: "Tasarım" },
      period: "2024-06",
      basicSalary: 22000,
      overtime: 0,
      bonus: 2000,
      deductions: 500,
      tax: 4200,
      socialSecurity: 3520,
      notes: "Tasarım yarışması ödülü",
      status: "ödendi",
      paymentDate: "2024-06-30",
      netSalary: 15780
    },
    {
      id: 3,
      employeeId: 467,
      employee: { firstName: "Mehmet", lastName: "Demir", position: "DevOps Engineer", department: "Altyapı" },
      period: "2024-06",
      basicSalary: 25000,
      overtime: 2400,
      bonus: 0,
      deductions: 600,
      tax: 4860,
      socialSecurity: 4080,
      notes: "Normal bordro",
      status: "hazırlandı",
      paymentDate: null,
      netSalary: 17860
    },
    {
      id: 4,
      employeeId: 468,
      employee: { firstName: "Selin", lastName: "Özkan", position: "Product Manager", department: "Ürün Yönetimi" },
      period: "2024-06",
      basicSalary: 32000,
      overtime: 0,
      bonus: 8000,
      deductions: 1000,
      tax: 7200,
      socialSecurity: 5120,
      notes: "Çeyrek performans bonusu",
      status: "onay_bekliyor",
      paymentDate: null,
      netSalary: 26680
    },
    {
      id: 5,
      employeeId: 469,
      employee: { firstName: "Can", lastName: "Erdoğan", position: "Backend Developer", department: "Yazılım Geliştirme" },
      period: "2024-06",
      basicSalary: 24000,
      overtime: 1800,
      bonus: 3000,
      deductions: 400,
      tax: 5040,
      socialSecurity: 4128,
      notes: "API geliştirme bonusu",
      status: "ödendi",
      paymentDate: "2024-06-30",
      netSalary: 19232
    },
    {
      id: 6,
      employeeId: 470,
      employee: { firstName: "Zeynep", lastName: "Yıldız", position: "HR Specialist", department: "İnsan Kaynakları" },
      period: "2024-06",
      basicSalary: 20000,
      overtime: 800,
      bonus: 1500,
      deductions: 300,
      tax: 3960,
      socialSecurity: 3328,
      notes: "İşe alım başarı bonusu",
      status: "ödendi",
      paymentDate: "2024-06-30",
      netSalary: 14712
    },
    {
      id: 7,
      employeeId: 471,
      employee: { firstName: "Emre", lastName: "Kara", position: "Sales Manager", department: "Satış" },
      period: "2024-06",
      basicSalary: 26000,
      overtime: 0,
      bonus: 12000,
      deductions: 800,
      tax: 6840,
      socialSecurity: 4368,
      notes: "Satış hedefi aşım bonusu",
      status: "ödendi",
      paymentDate: "2024-06-30",
      netSalary: 25992
    },
    {
      id: 8,
      employeeId: 472,
      employee: { firstName: "Fatma", lastName: "Çelik", position: "Accountant", department: "Finans" },
      period: "2024-06",
      basicSalary: 18000,
      overtime: 600,
      bonus: 800,
      deductions: 200,
      tax: 3480,
      socialSecurity: 2976,
      notes: "Mali dönem kapanış bonusu",
      status: "hazırlandı",
      paymentDate: null,
      netSalary: 12744
    },
    {
      id: 9,
      employeeId: 473,
      employee: { firstName: "Burak", lastName: "Arslan", position: "Mobile Developer", department: "Yazılım Geliştirme" },
      period: "2024-06",
      basicSalary: 26000,
      overtime: 2800,
      bonus: 4500,
      deductions: 750,
      tax: 5850,
      socialSecurity: 4160,
      notes: "Mobil uygulama lansmanı bonusu",
      status: "ödendi",
      paymentDate: "2024-06-30",
      netSalary: 21740
    },
    {
      id: 10,
      employeeId: 474,
      employee: { firstName: "Deniz", lastName: "Korkmaz", position: "Marketing Specialist", department: "Pazarlama" },
      period: "2024-06",
      basicSalary: 19000,
      overtime: 1200,
      bonus: 3000,
      deductions: 400,
      tax: 4080,
      socialSecurity: 3248,
      notes: "Kampanya başarısı bonusu",
      status: "ödendi",
      paymentDate: "2024-06-30",
      netSalary: 15472
    },
    {
      id: 11,
      employeeId: 475,
      employee: { firstName: "Oğuz", lastName: "Tan", position: "Data Analyst", department: "Veri Analizi" },
      period: "2024-06",
      basicSalary: 23000,
      overtime: 1600,
      bonus: 2500,
      deductions: 300,
      tax: 4830,
      socialSecurity: 3936,
      notes: "Veri analizi projesi bonusu",
      status: "onay_bekliyor",
      paymentDate: null,
      netSalary: 17034
    },
    {
      id: 12,
      employeeId: 476,
      employee: { firstName: "Ece", lastName: "Sönmez", position: "QA Engineer", department: "Kalite Kontrol" },
      period: "2024-06",
      basicSalary: 21000,
      overtime: 2000,
      bonus: 1800,
      deductions: 600,
      tax: 4320,
      socialSecurity: 3680,
      notes: "Test otomasyonu geliştirme",
      status: "ödendi",
      paymentDate: "2024-06-30",
      netSalary: 16200
    },
    {
      id: 13,
      employeeId: 477,
      employee: { firstName: "Kemal", lastName: "Başar", position: "Team Lead", department: "Yazılım Geliştirme" },
      period: "2024-06",
      basicSalary: 35000,
      overtime: 0,
      bonus: 8500,
      deductions: 1200,
      tax: 7805,
      socialSecurity: 5600,
      notes: "Takım lideri performans bonusu",
      status: "ödendi",
      paymentDate: "2024-06-30",
      netSalary: 28895
    },
    {
      id: 14,
      employeeId: 478,
      employee: { firstName: "Gizem", lastName: "Avcı", position: "Content Manager", department: "Pazarlama" },
      period: "2024-06",
      basicSalary: 17500,
      overtime: 800,
      bonus: 2200,
      deductions: 350,
      tax: 3645,
      socialSecurity: 2928,
      notes: "İçerik stratejisi başarısı",
      status: "hazırlandı",
      paymentDate: null,
      netSalary: 13577
    },
    {
      id: 15,
      employeeId: 479,
      employee: { firstName: "Tolga", lastName: "Güven", position: "System Administrator", department: "Altyapı" },
      period: "2024-06",
      basicSalary: 24500,
      overtime: 3000,
      bonus: 3500,
      deductions: 500,
      tax: 5550,
      socialSecurity: 4400,
      notes: "Sistem güvenliği geliştirme",
      status: "ödendi",
      paymentDate: "2024-06-30",
      netSalary: 20550
    },
    {
      id: 16,
      employeeId: 480,
      employee: { firstName: "Merve", lastName: "Doğan", position: "Business Analyst", department: "İş Geliştirme" },
      period: "2024-06",
      basicSalary: 22500,
      overtime: 1400,
      bonus: 2800,
      deductions: 400,
      tax: 4695,
      socialSecurity: 3832,
      notes: "İş süreçleri optimizasyonu",
      status: "onay_bekliyor",
      paymentDate: null,
      netSalary: 16873
    },
    {
      id: 17,
      employeeId: 481,
      employee: { firstName: "Hakan", lastName: "Çetin", position: "Security Specialist", department: "Güvenlik" },
      period: "2024-06",
      basicSalary: 27000,
      overtime: 2400,
      bonus: 5500,
      deductions: 900,
      tax: 6210,
      socialSecurity: 4536,
      notes: "Siber güvenlik projesi bonusu",
      status: "ödendi",
      paymentDate: "2024-06-30",
      netSalary: 22754
    },
    {
      id: 18,
      employeeId: 482,
      employee: { firstName: "Elif", lastName: "Özdemir", position: "Graphic Designer", department: "Tasarım" },
      period: "2024-06",
      basicSalary: 16500,
      overtime: 600,
      bonus: 1800,
      deductions: 250,
      tax: 3375,
      socialSecurity: 2736,
      notes: "Kurumsal kimlik tasarımı",
      status: "ödendi",
      paymentDate: "2024-06-30",
      netSalary: 12539
    },
    {
      id: 19,
      employeeId: 483,
      employee: { firstName: "Murat", lastName: "Şen", position: "Database Administrator", department: "Altyapı" },
      period: "2024-06",
      basicSalary: 25500,
      overtime: 1800,
      bonus: 3200,
      deductions: 600,
      tax: 5400,
      socialSecurity: 4368,
      notes: "Veritabanı optimizasyonu",
      status: "hazırlandı",
      paymentDate: null,
      netSalary: 20130
    },
    {
      id: 20,
      employeeId: 484,
      employee: { firstName: "Sıla", lastName: "Kaplan", position: "HR Business Partner", department: "İnsan Kaynakları" },
      period: "2024-06",
      basicSalary: 23500,
      overtime: 0,
      bonus: 4000,
      deductions: 700,
      tax: 4905,
      socialSecurity: 3712,
      notes: "Çalışan memnuniyeti projesi",
      status: "ödendi",
      paymentDate: "2024-06-30",
      netSalary: 18183
    }
  ];

  // API'den veri gelmezse örnek verileri kullan
  const displayPayrolls = payrolls.length > 0 ? payrolls : samplePayrolls;

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"]
  });

  const form = useForm<PayrollFormData>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      employeeId: "",
      period: "",
      basicSalary: "",
      overtime: "0",
      bonus: "0",
      deductions: "0",
      tax: "0",
      socialSecurity: "0",
      notes: ""
    }
  });

  const createPayrollMutation = useMutation({
    mutationFn: async (data: PayrollFormData) => {
      return apiRequest("/api/payroll", {
        method: "POST",
        body: JSON.stringify(data)
      });
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
      return apiRequest(`/api/payroll/${id}`, {
        method: "DELETE"
      });
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
    return displayPayrolls.filter((payroll: any) => {
      const matchesSearch = payroll.employee?.firstName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           payroll.employee?.lastName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           payroll.period?.toLowerCase()?.includes(searchTerm.toLowerCase());
      const matchesPeriod = periodFilter === "all" || payroll.period === periodFilter;
      return matchesSearch && matchesPeriod;
    });
  }, [displayPayrolls, searchTerm, periodFilter]);

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
    const basic = parseFloat(payroll.basicSalary || 0);
    const overtime = parseFloat(payroll.overtime || 0);
    const bonus = parseFloat(payroll.bonus || 0);
    const deductions = parseFloat(payroll.deductions || 0);
    const tax = parseFloat(payroll.tax || 0);
    const socialSecurity = parseFloat(payroll.socialSecurity || 0);
    
    return basic + overtime + bonus - deductions - tax - socialSecurity;
  };

  const getTotalPayroll = () => {
    return displayPayrolls.reduce((total: number, payroll: any) => total + calculateNetSalary(payroll), 0);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ödendi':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Ödendi</Badge>;
      case 'hazırlandı':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">📋 Hazırlandı</Badge>;
      case 'onay_bekliyor':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⏳ Onay Bekliyor</Badge>;
      case 'iptal':
        return <Badge className="bg-red-100 text-red-800 border-red-200">❌ İptal</Badge>;
      default:
        return <Badge variant="outline">Belirsiz</Badge>;
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bordro Yönetimi</h1>
            <p className="text-gray-600">Çalışan maaş ve bordro işlemlerini yönetin</p>
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
                        name="basicSalary"
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
                        name="overtime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Fazla Mesai (TL)</FormLabel>
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
                      <FormField
                        control={form.control}
                        name="deductions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Kesintiler (TL)</FormLabel>
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
                        name="tax"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Vergi (TL)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="socialSecurity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">SGK (TL)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} className="border-gray-300" />
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
                  <p className="text-3xl font-bold text-blue-900">{formatCurrency(getTotalPayroll())}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Ödenen Çalışan</p>
                  <p className="text-3xl font-bold text-green-900">{displayPayrolls.filter((p: any) => p.status === 'ödendi').length}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Ortalama Maaş</p>
                  <p className="text-3xl font-bold text-orange-900">
                    {displayPayrolls.length > 0 ? formatCurrency(getTotalPayroll() / displayPayrolls.length) : formatCurrency(0)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Bu Ay</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Çalışan ara veya dönem filtrele"
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
                    <th className="pb-3 text-sm font-medium text-gray-600">Fazla Mesai</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Prim/Bonus</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Kesintiler</th>
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
                      <td className="py-4">
                        <div className="text-gray-900 font-medium">{formatCurrency(payroll.basicSalary)}</div>
                        <div className="text-xs text-gray-500">{payroll.employee?.department}</div>
                      </td>
                      <td className="py-4">
                        <div className="text-gray-900">{formatCurrency(payroll.overtime || 0)}</div>
                        {payroll.overtime > 0 && <div className="text-xs text-blue-600">+{Math.round((payroll.overtime / payroll.basicSalary) * 100)}%</div>}
                      </td>
                      <td className="py-4">
                        <div className="text-gray-900">{formatCurrency(payroll.bonus || 0)}</div>
                        {payroll.bonus > 0 && <div className="text-xs text-green-600">{payroll.notes}</div>}
                      </td>
                      <td className="py-4">
                        <div className="text-gray-900">{formatCurrency((payroll.deductions || 0) + (payroll.tax || 0) + (payroll.socialSecurity || 0))}</div>
                        <div className="text-xs text-gray-500">
                          Vergi: {formatCurrency(payroll.tax || 0)} | SGK: {formatCurrency(payroll.socialSecurity || 0)}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="font-bold text-lg text-green-700">
                          {formatCurrency(payroll.netSalary || calculateNetSalary(payroll))}
                        </div>
                        <div className="text-xs text-gray-500">
                          Net: %{Math.round(((payroll.netSalary || calculateNetSalary(payroll)) / (payroll.basicSalary + (payroll.overtime || 0) + (payroll.bonus || 0))) * 100)}
                        </div>
                      </td>
                      <td className="py-4">
                        {getStatusBadge(payroll.status)}
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
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bordro kaydı bulunamadı</h3>
                <p className="text-gray-600">
                  {searchTerm || periodFilter !== "all" 
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