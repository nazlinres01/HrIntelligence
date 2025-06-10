import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const { data: myLeaves } = useQuery({
    queryKey: ["/api/my-leaves"],
  });

  const { data: myProfile } = useQuery({
    queryKey: ["/api/my-profile"],
  });

  const createLeaveMutation = useMutation({
    mutationFn: async (data: typeof leaveForm) => {
      const res = await apiRequest("POST", "/api/leaves", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "İzin talebi oluşturuldu",
        description: "İzin talebiniz başarıyla gönderildi.",
      });
      setIsLeaveDialogOpen(false);
      setLeaveForm({ type: "", startDate: "", endDate: "", reason: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/my-leaves"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLeaveMutation.mutate(leaveForm);
  };

  const pendingLeaves = (myLeaves as any)?.filter((leave: any) => leave.status === "pending") || [];
  const approvedLeaves = (myLeaves as any)?.filter((leave: any) => leave.status === "approved") || [];
  const rejectedLeaves = (myLeaves as any)?.filter((leave: any) => leave.status === "rejected") || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Çalışan Paneli</h1>
              <p className="text-emerald-100">
                Hoş geldiniz, {(user as any)?.firstName} {(user as any)?.lastName}
              </p>
              <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                Çalışan
              </Badge>
            </div>
          </div>
          <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Plus className="h-4 w-4 mr-2" />
                İzin Talebi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni İzin Talebi</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleLeaveSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">İzin Türü</Label>
                  <Select value={leaveForm.type} onValueChange={(value) => setLeaveForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="İzin türü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Yıllık İzin</SelectItem>
                      <SelectItem value="sick">Hastalık İzni</SelectItem>
                      <SelectItem value="personal">Kişisel İzin</SelectItem>
                      <SelectItem value="maternity">Doğum İzni</SelectItem>
                      <SelectItem value="paternity">Babalık İzni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Bitiş Tarihi</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm(prev => ({ ...prev, endDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">İzin Nedeni</Label>
                  <Textarea
                    id="reason"
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="İzin nedeninizi açıklayın..."
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={createLeaveMutation.isPending}>
                    {createLeaveMutation.isPending ? "Gönderiliyor..." : "Talebi Gönder"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>
                    İptal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Bekleyen İzinler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {pendingLeaves.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Onay bekleyen talepler</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Onaylanan İzinler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {approvedLeaves.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Bu yıl onaylanan</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <XCircle className="h-4 w-4 mr-2" />
              Reddedilen İzinler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {rejectedLeaves.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Bu yıl reddedilen</p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
              Bekleyen İzin Taleplerim
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingLeaves.length > 0 ? (
              <div className="space-y-3">
                {pendingLeaves.map((leave: any) => (
                  <div key={leave.id} className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{leave.type}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(leave.startDate).toLocaleDateString('tr-TR')} - 
                          {new Date(leave.endDate).toLocaleDateString('tr-TR')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{leave.reason}</p>
                      </div>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        Bekliyor
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Bekleyen izin talebiniz bulunmuyor</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Onaylanan İzinlerim
            </CardTitle>
          </CardHeader>
          <CardContent>
            {approvedLeaves.length > 0 ? (
              <div className="space-y-3">
                {approvedLeaves.slice(0, 5).map((leave: any) => (
                  <div key={leave.id} className="p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{leave.type}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(leave.startDate).toLocaleDateString('tr-TR')} - 
                          {new Date(leave.endDate).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Onaylandı
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Onaylanan izniniz bulunmuyor</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Profilim</h3>
            <p className="text-sm text-gray-500">Kişisel bilgilerinizi görüntüle ve düzenle</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">İzin Talebi</h3>
            <p className="text-sm text-gray-500">Yeni izin talebi oluştur</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">İzin Geçmişi</h3>
            <p className="text-sm text-gray-500">Geçmiş izin taleplerini görüntüle</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}