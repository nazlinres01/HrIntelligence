import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { NotificationBell } from "@/components/notifications/notification-bell";
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
  ChevronRight,
  Bell,
  HelpCircle
} from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    nameKey: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    name: "Çalışanlar",
    nameKey: "Çalışanlar",
    href: "/employees",
    icon: Users,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    name: "Performans",
    nameKey: "Performans",
    href: "/performance",
    icon: BarChart3,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    name: "İzinler",
    nameKey: "İzinler",
    href: "/leaves",
    icon: Calendar,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    name: "Bordro",
    nameKey: "Bordro",
    href: "/payroll",
    icon: CreditCard,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    name: "Raporlar",
    nameKey: "Raporlar",
    href: "/reports",
    icon: FileText,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
  {
    name: "Yardım",
    nameKey: "Yardım",
    href: "/help",
    icon: HelpCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    name: "Ayarlar",
    nameKey: "Ayarlar", 
    href: "/settings",
    icon: Settings,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                İK360
              </h1>
              <p className="text-sm text-gray-500 font-medium">İnsan Kaynakları Sistemi</p>
            </div>
          </div>
          <NotificationBell />
        </div>
      </div>

      {/* User Profile */}
      {user && (
        <div className="p-4 bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-sm">
            <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
              <AvatarImage src={(user as any).profileImageUrl} alt={(user as any).firstName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white font-semibold text-sm">
                {(user as any).firstName?.[0]}{(user as any).lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {(user as any).firstName} {(user as any).lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{(user as any).email}</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-green-600 font-medium">Aktif</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Ana Menü
          </h2>
          {navigationItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <div
                    className={cn(
                      "mr-3 h-6 w-6 flex items-center justify-center rounded-lg transition-colors",
                      isActive
                        ? "bg-white/20"
                        : `${item.bgColor} group-hover:${item.bgColor}`
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-white" : item.color
                      )}
                    />
                  </div>
                  <span className="truncate">{t(item.nameKey)}</span>
                  {isActive && (
                    <div className="ml-auto">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Diğer
          </h2>
          
          <Link href="/settings">
            <div
              className={cn(
                "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer",
                location === "/settings"
                  ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg shadow-gray-500/25"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div
                className={cn(
                  "mr-3 h-6 w-6 flex items-center justify-center rounded-lg transition-colors",
                  location === "/settings"
                    ? "bg-white/20"
                    : "bg-gray-100 group-hover:bg-gray-200"
                )}
              >
                <Settings
                  className={cn(
                    "h-4 w-4 transition-colors",
                    location === "/settings" ? "text-white" : "text-gray-600"
                  )}
                />
              </div>
              <span className="truncate">Ayarlar</span>
            </div>
          </Link>

          <div className="group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer text-gray-700 hover:bg-gray-50 hover:text-gray-900">
            <div className="mr-3 h-6 w-6 flex items-center justify-center rounded-lg transition-colors bg-gray-100 group-hover:bg-gray-200">
              <HelpCircle className="h-4 w-4 text-gray-600" />
            </div>
            <span className="truncate">Yardım</span>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-gray-700 border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors duration-200"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Çıkış Yap
        </Button>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">© 2024 İK360</p>
          <p className="text-xs text-gray-400">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}