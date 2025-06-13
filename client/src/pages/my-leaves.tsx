import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  CalendarDays,
  User
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

const leaveSchema = z.object({
  type: z.string().min(1, "İzin türü seçiniz"),
  startDate: z.string().min(1, "Başlangıç tarihi seçiniz"),
  endDate: z.string().min(1, "Bitiş tarihi seçiniz"),
  reason: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  isHalfDay: z.boolean().optional()
});

type LeaveFormData = z.infer<typeof leaveSchema>;

const leaveTypes = [
  { value: "annual", label: "Yıllık İzin", color: "bg-blue-100 text-blue-800" },
  { value: "sick", label: "Hastalık İzni", color: "bg-red-100 text-red-800" },
  { value: "maternity", label: "Doğum İzni", color: "bg-pink-100 text-pink-800" },
  { value: "paternity", label: "Babalık İzni", color: "bg-green-100 text-green-800" },
  { value: "emergency", label: "Acil Durum İzni", color: "bg-orange-100 text-orange-800" },
  { value: "personal", label: "Kişisel İzin", color: "bg-purple-100 text-purple-800" }
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

export default function MyLeaves() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Mock data for employee leaves
  const mockLeaves = [
    {
      id: 1,
      type: "annual",
      startDate: "2024-07-15",
      endDate: "2024-07-20",
      reason: "Yaz tatili için aile ile birlikte deniz kenarında dinlenmek",
      status: "approved",
      approvedBy: "Ali Özkan",
      approvedDate: "2024-06-10",
      days: 5,
      isHalfDay: false
    },
    {
      id: 2,
      type: "sick",
      startDate: "2024-06-20",
      endDate: "2024-06-22",
      reason: "Grip nedeniyle dinlenme ihtiyacı",
      status: "approved",
      approvedBy: "Ali Özkan",
      approvedDate: "2024-06-20",
      days: 3,
      isHalfDay: false
    },
    {
      id: 3,
      type: "personal",
      startDate: "2024-08-10",
      endDate: "2024-08-10",
      reason: "Kişisel işler için yarım gün izin",
      status: "pending",
      approvedBy: null,
      approvedDate: null,
      days: 0.5,
      isHalfDay: true
    }
  ];

  const form = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      type: "",
      startDate: "",
      endDate: "",
      reason: "",
      isHalfDay: false
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
        description: "İzin talebiniz başarıyla oluşturuldu",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "İzin talebi oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: LeaveFormData) => {
    createLeaveMutation.mutate(data);
  };

  const getLeaveTypeLabel = (type: string) => {
    return leaveTypes.find(lt => lt.value === type)?.label || type;
  };

  const getLeaveTypeColor = (type: string) => {
    return leaveTypes.find(lt => lt.value === type)?.color || "bg-gray-100 text-gray-800";
  };

  const filteredLeaves = selectedFilter === "all" 
    ? mockLeaves 
    : mockLeaves.filter(leave => leave.status === selectedFilter);

  const leaveStats = {
    totalUsed: mockLeaves.filter(l => l.status === "approved").reduce((sum, l) => sum + l.days, 0),
    totalAllowed: 20,
    pending: mockLeaves.filter(l => l.status === "pending").length,
    approved: mockLeaves.filter(l => l.status === "approved").length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İzin Talepleri</h1>
          <p className="text-gray-600">İzin taleplerinizi yönetin ve takip edin</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <Plus className="w-4 h-4 mr-2" />
              Yeni İzin Talebi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Yeni İzin Talebi</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İzin Türü</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="İzin türü seçiniz" />
                          </SelectTrigger>
                          <SelectContent>
                            {leaveTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
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
                        <FormLabel>Başlangıç Tarihi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        <FormLabel>Bitiş Tarihi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="İzin talebinizin nedenini açıklayınız" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">
                    Talep Oluştur
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kullanılan İzin</p>
                <p className="text-lg font-semibold text-gray-900">
                  {leaveStats.totalUsed}/{leaveStats.totalAllowed} gün
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Onaylanan</p>
                <p className="text-lg font-semibold text-gray-900">{leaveStats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Beklemede</p>
                <p className="text-lg font-semibold text-gray-900">{leaveStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CalendarDays className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kalan İzin</p>
                <p className="text-lg font-semibold text-gray-900">
                  {leaveStats.totalAllowed - leaveStats.totalUsed} gün
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={selectedFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("all")}
          className={selectedFilter === "all" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
        >
          Tümü
        </Button>
        <Button
          variant={selectedFilter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("pending")}
          className={selectedFilter === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
        >
          Beklemede
        </Button>
        <Button
          variant={selectedFilter === "approved" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("approved")}
          className={selectedFilter === "approved" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
        >
          Onaylanan
        </Button>
        <Button
          variant={selectedFilter === "rejected" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("rejected")}
          className={selectedFilter === "rejected" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
        >
          Reddedilen
        </Button>
      </div>

      {/* Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle>İzin Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeaves.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Bu kategoride izin talebi bulunmuyor</p>
              </div>
            ) : (
              filteredLeaves.map((leave) => (
                <div key={leave.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getLeaveTypeColor(leave.type)}>
                          {getLeaveTypeLabel(leave.type)}
                        </Badge>
                        <Badge className={statusColors[leave.status as keyof typeof statusColors]}>
                          {statusLabels[leave.status as keyof typeof statusLabels]}
                        </Badge>
                        {leave.isHalfDay && (
                          <Badge variant="outline" className="text-xs">
                            Yarım Gün
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(leave.startDate), "dd/MM/yyyy")} - {" "}
                            {format(new Date(leave.endDate), "dd/MM/yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{leave.days} gün</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {leave.status === "approved" && leave.approvedBy && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{leave.approvedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Açıklama:</strong> {leave.reason}
                  </div>
                  {leave.status === "pending" && (
                    <div className="flex items-center gap-2 text-sm text-yellow-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>Yönetici onayı bekleniyor</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}