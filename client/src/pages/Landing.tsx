import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Shield, Globe, Users, BarChart3, Clock, CheckCircle } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Enterprise İK Hub</h1>
                <p className="text-sm text-gray-600">Kurumsal İnsan Kaynakları Yönetim Sistemi</p>
              </div>
            </div>
            <Button onClick={handleLogin} size="lg" className="bg-blue-600 hover:bg-blue-700">
              Sisteme Giriş
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Kurumsal İK Yönetimi için
            <span className="text-blue-600 block">Gelişmiş Çözümler</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Türk şirketleri için özel olarak tasarlanmış, ISO 27001 uyumlu ve SOX standartlarında 
            kurumsal insan kaynakları yönetim sistemi. Güvenli, ölçeklenebilir ve kullanıcı dostu arayüz.
          </p>
          <div className="flex items-center justify-center space-x-6 mb-12">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">SOX Uyumlu</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <Shield className="h-5 w-5" />
              <span className="font-medium">ISO 27001 Sertifikalı</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <Globe className="h-5 w-5" />
              <span className="font-medium">Küresel Standart</span>
            </div>
          </div>
          <Button onClick={handleLogin} size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
            Sisteme Giriş Yap
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Kapsamlı İK Çözümleri</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Personel yönetiminden stratejik planlama ve analitiğe kadar, işletmenizin ihtiyaç duyduğu 
              tüm İK süreçlerini tek platformda yönetin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="p-3 bg-blue-100 rounded-lg w-fit">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Personel Yönetimi</CardTitle>
                <CardDescription>
                  Çalışan bilgileri, departman organizasyonu ve yetki yönetimi sistemi
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="p-3 bg-green-100 rounded-lg w-fit">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Analytics Center</CardTitle>
                <CardDescription>
                  Gerçek zamanlı veri analizi, performans metrikleri ve stratejik raporlama
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="p-3 bg-purple-100 rounded-lg w-fit">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>İzin & Bordro</CardTitle>
                <CardDescription>
                  Otomatik izin hesaplama, bordro yönetimi ve ödeme süreçleri
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-indigo-200 transition-colors">
              <CardHeader>
                <div className="p-3 bg-indigo-100 rounded-lg w-fit">
                  <Shield className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle>Güvenlik & Uyumluluk</CardTitle>
                <CardDescription>
                  Güvenlik denetimi, rol tabanlı erişim ve uyumluluk raporlaması
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-teal-200 transition-colors">
              <CardHeader>
                <div className="p-3 bg-teal-100 rounded-lg w-fit">
                  <Building2 className="h-8 w-8 text-teal-600" />
                </div>
                <CardTitle>Şirket Yönetimi</CardTitle>
                <CardDescription>
                  Çoklu şirket yapısı, organizasyon şeması ve hiyerarşi yönetimi
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <div className="p-3 bg-orange-100 rounded-lg w-fit">
                  <Globe className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Stratejik Planlama</CardTitle>
                <CardDescription>
                  Kurumsal hedef belirleme, proje takibi ve performans yönetimi
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-6">
            İK Süreçlerinizi Dijitalleştirin
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Güvenli, ölçeklenebilir ve kullanıcı dostu Enterprise İK Hub ile 
            işletmenizin insan kaynakları yönetimini modernize edin.
          </p>
          <Button 
            onClick={handleLogin} 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-3 bg-white text-blue-700 hover:bg-gray-50"
          >
            Hemen Başlayın
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">Enterprise İK Hub</p>
                <p className="text-sm text-gray-400">Kurumsal İnsan Kaynakları Çözümleri</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>© 2024 Enterprise İK Hub</span>
              <span>•</span>
              <span>Tüm hakları saklıdır</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}