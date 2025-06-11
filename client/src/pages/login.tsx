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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Building2, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail,
  AlertTriangle
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin").toLowerCase(),
  password: z.string().min(1, "Şifre gerekli"),
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

  // Security checks
  useEffect(() => {
    const warnings: string[] = [];
    
    if (navigator.userAgent.includes('headless') || 
        !navigator.webdriver === undefined ||
        navigator.languages.length === 0) {
      warnings.push("Şüpheli tarayıcı aktivitesi tespit edildi");
    }

    if ((navigator as any).connection && (navigator as any).connection.type === 'none') {
      warnings.push("Ağ bağlantısı anormalliği tespit edildi");
    }

    setSecurityWarnings(warnings);
  }, []);

  // Block countdown
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

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6 py-8 max-w-md">
        {/* Header - Microsoft Style */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white dark:text-slate-900" />
            </div>
            <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              HRFlow Pro
            </span>
          </Link>
          
          <h1 className="text-3xl font-light text-slate-900 dark:text-slate-100 mb-3">
            Oturum açın
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-light">
            Çalışma alanınıza erişmek için giriş yapın
          </p>
        </div>

        {/* Security Warnings */}
        {securityWarnings.length > 0 && (
          <Alert className="mb-6 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <AlertTriangle className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <AlertDescription className="text-slate-700 dark:text-slate-300">
              <div className="text-sm font-medium">Güvenlik Uyarısı</div>
              <ul className="mt-1 space-y-1">
                {securityWarnings.map((warning, index) => (
                  <li key={index} className="text-sm text-slate-600 dark:text-slate-400">{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Rate Limiting Warning */}
        {isBlocked && (
          <Alert className="mb-6 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <Lock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <AlertDescription className="text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Hesap geçici olarak bloke edildi</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {formatTime(blockTimeLeft)}
                </span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Login Form - Microsoft Style */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Honeypot */}
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
                    <FormLabel className="text-slate-900 dark:text-slate-100 font-medium">
                      E-posta
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="ornek@sirket.com" 
                        {...field}
                        disabled={isBlocked}
                        className="border-slate-300 dark:border-slate-600 h-12"
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
                      <span className="text-slate-900 dark:text-slate-100 font-medium">
                        Şifre
                      </span>
                      <Link href="/forgot-password" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                        Şifremi unuttum
                      </Link>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Şifrenizi girin"
                          {...field}
                          disabled={isBlocked}
                          className="border-slate-300 dark:border-slate-600 h-12 pr-12"
                          autoComplete="current-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isBlocked}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-600 dark:text-slate-400" />
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
                      <FormLabel className="text-sm text-slate-700 dark:text-slate-300">
                        Oturumumu açık tut
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isBlocked || loginMutation.isPending}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 font-medium"
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Giriş yapılıyor...
                  </div>
                ) : isBlocked ? (
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Bloke ({formatTime(blockTimeLeft)})
                  </div>
                ) : (
                  "Giriş yap"
                )}
              </Button>

              {/* Login Attempts Warning */}
              {loginAttempts > 0 && loginAttempts < 3 && (
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {3 - loginAttempts} deneme hakkınız kaldı
                  </p>
                </div>
              )}

              {/* External Login */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      veya
                    </span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-slate-300 dark:border-slate-600 h-12 font-medium"
                  onClick={() => window.location.href = "/api/login"}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Replit ile giriş yap
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Hesabınız yok mu?{" "}
                  <Link href="/register" className="text-slate-900 dark:text-slate-100 hover:underline font-medium">
                    Kayıt olun
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>

        {/* Legal Links */}
        <div className="text-center mt-8 text-xs text-slate-500 dark:text-slate-400 space-x-4">
          <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300">Gizlilik</Link>
          <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300">Şartlar</Link>
        </div>
      </div>
    </div>
  );
}