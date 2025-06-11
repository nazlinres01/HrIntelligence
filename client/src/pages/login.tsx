import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Eye, 
  EyeOff, 
  Shield, 
  Users,
  BarChart3,
  Calendar,
  Building2,
  CheckCircle,
  ArrowRight,
  Lock,
  Mail,
  Globe
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(1, "Şifre gereklidir"),
  rememberMe: z.boolean().default(false),
  honeypot: z.string().default(""),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      honeypot: "",
    },
  });

  // Block timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBlocked && blockTimeLeft > 0) {
      interval = setInterval(() => {
        setBlockTimeLeft((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBlocked, blockTimeLeft]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      if (data.honeypot) {
        throw new Error("Güvenlik ihlali tespit edildi");
      }

      if (isBlocked) {
        throw new Error(`Çok fazla başarısız deneme. ${blockTimeLeft} saniye bekleyin.`);
      }

      const response = await apiRequest("POST", "/api/auth/login", {
        ...data,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      
      return response.json();
    },
    onSuccess: () => {
      setLoginAttempts(0);
      toast({
        title: "Giriş başarılı!",
        description: "Dashboard'a yönlendiriliyorsunuz...",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= 3) {
        setIsBlocked(true);
        setBlockTimeLeft(300);
        toast({
          title: "Hesap geçici olarak kilitlendi",
          description: "Çok fazla başarısız deneme. 5 dakika bekleyin.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Giriş başarısız",
          description: error.message || "E-posta veya şifre hatalı",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">HR360</h1>
            </div>
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
              Hesabınıza giriş yapın
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              HR yönetim platformuna devam edin
            </p>
          </div>

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-6">
              {/* Honeypot */}
              <FormField
                control={form.control}
                name="honeypot"
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      E-posta
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="ornek@sirket.com"
                          {...field}
                          className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Şifre
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Şifrenizi girin"
                          {...field}
                          className="pl-10 pr-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal text-gray-600 dark:text-gray-400">
                          Beni hatırla
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Şifremi unuttum
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loginMutation.isPending || isBlocked}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-medium disabled:opacity-50"
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Giriş yapılıyor...
                  </div>
                ) : isBlocked ? (
                  `Bekleyin (${blockTimeLeft}s)`
                ) : (
                  <>
                    Giriş yap
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hesabınız yok mu?{" "}
                  <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                    Hesap oluşturun
                  </Link>
                </p>
              </div>
            </form>
          </Form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                Güvenli bağlantı
              </span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Verileriniz 256-bit SSL şifreleme ile korunmaktadır
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-40 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10 flex items-center justify-center p-12 text-white">
          <div className="max-w-lg">
            <h3 className="text-4xl font-light mb-6">
              İnsan kaynaklarında 
              <span className="block font-semibold">dijital dönüşüm</span>
            </h3>
            <p className="text-xl font-light text-blue-100 mb-8 leading-relaxed">
              Çalışan deneyimini iyileştirin, verimliliği artırın ve 
              stratejik HR kararlarınızı güçlendirin.
            </p>

            {/* HR Process Highlights */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Çalışan Yaşam Döngüsü</div>
                  <div className="text-sm text-blue-200">İşe alımdan ayrılığa kadar</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Performans & Gelişim</div>
                  <div className="text-sm text-blue-200">Sürekli değerlendirme sistemi</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">İzin & Devam Yönetimi</div>
                  <div className="text-sm text-blue-200">Akıllı planlama araçları</div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold">KVKK</div>
                <div className="text-sm text-blue-200">Uyumlu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">ISO 27001</div>
                <div className="text-sm text-blue-200">Sertifikalı</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center animate-bounce">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <div className="absolute bottom-20 left-10 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center animate-pulse">
          <Globe className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}