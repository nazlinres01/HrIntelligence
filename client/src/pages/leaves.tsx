import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Check, X, Filter, Search, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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
      return apiRequest(`/api/leaves/${leaveId}/approve`, {
        method: "PATCH",
      });
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
      return apiRequest(`/api/leaves/${leaveId}/reject`, {
        method: "PATCH",
      });
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

      {/* İzin Talepleri Tabları */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
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

        <TabsContent value="pending">
          <div className="space-y-4">
            {pendingLeaves.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Bekleyen izin talebi bulunmuyor.</p>
                </CardContent>
              </Card>
            ) : (
              pendingLeaves.map((leave: Leave) => (
                <LeaveCard key={leave.id} leave={leave} showActions={true} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="space-y-4">
            {approvedLeaves.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Onaylanmış izin bulunmuyor.</p>
                </CardContent>
              </Card>
            ) : (
              approvedLeaves.map((leave: Leave) => (
                <LeaveCard key={leave.id} leave={leave} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="space-y-4">
            {rejectedLeaves.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <XCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Reddedilmiş izin bulunmuyor.</p>
                </CardContent>
              </Card>
            ) : (
              rejectedLeaves.map((leave: Leave) => (
                <LeaveCard key={leave.id} leave={leave} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}