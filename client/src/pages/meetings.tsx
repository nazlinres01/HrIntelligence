import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Clock,
  Users,
  Video,
  MapPin,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  XCircle,
  User,
  Edit,
  Trash2,
  Copy,
  FileText,
  MessageSquare,
  Bell
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useDepartmentManager } from "@/lib/departmentUtils";

const meetingSchema = z.object({
  title: z.string().min(2, "Toplantı başlığı en az 2 karakter olmalıdır"),
  description: z.string().min(5, "Açıklama en az 5 karakter olmalıdır"),
  type: z.string().min(1, "Toplantı türü seçilmelidir"),
  priority: z.string().min(1, "Öncelik seviyesi seçilmelidir"),
  date: z.string().min(1, "Toplantı tarihi belirtilmelidir"),
  startTime: z.string().min(1, "Başlama saati belirtilmelidir"),
  endTime: z.string().min(1, "Bitiş saati belirtilmelidir"),
  location: z.string().optional(),
  meetingLink: z.string().optional(),
  organizer: z.string().min(1, "Organizatör seçilmelidir"),
  participants: z.array(z.string()).min(1, "En az bir katılımcı seçilmelidir"),
  agenda: z.string().optional(),
  isRecurring: z.boolean().optional(),
  reminderMinutes: z.string().optional()
});

type MeetingFormData = z.infer<typeof meetingSchema>;

const meetingTypes = [
  { value: "team", label: "Ekip Toplantısı", icon: Users },
  { value: "project", label: "Proje Toplantısı", icon: FileText },
  { value: "oneonone", label: "Birebir Görüşme", icon: User },
  { value: "review", label: "Değerlendirme", icon: CheckCircle },
  { value: "planning", label: "Planlama", icon: Calendar },
  { value: "training", label: "Eğitim", icon: PlayCircle }
];

const priorities = [
  { value: "low", label: "Düşük", color: "bg-green-500" },
  { value: "medium", label: "Orta", color: "bg-yellow-500" },
  { value: "high", label: "Yüksek", color: "bg-orange-500" },
  { value: "urgent", label: "Acil", color: "bg-red-500" }
];

const statuses = [
  { value: "scheduled", label: "Planlandı", color: "bg-blue-500" },
  { value: "in_progress", label: "Devam Ediyor", color: "bg-green-500" },
  { value: "completed", label: "Tamamlandı", color: "bg-gray-500" },
  { value: "cancelled", label: "İptal Edildi", color: "bg-red-500" },
  { value: "postponed", label: "Ertelendi", color: "bg-yellow-500" }
];

const reminderOptions = [
  { value: "0", label: "Hatırlatma Yok" },
  { value: "5", label: "5 dakika önce" },
  { value: "15", label: "15 dakika önce" },
  { value: "30", label: "30 dakika önce" },
  { value: "60", label: "1 saat önce" },
  { value: "1440", label: "1 gün önce" }
];

