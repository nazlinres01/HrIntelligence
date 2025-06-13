import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Plus, Search, Edit, Eye, Users, MapPin, Calendar, DollarSign, Target, Building, Clock, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

const jobSchema = z.object({
  title: z.string().min(1, "İş unvanı gereklidir"),
  department: z.string().min(1, "Departman seçimi gereklidir"),
  location: z.string().min(1, "Lokasyon gereklidir"),
  employment_type: z.string().min(1, "Çalışma şekli gereklidir"),
  experience_level: z.string().min(1, "Deneyim seviyesi gereklidir"),
  salary_min: z.string().min(1, "Minimum maaş gereklidir"),
  salary_max: z.string().min(1, "Maksimum maaş gereklidir"),
  description: z.string().min(50, "En az 50 karakter açıklama gereklidir"),
  requirements: z.string().min(20, "En az 20 karakter gereksinim gereklidir"),
  benefits: z.string().min(10, "Yan haklar bilgisi gereklidir")
});

type JobFormData = z.infer<typeof jobSchema>;

export default function JobPostingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      employment_type: "",
      experience_level: "",
      salary_min: "",
      salary_max: "",
      description: "",
      requirements: "",
      benefits: ""
    }
  });

  const jobPostings = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Yazılım Geliştirme",
      location: "İstanbul - Maslak",
      employment_type: "Tam Zamanlı",
      experience_level: "Senior (5+ yıl)",
      salary_range: "₺35.000 - ₺45.000",
      status: "aktif",
      posted_date: "2024-06-10",
      application_count: 47,
      views: 320,
      description: "Modern web teknolojileri kullanarak ölçeklenebilir uygulamalar geliştiren deneyimli bir Full Stack Developer arıyoruz.",
      requirements: "React, Node.js, TypeScript, PostgreSQL, 5+ yıl deneyim",
      benefits: "Sağlık sigortası, esnek çalışma, uzaktan çalışma imkanı, eğitim desteği",
      urgency: "normal"
    },
    {
      id: 2,
      title: "UX Designer",
      department: "Tasarım",
      location: "İstanbul - Kadıköy",
      employment_type: "Tam Zamanlı",
      experience_level: "Mid-Level (3-5 yıl)",
      salary_range: "₺22.000 - ₺28.000",
      status: "aktif",
      posted_date: "2024-06-12",
      application_count: 23,
      views: 156,
      description: "Kullanıcı deneyimini ön planda tutan, yaratıcı ve analitik düşünce yapısına sahip UX Designer pozisyonu.",
      requirements: "Figma, Adobe XD, User Research, Prototyping, 3+ yıl deneyim",
      benefits: "Yaratıcı ortam, tasarım konferansları, MacBook Pro, esnek mesai",
      urgency: "high"
    },
    {
      id: 3,
      title: "DevOps Engineer",
      department: "Altyapı",
      location: "Ankara - Çankaya",
      employment_type: "Tam Zamanlı",
      experience_level: "Senior (5+ yıl)",
      salary_range: "₺32.000 - ₺42.000",
      status: "aktif",
      posted_date: "2024-06-08",
      application_count: 31,
      views: 203,
      description: "Cloud altyapısı ve CI/CD süreçlerini yönetecek deneyimli DevOps Engineer arayışımız.",
      requirements: "AWS, Docker, Kubernetes, Terraform, Jenkins, 4+ yıl deneyim",
      benefits: "AWS sertifikaları, conference katılımı, remote çalışma",
      urgency: "normal"
    },
    {
      id: 4,
      title: "Product Manager",
      department: "Ürün Yönetimi",
      location: "İstanbul - Levent",
      employment_type: "Tam Zamanlı",
      experience_level: "Senior (5+ yıl)",
      salary_range: "₺38.000 - ₺50.000",
      status: "taslak",
      posted_date: "2024-06-13",
      application_count: 0,
      views: 0,
      description: "Dijital ürünlerimizin stratejisini belirleyecek ve geliştirme sürecini yönetecek Product Manager.",
      requirements: "Product Management, Agile, Analytics, Stakeholder Management, 5+ yıl",
      benefits: "Equity, leadership training, conference budget, flexible hours",
      urgency: "low"
    },
    {
      id: 5,
      title: "Frontend Developer",
      department: "Yazılım Geliştirme",
      location: "İzmir - Alsancak",
      employment_type: "Tam Zamanlı",
      experience_level: "Junior (1-3 yıl)",
      salary_range: "₺16.000 - ₺22.000",
      status: "aktif",
      posted_date: "2024-06-11",
      application_count: 89,
      views: 421,
      description: "Modern frontend teknolojileriyle kullanıcı dostu arayüzler geliştiren Junior Frontend Developer.",
      requirements: "React, JavaScript, CSS, HTML, Git, 1+ yıl deneyim",
      benefits: "Mentorship program, tech talks, office snacks, casual dress code",
      urgency: "high"
    },
    {
      id: 6,
      title: "Data Scientist",
      department: "Veri Analizi",
      location: "İstanbul - Maslak",
      employment_type: "Tam Zamanlı",
      experience_level: "Mid-Level (3-5 yıl)",
      salary_range: "₺28.000 - ₺36.000",
      status: "pasif",
      posted_date: "2024-05-28",
      application_count: 76,
      views: 298,
      description: "Büyük veri setlerinden anlamlı içgörüler çıkaracak Data Scientist pozisyonu.",
      requirements: "Python, R, Machine Learning, SQL, Statistics, 3+ yıl deneyim",
      benefits: "Kaggle competitions, data conferences, GPU workstation",
      urgency: "normal"
    }
  ];

  const jobStats = [
    {
      title: "Aktif İlanlar",
      value: jobPostings.filter(job => job.status === 'aktif').length.toString(),
      change: "+3 bu hafta",
      icon: Briefcase,
      color: "text-teal-600",
      bgColor: "from-teal-50 to-teal-100",
      borderColor: "border-teal-200"
    },
    {
      title: "Toplam Başvuru",
      value: jobPostings.reduce((sum, job) => sum + job.application_count, 0).toString(),
      change: "+127 bu hafta",
      icon: Users,
      color: "text-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200"
    },
    {
      title: "Ortalama Görüntülenme",
      value: Math.round(jobPostings.reduce((sum, job) => sum + job.views, 0) / jobPostings.length).toString(),
      change: "+18% bu ay",
      icon: Eye,
      color: "text-green-600",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200"
    },
    {
      title: "Acil İlanlar",
      value: jobPostings.filter(job => job.urgency === 'high').length.toString(),
      change: "2 kritik",
      icon: Target,
      color: "text-red-600",
      bgColor: "from-red-50 to-red-100",
      borderColor: "border-red-200"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'aktif':
        return <Badge className="bg-green-100 text-green-800 border-green-200">🟢 Aktif</Badge>;
      case 'taslak':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">📝 Taslak</Badge>;
      case 'pasif':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">⏸️ Pasif</Badge>;
      case 'kapandı':
        return <Badge className="bg-red-100 text-red-800 border-red-200">🔒 Kapandı</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch(urgency) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">🔴 Acil</Badge>;
      case 'normal':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">🔵 Normal</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">⚪ Düşük</Badge>;
      default:
        return <Badge>-</Badge>;
    }
  };

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">İş İlanları Yönetimi</h1>
            <p className="text-gray-600">İş ilanlarınızı oluşturun, düzenleyin ve yönetin</p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <Button variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analitik Rapor
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni İlan Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Yeni İş İlanı Oluştur</DialogTitle>
                  <DialogDescription>
                    Detaylı iş ilanı bilgilerini girerek yeni pozisyon açın
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İş Unvanı</FormLabel>
                          <FormControl>
                            <Input placeholder="ör: Senior Frontend Developer" {...field} />
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
                          <FormLabel>Departman</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Departman seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yazilim">Yazılım Geliştirme</SelectItem>
                              <SelectItem value="tasarim">Tasarım</SelectItem>
                              <SelectItem value="pazarlama">Pazarlama</SelectItem>
                              <SelectItem value="ik">İnsan Kaynakları</SelectItem>
                              <SelectItem value="finans">Finans</SelectItem>
                              <SelectItem value="altyapi">Altyapı</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lokasyon</FormLabel>
                          <FormControl>
                            <Input placeholder="ör: İstanbul - Maslak" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employment_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Çalışma Şekli</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Çalışma şekli seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="full-time">Tam Zamanlı</SelectItem>
                              <SelectItem value="part-time">Yarı Zamanlı</SelectItem>
                              <SelectItem value="contract">Sözleşmeli</SelectItem>
                              <SelectItem value="remote">Uzaktan</SelectItem>
                              <SelectItem value="hybrid">Hibrit</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experience_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deneyim Seviyesi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Deneyim seviyesi seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="junior">Junior (0-2 yıl)</SelectItem>
                              <SelectItem value="mid">Mid-Level (2-5 yıl)</SelectItem>
                              <SelectItem value="senior">Senior (5+ yıl)</SelectItem>
                              <SelectItem value="lead">Team Lead</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="salary_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min. Maaş (₺)</FormLabel>
                            <FormControl>
                              <Input placeholder="15000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="salary_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max. Maaş (₺)</FormLabel>
                            <FormControl>
                              <Input placeholder="25000" {...field} />
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
                        <FormItem className="md:col-span-2">
                          <FormLabel>İş Tanımı</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Pozisyonun detaylı açıklaması, sorumluluklar ve beklentiler..."
                              className="min-h-[100px]"
                              {...field} 
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
                        <FormItem className="md:col-span-2">
                          <FormLabel>Gereksinimler</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Teknik beceriler, deneyim gereksinimleri, eğitim durumu..."
                              className="min-h-[80px]"
                              {...field} 
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
                        <FormItem className="md:col-span-2">
                          <FormLabel>Yan Haklar ve Imkanlar</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Sağlık sigortası, esnek çalışma, eğitim desteği..."
                              className="min-h-[60px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline">Taslak Kaydet</Button>
                      <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                        İlanı Yayınla
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {jobStats.map((stat, index) => (
            <Card key={index} className={`bg-gradient-to-r ${stat.bgColor} ${stat.borderColor} hover:shadow-md transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-white border-gray-200 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="İlan başlığı, departman ara..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="aktif">Aktif İlanlar</SelectItem>
                  <SelectItem value="taslak">Taslak İlanlar</SelectItem>
                  <SelectItem value="pasif">Pasif İlanlar</SelectItem>
                  <SelectItem value="kapandı">Kapanmış İlanlar</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Departman seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Departmanlar</SelectItem>
                  <SelectItem value="Yazılım Geliştirme">Yazılım Geliştirme</SelectItem>
                  <SelectItem value="Tasarım">Tasarım</SelectItem>
                  <SelectItem value="Pazarlama">Pazarlama</SelectItem>
                  <SelectItem value="Altyapı">Altyapı</SelectItem>
                  <SelectItem value="Ürün Yönetimi">Ürün Yönetimi</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Search className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Aktif İlanlar ({jobPostings.filter(job => job.status === 'aktif').length})</TabsTrigger>
            <TabsTrigger value="draft">Taslaklar ({jobPostings.filter(job => job.status === 'taslak').length})</TabsTrigger>
            <TabsTrigger value="inactive">Pasif ({jobPostings.filter(job => job.status === 'pasif').length})</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="grid gap-6">
              {filteredJobs.filter(job => job.status === 'aktif').map((job) => (
                <Card key={job.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                            <p className="text-teal-600 font-medium">{job.department}</p>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {getStatusBadge(job.status)}
                            {getUrgencyBadge(job.urgency)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline" className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {job.application_count} başvuru
                          </Badge>
                          <Badge variant="outline" className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {job.views} görüntülenme
                          </Badge>
                          <Badge variant="outline" className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(job.posted_date).toLocaleDateString('tr-TR')}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Pozisyon Detayları</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Çalışma Şekli:</strong> {job.employment_type}</p>
                          <p><strong>Deneyim:</strong> {job.experience_level}</p>
                          <p className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                            <strong>{job.salary_range}</strong>
                          </p>
                          <p className="text-xs text-gray-600 mt-2">{job.requirements}</p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm" className="text-teal-600 border-teal-300 hover:bg-teal-50">
                          <Eye className="h-4 w-4 mr-2" />
                          İlanı Görüntüle
                        </Button>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                          <Edit className="h-4 w-4 mr-2" />
                          Düzenle
                        </Button>
                        <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50">
                          <Users className="h-4 w-4 mr-2" />
                          Başvuruları Gör
                        </Button>
                        <div className="text-xs text-gray-500 mt-2">
                          Güncelleme: {new Date(job.posted_date).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Yan Haklar:</strong> {job.benefits}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="draft" className="space-y-6">
            <div className="grid gap-6">
              {filteredJobs.filter(job => job.status === 'taslak').map((job) => (
                <Card key={job.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-teal-600">{job.department}</p>
                      </div>
                      {getStatusBadge(job.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{job.description}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        Tamamla & Yayınla
                      </Button>
                      <Button variant="outline" size="sm">
                        Düzenle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-6">
            <div className="grid gap-6">
              {filteredJobs.filter(job => job.status === 'pasif').map((job) => (
                <Card key={job.id} className="border-l-4 border-l-gray-400">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-teal-600">{job.department}</p>
                      </div>
                      {getStatusBadge(job.status)}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Toplam Başvuru: {job.application_count}</p>
                      <p>Görüntülenme: {job.views}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>İlan Performansı</CardTitle>
                  <CardDescription>Son 30 gün istatistikleri</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>En çok başvuru alan ilan:</span>
                      <span className="font-medium">Frontend Developer (89 başvuru)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>En çok görüntülenen:</span>
                      <span className="font-medium">Frontend Developer (421 görüntülenme)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ortalama başvuru oranı:</span>
                      <span className="font-medium">%21.1</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Departman Dağılımı</CardTitle>
                  <CardDescription>Aktif ilanların departman bazlı dağılımı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Yazılım Geliştirme</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded">
                          <div className="w-16 h-2 bg-teal-500 rounded"></div>
                        </div>
                        <span className="text-sm">2 ilan</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tasarım</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded">
                          <div className="w-10 h-2 bg-blue-500 rounded"></div>
                        </div>
                        <span className="text-sm">1 ilan</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Altyapı</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded">
                          <div className="w-10 h-2 bg-green-500 rounded"></div>
                        </div>
                        <span className="text-sm">1 ilan</span>
                      </div>
                    </div>
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