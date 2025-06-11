import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Fingerprint,
  Smartphone,
  Globe,
  Info
} from "lucide-react";

// Gelişmiş güvenlik şeması
const loginSchema = z.object({
  email: z.string()
    .email("Geçerli bir e-posta adresi girin")
    .toLowerCase(),
  password: z.string()
    .min(1, "Şifre gerekli"),
  rememberMe: z.boolean().optional(),
  honeypot: z.string().max(0, "Güvenlik ihlali tespit edildi"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      honeypot: "",
    },
  });

  // Güvenlik kontrolleri
  useEffect(() => {
    const warnings: string[] = [];
    
    // Suspicious browser check
    if (navigator.userAgent.includes('headless') || 
        !navigator.webdriver === undefined ||
        navigator.languages.length === 0) {
      warnings.push("Şüpheli tarayıcı aktivitesi tespit edildi");
    }

    // VPN/Proxy detection (basic)
    if (navigator.connection && (navigator.connection as any).type === 'none') {
      warnings.push("Ağ bağlantısı anormalliği tespit edildi");
    }

    setSecurityWarnings(warnings);
  }, []);

  // Bloke süresi countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBlocked && blockTimeLeft > 0) {
      interval = setInterval(() => {
        setBlockTimeLeft(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBlocked, blockTimeLeft]);

  // Giriş mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      // Honeypot kontrolü
      if (data.honeypot) {
        throw new Error("Güvenlik ihlali tespit edildi");
      }

      // Rate limiting kontrolü
      if (isBlocked) {
        throw new Error(`Çok fazla başarısız deneme. ${blockTimeLeft} saniye bekleyin.`);
      }

      const response = await apiRequest("POST", "/api/auth/login", {
        ...data,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        fingerprint: await generateFingerprint(),
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

      // 3 başarısız denemeden sonra 5 dakika bloke
      if (newAttempts >= 3) {
        setIsBlocked(true);
        setBlockTimeLeft(300); // 5 dakika
        toast({
          title: "Hesap geçici olarak bloke edildi",
          description: "Güvenlik nedeniyle 5 dakika bekleyin.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Giriş başarısız",
          description: `${error.message || "E-posta veya şifre hatalı"}. ${3 - newAttempts} deneme hakkınız kaldı.`,
          variant: "destructive",
        });
      }
    },
  });

  // Browser fingerprinting
  const generateFingerprint = async (): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser fingerprint', 2, 2);
    }
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL(),
    };

    return btoa(JSON.stringify(fingerprint));
  };

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              HRFlow Pro
            </span>
          </Link>
          
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Güvenli Giriş
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Kurumsal hesabınızla güvenle giriş yapın
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Security Warnings */}
          {securityWarnings.length > 0 && (
            <Alert className="mb-6 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                <strong>Güvenlik Uyarısı:</strong>
                <ul className="mt-1 list-disc list-inside">
                  {securityWarnings.map((warning, index) => (
                    <li key={index} className="text-sm">{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Rate Limiting Warning */}
          {isBlocked && (
            <Alert className="mb-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <Lock className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <div className="flex items-center justify-between">
                  <span><strong>Hesap Bloke:</strong> Çok fazla başarısız deneme</span>
                  <Badge variant="destructive" className="ml-2">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(blockTimeLeft)}
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-slate-200 dark:border-slate-700 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
                Hesabınıza Giriş Yapın
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                E-posta adresiniz ve şifrenizi girin
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Honeypot - Bot koruması */}
                  <FormField
                    control={form.control}
                    name="honeypot"
                    render={({ field }) => (
                      <div className="hidden">
                        <Input {...field} tabIndex={-1} autoComplete="off" />
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          E-posta Adresi
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="ornek@sirket.com" 
                            {...field}
                            disabled={isBlocked}
                            className="border-slate-300 dark:border-slate-600"
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <span className="flex items-center">
                            <Lock className="h-4 w-4 mr-2" />
                            Şifre
                          </span>
                          <Link href="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            Şifremi Unuttum
                          </Link>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Şifrenizi girin"
                              {...field}
                              disabled={isBlocked}
                              className="border-slate-300 dark:border-slate-600 pr-10"
                              autoComplete="current-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isBlocked}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isBlocked}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            Beni hatırla (30 gün)
                          </FormLabel>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Güvenilir cihazlarda kullanın
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Security Information */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                          Güvenlik Bilgisi
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                            256-bit SSL şifreleme aktif
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                            Multi-faktör doğrulama desteklenir
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                            Oturum izleme aktif
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isBlocked || loginMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3"
                  >
                    {loginMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Doğrulanıyor...
                      </div>
                    ) : isBlocked ? (
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Hesap Bloke ({formatTime(blockTimeLeft)})
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <User className="h-4 w-4 mr-2" />
                        Güvenli Giriş Yap
                      </div>
                    )}
                  </Button>

                  {/* Login Attempts Warning */}
                  {loginAttempts > 0 && loginAttempts < 3 && (
                    <div className="text-center">
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                        {loginAttempts} başarısız deneme. {3 - loginAttempts} hakkınız kaldı.
                      </p>
                    </div>
                  )}
                </form>
              </Form>

              {/* Register Link */}
              <div className="text-center mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400">
                  Henüz hesabınız yok mu?{" "}
                  <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    Ücretsiz hesap oluşturun
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center">
              <Fingerprint className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1 text-sm">
                Biometrik Doğrulama
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Parmak izi ve yüz tanıma
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center">
              <Smartphone className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1 text-sm">
                SMS Doğrulama
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                İki faktörlü güvenlik
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center">
              <Globe className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1 text-sm">
                Konum Takibi
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Anormal giriş tespiti
              </p>
            </div>
          </div>

          {/* Legal Links */}
          <div className="text-center mt-8 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/privacy" className="hover:underline mr-4">Gizlilik Politikası</Link>
            <Link href="/terms" className="hover:underline mr-4">Kullanım Şartları</Link>
            <Link href="/security" className="hover:underline">Güvenlik</Link>
          </div>
        </div>
      </div>
    </div>
  );
}