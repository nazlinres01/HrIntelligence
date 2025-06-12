import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building, 
  Plus, 
  Search, 
  Download, 
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Building2,
  Factory,
  Home,
  Briefcase,
  Target,
  DollarSign
} from "lucide-react";

const companySchema = z.object({
  name: z.string().min(1, "Şirket adı belirtilmelidir"),
  type: z.string().min(1, "Şirket türü seçilmelidir"),
  industry: z.string().min(1, "Sektör belirtilmelidir"),
  taxId: z.string().min(1, "Vergi numarası belirtilmelidir"),
  address: z.string().min(1, "Adres belirtilmelidir"),
  phone: z.string().optional(),
  email: z.string().email("Geçerli bir email adresi belirtilmelidir").optional(),
  website: z.string().optional(),
  foundedYear: z.string().optional(),
  employeeCount: z.string().optional(),
  description: z.string().optional()
});

type CompanyFormData = z.infer<typeof companySchema>;

export default function CompanyStructure() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading: companiesLoading } = useQuery<any[]>({
    queryKey: ["/api/companies"]
  });

  const { data: employees = [] } = useQuery<any[]>({
    queryKey: ["/api/employees"]
  });

  const { data: departments = [] } = useQuery<any[]>({
    queryKey: ["/api/departments"]
  });

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      type: "",
      industry: "",
      taxId: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      foundedYear: "",
      employeeCount: "",
      description: ""
    }
  });

  const createCompanyMutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      return apiRequest("POST", "/api/companies", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      setIsCompanyDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Şirket başarıyla oluşturuldu",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Şirket oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/companies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Başarılı",
        description: "Şirket başarıyla silindi",
      });
    }
  });

  // Filter companies
  const filteredCompanies = React.useMemo(() => {
    return (companies as any[]).filter((company: any) => {
      const matchesSearch = company.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           company.industry?.toLowerCase()?.includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || company.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [companies, searchTerm, typeFilter]);

  const handleSubmit = (data: CompanyFormData) => {
    createCompanyMutation.mutate(data);
  };

  const getCompanyStats = () => {
    const totalCompanies = (companies as any[]).length;
    const totalEmployees = (employees as any[]).length;
    const totalDepartments = (departments as any[]).length;
    const avgEmployeesPerCompany = (companies as any[]).length > 0 ? Math.round((employees as any[]).length / (companies as any[]).length) : 0;
    
    return { totalCompanies, totalEmployees, totalDepartments, avgEmployeesPerCompany };
  };

  const getEmployeesByCompany = (companyId: string) => {
    return (employees as any[]).filter((emp: any) => emp.companyId === companyId);
  };

  const getDepartmentsByCompany = (companyId: string) => {
    return (departments as any[]).filter((dept: any) => dept.companyId === companyId);
  };

  const getCompanyTypeDisplayName = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'corporation': 'Anonim Şirket (A.Ş.)',
      'llc': 'Limited Şirket (Ltd.)',
      'partnership': 'Ortaklık',
      'sole_proprietorship': 'Şahıs Şirketi',
      'cooperative': 'Kooperatif',
      'foundation': 'Vakıf',
      'association': 'Dernek'
    };
    return typeMap[type] || type;
  };

  const stats = getCompanyStats();

  if (companiesLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Şirket Yapısı</h1>
            <p className="text-gray-600">Kurumsal yapı, şirket bilgileri ve organizasyon şeması</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-300 text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
            <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Şirket
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Yeni Şirket</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Şirket Adı</FormLabel>
                            <FormControl>
                              <Input placeholder="TechCorp Yazılım A.Ş." {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Şirket Türü</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Tür seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white">
                                <SelectItem value="corporation">Anonim Şirket (A.Ş.)</SelectItem>
                                <SelectItem value="llc">Limited Şirket (Ltd.)</SelectItem>
                                <SelectItem value="partnership">Ortaklık</SelectItem>
                                <SelectItem value="sole_proprietorship">Şahıs Şirketi</SelectItem>
                                <SelectItem value="cooperative">Kooperatif</SelectItem>
                                <SelectItem value="foundation">Vakıf</SelectItem>
                                <SelectItem value="association">Dernek</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Sektör</FormLabel>
                            <FormControl>
                              <Input placeholder="Bilgi Teknolojileri" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Vergi Numarası</FormLabel>
                            <FormControl>
                              <Input placeholder="1234567890" {...field} className="border-gray-300" />
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
                          <FormLabel className="text-gray-700">Adres</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Maslak Mahallesi, Bilim Sokak No:40, Sarıyer/İstanbul" 
                              {...field} 
                              className="border-gray-300 min-h-20" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Telefon</FormLabel>
                            <FormControl>
                              <Input placeholder="+90 212 123 45 67" {...field} className="border-gray-300" />
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
                            <FormLabel className="text-gray-700">E-posta</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="info@sirket.com" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Website</FormLabel>
                            <FormControl>
                              <Input placeholder="www.sirket.com" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="foundedYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Kuruluş Yılı</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="2010" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Çalışan Sayısı</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="250" {...field} className="border-gray-300" />
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
                          <FormLabel className="text-gray-700">Açıklama</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Şirket hakkında kısa açıklama..." 
                              {...field} 
                              className="border-gray-300 min-h-24" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCompanyDialogOpen(false)}
                        className="border-gray-300 text-gray-700"
                      >
                        İptal
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createCompanyMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {createCompanyMutation.isPending ? "Oluşturuluyor..." : "Şirket Oluştur"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Toplam Şirket</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalCompanies}</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Toplam Çalışan</p>
                  <p className="text-3xl font-bold text-green-900">{stats.totalEmployees}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Toplam Departman</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.totalDepartments}</p>
                </div>
                <Building2 className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Ort. Çalışan/Şirket</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.avgEmployeesPerCompany}</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Şirket ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-64 border-gray-300">
              <SelectValue placeholder="Tür filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Türler</SelectItem>
              <SelectItem value="corporation">Anonim Şirket</SelectItem>
              <SelectItem value="llc">Limited Şirket</SelectItem>
              <SelectItem value="partnership">Ortaklık</SelectItem>
              <SelectItem value="sole_proprietorship">Şahıs Şirketi</SelectItem>
              <SelectItem value="cooperative">Kooperatif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company: any) => {
            const companyEmployees = getEmployeesByCompany(company.id);
            const companyDepartments = getDepartmentsByCompany(company.id);
            
            return (
              <Card key={company.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900">{company.name}</CardTitle>
                        <Badge className="bg-gray-100 text-gray-800 mt-1">
                          {getCompanyTypeDisplayName(company.type)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => deleteCompanyMutation.mutate(company.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Factory className="h-4 w-4" />
                      <span>{company.industry}</span>
                    </div>
                    
                    {company.address && (
                      <div className="flex items-start space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <span className="line-clamp-2">{company.address}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{companyEmployees.length} çalışan</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Building2 className="h-4 w-4" />
                        <span>{companyDepartments.length} departman</span>
                      </div>
                    </div>

                    {company.foundedYear && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{company.foundedYear} yılında kuruldu</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 pt-2">
                      {company.phone && (
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50 p-1">
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                      {company.email && (
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50 p-1">
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      {company.website && (
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50 p-1">
                          <Globe className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCompanies.length === 0 && (
          <Card className="bg-white border-gray-200">
            <CardContent className="text-center py-12">
              <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Şirket bulunamadı</h3>
              <p className="text-gray-600">
                {searchTerm || typeFilter !== "all"
                  ? "Arama kriterlerinize uygun şirket bulunamadı."
                  : "Henüz hiç şirket oluşturulmamış. İlk şirketinizi oluşturmak için yukarıdaki butonu kullanın."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}