import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Shield, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Calendar,
  FileText,
  TrendingUp,
  Award,
  Globe,
  Zap,
  Building2
} from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">HR360</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/login")}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Oturum aç
              </Button>
              <Button 
                onClick={() => setLocation("/register")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Başlayın
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Microsoft Style */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-light text-gray-900 dark:text-white mb-6 leading-tight">
                İnsan kaynaklarınızı
                <span className="block font-semibold text-blue-600">güçlendirin</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
                Modern, güvenli ve kullanıcı dostu HR platformu ile çalışanlarınızı 
                daha etkili yönetin, performansı artırın ve iş süreçlerinizi optimize edin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setLocation("/register")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
                >
                  Ücretsiz deneyin
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation("/login")}
                  className="border-gray-300 dark:border-gray-600 px-8 py-3 text-lg font-medium"
                >
                  Oturum açın
                </Button>
              </div>
            </div>
            
            {/* Hero Visual - HR Process Illustration */}
            <div className="relative">
              {/* Main Visual Container */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 transform hover:scale-105 transition-transform duration-500">
                
                {/* HR Process Flow */}
                <div className="space-y-8">
                  {/* Header */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
                      <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Entegre HR Süreçleri
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tüm işlemleriniz tek platformda
                    </p>
                  </div>

                  {/* Process Steps */}
                  <div className="space-y-6">
                    {/* Step 1: Employee Management */}
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">Çalışan Yönetimi</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Merkezi dosyalar ve profiller</div>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>

                    {/* Step 2: Performance Tracking */}
                    <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">Performans Takibi</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">360° değerlendirme sistemi</div>
                      </div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    </div>

                    {/* Step 3: Leave Management */}
                    <div className="flex items-center space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">İzin Yönetimi</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Otomatik onay süreçleri</div>
                      </div>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>

                    {/* Step 4: Payroll */}
                    <div className="flex items-center space-x-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">Bordro Yönetimi</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Otomatik hesaplama</div>
                      </div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                    </div>
                  </div>

                  {/* Stats Summary */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">95%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Verimlilik Artışı</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">60%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Zaman Tasarrufu</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">99%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Memnuniyet</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating HR Icons */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl flex items-center justify-center animate-bounce">
                <Award className="h-8 w-8 text-white" />
              </div>
              
              <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-xl flex items-center justify-center animate-pulse">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>

              <div className="absolute top-1/2 -left-8 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg flex items-center justify-center animate-pulse" style={{animationDelay: '2s'}}>
                <TrendingUp className="h-6 w-6 text-white" />
              </div>

              {/* Background Elements */}
              <div className="absolute top-20 -right-20 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full blur-2xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
              Güçlü araçlarla <span className="font-semibold">verimlilik artışı</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light">
              Modern teknoloji ile desteklenen kapsamlı HR çözümleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Çalışan Yönetimi</h3>
              <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Merkezi çalışan veritabanı, organizasyon şeması ve rol yönetimi ile 
                ekibinizi etkin bir şekilde yönetin.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Performans Analizi</h3>
              <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                360 derece değerlendirme, hedef takibi ve detaylı performans raporları 
                ile çalışan gelişimini destekleyin.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Güvenlik & Uyumluluk</h3>
              <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                KVKK uyumlu, bankacılık seviyesinde güvenlik ile verilerinizi 
                en üst düzeyde koruyun.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">İzin Yönetimi</h3>
              <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Otomatik izin hesaplama, onay süreçleri ve takvim entegrasyonu 
                ile izin yönetimini kolaylaştırın.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Bordro & Raporlama</h3>
              <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Otomatik bordro hesaplama, vergi entegrasyonu ve kapsamlı 
                raporlama araçları ile finansal süreçleri yönetin.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Global Erişim</h3>
              <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Bulut tabanlı mimari ile her yerden, her cihazdan güvenli 
                erişim imkanı sağlayın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
              Rakamlarla <span className="font-semibold">güven</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-light text-blue-600 dark:text-blue-400 mb-2">500+</div>
              <div className="text-lg text-gray-600 dark:text-gray-300 font-light">Mutlu şirket</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-light text-green-600 dark:text-green-400 mb-2">50.000+</div>
              <div className="text-lg text-gray-600 dark:text-gray-300 font-light">Aktif kullanıcı</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-light text-purple-600 dark:text-purple-400 mb-2">99.9%</div>
              <div className="text-lg text-gray-600 dark:text-gray-300 font-light">Sistem uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light text-white mb-6">
            HR süreçlerinizi <span className="font-semibold">modernize edin</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 font-light">
            Bugün başlayın, farkı hemen görün. 30 gün ücretsiz deneme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setLocation("/register")}
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg font-medium"
            >
              Ücretsiz başlayın
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => setLocation("/login")}
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-medium"
            >
              Giriş yapın
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">HR360</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 HR360. Tüm hakları saklıdır.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}