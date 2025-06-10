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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Download,
  Eye,
  Check,
  X,
  User,
  FileText,
  CalendarDays
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Leave {
  id: number;
  employeeId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
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
}

export default function Leaves() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [newLeave, setNewLeave] = useState({
    employeeId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const { data: leaves, isLoading } = useQuery({
    queryKey: ["/api/leaves"],
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
  });

  const createLeaveMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/leaves", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaves"] });
      setIsAddModalOpen(false);
      setNewLeave({
        employeeId: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: ""
      });
      setStartDate(undefined);
      setEndDate(undefined);
      toast({
        title: "Başarılı",
        description: "İzin talebi oluşturuldu",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İzin talebi oluşturulurken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateLeaveStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      apiRequest("PUT", `/api/leaves/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaves"] });
      toast({
        title: "Başarılı",
        description: "İzin durumu güncellendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İzin durumu güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const filteredLeaves = useMemo(() => {
    if (!leaves || !Array.isArray(leaves)) return [];
    
    return leaves.filter((leave: Leave) => {
      const matchesStatus = statusFilter === "all" || leave.status === statusFilter;
      const matchesType = typeFilter === "all" || leave.leaveType === typeFilter;
      const matchesSearch = !searchTerm || 
        leave.employee?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.employee?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.employee?.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [leaves, statusFilter, typeFilter, searchTerm]);

  const leaveTypes = Array.from(new Set((leaves || []).map((leave: Leave) => leave.leaveType).filter(Boolean)));

  const handleAddLeave = () => {
    const leaveData = {
      employeeId: parseInt(newLeave.employeeId),
      leaveType: newLeave.leaveType,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      reason: newLeave.reason
    };
    createLeaveMutation.mutate(leaveData);
  };

  const handleApproveLeave = (id: number) => {
    updateLeaveStatusMutation.mutate({ id, status: 'approved' });
  };

  const handleRejectLeave = (id: number) => {
    updateLeaveStatusMutation.mutate({ id, status: 'rejected' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Beklemede</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Onaylandı</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Reddedildi</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'annual':
      case 'yıllık':
        return 'bg-blue-100 text-blue-800';
      case 'sick':
      case 'hastalık':
        return 'bg-red-100 text-red-800';
      case 'personal':
      case 'kişisel':
        return 'bg-purple-100 text-purple-800';
      case 'maternity':
      case 'doğum':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateLeaveDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const statsCards = [
    {
      title: "Toplam İzin Talebi",
      value: leaves?.length || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Bekleyen Talepler",
      value: leaves?.filter((leave: Leave) => leave.status === 'pending').length || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Onaylanan İzinler",
      value: leaves?.filter((leave: Leave) => leave.status === 'approved').length || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Aktif İzinler",
      value: leaves?.filter((leave: Leave) => {
        const today = new Date();
        const startDate = new Date(leave.startDate);
        const endDate = new Date(leave.endDate);
        return leave.status === 'approved' && startDate <= today && endDate >= today;
      }).length || 0,
      icon: CalendarDays,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <Header 
        title="İzin Yönetimi" 
        subtitle="Çalışan izin taleplerini yönetin ve takip edin" 
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
                    <p className="text-3xl font-bold text-gray-900">
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
                  <SelectItem value="pending">Beklemede</SelectItem>
                  <SelectItem value="approved">Onaylandı</SelectItem>
                  <SelectItem value="rejected">Reddedildi</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="İzin Türü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Türler</SelectItem>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Rapor İndir
              </Button>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni İzin Talebi
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Yeni İzin Talebi Oluştur</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="employee">Çalışan</Label>
                      <Select value={newLeave.employeeId} onValueChange={(value) => setNewLeave({ ...newLeave, employeeId: value })}>
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
                      <Label htmlFor="leaveType">İzin Türü</Label>
                      <Select value={newLeave.leaveType} onValueChange={(value) => setNewLeave({ ...newLeave, leaveType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="İzin türü seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="annual">Yıllık İzin</SelectItem>
                          <SelectItem value="sick">Hastalık İzni</SelectItem>
                          <SelectItem value="personal">Kişisel İzin</SelectItem>
                          <SelectItem value="maternity">Doğum İzni</SelectItem>
                          <SelectItem value="emergency">Acil Durum İzni</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Başlangıç Tarihi</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "PPP", { locale: tr }) : "Tarih seçin"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={(date) => {
                                setStartDate(date);
                                setNewLeave({ ...newLeave, startDate: date ? format(date, "yyyy-MM-dd") : "" });
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Bitiş Tarihi</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP", { locale: tr }) : "Tarih seçin"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={(date) => {
                                setEndDate(date);
                                setNewLeave({ ...newLeave, endDate: date ? format(date, "yyyy-MM-dd") : "" });
                              }}
                              disabled={(date) => startDate ? date < startDate : false}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">İzin Nedeni</Label>
                      <Textarea
                        id="reason"
                        value={newLeave.reason}
                        onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                        placeholder="İzin nedeninizi açıklayın..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      İptal
                    </Button>
                    <Button 
                      onClick={handleAddLeave} 
                      disabled={createLeaveMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createLeaveMutation.isPending ? "Oluşturuluyor..." : "Oluştur"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaves List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5 text-blue-600" />
            İzin Talepleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredLeaves.length > 0 ? (
            <div className="space-y-4">
              {filteredLeaves.map((leave: Leave) => (
                <div key={leave.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                          {leave.employee?.firstName?.[0]}{leave.employee?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {leave.employee?.firstName} {leave.employee?.lastName}
                          </h3>
                          {getStatusBadge(leave.status)}
                          <Badge className={getLeaveTypeColor(leave.leaveType)}>
                            {leave.leaveType}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {leave.employee?.department} • {leave.employee?.position}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(leave.startDate).toLocaleDateString('tr-TR')} - {new Date(leave.endDate).toLocaleDateString('tr-TR')}
                          </span>
                          <span>
                            {calculateLeaveDays(leave.startDate, leave.endDate)} gün
                          </span>
                          <span>
                            {new Date(leave.createdAt).toLocaleDateString('tr-TR')} tarihinde talep edildi
                          </span>
                        </div>
                        {leave.reason && (
                          <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-700">
                            <strong>Neden:</strong> {leave.reason}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(leave.status)}
                      {leave.status === 'pending' && (
                        <div className="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleApproveLeave(leave.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            disabled={updateLeaveStatusMutation.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejectLeave(leave.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={updateLeaveStatusMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedLeave(leave);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">İzin talebi bulunamadı</p>
              <p className="text-gray-400">Arama kriterlerinizi değiştirin veya yeni izin talebi oluşturun</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Leave Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>İzin Talebi Detayları</DialogTitle>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-6 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xl">
                    {selectedLeave.employee?.firstName?.[0]}{selectedLeave.employee?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedLeave.employee?.firstName} {selectedLeave.employee?.lastName}
                  </h2>
                  <p className="text-gray-600">{selectedLeave.employee?.department} • {selectedLeave.employee?.position}</p>
                </div>
                <div className="text-center">
                  {getStatusBadge(selectedLeave.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">İzin Türü</Label>
                    <div className="mt-1">
                      <Badge className={getLeaveTypeColor(selectedLeave.leaveType)}>
                        {selectedLeave.leaveType}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Başlangıç Tarihi</Label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedLeave.startDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Bitiş Tarihi</Label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedLeave.endDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">İzin Süresi</Label>
                    <p className="text-gray-900 mt-1 text-2xl font-bold">
                      {calculateLeaveDays(selectedLeave.startDate, selectedLeave.endDate)} gün
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Talep Tarihi</Label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedLeave.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Durum</Label>
                    <div className="mt-1 flex items-center space-x-2">
                      {getStatusIcon(selectedLeave.status)}
                      {getStatusBadge(selectedLeave.status)}
                    </div>
                  </div>
                </div>
              </div>

              {selectedLeave.reason && (
                <div>
                  <Label className="text-sm font-medium text-gray-500 mb-2 block">İzin Nedeni</Label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{selectedLeave.reason}</p>
                  </div>
                </div>
              )}

              {selectedLeave.status === 'pending' && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleRejectLeave(selectedLeave.id);
                      setIsViewModalOpen(false);
                    }}
                    disabled={updateLeaveStatusMutation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reddet
                  </Button>
                  <Button 
                    onClick={() => {
                      handleApproveLeave(selectedLeave.id);
                      setIsViewModalOpen(false);
                    }}
                    disabled={updateLeaveStatusMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Onayla
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