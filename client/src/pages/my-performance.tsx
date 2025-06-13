import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Star, 
  Award, 
  Target, 
  Calendar,
  BarChart3,
  CheckCircle,
  Clock,
  Users,
  BookOpen
} from "lucide-react";
import { format, subMonths } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

export default function MyPerformance() {
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const { user } = useAuth();

  // Mock performance data
  const performanceData = {
    overall: {
      score: 4.2,
      rating: "Mükemmel",
      lastReview: "2024-05-15",
      nextReview: "2024-08-15",
      improvement: "+0.3",
      rank: "Üst %15"
    },
    goals: [
      {
        id: 1,
        title: "Frontend Geliştirme Verimliliği",
        description: "React projelerinde kod kalitesi ve teslim süresini iyileştirme",
        progress: 85,
        target: 100,
        deadline: "2024-07-31",
        status: "progress",
        category: "Teknik"
      },
      {
        id: 2,
        title: "Takım İşbirliği",
        description: "Proje toplantılarına aktif katılım ve mentoring",
        progress: 92,
        target: 100,
        deadline: "2024-06-30",
        status: "completed",
        category: "Sosyal"
      },
      {
        id: 3,
        title: "Yeni Teknoloji Öğrenme",
        description: "Next.js ve TypeScript uzmanlığı geliştirme",
        progress: 65,
        target: 100,
        deadline: "2024-09-30",
        status: "progress",
        category: "Gelişim"
      }
    ],
    metrics: [
      { label: "Proje Tamamlama", value: 95, change: "+5%" },
      { label: "Kod Kalitesi", value: 88, change: "+3%" },
      { label: "Takım Değerlendirmesi", value: 92, change: "+8%" },
      { label: "Müşteri Memnuniyeti", value: 87, change: "+2%" }
    ],
    feedback: [
      {
        id: 1,
        reviewer: "Ali Özkan",
        role: "Proje Yöneticisi",
        date: "2024-05-15",
        rating: 4.5,
        comment: "Emre projelerimizde tutarlı kaliteli iş çıkarıyor. Teknik bilgisi güçlü ve takım arkadaşlarıyla iyi iletişim kuruyor.",
        strengths: ["Teknik uzmanlık", "Problem çözme", "İletişim"],
        improvements: ["Zaman yönetimi", "Dokümantasyon"]
      },
      {
        id: 2,
        reviewer: "Ayşe Demir",
        role: "Takım Lideri",
        date: "2024-04-20",
        rating: 4.0,
        comment: "Frontend geliştirmede çok başarılı. Yeni teknolojileri öğrenme konusunda istekli.",
        strengths: ["UI/UX anlayışı", "Öğrenme isteği", "Kaliteli kod"],
        improvements: ["Code review", "Mentorluk"]
      }
    ],
    achievements: [
      {
        id: 1,
        title: "Ayın Çalışanı",
        description: "Mayıs 2024 döneminde üstün performans",
        date: "2024-05-01",
        icon: "🏆"
      },
      {
        id: 2,
        title: "Proje Başarı Ödülü",
        description: "E-ticaret projesi zamanında teslim",
        date: "2024-04-15",
        icon: "🎯"
      },
      {
        id: 3,
        title: "Teknik Sertifika",
        description: "React Advanced Developer sertifikası",
        date: "2024-03-10",
        icon: "📜"
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Tamamlandı";
      case "progress":
        return "Devam Ediyor";
      case "pending":
        return "Beklemede";
      default:
        return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performansım</h1>
          <p className="text-gray-600">Kişisel performans değerlendirmenizi görüntüleyin</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Dönem seçiniz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Güncel Dönem</SelectItem>
            <SelectItem value="previous">Önceki Dönem</SelectItem>
            <SelectItem value="yearly">Yıllık</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Genel Puan</p>
                <p className="text-lg font-semibold text-gray-900">{performanceData.overall.score}/5.0</p>
                <p className="text-xs text-green-600">{performanceData.overall.improvement} artış</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Değerlendirme</p>
                <p className="text-lg font-semibold text-gray-900">{performanceData.overall.rating}</p>
                <p className="text-xs text-gray-500">{performanceData.overall.rank}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tamamlanan Hedef</p>
                <p className="text-lg font-semibold text-gray-900">
                  {performanceData.goals.filter(g => g.status === "completed").length}/
                  {performanceData.goals.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sonraki Değerlendirme</p>
                <p className="text-lg font-semibold text-gray-900">
                  {format(new Date(performanceData.overall.nextReview), "dd/MM")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performans Metrikleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {performanceData.metrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900">{metric.value}%</span>
                    <span className="text-sm text-green-600">{metric.change}</span>
                  </div>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals & Objectives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Hedeflerim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.goals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                    <Badge className={getStatusColor(goal.status)}>
                      {getStatusLabel(goal.status)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>İlerleme</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Kategori: {goal.category}</span>
                    <span>Hedef: {format(new Date(goal.deadline), "dd/MM/yyyy")}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Başarılarım
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-gray-500">{format(new Date(achievement.date), "dd MMMM yyyy")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Geri Bildirimler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {performanceData.feedback.map((feedback) => (
              <div key={feedback.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{feedback.reviewer}</h4>
                    <p className="text-sm text-gray-600">{feedback.role}</p>
                    <p className="text-xs text-gray-500">{format(new Date(feedback.date), "dd MMMM yyyy")}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-gray-900">{feedback.rating}</span>
                  </div>
                </div>
                <p className="text-gray-700">{feedback.comment}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Güçlü Yönler</h5>
                    <div className="flex flex-wrap gap-1">
                      {feedback.strengths.map((strength, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Gelişim Alanları</h5>
                    <div className="flex flex-wrap gap-1">
                      {feedback.improvements.map((improvement, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                          {improvement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}