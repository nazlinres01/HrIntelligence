import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Building2, Crown, Shield, Users, User, Briefcase, UserPlus } from "lucide-react";

type RoleType = "owner" | "hr-manager" | "hr-specialist" | "department-manager" | "employee";

interface RoleConfig {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  expectedRole: string;
}

const roleConfigs: Record<RoleType, RoleConfig> = {
  owner: {
    title: "Patron Girişi",
    description: "Şirket sahibi ve üst düzey yöneticiler için",
    icon: Crown,
    gradient: "from-purple-600 to-indigo-700",
    expectedRole: "owner"
  },
  "hr-manager": {
    title: "İK Müdürü Girişi", 
    description: "İnsan Kaynakları Müdürleri için",
    icon: Shield,
    gradient: "from-blue-600 to-indigo-700",
    expectedRole: "hr_manager"
  },
  "hr-specialist": {
    title: "İK Uzmanı Girişi",
    description: "İnsan Kaynakları Uzmanları için", 
    icon: Users,
    gradient: "from-teal-600 to-cyan-700",
    expectedRole: "hr_specialist"
  },
  "department-manager": {
    title: "Departman Müdürü Girişi",
    description: "Departman yöneticileri için",
    icon: Briefcase, 
    gradient: "from-orange-600 to-red-700",
    expectedRole: "department_manager"
  },
  employee: {
    title: "Çalışan Girişi",
    description: "Genel çalışanlar için",
    icon: User,
    gradient: "from-emerald-600 to-green-700", 
    expectedRole: "employee"
  }
};

export default function RoleLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    companyName: "",
  });

  // Extract role from URL
  const currentPath = window.location.pathname;
  const roleFromPath = currentPath.slice(1) as RoleType; // Remove leading slash
  const roleConfig = roleConfigs[roleFromPath] || roleConfigs.employee;

  const loginMutation = useMutation({
    mutationFn: async (data: typeof loginData) => {
      const res = await apiRequest("POST", "/api/login", data);
      return res.json();
    },
    onSuccess: (data) => {
      const userRole = data?.role;
      
      // Check if user role matches expected role for this login page
      if (userRole !== roleConfig.expectedRole) {
        toast({
          title: "Hatalı Giriş",
          description: `Bu giriş sayfası ${roleConfig.title} içindir. Lütfen doğru giriş sayfasını kullanın.`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Giriş Başarılı",
        description: `Hoş geldiniz, ${data.firstName} ${data.lastName}`,
      });
      
      // Redirect to role-specific dashboard
      navigate(`/${roleFromPath}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Giriş Hatası",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof registerData) => {
      const res = await apiRequest("POST", "/api/register", {
        ...data,
        role: roleConfig.expectedRole,
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Kayıt Başarılı",
        description: `Hoş geldiniz, ${data.firstName} ${data.lastName}. ${roleConfig.title} olarak kaydoldunuz.`,
      });
      
      // Redirect to role-specific dashboard
      navigate(`/${roleFromPath}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Kayıt Hatası",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  const Icon = roleConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className={`bg-gradient-to-r ${roleConfig.gradient} rounded-t-xl p-6 text-white text-center`}>
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Icon className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{roleConfig.title}</h1>
          <p className="text-sm opacity-90">{roleConfig.description}</p>
        </div>

        {/* Login/Register Forms */}
        <Card className="rounded-t-none border-t-0">
          <CardContent className="p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">E-posta</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="kullanici@sirket.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="login-password">Şifre</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Ad</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Adınız"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Soyad</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Soyadınız"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-email">E-posta</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="kullanici@sirket.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+90 555 000 00 00"
                    />
                  </div>

                  {roleFromPath === "owner" && (
                    <div>
                      <Label htmlFor="companyName">Şirket Adı</Label>
                      <Input
                        id="companyName"
                        type="text"
                        value={registerData.companyName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Şirket adınız"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="register-password">Şifre</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Kayıt yapılıyor..." : `${roleConfig.title.replace(' Girişi', '')} Olarak Kayıt Ol`}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Role Info */}
            <Alert className="mt-6">
              <Building2 className="h-4 w-4" />
              <AlertDescription>
                Bu sayfa sadece <strong>{roleConfig.title.replace(' Girişi', '')}</strong> yetkisine sahip kullanıcılar içindir.
                Farklı bir role sahipseniz, doğru giriş sayfasını kullanın.
              </AlertDescription>
            </Alert>

            {/* Other Role Links */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 text-center mb-3">Diğer roller için giriş:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(roleConfigs)
                  .filter(([key]) => key !== roleFromPath)
                  .map(([key, config]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/${key}`)}
                      className="text-xs p-2 h-auto"
                    >
                      {config.title.replace(' Girişi', '')}
                    </Button>
                  ))}
              </div>
            </div>

            {/* General Login Link */}
            <div className="mt-4 text-center">
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate("/")}
                className="text-xs"
              >
                Genel Giriş Sayfasına Dön
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}