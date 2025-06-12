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
  Clock,
  TrendingUp,
  Briefcase,
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
  Star
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
            { name: "Stratejik Genel Bakış", href: "/", icon: LayoutDashboard, show: true, description: "Üst düzey KPI'lar" },
            { name: "Analitik Merkezi", href: "/admin/analytics", icon: BarChart3, show: true, description: "İş zekası raporları" },
          ]
        },
        {
          title: "Kurumsal Yönetim",
          color: "from-emerald-600 to-teal-600",
          items: [
            { name: "Şirket Yapısı", href: "/admin/companies", icon: Building2, show: true, description: "Organizasyon hiyerarşisi" },
            { name: "Kullanıcı Yönetimi", href: "/admin/users", icon: Users, show: true, description: "Erişim ve yetkiler" },
            { name: "Departman Kontrolü", href: "/admin/departments", icon: Target, show: true, description: "Organizasyon birimleri" },
          ]
        },
        {
          title: "Yetenek Operasyonları",
          color: "from-purple-600 to-pink-600",
          items: [
            { name: "Üst Düzey İşe Alım", href: "/admin/job-postings", icon: Briefcase, show: true, description: "C-seviye pozisyonlar" },
            { name: "Bordro Merkezi", href: "/admin/payroll", icon: DollarSign, show: true, description: "Mali yönetim" },
            { name: "İzin Yönetimi", href: "/admin/leaves", icon: Calendar, show: true, description: "İzin politikaları" },
            { name: "Performans Analizi", href: "/admin/performance", icon: TrendingUp, show: true, description: "Başarı takibi" },
            { name: "Öğrenme Merkezi", href: "/admin/trainings", icon: BookOpen, show: true, description: "Gelişim programları" },
          ]
        }
      ];

    case 'hr_manager':
    case 'ik_müdürü':
      return [
        {
          title: "İK Komuta Merkezi",
          color: "from-orange-600 to-red-600",
          items: [
            { name: "İK Panosu", href: "/", icon: LayoutDashboard, show: true, description: "İK operasyonları genel bakış" },
            { name: "İşgücü Analitiği", href: "/admin/analytics", icon: BarChart3, show: true, description: "Personel metrikleri" },
            { name: "Kullanıcı Yönetimi", href: "/admin/users", icon: Users, show: true, description: "Çalışan yönetimi" },
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
    <div className="flex h-screen bg-gradient-to-b from-slate-900 via-gray-900 to-black border-r border-gray-800">
      <div className={cn("flex flex-col transition-all duration-300", isCollapsed ? "w-20" : "w-80")}>
        
        {/* Enterprise Brand Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6">
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
                  <h1 className="text-2xl font-bold text-white">Kurumsal Hub</h1>
                  <p className="text-blue-100 text-sm">Stratejik İK Komuta Merkezi</p>
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
                  <span>SOX Compliant</span>
                </div>
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-3 w-3" />
                  <span>Global Scale</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-200 text-xs font-medium">Live</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-4 space-y-6">
            {navigation.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-3">
                {!isCollapsed && (
                  <div className="flex items-center space-x-2">
                    <div className={cn("w-3 h-3 rounded bg-gradient-to-r", section.color || "from-gray-500 to-gray-600")}></div>
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                )}
                
                <div className="space-y-1">
                  {section.items.filter(item => item.show).map((item, itemIndex) => {
                    const isActive = location === item.href;
                    return (
                      <Link key={itemIndex} href={item.href}>
                        <div className={cn(
                          "group relative flex items-center rounded-xl transition-all duration-200 p-3",
                          isActive 
                            ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/10" 
                            : "hover:bg-gray-800/50 hover:border hover:border-gray-700/50",
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
                                : "bg-gray-700/50 text-gray-300 group-hover:bg-gray-600/50 group-hover:text-white"
                            )}>
                              <item.icon className="h-4 w-4" />
                            </div>
                            
                            {!isCollapsed && (
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className={cn(
                                    "font-medium text-sm",
                                    isActive ? "text-white" : "text-gray-300 group-hover:text-white"
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
                                  <p className="text-xs text-gray-500 group-hover:text-gray-400 mt-0.5 truncate">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-r"></div>
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
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-gray-300 hover:text-white hover:bg-gray-800 justify-start"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => logout.mutate()}
                className="text-gray-300 hover:text-red-400 hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* System Status */}
        {!isCollapsed && (
          <div className="p-4 bg-gray-900/30 border-t border-gray-800">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-gray-400">
                <Activity className="h-3 w-3" />
                <span>System Status</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Operational</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Uptime: 99.9%</span>
              <span>v2.4.1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}