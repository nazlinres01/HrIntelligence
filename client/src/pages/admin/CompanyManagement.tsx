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
import { Building2, Plus, Edit, Trash2, Users, MapPin, Globe, Phone, Download, Search, Filter, Target } from "lucide-react";
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
    size: "",
    website: "",
    taxNumber: "",
    address: "",
    city: "",
    phone: "",
    email: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["/api/companies"],
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"],
  });

  const createCompanyMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/companies", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "Şirket başarıyla oluşturuldu.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/companies/${editingCompany.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "Şirket başarıyla güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/companies/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Başarılı",
        description: "Şirket başarıyla silindi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      industry: "",
      size: "",
      website: "",
      taxNumber: "",
      address: "",
      city: "",
      phone: "",
      email: ""
    });
    setEditingCompany(null);
  };

  const handleEdit = (company: any) => {
    setEditingCompany(company);
    const contactInfo = company.contactInfo || {};
    const address = company.address || {};
    
    setFormData({
      name: company.name || "",
      description: company.description || "",
      industry: company.industry || "",
      size: company.size || "",
      website: company.website || "",
      taxNumber: company.taxNumber || "",
      address: address.street || "",
      city: address.city || "",
      phone: contactInfo.phone || "",
      email: contactInfo.email || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bu şirketi silmek istediğinizden emin misiniz?")) {
      deleteCompanyMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const companyData = {
      name: formData.name,
      description: formData.description,
      industry: formData.industry,
      size: formData.size,
      website: formData.website,
      taxNumber: formData.taxNumber,
      address: {
        street: formData.address,
        city: formData.city
      },
      contactInfo: {
        phone: formData.phone,
        email: formData.email
      }
    };

    if (editingCompany) {
      updateCompanyMutation.mutate(companyData);
    } else {
      createCompanyMutation.mutate(companyData);
    }
  };

  const getEmployeeCount = (companyId: number) => {
    return Array.isArray(employees) ? employees.filter((e: any) => e.companyId === companyId).length : 0;
  };

  const getDepartmentCount = (companyId: number) => {
    return Array.isArray(departments) ? departments.filter((d: any) => d.companyId === companyId).length : 0;
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case "Büyük":
        return "bg-green-100 text-green-800";
      case "Orta":
        return "bg-blue-100 text-blue-800";
      case "Küçük":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter companies based on search, industry, and size
  const filteredCompanies = Array.isArray(companies) ? companies.filter((company: any) => {
    const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === "all" || company.industry === selectedIndustry;
    const matchesSize = selectedSize === "all" || company.size === selectedSize;
    return matchesSearch && matchesIndustry && matchesSize;
  }) : [];

  const industries = Array.from(new Set(
    Array.isArray(companies) ? companies.map((c: any) => c.industry).filter(Boolean) : []
  ));

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
    <div className="flex-1 space-y-8 p-8 pt-6 bg-gray-50 dark:bg-gray-900">
      {/* Microsoft Fluent Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Şirket Yönetimi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Şirket bilgilerini yönetin, organizasyon yapısını düzenleyin ve iş ortaklıklarını takip edin
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
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {Array.isArray(companies) ? companies.length : 0}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Toplam Şirket
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {Array.isArray(employees) ? employees.length : 0}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Toplam Çalışan
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-4">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {Array.isArray(departments) ? departments.length : 0}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Toplam Departman
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-4">
              <Globe className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {industries.length}
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Farklı Sektör
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Şirket ara..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sektör filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Sektörler</SelectItem>
              {industries.map((industry: string) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger className="w-40">
              <Building2 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Boyut filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Boyutlar</SelectItem>
              <SelectItem value="Küçük">Küçük</SelectItem>
              <SelectItem value="Orta">Orta</SelectItem>
              <SelectItem value="Büyük">Büyük</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Sırala
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrele
          </Button>
        </div>
      </div>

      {/* Company Cards */}
      {filteredCompanies.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company: any) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800">
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
                  <Badge className={getSizeColor(company.size)}>
                    {company.size}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Çalışan:</span>
                    <span className="text-gray-900 dark:text-white">{getEmployeeCount(company.id)} kişi</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Departman:</span>
                    <span className="text-gray-900 dark:text-white">{getDepartmentCount(company.id)} adet</span>
                  </div>
                  {company.address?.city && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{company.address.city}</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {company.contactInfo?.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{company.contactInfo.phone}</span>
                    </div>
                  )}
                  {company.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {company.description}
                    </p>
                  )}
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(company)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(company.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
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

      {/* Dialog for Creating/Editing Company */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
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
                <Label htmlFor="taxNumber">Vergi Numarası</Label>
                <Input
                  id="taxNumber"
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({...formData, taxNumber: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Şirket hakkında kısa açıklama..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="industry">Sektör</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sektör seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Teknoloji">Teknoloji</SelectItem>
                    <SelectItem value="Finans">Finans</SelectItem>
                    <SelectItem value="Sağlık">Sağlık</SelectItem>
                    <SelectItem value="Eğitim">Eğitim</SelectItem>
                    <SelectItem value="Perakende">Perakende</SelectItem>
                    <SelectItem value="Üretim">Üretim</SelectItem>
                    <SelectItem value="İnşaat">İnşaat</SelectItem>
                    <SelectItem value="Lojistik">Lojistik</SelectItem>
                    <SelectItem value="Turizm">Turizm</SelectItem>
                    <SelectItem value="Danışmanlık">Danışmanlık</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="size">Şirket Boyutu</Label>
                <Select value={formData.size} onValueChange={(value) => setFormData({...formData, size: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Boyut seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Küçük">Küçük (1-50)</SelectItem>
                    <SelectItem value="Orta">Orta (51-250)</SelectItem>
                    <SelectItem value="Büyük">Büyük (250+)</SelectItem>
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
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Adres</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Sokak, Mahalle, No"
                />
              </div>
              <div>
                <Label htmlFor="city">Şehir</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="İstanbul"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+90 212 000 00 00"
                />
              </div>
              <div>
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="info@company.com"
                />
              </div>
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