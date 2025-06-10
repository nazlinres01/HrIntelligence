import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { roleLabels, type UserRole } from "@/lib/permissions";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { User, Settings, Lock, Calendar, Building2 } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: (user as any)?.firstName || "",
    lastName: (user as any)?.lastName || "",
    phone: (user as any)?.phone || "",
  });

  const userRole = (user as any)?.role as UserRole || "employee";

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("PUT", "/api/profile", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profil güncellendi",
        description: "Profil bilgileriniz başarıyla güncellendi.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (!user) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 ring-4 ring-white/20">
              <AvatarImage src={(user as any).profileImageUrl} />
              <AvatarFallback className="text-2xl bg-white/20">
                {(user as any).firstName?.[0]}{(user as any).lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                {(user as any).firstName} {(user as any).lastName}
              </h1>
              <p className="text-blue-100">{(user as any).email}</p>
              <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                {roleLabels[userRole]}
              </Badge>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Settings className="h-4 w-4 mr-2" />
            {isEditing ? "İptal" : "Düzenle"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Kişisel Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Ad</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Soyad</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+90 555 123 4567"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      type="submit" 
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Ad</Label>
                      <p className="text-sm font-medium">{(user as any).firstName || "Belirtilmemiş"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Soyad</Label>
                      <p className="text-sm font-medium">{(user as any).lastName || "Belirtilmemiş"}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">E-posta</Label>
                    <p className="text-sm font-medium">{(user as any).email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Telefon</Label>
                    <p className="text-sm font-medium">{(user as any).phone || "Belirtilmemiş"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Hesap Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Rol</Label>
                <p className="text-sm font-medium">{roleLabels[userRole]}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Durum</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Aktif</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Kayıt Tarihi</Label>
                <p className="text-sm font-medium">
                  {new Date((user as any).createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Güvenlik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                Şifre Değiştir
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}