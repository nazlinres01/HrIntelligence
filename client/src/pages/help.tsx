import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  Play,
  Download,
  Upload,
  Shield,
  Zap
} from "lucide-react";

export default function Help() {
  const [searchTerm, setSearchTerm] = useState("");

  const quickStartGuide = [
    {
      step: 1,
      title: "Hesap Kurulumu",
      description: "İlk giriş yapın ve profil bilgilerinizi tamamlayın",
      icon: Users,
      actions: ["Profil fotoğrafı yükleyin", "İletişim bilgilerini ekleyin", "Şirket bilgilerini güncelleyin"]
    },
    {
      step: 2,
      title: "Çalışan Ekleme",
      description: "İlk çalışanlarınızı sisteme ekleyin",
      icon: Users,
      actions: ["Çalışanlar sayfasına gidin", "Yeni Çalışan butonuna tıklayın", "Gerekli bilgileri doldurun"]
    },
    {
      step: 3,
      title: "Departman Yönetimi",
      description: "Şirket departmanlarınızı organize edin",
      icon: Settings,
      actions: ["Departmanları tanımlayın", "Yöneticileri atayın", "Hiyerarşi oluşturun"]
    },
    {
      step: 4,
      title: "İzin Sistemi",
      description: "İzin süreçlerini başlatın",
      icon: Calendar,
      actions: ["İzin türlerini belirleyin", "Onay süreçlerini ayarlayın", "İzin takvimini kontrol edin"]
    }
  ];

  const faqItems = [
    {
      category: "Genel",
      questions: [
        {
          question: "İK360 nedir ve nasıl çalışır?",
          answer: "İK360, küçük ve orta ölçekli işletmeler için tasarlanmış kapsamlı bir insan kaynakları yönetim sistemidir. Çalışan bilgileri, izin yönetimi, bordro, performans değerlendirme ve raporlama gibi tüm İK süreçlerini tek platformda yönetmenizi sağlar."
        },
        {
          question: "Sistem güvenli mi?",
          answer: "Evet, İK360 enterprise düzeyinde güvenlik önlemleri kullanır. Verileriniz şifrelenir, düzenli yedeklenir ve sadece yetkili kişiler erişebilir. KVKK uyumlu olarak tasarlanmıştır."
        },
        {
          question: "Kaç çalışan ekleyebilirim?",
          answer: "İK360 sınırsız çalışan ekleme imkanı sunar. Sistemin performansı çalışan sayısından etkilenmez."
        }
      ]
    },
    {
      category: "Çalışan Yönetimi",
      questions: [
        {
          question: "Çalışan nasıl eklerim?",
          answer: "Çalışanlar sayfasına gidip 'Yeni Çalışan' butonuna tıklayın. Gerekli bilgileri doldurup kaydedin. Toplu ekleme için Excel dosyası da kullanabilirsiniz."
        },
        {
          question: "Çalışan bilgilerini nasıl düzenlerim?",
          answer: "Çalışan listesinden ilgili kişinin yanındaki düzenle butonuna tıklayın veya çalışan detay sayfasında değişiklik yapın."
        },
        {
          question: "Çalışan fotoğrafı nasıl eklerim?",
          answer: "Çalışan düzenleme sayfasında profil fotoğrafı alanına tıklayarak fotoğraf yükleyebilirsiniz."
        }
      ]
    },
    {
      category: "İzin Yönetimi",
      questions: [
        {
          question: "İzin türleri nelerdir?",
          answer: "Yıllık izin, hastalık izni, mazeret izni, doğum izni ve ücretsiz izin türleri mevcuttur. Özel izin türleri de tanımlayabilirsiniz."
        },
        {
          question: "İzin nasıl onaylanır?",
          answer: "İzin talepleri otomatik olarak ilgili yöneticilere gider. Yöneticiler izinleri onaylayabilir veya reddedebilir."
        },
        {
          question: "İzin bakiyeleri nasıl hesaplanır?",
          answer: "Sistem otomatik olarak çalışanların yıllık izin haklarını hesaplar ve kullanılan izinleri düşer."
        }
      ]
    },
    {
      category: "Bordro",
      questions: [
        {
          question: "Bordro nasıl hazırlanır?",
          answer: "Bordro sayfasında 'Yeni Bordro' butonuna tıklayın, dönem seçin ve çalışan bilgilerini girin. Sistem otomatik hesaplamalar yapar."
        },
        {
          question: "Bordro raporları nasıl alınır?",
          answer: "Raporlar sayfasından bordro raporunu seçin, tarih aralığını belirleyin ve Excel veya PDF formatında indirin."
        }
      ]
    }
  ];

  const features = [
    {
      title: "Çalışan Yönetimi",
      icon: Users,
      description: "Kapsamlı çalışan profilleri ve organizasyon şeması",
      features: ["Detaylı çalışan profilleri", "Organizasyon şeması", "Toplu veri aktarımı", "Arama ve filtreleme"]
    },
    {
      title: "İzin Yönetimi",
      icon: Calendar,
      description: "Otomatik izin hesaplama ve onay süreçleri",
      features: ["Çoklu izin türleri", "Otomatik onay süreçleri", "İzin takvimi", "Bakiye takibi"]
    },
    {
      title: "Bordro Yönetimi",
      icon: DollarSign,
      description: "Otomatik bordro hesaplama ve raporlama",
      features: ["Otomatik hesaplamalar", "Vergi hesaplamaları", "Bordro raporları", "Ödeme takibi"]
    },
    {
      title: "Performans Değerlendirme",
      icon: BarChart3,
      description: "360 derece performans değerlendirme sistemi",
      features: ["Hedef belirleme", "Düzenli değerlendirmeler", "Performans raporları", "Gelişim planları"]
    },
    {
      title: "Raporlama",
      icon: FileText,
      description: "Gelişmiş analitik ve raporlama araçları",
      features: ["Detaylı raporlar", "Görsel analizler", "Excel/PDF export", "Özel raporlar"]
    },
    {
      title: "Güvenlik",
      icon: Shield,
      description: "Enterprise düzeyinde güvenlik ve yedekleme",
      features: ["KVKK uyumu", "Veri şifreleme", "Otomatik yedekleme", "Kullanıcı yetkileri"]
    }
  ];

  const tutorials = [
    {
      title: "İlk Kurulum Rehberi",
      duration: "10 dakika",
      description: "Sistemi kurmak ve ilk ayarları yapmak için adım adım rehber",
      steps: ["Hesap oluşturma", "Şirket bilgileri", "İlk çalışan ekleme", "Departman kurulumu"]
    },
    {
      title: "Çalışan Yönetimi",
      duration: "15 dakika",
      description: "Çalışan ekleme, düzenleme ve yönetme işlemleri",
      steps: ["Yeni çalışan ekleme", "Profil düzenleme", "Toplu işlemler", "Arama ve filtreleme"]
    },
    {
      title: "İzin Süreçleri",
      duration: "12 dakika",
      description: "İzin talep etme, onaylama ve takip işlemleri",
      steps: ["İzin talep etme", "Onay süreçleri", "İzin takvimi", "Raporlama"]
    }
  ];

  const filteredFAQ = faqItems.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => !searchTerm || 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            İK360 Yardım Merkezi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            İK süreçlerinizi etkili bir şekilde yönetmek için ihtiyacınız olan tüm bilgiler burada
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Aradığınız konuyu yazın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        <Tabs defaultValue="quick-start" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="quick-start" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Hızlı Başlangıç
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Özellikler
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Videolar
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              S.S.S
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              İletişim
            </TabsTrigger>
          </TabsList>

          {/* Quick Start */}
          <TabsContent value="quick-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickStartGuide.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.step} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">{item.step}</span>
                        </div>
                        <Icon className="h-6 w-6 text-blue-600" />
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <ul className="space-y-2">
                        {item.actions.map((action, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className="h-8 w-8 text-blue-600" />
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Tutorials */}
          <TabsContent value="tutorials">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                      <Badge variant="secondary">{tutorial.duration}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{tutorial.description}</p>
                    <div className="space-y-2 mb-4">
                      {tutorial.steps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                            {idx + 1}
                          </div>
                          {step}
                        </div>
                      ))}
                    </div>
                    <Button className="w-full" variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Videoyu İzle
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq">
            <div className="max-w-4xl mx-auto">
              {filteredFAQ.map((category, index) => (
                <Card key={index} className="mb-6 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-600">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {category.questions.map((item, idx) => (
                        <AccordionItem key={idx} value={`${index}-${idx}`}>
                          <AccordionTrigger className="text-left">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600 leading-relaxed">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact */}
          <TabsContent value="contact">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Teknik Destek</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">E-posta Desteği</h4>
                      <p className="text-gray-600">destek@ik360.com.tr</p>
                      <p className="text-sm text-gray-500">24 saat içinde yanıt</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Telefon Desteği</h4>
                      <p className="text-gray-600">0850 123 45 67</p>
                      <p className="text-sm text-gray-500">Pazartesi-Cuma 09:00-18:00</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Canlı Destek</h4>
                      <p className="text-gray-600">Sağ alt köşedeki chat butonuna tıklayın</p>
                      <p className="text-sm text-gray-500">Mesai saatleri içinde</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Faydalı Kaynaklar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Kullanıcı Kılavuzu (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Excel Şablonları
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Örnek Veriler
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      API Dokümantasyonu
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-8 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Geri Bildirim</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Önerileriniz ve geri bildirimleriniz bizim için çok değerli. 
                    Sistemi daha iyi hale getirmek için fikirlerinizi paylaşın.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Geri Bildirim Gönder
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}