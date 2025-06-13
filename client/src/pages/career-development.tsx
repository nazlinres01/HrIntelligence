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
  BookOpen,
  CheckCircle,
  Clock,
  Users,
  Trophy,
  Briefcase,
  GraduationCap,
  MapPin,
  ArrowRight
} from "lucide-react";
import { format, addMonths } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

export default function CareerDevelopment() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();

  // Career development data
  const careerData = {
    currentPosition: {
      title: "Senior Frontend Developer",
      level: "Senior",
      department: "Yazılım Geliştirme",
      startDate: "2020-03-15",
      nextReviewDate: "2024-08-15"
    },
    careerPath: {
      current: "Senior Frontend Developer",
      next: "Lead Frontend Developer",
      progress: 75,
      requirements: [
        { skill: "Takım Liderliği", completed: true },
        { skill: "Mentor Deneyimi", completed: true },
        { skill: "Proje Yönetimi", completed: false },
        { skill: "Sistem Mimarisi", completed: false }
      ]
    },
    goals: [
      {
        id: 1,
        title: "Takım Liderliği Geliştirme",
        description: "5 kişilik takımda liderlik deneyimi kazanma",
        category: "leadership",
        progress: 85,
        deadline: "2024-09-30",
        status: "in_progress",
        milestones: [
          { title: "Takım üyelerini mentorlama", completed: true },
          { title: "Sprint planlama sürecine dahil olma", completed: true },
          { title: "Code review sürecini yönetme", completed: false }
        ]
      },
      {
        id: 2,
        title: "React Native Uzmanlığı",
        description: "Mobil uygulama geliştirme becerilerini artırma",
        category: "technical",
        progress: 60,
        deadline: "2024-12-31",
        status: "in_progress",
        milestones: [
          { title: "React Native temelleri", completed: true },
          { title: "Navigation sistemi", completed: true },
          { title: "Native modül entegrasyonu", completed: false }
        ]
      },
      {
        id: 3,
        title: "Proje Yönetimi Sertifikası",
        description: "PMP sertifikası almak",
        category: "certification",
        progress: 30,
        deadline: "2025-03-31",
        status: "planned",
        milestones: [
          { title: "PMP eğitim programı", completed: false },
          { title: "35 saatlik eğitim tamamlama", completed: false },
          { title: "Sınav başvurusu", completed: false }
        ]
      }
    ],
    skillMatrix: {
      technical: [
        { name: "React/TypeScript", level: 90, required: 85 },
        { name: "Node.js", level: 75, required: 70 },
        { name: "System Design", level: 60, required: 80 },
        { name: "DevOps", level: 45, required: 60 }
      ],
      soft: [
        { name: "İletişim", level: 85, required: 80 },
        { name: "Takım Çalışması", level: 90, required: 85 },
        { name: "Liderlik", level: 70, required: 80 },
        { name: "Problem Çözme", level: 88, required: 85 }
      ]
    },
    mentorship: {
      mentor: {
        name: "Ali Özkan",
        role: "Engineering Manager",
        avatar: "",
        meetingFrequency: "Haftalık",
        nextMeeting: "2024-06-20T14:00:00Z"
      },
      mentees: [
        {
          name: "Zeynep Kara",
          role: "Junior Frontend Developer",
          avatar: "",
          startDate: "2024-03-01"
        }
      ]
    },
    achievements: [
      {
        id: 1,
        title: "Yılın En İyi Geliştiricisi",
        description: "2023 yılında üstün performans ve takım katkısı",
        date: "2023-12-15",
        type: "award",
        icon: Trophy
      },
      {
        id: 2,
        title: "React Sertifikası",
        description: "Meta React Developer Sertifikası",
        date: "2023-08-20",
        type: "certification",
        icon: GraduationCap
      },
      {
        id: 3,
        title: "Mentor Programı Tamamlama",
        description: "2 junior geliştiriciyi başarıyla mentorlamak",
        date: "2023-06-10",
        type: "milestone",
        icon: Users
      }
    ]
  };

  const getSkillColor = (level: number, required: number) => {
    if (level >= required) return "bg-green-500";
    if (level >= required * 0.8) return "bg-yellow-500";
    return "bg-red-500";
  };

  const categoryFilters = [
    { value: "all", label: "Tümü" },
    { value: "technical", label: "Teknik" },
    { value: "leadership", label: "Liderlik" },
    { value: "certification", label: "Sertifikasyon" }
  ];

  const filteredGoals = selectedCategory === "all" 
    ? careerData.goals 
    : careerData.goals.filter(goal => goal.category === selectedCategory);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kariyer Gelişimi</h1>
          <p className="text-gray-600">Profesyonel gelişiminizi takip edin ve hedeflerinizi belirleyin</p>
        </div>
      </div>

      {/* Career Path Progress */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-yellow-600" />
            Kariyer Yolculuğu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium mt-2">{careerData.careerPath.current}</p>
                  <p className="text-xs text-gray-500">Mevcut</p>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400" />
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="text-sm font-medium mt-2">{careerData.careerPath.next}</p>
                  <p className="text-xs text-gray-500">Hedef</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-600">{careerData.careerPath.progress}%</p>
                <p className="text-sm text-gray-500">Tamamlandı</p>
              </div>
            </div>
            <Progress value={careerData.careerPath.progress} className="h-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {careerData.careerPath.requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                  {req.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`text-sm ${req.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                    {req.skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals and Objectives */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Hedefler ve Gelişim Planları
                </CardTitle>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryFilters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredGoals.map((goal) => (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                      </div>
                      <Badge className={
                        goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {goal.status === 'in_progress' ? 'Devam Ediyor' :
                         goal.status === 'completed' ? 'Tamamlandı' : 'Planlandı'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>İlerleme</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Hedef Tarih: {format(new Date(goal.deadline), 'dd MMM yyyy')}</span>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      {goal.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          {milestone.completed ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clock className="h-3 w-3 text-gray-400" />
                          )}
                          <span className={milestone.completed ? 'text-gray-900' : 'text-gray-500'}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skill Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Yetenek Matrisi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Teknik Yetenekler</h4>
                  <div className="space-y-3">
                    {careerData.skillMatrix.technical.map((skill, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{skill.name}</span>
                          <span>{skill.level}% / {skill.required}%</span>
                        </div>
                        <div className="flex gap-1">
                          <Progress value={skill.level} className="flex-1 h-2" />
                          <div className={`w-1 h-2 rounded-full ${getSkillColor(skill.level, skill.required)}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Sosyal Yetenekler</h4>
                  <div className="space-y-3">
                    {careerData.skillMatrix.soft.map((skill, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{skill.name}</span>
                          <span>{skill.level}% / {skill.required}%</span>
                        </div>
                        <div className="flex gap-1">
                          <Progress value={skill.level} className="flex-1 h-2" />
                          <div className={`w-1 h-2 rounded-full ${getSkillColor(skill.level, skill.required)}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Mentorship */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Mentorluk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">Mentorun</h4>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {careerData.mentorship.mentor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{careerData.mentorship.mentor.name}</p>
                    <p className="text-xs text-gray-600">{careerData.mentorship.mentor.role}</p>
                    <p className="text-xs text-gray-500">
                      Sonraki toplantı: {format(new Date(careerData.mentorship.mentor.nextMeeting), 'dd MMM')}
                    </p>
                  </div>
                </div>
              </div>
              
              {careerData.mentorship.mentees.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Mentee'lerin</h4>
                  {careerData.mentorship.mentees.map((mentee, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">
                          {mentee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{mentee.name}</p>
                        <p className="text-xs text-gray-600">{mentee.role}</p>
                        <p className="text-xs text-gray-500">
                          Başlangıç: {format(new Date(mentee.startDate), 'MMM yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Son Başarılar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {careerData.achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div key={achievement.id} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <IconComponent className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(achievement.date), 'dd MMM yyyy')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}