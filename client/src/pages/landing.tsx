import React, { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Shield, 
  BarChart3, 
  Clock, 
  CreditCard,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Award,
  TrendingUp,
  Zap,
  Lock,
  Database,
  Cloud,
  HeadphonesIcon,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

export default function Landing() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Users,
      title: "Çalışan Yönetimi",
      description: "Kapsamlı personel takibi, organizasyon şeması ve detaylı çalışan profilleri",
      benefits: ["360° çalışan görünümü", "Otomatik organizasyon şeması", "Performans analitikleri"]
    },
    {
      icon: BarChart3,
      title: "Performans Takibi",
      description: "Gerçek zamanlı performans metrikleri ve analitik raporlar",
      benefits: ["KPI takibi", "Trend analizi", "Benchmark karşılaştırması"]
    },
    {
      icon: Clock,
      title: "İzin Yönetimi",
      description: "Akıllı izin planlama ve otomatik onay süreçleri",
      benefits: ["Akıllı planlama", "Otomatik onaylar", "Takvim entegrasyonu"]
    },
    {
      icon: CreditCard,
      title: "Bordro Sistemi",
      description: "Otomatik bordro hesaplama ve vergi uyumluluk sistemi",
      benefits: ["Otomatik hesaplama", "Vergi uyumu", "Detaylı raporlama"]
    }
  ];

  const testimonials = [
    {
      name: "Ahmet Kaya",
      position: "İK Müdürü",
      company: "TechCorp",
      content: "Bu sistem sayesinde İK süreçlerimizi %80 hızlandırdık. Artık stratejik işlere daha fazla zaman ayırabiliyoruz.",
      rating: 5
    },
    {
      name: "Elif Demir",
      position: "CEO",
      company: "InnovateTech",
      content: "Çalışan memnuniyeti %95'e çıktı. Sistem son derece kullanıcı dostu ve güvenilir.",
      rating: 5
    },
    {
      name: "Mehmet Özkan",
      position: "Operasyon Müdürü", 
      company: "GlobalSoft",
      content: "Raporlama sistemi harika. Yönetim kararlarımızı artık veriye dayalı olarak alabiliyoruz.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Corporate Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  HRFlow Pro
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">Enterprise HR Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-slate-700 dark:text-slate-300">
                Özellikler
              </Button>
              <Button variant="ghost" className="text-slate-700 dark:text-slate-300">
                Fiyatlandırma
              </Button>
              <Button variant="ghost" className="text-slate-700 dark:text-slate-300">
                İletişim
              </Button>
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
              <Link href="/login">
                <Button variant="outline" className="border-slate-300 dark:border-slate-600">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg">
                  Ücretsiz Dene
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
              <Star className="h-3 w-3 mr-1" />
              Türkiye'nin En Güvenilir İK Platformu
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                İnsan Kaynakları
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Yönetiminde Devrim
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Yapay zeka destekli, bulut tabanlı İK yönetim sistemi ile şirketinizi geleceğe taşıyın. 
              Çalışan deneyimini optimize edin, süreçleri otomatikleştirin ve stratejik kararlara odaklanın.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-4 text-lg shadow-2xl">
                  <Zap className="h-5 w-5 mr-2" />
                  30 Gün Ücretsiz Başla
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-slate-300 dark:border-slate-600">
                <Globe className="h-5 w-5 mr-2" />
                Demo İzle
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Kredi kartı gerekmez
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Anında kurulum
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                7/24 destek
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-slate-600 dark:text-slate-400 font-medium">5000+ şirket tarafından güveniliyor</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {["TechCorp", "InnovateTech", "GlobalSoft", "NextGen", "FutureTech", "CloudFlow"].map((company) => (
              <div key={company} className="text-2xl font-bold text-slate-400 dark:text-slate-600">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
              Özellikler
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Her İhtiyacınıza Uygun Çözümler
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Modern İK yönetimi için ihtiyacınız olan tüm araçlar tek platformda
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeFeature === index 
                      ? 'border-blue-500 dark:border-blue-400 shadow-xl bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activeFeature === index 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-slate-900 dark:text-slate-100">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 dark:text-slate-400 mb-3">
                      {feature.description}
                    </CardDescription>
                    {activeFeature === index && (
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 shadow-2xl">
                <div className="w-full h-96 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {features[activeFeature].title}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {features[activeFeature].benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Güvenlik
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Kurumsal Düzeyde Güvenlik
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Verileriniz askeri düzeyde şifreleme ve güvenlik protokolleri ile korunuyor
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-green-200 dark:border-green-800 bg-white dark:bg-slate-800">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-slate-900 dark:text-slate-100">AES-256 Şifreleme</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Tüm verileriniz askeri standartlarda şifreleme ile korunuyor. Hem transit hem de storage seviyesinde güvenlik.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-slate-900 dark:text-slate-100">KVKK Uyumlu</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Türkiye KVKK ve Avrupa GDPR standartlarına tam uyumlu. Kişisel veri güvenliği garantili.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Cloud className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-slate-900 dark:text-slate-100">ISO 27001</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Uluslararası bilgi güvenliği yönetim sistemi standartlarına sahip altyapı.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
              <Award className="h-3 w-3 mr-1" />
              Müşteri Yorumları
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-400 italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{testimonial.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {testimonial.position}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              İK Süreçlerinizi Bugün Dönüştürün
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Binlerce şirketin tercih ettiği İK platformu ile tanışın. 30 gün ücretsiz deneyin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-4 text-lg shadow-xl">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Hemen Başla
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 text-lg">
                <HeadphonesIcon className="h-5 w-5 mr-2" />
                Danışman ile Görüş
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">HRFlow Pro</h3>
                  <p className="text-xs text-slate-400">Enterprise HR Management</p>
                </div>
              </div>
              <p className="text-slate-400 mb-4">
                Türkiye'nin en güvenilir İK yönetim platformu. 5000+ şirket tarafından tercih ediliyor.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-700">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-700">
                  <Phone className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ürün</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white cursor-pointer">Özellikler</li>
                <li className="hover:text-white cursor-pointer">Fiyatlandırma</li>
                <li className="hover:text-white cursor-pointer">API</li>
                <li className="hover:text-white cursor-pointer">Entegrasyonlar</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Şirket</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white cursor-pointer">Hakkımızda</li>
                <li className="hover:text-white cursor-pointer">Kariyer</li>
                <li className="hover:text-white cursor-pointer">Blog</li>
                <li className="hover:text-white cursor-pointer">Basın</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Destek</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white cursor-pointer">Yardım Merkezi</li>
                <li className="hover:text-white cursor-pointer">Dokümantasyon</li>
                <li className="hover:text-white cursor-pointer">İletişim</li>
                <li className="hover:text-white cursor-pointer">Durumu</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">© 2024 HRFlow Pro. Tüm hakları saklıdır.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white text-sm">Gizlilik Politikası</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm">Kullanım Şartları</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm">KVKK</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}