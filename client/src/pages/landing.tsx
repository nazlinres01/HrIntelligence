import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, Building2, Users, BarChart3, CheckCircle, Shield } from "lucide-react";
import { Link } from "wouter";
import { queryClient } from "@/lib/queryClient";

export default function Landing() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        window.location.href = '/dashboard';
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

  return (
    <div className="min-h-screen flex">
      {/* Sol Taraf - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo ve Başlık */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="h-10 w-10 text-blue-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">İK360</h1>
            </div>
            <p className="text-gray-600">
              {isLoginMode ? "Hesabınıza Giriş Yapın" : "Kayıt için ayrı sayfamızı kullanın"}
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

              <div className="text-center text-xs text-gray-500 mt-4">
                Hesabınız yok mu?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Kayıt olun
                </Link>
              </div>
            </form>
          ) : (
            /* Register Redirect */
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Detaylı kayıt için ayrı sayfamızı kullanın
              </p>
              <Link href="/register">
                <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  Kayıt Sayfasına Git
                </Button>
              </Link>
              <div className="text-center text-xs text-gray-500 mt-4">
                Zaten hesabınız var mı?{" "}
                <button 
                  onClick={() => setIsLoginMode(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Giriş yapın
                </button>
              </div>
            </div>
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
                <h3 className="text-xl font-semibold mb-2">Çalışan Yönetimi</h3>
                <p className="text-blue-100">
                  Personel bilgilerini merkezi olarak yönetin ve takip edin.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-blue-200" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Performans Takibi</h3>
                <p className="text-blue-100">
                  Çalışan performansını objektif verilerle değerlendirin.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-blue-200" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Güvenli Sistem</h3>
                <p className="text-blue-100">
                  Rol tabanlı erişim kontrolü ile verilerinizi koruyun.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-400 pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-blue-100">Ücretsiz deneme başlatın</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}