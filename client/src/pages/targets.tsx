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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Target, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  User,
  Users
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useDepartmentManager } from "@/lib/departmentUtils";

const targetSchema = z.object({
  title: z.string().min(2, "Hedef başlığı en az 2 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  targetType: z.string().min(1, "Hedef türü seçilmelidir"),
  priority: z.string().min(1, "Öncelik seviyesi seçilmelidir"),
  assignedTo: z.string().min(1, "Sorumlu kişi seçilmelidir"),
  startDate: z.string().min(1, "Başlama tarihi belirtilmelidir"),
  endDate: z.string().min(1, "Bitiş tarihi belirtilmelidir"),
  targetValue: z.string().min(1, "Hedef değer belirtilmelidir"),
  currentValue: z.string().optional(),
  unit: z.string().min(1, "Birim belirtilmelidir"),
  category: z.string().min(1, "Kategori seçilmelidir")
});

type TargetFormData = z.infer<typeof targetSchema>;

const targetTypes = [
  { value: "individual", label: "Bireysel" },
  { value: "team", label: "Ekip" },
  { value: "department", label: "Departman" },
  { value: "company", label: "Şirket" }
];

const priorities = [
  { value: "low", label: "Düşük" },
  { value: "medium", label: "Orta" },
  { value: "high", label: "Yüksek" },
  { value: "critical", label: "Kritik" }
];

const categories = [
  { value: "sales", label: "Satış" },
  { value: "performance", label: "Performans" },
  { value: "quality", label: "Kalite" },
  { value: "productivity", label: "Verimlilik" },
  { value: "learning", label: "Öğrenme" },
  { value: "project", label: "Proje" }
];

const units = [
  { value: "number", label: "Adet" },
  { value: "percentage", label: "Yüzde (%)" },
  { value: "currency", label: "Para (₺)" },
  { value: "hours", label: "Saat" },
  { value: "days", label: "Gün" },
  { value: "points", label: "Puan" }
];

export default function Targets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { departmentId, isDepartmentManager } = useDepartmentManager();

  // Mock data - in real app, this would come from API
  const mockTargets = [
    {
      id: 1,
      title: "Q4 Satış Hedefi",
      description: "Son çeyrek satış hedefini yakalama",
      targetType: "team",
      priority: "high",
      assignedTo: "Satış Ekibi",
      startDate: "2024-10-01",
      endDate: "2024-12-31",
      targetValue: "1000000",
      currentValue: "750000",
      unit: "currency",
      category: "sales",
      status: "in_progress",
      progress: 75,
      createdBy: "dept_manager_001"
    },
    {
      id: 2,
      title: "Kod Kalitesi İyileştirme",
      description: "Code coverage oranını %90'a çıkarma",
      targetType: "department",
      priority: "medium",
      assignedTo: "Yazılım Ekibi",
      startDate: "2024-11-01",
      endDate: "2024-12-15",
      targetValue: "90",
      currentValue: "78",
      unit: "percentage",
      category: "quality",
      status: "in_progress",
      progress: 87,
      createdBy: "dept_manager_001"
    },
    {
      id: 3,
      title: "Eğitim Programı Tamamlama",
      description: "Tüm ekip üyelerinin React eğitimini tamamlaması",
      targetType: "team",
      priority: "medium",
      assignedTo: "Development Team",
      startDate: "2024-11-15",
      endDate: "2024-12-30",
      targetValue: "10",
      currentValue: "7",
      unit: "number",
      category: "learning",
      status: "in_progress",
      progress: 70,
      createdBy: "dept_manager_001"
    }
  ];

  const { data: employees = [] } = useQuery({
    queryKey: isDepartmentManager && departmentId 
      ? [`/api/employees/department/${departmentId}`] 
      : ["/api/employees"],
    enabled: !isDepartmentManager || !!departmentId
  });

  const form = useForm<TargetFormData>({
    resolver: zodResolver(targetSchema),
    defaultValues: {
      title: "",
      description: "",
      targetType: "",
      priority: "",
      assignedTo: "",
      startDate: "",
      endDate: "",
      targetValue: "",
      currentValue: "0",
      unit: "",
      category: ""
    }
  });

  const createTargetMutation = useMutation({
    mutationFn: async (data: TargetFormData) => {
      return apiRequest("POST", "/api/targets", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/targets"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Hedef başarıyla oluşturuldu",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Hedef oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: TargetFormData) => {
    createTargetMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Tamamlandı</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Devam Ediyor</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Gecikmiş</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Duraklatıldı</Badge>;
      default:
        return <Badge variant="secondary">Belirsiz</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-500 text-white">Kritik</Badge>;
      case "high":
        return <Badge className="bg-orange-500 text-white">Yüksek</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500 text-white">Orta</Badge>;
      case "low":
        return <Badge className="bg-green-500 text-white">Düşük</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 70) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const filteredTargets = mockTargets.filter(target => {
    const matchesSearch = target.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         target.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || target.targetType === filterType;
    const matchesStatus = filterStatus === "all" || target.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const overallStats = {
    totalTargets: mockTargets.length,
    completedTargets: mockTargets.filter(t => t.status === "completed").length,
    inProgressTargets: mockTargets.filter(t => t.status === "in_progress").length,
    averageProgress: Math.round(mockTargets.reduce((acc, t) => acc + t.progress, 0) / mockTargets.length)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hedef Takibi</h1>
          <p className="text-gray-600">Bireysel ve ekip hedeflerini yönetin</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Hedef
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Yeni Hedef Oluştur</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hedef Başlığı</FormLabel>
                        <FormControl>
                          <Input placeholder="Hedef başlığını giriniz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Kategori seçiniz" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Hedef açıklaması" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="targetType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hedef Türü</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Hedef türü seçiniz" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {targetTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Öncelik</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Öncelik seçiniz" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priorities.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value}>
                                {priority.label}
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
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sorumlu</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sorumlu kişi/ekip seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(employees as any[]).map((employee) => (
                            <SelectItem key={employee.id} value={`${employee.firstName} ${employee.lastName}`}>
                              {employee.firstName} {employee.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Başlama Tarihi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bitiş Tarihi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="targetValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hedef Değer</FormLabel>
                        <FormControl>
                          <Input placeholder="Hedef değer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mevcut Değer</FormLabel>
                        <FormControl>
                          <Input placeholder="Mevcut değer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birim</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Birim seçiniz" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {units.map((unit) => (
                              <SelectItem key={unit.value} value={unit.value}>
                                {unit.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Hedef Oluştur
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Toplam Hedef
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{overallStats.totalTargets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Tamamlanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallStats.completedTargets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Devam Eden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{overallStats.inProgressTargets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Ortalama İlerleme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{overallStats.averageProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Hedef ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tür filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                {targetTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Durum filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="in_progress">Devam Ediyor</SelectItem>
                <SelectItem value="completed">Tamamlandı</SelectItem>
                <SelectItem value="overdue">Gecikmiş</SelectItem>
                <SelectItem value="paused">Duraklatıldı</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Targets List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTargets.map((target) => (
          <Card key={target.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{target.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{target.description}</p>
                </div>
                <div className="flex gap-2">
                  {getPriorityBadge(target.priority)}
                  {getStatusBadge(target.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Tür:</span>
                  <span className="ml-2 font-medium">
                    {targetTypes.find(t => t.value === target.targetType)?.label}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Kategori:</span>
                  <span className="ml-2 font-medium">
                    {categories.find(c => c.value === target.category)?.label}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Sorumlu:</span>
                  <span className="ml-2 font-medium">{target.assignedTo}</span>
                </div>
                <div>
                  <span className="text-gray-500">Bitiş:</span>
                  <span className="ml-2 font-medium">{target.endDate}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>İlerleme</span>
                  <span className="font-medium">{target.progress}%</span>
                </div>
                <Progress value={target.progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    Mevcut: {target.currentValue} {units.find(u => u.value === target.unit)?.label}
                  </span>
                  <span>
                    Hedef: {target.targetValue} {units.find(u => u.value === target.unit)?.label}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline">
                  Düzenle
                </Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Güncelle
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTargets.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Hedef bulunamadı</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== "all" || filterStatus !== "all"
                ? "Arama kriterlerinize uygun hedef bulunamadı"
                : "Henüz hiç hedef oluşturulmamış"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}