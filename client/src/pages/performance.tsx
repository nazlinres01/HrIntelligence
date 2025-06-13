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
  Star, 
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
  CheckCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const performanceSchema = z.object({
  employeeId: z.string().min(1, "Çalışan seçimi gerekli"),
  reviewPeriod: z.string().min(1, "Değerlendirme dönemi gerekli"),
  goals: z.string().min(10, "En az 10 karakter hedef açıklaması gerekli"),
  achievements: z.string().min(10, "En az 10 karakter başarı açıklaması gerekli"),
  skillsRating: z.string().min(1, "Beceri puanı gerekli"),
  communicationRating: z.string().min(1, "İletişim puanı gerekli"),
  teamworkRating: z.string().min(1, "Takım çalışması puanı gerekli"),
  overallScore: z.string().min(1, "Genel puan gerekli"),
  feedback: z.string().min(10, "En az 10 karakter geri bildirim gerekli"),
  improvementAreas: z.string().optional(),
  nextGoals: z.string().optional()
});

type PerformanceFormData = z.infer<typeof performanceSchema>;

export default function PerformancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: performance = [], isLoading: performanceLoading } = useQuery<any[]>({
    queryKey: ["/api/performance"]
  });

  const { data: employees = [] } = useQuery<any[]>({
    queryKey: ["/api/employees"]
  });

  const form = useForm<PerformanceFormData>({
    resolver: zodResolver(performanceSchema),
    defaultValues: {
      employeeId: "",
      reviewPeriod: "",
      goals: "",
      achievements: "",
      skillsRating: "",
      communicationRating: "",
      teamworkRating: "",
      overallScore: "",
      feedback: "",
      improvementAreas: "",
      nextGoals: ""
    }
  });

  const createPerformanceMutation = useMutation({
    mutationFn: async (data: PerformanceFormData) => {
      return apiRequest("POST", "/api/performance", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performance"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Performans değerlendirmesi başarıyla oluşturuldu",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Performans değerlendirmesi oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const deletePerformanceMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/performance/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performance"] });
      toast({
        title: "Başarılı",
        description: "Performans değerlendirmesi başarıyla silindi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Performans değerlendirmesi silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (data: PerformanceFormData) => {
    createPerformanceMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu performans değerlendirmesini silmek istediğinizden emin misiniz?")) {
      deletePerformanceMutation.mutate(id);
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = (employees as any[]).find((emp: any) => emp.id.toString() === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Bilinmeyen Çalışan';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 4.5) return <Badge className="bg-green-100 text-green-800">Mükemmel</Badge>;
    if (score >= 4.0) return <Badge className="bg-blue-100 text-blue-800">Çok İyi</Badge>;
    if (score >= 3.5) return <Badge className="bg-yellow-100 text-yellow-800">İyi</Badge>;
    if (score >= 3.0) return <Badge className="bg-orange-100 text-orange-800">Orta</Badge>;
    return <Badge className="bg-red-100 text-red-800">Geliştirilmeli</Badge>;
  };

  const filteredPerformance = (performance as any[]).filter((perf: any) => {
    const employeeName = getEmployeeName(perf.employeeId);
    const matchesSearch = employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         perf.goals?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = periodFilter === "all" || perf.reviewPeriod === periodFilter;
    const score = parseFloat(perf.overallScore || 0);
    let matchesScore = true;
    
    if (scoreFilter === "excellent") matchesScore = score >= 4.5;
    else if (scoreFilter === "good") matchesScore = score >= 4.0 && score < 4.5;
    else if (scoreFilter === "average") matchesScore = score >= 3.0 && score < 4.0;
    else if (scoreFilter === "poor") matchesScore = score < 3.0;
    
    return matchesSearch && matchesPeriod && matchesScore;
  });

  // Analytics calculations
  const getPerformanceStats = () => {
    const totalReviews = (performance as any[]).length;
    const avgScore = (performance as any[]).length > 0 
      ? (performance as any[]).reduce((sum: number, perf: any) => sum + parseFloat(perf.overallScore || 0), 0) / (performance as any[]).length
      : 0;
    const highPerformers = (performance as any[]).filter((perf: any) => parseFloat(perf.overallScore || 0) >= 4.0).length;
    const completedReviews = (performance as any[]).filter((perf: any) => perf.overallScore && parseFloat(perf.overallScore) > 0).length;

    return {
      totalReviews,
      avgScore: Math.round(avgScore * 10) / 10,
      highPerformers,
      completedReviews,
      completionRate: totalReviews > 0 ? Math.round((completedReviews / totalReviews) * 100) : 0
    };
  };

  const stats = getPerformanceStats();

  if (performanceLoading) {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Performans Değerlendirme</h1>
            <p className="text-gray-600">Çalışan performans değerlendirmeleri ve analiz raporları</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-300 text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Değerlendirme
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Yeni Performans Değerlendirmesi</DialogTitle>
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
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Çalışan seçin" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {(employees as any[]).map((employee: any) => (
                                    <SelectItem key={employee.id} value={employee.id.toString()}>
                                      {employee.firstName} {employee.lastName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reviewPeriod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Değerlendirme Dönemi</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Dönem seçin" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="Q1-2024">Q1 2024</SelectItem>
                                  <SelectItem value="Q2-2024">Q2 2024</SelectItem>
                                  <SelectItem value="Q3-2024">Q3 2024</SelectItem>
                                  <SelectItem value="Q4-2024">Q4 2024</SelectItem>
                                  <SelectItem value="Yıllık-2024">Yıllık 2024</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="goals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Hedefler</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Dönem hedeflerini açıklayın"
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
                        name="achievements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Başarılar</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Elde edilen başarıları açıklayın"
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

                    <div className="grid grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="skillsRating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Beceri Puanı</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Puan" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="5">5 - Mükemmel</SelectItem>
                                  <SelectItem value="4">4 - Çok İyi</SelectItem>
                                  <SelectItem value="3">3 - İyi</SelectItem>
                                  <SelectItem value="2">2 - Orta</SelectItem>
                                  <SelectItem value="1">1 - Zayıf</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="communicationRating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">İletişim</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Puan" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="5">5 - Mükemmel</SelectItem>
                                  <SelectItem value="4">4 - Çok İyi</SelectItem>
                                  <SelectItem value="3">3 - İyi</SelectItem>
                                  <SelectItem value="2">2 - Orta</SelectItem>
                                  <SelectItem value="1">1 - Zayıf</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="teamworkRating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Takım Çalışması</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Puan" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="5">5 - Mükemmel</SelectItem>
                                  <SelectItem value="4">4 - Çok İyi</SelectItem>
                                  <SelectItem value="3">3 - İyi</SelectItem>
                                  <SelectItem value="2">2 - Orta</SelectItem>
                                  <SelectItem value="1">1 - Zayıf</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="overallScore"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Genel Puan</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="border-gray-300">
                                  <SelectValue placeholder="Puan" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="5">5.0 - Mükemmel</SelectItem>
                                  <SelectItem value="4.5">4.5 - Çok İyi</SelectItem>
                                  <SelectItem value="4">4.0 - İyi</SelectItem>
                                  <SelectItem value="3.5">3.5 - Orta Üstü</SelectItem>
                                  <SelectItem value="3">3.0 - Orta</SelectItem>
                                  <SelectItem value="2.5">2.5 - Orta Altı</SelectItem>
                                  <SelectItem value="2">2.0 - Zayıf</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="feedback"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Geri Bildirim</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Performans geri bildirimi yazın"
                              {...field}
                              className="border-gray-300"
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="improvementAreas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Gelişim Alanları</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Geliştirilmesi gereken alanları belirtin"
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
                        name="nextGoals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Gelecek Hedefler</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Bir sonraki dönem hedeflerini belirtin"
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
                        disabled={createPerformanceMutation.isPending}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        {createPerformanceMutation.isPending ? "Oluşturuluyor..." : "Değerlendirme Oluştur"}
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
                  <p className="text-blue-600 text-sm font-medium mb-1">Toplam Değerlendirme</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalReviews}</p>
                </div>
                <Star className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium mb-1">Ortalama Puan</p>
                  <p className="text-2xl font-bold text-green-900">{stats.avgScore}/5.0</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium mb-1">Yüksek Performans</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.highPerformers}</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
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
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Çalışan veya hedef ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Dönem filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Dönemler</SelectItem>
              <SelectItem value="Q1-2024">Q1 2024</SelectItem>
              <SelectItem value="Q2-2024">Q2 2024</SelectItem>
              <SelectItem value="Q3-2024">Q3 2024</SelectItem>
              <SelectItem value="Q4-2024">Q4 2024</SelectItem>
            </SelectContent>
          </Select>
          <Select value={scoreFilter} onValueChange={setScoreFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Puan filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Puanlar</SelectItem>
              <SelectItem value="excellent">Mükemmel (4.5+)</SelectItem>
              <SelectItem value="good">İyi (4.0-4.4)</SelectItem>
              <SelectItem value="average">Orta (3.0-3.9)</SelectItem>
              <SelectItem value="poor">Zayıf (3.0-)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Performance Table */}
        <Card className="bg-white border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900">Performans Değerlendirmeleri</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Çalışan</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Dönem</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Genel Puan</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Hedefler</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPerformance.map((perf: any, index) => (
                    <tr key={perf.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {getEmployeeName(perf.employeeId)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className="bg-blue-100 text-blue-800">
                          {perf.reviewPeriod}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">{perf.overallScore}</span>
                          <Star className="h-4 w-4 text-yellow-500" />
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900 max-w-xs truncate">
                        {perf.goals}
                      </td>
                      <td className="py-4 px-6">
                        {getScoreBadge(parseFloat(perf.overallScore || 0))}
                      </td>
                      <td className="py-4 px-6">
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
                            onClick={() => handleDelete(perf.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}