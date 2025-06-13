import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { FileText, Users, Clock, CheckCircle, Plus, Search, Eye, Star, Calendar, MessageSquare, Download, Phone, Mail, GraduationCap, Briefcase, Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useState } from "react";

const evaluationSchema = z.object({
  candidateId: z.string().min(1, "Aday seçimi gereklidir"),
  position: z.string().min(1, "Pozisyon gereklidir"),
  rating: z.string().min(1, "Değerlendirme puanı gereklidir"),
  notes: z.string().min(1, "Notlar gereklidir"),
  recommendation: z.string().min(1, "Öneri gereklidir")
});

export default function ApplicationEvaluationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");

  const form = useForm<z.infer<typeof evaluationSchema>>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      candidateId: "",
      position: "",
      rating: "",
      notes: "",
      recommendation: ""
    }
  });

  const applications = [
    {
      id: 1,
      candidateName: "Mehmet Aydın",
      email: "mehmet.aydin@email.com",
      phone: "+90 532 123 4567",
      position: "Senior Frontend Developer",
      applicationDate: "2024-06-10",
      experience: "5 yıl",
      education: "Bilgisayar Mühendisliği - İTÜ",
      status: "değerlendirme_aşamasında",
      cvScore: 85,
      skills: ["React", "TypeScript", "Next.js", "GraphQL"],
      expectedSalary: "₺25.000",
      availability: "1 ay",
      rating: null,
      phase: "cv_inceleme",
      notes: "Güçlü teknik beceriler, açık kaynak projelere katkı",
      interviewCount: 0,
      lastActivity: "2024-06-12"
    },
    {
      id: 2,
      candidateName: "Ayşe Kara",
      email: "ayse.kara@email.com",
      phone: "+90 533 456 7890",
      position: "UX Designer",
      applicationDate: "2024-06-08",
      experience: "3 yıl",
      education: "Endüstriyel Tasarım - Mimar Sinan GSÜ",
      status: "mülakat_bekliyor",
      cvScore: 92,
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
      expectedSalary: "₺18.000",
      availability: "2 hafta",
      rating: 4.2,
      phase: "telefon_görüşmesi",
      notes: "Yaratıcı portfolio, kullanıcı deneyimi odaklı",
      interviewCount: 1,
      lastActivity: "2024-06-11"
    },
    {
      id: 3,
      candidateName: "Emre Yılmaz",
      email: "emre.yilmaz@email.com",
      phone: "+90 534 789 0123",
      position: "DevOps Engineer",
      applicationDate: "2024-06-05",
      experience: "4 yıl",
      education: "Yazılım Mühendisliği - ODTÜ",
      status: "teklif_aşamasında",
      cvScore: 88,
      skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
      expectedSalary: "₺22.000",
      availability: "Hemen",
      rating: 4.7,
      phase: "son_görüşme",
      notes: "Güçlü DevOps deneyimi, sertifikalar mevcut",
      interviewCount: 3,
      lastActivity: "2024-06-13"
    },
    {
      id: 4,
      candidateName: "Seda Öztürk",
      email: "seda.ozturk@email.com",
      phone: "+90 535 012 3456",
      position: "Product Manager",
      applicationDate: "2024-06-12",
      experience: "6 yıl",
      education: "İşletme - Boğaziçi Üniversitesi",
      status: "red",
      cvScore: 78,
      skills: ["Product Strategy", "Agile", "Analytics", "Stakeholder Management"],
      expectedSalary: "₺30.000",
      availability: "1.5 ay",
      rating: 3.1,
      phase: "son_görüşme",
      notes: "Deneyim uygun ancak maaş beklentisi yüksek",
      interviewCount: 2,
      lastActivity: "2024-06-12"
    },
    {
      id: 5,
      candidateName: "Can Demir",
      email: "can.demir@email.com",
      phone: "+90 536 345 6789",
      position: "Backend Developer",
      applicationDate: "2024-06-07",
      experience: "2 yıl",
      education: "Bilgisayar Mühendisliği - Hacettepe",
      status: "onaylandı",
      cvScore: 90,
      skills: ["Node.js", "Python", "PostgreSQL", "Redis"],
      expectedSalary: "₺16.000",
      availability: "3 hafta",
      rating: 4.5,
      phase: "teklif_gönderildi",
      notes: "Junior seviye, güçlü potansiyel",
      interviewCount: 2,
      lastActivity: "2024-06-13"
    }
  ];

  const evaluationStats = [
    {
      title: "Toplam Başvuru",
      value: applications.length.toString(),
      trend: "+12 bu hafta",
      icon: FileText,
      color: "text-teal-600",
      bgColor: "from-teal-50 to-teal-100",
      borderColor: "border-teal-200"
    },
    {
      title: "Değerlendirme Bekliyor",
      value: applications.filter(app => app.status === 'değerlendirme_aşamasında').length.toString(),
      trend: "+3 bugün",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-200"
    },
    {
      title: "Onaylanan",
      value: applications.filter(app => app.status === 'onaylandı').length.toString(),
      trend: "+1 bu hafta",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200"
    },
    {
      title: "Ortalama Puan",
      value: "4.2",
      trend: "+0.3 bu ay",
      icon: Star,
      color: "text-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200"
    }
  ];

  const onSubmit = (values: z.infer<typeof evaluationSchema>) => {
    console.log(values);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'değerlendirme_aşamasında':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">🔄 Değerlendiriliyor</Badge>;
      case 'mülakat_bekliyor':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⏳ Mülakat Bekliyor</Badge>;
      case 'teklif_aşamasında':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">💼 Teklif Aşaması</Badge>;
      case 'onaylandı':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Onaylandı</Badge>;
      case 'red':
        return <Badge className="bg-red-100 text-red-800 border-red-200">❌ Red</Badge>;
      default:
        return <Badge>Belirsiz</Badge>;
    }
  };

  const getPhaseText = (phase: string) => {
    switch(phase) {
      case 'cv_inceleme': return 'CV İnceleme';
      case 'telefon_görüşmesi': return 'Telefon Görüşmesi';
      case 'teknik_mülakat': return 'Teknik Mülakat';
      case 'son_görüşme': return 'Son Görüşme';
      case 'teklif_gönderildi': return 'Teklif Gönderildi';
      default: return phase;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesPosition = positionFilter === "all" || app.position === positionFilter;
    return matchesSearch && matchesStatus && matchesPosition;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Başvuru Değerlendirme</h1>
            <p className="text-gray-600">Aday başvurularını değerlendirin ve süreç yönetimi yapın</p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <Button variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50">
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Değerlendirme
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {evaluationStats.map((stat, index) => (
            <Card key={index} className={`bg-gradient-to-r ${stat.bgColor} ${stat.borderColor} hover:shadow-md transition-shadow`}>
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

        {/* Filters */}
        <Card className="bg-white border-gray-200 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Aday adı, pozisyon ara..." 
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
                  <SelectItem value="değerlendirme_aşamasında">Değerlendiriliyor</SelectItem>
                  <SelectItem value="mülakat_bekliyor">Mülakat Bekliyor</SelectItem>
                  <SelectItem value="teklif_aşamasında">Teklif Aşaması</SelectItem>
                  <SelectItem value="onaylandı">Onaylandı</SelectItem>
                  <SelectItem value="red">Reddedildi</SelectItem>
                </SelectContent>
              </Select>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pozisyon seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Pozisyonlar</SelectItem>
                  <SelectItem value="Senior Frontend Developer">Senior Frontend Developer</SelectItem>
                  <SelectItem value="UX Designer">UX Designer</SelectItem>
                  <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                  <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Filter className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Bekleyen ({applications.filter(app => app.status === 'değerlendirme_aşamasında' || app.status === 'mülakat_bekliyor').length})</TabsTrigger>
            <TabsTrigger value="evaluated">Değerlendirilen ({applications.filter(app => app.status === 'teklif_aşamasında').length})</TabsTrigger>
            <TabsTrigger value="approved">Onaylanan ({applications.filter(app => app.status === 'onaylandı').length})</TabsTrigger>
            <TabsTrigger value="rejected">Red Edilen ({applications.filter(app => app.status === 'red').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <div className="grid gap-6">
              {filteredApplications.filter(app => app.status === 'değerlendirme_aşamasında' || app.status === 'mülakat_bekliyor').map((app) => (
                <Card key={app.id} className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{app.candidateName}</h3>
                            <p className="text-teal-600 font-medium">{app.position}</p>
                            <p className="text-sm text-gray-600">Başvuru: {new Date(app.applicationDate).toLocaleDateString('tr-TR')}</p>
                          </div>
                          <div className="flex gap-2">
                            {getStatusBadge(app.status)}
                            <Badge variant="outline">{getPhaseText(app.phase)}</Badge>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {app.email}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {app.phone}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            {app.education}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Briefcase className="h-4 w-4 mr-2" />
                            {app.experience} deneyim
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Yetenekler</h4>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {app.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>CV Puanı</span>
                              <span className={`font-medium ${getScoreColor(app.cvScore)}`}>
                                {app.cvScore}/100
                              </span>
                            </div>
                            <Progress value={app.cvScore} className="h-2" />
                          </div>
                          <p className="text-sm text-gray-600">
                            <strong>Beklenti:</strong> {app.expectedSalary}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm" className="text-teal-600 border-teal-300 hover:bg-teal-50">
                          <Eye className="h-4 w-4 mr-2" />
                          CV Görüntüle
                        </Button>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Mesaj Gönder
                        </Button>
                        <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50">
                          <Calendar className="h-4 w-4 mr-2" />
                          Mülakat Planla
                        </Button>
                        <div className="text-xs text-gray-500 mt-2">
                          Son aktivite: {new Date(app.lastActivity).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>

                    {app.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Notlar:</strong> {app.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="evaluated" className="space-y-6">
            <div className="grid gap-6">
              {filteredApplications.filter(app => app.status === 'teklif_aşamasında').map((app) => (
                <Card key={app.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{app.candidateName}</h3>
                        <p className="text-teal-600">{app.position}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Mülakat Puanı: {app.rating}/5</p>
                      <p>CV Puanı: {app.cvScore}/100</p>
                      <p>Beklenen Maaş: {app.expectedSalary}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            <div className="grid gap-6">
              {filteredApplications.filter(app => app.status === 'onaylandı').map((app) => (
                <Card key={app.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{app.candidateName}</h3>
                        <p className="text-teal-600">{app.position}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Final Puanı: {app.rating}/5</p>
                      <p>Beklenen Maaş: {app.expectedSalary}</p>
                      <p>Başlayabilir: {app.availability}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            <div className="grid gap-6">
              {filteredApplications.filter(app => app.status === 'red').map((app) => (
                <Card key={app.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{app.candidateName}</h3>
                        <p className="text-teal-600">{app.position}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Son Puan: {app.rating}/5</p>
                      <p>Red Nedeni: {app.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}