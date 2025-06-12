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
  Users, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Star,
  MessageCircle,
  UserPlus,
  Settings
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const teamSchema = z.object({
  name: z.string().min(2, "Takım adı en az 2 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  department: z.string().min(1, "Departman seçilmelidir"),
  leaderId: z.string().min(1, "Takım lideri seçilmelidir"),
  members: z.array(z.string()).min(1, "En az bir üye seçilmelidir"),
  goals: z.string().optional(),
  notes: z.string().optional()
});

type TeamFormData = z.infer<typeof teamSchema>;

const departmentOptions = [
  { value: "yazilim", label: "Yazılım Geliştirme" },
  { value: "pazarlama", label: "Pazarlama" },
  { value: "satis", label: "Satış" },
  { value: "ik", label: "İnsan Kaynakları" },
  { value: "muhasebe", label: "Muhasebe" },
  { value: "operasyon", label: "Operasyon" }
];

export default function Team() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ["/api/teams"]
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"]
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"]
  });

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      description: "",
      department: "",
      leaderId: "",
      members: [],
      goals: "",
      notes: ""
    }
  });

  const createTeamMutation = useMutation({
    mutationFn: async (data: TeamFormData) => {
      return apiRequest("/api/teams", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Başarılı",
        description: "Takım başarıyla oluşturuldu",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Takım oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/teams/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({
        title: "Başarılı",
        description: "Takım başarıyla silindi",
      });
    }
  });

  // Filter teams
  const filteredTeams = React.useMemo(() => {
    return teams.filter((team: any) => {
      const matchesSearch = team.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           team.description?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           team.leader?.firstName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                           team.leader?.lastName?.toLowerCase()?.includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === "all" || team.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [teams, searchTerm, departmentFilter]);

  const handleSubmit = (data: TeamFormData) => {
    createTeamMutation.mutate(data);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getTeamStats = () => {
    const totalTeams = teams.length;
    const totalMembers = teams.reduce((sum: number, team: any) => sum + (team.members?.length || 0), 0);
    const avgTeamSize = totalTeams > 0 ? Math.round(totalMembers / totalTeams) : 0;
    const activeDepartments = [...new Set(teams.map((team: any) => team.department))].length;
    
    return { totalTeams, totalMembers, avgTeamSize, activeDepartments };
  };

  const stats = getTeamStats();

  if (teamsLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Takım Yönetimi</h1>
            <p className="text-gray-600">Takımları yönetin ve ekip performansını takip edin</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Takım
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Yeni Takım Oluştur</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Takım Adı</FormLabel>
                          <FormControl>
                            <Input placeholder="Frontend Takımı" {...field} className="border-gray-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Departman</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="Departman seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              {departmentOptions.map((dept) => (
                                <SelectItem key={dept.value} value={dept.value}>
                                  {dept.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Açıklama</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Takımın görev ve sorumluluklarını açıklayın" {...field} className="border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="leaderId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Takım Lideri</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300">
                              <SelectValue placeholder="Takım lideri seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            {employees.map((employee: any) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.firstName} {employee.lastName} - {employee.position}
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
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Takım Hedefleri</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Takımın ana hedeflerini belirtin" {...field} className="border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Notlar</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Ek notlar ve açıklamalar" {...field} className="border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-3 pt-4">
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
                      disabled={createTeamMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {createTeamMutation.isPending ? "Oluşturuluyor..." : "Takım Oluştur"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Toplam Takım</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalTeams}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Toplam Üye</p>
                  <p className="text-3xl font-bold text-green-900">{stats.totalMembers}</p>
                </div>
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Ortalama Takım Boyutu</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.avgTeamSize}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Aktif Departman</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.activeDepartments}</p>
                </div>
                <Filter className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Takım ara (ad, açıklama, lider)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Departman filtrele" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tüm Departmanlar</SelectItem>
              {departmentOptions.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team: any) => (
            <Card key={team.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{team.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{team.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {departmentOptions.find(d => d.value === team.department)?.label || team.department}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Team Leader */}
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-10 w-10 bg-blue-100">
                    <AvatarFallback className="text-blue-600 font-semibold">
                      {getInitials(team.leader?.firstName, team.leader?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {team.leader?.firstName} {team.leader?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">Takım Lideri</p>
                  </div>
                </div>

                {/* Team Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{team.members?.length || 0}</p>
                    <p className="text-xs text-gray-600">Üye</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {team.completedProjects || 0}
                    </p>
                    <p className="text-xs text-gray-600">Proje</p>
                  </div>
                </div>

                {/* Team Members Preview */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Takım Üyeleri</p>
                  <div className="flex -space-x-2">
                    {(team.members || []).slice(0, 5).map((member: any, index: number) => (
                      <Avatar key={index} className="h-8 w-8 bg-gray-100 border-2 border-white">
                        <AvatarFallback className="text-gray-600 text-xs">
                          {getInitials(member.firstName, member.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {(team.members?.length || 0) > 5 && (
                      <div className="h-8 w-8 bg-gray-200 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{(team.members?.length || 0) - 5}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => deleteTeamMutation.mutate(team.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Takım bulunamadı</h3>
            <p className="text-gray-600">
              {searchTerm || departmentFilter !== "all" 
                ? "Arama kriterlerinize uygun takım bulunamadı. Filtreleri değiştirmeyi deneyin."
                : "Henüz hiç takım oluşturulmamış. İlk takımınızı oluşturmak için yukarıdaki butonu kullanın."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}