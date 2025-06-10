import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Building2, Crown, Shield, Users, User, Briefcase } from "lucide-react";

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
      const userRole = data.user?.role;
      
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
        description: `Hoş geldiniz, ${data.user.firstName} ${data.user.lastName}`,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
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

        {/* Login Form */}
        <Card className="rounded-t-none border-t-0">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="kullanici@sirket.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
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