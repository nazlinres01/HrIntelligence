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
  DollarSign,
  MessageSquare,
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
            { name: "Stratejik Genel Bakış", href: "/admin/strategic-overview", icon: LayoutDashboard, show: true, description: "Üst düzey KPI'lar" },
            { name: "Analitik Merkezi", href: "/admin/analytics-center", icon: BarChart3, show: true, description: "İş zekası raporları" },
          ]
        },
        {
          title: "Kurumsal Yönetim",
          color: "from-emerald-600 to-teal-600",
          items: [
            { name: "Şirket Yapısı", href: "/admin/company-structure", icon: Building2, show: true, description: "Organizasyon hiyerarşisi" },
            { name: "Kullanıcı Yönetimi", href: "/admin/users", icon: Users, show: true, description: "Erişim ve yetkiler" },
            { name: "Departman Kontrolü", href: "/admin/department-control", icon: Target, show: true, description: "Organizasyon birimleri" },
          ]
        },
        {
          title: "İnsan Kaynakları Operasyonları",
          color: "from-gray-600 to-gray-700",
          items: [
            { name: "Yetenek Kazanımı", href: "/admin/talent-acquisition", icon: Briefcase, show: true, description: "Stratejik işe alım süreçleri" },
            { name: "Ücret & Haklar", href: "/admin/payroll-new", icon: DollarSign, show: true, description: "Bordro ve maaş yönetimi" },
            { name: "İzin & Devamsızlık", href: "/leaves", icon: Calendar, show: true, description: "İzin talep ve onay süreçleri" },
            { name: "Performans Değerlendirme", href: "/performance", icon: TrendingUp, show: true, description: "KPI takip ve analiz" },
            { name: "Eğitim & Gelişim", href: "/training", icon: BookOpen, show: true, description: "Personel gelişim programları" },
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
            { name: "İK Panosu", href: "/", icon: LayoutDashboard, show: true, description: "İK operasyonları genel bakış" },
            { name: "İşgücü Analitiği", href: "/admin/analytics", icon: BarChart3, show: true, description: "Personel metrikleri" },
          ]
        },
        {
          title: "Çalışan İşlemleri",
          color: "from-blue-600 to-indigo-600",
          items: [
            { name: "Çalışan Yönetimi", href: "/employees", icon: Users, show: true, description: "Personel bilgileri ve işlemleri" },
            { name: "İzin Yönetimi", href: "/leaves", icon: Calendar, show: true, description: "İzin talep ve onay süreçleri" },
            { name: "Performans Değerlendirme", href: "/performance", icon: TrendingUp, show: true, description: "Performans takip ve raporları" },
            { name: "Bordro Yönetimi", href: "/payroll", icon: CreditCard, show: true, description: "Maaş ve bordro işlemleri" },
            { name: "İş İlanları", href: "/jobs", icon: Briefcase, show: true, description: "İş ilanı yönetimi ve başvuru takibi" },
          ]
        },
        {
          title: "Raporlar & Analiz",
          color: "from-emerald-600 to-teal-600",
          items: [
            { name: "İK Raporları", href: "/reports", icon: FileText, show: true, description: "Detaylı İK analizleri" },
            { name: "Eğitim Programları", href: "/training", icon: BookOpen, show: true, description: "Personel gelişim programları" },
            { name: "Bildirimler", href: "/notifications", icon: Bell, show: true, description: "Sistem bildirimleri" },
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
            { name: "İK Panosu", href: "/", icon: LayoutDashboard, show: true, description: "İK operasyonları genel bakış" },
            { name: "Çalışan Analizi", href: "/admin/analytics", icon: BarChart3, show: true, description: "Personel analizleri" },
          ]
        },
        {
          title: "Personel İşlemleri",
          color: "from-blue-600 to-indigo-600",
          items: [
            { name: "Çalışan Kayıtları", href: "/employees", icon: Users, show: true, description: "Çalışan bilgileri ve kayıt işlemleri" },
            { name: "İzin Takibi", href: "/leaves", icon: Calendar, show: true, description: "İzin durumları ve takip" },
            { name: "Performans Kayıtları", href: "/performance", icon: TrendingUp, show: true, description: "Performans değerlendirmeleri" },
            { name: "Bordro Kayıtları", href: "/payroll", icon: CreditCard, show: true, description: "Maaş ve bordro takibi" },
          ]
        },
        {
          title: "Destek & Raporlama",
          color: "from-emerald-600 to-teal-600",
          items: [
            { name: "İK Raporları", href: "/reports", icon: FileText, show: true, description: "Personel raporları" },
            { name: "Eğitim Kayıtları", href: "/training", icon: BookOpen, show: true, description: "Eğitim programları takibi" },
            { name: "Bildirimler", href: "/notifications", icon: Bell, show: true, description: "Sistem bildirimleri" },
          ]
        }
      ];

    case 'department_manager':
      return [
        {
          title: "Departman Yönetim Merkezi",
          color: "from-red-600 to-rose-600",
          items: [
            { name: "Departman Panosu", href: "/", icon: LayoutDashboard, show: true, description: "Departman genel bakış ve yönetim" },
            { name: "Departman Analizi", href: "/admin/analytics", icon: BarChart3, show: true, description: "Departman performans analizleri" },
          ]
        },
        {
          title: "Ekip Yönetimi",
          color: "from-blue-600 to-indigo-600",
          items: [
            { name: "Ekip Üyeleri", href: "/employees", icon: Users, show: true, description: "Departman çalışanları yönetimi" },
            { name: "İzin Onayları", href: "/leaves", icon: Calendar, show: true, description: "Departman izin taleplerini onayla" },
            { name: "Performans Değerlendirme", href: "/performance", icon: TrendingUp, show: true, description: "Ekip performans değerlendirmeleri" },
            { name: "Hedef Takibi", href: "/targets", icon: Target, show: true, description: "Departman hedeflerini takip et" },
          ]
        },
        {
          title: "Operasyonel İşlemler",
          color: "from-emerald-600 to-teal-600",
          items: [
            { name: "Proje Yönetimi", href: "/projects", icon: FolderOpen, show: true, description: "Departman projelerini yönet" },
            { name: "Toplantı Planları", href: "/meetings", icon: Calendar, show: true, description: "Ekip toplantıları planla" },
            { name: "Departman Raporları", href: "/reports", icon: FileText, show: true, description: "Departman raporları oluştur" },
            { name: "Bildirimler", href: "/notifications", icon: Bell, show: true, description: "Departman bildirimleri" },
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
                  <p className="text-sm font-semibold text-white truncate">
                    {userData.firstName} {userData.lastName}
                  </p>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {roleLabels[userRole] || userRole} • {userData.email}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="h-3 w-3 text-yellow-400" />
                  <span className="text-xs text-gray-400">Premium Access</span>
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