import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserPermissions, roleLabels, type UserRole } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

import { 
  Building2, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Users,
  BarChart3,
  Calendar,
  CreditCard,
  FileText,
  Bell,
  HelpCircle,
  UserCircle,
  Shield,
  Target,
  Briefcase,
  Clock,
  TrendingUp,
  Award,
  BookOpen,
  User,
  MessageSquare,
  DollarSign,
  PieChart,
  Zap,
  CheckCircle,
  Globe,
  Database,
  Layers,
  Activity,
  Cpu,
  Star,
  FolderOpen
} from "lucide-react";
import { useState } from "react";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  show: boolean;
  badge?: string;
  description?: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
  color?: string;
}

const getRoleBasedNavigation = (userRole: UserRole): NavigationSection[] => {
  switch (userRole?.toLowerCase()) {
    case 'admin':
    case 'owner':
      return [
        {
          title: "Yönetici Panosu",
          color: "from-blue-600 to-indigo-600",
          items: [
            { name: "Stratejik Genel Bakış", href: "/", icon: LayoutDashboard, show: true, description: "Üst düzey KPI'lar ve dashboard" },
            { name: "Analitik Merkezi", href: "/admin/analytics", icon: BarChart3, show: true, description: "İş zekası raporları ve analiz" },
            { name: "Sistem İzleme", href: "/admin/monitoring", icon: Activity, show: true, description: "Sistem performansı ve sağlık" },
          ]
        },
        {
          title: "Kurumsal Yönetim",
          color: "from-emerald-600 to-teal-600",
          items: [
            { name: "Şirket Yönetimi", href: "/companies", icon: Building2, show: true, description: "Şirket yapısı ve organizasyon" },
            { name: "Kullanıcı Yönetimi", href: "/admin/users", icon: Users, show: true, description: "Kullanıcı erişim ve yetkileri" },
            { name: "Departman Kontrolü", href: "/departments", icon: Target, show: true, description: "Departman organizasyonu" },
            { name: "Güvenlik & Denetim", href: "/admin/security", icon: Shield, show: true, description: "Güvenlik politikaları ve denetim" },
            { name: "Sistem Ayarları", href: "/admin/settings", icon: Settings, show: true, description: "Global sistem konfigürasyonu" },
          ]
        },
        {
          title: "İnsan Kaynakları Operasyonları",
          color: "from-purple-600 to-violet-600",
          items: [
            { name: "Çalışan Yönetimi", href: "/employees", icon: Users, show: true, description: "Tüm çalışan kayıtları" },
            { name: "İşe Alım Süreçleri", href: "/jobs", icon: Briefcase, show: true, description: "İş ilanları ve başvuru süreçleri" },
            { name: "Bordro & Maaş", href: "/payroll", icon: DollarSign, show: true, description: "Bordro ve maaş yönetimi" },
            { name: "İzin Yönetimi", href: "/leaves", icon: Calendar, show: true, description: "İzin talep ve onay süreçleri" },
            { name: "Performans Yönetimi", href: "/performance", icon: TrendingUp, show: true, description: "Performans değerlendirme sistemi" },
            { name: "Eğitim Programları", href: "/training", icon: BookOpen, show: true, description: "Eğitim ve gelişim programları" },
          ]
        },
        {
          title: "Raporlama & İletişim",
          color: "from-orange-600 to-red-600",
          items: [
            { name: "Kurumsal Raporlar", href: "/reports", icon: FileText, show: true, description: "Detaylı kurumsal raporlar" },
            { name: "Duyuru Yönetimi", href: "/announcements", icon: Bell, show: true, description: "Kurumsal duyuru yönetimi" },
            { name: "Bildirim Merkezi", href: "/notifications", icon: Bell, show: true, badge: "3", description: "Sistem bildirimleri" },
            { name: "Aktivite Günlüğü", href: "/activities", icon: Clock, show: true, description: "Sistem aktivite takibi" },
          ]
        }
      ];

    case 'hr_manager':
    case 'ik_müdürü':
      return [
        {
          title: "İK Komuta Merkezi",
          color: "from-teal-600 to-emerald-600",
          items: [
            { name: "İK Dashboard", href: "/", icon: LayoutDashboard, show: true, description: "İK operasyonları ana kontrol paneli" },
            { name: "İşgücü Analitiği", href: "/admin/analytics", icon: BarChart3, show: true, description: "Personel metrikleri ve analizler" },
            { name: "İK Stratejisi", href: "/hr/strategy", icon: Target, show: true, description: "İK stratejik planlama" },
          ]
        },
        {
          title: "Personel Yönetimi",
          color: "from-blue-600 to-indigo-600",
          items: [
            { name: "Çalışan Kayıtları", href: "/employees", icon: Users, show: true, description: "Tüm personel bilgileri ve işlemleri" },
            { name: "Departman Yönetimi", href: "/departments", icon: Building2, show: true, description: "Organizasyon yapısı yönetimi" },
            { name: "İzin & Devamsızlık", href: "/leaves", icon: Calendar, show: true, description: "İzin talep ve onay süreçleri" },
            { name: "Bordro & Maaş", href: "/payroll", icon: DollarSign, show: true, description: "Maaş ve bordro yönetimi" },
            { name: "Performans Sistemi", href: "/performance", icon: TrendingUp, show: true, description: "Performans değerlendirme sistemi" },
          ]
        },
        {
          title: "İşe Alım & Gelişim",
          color: "from-emerald-600 to-teal-600",
          items: [
            { name: "İş İlanları", href: "/jobs", icon: Briefcase, show: true, description: "İş ilanı yönetimi ve yayınlama" },
            { name: "Başvuru Değerlendirme", href: "/applications", icon: FileText, show: true, description: "Başvuru süreçleri ve değerlendirme" },
            { name: "Mülakat Planları", href: "/interviews", icon: Clock, show: true, description: "Mülakat programı ve takip" },
            { name: "Eğitim Programları", href: "/training", icon: BookOpen, show: true, description: "Personel gelişim ve eğitim" },
            { name: "Yetenek Havuzu", href: "/talent-pool", icon: Star, show: true, description: "Yetenek havuzu yönetimi" },
          ]
        },
        {
          title: "Raporlama & İletişim",
          color: "from-purple-600 to-violet-600",
          items: [
            { name: "İK Raporları", href: "/reports", icon: FileText, show: true, description: "Detaylı İK analizleri ve raporlar" },
            { name: "Duyuru Yönetimi", href: "/announcements", icon: Bell, show: true, description: "Kurumsal duyuru yönetimi" },
            { name: "Bildirim Merkezi", href: "/notifications", icon: Bell, show: true, badge: "5", description: "İK bildirimleri ve uyarılar" },
            { name: "Aktivite Takibi", href: "/activities", icon: Activity, show: true, description: "İK işlemleri aktivite günlüğü" },
          ]
        }
      ];

    case 'hr_specialist':
    case 'ik_uzmanı':
      return [
        {
          title: "İK Operasyon Merkezi",
          color: "from-orange-600 to-red-600",
          items: [
            { name: "İK Dashboard", href: "/", icon: LayoutDashboard, show: true, description: "İK uzmanı kontrol paneli" },
            { name: "Personel Analitiği", href: "/admin/analytics", icon: BarChart3, show: true, description: "Detaylı personel analizleri" },
            { name: "İK Süreçleri", href: "/hr/processes", icon: Zap, show: true, description: "İK süreç yönetimi" },
          ]
        },
        {
          title: "Personel İşlemleri",
          color: "from-blue-600 to-indigo-600",
          items: [
            { name: "Çalışan Kayıtları", href: "/employees", icon: Users, show: true, description: "Personel dosyaları ve bilgiler" },
            { name: "İzin Koordinasyonu", href: "/leaves", icon: Calendar, show: true, description: "İzin takip ve koordinasyon" },
            { name: "Bordro Destek", href: "/payroll", icon: DollarSign, show: true, description: "Bordro işlemleri desteği" },
            { name: "Performans Takibi", href: "/performance", icon: TrendingUp, show: true, description: "Performans değerlendirme süreçleri" },
            { name: "Özlük İşleri", href: "/personnel-affairs", icon: FileText, show: true, description: "Özlük işlemleri yönetimi" },
          ]
        },
        {
          title: "İşe Alım Desteği",
          color: "from-emerald-600 to-teal-600",
          items: [
            { name: "Başvuru İnceleme", href: "/applications", icon: Briefcase, show: true, description: "İş başvuru değerlendirmeleri" },
            { name: "Referans Kontrolleri", href: "/reference-checks", icon: CheckCircle, show: true, description: "Aday referans kontrolü" },
            { name: "Oryantasyon Süreci", href: "/onboarding", icon: User, show: true, description: "Yeni çalışan oryantasyonu" },
            { name: "Eğitim Koordinasyonu", href: "/training", icon: BookOpen, show: true, description: "Eğitim program koordinasyonu" },
          ]
        },
        {
          title: "Dokümantasyon & İletişim",
          color: "from-purple-600 to-violet-600",
          items: [
            { name: "İK Dokümantasyonu", href: "/hr-documentation", icon: Database, show: true, description: "İK doküman yönetimi" },
            { name: "İç İletişim", href: "/internal-communication", icon: MessageSquare, show: true, description: "İç iletişim koordinasyonu" },
            { name: "Bildirim Takibi", href: "/notifications", icon: Bell, show: true, badge: "2", description: "İK uzmanı bildirimleri" },
            { name: "Günlük Aktiviteler", href: "/activities", icon: Clock, show: true, description: "Günlük iş takibi" },
          ]
        }
      ];

    case 'department_manager':
    case 'departman_müdürü':
      return [
        {
          title: "Departman Yönetim Merkezi",
          color: "from-red-600 to-rose-600",
          items: [
            { name: "Departman Dashboard", href: "/", icon: LayoutDashboard, show: true, description: "Departman kontrol paneli ve yönetim" },
            { name: "Departman Analitiği", href: "/admin/analytics", icon: BarChart3, show: true, description: "Departman performans ve veri analizi" },
            { name: "Stratejik Planlama", href: "/department/planning", icon: Target, show: true, description: "Departman stratejik hedef yönetimi" },
          ]
        },
        {
          title: "Ekip & İnsan Kaynakları",
          color: "from-blue-600 to-indigo-600",
          items: [
            { name: "Ekip Yönetimi", href: "/employees", icon: Users, show: true, description: "Departman personeli yönetimi" },
            { name: "İzin & Onay Süreçleri", href: "/leaves", icon: Calendar, show: true, description: "Ekip izin taleplerini değerlendir" },
            { name: "Performans Yönetimi", href: "/performance", icon: TrendingUp, show: true, description: "Ekip performans değerlendirmeleri" },
            { name: "Bordro Onayları", href: "/payroll", icon: DollarSign, show: true, description: "Departman bordro onay süreçleri" },
            { name: "Ekip Gelişimi", href: "/training", icon: BookOpen, show: true, description: "Personel gelişim ve eğitim planları" },
          ]
        },
        {
          title: "Operasyonel Yönetim",
          color: "from-emerald-600 to-teal-600",
          items: [
            { name: "Proje Koordinasyonu", href: "/projects", icon: FolderOpen, show: true, description: "Departman proje yönetimi" },
            { name: "Kaynak Planlaması", href: "/resources", icon: Cpu, show: true, description: "Departman kaynak dağıtımı" },
            { name: "Süreç Optimizasyonu", href: "/process-optimization", icon: Zap, show: true, description: "İş süreçleri iyileştirme" },
            { name: "Kalite Kontrolü", href: "/quality-control", icon: CheckCircle, show: true, description: "Departman kalite standartları" },
          ]
        },
        {
          title: "İletişim & Raporlama",
          color: "from-purple-600 to-violet-600",
          items: [
            { name: "Departman Raporları", href: "/reports", icon: FileText, show: true, description: "Departman detaylı raporları" },
            { name: "Üst Yönetime Raporlama", href: "/executive-reports", icon: PieChart, show: true, description: "Üst düzey yönetim raporları" },
            { name: "Ekip İletişimi", href: "/team-communication", icon: MessageSquare, show: true, description: "Departman içi iletişim" },
            { name: "Bildirim Merkezi", href: "/notifications", icon: Bell, show: true, badge: "4", description: "Departman bildirimleri" },
            { name: "Toplantı Yönetimi", href: "/meetings", icon: Clock, show: true, description: "Departman toplantı planları" },
          ]
        }
      ];

    case 'employee':
    case 'çalışan':
      return [
        {
          title: "Çalışan Portalı",
          color: "from-yellow-600 to-amber-600",
          items: [
            { name: "Ana Dashboard", href: "/", icon: LayoutDashboard, show: true, description: "Kişisel kontrol paneli ve günlük aktiviteler" },
            { name: "Kişisel Profil", href: "/profile", icon: User, show: true, description: "Kişisel bilgilerim ve profil ayarları" },
            { name: "İzin Yönetimi", href: "/my-leaves", icon: Calendar, show: true, description: "İzin taleplerimi oluştur ve takip et" },
            { name: "Mesai & Zaman", href: "/timesheet", icon: Clock, show: true, description: "Çalışma saatlerimi kaydet ve görüntüle" },
            { name: "Harcama Raporu", href: "/expenses", icon: CreditCard, show: true, description: "İş harcamalarımı kaydet ve talep et" },
            { name: "Performans Takibi", href: "/my-performance", icon: TrendingUp, show: true, description: "Performans değerlendirmelerim ve hedeflerim" },
            { name: "Eğitim Programlarım", href: "/my-training", icon: BookOpen, show: true, description: "Katıldığım ve katılacağım eğitimler" },
            { name: "Bordro & Maaş", href: "/my-payroll", icon: DollarSign, show: true, description: "Maaş bilgilerim ve bordro geçmişi" },
            { name: "İç Mesajlaşma", href: "/messages", icon: MessageSquare, show: true, badge: "3", description: "Departman ve İK ile iletişim" },
            { name: "Şirket Duyuruları", href: "/announcements", icon: Bell, show: true, description: "Kurumsal duyuru ve haberler" },
            { name: "Dokümanlarım", href: "/my-documents", icon: FileText, show: true, description: "Kişisel iş dokümanları" },
            { name: "Takım Çalışması", href: "/team-collaboration", icon: Users, show: true, description: "Departman ekip işbirliği" },
            { name: "Kariyer Gelişimi", href: "/career-development", icon: Star, show: true, description: "Kariyer planları ve fırsatlar" },
            { name: "Yardım & Destek", href: "/help", icon: HelpCircle, show: true, description: "SSS ve teknik destek" },
            { name: "Hesap Ayarları", href: "/settings", icon: Settings, show: true, description: "Profil ve bildirim ayarları" },
          ]
        }
      ];

    default:
      return [
        {
          title: "Çalışan Portalı",
          color: "from-gray-600 to-gray-700",
          items: [
            { name: "Panom", href: "/", icon: LayoutDashboard, show: true, description: "Kişisel genel bakış" },
          ]
        }
      ];
  }
};

