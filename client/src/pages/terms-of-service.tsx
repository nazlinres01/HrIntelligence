import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Calendar, Shield, AlertTriangle } from "lucide-react";

export default function TermsOfService() {
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
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kullanım Şartları</h1>
              <p className="text-gray-600">Son güncelleme: 13 Haziran 2025</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Önemli Bilgilendirme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Bu kullanım şartları, İnsan Kaynakları Yönetim Sistemi'ni kullanarak kabul ettiğiniz yasal bir sözleşmedir. 
                Lütfen dikkatle okuyun ve anladığınızdan emin olun.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>1. Hizmet Tanımı</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                İnsan Kaynakları Yönetim Sistemi, şirketlerin insan kaynakları süreçlerini dijital ortamda 
                yönetmelerine olanak sağlayan kapsamlı bir yazılım platformudur.
              </p>
              <div className="pl-4 border-l-4 border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">Hizmet Kapsamı:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Personel bilgileri yönetimi</li>
                  <li>İzin ve devamsızlık takibi</li>
                  <li>Performans değerlendirme sistemi</li>
                  <li>Bordro ve özlük işlemleri</li>
                  <li>Eğitim ve gelişim programları</li>
                  <li>İşe alım süreçleri</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Kullanıcı Yükümlülükleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Hesap Güvenliği</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
                  <li>Kullanıcı adı ve şifrenizi güvenli tutmakla yükümlüsünüz</li>
                  <li>Hesap bilgilerinizi üçüncü kişilerle paylaşamazsınız</li>
                  <li>Güvenlik ihlallerini derhal bildirmelisiniz</li>
                  <li>Güçlü şifre kullanımı zorunludur</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Uygun Kullanım</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
                  <li>Sistemi yalnızca yasal amaçlarla kullanabilirsiniz</li>
                  <li>Başkalarının haklarını ihlal edemezsiniz</li>
                  <li>Zararlı yazılım yükleyemez veya dağıtamazsınız</li>
                  <li>Sistem güvenliğini tehlikeye atamazsınız</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Veri Koruma ve Gizlilik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Kişisel verilerinizin işlenmesi ve korunması konusunda KVKK (Kişisel Verilerin Korunması Kanunu) 
                ve GDPR uyumlu politikalarımızı uygularız.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Veri İşleme İlkeleri:</h4>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Veriler yalnızca belirtilen amaçlarla işlenir</li>
                  <li>Gereksiz veri toplama yapılmaz</li>
                  <li>Veriler güvenli şekilde saklanır</li>
                  <li>Üçüncü taraflarla veri paylaşımı sınırlıdır</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Hizmet Kullanılabilirliği</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Hizmet Düzeyi</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>%99.9 uptime hedefi</li>
                    <li>7/24 sistem izleme</li>
                    <li>Düzenli güvenlik güncellemeleri</li>
                    <li>Otomatik yedekleme sistemi</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Bakım ve Güncellemeler</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Planlı bakımlar önceden duyurulur</li>
                    <li>Güvenlik güncellemeleri anında uygulanır</li>
                    <li>Yeni özellikler düzenli eklenir</li>
                    <li>Hata düzeltmeleri öncelikli yapılır</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Sorumluluk Sınırları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-900 mb-2">Önemli Uyarı</h4>
                <p className="text-amber-800">
                  Hizmetimizi "olduğu gibi" sunuyoruz. Dolaylı zararlar, kar kaybı veya iş kesintilerinden 
                  sorumlu değiliz. Kullanıcılar kendi verilerinin yedeğini almakla yükümlüdür.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Fesih ve Sonlandırma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Hesap Sonlandırma</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
                  <li>Her iki taraf da 30 gün önceden bildirimle sözleşmeyi feshedebilir</li>
                  <li>Kullanım şartlarının ihlali durumunda anında fesih hakkımız saklıdır</li>
                  <li>Fesih sonrası veriler 90 gün süreyle saklanır</li>
                  <li>Veri portabilite hakları korunur</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. İletişim</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Teknik Destek</h4>
                  <div className="space-y-2 text-gray-700">
                    <p>E-posta: support@hrsystem.com.tr</p>
                    <p>Telefon: +90 212 555 0123</p>
                    <p>Çalışma Saatleri: 09:00 - 18:00 (Hafta içi)</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Yasal Konular</h4>
                  <div className="space-y-2 text-gray-700">
                    <p>E-posta: legal@hrsystem.com.tr</p>
                    <p>Posta: Maslak Mahallesi, İstanbul</p>
                    <p>Yanıt Süresi: 5 iş günü</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Son Güncelleme Tarihi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Bu kullanım şartları 13 Haziran 2025 tarihinde son kez güncellenmiştir. 
                Değişiklikler kullanıcılara e-posta yoluyla bildirilir ve 30 gün sonra yürürlüğe girer.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex justify-center space-x-4">
            <Link href="/privacy-policy">
              <Button variant="outline">Gizlilik Politikası</Button>
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