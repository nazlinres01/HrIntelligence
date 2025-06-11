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
  MapPin,
  ThumbsUp,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
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
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Sol taraf - Metin içeriği */}
            <div className="max-w-2xl">
              <Badge className="mb-6 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                <Star className="h-3 w-3 mr-1" />
                Türkiye'nin En Güvenilir İK Platformu
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                  İnsan Kaynakları
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Yönetiminde Devrim
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                Yapay zeka destekli, bulut tabanlı İK yönetim sistemi ile şirketinizi geleceğe taşıyın. 
                Çalışan deneyimini optimize edin, süreçleri otomatikleştirin ve stratejik kararlara odaklanın.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
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

              <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-400">
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

            {/* Sağ taraf - Hero görseli */}
            <div className="relative">
              <div className="relative z-10 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Mock dashboard interface */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">HRFlow Pro Dashboard</h3>
                      <p className="text-blue-100 text-sm">Örnek Şirket A.Ş.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Stats cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-between mb-2">
                        <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">+12%</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">287</p>
                      <p className="text-sm text-green-700 dark:text-green-300">Aktif Çalışan</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between mb-2">
                        <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">4.8/5</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">%94</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Memnuniyet</p>
                    </div>
                  </div>
                  
                  {/* Employee list preview */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Son Eklenen Çalışanlar</h4>
                    {[
                      { name: "Ahmet Kaya", role: "Yazılım Geliştirici", avatar: "AK" },
                      { name: "Elif Demir", role: "İK Uzmanı", avatar: "ED" },
                      { name: "Mehmet Özkan", role: "Proje Müdürü", avatar: "MÖ" }
                    ].map((employee, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {employee.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{employee.name}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{employee.role}</p>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
              <strong className="text-2xl text-slate-900 dark:text-slate-100">10.000+</strong> şirket güveniyor
            </p>
            
            {/* Company logos with visual representation */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {[
                { name: "TechCorp", color: "from-blue-500 to-blue-600", icon: "T" },
                { name: "InnovateLtd", color: "from-green-500 to-green-600", icon: "I" },
                { name: "FutureCo", color: "from-purple-500 to-purple-600", icon: "F" },
                { name: "NextGen", color: "from-orange-500 to-orange-600", icon: "N" },
                { name: "SmartBiz", color: "from-red-500 to-red-600", icon: "S" },
                { name: "ProSoft", color: "from-indigo-500 to-indigo-600", icon: "P" }
              ].map((company, index) => (
                <div key={index} className="flex flex-col items-center space-y-3 group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${company.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-xl">{company.icon}</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats with icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {[
              { value: "10.000+", label: "Aktif Şirket", icon: Building2, color: "text-blue-600" },
              { value: "2M+", label: "Çalışan", icon: Users, color: "text-green-600" },
              { value: "99.9%", label: "Uptime", icon: Shield, color: "text-purple-600" },
              { value: "4.9/5", label: "Müşteri Puanı", icon: Star, color: "text-yellow-600" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color.replace('text-', 'from-').replace('-600', '-100')} to-${stat.color.replace('text-', '').replace('-600', '-200')} dark:from-${stat.color.replace('text-', '').replace('-600', '-900')}/30 dark:to-${stat.color.replace('text-', '').replace('-600', '-800')}/30 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color} dark:${stat.color.replace('-600', '-400')}`} />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{stat.label}</p>
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
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
              <Award className="h-3 w-3 mr-1" />
              Müşteri Yorumları
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Binlerce şirket HRFlow Pro ile dijital dönüşümlerini tamamladı
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-400 italic text-base leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center space-x-4">
                    {/* Professional avatar with gradient backgrounds */}
                    <div className={`w-14 h-14 bg-gradient-to-br ${
                      index === 0 ? 'from-blue-500 to-indigo-600' :
                      index === 1 ? 'from-green-500 to-emerald-600' :
                      'from-purple-500 to-pink-600'
                    } rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-lg">{testimonial.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {testimonial.position}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">
                        {testimonial.company}
                      </p>
                    </div>
                    {/* Company logo representation */}
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                    </div>
                  </div>
                  
                  {/* Achievement badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {index === 0 && (
                      <>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          %40 Zaman Tasarrufu
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          ROI: %300
                        </Badge>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                          500+ Çalışan
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                          %95 Memnuniyet
                        </Badge>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <Badge variant="secondary" className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          Sıfır Hata
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                          7/24 Destek
                        </Badge>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional testimonial stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-slate-200 dark:border-slate-700">
            {[
              { metric: "4.9/5", label: "Ortalama Puan", icon: Star },
              { metric: "%98", label: "Müşteri Memnuniyeti", icon: Star },
              { metric: "24 saat", label: "Ortalama Kurulum", icon: Clock },
              { metric: "%99.9", label: "Uptime Garantisi", icon: Shield }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.metric}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{stat.label}</p>
              </div>
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
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-20 px-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Company Info - Enhanced */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">HRFlow Pro</h3>
                  <p className="text-sm text-blue-300">Enterprise HR Management</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6 leading-relaxed">
                Türkiye'nin en güvenilir İK yönetim platformu. 10.000+ şirket tarafından tercih ediliyor. 
                Dijital dönüşüm yolculuğunuzda güvenilir ortağınız.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 text-blue-400" />
                  </div>
                  <span>info@hrflowpro.com</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-8 h-8 bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Phone className="h-4 w-4 text-green-400" />
                  </div>
                  <span>+90 212 555 0123</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-8 h-8 bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-purple-400" />
                  </div>
                  <span>Maslak, İstanbul</span>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, color: "hover:bg-blue-600", name: "Facebook" },
                  { icon: Twitter, color: "hover:bg-sky-500", name: "Twitter" },
                  { icon: Linkedin, color: "hover:bg-blue-700", name: "LinkedIn" },
                  { icon: Instagram, color: "hover:bg-pink-600", name: "Instagram" }
                ].map((social, index) => (
                  <div key={index} className={`w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${social.color} group`}>
                    <social.icon className="h-5 w-5 text-slate-400 group-hover:text-white" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-bold mb-6 text-lg text-white">Ürün</h4>
              <ul className="space-y-3 text-slate-300">
                {[
                  { name: "Özellikler", icon: Star },
                  { name: "Fiyatlandırma", icon: CreditCard },
                  { name: "API Dokümantasyonu", icon: Database },
                  { name: "Entegrasyonlar", icon: Globe },
                  { name: "Güvenlik", icon: Shield }
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3 hover:text-white cursor-pointer transition-colors group">
                    <item.icon className="h-4 w-4 text-slate-500 group-hover:text-blue-400" />
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-bold mb-6 text-lg text-white">Şirket</h4>
              <ul className="space-y-3 text-slate-300">
                {[
                  { name: "Hakkımızda", icon: Building2 },
                  { name: "Kariyer", icon: Users },
                  { name: "Blog", icon: Globe },
                  { name: "Basın Kiti", icon: Award },
                  { name: "Yatırımcılar", icon: TrendingUp }
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3 hover:text-white cursor-pointer transition-colors group">
                    <item.icon className="h-4 w-4 text-slate-500 group-hover:text-blue-400" />
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-bold mb-6 text-lg text-white">Destek</h4>
              <ul className="space-y-3 text-slate-300">
                {[
                  { name: "Yardım Merkezi", icon: HeadphonesIcon },
                  { name: "Canlı Destek", icon: Mail },
                  { name: "Video Eğitimler", icon: Globe },
                  { name: "Sistem Durumu", icon: Shield },
                  { name: "İletişim", icon: Phone }
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3 hover:text-white cursor-pointer transition-colors group">
                    <item.icon className="h-4 w-4 text-slate-500 group-hover:text-blue-400" />
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 pt-8 border-t border-slate-800">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="font-bold text-xl text-white mb-2">İK Trendlerini Kaçırmayın</h4>
                <p className="text-slate-300">Haftalık newsletter ile son gelişmeleri takip edin</p>
              </div>
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="email" 
                    placeholder="E-posta adresiniz" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 px-6">
                  Abone Ol
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm">
              <span>© 2024 HRFlow Pro. Tüm hakları saklıdır.</span>
              <span className="hidden md:inline">•</span>
              <Link href="/privacy" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
              <span className="hidden md:inline">•</span>
              <Link href="/terms" className="hover:text-white transition-colors">Kullanım Şartları</Link>
              <span className="hidden md:inline">•</span>
              <Link href="/cookies" className="hover:text-white transition-colors">Çerez Politikası</Link>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <Shield className="h-4 w-4 text-green-400" />
                <span>ISO 27001 Sertifikalı</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <Lock className="h-4 w-4 text-blue-400" />
                <span>KVKK Uyumlu</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}