import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, Building2, Users, BarChart3, Shield, Zap, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { queryClient } from "@/lib/queryClient";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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
            <p className="text-gray-600">İnsan Kaynakları Yönetim Sistemi</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-posta Adresi
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@sirket.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Şifrenizi giriniz"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

            <div className="text-center">
              <span className="text-gray-600">Hesabınız yok mu? </span>
              <Link href="/register">
                <a className="text-blue-600 hover:text-blue-700 font-medium">
                  Kayıt Ol
                </a>
              </Link>
            </div>
          </form>

          {/* Demo Login Info */}
          <div className="border-t pt-6">
            <p className="text-sm text-gray-500 text-center mb-3">Demo hesaplar:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="bg-gray-50 p-2 rounded">
                <strong>İK Müdürü:</strong> fatma@tekirdag.com / 123456
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <strong>İK Uzmanı:</strong> mehmet@tekirdag.com / 123456
              </div>
            </div>
          </div>
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
                <h3 className="text-lg font-semibold mb-2">Takım Yönetimi</h3>
                <p className="text-blue-100">
                  Çoklu İK uzmanı desteği ile ekibinizi kolayca yönetin. Roller atayın ve yetkileri kontrol edin.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-blue-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Analiz ve Raporlama</h3>
                <p className="text-blue-100">
                  Gerçek zamanlı dashboard ile performans metrikleri ve detaylı raporlar.
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
                <h3 className="text-lg font-semibold mb-2">Hızlı ve Kolay</h3>
                <p className="text-blue-100">
                  Sezgisel arayüz ile dakikalar içinde kurulum ve kullanıma başlama.
                </p>
              </div>
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