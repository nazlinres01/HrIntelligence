import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, Building2, User, Users, BarChart3, Shield, Zap, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { roleLabels, type UserRole } from "@/lib/permissions";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("employee");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    department: "",
    position: "",
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
      const submitData = {
        ...formData,
        role: selectedRole
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Kayıt başarısız');
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "owner": return <Shield className="h-4 w-4" />;
      case "hr_manager": return <Users className="h-4 w-4" />;
      case "hr_specialist": return <User className="h-4 w-4" />;
      case "department_manager": return <BarChart3 className="h-4 w-4" />;
      case "employee": return <Zap className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "owner": return "Tam yetki - Tüm sistem erişimi";
      case "hr_manager": return "İK yöneticisi - Çalışan ve performans yönetimi";
      case "hr_specialist": return "İK uzmanı - İzin ve çalışan işlemleri";
      case "department_manager": return "Departman müdürü - Takım performansı";
      case "employee": return "Çalışan - Kişisel profil ve izin talepleri";
      default: return "";
    }
  };

  const shouldShowField = (field: string) => {
    switch (field) {
      case "companyName":
        return selectedRole === "owner"; // Sadece patron şirket adını girer
      case "department":
        return selectedRole === "department_manager" || selectedRole === "employee";
      case "position":
        return selectedRole === "employee" || selectedRole === "department_manager";
      case "phone":
        return selectedRole !== "employee"; // Çalışan dışındaki roller telefon girer
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">İK360'a Katılın</h1>
            <p className="text-gray-600 text-sm">
              Hesap oluşturun ve rolünüzü seçin
            </p>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}



          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rol Seçimi - Her zaman göster */}
            <div className="space-y-2">
              <Label htmlFor="role">Rolünüz</Label>
              <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rol seçin" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([role, label]) => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(role as UserRole)}
                        <div>
                          <div className="font-medium">{label}</div>
                          <div className="text-xs text-gray-500">
                            {getRoleDescription(role as UserRole)}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Şirket Adı - Sadece patron rolü */}
            {shouldShowField("companyName") && (
              <div className="space-y-2">
                <Label htmlFor="companyName">Şirket Adı</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Şirket adınızı girin"
                />
              </div>
            )}

            {/* Ad Soyad */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ad</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Adınız"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Soyad</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Soyadınız"
                />
              </div>
            </div>

            {/* E-posta */}
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10"
                  placeholder="ornek@sirket.com"
                />
              </div>
            </div>

            {/* Telefon - Çalışan dışındaki roller */}
            {shouldShowField("phone") && (
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0555 123 45 67"
                />
              </div>
            )}

            {/* Departman - Departman müdürü ve çalışan */}
            {shouldShowField("department") && (
              <div className="space-y-2">
                <Label htmlFor="department">Departman</Label>
                <Input
                  id="department"
                  name="department"
                  type="text"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Departman adı"
                />
              </div>
            )}

            {/* Pozisyon - Departman müdürü ve çalışan */}
            {shouldShowField("position") && (
              <div className="space-y-2">
                <Label htmlFor="position">Pozisyon</Label>
                <Input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Pozisyonunuz"
                />
              </div>
            )}

            {/* Şifre */}
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-10"
                  placeholder="En az 6 karakter"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Hesap Oluşturuluyor...
                </div>
              ) : (
                "Hesap Oluştur"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Zaten hesabınız var mı?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Giriş yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}