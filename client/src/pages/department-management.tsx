import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, TrendingUp, Plus, Search, Edit, Eye, BarChart3, Target, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const departmentSchema = z.object({
  name: z.string().min(1, "Departman adı gereklidir"),
  description: z.string().min(1, "Açıklama gereklidir"),
  managerId: z.string().min(1, "Müdür seçimi gereklidir"),
  location: z.string().min(1, "Lokasyon gereklidir"),
  budget: z.string().min(1, "Bütçe gereklidir")
});

export default function DepartmentManagementPage() {
  const form = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      description: "",
      managerId: "",
      location: "",
      budget: ""
    }
  });

  const departments = [
    {
      id: 1,
      name: "Yazılım Geliştirme",
      description: "Frontend, Backend ve Mobile uygulama geliştirme",
      manager: "Ahmet Yılmaz",
      employeeCount: 24,
      location: "İstanbul - Maslak",
      budget: "₺2.400.000",
      performance: 92,
      status: "aktif",
      projects: 8,
      avgSalary: "₺18.500",
      turnoverRate: "5.2%"
    },
    {
      id: 2,
      name: "Pazarlama",
      description: "Dijital pazarlama, marka yönetimi ve iletişim",
      manager: "Selin Kaya",
      employeeCount: 12,
      location: "İstanbul - Levent",
      budget: "₺1.200.000",
      performance: 87,
      status: "aktif",
      projects: 5,
      avgSalary: "₺15.200",
      turnoverRate: "8.1%"
    },
    {
      id: 3,
      name: "İnsan Kaynakları",
      description: "İşe alım, performans yönetimi ve çalışan deneyimi",
      manager: "Elif Çelik",
      employeeCount: 8,
      location: "İstanbul - Maslak",
      budget: "₺800.000",
      performance: 95,
      status: "aktif",
      projects: 3,
      avgSalary: "₺16.800",
      turnoverRate: "3.1%"
    },
    {
      id: 4,
      name: "Finans",
      description: "Mali işler, muhasebe ve bütçe yönetimi",
      manager: "Mehmet Özkan",
      employeeCount: 6,
      location: "İstanbul - Levent",
      budget: "₺600.000",
      performance: 89,
      status: "aktif",
      projects: 2,
      avgSalary: "₺19.200",
      turnoverRate: "4.5%"
    },
    {
      id: 5,
      name: "Satış",
      description: "B2B satış, müşteri ilişkileri ve iş geliştirme",
      manager: "Ayşe Demir",
      employeeCount: 15,
      location: "İstanbul - Şişli",
      budget: "₺1.500.000",
      performance: 85,
      status: "aktif",
      projects: 12,
      avgSalary: "₺17.300",
      turnoverRate: "12.8%"
    }
  ];

  const departmentStats = [
    {
      title: "Toplam Departman",
      value: "8",
      trend: "+2 bu yıl",
      icon: Building2,
      color: "text-teal-600"
    },
    {
      title: "Toplam Çalışan",
      value: "127",
      trend: "+18 bu ay",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Ortalama Performans",
      value: "89.2%",
      trend: "+3.1% bu çeyrek",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Toplam Bütçe",
      value: "₺8.2M",
      trend: "+12% bu yıl",
      icon: BarChart3,
      color: "text-purple-600"
    }
  ];

  const onSubmit = (values: z.infer<typeof departmentSchema>) => {
    console.log(values);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'aktif':
        return <Badge className="bg-green-100 text-green-800 border-green-200">🟢 Aktif</Badge>;
      case 'pasif':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">⚫ Pasif</Badge>;
      case 'yeniden_yapilandirildi':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">🔄 Yeniden Yapılandırıldı</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "text-green-600";
    if (performance >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Departman Yönetimi</h1>
            <p className="text-gray-600">Organizasyon yapısı ve departman performansı yönetimi</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="lightgray" className="border-gray-300 text-gray-700 hover:bg-gray-50 mt-4 lg:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Departman
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Yeni Departman Oluştur</DialogTitle>
                <DialogDescription>
                  Organizasyona yeni departman ekleyin
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
                          <FormLabel>Departman Adı</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Departman adını girin" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="managerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departman Müdürü</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Müdür seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ahmet_yilmaz">Ahmet Yılmaz</SelectItem>
                              <SelectItem value="selin_kaya">Selin Kaya</SelectItem>
                              <SelectItem value="mehmet_ozkan">Mehmet Özkan</SelectItem>
                            </SelectContent>
                          </Select>
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
                          <Input {...field} placeholder="Departman açıklaması" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lokasyon</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ofis lokasyonu" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Yıllık Bütçe</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="₺1.000.000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="lightgray" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      İptal
                    </Button>
                    <Button type="submit" variant="lightgray" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      Departman Oluştur
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {departmentStats.map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-xs mt-1 ${stat.color}`}>{stat.trend}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Departman Listesi</TabsTrigger>
            <TabsTrigger value="structure">Organizasyon Şeması</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Departman Listesi</h2>
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Departman ara..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-6">
              {departments.map((dept) => (
                <Card key={dept.id} className="border-l-4 border-l-teal-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{dept.name}</CardTitle>
                        <CardDescription className="mt-1">{dept.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(dept.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Müdür:</span>
                        <p className="font-medium">{dept.manager}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Çalışan Sayısı:</span>
                        <p className="font-medium">{dept.employeeCount} kişi</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Lokasyon:</span>
                        <p className="font-medium">{dept.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Yıllık Bütçe:</span>
                        <p className="font-medium">{dept.budget}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Performans:</span>
                        <p className={`font-medium ${getPerformanceColor(dept.performance)}`}>
                          %{dept.performance}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Aktif Proje:</span>
                        <p className="font-medium">{dept.projects} proje</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Ortalama Maaş:</span>
                        <p className="font-medium">{dept.avgSalary}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Devir Oranı:</span>
                        <p className="font-medium">{dept.turnoverRate}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex gap-2">
                        <Button variant="lightgray" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                          <Eye className="h-4 w-4 mr-1" />
                          Detaylar
                        </Button>
                        <Button variant="lightgray" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                          <Edit className="h-4 w-4 mr-1" />
                          Düzenle
                        </Button>
                        <Button variant="lightgray" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analiz
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="structure" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Organizasyon Şeması</h2>
            
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-center mb-8">
                <div className="inline-block bg-white p-4 rounded-lg shadow-md border-2 border-teal-500">
                  <h3 className="font-semibold">Genel Müdür</h3>
                  <p className="text-sm text-gray-600">Can Özdemir</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {departments.slice(0, 3).map((dept) => (
                  <div key={dept.id} className="text-center">
                    <div className="bg-white p-4 rounded-lg shadow-md border">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-teal-600" />
                        <h4 className="font-semibold">{dept.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{dept.manager}</p>
                      <p className="text-xs text-gray-500">{dept.employeeCount} çalışan</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Departman Analitikleri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performans Karşılaştırması</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="flex items-center justify-between">
                        <span className="text-sm">{dept.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-teal-600 h-2 rounded-full" 
                              style={{ width: `${dept.performance}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">%{dept.performance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bütçe Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="flex items-center justify-between">
                        <span className="text-sm">{dept.name}</span>
                        <span className="font-medium">{dept.budget}</span>
                      </div>
                    ))}
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