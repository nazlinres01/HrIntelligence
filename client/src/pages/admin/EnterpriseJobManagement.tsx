import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, Search, Edit, Trash2, Eye, Users, MapPin, Briefcase, TrendingUp, Target, Award, Filter, Download, Building2
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
  applicationCount?: number;
  createdAt: string;
  updatedAt: string;
}

export default function EnterpriseJobManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    type: "",
    status: "active",
    departmentId: "",
    companyId: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jobPostings = [], isLoading } = useQuery({
    queryKey: ["/api/jobs"],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"],
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["/api/companies"],
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/jobs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "İş ilanı başarıyla oluşturuldu",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "İş ilanı oluşturulurken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/jobs/${editingJob?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      setIsDialogOpen(false);
      setEditingJob(null);
      resetForm();
      toast({
        title: "Başarılı",
        description: "İş ilanı başarıyla güncellendi",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "İş ilanı güncellenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "Başarılı",
        description: "İş ilanı başarıyla silindi",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "İş ilanı silinirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      requirements: "",
      location: "",
      salary: "",
      type: "",
      status: "active",
      departmentId: "",
      companyId: ""
    });
  };

  const handleEdit = (job: JobPosting) => {
    setEditingJob(job);
    setFormData({
      title: job.title || "",
      description: job.description || "",
      requirements: job.requirements || "",
      location: job.location || "",
      salary: job.salary || "",
      type: job.type || "",
      status: job.status || "active",
      departmentId: job.departmentId?.toString() || "",
      companyId: job.companyId?.toString() || ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const jobData = {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      salary: formData.salary,
      type: formData.type,
      status: formData.status,
      departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
      companyId: formData.companyId ? parseInt(formData.companyId) : null
    };

    if (editingJob) {
      updateJobMutation.mutate(jobData);
    } else {
      createJobMutation.mutate(jobData);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">Kapalı</Badge>;
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Acil</Badge>;
      default:
        return <Badge variant="lightgray">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "full-time":
        return <Badge className="bg-blue-100 text-blue-800">Tam Zamanlı</Badge>;
      case "part-time":
        return <Badge className="bg-purple-100 text-purple-800">Yarı Zamanlı</Badge>;
      case "contract":
        return <Badge className="bg-orange-100 text-orange-800">Sözleşmeli</Badge>;
      case "internship":
        return <Badge className="bg-yellow-100 text-yellow-800">Staj</Badge>;
      default:
        return <Badge variant="lightgray">{type}</Badge>;
    }
  };

  const getDepartmentName = (departmentId: number) => {
    const department = Array.isArray(departments) ? departments.find((d: any) => d.id === departmentId) : null;
    return department?.name || "Atanmamış";
  };

  const filteredJobs = Array.isArray(jobPostings) ? jobPostings.filter((job: JobPosting) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || job.departmentId.toString() === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  }) : [];

  const activeJobs = filteredJobs.filter(job => job.status === "active").length;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">İş İlanları Yönetimi</h1>
            <p className="text-gray-600 text-lg">Kurumsal İnsan Kaynakları ve İşe Alım Süreçleri</p>
          </div>
          <div className="text-center">
            <Briefcase className="h-16 w-16 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-gray-900">{activeJobs}</div>
            <div className="text-gray-500 text-sm">Aktif İş İlanı</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">İş İlanları</h2>
            <p className="text-gray-600">İş ilanlarını oluşturun ve başvuruları yönetin</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="lightgray" className="border-gray-200 text-gray-700 hover:bg-gray-50">
              <Download className="mr-2 h-4 w-4" />
              Rapor İndir
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    setEditingJob(null);
                    resetForm();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni İş İlanı
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-gray-200 max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-gray-800">
                    {editingJob ? "İş İlanı Düzenle" : "Yeni İş İlanı Oluştur"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    {editingJob ? "İş ilanı bilgilerini güncelleyin" : "Yeni bir iş ilanı oluşturun"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-gray-700">İş Başlığı</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-gray-700">Lokasyon</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                        className="bg-white border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700">İş Açıklaması</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={4}
                      className="bg-white border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements" className="text-gray-700">Gereksinimler</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      required
                      rows={3}
                      className="bg-white border-gray-200"
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="lightgray" onClick={() => setIsDialogOpen(false)}>
                      İptal
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={createJobMutation.isPending || updateJobMutation.isPending}
                    >
                      {editingJob ? "Güncelle" : "Oluştur"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="İş ilanı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white border-gray-200">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Durum Filtresi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="closed">Kapalı</SelectItem>
                  <SelectItem value="urgent">Acil</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="bg-white border-gray-200">
                  <Building2 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Departman Filtresi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Departmanlar</SelectItem>
                  {Array.isArray(departments) && departments.map((department: any) => (
                    <SelectItem key={department.id} value={department.id.toString()}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-right">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{filteredJobs.length}</span> ilan gösteriliyor
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-700 font-semibold">İş Başlığı</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Departman</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Lokasyon</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Tür</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Durum</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Başvurular</TableHead>
                  <TableHead className="text-gray-700 font-semibold">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job: JobPosting) => (
                  <TableRow key={job.id} className="border-gray-200 hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-600">{job.salary}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {getDepartmentName(job.departmentId)}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(job.type)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(job.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-700">{job.applicationCount || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="lightgray"
                          size="sm"
                          onClick={() => handleEdit(job)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="lightgray"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="lightgray"
                          size="sm"
                          onClick={() => deleteJobMutation.mutate(job.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}