import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, 
  Shield, 
  Car, 
  Utensils,
  GraduationCap,
  Banknote,
  Trophy,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  ExternalLink,
  Download,
  Info
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

export default function EmployeeBenefits() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();

  // Employee benefits data
  const benefitsData = {
    enrollment: {
      isEnrollmentPeriod: true,
      enrollmentStart: "2024-06-01",
      enrollmentEnd: "2024-06-30",
      nextEnrollment: "2025-06-01"
    },
    activeBenefits: [
      {
        id: 1,
        name: "Sağlık Sigortası",
        category: "health",
        provider: "Axa Sigorta",
        status: "active",
        enrollmentDate: "2024-01-01",
        renewalDate: "2025-01-01",
        coverage: "Tam Kapsamlı",
        monthlyContribution: 150,
        companyContribution: 450,
        description: "Özel hastane ve poliklinik hizmetleri",
        features: [
          "Özel hastane tedavisi",
          "Diş tedavisi (%80 kapsamlı)",
          "Gözlük yardımı (yılda 1 adet)",
          "Check-up hizmeti (yılda 1)"
        ],
        usage: {
          used: 2800,
          limit: 15000,
          claims: 5
        }
      },
      {
        id: 2,
        name: "Hayat Sigortası",
        category: "insurance",
        provider: "Allianz Sigorta",
        status: "active",
        enrollmentDate: "2024-01-01",
        renewalDate: "2025-01-01",
        coverage: "500,000 TL",
        monthlyContribution: 0,
        companyContribution: 85,
        description: "Kaza ve ölüm durumunda tazminat",
        features: [
          "Kaza sonucu ölüm: 500,000 TL",
          "Doğal ölüm: 250,000 TL",
          "Tam maluliyet: 500,000 TL",
          "Kısmi maluliyet: Oranında"
        ],
        beneficiaries: [
          { name: "Ayşe Şahin", relation: "Eş", percentage: 70 },
          { name: "Can Şahin", relation: "Çocuk", percentage: 30 }
        ]
      },
      {
        id: 3,
        name: "Yemek Kartı",
        category: "meal",
        provider: "Multinet",
        status: "active",
        enrollmentDate: "2024-01-01",
        renewalDate: "2025-01-01",
        monthlyAmount: 1200,
        companyContribution: 1200,
        description: "Günlük yemek ve market alışverişi",
        features: [
          "Günlük 60 TL yükleme",
          "Tüm restoranlarda geçerli",
          "Market alışverişi",
          "Online food delivery"
        ],
        balance: {
          current: 850,
          thisMonth: 1200,
          used: 350
        }
      },
      {
        id: 4,
        name: "Ulaşım Yardımı",
        category: "transport",
        provider: "İstanbul Kart",
        status: "active",
        enrollmentDate: "2024-01-01",
        renewalDate: "2025-01-01",
        monthlyAmount: 800,
        companyContribution: 800,
        description: "Toplu taşıma ve ulaşım desteği",
        features: [
          "Metrobüs, metro, otobüs",
          "İstanbul Kart yüklemesi",
          "Taksi desteği (acil durumlar)",
          "Park ücreti desteği"
        ],
        balance: {
          current: 420,
          thisMonth: 800,
          used: 380
        }
      },
      {
        id: 5,
        name: "Eğitim Desteği",
        category: "education",
        provider: "Şirket",
        status: "active",
        enrollmentDate: "2024-01-01",
        renewalDate: "2025-01-01",
        yearlyLimit: 5000,
        description: "Mesleki gelişim ve eğitim fırsatları",
        features: [
          "Online kurs platformları",
          "Konferans ve seminer katılımı",
          "Sertifikasyon sınavları",
          "Kitap ve materyal desteği"
        ],
        usage: {
          used: 1200,
          limit: 5000,
          courses: 3
        }
      }
    ],
    availableBenefits: [
      {
        id: 6,
        name: "Emeklilik Planı",
        category: "retirement",
        provider: "Anadolu Hayat",
        status: "available",
        monthlyContribution: 200,
        companyContribution: 300,
        description: "Bireysel emeklilik sistemi",
        features: [
          "Devlet katkısı %25",
          "Vergi avantajı",
          "Esnek ödeme planı",
          "Portföy yönetimi"
        ]
      },
      {
        id: 7,
        name: "Spor Salonu Üyeliği",
        category: "wellness",
        provider: "Fitness First",
        status: "available",
        monthlyContribution: 100,
        companyContribution: 200,
        description: "Spor salonu ve wellness merkezi",
        features: [
          "Tüm şubelere erişim",
          "Grup dersleri",
          "Kişisel antrenör desteği",
          "SPA hizmetleri"
        ]
      }
    ],
    healthcareProviders: [
      {
        name: "Acıbadem Hastanesi",
        type: "Hastane",
        location: "Kadıköy",
        phone: "+90 216 544 4444",
        services: ["Acil", "Poliklinik", "Ameliyat"]
      },
      {
        name: "Medical Park",
        type: "Hastane", 
        location: "Bahçelievler",
        phone: "+90 212 633 3333",
        services: ["Acil", "Check-up", "Radyoloji"]
      },
      {
        name: "Dr. Mehmet Yıldız",
        type: "Diş Kliniği",
        location: "Beşiktaş",
        phone: "+90 212 555 0123",
        services: ["Diş Tedavisi", "Ortodonti", "İmplant"]
      }
    ]
  };

  const categoryFilters = [
    { value: "all", label: "Tümü", icon: Shield },
    { value: "health", label: "Sağlık", icon: Heart },
    { value: "insurance", label: "Sigorta", icon: Shield },
    { value: "meal", label: "Yemek", icon: Utensils },
    { value: "transport", label: "Ulaşım", icon: Car },
    { value: "education", label: "Eğitim", icon: GraduationCap },
    { value: "wellness", label: "Sağlık", icon: Heart },
    { value: "retirement", label: "Emeklilik", icon: Banknote }
  ];

  const getCategoryIcon = (category: string) => {
    const categoryMap = {
      health: Heart,
      insurance: Shield,
      meal: Utensils,
      transport: Car,
      education: GraduationCap,
      wellness: Heart,
      retirement: Banknote
    };
    return categoryMap[category as keyof typeof categoryMap] || Shield;
  };

  const getCategoryColor = (category: string) => {
    const colorMap = {
      health: "text-red-600 bg-red-100",
      insurance: "text-blue-600 bg-blue-100",
      meal: "text-orange-600 bg-orange-100",
      transport: "text-green-600 bg-green-100",
      education: "text-purple-600 bg-purple-100",
      wellness: "text-pink-600 bg-pink-100",
      retirement: "text-yellow-600 bg-yellow-100"
    };
    return colorMap[category as keyof typeof colorMap] || "text-gray-600 bg-gray-100";
  };

  const enrollmentDaysLeft = differenceInDays(new Date(benefitsData.enrollment.enrollmentEnd), new Date());

  const filteredActiveBenefits = selectedCategory === "all" 
    ? benefitsData.activeBenefits 
    : benefitsData.activeBenefits.filter(benefit => benefit.category === selectedCategory);

  const filteredAvailableBenefits = selectedCategory === "all"
    ? benefitsData.availableBenefits
    : benefitsData.availableBenefits.filter(benefit => benefit.category === selectedCategory);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yan Haklar & Sosyal Fayda</h1>
          <p className="text-gray-600">Sosyal haklar, sigorta planları ve çalışan faydalarınız</p>
        </div>
        {benefitsData.enrollment.isEnrollmentPeriod && (
          <div className="text-right">
            <Badge className="bg-orange-100 text-orange-800 mb-2">
              Kayıt Dönemi Aktif
            </Badge>
            <p className="text-sm text-gray-600">
              {enrollmentDaysLeft} gün kaldı
            </p>
          </div>
        )}
      </div>

      {/* Enrollment Alert */}
      {benefitsData.enrollment.isEnrollmentPeriod && (
        <Card className="border-l-4 border-l-orange-500 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-900">Yan Haklar Kayıt Dönemi</h3>
                <p className="text-sm text-orange-700">
                  {format(new Date(benefitsData.enrollment.enrollmentEnd), 'dd MMMM yyyy')} tarihine kadar 
                  yan haklarınızı güncelleyebilir veya yeni planlara kayıt olabilirsiniz.
                </p>
              </div>
              <Button className="ml-auto bg-orange-600 hover:bg-orange-700">
                Kayıt Ol
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aktif Plan</p>
                <p className="text-xl font-bold">{benefitsData.activeBenefits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Banknote className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aylık Katkı</p>
                <p className="text-xl font-bold">₺{benefitsData.activeBenefits.reduce((sum, b) => sum + (b.monthlyContribution || 0), 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Şirket Katkısı</p>
                <p className="text-xl font-bold">₺{benefitsData.activeBenefits.reduce((sum, b) => sum + (b.companyContribution || 0), 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mevcut Plan</p>
                <p className="text-xl font-bold">{benefitsData.availableBenefits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              {categoryFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Benefits */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aktif Yan Haklarım</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredActiveBenefits.map((benefit) => {
                  const IconComponent = getCategoryIcon(benefit.category);
                  const colorClass = getCategoryColor(benefit.category);
                  
                  return (
                    <div key={benefit.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${colorClass}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{benefit.name}</h4>
                            <p className="text-sm text-gray-600">{benefit.provider}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Aktif
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{benefit.description}</p>

                      {/* Features */}
                      <div className="mb-4">
                        <h5 className="font-medium text-sm mb-2">Kapsamlar:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                          {benefit.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Usage/Balance */}
                      {benefit.usage && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Kullanım</span>
                            <span>₺{benefit.usage.used} / ₺{benefit.usage.limit}</span>
                          </div>
                          <Progress value={(benefit.usage.used / benefit.usage.limit) * 100} className="h-2" />
                        </div>
                      )}

                      {benefit.balance && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Aylık Bakiye</span>
                            <span>₺{benefit.balance.current} / ₺{benefit.balance.thisMonth}</span>
                          </div>
                          <Progress value={(benefit.balance.current / benefit.balance.thisMonth) * 100} className="h-2" />
                        </div>
                      )}

                      {/* Contributions */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Kişisel Katkı:</span>
                          <span className="font-medium ml-2">₺{benefit.monthlyContribution || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Şirket Katkısı:</span>
                          <span className="font-medium ml-2">₺{benefit.companyContribution || 0}</span>
                        </div>
                      </div>

                      {/* Beneficiaries */}
                      {benefit.beneficiaries && (
                        <div className="mt-3 pt-3 border-t">
                          <h5 className="font-medium text-sm mb-2">Lehtarlar:</h5>
                          <div className="space-y-1">
                            {benefit.beneficiaries.map((beneficiary, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{beneficiary.name} ({beneficiary.relation})</span>
                                <span>%{beneficiary.percentage}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Poliçe
                        </Button>
                        <Button variant="outline" size="sm">
                          <Info className="h-4 w-4 mr-2" />
                          Detaylar
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Available Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Katılabileceğiniz Planlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAvailableBenefits.map((benefit) => {
                  const IconComponent = getCategoryIcon(benefit.category);
                  const colorClass = getCategoryColor(benefit.category);
                  
                  return (
                    <div key={benefit.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${colorClass}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{benefit.name}</h4>
                            <p className="text-sm text-gray-600">{benefit.provider}</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          Mevcut
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{benefit.description}</p>

                      <div className="mb-4">
                        <h5 className="font-medium text-sm mb-2">Özellikler:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                          {benefit.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Kişisel Katkı:</span>
                          <span className="font-medium ml-2">₺{benefit.monthlyContribution || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Şirket Katkısı:</span>
                          <span className="font-medium ml-2">₺{benefit.companyContribution || 0}</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Info className="h-4 w-4 mr-2" />
                          Detaylar
                        </Button>
                        <Button className="bg-yellow-600 hover:bg-yellow-700" size="sm">
                          Kayıt Ol
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Healthcare Providers */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Sağlık Hizmet Sağlayıcıları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {benefitsData.healthcareProviders.map((provider, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{provider.name}</h4>
                        <p className="text-xs text-gray-600">{provider.type}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Anlaşmalı
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{provider.phone}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {provider.services.map((service, serviceIndex) => (
                        <Badge key={serviceIndex} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}