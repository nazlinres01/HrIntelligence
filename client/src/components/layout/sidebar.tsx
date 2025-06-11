import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getUserPermissions, roleLabels, type UserRole } from "@/lib/permissions";

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
  UserCircle
} from "lucide-react";

const getRoleBasedNavigation = (userRole: UserRole) => {
  const permissions = getUserPermissions(userRole);
  
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      show: true
    }
  ];

  // Patron - Tüm yetkiler
  if (userRole === "owner") {
    navigationItems.push(
      {
        name: "Çalışanlar",
        href: "/employees",
        icon: Users,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        show: true
      },
      {
        name: "Performans",
        href: "/performance",
        icon: BarChart3,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        show: true
      },
      {
        name: "İzinler",
        href: "/leaves",
        icon: Calendar,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        show: true
      },
      {
        name: "Bordro",
        href: "/payroll",
        icon: CreditCard,
        color: "text-red-600",
        bgColor: "bg-red-50",
        show: true
      },
      {
        name: "Raporlar",
        href: "/reports",
        icon: FileText,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        show: true
      },
      {
        name: "Takım",
        href: "/team",
        icon: Users,
        color: "text-teal-600",
        bgColor: "bg-teal-50",
        show: true
      }
    );
  }
  
  // İK Müdürü - İK işlemleri, çalışanlar, performans, raporlar
  else if (userRole === "hr_manager") {
    navigationItems.push(
      {
        name: "Çalışanlar",
        href: "/employees",
        icon: Users,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        show: true
      },
      {
        name: "Performans",
        href: "/performance",
        icon: BarChart3,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        show: true
      },
      {
        name: "İzinler",
        href: "/leaves",
        icon: Calendar,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        show: true
      },
      {
        name: "Raporlar",
        href: "/reports",
        icon: FileText,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        show: true
      }
    );
  }
  
  // İK Uzmanı - Sınırlı İK işlemleri, izin talepleri
  else if (userRole === "hr_specialist") {
    navigationItems.push(
      {
        name: "İzinler",
        href: "/leaves",
        icon: Calendar,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        show: true
      },
      {
        name: "Çalışanlar",
        href: "/employees",
        icon: Users,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        show: true
      }
    );
  }
  
  // Departman Müdürü - Departman çalışanları, performans
  else if (userRole === "department_manager") {
    navigationItems.push(
      {
        name: "Performans",
        href: "/performance",
        icon: BarChart3,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        show: true
      },
      {
        name: "İzinler",
        href: "/leaves",
        icon: Calendar,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        show: true
      }
    );
  }
  
  // Çalışan - Sadece kendi profili
  // (Sadece dashboard görür)

  // Her kullanıcı için ortak sayfalar
  navigationItems.push(
    {
      name: "Bildirimler",
      href: "/notifications",
      icon: Bell,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      show: true
    },
    {
      name: "Ayarlar",
      href: "/settings",
      icon: Settings,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      show: true
    },
    {
      name: "Yardım",
      href: "/help",
      icon: HelpCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      show: true
    }
  );

  return navigationItems.filter(item => item.show);
};

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const userRole = (user as any)?.role as UserRole || "employee";
  const navigationItems = getRoleBasedNavigation(userRole);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 bg-white">
        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">İK360</h1>
          <p className="text-xs text-slate-500 font-medium">İnsan Kaynakları Sistemi</p>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-200 bg-white/80">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 ring-2 ring-white shadow-md">
            <AvatarImage src={(user as any)?.profileImageUrl} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
              {(user as any)?.firstName?.[0]}{(user as any)?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {(user as any)?.firstName} {(user as any)?.lastName}
            </p>
            <p className="text-xs text-slate-600 truncate bg-slate-100 px-2 py-0.5 rounded-full mt-1">
              {roleLabels[userRole]}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = location === item.href || 
            (item.href !== "/dashboard" && location.startsWith(item.href));
          
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-11 px-3 rounded-xl transition-all duration-200",
                  isActive
                    ? `${item.bgColor} ${item.color} font-semibold shadow-sm border border-white/50`
                    : "text-slate-600 hover:bg-white/80 hover:text-slate-900 hover:shadow-sm"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-white/80">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 h-11 px-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </Button>
      </div>
    </div>
  );
}