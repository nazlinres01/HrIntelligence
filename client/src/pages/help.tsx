import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/hooks/use-language";
import { useState } from "react";
import { 
  HelpCircle, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Settings, 
  Upload, 
  Download,
  Search,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Moon,
  Sun,
  Bell,
  Lock,
  User,
  Database,
  Shield,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

export default function Help() {
  const { t, language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const helpSections = [
    {
      id: "getting-started",
      title: "Başlangıç",
      icon: User,
      items: [
        {
          question: "İK360 sistemine nasıl giriş yaparım?",
          answer: "Ana sayfada 'Giriş Yap' butonuna tıklayın ve e-posta adresiniz ile şifrenizi girin. Eğer hesabınız yoksa 'Kayıt Ol' butonunu kullanarak yeni hesap oluşturabilirsiniz."
        },
        {
          question: "İlk kez kullanıyorum, nereden başlamalıyım?",
          answer: "Sisteme ilk giriş yaptığınızda dashboard sayfasında genel bir bakış göreceksiniz. İlk olarak 'Çalışanlar' menüsünden çalışan bilgilerini ekleyebilir, sonra departmanları ve pozisyonları tanımlayabilirsiniz."
        },
        {
          question: "Şifremi unuttum, ne yapmalıyım?",
          answer: "Giriş sayfasında 'Şifremi Unuttum' linkine tıklayın. E-posta adresinizi girin ve size gönderilen link ile şifrenizi yenileyebilirsiniz."
        }
      ]
    },
    {
      id: "employees",
      title: "Çalışan Yönetimi",
      icon: Users,
      items: [
        {
          question: "Yeni çalışan nasıl eklerim?",
          answer: "Çalışanlar sayfasında 'Yeni Çalışan Ekle' butonuna tıklayın. Gerekli bilgileri doldurun: ad, soyad, e-posta, telefon, departman, pozisyon, başlangıç tarihi ve maaş bilgileri."
        },
        {
          question: "Çalışan bilgilerini nasıl düzenlerim?",
          answer: "Çalışanlar listesinde ilgili çalışanın satırındaki 'Düzenle' butonuna tıklayın. Bilgileri güncelledikten sonra 'Kaydet' butonuna basın."
        },
        {
          question: "Çalışanları nasıl filtreleyebilirim?",
          answer: "Çalışanlar sayfasında arama kutusunu kullanarak ad, departman veya pozisyona göre arama yapabilirsiniz. Ayrıca durum filtreleri ile aktif, pasif veya izinli çalışanları görebilirsiniz."
        },
        {
          question: "Çalışan verilerini nasıl dışa aktarırım?",
          answer: "Çalışanlar sayfasında 'Dışa Aktar' butonuna tıklayın. Excel formatında tüm çalışan bilgilerini indirebilirsiniz."
        }
      ]
    },
    {
      id: "leaves",
      title: "İzin Yönetimi",
      icon: Calendar,
      items: [
        {
          question: "İzin talebi nasıl oluştururum?",
          answer: "İzinler sayfasında 'Yeni İzin Talebi' butonuna tıklayın. Çalışanı seçin, izin türünü belirleyin, başlangıç ve bitiş tarihlerini girin, gerekçeyi yazın."
        },
        {
          question: "İzin taleplerini nasıl onaylarım?",
          answer: "İzinler listesinde 'Beklemede' durumundaki talepleri görebilirsiniz. İlgili talebin yanındaki 'Onayla' veya 'Reddet' butonlarını kullanın."
        },
        {
          question: "İzin türleri nelerdir?",
          answer: "Sistem standart olarak Yıllık İzin, Hastalık İzni, Doğum İzni, Evlilik İzni, Vefat İzni türlerini destekler. Yönetici yetkisiyle yeni izin türleri eklenebilir."
        },
        {
          question: "İzin bakiyelerini nasıl takip ederim?",
          answer: "Her çalışanın profil sayfasında mevcut izin bakiyeleri görüntülenir. Dashboard'da da genel izin istatistikleri bulunur."
        }
      ]
    },
    {
      id: "payroll",
      title: "Bordro Yönetimi",
      icon: DollarSign,
      items: [
        {
          question: "Bordro nasıl oluştururum?",
          answer: "Bordro sayfasında 'Yeni Bordro' butonuna tıklayın. Çalışanı seçin, dönem belirleyin, temel maaş ve ek ödemeleri girin."
        },
        {
          question: "Toplu bordro nasıl hazırlarım?",
          answer: "Bordro sayfasında 'Toplu İşlem' seçeneğini kullanarak tüm aktif çalışanlar için aynı dönemde bordro oluşturabilirsiniz."
        },
        {
          question: "Bordro raporlarını nasıl alırım?",
          answer: "Raporlar sayfasından bordro raporlarını seçebilir, dönem filtresi uygulayarak Excel veya PDF formatında indirebilirsiniz."
        }
      ]
    },
    {
      id: "performance",
      title: "Performans Değerlendirme",
      icon: TrendingUp,
      items: [
        {
          question: "Performans değerlendirmesi nasıl yapılır?",
          answer: "Performans sayfasında 'Yeni Değerlendirme' butonuna tıklayın. Çalışanı seçin, dönem belirleyin ve kriterler üzerinden puanlama yapın."
        },
        {
          question: "Performans hedefleri nasıl belirlenir?",
          answer: "Her çalışan için bireysel hedefler tanımlanabilir. Değerlendirme sırasında bu hedeflere ulaşım oranı değerlendirilir."
        },
        {
          question: "Performans raporları nasıl görüntülenir?",
          answer: "Dashboard'daki performans grafikleri ile genel durumu, detaylı raporlar için Raporlar sayfasını kullanabilirsiniz."
        }
      ]
    },
    {
      id: "reports",
      title: "Raporlama",
      icon: FileText,
      items: [
        {
          question: "Hangi raporları alabilirim?",
          answer: "Çalışan listesi, bordro özetleri, izin raporları, performans analizi, departman bazlı istatistikler gibi kapsamlı raporlar mevcuttur."
        },
        {
          question: "Raporları nasıl filtreleyebilirim?",
          answer: "Tarih aralığı, departman, çalışan grubu gibi kriterlere göre raporları filtreleyebilir ve özelleştirebilirsiniz."
        },
        {
          question: "Raporları hangi formatlarda indirebilirim?",
          answer: "Tüm raporlar Excel (.xlsx) ve PDF formatlarında indirilebilir. Bazı raporlar için CSV seçeneği de mevcuttur."
        }
      ]
    }
  ];

  const filteredSections = helpSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Yardım & Ayarlar
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          İK360 sistemini kullanırken ihtiyacınız olan tüm bilgiler ve sistem ayarları
        </p>
      </div>

      <Tabs defaultValue="help" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="help" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Yardım
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Ayarlar
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            İletişim
          </TabsTrigger>
        </TabsList>

        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Yardım Arama
              </CardTitle>
              <CardDescription>
                Aradığınız konuyu hızlıca bulmak için aşağıdaki arama kutusunu kullanın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Aradığınız konuyu yazın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {filteredSections.map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <section.icon className="h-5 w-5 text-blue-600" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {section.items.map((item, index) => (
                      <AccordionItem key={index} value={`${section.id}-${index}`}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-300">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {searchQuery && filteredSections.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Arama sonucu bulunamadı
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  "{searchQuery}" için sonuç bulunamadı. Lütfen farklı anahtar kelimeler deneyin.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6">
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
                <div className="pt-4">
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Teknik Destek
                </CardTitle>
                <CardDescription>
                  Teknik sorunlarınız için bizimle iletişime geçin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">E-posta</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">destek@ik360.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Telefon</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">+90 (212) 555-0123</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Canlı Destek
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geri Bildirim Gönder</CardTitle>
                <CardDescription>
                  Önerileriniz ve geri bildirimleriniz bizim için değerli
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="feedback-type">Geri Bildirim Türü</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Hata Bildirimi</SelectItem>
                      <SelectItem value="feature">Özellik İsteği</SelectItem>
                      <SelectItem value="improvement">İyileştirme Önerisi</SelectItem>
                      <SelectItem value="other">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="feedback-message">Mesajınız</Label>
                  <Textarea
                    id="feedback-message"
                    placeholder="Geri bildiriminizi buraya yazın..."
                    rows={4}
                  />
                </div>
                <Button className="w-full">
                  Gönder
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sık Sorulan Sorular</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="faq-1">
                  <AccordionTrigger>
                    Sistem güncellemeleri ne sıklıkla yapılır?
                  </AccordionTrigger>
                  <AccordionContent>
                    İK360 sistemi aylık olarak güncellenir. Kritik güvenlik güncellemeleri gerektiğinde hemen uygulanır.
                    Tüm güncellemeler önceden duyurulur ve sistem bakımı genellikle hafta sonları yapılır.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>
                    Verilerim güvende mi?
                  </AccordionTrigger>
                  <AccordionContent>
                    Evet, tüm verileriniz SSL şifreleme ile korunur ve düzenli olarak yedeklenir. 
                    KVKK (Kişisel Verilerin Korunması Kanunu) gerekliliklerine tam uyum sağlanmaktadır.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger>
                    Mobil uygulama var mı?
                  </AccordionTrigger>
                  <AccordionContent>
                    Şu anda mobil uygulamamız bulunmamaktadır, ancak sistem tamamen responsive tasarıma sahip olup 
                    mobil cihazlarda sorunsuz çalışmaktadır. Mobil uygulama geliştirme sürecimiz devam etmektedir.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}