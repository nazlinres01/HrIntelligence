import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Users,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Building2
} from "lucide-react";

interface JobPosting {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary: string;
  type: string;
  status: string;
  departmentId: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  applicationCount?: number;
}

export default function JobPostingsManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Gerçek verilerle mock data
  const jobPostings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      description: "React, TypeScript ve modern web teknolojileri ile uygulama geliştirme. 5+ yıl deneyim gerektiren pozisyon.",
      requirements: "React, TypeScript, Next.js, CSS3, HTML5, Git, Agile metodolojiler",
      location: "İstanbul, Türkiye",
      salary: "25,000 - 35,000 TL",
      type: "full-time",
      status: "active",
      departmentId: 1,
      companyId: 1,
      createdAt: "2024-12-01T00:00:00Z",
      updatedAt: "2024-12-01T00:00:00Z",
      applicationCount: 24
    },
    {
      id: 2,
      title: "İnsan Kaynakları Uzmanı",
      description: "İK süreçlerinin yönetimi, işe alım, performans değerlendirme ve çalışan ilişkileri",
      requirements: "İK alanında 3+ yıl deneyim, HRIS sistemleri bilgisi, iletişim becerileri",
      location: "İstanbul, Türkiye",
      salary: "18,000 - 25,000 TL",
      type: "full-time",
      status: "active",
      departmentId: 2,
      companyId: 1,
      createdAt: "2024-11-28T00:00:00Z",
      updatedAt: "2024-11-28T00:00:00Z",
      applicationCount: 15
    },
    {
      id: 3,
      title: "DevOps Engineer",
      description: "CI/CD pipeline'ları, cloud infrastructure ve container teknolojileri ile çalışma",
      requirements: "Docker, Kubernetes, AWS/Azure, Jenkins, Terraform, Linux",
      location: "İstanbul, Türkiye",
      salary: "30,000 - 40,000 TL",
      type: "full-time",
      status: "active",
      departmentId: 1,
      companyId: 1,
      createdAt: "2024-12-05T00:00:00Z",
      updatedAt: "2024-12-05T00:00:00Z",
      applicationCount: 8
    },
    {
      id: 4,
      title: "UX/UI Designer",
      description: "Kullanıcı deneyimi ve arayüz tasarımı, prototyping ve user research",
      requirements: "Figma, Adobe Creative Suite, prototyping tools, user research",
      location: "İstanbul, Türkiye",
      salary: "20,000 - 28,000 TL",
      type: "full-time",
      status: "paused",
      departmentId: 3,
      companyId: 1,
      createdAt: "2024-11-20T00:00:00Z",
      updatedAt: "2024-12-01T00:00:00Z",
      applicationCount: 12
    },
    {
      id: 5,
      title: "Backend Developer",
      description: "Node.js, Python veya Java ile backend geliştirme, API tasarımı ve veritabanı yönetimi",
      requirements: "Node.js/Python/Java, REST API, PostgreSQL/MongoDB, microservices",
      location: "İstanbul, Türkiye",
      salary: "22,000 - 32,000 TL",
      type: "full-time",
      status: "active",
      departmentId: 1,
      companyId: 1,
      createdAt: "2024-12-03T00:00:00Z",
      updatedAt: "2024-12-03T00:00:00Z",
      applicationCount: 18
    },
    {
      id: 6,
      title: "Dijital Pazarlama Uzmanı",
      description: "SEO/SEM, sosyal medya pazarlama, content marketing ve performans analizi",
      requirements: "Google Ads, Facebook Ads, SEO/SEM, Analytics, content creation",
      location: "İstanbul, Türkiye",
      salary: "15,000 - 22,000 TL",
      type: "full-time",
      status: "active",
      departmentId: 4,
      companyId: 1,
      createdAt: "2024-11-25T00:00:00Z",
      updatedAt: "2024-11-25T00:00:00Z",
      applicationCount: 22
    }
  ];

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"],
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["/api/companies"],
  });

  const isLoading = false;

  const createJobMutation = useMutation({
    mutationFn: async (jobData: any) => {
      return apiRequest("/api/job-postings", {
        method: "POST",
        body: jobData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-postings"] });
      setIsDialogOpen(false);
      setEditingJob(null);
      toast({
        title: "Başarılı",
        description: "İş ilanı başarıyla oluşturuldu.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: "İş ilanı oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async ({ id, ...jobData }: any) => {
      return apiRequest(`/api/job-postings/${id}`, {
        method: "PATCH",
        body: jobData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-postings"] });
      setIsDialogOpen(false);
      setEditingJob(null);
      toast({
        title: "Başarılı",
        description: "İş ilanı başarıyla güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: "İş ilanı güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/job-postings/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-postings"] });
      toast({
        title: "Başarılı",
        description: "İş ilanı başarıyla silindi.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: "İş ilanı silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jobData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      requirements: formData.get("requirements") as string,
      location: formData.get("location") as string,
      salary: formData.get("salary") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      departmentId: parseInt(formData.get("departmentId") as string),
      companyId: parseInt(formData.get("companyId") as string),
    };

    if (editingJob) {
      updateJobMutation.mutate({ id: editingJob.id, ...jobData });
    } else {
      createJobMutation.mutate(jobData);
    }
  };

  const handleEdit = (job: JobPosting) => {
    setEditingJob(job);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bu iş ilanını silmek istediğinizden emin misiniz?")) {
      deleteJobMutation.mutate(id);
    }
  };

  const filteredJobs = Array.isArray(jobPostings) ? jobPostings.filter((job: JobPosting) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aktif</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Duraklatıldı</Badge>;
      case "closed":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Kapatıldı</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Taslak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getJobTypeBadge = (type: string) => {
    switch (type) {
      case "full-time":
        return <Badge variant="outline" className="text-blue-600">Tam Zamanlı</Badge>;
      case "part-time":
        return <Badge variant="outline" className="text-purple-600">Yarı Zamanlı</Badge>;
      case "contract":
        return <Badge variant="outline" className="text-orange-600">Sözleşmeli</Badge>;
      case "internship":
        return <Badge variant="outline" className="text-green-600">Staj</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
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
    <div className="flex-1 h-full bg-gray-50 dark:bg-gray-900">
      <div className="h-full flex flex-col">
        {/* Microsoft-style Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    İş İlanları
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    İş ilanlarını yönetin ve başvuruları takip edin
                  </p>
                </div>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingJob(null)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni İş İlanı
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingJob ? "İş İlanını Düzenle" : "Yeni İş İlanı Oluştur"}
              </DialogTitle>
              <DialogDescription>
                İş ilanı bilgilerini doldurun
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">İş Başlığı</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingJob?.title || ""}
                    placeholder="Senior Frontend Developer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasyon</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={editingJob?.location || ""}
                    placeholder="İstanbul, Türkiye"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary">Maaş</Label>
                  <Input
                    id="salary"
                    name="salary"
                    defaultValue={editingJob?.salary || ""}
                    placeholder="15,000 - 25,000 TL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">İş Türü</Label>
                  <Select name="type" defaultValue={editingJob?.type || "full-time"}>
                    <SelectTrigger>
                      <SelectValue placeholder="İş türünü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Tam Zamanlı</SelectItem>
                      <SelectItem value="part-time">Yarı Zamanlı</SelectItem>
                      <SelectItem value="contract">Sözleşmeli</SelectItem>
                      <SelectItem value="internship">Staj</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departmentId">Departman</Label>
                  <Select name="departmentId" defaultValue={editingJob?.departmentId?.toString() || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Departman seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(departments) && departments.map((dept: any) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyId">Şirket</Label>
                  <Select name="companyId" defaultValue={editingJob?.companyId?.toString() || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Şirket seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(companies) && companies.map((company: any) => (
                        <SelectItem key={company.id} value={company.id.toString()}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Durum</Label>
                <Select name="status" defaultValue={editingJob?.status || "draft"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Taslak</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="paused">Duraklatıldı</SelectItem>
                    <SelectItem value="closed">Kapatıldı</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">İş Açıklaması</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingJob?.description || ""}
                  placeholder="İş pozisyonunun detaylı açıklaması..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Gereksinimler</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  defaultValue={editingJob?.requirements || ""}
                  placeholder="Bu pozisyon için gerekli beceriler ve deneyimler..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={createJobMutation.isPending || updateJobMutation.isPending}>
                  {editingJob ? "Güncelle" : "Oluştur"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  İptal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="İş ilanlarında ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Durum filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="paused">Duraklatıldı</SelectItem>
            <SelectItem value="closed">Kapatıldı</SelectItem>
            <SelectItem value="draft">Taslak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredJobs.length}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Toplam İlan
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredJobs.filter(job => job.status === "active").length}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Aktif İlan
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-4">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredJobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0)}
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Toplam Başvuru
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredJobs.filter(job => job.status === "draft").length}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Taslak İlan
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Postings Table */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            İş İlanları
          </CardTitle>
          <CardDescription>
            Şirket iş ilanlarını yönetin ve başvuruları takip edin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İş Başlığı</TableHead>
                  <TableHead>Departman</TableHead>
                  <TableHead>Lokasyon</TableHead>
                  <TableHead>Tür</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Başvuru</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job: JobPosting) => {
                  const department = Array.isArray(departments) ? departments.find((d: any) => d.id === job.departmentId) : null;
                  return (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {job.title}
                          </div>
                          {job.salary && (
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {job.salary}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                          {department?.name || "Bilinmiyor"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell>{getJobTypeBadge(job.type)}</TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          {job.applicationCount || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(job.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(job)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(job.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredJobs.length === 0 && (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  İş ilanı bulunamadı
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || statusFilter !== "all" 
                    ? "Arama kriterlerinize uygun iş ilanı bulunamadı." 
                    : "Henüz hiç iş ilanı oluşturulmamış."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}