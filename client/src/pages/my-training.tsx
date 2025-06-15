import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Award,
  Search,
  Filter,
  Calendar,
  Users,
  Star,
  Download,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

export default function MyTraining() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { toast } = useToast();
  const { user } = useAuth();

  // Mock training data
  const trainingData = {
    enrolledCourses: [
      {
        id: 1,
        title: "React Advanced Patterns",
        description: "Gelişmiş React kalıpları ve en iyi uygulamalar",
        category: "Frontend Development",
        instructor: "John Doe",
        duration: 240, // minutes
        progress: 75,
        status: "in_progress",
        enrolledDate: "2024-05-01",
        dueDate: "2024-07-01",
        completedLessons: 9,
        totalLessons: 12,
        rating: 4.8,
        certificate: false,
        thumbnail: ""
      },
      {
        id: 2,
        title: "TypeScript Fundamentals",
        description: "TypeScript temellerinden ileri seviye kullanıma",
        category: "Programming",
        instructor: "Jane Smith",
        duration: 180,
        progress: 100,
        status: "completed",
        enrolledDate: "2024-03-15",
        dueDate: "2024-05-15",
        completedLessons: 8,
        totalLessons: 8,
        rating: 4.5,
        certificate: true,
        thumbnail: "",
        completedDate: "2024-04-20"
      },
      {
        id: 3,
        title: "Agile Project Management",
        description: "Çevik proje yönetimi metodolojileri",
        category: "Management",
        instructor: "Mike Johnson",
        duration: 120,
        progress: 30,
        status: "in_progress",
        enrolledDate: "2024-06-01",
        dueDate: "2024-08-01",
        completedLessons: 2,
        totalLessons: 6,
        rating: 4.2,
        certificate: false,
        thumbnail: ""
      }
    ],
    availableCourses: [
      {
        id: 4,
        title: "Next.js Full Stack Development",
        description: "Modern web uygulamaları geliştirme",
        category: "Frontend Development",
        instructor: "Sarah Connor",
        duration: 300,
        rating: 4.9,
        studentsCount: 1250,
        price: "Ücretsiz",
        level: "Intermediate"
      },
      {
        id: 5,
        title: "Leadership Skills",
        description: "Etkili liderlik becerileri geliştirme",
        category: "Soft Skills",
        instructor: "David Wilson",
        duration: 90,
        rating: 4.6,
        studentsCount: 800,
        price: "Ücretsiz",
        level: "Beginner"
      }
    ],
    certificates: [
      {
        id: 1,
        courseTitle: "TypeScript Fundamentals",
        issuedDate: "2024-04-20",
        instructor: "Jane Smith",
        credentialId: "TS-2024-001",
        downloadUrl: "#"
      }
    ],
    stats: {
      totalCourses: 3,
      completedCourses: 1,
      inProgressCourses: 2,
      totalHours: 9.2,
      certificates: 1
    }
  };

  const categories = [
    { value: "all", label: "Tüm Kategoriler" },
    { value: "Frontend Development", label: "Frontend Geliştirme" },
    { value: "Programming", label: "Programlama" },
    { value: "Management", label: "Yönetim" },
    { value: "Soft Skills", label: "Kişisel Gelişim" }
  ];

  const statusOptions = [
    { value: "all", label: "Tüm Durumlar" },
    { value: "in_progress", label: "Devam Ediyor" },
    { value: "completed", label: "Tamamlandı" },
    { value: "not_started", label: "Başlanmadı" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "not_started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Tamamlandı";
      case "in_progress":
        return "Devam Ediyor";
      case "not_started":
        return "Başlanmadı";
      default:
        return status;
    }
  };

  const filteredCourses = trainingData.enrolledCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || course.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const enrollInCourse = (courseId: number) => {
    toast({
      title: "Başarılı",
      description: "Kursa başarıyla kaydoldunuz",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eğitimlerim</h1>
          <p className="text-gray-600">Kişisel gelişim ve eğitim programlarınızı takip edin</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam Kurs</p>
                <p className="text-lg font-semibold text-gray-900">{trainingData.stats.totalCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tamamlanan</p>
                <p className="text-lg font-semibold text-gray-900">{trainingData.stats.completedCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Devam Eden</p>
                <p className="text-lg font-semibold text-gray-900">{trainingData.stats.inProgressCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam Saat</p>
                <p className="text-lg font-semibold text-gray-900">{trainingData.stats.totalHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sertifika</p>
                <p className="text-lg font-semibold text-gray-900">{trainingData.stats.certificates}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Kurs ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Enrolled Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Kayıtlı Kurslarım
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{course.category}</Badge>
                      <Badge className={getStatusColor(course.status)}>
                        {getStatusLabel(course.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">İlerleme</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{course.completedLessons}/{course.totalLessons} ders</span>
                    <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>Eğitmen: {course.instructor}</p>
                    <p>Son tarih: {format(new Date(course.dueDate), "dd/MM/yyyy")}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {course.status === "in_progress" && (
                    <Button size="sm" variant="lightgray" className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      Devam Et
                    </Button>
                  )}
                  {course.status === "completed" && course.certificate && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <Award className="w-4 h-4 mr-2" />
                      Sertifika
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Mevcut Kurslar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trainingData.availableCourses.map((course) => (
              <div key={course.id} className="border rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{course.category}</Badge>
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span>Eğitmen: {course.instructor}</span>
                    <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.studentsCount} öğrenci</span>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600">{course.price}</span>
                </div>

                <Button 
                  onClick={() => enrollInCourse(course.id)}
                  size="sm" 
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  Kursa Kayıt Ol
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificates */}
      {trainingData.certificates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Sertifikalarım
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingData.certificates.map((cert) => (
                <div key={cert.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{cert.courseTitle}</h4>
                    <p className="text-sm text-gray-600">Eğitmen: {cert.instructor}</p>
                    <p className="text-sm text-gray-600">
                      Verildiği tarih: {format(new Date(cert.issuedDate), "dd MMMM yyyy")}
                    </p>
                    <p className="text-xs text-gray-500">Sertifika ID: {cert.credentialId}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      İndir
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Doğrula
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}