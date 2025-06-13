import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Search, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  User,
  FileText,
  AlertCircle,
  TrendingUp
} from "lucide-react";

export default function LeaveManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["/api/employees"],
  });

  // Mock leave data for demonstration
  const leaveRequests = [
    {
      id: 1,
      employeeName: "Ahmet Yılmaz",
      leaveType: "annual",
      startDate: "2024-12-20",
      endDate: "2024-12-27",
      days: 7,
      status: "pending",
      reason: "Yıl sonu tatili",
      requestDate: "2024-12-10"
    },
    {
      id: 2,
      employeeName: "Ayşe Demir",
      leaveType: "sick",
      startDate: "2024-12-15",
      endDate: "2024-12-16",
      days: 2,
      status: "approved",
      reason: "Sağlık sorunu",
      requestDate: "2024-12-14"
    },
    {
      id: 3,
      employeeName: "Mehmet Kaya",
      leaveType: "personal",
      startDate: "2024-12-18",
      endDate: "2024-12-18",
      days: 1,
      status: "rejected",
      reason: "Kişisel işler",
      requestDate: "2024-12-12"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Beklemede</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Onaylandı</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Reddedildi</Badge>;
      default:
        return <Badge variant="lightgray">{status}</Badge>;
    }
  };

  const getLeaveTypeBadge = (type: string) => {
    switch (type) {
      case "annual":
        return <Badge variant="lightgray" className="text-blue-600">Yıllık İzin</Badge>;
      case "sick":
        return <Badge variant="lightgray" className="text-red-600">Hastalık İzni</Badge>;
      case "personal":
        return <Badge variant="lightgray" className="text-purple-600">Kişisel İzin</Badge>;
      case "maternity":
        return <Badge variant="lightgray" className="text-pink-600">Doğum İzni</Badge>;
      default:
        return <Badge variant="lightgray">{type}</Badge>;
    }
  };

  const filteredLeaves = leaveRequests.filter(leave => {
    const matchesSearch = leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            İzin Yönetimi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Çalışan izin taleplerini yönetin ve onaylayın
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              İzin Talebi Oluştur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Yeni İzin Talebi</DialogTitle>
              <DialogDescription>
                Çalışan için izin talebi oluşturun
              </DialogDescription>
            </DialogHeader>
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                İzin Sistemi Geliştiriliyor
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                İzin talep formu yakında eklenecek.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="İzin taleplerinde ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Durum filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="pending">Beklemede</SelectItem>
            <SelectItem value="approved">Onaylandı</SelectItem>
            <SelectItem value="rejected">Reddedildi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredLeaves.filter(leave => leave.status === "pending").length}
              </div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                Bekleyen Talepler
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredLeaves.filter(leave => leave.status === "approved").length}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Onaylanan
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full mr-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredLeaves.filter(leave => leave.status === "rejected").length}
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                Reddedilen
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredLeaves.reduce((sum, leave) => sum + leave.days, 0)}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Toplam Gün
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            İzin Talepleri
          </CardTitle>
          <CardDescription>
            Çalışan izin taleplerini inceleyin ve yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Çalışan</TableHead>
                  <TableHead>İzin Türü</TableHead>
                  <TableHead>Başlangıç</TableHead>
                  <TableHead>Bitiş</TableHead>
                  <TableHead>Gün Sayısı</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Neden</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {leave.employeeName}
                      </div>
                    </TableCell>
                    <TableCell>{getLeaveTypeBadge(leave.leaveType)}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(leave.startDate).toLocaleDateString("tr-TR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(leave.endDate).toLocaleDateString("tr-TR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="lightgray" className="text-blue-600">
                        {leave.days} gün
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {leave.reason}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {leave.status === "pending" && (
                          <>
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredLeaves.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  İzin talebi bulunamadı
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || statusFilter !== "all" 
                    ? "Arama kriterlerinize uygun izin talebi bulunamadı." 
                    : "Henüz hiç izin talebi oluşturulmamış."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}