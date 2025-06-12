import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Search, 
  Filter, 
  Download,
  CheckCircle, 
  Clock, 
  AlertCircle,
  Info,
  Users,
  Calendar,
  Eye,
  Trash2,
  Mail,
  CheckCheck
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery<any[]>({
    queryKey: ["/api/notifications"]
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PUT", `/api/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Başarılı",
        description: "Bildirim okundu olarak işaretlendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Bildirim güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PUT", "/api/notifications/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Başarılı",
        description: "Tüm bildirimler okundu olarak işaretlendi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Bildirimler güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Başarılı",
        description: "Bildirim başarıyla silindi",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Bildirim silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu bildirimi silmek istediğinizden emin misiniz?")) {
      deleteNotificationMutation.mutate(id);
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconMap = {
      'info': <Info className="h-5 w-5 text-blue-600" />,
      'warning': <AlertCircle className="h-5 w-5 text-yellow-600" />,
      'success': <CheckCircle className="h-5 w-5 text-green-600" />,
      'error': <AlertCircle className="h-5 w-5 text-red-600" />,
      'reminder': <Clock className="h-5 w-5 text-purple-600" />,
      'announcement': <Bell className="h-5 w-5 text-indigo-600" />
    };
    return iconMap[type as keyof typeof iconMap] || <Bell className="h-5 w-5 text-gray-600" />;
  };

  const getNotificationTypeColor = (type: string) => {
    const colorMap = {
      'info': 'bg-blue-100 text-blue-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'success': 'bg-green-100 text-green-800',
      'error': 'bg-red-100 text-red-800',
      'reminder': 'bg-purple-100 text-purple-800',
      'announcement': 'bg-indigo-100 text-indigo-800'
    };
    return colorMap[type as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const getNotificationTypeDisplayName = (type: string) => {
    const typeMap = {
      'info': 'Bilgi',
      'warning': 'Uyarı',
      'success': 'Başarılı',
      'error': 'Hata',
      'reminder': 'Hatırlatma',
      'announcement': 'Duyuru'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Şimdi';
    if (diffMinutes < 60) return `${diffMinutes} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 30) return `${diffDays} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  const filteredNotifications = (notifications as any[]).filter((notification: any) => {
    const matchesSearch = notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "read" && notification.isRead) ||
                         (statusFilter === "unread" && !notification.isRead);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Analytics calculations
  const getNotificationStats = () => {
    const totalNotifications = (notifications as any[]).length;
    const unreadNotifications = (notifications as any[]).filter((notif: any) => !notif.isRead).length;
    const todayNotifications = (notifications as any[]).filter((notif: any) => {
      const today = new Date().toDateString();
      const notifDate = new Date(notif.createdAt).toDateString();
      return today === notifDate;
    }).length;
    const importantNotifications = (notifications as any[]).filter((notif: any) => 
      ['warning', 'error'].includes(notif.type)
    ).length;

    return {
      totalNotifications,
      unreadNotifications,
      todayNotifications,
      importantNotifications
    };
  };

  const stats = getNotificationStats();

  if (notificationsLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bildirimler</h1>
            <p className="text-gray-600">Sistem bildirimleri ve önemli duyurular</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="border-gray-300 text-gray-700"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Tümünü Okundu İşaretle
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium mb-1">Toplam Bildirim</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalNotifications}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium mb-1">Okunmayan</p>
                  <p className="text-2xl font-bold text-red-900">{stats.unreadNotifications}</p>
                </div>
                <Mail className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium mb-1">Bugünkü</p>
                  <p className="text-2xl font-bold text-green-900">{stats.todayNotifications}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium mb-1">Önemli</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.importantNotifications}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Bildirim ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
          >
            <option value="all">Tüm Türler</option>
            <option value="info">Bilgi</option>
            <option value="warning">Uyarı</option>
            <option value="success">Başarılı</option>
            <option value="error">Hata</option>
            <option value="reminder">Hatırlatma</option>
            <option value="announcement">Duyuru</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="unread">Okunmayan</option>
            <option value="read">Okunan</option>
          </select>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bildirim bulunamadı</h3>
                <p className="text-gray-600">Arama kriterlerinize uygun bildirim bulunmuyor.</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification: any) => (
              <Card 
                key={notification.id} 
                className={`bg-white border-gray-200 hover:shadow-md transition-shadow ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className={`text-lg font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <Badge className={getNotificationTypeColor(notification.type)}>
                              {getNotificationTypeDisplayName(notification.type)}
                            </Badge>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className={`text-sm mb-3 ${
                            !notification.isRead ? 'text-gray-800' : 'text-gray-600'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatDate(notification.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          {!notification.isRead && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(notification.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}