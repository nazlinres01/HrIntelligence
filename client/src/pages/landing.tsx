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
      <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 text-lg px-6 py-2">
              <Star className="h-4 w-4 mr-2" />
              Premium Özellikler
            </Badge>
            <h2 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Her İhtiyacınıza Uygun Çözümler
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Fortune 500 şirketlerinin tercih ettiği teknolojiler ile modern İK yönetimi için ihtiyacınız olan tüm araçlar tek platformda
            </p>
            
            {/* Feature preview images */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "AI Dashboard", description: "Yapay zeka destekli analitikler", gradient: "from-blue-500 to-cyan-500" },
                { title: "Mobile App", description: "Her yerden erişim imkanı", gradient: "from-purple-500 to-pink-500" },
                { title: "Cloud Security", description: "Kurumsal seviye güvenlik", gradient: "from-green-500 to-emerald-500" }
              ].map((item, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className={`w-full h-32 bg-gradient-to-br ${item.gradient} rounded-2xl shadow-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                    <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      {index === 0 && <BarChart3 className="h-10 w-10 text-white" />}
                      {index === 1 && <Users className="h-10 w-10 text-white" />}
                      {index === 2 && <Shield className="h-10 w-10 text-white" />}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
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
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 shadow-2xl">
                <div className="w-full h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  {/* Enhanced dashboard mockup */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <BarChart3 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                            {features[activeFeature].title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">HRFlow Pro Enterprise</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">Canlı Veri</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6 h-full overflow-y-auto">
                    {/* Enterprise-level statistics cards */}
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { 
                          title: "Toplam Çalışan", 
                          value: "2,847", 
                          change: "+12%", 
                          icon: Users, 
                          color: "from-emerald-500 to-green-600",
                          bgColor: "from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20"
                        },
                        { 
                          title: "Aktif Projeler", 
                          value: "156", 
                          change: "+8%", 
                          icon: Building2, 
                          color: "from-blue-500 to-indigo-600",
                          bgColor: "from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20"
                        },
                        { 
                          title: "Aylık Bordro", 
                          value: "₺12.4M", 
                          change: "+5%", 
                          icon: CreditCard, 
                          color: "from-purple-500 to-violet-600",
                          bgColor: "from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20"
                        },
                        { 
                          title: "Memnuniyet", 
                          value: "4.8/5", 
                          change: "+0.3", 
                          icon: Star, 
                          color: "from-orange-500 to-red-600",
                          bgColor: "from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20"
                        }
                      ].map((stat, i) => (
                        <div key={i} className={`bg-gradient-to-br ${stat.bgColor} p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:scale-105 transition-transform duration-300`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                              <stat.icon className="h-4 w-4 text-white" />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                              stat.change.startsWith('+') 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'
                            }`}>
                              {stat.change}
                            </span>
                          </div>
                          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{stat.title}</p>
                        </div>
                      ))}
                    </div>

                    {/* Interactive chart visualization */}
                    <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Departman Performans Analizi</h4>
                        <div className="flex space-x-2">
                          {['Haftalık', 'Aylık', 'Yıllık'].map((period, i) => (
                            <button 
                              key={i} 
                              className={`px-3 py-1 text-xs rounded-full ${
                                i === 1 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {period}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Enhanced chart with data points */}
                      <div className="h-48 flex items-end justify-between px-4">
                        {[
                          { name: 'IT', value: 85, color: 'from-blue-400 to-blue-600' },
                          { name: 'HR', value: 92, color: 'from-green-400 to-green-600' },
                          { name: 'Sales', value: 78, color: 'from-purple-400 to-purple-600' },
                          { name: 'Marketing', value: 88, color: 'from-orange-400 to-orange-600' },
                          { name: 'Finance', value: 90, color: 'from-red-400 to-red-600' },
                          { name: 'Operations', value: 82, color: 'from-indigo-400 to-indigo-600' },
                          { name: 'R&D', value: 95, color: 'from-teal-400 to-teal-600' }
                        ].map((dept, i) => (
                          <div key={i} className="flex flex-col items-center space-y-3 group cursor-pointer">
                            <div className="relative">
                              <div 
                                className={`w-12 bg-gradient-to-t ${dept.color} rounded-t-lg shadow-lg group-hover:shadow-xl transition-all duration-300 relative`}
                                style={{ height: `${dept.value * 1.8}px` }}
                              >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  {dept.value}%
                                </div>
                              </div>
                              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full opacity-80"></div>
                            </div>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                              {dept.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent activity feed */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                        <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          Son Aktiviteler
                        </h5>
                        <div className="space-y-3">
                          {[
                            { user: "Ahmet K.", action: "Yeni çalışan ekledi", time: "2 dk önce", avatar: "AK" },
                            { user: "Zehra A.", action: "Bordro onayladı", time: "15 dk önce", avatar: "ZA" },
                            { user: "Can M.", action: "Performans değerlendirmesi", time: "1 saat önce", avatar: "CM" }
                          ].map((activity, i) => (
                            <div key={i} className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{activity.avatar}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-slate-900 dark:text-slate-100">
                                  <span className="font-medium">{activity.user}</span> {activity.action}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                        <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                          Öne Çıkanlar
                        </h5>
                        <div className="space-y-3">
                          {[
                            { metric: "%15", desc: "Çalışan memnuniyeti artışı", color: "text-green-600" },
                            { metric: "₺2.4M", desc: "Bu ay toplam bordro", color: "text-blue-600" },
                            { metric: "48 saat", desc: "Ortalama işe alım süresi", color: "text-purple-600" }
                          ].map((highlight, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-600 rounded-lg">
                              <div>
                                <p className={`font-bold ${highlight.color}`}>{highlight.metric}</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{highlight.desc}</p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-slate-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating action elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-15"></div>
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

      {/* Enhanced CTA Section with Enterprise Visuals */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-300 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-green-300 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-bounce"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Enhanced Content */}
            <div className="text-left">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
                <Star className="h-5 w-5 text-yellow-300 mr-2" />
                <span className="text-white font-medium">Fortune 500 Onaylı Platform</span>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                İK Süreçlerinizi 
                <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent block">
                  Dijitalleştirin
                </span>
              </h2>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                30 gün ücretsiz deneme ile 2000+ özelliği keşfedin. Kurumsal seviye güvenlik ve 7/24 destek dahil.
              </p>
              
              {/* Enterprise features grid */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { icon: CheckCircle, text: "Anında Kurulum", desc: "5 dakikada hazır" },
                  { icon: Shield, text: "ISO 27001", desc: "Askeri güvenlik" },
                  { icon: Users, text: "Sınırsız Kullanıcı", desc: "Tüm çalışanlar" },
                  { icon: Clock, text: "7/24 Destek", desc: "Canlı destek" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3 text-white p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{feature.text}</p>
                      <p className="text-sm text-blue-200">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 px-10 py-5 text-lg shadow-2xl font-bold group">
                    <TrendingUp className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                    Ücretsiz Başla
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-10 py-5 text-lg font-bold backdrop-blur-sm">
                  <HeadphonesIcon className="h-6 w-6 mr-3" />
                  Canlı Demo
                </Button>
              </div>
              
              {/* Trust indicators with logos */}
              <div className="pt-8 border-t border-white/20">
                <p className="text-blue-200 text-sm mb-4">Entegre Teknoloji Ortakları:</p>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { name: "Microsoft", icon: "M", color: "from-blue-400 to-blue-600" },
                    { name: "Google", icon: "G", color: "from-red-400 to-yellow-500" },
                    { name: "AWS", icon: "A", color: "from-orange-400 to-yellow-500" },
                    { name: "Slack", icon: "S", color: "from-purple-400 to-pink-500" }
                  ].map((partner, i) => (
                    <div key={i} className="text-center group">
                      <div className={`w-12 h-12 bg-gradient-to-br ${partner.color} rounded-xl mx-auto mb-2 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <span className="font-bold text-white">{partner.icon}</span>
                      </div>
                      <span className="text-xs text-blue-200 font-medium">{partner.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Interactive Dashboard Preview */}
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Dashboard header with branding */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">HRFlow Pro</h3>
                          <p className="text-xs text-slate-500">Enterprise Dashboard</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium">Canlı</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard content */}
                  <div className="p-6">
                    {/* Executive summary cards */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { title: "Toplam Çalışan", value: "2,847", change: "+12%", icon: Users, color: "from-emerald-500 to-green-600" },
                        { title: "Aktif Projeler", value: "156", change: "+8%", icon: Building2, color: "from-blue-500 to-indigo-600" },
                        { title: "Performans", value: "94%", change: "+5%", icon: TrendingUp, color: "from-purple-500 to-pink-600" }
                      ].map((metric, i) => (
                        <div key={i} className="text-center p-3 bg-slate-50 rounded-xl hover:shadow-md transition-shadow">
                          <div className={`w-10 h-10 bg-gradient-to-br ${metric.color} rounded-lg mx-auto mb-2 flex items-center justify-center shadow-lg`}>
                            <metric.icon className="h-5 w-5 text-white" />
                          </div>
                          <p className="text-lg font-bold text-slate-900">{metric.value}</p>
                          <p className="text-xs text-slate-600">{metric.title}</p>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            {metric.change}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Real-time activity feed */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900 text-sm">Gerçek Zamanlı Aktiviteler</h4>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                      </div>
                      {[
                        { user: "Ahmet Kaya", action: "Yıllık performans raporu oluşturdu", time: "2 dk", dept: "İK", avatar: "AK" },
                        { user: "Zehra Demir", action: "Bordro onayı tamamladı", time: "8 dk", dept: "Finans", avatar: "ZD" },
                        { user: "Can Özkan", action: "Yeni çalışan kaydetti", time: "15 dk", dept: "İK", avatar: "CÖ" }
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                          <div className={`w-10 h-10 bg-gradient-to-br ${
                            i === 0 ? 'from-blue-500 to-indigo-600' :
                            i === 1 ? 'from-green-500 to-emerald-600' :
                            'from-purple-500 to-pink-600'
                          } rounded-full flex items-center justify-center shadow-lg`}>
                            <span className="text-white text-xs font-bold">{activity.avatar}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-900">
                              <span className="font-semibold">{activity.user}</span> {activity.action}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{activity.dept}</span>
                              <span className="text-xs text-slate-500">{activity.time} önce</span>
                            </div>
                          </div>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Floating success indicators */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-xl animate-bounce">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Kurulum Başarılı!</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-3 -left-3 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">99.9% Uptime</span>
                  </div>
                </div>
                
                <div className="absolute top-1/2 -right-6 bg-purple-500 text-white px-3 py-2 rounded-lg shadow-lg transform rotate-12">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                    <span className="text-xs font-medium">4.9/5</span>
                  </div>
                </div>
              </div>
              
              {/* Animated decoration elements */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 animate-ping"></div>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-40 animate-pulse"></div>
              <div className="absolute top-1/4 -left-4 w-8 h-8 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-50 animate-bounce"></div>
            </div>
          </div>
          
          {/* Enterprise statistics section */}
          <div className="mt-20 pt-16 border-t border-white/20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">Güvenilir Kurumsal Çözüm</h3>
              <p className="text-blue-200 text-lg">Dünya çapında binlerce şirketin tercihi</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "10,000+", label: "Aktif Şirket", sublabel: "Fortune 500 dahil", icon: Building2 },
                { value: "2M+", label: "Çalışan Kullanıcı", sublabel: "Günlük aktif", icon: Users },
                { value: "99.9%", label: "Uptime Garantisi", sublabel: "SLA korumalı", icon: Shield },
                { value: "24/7", label: "Uzman Destek", sublabel: "Canlı destek", icon: HeadphonesIcon }
              ].map((stat, i) => (
                <div key={i} className="text-center text-white group">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform shadow-lg">
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <p className="text-4xl font-bold mb-1">{stat.value}</p>
                  <p className="text-blue-200 font-medium mb-1">{stat.label}</p>
                  <p className="text-sm text-blue-300">{stat.sublabel}</p>
                </div>
              ))}
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