import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, Building2, User, Users, BarChart3, Shield, Zap, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { queryClient } from "@/lib/queryClient";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
        window.location.href = '/';
      } else {
        setError(data.message || 'Kayıt başarısız');
      }
    } catch (error) {
      console.error('Register error:', error);
      setError('Kayıt sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sol Taraf - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo ve Başlık */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="h-10 w-10 text-blue-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">İK360</h1>
            </div>
            <p className="text-gray-600">Hesap Oluşturun</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    Ad
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Adınız"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Soyad
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Soyadınız"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                  Şirket Adı
                </Label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="Şirket Adınız"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-posta Adresi
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ornek@sirket.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Şifre
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="En az 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
            </Button>

            <div className="text-center">
              <span className="text-gray-600">Zaten hesabınız var mı? </span>
              <Link href="/login">
                <a className="text-blue-600 hover:text-blue-700 font-medium">
                  Giriş Yap
                </a>
              </Link>
            </div>
          </form>

          {/* Info */}
          <div className="border-t pt-6">
            <p className="text-xs text-gray-500 text-center">
              Hesap oluşturarak <span className="text-blue-600">Kullanım Şartları</span> ve{" "}
              <span className="text-blue-600">Gizlilik Politikası</span>'nı kabul etmiş olursunuz.
            </p>
          </div>
        </div>
      </div>

      {/* Sağ Taraf - Tanıtım */}
      <div className="flex-1 bg-gradient-to-br from-purple-600 to-blue-700 p-8 text-white hidden lg:flex lg:items-center lg:justify-center">
        <div className="max-w-lg space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight">
              İK Süreçlerinizi
              <br />
              <span className="text-purple-200">Dijitalleştirin</span>
            </h2>
            <p className="text-xl text-purple-100">
              Şirketiniz için özel İK sistemi kurun ve ekibinizi verimli bir şekilde yönetin.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Çoklu Kullanıcı Desteği</h3>
                <p className="text-purple-100">
                  Birden fazla İK uzmanı aynı sistemde çalışabilir. Roller ve yetkiler atayın.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-purple-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Detaylı Raporlama</h3>
                <p className="text-purple-100">
                  Personel performansı, izin takibi ve bordro raporları ile tam kontrol.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-purple-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Güvenli Veri Saklama</h3>
                <p className="text-purple-100">
                  Çalışan bilgileri ve şirket verileri güvenli bir şekilde şifrelenerek saklanır.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Zap className="h-8 w-8 text-purple-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Hızlı Kurulum</h3>
                <p className="text-purple-100">
                  Dakikalar içinde hesabınızı oluşturun ve kullanmaya başlayın.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-purple-200">Şirket</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-purple-200">Çalışan</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold">%99</div>
              <div className="text-sm text-purple-200">Memnuniyet</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-300" />
              <span className="font-semibold">30 Gün Ücretsiz Deneme</span>
            </div>
            <p className="text-sm text-purple-100">
              Hiçbir ödeme bilgisi gerekmeden tüm özelliklerimizi deneyebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}