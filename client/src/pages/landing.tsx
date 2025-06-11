import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, Building2, Users, BarChart3, CheckCircle, Shield, User, Zap } from "lucide-react";
import { Link } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { roleLabels, type UserRole } from "@/lib/permissions";

export default function Landing() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "employee" as UserRole,
    companyName: "",
    phone: "",
    department: "",
    position: "",
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
        window.location.href = '/dashboard';
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

  const isOwner = registerData.role === 'owner';
  const isHRRole = registerData.role === 'hr_manager' || registerData.role === 'hr_specialist';
  const isDepartmentOrEmployee = registerData.role === 'department_manager' || registerData.role === 'employee';

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
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Rol Seçimi
                  </Label>
                  <Select value={registerData.role} onValueChange={(value: UserRole) => setRegisterData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Rolünüzü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr_manager">🛡️ {roleLabels.hr_manager}</SelectItem>
                      <SelectItem value="hr_specialist">👥 {roleLabels.hr_specialist}</SelectItem>
                      <SelectItem value="department_manager">📋 {roleLabels.department_manager}</SelectItem>
                      <SelectItem value="employee">👤 {roleLabels.employee}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Şirket adı - sadece patron için */}
                {isOwner && (
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
                )}

                {/* Telefon - patron ve İK rolleri için */}
                {(isOwner || isHRRole) && (
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Telefon Numarası
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0532 XXX XX XX"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}

                {/* Departman ve pozisyon - departman müdürü ve çalışan için */}
                {isDepartmentOrEmployee && (
                  <>
                    <div>
                      <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                        Departman
                      </Label>
                      <Input
                        id="department"
                        type="text"
                        placeholder="Hangi departmanda çalışıyorsunuz?"
                        value={registerData.department}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, department: e.target.value }))}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                        Pozisyon
                      </Label>
                      <Input
                        id="position"
                        type="text"
                        placeholder="Pozisyonunuz nedir?"
                        value={registerData.position}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, position: e.target.value }))}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </>
                )}

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
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="text-blue-100">Demo hesabı ile sistemi deneyin</span>
              </div>
              <div className="bg-blue-800/30 rounded-lg p-4 text-sm">
                <div className="text-blue-200 font-medium mb-2">👑 Admin Hesabı:</div>
                <div className="text-blue-100">
                  E-posta: <span className="font-mono bg-blue-900/50 px-2 py-1 rounded">admin@gmail.com</span>
                </div>
                <div className="text-blue-100 mt-1">
                  Şifre: <span className="font-mono bg-blue-900/50 px-2 py-1 rounded">admin123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}