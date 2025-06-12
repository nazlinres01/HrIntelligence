import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Search, 
  TrendingUp,
  TrendingDown,
  Star,
  Target,
  User,
  Calendar,
  Award,
  BarChart3,
  Users
} from "lucide-react";

export default function PerformanceManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"],
  });

  // Mock performance data for demonstration
  const performanceData = [
    {
      id: 1,
      employeeName: "Ahmet Yılmaz",
      departmentName: "Yazılım Geliştirme",
      position: "Senior Developer",
      overallScore: 87,
      technicalSkills: 90,
      communication: 85,
      teamwork: 88,
      leadership: 82,
      goalCompletion: 92,
      period: "2024 Q3",
      reviewDate: "2024-10-15",
      status: "completed"
    },
    {
      id: 2,
      employeeName: "Ayşe Demir",
      departmentName: "İnsan Kaynakları",
      position: "HR Specialist",
      overallScore: 91,
      technicalSkills: 88,
      communication: 95,
      teamwork: 90,
      leadership: 89,
      goalCompletion: 93,
      period: "2024 Q3",
      reviewDate: "2024-10-20",
      status: "completed"
    },
    {
      id: 3,
      employeeName: "Mehmet Kaya",
      departmentName: "Pazarlama",
      position: "Marketing Manager",
      overallScore: 84,
      technicalSkills: 82,
      communication: 87,
      teamwork: 85,
      leadership: 86,
      goalCompletion: 88,
      period: "2024 Q3",
      reviewDate: "2024-10-25",
      status: "completed"
    }
  ];

  const getScoreBadge = (score: number) => {
    if (score >= 90) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Mükemmel</Badge>;
    } else if (score >= 80) {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">İyi</Badge>;
    } else if (score >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Orta</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Gelişim Gerekli</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredPerformance = performanceData.filter(perf => {
    const matchesSearch = perf.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         perf.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || perf.departmentName === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const averageScore = filteredPerformance.length > 0 
    ? Math.round(filteredPerformance.reduce((sum, perf) => sum + perf.overallScore, 0) / filteredPerformance.length)
    : 0;

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Performans Yönetimi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Çalışan performansını değerlendirin ve gelişim planları oluşturun
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Performans Değerlendirmesi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Yeni Performans Değerlendirmesi</DialogTitle>
              <DialogDescription>
                Çalışan için performans değerlendirmesi oluşturun
              </DialogDescription>
            </DialogHeader>
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Performans Sistemi Geliştiriliyor
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Performans değerlendirme formu yakında eklenecek.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Çalışanlarda ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Departman filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Departmanlar</SelectItem>
            {Array.isArray(departments) && departments.map((dept: any) => (
              <SelectItem key={dept.id} value={dept.name}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {averageScore}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Ortalama Puan
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredPerformance.filter(p => p.overallScore >= 90).length}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Üstün Performans
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mr-4">
              <Target className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredPerformance.filter(p => p.overallScore >= 80 && p.overallScore < 90).length}
              </div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                İyi Performans
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full mr-4">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredPerformance.filter(p => p.overallScore < 80).length}
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                Gelişim Gerekli
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performans Değerlendirmeleri
          </CardTitle>
          <CardDescription>
            Çalışan performans skorları ve değerlendirme detayları
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Çalışan</TableHead>
                  <TableHead>Departman</TableHead>
                  <TableHead>Genel Puan</TableHead>
                  <TableHead>Teknik Beceri</TableHead>
                  <TableHead>İletişim</TableHead>
                  <TableHead>Takım Çalışması</TableHead>
                  <TableHead>Hedef Tamamlama</TableHead>
                  <TableHead>Dönem</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPerformance.map((perf) => (
                  <TableRow key={perf.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {perf.employeeName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {perf.position}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{perf.departmentName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={`text-2xl font-bold ${getScoreColor(perf.overallScore)}`}>
                          {perf.overallScore}
                        </span>
                        {getScoreBadge(perf.overallScore)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{perf.technicalSkills}/100</div>
                        <Progress value={perf.technicalSkills} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{perf.communication}/100</div>
                        <Progress value={perf.communication} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{perf.teamwork}/100</div>
                        <Progress value={perf.teamwork} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{perf.goalCompletion}/100</div>
                        <Progress value={perf.goalCompletion} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {perf.period}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Tamamlandı
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredPerformance.length === 0 && (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Performans verisi bulunamadı
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || departmentFilter !== "all" 
                    ? "Arama kriterlerinize uygun performans verisi bulunamadı." 
                    : "Henüz hiç performans değerlendirmesi yapılmamış."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}