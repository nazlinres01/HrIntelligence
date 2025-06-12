import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Database, 
  Mail, 
  Smartphone,
  Key,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  bio: z.string().optional()
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mevcut şifre gerekli"),
  newPassword: z.string().min(8, "Yeni şifre en az 8 karakter olmalı"),
  confirmPassword: z.string().min(1, "Şifre onayı gerekli")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"]
});

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  weeklyReports: z.boolean(),
  monthlyReports: z.boolean(),
  systemAlerts: z.boolean(),
  marketingEmails: z.boolean()
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type NotificationFormData = z.infer<typeof notificationSchema>;

export default function Settings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: (user as any)?.firstName || "",
      lastName: (user as any)?.lastName || "",
      email: (user as any)?.email || "",
      phone: (user as any)?.phone || "",
      department: (user as any)?.department || "",
      position: (user as any)?.position || "",
      bio: (user as any)?.bio || ""
    }
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const notificationForm = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      weeklyReports: true,
      monthlyReports: true,
      systemAlerts: true,
      marketingEmails: false
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await apiRequest("PATCH", "/api/auth/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profil güncellendi",
        description: "Profil bilgileriniz başarıyla kaydedildi."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Profil güncellenirken hata oluştu",
        variant: "destructive"
      });
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      const response = await apiRequest("POST", "/api/auth/change-password", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Şifre değiştirildi",
        description: "Şifreniz başarıyla güncellendi."
      });
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Şifre değiştirilirken hata oluştu",
        variant: "destructive"
      });
    }
  });

  // Update notifications mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: NotificationFormData) => {
      const response = await apiRequest("PATCH", "/api/auth/notifications", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Bildirim ayarları güncellendi",
        description: "Bildirim tercihleriniz kaydedildi."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Bildirim ayarları güncellenirken hata oluştu",
        variant: "destructive"
      });
    }
  });

  const handleProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handlePasswordSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

  const handleNotificationSubmit = (data: NotificationFormData) => {
    updateNotificationsMutation.mutate(data);
  };

  const handleExportData = () => {
    toast({
      title: "Veri dışa aktarılıyor",
      description: "Verileriniz hazırlanıyor ve e-posta adresinize gönderilecek."
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Hesap silme talebi",
      description: "Hesap silme işlemi için IT destek ekibiyle iletişime geçin.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayarlar</h1>
          <p className="text-gray-600">Hesap ayarlarınızı ve tercihlerinizi yönetin</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profil</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Güvenlik</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Bildirimler</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center space-x-2">
              <SettingsIcon className="h-4 w-4" />
              <span>Tercihler</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Veri</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Profil Bilgileri</CardTitle>
                <CardDescription className="text-gray-600">
                  Kişisel bilgilerinizi güncelleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Ad</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Soyad</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">E-posta</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} className="bg-white border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Telefon</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border-gray-300" placeholder="+90 5XX XXX XX XX" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Pozisyon</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border-gray-300" placeholder="Ör: Yazılım Geliştirici" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Biyografi</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              className="bg-white border-gray-300 min-h-[100px]"
                              placeholder="Kendiniz hakkında kısa bilgi..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateProfileMutation.isPending ? "Kaydediliyor..." : "Profili Güncelle"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Şifre Değiştir</CardTitle>
                  <CardDescription className="text-gray-600">
                    Hesap güvenliğiniz için düzenli olarak şifrenizi değiştirin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Mevcut Şifre</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showCurrentPassword ? "text" : "password"}
                                  {...field}
                                  className="bg-white border-gray-300 pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                  {showCurrentPassword ? (
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

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Yeni Şifre</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showNewPassword ? "text" : "password"}
                                  {...field}
                                  className="bg-white border-gray-300 pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                  {showNewPassword ? (
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

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Yeni Şifre Onayı</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  {...field}
                                  className="bg-white border-gray-300 pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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

                      <Button
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        {changePasswordMutation.isPending ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Güvenlik Ayarları</CardTitle>
                  <CardDescription className="text-gray-600">
                    Hesap güvenliği ve giriş ayarları
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">İki Faktörlü Doğrulama</h4>
                      <p className="text-sm text-gray-600">Ekstra güvenlik katmanı ekleyin</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Oturum Bildirimleri</h4>
                      <p className="text-sm text-gray-600">Yeni oturum açıldığında bildirim al</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Bildirim Tercihleri</CardTitle>
                <CardDescription className="text-gray-600">
                  Hangi bildirimleri almak istediğinizi seçin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(handleNotificationSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Bildirim Kanalları</h3>
                        <div className="space-y-4">
                          <FormField
                            control={notificationForm.control}
                            name="emailNotifications"
                            render={({ field }) => (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Mail className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">E-posta Bildirimleri</h4>
                                    <p className="text-sm text-gray-600">Önemli güncellemeler için e-posta al</p>
                                  </div>
                                </div>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </div>
                            )}
                          />

                          <FormField
                            control={notificationForm.control}
                            name="pushNotifications"
                            render={({ field }) => (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Bell className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">Push Bildirimleri</h4>
                                    <p className="text-sm text-gray-600">Anlık bildirimler al</p>
                                  </div>
                                </div>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </div>
                            )}
                          />

                          <FormField
                            control={notificationForm.control}
                            name="smsNotifications"
                            render={({ field }) => (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Smartphone className="h-5 w-5 text-gray-400" />
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">SMS Bildirimleri</h4>
                                    <p className="text-sm text-gray-600">Acil durumlar için SMS al</p>
                                  </div>
                                </div>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </div>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Rapor Tercihleri</h3>
                        <div className="space-y-4">
                          <FormField
                            control={notificationForm.control}
                            name="weeklyReports"
                            render={({ field }) => (
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">Haftalık Raporlar</h4>
                                  <p className="text-sm text-gray-600">Haftalık özet raporları al</p>
                                </div>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </div>
                            )}
                          />

                          <FormField
                            control={notificationForm.control}
                            name="monthlyReports"
                            render={({ field }) => (
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">Aylık Raporlar</h4>
                                  <p className="text-sm text-gray-600">Aylık detaylı raporları al</p>
                                </div>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </div>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Diğer</h3>
                        <div className="space-y-4">
                          <FormField
                            control={notificationForm.control}
                            name="systemAlerts"
                            render={({ field }) => (
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">Sistem Uyarıları</h4>
                                  <p className="text-sm text-gray-600">Sistem bakım ve güncellemeleri</p>
                                </div>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </div>
                            )}
                          />

                          <FormField
                            control={notificationForm.control}
                            name="marketingEmails"
                            render={({ field }) => (
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">Pazarlama E-postaları</h4>
                                  <p className="text-sm text-gray-600">Ürün güncellemeleri ve öneriler</p>
                                </div>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={updateNotificationsMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateNotificationsMutation.isPending ? "Kaydediliyor..." : "Tercihleri Kaydet"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Uygulama Tercihleri</CardTitle>
                <CardDescription className="text-gray-600">
                  Kişiselleştirilmiş deneyim için tercihlerinizi ayarlayın
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Dil</h4>
                        <p className="text-sm text-gray-600">Uygulama dilini seçin</p>
                      </div>
                    </div>
                    <Select defaultValue="tr">
                      <SelectTrigger className="w-32 bg-white border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="tr">Türkçe</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Otomatik Kaydet</h4>
                      <p className="text-sm text-gray-600">Formları otomatik olarak kaydet</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Detaylı Görünüm</h4>
                      <p className="text-sm text-gray-600">Listelerde daha fazla bilgi göster</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Koyu Tema</h4>
                      <p className="text-sm text-gray-600">Gece görüşü için koyu tema kullan</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data">
            <div className="space-y-6">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Veri Yönetimi</CardTitle>
                  <CardDescription className="text-gray-600">
                    Verilerinizi yönetin ve kontrol edin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Download className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Veri Dışa Aktarma</h4>
                        <p className="text-sm text-gray-600">Tüm verilerinizi JSON formatında indirin</p>
                      </div>
                    </div>
                    <Button onClick={handleExportData} variant="outline" className="border-gray-300">
                      <Download className="h-4 w-4 mr-2" />
                      Dışa Aktar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <RefreshCw className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Önbellek Temizle</h4>
                        <p className="text-sm text-gray-600">Uygulama önbelleğini temizleyin</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-gray-300">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Temizle
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-red-100 border-2">
                <CardHeader>
                  <CardTitle className="text-red-900">Tehlikeli Bölge</CardTitle>
                  <CardDescription className="text-red-600">
                    Bu işlemler geri alınamaz. Dikkatli olun.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center space-x-3">
                      <Trash2 className="h-5 w-5 text-red-600" />
                      <div>
                        <h4 className="text-sm font-medium text-red-900">Hesabı Sil</h4>
                        <p className="text-sm text-red-600">Hesabınızı ve tüm verilerinizi kalıcı olarak silin</p>
                      </div>
                    </div>
                    <Button onClick={handleDeleteAccount} variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hesabı Sil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}