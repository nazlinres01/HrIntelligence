import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { BookOpen, GraduationCap, Clock, Plus, Search, Download, Users, Calendar, Award, Target, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const trainingSchema = z.object({
  title: z.string().min(3, "Eğitim başlığı en az 3 karakter olmalı"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalı"),
  category: z.string().min(1, "Kategori seçimi gerekli"),
  type: z.string().min(1, "Eğitim türü seçimi gerekli"),
  instructor: z.string().min(2, "Eğitmen adı gerekli"),
  duration: z.number().min(1, "Süre en az 1 saat olmalı"),
  capacity: z.number().min(1, "Kapasite en az 1 kişi olmalı"),
  startDate: z.string().min(1, "Başlangıç tarihi gerekli"),
  endDate: z.string().min(1, "Bitiş tarihi gerekli"),
  location: z.string().min(2, "Lokasyon bilgisi gerekli"),
  requirements: z.string().optional(),
  objectives: z.string().min(10, "Eğitim hedefleri gerekli")
});

type TrainingFormData = z.infer<typeof trainingSchema>;

const enrollmentSchema = z.object({
  trainingId: z.string().min(1, "Eğitim seçimi gerekli"),
  employeeIds: z.array(z.string()).min(1, "En az bir çalışan seçilmeli")
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

const trainingCategories = [
  { value: "technical", label: "Teknik Eğitimler" },
  { value: "soft-skills", label: "Kişisel Gelişim" },
  { value: "leadership", label: "Liderlik" },
  { value: "compliance", label: "Uyum ve Mevzuat" },
  { value: "safety", label: "İş Güvenliği" },
  { value: "customer-service", label: "Müşteri Hizmetleri" },
  { value: "sales", label: "Satış ve Pazarlama" },
  { value: "finance", label: "Finans ve Muhasebe" }
];

const trainingTypes = [
  { value: "online", label: "Online Eğitim" },
  { value: "classroom", label: "Sınıf Eğitimi" },
  { value: "workshop", label: "Atölye Çalışması" },
  { value: "seminar", label: "Seminer" },
  { value: "conference", label: "Konferans" },
  { value: "certification", label: "Sertifikasyon" }
];

const statusColors = {
  planned: "bg-blue-100 text-blue-800",
  ongoing: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800"
};

const statusLabels = {
  planned: "Planlandı",
  ongoing: "Devam Ediyor",
  completed: "Tamamlandı",
  cancelled: "İptal Edildi"
};

export default function Training() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);
  const [isEnrollmentDialogOpen, setIsEnrollmentDialogOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const trainingForm = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      type: "",
      instructor: "",
      duration: 1,
      capacity: 20,
      startDate: "",
      endDate: "",
      location: "",
      requirements: "",
      objectives: ""
    }
  });

  const enrollmentForm = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      trainingId: "",
      employeeIds: []
    }
  });

  // Fetch trainings
  const { data: trainings = [], isLoading: trainingsLoading } = useQuery({
    queryKey: ["/api/trainings"]
  });

  // Fetch employees for enrollment
  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"]
  });

  // Fetch training enrollments
  const { data: enrollments = [] } = useQuery({
    queryKey: ["/api/training-enrollments"]
  });

  // Training statistics
  const trainingStats = React.useMemo(() => {
    const total = trainings.length;
    const ongoing = trainings.filter((t: any) => t.status === 'ongoing').length;
    const completed = trainings.filter((t: any) => t.status === 'completed').length;
    const planned = trainings.filter((t: any) => t.status === 'planned').length;
    const totalEnrollments = enrollments.length;
    const completionRate = enrollments.length > 0 
      ? ((enrollments.filter((e: any) => e.completed).length / enrollments.length) * 100).toFixed(1)
      : 0;
    
    return { total, ongoing, completed, planned, totalEnrollments, completionRate };
  }, [trainings, enrollments]);

  // Filter trainings
  const filteredTrainings = React.useMemo(() => {
    return trainings.filter((training: any) => {
      const matchesSearch = training.title?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           training.instructor?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           training.description?.toLowerCase()?.includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || training.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [trainings, searchTerm, categoryFilter]);

  // Create training mutation
  const createTrainingMutation = useMutation({
    mutationFn: async (data: TrainingFormData) => {
      const response = await apiRequest("POST", "/api/trainings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trainings"] });
      toast({
        title: "Eğitim programı oluşturuldu",
        description: "Eğitim başarıyla kaydedildi."
      });
      setIsTrainingDialogOpen(false);
      trainingForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Eğitim programı oluşturulurken hata oluştu",
        variant: "destructive"
      });
    }
  });

  // Enroll employees mutation
  const enrollEmployeesMutation = useMutation({
    mutationFn: async (data: EnrollmentFormData) => {
      const response = await apiRequest("POST", "/api/training-enrollments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training-enrollments"] });
      toast({
        title: "Çalışanlar eğitime kaydedildi",
        description: "Kayıt işlemi başarıyla tamamlandı."
      });
      setIsEnrollmentDialogOpen(false);
      enrollmentForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Kayıt işlemi sırasında hata oluştu",
        variant: "destructive"
      });
    }
  });

  const handleTrainingSubmit = (data: TrainingFormData) => {
    createTrainingMutation.mutate(data);
  };

  const handleEnrollmentSubmit = (data: EnrollmentFormData) => {
    enrollEmployeesMutation.mutate(data);
  };

  const openEnrollmentDialog = (training: any) => {
    setSelectedTraining(training);
    enrollmentForm.setValue("trainingId", training.id);
    setIsEnrollmentDialogOpen(true);
  };

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
            <h1 className="text-3xl font-light text-gray-900 mb-2">Eğitim ve Gelişim</h1>
            <p className="text-gray-600">Çalışan eğitim programlarını yönetin ve takip edin</p>
          </div>
          <div className="flex space-x-3">
            <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Eğitim
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Toplam Eğitim</CardTitle>
              <BookOpen className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{trainingStats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Planlandı</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{trainingStats.planned}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Devam Ediyor</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{trainingStats.ongoing}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tamamlandı</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{trainingStats.completed}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Katılımcı</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{trainingStats.totalEnrollments}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tamamlama %</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{trainingStats.completionRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-gray-200 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Eğitim adı, eğitmen veya açıklama ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-300"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 bg-white border-gray-300">
                  <SelectValue placeholder="Kategori filtrele" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {trainingCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-gray-300">
                <Download className="h-4 w-4 mr-2" />
                Rapor İndir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Training Programs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTrainings.map((training: any) => (
            <Card key={training.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900 mb-2">{training.title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={statusColors[training.status as keyof typeof statusColors]}>
                        {statusLabels[training.status as keyof typeof statusLabels]}
                      </Badge>
                      <Badge variant="outline" className="border-gray-300">
                        {trainingCategories.find(c => c.value === training.category)?.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <CardDescription className="text-gray-600">
                  {training.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Eğitmen:</span>
                    <p className="font-medium text-gray-900">{training.instructor}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Süre:</span>
                    <p className="font-medium text-gray-900">{training.duration} saat</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Lokasyon:</span>
                    <p className="font-medium text-gray-900">{training.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Kapasite:</span>
                    <p className="font-medium text-gray-900">{training.capacity} kişi</p>
                  </div>
                </div>

                {training.startDate && training.endDate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(training.startDate), 'dd MMM yyyy', { locale: tr })} - 
                      {format(new Date(training.endDate), 'dd MMM yyyy', { locale: tr })}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm">
                    <span className="text-gray-500">Kayıtlı: </span>
                    <span className="font-medium text-gray-900">
                      {enrollments.filter((e: any) => e.trainingId === training.id).length} / {training.capacity}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => openEnrollmentDialog(training)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Katılımcı Ekle
                  </Button>
                </div>

                {training.objectives && (
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Eğitim Hedefleri:</h4>
                    <p className="text-sm text-gray-600">{training.objectives}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {filteredTrainings.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Henüz eğitim programı bulunmuyor</p>
            </div>
          )}
        </div>

        {/* Training Form Dialog */}
        <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
          <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Yeni Eğitim Programı</DialogTitle>
              <DialogDescription className="text-gray-600">
                Yeni bir eğitim programı oluşturun
              </DialogDescription>
            </DialogHeader>
            <Form {...trainingForm}>
              <form onSubmit={trainingForm.handleSubmit(handleTrainingSubmit)} className="space-y-6">
                <FormField
                  control={trainingForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Eğitim Başlığı</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white border-gray-300" placeholder="Eğitim programının adı" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={trainingForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Açıklama</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          className="bg-white border-gray-300 min-h-[80px]"
                          placeholder="Eğitim hakkında detaylı bilgi"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={trainingForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Kategori</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-gray-300">
                              <SelectValue placeholder="Kategori seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            {trainingCategories.map((category) => (
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
                    control={trainingForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Eğitim Türü</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-gray-300">
                              <SelectValue placeholder="Tür seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            {trainingTypes.map((type) => (
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
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={trainingForm.control}
                    name="instructor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Eğitmen</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white border-gray-300" placeholder="Eğitmen adı" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={trainingForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Süre (saat)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="bg-white border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={trainingForm.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Kapasite</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="bg-white border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={trainingForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Başlangıç Tarihi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="bg-white border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={trainingForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Bitiş Tarihi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="bg-white border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={trainingForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Lokasyon</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white border-gray-300" placeholder="Eğitim yeri" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={trainingForm.control}
                  name="objectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Eğitim Hedefleri</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          className="bg-white border-gray-300 min-h-[80px]"
                          placeholder="Bu eğitimin hedefleri ve beklenen kazanımlar"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={trainingForm.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Ön Gereksinimler (Opsiyonel)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          className="bg-white border-gray-300 min-h-[60px]"
                          placeholder="Eğitime katılabilmek için gerekli ön koşullar"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsTrainingDialogOpen(false)}
                    className="border-gray-300"
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={createTrainingMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {createTrainingMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Enrollment Dialog */}
        <Dialog open={isEnrollmentDialogOpen} onOpenChange={setIsEnrollmentDialogOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Çalışan Kaydı</DialogTitle>
              <DialogDescription className="text-gray-600">
                {selectedTraining?.title} eğitimine katılacak çalışanları seçin
              </DialogDescription>
            </DialogHeader>
            <Form {...enrollmentForm}>
              <form onSubmit={enrollmentForm.handleSubmit(handleEnrollmentSubmit)} className="space-y-4">
                <FormField
                  control={enrollmentForm.control}
                  name="employeeIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Çalışanlar</FormLabel>
                      <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3 bg-white">
                        {employees.map((employee: any) => (
                          <div key={employee.id} className="flex items-center space-x-2 py-2">
                            <input
                              type="checkbox"
                              id={employee.id}
                              checked={field.value.includes(employee.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([...field.value, employee.id]);
                                } else {
                                  field.onChange(field.value.filter((id: string) => id !== employee.id));
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <label htmlFor={employee.id} className="text-sm text-gray-700 cursor-pointer">
                              {employee.firstName} {employee.lastName} - {employee.department?.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEnrollmentDialogOpen(false)}
                    className="border-gray-300"
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={enrollEmployeesMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {enrollEmployeesMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}