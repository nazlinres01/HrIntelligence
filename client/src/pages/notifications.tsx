import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from "@/hooks/useNotifications";
import { useState } from "react";
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle, 
  Trash2, 
  AlertCircle, 
  Info, 
  CheckIcon,
  ExternalLink,
  MoreVertical
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default function Notifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const handleMarkAsRead = (notificationId: number) => {
    markAsRead.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleDeleteNotification = (notificationId: number) => {
    deleteNotification.mutate(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const filteredNotifications = notifications.filter((notification: any) => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesStatus = 
      filterStatus === "all" || 
      (filterStatus === "read" && notification.isRead) ||
      (filterStatus === "unread" && !notification.isRead);

    return matchesSearch && matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bildirimler
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sistem bildirimleri ve güncellemelerinizi buradan takip edebilirsiniz
          </p>
        </div>

        <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <CardTitle>Bildirim Merkezi</CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} okunmamış
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsRead.isPending}
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Tümünü Okundu İşaretle
                </Button>
              )}
            </div>
            <CardDescription>
              Son bildirimlerinizi görüntüleyin ve yönetin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Bildirimlerde ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tür" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Türler</SelectItem>
                    <SelectItem value="info">Bilgi</SelectItem>
                    <SelectItem value="success">Başarılı</SelectItem>
                    <SelectItem value="warning">Uyarı</SelectItem>
                    <SelectItem value="error">Hata</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Durum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="unread">Okunmamış</SelectItem>
                    <SelectItem value="read">Okunmuş</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {searchQuery || filterType !== "all" || filterStatus !== "all" 
                    ? "Filtreye uygun bildirim bulunamadı" 
                    : "Henüz bildiriminiz yok"
                  }
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {searchQuery || filterType !== "all" || filterStatus !== "all"
                    ? "Farklı filtreler deneyebilir veya arama teriminizi değiştirebilirsiniz."
                    : "Yeni bildirimler geldiğinde burada görünecek."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all duration-200 hover:shadow-md ${
                  !notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/10" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium ${
                              !notification.isRead ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                            }`}>
                              {notification.title}
                            </h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getNotificationBadgeColor(notification.type)}`}
                            >
                              {notification.type === "info" && "Bilgi"}
                              {notification.type === "success" && "Başarılı"}
                              {notification.type === "warning" && "Uyarı"}
                              {notification.type === "error" && "Hata"}
                            </Badge>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              {formatDistanceToNow(new Date(notification.createdAt), { 
                                addSuffix: true, 
                                locale: tr 
                              })}
                            </span>
                            {notification.readAt && (
                              <span>
                                Okundu: {formatDistanceToNow(new Date(notification.readAt), { 
                                  addSuffix: true, 
                                  locale: tr 
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {notification.actionUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.location.href = notification.actionUrl!}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={markAsRead.isPending}
                            >
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                            disabled={deleteNotification.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

        {filteredNotifications.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>
                  {filteredNotifications.length} bildirim gösteriliyor
                  {notifications && filteredNotifications.length !== notifications.length && 
                    ` (toplam ${notifications.length})`
                  }
                </span>
                <span>
                  {unreadCount > 0 ? `${unreadCount} okunmamış` : "Tüm bildirimler okundu"}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </div>
  );
}