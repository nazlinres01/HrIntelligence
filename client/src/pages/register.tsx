import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, Building2, User, Phone, Users, BarChart3, Calendar, CreditCard } from "lucide-react";
import { Link } from "wouter";
import { queryClient } from "@/lib/queryClient";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    password: "",
    confirmPassword: ""
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("Lütfen kullanım şartlarını kabul edin.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Şifreler eşleşmiyor.");
      return;
    }
    
    setIsLoading(true);
    
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
        // Invalidate auth cache to trigger re-fetch
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        alert("Kayıt başarılı! Dashboard'a yönlendiriliyorsunuz...");
        // Small delay to ensure cache is updated
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } else {
        alert(data.message || "Kayıt sırasında hata oluştu");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Kayıt sırasında hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">İK360</h1>
            <p className="text-gray-600 mt-2">Ücretsiz hesap oluşturun</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  Ad
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Adınız"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Soyad
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Soyadınız"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                E-posta
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Telefon
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Telefon numaranız"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                Şirket Adı
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Şirket adınız"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Şifre
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifreniz"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  required
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Şifre Tekrar
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Şifrenizi tekrar girin"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                className="mt-1"
              />
              <div className="text-sm text-gray-600">
                <Label htmlFor="terms" className="cursor-pointer">
                  <button type="button" className="text-blue-600 hover:text-blue-700 font-medium underline">
                    Kullanım Şartları
                  </button>
                  {" "}ve{" "}
                  <button type="button" className="text-blue-600 hover:text-blue-700 font-medium underline">
                    Gizlilik Politikası
                  </button>
                  'nı okudum ve kabul ediyorum.
                </Label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading || !agreedToTerms}
            >
              {isLoading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Giriş yapın
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - App Benefits */}
      <div className="flex-1 bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 flex items-center justify-center p-8">
        <div className="max-w-lg text-white space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">İK360 ile</h2>
            <h3 className="text-3xl font-semibold">Hemen Başlayın</h3>
            <p className="text-xl text-purple-100">
              Dakikalar içinde kurum için modern İK sisteminizi kurun ve kullanmaya başlayın.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Kolay Kurulum</h4>
                <p className="text-purple-100">5 dakikada kurulum tamamlayın, hemen kullanmaya başlayın</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Güçlü Raporlama</h4>
                <p className="text-purple-100">Detaylı analizler ve raporlarla karar verme sürecinizi hızlandırın</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Otomatik Süreçler</h4>
                <p className="text-purple-100">İzin, bordro ve performans süreçlerini otomatikleştirin</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Güvenli & Uyumlu</h4>
                <p className="text-purple-100">KVKK uyumlu, güvenli altyapı ile verileriniz korunuyor</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-purple-500/30">
            <p className="text-purple-100 text-sm">
              ✨ 14 gün ücretsiz deneme • Kredi kartı gerektirmez • İstediğiniz zaman iptal edebilirsiniz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}