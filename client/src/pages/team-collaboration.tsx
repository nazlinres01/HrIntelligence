import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Users, 
  MessageSquare, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Star,
  Filter,
  Search,
  Video,
  FileText,
  GitBranch,
  Target,
  TrendingUp,
  Award,
  Coffee,
  Lightbulb,
  Zap,
  Heart,
  ThumbsUp,
  Share2,
  BookOpen,
  Settings
} from "lucide-react";
import { format, isToday, isThisWeek, differenceInDays } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

const collaborationItemSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  type: z.string().min(1, "Tür seçiniz"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  priority: z.string().optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional()
});

type CollaborationItemFormData = z.infer<typeof collaborationItemSchema>;

export default function TeamCollaboration() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Team collaboration data
  const collaborationData = {
    teamInfo: {
      name: "Frontend Geliştirme Takımı",
      memberCount: 6,
      activeProjects: 3,
      completedTasks: 142,
      teamScore: 4.7,
      department: "Yazılım Geliştirme"
    },
    teamMembers: [
      {
        id: "emp_001",
        name: "Ali Özkan",
        role: "Takım Lideri",
        avatar: "",
        status: "online",
        currentTask: "Code Review",
        expertise: ["React", "TypeScript", "Liderlik"],
        tasksCompleted: 28,
        rating: 4.9
      },
      {
        id: "emp_002",
        name: "Emre Şahin",
        role: "Senior Developer",
        avatar: "",
        status: "online",
        currentTask: "Component Geliştirme",
        expertise: ["React", "Vue.js", "Node.js"],
        tasksCompleted: 24,
        rating: 4.7
      },
      {
        id: "emp_003",
        name: "Zeynep Kara",
        role: "Junior Developer",
        avatar: "",
        status: "away",
        currentTask: "Bug Fixing",
        expertise: ["HTML", "CSS", "JavaScript"],
        tasksCompleted: 15,
        rating: 4.5
      },
      {
        id: "emp_004",
        name: "Ayşe Demir",
        role: "UX Designer",
        avatar: "",
        status: "online",
        currentTask: "Figma Tasarım",
        expertise: ["Figma", "Adobe XD", "Prototyping"],
        tasksCompleted: 22,
        rating: 4.8
      }
    ],
    activeProjects: [
      {
        id: "proj_001",
        name: "E-ticaret Platform Yenileme",
        description: "Mevcut e-ticaret platformunun modern teknolojilerle yenilenmesi",
        progress: 75,
        dueDate: "2024-07-15",
        priority: "high",
        status: "in_progress",
        teamMembers: ["Ali Özkan", "Emre Şahin", "Zeynep Kara"],
        tasksTotal: 24,
        tasksCompleted: 18,
        milestones: [
          { name: "API Entegrasyonu", completed: true },
          { name: "Frontend Geliştirme", completed: true },
          { name: "Test Süreci", completed: false },
          { name: "Deployment", completed: false }
        ]
      },
      {
        id: "proj_002",
        name: "Mobil Uygulama MVP",
        description: "React Native ile mobil uygulama geliştirme",
        progress: 45,
        dueDate: "2024-08-30",
        priority: "medium",
        status: "in_progress",
        teamMembers: ["Emre Şahin", "Ayşe Demir"],
        tasksTotal: 18,
        tasksCompleted: 8,
        milestones: [
          { name: "UI Design", completed: true },
          { name: "Navigation Setup", completed: false },
          { name: "API Connection", completed: false },
          { name: "Testing", completed: false }
        ]
      }
    ],
    recentActivities: [
      {
        id: 1,
        type: "task_completed",
        user: "Zeynep Kara",
        action: "Login sayfası bug'ını düzeltti",
        timestamp: "2024-06-13T05:30:00Z",
        project: "E-ticaret Platform",
        icon: CheckCircle,
        color: "text-green-600"
      },
      {
        id: 2,
        type: "code_review",
        user: "Ali Özkan",
        action: "Payment component'i için code review yaptı",
        timestamp: "2024-06-13T04:15:00Z",
        project: "E-ticaret Platform",
        icon: GitBranch,
        color: "text-blue-600"
      },
      {
        id: 3,
        type: "design_update",
        user: "Ayşe Demir",
        action: "Mobil app ana sayfa tasarımını güncelledi",
        timestamp: "2024-06-12T16:45:00Z",
        project: "Mobil Uygulama MVP",
        icon: Star,
        color: "text-purple-600"
      },
      {
        id: 4,
        type: "meeting",
        user: "Ali Özkan",
        action: "Haftalık sprint planning toplantısı başlattı",
        timestamp: "2024-06-12T14:00:00Z",
        project: "Tüm Projeler",
        icon: Calendar,
        color: "text-orange-600"
      }
    ],
    upcomingEvents: [
      {
        id: 1,
        title: "Sprint Review Toplantısı",
        type: "meeting",
        date: "2024-06-14T14:00:00Z",
        duration: "1 saat",
        attendees: ["Ali Özkan", "Emre Şahin", "Zeynep Kara", "Ayşe Demir"],
        project: "E-ticaret Platform"
      },
      {
        id: 2,
        title: "Code Review Session",
        type: "review",
        date: "2024-06-14T16:30:00Z",
        duration: "45 dakika",
        attendees: ["Ali Özkan", "Emre Şahin"],
        project: "E-ticaret Platform"
      },
      {
        id: 3,
        title: "Design Brainstorming",
        type: "brainstorm",
        date: "2024-06-15T10:00:00Z",
        duration: "2 saat",
        attendees: ["Ayşe Demir", "Emre Şahin"],
        project: "Mobil Uygulama MVP"
      }
    ],
    sharedResources: [
      {
        id: 1,
        title: "Frontend Best Practices Klavuzu",
        type: "document",
        author: "Emre Şahin",
        uploadDate: "2024-06-10T09:00:00Z",
        downloads: 15,
        category: "guide"
      },
      {
        id: 2,
        title: "React Component Kütüphanesi",
        type: "code",
        author: "Ali Özkan",
        uploadDate: "2024-06-08T14:30:00Z",
        downloads: 22,
        category: "resource"
      },
      {
        id: 3,
        title: "UI/UX Design System",
        type: "design",
        author: "Ayşe Demir",
        uploadDate: "2024-06-05T11:15:00Z",
        downloads: 18,
        category: "design"
      }
    ],
    teamStats: {
      totalTasks: 142,
      completedThisWeek: 12,
      averageTaskTime: "2.5 gün",
      teamEfficiency: 87,
      collaborationScore: 4.7,
      knowledgeSharing: 92
    }
  };

  const form = useForm<CollaborationItemFormData>({
    resolver: zodResolver(collaborationItemSchema),
    defaultValues: {
      title: "",
      type: "",
      description: "",
      priority: "medium",
      assignee: "",
      dueDate: ""
    }
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: CollaborationItemFormData) => {
      return apiRequest("POST", "/api/team-collaboration", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-collaboration"] });
      setIsCreateOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Yeni öğe oluşturuldu",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Öğe oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: CollaborationItemFormData) => {
    createItemMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "busy": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const formatTimeAgo = (date: string) => {
    const diffDays = differenceInDays(new Date(), new Date(date));
    if (diffDays === 0) return "Bugün";
    if (diffDays === 1) return "Dün";
    return `${diffDays} gün önce`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Takım Çalışması</h1>
          <p className="text-gray-600">{collaborationData.teamInfo.name} - İşbirliği ve Proje Yönetimi</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Görev
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni İşbirliği Öğesi</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Başlık</FormLabel>
                      <FormControl>
                        <Input placeholder="Görev başlığı" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tür</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tür seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="task">Görev</SelectItem>
                          <SelectItem value="meeting">Toplantı</SelectItem>
                          <SelectItem value="review">İnceleme</SelectItem>
                          <SelectItem value="brainstorm">Beyin Fırtınası</SelectItem>
                          <SelectItem value="research">Araştırma</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detaylı açıklama" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Öncelik</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Düşük</SelectItem>
                            <SelectItem value="medium">Orta</SelectItem>
                            <SelectItem value="high">Yüksek</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bitiş Tarihi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">
                    Oluştur
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Takım Üyeleri</p>
                <p className="text-2xl font-bold text-gray-900">{collaborationData.teamInfo.memberCount}</p>
                <p className="text-xs text-green-600 mt-1">3 aktif şu anda</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Projeler</p>
                <p className="text-2xl font-bold text-gray-900">{collaborationData.teamInfo.activeProjects}</p>
                <p className="text-xs text-blue-600 mt-1">2 yakında bitiyor</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bu Hafta Tamamlanan</p>
                <p className="text-2xl font-bold text-gray-900">{collaborationData.teamStats.completedThisWeek}</p>
                <p className="text-xs text-green-600 mt-1">+25% geçen haftaya göre</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Takım Skoru</p>
                <p className="text-2xl font-bold text-gray-900">{collaborationData.teamInfo.teamScore}</p>
                <p className="text-xs text-yellow-600 mt-1">Mükemmel performans</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Aktif Projeler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collaborationData.activeProjects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      </div>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority === 'high' ? 'Yüksek' : 
                         project.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>İlerleme</span>
                        <span>{project.progress}% ({project.tasksCompleted}/{project.tasksTotal})</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Bitiş Tarihi</p>
                        <p className="font-medium">{format(new Date(project.dueDate), 'dd MMM yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Takım Üyeleri</p>
                        <div className="flex -space-x-2 mt-1">
                          {project.teamMembers.slice(0, 3).map((member, index) => (
                            <Avatar key={index} className="w-6 h-6 border-2 border-white">
                              <AvatarFallback className="text-xs bg-yellow-100 text-yellow-800">
                                {getInitials(member)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {project.teamMembers.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                              +{project.teamMembers.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Kilometre Taşları</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {project.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {milestone.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-gray-400" />
                            )}
                            <span className={milestone.completed ? 'text-gray-900' : 'text-gray-500'}>
                              {milestone.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Son Aktiviteler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collaborationData.recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className={`p-2 rounded-lg bg-gray-100`}>
                        <IconComponent className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>{activity.project}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(activity.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Takım Üyeleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {collaborationData.teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-yellow-100 text-yellow-800">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                      <p className="text-xs text-blue-600">{member.currentTask}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Yaklaşan Etkinlikler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {collaborationData.upcomingEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {event.type === 'meeting' ? 'Toplantı' :
                         event.type === 'review' ? 'İnceleme' : 'Brainstorm'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>{format(new Date(event.date), 'dd MMM yyyy HH:mm')}</p>
                      <p>Süre: {event.duration}</p>
                      <p>Katılımcılar: {event.attendees.length} kişi</p>
                    </div>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Calendar className="h-3 w-3 mr-1" />
                        Katıl
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shared Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Paylaşılan Kaynaklar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {collaborationData.sharedResources.map((resource) => (
                  <div key={resource.id} className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-1">{resource.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {resource.author} • {formatTimeAgo(resource.uploadDate)}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {resource.category === 'guide' ? 'Kılavuz' :
                         resource.category === 'resource' ? 'Kaynak' : 'Tasarım'}
                      </Badge>
                      <span className="text-xs text-gray-500">{resource.downloads} indirme</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <FileText className="h-3 w-3 mr-1" />
                      Görüntüle
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}