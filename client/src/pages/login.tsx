import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

export default function Login() {
  // Basit giriş - Replit Auth'a yönlendirme
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const testCredentials = [
    { role: "Admin", email: "admin@techcorp.com.tr", password: "admin123", color: "bg-purple-100 text-purple-800" },
    { role: "İK Müdürü", email: "ik.muduru@techcorp.com.tr", password: "ik123", color: "bg-teal-100 text-teal-800" },
    { role: "İK Uzmanı", email: "ik.uzman@techcorp.com.tr", password: "uzman123", color: "bg-orange-100 text-orange-800" },
    { role: "Departman Müdürü", email: "dept.muduru@techcorp.com.tr", password: "dept123", color: "bg-indigo-100 text-indigo-800" },
    { role: "Çalışan", email: "calisan@techcorp.com.tr", password: "calisan123", color: "bg-emerald-100 text-emerald-800" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">İK Yönetim Sistemi</h1>
          <p className="text-gray-600 mt-2">TechCorp Yazılım A.Ş.</p>
        </div>

        {/* Login Button */}
        <Card>
          <CardHeader>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>
              Replit hesabınızla güvenli giriş yapın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Replit ile Giriş Yap
            </Button>
          </CardContent>
        </Card>

        {/* Test Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rol Bazlı Sistem Bilgileri</CardTitle>
            <CardDescription>
              Her rol için farklı dashboard ve yetki sistemi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testCredentials.map((cred, index) => (
                <div key={index} className={`p-3 rounded-lg ${cred.color}`}>
                  <div className="font-medium text-sm">{cred.role}</div>
                  <div className="text-xs mt-1 opacity-75">
                    <div>Email: {cred.email}</div>
                    <div>Şifre: {cred.password}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}