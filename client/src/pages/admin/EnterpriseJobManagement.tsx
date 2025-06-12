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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Users,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  TrendingUp,
  Target,
  Award,
  Filter,
  Download,
  MoreVertical,
  Star
} from "lucide-react";

interface JobPosting {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary: string;
  type: string;
  status: string;
  departmentId: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  applicationCount?: number;
  priority: string;
  experienceLevel: string;
}

export default function EnterpriseJobManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Enterprise-grade job data
  const jobPostings = [
    {
      id: 1,
      title: "Senior Enterprise Architect",
      description: "Enterprise düzeyinde sistem mimarisi tasarımı ve yönetimi. Büyük ölçekli projelerde teknik liderlik.",
      requirements: "10+ yıl deneyim, Enterprise Architecture, Microservices, Cloud Native, TOGAF sertifikası",
      location: "İstanbul Finansal Merkez",
      salary: "45,000 - 65,000 TL",
      type: "full-time",
      status: "active",
      departmentId: 1,
      companyId: 1,
      createdAt: "2024-12-01T00:00:00Z",
      updatedAt: "2024-12-01T00:00:00Z",
      applicationCount: 12,
      priority: "high",
      experienceLevel: "senior"
    },
    {
      id: 2,
      title: "Chief Technology Officer (CTO)",
      description: "Şirketin teknoloji stratejisini belirleyecek ve teknoloji ekiplerini yönetecek üst düzey yönetici pozisyonu.",
      requirements: "15+ yıl teknoloji deneyimi, 5+ yıl C-level deneyim, Teknoloji stratejisi, Takım yönetimi",
      location: "İstanbul Merkez",
      salary: "80,000 - 120,000 TL",
      type: "full-time",
      status: "active",
      departmentId: 1,
      companyId: 1,
      createdAt: "2024-11-25T00:00:00Z",
      updatedAt: "2024-11-25T00:00:00Z",
      applicationCount: 8,
      priority: "critical",
      experienceLevel: "executive"
    },
    {
      id: 3,
      title: "Enterprise Data Scientist",
      description: "Büyük veri setleri ile makine öğrenmesi ve AI modelleri geliştirme, iş zekası çözümleri oluşturma.",
      requirements: "PhD/MSc veri bilimi, Python, R, TensorFlow, PyTorch, SQL, Big Data teknolojileri",
      location: "İstanbul/Ankara",
      salary: "35,000 - 50,000 TL",
      type: "full-time",
      status: "active",
      departmentId: 2,
      companyId: 1,
      createdAt: "2024-12-03T00:00:00Z",
      updatedAt: "2024-12-03T00:00:00Z",
      applicationCount: 25,
      priority: "high",
      experienceLevel: "senior"
    },
    {
      id: 4,
      title: "Corporate Security Manager",
      description: "Kurumsal siber güvenlik stratejilerini yönetme, güvenlik politikaları oluşturma ve uygulama.",
      requirements: "CISSP, CISM sertifikaları, 8+ yıl siber güvenlik deneyimi, Risk management",
      location: "İstanbul",
      salary: "40,000 - 55,000 TL",
      type: "full-time",
      status: "urgent",
      departmentId: 3,
      companyId: 1,
      createdAt: "2024-11-28T00:00:00Z",
      updatedAt: "2024-12-01T00:00:00Z",
      applicationCount: 15,
      priority: "critical",
      experienceLevel: "senior"
    },
    {
      id: 5,
      title: "Strategic Business Analyst",
      description: "İş süreçlerini analiz etme, stratejik planlama ve corporate transformation projelerinde rol alma.",
      requirements: "MBA, 5+ yıl business analysis, Strategic planning, Process optimization, Consulting background",
      location: "İstanbul",
      salary: "28,000 - 38,000 TL",
      type: "full-time",
      status: "active",
      departmentId: 4,
      companyId: 1,
      createdAt: "2024-12-05T00:00:00Z",
      updatedAt: "2024-12-05T00:00:00Z",
      applicationCount: 31,
      priority: "medium",
      experienceLevel: "mid-senior"
    },
    {
      id: 6,
      title: "Global Product Manager",
      description: "Uluslararası pazarlara yönelik ürün geliştirme stratejileri ve roadmap yönetimi.",
      requirements: "Product management, International markets, Agile/Scrum, Data-driven decision making",
      location: "İstanbul/Remote",
      salary: "32,000 - 45,000 TL",
      type: "hybrid",
      status: "active",
      departmentId: 5,
      companyId: 1,
      createdAt: "2024-11-30T00:00:00Z",
      updatedAt: "2024-11-30T00:00:00Z",
      applicationCount: 19,
      priority: "high",
      experienceLevel: "senior"
    }
  ];

  const { data: departments = [] } = useQuery({
    queryKey: ["/api/departments"],
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["/api/companies"],
  });

  const isLoading = false;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500 text-white">Aktif İlan</Badge>;
      case "urgent":
        return <Badge className="bg-red-500 text-white animate-pulse">Acil</Badge>;
      case "paused":
        return <Badge className="bg-amber-500 text-white">Askıda</Badge>;
      case "closed":
        return <Badge className="bg-gray-500 text-white">Kapatıldı</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Star className="h-4 w-4 text-red-500 fill-red-500" />;
      case "high":
        return <Star className="h-4 w-4 text-orange-500 fill-orange-500" />;
      case "medium":
        return <Star className="h-4 w-4 text-blue-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-400" />;
    }
  };

  const getExperienceLevel = (level: string) => {
    switch (level) {
      case "executive":
        return <Badge className="bg-purple-600 text-white">C-Level</Badge>;
      case "senior":
        return <Badge className="bg-blue-600 text-white">Senior</Badge>;
      case "mid-senior":
        return <Badge className="bg-green-600 text-white">Mid-Senior</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const filteredJobs = jobPostings.filter((job: JobPosting) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || job.departmentId.toString() === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const totalApplications = filteredJobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0);
  const activeJobs = filteredJobs.filter(job => job.status === "active").length;
  const urgentJobs = filteredJobs.filter(job => job.status === "urgent").length;
  const avgApplicationsPerJob = filteredJobs.length > 0 ? Math.round(totalApplications / filteredJobs.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enterprise Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Executive Recruitment Hub
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Enterprise-level talent acquisition and strategic hiring management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="bg-white border-gray-300 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Position
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Metrics Dashboard */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Positions</p>
                  <p className="text-3xl font-bold">{filteredJobs.length}</p>
                  <p className="text-blue-100 text-xs mt-1">Active recruitment</p>
                </div>
                <Target className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Applications</p>
                  <p className="text-3xl font-bold">{totalApplications}</p>
                  <p className="text-emerald-100 text-xs mt-1">Candidate pipeline</p>
                </div>
                <Users className="h-12 w-12 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Urgent Positions</p>
                  <p className="text-3xl font-bold">{urgentJobs}</p>
                  <p className="text-amber-100 text-xs mt-1">Immediate attention</p>
                </div>
                <TrendingUp className="h-12 w-12 text-amber-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Avg Applications</p>
                  <p className="text-3xl font-bold">{avgApplicationsPerJob}</p>
                  <p className="text-purple-100 text-xs mt-1">Per position</p>
                </div>
                <Award className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filtering System */}
        <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg">Strategic Filters</CardTitle>
              </div>
              <Button variant="ghost" size="sm">Reset All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search positions, skills, requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Status Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Department Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="1">Technology</SelectItem>
                  <SelectItem value="2">Data Science</SelectItem>
                  <SelectItem value="3">Security</SelectItem>
                  <SelectItem value="4">Strategy</SelectItem>
                  <SelectItem value="5">Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Executive Positions Table */}
        <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Executive Positions Pipeline</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-700">
                  <TableRow>
                    <TableHead className="font-semibold">Position & Priority</TableHead>
                    <TableHead className="font-semibold">Level & Location</TableHead>
                    <TableHead className="font-semibold">Compensation</TableHead>
                    <TableHead className="font-semibold">Pipeline</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Timeline</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job: JobPosting) => (
                    <TableRow key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100">
                      <TableCell className="py-4">
                        <div className="flex items-start space-x-3">
                          {getPriorityIcon(job.priority)}
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {job.title}
                            </h3>
                            <p className="text-gray-500 text-xs mt-1 max-w-xs truncate">
                              {job.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getExperienceLevel(job.experienceLevel)}
                          <div className="flex items-center text-gray-500 text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            {job.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-900 dark:text-white">
                          <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                          <span className="font-medium text-sm">{job.salary}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-600">{job.applicationCount}</span>
                          <span className="text-gray-500 text-xs">candidates</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(job.createdAt).toLocaleDateString("en-US", { 
                            month: "short", 
                            day: "numeric" 
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No positions found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Adjust your filters or create a new position to get started.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}