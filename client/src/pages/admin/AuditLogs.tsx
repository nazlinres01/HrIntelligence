import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  Filter, 
  Search, 
  Shield, 
  User, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterResource, setFilterResource] = useState("");

  const { data: auditLogs = [], isLoading } = useQuery({
    queryKey: ["/api/audit-logs"],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  const filteredLogs = auditLogs.filter((log: any) => {
    const matchesSearch = !searchTerm || 
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = !filterAction || log.action === filterAction;
    const matchesResource = !filterResource || log.resource === filterResource;
    
    return matchesSearch && matchesAction && matchesResource;
  });

  const getActionIcon = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'CREATE':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'UPDATE':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'DELETE':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'LOGIN':
        return <User className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    const actionConfig = {
      CREATE: { label: "Oluştur", variant: "default" },
      UPDATE: { label: "Güncelle", variant: "secondary" },
      DELETE: { label: "Sil", variant: "destructive" },
      LOGIN: { label: "Giriş", variant: "outline" },
      LOGOUT: { label: "Çıkış", variant: "outline" },
      VIEW: { label: "Görüntüle", variant: "secondary" }
    };
    
    const config = actionConfig[action?.toUpperCase() as keyof typeof actionConfig] || { label: action, variant: "secondary" };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getResourceBadge = (resource: string) => {
    const resourceConfig = {
      user: { label: "Kullanıcı", variant: "default" },
      employee: { label: "Çalışan", variant: "secondary" },
      company: { label: "Şirket", variant: "outline" },
      department: { label: "Departman", variant: "secondary" },
      performance: { label: "Performans", variant: "default" },
      payroll: { label: "Bordro", variant: "outline" },
      leave: { label: "İzin", variant: "secondary" }
    };
    
    const config = resourceConfig[resource?.toLowerCase() as keyof typeof resourceConfig] || { label: resource, variant: "secondary" };
    return <Badge variant={config.variant as any} className="text-xs">{config.label}</Badge>;
  };

  const getUserName = (userId: string) => {
    const user = users.find((u: any) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : "Bilinmeyen Kullanıcı";
  };

  const getUserInitials = (userId: string) => {
    const user = users.find((u: any) => u.id === userId);
    return user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : "?";
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('tr-TR'),
      time: date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const uniqueActions = [...new Set(auditLogs.map((log: any) => log.action))];
  const uniqueResources = [...new Set(auditLogs.map((log: any) => log.resource))];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Denetim Kayıtları</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Sistem aktivitelerini izleyin ve denetleyin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Güvenlik Denetimi Aktif</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtreler
          </CardTitle>
          <CardDescription>Denetim kayıtlarını filtreleyerek istediğiniz bilgilere ulaşın</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="search">Arama</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Arama yapın..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="action">İşlem Tipi</Label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Tüm işlemler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tüm işlemler</SelectItem>
                  {uniqueActions.map((action: string) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="resource">Kaynak Tipi</Label>
              <Select value={filterResource} onValueChange={setFilterResource}>
                <SelectTrigger>
                  <SelectValue placeholder="Tüm kaynaklar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tüm kaynaklar</SelectItem>
                  {uniqueResources.map((resource: string) => (
                    <SelectItem key={resource} value={resource}>
                      {resource}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterAction("");
                  setFilterResource("");
                }}
                className="w-full"
              >
                Filtreleri Temizle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Kayıt</p>
                <p className="text-2xl font-bold">{auditLogs.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bugün</p>
                <p className="text-2xl font-bold">
                  {auditLogs.filter((log: any) => {
                    const logDate = new Date(log.timestamp);
                    const today = new Date();
                    return logDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kritik İşlemler</p>
                <p className="text-2xl font-bold">
                  {auditLogs.filter((log: any) => log.action === 'DELETE').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold">
                  {new Set(auditLogs.map((log: any) => log.userId)).size}
                </p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Denetim Kayıtları</CardTitle>
          <CardDescription>
            {filteredLogs.length} kayıt gösteriliyor
            {searchTerm || filterAction || filterResource ? ` (${auditLogs.length} toplam kayıttan filtrelendi)` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>İşlem</TableHead>
                <TableHead>Kaynak</TableHead>
                <TableHead>Detaylar</TableHead>
                <TableHead>IP Adresi</TableHead>
                <TableHead>Zaman</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log: any) => {
                const timestamp = formatTimestamp(log.timestamp);
                return (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getUserInitials(log.userId)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{getUserName(log.userId)}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{log.userId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getActionIcon(log.action)}
                        {getActionBadge(log.action)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getResourceBadge(log.resource)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="text-sm font-medium truncate">{log.details}</div>
                        {log.resourceId && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">ID: {log.resourceId}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono">{log.ipAddress || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{timestamp.date}</div>
                        <div className="text-gray-500 dark:text-gray-400">{timestamp.time}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              {searchTerm || filterAction || filterResource ? (
                <>
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Sonuç bulunamadı</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Arama kriterlerinizi değiştirmeyi deneyin</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setFilterAction("");
                      setFilterResource("");
                    }}
                  >
                    Filtreleri Temizle
                  </Button>
                </>
              ) : (
                <>
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Henüz denetim kaydı yok</h3>
                  <p className="text-gray-600 dark:text-gray-400">Sistem kullanımı başladıkça denetim kayıtları burada görünecek</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}