import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Users, 
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  UserCheck,
  MessageSquare,
  Video,
  Filter,
  Download,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

export default function CompanyDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const { user } = useAuth();

  // Company directory data
  const directoryData = {
    employees: [
      {
        id: "emp_001",
        firstName: "Ali",
        lastName: "Özkan",
        email: "ali.ozkan@company.com",
        phone: "+90 532 123 4567",
        position: "Proje Yöneticisi",
        department: "Yazılım Geliştirme",
        team: "Frontend Takımı",
        location: "İstanbul - Merkez",
        office: "Kat 3, Oda 305",
        startDate: "2018-06-15",
        manager: "Mehmet Kaya",
        directReports: 5,
        status: "Aktif",
        workType: "Hibrit",
        avatar: "",
        skills: ["React", "TypeScript", "Proje Yönetimi"],
        languages: ["Türkçe", "İngilizce"],
        education: "Bilgisayar Mühendisliği",
        birthday: "15 Mart",
        emergencyContact: "+90 532 987 6543"
      },
      {
        id: "emp_002",
        firstName: "Emre",
        lastName: "Şahin",
        email: "emre.sahin@company.com",
        phone: "+90 532 234 5678",
        position: "Senior Frontend Developer",
        department: "Yazılım Geliştirme",
        team: "Frontend Takımı",
        location: "İstanbul - Merkez",
        office: "Kat 3, Oda 302",
        startDate: "2020-03-15",
        manager: "Ali Özkan",
        directReports: 0,
        status: "Aktif",
        workType: "Hibrit",
        avatar: "",
        skills: ["React", "Vue.js", "Node.js"],
        languages: ["Türkçe", "İngilizce"],
        education: "Bilgisayar Mühendisliği",
        birthday: "22 Mayıs",
        emergencyContact: "+90 532 876 5432"
      },
      {
        id: "emp_003",
        firstName: "Ayşe",
        lastName: "Demir",
        email: "ayse.demir@company.com",
        phone: "+90 532 345 6789",
        position: "UX/UI Tasarımcı",
        department: "Tasarım",
        team: "UX Takımı",
        location: "İstanbul - Merkez",
        office: "Kat 2, Oda 201",
        startDate: "2019-09-01",
        manager: "Fatma Yıldız",
        directReports: 0,
        status: "Aktif",
        workType: "Ofis",
        avatar: "",
        skills: ["Figma", "Adobe XD", "Prototyping"],
        languages: ["Türkçe", "İngilizce", "Almanca"],
        education: "Endüstriyel Tasarım",
        birthday: "8 Temmuz",
        emergencyContact: "+90 532 765 4321"
      },
      {
        id: "emp_004",
        firstName: "Mehmet",
        lastName: "Kaya",
        email: "mehmet.kaya@company.com",
        phone: "+90 532 456 7890",
        position: "İK Müdürü",
        department: "İnsan Kaynakları",
        team: "İK Ekibi",
        location: "İstanbul - Merkez",
        office: "Kat 4, Oda 401",
        startDate: "2017-02-20",
        manager: "Yönetim Kurulu",
        directReports: 8,
        status: "Aktif",
        workType: "Hibrit",
        avatar: "",
        skills: ["İK Yönetimi", "Performans Değerlendirme", "Eğitim"],
        languages: ["Türkçe", "İngilizce"],
        education: "İşletme",
        birthday: "12 Aralık",
        emergencyContact: "+90 532 654 3210"
      },
      {
        id: "emp_005",
        firstName: "Fatma",
        lastName: "Yıldız",
        email: "fatma.yildiz@company.com",
        phone: "+90 532 567 8901",
        position: "Tasarım Takım Lideri",
        department: "Tasarım",
        team: "UX Takımı",
        location: "İstanbul - Merkez",
        office: "Kat 2, Oda 205",
        startDate: "2016-11-10",
        manager: "Mehmet Kaya",
        directReports: 4,
        status: "Aktif",
        workType: "Hibrit",
        avatar: "",
        skills: ["Takım Liderliği", "Design System", "Brand Identity"],
        languages: ["Türkçe", "İngilizce"],
        education: "Grafik Tasarım",
        birthday: "3 Şubat",
        emergencyContact: "+90 532 543 2109"
      },
      {
        id: "emp_006",
        firstName: "Zeynep",
        lastName: "Kara",
        email: "zeynep.kara@company.com",
        phone: "+90 532 678 9012",
        position: "Junior Frontend Developer",
        department: "Yazılım Geliştirme",
        team: "Frontend Takımı",
        location: "İstanbul - Merkez",
        office: "Kat 3, Oda 301",
        startDate: "2024-03-01",
        manager: "Emre Şahin",
        directReports: 0,
        status: "Aktif",
        workType: "Hibrit",
        avatar: "",
        skills: ["HTML", "CSS", "JavaScript", "React"],
        languages: ["Türkçe", "İngilizce"],
        education: "Bilgisayar Programcılığı",
        birthday: "18 Haziran",
        emergencyContact: "+90 532 432 1098"
      }
    ],
    departments: [
      { name: "Yazılım Geliştirme", count: 15, manager: "Ali Özkan" },
      { name: "Tasarım", count: 8, manager: "Fatma Yıldız" },
      { name: "İnsan Kaynakları", count: 6, manager: "Mehmet Kaya" },
      { name: "Pazarlama", count: 12, manager: "Can Yılmaz" },
      { name: "Satış", count: 10, manager: "Seda Özgür" },
      { name: "Muhasebe", count: 4, manager: "Ahmet Güler" }
    ],
    locations: [
      { name: "İstanbul - Merkez", count: 45 },
      { name: "Ankara - Şube", count: 15 },
      { name: "İzmir - Şube", count: 8 },
      { name: "Uzaktan", count: 12 }
    ],
    stats: {
      totalEmployees: 80,
      onlineNow: 42,
      birthdaysThisWeek: 3,
      newHires: 5
    }
  };

  const filteredEmployees = directoryData.employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment;
    const matchesPosition = selectedPosition === "all" || employee.position.includes(selectedPosition);
    const matchesLocation = selectedLocation === "all" || employee.location === selectedLocation;
    
    return matchesSearch && matchesDepartment && matchesPosition && matchesLocation;
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktif': return 'bg-green-100 text-green-800';
      case 'izinli': return 'bg-yellow-100 text-yellow-800';
      case 'pasif': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkTypeColor = (workType: string) => {
    switch (workType.toLowerCase()) {
      case 'hibrit': return 'bg-blue-100 text-blue-800';
      case 'uzaktan': return 'bg-purple-100 text-purple-800';
      case 'ofis': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Şirket Rehberi</h1>
          <p className="text-gray-600">Çalışan bilgileri ve iletişim rehberi</p>
        </div>
        <Button variant="lightgray">
          <Download className="w-4 h-4 mr-2" />
          Rehberi İndir
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Çalışan</p>
                <p className="text-2xl font-bold text-gray-900">{directoryData.stats.totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Şu An Çevrimiçi</p>
                <p className="text-2xl font-bold text-green-600">{directoryData.stats.onlineNow}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bu Hafta Doğum Günü</p>
                <p className="text-2xl font-bold text-purple-600">{directoryData.stats.birthdaysThisWeek}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yeni İşe Alınanlar</p>
                <p className="text-2xl font-bold text-orange-600">{directoryData.stats.newHires}</p>
              </div>
              <Building className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="İsim, e-posta, pozisyon ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Departman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Departmanlar</SelectItem>
                {directoryData.departments.map((dept) => (
                  <SelectItem key={dept.name} value={dept.name}>
                    {dept.name} ({dept.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger>
                <SelectValue placeholder="Pozisyon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Pozisyonlar</SelectItem>
                <SelectItem value="Manager">Yönetici</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Designer">Tasarımcı</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Lokasyon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Lokasyonlar</SelectItem>
                {directoryData.locations.map((location) => (
                  <SelectItem key={location.name} value={location.name}>
                    {location.name} ({location.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Directory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Çalışan Listesi ({filteredEmployees.length})</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback className="bg-yellow-100 text-yellow-800 text-lg font-semibold">
                        {getInitials(employee.firstName, employee.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 truncate">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">{employee.position}</p>
                          <p className="text-xs text-gray-500">{employee.department}</p>
                        </div>
                        <div className="flex gap-1">
                          <Badge className={getStatusColor(employee.status)}>
                            {employee.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{employee.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{employee.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building className="h-3 w-3" />
                          <span className="truncate">{employee.office}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mt-3">
                        <Badge className={getWorkTypeColor(employee.workType)} variant="outline">
                          {employee.workType}
                        </Badge>
                        {employee.directReports > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {employee.directReports} Rapor
                          </Badge>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="text-xs text-gray-500">
                          Başlangıç: {format(new Date(employee.startDate), 'MMM yyyy')}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Video className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Skills */}
                      {employee.skills.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {employee.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {employee.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{employee.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}