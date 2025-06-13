import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Settings,
  Edit,
  Trash2,
  Plus,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  BarChart3,
  Shield,
  FileText,
  Database,
  Search
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const companySchema = z.object({
  name: z.string().min(2, "Şirket adı en az 2 karakter olmalıdır"),
  industry: z.string().min(1, "Sektör seçimi gereklidir"),
  address: z.string().min(5, "Adres en az 5 karakter olmalıdır"),
  phone: z.string().min(10, "Telefon numarası geçerli olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  website: z.string().url("Geçerli bir website URL'si girin").optional().or(z.literal("")),
  description: z.string().optional(),
  taxNumber: z.string().min(10, "Vergi numarası en az 10 karakter olmalıdır"),
  foundedYear: z.string().min(4, "Kuruluş yılı geçerli olmalıdır")
});

type CompanyFormData = z.infer<typeof companySchema>;

export default function CompanyManagement() {
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      industry: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      description: "",
      taxNumber: "",
      foundedYear: ""
    }
  });

  const { data: companies, isLoading } = useQuery({
    queryKey: ["/api/companies"],
  });

  const { data: companyStats } = useQuery({
    queryKey: ["/api/stats/companies"],
  });

  const createCompanyMutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      return apiRequest("POST", "/api/companies", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Başarılı",
        description: "Şirket başarıyla oluşturuldu.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Şirket oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CompanyFormData> }) => {
      return apiRequest("PATCH", `/api/companies/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Başarılı",
        description: "Şirket bilgileri güncellendi.",
      });
      setIsEditMode(false);
      setSelectedCompany(null);
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Şirket güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/companies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Başarılı",
        description: "Şirket başarıyla silindi.",
      });
      setSelectedCompany(null);
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Şirket silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CompanyFormData) => {
    if (isEditMode && selectedCompany) {
      updateCompanyMutation.mutate({ id: selectedCompany.id, data });
    } else {
      createCompanyMutation.mutate(data);
    }
  };

  const handleEdit = (company: any) => {
    setSelectedCompany(company);
    setIsEditMode(true);
    form.reset({
      name: company.name,
      industry: company.industry,
      address: company.address,
      phone: company.phone,
      email: company.email,
      website: company.website || "",
      description: company.description || "",
      taxNumber: company.taxNumber,
      foundedYear: company.foundedYear?.toString()
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-100 text-emerald-800">Aktif</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Pasif</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Askıya Alınmış</Badge>;
      default:
        return <Badge>Bilinmeyen</Badge>;
    }
  };

  // Filter companies based on search and filters
  const filteredCompanies = (companies as any[])?.filter(company => {
    const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || company.status === statusFilter;
    const matchesIndustry = industryFilter === "all" || company.industry === industryFilter;
    return matchesSearch && matchesStatus && matchesIndustry;
  }) || [];

  const industries = [
    "Teknoloji",
    "Finans", 
    "Sağlık",
    "Eğitim",
    "İmalat",
    "Perakende",
    "İnşaat",
    "Lojistik",
    "Enerji",
    "Medya",
    "Danışmanlık",
    "Diğer"
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Şirket Yönetimi</h2>
            <p className="text-gray-600">Sistem içindeki tüm şirketleri yönetin</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setIsEditMode(false);
                  setSelectedCompany(null);
                  form.reset();
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Şirket Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Şirket Bilgilerini Düzenle" : "Yeni Şirket Ekle"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode ? "Şirket bilgilerini güncelleyin" : "Sisteme yeni bir şirket ekleyin"}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Şirket Adı</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Örn: ABC Teknoloji A.Ş." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sektör</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sektör seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                          <Textarea {...field} placeholder="Şirket adresi" rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+90 212 555 0000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="info@company.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://www.company.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="taxNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vergi Numarası</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="1234567890" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="foundedYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kuruluş Yılı</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="2020" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Açıklama</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Şirket hakkında açıklama" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit"
                      disabled={createCompanyMutation.isPending || updateCompanyMutation.isPending}
                    >
                      {isEditMode ? "Güncelle" : "Şirket Ekle"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        form.reset();
                        setIsEditMode(false);
                        setSelectedCompany(null);
                      }}
                    >
                      İptal
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Şirket</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Array.isArray(companies) ? companies.length : 0}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Şirket</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Array.isArray(companies) ? companies.filter((c: any) => c.status === 'active').length : 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Çalışan</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {companyStats?.totalEmployees || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aylık Büyüme</p>
                  <p className="text-3xl font-bold text-gray-900">+12%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Şirket adı, sektör veya e-posta ile ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Durum filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                  <SelectItem value="suspended">Askıya Alınmış</SelectItem>
                </SelectContent>
              </Select>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sektör filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Sektörler</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Companies Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Şirket Listesi ({filteredCompanies.length})
            </CardTitle>
            <CardDescription>
              Sistemdeki tüm şirketleri görüntüleyin ve yönetin
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCompanies.map((company: any) => (
                  <div key={company.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                          {getStatusBadge(company.status || 'active')}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{company.industry}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{company.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{company.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{company.employeeCount || 0} çalışan</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() => setSelectedCompany(company)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() => handleEdit(company)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() => deleteCompanyMutation.mutate(company.id)}
                          disabled={deleteCompanyMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}