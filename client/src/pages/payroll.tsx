import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  CreditCard,
  DollarSign,
  Calculator,
  Users,
  Plus,
  Filter,
  Search,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Payroll {
  id: number;
  employeeId: number;
  payPeriod: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid';
  processedAt?: string;
  employee?: {
    firstName: string;
    lastName: string;
    department: string;
    position: string;
  };
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  salary: number;
}

export default function Payroll() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);

  const [newPayroll, setNewPayroll] = useState({
    employeeId: "",
    payPeriod: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    notes: ""
  });

  const { data: payrolls, isLoading } = useQuery({
    queryKey: ["/api/payroll"],
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  const createPayrollMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/payroll", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll"] });
      setIsAddModalOpen(false);
      setNewPayroll({
        employeeId: "",
        payPeriod: "",
        basicSalary: "",
        allowances: "",
        deductions: "",
        notes: ""
      });
      toast({
        title: "Başarılı",
        description: "Bordro kaydı oluşturuldu",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Bordro kaydı oluşturulurken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updatePayrollStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      apiRequest("PUT", `/api/payroll/${id}`, { status, processedAt: new Date().toISOString() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll"] });
      toast({
        title: "Başarılı",
        description: "Bordro durumu güncellendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Bordro durumu güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const filteredPayrolls = payrolls?.filter((payroll: Payroll) => {
    const matchesStatus = statusFilter === "all" || payroll.status === statusFilter;
    const matchesPeriod = periodFilter === "all" || payroll.payPeriod.includes(periodFilter);
    const matchesSearch = 
      payroll.employee?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.employee?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.employee?.department?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPeriod && matchesSearch;
  }) || [];

  const payPeriods = Array.from(new Set(payrolls?.map((payroll: Payroll) => payroll.payPeriod) || []));

  const handleAddPayroll = () => {
    const basicSalary = parseFloat(newPayroll.basicSalary) || 0;
    const allowances = parseFloat(newPayroll.allowances) || 0;
    const deductions = parseFloat(newPayroll.deductions) || 0;
    const netSalary = basicSalary + allowances - deductions;

    const payrollData = {
      ...newPayroll,
      employeeId: parseInt(newPayroll.employeeId),
      basicSalary,
      allowances,
      deductions,
      netSalary,
      status: 'draft' as const
    };
    createPayrollMutation.mutate(payrollData);
  };

  const handleProcessPayroll = (id: number) => {
    updatePayrollStatusMutation.mutate({ id, status: 'processed' });
  };

  const handlePayPayroll = (id: number) => {
    updatePayrollStatusMutation.mutate({ id, status: 'paid' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Taslak</Badge>;
      case 'processed':
        return <Badge className="bg-blue-100 text-blue-800">İşlendi</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Ödendi</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4 text-gray-500" />;
      case 'processed':
        return <Calculator className="h-4 w-4 text-blue-500" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const calculateTotalPayroll = () => {
    return filteredPayrolls.reduce((sum: number, payroll: Payroll) => sum + payroll.netSalary, 0);
  };

  const calculateAverageSalary = () => {
    if (filteredPayrolls.length === 0) return 0;
    return filteredPayrolls.reduce((sum: number, payroll: Payroll) => sum + payroll.netSalary, 0) / filteredPayrolls.length;
  };

  const getDepartmentStats = () => {
    const deptStats: { [key: string]: { total: number; count: number; avg: number } } = {};
    
    filteredPayrolls.forEach((payroll: Payroll) => {
      const dept = payroll.employee?.department || 'Bilinmeyen';
      if (!deptStats[dept]) {
        deptStats[dept] = { total: 0, count: 0, avg: 0 };
      }
      deptStats[dept].total += payroll.netSalary;
      deptStats[dept].count += 1;
      deptStats[dept].avg = deptStats[dept].total / deptStats[dept].count;
    });

    return Object.entries(deptStats).map(([dept, stats]) => ({ 
      department: dept, 
      ...stats 
    }));
  };

  const statsCards = [
    {
      title: "Toplam Bordro",
      value: `₺${calculateTotalPayroll().toLocaleString('tr-TR')}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Ortalama Maaş",
      value: `₺${calculateAverageSalary().toLocaleString('tr-TR')}`,
      icon: Calculator,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "İşlenmiş Bordrolar",
      value: payrolls?.filter((p: Payroll) => p.status === 'processed').length || 0,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Ödenen Bordrolar",
      value: payrolls?.filter((p: Payroll) => p.status === 'paid').length || 0,
      icon: CheckCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <Header 
        title="Bordro Yönetimi" 
        subtitle="Çalışan maaşlarını hesaplayın ve yönetin" 
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
                    <p className="text-2xl font-bold text-gray-900">
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
                  <SelectItem value="draft">Taslak</SelectItem>
                  <SelectItem value="processed">İşlendi</SelectItem>
                  <SelectItem value="paid">Ödendi</SelectItem>
                </SelectContent>
              </Select>

              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Dönem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Dönemler</SelectItem>
                  {payPeriods.map((period) => (
                    <SelectItem key={period} value={period}>{period}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Bordro Raporu
              </Button>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Bordro
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Yeni Bordro Kaydı Oluştur</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="employee">Çalışan</Label>
                      <Select value={newPayroll.employeeId} onValueChange={(value) => {
                        setNewPayroll({ ...newPayroll, employeeId: value });
                        const selectedEmp = employees?.find((emp: Employee) => emp.id.toString() === value);
                        if (selectedEmp) {
                          setNewPayroll(prev => ({ ...prev, basicSalary: selectedEmp.salary.toString() }));
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Çalışan seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees?.map((emp: Employee) => (
                            <SelectItem key={emp.id} value={emp.id.toString()}>
                              {emp.firstName} {emp.lastName} - {emp.department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payPeriod">Bordro Dönemi</Label>
                      <Input
                        id="payPeriod"
                        value={newPayroll.payPeriod}
                        onChange={(e) => setNewPayroll({ ...newPayroll, payPeriod: e.target.value })}
                        placeholder="Örn: 2024-01"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="basicSalary">Temel Maaş (₺)</Label>
                        <Input
                          id="basicSalary"
                          type="number"
                          value={newPayroll.basicSalary}
                          onChange={(e) => setNewPayroll({ ...newPayroll, basicSalary: e.target.value })}
                          placeholder="50000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="allowances">Ek Ödemeler (₺)</Label>
                        <Input
                          id="allowances"
                          type="number"
                          value={newPayroll.allowances}
                          onChange={(e) => setNewPayroll({ ...newPayroll, allowances: e.target.value })}
                          placeholder="5000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deductions">Kesintiler (₺)</Label>
                        <Input
                          id="deductions"
                          type="number"
                          value={newPayroll.deductions}
                          onChange={(e) => setNewPayroll({ ...newPayroll, deductions: e.target.value })}
                          placeholder="10000"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-blue-900">Net Maaş:</span>
                        <span className="text-xl font-bold text-blue-900">
                          ₺{(
                            (parseFloat(newPayroll.basicSalary) || 0) + 
                            (parseFloat(newPayroll.allowances) || 0) - 
                            (parseFloat(newPayroll.deductions) || 0)
                          ).toLocaleString('tr-TR')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notlar (Opsiyonel)</Label>
                      <Textarea
                        id="notes"
                        value={newPayroll.notes}
                        onChange={(e) => setNewPayroll({ ...newPayroll, notes: e.target.value })}
                        placeholder="Bordro ile ilgili notlar..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      İptal
                    </Button>
                    <Button 
                      onClick={handleAddPayroll} 
                      disabled={createPayrollMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createPayrollMutation.isPending ? "Oluşturuluyor..." : "Oluştur"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payroll List */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                Bordro Kayıtları
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : filteredPayrolls.length > 0 ? (
                <div className="space-y-4">
                  {filteredPayrolls.map((payroll: Payroll) => (
                    <div key={payroll.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                              {payroll.employee?.firstName?.[0]}{payroll.employee?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {payroll.employee?.firstName} {payroll.employee?.lastName}
                              </h3>
                              {getStatusBadge(payroll.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {payroll.employee?.department} • {payroll.employee?.position}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Dönem: {payroll.payPeriod}</span>
                              {payroll.processedAt && (
                                <span>İşlenme: {new Date(payroll.processedAt).toLocaleDateString('tr-TR')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            ₺{payroll.netSalary.toLocaleString('tr-TR')}
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(payroll.status)}
                            {payroll.status === 'draft' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleProcessPayroll(payroll.id)}
                                disabled={updatePayrollStatusMutation.isPending}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                İşle
                              </Button>
                            )}
                            {payroll.status === 'processed' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handlePayPayroll(payroll.id)}
                                disabled={updatePayrollStatusMutation.isPending}
                                className="text-green-600 hover:text-green-700"
                              >
                                Öde
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedPayroll(payroll);
                                setIsViewModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">Bordro kaydı bulunamadı</p>
                  <p className="text-gray-400">Arama kriterlerinizi değiştirin veya yeni bordro oluşturun</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Department Payroll Stats */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
              Departman İstatistikleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getDepartmentStats().map((dept, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{dept.department}</h3>
                    <Badge variant="secondary">{dept.count} kişi</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Toplam:</span>
                      <span className="font-medium">₺{dept.total.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ortalama:</span>
                      <span className="font-medium text-blue-600">₺{dept.avg.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Payroll Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bordro Detayları</DialogTitle>
          </DialogHeader>
          {selectedPayroll && (
            <div className="space-y-6 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xl">
                    {selectedPayroll.employee?.firstName?.[0]}{selectedPayroll.employee?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedPayroll.employee?.firstName} {selectedPayroll.employee?.lastName}
                  </h2>
                  <p className="text-gray-600">{selectedPayroll.employee?.department} • {selectedPayroll.employee?.position}</p>
                  <p className="text-sm text-gray-500 mt-1">Dönem: {selectedPayroll.payPeriod}</p>
                </div>
                <div className="text-center">
                  {getStatusBadge(selectedPayroll.status)}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Maaş Detayları</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temel Maaş:</span>
                    <span className="font-medium">₺{selectedPayroll.basicSalary.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ek Ödemeler:</span>
                    <span className="font-medium text-green-600">+₺{selectedPayroll.allowances.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kesintiler:</span>
                    <span className="font-medium text-red-600">-₺{selectedPayroll.deductions.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Net Maaş:</span>
                      <span className="text-2xl font-bold text-green-600">₺{selectedPayroll.netSalary.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedPayroll.processedAt && (
                <div className="text-center text-sm text-gray-500">
                  İşlenme Tarihi: {new Date(selectedPayroll.processedAt).toLocaleDateString('tr-TR')}
                </div>
              )}

              {selectedPayroll.status === 'draft' && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button 
                    onClick={() => {
                      handleProcessPayroll(selectedPayroll.id);
                      setIsViewModalOpen(false);
                    }}
                    disabled={updatePayrollStatusMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    İşle
                  </Button>
                </div>
              )}

              {selectedPayroll.status === 'processed' && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button 
                    onClick={() => {
                      handlePayPayroll(selectedPayroll.id);
                      setIsViewModalOpen(false);
                    }}
                    disabled={updatePayrollStatusMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Öde
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}