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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Shield, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  Lock, 
  KeyRound,
  UserCheck,
  Mail,
  Phone,
  Building,
  User,
  AlertTriangle,
  Info
} from "lucide-react";

// Gelişmiş şifre validasyon şeması
const passwordSchema = z.string()
  .min(12, "Şifre en az 12 karakter olmalı")
  .regex(/[A-Z]/, "En az bir büyük harf içermeli")
  .regex(/[a-z]/, "En az bir küçük harf içermeli")
  .regex(/[0-9]/, "En az bir rakam içermeli")
  .regex(/[^A-Za-z0-9]/, "En az bir özel karakter içermeli")
  .regex(/^(?!.*(.)\1{2,})/, "Ardışık aynı karakterler içermemeli");

// Güvenli kayıt şeması
const registerSchema = z.object({
  // Kişisel bilgiler
  firstName: z.string()
    .min(2, "Ad en az 2 karakter olmalı")
    .max(50, "Ad en fazla 50 karakter olabilir")
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "Sadece harf karakterleri kullanın"),
  lastName: z.string()
    .min(2, "Soyad en az 2 karakter olmalı")
    .max(50, "Soyad en fazla 50 karakter olabilir")
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "Sadece harf karakterleri kullanın"),
  email: z.string()
    .email("Geçerli bir e-posta adresi girin")
    .toLowerCase()
    .refine((email) => !email.includes('+'), "Geçici e-posta adresleri kabul edilmez"),
  phone: z.string()
    .regex(/^(\+90|0)?[5][0-9]{9}$/, "Geçerli bir Türkiye telefon numarası girin"),
  
  // Şirket bilgileri
  companyName: z.string()
    .min(2, "Şirket adı en az 2 karakter olmalı")
    .max(100, "Şirket adı en fazla 100 karakter olabilir"),
  companySize: z.string().min(1, "Şirket büyüklüğünü seçin"),
  industry: z.string().min(1, "Sektör seçin"),
  
  // Güvenlik
  password: passwordSchema,
  confirmPassword: z.string(),
  
  // Güvenlik onayları
  acceptTerms: z.boolean().refine(val => val, "Kullanım şartlarını kabul etmelisiniz"),
  acceptPrivacy: z.boolean().refine(val => val, "Gizlilik politikasını kabul etmelisiniz"),
  acceptMarketing: z.boolean().optional(),
  
  // Bot koruması
  honeypot: z.string().max(0, "Bot aktivitesi tespit edildi"),
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
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      companySize: "",
      industry: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      acceptPrivacy: false,
      acceptMarketing: false,
      honeypot: "",
    },
  });

  // Şifre gücü hesaplama
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;
    return Math.min(strength, 100);
  };

  // Şifre değişikliğini izle
  const watchPassword = form.watch("password");
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(watchPassword));
  }, [watchPassword]);

  // Kayıt mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // Honeypot kontrolü
      if (data.honeypot) {
        throw new Error("Bot aktivitesi tespit edildi");
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
        description: "E-posta adresinizi doğrulamak için gelen kutunuzu kontrol edin.",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Kayıt başarısız",
        description: error.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500";
    if (passwordStrength < 60) return "bg-yellow-500";
    if (passwordStrength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return "Zayıf";
    if (passwordStrength < 60) return "Orta";
    if (passwordStrength < 80) return "İyi";
    return "Çok Güçlü";
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
            Güvenli Hesap Oluştur
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Kurumsal düzeyde güvenlik ile İK yönetimine başlayın
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Adım {step} / {totalSteps}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                %{Math.round((step / totalSteps) * 100)} tamamlandı
              </span>
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-2" />
          </div>

          <Card className="border-slate-200 dark:border-slate-700 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                {step === 1 && <User className="h-6 w-6 text-white" />}
                {step === 2 && <Building className="h-6 w-6 text-white" />}
                {step === 3 && <Shield className="h-6 w-6 text-white" />}
              </div>
              <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
                {step === 1 && "Kişisel Bilgileriniz"}
                {step === 2 && "Şirket Bilgileri"}
                {step === 3 && "Güvenlik Ayarları"}
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                {step === 1 && "Hesabınız için gerekli kişisel bilgileri girin"}
                {step === 2 && "Şirketiniz hakkında bilgi verin"}
                {step === 3 && "Güçlü bir şifre oluşturun ve güvenlik ayarlarını yapın"}
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

                  {/* Adım 1: Kişisel Bilgiler */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Ad *
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Adınız" 
                                  {...field}
                                  className="border-slate-300 dark:border-slate-600"
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
                              <FormLabel className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Soyad *
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Soyadınız" 
                                  {...field}
                                  className="border-slate-300 dark:border-slate-600"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              E-posta Adresi *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="ornek@sirket.com" 
                                {...field}
                                className="border-slate-300 dark:border-slate-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              Telefon Numarası *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+90 555 123 45 67" 
                                {...field}
                                className="border-slate-300 dark:border-slate-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Adım 2: Şirket Bilgileri */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              Şirket Adı *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Şirket Adı A.Ş." 
                                {...field}
                                className="border-slate-300 dark:border-slate-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="companySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Şirket Büyüklüğü *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-slate-300 dark:border-slate-600">
                                  <SelectValue placeholder="Çalışan sayısını seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-10">1-10 çalışan</SelectItem>
                                <SelectItem value="11-50">11-50 çalışan</SelectItem>
                                <SelectItem value="51-200">51-200 çalışan</SelectItem>
                                <SelectItem value="201-1000">201-1000 çalışan</SelectItem>
                                <SelectItem value="1000+">1000+ çalışan</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sektör *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-slate-300 dark:border-slate-600">
                                  <SelectValue placeholder="Sektörünüzü seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="technology">Teknoloji</SelectItem>
                                <SelectItem value="finance">Finans</SelectItem>
                                <SelectItem value="healthcare">Sağlık</SelectItem>
                                <SelectItem value="education">Eğitim</SelectItem>
                                <SelectItem value="manufacturing">İmalat</SelectItem>
                                <SelectItem value="retail">Perakende</SelectItem>
                                <SelectItem value="consulting">Danışmanlık</SelectItem>
                                <SelectItem value="other">Diğer</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Adım 3: Güvenlik */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Lock className="h-4 w-4 mr-2" />
                              Şifre *
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Güçlü bir şifre oluşturun"
                                  {...field}
                                  className="border-slate-300 dark:border-slate-600 pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            {watchPassword && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-slate-600 dark:text-slate-400">
                                    Şifre Gücü: {getPasswordStrengthText()}
                                  </span>
                                  <span className="text-xs text-slate-600 dark:text-slate-400">
                                    %{passwordStrength}
                                  </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                                    style={{ width: `${passwordStrength}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <KeyRound className="h-4 w-4 mr-2" />
                              Şifre Tekrarı *
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Şifrenizi tekrar girin"
                                  {...field}
                                  className="border-slate-300 dark:border-slate-600 pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
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

                      {/* Güvenlik Bildirimleri */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                              Güvenlik Gereksinimleri
                            </h4>
                            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                              <li className="flex items-center">
                                {watchPassword.length >= 12 ? (
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                ) : (
                                  <XCircle className="h-3 w-3 text-red-500 mr-2" />
                                )}
                                En az 12 karakter
                              </li>
                              <li className="flex items-center">
                                {/[A-Z]/.test(watchPassword) ? (
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                ) : (
                                  <XCircle className="h-3 w-3 text-red-500 mr-2" />
                                )}
                                Büyük harf (A-Z)
                              </li>
                              <li className="flex items-center">
                                {/[a-z]/.test(watchPassword) ? (
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                ) : (
                                  <XCircle className="h-3 w-3 text-red-500 mr-2" />
                                )}
                                Küçük harf (a-z)
                              </li>
                              <li className="flex items-center">
                                {/[0-9]/.test(watchPassword) ? (
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                ) : (
                                  <XCircle className="h-3 w-3 text-red-500 mr-2" />
                                )}
                                Rakam (0-9)
                              </li>
                              <li className="flex items-center">
                                {/[^A-Za-z0-9]/.test(watchPassword) ? (
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                ) : (
                                  <XCircle className="h-3 w-3 text-red-500 mr-2" />
                                )}
                                Özel karakter (!@#$%^&*)
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Yasal Onaylar */}
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
                                <FormLabel className="text-sm">
                                  <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    Kullanım Şartları
                                  </Link>
                                  'nı okudum ve kabul ediyorum *
                                </FormLabel>
                                <FormMessage />
                              </div>
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
                                <FormLabel className="text-sm">
                                  <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    Gizlilik Politikası
                                  </Link>
                                  'nı okudum ve kabul ediyorum *
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="acceptMarketing"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm">
                                  Ürün güncellemeleri ve pazarlama iletişimi almak istiyorum
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    {step > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="border-slate-300 dark:border-slate-600"
                      >
                        Geri
                      </Button>
                    ) : (
                      <div />
                    )}

                    {step < totalSteps ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
                      >
                        İleri
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white"
                      >
                        {registerMutation.isPending ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Hesap Oluşturuluyor...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <UserCheck className="h-4 w-4 mr-2" />
                            Güvenli Hesap Oluştur
                          </div>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>

              {/* Login Link */}
              <div className="text-center mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400">
                  Zaten hesabınız var mı?{" "}
                  <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    Giriş yapın
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                256-bit SSL Şifreleme
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Verileriniz askeri seviye güvenlik ile korunuyor
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center">
              <Lock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                KVKK Uyumlu
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Kişisel veri güvenliği garantili
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                Bot Koruması
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Gelişmiş spam ve bot engelleyici
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}