export default function EnterpriseSidebar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const logout = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      toast({
        title: "Session Terminated",
        description: "Secure logout completed successfully.",
      });
      window.location.href = "/login";
    },
    onError: () => {
      toast({
        title: "Logout Error",
        description: "Please try again or contact IT support.",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return null;
  }

  const userData = user as any;
  const userRole = userData.role as UserRole;
  const navigation = getRoleBasedNavigation(userRole);
  const userInitials = `${userData.firstName?.[0] || ''}${userData.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 border-r border-gray-200 shadow-xl">
      <div className={cn("flex flex-col transition-all duration-300", isCollapsed ? "w-20" : "w-80")}>
        
        {/* Enterprise Brand Header */}
        <div className={cn(
          "p-6 shadow-lg",
          userRole === 'hr_manager' 
            ? "bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700" 
            : userRole === 'department_manager'
            ? "bg-gradient-to-r from-red-600 via-red-700 to-rose-700"
            : userRole === 'employee' || userRole === 'çalışan'
            ? "bg-gradient-to-r from-yellow-600 via-yellow-700 to-amber-700"
            : "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700"
        )}>
          <div className="flex items-center justify-between">
            <div className={cn("flex items-center space-x-3", isCollapsed && "justify-center")}>
              <div className="relative">
                <div className="p-2 bg-white/20 backdrop-blur rounded-xl">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-2xl font-bold text-white">Enterprise İK Hub</h1>
                  <p className="text-blue-100 text-sm">Kurumsal İnsan Kaynakları Yönetim Sistemi</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>
          
          {!isCollapsed && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-white/90 text-xs">
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>SOX Uyumlu</span>
                </div>
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-3 w-3" />
                  <span>Küresel Standart</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-200 text-xs font-medium">Canlı</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-6 space-y-6">
            {navigation.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-3">
                {!isCollapsed && (
                  <div className="flex items-center space-x-2">
                    <div className={cn("w-3 h-3 rounded bg-gradient-to-r", section.color || "from-gray-400 to-gray-500")}></div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                )}
                
                <div className="space-y-2">
                  {section.items.filter(item => item.show).map((item, itemIndex) => {
                    const isActive = location === item.href;
                    return (
                      <Link key={itemIndex} href={item.href}>
                        <div className={cn(
                          "group relative flex items-center rounded-xl transition-all duration-200 p-3 border",
                          isActive 
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg shadow-blue-100/50" 
                            : "hover:bg-gray-50 border-transparent hover:border-gray-200 hover:shadow-md",
                          isCollapsed && "justify-center"
                        )}>
                          <div className={cn(
                            "flex items-center space-x-3 w-full",
                            isCollapsed && "justify-center"
                          )}>
                            <div className={cn(
                              "p-2 rounded-lg transition-colors",
                              isActive 
                                ? "bg-blue-500 text-white shadow-lg" 
                                : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                            )}>
                              <item.icon className="h-4 w-4" />
                            </div>
                            
                            {!isCollapsed && (
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className={cn(
                                    "font-medium text-sm",
                                    isActive ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                                  )}>
                                    {item.name}
                                  </span>
                                  {item.badge && (
                                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-xs text-gray-500 group-hover:text-gray-600 mt-0.5 truncate">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r"></div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise User Profile */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className={cn("flex items-center space-x-3", isCollapsed && "justify-center")}>
            <Avatar className="ring-2 ring-blue-500/30">
              <AvatarImage src={userData.profileImageUrl} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {userData.firstName} {userData.lastName}
                  </p>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-xs text-gray-600 truncate">
                  {roleLabels[userRole] || userRole} • {userData.email}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-gray-600 font-medium">Premium Access</span>
                </div>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="mt-3 flex items-center space-x-2">
              <Link href="/notifications" className="flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/settings" className="flex-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Ayarlar
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => logout.mutate()}
                className="text-gray-700 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* System Status */}
        {!isCollapsed && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-gray-600">
                <Activity className="h-3 w-3" />
                <span>Sistem Durumu</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-600 font-medium">Operasyonel</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Çalışma Süresi: %99.9</span>
              <span>v2.4.1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}