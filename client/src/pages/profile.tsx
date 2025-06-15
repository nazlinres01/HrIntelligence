import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  Shield,
  Camera,
  Building,
  Clock,
  Star,
  Award
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

const profileSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Telefon numarası en az 10 karakter olmalıdır"),
  address: z.string().optional(),
  birthDate: z.string().optional(),
  emergencyContact: z.string().optional(),
  bio: z.string().optional()
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EmployeeProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const userData = user as any;
  const mockEmployeeData = {
    id: userData?.id || "employee_002",
    firstName: userData?.firstName || "Emre",
    lastName: userData?.lastName || "Şahin",
    email: userData?.email || "emre.sahin@microsoft.com",
    phone: "+90 532 123 4567",
    address: "Kadıköy, İstanbul",
    birthDate: "1990-05-15",
    emergencyContact: "+90 532 987 6543",
    bio: "Yazılım geliştirme alanında 5 yıllık deneyime sahip frontend developer",
    profileImage: "",
    position: "Senior Frontend Developer",
    department: "Yazılım Geliştirme",
    startDate: "2020-03-15",
    employeeId: "EMP-2024-002",
    manager: "Ali Özkan",
    status: "Aktif",
    workLocation: "Hibrit",
    performanceScore: 4.2,
    completedProjects: 15,
    teamRating: 4.8
  };

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: mockEmployeeData.firstName,
      lastName: mockEmployeeData.lastName,
      email: mockEmployeeData.email,
      phone: mockEmployeeData.phone,
      address: mockEmployeeData.address,
      birthDate: mockEmployeeData.birthDate,
      emergencyContact: mockEmployeeData.emergencyContact,
      bio: mockEmployeeData.bio
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return apiRequest("PUT", "/api/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      setIsEditing(false);
      toast({
        title: "Başarılı",
        description: "Profil bilgileriniz güncellendi",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const userInitials = `${mockEmployeeData.firstName[0]}${mockEmployeeData.lastName[0]}`;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profilim</h1>
          <p className="text-gray-600">Kişisel bilgilerinizi görüntüleyin ve düzenleyin</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant="lightgray"
        >
          <Edit className="w-4 h-4 mr-2" />
          {isEditing ? "İptal" : "Düzenle"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="relative mx-auto">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={mockEmployeeData.profileImage} />
                  <AvatarFallback className="text-xl bg-yellow-100 text-yellow-800">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      variant="lightgray"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Profil Fotoğrafı Güncelle</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Yeni profil fotoğrafınızı yükleyin
                      </p>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600">Fotoğraf dosyasını buraya sürükleyin veya tıklayın</p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsPhotoDialogOpen(false)}>
                          İptal
                        </Button>
                        <Button variant="lightgray">
                          Kaydet
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {mockEmployeeData.firstName} {mockEmployeeData.lastName}
                </h3>
                <p className="text-gray-600">{mockEmployeeData.position}</p>
                <p className="text-sm text-gray-500">{mockEmployeeData.department}</p>
                <Badge className="mt-2 bg-green-100 text-green-800">
                  {mockEmployeeData.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Personel No:</span>
                  <span className="font-medium">{mockEmployeeData.employeeId}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Yönetici:</span>
                  <span className="font-medium">{mockEmployeeData.manager}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">İşe Başlama:</span>
                  <span className="font-medium">{mockEmployeeData.startDate}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Çalışma Şekli:</span>
                  <span className="font-medium">{mockEmployeeData.workLocation}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Performans Özeti</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold text-lg">{mockEmployeeData.performanceScore}</span>
                    </div>
                    <p className="text-xs text-gray-600">Performans</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-lg">{mockEmployeeData.completedProjects}</span>
                    </div>
                    <p className="text-xs text-gray-600">Tamamlanan Proje</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Kişisel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ad</FormLabel>
                            <FormControl>
                              <Input placeholder="Adınız" {...field} />
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
                            <FormLabel>Soyad</FormLabel>
                            <FormControl>
                              <Input placeholder="Soyadınız" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-posta</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="E-posta adresiniz" {...field} />
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
                            <FormLabel>Telefon</FormLabel>
                            <FormControl>
                              <Input placeholder="Telefon numaranız" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adres</FormLabel>
                          <FormControl>
                            <Input placeholder="Adresiniz" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Doğum Tarihi</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emergencyContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Acil Durum İletişim</FormLabel>
                            <FormControl>
                              <Input placeholder="Acil durum telefonu" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hakkımda</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Kendiniz hakkında kısa bilgi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        İptal
                      </Button>
                      <Button type="submit" variant="lightgray">
                        <Save className="w-4 h-4 mr-2" />
                        Kaydet
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ad</label>
                        <p className="text-gray-900">{mockEmployeeData.firstName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">E-posta</label>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-900">{mockEmployeeData.email}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Doğum Tarihi</label>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-900">{mockEmployeeData.birthDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Soyad</label>
                        <p className="text-gray-900">{mockEmployeeData.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Telefon</label>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-900">{mockEmployeeData.phone}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Acil Durum İletişim</label>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-900">{mockEmployeeData.emergencyContact}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Adres</label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{mockEmployeeData.address}</p>
                    </div>
                  </div>

                  {mockEmployeeData.bio && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Hakkımda</label>
                      <p className="text-gray-900 mt-1">{mockEmployeeData.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}