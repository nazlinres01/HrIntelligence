import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/use-language";
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
  Upload
} from "lucide-react";

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

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
              <Button variant="outline" className="w-full">
                <User className="h-4 w-4 mr-2" />
                Profil Bilgilerini Düzenle
              </Button>
              <Button variant="outline" className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                Şifre Değiştir
              </Button>
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