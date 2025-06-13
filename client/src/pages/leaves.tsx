import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Check, X, Filter, Search, Clock, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Leave {
  id: number;
  employeeId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  employeeName?: string;
  department?: string;
}

export default function Leaves() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leaves = [], isLoading } = useQuery({
    queryKey: ["/api/leaves"],
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"],
  });

  const approveLeave = useMutation({
    mutationFn: async (leaveId: number) => {
      return apiRequest("PATCH", `/api/leaves/${leaveId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaves"] });
      toast({
        title: "İzin Onaylandı",
        description: "İzin talebi başarıyla onaylandı.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İzin onaylanırken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const rejectLeave = useMutation({
    mutationFn: async (leaveId: number) => {
      return apiRequest("PATCH", `/api/leaves/${leaveId}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaves"] });
      toast({
        title: "İzin Reddedildi",
        description: "İzin talebi reddedildi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İzin reddedilirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  // Çalışan bilgilerini izin verileriyle birleştir
  const enrichedLeaves = leaves.map((leave: Leave) => {
    const employee = employees.find((emp: any) => emp.id === leave.employeeId);
    return {
      ...leave,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : `Çalışan #${leave.employeeId}`,
      department: employee?.departmentId ? `Departman #${employee.departmentId}` : "Belirtilmemiş",
    };
  });

  // Filtreleme
  const filteredLeaves = enrichedLeaves.filter((leave: Leave) => {
    const matchesSearch = leave.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || leave.status === statusFilter;
    const matchesType = typeFilter === "all" || leave.leaveType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingLeaves = filteredLeaves.filter((leave: Leave) => leave.status === "pending");
  const approvedLeaves = filteredLeaves.filter((leave: Leave) => leave.status === "approved");
  const rejectedLeaves = filteredLeaves.filter((leave: Leave) => leave.status === "rejected");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Beklemede</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Onaylandı</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Reddedildi</Badge>;
      default:
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Bilinmiyor</Badge>;
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      "annual": "Yıllık İzin",
      "sick": "Hastalık İzni",
      "maternity": "Doğum İzni",
      "paternity": "Babalık İzni",
      "personal": "Kişisel İzin",
      "emergency": "Acil Durum İzni"
    };
    return types[type] || type;
  };

  // Yeni izin talebi mutation
  const createLeave = useMutation({
    mutationFn: async (leaveData: any) => {
      return apiRequest("/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaveData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaves"] });
      toast({
        title: "İzin Talebi Oluşturuldu",
        description: "İzin talebiniz başarıyla gönderildi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İzin talebi oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  // Yeni izin formu komponenti
  const NewLeaveForm = () => {
    const [leaveType, setLeaveType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");

    const calculateDays = () => {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
      }
      return 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!leaveType || !startDate || !endDate) {
        toast({
          title: "Eksik Bilgi",
          description: "Lütfen tüm gerekli alanları doldurun.",
          variant: "destructive",
        });
        return;
      }

      const days = calculateDays();
      createLeave.mutate({
        leaveType,
        startDate,
        endDate,
        days,
        reason,
        status: "pending",
        appliedDate: new Date().toISOString(),
      });

      // Form temizle
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="leaveType">İzin Türü</Label>
          <Select value={leaveType} onValueChange={setLeaveType}>
            <SelectTrigger>
              <SelectValue placeholder="İzin türü seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annual">Yıllık İzin</SelectItem>
              <SelectItem value="sick">Hastalık İzni</SelectItem>
              <SelectItem value="maternity">Doğum İzni</SelectItem>
              <SelectItem value="paternity">Babalık İzni</SelectItem>
              <SelectItem value="personal">Kişisel İzin</SelectItem>
              <SelectItem value="emergency">Acil Durum İzni</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Başlangıç Tarihi</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="endDate">Bitiş Tarihi</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {startDate && endDate && (
          <div className="p-3 bg-teal-50 rounded-lg">
            <p className="text-sm text-teal-700">
              <strong>Toplam İzin Süresi:</strong> {calculateDays()} gün
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="reason">Açıklama (İsteğe Bağlı)</Label>
          <Textarea
            id="reason"
            placeholder="İzin sebebinizi kısaca açıklayın..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={createLeave.isPending}
            className="flex-1 bg-teal-600 hover:bg-teal-700"
          >
            {createLeave.isPending ? "Gönderiliyor..." : "İzin Talebini Gönder"}
          </Button>
        </div>
      </form>
    );
  };

  const LeaveCard = ({ leave, showActions = false }: { leave: Leave; showActions?: boolean }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{leave.employeeName}</CardTitle>
            <CardDescription>{leave.department}</CardDescription>
          </div>
          {getStatusBadge(leave.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">İzin Türü</Label>
            <p className="text-sm">{getLeaveTypeLabel(leave.leaveType)}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">İzin Süresi</Label>
            <p className="text-sm">{leave.days} gün</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Başlangıç Tarihi</Label>
            <p className="text-sm">{new Date(leave.startDate).toLocaleDateString('tr-TR')}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Bitiş Tarihi</Label>
            <p className="text-sm">{new Date(leave.endDate).toLocaleDateString('tr-TR')}</p>
          </div>
        </div>
        
        {leave.reason && (
          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-600">Açıklama</Label>
            <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{leave.reason}</p>
          </div>
        )}

        <div className="mt-4">
          <Label className="text-sm font-medium text-gray-600">Başvuru Tarihi</Label>
          <p className="text-sm">{new Date(leave.appliedDate).toLocaleDateString('tr-TR')}</p>
        </div>

        {showActions && leave.status === "pending" && (
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={() => approveLeave.mutate(leave.id)}
              disabled={approveLeave.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Onayla
            </Button>
            <Button 
              onClick={() => rejectLeave.mutate(leave.id)}
              disabled={rejectLeave.isPending}
              variant="destructive"
            >
              <X className="w-4 h-4 mr-2" />
              Reddet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İzin Yönetimi</h1>
          <p className="text-gray-600">Çalışan izin talepleri ve onay işlemleri</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Calendar className="w-4 h-4 mr-2" />
                Yeni İzin Talebi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Yeni İzin Talebi</DialogTitle>
                <DialogDescription>
                  İzin talebinizi oluşturun
                </DialogDescription>
              </DialogHeader>
              <NewLeaveForm />
            </DialogContent>
          </Dialog>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {pendingLeaves.length} Bekleyen
          </Badge>
        </div>
      </div>

      {/* Filtreler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtreler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Arama</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Çalışan adı veya izin türü..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Durum</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="pending">Beklemede</SelectItem>
                  <SelectItem value="approved">Onaylandı</SelectItem>
                  <SelectItem value="rejected">Reddedildi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">İzin Türü</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tür seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="annual">Yıllık İzin</SelectItem>
                  <SelectItem value="sick">Hastalık İzni</SelectItem>
                  <SelectItem value="maternity">Doğum İzni</SelectItem>
                  <SelectItem value="paternity">Babalık İzni</SelectItem>
                  <SelectItem value="personal">Kişisel İzin</SelectItem>
                  <SelectItem value="emergency">Acil Durum İzni</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* İzin Talepleri Tablosu */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Tümü ({filteredLeaves.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Bekleyen ({pendingLeaves.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Onaylanan ({approvedLeaves.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Reddedilen ({rejectedLeaves.length})
          </TabsTrigger>
        </TabsList>

        {/* Tüm İzinler Tablosu */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Tüm İzin Talepleri</CardTitle>
              <CardDescription>Sistemdeki tüm izin talepleri tablo formatında</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Çalışan</TableHead>
                    <TableHead>İzin Türü</TableHead>
                    <TableHead>Başlangıç</TableHead>
                    <TableHead>Bitiş</TableHead>
                    <TableHead>Gün Sayısı</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaves.map((leave: Leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">{leave.employeeName}</TableCell>
                      <TableCell>{getLeaveTypeLabel(leave.leaveType)}</TableCell>
                      <TableCell>{new Date(leave.startDate).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{new Date(leave.endDate).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{leave.days} gün</TableCell>
                      <TableCell>{getStatusBadge(leave.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>İzin Talebi Detayları</DialogTitle>
                                <DialogDescription>
                                  {leave.employeeName} tarafından gönderilen izin talebi
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Çalışan</Label>
                                    <p className="text-sm font-medium">{leave.employeeName}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">İzin Türü</Label>
                                    <p className="text-sm">{getLeaveTypeLabel(leave.leaveType)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Başlangıç Tarihi</Label>
                                    <p className="text-sm">{new Date(leave.startDate).toLocaleDateString('tr-TR')}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Bitiş Tarihi</Label>
                                    <p className="text-sm">{new Date(leave.endDate).toLocaleDateString('tr-TR')}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Toplam Gün</Label>
                                    <p className="text-sm font-medium">{leave.days} gün</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Başvuru Tarihi</Label>
                                    <p className="text-sm">{new Date(leave.appliedDate).toLocaleDateString('tr-TR')}</p>
                                  </div>
                                </div>
                                
                                {leave.reason && (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Açıklama</Label>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm">{leave.reason}</p>
                                    </div>
                                  </div>
                                )}

                                {leave.status === "pending" && (
                                  <div className="flex gap-3 pt-4">
                                    <Button 
                                      onClick={() => {
                                        approveLeave.mutate(leave.id);
                                      }}
                                      disabled={approveLeave.isPending}
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="w-4 h-4 mr-2" />
                                      İzni Onayla
                                    </Button>
                                    <Button 
                                      onClick={() => {
                                        rejectLeave.mutate(leave.id);
                                      }}
                                      disabled={rejectLeave.isPending}
                                      variant="destructive"
                                      className="flex-1"
                                    >
                                      <X className="w-4 h-4 mr-2" />
                                      İzni Reddet
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          {leave.status === "pending" && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => approveLeave.mutate(leave.id)}
                                disabled={approveLeave.isPending}
                                className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => rejectLeave.mutate(leave.id)}
                                disabled={rejectLeave.isPending}
                                variant="destructive"
                                className="h-8 w-8 p-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredLeaves.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Filtre kriterlerine uygun izin bulunamadı.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Onay Bekleyen İzinler</CardTitle>
              <CardDescription>İK Müdürü onayı bekleyen izin talepleri</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Çalışan</TableHead>
                    <TableHead>İzin Türü</TableHead>
                    <TableHead>Başlangıç</TableHead>
                    <TableHead>Bitiş</TableHead>
                    <TableHead>Gün Sayısı</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingLeaves.map((leave: Leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">{leave.employeeName}</TableCell>
                      <TableCell>{getLeaveTypeLabel(leave.leaveType)}</TableCell>
                      <TableCell>{new Date(leave.startDate).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{new Date(leave.endDate).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{leave.days} gün</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>İzin Talebi Detayları</DialogTitle>
                                <DialogDescription>
                                  {leave.employeeName} tarafından gönderilen izin talebi
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Çalışan</Label>
                                    <p className="text-sm font-medium">{leave.employeeName}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">İzin Türü</Label>
                                    <p className="text-sm">{getLeaveTypeLabel(leave.leaveType)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Başlangıç Tarihi</Label>
                                    <p className="text-sm">{new Date(leave.startDate).toLocaleDateString('tr-TR')}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Bitiş Tarihi</Label>
                                    <p className="text-sm">{new Date(leave.endDate).toLocaleDateString('tr-TR')}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Toplam Gün</Label>
                                    <p className="text-sm font-medium">{leave.days} gün</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Başvuru Tarihi</Label>
                                    <p className="text-sm">{new Date(leave.appliedDate).toLocaleDateString('tr-TR')}</p>
                                  </div>
                                </div>
                                
                                {leave.reason && (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Açıklama</Label>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm">{leave.reason}</p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                  <Button 
                                    onClick={() => {
                                      approveLeave.mutate(leave.id);
                                    }}
                                    disabled={approveLeave.isPending}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    İzni Onayla
                                  </Button>
                                  <Button 
                                    onClick={() => {
                                      rejectLeave.mutate(leave.id);
                                    }}
                                    disabled={rejectLeave.isPending}
                                    variant="destructive"
                                    className="flex-1"
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    İzni Reddet
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            size="sm" 
                            onClick={() => approveLeave.mutate(leave.id)}
                            disabled={approveLeave.isPending}
                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => rejectLeave.mutate(leave.id)}
                            disabled={rejectLeave.isPending}
                            variant="destructive"
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pendingLeaves.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Onay bekleyen izin talebi bulunmuyor.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Onaylanmış İzinler</CardTitle>
              <CardDescription>Onaylanmış izin talepleri</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Çalışan</TableHead>
                    <TableHead>İzin Türü</TableHead>
                    <TableHead>Başlangıç</TableHead>
                    <TableHead>Bitiş</TableHead>
                    <TableHead>Gün Sayısı</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedLeaves.map((leave: Leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">{leave.employeeName}</TableCell>
                      <TableCell>{getLeaveTypeLabel(leave.leaveType)}</TableCell>
                      <TableCell>{new Date(leave.startDate).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{new Date(leave.endDate).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{leave.days} gün</TableCell>
                      <TableCell>{getStatusBadge(leave.status)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>İzin Talebi Detayları</DialogTitle>
                              <DialogDescription>
                                {leave.employeeName} tarafından gönderilen izin talebi
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Çalışan</Label>
                                  <p className="text-sm font-medium">{leave.employeeName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">İzin Türü</Label>
                                  <p className="text-sm">{getLeaveTypeLabel(leave.leaveType)}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Başlangıç Tarihi</Label>
                                  <p className="text-sm">{new Date(leave.startDate).toLocaleDateString('tr-TR')}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Bitiş Tarihi</Label>
                                  <p className="text-sm">{new Date(leave.endDate).toLocaleDateString('tr-TR')}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Toplam Gün</Label>
                                  <p className="text-sm font-medium">{leave.days} gün</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Başvuru Tarihi</Label>
                                  <p className="text-sm">{new Date(leave.appliedDate).toLocaleDateString('tr-TR')}</p>
                                </div>
                              </div>
                              
                              {leave.reason && (
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Açıklama</Label>
                                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm">{leave.reason}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {approvedLeaves.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Onaylanmış izin bulunmuyor.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Reddedilmiş İzinler</CardTitle>
              <CardDescription>Reddedilmiş izin talepleri</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Çalışan</TableHead>
                    <TableHead>İzin Türü</TableHead>
                    <TableHead>Başlangıç</TableHead>
                    <TableHead>Bitiş</TableHead>
                    <TableHead>Gün Sayısı</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rejectedLeaves.map((leave: Leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">{leave.employeeName}</TableCell>
                      <TableCell>{getLeaveTypeLabel(leave.leaveType)}</TableCell>
                      <TableCell>{new Date(leave.startDate).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{new Date(leave.endDate).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{leave.days} gün</TableCell>
                      <TableCell>{getStatusBadge(leave.status)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>İzin Talebi Detayları</DialogTitle>
                              <DialogDescription>
                                {leave.employeeName} tarafından gönderilen izin talebi
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Çalışan</Label>
                                  <p className="text-sm font-medium">{leave.employeeName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">İzin Türü</Label>
                                  <p className="text-sm">{getLeaveTypeLabel(leave.leaveType)}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Başlangıç Tarihi</Label>
                                  <p className="text-sm">{new Date(leave.startDate).toLocaleDateString('tr-TR')}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Bitiş Tarihi</Label>
                                  <p className="text-sm">{new Date(leave.endDate).toLocaleDateString('tr-TR')}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Toplam Gün</Label>
                                  <p className="text-sm font-medium">{leave.days} gün</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Başvuru Tarihi</Label>
                                  <p className="text-sm">{new Date(leave.appliedDate).toLocaleDateString('tr-TR')}</p>
                                </div>
                              </div>
                              
                              {leave.reason && (
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Açıklama</Label>
                                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm">{leave.reason}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {rejectedLeaves.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <XCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Reddedilmiş izin bulunmuyor.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}