import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Users, BarChart3, Shield, Zap, CheckCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Landing() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: ""
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
        window.location.href = '/';
      } else {
        setError(data.message || 'Giriş başarısız');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Giriş sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
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
      {/* Sol Taraf - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo ve Başlık */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="h-10 w-10 text-blue-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">İK360</h1>
            </div>
            <p className="text-gray-600">
              {isLoginMode ? "Hesabınıza Giriş Yapın" : "Yeni Hesap Oluşturun"}
            </p>
          </div>

          {/* Form Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                isLoginMode 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                !isLoginMode 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          {isLoginMode ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">
                    E-posta Adresi
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="ornek@sirket.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                    Şifre
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Şifrenizi giriniz"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>

              {/* Role-based Login Links */}
              <div className="border-t pt-6">
                <p className="text-xs text-gray-500 text-center mb-3">Rol bazlı giriş:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button 
                    onClick={() => window.location.href = '/owner'}
                    className="p-2 bg-purple-50 hover:bg-purple-100 rounded text-purple-700 font-medium transition-colors"
                  >
                    👑 Patron
                  </button>
                  <button 
                    onClick={() => window.location.href = '/hr-manager'}
                    className="p-2 bg-blue-50 hover:bg-blue-100 rounded text-blue-700 font-medium transition-colors"
                  >
                    🛡️ İK Müdürü
                  </button>
                  <button 
                    onClick={() => window.location.href = '/hr-specialist'}
                    className="p-2 bg-teal-50 hover:bg-teal-100 rounded text-teal-700 font-medium transition-colors"
                  >
                    👥 İK Uzmanı
                  </button>
                  <button 
                    onClick={() => window.location.href = '/employee'}
                    className="p-2 bg-green-50 hover:bg-green-100 rounded text-green-700 font-medium transition-colors"
                  >
                    👤 Çalışan
                  </button>
                </div>
                <p className="text-xs text-gray-400 text-center mt-3">
                  Hesabınız yok mu? "Kayıt Ol" sekmesini kullanın.
                </p>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      Ad
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Adınız"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Soyad
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Soyadınız"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
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
                      type="text"
                      placeholder="Şirket Adınız"
                      value={registerData.companyName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                    E-posta Adresi
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="ornek@sirket.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                    Şifre
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="En az 6 karakter"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
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
            </form>
          )}
        </div>
      </div>

      {/* Sağ Taraf - Tanıtım */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-700 p-8 text-white hidden lg:flex lg:items-center lg:justify-center">
        <div className="max-w-lg space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight">
              Modern İK Yönetimi
              <br />
              <span className="text-blue-200">Artık Çok Kolay</span>
            </h2>
            <p className="text-xl text-blue-100">
              Ekibinizi yönetin, performansı takip edin ve İK süreçlerinizi dijitalleştirin.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Çoklu Kullanıcı Desteği</h3>
                <p className="text-blue-100">
                  Birden fazla İK uzmanı aynı sistemde çalışabilir. Roller atayın ve yetkileri kontrol edin.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-blue-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Gerçek Zamanlı Analiz</h3>
                <p className="text-blue-100">
                  Dashboard ile performans metrikleri, bordro raporları ve detaylı analizler.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-blue-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Güvenli ve Güvenilir</h3>
                <p className="text-blue-100">
                  Kurumsal düzeyde güvenlik ve yedekleme sistemi ile verileriniz güvende.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Zap className="h-8 w-8 text-blue-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Hızlı Kurulum</h3>
                <p className="text-blue-100">
                  Dakikalar içinde kurulum tamamlayın ve kullanmaya başlayın.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-blue-200">Şirket</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-blue-200">Çalışan</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold">%99</div>
              <div className="text-sm text-blue-200">Memnuniyet</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-300" />
              <span className="font-semibold">Türkiye'nin En İyi İK Sistemi</span>
            </div>
            <p className="text-sm text-blue-100">
              500+ şirket tarafından kullanılan, güvenilen ve tercih edilen İK yönetim sistemi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}