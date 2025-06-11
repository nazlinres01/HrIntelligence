import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getUserPermissions, roleLabels, type UserRole } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";

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
  
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      show: true
    }
  ];

  // Owner - Full permissions
  if (userRole === "owner") {
    navigationItems.push(
      {
        name: "Çalışanlar",
        href: "/employees",
        icon: Users,
        show: true
      },
      {
        name: "Performans",
        href: "/performance", 
        icon: BarChart3,
        show: true
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
        show: true
      },
      {
        name: "Raporlar",
        href: "/reports",
        icon: FileText,
        show: true
      }
    );
  }
  
  // HR Manager - HR operations
  if (userRole === "hr_manager") {
    navigationItems.push(
      {
        name: "Çalışanlar",
        href: "/employees",
        icon: Users,
        show: permissions.canManageEmployees
      },
      {
        name: "Performans",
        href: "/performance",
        icon: BarChart3,
        show: permissions.canViewPerformance
      },
      {
        name: "İzinler",
        href: "/leaves",
        icon: Calendar,
        show: permissions.canManageLeaves
      },
      {
        name: "Bordro",
        href: "/payroll",
        icon: CreditCard,
        show: permissions.canManagePayroll
      },
      {
        name: "Raporlar",
        href: "/reports",
        icon: FileText,
        show: permissions.canViewReports
      }
    );
  }

  // HR Specialist - Limited HR operations
  if (userRole === "hr_specialist") {
    navigationItems.push(
      {
        name: "Çalışanlar",
        href: "/employees",
        icon: Users,
        show: permissions.canViewEmployees
      },
      {
        name: "Performans",
        href: "/performance",
        icon: BarChart3,
        show: permissions.canViewPerformance
      },
      {
        name: "İzinler",
        href: "/leaves",
        icon: Calendar,
        show: permissions.canManageLeaves
      }
    );
  }

  // Department Manager - Department specific
  if (userRole === "department_manager") {
    navigationItems.push(
      {
        name: "Takım",
        href: "/team",
        icon: Users,
        show: permissions.canViewEmployees
      },
      {
        name: "Performans",
        href: "/performance",
        icon: BarChart3,
        show: permissions.canViewPerformance
      },
      {
        name: "İzinler",
        href: "/leaves",
        icon: Calendar,
        show: permissions.canManageLeaves
      }
    );
  }

  // Employee - No additional navigation items

  return navigationItems.filter(item => item.show);
};

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        toast({
          title: "Çıkış yapıldı",
          description: "Güvenle çıkış yapıldı",
        });
        window.location.href = "/";
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast({
        title: "Çıkış hatası",
        description: "Çıkış sırasında bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  const navigation = getRoleBasedNavigation(user.role as UserRole);

  return (
    <div className={cn(
      "flex h-full w-64 flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700",
      className
    )}>
      {/* Corporate Brand Header */}
      <div className="flex h-16 items-center border-b border-slate-200 dark:border-slate-700 px-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-700">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 dark:text-white">HR Sistemi</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">Kurumsal Platform</span>
          </div>
        </div>
      </div>

      {/* Corporate User Profile */}
      <div className="border-b border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
              {roleLabels[user.role as UserRole] || user.role}
            </p>
          </div>
        </div>
      </div>

      {/* Corporate Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = location === item.href || 
            (item.href !== "/dashboard" && location.startsWith(item.href));
          
          return (
            <Link key={item.name} href={item.href}>
              <a className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-l-4 border-slate-900 dark:border-slate-200"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 hover:text-slate-900 dark:hover:text-white"
              )}>
                <item.icon className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive 
                    ? "text-slate-900 dark:text-white" 
                    : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                )} />
                {item.name}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Corporate Secondary Navigation */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-1">
        <Link href="/notifications">
          <a className="group flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 hover:text-slate-900 dark:hover:text-white transition-all duration-200">
            <Bell className="mr-3 h-5 w-5 flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
            Bildirimler
          </a>
        </Link>

        <Link href="/settings">
          <a className="group flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 hover:text-slate-900 dark:hover:text-white transition-all duration-200">
            <Settings className="mr-3 h-5 w-5 flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
            Ayarlar
          </a>
        </Link>

        <Link href="/help">
          <a className="group flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 hover:text-slate-900 dark:hover:text-white transition-all duration-200">
            <HelpCircle className="mr-3 h-5 w-5 flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
            Yardım
          </a>
        </Link>

        <Separator className="my-2 bg-slate-200 dark:bg-slate-700" />

        <Button
          variant="ghost"
          className="w-full justify-start px-3 py-2.5 h-auto text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 hover:text-slate-900 dark:hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          Çıkış Yap
        </Button>
      </div>
    </div>
  );
}