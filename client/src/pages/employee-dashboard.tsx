import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Calendar, 
  Clock,
  Target,
  Award,
  FileText,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Plus,
  Edit,
  Send,
  Upload
} from "lucide-react";

export default function EmployeeDashboard() {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isTimeDialogOpen, setIsTimeDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const { toast } = useToast();

  // Mock data for demonstration - would be replaced with real API calls
  const personalStats = {
    activeTasks: 8,
    urgentTasks: 2,
    monthlyPerformance: 92,
    monthlySalary: "15500"
  };

  const leaveBalance = {
    remaining: 12,
    total: 22,
    history: [
      { type: "Yıllık İzin", startDate: "2024-12-15", endDate: "2024-12-20", days: 5, status: "approved" },
      { type: "Hastalık İzni", startDate: "2024-11-10", endDate: "2024-11-12", days: 2, status: "approved" },
      { type: "Kişisel İzin", startDate: "2024-10-25", endDate: "2024-10-25", days: 1, status: "pending" }
    ]
  };

  const myTasks = {
    active: [
      { title: "Aylık Satış Raporu Hazırlama", dueDate: "2024-12-20", progress: 75, priority: "high" },
      { title: "Müşteri Geri Bildirim Analizi", dueDate: "2024-12-18", progress: 45, priority: "medium" },
      { title: "Proje Dokümantasyonu", dueDate: "2024-12-25", progress: 20, priority: "low" },
      { title: "Takım Toplantısı Hazırlık", dueDate: "2024-12-17", progress: 90, priority: "high" }
    ]
  };

  const leaveRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to submit leave request');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "İzin Talebi Gönderildi",
        description: "İzin talebiniz yöneticinize iletildi.",
      });
      setIsLeaveDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/leaves/balance'] });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İzin talebi gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });

  const handleLeaveRequest = (formData: FormData) => {
    const data = {
      type: formData.get('type'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      reason: formData.get('reason'),
    };
    leaveRequestMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="p-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Corporate Header */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Çalışan Paneli
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-1">
                  Kişisel performans ve iş takibi
                </p>
              </div>
              <div className="flex space-x-2">
                <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      İzin Talep Et
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>İzin Talebi Oluştur</DialogTitle>
                      <DialogDescription>
                        Yeni bir izin talebi oluşturun. Talebiniz yöneticinize iletilecektir.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleLeaveRequest(new FormData(e.currentTarget));
                    }} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">İzin Türü</Label>
                        <Select name="type" required>
                          <SelectTrigger>
                            <SelectValue placeholder="İzin türünü seçin" />
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
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                          <Input name="startDate" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">Bitiş Tarihi</Label>
                          <Input name="endDate" type="date" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reason">İzin Nedeni</Label>
                        <Textarea 
                          name="reason" 
                          placeholder="İzin nedeninizi açıklayın..."
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>
                          İptal
                        </Button>
                        <Button type="submit" disabled={leaveRequestMutation.isPending}>
                          {leaveRequestMutation.isPending ? "Gönderiliyor..." : "Talep Gönder"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button size="sm" className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600">
                  <FileText className="h-4 w-4 mr-2" />
                  Gider Raporu
                </Button>
              </div>
            </div>
          </div>

          {/* Corporate Personal Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Aktif Görevler</CardTitle>
                <Clock className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{personalStats.activeTasks}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {personalStats.urgentTasks} acil
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Bu Ay Performans</CardTitle>
                <Target className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{personalStats.monthlyPerformance}%</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  +5% geçen aya göre
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Kalan İzin</CardTitle>
                <Calendar className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{leaveBalance.remaining}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {leaveBalance.total} günden
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Bu Ay Bordro</CardTitle>
                <DollarSign className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">₺{personalStats.monthlySalary}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Net maaş
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Corporate My Tasks and Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Görevlerim</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Aktif görevler ve tamamlanma durumu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myTasks.active.slice(0, 5).map((task: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-750">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{task.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Son teslim: {task.dueDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={task.progress} className="w-16" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{task.progress}%</span>
                        <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                          {task.priority === 'high' ? 'Acil' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="col-span-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Hızlı İşlemler</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Günlük kullanılan araçlar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                  <Clock className="h-4 w-4 mr-2" />
                  Mesai Kaydı
                </Button>
                <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                  <Target className="h-4 w-4 mr-2" />
                  Performans Takibi
                </Button>
                <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mesaj Gönder
                </Button>
                <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                  <User className="h-4 w-4 mr-2" />
                  Profil Güncelle
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Corporate Leave History */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">İzin Geçmişi</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Son izin talepleri ve durumları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveBalance.history.map((leave: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-750">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${leave.status === 'approved' ? 'bg-green-500' : leave.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{leave.type}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {leave.startDate} - {leave.endDate} ({leave.days} gün)
                        </p>
                      </div>
                    </div>
                    <Badge variant={leave.status === 'approved' ? 'default' : leave.status === 'pending' ? 'secondary' : 'destructive'}>
                      {leave.status === 'approved' ? 'Onaylandı' : leave.status === 'pending' ? 'Beklemede' : 'Reddedildi'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}