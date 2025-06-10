import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { 
  HelpCircle, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Search,
  Phone,
  Mail,
  MessageCircle,
  AlertCircle,
  Book,
  Video,
  Download
} from "lucide-react";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");

  const helpSections = [
    {
      id: "getting-started",
      title: "Başlangıç",
      icon: Users,
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
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Yardım
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          İK360 sistemini kullanırken ihtiyacınız olan tüm bilgiler
        </p>
      </div>

      <div className="grid gap-6">
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
              <AccordionItem value="faq-4">
                <AccordionTrigger>
                  Veri yedekleme nasıl yapılır?
                </AccordionTrigger>
                <AccordionContent>
                  Sistem otomatik olarak günlük yedekleme yapar. Manuel yedekleme için Ayarlar sayfasındaki 
                  "Veri Yönetimi" bölümünden "Veri Yedekle" butonunu kullanabilirsiniz.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-600" />
              Ek Kaynaklar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Video className="h-6 w-6 mb-2" />
                Video Eğitimler
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Download className="h-6 w-6 mb-2" />
                Kullanım Kılavuzu
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <MessageCircle className="h-6 w-6 mb-2" />
                Topluluk Forumu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}