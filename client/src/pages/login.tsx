import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, Building2, Users, BarChart3, Calendar, CreditCard } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
        window.location.href = "/";
      } else {
        alert(data.message || "Giriş sırasında hata oluştu");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Giriş sırasında hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">İK360</h1>
            <p className="text-gray-600 mt-2">Hesabınıza giriş yapın</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                E-posta
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifreniz"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-600">Beni hatırla</span>
              </label>
              <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                Şifremi unuttum
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Hesabınız yok mu?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Kayıt olun
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - App Description */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-8">
        <div className="max-w-lg text-white space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">İK360 ile</h2>
            <h3 className="text-3xl font-semibold">İnsan Kaynaklarınızı Yönetin</h3>
            <p className="text-xl text-blue-100">
              Çalışanlarınızı, performanslarını ve bordro işlemlerinizi tek platformda yönetin.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Çalışan Yönetimi</h4>
                <p className="text-blue-100">Çalışan bilgilerini kolayca takip edin ve yönetin</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Performans Takibi</h4>
                <p className="text-blue-100">Çalışan performanslarını analiz edin ve raporlayın</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">İzin Yönetimi</h4>
                <p className="text-blue-100">İzin taleplerini otomatik olarak takip edin</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Bordro İşlemleri</h4>
                <p className="text-blue-100">Maaş hesaplamalarını otomatikleştirin</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-blue-500/30">
            <p className="text-blue-100 text-sm">
              Binlerce şirket İK360 ile insan kaynaklarını verimli bir şekilde yönetiyor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}