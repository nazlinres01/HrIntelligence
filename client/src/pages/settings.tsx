import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { 
  Settings as SettingsIcon,
  Globe,
  Moon,
  Sun,
  Bell,
  Lock,
  User,
  Database,
  Shield,
  Download,
  Upload,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  // Profile update mutation
  const profileUpdateMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; email: string; phone?: string }) => {
      const response = await apiRequest('PUT', '/api/profile', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({ title: "Profil başarıyla güncellendi" });
      setIsProfileDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Profil güncellenirken hata oluştu", variant: "destructive" });
    }
  });

  // Password change mutation
  const passwordChangeMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await apiRequest('PUT', '/api/change-password', data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Şifre başarıyla değiştirildi" });
      setIsPasswordDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Şifre değiştirirken hata oluştu", variant: "destructive" });
    }
  });

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    profileUpdateMutation.mutate({
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string
    });
  };

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (newPassword !== confirmPassword) {
      toast({ title: "Yeni şifreler eşleşmiyor", variant: "destructive" });
      return;
    }
    
    passwordChangeMutation.mutate({
      currentPassword: formData.get('currentPassword') as string,
      newPassword
    });
  };

  const handleDataExport = () => {
    const userData = {
      user: user,
      settings: {
        language,
        emailNotifications,
        pushNotifications,
        darkMode: isDarkMode
      },
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ik360-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: "Veriler başarıyla indirildi" });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ayarlar
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            İK360 sistem ayarlarınızı buradan yönetebilirsiniz
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Profil Ayarları
              </CardTitle>
              <CardDescription>
                Kişisel profil bilgilerinizi güncelleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Profil Bilgilerini Düzenle
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Profil Bilgilerini Düzenle</DialogTitle>
                    <DialogDescription>
                      Kişisel bilgilerinizi güncelleyin
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Ad</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          defaultValue={(user as any)?.firstName || ''}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Soyad</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          defaultValue={(user as any)?.lastName || ''}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={(user as any)?.email || ''}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon (Opsiyonel)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={(user as any)?.phone || ''}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
                        İptal
                      </Button>
                      <Button type="submit" disabled={profileUpdateMutation.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        {profileUpdateMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Şifre Değiştir
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Şifre Değiştir</DialogTitle>
                    <DialogDescription>
                      Hesap güvenliğiniz için güçlü bir şifre seçin
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPassword ? "text" : "password"}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newPassword">Yeni Şifre</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                        İptal
                      </Button>
                      <Button type="submit" disabled={passwordChangeMutation.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        {passwordChangeMutation.isPending ? 'Değiştiriliyor...' : 'Değiştir'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Dil ve Bölge Ayarları
            </CardTitle>
            <CardDescription>
              Sistem dilini ve bölgesel ayarları değiştirin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="language">Sistem Dili</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tr">Türkçe</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-blue-600" />
              Görünüm Ayarları
            </CardTitle>
            <CardDescription>
              Tema ve görünüm tercihlerinizi ayarlayın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Karanlık Mod</Label>
              <Switch
                id="theme"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Bildirim Ayarları
            </CardTitle>
            <CardDescription>
              Hangi bildirimleri almak istediğinizi seçin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">E-posta Bildirimleri</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Önemli güncellemeler için e-posta bildirimleri alın
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Anlık Bildirimler</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tarayıcıda anlık bildirimler göster
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Güvenlik Ayarları
            </CardTitle>
            <CardDescription>
              Hesap güvenliğinizi yönetin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Oturum Zaman Aşımı</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  İşlem yapılmadığında otomatik çıkış süresi
                </p>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 dakika</SelectItem>
                  <SelectItem value="30">30 dakika</SelectItem>
                  <SelectItem value="60">1 saat</SelectItem>
                  <SelectItem value="240">4 saat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>İki Faktörlü Doğrulama</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hesabınız için ek güvenlik katmanı
                </p>
              </div>
              <Button variant="outline" size="sm">
                Etkinleştir
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Veri Yönetimi
            </CardTitle>
            <CardDescription>
              Veri dışa aktarma ve yedekleme seçenekleri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Tüm Verileri İndir
              </Button>
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Veri Yedekle
              </Button>
            </div>
            <div className="pt-4 border-t">
              <Button variant="destructive" className="w-full">
                Hesabı Sil
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Bu işlem geri alınamaz ve tüm verileriniz silinir
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}