import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { 
  Settings, 
  Database, 
  Mail, 
  Shield, 
  Globe, 
  Users, 
  Bell, 
  Lock,
  Server,
  Cloud,
  Cpu,
  HardDrive,
  Wifi,
  Eye,
  Key,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Save,
  Upload,
  Download,
  Trash2,
  Edit,
  Copy
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const systemConfigSchema = z.object({
  siteName: z.string().min(1, "Site adı gereklidir"),
  siteDescription: z.string().optional(),
  maintenanceMode: z.boolean(),
  registrationEnabled: z.boolean(),
  emailVerificationRequired: z.boolean(),
  sessionTimeout: z.string(),
  maxLoginAttempts: z.string(),
  passwordMinLength: z.string(),
  backupFrequency: z.string(),
  logRetentionDays: z.string()
});

const emailConfigSchema = z.object({
  smtpHost: z.string().min(1, "SMTP host gereklidir"),
  smtpPort: z.string().min(1, "SMTP port gereklidir"),
  smtpUsername: z.string().min(1, "SMTP kullanıcı adı gereklidir"),
  smtpPassword: z.string().min(1, "SMTP şifre gereklidir"),
  smtpEncryption: z.string(),
  fromEmail: z.string().email("Geçerli e-posta adresi girin"),
  fromName: z.string().min(1, "Gönderen adı gereklidir")
});

type SystemConfigData = z.infer<typeof systemConfigSchema>;
type EmailConfigData = z.infer<typeof emailConfigSchema>;

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const systemForm = useForm<SystemConfigData>({
    resolver: zodResolver(systemConfigSchema),
    defaultValues: {
      siteName: "",
      siteDescription: "",
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true,
      sessionTimeout: "3600",
      maxLoginAttempts: "5",
      passwordMinLength: "8",
      backupFrequency: "daily",
      logRetentionDays: "30"
    }
  });

  const emailForm = useForm<EmailConfigData>({
    resolver: zodResolver(emailConfigSchema),
    defaultValues: {
      smtpHost: "",
      smtpPort: "587",
      smtpUsername: "",
      smtpPassword: "",
      smtpEncryption: "tls",
      fromEmail: "",
      fromName: ""
    }
  });

  const { data: systemConfig, isLoading: configLoading } = useQuery({
    queryKey: ["/api/system/config"],
  });

  const { data: systemStatus } = useQuery({
    queryKey: ["/api/system/status"],
  });

  const { data: emailConfig } = useQuery({
    queryKey: ["/api/system/email-config"],
  });

  const { data: backupHistory } = useQuery({
    queryKey: ["/api/system/backups"],
  });

  const updateSystemConfig = useMutation({
    mutationFn: async (data: SystemConfigData) => {
      return apiRequest("PUT", "/api/system/config", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/system/config"] });
      toast({
        title: "Başarılı",
        description: "Sistem ayarları güncellendi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Ayarlar güncellenirken hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateEmailConfig = useMutation({
    mutationFn: async (data: EmailConfigData) => {
      return apiRequest("PUT", "/api/system/email-config", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/system/email-config"] });
      toast({
        title: "Başarılı",
        description: "E-posta ayarları güncellendi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "E-posta ayarları güncellenirken hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const testEmailConnection = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/system/test-email");
    },
    onSuccess: () => {
      toast({
        title: "Test Başarılı",
        description: "E-posta bağlantısı test edildi.",
      });
    },
    onError: () => {
      toast({
        title: "Test Başarısız",
        description: "E-posta bağlantısı test edilemedi.",
        variant: "destructive",
      });
    },
  });

  const createBackup = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/system/backup");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/system/backups"] });
      toast({
        title: "Yedekleme Başlatıldı",
        description: "Sistem yedeği oluşturuluyor.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Yedekleme başlatılırken hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-emerald-100 text-emerald-800">Sağlıklı</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Uyarı</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Hata</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Bilinmeyen</Badge>;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Sistem Ayarları</h2>
            <p className="text-gray-600">Sistem konfigürasyonu ve yönetim ayarları</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/system"] })}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Yenile
            </Button>
            <Button 
              onClick={() => createBackup.mutate()}
              disabled={createBackup.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              Yedek Oluştur
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sistem Durumu</p>
                  <p className="text-lg font-bold text-emerald-600">Çevrimiçi</p>
                  <p className="text-xs text-gray-500 mt-1">Uptime: 99.9%</p>
                </div>
                <Server className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CPU Kullanımı</p>
                  <p className="text-lg font-bold text-gray-900">{systemStatus?.cpuUsage || 0}%</p>
                  <p className="text-xs text-gray-500 mt-1">8 Core</p>
                </div>
                <Cpu className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bellek Kullanımı</p>
                  <p className="text-lg font-bold text-gray-900">{systemStatus?.memoryUsage || 0}%</p>
                  <p className="text-xs text-gray-500 mt-1">16 GB RAM</p>
                </div>
                <HardDrive className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disk Kullanımı</p>
                  <p className="text-lg font-bold text-gray-900">{systemStatus?.diskUsage || 0}%</p>
                  <p className="text-xs text-gray-500 mt-1">500 GB SSD</p>
                </div>
                <Database className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">Genel</TabsTrigger>
            <TabsTrigger value="security">Güvenlik</TabsTrigger>
            <TabsTrigger value="email">E-posta</TabsTrigger>
            <TabsTrigger value="database">Veritabanı</TabsTrigger>
            <TabsTrigger value="backup">Yedekleme</TabsTrigger>
            <TabsTrigger value="logs">Loglar</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Genel Sistem Ayarları
                </CardTitle>
                <CardDescription>
                  Temel sistem konfigürasyonu ve site ayarları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...systemForm}>
                  <form onSubmit={systemForm.handleSubmit((data) => updateSystemConfig.mutate(data))} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={systemForm.control}
                        name="siteName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site Adı</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enterprise İK Hub" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={systemForm.control}
                        name="sessionTimeout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Oturum Zaman Aşımı (saniye)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" placeholder="3600" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={systemForm.control}
                      name="siteDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Açıklaması</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Kurumsal İnsan Kaynakları Yönetim Sistemi" rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={systemForm.control}
                        name="maintenanceMode"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <FormLabel>Bakım Modu</FormLabel>
                              <FormDescription>
                                Sistemi bakım moduna alır
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={systemForm.control}
                        name="registrationEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <FormLabel>Kayıt Olma</FormLabel>
                              <FormDescription>
                                Yeni kullanıcı kaydına izin ver
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" disabled={updateSystemConfig.isPending}>
                      <Save className="w-4 h-4 mr-2" />
                      Ayarları Kaydet
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Güvenlik Ayarları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>E-posta Doğrulama</Label>
                        <p className="text-sm text-gray-500">Yeni kullanıcılar için e-posta doğrulaması</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>İki Faktörlü Kimlik Doğrulama</Label>
                        <p className="text-sm text-gray-500">2FA zorunlu hale getir</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>IP Kısıtlaması</Label>
                        <p className="text-sm text-gray-500">Belirli IP adreslerinden erişim</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Maksimum Giriş Denemesi</Label>
                      <Input type="number" defaultValue="5" className="mt-1" />
                    </div>
                    <div>
                      <Label>Minimum Şifre Uzunluğu</Label>
                      <Input type="number" defaultValue="8" className="mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    API Anahtarları
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Ana API Anahtarı", key: "ak_1234567890abcdef", status: "active" },
                      { name: "Yedek API Anahtarı", key: "ak_fedcba0987654321", status: "inactive" },
                      { name: "Webhook Anahtarı", key: "wh_1111222233334444", status: "active" }
                    ].map((apiKey, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{apiKey.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{apiKey.key}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(apiKey.status)}
                          <Button size="sm" variant="outline">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full" variant="outline">
                      <Key className="w-4 h-4 mr-2" />
                      Yeni API Anahtarı Oluştur
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  E-posta Konfigürasyonu
                </CardTitle>
                <CardDescription>
                  SMTP ayarları ve e-posta gönderim konfigürasyonu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit((data) => updateEmailConfig.mutate(data))} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={emailForm.control}
                        name="smtpHost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Host</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="smtp.gmail.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={emailForm.control}
                        name="smtpPort"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Port</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" placeholder="587" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={emailForm.control}
                        name="smtpUsername"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Kullanıcı Adı</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="user@gmail.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={emailForm.control}
                        name="smtpPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Şifre</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="••••••••" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <FormField
                        control={emailForm.control}
                        name="smtpEncryption"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Şifreleme</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="tls">TLS</SelectItem>
                                <SelectItem value="ssl">SSL</SelectItem>
                                <SelectItem value="none">Yok</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={emailForm.control}
                        name="fromEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gönderen E-posta</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="noreply@company.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={emailForm.control}
                        name="fromName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gönderen Adı</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enterprise İK Hub" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button type="submit" disabled={updateEmailConfig.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        E-posta Ayarları Kaydet
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => testEmailConnection.mutate()}
                        disabled={testEmailConnection.isPending}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Bağlantıyı Test Et
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Veritabanı Durumu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">PostgreSQL</p>
                      <p className="text-sm text-gray-600">Veritabanı Türü</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-emerald-600">Çevrimiçi</p>
                      <p className="text-sm text-gray-600">Durum</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Veritabanı Boyutu:</span>
                      <span className="text-sm font-medium">2.4 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Toplam Tablo:</span>
                      <span className="text-sm font-medium">42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Aktif Bağlantı:</span>
                      <span className="text-sm font-medium">12/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Son Yedekleme:</span>
                      <span className="text-sm font-medium">2 saat önce</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Veritabanı Ayarları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Maksimum Bağlantı Sayısı</Label>
                      <Input type="number" defaultValue="100" className="mt-1" />
                    </div>
                    <div>
                      <Label>Bağlantı Zaman Aşımı (saniye)</Label>
                      <Input type="number" defaultValue="30" className="mt-1" />
                    </div>
                    <div>
                      <Label>Query Zaman Aşımı (saniye)</Label>
                      <Input type="number" defaultValue="60" className="mt-1" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <Database className="w-4 h-4 mr-2" />
                      Veritabanı Optimize Et
                    </Button>
                    <Button className="w-full" variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      İstatistikleri Yenile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Yedekleme Ayarları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Yedekleme Sıklığı</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Saatlik</SelectItem>
                          <SelectItem value="daily">Günlük</SelectItem>
                          <SelectItem value="weekly">Haftalık</SelectItem>
                          <SelectItem value="monthly">Aylık</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Yedek Saklama Süresi (gün)</Label>
                      <Input type="number" defaultValue="30" className="mt-1" />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label>Otomatik Yedekleme</Label>
                        <p className="text-sm text-gray-500">Zamanlanmış otomatik yedekleme</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => createBackup.mutate()}
                    disabled={createBackup.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Manuel Yedek Oluştur
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Yedekleme Geçmişi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Tam Sistem Yedeği", date: "2024-12-13 12:00", size: "2.4 GB", status: "success" },
                      { name: "Veritabanı Yedeği", date: "2024-12-13 06:00", size: "1.8 GB", status: "success" },
                      { name: "Günlük Yedek", date: "2024-12-12 12:00", size: "2.3 GB", status: "success" },
                      { name: "Günlük Yedek", date: "2024-12-11 12:00", size: "2.2 GB", status: "failed" }
                    ].map((backup, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{backup.name}</p>
                          <p className="text-xs text-gray-500">{backup.date} • {backup.size}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {backup.status === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          )}
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Sistem Logları
                </CardTitle>
                <CardDescription>
                  Sistem aktivite kayıtları ve hata logları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Select defaultValue="error">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tüm Loglar</SelectItem>
                        <SelectItem value="error">Hatalar</SelectItem>
                        <SelectItem value="warning">Uyarılar</SelectItem>
                        <SelectItem value="info">Bilgi</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Logları İndir
                    </Button>
                    <Button variant="outline">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Logları Temizle
                    </Button>
                  </div>

                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                    <div className="space-y-1">
                      <div className="text-red-400">[ERROR] 2024-12-13 12:45:23 - Database connection timeout</div>
                      <div className="text-yellow-400">[WARN] 2024-12-13 12:44:15 - High memory usage detected</div>
                      <div className="text-gray-300">[INFO] 2024-12-13 12:43:02 - User admin_001 logged in</div>
                      <div className="text-gray-300">[INFO] 2024-12-13 12:42:45 - System backup completed successfully</div>
                      <div className="text-red-400">[ERROR] 2024-12-13 12:41:33 - Failed to send email notification</div>
                      <div className="text-gray-300">[INFO] 2024-12-13 12:40:15 - Security scan completed</div>
                      <div className="text-yellow-400">[WARN] 2024-12-13 12:39:22 - SSL certificate expires in 30 days</div>
                      <div className="text-gray-300">[INFO] 2024-12-13 12:38:45 - User hr_manager_002 logged out</div>
                      <div className="text-gray-300">[INFO] 2024-12-13 12:37:12 - System health check passed</div>
                      <div className="text-red-400">[ERROR] 2024-12-13 12:36:45 - Failed login attempt from 192.168.1.100</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">24</p>
                      <p className="text-sm text-red-700">Hatalar (24h)</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">12</p>
                      <p className="text-sm text-yellow-700">Uyarılar (24h)</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">156</p>
                      <p className="text-sm text-blue-700">Bilgi (24h)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}