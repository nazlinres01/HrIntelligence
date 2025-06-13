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
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Download,
  TrendingUp,
  Users,
  Target,
  Award,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  PlayCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const trainingSchema = z.object({
  title: z.string().min(1, "Eğitim başlığı gerekli"),
  description: z.string().min(10, "En az 10 karakter açıklama gerekli"),
  instructor: z.string().min(1, "Eğitmen adı gerekli"),
  category: z.string().min(1, "Kategori seçimi gerekli"),
  duration: z.string().min(1, "Süre belirtilmelidir"),
  startDate: z.string().min(1, "Başlangıç tarihi gerekli"),
  endDate: z.string().min(1, "Bitiş tarihi gerekli"),
  maxParticipants: z.string().min(1, "Maksimum katılımcı sayısı gerekli"),
  location: z.string().min(1, "Konum bilgisi gerekli"),
  requirements: z.string().optional(),
  objectives: z.string().min(10, "En az 10 karakter hedef açıklaması gerekli"),
  status: z.string().default("scheduled")
});

type TrainingFormData = z.infer<typeof trainingSchema>;

export default function TrainingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Demo training programs data
  const demoTrainings = [
    {
      id: 1,
      title: "Liderlik Geliştirme Programı",
      description: "Orta seviye yöneticiler için liderlik becerileri geliştirme ve takım yönetimi",
      instructor: "Dr. Mehmet Özkan",
      category: "leadership",
      duration: "4 hafta",
      startDate: "2024-12-20",
      endDate: "2025-01-15",
      maxParticipants: 20,
      location: "Eğitim Salonu A",
      status: "enrollment_open",
      requirements: "En az 1 yıl yöneticilik deneyimi",
      objectives: "Liderlik temelleri, takım yönetimi, iletişim becerileri",
      enrolledCount: 15,
      budget: "45.000 TL",
      materials: ["Liderlik El Kitabı", "Vaka Analizi Dokümanları", "Değerlendirme Formları"],
      schedule: [
        { day: "Pazartesi", time: "09:00-12:00", topic: "Liderlik Temelleri" },
        { day: "Çarşamba", time: "14:00-17:00", topic: "Takım Yönetimi" },
        { day: "Cuma", time: "09:00-12:00", topic: "İletişim Becerileri" }
      ]
    },
    {
      id: 2,
      title: "Dijital Dönüşüm Eğitimi",
      description: "Tüm çalışanlar için dijital araçlar ve süreçler eğitimi",
      instructor: "Ayşe Kara",
      category: "technical",
      duration: "3 hafta",
      startDate: "2024-12-25",
      endDate: "2025-01-10",
      maxParticipants: 35,
      location: "Online",
      status: "ongoing",
      requirements: "Temel bilgisayar kullanım bilgisi",
      objectives: "Dijital araçlara giriş, süreç otomasyonu, veri analizi temelleri",
      enrolledCount: 32,
      budget: "25.000 TL",
      materials: ["Dijital Araçlar Rehberi", "Online Platform Erişimi", "Sertifika"],
      schedule: [
        { day: "Salı", time: "10:00-12:00", topic: "Dijital Araçlara Giriş" },
        { day: "Perşembe", time: "14:00-16:00", topic: "Süreç Otomasyonu" },
        { day: "Cumartesi", time: "09:00-11:00", topic: "Veri Analizi Temelleri" }
      ]
    },
    {
      id: 3,
      title: "İletişim Becerileri Atölyesi",
      description: "Etkili iletişim teknikleri ve sunum becerileri geliştirme",
      instructor: "Prof. Dr. Zeynep Yıldız",
      category: "communication",
      duration: "2 gün",
      startDate: "2024-06-10",
      endDate: "2024-06-11",
      maxParticipants: 25,
      location: "Merkez Ofis - Konferans Salonu",
      status: "completed",
      requirements: "Tüm çalışanlar katılabilir",
      objectives: "Beden dili, ses tonlama, sunum hazırlama, soru-cevap yönetimi, empati kurma",
      enrolledCount: 23,
      budget: "15.000 TL",
      materials: ["İletişim Teknikleri Rehberi", "Sunum Şablonları", "Değerlendirme Formu"],
      schedule: [
        { day: "Pazartesi", time: "09:00-12:00", topic: "Etkili İletişim Temelleri" },
        { day: "Salı", time: "13:00-17:00", topic: "Sunum Teknikleri ve Uygulaması" }
      ]
    },
    {
      id: 4,
      title: "Siber Güvenlik Farkındalığı ve Veri Koruma",
      description: "KVKK uyumu, siber tehdidler, güvenli çalışma pratikleri ve veri koruma",
      instructor: "Uzm. Ahmet Yılmaz",
      category: "compliance",
      duration: "1 gün",
      startDate: "2024-06-25",
      endDate: "2024-06-25",
      maxParticipants: 50,
      location: "Online - Zoom Platformu",
      status: "scheduled",
      requirements: "Zorunlu eğitim - tüm personel",
      objectives: "KVKK mevzuatı, güvenli şifre oluşturma, phishing saldırıları, güvenli dosya paylaşımı",
      enrolledCount: 45,
      budget: "8.000 TL",
      materials: ["KVKK Rehberi", "Siber Güvenlik El Kitabı", "Online Test Platformu"],
      schedule: [
        { day: "Salı", time: "09:00-12:00", topic: "KVKK Mevzuatı ve Uygulamaları" },
        { day: "Salı", time: "14:00-17:00", topic: "Siber Güvenlik Tehditleri ve Korunma Yöntemleri" }
      ]
    },
    {
      id: 5,
      title: "Agile ve Scrum Metodolojileri",
      description: "Çevik proje yönetimi, Scrum framework'ü ve iterative development süreçleri",
      instructor: "Sertifikalı Scrum Master - Can Arslan",
      category: "technical",
      duration: "3 gün",
      startDate: "2024-07-08",
      endDate: "2024-07-10",
      maxParticipants: 18,
      location: "Proje Yönetimi Merkezi",
      status: "scheduled",
      requirements: "Proje yönetimi deneyimi, temel Agile bilgisi",
      objectives: "Scrum rolleri, sprint planlama, retrospektif toplantıları, backlog yönetimi",
      enrolledCount: 8,
      budget: "22.000 TL",
      materials: ["Scrum Guide Kitabı", "Agile Methodologies Kılavuzu", "Sprint Planning Şablonları"],
      schedule: [
        { day: "Pazartesi", time: "09:00-17:00", topic: "Agile Temeleri ve Scrum Framework" },
        { day: "Salı", time: "09:00-17:00", topic: "Sprint Planlama ve Backlog Yönetimi" },
        { day: "Çarşamba", time: "09:00-17:00", topic: "Retrospektif ve Sürekli İyileştirme" }
      ]
    },
    {
      id: 6,
      title: "İş Güvenliği ve Risk Yönetimi",
      description: "İş sağlığı güvenliği mevzuatı, risk analizi ve acil durum müdahale prosedürleri",
      instructor: "İSG Uzmanı - Fatma Demir",
      category: "safety",
      duration: "1 gün",
      startDate: "2024-06-05",
      endDate: "2024-06-05",
      maxParticipants: 30,
      location: "Güvenlik Eğitim Merkezi",
      status: "completed",
      requirements: "Zorunlu eğitim - saha çalışanları",
      objectives: "İSG mevzuatı, kişisel koruyucu donanım, acil durum prosedürleri, risk değerlendirmesi",
      enrolledCount: 28,
      budget: "12.000 TL",
      materials: ["İSG Mevzuat Kitabı", "Risk Değerlendirme Formları", "Acil Durum Rehberi"],
      schedule: [
        { day: "Çarşamba", time: "09:00-12:00", topic: "İSG Mevzuatı ve Temel Kurallar" },
        { day: "Çarşamba", time: "14:00-17:00", topic: "Risk Analizi ve Acil Durum Prosedürleri" }
      ]
    },
    {
      id: 7,
      title: "Duygusal Zeka ve Stres Yönetimi",
      description: "İş hayatında duygusal zeka, stresle başa çıkma teknikleri ve mental sağlık",
      instructor: "Psikolog - Dr. Elif Yıldız",
      category: "soft-skills",
      duration: "2 gün",
      startDate: "2024-07-22",
      endDate: "2024-07-23",
      maxParticipants: 20,
      location: "Wellness Merkezi",
      status: "scheduled",
      requirements: "Gönüllü katılım",
      objectives: "Duygusal öz-farkındalık, stres faktörleri, mindfulness teknikleri, iş-yaşam dengesi",
      enrolledCount: 16,
      budget: "18.000 TL",
      materials: ["Duygusal Zeka Kitabı", "Mindfulness Egzersiz Rehberi", "Stres Yönetimi Araçları"],
      schedule: [
        { day: "Pazartesi", time: "09:00-12:00", topic: "Duygusal Zeka ve Öz-Farkındalık" },
        { day: "Pazartesi", time: "14:00-17:00", topic: "Stres Yönetimi Teknikleri" },
        { day: "Salı", time: "09:00-12:00", topic: "Mindfulness ve Meditasyon" },
        { day: "Salı", time: "14:00-17:00", topic: "İş-Yaşam Dengesi ve Uygulama" }
      ]
    },
    {
      id: 8,
      title: "Proje Yönetimi ve Planlama",
      description: "Etkili proje yönetimi, zaman planlama ve kaynak optimizasyonu",
      instructor: "PMP Sertifikalı - Murat Özdemir",
      category: "technical",
      duration: "4 gün",
      startDate: "2025-01-20",
      endDate: "2025-01-23",
      maxParticipants: 22,
      location: "Eğitim Merkezi B",
      status: "enrollment_open",
      requirements: "Temel iş deneyimi, Microsoft Project bilgisi tercih edilir",
      objectives: "Proje planlama, risk yönetimi, kaynak dağılımı, zaman yönetimi",
      enrolledCount: 9,
      budget: "35.000 TL",
      materials: ["PMP Guide Kitabı", "Microsoft Project Lisansı", "Proje Şablonları"],
      schedule: [
        { day: "Pazartesi", time: "09:00-17:00", topic: "Proje Yönetimi Temelleri" },
        { day: "Salı", time: "09:00-17:00", topic: "Proje Planlama ve Zaman Yönetimi" },
        { day: "Çarşamba", time: "09:00-17:00", topic: "Risk Yönetimi ve Kalite Kontrol" },
        { day: "Perşembe", time: "09:00-17:00", topic: "Proje Uygulama ve Kapanış" }
      ]
    },
    {
      id: 9,
      title: "Satış Teknikleri ve Müşteri İlişkileri",
      description: "Etkili satış stratejileri, müşteri analizi ve ilişki yönetimi",
      instructor: "Satış Uzmanı - Deniz Acar",
      category: "sales",
      duration: "3 gün",
      startDate: "2025-02-15",
      endDate: "2025-02-17",
      maxParticipants: 18,
      location: "Satış Eğitim Merkezi",
      status: "planning",
      requirements: "Satış deneyimi veya müşteri hizmetleri geçmişi",
      objectives: "Satış teknikleri, müşteri profilleme, CRM kullanımı, pazarlama stratejileri",
      enrolledCount: 0,
      budget: "28.000 TL",
      materials: ["Satış Teknikleri El Kitabı", "CRM Platformu Erişimi", "Rol Yapma Senaryoları"],
      schedule: [
        { day: "Cumartesi", time: "09:00-17:00", topic: "Satış Temelleri ve Müşteri Analizi" },
        { day: "Pazar", time: "09:00-17:00", topic: "İletişim ve İkna Teknikleri" },
        { day: "Pazartesi", time: "09:00-17:00", topic: "CRM ve Satış Süreci Yönetimi" }
      ]
    }
  ];

  const demoEnrollments = [
    { id: 1, trainingId: 1, userId: "emp_001", status: "enrolled" },
    { id: 2, trainingId: 1, userId: "emp_002", status: "enrolled" },
    { id: 3, trainingId: 2, userId: "emp_003", status: "enrolled" },
    { id: 4, trainingId: 3, userId: "emp_004", status: "completed" },
    { id: 5, trainingId: 4, userId: "emp_005", status: "enrolled" }
  ];

  const { data: trainings = demoTrainings, isLoading: trainingsLoading } = useQuery<any[]>({
    queryKey: ["/api/trainings"],
    initialData: demoTrainings
  });

  const { data: employees = [] } = useQuery<any[]>({
    queryKey: ["/api/employees"]
  });

  const { data: enrollments = demoEnrollments } = useQuery<any[]>({
    queryKey: ["/api/training-enrollments"],
    initialData: demoEnrollments
  });

  const form = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      title: "",
      description: "",
      instructor: "",
      category: "",
      duration: "",
      startDate: "",
      endDate: "",
      maxParticipants: "",
      location: "",
      requirements: "",
      objectives: "",
      status: "scheduled"
    }
  });

  const createTrainingMutation = useMutation({
    mutationFn: async (data: TrainingFormData) => {
      return apiRequest("POST", "/api/trainings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trainings"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Eğitim programı başarıyla oluşturuldu",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Eğitim programı oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const deleteTrainingMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/trainings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trainings"] });
      toast({
        title: "Başarılı",
        description: "Eğitim programı başarıyla silindi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Eğitim programı silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (data: TrainingFormData) => {
    createTrainingMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu eğitim programını silmek istediğinizden emin misiniz?")) {
      deleteTrainingMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'scheduled': { color: 'bg-blue-100 text-blue-800', text: 'Planlandı' },
      'enrollment_open': { color: 'bg-cyan-100 text-cyan-800', text: 'Kayıt Açık' },
      'ongoing': { color: 'bg-green-100 text-green-800', text: 'Devam Ediyor' },
      'active': { color: 'bg-green-100 text-green-800', text: 'Aktif' },
      'completed': { color: 'bg-purple-100 text-purple-800', text: 'Tamamlandı' },
      'planning': { color: 'bg-yellow-100 text-yellow-800', text: 'Planlama Aşamasında' },
      'cancelled': { color: 'bg-red-100 text-red-800', text: 'İptal Edildi' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || { color: 'bg-gray-100 text-gray-800', text: status };
    return <Badge className={statusInfo.color}>{statusInfo.text}</Badge>;
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryMap = {
      'technical': 'Teknik',
      'leadership': 'Liderlik',
      'communication': 'İletişim',
      'compliance': 'Uyum',
      'safety': 'Güvenlik',
      'soft-skills': 'Kişisel Gelişim',
      'sales': 'Satış'
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
  };

  const getEnrollmentCount = (trainingId: string) => {
    return (enrollments as any[]).filter((enrollment: any) => 
      enrollment.trainingId.toString() === trainingId.toString()
    ).length;
  };

  const filteredTrainings = (trainings as any[]).filter((training: any) => {
    const matchesSearch = training.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || training.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || training.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Analytics calculations
  const getTrainingStats = () => {
    const totalTrainings = (trainings as any[]).length;
    const activeTrainings = (trainings as any[]).filter((training: any) => training.status === 'active').length;
    const completedTrainings = (trainings as any[]).filter((training: any) => training.status === 'completed').length;
    const totalEnrollments = (enrollments as any[]).length;

    return {
      totalTrainings,
      activeTrainings,
      completedTrainings,
      totalEnrollments,
      completionRate: totalTrainings > 0 ? Math.round((completedTrainings / totalTrainings) * 100) : 0
    };
  };

  const stats = getTrainingStats();

  if (trainingsLoading) {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Eğitim & Gelişim</h1>
            <p className="text-gray-600">Çalışan eğitim programları ve gelişim fırsatları yönetimi</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-300 text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Eğitim Programı
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Yeni Eğitim Programı</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Eğitim Başlığı</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Eğitim başlığını girin"
                                {...field}
                                className="border-gray-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="instructor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Eğitmen</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Eğitmen adını girin"
                                {...field}
                                className="border-gray-300"
                              />
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
                          <FormLabel className="text-gray-700">Açıklama</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Eğitim açıklamasını yazın"
                              {...field}
                              className="border-gray-300"
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Kategori</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Kategori seçin" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="technical">Teknik</SelectItem>
                                  <SelectItem value="leadership">Liderlik</SelectItem>
                                  <SelectItem value="communication">İletişim</SelectItem>
                                  <SelectItem value="compliance">Uyum</SelectItem>
                                  <SelectItem value="safety">Güvenlik</SelectItem>
                                  <SelectItem value="soft-skills">Kişisel Gelişim</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Süre (saat)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Örn: 8"
                                {...field}
                                className="border-gray-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxParticipants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Maks. Katılımcı</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Örn: 20"
                                {...field}
                                className="border-gray-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Başlangıç Tarihi</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="border-gray-300"
                              />
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
                            <FormLabel className="text-gray-700">Bitiş Tarihi</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="border-gray-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Konum</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Örn: Toplantı Salonu A"
                                {...field}
                                className="border-gray-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="objectives"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Eğitim Hedefleri</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Eğitimin hedeflerini belirtin"
                                {...field}
                                className="border-gray-300"
                                rows={3}
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
                            <FormLabel className="text-gray-700">Ön Koşullar</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Eğitim için gerekli ön koşulları belirtin"
                                {...field}
                                className="border-gray-300"
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        className="border-gray-300 text-gray-700"
                      >
                        İptal
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createTrainingMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {createTrainingMutation.isPending ? "Oluşturuluyor..." : "Eğitim Programı Oluştur"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium mb-1">Toplam Eğitim</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalTrainings}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium mb-1">Aktif Eğitimler</p>
                  <p className="text-2xl font-bold text-green-900">{stats.activeTrainings}</p>
                </div>
                <PlayCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium mb-1">Toplam Kayıt</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.totalEnrollments}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium mb-1">Tamamlanma Oranı</p>
                  <p className="text-2xl font-bold text-orange-900">%{stats.completionRate}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Eğitim veya eğitmen ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Durum filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="enrollment_open">Kayıt Açık</SelectItem>
              <SelectItem value="ongoing">Devam Ediyor</SelectItem>
              <SelectItem value="scheduled">Planlandı</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="completed">Tamamlandı</SelectItem>
              <SelectItem value="planning">Planlama Aşamasında</SelectItem>
              <SelectItem value="cancelled">İptal Edildi</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Kategori filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              <SelectItem value="technical">Teknik</SelectItem>
              <SelectItem value="leadership">Liderlik</SelectItem>
              <SelectItem value="communication">İletişim</SelectItem>
              <SelectItem value="compliance">Uyum</SelectItem>
              <SelectItem value="safety">Güvenlik</SelectItem>
              <SelectItem value="soft-skills">Kişisel Gelişim</SelectItem>
              <SelectItem value="sales">Satış</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Training Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainings.map((training: any) => {
            const enrollmentCount = getEnrollmentCount(training.id);
            const maxParticipants = parseInt(training.maxParticipants || "0");
            const occupancyRate = maxParticipants > 0 ? Math.round((enrollmentCount / maxParticipants) * 100) : 0;
            
            return (
              <Card key={training.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 mb-2">{training.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-blue-100 text-blue-800">
                          {getCategoryDisplayName(training.category)}
                        </Badge>
                        {getStatusBadge(training.status)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{training.instructor}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{training.startDate} - {training.endDate}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{training.duration} saat</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Target className="h-4 w-4" />
                        <span>{enrollmentCount}/{training.maxParticipants} katılımcı</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-700">%{occupancyRate} dolu</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{training.description}</p>

                    <div className="flex items-center space-x-2 pt-2">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(training.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}