import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  BarChart3,
  User,
  Edit,
  Trash2,
  Eye,
  FileText,
  MessageSquare
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useDepartmentManager } from "@/lib/departmentUtils";

const projectSchema = z.object({
  name: z.string().min(2, "Proje adı en az 2 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  priority: z.string().min(1, "Öncelik seviyesi seçilmelidir"),
  status: z.string().min(1, "Proje durumu seçilmelidir"),
  projectManager: z.string().min(1, "Proje yöneticisi seçilmelidir"),
  startDate: z.string().min(1, "Başlama tarihi belirtilmelidir"),
  endDate: z.string().min(1, "Bitiş tarihi belirtilmelidir"),
  budget: z.string().optional(),
  client: z.string().optional(),
  category: z.string().min(1, "Kategori seçilmelidir"),
  teamMembers: z.array(z.string()).optional()
});

type ProjectFormData = z.infer<typeof projectSchema>;

const priorities = [
  { value: "low", label: "Düşük", color: "bg-green-500" },
  { value: "medium", label: "Orta", color: "bg-yellow-500" },
  { value: "high", label: "Yüksek", color: "bg-orange-500" },
  { value: "critical", label: "Kritik", color: "bg-red-500" }
];

const statuses = [
  { value: "planning", label: "Planlama", color: "bg-gray-500" },
  { value: "active", label: "Aktif", color: "bg-blue-500" },
  { value: "on_hold", label: "Beklemede", color: "bg-yellow-500" },
  { value: "completed", label: "Tamamlandı", color: "bg-green-500" },
  { value: "cancelled", label: "İptal Edildi", color: "bg-red-500" }
];

const categories = [
  { value: "software", label: "Yazılım Geliştirme" },
  { value: "design", label: "Tasarım" },
  { value: "marketing", label: "Pazarlama" },
  { value: "research", label: "Araştırma" },
  { value: "infrastructure", label: "Altyapı" },
  { value: "training", label: "Eğitim" }
];

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { departmentId, isDepartmentManager } = useDepartmentManager();

  // Mock data for demonstration
  const mockProjects = [
    {
      id: 1,
      name: "E-Ticaret Platform Geliştirme",
      description: "Kurumsal e-ticaret platformu geliştirme projesi",
      priority: "high",
      status: "active",
      projectManager: "Ali Özkan",
      startDate: "2024-10-01",
      endDate: "2024-12-31",
      budget: "500000",
      client: "ABC Şirketi",
      category: "software",
      progress: 65,
      teamMembers: ["Ahmet Yılmaz", "Ayşe Demir", "Mehmet Kaya"],
      tasksTotal: 45,
      tasksCompleted: 29,
      createdBy: "dept_manager_001",
      lastUpdate: "2024-11-20"
    },
    {
      id: 2,
      name: "Mobil Uygulama Tasarımı",
      description: "iOS ve Android platformları için mobil uygulama UI/UX tasarımı",
      priority: "medium",
      status: "planning",
      projectManager: "Fatma Şahin",
      startDate: "2024-11-15",
      endDate: "2024-12-20",
      budget: "150000",
      client: "XYZ Teknoloji",
      category: "design",
      progress: 20,
      teamMembers: ["Zeynep Ak", "Can Özdemir"],
      tasksTotal: 25,
      tasksCompleted: 5,
      createdBy: "dept_manager_001",
      lastUpdate: "2024-11-18"
    },
    {
      id: 3,
      name: "Sistem Altyapı Güncellemesi",
      description: "Sunucu altyapısı ve güvenlik güncellemeleri",
      priority: "critical",
      status: "active",
      projectManager: "Emre Yıldız",
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      budget: "200000",
      client: "İç Proje",
      category: "infrastructure",
      progress: 80,
      teamMembers: ["Murat Çelik", "Seda Kara"],
      tasksTotal: 20,
      tasksCompleted: 16,
      createdBy: "dept_manager_001",
      lastUpdate: "2024-11-19"
    }
  ];

  const { data: employees = [] } = useQuery({
    queryKey: isDepartmentManager && departmentId 
      ? [`/api/employees/department/${departmentId}`] 
      : ["/api/employees"],
    enabled: !isDepartmentManager || !!departmentId
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: "",
      status: "planning",
      projectManager: "",
      startDate: "",
      endDate: "",
      budget: "",
      client: "",
      category: "",
      teamMembers: []
    }
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      return apiRequest("POST", "/api/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Proje başarıyla oluşturuldu",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Proje oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ProjectFormData) => {
    createProjectMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    if (!statusObj) return <Badge variant="secondary">Belirsiz</Badge>;
    
    return (
      <Badge className={`text-white ${statusObj.color}`}>
        {statusObj.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    if (!priorityObj) return <Badge variant="secondary">-</Badge>;
    
    return (
      <Badge className={`text-white ${priorityObj.color}`}>
        {priorityObj.label}
      </Badge>
    );
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 70) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    const matchesPriority = filterPriority === "all" || project.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const projectStats = {
    totalProjects: mockProjects.length,
    activeProjects: mockProjects.filter(p => p.status === "active").length,
    completedProjects: mockProjects.filter(p => p.status === "completed").length,
    averageProgress: Math.round(mockProjects.reduce((acc, p) => acc + p.progress, 0) / mockProjects.length)
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Proje Koordinasyonu</h1>
            <p className="text-gray-600">Departman projelerini yönetin ve koordine edin</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Proje Listesi</h2>
              <p className="text-gray-600">Proje süreçlerini takip edin ve yönetin</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Proje
                </Button>
              </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Yeni Proje Oluştur</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proje Adı</FormLabel>
                      <FormControl>
                        <Input placeholder="Proje adını giriniz" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Proje açıklaması" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="projectManager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proje Yöneticisi</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Proje yöneticisi seçiniz" />
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
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Müşteri</FormLabel>
                        <FormControl>
                          <Input placeholder="Müşteri adı" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bütçe (₺)</FormLabel>
                      <FormControl>
                        <Input placeholder="Proje bütçesi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Proje Oluştur
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
              <FolderOpen className="w-4 h-4 mr-2" />
              Toplam Proje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{projectStats.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <PlayCircle className="w-4 h-4 mr-2" />
              Aktif Proje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{projectStats.activeProjects}</div>
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
            <div className="text-2xl font-bold text-green-600">{projectStats.completedProjects}</div>
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
            <div className="text-2xl font-bold text-purple-600">{projectStats.averageProgress}%</div>
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
                  placeholder="Proje ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Durum filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Öncelik filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Öncelikler</SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                </div>
                <div className="flex gap-2">
                  {getPriorityBadge(project.priority)}
                  {getStatusBadge(project.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Yönetici:</span>
                  <span className="ml-2 font-medium">{project.projectManager}</span>
                </div>
                <div>
                  <span className="text-gray-500">Müşteri:</span>
                  <span className="ml-2 font-medium">{project.client}</span>
                </div>
                <div>
                  <span className="text-gray-500">Başlama:</span>
                  <span className="ml-2 font-medium">{project.startDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">Bitiş:</span>
                  <span className="ml-2 font-medium">{project.endDate}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>İlerleme</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Tamamlanan: {project.tasksCompleted}</span>
                  <span>Toplam: {project.tasksTotal}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <div className="flex -space-x-2">
                  {project.teamMembers.slice(0, 3).map((member, index) => (
                    <Avatar key={index} className="w-6 h-6 border-2 border-white">
                      <AvatarFallback className="text-xs">
                        {member.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.teamMembers.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-gray-600">+{project.teamMembers.length - 3}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  {project.teamMembers.length} üye
                </span>
              </div>

              {project.budget && (
                <div className="text-sm">
                  <span className="text-gray-500">Bütçe:</span>
                  <span className="ml-2 font-medium text-green-600">
                    ₺{parseInt(project.budget).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-3 h-3 mr-1" />
                  Detay
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-3 h-3 mr-1" />
                  Düzenle
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Proje bulunamadı</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                ? "Arama kriterlerinize uygun proje bulunamadı"
                : "Henüz hiç proje oluşturulmamış"}
            </p>
          </CardContent>
        </Card>
      )}
        </div>
      </div>
    </div>
  );
}