import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Users, Building2, Shield } from "lucide-react";
import { useLocation } from "wouter";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function TeamLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await apiRequest("/api/login", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Giriş Başarılı",
        description: "Takım yönetimi paneline yönlendiriliyorsunuz.",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Giriş Hatası",
        description: error.message || "Giriş yapılamadı.",
        variant: "destructive",
      });
    },
  });

  const quickLoginOptions = [
    {
      id: "hr_manager_001",
      name: "Fatma Yılmaz",
      role: "İK Müdürü",
      email: "fatma.yilmaz@techcorp.com.tr",
      description: "Takım yöneticisi - tüm yetkilere sahip",
      icon: Shield,
      color: "bg-purple-100 text-purple-700 border-purple-200"
    },
    {
      id: "hr_specialist_001",
      name: "Mehmet Demir", 
      role: "İK Uzmanı",
      email: "mehmet.demir@techcorp.com.tr",
      description: "Personel işlemleri uzmanı",
      icon: Users,
      color: "bg-blue-100 text-blue-700 border-blue-200"
    },
    {
      id: "hr_specialist_002",
      name: "Ayşe Kaya",
      role: "İK Uzmanı", 
      email: "ayse.kaya@techcorp.com.tr",
      description: "Eğitim ve gelişim uzmanı",
      icon: Users,
      color: "bg-green-100 text-green-700 border-green-200"
    },
    {
      id: "admin_001",
      name: "System Admin",
      role: "Sistem Yöneticisi",
      email: "admin@techcorp.com.tr", 
      description: "Sistem yönetimi ve teknik destek",
      icon: Building2,
      color: "bg-orange-100 text-orange-700 border-orange-200"
    }
  ];

  const handleQuickLogin = (user: typeof quickLoginOptions[0]) => {
    form.setValue("email", user.email);
    form.setValue("password", "password123");
    setSelectedUser(user.id);
  };

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">TechCorp İK Takım Girişi</h1>
          <p className="text-gray-600 mt-2">
            Çoklu kullanıcı takım yönetimi sistemine hoş geldiniz
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Login Options */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Takım Üyeleri</h2>
            <p className="text-sm text-gray-600">
              Farklı rol ve yetkilere sahip takım üyelerini test edin
            </p>
            
            <div className="space-y-3">
              {quickLoginOptions.map((user) => {
                const IconComponent = user.icon;
                return (
                  <Card 
                    key={user.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedUser === user.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleQuickLogin(user)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${user.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-sm font-medium text-blue-600">{user.role}</p>
                          <p className="text-xs text-gray-500">{user.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Giriş Yap</CardTitle>
              <CardDescription>
                Hesap bilgilerinizi girin veya soldan bir takım üyesi seçin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-posta</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ornek@techcorp.com.tr" 
                            type="email" 
                            {...field} 
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
                        <FormLabel>Şifre</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="••••••••" 
                            type="password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
                  </Button>
                </form>
              </Form>

              {selectedUser && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Test için:</strong> Seçilen kullanıcı için form otomatik dolduruldu. 
                    "Giriş Yap" butonuna tıklayarak devam edin.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Takım Yönetimi Özellikleri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-yellow-700">
                <div>
                  <strong>İK Müdürü:</strong> Tüm personel verilerine erişim, takım yönetimi
                </div>
                <div>
                  <strong>İK Uzmanı:</strong> Günlük personel işlemleri, raporlama
                </div>
                <div>
                  <strong>Admin:</strong> Sistem ayarları, güvenlik yönetimi
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}