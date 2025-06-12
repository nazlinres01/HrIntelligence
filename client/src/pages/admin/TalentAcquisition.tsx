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
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  TrendingUp,
  UserPlus,
  Briefcase,
  FileText,
  Eye,
  Edit,
  Trash2,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Target
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const jobSchema = z.object({
  title: z.string().min(1, "İş başlığı belirtilmelidir"),
  department: z.string().min(1, "Departman seçilmelidir"),
  location: z.string().min(1, "Lokasyon belirtilmelidir"),
  type: z.string().min(1, "İş türü seçilmelidir"),
  experience: z.string().min(1, "Deneyim seviyesi seçilmelidir"),
  salary: z.string().optional(),
  description: z.string().min(50, "İş açıklaması en az 50 karakter olmalıdır"),
  requirements: z.string().min(20, "Gereksinimler en az 20 karakter olmalıdır"),
  benefits: z.string().optional(),
  deadline: z.string().min(1, "Son başvuru tarihi belirtilmelidir")
});

type JobFormData = z.infer<typeof jobSchema>;

export default function TalentAcquisition() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<any[]>({
    queryKey: ["/api/jobs"]
  });

  const { data: applications = [] } = useQuery<any[]>({
    queryKey: ["/api/job-applications"]
  });

  const { data: departments = [] } = useQuery<any[]>({
    queryKey: ["/api/departments"]
  });

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "",
      experience: "",
      salary: "",
      description: "",
      requirements: "",
      benefits: "",
      deadline: ""
    }
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      return apiRequest("POST", "/api/jobs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      setIsJobDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "İş ilanı başarıyla oluşturuldu",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İş ilanı oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "Başarılı",
        description: "İş ilanı başarıyla silindi",
      });
    }
  });

  // Filter jobs
  const filteredJobs = React.useMemo(() => {
    return (jobs as any[]).filter((job: any) => {
      const matchesSearch = job.title?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           job.department?.toLowerCase()?.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [jobs, searchTerm, statusFilter, departmentFilter]);

  const handleSubmit = (data: JobFormData) => {
    createJobMutation.mutate(data);
  };

  const getJobStats = () => {
    const activeJobs = (jobs as any[]).filter((j: any) => j.status === 'active').length;
    const totalApplications = (applications as any[]).length;
    const pendingApplications = (applications as any[]).filter((a: any) => a.status === 'pending').length;
    const hiredCandidates = (applications as any[]).filter((a: any) => a.status === 'hired').length;
    
    return { activeJobs, totalApplications, pendingApplications, hiredCandidates };
  };

  const getApplicationsByJob = (jobId: string) => {
    return (applications as any[]).filter((app: any) => app.jobId === jobId);
  };

  const stats = getJobStats();

  if (jobsLoading) {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Yetenek Kazanımı</h1>
            <p className="text-gray-600">İş ilanları, başvurular ve işe alım süreçleri</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-300 text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
            <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni İş İlanı
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Yeni İş İlanı</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">İş Başlığı</FormLabel>
                            <FormControl>
                              <Input placeholder="Senior Software Developer" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Departman</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Departman seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white">
                                {(departments as any[]).map((dept: any) => (
                                  <SelectItem key={dept.id} value={dept.name}>
                                    {dept.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Lokasyon</FormLabel>
                            <FormControl>
                              <Input placeholder="İstanbul, Türkiye" {...field} className="border-gray-300" />
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
                            <FormLabel className="text-gray-700">İş Türü</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Tür seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white">
                                <SelectItem value="full-time">Tam Zamanlı</SelectItem>
                                <SelectItem value="part-time">Yarı Zamanlı</SelectItem>
                                <SelectItem value="contract">Sözleşmeli</SelectItem>
                                <SelectItem value="internship">Staj</SelectItem>
                                <SelectItem value="remote">Uzaktan</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Deneyim</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Seviye seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white">
                                <SelectItem value="entry">Giriş Seviyesi (0-2 yıl)</SelectItem>
                                <SelectItem value="mid">Orta Seviye (2-5 yıl)</SelectItem>
                                <SelectItem value="senior">Senior (5-10 yıl)</SelectItem>
                                <SelectItem value="lead">Lead/Principal (10+ yıl)</SelectItem>
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
                        name="salary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Maaş Aralığı</FormLabel>
                            <FormControl>
                              <Input placeholder="25.000 - 35.000 TL" {...field} className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Son Başvuru Tarihi</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} className="border-gray-300" />
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
                          <FormLabel className="text-gray-700">İş Açıklaması</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Bu pozisyonda..." 
                              {...field} 
                              className="border-gray-300 min-h-24" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Gereksinimler</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="• Bilgisayar Mühendisliği veya ilgili bölümden mezun..." 
                              {...field} 
                              className="border-gray-300 min-h-24" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="benefits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Yan Haklar</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="• Sağlık sigortası\n• Yemek kartı\n• Esnek çalışma saatleri..." 
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
                        onClick={() => setIsJobDialogOpen(false)}
                        className="border-gray-300 text-gray-700"
                      >
                        İptal
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createJobMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {createJobMutation.isPending ? "Oluşturuluyor..." : "İş İlanı Oluştur"}
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
                  <p className="text-blue-600 text-sm font-medium">Aktif İş İlanları</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.activeJobs}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Toplam Başvuru</p>
                  <p className="text-3xl font-bold text-green-900">{stats.totalApplications}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Bekleyen Başvuru</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.pendingApplications}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">İşe Alınan</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.hiredCandidates}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="İş ilanı ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Departman filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Departmanlar</SelectItem>
              {(departments as any[]).map((dept: any) => (
                <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Durum filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="paused">Duraklatıldı</SelectItem>
              <SelectItem value="closed">Kapatıldı</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Jobs Table */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">İş İlanları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-sm font-medium text-gray-600">İş Başlığı</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Departman</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Lokasyon</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Tür</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Başvuru</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Durum</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job: any) => {
                    const jobApplications = getApplicationsByJob(job.id);
                    return (
                      <tr key={job.id} className="border-b border-gray-100">
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-gray-900">{job.title}</p>
                            <p className="text-sm text-gray-600">{job.experience}</p>
                          </div>
                        </td>
                        <td className="py-4 text-gray-700">{job.department}</td>
                        <td className="py-4 text-gray-700">{job.location}</td>
                        <td className="py-4">
                          <Badge className="bg-gray-100 text-gray-800">
                            {job.type === 'full-time' ? 'Tam Zamanlı' :
                             job.type === 'part-time' ? 'Yarı Zamanlı' :
                             job.type === 'contract' ? 'Sözleşmeli' :
                             job.type === 'internship' ? 'Staj' : 'Uzaktan'}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Badge className="bg-blue-100 text-blue-800">
                            {jobApplications.length} başvuru
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Badge 
                            className={
                              job.status === 'active' ? 'bg-green-100 text-green-800' :
                              job.status === 'paused' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {job.status === 'active' ? 'Aktif' :
                             job.status === 'paused' ? 'Duraklatıldı' : 'Kapatıldı'}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <div className="flex space-x-2">
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
                              onClick={() => deleteJobMutation.mutate(job.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">İş ilanı bulunamadı</h3>
                <p className="text-gray-600">
                  {searchTerm || departmentFilter !== "all" || statusFilter !== "all" 
                    ? "Arama kriterlerinize uygun iş ilanı bulunamadı."
                    : "Henüz hiç iş ilanı oluşturulmamış. İlk ilanınızı oluşturmak için yukarıdaki butonu kullanın."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}