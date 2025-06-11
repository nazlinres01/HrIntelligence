import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Star,
  Target,
  Award,
  Plus,
  Calendar,
  Filter,
  Download,
  Eye,
  Edit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Performance {
  id: number;
  employeeId: number;
  reviewPeriod: string;
  overallRating: number;
  goals: string;
  achievements: string;
  feedback: string;
  createdAt: string;
  employee?: {
    firstName: string;
    lastName: string;
    department: string;
    position: string;
  };
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
}

export default function Performance() {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null);

  const [newPerformance, setNewPerformance] = useState({
    employeeId: "",
    reviewPeriod: "",
    overallRating: "",
    goals: "",
    achievements: "",
    feedback: ""
  });

  const { data: performances = [], isLoading } = useQuery<Performance[]>({
    queryKey: ["/api/performance"],
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const createPerformanceMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/performance", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/performance"] });
      setIsAddModalOpen(false);
      setNewPerformance({
        employeeId: "",
        reviewPeriod: "",
        overallRating: "",
        goals: "",
        achievements: "",
        feedback: ""
      });
      toast({
        title: "Başarılı",
        description: "Performans değerlendirmesi eklendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Performans değerlendirmesi eklenirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const filteredPerformances = useMemo(() => {
    if (!performances || !Array.isArray(performances)) return [];
    
    return performances.filter((perf: Performance) => {
      const matchesPeriod = selectedPeriod === "all" || perf.reviewPeriod?.includes(selectedPeriod);
      const matchesDepartment = selectedDepartment === "all" || perf.employee?.department === selectedDepartment;
      return matchesPeriod && matchesDepartment;
    });
  }, [performances, selectedPeriod, selectedDepartment]);

  const departments = Array.from(new Set((performances || []).map((perf: Performance) => perf.employee?.department).filter(Boolean)));

  const averageRating = filteredPerformances.length > 0 
    ? (filteredPerformances.reduce((sum: number, perf: Performance) => sum + perf.overallRating, 0) / filteredPerformances.length).toFixed(1)
    : "0";

  const topPerformers = filteredPerformances
    .sort((a: Performance, b: Performance) => b.overallRating - a.overallRating)
    .slice(0, 5);

  const departmentStats = departments.map(dept => {
    const deptPerformances = filteredPerformances.filter((perf: Performance) => perf.employee?.department === dept);
    const avgRating = deptPerformances.length > 0 
      ? deptPerformances.reduce((sum: number, perf: Performance) => sum + perf.overallRating, 0) / deptPerformances.length
      : 0;
    
    return {
      department: dept,
      avgRating: avgRating,
      count: deptPerformances.length
    };
  });

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return <Badge className="bg-green-100 text-green-800">Mükemmel</Badge>;
    if (rating >= 4.0) return <Badge className="bg-blue-100 text-blue-800">Çok İyi</Badge>;
    if (rating >= 3.5) return <Badge className="bg-yellow-100 text-yellow-800">İyi</Badge>;
    if (rating >= 3.0) return <Badge className="bg-orange-100 text-orange-800">Orta</Badge>;
    return <Badge className="bg-red-100 text-red-800">Gelişmeli</Badge>;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-blue-600";
    if (rating >= 3.5) return "text-yellow-600";
    if (rating >= 3.0) return "text-orange-600";
    return "text-red-600";
  };

  const handleAddPerformance = () => {
    const performanceData = {
      ...newPerformance,
      employeeId: parseInt(newPerformance.employeeId),
      overallRating: parseFloat(newPerformance.overallRating)
    };
    createPerformanceMutation.mutate(performanceData);
  };

  const statsCards = [
    {
      title: "Toplam Değerlendirme",
      value: filteredPerformances.length,
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Ortalama Puan",
      value: averageRating,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "En Yüksek Puan",
      value: filteredPerformances.length > 0 ? Math.max(...filteredPerformances.map((p: Performance) => p.overallRating)).toFixed(1) : "0",
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Değerlendirilen Departman",
      value: departments.length,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6 max-w-full overflow-x-hidden overflow-y-auto h-full">
      <Header 
        title="Performans Yönetimi" 
        subtitle="Çalışan performansını analiz edin ve değerlendirin" 
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {isLoading ? "..." : stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters and Actions */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Dönem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Dönemler</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="Q4">Q4 2024</SelectItem>
                  <SelectItem value="Q3">Q3 2024</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Departman" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Departmanlar</SelectItem>
                  {departments.filter(dept => dept != null).map((dept) => (
                    <SelectItem key={dept!} value={dept!}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Rapor İndir
              </Button>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Değerlendirme
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Yeni Performans Değerlendirmesi</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="employee">Çalışan</Label>
                        <Select value={newPerformance.employeeId} onValueChange={(value) => setNewPerformance({ ...newPerformance, employeeId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Çalışan seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees?.map((emp: Employee) => (
                              <SelectItem key={emp.id} value={emp.id.toString()}>
                                {emp.firstName} {emp.lastName} - {emp.department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reviewPeriod">Değerlendirme Dönemi</Label>
                        <Input
                          id="reviewPeriod"
                          value={newPerformance.reviewPeriod}
                          onChange={(e) => setNewPerformance({ ...newPerformance, reviewPeriod: e.target.value })}
                          placeholder="Örn: Q4 2024"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rating">Genel Puan (1-5)</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={newPerformance.overallRating}
                        onChange={(e) => setNewPerformance({ ...newPerformance, overallRating: e.target.value })}
                        placeholder="4.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goals">Hedefler</Label>
                      <Textarea
                        id="goals"
                        value={newPerformance.goals}
                        onChange={(e) => setNewPerformance({ ...newPerformance, goals: e.target.value })}
                        placeholder="Bu dönem için belirlenen hedefler..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="achievements">Başarılar</Label>
                      <Textarea
                        id="achievements"
                        value={newPerformance.achievements}
                        onChange={(e) => setNewPerformance({ ...newPerformance, achievements: e.target.value })}
                        placeholder="Dönemde elde edilen başarılar..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feedback">Geri Bildirim</Label>
                      <Textarea
                        id="feedback"
                        value={newPerformance.feedback}
                        onChange={(e) => setNewPerformance({ ...newPerformance, feedback: e.target.value })}
                        placeholder="Geliştirme önerileri ve geri bildirimler..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      İptal
                    </Button>
                    <Button 
                      onClick={handleAddPerformance} 
                      disabled={createPerformanceMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createPerformanceMutation.isPending ? "Ekleniyor..." : "Ekle"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
              Departman Performansı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{dept.department}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${getRatingColor(dept.avgRating)}`}>
                        {dept.avgRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">({dept.count} değerlendirme)</span>
                    </div>
                  </div>
                  <Progress value={(dept.avgRating / 5) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-yellow-600" />
              En Başarılı Çalışanlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((perf: Performance, index) => (
                <div key={perf.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                      {perf.employee?.firstName?.[0]}{perf.employee?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">
                      {perf.employee?.firstName} {perf.employee?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{perf.employee?.department}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className={`h-5 w-5 ${getRatingColor(perf.overallRating)}`} fill="currentColor" />
                    <span className={`font-bold ${getRatingColor(perf.overallRating)}`}>
                      {perf.overallRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Reviews List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5 text-green-600" />
            Performans Değerlendirmeleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredPerformances.length > 0 ? (
            <div className="space-y-4">
              {filteredPerformances.map((perf: Performance) => (
                <div key={perf.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                          {perf.employee?.firstName?.[0]}{perf.employee?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {perf.employee?.firstName} {perf.employee?.lastName}
                          </h3>
                          {getRatingBadge(perf.overallRating)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {perf.employee?.department} • {perf.employee?.position}
                        </p>
                        <p className="text-sm text-gray-500">
                          Dönem: {perf.reviewPeriod} • {new Date(perf.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-4">
                        <div className="flex items-center space-x-1">
                          <Star className={`h-5 w-5 ${getRatingColor(perf.overallRating)}`} fill="currentColor" />
                          <span className={`text-xl font-bold ${getRatingColor(perf.overallRating)}`}>
                            {perf.overallRating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">/ 5.0</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedPerformance(perf);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {perf.achievements && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">Başarılar:</p>
                      <p className="text-sm text-green-700 line-clamp-2">{perf.achievements}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">Performans değerlendirmesi bulunamadı</p>
              <p className="text-gray-400">Filtreleri değiştirin veya yeni değerlendirme ekleyin</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Performance Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Performans Değerlendirmesi Detayları</DialogTitle>
          </DialogHeader>
          {selectedPerformance && (
            <div className="space-y-6 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xl">
                    {selectedPerformance.employee?.firstName?.[0]}{selectedPerformance.employee?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedPerformance.employee?.firstName} {selectedPerformance.employee?.lastName}
                  </h2>
                  <p className="text-gray-600">{selectedPerformance.employee?.department} • {selectedPerformance.employee?.position}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Dönem: {selectedPerformance.reviewPeriod} • {new Date(selectedPerformance.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className={`h-6 w-6 ${getRatingColor(selectedPerformance.overallRating)}`} fill="currentColor" />
                    <span className={`text-2xl font-bold ${getRatingColor(selectedPerformance.overallRating)}`}>
                      {selectedPerformance.overallRating.toFixed(1)}
                    </span>
                  </div>
                  {getRatingBadge(selectedPerformance.overallRating)}
                </div>
              </div>

              <div className="grid gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500 mb-2 block">Hedefler</Label>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-900">{selectedPerformance.goals}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500 mb-2 block">Başarılar</Label>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-gray-900">{selectedPerformance.achievements}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500 mb-2 block">Geri Bildirim</Label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{selectedPerformance.feedback}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}