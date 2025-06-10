import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Building,
  Palette,
  Globe,
  Mail,
  Lock,
  Users,
  Calendar,
  CreditCard,
  FileText,
  Download,
  Upload,
  Save,
  AlertCircle,
  CheckCircle,
  Trash2,
  Edit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile settings
  const [profileData, setProfileData] = useState({
    firstName: (user as any)?.firstName || "",
    lastName: (user as any)?.lastName || "",
    email: (user as any)?.email || "",
    phone: "",
    department: "",
    position: "",
    bio: ""
  });

  // Company settings
  const [companyData, setCompanyData] = useState({
    name: "İK360 Şirketi",
    address: "İstanbul, Türkiye",
    phone: "+90 212 123 45 67",
    email: "info@ik360.com",
    website: "www.ik360.com",
    taxNumber: "1234567890",
    workingHours: "09:00 - 18:00",
    workingDays: "Pazartesi - Cuma"
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    leaveRequests: true,
    performanceReviews: true,
    payrollAlerts: false,
    systemUpdates: true
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "5"
  });

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    language: "tr",
    timezone: "Europe/Istanbul",
    dateFormat: "DD/MM/YYYY",
    currency: "TRY",
    theme: "light"
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PUT", "/api/profile", data),
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Profil bilgileri güncellendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Profil güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PUT", "/api/company", data),
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Şirket bilgileri güncellendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Şirket bilgileri güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const handleProfileUpdate = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleCompanyUpdate = () => {
    updateCompanyMutation.mutate(companyData);
  };

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Bildirim Ayarı Güncellendi",
      description: `${key} ${value ? 'etkinleştirildi' : 'devre dışı bırakıldı'}`,
    });
  };

  const settingsTabs = [
    {
      value: "profile",
      label: "Profil",
      icon: User,
      color: "text-blue-600"
    },
    {
      value: "company",
      label: "Şirket",
      icon: Building,
      color: "text-green-600"
    },
    {
      value: "notifications",
      label: "Bildirimler",
      icon: Bell,
      color: "text-yellow-600"
    },
    {
      value: "security",
      label: "Güvenlik",
      icon: Shield,
      color: "text-red-600"
    },
    {
      value: "system",
      label: "Sistem",
      icon: SettingsIcon,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <Header 
        title="Ayarlar" 
        subtitle="Hesap, şirket ve sistem ayarlarınızı yönetin" 
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b border-gray-200">
          <TabsList className="grid w-full grid-cols-5 bg-gray-50 p-1 rounded-lg">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Icon className={`h-4 w-4 ${tab.color}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Profil Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xl">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Fotoğraf Yükle
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG veya GIF. Maksimum 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ad</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departman</Label>
                  <Select value={profileData.department} onValueChange={(value) => setProfileData({ ...profileData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Departman seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">Bilgi İşlem</SelectItem>
                      <SelectItem value="HR">İnsan Kaynakları</SelectItem>
                      <SelectItem value="Finance">Finans</SelectItem>
                      <SelectItem value="Marketing">Pazarlama</SelectItem>
                      <SelectItem value="Operations">Operasyon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Pozisyon</Label>
                  <Input
                    id="position"
                    value={profileData.position}
                    onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                    placeholder="Pozisyonunuz"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Hakkında</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Kendiniz hakkında kısa bir açıklama..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleProfileUpdate}
                  disabled={updateProfileMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Settings */}
        <TabsContent value="company" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-green-600" />
                Şirket Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Şirket Adı</Label>
                  <Input
                    id="companyName"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxNumber">Vergi Numarası</Label>
                  <Input
                    id="taxNumber"
                    value={companyData.taxNumber}
                    onChange={(e) => setCompanyData({ ...companyData, taxNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">E-posta</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Telefon</Label>
                  <Input
                    id="companyPhone"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={companyData.website}
                    onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Çalışma Saatleri</Label>
                  <Input
                    id="workingHours"
                    value={companyData.workingHours}
                    onChange={(e) => setCompanyData({ ...companyData, workingHours: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Textarea
                  id="address"
                  value={companyData.address}
                  onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleCompanyUpdate}
                  disabled={updateCompanyMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateCompanyMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-yellow-600" />
                Bildirim Tercihleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">E-posta Bildirimleri</h3>
                    <p className="text-sm text-gray-500">Önemli güncellemeler için e-posta alın</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">Push Bildirimleri</h3>
                    <p className="text-sm text-gray-500">Tarayıcı bildirimleri göster</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">İzin Talepleri</h3>
                    <p className="text-sm text-gray-500">Yeni izin talepleri için bildirim al</p>
                  </div>
                  <Switch
                    checked={notifications.leaveRequests}
                    onCheckedChange={(checked) => handleNotificationUpdate('leaveRequests', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">Performans Değerlendirmeleri</h3>
                    <p className="text-sm text-gray-500">Performans değerlendirme hatırlatmaları</p>
                  </div>
                  <Switch
                    checked={notifications.performanceReviews}
                    onCheckedChange={(checked) => handleNotificationUpdate('performanceReviews', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">Bordro Uyarıları</h3>
                    <p className="text-sm text-gray-500">Bordro işlemleri için bildirimler</p>
                  </div>
                  <Switch
                    checked={notifications.payrollAlerts}
                    onCheckedChange={(checked) => handleNotificationUpdate('payrollAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-gray-900">Sistem Güncellemeleri</h3>
                    <p className="text-sm text-gray-500">Sistem bakımı ve güncellemeler</p>
                  </div>
                  <Switch
                    checked={notifications.systemUpdates}
                    onCheckedChange={(checked) => handleNotificationUpdate('systemUpdates', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-red-600" />
                Güvenlik Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">İki Faktörlü Kimlik Doğrulama</h3>
                    <p className="text-sm text-gray-500">Hesabınız için ek güvenlik katmanı</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={securitySettings.twoFactorAuth ? "default" : "secondary"}>
                      {securitySettings.twoFactorAuth ? "Aktif" : "Pasif"}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Düzenle
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Oturum Zaman Aşımı (dakika)</Label>
                    <Select value={securitySettings.sessionTimeout} onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 dakika</SelectItem>
                        <SelectItem value="30">30 dakika</SelectItem>
                        <SelectItem value="60">1 saat</SelectItem>
                        <SelectItem value="120">2 saat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Şifre Yenileme (gün)</Label>
                    <Select value={securitySettings.passwordExpiry} onValueChange={(value) => setSecuritySettings({ ...securitySettings, passwordExpiry: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 gün</SelectItem>
                        <SelectItem value="60">60 gün</SelectItem>
                        <SelectItem value="90">90 gün</SelectItem>
                        <SelectItem value="180">180 gün</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Lock className="h-4 w-4 mr-2" />
                    Şifre Değiştir
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Giriş Geçmişini İndir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="mr-2 h-5 w-5 text-purple-600" />
                Sistem Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Dil</Label>
                  <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({ ...systemSettings, language: value })}>
                    <SelectTrigger>
                      <Globe className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Saat Dilimi</Label>
                  <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({ ...systemSettings, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Istanbul">İstanbul (UTC+3)</SelectItem>
                      <SelectItem value="Europe/London">Londra (UTC+0)</SelectItem>
                      <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Tarih Formatı</Label>
                  <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({ ...systemSettings, dateFormat: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Para Birimi</Label>
                  <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({ ...systemSettings, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRY">Türk Lirası (₺)</SelectItem>
                      <SelectItem value="USD">Dolar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Veri Yönetimi</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Verileri Dışa Aktar
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Verileri İçe Aktar
                  </Button>
                  <Button variant="outline" className="justify-start text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hesabı Sil
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Save className="h-4 w-4 mr-2" />
                  Sistem Ayarlarını Kaydet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}