import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Clock, FileText, Plus, Search, Filter, Download, UserCheck, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const leaveSchema = z.object({
  employeeId: z.string().min(1, "Çalışan seçimi gerekli"),
  type: z.string().min(1, "İzin türü seçimi gerekli"),
  startDate: z.string().min(1, "Başlangıç tarihi gerekli"),
  endDate: z.string().min(1, "Bitiş tarihi gerekli"),
  reason: z.string().min(10, "En az 10 karakter açıklama gerekli"),
  status: z.string().default("pending")
});

type LeaveFormData = z.infer<typeof leaveSchema>;

const leaveTypes = [
  { value: "annual", label: "Yıllık İzin" },
  { value: "sick", label: "Hastalık İzni" },
  { value: "maternity", label: "Doğum İzni" },
  { value: "paternity", label: "Babalık İzni" },
  { value: "personal", label: "Kişisel İzin" },
  { value: "emergency", label: "Acil Durum İzni" },
  { value: "unpaid", label: "Ücretsiz İzin" }
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800"
};

const statusLabels = {
  pending: "Beklemede",
  approved: "Onaylandı",
  rejected: "Reddedildi"
};

export default function Leaves() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      employeeId: "",
      type: "",
      startDate: "",
      endDate: "",
      reason: "",
      status: "pending"
    }
  });

  // Fetch leaves
  const { data: leaves = [], isLoading: leavesLoading } = useQuery({
    queryKey: ["/api/leaves"]
  });

  // Fetch employees for dropdown
  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"]
  });

  // Leave statistics
  const leaveStats = React.useMemo(() => {
    const total = leaves.length;
    const pending = leaves.filter((leave: any) => leave.status === 'pending').length;
    const approved = leaves.filter((leave: any) => leave.status === 'approved').length;
    const rejected = leaves.filter((leave: any) => leave.status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  }, [leaves]);

  // Filter leaves
  const filteredLeaves = React.useMemo(() => {
    return leaves.filter((leave: any) => {
      const matchesSearch = leave.employee?.firstName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           leave.employee?.lastName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           leave.type?.toLowerCase()?.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || leave.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leaves, searchTerm, statusFilter]);

  // Create leave mutation
  const createLeaveMutation = useMutation({
    mutationFn: async (data: LeaveFormData) => {
      const response = await apiRequest("POST", "/api/leaves", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaves"] });
      toast({
        title: "İzin talebi oluşturuldu",
        description: "İzin talebi başarıyla kaydedildi."
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "İzin talebi oluşturulurken hata oluştu",
        variant: "destructive"
      });
    }
  });

  // Update leave status mutation
  const updateLeaveStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/leaves/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaves"] });
      toast({
        title: "İzin durumu güncellendi",
        description: "İzin durumu başarıyla değiştirildi."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "İzin durumu güncellenirken hata oluştu",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (data: LeaveFormData) => {
    createLeaveMutation.mutate(data);
  };

  const handleStatusUpdate = (id: string, status: string) => {
    updateLeaveStatusMutation.mutate({ id, status });
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">İzin ve Devamsızlık Yönetimi</h1>
            <p className="text-gray-600">Çalışan izin taleplerini yönetin ve takip edin</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Yeni İzin Talebi
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Yeni İzin Talebi</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Çalışan için yeni izin talebi oluşturun
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Çalışan</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-gray-300">
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
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">İzin Türü</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-gray-300">
                              <SelectValue placeholder="İzin türü seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            {leaveTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Başlangıç Tarihi</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="bg-white border-gray-300" />
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
                            <Input type="date" {...field} className="bg-white border-gray-300" />
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
                            className="bg-white border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="border-gray-300"
                    >
                      İptal
                    </Button>
                    <Button
                      type="submit"
                      disabled={createLeaveMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {createLeaveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Toplam İzin</CardTitle>
              <CalendarDays className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{leaveStats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Beklemede</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{leaveStats.pending}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Onaylandı</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{leaveStats.approved}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Reddedildi</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{leaveStats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-gray-200 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Çalışan adı veya izin türü ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-300"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-white border-gray-300">
                  <SelectValue placeholder="Durum filtrele" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="pending">Beklemede</SelectItem>
                  <SelectItem value="approved">Onaylandı</SelectItem>
                  <SelectItem value="rejected">Reddedildi</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-gray-300">
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Leaves List */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">İzin Talepleri</CardTitle>
            <CardDescription className="text-gray-600">
              Çalışan izin taleplerini görüntüleyin ve yönetin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLeaves.map((leave: any) => (
                <div key={leave.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <CalendarDays className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {leave.employee?.firstName} {leave.employee?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {leaveTypes.find(t => t.value === leave.type)?.label} - 
                        {leave.startDate && leave.endDate && 
                          ` ${format(new Date(leave.startDate), 'dd MMM yyyy', { locale: tr })} - ${format(new Date(leave.endDate), 'dd MMM yyyy', { locale: tr })}`
                        }
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{leave.reason}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={statusColors[leave.status as keyof typeof statusColors]}>
                      {statusLabels[leave.status as keyof typeof statusLabels]}
                    </Badge>
                    
                    {leave.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(leave.id, 'approved')}
                          className="text-green-600 border-green-300 hover:bg-green-50"
                        >
                          Onayla
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(leave.id, 'rejected')}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Reddet
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {filteredLeaves.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Henüz izin talebi bulunmuyor</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}