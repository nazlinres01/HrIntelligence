import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Plus, Eye, Edit, Trash2, MapPin, Clock, DollarSign, Users, Filter, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  description: string;
  requirements: string;
  status: 'active' | 'closed' | 'draft';
  postedDate: string;
  applicationCount?: number;
}

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["/api/jobs"],
  });

  const { data: jobApplications = [] } = useQuery({
    queryKey: ["/api/job-applications"],
  });

  // Job mutations
  const createJob = useMutation({
    mutationFn: async (jobData: any) => {
      return apiRequest("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "İş İlanı Oluşturuldu",
        description: "Yeni iş ilanı başarıyla oluşturuldu.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İş ilanı oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateJob = useMutation({
    mutationFn: async ({ id, ...jobData }: any) => {
      return apiRequest(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "İş İlanı Güncellendi",
        description: "İş ilanı başarıyla güncellendi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İş ilanı güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const deleteJob = useMutation({
    mutationFn: async (jobId: number) => {
      return apiRequest(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "İş İlanı Silindi",
        description: "İş ilanı başarıyla silindi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "İş ilanı silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  // Add application count to jobs
  const enrichedJobs = jobs.map((job: Job) => {
    const applicationCount = jobApplications.filter((app: any) => app.jobId === job.id).length;
    return { ...job, applicationCount };
  });

  // Filtering
  const filteredJobs = enrichedJobs.filter((job: Job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const activeJobs = filteredJobs.filter((job: Job) => job.status === "active");
  const draftJobs = filteredJobs.filter((job: Job) => job.status === "draft");
  const closedJobs = filteredJobs.filter((job: Job) => job.status === "closed");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case "closed":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Kapalı</Badge>;
      case "draft":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Taslak</Badge>;
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>;
    }
  };

  const getJobTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      "full-time": "Tam Zamanlı",
      "part-time": "Yarı Zamanlı",
      "contract": "Sözleşmeli",
      "internship": "Staj",
      "remote": "Uzaktan"
    };
    return types[type] || type;
  };

  const getJobLevelLabel = (level: string) => {
    const levels: { [key: string]: string } = {
      "entry": "Giriş Seviye",
      "mid": "Orta Seviye",
      "senior": "Kıdemli",
      "lead": "Takım Lideri",
      "manager": "Yönetici"
    };
    return levels[level] || level;
  };

  // Job form component
  const JobForm = ({ job, onClose }: { job?: Job; onClose?: () => void }) => {
    const [title, setTitle] = useState(job?.title || "");
    const [department, setDepartment] = useState(job?.department || "");
    const [location, setLocation] = useState(job?.location || "");
    const [type, setType] = useState(job?.type || "");
    const [level, setLevel] = useState(job?.level || "");
    const [salary, setSalary] = useState(job?.salary || "");
    const [description, setDescription] = useState(job?.description || "");
    const [requirements, setRequirements] = useState(job?.requirements || "");
    const [status, setStatus] = useState(job?.status || "draft");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!title || !department || !location || !type || !level) {
        toast({
          title: "Eksik Bilgi",
          description: "Lütfen tüm gerekli alanları doldurun.",
          variant: "destructive",
        });
        return;
      }

      const jobData = {
        title,
        department,
        location,
        type,
        level,
        salary,
        description,
        requirements,
        status,
        postedDate: job?.postedDate || new Date().toISOString(),
      };

      if (job) {
        updateJob.mutate({ id: job.id, ...jobData });
      } else {
        createJob.mutate(jobData);
      }

      if (onClose) onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">İş Pozisyonu *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Yazılım Geliştirici"
            />
          </div>
          <div>
            <Label htmlFor="department">Departman *</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Bilgi İşlem"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Lokasyon *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="İstanbul, Türkiye"
            />
          </div>
          <div>
            <Label htmlFor="type">Çalışma Türü *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Çalışma türü seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Tam Zamanlı</SelectItem>
                <SelectItem value="part-time">Yarı Zamanlı</SelectItem>
                <SelectItem value="contract">Sözleşmeli</SelectItem>
                <SelectItem value="internship">Staj</SelectItem>
                <SelectItem value="remote">Uzaktan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="level">Deneyim Seviyesi *</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Seviye seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Giriş Seviye</SelectItem>
                <SelectItem value="mid">Orta Seviye</SelectItem>
                <SelectItem value="senior">Kıdemli</SelectItem>
                <SelectItem value="lead">Takım Lideri</SelectItem>
                <SelectItem value="manager">Yönetici</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="salary">Maaş Aralığı</Label>
            <Input
              id="salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="25.000 - 35.000 TL"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">İş Tanımı</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Pozisyon hakkında detaylı bilgi..."
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="requirements">Gereksinimler</Label>
          <Textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Aranan nitelikler ve gereksinimler..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="status">Durum</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Durum seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Taslak</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="closed">Kapalı</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={createJob.isPending || updateJob.isPending}
            className="flex-1 bg-teal-600 hover:bg-teal-700"
          >
            {job ? "İlanı Güncelle" : "İlan Oluştur"}
          </Button>
        </div>
      </form>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İş İlanları</h1>
          <p className="text-gray-600">İş ilanlarını oluşturun ve başvuruları yönetin</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="w-4 h-4 mr-2" />
                Yeni İş İlanı
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yeni İş İlanı</DialogTitle>
                <DialogDescription>
                  Yeni iş ilanı oluşturun
                </DialogDescription>
              </DialogHeader>
              <JobForm />
            </DialogContent>
          </Dialog>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {activeJobs.length} Aktif İlan
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtreler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Arama</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="search"
                  placeholder="İş pozisyonu, departman, lokasyon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Durum</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="draft">Taslak</SelectItem>
                  <SelectItem value="closed">Kapalı</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Çalışma Türü</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tür seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="full-time">Tam Zamanlı</SelectItem>
                  <SelectItem value="part-time">Yarı Zamanlı</SelectItem>
                  <SelectItem value="contract">Sözleşmeli</SelectItem>
                  <SelectItem value="internship">Staj</SelectItem>
                  <SelectItem value="remote">Uzaktan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Tümü ({filteredJobs.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Aktif ({activeJobs.length})
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Taslak ({draftJobs.length})
          </TabsTrigger>
          <TabsTrigger value="closed" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Kapalı ({closedJobs.length})
          </TabsTrigger>
        </TabsList>

        {/* All Jobs Table */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Tüm İş İlanları</CardTitle>
              <CardDescription>Sistemdeki tüm iş ilanları</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pozisyon</TableHead>
                    <TableHead>Departman</TableHead>
                    <TableHead>Lokasyon</TableHead>
                    <TableHead>Tür</TableHead>
                    <TableHead>Seviye</TableHead>
                    <TableHead>Başvuru</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job: Job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell>{getJobTypeLabel(job.type)}</TableCell>
                      <TableCell>{getJobLevelLabel(job.level)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          {job.applicationCount || 0}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{job.title}</DialogTitle>
                                <DialogDescription>
                                  {job.department} • {job.location}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Çalışma Türü</Label>
                                    <p className="text-sm">{getJobTypeLabel(job.type)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Deneyim Seviyesi</Label>
                                    <p className="text-sm">{getJobLevelLabel(job.level)}</p>
                                  </div>
                                  {job.salary && (
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Maaş</Label>
                                      <p className="text-sm">{job.salary}</p>
                                    </div>
                                  )}
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Başvuru Sayısı</Label>
                                    <p className="text-sm">{job.applicationCount || 0} başvuru</p>
                                  </div>
                                </div>
                                
                                {job.description && (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">İş Tanımı</Label>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm whitespace-pre-wrap">{job.description}</p>
                                    </div>
                                  </div>
                                )}

                                {job.requirements && (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Gereksinimler</Label>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm whitespace-pre-wrap">{job.requirements}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>İş İlanını Düzenle</DialogTitle>
                                <DialogDescription>
                                  İş ilanı bilgilerini güncelleyin
                                </DialogDescription>
                              </DialogHeader>
                              <JobForm job={job} />
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => deleteJob.mutate(job.id)}
                            disabled={deleteJob.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredJobs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Filtre kriterlerine uygun iş ilanı bulunamadı.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Jobs */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Aktif İş İlanları</CardTitle>
              <CardDescription>Şu anda başvuru kabul eden iş ilanları</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pozisyon</TableHead>
                    <TableHead>Departman</TableHead>
                    <TableHead>Lokasyon</TableHead>
                    <TableHead>Tür</TableHead>
                    <TableHead>Başvuru</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeJobs.map((job: Job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell>{getJobTypeLabel(job.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          {job.applicationCount || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{job.title}</DialogTitle>
                                <DialogDescription>
                                  {job.department} • {job.location}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Çalışma Türü</Label>
                                    <p className="text-sm">{getJobTypeLabel(job.type)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Deneyim Seviyesi</Label>
                                    <p className="text-sm">{getJobLevelLabel(job.level)}</p>
                                  </div>
                                  {job.salary && (
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Maaş</Label>
                                      <p className="text-sm">{job.salary}</p>
                                    </div>
                                  )}
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Başvuru Sayısı</Label>
                                    <p className="text-sm">{job.applicationCount || 0} başvuru</p>
                                  </div>
                                </div>
                                
                                {job.description && (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">İş Tanımı</Label>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm whitespace-pre-wrap">{job.description}</p>
                                    </div>
                                  </div>
                                )}

                                {job.requirements && (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Gereksinimler</Label>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm whitespace-pre-wrap">{job.requirements}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>İş İlanını Düzenle</DialogTitle>
                                <DialogDescription>
                                  İş ilanı bilgilerini güncelleyin
                                </DialogDescription>
                              </DialogHeader>
                              <JobForm job={job} />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {activeJobs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Aktif iş ilanı bulunmuyor.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Draft Jobs */}
        <TabsContent value="draft">
          <Card>
            <CardHeader>
              <CardTitle>Taslak İş İlanları</CardTitle>
              <CardDescription>Henüz yayınlanmamış iş ilanları</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pozisyon</TableHead>
                    <TableHead>Departman</TableHead>
                    <TableHead>Lokasyon</TableHead>
                    <TableHead>Tür</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {draftJobs.map((job: Job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell>{getJobTypeLabel(job.type)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>İş İlanını Düzenle</DialogTitle>
                                <DialogDescription>
                                  İş ilanı bilgilerini güncelleyin
                                </DialogDescription>
                              </DialogHeader>
                              <JobForm job={job} />
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => deleteJob.mutate(job.id)}
                            disabled={deleteJob.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {draftJobs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Edit className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Taslak iş ilanı bulunmuyor.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Closed Jobs */}
        <TabsContent value="closed">
          <Card>
            <CardHeader>
              <CardTitle>Kapalı İş İlanları</CardTitle>
              <CardDescription>Başvuru süresi sona ermiş iş ilanları</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pozisyon</TableHead>
                    <TableHead>Departman</TableHead>
                    <TableHead>Lokasyon</TableHead>
                    <TableHead>Tür</TableHead>
                    <TableHead>Toplam Başvuru</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {closedJobs.map((job: Job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell>{getJobTypeLabel(job.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          {job.applicationCount || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{job.title}</DialogTitle>
                                <DialogDescription>
                                  {job.department} • {job.location}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Çalışma Türü</Label>
                                    <p className="text-sm">{getJobTypeLabel(job.type)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Deneyim Seviyesi</Label>
                                    <p className="text-sm">{getJobLevelLabel(job.level)}</p>
                                  </div>
                                  {job.salary && (
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Maaş</Label>
                                      <p className="text-sm">{job.salary}</p>
                                    </div>
                                  )}
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Toplam Başvuru</Label>
                                    <p className="text-sm">{job.applicationCount || 0} başvuru</p>
                                  </div>
                                </div>
                                
                                {job.description && (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">İş Tanımı</Label>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm whitespace-pre-wrap">{job.description}</p>
                                    </div>
                                  </div>
                                )}

                                {job.requirements && (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Gereksinimler</Label>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm whitespace-pre-wrap">{job.requirements}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {closedJobs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Trash2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Kapalı iş ilanı bulunmuyor.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}