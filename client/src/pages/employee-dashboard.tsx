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

  const { data: personalStats } = useQuery({
    queryKey: ['/api/stats/employee'],
  }) as { data: any };

  const { data: myTasks } = useQuery({
    queryKey: ['/api/tasks/my'],
  }) as { data: any };

  const { data: leaveBalance } = useQuery({
    queryKey: ['/api/leaves/balance'],
  }) as { data: any };

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

  const expenseReportMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to submit expense report');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Gider Raporu Gönderildi",
        description: "Gider raporunuz yöneticinize iletildi.",
      });
      setIsExpenseDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Gider raporu gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  });

  const timeEntryMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to submit time entry');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mesai Kaydedildi",
        description: "Mesai kayıtınız başarıyla eklendi.",
      });
      setIsTimeDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Mesai kaydı yapılırken bir hata oluştu.",
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

  const handleExpenseReport = (formData: FormData) => {
    const data = {
      description: formData.get('description'),
      amount: parseFloat(formData.get('amount') as string),
      category: formData.get('category'),
      date: formData.get('date'),
      receipt: formData.get('receipt'),
    };
    expenseReportMutation.mutate(data);
  };

  const handleTimeEntry = (formData: FormData) => {
    const data = {
      date: formData.get('date'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      breakMinutes: parseInt(formData.get('breakMinutes') as string),
      description: formData.get('description'),
    };
    timeEntryMutation.mutate(data);
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8 pb-8">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Çalışan Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Kişisel performans ve iş takibi
            </p>
          </div>
          <div className="flex space-x-2">
          <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
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

          <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Gider Raporu
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Gider Raporu Oluştur</DialogTitle>
                <DialogDescription>
                  İş ile ilgili giderlerinizi raporlayın.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleExpenseReport(new FormData(e.currentTarget));
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Gider Açıklaması</Label>
                  <Input 
                    name="description" 
                    placeholder="Gider açıklaması..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Tutar (₺)</Label>
                    <Input name="amount" type="number" step="0.01" placeholder="0.00" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Tarih</Label>
                    <Input name="date" type="date" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">Seyahat</SelectItem>
                      <SelectItem value="meals">Yemek</SelectItem>
                      <SelectItem value="office">Ofis Malzemeleri</SelectItem>
                      <SelectItem value="training">Eğitim</SelectItem>
                      <SelectItem value="other">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receipt">Fiş/Fatura</Label>
                  <Input name="receipt" type="file" accept="image/*,.pdf" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit" disabled={expenseReportMutation.isPending}>
                    {expenseReportMutation.isPending ? "Gönderiliyor..." : "Rapor Gönder"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

      {/* Personal Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Görevler</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalStats?.activeTasks || 0}</div>
            <p className="text-xs text-muted-foreground">
              {personalStats?.urgentTasks || 0} acil
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay Performans</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalStats?.monthlyPerformance || "85"}%</div>
            <p className="text-xs text-muted-foreground">
              +2% geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kalan İzin</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveBalance?.remaining || 0}</div>
            <p className="text-xs text-muted-foreground">
              {leaveBalance?.total || 14} günden
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay Bordro</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{personalStats?.monthlySalary || "0"}</div>
            <p className="text-xs text-muted-foreground">
              Net maaş
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* My Tasks */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Görevlerim</CardTitle>
            <CardDescription>
              Aktif görevler ve tamamlanma durumu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myTasks?.active?.slice(0, 5).map((task: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Son teslim: {task.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress value={task.progress} className="w-16" />
                    <span className="text-sm font-medium">{task.progress}%</span>
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
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
            <CardDescription>
              Günlük kullanılan araçlar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  İzin Talep Et
                </Button>
              </DialogTrigger>
            </Dialog>

            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start hover:bg-green-50 dark:hover:bg-green-950 transition-colors">
                  <FileText className="h-4 w-4 mr-2 text-green-600" />
                  Gider Raporu
                </Button>
              </DialogTrigger>
            </Dialog>

            <Dialog open={isTimeDialogOpen} onOpenChange={setIsTimeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors">
                  <Clock className="h-4 w-4 mr-2 text-purple-600" />
                  Mesai Kayıt
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Mesai Kaydı</DialogTitle>
                  <DialogDescription>
                    Günlük mesai saatlerinizi kaydedin.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleTimeEntry(new FormData(e.currentTarget));
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Tarih</Label>
                    <Input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Başlangıç Saati</Label>
                      <Input name="startTime" type="time" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">Bitiş Saati</Label>
                      <Input name="endTime" type="time" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="breakMinutes">Mola Süresi (Dakika)</Label>
                    <Input name="breakMinutes" type="number" defaultValue="60" min="0" max="480" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
                    <Textarea 
                      name="description" 
                      placeholder="Gün boyunca yaptığınız işleri açıklayın..."
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsTimeDialogOpen(false)}>
                      İptal
                    </Button>
                    <Button type="submit" disabled={timeEntryMutation.isPending}>
                      {timeEntryMutation.isPending ? "Kaydediliyor..." : "Mesai Kaydet"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors">
                  <MessageSquare className="h-4 w-4 mr-2 text-orange-600" />
                  Yöneticimle İletişim
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Yöneticiye Mesaj Gönder</DialogTitle>
                  <DialogDescription>
                    Yöneticinize veya İK departmanına mesaj gönderin.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Alıcı</Label>
                    <Select name="recipient" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Alıcı seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Departman Müdürü</SelectItem>
                        <SelectItem value="hr">İK Departmanı</SelectItem>
                        <SelectItem value="it">IT Destek</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Konu</Label>
                    <Input name="subject" placeholder="Mesaj konusu..." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mesaj</Label>
                    <Textarea 
                      name="message" 
                      placeholder="Mesajınızı yazın..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                      İptal
                    </Button>
                    <Button type="submit">
                      <Send className="h-4 w-4 mr-2" />
                      Mesaj Gönder
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors">
                  <User className="h-4 w-4 mr-2 text-indigo-600" />
                  Profil Güncelle
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Profil Bilgilerini Güncelle</DialogTitle>
                  <DialogDescription>
                    Kişisel bilgilerinizi güncelleyin.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Ad</Label>
                      <Input name="firstName" placeholder="Adınız" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Soyad</Label>
                      <Input name="lastName" placeholder="Soyadınız" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input name="email" type="email" placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input name="phone" placeholder="+90 5XX XXX XX XX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adres</Label>
                    <Textarea name="address" placeholder="Adresiniz..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Acil Durum İletişim</Label>
                    <Input name="emergencyContact" placeholder="Acil durum telefonu" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
                      İptal
                    </Button>
                    <Button type="submit">
                      <Edit className="h-4 w-4 mr-2" />
                      Bilgileri Güncelle
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performans Özeti</CardTitle>
          <CardDescription>
            Aylık performans değerlendirmesi ve hedefler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Bu Ay Hedeflerim</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Proje Teslim</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={80} className="w-20" />
                    <span className="text-sm font-medium">80%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Kalite Skoru</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={92} className="w-20" />
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ekip İşbirliği</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={88} className="w-20" />
                    <span className="text-sm font-medium">88%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Kazanımlarım</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Ayın Çalışanı</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Proje Tamamlama</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Performans Artışı</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Gelişim Alanları</h4>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  • Zaman yönetimi
                </div>
                <div className="text-sm text-muted-foreground">
                  • Takım liderliği
                </div>
                <div className="text-sm text-muted-foreground">
                  • Teknik beceriler
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave History */}
      <Card>
        <CardHeader>
          <CardTitle>İzin Geçmişi</CardTitle>
          <CardDescription>
            Son izin talepleri ve durumları
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaveBalance?.history?.map((leave: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">{leave.type}</p>
                    <p className="text-xs text-muted-foreground">
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
  );
}