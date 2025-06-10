import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/use-language";
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
  MessageCircle
} from "lucide-react";
import { useState } from "react";

export default function Help() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const helpSections = [
    {
      id: "employees",
      title: "Çalışan Yönetimi",
      icon: Users,
      content: [
        {
          question: "Yeni çalışan nasıl eklenir?",
          answer: "Çalışanlar sayfasında 'Çalışan Ekle' butonuna tıklayın. Gerekli bilgileri doldurun ve kaydedin."
        },
        {
          question: "Çalışan bilgileri nasıl güncellenir?",
          answer: "Çalışan listesinde düzenlemek istediğiniz çalışanın yanındaki düzenle ikonuna tıklayın."
        },
        {
          question: "Toplu çalışan verisi nasıl yüklenir?",
          answer: "Excel şablonunu indirin, verileri doldurun ve 'Veri Yükle' özelliğini kullanın."
        }
      ]
    },
    {
      id: "leaves",
      title: "İzin Yönetimi",
      icon: Calendar,
      content: [
        {
          question: "İzin talebi nasıl oluşturulur?",
          answer: "İzinler sayfasında 'İzin Ekle' butonuna tıklayın. İzin türü, tarih aralığı ve sebep bilgilerini girin."
        },
        {
          question: "İzin durumu nasıl güncellenir?",
          answer: "İzin listesinde durumu değiştirmek istediğiniz izni seçin ve onay/red işlemini yapın."
        },
        {
          question: "İzin raporları nasıl alınır?",
          answer: "Raporlar sayfasında izin raporlarını filtreleyebilir ve Excel formatında dışa aktarabilirsiniz."
        }
      ]
    },
    {
      id: "payroll",
      title: "Bordro Yönetimi",
      icon: DollarSign,
      content: [
        {
          question: "Bordro nasıl hesaplanır?",
          answer: "Bordro sayfasında çalışan seçin, dönem belirleyin ve maaş bilgilerini girin. Sistem otomatik hesaplama yapar."
        },
        {
          question: "Toplu bordro işlemi nasıl yapılır?",
          answer: "Tüm çalışanlar için aynı anda bordro oluşturmak için 'Toplu İşlem' özelliğini kullanın."
        },
        {
          question: "Bordro raporları nasıl dışa aktarılır?",
          answer: "Raporlar bölümünden bordro verilerini Excel formatında indirebilirsiniz."
        }
      ]
    },
    {
      id: "performance",
      title: "Performans Değerlendirme",
      icon: TrendingUp,
      content: [
        {
          question: "Performans değerlendirmesi nasıl yapılır?",
          answer: "Performans sayfasında çalışan seçin, değerlendirme kriterlerini puanlayın ve yorumlar ekleyin."
        },
        {
          question: "Performans hedefleri nasıl belirlenir?",
          answer: "Her çalışan için SMART hedefler belirleyin ve düzenli takip yapın."
        },
        {
          question: "Performans raporları nasıl oluşturulur?",
          answer: "Raporlar sayfasından performans analizlerini görüntüleyebilir ve dışa aktarabilirsiniz."
        }
      ]
    },
    {
      id: "reports",
      title: "Raporlama",
      icon: FileText,
      content: [
        {
          question: "Hangi raporlar mevcut?",
          answer: "Çalışan, izin, bordro ve performans raporları mevcuttur. Tümü Excel formatında dışa aktarılabilir."
        },
        {
          question: "Özel filtreler nasıl uygulanır?",
          answer: "Her rapor sayfasında tarih aralığı, departman ve durum filtrelerini kullanabilirsiniz."
        },
        {
          question: "Otomatik raporlar nasıl ayarlanır?",
          answer: "Ayarlar sayfasından belirli aralıklarla otomatik rapor oluşturma özelliğini aktifleştirebilirsiniz."
        }
      ]
    },
    {
      id: "settings",
      title: "Sistem Ayarları",
      icon: Settings,
      content: [
        {
          question: "Kullanıcı yetkileri nasıl yönetilir?",
          answer: "Ayarlar sayfasından kullanıcı rollerini ve yetkilerini düzenleyebilirsiniz."
        },
        {
          question: "Sistem yedekleme nasıl yapılır?",
          answer: "Ayarlar > Veri Yönetimi bölümünden veritabanı yedeği alabilirsiniz."
        },
        {
          question: "Bildirim ayarları nasıl yapılandırılır?",
          answer: "Kişisel ayarlardan e-posta ve sistem bildirimlerini özelleştirebilirsiniz."
        }
      ]
    }
  ];

  const filteredSections = helpSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.some(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yardım ve Destek</h1>
          <p className="text-muted-foreground">
            İK360 sistemi hakkında detaylı bilgi ve kullanım kılavuzu
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          v1.0.0
        </Badge>
      </div>

      {/* Arama */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Yardım Ara
          </CardTitle>
          <CardDescription>
            Aradığınız konuyu hızlıca bulun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Arama yapın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="guide" className="space-y-4">
        <TabsList>
          <TabsTrigger value="guide">Kullanım Kılavuzu</TabsTrigger>
          <TabsTrigger value="faq">Sık Sorulan Sorular</TabsTrigger>
          <TabsTrigger value="contact">İletişim</TabsTrigger>
          <TabsTrigger value="updates">Güncellemeler</TabsTrigger>
        </TabsList>

        <TabsContent value="guide" className="space-y-4">
          <div className="grid gap-4">
            {filteredSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {section.content.map((item, index) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4">
                        <h4 className="font-medium text-sm mb-1">{item.question}</h4>
                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Genel Sorular</CardTitle>
              <CardDescription>En sık sorulan sorular ve yanıtları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-2 border-primary/20 pl-4">
                  <h4 className="font-medium mb-1">Sistem ne kadar kullanıcıyı destekler?</h4>
                  <p className="text-sm text-muted-foreground">
                    İK360 sistemi sınırsız kullanıcı desteği sunar. Performans lisansınıza bağlıdır.
                  </p>
                </div>
                <div className="border-l-2 border-primary/20 pl-4">
                  <h4 className="font-medium mb-1">Verilerim güvende mi?</h4>
                  <p className="text-sm text-muted-foreground">
                    Evet, tüm veriler şifrelenmiş olarak saklanır ve düzenli yedekleme yapılır.
                  </p>
                </div>
                <div className="border-l-2 border-primary/20 pl-4">
                  <h4 className="font-medium mb-1">Mobil uygulaması var mı?</h4>
                  <p className="text-sm text-muted-foreground">
                    Web tabanlı sistem tüm cihazlarda responsive olarak çalışır. Mobil uygulama yakında gelecek.
                  </p>
                </div>
                <div className="border-l-2 border-primary/20 pl-4">
                  <h4 className="font-medium mb-1">API entegrasyonu mümkün mü?</h4>
                  <p className="text-sm text-muted-foreground">
                    Evet, REST API ile diğer sistemlerle entegrasyon sağlayabilirsiniz.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>İletişim Bilgileri</CardTitle>
                <CardDescription>Bizimle iletişime geçin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">+90 (212) 555-0123</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">destek@ik360.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Canlı Destek (7/24)</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Destek Talebi</CardTitle>
                <CardDescription>Sorunuz varsa bize yazın</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Konu" />
                <Textarea placeholder="Mesajınız..." rows={4} />
                <Button className="w-full">
                  Gönder
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Son Güncellemeler</CardTitle>
              <CardDescription>Sistem güncellemeleri ve yeni özellikler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">v1.0.0</Badge>
                    <span className="text-xs text-muted-foreground">10 Haziran 2025</span>
                  </div>
                  <h4 className="font-medium mb-1">İlk Sürüm Yayınlandı</h4>
                  <p className="text-sm text-muted-foreground">
                    Çalışan yönetimi, izin takibi, bordro hesaplama ve performans değerlendirme özellikleri.
                  </p>
                </div>
                <div className="border-l-2 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">Yakında</Badge>
                    <span className="text-xs text-muted-foreground">Temmuz 2025</span>
                  </div>
                  <h4 className="font-medium mb-1">Mobil Uygulama</h4>
                  <p className="text-sm text-muted-foreground">
                    iOS ve Android uygulamaları ile mobil erişim.
                  </p>
                </div>
                <div className="border-l-2 border-purple-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">Planlanan</Badge>
                    <span className="text-xs text-muted-foreground">Ağustos 2025</span>
                  </div>
                  <h4 className="font-medium mb-1">AI Destekli Analizler</h4>
                  <p className="text-sm text-muted-foreground">
                    Yapay zeka ile performans analizi ve öngörülü raporlama.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}