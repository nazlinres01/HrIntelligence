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
import { Separator } from "@/components/ui/separator";
import { Building2, Plus, Edit, Trash2, Users, MapPin, Globe, Phone, Mail, Search, Filter, Download, TrendingUp, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CompanyManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
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

  // Filter companies based on search and filters
  const filteredCompanies = (companies as any[]).filter((company: any) => {
    const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
    const matchesSize = !selectedSize || company.size === selectedSize;
    
    return matchesSearch && matchesIndustry && matchesSize;
  });

  // Get unique industries and sizes for filters
  const industries = Array.from(new Set((companies as any[]).map((c: any) => c.industry).filter(Boolean)));
  const sizes = Array.from(new Set((companies as any[]).map((c: any) => c.size).filter(Boolean)));

  const createCompanyMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/companies", "POST", data),
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
    mutationFn: (data: any) => apiRequest(`/api/companies/${editingCompany?.id}`, "PUT", data),
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
    mutationFn: (id: number) => apiRequest(`/api/companies/${id}`, "DELETE"),
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
    <div className="flex-1 space-y-8 p-8 pt-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Microsoft Fluent Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Şirket Yönetimi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Sisteme kayıtlı şirketleri yönetin ve organizasyon yapısını düzenleyin
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
            <Download className="mr-2 h-4 w-4" />
            Dışa Aktar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingCompany(null);
                  resetForm();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Yeni Şirket Ekle
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Şirket</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{(companies as any[]).length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Çalışan</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(companies as any[]).reduce((sum: number, company: any) => sum + (company.employeeCount || 0), 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aktif Sektör</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{industries.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-4">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kurumsal</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(companies as any[]).filter((c: any) => c.size === 'enterprise').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Şirket adı veya sektör ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sektör filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tüm Sektörler</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-48">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Büyüklük filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tüm Büyüklükler</SelectItem>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>{getSizeLabel(size)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Şirket bulunamadı
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Arama kriterlerinize uygun şirket bulunmadı. Filtrelerinizi kontrol edin veya yeni şirket ekleyin.
              </p>
              <Button onClick={() => {
                setEditingCompany(null);
                resetForm();
                setIsDialogOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                İlk Şirketi Ekle
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredCompanies.map((company: any) => (
            <Card key={company.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-white">{company.name}</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">{company.industry}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={getSizeBadgeVariant(company.size) as any} className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {getSizeLabel(company.size)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
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

                  <Separator className="bg-gray-200 dark:bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-1" />
                      {company.employeeCount || 0} çalışan
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(company)} className="border-gray-200 hover:bg-gray-50 dark:border-gray-700">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteCompanyMutation.mutate(company.id)}
                        disabled={deleteCompanyMutation.isPending}
                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Company Creation/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {editingCompany ? "Şirket Düzenle" : "Yeni Şirket Ekle"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
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
  );
}