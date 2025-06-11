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
  Building2,
  Clock
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
            
            {/* Hero Visual - Modern HR Workspace */}
            <div className="relative group">
              {/* Main Visual Container - Microsoft Fluent Design */}
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden backdrop-blur-sm transform hover:scale-105 transition-all duration-700 hover:shadow-3xl">
                
                {/* Professional HR Workspace Illustration */}
                <div className="relative h-96 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 overflow-hidden">
                  
                  {/* Modern Office Background */}
                  <div className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 400 300" fill="none">
                      {/* Office Interior */}
                      <rect width="400" height="300" fill="url(#office-gradient)"/>
                      
                      {/* Windows with City View */}
                      <rect x="20" y="40" width="80" height="120" rx="8" fill="#E8F4FD" stroke="#93C5FD" strokeWidth="2"/>
                      <rect x="120" y="40" width="80" height="120" rx="8" fill="#E8F4FD" stroke="#93C5FD" strokeWidth="2"/>
                      <rect x="220" y="40" width="80" height="120" rx="8" fill="#E8F4FD" stroke="#93C5FD" strokeWidth="2"/>
                      
                      {/* City Skyline in Windows */}
                      <g opacity="0.6">
                        <rect x="30" y="80" width="8" height="60" fill="#3B82F6"/>
                        <rect x="45" y="70" width="12" height="70" fill="#1E40AF"/>
                        <rect x="65" y="90" width="10" height="50" fill="#2563EB"/>
                        <rect x="130" y="75" width="15" height="65" fill="#1D4ED8"/>
                        <rect x="155" y="85" width="8" height="55" fill="#3B82F6"/>
                        <rect x="170" y="70" width="20" height="70" fill="#1E40AF"/>
                      </g>
                      
                      {/* Modern Desk */}
                      <ellipse cx="200" cy="240" rx="140" ry="40" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2"/>
                      
                      {/* Laptop */}
                      <rect x="160" y="200" width="80" height="50" rx="4" fill="#1F2937"/>
                      <rect x="165" y="205" width="70" height="40" rx="2" fill="#3B82F6"/>
                      <circle cx="200" cy="225" r="15" fill="#10B981" opacity="0.8"/>
                      
                      {/* Documents & Reports */}
                      <rect x="270" y="210" width="40" height="30" rx="2" fill="white" stroke="#E5E7EB"/>
                      <rect x="275" y="215" width="30" height="2" fill="#9CA3AF"/>
                      <rect x="275" y="220" width="25" height="2" fill="#9CA3AF"/>
                      <rect x="275" y="225" width="20" height="2" fill="#9CA3AF"/>
                      
                      {/* Coffee Cup */}
                      <ellipse cx="130" cy="220" rx="12" ry="8" fill="#8B5CF6"/>
                      <rect x="125" y="212" width="10" height="16" rx="2" fill="#A78BFA"/>
                      
                      {/* Plant */}
                      <ellipse cx="320" cy="230" rx="15" ry="10" fill="#34D399"/>
                      <rect x="315" y="225" width="10" height="15" rx="1" fill="#059669"/>
                      
                      <defs>
                        <linearGradient id="office-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#EFF6FF"/>
                          <stop offset="50%" stopColor="#DBEAFE"/>
                          <stop offset="100%" stopColor="#BFDBFE"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Floating Data Visualizations */}
                  <div className="absolute top-8 right-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-float">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Analytics</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Çalışan Memnuniyeti</span>
                        <span className="text-green-600 font-semibold">94%</span>
                      </div>
                      <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className="w-[94%] h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* HR Metrics Card */}
                  <div className="absolute bottom-8 left-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-float" style={{animationDelay: '1s'}}>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">247</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Aktif</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">98%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Katılım</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">15</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">İzin</div>
                      </div>
                    </div>
                  </div>

                  {/* Notification Bubbles */}
                  <div className="absolute top-1/2 right-4 space-y-2">
                    <div className="bg-blue-500 text-white text-xs px-3 py-2 rounded-full shadow-lg animate-bounce">
                      <span>Yeni başvuru</span>
                    </div>
                    <div className="bg-green-500 text-white text-xs px-3 py-2 rounded-full shadow-lg animate-bounce" style={{animationDelay: '0.5s'}}>
                      <span>Onay bekliyor</span>
                    </div>
                  </div>

                  {/* Productivity Icons */}
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-lg">
                      <BarChart3 className="h-4 w-4 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 bg-white dark:bg-gray-800">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-2">
                      Modern İK Ekosistemi
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Akıllı otomasyonlar ve veri odaklı kararlar
                    </p>
                  </div>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">Talent Management</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Yetenek havuzunu optimize edin</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">Performance Analytics</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Veri destekli değerlendirme</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Clock className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">Time Intelligence</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Akıllı zaman yönetimi</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-700">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">Compliance Hub</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Otomatik uyumluluk takibi</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Achievement Badges */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl flex items-center justify-center animate-bounce group-hover:animate-spin">
                <Award className="h-6 w-6 text-white" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-2xl flex items-center justify-center animate-pulse">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>

              <div className="absolute top-1/3 -left-6 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-xl flex items-center justify-center animate-pulse" style={{animationDelay: '2s'}}>
                <Zap className="h-4 w-4 text-white" />
              </div>

              {/* Ambient Background */}
              <div className="absolute top-10 -right-20 w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '3s'}}></div>
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