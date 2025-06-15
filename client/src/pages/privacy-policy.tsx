import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Database, Lock, Users, Globe, AlertTriangle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gizlilik Politikası</h1>
              <p className="text-gray-600">Son güncelleme: 13 Haziran 2025</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Gizliliğiniz Bizim İçin Önemli
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                İnsan Kaynakları Yönetim Sistemi olarak, kişisel verilerinizin korunması konusunda en yüksek 
                standartları uyguluyoruz. Bu gizlilik politikası, verilerinizi nasıl topladığımız, kullandığımız 
                ve koruduğumuzu açıklamaktadır.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-600" />
                Topladığımız Veriler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Kişisel Bilgiler</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Ad, soyad ve kimlik bilgileri</li>
                    <li>E-posta adresi ve telefon numarası</li>
                    <li>İş unvanı ve departman bilgileri</li>
                    <li>Maaş ve özlük dosyası bilgileri</li>
                    <li>Performans değerlendirme verileri</li>
                    <li>Eğitim ve sertifika bilgileri</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Sistem Kullanım Verileri</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Giriş tarihi ve saatleri</li>
                    <li>IP adresi ve cihaz bilgileri</li>
                    <li>Tarayıcı türü ve versiyonu</li>
                    <li>Sistem içi aktivite logları</li>
                    <li>Hata raporları ve performans verileri</li>
                    <li>Kullanıcı tercihleri ve ayarları</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                Veri Kullanım Amaçları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Ana Hizmet Sunumu</h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>İnsan kaynakları süreçlerinin yönetimi</li>
                    <li>Personel bilgilerinin saklanması ve güncellemesi</li>
                    <li>Bordro ve özlük işlemlerinin gerçekleştirilmesi</li>
                    <li>Performans değerlendirme süreçlerinin yürütülmesi</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Sistem Güvenliği ve İyileştirme</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-800">
                    <li>Güvenlik ihlallerinin tespiti ve önlenmesi</li>
                    <li>Sistem performansının izlenmesi ve iyileştirilmesi</li>
                    <li>Hata tespiti ve düzeltme işlemleri</li>
                    <li>Kullanıcı deneyiminin geliştirilmesi</li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">Yasal Yükümlülükler</h4>
                  <ul className="list-disc list-inside space-y-1 text-amber-800">
                    <li>Yasal raporlama gereksinimlerinin karşılanması</li>
                    <li>Denetim süreçlerinin desteklenmesi</li>
                    <li>Vergi ve sosyal güvenlik işlemlerinin yürütülmesi</li>
                    <li>İş sağlığı ve güvenliği kayıtlarının tutulması</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                Veri Güvenliği Önlemleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Teknik Güvenlik</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>SSL/TLS şifreleme protokolleri</li>
                    <li>AES-256 veri şifreleme</li>
                    <li>Çok faktörlü kimlik doğrulama</li>
                    <li>Düzenli güvenlik güncellemeleri</li>
                    <li>Intrusion Detection System (IDS)</li>
                    <li>Otomatik yedekleme sistemi</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Organizasyonel Güvenlik</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Rol tabanlı erişim kontrolü</li>
                    <li>Personel güvenlik eğitimleri</li>
                    <li>Gizlilik sözleşmeleri</li>
                    <li>Düzenli güvenlik denetimleri</li>
                    <li>Olay müdahale planları</li>
                    <li>Veri sınıflandırma prosedürleri</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                Veri Paylaşımı ve Aktarımı
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-900 mb-2">Temel İlke</h4>
                <p className="text-red-800">
                  Kişisel verilerinizi açık rızanız olmadan üçüncü taraflarla paylaşmayız. 
                  Aşağıdaki durumlar istisnadır:
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Yasal Zorunluluklar</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
                  <li>Mahkeme kararları ve yasal talepler</li>
                  <li>Vergi dairesi ve SGK bildirimleri</li>
                  <li>İş müfettişi denetimleri</li>
                  <li>Kolluk kuvvetleri talepleri</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Hizmet Sağlayıcılar</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
                  <li>Bulut depolama hizmetleri (AWS, Azure)</li>
                  <li>E-posta hizmet sağlayıcıları</li>
                  <li>Güvenlik monitoring servisleri</li>
                  <li>Yedekleme ve disaster recovery partners</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>KVKK Hakları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Temel Haklar</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                    <li>İşlenme amacını ve buna uygun kullanılıp kullanılmadığını öğrenme</li>
                    <li>Yurt içinde/dışında aktarıldığı üçüncü kişileri bilme</li>
                    <li>Eksik/yanlış işlenmiş verilerin düzeltilmesini isteme</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">İleri Düzey Haklar</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Belirli koşullarda verilerin silinmesini isteme</li>
                    <li>İşlenen verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                    <li>İşlenen verilerin taşınabilirliğini talep etme</li>
                    <li>Otomatik sistemlerin sonuçlarına itiraz etme</li>
                  </ul>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Başvuru Süreci</h4>
                <p className="text-blue-800">
                  KVKK haklarınızı kullanmak için <strong>privacy@hrsystem.com.tr</strong> adresine yazılı 
                  başvuru yapabilirsiniz. Başvurularınız 30 gün içinde yanıtlanır.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Veri Saklama Süreleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Veri Türü</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Saklama Süresi</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Yasal Dayanak</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Personel Dosyaları</td>
                      <td className="border border-gray-300 px-4 py-2">İş sözleşmesi bitiminden 50 yıl</td>
                      <td className="border border-gray-300 px-4 py-2">Sosyal Güvenlik Mevzuatı</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">Bordro Kayıtları</td>
                      <td className="border border-gray-300 px-4 py-2">5 yıl</td>
                      <td className="border border-gray-300 px-4 py-2">Vergi Usul Kanunu</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Sistem Logları</td>
                      <td className="border border-gray-300 px-4 py-2">2 yıl</td>
                      <td className="border border-gray-300 px-4 py-2">Bilgi Güvenliği Politikası</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">İş Sağlığı Kayıtları</td>
                      <td className="border border-gray-300 px-4 py-2">15 yıl</td>
                      <td className="border border-gray-300 px-4 py-2">İş Sağlığı ve Güvenliği Kanunu</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Güvenlik İhlali Bildirimi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Herhangi bir güvenlik ihlali durumunda aşağıdaki prosedürümüzü uygularız:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Tespit (0-1 saat)</h4>
                  <p className="text-red-800 text-sm">İhlal anında tespit ve izolasyon</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">Değerlendirme (1-24 saat)</h4>
                  <p className="text-amber-800 text-sm">Risk analizi ve etki değerlendirmesi</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Bildirim (24-72 saat)</h4>
                  <p className="text-green-800 text-sm">Otoritelere ve kullanıcılara bildirim</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Veri Koruma Sorumlusu</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Ad:</strong> Dr. Mehmet Özkan</p>
                    <p><strong>E-posta:</strong> dpo@hrsystem.com.tr</p>
                    <p><strong>Telefon:</strong> +90 212 555 0124</p>
                    <p><strong>Adres:</strong> Maslak Mahallesi, Büyükdere Cad. No:123, İstanbul</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Gizlilik Talepleri</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>E-posta:</strong> privacy@hrsystem.com.tr</p>
                    <p><strong>Yanıt Süresi:</strong> 30 gün</p>
                    <p><strong>Çalışma Saatleri:</strong> 09:00-18:00 (Hafta içi)</p>
                    <p><strong>Acil Durumlar:</strong> 7/24 online destek</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex justify-center space-x-4">
            <Link href="/terms-of-service">
              <Button variant="outline">Kullanım Şartları</Button>
            </Link>
            <Link href="/login">
              <Button variant="lightgray">Giriş Sayfasına Dön</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}