export default function Meetings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { departmentId, isDepartmentManager } = useDepartmentManager();

  // Mock meeting data for demonstration
  const mockMeetings = [
    {
      id: 1,
      title: "Haftalık Ekip Sync",
      description: "Haftalık ilerleme ve önümüzdeki hafta planlaması",
      type: "team",
      priority: "medium",
      date: "2024-11-25",
      startTime: "09:00",
      endTime: "10:00",
      location: "Toplantı Odası A",
      meetingLink: "",
      organizer: "Ali Özkan",
      participants: ["Ahmet Yılmaz", "Ayşe Demir", "Mehmet Kaya"],
      agenda: "1. Geçen hafta özeti\n2. Bu hafta hedefleri\n3. Sorunlar ve çözümler",
      status: "scheduled",
      isRecurring: true,
      reminderMinutes: "15",
      createdBy: "dept_manager_001"
    },
    {
      id: 2,
      title: "Proje Değerlendirme Toplantısı",
      description: "E-ticaret projesi ilerleme değerlendirmesi",
      type: "project",
      priority: "high",
      date: "2024-11-26",
      startTime: "14:00",
      endTime: "15:30",
      location: "",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      organizer: "Ali Özkan",
      participants: ["Fatma Şahin", "Emre Yıldız", "Zeynep Ak"],
      agenda: "1. Proje durumu\n2. Risk analizi\n3. Kaynak ihtiyaçları",
      status: "scheduled",
      isRecurring: false,
      reminderMinutes: "30",
      createdBy: "dept_manager_001"
    },
    {
      id: 3,
      title: "Performans Değerlendirmesi - Ahmet Yılmaz",
      description: "Çeyrek dönem performans görüşmesi",
      type: "oneonone",
      priority: "medium",
      date: "2024-11-27",
      startTime: "11:00",
      endTime: "12:00",
      location: "Yönetici Ofisi",
      meetingLink: "",
      organizer: "Ali Özkan",
      participants: ["Ahmet Yılmaz"],
      agenda: "1. Performans özeti\n2. Hedef gözden geçirme\n3. Gelişim planı",
      status: "scheduled",
      isRecurring: false,
      reminderMinutes: "60",
      createdBy: "dept_manager_001"
    },
    {
      id: 4,
      title: "React Eğitimi",
      description: "Ekip için React best practices eğitimi",
      type: "training",
      priority: "low",
      date: "2024-11-28",
      startTime: "10:00",
      endTime: "12:00",
      location: "Eğitim Salonu",
      meetingLink: "",
      organizer: "Ali Özkan",
      participants: ["Ayşe Demir", "Can Özdemir", "Seda Kara"],
      agenda: "1. React hooks\n2. State management\n3. Performance optimization",
      status: "scheduled",
      isRecurring: false,
      reminderMinutes: "1440",
      createdBy: "dept_manager_001"
    }
  ];

  const { data: employees = [] } = useQuery({
    queryKey: isDepartmentManager && departmentId 
      ? [`/api/employees/department/${departmentId}`] 
      : ["/api/employees"],
    enabled: !isDepartmentManager || !!departmentId
  });

  const form = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      priority: "medium",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      meetingLink: "",
      organizer: "",
      participants: [],
      agenda: "",
      isRecurring: false,
      reminderMinutes: "15"
    }
  });

  const createMeetingMutation = useMutation({
    mutationFn: async (data: MeetingFormData) => {
      return apiRequest("POST", "/api/meetings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meetings"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Toplantı başarıyla oluşturuldu",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Toplantı oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: MeetingFormData) => {
    createMeetingMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    if (!statusObj) return <Badge variant="secondary">Belirsiz</Badge>;
    
    return (
      <Badge className={`text-white ${statusObj.color}`}>
        {statusObj.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    if (!priorityObj) return <Badge variant="secondary">-</Badge>;
    
    return (
      <Badge className={`text-white ${priorityObj.color}`}>
        {priorityObj.label}
      </Badge>
    );
  };

  const getMeetingTypeIcon = (type: string) => {
    const typeObj = meetingTypes.find(t => t.value === type);
    if (!typeObj) return Calendar;
    return typeObj.icon;
  };

  const filteredMeetings = mockMeetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || meeting.type === filterType;
    const matchesStatus = filterStatus === "all" || meeting.status === filterStatus;
    const matchesDate = !selectedDate || meeting.date === selectedDate;
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const todayMeetings = mockMeetings.filter(m => m.date === new Date().toISOString().split('T')[0]);
  const upcomingMeetings = mockMeetings.filter(m => new Date(m.date) > new Date()).length;

  const meetingStats = {
    totalMeetings: mockMeetings.length,
    todayMeetings: todayMeetings.length,
    upcomingMeetings: upcomingMeetings,
    completedMeetings: mockMeetings.filter(m => m.status === "completed").length
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Toplantı Yönetimi</h1>
            <p className="text-gray-600">Toplantıları planlayın ve takip edin</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Toplantı Listesi</h2>
              <p className="text-gray-600">Departman toplantılarını yönetin</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Toplantı
                </Button>
              </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Yeni Toplantı Planla</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Toplantı Başlığı</FormLabel>
                      <FormControl>
                        <Input placeholder="Toplantı başlığını giriniz" {...field} />
                      </FormControl>
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
                        <Textarea placeholder="Toplantı açıklaması" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Toplantı Türü</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Toplantı türü seçiniz" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {meetingTypes.map((type) => (
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
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Öncelik</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Öncelik seçiniz" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priorities.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value}>
                                {priority.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tarih</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Başlama Saati</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bitiş Saati</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konum</FormLabel>
                        <FormControl>
                          <Input placeholder="Toplantı odası veya adres" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="meetingLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Toplantı Linki</FormLabel>
                        <FormControl>
                          <Input placeholder="Online toplantı linki" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="organizer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organizatör</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Organizatör seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(employees as any[]).map((employee) => (
                            <SelectItem key={employee.id} value={`${employee.firstName} ${employee.lastName}`}>
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
                  name="agenda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ajanda</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Toplantı ajandası (opsiyonel)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reminderMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hatırlatma</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Hatırlatma seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {reminderOptions.map((reminder) => (
                            <SelectItem key={reminder.value} value={reminder.value}>
                              {reminder.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Toplantı Oluştur
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Toplam Toplantı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{meetingStats.totalMeetings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Bugün
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{meetingStats.todayMeetings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Yaklaşan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{meetingStats.upcomingMeetings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Tamamlanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{meetingStats.completedMeetings}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Toplantı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full md:w-48"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tür filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                {meetingTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Durum filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Meetings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMeetings.map((meeting) => {
          const TypeIcon = getMeetingTypeIcon(meeting.type);
          return (
            <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TypeIcon className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{meeting.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{meeting.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {getPriorityBadge(meeting.priority)}
                    {getStatusBadge(meeting.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{meeting.startTime} - {meeting.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{meeting.organizer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{meeting.participants.length} katılımcı</span>
                  </div>
                </div>

                {(meeting.location || meeting.meetingLink) && (
                  <div className="space-y-2">
                    {meeting.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{meeting.location}</span>
                      </div>
                    )}
                    {meeting.meetingLink && (
                      <div className="flex items-center gap-2 text-sm">
                        <Video className="w-4 h-4 text-gray-400" />
                        <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline truncate">
                          Online toplantıya katıl
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Katılımcılar:</span>
                  <div className="flex -space-x-2">
                    {meeting.participants.slice(0, 3).map((participant, index) => (
                      <Avatar key={index} className="w-6 h-6 border-2 border-white">
                        <AvatarFallback className="text-xs">
                          {participant.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {meeting.participants.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{meeting.participants.length - 3}</span>
                      </div>
                    )}
                  </div>
                </div>

                {meeting.agenda && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Ajanda:</span>
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded text-xs">
                      {meeting.agenda.split('\n').map((item, index) => (
                        <div key={index}>{item}</div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {meeting.isRecurring && <Badge variant="outline">Tekrarlanan</Badge>}
                    {meeting.reminderMinutes !== "0" && (
                      <div className="flex items-center gap-1">
                        <Bell className="w-3 h-3" />
                        <span>{reminderOptions.find(r => r.value === meeting.reminderMinutes)?.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3 mr-1" />
                      Düzenle
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Copy className="w-3 h-3 mr-1" />
                      Kopyala
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMeetings.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Toplantı bulunamadı</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== "all" || filterStatus !== "all" || selectedDate
                ? "Arama kriterlerinize uygun toplantı bulunamadı"
                : "Henüz hiç toplantı planlanmamış"}
            </p>
          </CardContent>
        </Card>
      )}
        </div>
      </div>
    </div>
  );
}