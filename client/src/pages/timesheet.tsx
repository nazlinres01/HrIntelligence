import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Clock, 
  Plus, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Timer,
  Play,
  Pause,
  Square,
  BarChart3
} from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

const timeEntrySchema = z.object({
  date: z.string().min(1, "Tarih seçiniz"),
  startTime: z.string().min(1, "Başlangıç saati giriniz"),
  endTime: z.string().min(1, "Bitiş saati giriniz"),
  project: z.string().min(1, "Proje seçiniz"),
  task: z.string().min(1, "Görev açıklaması giriniz"),
  description: z.string().optional()
});

type TimeEntryFormData = z.infer<typeof timeEntrySchema>;

const projects = [
  { value: "project_1", label: "Website Yenileme Projesi" },
  { value: "project_2", label: "Mobil Uygulama Geliştirme" },
  { value: "project_3", label: "E-ticaret Platformu" },
  { value: "project_4", label: "Müşteri Portalı" },
  { value: "admin", label: "İdari İşler" },
  { value: "meeting", label: "Toplantılar" }
];

export default function Timesheet() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTimer, setCurrentTimer] = useState({
    project: "",
    task: "",
    startTime: "",
    elapsed: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Mock data for time entries
  const mockTimeEntries = [
    {
      id: 1,
      date: "2024-06-10",
      startTime: "09:00",
      endTime: "12:00",
      project: "project_1",
      task: "Ana sayfa tasarımı",
      description: "Responsive tasarım geliştirme",
      hours: 3,
      status: "approved"
    },
    {
      id: 2,
      date: "2024-06-10",
      startTime: "13:00",
      endTime: "17:00",
      project: "project_1",
      task: "Frontend kodlama",
      description: "React component geliştirme",
      hours: 4,
      status: "approved"
    },
    {
      id: 3,
      date: "2024-06-11",
      startTime: "09:00",
      endTime: "11:30",
      project: "project_2",
      task: "API entegrasyonu",
      description: "Backend servislerle entegrasyon",
      hours: 2.5,
      status: "pending"
    },
    {
      id: 4,
      date: "2024-06-11",
      startTime: "13:30",
      endTime: "17:30",
      project: "meeting",
      task: "Sprint planlama toplantısı",
      description: "Haftalık sprint planlama",
      hours: 4,
      status: "approved"
    }
  ];

  const form = useForm<TimeEntryFormData>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "",
      endTime: "",
      project: "",
      task: "",
      description: ""
    }
  });

  const createTimeEntryMutation = useMutation({
    mutationFn: async (data: TimeEntryFormData) => {
      return apiRequest("POST", "/api/time-entries", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Mesai kaydınız başarıyla oluşturuldu",
      });
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Mesai kaydı oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: TimeEntryFormData) => {
    createTimeEntryMutation.mutate(data);
  };

  const getProjectLabel = (projectValue: string) => {
    return projects.find(p => p.value === projectValue)?.label || projectValue;
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getTimeEntriesForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return mockTimeEntries.filter(entry => entry.date === dateStr);
  };

  const getTotalHoursForDate = (date: Date) => {
    return getTimeEntriesForDate(date).reduce((sum, entry) => sum + entry.hours, 0);
  };

  const getTotalWeekHours = () => {
    return weekDays.reduce((total, date) => total + getTotalHoursForDate(date), 0);
  };

  const startTimer = (project: string, task: string) => {
    setCurrentTimer({
      project,
      task,
      startTime: format(new Date(), "HH:mm"),
      elapsed: 0
    });
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    // Here you would save the time entry
    toast({
      title: "Timer Durduruldu",
      description: "Mesai kaydınız otomatik olarak oluşturuldu",
    });
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mesai Kayıtları</h1>
          <p className="text-gray-600">Çalışma saatlerinizi kaydedin ve takip edin</p>
        </div>
        <div className="flex gap-2">
          {isTimerRunning ? (
            <Button 
              onClick={stopTimer}
              className="bg-red-600 hover:bg-red-700"
            >
              <Square className="w-4 h-4 mr-2" />
              Timer Durdur
            </Button>
          ) : (
            <Button 
              onClick={() => startTimer("", "")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Timer Başlat
            </Button>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Kayıt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Yeni Mesai Kaydı</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Başlangıç</FormLabel>
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
                          <FormLabel>Bitiş</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proje</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Proje seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                              {projects.map((project) => (
                                <SelectItem key={project.value} value={project.value}>
                                  {project.label}
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
                    name="task"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Görev</FormLabel>
                        <FormControl>
                          <Input placeholder="Görev başlığı" {...field} />
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
                        <FormLabel>Açıklama (Opsiyonel)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Yapılan işin detayları" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      İptal
                    </Button>
                    <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">
                      Kaydet
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Week Navigation & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Hafta Özeti</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Toplam Saat:</span>
                <span className="font-semibold">{getTotalWeekHours()}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Hedef:</span>
                <span className="font-semibold">40h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Kalan:</span>
                <span className="font-semibold text-blue-600">{Math.max(0, 40 - getTotalWeekHours())}h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
                >
                  ← Önceki Hafta
                </Button>
                <h3 className="font-semibold text-gray-900">
                  {format(weekStart, "dd MMM")} - {format(weekEnd, "dd MMM yyyy")}
                </h3>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
                >
                  Sonraki Hafta →
                </Button>
              </div>

              {/* Weekly Calendar */}
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((date) => (
                  <div key={date.toISOString()} className="border rounded-lg p-3 min-h-[120px]">
                    <div className="text-center mb-2">
                      <div className="text-xs text-gray-500">
                        {format(date, "EEE")}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {format(date, "dd")}
                      </div>
                    </div>
                    <div className="space-y-1">
                      {getTimeEntriesForDate(date).map((entry) => (
                        <div key={entry.id} className="text-xs p-1 bg-blue-50 rounded border-l-2 border-blue-400">
                          <div className="font-medium truncate">{entry.task}</div>
                          <div className="text-gray-500">{entry.hours}h</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-center font-medium text-gray-600">
                      {getTotalHoursForDate(date)}h
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Time Entries List */}
      <Card>
        <CardHeader>
          <CardTitle>Detaylı Mesai Kayıtları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTimeEntries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {format(new Date(entry.date), "dd/MM/yyyy")}
                      </Badge>
                      <Badge className={statusColors[entry.status as keyof typeof statusColors]}>
                        {entry.status === "pending" ? "Beklemede" : 
                         entry.status === "approved" ? "Onaylandı" : "Reddedildi"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{entry.startTime} - {entry.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        <span>{entry.hours} saat</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{entry.task}</div>
                  <div className="text-sm text-gray-600">{getProjectLabel(entry.project)}</div>
                  {entry.description && (
                    <div className="text-sm text-gray-500 mt-1">{entry.description}</div>
                  )}
                </div>
                {entry.status === "pending" && (
                  <div className="flex items-center gap-2 text-sm text-yellow-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Yönetici onayı bekleniyor</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}