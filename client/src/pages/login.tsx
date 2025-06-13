import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building, Users, Shield, Award, TrendingUp, BarChart3, User, Lock } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Giriş Başarılı",
          description: `Hoş geldiniz, ${data.user.firstName}!`,
        });
        setLocation("/");
      } else {
        const error = await response.json();
        toast({
          title: "Giriş Hatası",
          description: error.message || "Email veya şifre hatalı",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Bağlantı Hatası",
        description: "Sunucuya bağlanılamadı",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testCredentials = [
    { role: "Admin", email: "admin@techcorp.com.tr", password: "admin123" },
    { role: "İK Müdürü", email: "ik.muduru@techcorp.com.tr", password: "ik123" },
    { role: "İK Uzmanı", email: "ik.uzman@techcorp.com.tr", password: "uzman123" },
    { role: "Departman Müdürü", email: "dept.muduru@techcorp.com.tr", password: "dept123" },
    { role: "Çalışan", email: "calisan@techcorp.com.tr", password: "calisan123" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sol Panel - Giriş Formu */}
      <div className="flex-1 flex items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">İK Yönetim</h2>
                <p className="text-sm text-gray-500">TechCorp Yazılım A.Ş.</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hesabınıza giriş yapın</h2>
            <p className="text-sm text-gray-600 mb-8">Kurumsal İK yönetim sistemine hoş geldiniz</p>
          </div>

          <div>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-posta adresi
                </Label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10"
                    placeholder="ornek@techcorp.com.tr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Şifre
                </Label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10"
                    placeholder="Şifrenizi girin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </Button>
              </div>
            </form>

            <div className="mt-8">
              <div className="text-sm text-gray-600 mb-4">Test hesapları:</div>
              <div className="space-y-2">
                {testCredentials.map((cred, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{cred.role}</div>
                      <div className="text-xs text-gray-500">{cred.email}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEmail(cred.email);
                        setPassword(cred.password);
                      }}
                    >
                      Seç
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Panel - Tanıtım */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full flex flex-col justify-center px-12 text-white">
            <div className="max-w-md">
              <h1 className="text-4xl font-bold mb-6">
                Modern İK Yönetimi için
                <span className="block text-blue-200">Kapsamlı Çözüm</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Çalışan yönetiminden performans takibine, bordro işlemlerinden eğitim planlamasına 
                kadar tüm İK süreçlerinizi tek platformda yönetin.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Çalışan Yönetimi</div>
                    <div className="text-sm text-blue-200">Kapsamlı personel takip sistemi</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Performans Analizi</div>
                    <div className="text-sm text-blue-200">Detaylı raporlama ve analitik</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Güvenli Platform</div>
                    <div className="text-sm text-blue-200">ISO 27001 uyumlu güvenlik</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Rol Bazlı Erişim</div>
                    <div className="text-sm text-blue-200">5 farklı kullanıcı rolü desteği</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}