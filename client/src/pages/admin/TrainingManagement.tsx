import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Search, 
  BookOpen,
  Calendar,
  Users,
  Clock,
  Award,
  PlayCircle,
  CheckCircle,
  User,
  Target
} from "lucide-react";

export default function TrainingManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["/api/employees"],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"],
  });

  // Mock training data for demonstration
  const trainingPrograms = [
    {
      id: 1,
      title: "React ve TypeScript Eğitimi",
      description: "Modern web geliştirme teknolojileri üzerine kapsamlı eğitim",
      instructor: "Ahmet Yılmaz",
      duration: "40 saat",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      status: "active",
      enrolledCount: 15,
      maxCapacity: 20,
      category: "Teknik",
      level: "Orta",
      completionRate: 75
    },
    {
      id: 2,
      title: "Liderlik Gelişimi",
      description: "Etkili liderlik becerileri ve takım yönetimi",
      instructor: "Ayşe Demir",
      duration: "24 saat",
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      status: "completed",
      enrolledCount: 12,
      maxCapacity: 15,
      category: "Yönetim",
      level: "İleri",
      completionRate: 92
    },
    {
      id: 3,
      title: "Dijital Pazarlama Stratejileri",
      description: "Modern pazarlama teknikleri ve sosyal medya yönetimi",
      instructor: "Mehmet Kaya",
      duration: "32 saat",
      startDate: "2024-03-01",
      endDate: "2024-03-30",
      status: "upcoming",
      enrolledCount: 8,
      maxCapacity: 25,
      category: "Pazarlama",
      level: "Başlangıç",
      completionRate: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Devam Ediyor</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Tamamlandı</Badge>;
      case "upcoming":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Yaklaşan</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">İptal Edildi</Badge>;
      default:
        return <Badge variant="lightgray">{status}</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Başlangıç":
        return <Badge variant="lightgray" className="text-green-600">Başlangıç</Badge>;
      case "Orta":
        return <Badge variant="lightgray" className="text-blue-600">Orta</Badge>;
      case "İleri":
        return <Badge variant="lightgray" className="text-purple-600">İleri</Badge>;
      default:
        return <Badge variant="lightgray">{level}</Badge>;
    }
  };

  const filteredTrainings = trainingPrograms.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || training.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Eğitim Yönetimi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Eğitim programlarını oluşturun ve çalışan gelişimini takip edin
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Eğitim Programı
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Yeni Eğitim Programı</DialogTitle>
              <DialogDescription>
                Çalışanlar için eğitim programı oluşturun
              </DialogDescription>
            </DialogHeader>
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Eğitim Sistemi Geliştiriliyor
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Eğitim programı oluşturma formu yakında eklenecek.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Eğitim programlarında ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Durum filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="active">Devam Ediyor</SelectItem>
            <SelectItem value="completed">Tamamlandı</SelectItem>
            <SelectItem value="upcoming">Yaklaşan</SelectItem>
            <SelectItem value="cancelled">İptal Edildi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredTrainings.length}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Toplam Program
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
              <PlayCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredTrainings.filter(t => t.status === "active").length}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Aktif Eğitim
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredTrainings.reduce((sum, t) => sum + t.enrolledCount, 0)}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Katılımcı
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mr-4">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(filteredTrainings.reduce((sum, t) => sum + t.completionRate, 0) / filteredTrainings.length) || 0}%
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Tamamlanma Oranı
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Eğitim Programları
          </CardTitle>
          <CardDescription>
            Şirket eğitim programlarını yönetin ve takip edin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Eğitim Adı</TableHead>
                  <TableHead>Eğitmen</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Seviye</TableHead>
                  <TableHead>Süre</TableHead>
                  <TableHead>Katılımcı</TableHead>
                  <TableHead>Tamamlanma</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tarih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainings.map((training) => (
                  <TableRow key={training.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {training.title}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {training.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {training.instructor}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="lightgray" className="text-blue-600">
                        {training.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{getLevelBadge(training.level)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {training.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        {training.enrolledCount}/{training.maxCapacity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{training.completionRate}%</div>
                        <Progress value={training.completionRate} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(training.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <div>
                          <div>{new Date(training.startDate).toLocaleDateString("tr-TR")}</div>
                          <div className="text-gray-500">
                            {new Date(training.endDate).toLocaleDateString("tr-TR")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredTrainings.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Eğitim programı bulunamadı
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || statusFilter !== "all" 
                    ? "Arama kriterlerinize uygun eğitim programı bulunamadı." 
                    : "Henüz hiç eğitim programı oluşturulmamış."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}