import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  Search, 
  Calendar,
  Pin,
  Star,
  Eye,
  Download,
  ExternalLink,
  Users,
  AlertCircle,
  CheckCircle,
  Info,
  Megaphone
} from "lucide-react";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

export default function Announcements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const { user } = useAuth();

  // Mock announcements data
  const announcementsData = {
    announcements: [
      {
        id: 1,
        title: "Yeni Ofis Politikaları Güncellendi",
        content: "Hibrit çalışma modeli ile ilgili yeni düzenlemeler 1 Temmuz'dan itibaren geçerli olacaktır. Detaylar için İK departmanı ile iletişime geçiniz.",
        category: "Policy",
        priority: "high",
        author: {
          name: "Mehmet Kaya",
          role: "İK Müdürü",
          avatar: ""
        },
        publishedDate: "2024-06-13T09:00:00Z",
        isPinned: true,
        isRead: false,
        viewCount: 128,
        tags: ["İK", "Politika", "Hibrit Çalışma"],
        attachments: [
          { name: "hibrit-calisma-politikasi.pdf", size: "245 KB", url: "#" }
        ]
      },
      {
        id: 2,
        title: "Şirket Pikniği - 20 Temmuz",
        content: "Yıllık şirket pikniğimiz 20 Temmuz Cumartesi günü Büyükada'da gerçekleştirilecektir. Katılım için 15 Temmuz'a kadar İK'ya başvurunuz.",
        category: "Event",
        priority: "normal",
        author: {
          name: "Ayşe Demir",
          role: "İK Uzmanı",
          avatar: ""
        },
        publishedDate: "2024-06-12T14:30:00Z",
        isPinned: false,
        isRead: true,
        viewCount: 89,
        tags: ["Etkinlik", "Sosyal", "Piknik"],
        attachments: []
      },
      {
        id: 3,
        title: "Sistem Bakımı Duyurusu",
        content: "Bu hafta sonu (15-16 Haziran) sistem bakımı yapılacaktır. VPN erişimi sınırlı olabilir.",
        category: "Technical",
        priority: "medium",
        author: {
          name: "Ali Özkan",
          role: "IT Müdürü",
          avatar: ""
        },
        publishedDate: "2024-06-11T16:45:00Z",
        isPinned: false,
        isRead: true,
        viewCount: 156,
        tags: ["Sistem", "Bakım", "VPN"],
        attachments: []
      },
      {
        id: 4,
        title: "Yeni Takım Üyeleri",
        content: "Frontend geliştirme ekibimize katılan yeni arkadaşlarımızı tanıtıyoruz. Hoş geldiniz mesajlarınızı bekliyoruz!",
        category: "HR",
        priority: "low",
        author: {
          name: "Fatma Yıldız",
          role: "Takım Lideri",
          avatar: ""
        },
        publishedDate: "2024-06-10T10:15:00Z",
        isPinned: false,
        isRead: true,
        viewCount: 73,
        tags: ["Takım", "Hoşgeldin", "Frontend"],
        attachments: []
      },
      {
        id: 5,
        title: "Q2 Performans Değerlendirmeleri",
        content: "2. çeyrek performans değerlendirmeleri başlamıştır. Değerlendirme formlarınızı 30 Haziran'a kadar tamamlayınız.",
        category: "HR",
        priority: "high",
        author: {
          name: "Mehmet Kaya",
          role: "İK Müdürü",
          avatar: ""
        },
        publishedDate: "2024-06-09T08:00:00Z",
        isPinned: true,
        isRead: false,
        viewCount: 95,
        tags: ["Performans", "Değerlendirme", "Q2"],
        attachments: [
          { name: "performans-formu.xlsx", size: "128 KB", url: "#" }
        ]
      }
    ],
    categories: [
      { value: "all", label: "Tüm Kategoriler", count: 5 },
      { value: "Policy", label: "Politika", count: 1 },
      { value: "Event", label: "Etkinlik", count: 1 },
      { value: "Technical", label: "Teknik", count: 1 },
      { value: "HR", label: "İnsan Kaynakları", count: 2 }
    ],
    stats: {
      totalAnnouncements: 5,
      unreadCount: 2,
      thisWeekCount: 3,
      pinnedCount: 2
    }
  };

  const priorities = [
    { value: "all", label: "Tüm Öncelikler" },
    { value: "high", label: "Yüksek" },
    { value: "medium", label: "Orta" },
    { value: "low", label: "Düşük" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4" />;
      case "medium":
        return <Info className="w-4 h-4" />;
      case "low":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Yüksek";
      case "medium":
        return "Orta";
      case "low":
        return "Düşük";
      default:
        return priority;
    }
  };

  const formatAnnouncementDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return "Bugün " + format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return "Dün " + format(date, "HH:mm");
    } else if (isThisWeek(date)) {
      return format(date, "EEEE HH:mm");
    } else {
      return format(date, "dd MMMM yyyy HH:mm");
    }
  };

  const filteredAnnouncements = announcementsData.announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || announcement.category === selectedCategory;
    const matchesPriority = selectedPriority === "all" || announcement.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Sort announcements: pinned first, then by date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Duyurular</h1>
          <p className="text-gray-600">Şirket duyuruları ve önemli bilgiler</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam Duyuru</p>
                <p className="text-lg font-semibold text-gray-900">{announcementsData.stats.totalAnnouncements}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Okunmamış</p>
                <p className="text-lg font-semibold text-gray-900">{announcementsData.stats.unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bu Hafta</p>
                <p className="text-lg font-semibold text-gray-900">{announcementsData.stats.thisWeekCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Pin className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sabitlenmiş</p>
                <p className="text-lg font-semibold text-gray-900">{announcementsData.stats.pinnedCount}</p>
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
            placeholder="Duyuru ara..."
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
            {announcementsData.categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label} ({category.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Öncelik" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {sortedAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Bu kriterlere uygun duyuru bulunamadı</p>
            </CardContent>
          </Card>
        ) : (
          sortedAnnouncements.map((announcement) => (
            <Card key={announcement.id} className={`${!announcement.isRead ? "ring-2 ring-yellow-200" : ""}`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {announcement.isPinned && (
                          <Pin className="w-4 h-4 text-yellow-600" />
                        )}
                        <h3 className={`text-lg font-semibold ${!announcement.isRead ? "text-gray-900" : "text-gray-700"}`}>
                          {announcement.title}
                        </h3>
                        {!announcement.isRead && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Yeni</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{announcement.category}</Badge>
                        <Badge className={getPriorityColor(announcement.priority)}>
                          <div className="flex items-center gap-1">
                            {getPriorityIcon(announcement.priority)}
                            {getPriorityLabel(announcement.priority)}
                          </div>
                        </Badge>
                        {announcement.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-gray-700">
                    <p>{announcement.content}</p>
                  </div>

                  {/* Attachments */}
                  {announcement.attachments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Ekler:</h4>
                      <div className="space-y-1">
                        {announcement.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Download className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{attachment.name}</span>
                            <span className="text-xs text-gray-500">({attachment.size})</span>
                            <Button size="sm" variant="ghost" className="ml-auto">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={announcement.author.avatar} />
                        <AvatarFallback className="bg-yellow-100 text-yellow-800 text-xs">
                          {announcement.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{announcement.author.name}</p>
                        <p className="text-xs text-gray-500">{announcement.author.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{announcement.viewCount}</span>
                      </div>
                      <span>{formatAnnouncementDate(announcement.publishedDate)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}