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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  Mail,
  User,
  Briefcase,
  Shield,
  Users,
  BarChart3,
  Calendar,
  ArrowRight,
  Sparkles,
  Award,
  Globe
} from "lucide-react";

const passwordSchema = z.string()
  .min(8, "Şifre en az 8 karakter olmalı")
  .regex(/[A-Z]/, "En az bir büyük harf içermeli")
  .regex(/[a-z]/, "En az bir küçük harf içermeli")
  .regex(/[0-9]/, "En az bir rakam içermeli");

const registerSchema = z.object({
  firstName: z.string()
    .min(2, "Ad en az 2 karakter olmalı")
    .max(50, "Ad en fazla 50 karakter olabilir"),
  lastName: z.string()
    .min(2, "Soyad en az 2 karakter olmalı")
    .max(50, "Soyad en fazla 50 karakter olabilir"),
  email: z.string()
    .email("Geçerli bir e-posta adresi girin")
    .toLowerCase(),
  companyName: z.string()
    .min(2, "Şirket adı en az 2 karakter olmalı")
    .max(100, "Şirket adı en fazla 100 karakter olabilir"),
  position: z.string()
    .min(2, "Pozisyon en az 2 karakter olmalı"),
  role: z.string()
    .min(1, "Rol seçimi zorunludur"),
  password: passwordSchema,
  confirmPassword: z.string(),
  acceptTerms: z.boolean()
    .refine(val => val === true, "Kullanım şartlarını kabul etmelisiniz"),
  acceptPrivacy: z.boolean()
    .refine(val => val === true, "Gizlilik politikasını kabul etmelisiniz"),
  honeypot: z.string().default(""),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      position: "",
      role: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      acceptPrivacy: false,
      honeypot: "",
    },
  });

  const password = form.watch("password");

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      if (data.honeypot) {
        throw new Error("Güvenlik ihlali tespit edildi");
      }

      const response = await apiRequest("POST", "/api/auth/register", {
        ...data,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Kayıt başarılı!",
        description: "Hesabınız oluşturuldu. Giriş yapabilirsiniz.",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Kayıt başarısız",
        description: error.message || "Bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-40 left-40 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-20 right-60 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>

        <div className="relative z-10 flex items-center justify-center p-12 text-white">
          <div className="max-w-lg">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Yeni nesil HR platformu
            </div>
            
            <h3 className="text-4xl font-light mb-6">
              İnsan kaynakları yönetiminde
              <span className="block font-semibold">yeni bir dönem</span>
            </h3>
            <p className="text-xl font-light text-indigo-100 mb-8 leading-relaxed">
              Şirketinizi geleceğe hazırlayın. Modern teknoloji ile desteklenen 
              kapsamlı HR çözümleri ile fark yaratın.
            </p>

            {/* HR Benefits */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Merkezi İK Yönetimi</div>
                  <div className="text-sm text-indigo-200">Tüm çalışan verileri tek yerde</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Performans İzleme</div>
                  <div className="text-sm text-indigo-200">Hedef bazlı değerlendirme</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Bordro Otomasyonu</div>
                  <div className="text-sm text-indigo-200">Hatasız hesaplama ve raporlama</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">KVKK Uyumluluk</div>
                  <div className="text-sm text-indigo-200">Veri güvenliği ve gizlilik</div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-white/20">
              <div>
                <div className="text-2xl font-bold">KVKK</div>
                <div className="text-sm text-indigo-200">Uyumlu</div>
              </div>
              <div>
                <div className="text-2xl font-bold">ISO 27001</div>
                <div className="text-sm text-indigo-200">Sertifikalı</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center animate-bounce">
          <Award className="h-8 w-8 text-white" />
        </div>
        <div className="absolute bottom-10 right-10 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center animate-pulse">
          <Globe className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">HR360</h1>
            </div>
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
              Hesap oluşturun
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Modern HR yönetimine başlayın
            </p>
          </div>

          {/* Register Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-6">
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

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ad
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Adınız"
                          {...field}
                          className="h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Soyad
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Soyadınız"
                          {...field}
                          className="h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Şirket Adı
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="Şirket adınız"
                          {...field}
                          className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Position and Role */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pozisyon
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            placeholder="İK Müdürü"
                            {...field}
                            className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rol
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Rolünüzü seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="hr_manager">İK Müdürü</SelectItem>
                          <SelectItem value="hr_specialist">İK Uzmanı</SelectItem>
                          <SelectItem value="department_manager">Departman Müdürü</SelectItem>
                          <SelectItem value="employee">Çalışan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Güçlü bir şifre oluşturun"
                          {...field}
                          className="pr-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
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
                    
                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500 dark:text-gray-400">Şifre gücü</span>
                          <span className={
                            passwordStrength < 50 ? "text-red-500" :
                            passwordStrength < 75 ? "text-yellow-500" : "text-green-500"
                          }>
                            {passwordStrength < 50 ? "Zayıf" :
                             passwordStrength < 75 ? "Orta" : "Güçlü"}
                          </span>
                        </div>
                        <Progress 
                          value={passwordStrength} 
                          className="h-2"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Şifre Tekrarı
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Şifrenizi tekrar girin"
                          {...field}
                          className="pr-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
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

              {/* Terms and Privacy */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-600 dark:text-gray-400">
                          <Link href="/terms" className="text-blue-600 hover:text-blue-500 underline">
                            Kullanım şartlarını
                          </Link>{" "}
                          kabul ediyorum
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acceptPrivacy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-600 dark:text-gray-400">
                          <Link href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                            Gizlilik politikasını
                          </Link>{" "}
                          kabul ediyorum
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-medium disabled:opacity-50"
              >
                {registerMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Hesap oluşturuluyor...
                  </div>
                ) : (
                  <>
                    Hesap oluştur
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Zaten hesabınız var mı?{" "}
                  <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                    Giriş yapın
                  </Link>
                </p>
              </div>
            </form>
          </Form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-800 dark:text-green-200 font-medium">
                Güvenli kayıt
              </span>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Tüm verileriniz şifrelenir ve KVKK standartlarında korunur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}