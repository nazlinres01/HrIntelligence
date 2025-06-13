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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Plus, Edit, Trash2, Users, DollarSign, MapPin, Calendar, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RecruitmentManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [formData, setFormData] = useState({
    jobTitle: "",
    description: "",
    requirements: "",
    benefits: "",
    departmentId: "",
    location: "",
    employmentType: "full-time",
    salaryMin: "",
    salaryMax: "",
    status: "draft"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["/api/recruitment"],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"],
  });

  const createJobMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/recruitment", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recruitment"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Başarılı", description: "İş ilanı başarıyla oluşturuldu" });
    },
    onError: () => {
      toast({ title: "Hata", description: "İş ilanı oluşturulurken hata oluştu", variant: "destructive" });
    }
  });

  const updateJobMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/recruitment/${editingJob.id}`, { method: "PUT", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recruitment"] });
      setIsDialogOpen(false);
      resetForm();
      setEditingJob(null);
      toast({ title: "Başarılı", description: "İş ilanı başarıyla güncellendi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "İş ilanı güncellenirken hata oluştu", variant: "destructive" });
    }
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/recruitment/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recruitment"] });
      toast({ title: "Başarılı", description: "İş ilanı başarıyla silindi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "İş ilanı silinirken hata oluştu", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      jobTitle: "",
      description: "",
      requirements: "",
      benefits: "",
      departmentId: "",
      location: "",
      employmentType: "full-time",
      salaryMin: "",
      salaryMax: "",
      status: "draft"
    });
  };

  const handleEdit = (job: any) => {
    setEditingJob(job);
    setFormData({
      jobTitle: job.jobTitle || "",
      description: job.description || "",
      requirements: job.requirements?.join("\n") || "",
      benefits: job.benefits?.join("\n") || "",
      departmentId: job.departmentId?.toString() || "",
      location: job.location || "",
      employmentType: job.employmentType || "full-time",
      salaryMin: job.salaryRange?.min?.toString() || "",
      salaryMax: job.salaryRange?.max?.toString() || "",
      status: job.status || "draft"
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const jobData = {
      jobTitle: formData.jobTitle,
      description: formData.description,
      requirements: formData.requirements.split("\n").filter(r => r.trim()),
      benefits: formData.benefits.split("\n").filter(b => b.trim()),
      departmentId: parseInt(formData.departmentId),
      location: formData.location,
      employmentType: formData.employmentType,
      salaryRange: {
        min: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        max: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        currency: "TRY"
      },
      status: formData.status
    };

    if (editingJob) {
      updateJobMutation.mutate(jobData);
    } else {
      createJobMutation.mutate(jobData);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Taslak", variant: "secondary" },
      active: { label: "Aktif", variant: "default" },
      paused: { label: "Durduruldu", variant: "outline" },
      closed: { label: "Kapatıldı", variant: "destructive" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "secondary" };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getEmploymentTypeBadge = (type: string) => {
    const typeConfig = {
      "full-time": { label: "Tam Zamanlı", variant: "default" },
      "part-time": { label: "Yarı Zamanlı", variant: "secondary" },
      "contract": { label: "Sözleşmeli", variant: "outline" },
      "intern": { label: "Stajyer", variant: "secondary" }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || { label: type, variant: "secondary" };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const formatSalary = (min: number, max: number) => {
    if (!min && !max) return "Belirtilmemiş";
    if (min && max) {
      return `${min.toLocaleString('tr-TR')} - ${max.toLocaleString('tr-TR')} TRY`;
    }
    return `${(min || max).toLocaleString('tr-TR')} TRY`;
  };

  const getDepartmentName = (departmentId: number) => {
    const department = departments.find((d: any) => d.id === departmentId);
    return department?.name || "Bilinmeyen Departman";
  };

  const getApplicationStatusBadge = (status: string) => {
    const statusConfig = {
      applied: { label: "Başvuru", variant: "secondary" },
      screening: { label: "İnceleme", variant: "outline" },
      interview: { label: "Mülakat", variant: "default" },
      offer: { label: "Teklif", variant: "default" },
      hired: { label: "İşe Alındı", variant: "default" },
      rejected: { label: "Reddedildi", variant: "destructive" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "secondary" };
    return <Badge variant={config.variant as any} className="text-xs">{config.label}</Badge>;
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">İşe Alım Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">İş ilanlarını ve başvuruları yönetin</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setEditingJob(null); resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni İş İlanı
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? "İş İlanı Düzenle" : "Yeni İş İlanı Ekle"}</DialogTitle>
              <DialogDescription>
                İş ilanı bilgilerini doldurun ve yayınlayın.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">İş Pozisyonu</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="departmentId">Departman</Label>
                  <Select value={formData.departmentId} onValueChange={(value) => setFormData({...formData, departmentId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Departman seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department: any) => (
                        <SelectItem key={department.id} value={department.id.toString()}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">İş Açıklaması</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="requirements">Gereksinimler (her satıra bir tane)</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  rows={3}
                  placeholder="Üniversite mezunu&#10;3+ yıl deneyim&#10;İngilizce bilgisi"
                />
              </div>
              <div>
                <Label htmlFor="benefits">Faydalar (her satıra bir tane)</Label>
                <Textarea
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  rows={3}
                  placeholder="Sağlık sigortası&#10;Esnek çalışma saatleri&#10;Eğitim desteği"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Lokasyon</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="İstanbul, Türkiye"
                  />
                </div>
                <div>
                  <Label htmlFor="employmentType">Çalışma Tipi</Label>
                  <Select value={formData.employmentType} onValueChange={(value) => setFormData({...formData, employmentType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Tam Zamanlı</SelectItem>
                      <SelectItem value="part-time">Yarı Zamanlı</SelectItem>
                      <SelectItem value="contract">Sözleşmeli</SelectItem>
                      <SelectItem value="intern">Stajyer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="salaryMin">Min. Maaş (TRY)</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData({...formData, salaryMin: e.target.value})}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label htmlFor="salaryMax">Max. Maaş (TRY)</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData({...formData, salaryMax: e.target.value})}
                    placeholder="80000"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Durum</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Taslak</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="paused">Durduruldu</SelectItem>
                      <SelectItem value="closed">Kapatıldı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="lightgray" onClick={() => setIsDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={createJobMutation.isPending || updateJobMutation.isPending}>
                  {editingJob ? "Güncelle" : "Oluştur"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="jobs">İş İlanları</TabsTrigger>
          <TabsTrigger value="applications">Başvurular</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job: any) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{job.jobTitle}</CardTitle>
                        <CardDescription>{getDepartmentName(job.departmentId)}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {job.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-2" />
                          Lokasyon
                        </div>
                        <span className="font-medium">{job.location || "Belirtilmemiş"}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Maaş
                        </div>
                        <span className="font-medium">{formatSalary(job.salaryRange?.min, job.salaryRange?.max)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-2" />
                          Başvuru
                        </div>
                        <span className="font-medium">{job.applications?.length || 0} adet</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      {getEmploymentTypeBadge(job.employmentType)}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="lightgray" onClick={() => handleEdit(job)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="lightgray" 
                          onClick={() => deleteJobMutation.mutate(job.id)}
                          disabled={deleteJobMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Henüz iş ilanı yok</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">İlk iş ilanınızı ekleyerek başlayın</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni İş İlanı Ekle
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tüm Başvurular</CardTitle>
              <CardDescription>İş ilanlarına yapılan başvuruları görüntüleyin ve yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aday</TableHead>
                    <TableHead>Pozisyon</TableHead>
                    <TableHead>Başvuru Tarihi</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.flatMap((job: any) => 
                    job.applications?.map((application: any, index: number) => (
                      <TableRow key={`${job.id}-${index}`}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{application.candidateName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{application.candidateEmail}</div>
                            {application.candidatePhone && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">{application.candidatePhone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{job.jobTitle}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {new Date(application.appliedAt).toLocaleDateString('tr-TR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getApplicationStatusBadge(application.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button size="sm" variant="lightgray">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )) || []
                  )}
                </TableBody>
              </Table>

              {jobs.every((job: any) => !job.applications?.length) && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Henüz başvuru yok</h3>
                  <p className="text-gray-600 dark:text-gray-400">İş ilanları yayınlandıktan sonra başvurular burada görünecek</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}