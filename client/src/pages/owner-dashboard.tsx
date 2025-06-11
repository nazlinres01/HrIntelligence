import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Target,
  UserPlus,
  BarChart3,
  Settings,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  FileText,
  Activity,
  Database,
  Zap,
  Filter,
  Download,
  UserCheck,
  UserX,
  Plus,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface EmployeeStats {
  totalEmployees: number;
  activeLeaves: number;
  monthlyPayroll: string;
  avgPerformance: string;
}

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  companyId: number;
}

interface AuditLog {
  id: number;
  userId: string;
  action: string;
  resource: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Notification {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface TimeEntry {
  id: number;
  userId: string;
  description: string;
  hours: number;
  date: string;
  status: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

interface ExpenseReport {
  id: number;
  userId: string;
  title: string;
  amount: string;
  category: string;
  status: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export default function OwnerDashboard() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("overview");

  const { data: stats = {
    totalEmployees: 0,
    activeLeaves: 0,
    monthlyPayroll: '₺0K',
    avgPerformance: '0.0'
  } } = useQuery<EmployeeStats>({
    queryKey: ['/api/stats/employees'],
  });

  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ['/api/team/members'],
  });

  const { data: auditLogs = [] } = useQuery<AuditLog[]>({
    queryKey: ['/api/audit-logs'],
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
  });

  const { data: pendingTimeEntries = [] } = useQuery<TimeEntry[]>({
    queryKey: ['/api/time-entries/pending'],
  });

  const { data: pendingExpenses = [] } = useQuery<ExpenseReport[]>({
    queryKey: ['/api/expense-reports/pending'],
  });

  const { data: recentActivities = [] } = useQuery<any[]>({
    queryKey: ['/api/activities'],
  });

  const { data: teamStats } = useQuery({
    queryKey: ['/api/stats/team'],
  });

  // Quick Actions Mutations
  const approveTimeEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('PUT', `/api/time-entries/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-entries/pending'] });
      toast({ title: "Zaman kaydı onaylandı" });
    }
  });

  const approveExpenseMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('PUT', `/api/expense-reports/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expense-reports/pending'] });
      toast({ title: "Harcama raporu onaylandı" });
    }
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      await apiRequest('PUT', `/api/users/${userId}/status`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      toast({ title: "Kullanıcı durumu güncellendi" });
    }
  });

  const createNotificationMutation = useMutation({
    mutationFn: async (data: { title: string; message: string; type: string }) => {
      await apiRequest('POST', '/api/notifications/broadcast', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({ title: "Bildirim gönderildi" });
    }
  });

  const roleLabels: Record<string, string> = {
    admin: "Admin",
    owner: "Patron", 
    hr_manager: "İK Müdürü",
    hr_specialist: "İK Uzmanı",
    department_manager: "Departman Müdürü",
    employee: "Çalışan"
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "default",
      rejected: "destructive",
      active: "default",
      inactive: "secondary"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Yönetim Paneli</h1>
          <p className="text-muted-foreground">
            Kurumsal sistem yönetimi ve denetim merkezi
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => createNotificationMutation.mutate({
              title: "Sistem Duyurusu",
              message: "Tüm kullanıcılara genel duyuru",
              type: "info"
            })}
          >
            <Zap className="h-4 w-4 mr-2" />
            Duyuru Gönder
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Rapor İndir
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Yeni Kullanıcı
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Çalışan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Aktif: {teamMembers.filter(m => m.isActive).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Onaylar</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingTimeEntries.length + pendingExpenses.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Zaman: {pendingTimeEntries.length}, Harcama: {pendingExpenses.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistem Logları</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              Son 24 saat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aylık Bordro</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyPayroll}</div>
            <p className="text-xs text-muted-foreground">
              Ortalama performans: {stats.avgPerformance}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="team">Ekip Yönetimi</TabsTrigger>
          <TabsTrigger value="approvals">Onaylar</TabsTrigger>
          <TabsTrigger value="audit">Denetim Logları</TabsTrigger>
          <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Son Aktiviteler</CardTitle>
                <CardDescription>Sistem geneli son işlemler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.description || 'Sistem aktivitesi'}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.createdAt || Date.now()).toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentActivities.length === 0 && (
                    <p className="text-sm text-muted-foreground">Henüz aktivite bulunmuyor.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hızlı İşlemler</CardTitle>
                <CardDescription>Sık kullanılan yönetim fonksiyonları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Yeni Çalışan Ekle
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Rapor Oluştur
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Sistem Ayarları
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Veri Yedekleme
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ekip Üyeleri</CardTitle>
              <CardDescription>Tüm kullanıcıların detaylı listesi ve yönetimi</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Son Giriş</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.firstName} {member.lastName}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{roleLabels[member.role] || member.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {member.isActive ? (
                          <Badge variant="default">Aktif</Badge>
                        ) : (
                          <Badge variant="secondary">Pasif</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {member.lastLoginAt ? 
                          new Date(member.lastLoginAt).toLocaleDateString('tr-TR') : 
                          'Hiçbir zaman'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleUserStatusMutation.mutate({
                              userId: member.id,
                              isActive: !member.isActive
                            })}
                          >
                            {member.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bekleyen Zaman Kayıtları</CardTitle>
                <CardDescription>{pendingTimeEntries.length} kayıt onay bekliyor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingTimeEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">
                          {entry.user?.firstName} {entry.user?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{entry.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.hours} saat - {new Date(entry.date).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => approveTimeEntryMutation.mutate(entry.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingTimeEntries.length === 0 && (
                    <p className="text-sm text-muted-foreground">Bekleyen zaman kaydı yok.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bekleyen Harcama Raporları</CardTitle>
                <CardDescription>{pendingExpenses.length} rapor onay bekliyor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">
                          {expense.user?.firstName} {expense.user?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{expense.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {expense.amount} - {expense.category}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => approveExpenseMutation.mutate(expense.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingExpenses.length === 0 && (
                    <p className="text-sm text-muted-foreground">Bekleyen harcama raporu yok.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Denetim Logları</CardTitle>
              <CardDescription>Sistem aktiviteleri ve güvenlik olayları</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>İşlem</TableHead>
                    <TableHead>Kaynak</TableHead>
                    <TableHead>IP Adresi</TableHead>
                    <TableHead>Tarih</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.slice(0, 20).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {log.user ? (
                          <div>
                            <p className="font-medium">{log.user.firstName} {log.user.lastName}</p>
                            <p className="text-xs text-muted-foreground">{log.user.email}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Sistem</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell>{log.resource}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress || 'N/A'}</TableCell>
                      <TableCell>
                        {new Date(log.createdAt).toLocaleString('tr-TR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sistem Bildirimleri</CardTitle>
              <CardDescription>Tüm kullanıcı bildirimleri ve duyurular</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-4 p-4 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{notification.title}</h4>
                        <Badge variant={notification.type === 'error' ? 'destructive' : 'default'}>
                          {notification.type}
                        </Badge>
                        {!notification.isRead && <Badge variant="outline">Yeni</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.createdAt).toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-sm text-muted-foreground">Henüz bildirim yok.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Kullanıcı Aktivitesi</CardTitle>
                <CardDescription>Son 30 günlük aktivite özeti</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Aktif Kullanıcılar</span>
                    <span className="font-medium">{teamMembers.filter(m => m.isActive).length}</span>
                  </div>
                  <Progress value={75} className="w-full" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Haftalık Giriş</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sistem Sağlığı</CardTitle>
                <CardDescription>Genel sistem durumu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Veritabanı Durumu</span>
                    <Badge variant="default">Sağlıklı</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Yanıt Süresi</span>
                    <span className="font-medium">125ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="font-medium">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}