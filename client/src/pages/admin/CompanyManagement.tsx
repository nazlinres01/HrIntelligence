import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Edit, Trash2, Users, MapPin, Globe, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CompanyManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    size: "medium",
    website: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Türkiye"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["/api/companies"],
  });

  const createCompanyMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/companies", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Başarılı", description: "Şirket başarıyla oluşturuldu" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Şirket oluşturulurken hata oluştu", variant: "destructive" });
    }
  });

  const updateCompanyMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/companies/${editingCompany.id}`, { method: "PUT", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      setIsDialogOpen(false);
      resetForm();
      setEditingCompany(null);
      toast({ title: "Başarılı", description: "Şirket başarıyla güncellendi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Şirket güncellenirken hata oluştu", variant: "destructive" });
    }
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/companies/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({ title: "Başarılı", description: "Şirket başarıyla silindi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Şirket silinirken hata oluştu", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      industry: "",
      size: "medium",
      website: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "Türkiye"
    });
  };

  const handleEdit = (company: any) => {
    setEditingCompany(company);
    setFormData({
      name: company.name || "",
      description: company.description || "",
      industry: company.industry || "",
      size: company.size || "medium",
      website: company.website || "",
      email: company.contactInfo?.email || "",
      phone: company.contactInfo?.phone || "",
      address: company.address?.street || "",
      city: company.address?.city || "",
      country: company.address?.country || "Türkiye"
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const companyData = {
      name: formData.name,
      description: formData.description,
      industry: formData.industry,
      size: formData.size,
      website: formData.website,
      contactInfo: {
        email: formData.email,
        phone: formData.phone
      },
      address: {
        street: formData.address,
        city: formData.city,
        country: formData.country
      }
    };

    if (editingCompany) {
      updateCompanyMutation.mutate(companyData);
    } else {
      createCompanyMutation.mutate(companyData);
    }
  };

  const getSizeLabel = (size: string) => {
    const labels = {
      startup: "Girişim",
      small: "Küçük",
      medium: "Orta",
      large: "Büyük",
      enterprise: "Kurumsal"
    };
    return labels[size as keyof typeof labels] || size;
  };

  const getSizeBadgeVariant = (size: string) => {
    const variants = {
      startup: "secondary",
      small: "outline",
      medium: "default",
      large: "secondary",
      enterprise: "default"
    };
    return variants[size as keyof typeof variants] || "default";
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Şirket Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Şirket bilgilerini yönetin ve düzenleyin</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setEditingCompany(null); resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Şirket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingCompany ? "Şirket Düzenle" : "Yeni Şirket Ekle"}</DialogTitle>
              <DialogDescription>
                Şirket bilgilerini doldurun ve kaydedin.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Şirket Adı</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Sektör</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size">Şirket Büyüklüğü</Label>
                  <Select value={formData.size} onValueChange={(value) => setFormData({...formData, size: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Girişim</SelectItem>
                      <SelectItem value="small">Küçük</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="large">Büyük</SelectItem>
                      <SelectItem value="enterprise">Kurumsal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Şehir</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Ülke</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Adres</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={2}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={createCompanyMutation.isPending || updateCompanyMutation.isPending}>
                  {editingCompany ? "Güncelle" : "Oluştur"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company: any) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <CardDescription>{company.industry}</CardDescription>
                  </div>
                </div>
                <Badge variant={getSizeBadgeVariant(company.size) as any}>
                  {getSizeLabel(company.size)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {company.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {company.description}
                  </p>
                )}
                
                <div className="space-y-2">
                  {company.contactInfo?.email && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4 mr-2" />
                      {company.contactInfo.email}
                    </div>
                  )}
                  {company.contactInfo?.phone && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4 mr-2" />
                      {company.contactInfo.phone}
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Globe className="h-4 w-4 mr-2" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">
                        Website
                      </a>
                    </div>
                  )}
                  {company.address?.city && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {company.address.city}, {company.address.country}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-1" />
                    {company.employeeCount || 0} çalışan
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(company)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deleteCompanyMutation.mutate(company.id)}
                      disabled={deleteCompanyMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {companies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Henüz şirket yok</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">İlk şirketinizi ekleyerek başlayın</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Şirket Ekle
          </Button>
        </div>
      )}
    </div>
  );
}