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
  CalendarDays, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Users,
  FileText,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  BarChart3
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const leaveSchema = z.object({
  employeeId: z.string().min(1, "Çalışan seçimi gerekli"),
  leaveType: z.string().min(1, "İzin türü seçimi gerekli"),
  startDate: z.string().min(1, "Başlangıç tarihi gerekli"),
  endDate: z.string().min(1, "Bitiş tarihi gerekli"),
  reason: z.string().min(10, "En az 10 karakter açıklama gerekli"),
  status: z.string().default("pending")
});

type LeaveFormData = z.infer<typeof leaveSchema>;

export default function LeavesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leaves = [], isLoading: leavesLoading } = useQuery<any[]>({
    queryKey: ["/api/leaves"]
  });

  const { data: employees = [] } = useQuery<any[]>({
    queryKey: ["/api/employees"]
  });

  const form = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      employeeId: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
      status: "pending"
    }
  });

  const createLeaveMutation = useMutation({
    mutationFn: async (data: LeaveFormData) => {
      return apiRequest("POST", "/api/leaves", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaves"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "İzin talebi başarıyla oluşturuldu",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İzin talebi oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const deleteLeaveMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/leaves/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaves"] });
      toast({
        title: "Başarılı",
        description: "İzin talebi başarıyla silindi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İzin talebi silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (data: LeaveFormData) => {
    createLeaveMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu izin talebini silmek istediğinizden emin misiniz?")) {
      deleteLeaveMutation.mutate(id);
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = (employees as any[]).find((emp: any) => emp.id.toString() === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Bilinmeyen Çalışan';
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Beklemede' },
      'approved': { color: 'bg-green-100 text-green-800', text: 'Onaylandı' },
      'rejected': { color: 'bg-red-100 text-red-800', text: 'Reddedildi' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || { color: 'bg-gray-100 text-gray-800', text: status };
    return <Badge className={statusInfo.color}>{statusInfo.text}</Badge>;
  };

  const getLeaveTypeDisplayName = (type: string) => {
    const typeMap = {
      'annual': 'Yıllık İzin',
      'sick': 'Hastalık İzni',
      'maternity': 'Doğum İzni',
      'paternity': 'Babalık İzni',
      'personal': 'Kişisel İzin',
      'emergency': 'Acil İzin'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const filteredLeaves = (leaves as any[]).filter((leave: any) => {
    const employeeName = getEmployeeName(leave.employeeId);
    const matchesSearch = employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || leave.status === statusFilter;
    const matchesType = typeFilter === "all" || leave.leaveType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Analytics calculations
  const getLeaveStats = () => {
    const totalLeaves = (leaves as any[]).length;
    const pendingLeaves = (leaves as any[]).filter((leave: any) => leave.status === 'pending').length;
    const approvedLeaves = (leaves as any[]).filter((leave: any) => leave.status === 'approved').length;
    const rejectedLeaves = (leaves as any[]).filter((leave: any) => leave.status === 'rejected').length;

    return {
      totalLeaves,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      approvalRate: totalLeaves > 0 ? Math.round((approvedLeaves / totalLeaves) * 100) : 0
    };
  };

  const stats = getLeaveStats();

  if (leavesLoading) {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">İzin & Devamsızlık</h1>
            <p className="text-gray-600">Çalışan izin talepleri ve devamsızlık yönetimi</p>
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
                  Yeni İzin Talebi
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Yeni İzin Talebi</DialogTitle>
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
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Çalışan seçin" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {(employees as any[]).map((employee: any) => (
                                    <SelectItem key={employee.id} value={employee.id.toString()}>
                                      {employee.firstName} {employee.lastName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="leaveType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">İzin Türü</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="İzin türü seçin" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="annual">Yıllık İzin</SelectItem>
                                  <SelectItem value="sick">Hastalık İzni</SelectItem>
                                  <SelectItem value="maternity">Doğum İzni</SelectItem>
                                  <SelectItem value="paternity">Babalık İzni</SelectItem>
                                  <SelectItem value="personal">Kişisel İzin</SelectItem>
                                  <SelectItem value="emergency">Acil İzin</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Başlangıç Tarihi</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="border-gray-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Bitiş Tarihi</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="border-gray-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Açıklama</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="İzin nedenini açıklayın"
                              {...field}
                              className="border-gray-300"
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-3">
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
                        disabled={createLeaveMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {createLeaveMutation.isPending ? "Oluşturuluyor..." : "İzin Talebi Oluştur"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium mb-1">Toplam İzin</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalLeaves}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium mb-1">Bekleyen Talepler</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.pendingLeaves}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium mb-1">Onaylanan</p>
                  <p className="text-2xl font-bold text-green-900">{stats.approvedLeaves}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium mb-1">Onay Oranı</p>
                  <p className="text-2xl font-bold text-purple-900">%{stats.approvalRate}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Çalışan veya açıklama ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Durum filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="pending">Beklemede</SelectItem>
              <SelectItem value="approved">Onaylandı</SelectItem>
              <SelectItem value="rejected">Reddedildi</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Tür filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Türler</SelectItem>
              <SelectItem value="annual">Yıllık İzin</SelectItem>
              <SelectItem value="sick">Hastalık İzni</SelectItem>
              <SelectItem value="maternity">Doğum İzni</SelectItem>
              <SelectItem value="paternity">Babalık İzni</SelectItem>
              <SelectItem value="personal">Kişisel İzin</SelectItem>
              <SelectItem value="emergency">Acil İzin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Leaves Table */}
        <Card className="bg-white border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900">İzin Talepleri</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Çalışan</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">İzin Türü</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Başlangıç</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Bitiş</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeaves.map((leave: any, index) => (
                    <tr key={leave.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {getEmployeeName(leave.employeeId)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className="bg-blue-100 text-blue-800">
                          {getLeaveTypeDisplayName(leave.leaveType)}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {leave.startDate}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {leave.endDate}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(leave.status)}
                      </td>
                      <td className="py-4 px-6">
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
                            onClick={() => handleDelete(leave.id)}
                            className="text-red-600 hover:bg-red-50"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}