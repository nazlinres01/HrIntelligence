import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Users, Bell, Calendar, Plus, Search, Pin, Archive } from "lucide-react";

export default function TeamCommunicationPage() {
  const channels = [
    {
      id: 1,
      name: "Genel Duyurular",
      description: "Departman geneli önemli duyurular",
      members: 24,
      unreadCount: 3,
      lastMessage: "Yeni proje kick-off toplantısı planlandı",
      lastMessageTime: "10:30",
      pinned: true
    },
    {
      id: 2,
      name: "Proje Alpha",
      description: "CRM geliştirme projesi ekibi",
      members: 8,
      unreadCount: 12,
      lastMessage: "Sprint review toplantısı yarın",
      lastMessageTime: "09:45",
      pinned: false
    },
    {
      id: 3,
      name: "Haftalık Sync",
      description: "Haftalık durum paylaşımları",
      members: 15,
      unreadCount: 0,
      lastMessage: "Bu hafta hedeflerimiz tamamlandı",
      lastMessageTime: "Dün",
      pinned: false
    },
    {
      id: 4,
      name: "İnovasyon Grubu",
      description: "Yeni fikirlerin paylaşıldığı kanal",
      members: 12,
      unreadCount: 5,
      lastMessage: "AI entegrasyonu önerisi",
      lastMessageTime: "14:20",
      pinned: false
    }
  ];

  const recentMessages = [
    {
      id: 1,
      sender: "Ahmet Yılmaz",
      avatar: "AY",
      message: "Proje Alpha için yeni mockup'lar hazır. İncelemenizi rica ederim.",
      time: "11:30",
      channel: "Proje Alpha",
      unread: true,
      attachments: ["mockup_v2.figma"]
    },
    {
      id: 2,
      sender: "Zeynep Kara",
      avatar: "ZK",
      message: "Gelecek hafta için ekip toplantısı planlandı. Katılım durumunuzu belirtir misiniz?",
      time: "10:45",
      channel: "Genel Duyurular",
      unread: true,
      attachments: []
    },
    {
      id: 3,
      sender: "Mehmet Öz",
      avatar: "MÖ",
      message: "Sprint retrospektif notları paylaşıldı. Geri bildirimlerinizi bekliyorum.",
      time: "09:20",
      channel: "Proje Alpha",
      unread: false,
      attachments: ["retrospektif_notlari.pdf"]
    },
    {
      id: 4,
      sender: "Selin Koç",
      avatar: "SK",
      message: "Yeni müşteri geri bildirimlerini analiz ettim. Detaylar aşağıda:",
      time: "Dün 16:30",
      channel: "İnovasyon Grubu",
      unread: false,
      attachments: ["musteri_analizi.xlsx"]
    }
  ];

  const teamMembers = [
    { name: "Ahmet Yılmaz", role: "Senior Developer", status: "online", avatar: "AY" },
    { name: "Zeynep Kara", role: "Product Manager", status: "busy", avatar: "ZK" },
    { name: "Mehmet Öz", role: "UX Designer", status: "online", avatar: "MÖ" },
    { name: "Fatma Demir", role: "QA Engineer", status: "away", avatar: "FD" },
    { name: "Can Arslan", role: "DevOps Engineer", status: "offline", avatar: "CA" },
    { name: "Elif Yıldız", role: "Business Analyst", status: "online", avatar: "EY" }
  ];

  const announcements = [
    {
      id: 1,
      title: "Q3 Performans Değerlendirmeleri Başlıyor",
      content: "Tüm ekip üyeleri için performans değerlendirme süreci 1 Temmuz'da başlayacak.",
      author: "İK Departmanı",
      date: "2024-06-13",
      priority: "yüksek",
      readBy: 18,
      totalMembers: 24
    },
    {
      id: 2,
      title: "Yeni Ofis Kuralları",
      content: "Hibrit çalışma modeliyle ilgili güncellenmiş kurallar yürürlükte.",
      author: "Operasyon Müdürü",
      date: "2024-06-11",
      priority: "orta",
      readBy: 22,
      totalMembers: 24
    },
    {
      id: 3,
      title: "Teknoloji Summit 2024",
      content: "Şirket teknoloji zirveti kayıtları açıldı. Son kayıt tarihi: 30 Haziran",
      author: "Eğitim Koordinatörü",
      date: "2024-06-10",
      priority: "düşük",
      readBy: 15,
      totalMembers: 24
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'yüksek':
        return <Badge className="bg-red-100 text-red-800 border-red-200">🔴 Yüksek</Badge>;
      case 'orta':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">🟡 Orta</Badge>;
      case 'düşük':
        return <Badge className="bg-green-100 text-green-800 border-green-200">🟢 Düşük</Badge>;
      default:
        return <Badge>Normal</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-red-50 via-white to-rose-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">Ekip İletişimi</h1>
            <p className="text-gray-600 text-lg">Ekip üyeleriyle iletişim kurun ve işbirliği yapın</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <MessageCircle className="h-8 w-8 mx-auto mb-1 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">127</div>
              <div className="text-gray-500 text-sm">Yeni Mesaj</div>
            </div>
            <div>
              <Users className="h-8 w-8 mx-auto mb-1 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">24</div>
              <div className="text-gray-500 text-sm">Ekip Üyesi</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="channels" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="channels">Kanallar</TabsTrigger>
          <TabsTrigger value="messages">Mesajlar</TabsTrigger>
          <TabsTrigger value="team">Ekip Üyeleri</TabsTrigger>
          <TabsTrigger value="announcements">Duyurular</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">İletişim Kanalları</h2>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Kanal Oluştur
            </Button>
          </div>

          <div className="grid gap-4">
            {channels.map((channel) => (
              <Card key={channel.id} className={`cursor-pointer hover:shadow-md transition-shadow ${channel.pinned ? 'border-l-4 border-l-red-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{channel.name}</h3>
                        {channel.pinned && <Pin className="h-4 w-4 text-red-600" />}
                        {channel.unreadCount > 0 && (
                          <Badge className="bg-red-600 text-white">
                            {channel.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{channel.description}</p>
                      <p className="text-gray-800 text-sm">{channel.lastMessage}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{channel.members}</span>
                      </div>
                      <p className="text-xs text-gray-500">{channel.lastMessageTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Son Mesajlar</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Mesajlarda ara..." className="pl-10 w-64" />
              </div>
              <Button variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                Arşivle
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {recentMessages.map((message) => (
              <Card key={message.id} className={`cursor-pointer hover:shadow-md transition-shadow ${message.unread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-red-100 text-red-700">
                        {message.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{message.sender}</h4>
                        <Badge variant="outline" className="text-xs">
                          {message.channel}
                        </Badge>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{message.message}</p>
                      {message.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {message.attachments.map((attachment, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              📎 {attachment}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback className="bg-red-100 text-red-700">
                    SK
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea 
                    placeholder="Ekibinizle bir mesaj paylaşın..." 
                    className="resize-none"
                    rows={3}
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        📎 Dosya Ekle
                      </Button>
                      <Button variant="outline" size="sm">
                        😊 Emoji
                      </Button>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Send className="h-4 w-4 mr-2" />
                      Gönder
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Ekip Üyeleri</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="bg-red-100 text-red-700">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Ekip Durumu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-sm text-gray-600">Çevrimiçi</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <div className="text-sm text-gray-600">Meşgul</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">1</div>
                  <div className="text-sm text-gray-600">Uzakta</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">1</div>
                  <div className="text-sm text-gray-600">Çevrimdışı</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Departman Duyuruları</h2>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Duyuru
            </Button>
          </div>
          
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <CardDescription>
                        {announcement.author} • {announcement.date}
                      </CardDescription>
                    </div>
                    {getPriorityBadge(announcement.priority)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{announcement.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{width: `${(announcement.readBy / announcement.totalMembers) * 100}%`}}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {announcement.readBy}/{announcement.totalMembers} okundu
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4 mr-2" />
                      Hatırlat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}