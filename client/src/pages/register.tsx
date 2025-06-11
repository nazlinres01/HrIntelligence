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
  XCircle
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
  companySize: z.string()
    .min(1, "Şirket büyüklüğünü seçin"),
  position: z.string()
    .min(2, "Pozisyon en az 2 karakter olmalı"),
  password: passwordSchema,
  confirmPassword: z.string(),
  acceptTerms: z.boolean()
    .refine(val => val === true, "Kullanım şartlarını kabul etmelisiniz"),
  acceptPrivacy: z.boolean()
    .refine(val => val === true, "Gizlilik politikasını kabul etmelisiniz"),
  honeypot: z.string().max(0, "Güvenlik ihlali tespit edildi"),
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
      companySize: "",
      position: "",
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
        description: error.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6 py-8 max-w-2xl">
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
            Hesap oluşturun
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-light">
            İK yönetim sisteminizi kurmaya başlayın
          </p>
        </div>

        {/* Register Form - Microsoft Style */}
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

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900 dark:text-slate-100 font-medium">
                        Ad
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Adınız" 
                          {...field}
                          className="border-slate-300 dark:border-slate-600 h-14 text-lg"
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
                      <FormLabel className="text-slate-900 dark:text-slate-100 font-medium">
                        Soyad
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Soyadınız" 
                          {...field}
                          className="border-slate-300 dark:border-slate-600 h-14 text-lg"
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
                    <FormLabel className="text-slate-900 dark:text-slate-100 font-medium">
                      E-posta
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="ornek@sirket.com" 
                        {...field}
                        className="border-slate-300 dark:border-slate-600 h-14 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 dark:text-slate-100 font-medium">
                      Şirket Adı
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Şirket adınız" 
                        {...field}
                        className="border-slate-300 dark:border-slate-600 h-14 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companySize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900 dark:text-slate-100 font-medium">
                        Şirket Büyüklüğü
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 text-lg">
                            <SelectValue placeholder="Seçin" />
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
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900 dark:text-slate-100 font-medium">
                        Pozisyon
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="İK Müdürü" 
                          {...field}
                          className="border-slate-300 dark:border-slate-600 h-14 text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 dark:text-slate-100 font-medium">
                      Şifre
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Güçlü bir şifre oluşturun"
                          {...field}
                          className="border-slate-300 dark:border-slate-600 h-14 text-lg pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-600 dark:text-slate-400">Şifre gücü</span>
                          <span className="text-slate-600 dark:text-slate-400">{passwordStrength}%</span>
                        </div>
                        <Progress value={passwordStrength} className="h-1" />
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
                    <FormLabel className="text-slate-900 dark:text-slate-100 font-medium">
                      Şifre Tekrarı
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Şifrenizi tekrar girin"
                          {...field}
                          className="border-slate-300 dark:border-slate-600 h-14 text-lg pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
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
                        <FormLabel className="text-sm text-slate-700 dark:text-slate-300">
                          <Link href="/terms" className="hover:underline">Kullanım Şartları</Link>'nı kabul ediyorum
                        </FormLabel>
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
                        <FormLabel className="text-sm text-slate-700 dark:text-slate-300">
                          <Link href="/privacy" className="hover:underline">Gizlilik Politikası</Link>'nı kabul ediyorum
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-14 font-medium text-lg"
              >
                {registerMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Hesap oluşturuluyor...
                  </div>
                ) : (
                  "Hesap oluştur"
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center mt-8">
                <p className="text-slate-600 dark:text-slate-400">
                  Zaten hesabınız var mı?{" "}
                  <Link href="/login" className="text-slate-900 dark:text-slate-100 hover:underline font-medium">
                    Giriş yapın
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