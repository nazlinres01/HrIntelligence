import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getUserPermissions, roleLabels, type UserRole } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";
import type { Permission } from "@shared/schema";

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
  TrendingUp
} from "lucide-react";

const getRoleBasedNavigation = (userRole: UserRole) => {
  const permissions = getUserPermissions(userRole);
  
  return {
    main: [
      {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        show: true
      },
      {
        name: "Çalışanlar",
        href: "/employees",
        icon: Users,
        show: permissions.canViewEmployees || true
      },
      {
        name: "Performans",
        href: "/performance",
        icon: BarChart3,
        show: permissions.canViewPerformance || true
      },
      {
        name: "İzinler",
        href: "/leaves",
        icon: Calendar,
        show: true
      },
      {
        name: "Bordro",
        href: "/payroll",
        icon: CreditCard,
        show: permissions.canViewPayroll || true
      },
      {
        name: "Raporlar",
        href: "/reports",
        icon: FileText,
        show: permissions.canViewReports || true
      }
    ],
    hr: [
      {
        name: "İK Yönetimi",
        href: "/hr-manager",
        icon: Shield,
        show: userRole === 'hr_manager'
      },
      {
        name: "İK Uzmanı",
        href: "/hr-specialist", 
        icon: Target,
        show: userRole === 'hr_specialist'
      },
      {
        name: "Departman Yönetimi",
        href: "/department-manager",
        icon: Building2,
        show: userRole === 'department_manager'
      }
    ],
    admin: [
      {
        name: "Çalışanlar",
        href: "/employees",
        icon: Users,
        show: permissions.canViewEmployees || true
      },
      {
        name: "Performans",
        href: "/performance",
        icon: BarChart3,
        show: permissions.canViewPerformance || true
      },
      {
        name: "Ayarlar",
        href: "/settings",
        icon: Settings,
        show: userRole === 'hr_manager' || userRole === 'owner'
      },
      {
        name: "Denetim Kayıtları",
        href: "/audit",
        icon: Clock,
        show: permissions.canViewAuditLogs || false
      }
    ]
  };
};

export default function Sidebar() {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userData = user as any || {};
  const userRole = (userData?.role as UserRole) || 'employee';
  const permissions = getUserPermissions(userRole);
  const navigation = getRoleBasedNavigation(userRole);

  const handleLogout = () => {
    toast({
      title: "Çıkış yapılıyor...",
      description: "Güvenle çıkış yapılıyor",
    });
    
    setTimeout(() => {
      window.location.href = "/api/logout";
    }, 500);
  };

  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen flex flex-col">
      {/* Company Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white dark:text-slate-900" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              İK Sistemi
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {roleLabels[userRole] || 'Çalışan'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-6">
          {/* Main Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Ana Menü
            </h3>
            <div className="space-y-1">
              {navigation.main.filter(item => item.show).map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start text-slate-700 dark:text-slate-300",
                        isActive && "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      )}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* HR Management */}
          {navigation.hr.some(item => item.show) && (
            <>
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              <div>
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  İK Yönetimi
                </h3>
                <div className="space-y-1">
                  {navigation.hr.filter(item => item.show).map((item) => {
                    const isActive = location === item.href;
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start text-slate-700 dark:text-slate-300",
                            isActive && "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                          )}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.name}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Admin Section */}
          {navigation.admin.some(item => item.show) && (
            <>
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              <div>
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Yönetim
                </h3>
                <div className="space-y-1">
                  {navigation.admin.filter(item => item.show).map((item) => {
                    const isActive = location === item.href;
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start text-slate-700 dark:text-slate-300",
                            isActive && "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                          )}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.name}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData?.avatar || userData?.profileImageUrl} />
            <AvatarFallback className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
              {userData?.firstName?.[0] || 'U'}{userData?.lastName?.[0] || 'S'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {userData?.firstName || 'Kullanıcı'} {userData?.lastName || 'Sistem'}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {roleLabels[userData?.role as UserRole] || roleLabels[userRole]}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Link href="/profile">
            <Button variant="ghost" className="w-full justify-start text-slate-700 dark:text-slate-300">
              <UserCircle className="h-4 w-4 mr-3" />
              Profil
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Çıkış Yap
          </Button>
        </div>
      </div>
    </div>
  );
}