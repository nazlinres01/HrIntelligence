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
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      title: "Çalışan Yönetimi",
      description: "Kapsamlı çalışan profilleri ve organizasyon şeması",
      icon: Users,
      benefits: [
        "Merkezi çalışan veritabanı",
        "Organizasyon şeması görselleştirme",
        "Rol ve yetki yönetimi",
        "Çalışan self-servis portal"
      ]
    },
    {
      title: "Bordro Yönetimi", 
      description: "Otomatik bordro hesaplama ve vergi yönetimi",
      icon: CreditCard,
      benefits: [
        "Otomatik maaş hesaplama",
        "Vergi ve SGK entegrasyonu",
        "Bordro raporlama",
        "Avans ve prim yönetimi"
      ]
    },
    {
      title: "Performans Takibi",
      description: "360 derece performans değerlendirme sistemi",
      icon: TrendingUp,
      benefits: [
        "Hedef belirleme ve takip",
        "360 derece geri bildirim",
        "Performans raporları",
        "Kariyer planlama"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Ahmet Yılmaz",
      position: "İK Direktörü",
      company: "TechCorp A.Ş.",
      content: "HRFlow Pro ile İK süreçlerimizi tamamen dijitalleştirdik. Zaman tasarrufu ve verimlilik artışı inanılmaz.",
      rating: 5
    },
    {
      name: "Elif Demir",
      position: "Operasyon Müdürü", 
      company: "InnovateLtd",
      content: "500+ çalışanımızı kolayca yönetiyoruz. Sistem kullanımı çok sade ve anlaşılır.",
      rating: 5
    },
    {
      name: "Can Özkan",
      position: "Kurucu",
      company: "StartupCo",
      content: "Küçük bir ekip olarak başladık, şimdi 100+ kişilik şirket olduk. HRFlow Pro ile büyüdük.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white dark:text-slate-900" />
              </div>
              <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">HRFlow Pro</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">Özellikler</a>
              <a href="#pricing" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">Fiyatlandırma</a>
              <a href="#about" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">Hakkımızda</a>
              <a href="#contact" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">İletişim</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 dark:text-slate-400">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                  Başlayın
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Microsoft Style */}
      <section className="py-24 px-6 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Sol taraf - Minimalist Metin */}
            <div className="max-w-xl">
              <div className="mb-6">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Enterprise HR Management
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                İnsan kaynakları yönetimini 
                <span className="font-semibold block">yeniden tasarladık</span>
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-light">
                Modern şirketler için tasarlanmış, basit ve güçlü İK platformu. 
                Ekibinizi yönetin, performansı ölçün, büyümeyi hızlandırın.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/register">
                  <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 text-base font-medium">
                    Ücretsiz başlayın
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="px-8 py-4 text-base font-medium border-slate-300 text-slate-700 hover:bg-slate-50">
                  Demo izleyin
                </Button>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                <span>Kredi kartı gerekmez • Anında kurulum • 7/24 destek</span>
              </div>
            </div>

            {/* Sağ taraf - Microsoft Minimalist Style */}
            <div className="relative">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-700 px-6 py-4 border-b border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white dark:text-slate-900" />
                      </div>
                      <span className="font-medium text-slate-900 dark:text-slate-100">HRFlow Pro</span>
                    </div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-light text-slate-900 dark:text-slate-100 mb-1">2,847</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Çalışanlar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-light text-slate-900 dark:text-slate-100 mb-1">94%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Memnuniyet</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Takım Üyeleri</div>
                    <div className="space-y-3">
                      {[
                        { name: "Ahmet Kaya", role: "Yazılım Geliştirici" },
                        { name: "Elif Demir", role: "İK Uzmanı" },
                        { name: "Mehmet Özkan", role: "Proje Müdürü" }
                      ].map((employee, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{employee.name}</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">{employee.role}</div>
                          </div>
                          <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Proje İlerlemesi</span>
                      <span className="text-slate-900 dark:text-slate-100 font-medium">78%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1">
                      <div className="bg-slate-900 dark:bg-slate-100 h-1 w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-3 -right-3 bg-slate-900 text-white px-3 py-1 text-xs font-medium">
                Live
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators - Microsoft Style */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
              Güvenilir Partner
            </p>
            <h2 className="text-3xl font-light text-slate-900 dark:text-slate-100 mb-8">
              <span className="font-semibold">10.000+</span> şirket tercih ediyor
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-12 items-center opacity-60">
              {[
                "TechCorp", "InnovateLtd", "FutureCo", "NextGen", "SmartBiz", "ProSoft"
              ].map((company, index) => (
                <div key={index} className="text-center">
                  <div className="text-slate-600 dark:text-slate-400 font-medium text-lg">
                    {company}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-16 border-t border-slate-200 dark:border-slate-700">
            {[
              { value: "10.000+", label: "Aktif Şirket" },
              { value: "2M+", label: "Çalışan" },
              { value: "99.9%", label: "Uptime" },
              { value: "4.9/5", label: "Müşteri Puanı" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-slate-900 dark:text-slate-100 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Microsoft Style */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-20">
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4 uppercase tracking-wide">
                Özellikler
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                Modern şirketler için 
                <span className="font-semibold block">tasarlanmış araçlar</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                Basit, güçlü ve kullanımı kolay. İK süreçlerinizi modernize etmek için ihtiyacınız olan her şey.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.benefits.slice(0, 3).map((benefit, idx) => (
                      <div key={idx} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                        <div className="w-1 h-1 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Microsoft Style */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4 uppercase tracking-wide">
            Başlayın
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            İK süreçlerinizi <span className="font-semibold">bugün modernize edin</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-light max-w-2xl mx-auto">
            30 gün ücretsiz deneme. Kredi kartı gerekmez. Anında kurulum.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/register">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-12 py-4 text-base font-medium">
                Ücretsiz başlayın
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-12 py-4 text-base font-medium border-slate-300 text-slate-700 hover:bg-slate-50">
              Satış ekibiyle konuşun
            </Button>
          </div>
          
          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <div>30 gün içinde iptal edebilirsiniz • Veri güvenliği garantili</div>
            <div>ISO 27001 sertifikalı • KVKK uyumlu</div>
          </div>
        </div>
      </section>

      {/* Footer - Microsoft Style */}
      <footer className="py-16 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-6 h-6 bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-white dark:text-slate-900" />
                </div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">HRFlow Pro</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Modern şirketler için tasarlanmış İK yönetim platformu.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Ürün</h4>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Özellikler</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Fiyatlandırma</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Güvenlik</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">API</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Şirket</h4>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Hakkımızda</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Kariyer</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Blog</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">İletişim</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Destek</h4>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Yardım Merkezi</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Dokümantasyon</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Canlı Destek</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Durum Sayfası</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-600 dark:text-slate-400 text-sm">
              © 2024 HRFlow Pro. Tüm hakları saklıdır.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm">
                Gizlilik
              </Link>
              <Link href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm">
                Şartlar
              </Link>
              <Link href="/cookies" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm">
                Çerezler
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Özellikler</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Fiyatlandırma</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Güvenlik</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">API</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Şirket</h4>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Hakkımızda</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Kariyer</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Blog</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">İletişim</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Destek</h4>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Yardım Merkezi</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Dokümantasyon</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Canlı Destek</li>
                <li className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">Durum Sayfası</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-600 dark:text-slate-400 text-sm">
              © 2024 HRFlow Pro. Tüm hakları saklıdır.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm">
                Gizlilik
              </Link>
              <Link href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm">
                Şartlar
              </Link>
              <Link href="/cookies" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm">
                Çerezler
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}