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
import { TrendingUp, Target, Award, Plus, Search, Download, Star, Users, BarChart3, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const performanceSchema = z.object({
  employeeId: z.string().min(1, "Çalışan seçimi gerekli"),
  period: z.string().min(1, "Değerlendirme dönemi gerekli"),
  overallScore: z.number().min(1).max(10),
  goals: z.string().min(10, "Hedefler en az 10 karakter olmalı"),
  achievements: z.string().min(10, "Başarılar en az 10 karakter olmalı"),
  areasForImprovement: z.string().min(10, "Gelişim alanları en az 10 karakter olmalı"),
  nextPeriodGoals: z.string().min(10, "Gelecek dönem hedefleri en az 10 karakter olmalı"),
  managerComments: z.string().optional(),
  skillsAssessment: z.object({
    communication: z.number().min(1).max(5),
    teamwork: z.number().min(1).max(5),
    problemSolving: z.number().min(1).max(5),
    leadership: z.number().min(1).max(5),
    technical: z.number().min(1).max(5),
    timeManagement: z.number().min(1).max(5)
  })
});

type PerformanceFormData = z.infer<typeof performanceSchema>;

const skillLabels = {
  communication: "İletişim",
  teamwork: "Takım Çalışması",
  problemSolving: "Problem Çözme",
  leadership: "Liderlik",
  technical: "Teknik Beceriler",
  timeManagement: "Zaman Yönetimi"
};

const getScoreColor = (score: number) => {
  if (score >= 8) return "text-green-600";
  if (score >= 6) return "text-yellow-600";
  return "text-red-600";
};

const getScoreLabel = (score: number) => {
  if (score >= 8) return "Mükemmel";
  if (score >= 6) return "İyi";
  if (score >= 4) return "Orta";
  return "Geliştirilmeli";
};

export default function Performance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PerformanceFormData>({
    resolver: zodResolver(performanceSchema),
    defaultValues: {
      employeeId: "",
      period: "",
      overallScore: 5,
      goals: "",
      achievements: "",
      areasForImprovement: "",
      nextPeriodGoals: "",
      managerComments: "",
      skillsAssessment: {
        communication: 3,
        teamwork: 3,
        problemSolving: 3,
        leadership: 3,
        technical: 3,
        timeManagement: 3
      }
    }
  });

  // Fetch performance records
  const { data: performances = [], isLoading: performancesLoading } = useQuery({
    queryKey: ["/api/performance"]
  });

  // Fetch employees for dropdown
  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"]
  });

  // Performance statistics
  const performanceStats = React.useMemo(() => {
    const total = performances.length;
    const excellent = performances.filter((p: any) => p.overallScore >= 8).length;
    const good = performances.filter((p: any) => p.overallScore >= 6 && p.overallScore < 8).length;
    const needsImprovement = performances.filter((p: any) => p.overallScore < 6).length;
    const avgScore = performances.length > 0 
      ? (performances.reduce((sum: number, p: any) => sum + p.overallScore, 0) / performances.length).toFixed(1)
      : 0;
    
    return { total, excellent, good, needsImprovement, avgScore };
  }, [performances]);

  // Filter performances
  const filteredPerformances = React.useMemo(() => {
    return performances.filter((performance: any) => {
      const matchesSearch = performance.employee?.firstName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           performance.employee?.lastName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           performance.period?.toLowerCase()?.includes(searchTerm.toLowerCase());
      const matchesPeriod = periodFilter === "all" || performance.period === periodFilter;
      return matchesSearch && matchesPeriod;
    });
  }, [performances, searchTerm, periodFilter]);

  // Create performance mutation
  const createPerformanceMutation = useMutation({
    mutationFn: async (data: PerformanceFormData) => {
      const response = await apiRequest("POST", "/api/performance", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performance"] });
      toast({
        title: "Performans değerlendirmesi oluşturuldu",
        description: "Değerlendirme başarıyla kaydedildi."
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Performans değerlendirmesi oluşturulurken hata oluştu",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (data: PerformanceFormData) => {
    createPerformanceMutation.mutate(data);
  };

  if (performancesLoading) {
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
            <h1 className="text-3xl font-light text-gray-900 mb-2">Performans Değerlendirme</h1>
            <p className="text-gray-600">Çalışan performansını değerlendirin ve takip edin</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Değerlendirme
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Yeni Performans Değerlendirmesi</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Çalışan için detaylı performans değerlendirmesi yapın
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Çalışan</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white border-gray-300">
                                <SelectValue placeholder="Çalışan seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              {employees.map((employee: any) => (
                                <SelectItem key={employee.id} value={employee.id}>
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
                      name="period"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Değerlendirme Dönemi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white border-gray-300">
                                <SelectValue placeholder="Dönem seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              <SelectItem value="2024-Q1">2024 - 1. Çeyrek</SelectItem>
                              <SelectItem value="2024-Q2">2024 - 2. Çeyrek</SelectItem>
                              <SelectItem value="2024-Q3">2024 - 3. Çeyrek</SelectItem>
                              <SelectItem value="2024-Q4">2024 - 4. Çeyrek</SelectItem>
                              <SelectItem value="2024-Annual">2024 - Yıllık</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="overallScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Genel Puan (1-10)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="10" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="bg-white border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Skills Assessment */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Beceri Değerlendirmesi (1-5)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(skillLabels).map(([key, label]) => (
                        <FormField
                          key={key}
                          control={form.control}
                          name={`skillsAssessment.${key as keyof typeof skillLabels}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">{label}</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1" 
                                  max="5" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="bg-white border-gray-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Dönem Hedefleri</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Bu dönemde belirlenen hedefleri açıklayın"
                            {...field}
                            className="bg-white border-gray-300 min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="achievements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Başarılar</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Çalışanın önemli başarılarını açıklayın"
                            {...field}
                            className="bg-white border-gray-300 min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="areasForImprovement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Gelişim Alanları</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Geliştirilmesi gereken alanları belirtin"
                            {...field}
                            className="bg-white border-gray-300 min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nextPeriodGoals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Gelecek Dönem Hedefleri</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Bir sonraki dönem için hedefleri belirleyin"
                            {...field}
                            className="bg-white border-gray-300 min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="managerComments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Yönetici Yorumları (Opsiyonel)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Ek yorumlar ve öneriler"
                            {...field}
                            className="bg-white border-gray-300 min-h-[80px]"
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
                      onClick={() => setIsDialogOpen(false)}
                      className="border-gray-300"
                    >
                      İptal
                    </Button>
                    <Button
                      type="submit"
                      disabled={createPerformanceMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {createPerformanceMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Toplam Değerlendirme</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{performanceStats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ortalama Puan</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{performanceStats.avgScore}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Mükemmel</CardTitle>
              <Award className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{performanceStats.excellent}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">İyi</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{performanceStats.good}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Geliştirilmeli</CardTitle>
              <Users className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{performanceStats.needsImprovement}</div>
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
                    placeholder="Çalışan adı veya dönem ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-300"
                  />
                </div>
              </div>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-48 bg-white border-gray-300">
                  <SelectValue placeholder="Dönem filtrele" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Tüm Dönemler</SelectItem>
                  <SelectItem value="2024-Q1">2024 - 1. Çeyrek</SelectItem>
                  <SelectItem value="2024-Q2">2024 - 2. Çeyrek</SelectItem>
                  <SelectItem value="2024-Q3">2024 - 3. Çeyrek</SelectItem>
                  <SelectItem value="2024-Q4">2024 - 4. Çeyrek</SelectItem>
                  <SelectItem value="2024-Annual">2024 - Yıllık</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-gray-300">
                <Download className="h-4 w-4 mr-2" />
                Rapor İndir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Performance Records */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Performans Değerlendirmeleri</CardTitle>
            <CardDescription className="text-gray-600">
              Çalışan performans değerlendirmelerini görüntüleyin ve analiz edin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredPerformances.map((performance: any) => (
                <div key={performance.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Star className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {performance.employee?.firstName} {performance.employee?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{performance.period}</p>
                        <p className="text-xs text-gray-500">
                          {performance.createdAt && format(new Date(performance.createdAt), 'dd MMM yyyy', { locale: tr })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Genel Puan:</span>
                        <Badge className={`${getScoreColor(performance.overallScore)} bg-transparent border`}>
                          {performance.overallScore}/10 - {getScoreLabel(performance.overallScore)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Skills Progress Bars */}
                  {performance.skillsAssessment && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {Object.entries(performance.skillsAssessment).map(([skill, score]: [string, any]) => (
                        <div key={skill} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{skillLabels[skill as keyof typeof skillLabels]}</span>
                            <span className="text-gray-900">{score}/5</span>
                          </div>
                          <Progress value={(score / 5) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  )}

                  <Tabs defaultValue="goals" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                      <TabsTrigger value="goals" className="text-sm">Hedefler</TabsTrigger>
                      <TabsTrigger value="achievements" className="text-sm">Başarılar</TabsTrigger>
                      <TabsTrigger value="improvements" className="text-sm">Gelişim</TabsTrigger>
                      <TabsTrigger value="next" className="text-sm">Gelecek</TabsTrigger>
                    </TabsList>
                    <TabsContent value="goals" className="mt-4">
                      <p className="text-sm text-gray-700">{performance.goals}</p>
                    </TabsContent>
                    <TabsContent value="achievements" className="mt-4">
                      <p className="text-sm text-gray-700">{performance.achievements}</p>
                    </TabsContent>
                    <TabsContent value="improvements" className="mt-4">
                      <p className="text-sm text-gray-700">{performance.areasForImprovement}</p>
                    </TabsContent>
                    <TabsContent value="next" className="mt-4">
                      <p className="text-sm text-gray-700">{performance.nextPeriodGoals}</p>
                    </TabsContent>
                  </Tabs>

                  {performance.managerComments && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-medium text-blue-900 mb-1">Yönetici Yorumları</h4>
                      <p className="text-sm text-blue-800">{performance.managerComments}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredPerformances.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Henüz performans değerlendirmesi bulunmuyor</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}